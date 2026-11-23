# بک‌اند Chinify روی Vercel — نسخهٔ حداقلی

فقط فایل‌های استاتیک محتوا — بدون هیچ تابعی (مصرف پلن رایگان: تقریباً صفر).

## چه چیزی هست
- `/api/stories` و `/api/stories/<id>` → فهرست و بدنهٔ داستان‌ها
- `/api/podcast` و `/api/podcast/<id>` → پادکست‌ها
- `/api/feed`، `/api/wordlists`، `/api/cc|dict|pinyin|popups|banner|app-version`
- اپ محتواست‌محور است: این endpointها فقط وقتی صدا می‌شوند که نسخهٔ محلی نباشد

## چه چیزی حذف شده
- TTS سرور (اپ به صدای خود گوشی برمی‌گردد برای واژه‌های بدون فایل داخلی)
- ورود/ثبت‌نام/همگام‌سازی (سیستم حساب در آینده)

## به‌روزرسانی محتوا
فایل را در content/ بگذار یا عوض کن، بعد:
```
set PATH=C:\Users\Amirsajjad\Documents\kanchinese\tools\node\node-v20.20.2-win-x64;%PATH%
cd C:\Users\Amirsajjad\Documents\kanchinese\vercel-backend
vercel --prod --yes
```

## اعلام به‌روزرسانی APK
`content/api/app-version.json` را دستی ویرایش کن (latest/min).
