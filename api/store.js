// Chinifa User Learning Progress & State Synchronization API
const { pool, initDb, getAuthUser } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

function parseBody(req) {
  if (typeof req.body === "object" && req.body !== null) return req.body;
  if (typeof req.body === "string" && req.body) {
    try { return JSON.parse(req.body); } catch (e) {}
  }
  return {};
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    await initDb();
    if (pool) {
      const stRes = await pool.query(
        `SELECT status FROM public.chinifa_users WHERE id = $1 OR ($2 <> '' AND email = $2) LIMIT 1`,
        [user.id, user.email || ""]
      ).catch(() => ({ rows: [] }));
      if (stRes.rows[0] && stRes.rows[0].status === "suspended") {
        return res.status(403).json({ error: "account-suspended" });
      }
    }
    const key = String((req.query && req.query.key) || "cheh-chin-state").slice(0, 64);

    // GET: Retrieve user's stored progress snapshot
    if (req.method === "GET") {
      if (!pool) return res.status(200).json({ value: null, db: false });

      const r = await pool.query(
        `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
        [user.id, user.email || ""]
      );

      if (r.rows.length > 0 && r.rows[0].value) {
        return res.status(200).json({ value: r.rows[0].value });
      }
      return res.status(200).json({ value: null });
    }

    // POST: Save progress snapshot
    if (req.method === "POST") {
      const body = parseBody(req);
      const snapshot = body.value || {};

      if (!pool) return res.status(200).json({ ok: true, db: false });

      await pool.query(
        `INSERT INTO public.chinifa_kv_store (user_id, email, store_key, value, updated_at)
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT (user_id) DO UPDATE SET
           email = COALESCE(NULLIF(EXCLUDED.email, ''), public.chinifa_kv_store.email),
           store_key = EXCLUDED.store_key,
           value = EXCLUDED.value,
           updated_at = now()`,
        [user.id, user.email || "", key, JSON.stringify(snapshot)]
      );

      // Keep chinifa_users HSK level & name updated
      const level = String(snapshot.level || "HSK 1").slice(0, 32);
      const name = String(snapshot.name || user.fullName || "").slice(0, 80);
      if (user.email) {
        await pool.query(
          `UPDATE public.chinifa_users
           SET hsk_level = $2,
               full_name = COALESCE(NULLIF($3, ''), full_name),
               updated_at = now()
           WHERE email = $1`,
          [user.email, level, name]
        ).catch(() => {});
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method-not-allowed" });
  } catch (err) {
    console.error("[api/store] error:", err);
    return res.status(500).json({ error: String(err.message || err) });
  }
};
