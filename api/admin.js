// Admin API for Chinifa: Authentication + Real PostgreSQL User & Progress Management
const crypto = require("crypto");
const {
  pool,
  initDb,
  getDbDiagnostics,
  cors,
  parseBody,
  timingSafeEqualStr,
  isProduction,
  isDbRowPro,
  getSessionSecret,
} = require("./db");

let warnedAdminSecret = false;
function adminSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) return secret;
  if (!warnedAdminSecret) {
    warnedAdminSecret = true;
    console.warn("[SECURITY] ADMIN_SECRET is not set; falling back to derived session secret.");
  }
  return crypto.createHash("sha256").update("chinifa-admin-v2:" + getSessionSecret()).digest("hex");
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
  let expected;
  try {
    expected = crypto.createHmac("sha256", adminSecret()).update(parts[1]).digest("base64url");
  } catch (e) {
    console.error("[api/admin verifyAdminToken]", e.message);
    return null;
  }
  if (!timingSafeEqualStr(parts[2], expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (!parsed || parsed.role !== "superadmin" || (parsed.exp && parsed.exp < Date.now())) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  cors(req, res, "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  const body = parseBody(req);
  const action = String((req.query && req.query.action) || body.action || "").toLowerCase().trim();

  try {
    // 1. Admin Login (public)
    if (action === "login") {
      const username = String(body.username || "").trim().toLowerCase();
      const password = String(body.password || "");
      const expectedPass = process.env.ADMIN_PASSWORD || "chinifa2026";
      if (!expectedPass) {
        return res.status(503).json({
          ok: false,
          error: "admin-not-configured",
          message: "رمز عبور ادمین (ADMIN_PASSWORD) در تنظیمات سرور تعریف نشده است.",
        });
      }
      if ((username === "admin" || username === "chinifa") && timingSafeEqualStr(password, expectedPass)) {
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
        } catch (e) {
          console.error("[api/admin status count]", e.message);
        }
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
          u.status,
          u.role,
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
        const up = st.unitProgs && typeof st.unitProgs === "object" ? st.unitProgs : {};
        let unitDoneCount = 0;
        let highestUnitReached = 0;
        Object.keys(up).forEach((uk) => {
          const uv = up[uk];
          if (!uv || typeof uv !== "object") return;
          const isDone = Boolean(uv.d || uv.done);
          const cs = Array.isArray(uv.cs) ? uv.cs : (Array.isArray(uv.completedSections) ? uv.completedSections : []);
          const mp = (uv.mp && typeof uv.mp === "object") ? uv.mp : (uv.miniProgress || {});
          const mpMax = Object.values(mp).reduce((m, x) => Math.max(m, Number(x) || 0), 0);
          const started = isDone || cs.length > 0 || mpMax > 0 || (Number(uv.s || uv.currentSectionIdx) || 0) > 0;
          if (isDone) unitDoneCount += 1;
          const m = /:(\d+)$/.exec(uk);
          if (started && m) highestUnitReached = Math.max(highestUnitReached, Number(m[1]) + 1);
          else if (started && uk === "lesson0") highestUnitReached = Math.max(highestUnitReached, 1);
        });
        const cpTotal = Object.keys(cp).reduce((sum, k) => sum + (Number(cp[k]) || 0), 0);
        const currentLesson = Math.max(cpTotal, unitDoneCount, highestUnitReached);
        const isPro = isDbRowPro(row);
        const status = row.status === "suspended" ? "suspended" : (isPro ? "vip" : "active");
        const xp = Number(st.xp) || (words * 10 + currentLesson * 50);
        const lastIso = row.store_updated_at || row.updated_at || row.created_at || null;
        return {
          id: row.id,
          name: row.full_name || st.name || st.nick || (row.email ? row.email.split("@")[0] : "کاربر"),
          username: row.email ? row.email.split("@")[0] : row.id.slice(0, 8),
          email: row.email || "",
          level: st.level || row.hsk_level || "HSK 1",
          streak: Number(st.streak) || 0,
          xp: xp,
          words: words,
          wordsLearned: words,
          currentLesson: currentLesson,
          status: status,
          role: row.role || (isPro ? "vip" : "user"),
          isPro: isPro || status === "vip",
          createdAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "",
          createdAtIso: row.created_at ? new Date(row.created_at).toISOString() : null,
          joinedAt: row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : "",
          lastActiveAt: lastIso ? new Date(lastIso).toISOString() : null,
          lastActive: lastIso ? new Date(lastIso).toLocaleString("fa-IR") : "ثبت‌شده",
        };
      });

      return res.status(200).json({ ok: true, dbConnected: true, users });
    }

    // 4. Update or Create User (status: active/vip/suspended, role: user/vip/moderator/admin)
    if (action === "user-update") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const id = String(body.id || "").trim() || ("usr_" + crypto.randomBytes(8).toString("hex"));
      const email = String(body.email || "").trim().toLowerCase();
      if (!id && !email) return res.status(400).json({ ok: false, error: "missing-user" });

      const status = ["active", "vip", "suspended"].includes(String(body.status)) ? String(body.status) : "active";
      const role = ["user", "vip", "moderator", "admin"].includes(String(body.role)) ? String(body.role) : (status === "vip" ? "vip" : "user");
      const isPro = status === "vip" || role === "vip" || body.isPro === true;
      const level = body.level ? String(body.level) : "HSK 1";
      const name = body.name ? String(body.name) : (email ? email.split("@")[0] : "کاربر");

      const upd = await pool.query(
        `UPDATE public.chinifa_users
         SET status = $3,
             role = $4,
             is_pro = $5,
             hsk_level = COALESCE(NULLIF($6, ''), hsk_level),
             full_name = COALESCE(NULLIF($7, ''), full_name),
             pro_expires_at = CASE WHEN $5 THEN now() + interval '365 days' ELSE NULL END,
             updated_at = now()
         WHERE ($1 <> '' AND id = $1) OR ($2 <> '' AND email = $2)
         RETURNING id, email, status, role, is_pro`,
        [id, email, status, role, isPro, level, name]
      );

      if (upd.rows.length === 0) {
        if (!email) {
          return res.status(400).json({ ok: false, error: "برای ساخت کاربر جدید در دیتابیس، وارد کردن ایمیل الزامی است." });
        }
        await pool.query(
          `INSERT INTO public.chinifa_users (id, email, full_name, hsk_level, status, role, is_pro, pro_expires_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 THEN now() + interval '365 days' ELSE NULL END)
           ON CONFLICT (email) DO UPDATE SET
             status = EXCLUDED.status,
             role = EXCLUDED.role,
             is_pro = EXCLUDED.is_pro,
             hsk_level = EXCLUDED.hsk_level,
             full_name = EXCLUDED.full_name,
             updated_at = now()`,
          [id, email, name, level, status, role, isPro]
        );
      }

      const targetId = (upd.rows[0] && upd.rows[0].id) || id;
      const targetEmail = (upd.rows[0] && upd.rows[0].email) || email;
      if (body.streak !== undefined || body.xp !== undefined || body.currentLesson !== undefined) {
        try {
          const kvRes = await pool.query(
            `SELECT user_id, value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) LIMIT 1`,
            [targetId, targetEmail]
          );
          const curVal = (kvRes.rows[0] && kvRes.rows[0].value && typeof kvRes.rows[0].value === "object")
            ? kvRes.rows[0].value
            : {};
          curVal.level = level;
          curVal.name = name;
          if (body.streak !== undefined) curVal.streak = Math.max(0, Number(body.streak) || 0);
          if (body.xp !== undefined) curVal.xp = Math.max(0, Number(body.xp) || 0);
          if (body.currentLesson !== undefined) {
            curVal.courseProgress = curVal.courseProgress && typeof curVal.courseProgress === "object" ? curVal.courseProgress : {};
            curVal.courseProgress.hsk1 = Math.max(0, Number(body.currentLesson) || 0);
          }
          const storeUid = (kvRes.rows[0] && kvRes.rows[0].user_id) || targetId;
          await pool.query(
            `INSERT INTO public.chinifa_kv_store (user_id, email, store_key, value, updated_at)
             VALUES ($1, $2, 'cheh-chin-state', $3, now())
             ON CONFLICT (user_id) DO UPDATE SET
               email = COALESCE(NULLIF(EXCLUDED.email, ''), public.chinifa_kv_store.email),
               value = EXCLUDED.value,
               updated_at = now()`,
            [storeUid, targetEmail, JSON.stringify(curVal)]
          );
        } catch (e) {
          console.error("[api/admin user-update kv]", e.message);
        }
      }

      return res.status(200).json({ ok: true, id: targetId, status, role, isPro });
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

    // 6. Feedback list & save
    if (action === "feedback-list") {
      if (!pool || !dbReady) return res.status(200).json({ ok: true, dbConnected: false, feedback: [] });
      const r = await pool.query(`SELECT id, user_email, user_name, type, message, status, reply, created_at FROM public.chinifa_feedback ORDER BY created_at DESC LIMIT 200`);
      return res.status(200).json({ ok: true, dbConnected: true, feedback: r.rows });
    }

    if (action === "feedback-save") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const list = Array.isArray(body.feedback) ? body.feedback : [];
      for (const f of list.slice(0, 200)) {
        if (!f || !f.id) continue;
        await pool.query(
          `INSERT INTO public.chinifa_feedback (id, user_email, user_name, type, message, status, reply, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, now())
           ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, reply = EXCLUDED.reply, updated_at = now()`,
          [String(f.id), String(f.user_email || f.email || f.userId || ""), String(f.user_name || f.userName || f.user || ""), String(f.type || "feedback"), String(f.message || f.content || f.text || ""), String(f.status || "pending"), String(f.reply || "")]
        );
      }
      return res.status(200).json({ ok: true });
    }

    if (action === "feedback-delete") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const id = String(body.id || (req.query && req.query.id) || "").trim();
      if (!id) return res.status(400).json({ ok: false, error: "missing-id" });
      await pool.query(`DELETE FROM public.chinifa_feedback WHERE id = $1`, [id]);
      return res.status(200).json({ ok: true });
    }

    // 7. App settings get & save
    if (action === "settings-get") {
      if (!pool || !dbReady) return res.status(200).json({ ok: true, dbConnected: false, settings: null });
      const r = await pool.query(`SELECT value FROM public.chinifa_settings WHERE key = 'app_settings' LIMIT 1`);
      return res.status(200).json({ ok: true, dbConnected: true, settings: r.rows[0] ? r.rows[0].value : null });
    }

    if (action === "settings-save") {
      if (!pool || !dbReady) return res.status(503).json({ ok: false, error: "db-unavailable" });
      const settings = body.settings && typeof body.settings === "object" ? body.settings : {};
      await pool.query(
        `INSERT INTO public.chinifa_settings (key, value, updated_at) VALUES ('app_settings', $1, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [JSON.stringify(settings)]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: "unknown-action" });
  } catch (err) {
    console.error("[api/admin] error:", err);
    return res.status(500).json({ ok: false, error: err.message || "server-error" });
  }
};
