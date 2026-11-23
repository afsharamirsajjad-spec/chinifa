// OTP generation, hashing, consumption and rate limiting.
// Codes are never stored in plain text and never returned to the client.
import crypto from "node:crypto";
import { getDb, newId, save } from "./db.js";

const env = process.env;

const CFG = {
  ttl: (Number(env.OTP_TTL_SECONDS) || 180) * 1000,
  cooldown: (Number(env.OTP_RESEND_COOLDOWN) || 60) * 1000,
  maxAttempts: Number(env.OTP_MAX_ATTEMPTS) || 5,
  perTargetHour: Number(env.OTP_REQUESTS_PER_HOUR) || 5,
  perIpHour: Number(env.OTP_REQUESTS_PER_IP_HOUR) || 30,
  verifyFailsPerIpHour: Number(env.OTP_VERIFY_FAILS_PER_IP_HOUR) || 20,
};

export const otpConfig = () => ({ ...CFG, ttlSeconds: CFG.ttl / 1000, cooldownSeconds: CFG.cooldown / 1000 });

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const codeHash = (secret, channel, target, code) => sha256(`${secret}|${channel}|${target}|${code}`);

/** Constant-time hash comparison (defends against response-timing analysis). */
export function hashEquals(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** 6-digit code with no leading-zero bias (uniform 000000..999999). */
export const generateCode = () => String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");

function hitLimit(bucket, key, max, windowMs) {
  const db = getDb();
  const now = Date.now();
  const b = db.meta.limits[bucket];
  const arr = (b[key] ?? []).filter((t) => t > now - windowMs);
  if (arr.length >= max) return { limited: true, retryAfter: Math.ceil((arr[0] + windowMs - now) / 1000) };
  arr.push(now);
  b[key] = arr;
  save();
  return { limited: false };
}

/**
 * Create an OTP for a target. Returns:
 *  { ok, code, cooldown }                          — code is ONLY for the dev-mode stdout log
 *  { ok: false, reason: "rate_limited", retryAfter }
 */
export function issueOtp({ channel, target, ip }) {
  const db = getDb();
  const t = hitLimit("target", `${channel}:${target}`, CFG.perTargetHour, 3600_000);
  if (t.limited) return { ok: false, reason: "rate_limited", retryAfter: t.retryAfter };
  const i = hitLimit("ip", ip, CFG.perIpHour, 3600_000);
  if (i.limited) return { ok: false, reason: "rate_limited", retryAfter: i.retryAfter };

  // Resend cooldown: reuse the newest unconsumed, unexpired OTP's creation time.
  const now = Date.now();
  const recent = db.otps
    .filter((o) => o.target === target && o.channel === channel && !o.consumedAt && o.expiresAt > now)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  if (recent && now - recent.createdAt < CFG.cooldown) {
    return { ok: false, reason: "rate_limited", retryAfter: Math.ceil((recent.createdAt + CFG.cooldown - now) / 1000) };
  }

  const code = generateCode();
  const id = newId("otp");
  db.otps.push({
    id,
    channel,
    target,
    codeHash: codeHash(db.secret, channel, target, code),
    createdAt: now,
    expiresAt: now + CFG.ttl,
    attempts: 0,
    consumedAt: null,
    ip,
  });
  // Keep the store small: drop consumed/expired entries (the new one just qualifies).
  db.otps = db.otps.filter((o) => o.expiresAt > now && !o.consumedAt);
  save();
  return { ok: true, code, id, cooldown: CFG.cooldown / 1000 };
}

/**
 * Verify a code. Single-use: consumed on success.
 *  { ok: true }
 *  { ok: false, reason: "no_code" | "expired" | "invalid" | "locked", retryAfter? }
 */
export function checkOtp({ channel, target, code }) {
  const db = getDb();
  const now = Date.now();
  const otp = db.otps
    .filter((o) => o.target === target && o.channel === channel && !o.consumedAt)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  if (!otp || otp.expiresAt <= now) {
    if (otp) otp.consumedAt = now;
    save();
    return { ok: false, reason: otp ? "expired" : "no_code" };
  }
  if (otp.attempts >= CFG.maxAttempts) {
    otp.consumedAt = now;
    save();
    return { ok: false, reason: "locked" };
  }
  otp.attempts += 1;
  if (!hashEquals(otp.codeHash, codeHash(db.secret, channel, target, code))) {
    save();
    return { ok: false, reason: otp.attempts >= CFG.maxAttempts ? "locked" : "invalid" };
  }
  otp.consumedAt = now;
  save();
  return { ok: true };
}

/** True when OTP codes may be printed to the server stdout (local development only). */
export const devLogEnabled = () => process.env.NODE_ENV !== "production" || env.DEV_OTP_LOG === "true";

/* ---------- per-IP failed-verify throttle (anti brute-force across OTPs) ---------- */

const FAIL_WINDOW = 3600_000;

export function tooManyVerifyFails(ip) {
  const db = getDb();
  const arr = (db.meta.limits.verifyFail?.[ip] ?? []).filter((t) => t > Date.now() - FAIL_WINDOW);
  return arr.length >= CFG.verifyFailsPerIpHour;
}

export function recordVerifyFail(ip) {
  const db = getDb();
  db.meta.limits.verifyFail ??= {};
  const arr = (db.meta.limits.verifyFail[ip] ?? []).filter((t) => t > Date.now() - FAIL_WINDOW);
  arr.push(Date.now());
  db.meta.limits.verifyFail[ip] = arr;
  save();
}

export function clearVerifyFails(ip) {
  const db = getDb();
  if (db.meta.limits.verifyFail?.[ip]) {
    delete db.meta.limits.verifyFail[ip];
    save();
  }
}
