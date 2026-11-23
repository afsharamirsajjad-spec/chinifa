# مستندات و معماری جامع اپلیکیشن Chinify (Kanchinese)

این سند تشریح‌کننده معماری کامل، ساختار فایل‌ها، جریان‌های داده (Data Flows)، چرخه عمر و فلوچارت‌های فنی اپلیکیشن آموزش زبان چینی **Chinify (Kanchinese)** است.

---

## ۱. معرفی و فلسفه طراحی اپلیکیشن

**Chinify** یک پلتفرم جامع، تعاملی و چندزبانه برای یادگیری زبان چینی (سطوح HSK 1 تا HSK 6) است که با تمرکز ویژه بر کاربردهای فارسی و راست‌به‌چپ (RTL) بومی‌سازی شده است.

### ویژگی‌ها و اصول کلیدی معماری:
1. **معماری آفلاین‌محور (Offline-First):** بیش از ۹۵ درصد محتوای آموزشی (دیکشنری، دروس، گرامر، ترتیب رسم قلم‌ها، اصوات پین‌یین) به صورت فشرده داخل خود اپلیکیشن قرار دارد و بدون نیاز به اینترنت کار می‌کند.
2. **کلاینت فوق سبک هیبرید (Zero-Heavy-Frameworks):** استفاده از معماری Vanilla JavaScript ماژولار و بهینه‌سازی‌شده برای WebView در پلتفرم‌های اندروید/iOS/PWA؛ بدون سربار فریم‌ورک‌های سنگین که باعث اجرای روان حتی روی دستگاه‌های ضعیف می‌شود.
3. **موتور رسم قلم تعاملی:** استفاده از کتابخانه `hanzi-writer` با بیش از ۳,۸۰۰ کاراکتر برداری اختصاصی جهت آموزش و تصحیح رسم خطوط کاراکترها.
4. **سیستم مرور فاصله‌دار هوشمند (SRS / Spaced Repetition):** ردگیری اشتباهات کاربر و بازپخش آن‌ها در فواصل زمانی محاسبه‌شده بر اساس منحنی فراموشی ابینگهاوس.
5. **گیمیفیکیشن عمیق:** وجود زنجیره روزانه (Streak)، امتیاز تجربه (XP)، سکه طلا (Gold)، باز کردن جزایر و ایستگاه‌ها در نقشه سفر (Journey)، و چرخ شانس.

---

## ۲. نمای کلی معماری سیستم (High-Level Architecture)

معماری سیستم از ۵ لایه اصلی تشکیل شده است:

