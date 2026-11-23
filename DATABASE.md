# دیتابیس‌های Chinify — نقشه کامل

اپ سه لایه‌ی داده دارد: (۱) محتوای آفلاین داخل APK، (۲) حافظه‌ی محلی دستگاه، (۳) بک‌اند ابری.

---

## ۱) دیتابیس محتوا (داخل APK — `UI-code/content/`)

همه‌چیز JSON آفلاین است؛ اپ بدون اینترنت هم با همین‌ها کار می‌کند.

| پوشه/فایل | تعداد | حجم | محتوا |
|---|---:|---:|---|
| `strokes/` | ۳۸۰۴ فایل | ~۱۱.۶MB | داده‌ی حرکت قلم هر نویسه (برای hanzi-writer) |
| `syllables/` | ۱۳۴۳ فایل | ~۱۰.۷MB | هجاهای پین‌یین (صدا/داده) |
| `i18n/` | ۷ فایل | ~۱۳.۵MB | ترجمه‌ی محتوای آموزشی به ۷ زبان (معنی واژه‌ها، خطوط، نکات) |
| `dict/` | ۲۵۷ فایل | ~۱۰.۳MB | دیکشنری چینی→انگلیسی (شارد بر اساس نویسه‌ی اول) |
| `dict-en/` | ۲۵۷ فایل | ~۸.۹MB | همان دیکشنری — نمایه‌ی انگلیسی |
| `dict-py/` | ۱۳۹ فایل | ~۲.۹MB | نمایه‌ی پین‌یین |
| `wordlists/` | ۱۱ فایل | ~۶.۶MB | فهرست واژه‌های HSK و دسته‌ها |
| `grammar/` | ۱۲ فایل | ~۱.۵MB | درس‌های دستور زبان |
| `speech/` | ۲۱۷ فایل | ~۱.۸MB | داده‌ی تلفظ/گفتار |
| `drills/` | ۴ فایل | ~۰.۲MB | تمرین‌ها |
| `lessons/hsk1..4.json`, `worket.json` | ۵ فایل | ~۰.۲MB | ساختار دوره‌ها (نام، درس‌ها، بخش‌ها) |
| `feed.json` | ۱ فایل | — | فید کلیپ‌های ویدیویی روزانه (لینک ویدیو از `media.chinify.app`) |
| `videos.json`, `subtitles/`, `trad.json`, `pinyin-voice.json`, `pay-reviews.json`, `work-et/` | — | ~۰.۵MB | متادیتا ویدیو، زیرنویس، چینی سنتی، صدا، نظرات پرداخت |

**نمونه‌ی رکورد دیکشنری** (`dict/000.json`):
```json
"最": [{"t":"最","c":"最","p":"zuì","n":4,"d":["(before an adjective or verb) to the highest degree; most; -est","(after 之) best or most extreme example…"]}]
```
`t`=نویسه، `c`=ساده‌شده، `p`=پین‌یین، `n`=تُن، `d`=معنی‌ها

**نمونه‌ی رکورد فید ویدیو** (`feed.json`):
```json
{"id":"sugar01","level":"HSK 1","durationSec":30,"tag":"30 sec",
 "title":"是糖，不是汤",
 "situation":"Tom 想在咖啡里加糖，却说成了「汤」…",
 "videoUrl":"https://media.chinify.app/SUGAR01_….mp4",
 "poster":"https://media.chinify.app/SUGAR01_….jpg"}
```

## ۲) دیتابیس محلی دستگاه (localStorage)

`store.js` کل state اپ را به‌صورت JSON در **یک کلید localStorage** (+ کلید `.w` برای شمارنده‌ها) ذخیره می‌کند. مهم‌ترین فیلدها:
`ui` (زبان رابط)، `meanings`، `dark`، `level` (HSK)، `streak`، XP، واژه‌های ذخیره‌شده، `courseProgress`، `misses` (اشتباه‌ها برای مرور فاصله‌دار)، `goals`، `journey` (مُهرهای ایستگاه‌ها)، `signedIn/name/avatar`.

→ روی گوشی واقعی در `WebView` ذخیره می‌شود؛ در نسخه‌ی وب همین پوشه در `localStorage` دامنه.

## ۳) بک‌اند ابری

- **API سرور:** `https://chinify.app` (فقط وقتی اپ native است — `CC.apiBase`؛ در وب خالی است)
- **مسیرها (از `sync.js`):**
  `api/register` · `api/login` · `api/session` · `api/logout` · `api/logout-everywhere`
  `api/auth/google/*` · `api/auth/apple/native` · `api/account/email` · `api/change-password` · `api/delete-account`
  `api/store` (بکاپ/همگام‌سازی progress با توکن Bearer) · `api/store?key=` · `api/lookups`
- **مدیا:** `https://media.chinify.app` (ویدیوها و پوسترها)
- **لینک دعوت:** `https://chinify.app/i/` · اشتراک‌گذاری با واتساپ
- **پرداخت:** Google Play (`chinify_pro`) / App Store — بیلینگ نیتیو
- **چک connectivity:** `gstatic.com/generate_204`
- در APK کتابخانه‌های Firebase هم هست (نوتیفیکیشن/آنالیتیکس در لایه‌ی نیتیو اندروید)

→ خلاصه: **واژه‌نامه‌ها و درس‌ها همه آفلاین داخل اپ‌اند؛ فقط progress کاربر و اکانت به سرور `chinify.app` می‌رود.**

*فهرست کامل تک‌تک فایل‌ها: خروجی کامل اسکن در `tools/` ذخیره شده است.*

---

## ۴) دیتابیس‌های stage-شده از پروژه‌ی toonapp — ⚠️ هنوز وصل نیستند

در پوشه‌ی [`database/`](database/) (خارج از `UI-code/`، اپ اصلاً نمی‌خواندش) کپی داده‌های پروژه‌ی قبلی toonapp نگه داشته شده — فقط انبار، بدون هیچ اتصال:

- `database/persian-hsk/` — دیتابیس فارسی HSK1-3 (واژگان با معنی فارسی، گرامر فارسی، stroke-data، glossary) — راهنما: `INTEGRATION.fa.md`
- `database/hsk-2025-data/` — داده خام HSK 2025 (TSV)
- `database/server/` — بک‌اند auth واژه‌نگار (OTP کاوه‌نگار/Resend + دیتابیس فایل db.json) — راهنما: `server/README.fa.md`

وضعیت اتصال و برنامه‌ی آینده: [`database/README.md`](database/README.md)
