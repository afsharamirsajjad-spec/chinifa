// Chinify Detailed Progress API
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
    await initDb();
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "no-session" });

    if (req.method === "GET") {
      if (!pool) return res.status(500).json({ error: "db-unavailable" });

      const profileRes = await pool.query(
        `SELECT id, email, full_name, avatar_url, hsk_level, learning_stage, total_xp, streak, longest_streak, completed_lessons, last_activity_at, created_at FROM public.profiles WHERE id = $1`,
        [user.id]
      );
      const progressRes = await pool.query(
        `SELECT hsk_level, current_lesson, current_stage, completed_lessons, completed_stages, correct_answers, incorrect_answers, total_learning_time_sec, updated_at FROM public.user_progress WHERE user_id = $1`,
        [user.id]
      );
      const completionsRes = await pool.query(
        `SELECT lesson_id, stage_id, lesson_index, stage_index, xp_earned, correct_count, incorrect_count, completed_at FROM public.lesson_completions WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 50`,
        [user.id]
      );
      const activityRes = await pool.query(
        `SELECT date, xp_earned, lessons_completed, time_spent_sec FROM public.daily_activity WHERE user_id = $1 ORDER BY date DESC LIMIT 30`,
        [user.id]
      );

      return res.status(200).json({
        profile: profileRes.rows[0] || null,
        progress: progressRes.rows[0] || null,
        recentCompletions: completionsRes.rows,
        dailyActivity: activityRes.rows
      });
    }

    // POST /api/progress - record lesson or stage completion
    if (req.method === "POST") {
      const body = req.body || {};
      const { lessonId, stageId, lessonIndex, stageIndex, xpEarned, correctCount, incorrectCount, durationSec, hskLevel } = body;

      if (lessonIndex === undefined || stageIndex === undefined) {
        return res.status(400).json({ error: "missing-parameters" });
      }

      const level = hskLevel || "HSK 1";

      await pool.query(
        `INSERT INTO public.lesson_completions (
          user_id, hsk_level, lesson_id, stage_id, lesson_index, stage_index,
          xp_earned, correct_count, incorrect_count, duration_sec, completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
        ON CONFLICT (user_id, hsk_level, lesson_index, stage_index)
        DO UPDATE SET
          xp_earned = GREATEST(public.lesson_completions.xp_earned, EXCLUDED.xp_earned),
          correct_count = GREATEST(public.lesson_completions.correct_count, EXCLUDED.correct_count),
          completed_at = now()`,
        [
          user.id,
          level,
          String(lessonId || `lesson-${lessonIndex}`),
          String(stageId || `stage-${stageIndex}`),
          Number(lessonIndex),
          Number(stageIndex),
          Number(xpEarned) || 10,
          Number(correctCount) || 0,
          Number(incorrectCount) || 0,
          Number(durationSec) || 0
        ]
      );

      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
