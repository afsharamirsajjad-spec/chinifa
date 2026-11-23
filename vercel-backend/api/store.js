// Chinify User Learning Progress & State Synchronization
const { supabaseAdmin, pool, initDb } = require("./db");

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

async function getAuthUser(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  try {
    if (supabaseAdmin) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) return null;
      return user;
    }
  } catch (e) {
    console.error("[store.js getAuthUser] error:", e.message);
  }
  return null;
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    await initDb();
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    const key = String(req.query.key || "cheh-chin-state").slice(0, 64);

    // GET: Retrieve user's stored progress snapshot
    if (req.method === "GET") {
      if (!pool) return res.status(200).json({ value: null });

      const r = await pool.query(
        `SELECT state_snapshot FROM public.user_progress WHERE user_id = $1`,
        [user.id]
      );

      if (r.rows.length > 0 && r.rows[0].state_snapshot) {
        return res.status(200).json({ value: r.rows[0].state_snapshot });
      }
      return res.status(200).json({ value: null });
    }

    // POST: Save progress snapshot and update relational metrics
    if (req.method === "POST") {
      const body = req.body || {};
      const snapshot = body.value || {};

      if (!pool) return res.status(200).json({ ok: true });

      // Extract high-level learning metrics
      const level = String(snapshot.level || "HSK 1");
      const streak = Number(snapshot.streak) || 0;
      const xp = Number(snapshot.xp) || 0;
      const lsParts = snapshot.lsParts || {};
      const lsPartsV = snapshot.lsPartsV || {};
      const courseProgress = snapshot.courseProgress || {};

      const completedLessonsList = Object.keys(lsParts);
      const completedStagesList = Object.keys(lsPartsV);
      const completedCount = completedLessonsList.length;

      // Current lesson & stage estimation from course progress
      let currentLesson = 1;
      let currentStage = 1;
      if (courseProgress.hsk1 !== undefined) {
        currentLesson = Math.max(1, Number(courseProgress.hsk1) || 1);
      }
      if (snapshot.lsPlaces && typeof snapshot.lsPlaces === "object") {
        const places = Object.values(snapshot.lsPlaces);
        if (places.length > 0) {
          const maxPlace = Math.max(...places.map(Number).filter(n => !isNaN(n)));
          if (maxPlace > 0) currentLesson = Math.max(currentLesson, maxPlace);
        }
      }

      // Upsert user_progress with exact state snapshot + structured fields
      await pool.query(
        `INSERT INTO public.user_progress (
          user_id, hsk_level, current_lesson, current_stage,
          completed_lessons, completed_stages, state_snapshot, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, now())
        ON CONFLICT (user_id) DO UPDATE SET
          hsk_level = EXCLUDED.hsk_level,
          current_lesson = EXCLUDED.current_lesson,
          current_stage = EXCLUDED.current_stage,
          completed_lessons = EXCLUDED.completed_lessons,
          completed_stages = EXCLUDED.completed_stages,
          state_snapshot = EXCLUDED.state_snapshot,
          updated_at = now()`,
        [
          user.id,
          level,
          currentLesson,
          currentStage,
          JSON.stringify(completedLessonsList),
          JSON.stringify(completedStagesList),
          JSON.stringify(snapshot)
        ]
      );

      // Update profiles with aggregated stats
      await pool.query(
        `UPDATE public.profiles SET
          hsk_level = $2,
          learning_stage = $3,
          total_xp = GREATEST(total_xp, $4),
          streak = $5,
          longest_streak = GREATEST(longest_streak, $5),
          completed_lessons = GREATEST(completed_lessons, $6),
          last_activity_at = now(),
          updated_at = now()
         WHERE id = $1`,
        [user.id, level, currentStage, xp, streak, completedCount]
      );

      // Record daily activity
      await pool.query(
        `INSERT INTO public.daily_activity (user_id, date, xp_earned, lessons_completed)
         VALUES ($1, CURRENT_DATE, $2, $3)
         ON CONFLICT (user_id, date) DO UPDATE SET
          xp_earned = GREATEST(public.daily_activity.xp_earned, EXCLUDED.xp_earned),
          lessons_completed = GREATEST(public.daily_activity.lessons_completed, EXCLUDED.lessons_completed)`,
        [user.id, xp, completedCount]
      );

      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (e) {
    console.error("[api/store] error:", e);
    return res.status(500).json({ error: String(e.message || e) });
  }
};
