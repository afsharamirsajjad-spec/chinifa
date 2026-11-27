// Shared Supabase, PostgreSQL, and Session Auth helper for chinifa
const crypto = require("crypto");

let supabaseAdmin = null;
let supabaseClient = null;
let pool = null;
let matchedPgKey = "";
let lastDbError = "";

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

// Load .env / .env.local in non-production environments without extra dependencies
if (!isProduction()) {
  try {
    const fs = require("fs");
    const path = require("path");
    const rootDir = path.resolve(__dirname, "..");
    for (const fname of [".env", ".env.local"]) {
      const fpath = path.join(rootDir, fname);
      if (!fs.existsSync(fpath)) continue;
      const lines = fs.readFileSync(fpath, "utf8").split(/\r?\n/);
      for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq <= 0) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key && !(key in process.env)) {
          process.env[key] = val;
        }
      }
    }
  } catch (e) {}
}

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a || ""), "utf8");
  const bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function cors(req, res, methods = "GET, POST, OPTIONS") {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  } else if (req.headers && req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization, range, accept");
}

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string" && req.body) {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      console.warn("[api] invalid JSON body:", e.message);
    }
  }
  return {};
}

function isDbRowPro(row) {
  if (!row) return false;
  if (row.status === "vip") return true;
  if (!row.is_pro) return false;
  if (!row.pro_expires_at) return true;
  return new Date(row.pro_expires_at).getTime() > Date.now();
}

function pgSslOption() {
  return { rejectUnauthorized: process.env.PG_SSL_STRICT === "true" };
}

function findPgConfig() {
  const priority = [
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "DATABASE_URL",
  ];
  for (const k of priority) {
    if (process.env[k]) return { key: k, url: process.env[k] };
  }
  const suffixes = ["_POSTGRES_URL_NON_POOLING", "_POSTGRES_URL", "_POSTGRES_PRISMA_URL", "_DATABASE_URL"];
  for (const suffix of suffixes) {
    const found = Object.keys(process.env).find((k) => k.endsWith(suffix) && process.env[k]);
    if (found) return { key: found, url: process.env[found] };
  }
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
    return {
      key: "PGHOST",
      pgConfig: {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD || "",
        database: process.env.PGDATABASE,
        ssl: pgSslOption(),
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 6000,
      },
    };
  }
  return null;
}

try {
  const { createClient } = require("@supabase/supabase-js");
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && serviceKey) {
    supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  if (supabaseUrl && anonKey) {
    supabaseClient = createClient(supabaseUrl, anonKey);
  }
} catch (e) {
  console.warn("[api/db.js] Supabase client init skipped:", e.message);
}

try {
  const { Pool } = require("pg");
  const cfg = findPgConfig();
  if (cfg && cfg.url) {
    matchedPgKey = cfg.key;
    const parsed = new URL(cfg.url);
    parsed.searchParams.delete("sslmode");
    pool = new Pool({
      connectionString: parsed.toString(),
      ssl: pgSslOption(),
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 6000,
    });
  } else if (cfg && cfg.pgConfig) {
    matchedPgKey = cfg.key;
    pool = new Pool(cfg.pgConfig);
  }
} catch (e) {
  lastDbError = e.message;
  console.error("[api/db.js] PG URL parse error:", e.message);
}

let dbInitialized = false;
let dbInitPromise = null;

