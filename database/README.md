# دیتابیس‌های staging (کپی از پروژه‌ی toonapp) — ⚠️ وصل نیستند

تاریخ کپی: 2026-11-12 — از `C:\Users\Amirsajjad\Documents\toonapp`

این پوشه فقط انبارِ داده است. **هیچ‌کدام از این فایل‌ها به اپ وصل نشده‌اند** — اپ (`UI-code/`) این پوشه را نمی‌خواند و هیچ مسیر/کدی به اینجا اشاره نمی‌کند. اتصال بعداً و با تصمیم شما انجام می‌شود.

## محتویات

| پوشه | چیست | منبع اصلی |
|---|---|---|
| `persian-hsk/` | دیتابیس فارسی HSK1-3: واژگان با `meaning_fa` (hsk1/hsk2/hsk3/vocabulary.json)، گرامر فارسی، hanzi-recognition، stroke-data (۲۵۱ نویسه، سازگار با hanzi-writer)، glossary، metadata، گزارش اعتبارسنجی | ساخته‌شده در پروژه toonapp — راهنمای استفاده: `persian-hsk/INTEGRATION.fa.md` |
| `hsk-2025-data/` | داده خام HSK 2025 (TSV): vocabulary، grammar، hanzi_recognition، hanzi_writing — سورسِ اصلی که persian-hsk از روی آن ساخته شده (+ `.git` مخزن اصلی) | مخزن HSK 2025 |
| `server/` | بک‌اند احراز هویت واژه‌نگار (Node خالص، بدون npm): OTP کاوه‌نگار/Resend، سشن، همگام‌سازی progress — دیتابیس فایل `server/data/db.json` | اپ قدیم word-atlas — راهنما: `server/README.fa.md` |

## وضعیت اتصال به اپ (فعلاً همه: ✗ وصل نیست)

- ✗ واژگان/معنی فارسی → هنوز وارد `UI-code/content/` (dict، wordlists، i18n/fa.json) نشده
- ✗ گرامر فارسی → هنوز وارد `content/grammar/` نشده
- ✗ stroke-data → اپ خودش `content/strokes/` (۳۸۰۴ نویسه) دارد؛ این مجموعه فقط HSK1-3 است
- ✗ سرور auth → `config.js` اپ همچنان به `kanchinese.app` اشاره می‌کند، نه به این سرور

## برای اتصال آینده

- معنی فارسی واژه‌ها → پر کردن شکاف معناهای dict (معروف: dict `d` آرایه‌ها انگلیسی‌اند)
- گرامر فارسی HSK1-3 → جایگزینی/ادغام با `content/grammar/`
- سرور → تغییر `CC.apiBase` در `UI-code/js/config.js` به آدرس این سرور
