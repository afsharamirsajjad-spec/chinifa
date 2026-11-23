// Chinify Supabase Authentication & Profile Management
const { supabaseAdmin, supabaseClient, pool, initDb } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

function validEmail(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || "").trim());
}

async function getAuthUser(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  try {
    if (supabaseAdmin) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) return null;
      return { user, token };
    }
  } catch (e) {
    console.error("[getAuthUser] error:", e.message);
  }
  return null;
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = String(req.query.action || "");
  let body = {};
  try {
    body = (req.method === "POST" && req.body) ? req.body : {};
  } catch (e) {}

  try {
    await initDb();

    // ----------------------------------------------------
    // POST /api/register
    // ----------------------------------------------------
    if (action === "register") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const username = String(body.username || "").trim() || email.split("@")[0];
      const fullName = String(body.fullName || username).trim();

      if (!validEmail(email)) {
        return res.status(400).json({ error: "bad-email", field: "loginEmail" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "weak-password", field: "loginPass" });
      }

      if (!supabaseAdmin) {
        return res.status(500).json({ error: "supabase-not-configured" });
      }

      // Check if user already exists
      const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          username: username,
          full_name: fullName
        }
      });

      if (createErr) {
        const msg = createErr.message || "";
        if (/already.*registered|already.*exists|email_exists/i.test(msg)) {
          return res.status(409).json({ error: "email-taken", field: "loginEmail" });
        }
        return res.status(400).json({ error: msg });
      }

      const user = createdUser.user;

      // Sign in user to obtain real JWT access token
      let sessionToken = null;
      let refreshToken = null;
      if (supabaseClient) {
        const { data: sessionData } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (sessionData && sessionData.session) {
          sessionToken = sessionData.session.access_token;
          refreshToken = sessionData.session.refresh_token;
        }
      }

      // Initialize Profile & User Progress in PostgreSQL
      if (pool) {
        try {
          await pool.query(
            `INSERT INTO public.profiles (id, email, full_name, hsk_level, learning_stage, total_xp, streak)
             VALUES ($1, $2, $3, 'HSK 1', 1, 0, 0)
             ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, updated_at = now()`,
            [user.id, email, fullName]
          );

          await pool.query(
            `INSERT INTO public.user_progress (user_id, hsk_level, current_lesson, current_stage, state_snapshot)
             VALUES ($1, 'HSK 1', 1, 1, '{}'::jsonb)
             ON CONFLICT (user_id) DO NOTHING`,
            [user.id]
          );
        } catch (dbErr) {
          console.error("[register] profile insert error:", dbErr.message);
        }
      }

      return res.status(200).json({
        id: user.id,
        username: fullName,
        email: email,
        token: sessionToken,
        refreshToken: refreshToken,
        profile: {
          id: user.id,
          email: email,
          fullName: fullName,
          hskLevel: "HSK 1",
          learningStage: 1,
          totalXp: 0,
          streak: 0
        },
        store: null
      });
    }

    // ----------------------------------------------------
    // POST /api/login
    // ----------------------------------------------------
    if (action === "login") {
      let emailOrUser = String(body.email || body.username || "").trim();
      const password = String(body.password || "");

      if (!emailOrUser || !password) {
        return res.status(400).json({ error: "missing-credentials", field: "loginUser" });
      }

      let targetEmail = emailOrUser;
      if (!validEmail(targetEmail)) {
        // Look up email by full_name or username in profiles
        if (pool) {
          const r = await pool.query(
            `SELECT email FROM public.profiles WHERE lower(full_name) = lower($1) OR lower(email) = lower($1) LIMIT 1`,
            [emailOrUser]
          );
          if (r.rows.length > 0 && r.rows[0].email) {
            targetEmail = r.rows[0].email;
          }
        }
      }

      if (!validEmail(targetEmail)) {
        return res.status(401).json({ error: "no-such-account", field: "loginUser" });
      }

      if (!supabaseClient) {
        return res.status(500).json({ error: "supabase-not-configured" });
      }

      const { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({
        email: targetEmail,
        password: password
      });

      if (authErr || !authData || !authData.user) {
        return res.status(401).json({ error: "wrong-password", field: "loginPass" });
      }

      const user = authData.user;
      const session = authData.session;

      // Fetch user profile and saved progress
      let profile = null;
      let snapshot = null;
      if (pool) {
        try {
          const profRes = await pool.query(
            `SELECT * FROM public.profiles WHERE id = $1`,
            [user.id]
          );
          if (profRes.rows.length > 0) {
            profile = profRes.rows[0];
            // Update last_activity_at
            await pool.query(
              `UPDATE public.profiles SET last_activity_at = now() WHERE id = $1`,
              [user.id]
            );
          } else {
            // Create profile if missing
            const insRes = await pool.query(
              `INSERT INTO public.profiles (id, email, full_name)
               VALUES ($1, $2, $3) RETURNING *`,
              [user.id, user.email, user.user_metadata?.full_name || user.email.split("@")[0]]
            );
            profile = insRes.rows[0];
          }

          const progRes = await pool.query(
            `SELECT state_snapshot FROM public.user_progress WHERE user_id = $1`,
            [user.id]
          );
          if (progRes.rows.length > 0 && progRes.rows[0].state_snapshot) {
            snapshot = progRes.rows[0].state_snapshot;
          }
        } catch (dbErr) {
          console.error("[login] fetch profile error:", dbErr.message);
        }
      }

      const displayName = profile?.full_name || user.user_metadata?.full_name || user.email.split("@")[0];

      return res.status(200).json({
        id: user.id,
        username: displayName,
        email: user.email,
        token: session ? session.access_token : null,
        refreshToken: session ? session.refresh_token : null,
        profile: profile,
        store: snapshot
      });
    }

    // ----------------------------------------------------
    // GET /api/session
    // ----------------------------------------------------
    if (action === "session" && req.method === "GET") {
      const auth = await getAuthUser(req);
      if (!auth) return res.status(401).json({ error: "no-session" });

      const user = auth.user;
      let profile = null;
      let snapshot = null;

      if (pool) {
        try {
          const profRes = await pool.query(`SELECT * FROM public.profiles WHERE id = $1`, [user.id]);
          if (profRes.rows.length > 0) profile = profRes.rows[0];

          const progRes = await pool.query(`SELECT state_snapshot FROM public.user_progress WHERE user_id = $1`, [user.id]);
          if (progRes.rows.length > 0) snapshot = progRes.rows[0].state_snapshot;
        } catch (e) {
          console.error("[session] query error:", e.message);
        }
      }

      const displayName = profile?.full_name || user.user_metadata?.full_name || user.email.split("@")[0];

      return res.status(200).json({
        id: user.id,
        username: displayName,
        email: user.email,
        profile: profile,
        store: snapshot
      });
    }

    // ----------------------------------------------------
    // Authenticated Actions
    // ----------------------------------------------------
    const auth = await getAuthUser(req);

    if (action === "logout") {
      if (auth && supabaseAdmin) {
        try {
          await supabaseAdmin.auth.admin.signOut(auth.token);
        } catch (e) {}
      }
      return res.status(200).json({ ok: true });
    }

    if (action === "change-password") {
      if (!auth) return res.status(401).json({ error: "no-session" });
      const newPassword = String(body.password || "");
      if (newPassword.length < 6) return res.status(400).json({ error: "weak-password" });

      if (supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(auth.user.id, {
          password: newPassword
        });
        if (error) return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    }

    if (action === "forgot") {
      const target = String(body.email || body.contact || body.who || "").trim().toLowerCase();
      if (target && validEmail(target) && supabaseClient) {
        try {
          const origin = req.headers.origin || "https://chinify-api.vercel.app";
          await supabaseClient.auth.resetPasswordForEmail(target, {
            redirectTo: `${origin}/reset-password`
          });
        } catch (e) {
          console.error("[forgot] error:", e.message);
        }
      }
      return res.status(200).json({ sent: true });
    }

    if (action === "google-available") {
      return res.status(200).json({ available: false });
    }

    return res.status(404).json({ error: "unknown-action" });
  } catch (err) {
    console.error("[api/auth] unexpected error:", err);
    return res.status(500).json({ error: err.message || "server-error" });
  }
};
