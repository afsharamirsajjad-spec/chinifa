# پایگاه داده آموزشی فارسی HSK 3.0 — سطوح ۱ تا ۳

نسخه فارسی‌شده و آموزشی‌شده داده‌های **HSK جدید (نسخه ۳.۰، سال ۲۰۲۵)** برای کاربرد مستقیم در اپلیکیشن آموزش زبان چینی به فارسی‌زبانان.

- **منبع اصلی:** [chelsea6502/hsk-2025-data](https://github.com/chelsea6502/hsk-2025-data) (داده‌های برگرفته از [chinesetest.cn](https://www.chinesetest.cn))
- **مرجع‌های تکمیلی:** [Unihan](https://www.unicode.org/charts/unihan.html) (پین‌یین، بن، شمارش خط) و [makemeahanzi](https://github.com/skishore/makemeahanzi) (مسیر ترتیب خط)
- **تاریخ تولید:** 2026-11-06 | **نسخه:** 1.0.0 | **انکودینگ:** UTF-8

---

## ۱) محتوا و اندازه

| دسته | HSK1 | HSK2 | HSK3 | جمع | توضیح |
|---|---|---|---|---|---|
| واژگان (vocabulary) | ۳۰۰ | ۲۰۰ | ۵۰۰ | **۱۰۰۰** | واژه‌های **جدیدِ هر سطح** (انباشته: ۳۰۰ ← ۵۰۰ ← ۱۰۰۰) |
| گرامر (grammar) | ۷۰ | ۷۸ | ۹۶ | **۲۴۴** | نقطه‌های دستوری رسمی سیلابس |
| هانزی شناسایی (recognition) | ۲۴۶ | ۱۲۵ | ۲۸۴ | **۶۵۵** | کاراکترهایی که فقط باید «خواند» |
| هانزی نوشتاری (writing) | — | ۱۰۰ | ۱۵۰ | **۲۵۰** | کاراکترهایی که باید «نوشت» (سطح ۱ نوشتار ندارد) |

> معادل تقریبی CEFR: HSK1 ≈ Pre-A1/A1، HSK2 ≈ A1، HSK3 ≈ A2.

## ۲) ساختار پوشه‌ها

```
persian-hsk/
├── README.fa.md            ← همین فایل
├── glossary.json           ← واژه‌نامه استاندارد اصطلاحات دستوری + جدول ۲۱۴ بن
├── metadata.json           ← طرح داده (schema)، شناسه‌ها، منابع، یادداشت‌های یکپارچگی
├── hsk1/
│   ├── vocabulary.json         (۳۰۰ مدخل)
│   ├── grammar.json            (۷۰ درس)
│   └── hanzi-recognition.json  (۲۴۶ کاراکتر)
├── hsk2/
│   ├── vocabulary.json         (۲۰۰ مدخل)
│   ├── grammar.json            (۷۸ درس)
│   ├── hanzi-recognition.json  (۱۲۵ کاراکتر)
│   └── hanzi-writing.json      (۱۰۰ کاراکتر)
├── hsk3/
│   ├── vocabulary.json         (۵۰۰ مدخل)
│   ├── grammar.json            (۹۶ درس)
│   ├── hanzi-recognition.json  (۲۸۴ کاراکتر)
│   └── hanzi-writing.json      (۱۵۰ کاراکتر)
├── stroke-data/            ← ترتیب خط ۲۵۰ کاراکتر نوشتاری (فایل per-caracter + _index.json)
└── validation/
    ├── validation-report.json  ← گزارش کامل اعتبارسنجی نهایی
    └── translation-progress.json ← پیشرفت دسته‌به‌دسته ترجمه
```

## ۳) شناسه‌های پایدار (ID)

| الگو | مثال | منطق |
|---|---|---|
| `v-{sort:05d}` | `v-00042` | شماره رسمی ردیف در `vocabulary.tsv` (یکتا در کل ۱۱هزار واژه) |
| `g-hsk{n}-{###}` | `g-hsk2-015` | ترتیبی داخل سطح + نگاشت به `source_row` |
| `rec-hsk{n}-{###}` | `rec-hsk1-101` | ترتیبی داخل سطح (مرتب بر اساس کاراکتر) |
| `wri-hsk{n}-{###}` | `wri-hsk3-076` | ترتیبی داخل سطح (مرتب بر اساس کاراکتر) |

این شناسه‌ها پایدارند و برای کلید API، دیتابیس و پیگیری پیشرفت کاربر قابل استفاده‌اند.

## ۴) طرح مدخل‌ها (Schema)

### واژگان
```json
{
  "id": "v-00147",
  "level": "HSK1",
  "also_levels": [],
  "chinese": "你好",
  "pinyin": "nǐ hǎo",
  "part_of_speech_zh": "",
  "part_of_speech_fa": "عبارت",
  "meaning_fa": "سلام؛ درود",
  "meaning_en": "hello",
  "explanation_fa": "رایج‌ترین شیوه سلام کردن در چینی...",
  "examples": [
    { "chinese": "你好！", "pinyin": "Nǐ hǎo!", "translation_fa": "سلام!" }
  ]
}
```
- `also_levels`: سطح‌های بالاتری که همان واژه در فهرستشان هست (از نشانه‌گذاری رسمی مثل `一级（三级）`).
- پسوند عددی در واژه (مثل `本1`): نشانه رسمی سیلابس برای **معنای مجزا** است، حذف نشده.

### گرامر
```json
{
  "id": "g-hsk1-020",
  "level": "HSK1",
  "grammar_name": "吗",
  "grammar_type_zh": "句子的类型",
  "category_zh": "句类",
  "detail_zh": "疑问句",
  "source_row": 21,
  "title_fa": "سؤال بله/خیر با 吗",
  "explanation_fa": "برای پرسش بله/خیر، حرف کمکی 吗 را ...",
  "structure": "نهاد + فعل + 吗؟",
  "usage_fa": "...",
  "restrictions_fa": "...",
  "common_mistakes_fa": ["..."],
  "examples": [ { "chinese": "...", "pinyin": "...", "translation_fa": "..." } ]
}
```
- `examples` شامل **همه مثال‌های رسمی سورس** (cases) به همان ترتیب است (+ موارد تکمیلی).

### هانزی شناسایی
```json
{
  "id": "rec-hsk1-001",
  "level": "HSK1",
  "character": "爱",
  "pinyin": "ài",
  "pinyin_source": "vocabulary",
  "meaning_fa": "عشق؛ دوست داشتن",
  "common_usage_fa": "...",
  "role_explanation_fa": "نقش این کاراکتر در واژه‌سازی...",
  "example_words": [ { "chinese": "爱人", "pinyin": "àiren", "meaning_fa": "همسر" } ]
}
```

### هانزی نوشتاری
```json
{
  "id": "wri-hsk2-001",
  "level": "HSK2",
  "character": "爱",
  "pinyin": "ài",
  "meaning_fa": "عشق؛ دوست داشتن",
  "radical_index": 87,
  "radical_zh": "爪",
  "radical_fa": "پنجه",
  "stroke_count": 10,
  "stroke_count_source": "unihan_kTotalStrokes (agrees with mainland standard)",
  "common_usage_fa": "...",
  "example_words": [ ... ],
  "writing_note_fa": "...",
  "stroke_order_data": null
}
```
- ترتیب خط: در `stroke-data/{کد یونی‌کد}.json` (مسیرهای SVG + medians، سازگار با [hanzi-writer](https://hanziwriter.org)).
- شمارش خط مطابق **استاندارد سرزمین اصلی چین** است؛ برای ۱۸ کاراکتر مقدار سنتی Unihan در `stroke_count_unihan_traditional` آمده (مثلاً 辶 در استاندارد مدرن ۳ خط است و سنتی ۴).

## ۵) جست‌وجو و فیلتر برای اپلیکیشن

- **جست‌وجوی فارسی:** روی `meaning_fa` (و `examples[].translation_fa`).
- **جست‌وجوی چینی:** روی `chinese` / `character` و زیررشته‌های آن.
- **جست‌وجوی پین‌یین:** روی `pinyin` (اعراب‌دار). برای جست‌وجوی بدون اعراب، ابتدا نرمال‌سازی کاراکتر→پایه انجام دهید (ā→a).
- **فیلتر سطح:** فیلد `level` (و `also_levels` برای فهرست انباشته).
- **فلش‌کارت:** `chinese`/`pinyin`/`meaning_fa` + `examples[0]`.
- **آزمون:** `examples` برای جمله‌سازی، `example_words` برای تمرین کاراکتر، `common_mistakes_fa` برای گزینه‌های انحرافی گرامر.
- **پیگیری پیشرفت:** کلید روی `id`.

## ۶) یکپارچگی داده و یافته‌های مهم

1. **چندخوانی‌ها ردیف مجزای رسمی‌اند**، نه تکرار: 还 hái (HSK1) / huán (HSK3)، 只 zhī/zhǐ، 长 cháng/zhǎng، 得 de/dé/děi، 地 de/dì، 过 guò/guo.
2. **۸۲ واژه پسوند عددی** دارند (本1، 点1، 会1 و ...) — نشانگر رسمی معانی مجزا؛ حفظ شده‌اند.
3. **۷ نقطه گرامر سورس** ستون content خالی دارند؛ نامشان از grammarDetail بازیابی شد (`content_was_empty: true`).
4. **۱۶ واژه** نقش دستوری خالی دارند (عبارات ثابت مثل 你好) → `part_of_speech_fa = «عبارت»`.
5. **۵۸ واژه سطح ۱–۳** در سطح‌های بالاتر هم فهرست شده‌اند → فیلد `also_levels`.
6. هیچ مدخلی حذف نشده؛ همه اختلاف‌ها در `validation/validation-report.json` مستند است.

## ۷) مجوز و منابع

- مخزن منبع **فایل LICENSE ندارد**؛ داده پایه، سرفصل رسمی HSK منتشرشده در chinesetest.cn است. پیش از انتشار تجاری/عمومی، اخذ اجازه از نویسنده مخزن توصیه می‌شود.
- داده‌های Unihan تابع مجوز Unicode و داده‌های ترتیب خط (makemeahanzi) تابع **ARPHIC PUBLIC LICENSE** هستند.

## ۸) وضعیت نهایی

| سطح | واژگان | گرامر | شناسایی | نوشتاری | وضعیت |
|---|---|---|---|---|---|
| HSK1 | ۳۰۰/۳۰۰ | ۷۰/۷۰ | ۲۴۶/۲۴۶ | — | ✅ کامل |
| HSK2 | ۲۰۰/۲۰۰ | ۷۸/۷۸ | ۱۲۵/۱۲۵ | ۱۰۰/۱۰۰ | ✅ کامل |
| HSK3 | ۰/۵۰۰ | ۰/۹۶ | ۰/۲۸۴ | ۰/۱۵۰ | ⏸ در انتظار دستور کاربر |

- **جمع تأییدشده:** ۱٬۱۶۹ مدخل فارسی (۱۰۰٪ سطوح ۱ و ۲) + ۲۵۰ فایل ترتیب خط
- هر مدخل با اسکریپت در برابر سورس اصلی راستی‌آزمایی شده: حفظ مو‌به‌موی چینی/پین‌یین، پوشش کامل مثال‌های رسمی، اعراب کامل پین‌یین، حروف فارسی استاندارد (ی/ک).
- هوموگراف‌ها و چندخوانی‌های رسمی سیلابس (本1/本2، 得 de/dé/děi و…) دست‌نخورده حفظ شده‌اند.
- → گزارش کامل (شمارش‌ها، ناهنجاری‌های سورس، موارد نیازمند بازبینی): `validation/validation-report.json` و `validation/translation-progress.json`

_سطح HSK3 طبق درخواست کاربر موکول شده؛ زیرساخت (چانک‌ها، ابزارها، واژه‌نامه) کاملاً آماده است و با همان خط تولید قابل تکمیل است._
