# راهنمای یکپارچه‌سازی پایگاه داده در اپلیکیشن

این سند نحوه استفاده برنامه‌نویسی‌شده از دیتاست `persian-hsk/` را توضیح می‌دهد.

## ۱) بارگذاری

```python
import json, pathlib

BASE = pathlib.Path("persian-hsk")

def load_level(level: str) -> dict:
    """level: 'hsk1' | 'hsk2' | 'hsk3'"""
    d = BASE / level
    return {
        "vocabulary": json.load(open(d / "vocabulary.json", encoding="utf-8")),
        "grammar": json.load(open(d / "grammar.json", encoding="utf-8")),
        "hanzi_recognition": json.load(open(d / "hanzi-recognition.json", encoding="utf-8")),
        "hanzi_writing": json.load(open(d / "hanzi-writing.json", encoding="utf-8"))
                         if (d / "hanzi-writing.json").exists() else [],
    }

glossary = json.load(open(BASE / "glossary.json", encoding="utf-8"))
metadata = json.load(open(BASE / "metadata.json", encoding="utf-8"))
```

⚠️ همیشه با `encoding="utf-8"` باز کنید (فایل‌ها ترکیبی چینی/فارسی/لاتین‌اند).

## ۲) ایندکس‌گذاری برای جست‌وجو

```python
import unicodedata

def strip_tones(p: str) -> str:
    return unicodedata.normalize("NFD", p)

def build_indexes(all_vocab):
    idx_fa, idx_zh, idx_py, idx_py_plain = [], [], [], []
    for e in all_vocab:
        idx_fa.append((e["meaning_fa"], e["id"]))
        idx_zh.append((e["chinese"], e["id"]))
        idx_py.append((e["pinyin"].lower(), e["id"]))
        idx_py_plain.append((strip_tones(e["pinyin"]).lower(), e["id"]))
    return idx_fa, idx_zh, idx_py, idx_py_plain
```

- **جست‌وجوی فارسی:** تطبیق زیررشته روی `meaning_fa`؛ برای جست‌وجوی دقیق‌تر عبارت را نرمال کنید (حذف اعراب فارسی، یکسان‌سازی ی/ک).
- **جست‌وجوی چینی:** زیررشته روی `chinese` (کاربر می‌تواند 火 یا 火车 بنویسد).
- **جست‌وجوی پین‌یین:** کاربر معمولاً بدون اعراب می‌نویسد (`nihao`)؛ با `strip_tones` مقایسه کنید. فاصله‌ها را نرمال کنید (`nihao` و `ni hao` هر دو).

## ۳) فیلتر سطح و فهرست انباشته

سطوح رسمی «واژه‌های جدید» هر سطح‌اند. برای فهرست انباشته (همه واژه‌های تا پایان HSK3):

```python
cumulative = [e for e in all_vocab if e["level"] <= "HSK3"]  # همه؛ چون کل دیتاست تا ۳ است
# یا برای «تا HSK2»:
upto2 = [e for e in all_vocab if e["level"] in ("HSK1", "HSK2")]
```

فیلد `also_levels` نشان می‌دهد واژه در فهرست سطوح بالاتر هم هست (کاربرد در مرور واژگان سطح‌بالا).

## ۴) درس‌های گرامر

ترتیب ارائه = همان ترتیب آرایه (مطابق سورس رسمی). هر درس:
- `title_fa` + `explanation_fa` → محتوای اصلی درس
- `structure` → نمایش الگو (چپ‌به‌راست با مخلوط فارسی/چینی رندر شود)
- `common_mistakes_fa` → کارت‌های «مراقب باش»
- `examples` → شامل همه مثال‌های رسمی سورس؛ اولین‌ها رسمی‌اند

دسته‌بندی برای فیلتر: `grammar_type_zh` (هسته واژگانی/انواع جمله/...) + `category_zh` + `detail_zh` — معادل فارسی همه در `glossary.json` است.

## ۵) تمرین نوشتاری (Stroke Order)

- فایل‌ها: `stroke-data/{hex-unicode}.json` (مثلاً `爱` = `0723 1` → `07231.json`... در واقع `4ee5`-مانند کد پنج‌رقمی هگز).
- ساختار: `stroke_paths_svg` (مسیر هر خط به‌ترتیب)، `medians` (خط میانی برای انیمیشن ساده)، `points`.
- سازگار با [hanzi-writer](https://hanziwriter.org/docs.html): فیلد `medians` را مستقیم به `HanziWriter.loadCharacterData` بدهید یا فایل‌ها را به فرمت data-جیسان آن تبدیل کنید:

```javascript
// تبدیل به فرمت hanzi-writer
const d = require("./stroke-data/0600c.json"); // 例
const charData = { strokes: d.stroke_paths_svg, medians: d.medians };
```

## ۶) فلش‌کارت و SRS

- کلید یکتا: `id` (پایدار بین نسخه‌ها).
- روی کارت: جلو = `chinese` (+ `pinyin` کوچک)، پشت = `meaning_fa` + `explanation_fa` + مثال اول.
- برای کاراکترها: `rec-*` فقط خواندن؛ `wri-*` تمرین نوشتن با داده ترتیب خط.
- جهت RTL: رابط فارسی، اما متن چینی/پین‌یین باید LTR رندر شود (`dir="ltr"` یا `unicode-bidi`).

## ۷) آزمون‌ها

- **واژه→معنی:** گزینه‌های انحرافی از `meaning_fa` واژه‌های هم‌سطح.
- **شنیداری (TTS):** `chinese` را به موتور TTS چینی بدهید.
- **گرامر:** از `structure` جای خالی بسازید؛ گزینه انحرافی از `common_mistakes_fa`.
- **نوشتار:** تشخیص ترتیب خط با `stroke-data`.

## ۸) نکات رندر فارسی

- فونت فارسی با نیم‌فاصله صحیح (Vazirmatn پیشنهاد می‌شود).
- اعداد فارسی برای سطح‌بندی نمایشی؛ شناسه‌ها لاتین بمانند.
- در جملات ترکیبی (فارسی + چینی + پین‌یین) از کنترل جهت بصری استفاده کنید.

## ۹) API پیشنهادی

```
GET /api/v1/vocab?level=HSK2&search=سلام&type=fa
GET /api/v1/vocab/{id}           → v-00512
GET /api/v1/grammar?level=HSK1
GET /api/v1/hanzi?level=HSK3&kind=writing
GET /api/v1/hanzi/{id}/strokes   → از stroke-data
GET /api/v1/glossary
```

شناسه‌های `id` برای کلید کش و `ETag` مناسب‌اند.
