// Real OTP delivery providers: Kavenegar (SMS to Iranian numbers) and Resend (email).
// Plain HTTPS via global fetch — no SDKs, no extra dependencies.
//
// Unconfigured behaviour:
//   production (NODE_ENV=production)  -> delivery fails with otp_provider_unconfigured (503)
//   development (default locally)     -> the code is printed to THIS server's stdout only,
//                                        never in an API response, for local e2e testing.

const env = process.env;

/* ---------- status / configuration detection ---------- */

export const smsConfigured = () => !!(env.KAVENEGAR_API_KEY && env.KAVENEGAR_TEMPLATE);
export const emailConfigured = () => !!env.RESEND_API_KEY;

export const providerStatus = () => ({
  sms: { provider: "kavenegar", configured: smsConfigured() },
  email: { provider: "resend", configured: emailConfigured() },
  devLog: process.env.NODE_ENV !== "production" || env.DEV_OTP_LOG === "true",
});

/* ---------- SMS: Kavenegar Verify/Lookup ---------- */
// Requires an approved OTP template in the Kavenegar panel containing %token.
// https://api.kavenegar.com/v1/{API-KEY}/verify/lookup.json?receptor=09..&token={code}&template={TEMPLATE}

async function sendKavenegar(phone, code) {
  const key = env.KAVENEGAR_API_KEY;
  const template = env.KAVENEGAR_TEMPLATE;
  const url =
    `https://api.kavenegar.com/v1/${encodeURIComponent(key)}/verify/lookup.json` +
    `?receptor=${encodeURIComponent(phone)}&token=${encodeURIComponent(code)}` +
    `&token2=${encodeURIComponent(code)}&token3=${encodeURIComponent(code)}` +
    `&template=${encodeURIComponent(template)}`;
  const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15_000) });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.return?.status !== 200) {
    const msg = body?.return?.message || `HTTP ${res.status}`;
    throw new Error(`kavenegar: ${msg}`);
  }
}

/* ---------- Email: Resend ---------- */
// Needs a RESEND_API_KEY; EMAIL_FROM must be a verified sender (onboarding@resend.dev
// works for testing but only reaches your own account's address).

async function sendResend(email, code, ttlMinutes) {
  const from = env.EMAIL_FROM || "واژه‌نگار چینی <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      from,
      to: [email],
      subject: `کد ورود: ${code}`,
      html: `
        <div dir="rtl" style="font-family:Tahoma,Vazirmatn,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#faf7f0;border-radius:16px">
          <p style="color:#6b5e49;font-size:14px;margin:0 0 8px">واژه‌نگار چینی</p>
          <h2 style="color:#2f2a20;margin:0 0 16px">کد ورود شما</h2>
          <div style="font-size:34px;font-weight:700;letter-spacing:8px;color:#3f6e5a;direction:ltr;text-align:center;background:#fff;border:1px solid #e5ddcb;border-radius:12px;padding:16px">${code}</div>
          <p style="color:#6b5e49;font-size:13px;line-height:1.8;margin:16px 0 0">این کد ${ttlMinutes} دقیقه اعتبار دارد و فقط یک‌بار قابل استفاده است.<br/>اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>`,
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`resend: ${body?.message || `HTTP ${res.status}`}`);
}

/* ---------- unified senders ---------- */

/**
 * Send an OTP SMS. Returns { delivered: true } or { delivered: false, unconfigured }.
 * Throws only on provider-side errors (network / provider rejection).
 */
export async function sendOtpSms(phone, code, { devLog } = {}) {
  if (!smsConfigured()) {
    if (devLog) {
      console.log(`\n[otp] SMS (Kavenegar NOT configured — DEV LOG) -> ${phone} : ${code}\n`);
      return { delivered: true, devLog: true };
    }
    return { delivered: false, unconfigured: true };
  }
  await sendKavenegar(phone, code);
  return { delivered: true };
}

export async function sendOtpEmail(email, code, ttlMinutes, { devLog } = {}) {
  if (!emailConfigured()) {
    if (devLog) {
      console.log(`\n[otp] Email (Resend NOT configured — DEV LOG) -> ${email} : ${code}\n`);
      return { delivered: true, devLog: true };
    }
    return { delivered: false, unconfigured: true };
  }
  await sendResend(email, code, ttlMinutes);
  return { delivered: true };
}
