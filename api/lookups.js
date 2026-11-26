// Chinify/Chinifa Saved-Word Lookups API
const { pool, initDb, getAuthUser } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    if (req.method === "GET") {
      if (!pool) return res.status(200).json({ lookups: [] });
      await initDb();
      const r = await pool.query(
        `SELECT ch, py, en, created_at FROM public.chinifa_lookups WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`,
        [user.id]
      );
      return res.status(200).json({ lookups: r.rows });
    }

    if (req.method !== "POST") return res.status(405).end();

    const body = typeof req.body === "object" && req.body !== null ? req.body : {};
    const ch = String(body.ch || "").slice(0, 40);
    const py = String(body.py || "").slice(0, 120);
    const en = String(body.en || "").slice(0, 200);
    if (!ch) return res.status(400).json({ error: "no-ch" });

    if (pool) {
      await initDb();
      await pool.query(
        `INSERT INTO public.chinifa_lookups (user_id, ch, py, en) VALUES ($1, $2, $3, $4)`,
        [user.id, ch, py, en]
      ).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
