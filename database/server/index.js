// Auth backend for واژه‌نگار چینی — OTP (Iranian mobile + email), sessions, progress sync.
// Plain node:http, zero npm dependencies. Run: npm run api  (from word-atlas/)
//
// SECURITY MODEL (matches the product spec):
//  - OTPs are generated server-side, stored hashed, single-use, short TTL, attempt-limited.
//  - Rate limits: resend cooldown + per-target hourly cap + per-IP hourly cap.
//  - Sessions are random bearer tokens stored hashed with sliding expiry.
//  - No account enumeration: responses never reveal whether a contact is registered.
//  - OTP codes are NEVER returned in API responses. In development (NODE_ENV != production)
//    they are printed to this server's stdout only, to enable local end-to-end testing.

import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDb, getDb, save, persistSync, pruneExpired, newId } from "./db.js";
import { issueOtp, checkOtp, otpConfig, devLogEnabled, tooManyVerifyFails, recordVerifyFail, clearVerifyFails } from "./otp.js";
import { sendOtpSms, sendOtpEmail, providerStatus } from "./providers.js";

loadDb();
setInterval(pruneExpired, 15 * 60_000).unref?.();

const env = process.env;
const PORT = Number(env.PORT) || 8787;
const SESSION_TTL = (Number(env.SESSION_TTL_DAYS) || 30) * 86400_000;
const DEV_LOG = devLogEnabled();
// Admin key for the news/content admin API (Bearer). Override in server/.env.
const ADMIN_KEY = env.ADMIN_KEY || "chinify-admin";
// Uploaded news images land here and are served under /uploads/<file>.
const UPLOAD_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "data", "uploads");

