// Admin API for Chinifa: Authentication + Real PostgreSQL User & Progress Management
const crypto = require("crypto");
const { pool, initDb, getDbDiagnostics } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string" && req.body) {
    try { return JSON.parse(req.body); } catch (e) {}
  }
  return {};
}

function adminSecret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "chinifa-admin-hmac-secret-v1"
  );
}

function signAdminToken(username) {
  const payload = {
    role: "superadmin",
    username: String(username || "admin"),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", adminSecret()).update(b64).digest("base64url");
  return `cfa.${b64}.${sig}`;
}

function verifyAdminToken(req) {
  const auth = String((req.headers && req.headers.authorization) || "").trim();
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token || !token.startsWith("cfa.")) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const expected = crypto.createHmac("sha256", adminSecret()).update(parts[1]).digest("base64url");
  if (parts[2] !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (!parsed || parsed.role !== "superadmin" || (parsed.exp && parsed.exp < Date.now())) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const body = parseBody(req);
  const action = String((req.query && req.query.action) || body.action || "").toLowerCase().trim();

  try {
    // 1. Admin Login (public)
    if (action === "login") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const expectedPass = process.env.ADMIN_PASSWORD || "chinifa2026";
      if ((username === "admin" || username === "chinifa") && password === expectedPass) {
        const token = signAdminToken(username);
        return res.status(200).json({
          ok: true,
          token: token,
          username: username,
          role: "superadmin",
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
      }
      return res.status(401).json({ ok: false, error: "نام کاربری یا رمز عبور ادمین اشتباه است." });
    }

    // All other actions require valid Admin Bearer token
    const admin = verifyAdminToken(req);
    if (!admin) {
      return res.status(401).json({ ok: false, error: "unauthorized", message: "لطفاً وارد پنل ادمین شوید." });
    }

    const dbReady = await initDb();

    // 2. DB & System Status
    if (action === "status" || action === "health") {
      let userCount = 0;
      let storeCount = 0;
      if (pool && dbReady) {
        try {
          const u = await pool.query(`SELECT COUNT(*)::int AS c FROM public.chinifa_users`);
          const s = await pool.query(`SELECT COUNT(*)::int AS c FROM public.chinifa_kv_store`);
          userCount = u.rows[0] ? u.rows[0].c : 0;
          storeCount = s.rows[0] ? s.rows[0].c : 0;
        } catch (e) {}
      }
      const diag = getDbDiagnostics ? getDbDiagnostics() : {};
      return res.status(200).json({
        ok: true,
        admin: admin.username,
        dbConnected: Boolean(pool && dbReady),
        hasPostgresEnv: Boolean(diag.matchedPgKey || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL),
        hasSupabaseEnv: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
        matchedPgKey: diag.matchedPgKey || null,
        pgEnvKeys: diag.pgEnvKeys || [],
        dbError: diag.lastDbError || null,
        userCount,
        storeCount,
      });
    }

    // 3. Real Users List from PostgreSQL
    if (action === "users") {
      if (!pool || !dbReady) {
        return res.status(200).json({ ok: true, dbConnected: false, users: [] });
      }

      const r = await pool.query(`
        SELECT
          u.id,
          u.email,
          u.full_name,
          u.hsk_level,
          u.is_pro,
          u.pro_plan,
          u.pro_expires_at,
          u.created_at,
          u.updated_at,
          s.value AS store_value,
          s.updated_at AS store_updated_at
        FROM public.chinifa_users u
        LEFT JOIN public.chinifa_kv_store s
          ON s.user_id = u.id OR (u.email <> '' AND s.email = u.email)
        ORDER BY COALESCE(s.updated_at, u.updated_at, u.created_at) DESC
        LIMIT 500
      `);

      const users = r.rows.map((row) => {
        const st = row.store_value && typeof row.store_value === "object" ? row.store_value : {};
        const words = Array.isArray(st.words) ? st.words.filter((w) => w && w.learned).length : 0;
        const cp = st.courseProgress && typeof st.courseProgress === "object" ? st.courseProgress : {};
        const currentLesson = Number(cp.hsk1) || 0;
        const isPro = !!(row.is_pro && (!row.pro_expires_at || new Date(row.pro_expires_at).getTime() > Date.now()));
        return {
          id: row.id,
          name: row.full_name || st.name || st.nick || (row.email ? row.email.split("@")[0] : "کاربر"),
          username: row.email ? row.email.split("@")[0] : row.id.slice(0, 8),
          email: row.email || "",
          level: st.level || row.hsk_level || "HSK 1",
          streak: Number(st.streak) || 0,
          words: words,
          wordsLearned: words,
          currentLesson: currentLesson,
          status: isPro ? "vip" : "active",
          isPro: isPro,
          joinedAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "",
          lastActive: row.store_updated_at || row.updated_at || row.created_at || "",
        };
      });

      return res.status(200).json({ ok: true, dbConnected: true, users });
    }

    // 4. Update User (e.g. toggle VIP/Pro or level)
    if (action === "user-update") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const id = String(body.id || "");
      const email = String(body.email || "").trim().toLowerCase();
      if (!id && !email) return res.status(400).json({ ok: false, error: "missing-user" });

      const isPro = body.status === "vip" || body.isPro === true;
      const level = body.level ? String(body.level) : null;
      const name = body.name ? String(body.name) : null;

      await pool.query(
        `UPDATE public.chinifa_users
         SET is_pro = $3,
             hsk_level = COALESCE($4, hsk_level),
             full_name = COALESCE($5, full_name),
             pro_expires_at = CASE WHEN $3 THEN now() + interval '365 days' ELSE NULL END,
             updated_at = now()
         WHERE ($1 <> '' AND id = $1) OR ($2 <> '' AND email = $2)`,
        [id, email, isPro, level, name]
      );
      return res.status(200).json({ ok: true });
    }

    // 5. Delete User
    if (action === "user-delete") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const id = String(body.id || (req.query && req.query.id) || "");
      const email = String(body.email || (req.query && req.query.email) || "").trim().toLowerCase();
      if (!id && !email) return res.status(400).json({ ok: false, error: "missing-user" });

      await pool.query(
        `DELETE FROM public.chinifa_kv_store WHERE ($1 <> '' AND user_id = $1) OR ($2 <> '' AND email = $2)`,
        [id, email]
      );
      await pool.query(
        `DELETE FROM public.chinifa_users WHERE ($1 <> '' AND id = $1) OR ($2 <> '' AND email = $2)`,
        [id, email]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: "unknown-action" });
  } catch (err) {
    console.error("[api/admin] error:", err);
    return res.status(500).json({ ok: false, error: err.message || "server-error" });
  }
};