```mermaid
graph TD
    subgraph Client_Layer ["📱 لایه کلاینت (Hybrid PWA / WebView)"]
        UI_Index["index.html (Entry Point & Layout)"]
        UI_Core["هسته کلاینت (app.js, ui.js)"]
        UI_Store["مدیریت حالت محلی (store.js - localStorage)"]
        UI_Screens["صفحات و ماژول‌ها (screens-*.js, journey.js, unit-course.js)"]
        UI_Media["موتور چندرسانه‌ای و انیمیشن (audio.js, speak.js, hanzi-writer)"]
    end

    subgraph Native_Layer ["🤖 لایه محلی اندروید (Capacitor / Cordova)"]
        Native_Bridge["native-bridge.js / native.js"]
        Android_Services["خدمات بومی: In-App Billing، Push Notifications، Theme"]
    end

    subgraph Offline_Content ["📦 لایه محتوای آفلاین محلی (UI-code/content/)"]
        Content_Strokes["strokes/ (۳۸۰۴ فایل انیمیشن خطوط)"]
        Content_Dict["dict/ & dict-en/ & dict-py/ (دیکشنری شاردشده)"]
        Content_Audio["syllables/ & speech/ (اصوات پین‌یین)"]
        Content_Lessons["lessons/ & courses-snapshot.json (دروس و گرامر)"]
    end

    subgraph Cloud_Backend ["☁️ لایه بک‌اند ابری (Vercel Serverless & KV)"]
        Vercel_Router["vercel.json (URL Rewrites & CDN)"]
        Auth_Service["api/auth.js (احراز هویت بدون وابستگی، scrypt)"]
        Store_Service["api/store.js (همگام‌سازی ابری State)"]
        Cloud_KV[("Upstash Vercel KV (دیتابیس سشن و استور)")]
        Resend_API["سرویس ایمیل Resend (کد تایید / فراموشی رمز)"]
        Media_CDN["سرور استاتیک مدیا و پادکست‌ها (stories, podcasts)"]
    end

    subgraph Admin_Tools ["🛠️ ابزارهای بیلد و پنل مدیریت محلی"]
        Admin_Server["tools/admin_server.py (Port 8090)"]
        Build_Scripts["tools/ (APK Builder, Linters, Test Automation)"]
        Staging_DB["database/ (دیتابیس‌های رزرو HSK 2025 و سرور پیامکی OTP)"]
    end

    %% اتصالات
    UI_Index --> UI_Core
    UI_Core --> UI_Screens
    UI_Core --> UI_Store
    UI_Core --> UI_Media
    UI_Screens --> Content_Lessons
    UI_Screens --> Content_Dict
    UI_Media --> Content_Strokes
    UI_Media --> Content_Audio
    UI_Core <--> Native_Bridge
    Native_Bridge <--> Android_Services
    UI_Store <-->|همگام‌سازی دیتای کاربر| Store_Service
    UI_Screens <-->|احراز هویت و سشن| Auth_Service
    Auth_Service --> Cloud_KV
    Auth_Service --> Resend_API
    Store_Service --> Cloud_KV
    UI_Screens --> Media_CDN
    Admin_Server -.->|مدیریت و بیلد محلی| UI_Core
    Admin_Server -.->|پشتیبان‌گیری و اصلاح محتوا| Offline_Content
```

---

## ۳. تفکیک و نقش فایل‌ها و ساختار دایرکتوری‌ها

### ۳.۱ ساختار دایرکتوری ریشه (Project Root)
- `UI-code/`: سورس‌کد کامل فرانت‌اند اپلیکیشن هیبرید (HTML, CSS, JS, Assets).
- `vercel-backend/`: بک‌اند سرورلس، پیکربندی Vercel و فایل‌های API.
- `database/`: مخزن و انباره داده‌های staging (پروژه فارسی toonapp، HSK 2025 و سرور auth بومی پیامکی).
- `tools/`: جعبه‌ابزار توسعه، پنل ادمین پایتون، تست‌های مرورگر بدون‌سر (Headless Chrome) و اسکریپت‌های بیلد APK.
- `extracted/`: فایل‌های ساختاریافته‌ی بازشده از APK اصلی جهت مقایسه و پچینگ.
- `START-ADMIN.bat`: اسکریپت راه‌اندازی سریع پنل ادمین محلی در پورت ۸۰۹۰.
- `DATABASE.md`: شناسنامه و مشخصات لایه‌های ذخیره‌سازی داده.
- `Chinify.apk` و فایل‌های کلید (`chinify_release.jks`, `debug.keystore`): خروجی‌های پکیج اندروید.

---

### ۳.۲ ماژول‌های لایه فرانت‌اند (`UI-code/js/`)