const BASE_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5188",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5188",
  "http://127.0.0.1:4173",
];
const EXTRA_ORIGINS = (env.EXTRA_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
const ALLOWED = new Set([...BASE_ORIGINS, ...EXTRA_ORIGINS]);

/* ---------- validation / normalization ---------- */

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function toAsciiDigits(s) {
  return String(s)
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

/** Iranian mobiles only: exactly 11 digits starting with 09. No country codes, no flags. */
function normalizePhone(raw) {
  const digits = toAsciiDigits(raw).replace(/\D/g, "");
  // Tolerate ONLY the international spellings +989XXXXXXXXX / 989XXXXXXXXX by folding to 09.
  // A bare 10-digit 9XXXXXXXXX (missing the leading 0) is rejected, not folded.
  const folded = digits.replace(/^(?:0?98)(9\d{9})$/, "0$1");
  return /^09\d{9}$/.test(folded) ? folded : null;
}

function normalizeEmail(raw) {
  const email = String(raw || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null;
}

const normalizeTarget = (channel, raw) => (channel === "phone" ? normalizePhone(raw) : normalizeEmail(raw));

/* ---------- db helpers ---------- */

const db = () => getDb();
const findContact = (type, value) => db().contacts.find((c) => c.type === type && c.value === value);
const findUser = (id) => db().users.find((u) => u.id === id);
const contactsOf = (userId) => db().contacts.filter((c) => c.userId === userId);

function createUserWithContact(type, value) {
  const now = Date.now();
  const user = { id: newId("u"), createdAt: now, name: "", family: "", birth: "", status: "active", primaryContact: value, onboarding: emptyOnboarding(), marketing: { discovery_source: null } };
  db().users.push(user);
  db().contacts.push({ id: newId("c"), userId: user.id, type, value, verifiedAt: now, isPrimary: true });
  save();
  return user;
}

function emptyOnboarding() {
  return {
    onboarding_completed: false,
    onboarded_at: null,
    user_name: "",
    learning_motivation: [],
    self_reported_level: null,
    hsk_level: null,
    placement_test_result: null,
    daily_study_minutes: null,
    learning_pace: null,
    active_days: [],
    reminder_time: null,
    notification_preferences: null,
    personalized_study_plan: null,
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    family: user.family ?? "",
    birth: user.birth ?? "",
    joinedAt: user.createdAt,
    contact: contactsOf(user.id).map((c) => ({ type: c.type, value: c.value, isPrimary: c.isPrimary })),
    onboarding: { ...emptyOnboarding(), ...(user.onboarding ?? {}) },
    marketing: { discovery_source: user.marketing?.discovery_source ?? null },
  };
}

/* ---------- sessions ---------- */

const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

function createSession(userId, ip) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  db().sessions.push({ tokenHash: sha256(`${db().secret}:${token}`), userId, createdAt: now, lastSeenAt: now, expiresAt: now + SESSION_TTL, ip });
  // Cap active sessions per user: keep the 10 newest, drop the rest.
  const mine = db().sessions.filter((s) => s.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  for (const stale of mine.slice(10)) db().sessions = db().sessions.filter((s) => s !== stale);
  save();
  return token;
}

function sessionFromRequest(req) {
  const header = String(req.headers.authorization || "");
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const tokenHash = sha256(`${db().secret}:${m[1]}`);
  const s = db().sessions.find((x) => x.tokenHash === tokenHash);
  if (!s || s.expiresAt <= Date.now()) return null;
  const now = Date.now();
  if (now - s.lastSeenAt > 3600_000) {
    s.lastSeenAt = now;
    s.expiresAt = now + SESSION_TTL; // sliding expiry
    save();
  }
  return s;
}

/** Constant-time comparison for stored hashes. */
function hashesEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/* ---------- http plumbing ---------- */

function cors(req, res) {
  const origin = String(req.headers.origin || "");
  if (ALLOWED.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
  }
  return ALLOWED.has(origin);
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const fa = {
  invalid_phone: "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثلاً 09121234567).",
  invalid_email: "ایمیل واردشده معتبر نیست.",
  invalid_code: "کد ۶ رقمی را کامل وارد کنید.",
  rate_limited: "تلاش‌ها بیش از حد مجاز است — کمی بعد دوباره امتحان کنید.",
  otp_unconfigured: "سرویس پیام‌رسانی هنوز تنظیم نشده است — کلید API را در server/.env قرار دهید (README سرور).",
  otp_send_failed: "ارسال کد موفق نشد — لطفاً چند لحظه بعد دوباره تلاش کنید.",
  otp_expired: "کد منقضی شده است — کد جدید درخواست کنید.",
  otp_invalid: "کد واردشده درست نیست.",
  otp_locked: "تلاش‌های اشتباه بیش از حد بود — کد جدید درخواست کنید.",
  unauthorized: "نشست شما معتبر نیست — دوباره وارد شوید.",
  bad_request: "درخواست نامعتبر است.",
  invalid_birth: "تاریخ تولد را به شمسی و به شکل 1375/03/14 وارد کن.",
  contact_conflict: "این شماره/ایمیل به حساب دیگری متصل است.",
  primary_needed: "برای انتقال تماس، باید مالکیت حساب فعلی هم تأیید شود.",
  link_target_missing: "کد تماس جدید تأیید نشده است.",
  admin_key: "کلید مدیریت سرور درست نیست — در تب اخبارِ پنل مدیریت، کلید را وارد کن (ADMIN_KEY در server/.env).",
  news_title: "عنوان خبر را وارد کن (حداکثر ۱۲۰ نویسه).",
  news_field: "یکی از فیلدهای خبر بیش از حد مجاز است.",
  news_id: "شناسهٔ خبر پیدا نشد.",
  image_format: "تصویر باید با فرمت PNG/JPEG/WEBP/GIF و به‌صورت data-URL ارسال شود.",
  onboarding_field: "یکی از پاسخ‌های onboarding نامعتبر است — دوباره تلاش کن.",
};

const err = (code, extra = {}) => ({ error: code, message_fa: fa[code] || code, ...extra });

function readBody(req, maxBytes = 2_000_000) {
  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve(null);
      }
    });
    req.on("error", reject);
  });
}

const ipOf = (req) => String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";

const send400 = (res, code) => send(res, 400, err(code));

function otpFailure(res, reason) {
  if (reason === "expired" || reason === "no_code") return send(res, 400, err("otp_expired"));
  if (reason === "locked") return send(res, 429, err("otp_locked"));
  return send(res, 400, err("otp_invalid"));
}

/** Issue an OTP for a target and deliver it. Returns true when delivered. */
async function deliverOtp(res, { channel, target, ip }) {
  const issued = issueOtp({ channel, target, ip });
  if (!issued.ok) {
    send(res, 429, err("rate_limited", { retryAfter: issued.retryAfter }));
    return false;
  }
  const ttlMin = Math.round(otpConfig().ttlSeconds / 60);
  const devLog = DEV_LOG;
  const sender =
    channel === "phone"
      ? sendOtpSms(target, issued.code, { devLog })
      : sendOtpEmail(target, issued.code, ttlMin, { devLog });
  try {
    const r = await sender;
    if (r.delivered) {
      if (r.devLog) console.log(`[otp] ${channel} -> ${target} : (delivery via dev stdout)`);
      return true;
    }
    removeOtp(issued.id);
    send(res, 503, err("otp_unconfigured", { channel }));
    return false;
  } catch (e) {
    removeOtp(issued.id);
    console.error("[otp] send failed:", e.message);
    send(res, 502, err("otp_send_failed"));
    return false;
  }
}

