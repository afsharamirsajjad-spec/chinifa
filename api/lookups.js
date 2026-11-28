// chinifa Saved-Word Lookups API
const { pool, initDb, getAuthUser, cors, parseBody } = require("./db");

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
      ).catch((e) => {
        console.error("[api/lookups status check]", e.message);
        return { rows: [] };
      });
      if (stRes.rows[0] && stRes.rows[0].status === "suspended") {
        return res.status(403).json({ error: "account-suspended" });
      }
    }

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

    const body = parseBody(req);
    const ch = String(body.ch || "").slice(0, 40);
    const py = String(body.py || "").slice(0, 120);
    const en = String(body.en || "").slice(0, 200);
    if (!ch) return res.status(400).json({ error: "no-ch" });

    if (pool) {
      await initDb();
      await pool.query(
        `INSERT INTO public.chinifa_lookups (user_id, ch, py, en) VALUES ($1, $2, $3, $4)`,
        [user.id, ch, py, en]
      ).catch((e) => console.error("[api/lookups insert]", e.message));
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
