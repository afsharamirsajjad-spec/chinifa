// Shared Supabase, PostgreSQL, and Session Auth helper for chinifa
const crypto = require("crypto");

let supabaseAdmin = null;
let supabaseClient = null;
let pool = null;
let matchedPgKey = "";
let lastDbError = "";

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
        ssl: { rejectUnauthorized: false },
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
} catch (e) {}

try {
  const { Pool } = require("pg");
  const cfg = findPgConfig();
  if (cfg && cfg.url) {
    matchedPgKey = cfg.key;
    const parsed = new URL(cfg.url);
    parsed.searchParams.delete("sslmode");
    pool = new Pool({
      connectionString: parsed.toString(),
      ssl: { rejectUnauthorized: false },
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
          is_pro BOOLEAN DEFAULT false,
          pro_plan TEXT,
          pro_expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.chinifa_kv_store (
          user_id TEXT PRIMARY KEY,
          email TEXT,
          store_key TEXT DEFAULT 'cheh-chin-state',
          value JSONB DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.chinifa_lookups (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          ch TEXT NOT NULL,
          py TEXT DEFAULT '',
          en TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT now()
        );
      `);
      await client.query(`
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

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    "chinifa-session-hmac-secret-v1"
  );
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
  const expected = crypto.createHmac("sha256", getSessionSecret()).update(b64).digest("base64url");
  if (sig !== expected) return null;
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
    } catch (e) {}
  }

  return null;
}

function stableUserId(email) {
  return crypto.createHash("md5").update(String(email || "").trim().toLowerCase()).digest("hex");
}

module.exports = {
  supabaseAdmin,
  supabaseClient,
  pool,
  initDb,
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