function removeOtp(id) {
  const d = db();
  d.otps = d.otps.filter((o) => o.id !== id);
  save();
}

/* ---------- route handlers ---------- */

async function handleRequestOtp(res, body, ip) {
  const { channel, target: rawTarget } = body || {};
  if (channel !== "phone" && channel !== "email") return send400(res, "bad_request");
  const target = normalizeTarget(channel, rawTarget);
  if (!target) return send400(res, channel === "phone" ? "invalid_phone" : "invalid_email");
  const delivered = await deliverOtp(res, { channel, target, ip });
  if (delivered) {
    // Identical response whether or not the contact is registered — no enumeration.
    send(res, 200, { ok: true, channel, target, cooldown: otpConfig().cooldownSeconds });
  }
}

async function handleVerifyOtp(res, body, ip) {
  const { channel, target: rawTarget, code } = body || {};
  if (channel !== "phone" && channel !== "email") return send400(res, "bad_request");
  const target = normalizeTarget(channel, rawTarget);
  if (!target) return send400(res, channel === "phone" ? "invalid_phone" : "invalid_email");
  const clean = toAsciiDigits(String(code || "")).replace(/\D/g, "");
  if (clean.length !== 6) return send400(res, "invalid_code");

  // Anti brute-force: too many failed verifications from this IP → locked out for the window.
  if (tooManyVerifyFails(ip)) return send(res, 429, err("rate_limited", { retryAfter: 3600 }));

  const check = checkOtp({ channel, target, code: clean });
  if (!check.ok) {
    recordVerifyFail(ip);
    return otpFailure(res, check.reason);
  }
  clearVerifyFails(ip);

  // Find-or-create: one verified contact == one account, no duplicates.
  let contact = findContact(channel, target);
  let isNew = false;
  if (!contact) {
    createUserWithContact(channel, target);
    contact = findContact(channel, target);
    isNew = true;
  }
  const user = findUser(contact.userId);
  const token = createSession(user.id, ip);
  send(res, 200, { ok: true, token, isNew, user: publicUser(user) });
}

function handleMe(res, user) {
  const p = db().progress[user.id] ?? null;
  send(res, 200, { ok: true, user: publicUser(user), progress: p?.progress ?? null, settings: p?.settings ?? null, updatedAt: p?.updatedAt ?? 0 });
}

function handleSaveProgress(res, user, body) {
  const { progress, settings, updatedAt } = body || {};
  if (!progress || progress.version !== 2 || typeof settings !== "object" || settings === null || typeof updatedAt !== "number")
    return send400(res, "bad_request");
  db().progress[user.id] = { progress, settings, updatedAt };
  save();
  send(res, 200, { ok: true, updatedAt });
}

/** Profile completion: name, family, Jalali birth date. */
function handleProfile(res, user, body) {
  const { name, family, birth } = body || {};
  if (typeof name !== "string" || name.trim().length < 1 || name.length > 60) return send400(res, "bad_request");
  if (typeof family !== "string" || family.trim().length < 1 || family.length > 60) return send400(res, "bad_request");
  if (typeof birth !== "string" || !/^1[3-4]\d{2}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/.test(birth.trim()))
    return send400(res, "invalid_birth", { message_fa: "تاریخ تولد را به شمسی و به شکل 1375/03/14 وارد کن." });
  user.name = name.trim();
  user.family = family.trim();
  user.birth = birth.trim();
  save();
  send(res, 200, { ok: true, user: publicUser(user) });
}

/* ---------- onboarding profile (structured learning + marketing data) ---------- */

