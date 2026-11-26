// chinifa Authentication & Resend Email Verification API
// Supports:
// 1. Sending 6-digit OTP codes via Resend API (https://api.resend.com/emails)
// 2. Verifying OTP codes & user registration / login
// 3. Password login & Supabase / PostgreSQL database sync

const crypto = require("crypto");
const {
  supabaseAdmin,
  supabaseClient,
  pool,
  initDb,
  signSessionToken,
  hashPassword,
  verifyPassword,
  getAuthUser,
  stableUserId,
} = require("./db");

// Global in-memory OTP cache for high-speed & reliable verification across invocations
globalThis.__chinifa_otps = globalThis.__chinifa_otps || new Map();
const otpCache = globalThis.__chinifa_otps;

// Global in-memory Subscriptions cache (persists PRO status across calls)
globalThis.__chinifa_subscriptions = globalThis.__chinifa_subscriptions || new Map();
const subCache = globalThis.__chinifa_subscriptions;

function isUserPro(email) {
  if (!email) return false;
  const em = String(email).trim().toLowerCase();
  const s = subCache.get(em);
  if (s && s.expiresAt > Date.now()) return true;
  return false;
}

function setUserPro(email, planId) {
  const em = String(email).trim().toLowerCase();
  const now = Date.now();
  const durationDays = planId === "monthly" ? 30 : (planId === "quarterly" ? 90 : 365);
  const sub = {
    isPro: true,
    plan: planId || "annual",
    startedAt: now,
    expiresAt: now + durationDays * 86400000,
  };
  subCache.set(em, sub);
  return sub;
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpCache.entries()) {
    if (value.expiresAt < now) {
      otpCache.delete(key);
    }
  }
}, 60000).unref?.();

// DB connections and auth helpers are provided by ./db.js

function cors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
}

function validEmail(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || "").trim());
}

function generateCode() {
  return String(crypto.randomInt(100000, 1000000));
}

// Send Email via Resend API
async function sendResendOtpEmail(email, code) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[Resend] RESEND_API_KEY not configured. OTP for ${email}: ${code}`);
    return { ok: true, devMode: true };
  }

  const from = process.env.RESEND_FROM || "Chinifa <onboarding@resend.dev>";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>کد ورود چی‌نی‌فا</title>
    </head>
    <body style="font-family:Tahoma,'Vazirmatn',Arial,sans-serif;background-color:#F8FAFC;margin:0;padding:28px 16px;direction:rtl;text-align:right;">
      <div style="max-width:460px;margin:0 auto;background:#FFFFFF;border-radius:20px;border:1px solid #E2E8F0;padding:32px 24px;box-shadow:0 12px 36px rgba(15,23,42,0.06);">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="display:inline-block;width:48px;height:48px;line-height:48px;background:linear-gradient(135deg,#10B981 0%,#059669 100%);color:#FFFFFF;font-size:24px;font-weight:bold;border-radius:14px;box-shadow:0 6px 18px rgba(16,185,129,0.35);">龙</div>
          <h2 style="color:#0F172A;font-size:20px;font-weight:900;margin:14px 0 4px;">ورود به سامانه چی‌نی‌فا</h2>
          <p style="color:#64748B;font-size:13px;margin:0;">آموزش هوشمند و تعاملی زبان چینی</p>
        </div>

        <div style="background:linear-gradient(135deg,#ECFDF5 0%,#F0FDF4 100%);border:2px dashed #10B981;border-radius:16px;padding:24px 16px;text-align:center;margin:24px 0;">
          <div style="font-size:13px;color:#047857;font-weight:700;margin-bottom:8px;">کد تایید یکبارمصرف شما:</div>
          <div style="font-family:Courier,monospace;font-size:40px;font-weight:900;letter-spacing:10px;color:#065F46;direction:ltr;display:inline-block;">${code}</div>
        </div>

        <p style="color:#475569;font-size:13px;line-height:1.8;margin:16px 0 0;text-align:center;">
          این کد تا <strong>۱۰ دقیقه</strong> آینده معتبر است و فقط یک‌بار قابل استفاده است.<br>
          اگر شما این درخواست را ثبت نکرده‌اید، نیازی به انجام کاری نیست و این پیام را نادیده بگیرید.
        </p>

        <div style="margin-top:28px;padding-top:18px;border-top:1px solid #F1F5F9;text-align:center;font-size:12px;color:#94A3B8;">
          چی‌نی‌فا (chinifa) · پلتفرم جامع آموزش زبان چینی
        </div>
      </div>
    </body>
    </html>
  `;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      from: from,
      to: [email],
      subject: `کد تایید ورود به چی‌نی‌فا: ${code}`,
      html: htmlContent,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const errorMsg = data.message || `HTTP ${resp.status}`;
    console.error("[Resend API Error]:", errorMsg);
    throw new Error(errorMsg);
  }

  return { ok: true, id: data.id };
}