| فایل | دسته‌بندی | وظیفه و عملکرد |
|---|---|---|
| `app.js` | **هسته (Core)** | هماهنگ‌کننده کل چرخه حیات، روتر صفحات (`App.screen`)، مدیریت ورود کاربر، لیسنر تغییر سایز و پایش وضعیت اینترنت. |
| `ui.js` | **رابط کاربری (UI Engine)** | مدیریت رندرینگ تب‌بار (`tabbar`)، لایه‌ها (`layer`)، مودال‌ها، نوتیفیکیشن‌های درون‌برنامه‌ای (`toast`)، وضعیت آنلاین/آفلاین (`netbar`). |
| `store.js` | **مدیریت حالت (State)** | پیاده‌سازی الگوی تک‌منبعی استیت (Single Source of Truth)؛ ذخیره، بازیابی و اکسپورت کل دیتای کاربر در `localStorage`. |
| `sync.js` | **همگام‌سازی (Sync)** | تبادل استیت کاربر با بک‌اند ابری (`api/store` و `api/session`)، حل تعارض داده‌ها (Reconciliation) و سشن‌ها. |
| `config.js` | **پیکربندی (Config)** | تعریف متغیرهای محیطی، تنظیم آدرس بک‌اند (`CC.apiBase`)، تشخیص پلتفرم Native (Capacitor/iOS/Android). |
| `native.js` & `native-bridge.js` | **پل ارتباطی بومی (Bridge)** | برقراری ارتباط دوسویه بین کد JS وب‌ویو و لایه جاوای اندروید (تنظیمات نوتیفیکیشن، دارک مود، کنترل ویبره). |
| `i18n.js` & `i18n-fa.js` | **زبان و بومی‌سازی** | واژه‌نامه چندزبانه با تمرکز بر فارسی‌سازی کامل، چیدمان RTL و متن راهنماهای آموزشی. |
| `data.js` & `content.js` | **دسترسی به محتوا** | متدهای بارگذاری، واکشی و کش کردن درس‌ها، تست‌ها و دیکشنری. |
| `unit-course.js` | **موتور دوره‌ها** | ساختار جامع دوره‌های HSK، جزایر آموزشی، زیرمجموعه‌ها، بخش‌های واژگان و گرامر. |
| `screens-learn.js` | **صفحه یادگیری** | رندر تعاملی کارت‌های آموزشی، فلش‌کارت‌ها، آزمون‌های گزینه‌ای و تطبیق کلمات. |
| `screens-strokes.js` & `stroke-data.js` | **موتور رسم قلم** | اتصال به کتابخانه `hanzi-writer`، رسم انیمیشن قلم، دریافت لمس و خط‌کشی کاربر، اعتبارسنجی زاویه و ترتیب خطوط. |
| `screens-vocab.js` & `lookup.js` | **دیکشنری و واژگان** | موتور جستجوی سریع کاراکتر، پین‌یین یا ترجمه در فایل‌های شاردشده دیکشنری، نشان‌دار کردن واژه‌ها. |
| `screens-pinyin.js` & `pinyin-course.js` | **آموزش پین‌یین** | آموزش جدول صوتی حروف صدادار و بی‌صدا و تُن‌های چهارگانه چینی به همراه تست‌های شنیداری. |
| `mistakes.js` | **مرور و SRS** | مدیریت جعبه اشتباهات، تکرار فاصله‌دار، محاسبه ضریب مرور و نمایش کارت‌های منقضی‌شده. |
| `stories.js` & `podcast.js` | **محتوای پیشرفته** | پخش‌کننده چندرسانه‌ای داستان‌ها و پادکست‌های طبقه‌بندی‌شده همراه با متن همگام‌سازی‌شده (Interactive Transcript). |
| `gold.js`, `journey.js`, `goals.js` | **گیمیفیکیشن** | پیگیری پیشرفت کاربر، مدال‌ها، سکه‌ها، اهداف روزانه و حفظ زنجیره یادگیری (Streak). |
| `billing.js` & `screens-pay.js` | **پرداخت و اشتراک** | ارتباط با Google Play In-App Billing و نمایش پلن‌های عضویت ویژه. |

---

### ۳.۳ محتوای آفلاین آموزشی (`UI-code/content/`)
- `strokes/`: ۳,۸۰۴ فایل JSON شامل بردارها و مختصات ترتیب خطوط برای تک‌تک نویسه‌های پرکاربرد چینی.
- `dict/`، `dict-en/`، `dict-py/`: دیتابیس لغت‌نامه تفکیک‌شده بر اساس حرف یا پین‌یین برای جستجوی O(1) بدون کندی حافظه.
- `syllables/` و `speech/`: فایل‌های صوتی استاندارد برای هجاها و واژه‌های کلیدی.
- `lessons/`: ساختار درختی واحدهای درسی دوره‌ها (HSK1 تا HSK6).
- `stories.json` و `podcast.json`: سناریوهای داستانی همراه با فایل‌های تکمیلی در `pods/`.