const MOTIVATIONS = ["travel", "cdrama", "music", "gaming", "business", "hsk", "interest"];
const SOURCES = ["instagram", "youtube", "tiktok", "search", "friends", "website", "ads", "other"];
const SELF_LEVELS = ["beginner", "elementary", "intermediate", "advanced"];
const PACES = ["calm", "balanced", "intense"];
const NOTIF_TYPES = ["lesson", "review", "practice", "weekly"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Coerce one onboarding field; returns [ok, value]. Unknown/invalid fields are dropped (partial save). */
function sanitizeOnboardingField(key, v) {
  switch (key) {
    case "user_name":
      return typeof v === "string" && v.trim().length >= 1 && v.length <= 40 ? [true, v.trim()] : [false, null];
    case "learning_motivation":
      return Array.isArray(v) && v.length <= 7 && v.every((x) => MOTIVATIONS.includes(x))
        ? [true, [...new Set(v)]]
        : [false, null];
    case "self_reported_level":
      return [SELF_LEVELS.includes(v), v];
    case "hsk_level":
      return v === null ? [true, null] : [Number.isInteger(v) && v >= 1 && v <= 6, v];
    case "daily_study_minutes":
      return [Number.isInteger(v) && v >= 1 && v <= 240, v];
    case "learning_pace":
      return [PACES.includes(v), v];
    case "active_days":
      return Array.isArray(v) && v.length <= 7 && v.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)
        ? [true, [...new Set(v)].sort()]
        : [false, null];
    case "reminder_time":
      return v === null ? [true, null] : [typeof v === "string" && HHMM.test(v), v];
    case "placement_test_result": {
      if (v === null) return [true, null];
      if (typeof v !== "object" || v === null || Array.isArray(v)) return [false, null];
      const r = v;
      const ok =
        Number.isInteger(r.at) &&
        SELF_LEVELS.includes(r.result) &&
        Number.isInteger(r.answered) &&
        r.answered >= 0 &&
        r.answered <= 30 &&
        Number.isInteger(r.correct) &&
        r.correct >= 0 &&
        r.correct <= r.answered &&
        (r.hsk_estimate === null || (Number.isInteger(r.hsk_estimate) && r.hsk_estimate >= 1 && r.hsk_estimate <= 6)) &&
        (r.questions === undefined || (Array.isArray(r.questions) && r.questions.length <= 30));
      return [ok, { at: r.at, answered: r.answered, correct: r.correct, result: r.result, hsk_estimate: r.hsk_estimate ?? null, questions: (r.questions ?? []).slice(0, 30) }];
    }
    case "notification_preferences": {
      if (v === null) return [true, null];
      if (typeof v !== "object" || v === null || Array.isArray(v)) return [false, null];
      const p = v;
      const types = Array.isArray(p.types) ? p.types.filter((t) => NOTIF_TYPES.includes(t)) : [];
      const times = {};
      if (typeof p.times === "object" && p.times !== null)
        for (const [k, t] of Object.entries(p.times)) if (NOTIF_TYPES.includes(k) && typeof t === "string" && HHMM.test(t)) times[k] = t;
      return [true, { enabled: p.enabled === true, types: [...new Set(types)], times }];
    }
    case "personalized_study_plan": {
      if (v === null) return [true, null];
      if (typeof v !== "object" || v === null || Array.isArray(v)) return [false, null];
      const s = JSON.stringify(v);
      return s.length <= 8192 ? [true, v] : [false, null];
    }
    case "onboarding_completed":
      return [typeof v === "boolean", v];
    default:
      return [false, null];
  }
}

/**
 * Partial onboarding save: the client pushes each step as it is answered, so a
 * user who abandons the flow mid-way can resume where they left off. Learning
 * data lands on `user.onboarding`; the marketing answer (discovery source) is
 * kept separate on `user.marketing`.
 */
function handleOnboarding(res, user, body) {
  const b = body || {};
  if (typeof b !== "object" || b === null || Array.isArray(b)) return send400(res, "bad_request");
  if (!user.onboarding) user.onboarding = emptyOnboarding();
  if (!user.marketing) user.marketing = { discovery_source: null };
  let touched = false;

  if ("discovery_source" in b) {
    const v = b.discovery_source;
    if (v !== null && !SOURCES.includes(v)) return send400(res, "onboarding_field");
    user.marketing.discovery_source = v;
    touched = true;
  }
  for (const [k, v] of Object.entries(b)) {
    if (k === "discovery_source") continue;
    const [ok, clean] = sanitizeOnboardingField(k, v);
    if (!ok) return send400(res, "onboarding_field");
    user.onboarding[k] = clean;
    touched = true;
  }
  if (user.onboarding.onboarding_completed && !user.onboarding.onboarded_at) user.onboarding.onboarded_at = Date.now();
  if (touched) save();
  send(res, 200, { ok: true, user: publicUser(user) });
}

