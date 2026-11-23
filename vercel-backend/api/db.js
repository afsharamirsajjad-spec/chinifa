// Database and Supabase Client connection for Chinify
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { createClient } = require("@supabase/supabase-js");
const { Pool } = require("pg");

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabaseAdmin = null;
let supabaseClient = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// PostgreSQL connection pool for migrations & direct relational queries
let pool = null;
const rawPgUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (rawPgUrl) {
  try {
    const parsed = new URL(rawPgUrl);
    parsed.searchParams.delete("sslmode");
    pool = new Pool({
      connectionString: parsed.toString(),
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  } catch (e) {
    console.error("[db.js] Connection URL parse error:", e.message);
  }
}

// Auto-run schema migrations on cold start
let dbInitialized = false;
let dbInitPromise = null;

async function initDb() {
  if (dbInitialized) return;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    if (!pool) {
      console.warn("[initDb] No PostgreSQL connection string available");
      return;
    }

    let client = null;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      // 1. Profiles Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          hsk_level TEXT DEFAULT 'HSK 1',
          learning_stage INTEGER DEFAULT 1,
          total_xp INTEGER DEFAULT 0,
          streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          completed_lessons INTEGER DEFAULT 0,
          last_activity_at TIMESTAMPTZ DEFAULT now(),
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `);

      // 2. User Progress Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
          hsk_level TEXT DEFAULT 'HSK 1',
          current_lesson INTEGER DEFAULT 1,
          current_stage INTEGER DEFAULT 1,
          completed_lessons JSONB DEFAULT '[]'::jsonb,
          completed_stages JSONB DEFAULT '[]'::jsonb,
          correct_answers INTEGER DEFAULT 0,
          incorrect_answers INTEGER DEFAULT 0,
          total_learning_time_sec INTEGER DEFAULT 0,
          state_snapshot JSONB DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `);

      // 3. Lesson Completions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.lesson_completions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          hsk_level TEXT DEFAULT 'HSK 1',
          lesson_id TEXT NOT NULL,
          stage_id TEXT NOT NULL,
          lesson_index INTEGER NOT NULL,
          stage_index INTEGER NOT NULL,
          xp_earned INTEGER DEFAULT 0,
          correct_count INTEGER DEFAULT 0,
          incorrect_count INTEGER DEFAULT 0,
          duration_sec INTEGER DEFAULT 0,
          completed_at TIMESTAMPTZ DEFAULT now(),
          CONSTRAINT unique_user_lesson_stage UNIQUE (user_id, hsk_level, lesson_index, stage_index)
        );
      `);

      // 4. Daily Activity Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.daily_activity (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          date DATE NOT NULL DEFAULT CURRENT_DATE,
          xp_earned INTEGER DEFAULT 0,
          lessons_completed INTEGER DEFAULT 0,
          time_spent_sec INTEGER DEFAULT 0,
          CONSTRAINT unique_user_date UNIQUE (user_id, date)
        );
      `);

      // 5. User Achievements Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.user_achievements (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
          achievement_id TEXT NOT NULL,
          title TEXT NOT NULL,
          unlocked_at TIMESTAMPTZ DEFAULT now(),
          CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
        );
      `);

      // Create indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
        CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON public.lesson_completions(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, date);
      `);

      // Enable Row Level Security (RLS) on all tables
      await client.query(`
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
      `);

      // Create RLS Policies safely (checking pg_policies first)
      const policies = [
        {
          table: "profiles",
          name: "Users can access own profile",
          sql: `CREATE POLICY "Users can access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);`
        },
        {
          table: "user_progress",
          name: "Users can access own progress",
          sql: `CREATE POLICY "Users can access own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);`
        },
        {
          table: "lesson_completions",
          name: "Users can access own completions",
          sql: `CREATE POLICY "Users can access own completions" ON public.lesson_completions FOR ALL USING (auth.uid() = user_id);`
        },
        {
          table: "daily_activity",
          name: "Users can access own activity",
          sql: `CREATE POLICY "Users can access own activity" ON public.daily_activity FOR ALL USING (auth.uid() = user_id);`
        },
        {
          table: "user_achievements",
          name: "Users can access own achievements",
          sql: `CREATE POLICY "Users can access own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);`
        }
      ];

      for (const p of policies) {
        const check = await client.query(
          `SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = $1 AND policyname = $2`,
          [p.table, p.name]
        );
        if (check.rows.length === 0) {
          await client.query(p.sql);
        }
      }

      await client.query("COMMIT");
      dbInitialized = true;
      console.log("[initDb] Supabase database tables & RLS initialized successfully");
    } catch (err) {
      if (client) {
        try { await client.query("ROLLBACK"); } catch (e) {}
      }
      console.error("[initDb] Migration error:", err.message);
      throw err;
    } finally {
      if (client) client.release();
    }
  })();

  return dbInitPromise;
}

module.exports = {
  supabaseAdmin,
  supabaseClient,
  pool,
  initDb
};
