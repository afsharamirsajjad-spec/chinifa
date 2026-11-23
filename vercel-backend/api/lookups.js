// Chinify saved-word lookups
const { supabaseAdmin, pool, initDb } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

async function getAuthUser(req) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token || !supabaseAdmin) return null;
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    return user;
  } catch (e) {
    return null;
  }
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });
    if (req.method !== "POST") return res.status(405).end();

    const body = req.body || {};
    const item = {
      ch: String(body.ch || "").slice(0, 40),
      py: String(body.py || "").slice(0, 120),
      en: String(body.en || "").slice(0, 200),
      at: Date.now()
    };
    if (!item.ch) return res.status(400).json({ error: "no-ch" });

    // Lookups are also persisted inside Store.snapshot().lookups on the client
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