async function handleLinkRequest(res, user, body, ip) {
  const { channel, target: rawTarget } = body || {};
  if (channel !== "phone" && channel !== "email") return send400(res, "bad_request");
  const target = normalizeTarget(channel, rawTarget);
  if (!target) return send400(res, channel === "phone" ? "invalid_phone" : "invalid_email");
  if (contactsOf(user.id).some((c) => c.type === channel && c.value === target))
    return send(res, 200, { ok: true, already: true });
  const delivered = await deliverOtp(res, { channel, target, ip });
  if (delivered) send(res, 200, { ok: true, channel, target });
}

async function handleLinkVerify(res, user, body, ip) {
  const { channel, target: rawTarget, code } = body || {};
  const target = normalizeTarget(channel, rawTarget);
  if (!target || (channel !== "phone" && channel !== "email")) return send400(res, "bad_request");
  const clean = toAsciiDigits(String(code || "")).replace(/\D/g, "");
  if (clean.length !== 6) return send400(res, "invalid_code");
  if (tooManyVerifyFails(ip)) return send(res, 429, err("rate_limited", { retryAfter: 3600 }));
  const check = checkOtp({ channel, target, code: clean });
  if (!check.ok) {
    recordVerifyFail(ip);
    return otpFailure(res, check.reason);
  }

  const existing = findContact(channel, target);
  if (existing && existing.userId === user.id) return send(res, 200, { ok: true, linked: true });
  if (existing)
    return send(res, 409, err("contact_conflict", { owner: "other", needsPrimary: true }));

  // Free contact: attach to the current account right away.
  db().contacts.push({ id: newId("c"), userId: user.id, type: channel, value: target, verifiedAt: Date.now(), isPrimary: false });
  save();
  send(res, 200, { ok: true, linked: true, user: publicUser(user) });
}

/**
 * Secure linking when the verified contact belongs to ANOTHER account.
 * No automatic merging: the caller must also prove ownership of the CURRENT
 * account's primary contact (fresh OTP), then the contact is MOVED (the old
 * account keeps its remaining contacts; nothing is deleted).
 */
async function handleLinkConfirm(res, user, body, ip) {
  const { target = {}, targetCode, primary = {}, primaryCode } = body || {};
  const tChannel = target.channel;
  const tTarget = normalizeTarget(tChannel, target.value);
  if (!tTarget || (tChannel !== "phone" && tChannel !== "email")) return send400(res, "bad_request");

  const existing = findContact(tChannel, tTarget);
  if (!existing) return send400(res, "link_target_missing");
  if (existing.userId === user.id) return send(res, 200, { ok: true, linked: true, user: publicUser(user) });

  const pPrimary = normalizeTarget(primary.channel, primary.value);
  const mine = pPrimary ? contactsOf(user.id).find((c) => c.type === primary.channel && c.value === pPrimary) : null;
  if (!mine || !mine.isPrimary) return send(res, 403, err("primary_needed"));

  const tClean = toAsciiDigits(String(targetCode || "")).replace(/\D/g, "");
  const pClean = toAsciiDigits(String(primaryCode || "")).replace(/\D/g, "");
  if (tooManyVerifyFails(ip)) return send(res, 429, err("rate_limited", { retryAfter: 3600 }));
  const tCheck = checkOtp({ channel: tChannel, target: tTarget, code: tClean });
  if (!tCheck.ok) {
    recordVerifyFail(ip);
    return otpFailure(res, tCheck.reason);
  }
  const pCheck = checkOtp({ channel: primary.channel, target: pPrimary, code: pClean });
  if (!pCheck.ok) {
    recordVerifyFail(ip);
    return otpFailure(res, pCheck.reason);
  }

  existing.userId = user.id;
  existing.isPrimary = false;
  existing.verifiedAt = Date.now();
  save();
  send(res, 200, { ok: true, linked: true, user: publicUser(user) });
}

/* ---------- news / announcements (admin key) ---------- */