---

### ۳.۴ معماری بک‌اند ابری (`vercel-backend/`)
بک‌اند روی پلتفرم بدون‌سرور (Serverless) Vercel میزبانی شده و دارای مصرف منابع نزدیک به صفر است:
- **مسیرها (`vercel.json`):** بازنویسی درخواست‌های ورودی به دو میکروسرویس اصلی و فایل‌های محتوایی استاتیک:
  - `/api/auth*` $\rightarrow$ اتصال به `api/auth.js`
  - `/api/store*` $\rightarrow$ اتصال به `api/store.js`
  - `/api/stories/*` و `/api/podcast/*` $\rightarrow$ فایل‌های JSON محتوایی
- **سرویس احراز هویت (`api/auth.js`):**
  - بدون نیاز به دیتابیس سنگین SQL؛ اتصال از طریق REST به Upstash Vercel KV.
  - رمزنگاری پسوردها با الگوریتم امنیتی `scrypt` به همراه Salt اختصاصی برای هر کاربر.
  - تولید توکن‌های Bearer برای سشن‌های ۳۰ روزه ذخیره‌شده در ردیس با کلید `session:<token>`.
  - ارسال ایمیل بازیابی رمز و خوش‌آمدگویی با API سرویس Resend.
- **سرویس ذخیره پیشرفت (`api/store.js`):**
  - دریافت اسنپ‌شات وضعیت اپلیکیشن از کلاینت و ذخیره آن با کلید `store:<username>:<key>`.
  - امکان دریافت آخرین وضعیت با ارسال توکن معتبر سشن کاربر.

---

## ۴. فلوچارت‌های جامع فرآیندهای اپلیکیشن

### ۴.۱ فلوچارت بوت و اجرای اولیه اپلیکیشن (Lifecycle & Boot Flowchart)

```mermaid
flowchart TD
    Start([شروع: باز شدن اپلیکیشن]) --> InitConfig[اجرای config.js و native.js]
    InitConfig --> CheckPlatform{پلتفرم چیست؟}
    CheckPlatform -->|Android/iOS Native| SetNativeBridge[تنظیم پل ارتباطی و بررسی دسترسی‌ها]
    CheckPlatform -->|Web / PWA| RegisterSW[ثبت Service Worker جهت کش آفلاین]
    
    SetNativeBridge --> LoadLocalStore[بارگذاری Store.load از localStorage]
    RegisterSW --> LoadLocalStore

    LoadLocalStore --> ApplyTheme[اعمال تم و جهت صفحه RTL/LTR و زبان fa]
    ApplyTheme --> CheckBootstrapped{کاربر قبلاً ثبت‌نام / آنبورد شده؟}

    CheckBootstrapped -->|خیر| ShowOnboard[نمایش اسکرین خوش‌آمدگویی: onbWelcome]
    ShowOnboard --> SelectLevel[انتخاب سطح اولیه و هدف روزانه]
    SelectLevel --> MarkBootstrapped[ثبت bootstrapped = true در Store]
    MarkBootstrapped --> ShowHome[ورود به صفحه اصلی: Home Screen]

    CheckBootstrapped -->|بله| CheckNetwork{آیا اینترنت وصل است؟}
    CheckNetwork -->|بله| CheckSession[بررسی سشن با سرور: Sync.session]
    CheckNetwork -->|خیر| PaintNetBar[نمایش نوار هشدار آفلاین netbar و ادامه بدون اینترنت]
    
    CheckSession -->|سشن معتبر| PullRemoteState[دریافت آخرین استیت ابری و ادغام: Sync.reconcile]
    CheckSession -->|بدون سشن یا آفلاین| ShowHome
    PullRemoteState --> ShowHome
    PaintNetBar --> ShowHome

    ShowHome --> MainTabLoop([کاربر در صفحه اصلی و آماده استفاده])
```

---

### ۴.۲ فلوچارت چرخه یادگیری درس و تمرین (Learning & Practice Flowchart)

