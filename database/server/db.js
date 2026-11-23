// Minimal JSON-file database with atomic writes (tmp + rename).
// Upgrading to SQLite later is a drop-in swap behind these five functions.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const DB_PATH = path.join(DIR, "db.json");

const empty = () => ({
  v: 1,
  // Random per-install secret: persists in the DB so OTP/session hashes survive restarts
  // without requiring SERVER_SECRET to be configured.
  secret: crypto.randomBytes(32).toString("hex"),
  users: [], // { id, createdAt, name, status: "active", primaryContact }
  contacts: [], // { id, userId, type: "phone"|"email", value, verifiedAt, isPrimary }
  otps: [], // { id, channel, target, codeHash, createdAt, expiresAt, attempts, consumedAt, ip }
  sessions: [], // { tokenHash, userId, createdAt, lastSeenAt, expiresAt, ip }
  progress: {}, // userId -> { progress, settings, updatedAt }
  news: [], // { id, title, body, image, link, badge, pinned, visible, sortIndex, createdAt, updatedAt }
  meta: { limits: { target: {}, ip: {} } },
});

let db = null;
let saveTimer = null;

export function loadDb() {
  fs.mkdirSync(DIR, { recursive: true });
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    db = { ...empty(), ...parsed };
    if (!db.secret) db.secret = empty().secret;
  } catch {
    db = empty();
  }
  pruneExpired();
  persistNow();
  return db;
}

export const getDb = () => db;

/** Debounced atomic save — mutations call this freely. */
export function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistNow();
  }, 120);
}

function persistNow() {
  try {
    const tmp = DB_PATH + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db));
    fs.renameSync(tmp, DB_PATH);
  } catch (e) {
    console.error("[db] save failed:", e.message);
  }
}

export function persistSync() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  persistNow();
}

/** Drop expired OTPs / sessions / stale rate-limit entries. Called on boot and hourly. */
export function pruneExpired() {
  const now = Date.now();
  db.otps = db.otps.filter((o) => o.expiresAt > now && !o.consumedAt && now - o.createdAt < 3600_000);
  db.sessions = db.sessions.filter((s) => s.expiresAt > now);
  const hourAgo = now - 3600_000;
  const lim = db.meta.limits;
  for (const bucket of [lim.target, lim.ip, lim.verifyFail]) {
    if (!bucket) continue;
    for (const k of Object.keys(bucket)) {
      bucket[k] = bucket[k].filter((t) => t > hourAgo);
      if (!bucket[k].length) delete bucket[k];
    }
  }
}

let idCounter = 0;
export const newId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${(idCounter++).toString(36)}${crypto.randomBytes(3).toString("hex")}`;

process.on("exit", () => {
  try {
    persistNow();
  } catch {
    /* best effort */
  }
});