/** Constant-time bearer-key check for admin content APIs. */
function isAdmin(req) {
  const m = String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const a = sha256(m[1]);
  const b = sha256(ADMIN_KEY);
  return a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

const adminFail = (res) => send(res, 401, err("admin_key"));

function sanitizeNews(body, { partial = false } = {}) {
  const out = {};
  const has = (k) => body[k] !== undefined;
  if (!partial || has("title")) {
    if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 120) return null;
    out.title = body.title.trim();
  }
  if (!partial || has("body")) {
    if (body.body !== undefined && body.body !== null && (typeof body.body !== "string" || body.body.length > 4000)) return null;
    out.body = typeof body.body === "string" ? body.body.trim() : "";
  }
  if (!partial || has("image")) {
    if (body.image !== undefined && body.image !== null && (typeof body.image !== "string" || body.image.length > 500)) return null;
    out.image = typeof body.image === "string" ? body.image.trim() : "";
  }
  if (!partial || has("link")) {
    if (body.link !== undefined && body.link !== null && (typeof body.link !== "string" || body.link.length > 500)) return null;
    out.link = typeof body.link === "string" ? body.link.trim() : "";
  }
  if (!partial || has("badge")) {
    if (body.badge !== undefined && body.badge !== null && (typeof body.badge !== "string" || body.badge.length > 40)) return null;
    out.badge = typeof body.badge === "string" ? body.badge.trim() : "";
  }
  if (!partial || has("pinned")) out.pinned = !!body.pinned;
  if (!partial || has("visible")) out.visible = body.visible === undefined ? true : !!body.visible;
  if (!partial || has("sortIndex")) {
    const n = Number(body.sortIndex ?? 0);
    if (!Number.isFinite(n) || n < -9999 || n > 9999) return null;
    out.sortIndex = Math.round(n);
  }
  return out;
}

const sortNews = (items) =>
  [...items].sort(
    (a, b) => Number(!!b.pinned) - Number(!!a.pinned) || (a.sortIndex ?? 0) - (b.sortIndex ?? 0) || (b.createdAt ?? 0) - (a.createdAt ?? 0),
  );