```mermaid
flowchart TD
    SelectLesson([کاربر یک درس/ایستگاه را انتخاب می‌کند]) --> FetchData[واکشی محتوای درس از cache یا JSON محلی]
    FetchData --> RenderStep[نمایش بخش اول درس: معرفی واژگان و کاراکتر]
    
    RenderStep --> StepInteraction{نوع مرحله چیست؟}
    
    StepInteraction -->|واژه جدید| ShowWordCard[کارت واژه + تلفظ صوتی + پین‌یین]
    StepInteraction -->|رسم قلم| InitHanzi[اجرای Hanzi-Writer و دریافت قلم کاربر]
    StepInteraction -->|گرامر| ShowGrammarPoint[توضیح فرمول گرامر و مثال کاربردی]
    StepInteraction -->|تمرین / کوییز| ShowQuiz[ارائه سوال چهارگزینه‌ای یا مرتب‌سازی جمله]
    
    ShowWordCard --> UserInput[کاربر کلیک/پاسخ می‌دهد]
    InitHanzi --> StrokeCheck{ترتیب و زاویه خط صحیح است؟}
    ShowGrammarPoint --> UserInput
    ShowQuiz --> QuizCheck{پاسخ درست است؟}

    StrokeCheck -->|خیر| ShowStrokeHint[نمایش انیمیشن راهنما و تکرار خط]
    StrokeCheck -->|بله| NextMicroStep[ثبت امتیاز مرحله]

    QuizCheck -->|غلط| LogMistake[ثبت در اشتباهات: Mistakes.add و کسر امتیاز]
    QuizCheck -->|درست| PlayCheer[پخش صدای تشویق و اضافه کردن XP]

    ShowStrokeHint --> InitHanzi
    LogMistake --> NextMicroStep
    PlayCheer --> NextMicroStep

    NextMicroStep --> MoreSteps{مرحله دیگری از درس باقی مانده؟}
    MoreSteps -->|بله| RenderStep
    MoreSteps -->|خیر| LessonDone[پایان درس: محاسبه پیشرفت و اعطای سکه طلا]

    LessonDone --> UpdateLocalStore[ذخیره در Store: courseProgress, XP, streak]
    UpdateLocalStore --> BackgroundSync[ارسال تغییرات در پس‌زمینه به سرور: Sync.push]
    BackgroundSync --> ReturnHome([بازگشت به نقشه سفر یا مرحله بعد])
```

---

### ۴.۳ فلوچارت سیستم مرور فاصله‌دار اشتباهات (Spaced Repetition / SRS Flowchart)

```mermaid
flowchart TD
    TriggerReview([کاربر وارد بخش مرور یا آزمون روزانه می‌شود]) --> LoadMistakes[خواندن لیست misses از Store]
    LoadMistakes --> FilterDue{آیا کارت منقضی‌شده برای امروز وجود دارد؟}

    FilterDue -->|خیر| AllClear[پیام: همه واژه‌ها مرور شده‌اند! آفرین]
    FilterDue -->|بله| PickTopCards[انتخاب کارت‌های با اولویت بالاتر بر اساس فرمول فاصله‌دار]

    PickTopCards --> PresentCard[نمایش کارت مرور: شنیداری یا نوشتاری]
    PresentCard --> UserAnswer{پاسخ کاربر}

    UserAnswer -->|پاسخ صحیح| DecrementMiss[کاهش شمارنده خطا و افزایش فاصله بازبینی بعدی]
    UserAnswer -->|پاسخ نادرست| IncrementMiss[ریست شدن فاصله و بازگشت به صف مرور زودهنگام]

    DecrementMiss --> CheckSessionQueue{آیا در صف این جلسه کارت دیگری هست؟}
    IncrementMiss --> CheckSessionQueue

    CheckSessionQueue -->|بله| PresentCard
    CheckSessionQueue -->|خیر| SaveReviewProgress[به‌روزرسانی Store.state.misses]
    SaveReviewProgress --> FinishReview([پایان جلسه مرور و به‌روزرسانی نوار تسلط])
```

---