async function initDb() {
  if (!pool) return false;
  if (dbInitialized) return true;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    let client = null;
    try {
      client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.chinifa_users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          password_hash TEXT,
          hsk_level TEXT DEFAULT 'HSK 1',
          status TEXT DEFAULT 'active',
          role TEXT DEFAULT 'user',
          is_pro BOOLEAN DEFAULT false,
          pro_plan TEXT,
          pro_expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        ALTER TABLE public.chinifa_users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
        ALTER TABLE public.chinifa_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
        CREATE TABLE IF NOT EXISTS public.chinifa_settings (
          key TEXT PRIMARY KEY,
          value JSONB DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.chinifa_feedback (
          id TEXT PRIMARY KEY,
          user_email TEXT DEFAULT '',
          user_name TEXT DEFAULT '',
          type TEXT DEFAULT 'feedback',
          message TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          reply TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.chinifa_kv_store (
          user_id TEXT PRIMARY KEY,
          email TEXT,
          store_key TEXT DEFAULT 'cheh-chin-state',
          value JSONB DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.chinifa_lookups (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          ch TEXT NOT NULL,
          py TEXT DEFAULT '',
          en TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_chinifa_users_email ON public.chinifa_users(email);
        CREATE INDEX IF NOT EXISTS idx_chinifa_kv_email ON public.chinifa_kv_store(email);
        CREATE INDEX IF NOT EXISTS idx_chinifa_lookups_user ON public.chinifa_lookups(user_id);
      `);
      dbInitialized = true;
      return true;
    } catch (err) {
      lastDbError = err.message;
      console.error("[api/db.js initDb] error:", err.message);
      dbInitPromise = null;
      return false;
    } finally {
      if (client) client.release();
    }
  })();

  return dbInitPromise;
}

let warnedSessionSecret = false;
function getSessionSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RESEND_API_KEY;
  if (secret) return secret;
  if (!warnedSessionSecret) {
    warnedSessionSecret = true;
    console.warn("[SECURITY] AUTH_SECRET is not set; deriving HMAC key from configured runtime env.");
  }
  const entropy = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.VERCEL_URL || "chinifa-dev-session-hmac-secret";
  return crypto.createHash("sha256").update("chinifa-session-v2:" + entropy).digest("hex");
}

function signSessionToken(payload) {
  const body = {
    uid: String(payload.uid || payload.id || ""),
    email: String(payload.email || "").trim().toLowerCase(),
    name: String(payload.name || payload.fullName || "").trim(),
    exp: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
  };
  const b64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSessionSecret()).update(b64).digest("base64url");
  return `cf.${b64}.${sig}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.startsWith("cf.")) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const b64 = parts[1];
  const sig = parts[2];
  let expected;
  try {
    expected = crypto.createHmac("sha256", getSessionSecret()).update(b64).digest("base64url");
  } catch (e) {
    console.error("[api/db.js verifySessionToken]", e.message);
    return null;
  }
  if (!timingSafeEqualStr(sig, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (!parsed || !parsed.uid || (parsed.exp && parsed.exp < Date.now())) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const parts = storedHash.split(":");
  const salt = parts[0];
  const keyHex = parts[1];
  try {
    const derived = crypto.scryptSync(String(password), salt, 64);
    const keyBuf = Buffer.from(keyHex, "hex");
    if (derived.length !== keyBuf.length) return false;
    return crypto.timingSafeEqual(derived, keyBuf);
  } catch (e) {
    return false;
  }
}

async function getAuthUser(req) {
  const authHeader = String((req.headers && req.headers.authorization) || "").trim();
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  // 1. Check signed Chinifa session token
  const cfUser = verifySessionToken(token);
  if (cfUser) {
    return {
      id: cfUser.uid,
      email: cfUser.email,
      fullName: cfUser.name || (cfUser.email ? cfUser.email.split("@")[0] : "کاربر"),
      source: "chinifa-token",
    };
  }

  // 2. Fallback: Check Supabase Auth JWT
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data && data.user) {
        const u = data.user;
        return {
          id: u.id,
          email: (u.email || "").toLowerCase(),
          fullName: (u.user_metadata && (u.user_metadata.full_name || u.user_metadata.name)) || (u.email ? u.email.split("@")[0] : "کاربر"),
          source: "supabase",
        };
      }
    } catch (e) {
      console.warn("[api/db.js getAuthUser supabase]", e.message);
    }
  }

  return null;
}

function stableUserId(email) {
  return crypto.createHash("sha256").update(String(email || "").trim().toLowerCase()).digest("hex").slice(0, 32);
}

module.exports = {
  supabaseAdmin,
  supabaseClient,
  pool,
  initDb,
  cors,
  parseBody,
  timingSafeEqualStr,
  isProduction,
  isDbRowPro,
  getSessionSecret,
  signSessionToken,
  verifySessionToken,
  hashPassword,
  verifyPassword,
  getAuthUser,
  stableUserId,
  getDbDiagnostics: () => ({
    matchedPgKey,
    lastDbError,
    pgEnvKeys: Object.keys(process.env).filter((k) => /(POSTGRES|DATABASE|SUPABASE|PGHOST)/i.test(k)),
  }),
};
