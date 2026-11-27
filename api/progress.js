// Chinifa Detailed Progress API
const { pool, initDb, getAuthUser, cors } = require("./db");

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    await initDb();
    if (!pool) return res.status(200).json({ profile: null, progress: null });

    if (req.method === "GET") {
      const userRes = await pool.query(
        `SELECT id, email, full_name, hsk_level, is_pro, pro_plan, pro_expires_at, created_at, updated_at
         FROM public.chinifa_users WHERE id = $1 OR ($2 <> '' AND email = $2) LIMIT 1`,
        [user.id, user.email || ""]
      );
      const storeRes = await pool.query(
        `SELECT value, updated_at FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
        [user.id, user.email || ""]
      );
      return res.status(200).json({
        profile: userRes.rows[0] || null,
        progress: storeRes.rows[0] ? storeRes.rows[0].value : null,
      });
    }

    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