### ۴.۴ فلوچارت احراز هویت و همگام‌سازی ابری (Auth & Cloud Sync Flowchart)

```mermaid
sequenceDiagram
    autonumber
    actor User as کاربر (اپلیکیشن)
    participant Client as فرانت‌اند (app.js / sync.js / store.js)
    participant Vercel as ای‌پی‌آی سرورلس (api/auth.js / api/store.js)
    participant KV as دیتابیس کلید-مقدار (Upstash KV)
    participant Mail as سرویس ایمیل (Resend)

    User->>Client: وارد کردن نام کاربری و رمز عبور
    Client->>Vercel: درخواست POST /api/login با اطلاعات حساب
    Vercel->>KV: دریافت دیتای کاربر با کلید user:<username>
    KV-->>Vercel: اطلاعات کاربر و Salt هش
    Vercel->>Vercel: تطبیق هش رمز عبور با الگوریتم scrypt
    alt رمز عبور نادرست است
        Vercel-->>Client: خطای 401: unauthorized
        Client-->>User: نمایش پیام خطا به کاربر
    else رمز عبور صحیح است
        Vercel->>KV: ایجاد سشن جدید: SET session:<token> = <username> با انقضای ۳۰ روز
        Vercel-->>Client: بازگرداندن توکن Bearer و مشخصات پروفایل
        Client->>Client: ذخیره توکن در متغیرهای محلی
        Client->>Vercel: ارسال درخواست GET /api/store جهت همگام‌سازی پیشرفت
        Vercel->>KV: خواندن کلید store:<username>:store
        KV-->>Vercel: آخرین نسخه دیتای کاربر در سرور
        Vercel-->>Client: ارسال اسنپ‌شات دیتای کاربر
        Client->>Client: ادغام دیتای سرور با دیتای محلی (Reconcile)
        Client-->>User: ورود با موفقیت انجام شد؛ اطلاعات همگام شدند
    end
```

---

## ۵. راهنمای ابزارها و اجرای محیط توسعه (Development & Tooling)

### ۵.۱ اجرای پنل مدیریت محلی (Admin Panel)
برای ویرایش درس‌ها، بررسی ساختار، پشتیبان‌گیری و ارزیابی محتوا:
```bat
# اجرای فایل bat در ریشه پروژه
START-ADMIN.bat
```
این اسکریپت سرور سبک پایتون `tools/admin_server.py` را روی پورت `8090` اجرا کرده و صفحه مدیریت `http://127.0.0.1:8090/admin` را باز می‌کند.

### ۵.۲ اجرای وب اپلیکیشن بدون نیاز به بیلد
کافیست یک وب‌سرور استاتیک روی پوشه `UI-code` اجرا شود:
```bash
cd UI-code
python -m http.server 8080
# باز کردن آدرس http://localhost:8080 در مرورگر
```

### ۵.۳ دیپلوی و به‌روزرسانی بک‌اند Vercel
```bash
cd vercel-backend
# استقرار مستقیم روی پروژه Vercel
vercel --prod --yes
```

---

## ۶. جمع‌بندی وضعیت سیستم و پتانسیل‌های آماده ادغام

1. **پایداری کامل هسته کلاینت:** اپلیکیشن در وضعیت کامپایل‌شده APK و نسخه وب دارای ثبات کامل بوده و تمام دارایی‌های متنی و صوتی به شکل آفلاین در دسترس هستند.
2. **پشتیبانی کامل از زبان فارسی:** لایه‌های رابط کاربری و گرامر دارای کلاس‌های استایل اختصاصی برای زبان فارسی و چیدمان RTL هستند.
3. **دیتابیس‌های آماده مرحله Staging (`database/`):**
   - مخزن کامل کاراکترها و دیکشنری HSK 2025 و ترجمه‌های فارسی آماده است تا در نسخه‌های آتی مستقیماً در لایه `UI-code/content/` جایگزین یا با آن ترکیب شوند.
   - سرور پیامکی OTP واژه‌نگار در پوشه `database/server/` به عنوان بک‌اند پشتیبان برای کاربران ایرانی در دسترس است.