async function handleNewsImage(res, body) {
  const data = typeof body?.data === "string" ? body.data : "";
  const m = data.match(/^data:image\/(png|jpe?g|webp|gif);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return send400(res, "image_format");
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  const buf = Buffer.from(m[2], "base64");
  if (buf.length < 64 || buf.length > 9_000_000) return send400(res, "image_format");
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const name = `img_${crypto.randomBytes(8).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
  save();
  send(res, 200, { ok: true, url: `/uploads/${name}` });
}

const UPLOAD_TYPES = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif" };

/** Serve uploaded news images (filename is a strict whitelist → no traversal). */
function serveUpload(res, pathname) {
  const name = pathname.replace(/^\/uploads\//, "");
  if (!/^img_[0-9a-f]{16}\.(png|jpe?g|webp|gif)$/.test(name)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("not found");
  }
  const file = path.join(UPLOAD_DIR, name);
  fs.readFile(file, (e, buf) => {
    if (e) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("not found");
    }
    res.writeHead(200, {
      "Content-Type": UPLOAD_TYPES[name.split(".").pop()] || "application/octet-stream",
      "Content-Length": buf.length,
      "Cache-Control": "public, max-age=604800, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(buf);
  });
}

/* ---------- server ---------- */

const server = http.createServer(async (req, res) => {
  if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  const corsOk = cors(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(corsOk ? 204 : 403);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const route = `${req.method} ${url.pathname}`;
  const ip = ipOf(req);

  try {
    if (route === "GET /api/health") return send(res, 200, { ok: true, uptime: process.uptime() });
    if (route === "GET /api/config")
      return send(res, 200, { ok: true, providers: providerStatus(), otp: otpConfig() });

    /* ----- news: public feed ----- */
    if (route === "GET /api/news")
      return send(res, 200, { ok: true, news: sortNews(db().news.filter((n) => n.visible !== false)) });

    /* ----- uploads: static images (no CORS gate needed beyond default headers) ----- */
    if (req.method === "GET" && url.pathname.startsWith("/uploads/")) return serveUpload(res, url.pathname);

    /* ----- news: admin CRUD (Bearer ADMIN_KEY) ----- */
    if (route === "GET /api/admin/news" || route === "POST /api/admin/news" || route === "PUT /api/admin/news" || route === "DELETE /api/admin/news" || route === "POST /api/admin/news/image") {
      if (!isAdmin(req)) return adminFail(res);
      if (route === "GET /api/admin/news") return send(res, 200, { ok: true, news: sortNews(db().news) });
      if (route === "POST /api/admin/news/image") {
        let body;
        try {
          body = await readBody(req, 12_000_000);
        } catch {
          return send(res, 413, err("bad_request", { message_fa: "حجم تصویر بیش از حد مجاز است (حداکثر ~۸ مگابایت)." }));
        }
        if (body === null) return send400(res, "bad_request");
        return await handleNewsImage(res, body);
      }
      const body = await readBody(req);
      if (body === null) return send400(res, "bad_request");
      if (route === "POST /api/admin/news") {
        const clean = sanitizeNews(body);
        if (!clean) return send400(res, typeof body?.title !== "string" || !String(body.title).trim() ? "news_title" : "news_field");
        const item = { id: newId("n"), ...clean, createdAt: Date.now(), updatedAt: Date.now() };
        db().news.push(item);
        save();
        return send(res, 200, { ok: true, item });
      }
      if (route === "PUT /api/admin/news") {
        const item = db().news.find((n) => n.id === body.id);
        if (!item) return send400(res, "news_id");
        const clean = sanitizeNews(body, { partial: true });
        if (!clean) return send400(res, "news_field");
        Object.assign(item, clean, { updatedAt: Date.now() });
        save();
        return send(res, 200, { ok: true, item });
      }
      // DELETE
      const idx = db().news.findIndex((n) => n.id === body.id);
      if (idx < 0) return send400(res, "news_id");
      db().news.splice(idx, 1);
      save();
      return send(res, 200, { ok: true });
    }

    if (route === "POST /api/auth/request") {
      const body = await readBody(req);
      if (body === null) return send400(res, "bad_request");
      return await handleRequestOtp(res, body, ip);
    }
    if (route === "POST /api/auth/verify") {
      const body = await readBody(req);
      if (body === null) return send400(res, "bad_request");
      return await handleVerifyOtp(res, body, ip);
    }

    if (
      route === "GET /api/me" ||
      route === "PUT /api/me/progress" ||
      route === "POST /api/me/profile" ||
      route === "POST /api/me/onboarding" ||
      route === "POST /api/auth/logout" ||
      route.startsWith("POST /api/auth/link/")
    ) {
      const header = String(req.headers.authorization || "");
      const m = header.match(/^Bearer\s+(.+)$/i);
      const session = m ? sessionFromRequest(req) : null;
      if (!session) return send(res, 401, err("unauthorized"));
      const user = findUser(session.userId);
      if (!user || user.status !== "active") return send(res, 401, err("unauthorized"));

      if (route === "GET /api/me") return handleMe(res, user);
      if (route === "PUT /api/me/progress") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return handleSaveProgress(res, user, body);
      }
      if (route === "POST /api/me/profile") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return handleProfile(res, user, body);
      }
      if (route === "POST /api/me/onboarding") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return handleOnboarding(res, user, body);
      }
      if (route === "POST /api/auth/logout") {
        const d = db();
        d.sessions = d.sessions.filter((s) => s.tokenHash !== session.tokenHash);
        save();
        return send(res, 200, { ok: true });
      }
      if (route === "POST /api/auth/link/request") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return await handleLinkRequest(res, user, body, ip);
      }
      if (route === "POST /api/auth/link/verify") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return await handleLinkVerify(res, user, body, ip);
      }
      if (route === "POST /api/auth/link/confirm") {
        const body = await readBody(req);
        if (body === null) return send400(res, "bad_request");
        return await handleLinkConfirm(res, user, body, ip);
      }
    }

    return send(res, 404, { error: "not_found", message_fa: "مسیر پیدا نشد." });
  } catch (e) {
    console.error(`[api] ${route} failed:`, e);
    return send(res, 500, { error: "internal", message_fa: "خطای داخلی سرور." });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  const st = providerStatus();
  console.log(`[auth-server] listening on http://localhost:${PORT}`);
  console.log(
    `[auth-server] SMS(Kavenegar): ${st.sms.configured ? "configured" : "NOT configured"} | Email(Resend): ${
      st.email.configured ? "configured" : "NOT configured"
    } | dev stdout OTP: ${st.devLog ? "ON" : "off"}`,
  );
  if ((!st.sms.configured || !st.email.configured) && st.devLog)
    console.log(
      "[auth-server] Missing keys are fine for local testing: OTP codes print to THIS console. For real delivery fill server/.env (see server/README.fa.md).",
    );
});

process.on("SIGINT", () => {
  persistSync();
  process.exit(0);
});