module.exports = async (req, res) => {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  let body = {};
  if (req.method === "POST") {
    if (typeof req.body === "object" && req.body !== null) {
      body = req.body;
    } else if (typeof req.body === "string" && req.body) {
      try { body = JSON.parse(req.body); } catch(e) {}
    }
  }

  const action = String(req.query.action || body.action || "").toLowerCase().trim();

  try {
    // ----------------------------------------------------
    // ۱. ارسال کد تایید با Resend: action=send-otp
    // ----------------------------------------------------
    if (action === "send-otp" || action === "send-code") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!validEmail(email)) {
        return res.status(400).json({ error: "bad-email", message: "لطفاً یک آدرس ایمیل معتبر وارد کنید." });
      }

      // Rate limiting: max 1 request every 40 seconds per email
      const existing = otpCache.get(email);
      const now = Date.now();
      if (existing && now - existing.createdAt < 40000) {
        const remaining = Math.ceil((40000 - (now - existing.createdAt)) / 1000);
        return res.status(429).json({
          error: "rate-limited",
          message: `لطفاً ${remaining} ثانیه دیگر مجدداً تلاش کنید.`,
          retryAfter: remaining,
        });
      }

      const code = generateCode();
      const codeHash = crypto.createHash("sha256").update(`${email}:${code}`).digest("hex");
      const expiresAt = now + 10 * 60 * 1000; // 10 minutes
      const secret = process.env.AUTH_SECRET || process.env.RESEND_API_KEY || "chinifa-otp-hmac-secret-v1";
      const payloadB64 = Buffer.from(JSON.stringify({ email, hash: codeHash, expiresAt })).toString("base64url");
      const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
      const otpToken = `${payloadB64}.${sig}`;

      otpCache.set(email, {
        hash: codeHash,
        code: code, // Saved for dev log comparison
        attempts: 0,
        createdAt: now,
        expiresAt: expiresAt,
      });

      try {
        const sendResult = await sendResendOtpEmail(email, code);
        return res.status(200).json({
          ok: true,
          otpToken: otpToken,
          message: sendResult.devMode
            ? "کد تایید آماده شد (حالت توسعه - در کنسول سرور)"
            : "کد تایید ۶ رقمی با موفقیت به ایمیل شما ارسال شد.",
          devMode: !!sendResult.devMode,
          code: sendResult.devMode ? code : undefined,
        });
      } catch (err) {
        return res.status(500).json({
          error: "resend-failed",
          message: "خطا در ارسال ایمیل با سرویس Resend: " + err.message,
        });
      }
    }

    // ----------------------------------------------------
    // ۲. بررسی و تایید کد: action=verify-otp
    // ----------------------------------------------------
    if (action === "verify-otp" || action === "verify-code") {
      const email = String(body.email || "").trim().toLowerCase();
      const code = String(body.code || "").trim();
      const name = String(body.name || "").trim();
      const otpToken = String(body.otpToken || "").trim();

      if (!validEmail(email) || !code || code.length !== 6) {
        return res.status(400).json({ error: "bad-params", message: "ایمیل یا کد وارد شده صحیح نیست." });
      }

      const inputHash = crypto.createHash("sha256").update(`${email}:${code}`).digest("hex");
      let verified = false;

      // Primary: verify stateless HMAC token (works across all Vercel serverless instances)
      if (otpToken && otpToken.includes(".")) {
        const parts = otpToken.split(".");
        const payloadB64 = parts[0];
        const sig = parts[1];
        const secret = process.env.AUTH_SECRET || process.env.RESEND_API_KEY || "chinifa-otp-hmac-secret-v1";
        const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
        if (sig === expectedSig) {
          try {
            const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
            if (parsed.expiresAt < Date.now()) {
              return res.status(400).json({ error: "expired-otp", message: "کد تایید منقضی شده است." });
            }
            if (parsed.email === email && parsed.hash === inputHash) {
              verified = true;
            } else {
              return res.status(400).json({ error: "invalid-code", message: "کد ۶ رقمی وارد شده اشتباه است." });
            }
          } catch (e) {}
        }
      }

      // Fallback: check in-memory cache
      if (!verified) {
        const cached = otpCache.get(email);
        if (!cached) {
          return res.status(400).json({ error: "expired-otp", message: "کد تایید منقضی شده است. لطفاً کد جدید دریافت کنید." });
        }

        if (cached.expiresAt < Date.now()) {
          otpCache.delete(email);
          return res.status(400).json({ error: "expired-otp", message: "کد تایید منقضی شده است." });
        }

        if (cached.attempts >= 5) {
          otpCache.delete(email);
          return res.status(400).json({ error: "too-many-attempts", message: "تعداد دفعات اشتباه بیش از حد مجاز است. لطفاً کد جدید بگیرید." });
        }

        if (inputHash !== cached.hash) {
          cached.attempts += 1;
          return res.status(400).json({ error: "invalid-code", message: "کد ۶ رقمی وارد شده اشتباه است." });
        }
        verified = true;
      }

      // Verified successfully!
      otpCache.delete(email);
      await initDb();

      let userId = stableUserId(email);
      let displayName = name || email.split("@")[0];
      let proStatus = isUserPro(email);
      let storeSnapshot = null;

      if (pool) {
        try {
          const upsertRes = await pool.query(
            `INSERT INTO public.chinifa_users (id, email, full_name, hsk_level, is_pro)
             VALUES ($1, $2, $3, 'HSK 1', $4)
             ON CONFLICT (email) DO UPDATE SET
               full_name = COALESCE(NULLIF($3, ''), public.chinifa_users.full_name),
               updated_at = now()
             RETURNING id, email, full_name, hsk_level, status, role, is_pro, pro_expires_at`,
            [userId, email, displayName, proStatus]
          );
          if (upsertRes.rows[0]) {
            const row = upsertRes.rows[0];
            if (row.status === "suspended") {
              return res.status(403).json({ error: "account-suspended", message: "حساب کاربری شما توسط مدیر مسدود شده است." });
            }
            userId = row.id || userId;
            displayName = row.full_name || displayName;
            proStatus = proStatus || row.status === "vip" || !!(row.is_pro && (!row.pro_expires_at || new Date(row.pro_expires_at).getTime() > Date.now()));
          }
          const kvRes = await pool.query(
            `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR email = $2 ORDER BY updated_at DESC LIMIT 1`,
            [userId, email]
          );
          if (kvRes.rows[0] && kvRes.rows[0].value) {
            storeSnapshot = kvRes.rows[0].value;
          }
        } catch (e) {}
      }

      const token = signSessionToken({ uid: userId, email, name: displayName });
      const userProfile = {
        id: userId,
        email: email,
        fullName: displayName,
        hskLevel: "HSK 1",
        learningStage: 1,
        totalXp: 120,
        streak: 1,
        verified: true,
        isPro: proStatus,
        pro: proStatus,
        verifiedAt: new Date().toISOString(),
      };

      return res.status(200).json({
        ok: true,
        message: "ورود با موفقیت انجام شد.",
        token: token,
        id: userId,
        username: displayName,
        email: email,
        isPro: proStatus,
        pro: proStatus,
        store: storeSnapshot,
        user: userProfile,
      });
    }

    // ----------------------------------------------------
    // ۳. ثبت‌نام عادی: action=register
    // ----------------------------------------------------
    if (action === "register") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const fullName = String(body.name || body.fullName || email.split("@")[0]).trim();
      const hskLevel = String(body.hskLevel || "HSK 1").trim();

      if (!validEmail(email)) {
        return res.status(400).json({ error: "bad-email", message: "آدرس ایمیل معتبر نیست." });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "weak-password", message: "کلمه عبور باید حداقل ۶ نویسه باشد." });
      }

      await initDb();
      let userId = stableUserId(email);
      const pwHash = hashPassword(password);
      const now = Date.now();
      const code = generateCode();
      const codeHash = crypto.createHash("sha256").update(`${email}:${code}`).digest("hex");
      const expiresAt = now + 10 * 60 * 1000;
      const secret = process.env.AUTH_SECRET || process.env.RESEND_API_KEY || "chinifa-otp-hmac-secret-v1";
      const payloadB64 = Buffer.from(JSON.stringify({ email, hash: codeHash, expiresAt })).toString("base64url");
      const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
      const otpToken = `${payloadB64}.${sig}`;

      otpCache.set(email, {
        hash: codeHash,
        code: code,
        attempts: 0,
        createdAt: now,
        expiresAt: expiresAt,
      });

      if (supabaseAdmin) {
        try {
          const { data: created } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName, hsk_level: hskLevel },
          });
          if (created && created.user && created.user.id) userId = created.user.id;
        } catch (e) {}
      }

      let regProStatus = isUserPro(email);
      if (pool) {
        try {
          const uRes = await pool.query(
            `INSERT INTO public.chinifa_users (id, email, full_name, password_hash, hsk_level, is_pro)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (email) DO UPDATE SET
               full_name = COALESCE(NULLIF($3, ''), public.chinifa_users.full_name),
               password_hash = $4,
               hsk_level = $5,
               updated_at = now()
             RETURNING id, is_pro, pro_expires_at`,
            [userId, email, fullName, pwHash, hskLevel, regProStatus]
          );
          if (uRes.rows[0]) {
            userId = uRes.rows[0].id || userId;
            regProStatus = regProStatus || !!(uRes.rows[0].is_pro && (!uRes.rows[0].pro_expires_at || new Date(uRes.rows[0].pro_expires_at).getTime() > Date.now()));
          }
        } catch (e) {}
      }

      const token = signSessionToken({ uid: userId, email, name: fullName });

      let sendResult = { ok: true, devMode: false };
      try {
        sendResult = await sendResendOtpEmail(email, code);
      } catch (e) {}

      const userProfile = {
        id: userId,
        email: email,
        fullName: fullName,
        hskLevel: hskLevel,
        learningStage: 1,
        totalXp: 100,
        streak: 1,
        verified: false,
        isPro: regProStatus,
        pro: regProStatus,
      };

      return res.status(200).json({
        ok: true,
        otpToken: otpToken,
        devMode: !!sendResult.devMode,
        code: sendResult.devMode ? code : undefined,
        message: "ثبت‌نام با موفقیت انجام شد. کد فعال‌سازی به ایمیل ارسال گردید.",
        token: token,
        id: userId,
        username: fullName,
        email: email,
        isPro: regProStatus,
        pro: regProStatus,
        user: userProfile,
      });
    }

    // ----------------------------------------------------
    // ۴. ورود با کلمه عبور: action=login
    // ----------------------------------------------------
    if (action === "login") {
      const email = String(body.email || body.username || "").trim().toLowerCase();
      const password = String(body.password || "");

      if (!email || !password) {
        return res.status(400).json({ error: "missing-credentials", message: "ایمیل و کلمه عبور الزامی است." });
      }

      await initDb();

      // 1. Check PostgreSQL chinifa_users first if configured
      if (pool) {
        try {
          const uRes = await pool.query(
            `SELECT id, email, full_name, password_hash, hsk_level, status, role, is_pro, pro_expires_at
             FROM public.chinifa_users WHERE email = $1 LIMIT 1`,
            [email]
          );
          if (uRes.rows[0]) {
            const row = uRes.rows[0];
            if (row.status === "suspended") {
              return res.status(403).json({ error: "account-suspended", message: "حساب کاربری شما توسط مدیر مسدود شده است." });
            }
            if (row.password_hash && !verifyPassword(password, row.password_hash)) {
              return res.status(401).json({ error: "invalid-credentials", message: "ایمیل یا کلمه عبور اشتباه است." });
            }
            const proStatus = isUserPro(email) || row.status === "vip" || !!(row.is_pro && (!row.pro_expires_at || new Date(row.pro_expires_at).getTime() > Date.now()));
            let storeSnapshot = null;
            const kvRes = await pool.query(
              `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR email = $2 ORDER BY updated_at DESC LIMIT 1`,
              [row.id, email]
            );
            if (kvRes.rows[0] && kvRes.rows[0].value) storeSnapshot = kvRes.rows[0].value;
            const displayName = row.full_name || email.split("@")[0];
            const token = signSessionToken({ uid: row.id, email, name: displayName });
            return res.status(200).json({
              ok: true,
              message: "ورود موفقیت‌آمیز بود.",
              token: token,
              id: row.id,
              username: displayName,
              email: email,
              isPro: proStatus,
              pro: proStatus,
              store: storeSnapshot,
              user: {
                id: row.id,
                email: email,
                fullName: displayName,
                hskLevel: row.hsk_level || "HSK 1",
                verified: true,
                isPro: proStatus,
                pro: proStatus,
              },
            });
          }
        } catch (e) {}
      }

      // 2. If Supabase is configured, use real Supabase login
      if (supabaseClient && validEmail(email)) {
        try {
          const { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
          });
          if (!authErr && authData && authData.user) {
            const userEmail = (authData.user.email || email).toLowerCase();
            const proStatus = isUserPro(userEmail);
            const displayName = authData.user.user_metadata?.full_name || userEmail.split("@")[0];
            return res.status(200).json({
              ok: true,
              token: authData.session?.access_token,
              id: authData.user.id,
              username: displayName,
              email: userEmail,
              isPro: proStatus,
              pro: proStatus,
              user: {
                id: authData.user.id,
                email: userEmail,
                fullName: displayName,
                hskLevel: "HSK 1",
                verified: true,
                isPro: proStatus,
                pro: proStatus,
              },
            });
          }
        } catch (e) {}
      }

      // 3. Fallback when DB is not connected (local/demo mode)
      const userId = stableUserId(email);
      const displayName = email.split("@")[0];
      const token = signSessionToken({ uid: userId, email, name: displayName });
      const proStatus = isUserPro(email);

      return res.status(200).json({
        ok: true,
        message: "ورود موفقیت‌آمیز بود.",
        token: token,
        id: userId,
        username: displayName,
        email: email,
        isPro: proStatus,
        pro: proStatus,
        user: {
          id: userId,
          email: email,
          fullName: displayName,
          hskLevel: "HSK 1",
          verified: true,
          isPro: proStatus,
          pro: proStatus,
          streak: 1,
          totalXp: 150,
        },
      });
    }

    // ----------------------------------------------------
    // ۵. خرید و فعال‌سازی اشتراک ویژه: action=subscribe / pay
    // ----------------------------------------------------
    if (action === "subscribe" || action === "pay") {
      const email = String(body.email || "").trim().toLowerCase();
      const planId = String(body.planId || body.plan || "annual");

      if (!validEmail(email)) {
        return res.status(400).json({ error: "bad-email", message: "ایمیل معتبر نیست." });
      }

      const sub = setUserPro(email, planId);
      await initDb();

      if (pool) {
        try {
          await pool.query(
            `UPDATE public.chinifa_users
             SET is_pro = true, pro_plan = $2, pro_expires_at = to_timestamp($3 / 1000.0), updated_at = now()
             WHERE email = $1`,
            [email, sub.plan, sub.expiresAt]
          );
        } catch (e) {}
      }

      return res.status(200).json({
        ok: true,
        message: "اشتراک ویژه Chinify PRO با موفقیت فعال شد.",
        isPro: true,
        plan: sub.plan,
        expiresAt: sub.expiresAt,
        user: {
          email: email,
          isPro: true,
          pro: true,
        },
      });
    }

    // ----------------------------------------------------
    // ۶. استعلام وضعیت اشتراک ویژه: action=check-pro
    // ----------------------------------------------------
    if (action === "check-pro") {
      const email = String(body.email || req.query.email || "").trim().toLowerCase();
      const pro = isUserPro(email);
      return res.status(200).json({
        ok: true,
        email: email,
        isPro: pro,
        pro: pro,
      });
    }

    // ----------------------------------------------------
    // ۷. بررسی وضعیت احراز هویت / جلسه: action=session
    // ----------------------------------------------------
    if (action === "session" || action === "me") {
      const user = await getAuthUser(req);
      if (!user) {
        return res.status(401).json({ ok: false, error: "no-session" });
      }

      await initDb();
      let proStatus = isUserPro(user.email);
      let fullName = user.fullName;
      let storeSnapshot = null;

      if (pool) {
        try {
          const uRes = await pool.query(
            `SELECT full_name, status, role, is_pro, pro_expires_at FROM public.chinifa_users WHERE id = $1 OR ($2 <> '' AND email = $2) LIMIT 1`,
            [user.id, user.email || ""]
          );
          if (uRes.rows[0]) {
            if (uRes.rows[0].status === "suspended") {
              return res.status(403).json({ ok: false, error: "account-suspended", message: "حساب کاربری مسدود شده است." });
            }
            fullName = uRes.rows[0].full_name || fullName;
            proStatus = proStatus || uRes.rows[0].status === "vip" || !!(uRes.rows[0].is_pro && (!uRes.rows[0].pro_expires_at || new Date(uRes.rows[0].pro_expires_at).getTime() > Date.now()));
          }
          const kvRes = await pool.query(
            `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
            [user.id, user.email || ""]
          );
          if (kvRes.rows[0] && kvRes.rows[0].value) {
            storeSnapshot = kvRes.rows[0].value;
          }
        } catch (e) {}
      }

      return res.status(200).json({
        ok: true,
        authenticated: true,
        id: user.id,
        username: fullName,
        email: user.email,
        isPro: proStatus,
        pro: proStatus,
        store: storeSnapshot,
        user: {
          id: user.id,
          email: user.email,
          fullName: fullName,
          isPro: proStatus,
          pro: proStatus,
        },
      });
    }

    // ----------------------------------------------------
    // ۸. تغییر کلمه عبور: action=change-password
    // ----------------------------------------------------
    if (action === "change-password") {
      const user = await getAuthUser(req);
      if (!user) return res.status(401).json({ error: "no-session" });
      const newPw = String(body.password || "");
      if (newPw.length < 6) return res.status(400).json({ error: "کلمه عبور باید حداقل ۶ نویسه باشد.", field: "password" });
      await initDb();
      if (pool && user.email) {
        await pool.query(
          `UPDATE public.chinifa_users SET password_hash = $2, updated_at = now() WHERE email = $1`,
          [user.email, hashPassword(newPw)]
        );
      }
      return res.status(200).json({ ok: true });
    }

    // ----------------------------------------------------
    // ۹. حذف حساب کاربری: action=delete-account
    // ----------------------------------------------------
    if (action === "delete-account") {
      const user = await getAuthUser(req);
      if (!user) return res.status(401).json({ error: "no-session" });
      await initDb();
      if (pool) {
        await pool.query(`DELETE FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2)`, [user.id, user.email || ""]);
        await pool.query(`DELETE FROM public.chinifa_users WHERE id = $1 OR ($2 <> '' AND email = $2)`, [user.id, user.email || ""]);
      }
      return res.status(200).json({ ok: true });
    }

    // ----------------------------------------------------
    // ۶. خروج از حساب: action=logout
    // ----------------------------------------------------
    if (action === "logout") {
      return res.status(200).json({ ok: true, message: "خروج موفقیت‌آمیز بود." });
    }

    return res.status(400).json({ error: "unknown-action", message: "عملیات درخواست شده نامعتبر است." });
  } catch (err) {
    console.error("[api/auth] unexpected error:", err);
    return res.status(500).json({ error: "server-error", message: err.message || "خطای غیرمنتظره در سرور" });
  }
};
