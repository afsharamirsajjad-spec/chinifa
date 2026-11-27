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
  cors,
  parseBody,
  timingSafeEqualStr,
  isProduction,
  isDbRowPro,
  getSessionSecret,
  signSessionToken,
  hashPassword,
  verifyPassword,
  getAuthUser,
  stableUserId,
} = require("./db");

// Global in-memory OTP cache for rate limiting & fallback verification
globalThis.__chinifa_otps = globalThis.__chinifa_otps || new Map();
const otpCache = globalThis.__chinifa_otps;

// Bounded set of consumed OTP token hashes to prevent same-instance replay
globalThis.__chinifa_used_otps = globalThis.__chinifa_used_otps || new Map();
const usedOtpTokens = globalThis.__chinifa_used_otps;

// Global in-memory Subscriptions cache (used only when no DB is configured)
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

function getOtpSecret() {
  return process.env.OTP_SECRET || getSessionSecret();
}

function createOtpToken(email, codeHash, expiresAt, meta) {
  const payload = { email, hash: codeHash, expiresAt };
  if (meta && typeof meta === "object") payload.meta = meta;
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getOtpSecret()).update(payloadB64).digest("base64url");
  return `${payloadB64}.${sig}`;
}

function verifyOtpToken(otpToken, email, inputHash) {
  if (!otpToken || typeof otpToken !== "string" || !otpToken.includes(".")) {
    return { status: "missing" };
  }
  const parts = otpToken.split(".");
  if (parts.length !== 2) return { status: "invalid" };
  const [payloadB64, sig] = parts;
  let expectedSig;
  try {
    expectedSig = crypto.createHmac("sha256", getOtpSecret()).update(payloadB64).digest("base64url");
  } catch (e) {
    console.error("[api/auth verifyOtpToken]", e.message);
    return { status: "invalid" };
  }
  if (!timingSafeEqualStr(sig, expectedSig)) {
    return { status: "invalid" };
  }
  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!parsed || parsed.expiresAt < Date.now()) {
      return { status: "expired" };
    }
    const tokenKey = `${parsed.email}:${parsed.hash}`;
    if (usedOtpTokens.has(tokenKey)) {
      return { status: "expired" };
    }
    if (parsed.email === email && timingSafeEqualStr(parsed.hash, inputHash)) {
      usedOtpTokens.set(tokenKey, parsed.expiresAt);
      return { status: "ok", meta: parsed.meta || null };
    }
    return { status: "mismatch" };
  } catch (e) {
    return { status: "invalid" };
  }
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpCache.entries()) {
    if (value.expiresAt < now) {
      otpCache.delete(key);
    }
  }
  for (const [key, exp] of usedOtpTokens.entries()) {
    if (exp < now) {
      usedOtpTokens.delete(key);
    }
  }
}, 60000).unref?.();

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

  const from = process.env.RESEND_FROM || "chinifa <noreply@chinifarsi.ir>";
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

  const body = req.method === "POST" ? parseBody(req) : {};
  const action = String((req.query && req.query.action) || body.action || "").toLowerCase().trim();

  try {
    // ----------------------------------------------------
    // ۰. تنظیمات عمومی اپ و ثبت بازخورد کاربران
    // ----------------------------------------------------
    if (action === "app-config") {
      res.setHeader("Cache-Control", "no-store, max-age=0");
      const defaults = {
        appName: "chinifa",
        appTitleFa: "چی‌نی‌فا — سامانه آموزش زبان چینی",
        appVersion: "2.4.0",
        minSupportedVersion: "2.0.0",
        maintenanceMode: false,
        announcementActive: false,
        announcementText: "",
        announcementType: "info",
      };
      await initDb();
      if (pool) {
        try {
          const r = await pool.query(`SELECT value FROM public.chinifa_settings WHERE key = 'app_settings' LIMIT 1`);
          if (r.rows[0] && r.rows[0].value && typeof r.rows[0].value === "object") {
            const s = r.rows[0].value;
            return res.status(200).json({
              ok: true,
              settings: {
                appName: String(s.appName || defaults.appName),
                appTitleFa: String(s.appTitleFa || defaults.appTitleFa),
                appVersion: String(s.appVersion || defaults.appVersion),
                minSupportedVersion: String(s.minSupportedVersion || defaults.minSupportedVersion),
                maintenanceMode: Boolean(s.maintenanceMode),
                announcementActive: Boolean(s.announcementActive),
                announcementText: String(s.announcementText || ""),
                announcementType: String(s.announcementType || "info"),
              },
            });
          }
        } catch (e) {
          console.error("[api/auth app-config db]", e.message);
        }
      }
      return res.status(200).json({ ok: true, settings: defaults });
    }

    if (action === "feedback") {
      if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "method-not-allowed" });
      }
      const user = await getAuthUser(req);
      const fbType = String(body.type || "پیشنهاد").trim().slice(0, 40) || "پیشنهاد";
      const subject = String(body.subject || "").trim().slice(0, 120);
      const msgRaw = String(body.message || body.content || "").trim();
      if (msgRaw.length < 3) {
        return res.status(400).json({ ok: false, error: "empty-message", message: "لطفاً متن پیام خود را بنویسید (حداقل ۳ نویسه)." });
      }
      const messageText = (subject ? subject + " — " + msgRaw : msgRaw).slice(0, 2000);
      const userEmail = String((user && user.email) || body.email || "").trim().toLowerCase().slice(0, 120);
      const userName = String((user && user.fullName) || body.name || body.userName || (userEmail ? userEmail.split("@")[0] : "کاربر مهمان")).trim().slice(0, 80);

      // Rate limit per sender key (20s)
      globalThis.__chinifa_fb_rl = globalThis.__chinifa_fb_rl || new Map();
      const rlKey = userEmail || String((req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "anon").split(",")[0].trim();
      const lastAt = globalThis.__chinifa_fb_rl.get(rlKey) || 0;
      if (Date.now() - lastAt < 20000) {
        return res.status(429).json({ ok: false, error: "rate-limited", message: "لطفاً چند ثانیه دیگر پیام بعدی را ارسال کنید." });
      }
      globalThis.__chinifa_fb_rl.set(rlKey, Date.now());

      const fbId = "FB-" + Date.now().toString(36) + "-" + crypto.randomBytes(2).toString("hex");
      await initDb();
      if (!pool) {
        return res.status(503).json({ ok: false, error: "db-unavailable", message: "سرویس پایگاه داده در دسترس نیست." });
      }
      await pool.query(
        `INSERT INTO public.chinifa_feedback (id, user_email, user_name, type, message, status, reply)
         VALUES ($1, $2, $3, $4, $5, 'در انتظار پاسخ', '')`,
        [fbId, userEmail, userName, fbType, messageText]
      );
      return res.status(200).json({
        ok: true,
        id: fbId,
        message: "پیام شما با موفقیت ثبت شد و در پنل پشتیبانی بررسی می‌شود.",
      });
    }

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
      const otpToken = createOtpToken(email, codeHash, expiresAt);

      otpCache.set(email, {
        hash: codeHash,
        attempts: 0,
        createdAt: now,
        expiresAt: expiresAt,
      });

      try {
        const sendResult = await sendResendOtpEmail(email, code);
        const exposeDevCode = Boolean(sendResult.devMode && !isProduction());
        return res.status(200).json({
          ok: true,
          otpToken: otpToken,
          message: sendResult.devMode
            ? "کد تایید آماده شد (حالت توسعه - در کنسول سرور)"
            : "کد تایید ۶ رقمی با موفقیت به ایمیل شما ارسال شد.",
          devMode: exposeDevCode,
          code: exposeDevCode ? code : undefined,
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
      let otpMeta = null;

      // Primary: verify stateless HMAC token (works across all Vercel serverless instances)
      const tokenCheck = verifyOtpToken(otpToken, email, inputHash);
      if (tokenCheck.status === "expired") {
        return res.status(400).json({ error: "expired-otp", message: "کد تایید منقضی شده است." });
      }
      if (tokenCheck.status === "mismatch") {
        return res.status(400).json({ error: "invalid-code", message: "کد ۶ رقمی وارد شده اشتباه است." });
      }
      if (tokenCheck.status === "ok") {
        verified = true;
        otpMeta = tokenCheck.meta || null;
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

        if (!timingSafeEqualStr(inputHash, cached.hash)) {
          cached.attempts += 1;
          return res.status(400).json({ error: "invalid-code", message: "کد ۶ رقمی وارد شده اشتباه است." });
        }
        verified = true;
        otpMeta = cached.meta || null;
      }

      // Verified successfully!
      otpCache.delete(email);
      await initDb();

      const regFullName = String((otpMeta && otpMeta.fullName) || name || email.split("@")[0]).trim().slice(0, 80);
      const regPwHash = (otpMeta && otpMeta.pwHash) ? String(otpMeta.pwHash) : null;
      const regLevel = String((otpMeta && otpMeta.hskLevel) || "HSK 1").trim().slice(0, 32);

      let userId = stableUserId(email);
      let displayName = regFullName;
      let hskLevel = regLevel || "HSK 1";
      let proStatus = isUserPro(email);
      let storeSnapshot = null;

      if (pool) {
        try {
          const upsertRes = await pool.query(
            `INSERT INTO public.chinifa_users (id, email, full_name, password_hash, hsk_level, is_pro)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (email) DO UPDATE SET
               full_name = COALESCE(NULLIF($3, ''), public.chinifa_users.full_name),
               password_hash = COALESCE($4, public.chinifa_users.password_hash),
               updated_at = now()
             RETURNING id, email, full_name, hsk_level, status, role, is_pro, pro_expires_at`,
            [userId, email, regFullName, regPwHash, hskLevel, proStatus]
          );
          if (upsertRes.rows[0]) {
            const row = upsertRes.rows[0];
            if (row.status === "suspended") {
              return res.status(403).json({ error: "account-suspended", message: "حساب کاربری شما توسط مدیر مسدود شده است." });
            }
            userId = row.id || userId;
            displayName = row.full_name || displayName;
            hskLevel = row.hsk_level || hskLevel;
            proStatus = proStatus || isDbRowPro(row);
          }
          const kvRes = await pool.query(
            `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR email = $2 ORDER BY updated_at DESC LIMIT 1`,
            [userId, email]
          );
          if (kvRes.rows[0] && kvRes.rows[0].value) {
            storeSnapshot = kvRes.rows[0].value;
          }
        } catch (e) {
          console.error("[api/auth verify-otp db]", e.message);
        }
      }

      const token = signSessionToken({ uid: userId, email, name: displayName });
      const userProfile = {
        id: userId,
        email: email,
        fullName: displayName,
        hskLevel: hskLevel,
        learningStage: 1,
        totalXp: 0,
        streak: 0,
        verified: true,
        isPro: proStatus,
        pro: proStatus,
        verifiedAt: new Date().toISOString(),
      };

      return res.status(200).json({
        ok: true,
        message: "ایمیل تایید و حساب کاربری فعال شد.",
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
    // ۳. ثبت‌نام با ارسال کد تایید: action=register
    //    ایمیل تکراری اجازه ثبت‌نام مجدد نمی‌دهد؛ حساب فقط بعد از verify-otp در دیتابیس ثبت می‌شود.
    // ----------------------------------------------------
    if (action === "register") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const fullName = String(body.name || body.fullName || body.username || email.split("@")[0]).trim().slice(0, 80);
      const hskLevel = String(body.hskLevel || "HSK 1").trim().slice(0, 32);

      if (!validEmail(email)) {
        return res.status(400).json({ error: "bad-email", message: "آدرس ایمیل معتبر نیست." });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "weak-password", message: "کلمه عبور باید حداقل ۶ نویسه باشد." });
      }

      await initDb();

      // Reject already-registered email so existing users sign in and restore their progress
      if (pool) {
        try {
          const exRes = await pool.query(
            `SELECT id, status FROM public.chinifa_users WHERE email = $1 LIMIT 1`,
            [email]
          );
          if (exRes.rows[0]) {
            if (exRes.rows[0].status === "suspended") {
              return res.status(403).json({
                error: "account-suspended",
                message: "حساب کاربری با این ایمیل توسط مدیر مسدود شده است.",
              });
            }
            return res.status(409).json({
              ok: false,
              error: "email-exists",
              code: "EMAIL_EXISTS",
              message: "این ایمیل قبلاً ثبت‌نام کرده است. لطفاً از بخش «ورود» با همین ایمیل وارد شوید تا پیشرفت شما بازیابی شود.",
            });
          }
        } catch (e) {
          console.error("[api/auth register dup check]", e.message);
        }
      }

      const pwHash = hashPassword(password);
      const now = Date.now();

      // Rate-limit OTP spam slightly (allow resend after 15s for pending registration)
      const existingOtp = otpCache.get(email);
      if (existingOtp && now - existingOtp.createdAt < 15000) {
        const remaining = Math.ceil((15000 - (now - existingOtp.createdAt)) / 1000);
        return res.status(429).json({
          error: "rate-limited",
          message: `لطفاً ${remaining} ثانیه دیگر برای ارسال مجدد کد تلاش کنید.`,
          retryAfter: remaining,
        });
      }

      const code = generateCode();
      const codeHash = crypto.createHash("sha256").update(`${email}:${code}`).digest("hex");
      const expiresAt = now + 10 * 60 * 1000;
      const pendingMeta = { fullName, pwHash, hskLevel };
      const otpToken = createOtpToken(email, codeHash, expiresAt, pendingMeta);

      otpCache.set(email, {
        hash: codeHash,
        attempts: 0,
        createdAt: now,
        expiresAt: expiresAt,
        meta: pendingMeta,
      });

      let sendResult = { ok: true, devMode: false };
      try {
        sendResult = await sendResendOtpEmail(email, code);
      } catch (e) {
        console.error("[api/auth register resend]", e.message);
        return res.status(500).json({
          error: "resend-failed",
          message: "خطا در ارسال ایمیل تایید: " + e.message,
        });
      }

      const exposeDevCode = Boolean(sendResult.devMode && !isProduction());
      return res.status(200).json({
        ok: true,
        requiresOtp: true,
        otpToken: otpToken,
        devMode: exposeDevCode,
        code: exposeDevCode ? code : undefined,
        email: email,
        message: "کد تایید ۶ رقمی به ایمیل شما ارسال شد. لطفاً برای تکمیل ثبت‌نام کد را وارد کنید.",
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
        let uRes;
        try {
          uRes = await pool.query(
            `SELECT id, email, full_name, password_hash, hsk_level, status, role, is_pro, pro_expires_at
             FROM public.chinifa_users WHERE email = $1 OR lower(split_part(email, '@', 1)) = $1 LIMIT 1`,
            [email]
          );
        } catch (e) {
          console.error("[api/auth login db]", e.message);
          return res.status(500).json({ error: "db-error", message: "خطا در ارتباط با پایگاه داده." });
        }

        if (uRes.rows[0]) {
          const row = uRes.rows[0];
          const realEmail = (row.email || email).toLowerCase();
          if (row.status === "suspended") {
            return res.status(403).json({ error: "account-suspended", message: "حساب کاربری شما توسط مدیر مسدود شده است." });
          }
          if (!row.password_hash) {
            return res.status(401).json({
              error: "password-not-set",
              message: "برای این حساب کلمه عبور تنظیم نشده است. لطفاً با کد تایید ایمیل وارد شوید.",
            });
          }
          if (!verifyPassword(password, row.password_hash)) {
            return res.status(401).json({ error: "invalid-credentials", message: "ایمیل یا کلمه عبور اشتباه است." });
          }
          const proStatus = isUserPro(realEmail) || isDbRowPro(row);
          let storeSnapshot = null;
          const kvRes = await pool.query(
            `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR email = $2 ORDER BY updated_at DESC LIMIT 1`,
            [row.id, realEmail]
          );
          if (kvRes.rows[0] && kvRes.rows[0].value) storeSnapshot = kvRes.rows[0].value;
          const displayName = row.full_name || realEmail.split("@")[0];
          const token = signSessionToken({ uid: row.id, email: realEmail, name: displayName });
          return res.status(200).json({
            ok: true,
            message: "ورود موفقیت‌آمیز بود.",
            token: token,
            id: row.id,
            username: displayName,
            email: realEmail,
            isPro: proStatus,
            pro: proStatus,
            store: storeSnapshot,
            user: {
              id: row.id,
              email: realEmail,
              fullName: displayName,
              hskLevel: row.hsk_level || "HSK 1",
              verified: true,
              isPro: proStatus,
              pro: proStatus,
            },
          });
        }
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
        } catch (e) {
          console.error("[api/auth login supabase]", e.message);
        }
      }

      if (!pool && !supabaseClient) {
        return res.status(503).json({
          error: "auth-unavailable",
          message: "سرویس پایگاه داده برای ورود با کلمه عبور پیکربندی نشده است.",
        });
      }

      return res.status(401).json({
        error: "invalid-credentials",
        message: "ایمیل یا کلمه عبور اشتباه است.",
      });
    }

    // ----------------------------------------------------
    // ۵. خرید و فعال‌سازی اشتراک ویژه: action=subscribe / pay
    //    Requires authenticated session + server-side payment webhook secret
    // ----------------------------------------------------
    if (action === "subscribe" || action === "pay") {
      const user = await getAuthUser(req);
      if (!user) {
        return res.status(401).json({ error: "no-session", message: "ابتدا وارد حساب کاربری شوید." });
      }

      const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || "";
      const providedSecret = String((req.headers && req.headers["x-payment-secret"]) || body.paymentSecret || "").trim();
      if (!webhookSecret || !timingSafeEqualStr(providedSecret, webhookSecret)) {
        return res.status(403).json({
          error: "payment-verification-required",
          message: "فعال‌سازی اشتراک ویژه نیازمند تایید پرداخت معتبر یا اقدام از طریق پنل مدیریت است.",
        });
      }

      const email = String(user.email || body.email || "").trim().toLowerCase();
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
        } catch (e) {
          console.error("[api/auth subscribe db]", e.message);
        }
      }

      return res.status(200).json({
        ok: true,
        message: "اشتراک ویژه chinifa PRO با موفقیت فعال شد.",
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
      const user = await getAuthUser(req);
      if (!user) {
        return res.status(401).json({ ok: false, error: "no-session" });
      }

      await initDb();
      let pro = isUserPro(user.email);
      if (pool) {
        try {
          const uRes = await pool.query(
            `SELECT status, is_pro, pro_expires_at FROM public.chinifa_users WHERE id = $1 OR ($2 <> '' AND email = $2) LIMIT 1`,
            [user.id, user.email || ""]
          );
          if (uRes.rows[0]) {
            pro = pro || isDbRowPro(uRes.rows[0]);
          }
        } catch (e) {
          console.error("[api/auth check-pro db]", e.message);
        }
      }

      return res.status(200).json({
        ok: true,
        email: user.email,
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
            proStatus = proStatus || isDbRowPro(uRes.rows[0]);
          }
          const kvRes = await pool.query(
            `SELECT value FROM public.chinifa_kv_store WHERE user_id = $1 OR ($2 <> '' AND email = $2) ORDER BY updated_at DESC LIMIT 1`,
            [user.id, user.email || ""]
          );
          if (kvRes.rows[0] && kvRes.rows[0].value) {
            storeSnapshot = kvRes.rows[0].value;
          }
        } catch (e) {
          console.error("[api/auth session db]", e.message);
        }
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
