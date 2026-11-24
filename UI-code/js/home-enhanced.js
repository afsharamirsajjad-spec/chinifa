/* ============================================================
   home-enhanced.js — جایگزینی کامل صفحه خانه و نوار پایین (chinifa / کان‌چینی)
   شامل: نقشه جامع ۱۵ درس در ۵ ایستگاه + نوار ۶ گزینه‌ای با آیکون‌های سه‌بعدی
   کاملاً منطبق با CSP بدون هیچ‌گونه onclick درون‌خطی
   پشتیبانی کامل از ناوبری تب‌ها، بازگشت به خانه، باز کردن درس‌ها و تعاملات
   ============================================================ */
!function(w) {
  'use strict';

  var BASE = 'art/';

  // ════════════════════════════════════════════════════════════
  // داده‌های ۱۵ درس در ۵ ایستگاه (هر ۳ درس = ۱ شهر)
  // ════════════════════════════════════════════════════════════
  var STATIONS_HSK1 = [
    {
      id: 1,
      title: 'ایستگاه اول: کوهستان و شکوفه‌های بهاری',
      badge: 'درس ۰ تا ۳',
      bgImg: BASE + 'bg_station1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'خوش آمدید به دنیای زبان چینی!', sub: 'از اینجا سفر جادویی یادگیری رو با هم شروع می‌کنیم 🌸' },
      lessons: [
        { num: 0, idx: 'lesson0', numFa: 'درس صفر', title: 'الفبای پین‌یین و خط چینی', zh: '拼音与汉字', py: 'Pīnyīn yǔ Hànzì', mascot: BASE + 'mascot-star.webp' },
        { num: 1, idx: 0, numFa: 'درس اول', title: 'سلام و احوالپرسی', zh: '你好', py: 'Nǐ hǎo', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'معرفی خود و نام', zh: '我叫李强', py: 'Wǒ jiào Lǐ Qiáng', mascot: BASE + 'mascot-idle.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'اعداد و شمارش ۱ تا ۱۰', zh: '一二三四五', py: 'Yī èr sān sì wǔ', mascot: BASE + 'mascot-read.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون کوهستان مه', sub: 'سنجش لغات و مباحث ایستگاه اول', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: دهکده بر فراز ابرها',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_station2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'آفرین! به شهر دوم رسیدیم', sub: 'توی این ایستگاه یاد می‌گیری درباره خودت و خانواده صحبت کنی ☁️' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'ملیت‌ها و کشورها', zh: '你是哪国人', py: 'Nǐ shì nǎ guó rén', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'خانواده و بستگان', zh: '我家有四口人', py: 'Wǒ jiā yǒu sì kǒu rén', mascot: BASE + 'mascot-book.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'سن، شغل و تحصیلات', zh: '你多大了', py: 'Nǐ duō dà le', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون روستای ابری', sub: 'تثبیت لغات و قواعد مکالمه مقدماتی', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: شهر رویایی فانوس‌ها',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_station3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'شب‌های درخشان و فانوس‌های سرخ!', sub: 'وقت خرید و سفارش غذاهای خوشمزه چینیه 🏮' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'خرید و قیمت اجناس', zh: '这个多少钱', py: 'Zhège duōshao qián', mascot: BASE + 'mascot-score.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'سفارش غذا و رستوران', zh: '我想吃米饭', py: 'Wǒ xiǎng chī mǐfàn', mascot: BASE + 'mascot-run.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'ساعت، زمان و تاریخ', zh: '现在几点', py: 'Xiànzài jǐ diǎn', mascot: BASE + 'mascot-flame.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون شهر فانوس‌ها', sub: 'سنجش مهارت‌های کاربردی خرید و زمان', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: معبد آرامش و پاگودای برفی',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_station4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'هوای برفی و تمرین‌های گرم!', sub: 'آب‌وهوا، جهت‌ها و قرارهای روزانه ❄️' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'آب‌وهوا و فصل‌ها', zh: '今天天气怎么样', py: 'Jīntiān tiānqì zěnmeyàng', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'آدرس و جهت‌یابی شهری', zh: '医院在哪里', py: 'Yīyuàn zài nǎlǐ', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'حمل‌ونقل و تاکسی', zh: '坐出租车去', py: 'Zuò chūzūchē qù', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون پاگودای برفی', sub: 'سنجش جامع جهت‌ها، آدرس و گفتگوهای محیطی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: کاخ زرین آسمانی (پایان HSK1)',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_station5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله افتخار و جشن پیروزی!', sub: 'شما تمام ۱۵ درس سطح اول رو با موفقیت پشت سر گذاشتید 🏆' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'سرگرمی‌ها و ورزش', zh: '你喜欢做什么', py: 'Nǐ xǐhuan zuò shénme', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'برنامه‌های تعطیلات', zh: '明天你想去哪儿', py: 'Míngtiān nǐ xiǎng qù nǎr', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'گفتگوی تلفنی و خداحافظی', zh: '喂，请问他在吗', py: 'Wèi, qǐngwèn tā zài ma', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن بزرگ فارغ‌التحصیلی HSK 1', title: 'کاخ آسمانی و دریافت نشان اژدهای طلایی', sub: 'سنجش ۱۵۰ کلمه کلیدی + گواهی پایان دوره', isGrand: true }
    }
  ];

  var STATIONS_HSK2 = [
    {
      id: 1,
      title: 'ایستگاه اول: بندر کهن بادبان‌ها و فانوس‌ها',
      badge: 'درس ۱ تا ۳',
      bgImg: BASE + 'bg_hsk2_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'خوش آمدید به سطح دوم HSK!', sub: 'سفر به پکن، آب‌وهوا، روزمرگی و خرید را با هم شروع می‌کنیم ⛵' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'سفر به پکن در پاییز', zh: '九月去北京旅游最好', py: 'Jiǔyuè qù Běijīng lǚyóu zuì hǎo', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'برنامه روزانه و تندرستی', zh: '我每天六点起床', py: 'Wǒ měitiān liù diǎn qǐchuáng', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'انتخاب رنگ و لباس', zh: '左边那个红色的是我的', py: 'Zuǒbian nàge hóngsè de shì wǒ de', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون بندر کهن', sub: 'سنجش صفت عالی، روزمرگی و رنگ‌ها در سطح HSK2', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: بازار بزرگ ابریشم و چای',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_hsk2_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'بازار تجارت و کار!', sub: 'معرفی همکاران، خرید لباس و عیادت بیمار را یاد می‌گیرید 🍵' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'معرفی کار و همکاران', zh: '这个工作是他帮我介绍的', py: 'Zhège gōngzuò shì tā bāng wǒ jièshào de', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'خرید و تخفیف اجناس', zh: '就买这件吧', py: 'Jiù mǎi zhè jiàn ba', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'احوالپرسی و عیادت بیمار', zh: '你怎么不吃了', py: 'Nǐ zěnme bù chī le', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون بازار ابریشم', sub: 'تثبیت ساختار تأکیدی، خرید و تغییر وضعیت', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: دهکده بهاری شکوفه‌های نیلوفر',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_hsk2_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'نیمه راه HSK 2 را فتح کردید!', sub: 'امتحانات، چای سنتی و جشن تولد در این دهکده منتظر شماست 🌸' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'امتحانات و نمرات دانشگاه', zh: '你能考一百分', py: 'Nǐ néng kǎo yībǎi fēn', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'مهمانی و صرف چای', zh: '我想喝茶', py: 'Wǒ xiǎng hē chá', mascot: BASE + 'mascot-point.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'جشن تولد و هدیه دادن', zh: '今天是他的生日', py: 'Jīntiān shì tā de shēngrì', mascot: BASE + 'mascot-star.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون دهکده نیلوفر', sub: 'سنجش افعال کمکی، تمایل و هدیه دادن', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: گذرگاه کوهستانی و دره فیروزه',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_hsk2_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله‌های بلند و گرامرهای کاربردی!', sub: 'حمل‌ونقل، مقایسه افراد و توصیف باران و برف 🏔️' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'وسایل نقلیه و سفر شهری', zh: '你坐出租车去吧', py: 'Nǐ zuò chūzūchē qù ba', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'مقایسه ویژگی‌ها و سن', zh: '他比我大三岁', py: 'Tā bǐ wǒ dà sān suì', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'کیفیت آب‌وهوا و برف', zh: '雪下得很大', py: 'Xuě xià de hěn dà', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون دره فیروزه', sub: 'سنجش فاصله، ساختار مقایسه و متمم حالت', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: کاخ زرین امپراتور (پایان HSK2)',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_hsk2_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله افتخار و جشن پایانی HSK 2!', sub: 'استمرار حالت، تجربیات گذشته و جشن پیروزی دوره 🏆' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'استمرار حالت و درهای باز', zh: '门开着呢', py: 'Mén kāi zhe ne', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'تجربه تماشای فیلم', zh: '你看过那个电影吗', py: 'Nǐ kàn guo nàge diànyǐng ma', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'جشن سال نو و پایان HSK2', zh: '新年快乐', py: 'Xīnnián kuàilè', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 2', title: 'کاخ زمردین و دریافت نشان اژدهای زرین HSK2', sub: 'سنجش ۳۰۰ کلمه کلیدی + گواهی پایان سطح ۲', isGrand: true }
    }
  ];

  var STATIONS_HSK3 = [
    {
      id: 1,
      title: 'ایستگاه اول: جنگل خیزران و پاگودای کهن',
      badge: 'درس ۱ تا ۳',
      bgImg: BASE + 'bg_hsk3_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'به سطح سوم HSK خوش آمدید!', sub: 'جابجایی اسباب، مدیریت هزینه‌ها و همکاران جدید را فرامی‌گیرید 🎋' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'جابجایی و اسباب‌کشی', zh: '我给你搬上去', py: 'Wǒ gěi nǐ bān shàngqu', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'کیف پول و خرید روزمره', zh: '我的钱呢', py: 'Wǒ de qián ne', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'معرفی همکاران و محیط کار', zh: '这位是你的同事', py: 'Zhè wèi shì nǐ de tóngshì', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون جنگل خیزران', sub: 'سنجش جهت‌نماهای مرکب، سؤالات با 呢 و روابط کاری', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: پل‌های معلق ابر و قله‌های فانوس',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_hsk3_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'بر فراز قله‌های آسمانی!', sub: 'اینترنت، وقت‌شناسی دقیق و دقت در کارها در این ایستگاه منتظر شماست 🏮' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'اینترنت و ارسال ایمیل', zh: '先上网然后发邮件', py: 'Xiān shàngwǎng ránhòu fā yóujiàn', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'برنامه‌ریزی دقیق زمان', zh: '差五分十点', py: 'Chà wǔ fēn shí diǎn', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'تعهد کاری و دقت', zh: '我一定认真做', py: 'Wǒ yídìng rènzhēn zuò', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون پل‌های آسمانی', sub: 'تثبیت توالی زمانی، کسری زمان و تأکید با 一定', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: دره گراند کنیون رود یشم',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_hsk3_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'نیمه راه HSK 3!', sub: 'سفرهای درون‌شهری با مترو، جهت‌های جغرافیایی و قرض دادن 🌊' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'مترو و تردد شهری', zh: '坐地铁很方便', py: 'Zuò dìtiě hěn fāngbiàn', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'جهت‌های جغرافیایی و نشانی', zh: '学校在北方', py: 'Xuéxiào zài běifāng', mascot: BASE + 'mascot-point.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'امانت و قرض دادن پول', zh: '我先借你一百元', py: 'Wǒ xiān jiè nǐ yībǎi yuán', mascot: BASE + 'mascot-star.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون دره رود یشم', sub: 'سنجش افعال دو مفعولی، جهت‌های اربعه و توصیف امکانات', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: قله برفی اژدها و معبد بلورین یخ',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_hsk3_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'معابد برفی و گرامرهای بنیادین!', sub: 'استمرار حالت با 着، شدت احساسات با 极了 و ترجیحات غذایی ❄️' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'استمرار حالت اشیاء در منزل', zh: '冰箱里放着很多东西', py: 'Bīngxiāng lǐ fàng zhe hěnduō dōngxi', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'صفت عالی و شدت احساسات', zh: '我饿极了', py: 'Wǒ è jí le', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'انتخاب بین گزینه‌ها در غذاخوری', zh: '你吃米饭还是面条', py: 'Nǐ chī mǐfàn háishi miàntiáo', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون معبد بلورین یخ', sub: 'تسلط بر افعال ایستای 着، پسوند 极了 و پرسش‌های انتخابی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: شهر اژدهای آسمانی و ارگ زمردین',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_hsk3_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله افتخار و جشن فارغ‌التحصیلی HSK 3!', sub: 'تسلط بر مهم‌ترین ساختارهای چینی (把 و 被) و دریافت نشان زمردین 🏆' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'ساختار مفعولی 把 (تغییر وضعیت)', zh: '我把桌子打扫干净', py: 'Wǒ bǎ zhuōzi dǎsǎo gānjìng', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'ساختار مجهول 被 و عادت‌ها', zh: '这是我的习惯', py: 'Zhè shì wǒ de xíguàn', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'جشن بزرگ موفقیت HSK 3', zh: '我们祝你成功', py: 'Wǒmen zhù nǐ chénggōng', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 3', title: 'ارگ زمردین و دریافت نشان اژدهای زرین HSK3', sub: 'سنجش ۶۰۰ کلمه کلیدی + گواهی پایان سطح ۳', isGrand: true }
    }
  ];

  var STATIONS_HSK4 = [
    {
      id: 1,
      title: 'ایستگاه اول: دروازه آسمانی شهر مدرن و فناوری',
      badge: 'درس ۱ تا ۳',
      bgImg: BASE + 'bg_hsk4_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'به سطح چهارم HSK خوش آمدید!', sub: 'رشد سریع شهرها، برداشت اولیه در دیدارها و فرصت‌های شغلی 🏙️' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'رشد سریع شهرها و فناوری', zh: '城市发展得非常快', py: 'Chéngshì fāzhǎn de fēicháng kuài', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'دیدار نخست و ویژگی‌های شخصیتی', zh: '第一次见面的印象', py: 'Dì-yī cì jiànmiàn de yìnxiàng', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'استخدام، مصاحبه و فرصت‌های شغلی', zh: '我们在招聘新员工', py: 'Wǒmen zài zhāopìn xīn yuángōng', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون کلان‌شهر و فناوری', sub: 'سنجش اصطلاحات توسعه شهری، مصاحبه شغلی و شخصیت‌شناسی', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: پاگودای بلورین برف و کوهستان تندرستی',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_hsk4_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'در قله‌های تندرستی و رفاقت!', sub: 'عادات سالم زندگی، ارزش دوستی حقیقی و تطبیق با آب‌وهوا ❄️' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'سبک زندگی و عادات تندرستی', zh: '健康的生活习惯', py: 'Jiànkāng de shēnghuó xíguàn', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'دوستی حقیقی و اعتماد متقابل', zh: '真正的朋友是怎样的', py: 'Zhēnzhèng de péngyou shì zěnyàng de', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'برنامه‌ریزی بر اساس آب‌وهوا', zh: '根据天气预报的安排', py: 'Gēnjù tiānqì yùbào de ānpái', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون کوهستان تندرستی', sub: 'تثبیت استدلال با 根据، اصطلاحات پزشکی و روابط انسانی', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: بازارگاه باستانی جاده ابریشم و تجارت',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_hsk4_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'کاروان‌های تجارت و سفر!', sub: 'خرید هوشمندانه، ایمنی در تردد و انضباط بر اساس قوانین 🐪' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'خرید هوشمندانه و اقتصاد خانواده', zh: '购物与经济生活', py: 'Gòuwù yǔ jīngjì shēnghuó', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'سفر، ایمنی تردد و اقامتگاه', zh: '旅行与交通安全', py: 'Lǚxíng yǔ jiāotōng ānquán', mascot: BASE + 'mascot-point.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'قوانین، مقررات و برنامه‌ریزی', zh: '按照法律和规则办事', py: 'Ànzhào fǎlǜ hé guīzé bànshì', mascot: BASE + 'mascot-star.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون جاده ابریشم', sub: 'سنجش ساختار 按照، تعهدات قانونی و اصطلاحات سفر و هتل', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: آکادمی فرزانگان و هنر چینی',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_hsk4_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'در حریم دانشمندان و فرهنگ کهن!', sub: 'پژوهش‌های دانشگاهی، شوخ‌طبعی دلنشین و حفاظت از سیاره زمین 🌸' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'پژوهش علمی و فضای دانشگاهی', zh: '科学研究与大学生活', py: 'Kēxué yánjiū yǔ dàxué shēnghuó', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'شوخ‌طبعی و آداب معاشرت', zh: '幽默感与人际交往', py: 'Yōumògǎn yǔ rénjì jiāowǎng', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'حفاظت از محیط زیست و طبیعت', zh: '保护我们的自然环境', py: 'Bǎohù wǒmen de zìrán huánjìng', mascot: BASE + 'mascot-read.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون آکادمی فرزانگان', sub: 'تثبیت مقالات علمی، انرژی پاک و آداب معاشرت رسمی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: کاخ ققنوس زرین و تسلط جامع HSK 4',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_hsk4_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'فتح قله افتخار سطح چهارم!', sub: 'فلسفه مثبت زندگی، هماهنگی نسلی و آمادگی کامل آزمون رسمی HSK 4 👑' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'نگرش مثبت و امید به آینده', zh: '积极的人生态度', py: 'Jījí de rénshēng tàidù', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'روابط نسلی و صمیمیت خانوادگی', zh: '家庭幸福与相互理解', py: 'Jiātíng xìngfú yǔ xiānghù lǐjiě', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'جشن پیروزی و تسلط جامع HSK 4', zh: '预祝取得优异成绩', py: 'Yùzhù qǔdé yōuyì chéngjì', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 4', title: 'کاخ ققنوس زرین و دریافت نشان استادی HSK 4', sub: 'سنجش ۱۲۰۰ کلمه کلیدی + گواهی پایان سطح ۴', isGrand: true }
    }
  ];

  var STATIONS_HSK5 = [
    {
      id: 1,
      title: 'ایستگاه اول: دروازه آسمانی جزایر حکمت و همدلی',
      badge: 'درس ۱ تا ۳',
      bgImg: BASE + 'bg_hsk5_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'به سطح پنجم HSK خوش آمدید!', sub: 'مهرورزی، آرامش روان و اعتماد متقابل در ژرفای زبان چینی 🌸' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'مهرورزی، مراقبت و همدلی انسانی', zh: '关爱与同情心', py: 'Guān\'ài yǔ tóngqíngxīn', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'آرامش روان و تاب‌آوری در برابر اضطراب', zh: '心理安慰与情绪管理', py: 'Xīnlǐ ānwèi yǔ qíngxù guǎnlǐ', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'امنیت، اعتماد و روابط متقابل اجتماعی', zh: '社会信任与人际和谐', py: 'Shèhuì xìnrèn yǔ rénjì héxié', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون جزایر حکمت و همدلی', sub: 'سنجش ساختارهای 爱护، تسلی با 安慰 و اعتماد اجتماعی', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: دره مه‌آلود زمرد و طبیعت پویا',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_hsk5_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'در آغوش شگفتی‌های طبیعت!', sub: 'مشاهده دقیق پدیده‌ها، توازن بوم‌شناختی و آینده اقلیم سیاره زمین 🌿' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'مشاهده دقیق پدیده‌های طبیعی و شگفتی‌ها', zh: '大自然的奇妙现象', py: 'Dà zìrán de qímiào xiànxiàng', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'حفاظت از گونه‌ها و زیست‌بوم پاک', zh: '生态平衡与环境保护', py: 'Shēngtài pínghéng yǔ huánjìng bǎohù', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'تغییرات اقلیمی و مسئولیت جهانی', zh: '气候变化与人类未来', py: 'Qìhòu biànhuà yǔ rénlèi wèilái', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون طبیعت پویا و اقلیم', sub: 'تثبیت واژگان تخصصی بوم‌شناسی، اقلیم و حفاظت محیط زیست', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: پاگودای زرین افرا و کارآفرینی',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_hsk5_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'پیشگامان علم، تجارت و کارآفرینی!', sub: 'فناوری‌های نوین، انگیزش تیمی و مذاکرات قراردادهای بین‌المللی 💼' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'نوآوری فناورانه و نبوغ کارآفرینی', zh: '科技创新与创业精神', py: 'Kējì chuàngxīn yǔ chuàngyè jīngshén', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'مدیریت منابع انسانی و انگیزش سازمانی', zh: '企业管理与团队激励', py: 'Qǐyè guǎnlǐ yǔ tuánduì jīlì', mascot: BASE + 'mascot-point.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'مذاکرات تجاری، قراردادها و اخلاق کاری', zh: '商务谈判与职业道德', py: 'Shāngwù tánpàn yǔ zhíyè dàodé', mascot: BASE + 'mascot-star.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون پاگودای زرین تجارت', sub: 'سنجش اصطلاحات قراردادها، رهبری استراتژیک و حقوق تجارت', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: معبد کوهستانی ادب و اندیشه‌ورزی',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_hsk5_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'در محضر ادب، فرهنگ و میانه‌روی!', sub: 'داستان‌های حکمت‌آموز، هنر اصیل خوشنویسی و فلسفه اعتدال 📜' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'میراث ادبی، استعاره‌ها و داستان‌های پندآموز', zh: '文学遗产与智慧寓言', py: 'Wénxué yíchǎn yǔ zhìhuì yùyán', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'سنت‌های فرهنگی، هنر خوشنویسی و نقاشی', zh: '传统文化与艺术修养', py: 'Chuántǒng wénhuà yǔ yìshù xiūyǎng', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'فلسفه زندگی، میانه‌روی و قناعت', zh: '人生哲学与中庸之道', py: 'Rénshēng zhéxué yǔ zhōngyōng zhī dào', mascot: BASE + 'mascot-read.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون معبد کوهستانی ادب', sub: 'تثبیت ضرب‌المثل‌های کهن، بلاغت ادبی و اصول زیباشناسی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: ارگ شکوهمند ستارگان و استادی HSK 5',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_hsk5_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'تاج افتخار سطح پنجم زبان چینی!', sub: 'تصمیم‌گیری‌های عقلانی، خودشکوفایی و تسلط کامل بر ۲۵۰۰ واژه HSK 5 👑' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'تصمیم‌گیری هوشمندانه در دوراهی‌های زندگی', zh: '重大抉择与理性思维', py: 'Zhòngdà juézé yǔ lǐxìng sīwéi', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'خودشکوفایی و تحقق بخشیدن به رویاها', zh: '自我实现与追求卓越', py: 'Zìwǒ shíxiàn yǔ zhuīqiú zhuóyuè', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'آمادگی نهایی و فتح قله استادی HSK 5', zh: '迈向高级汉语新境界', py: 'Màixiàng gāojí hànyǔ xīn jìngjiè', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 5', title: 'ارگ شکوهمند ستارگان و دریافت نشان استادی HSK 5', sub: 'سنجش ۲۵۰۰ کلمه کلیدی + گواهی پایان سطح ۵ فوق‌پیشرفته', isGrand: true }
    }
  ];

  function getCurrentCourse() {
    try {
      return localStorage.getItem('chinifa_current_course') || 'hsk1';
    } catch(e) {
      return 'hsk1';
    }
  }

  function getStations() {
    var c = getCurrentCourse();
    if (c === 'hsk5') return STATIONS_HSK5;
    if (c === 'hsk4') return STATIONS_HSK4;
    if (c === 'hsk3') return STATIONS_HSK3;
    if (c === 'hsk2') return STATIONS_HSK2;
    return STATIONS_HSK1;
  }
  // ════════════════════════════════════════════════════════════
  // ۱. رندر نقشه هوم (Home Roadmap HTML)
  // بدون هیچ‌گونه onclick درون‌خطی برای سازگاری کامل با CSP
  // ════════════════════════════════════════════════════════════
    function isProUser() {
    try {
      if (localStorage.getItem('chinifa_pro') === 'true') return true;
      if (window.Pay && typeof window.Pay.isPro === 'function') return window.Pay.isPro();
      if (window.Store && Store.state && Store.state.isPro) return true;
    } catch(e) {}
    return false;
  }

  function isCourseLocked(courseId) {
    if (courseId === 'hsk1' || !courseId) return false;
    if (courseId === 'hsk2' || courseId === 'hsk3' || courseId === 'hsk4' || courseId === 'hsk5') return !isProUser();
    return !isProUser();
  }

  // توابع اعتبارسنجی باز بودن و تکمیل دروس
  function isLessonUnlocked(lessonIdx) {
    var curCourse = getCurrentCourse();
    if (isCourseLocked(curCourse)) return false;
    var curCourse = getCurrentCourse();
    if (curCourse === 'hsk1' && (lessonIdx === 'lesson0' || lessonIdx === 0 || lessonIdx === '0')) return true;
    if ((curCourse === 'hsk2' || curCourse === 'hsk3' || curCourse === 'hsk4' || curCourse === 'hsk5') && (lessonIdx === 0 || lessonIdx === '0' || lessonIdx === 1 || lessonIdx === '1')) return true;
    var num = Number(lessonIdx);
    if (isNaN(num) || num <= 0) return true;
    try {
      if (isLessonCompleted(num - 1)) return true;
      if (window.Store && Store.state && Store.state.courseProgress) {
        var cp = Store.state.courseProgress[curCourse] || 0;
        if (cp >= num) return true;
      }
    } catch(e) {}
    return false;
  }

  function isLessonCompleted(lessonIdx) {
    var curCourse = getCurrentCourse();
    if (curCourse === 'hsk1' && (lessonIdx === 'lesson0' || lessonIdx === -1 || lessonIdx === '-1')) {
      try {
        if (localStorage.getItem('chinifa_lesson0_skipped') === 'true') return true;
        var prog0 = window.UnitSystem && UnitSystem.loadProgress('lesson0');
        if (prog0 && prog0.done) return true;
      } catch(e) {}
      return false;
    }
    var num = Number(lessonIdx);
    if (isNaN(num)) return false;
    try {
      if (window.UnitSystem && typeof UnitSystem.loadProgress === 'function') {
        var prog = UnitSystem.loadProgress(curCourse + ':' + num);
        if (prog && prog.done) return true;
      }
      if (window.Store && Store.state && Store.state.courseProgress) {
        var cp = Store.state.courseProgress[curCourse] || 0;
        if (cp > num) return true;
      }
    } catch(e) {}
    return false;
  }

  function renderHomeRoadmapHTML() {
    var h = '';
    h += '<div class="kan-home-roadmap">';

    // نوار هدر بالای هوم
    var curStreak = (w.Store && w.Store.state && w.Store.state.streak) ? w.Store.state.streak : 1;
    h += '  <div class="kan-home-top-bar">';
    h += '    <div class="kan-chip-cluster">';
    h += '      <button class="kan-chip-btn kan-chip-streak" data-act="go" data-arg=\'{"s":"myProgress"}\' type="button" aria-label="پیشرفت من">';
    h += '        <img src="' + BASE + 'icon_flame_3d.webp" class="kan-chip-icon" alt="Streak" style="width:20px;height:20px;margin-left:4px;">';
    h += '        <span>پیشرفت</span>';
    h += '        <span class="kan-streak-badge">' + (w.toFaDigits ? w.toFaDigits(curStreak) : curStreak) + '</span>';
    h += '      </button>';
    h += '    </div>';
    var curCourse = getCurrentCourse();
    var courseLabel = curCourse === 'hsk5' ? 'HSK 5' : (curCourse === 'hsk4' ? 'HSK 4' : (curCourse === 'hsk3' ? 'HSK 3' : (curCourse === 'hsk2' ? 'HSK 2' : 'HSK 1')));
    var courseBadge = curCourse === 'hsk5' ? '伍' : (curCourse === 'hsk4' ? '肆' : (curCourse === 'hsk3' ? '叁' : (curCourse === 'hsk2' ? '贰' : '汉')));
    h += '    <button class="kan-chip-btn kan-level-chip" data-act="openLevelPicker" type="button" aria-label="انتخاب سطح">';
    h += '      <span>' + courseLabel + '</span>';
    h += '      <span class="kan-level-badge">' + courseBadge + '</span>';
    h += '    </button>';
    h += '  </div>';

    // بنر پروموشن اشتراک پرو در سطوح HSK 2 و 3 و 4 و 5 برای کاربران غیرپرو
    if ((curCourse === 'hsk2' || curCourse === 'hsk3' || curCourse === 'hsk4' || curCourse === 'hsk5') && !isProUser()) {
      var courseFaName = curCourse === 'hsk5' ? 'سطح ۵ (HSK 5)' : (curCourse === 'hsk4' ? 'سطح ۴ (HSK 4)' : (curCourse === 'hsk3' ? 'سطح ۳ (HSK 3)' : 'سطح ۲ (HSK 2)'));
      h += '  <div class="kan-pro-roadmap-banner" data-act="openProPaywall">';
      h += '    <div class="kan-pro-banner-content">';
      h += '      <span class="kan-pro-banner-crown">👑</span>';
      h += '      <div class="kan-pro-banner-text">';
      h += '        <div class="kan-pro-banner-title">' + courseFaName + ' نیازمند اشتراک ویژه است</div>';
      h += '        <div class="kan-pro-banner-sub">برای دسترسی به تمام درس‌ها، واژگان و گرامرها کلیک کنید</div>';
      h += '      </div>';
      h += '    </div>';
      h += '    <button class="kan-pro-banner-action-btn" type="button">ارتقا به PRO</button>';
      h += '  </div>';
    }

    // ۵ ایستگاه
    getStations().forEach(function(station) {
      h += '  <div class="station-section" id="kan-st-' + station.id + '">';
      h += '    <img src="' + station.bgImg + '" alt="' + station.title + '" class="station-full-bg-art" decoding="async">';
      h += '    <div class="station-content-layer">';

      // پاپ‌آپ معرفی شهر و حباب پیام اژدها (در بالای بخش برای دید کامل اژدها)
      h += '      <div class="station-top-header-area">';
      h += '        <div class="dragon-dialogue-bubble ' + (station.bubbleSide === 'left' ? 'bubble-left' : '') + '">';
      h += '          <div class="speech-title">' + station.dragonQuote.title + '</div>';
      h += '          <div class="speech-sub">' + station.dragonQuote.sub + '</div>';
      h += '        </div>';
      h += '      </div>';

      // نوار عنوان ایستگاه در زیر اژدها و حباب (دقیقاً منطبق بر عکس ۲ بدون پوشاندن صورت اژدها)
      h += '      <div class="station-title-strip">';
      h += '        <div class="station-name">';
      h += '          <svg class="station-pin-svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
      h += '          <span>' + station.title + '</span>';
      h += '        </div>';
      h += '        <span class="station-pill-tag">' + station.badge + '</span>';
      h += '      </div>';

      // جریان درس‌ها
      h += '      <div class="station-nodes-flow flow-st-' + station.id + '">';
      station.lessons.forEach(function(lesson, idx) {
        var isUnlocked = isLessonUnlocked(lesson.idx);
        var isDone = isLessonCompleted(lesson.idx);
        var alignCls = (station.id === 1) ? 'align-right' : (station.id === 5) ? 'align-center' : 'align-left';
        
        h += '        <div class="roadmap-row ' + alignCls + ' ' + (isUnlocked ? 'row--unlocked' : 'row--locked') + '">';
        if (isUnlocked) {
          var cardCls = isDone ? 'lesson-card--done' : 'lesson-card--active';
          var statusHtml = isDone 
            ? '<span class="card-status-label status--done"><svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> تکمیل شده</span>'
            : '<span class="card-status-label status--active"><span class="status-indicator-dot"></span> آماده یادگیری</span>';
          var actionCircleHtml = isDone
            ? '<div class="play-action-circle play-action--done"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>'
            : '<div class="play-action-circle"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>';

          h += '          <div class="lesson-card-item ' + cardCls + '" data-lesson-idx="' + lesson.idx + '" data-lesson-num="' + lesson.numFa + '" role="button" tabindex="0" aria-label="' + lesson.numFa + ': ' + lesson.title + '">';
          h += '            <div class="card-info">';
          h += '              <div class="card-topline">';
          h += '                <span class="card-num-text">' + lesson.numFa + '</span>';
          h += '                ' + statusHtml;
          h += '              </div>';
          h += '              <div class="card-title-fa">' + lesson.title + '</div>';
          h += '              <div class="card-hanzi-line">' + lesson.zh + ' · ' + lesson.py + '</div>';
          h += '            </div>';
          h += '            ' + actionCircleHtml;
          h += '          </div>';
        } else {
          h += '          <div class="lesson-card-item lesson-card--locked" data-lesson-idx="' + lesson.idx + '" data-lesson-num="' + lesson.numFa + '" role="button" tabindex="0" aria-label="' + lesson.numFa + ': ' + lesson.title + ' (قفل)">';
          h += '            <div class="card-info">';
          h += '              <div class="card-topline">';
          h += '                <span class="card-num-text text--muted">' + lesson.numFa + '</span>';
          h += '                <span class="card-status-label status--locked">';
          h += '                  <svg viewBox="0 0 24 24" class="card-lock-svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
          h += '                  قفل شده';
          h += '                </span>';
          h += '              </div>';
          h += '              <div class="card-title-fa text--muted">' + lesson.title + '</div>';
          h += '              <div class="card-hanzi-line text--muted">' + lesson.zh + ' · ' + lesson.py + '</div>';
          h += '            </div>';
          h += '            <div class="lock-action-circle">';
          h += '              <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
          h += '            </div>';
          h += '          </div>';
        }
        h += '        </div>';
      });
      h += '      </div>';

      // کادر آزمون / مدال
      var rev = station.review;
      var lastLessonIdx = station.lessons[station.lessons.length - 1].idx;
      var iconHtml = rev.isGrand
        ? '<img src="' + BASE + 'icon_trophy_3d.webp" alt="Trophy" class="milestone-3d-art grand-trophy">'
        : '<img src="' + BASE + 'icon_medal_3d.webp" alt="Medal" class="milestone-3d-art">';

      h += '      <div class="milestone-review-box ' + (rev.isGrand ? 'grand-finale-box' : '') + '" data-lesson-idx="' + lastLessonIdx + '" role="button" tabindex="0" aria-label="' + rev.title + '">';
      h += '        <div class="milestone-texts">';
      h += '          <div class="milestone-tag"><img src="' + BASE + 'star3d.webp" class="mini-3d-star" alt="Star"> ' + rev.tag + '</div>';
      h += '          <div class="milestone-title-text">' + rev.title + '</div>';
      h += '          <div class="milestone-sub-text">' + rev.sub + '</div>';
      h += '        </div>';
      h += '        <div class="milestone-icon-btn">';
      h += '          ' + iconHtml;
      h += '          <div class="chevron-circle">›</div>';
      h += '        </div>';
      h += '      </div>';

      h += '    </div>'; // end station-content-layer
      h += '  </div>'; // end station-section
    });

    h += '</div>'; // end kan-home-roadmap
    return h;
  }

  function getHomeHTML() {
    return '<div class="scr scr-home scr--tabs hm hm--jr" style="padding:0; margin:0; width:100%; height:100%; overflow-y:auto; overflow-x:hidden;">' + renderHomeRoadmapHTML() + '</div>';
  }

  // ════════════════════════════════════════════════════════════
  // ۲. رندر نوار ناوبری پایین مینیمال با آیکون‌های وکتور تمیز و مدرن
  // ════════════════════════════════════════════════════════════
  var TABS_DATA = [
    { id: 'home', label: 'خانه', icon: 'tab-house', iconActive: 'tab-house' },
    { id: 'explore', label: 'کاوش', icon: 'tab-compass', iconActive: 'tab-compass-on' },
    { id: 'vocab', label: 'واژگان', icon: 'tab-book', iconActive: 'tab-book-on' },
    { id: 'library', label: 'کتابخانه', icon: 'library-big', iconActive: 'library-big' },
    { id: 'me', label: 'من', icon: 'tab-user', iconActive: 'tab-user-on' }
  ];

  function getTabIconHTML(iconName) {
    if (w.UI && typeof w.UI.icon === 'function') {
      return w.UI.icon(iconName, 21);
    }
    return '<span class="i" style="width:21px;height:21px;-webkit-mask-image:url(css/icons/' + iconName + '.svg);mask-image:url(css/icons/' + iconName + '.svg)"></span>';
  }

  function renderEnhancedTabbar(activeScreen) {
    var tabbar = document.getElementById('tabbar');
    if (!tabbar) return;
    tabbar.hidden = false;

    var cur = activeScreen || (w.App ? w.App.screen : 'home');

    // بهینه‌سازی عملکرد جهت جلوگیری از بازسازی مکرر DOM و رفع لگ تعویض تب‌ها
    var existingBtns = tabbar.querySelectorAll('.kan-tab-btn');
    if (existingBtns.length === TABS_DATA.length) {
      for (var bIdx = 0; bIdx < existingBtns.length; bIdx++) {
        var btn = existingBtns[bIdx];
        var isAct = (btn.getAttribute('data-tab') === cur);
        if (isAct) {
          btn.classList.add('active');
          btn.setAttribute('aria-current', 'page');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-current', 'false');
        }
      }
      return;
    }

    var html = '';
    TABS_DATA.forEach(function(tab) {
      var isActive = (tab.id === cur);
      var iconName = isActive ? tab.iconActive : tab.icon;
      html += '<button class="kan-tab-btn ' + (isActive ? 'active' : '') + '" data-tab="' + tab.id + '" data-act="go" data-arg=\'{"s":"' + tab.id + '"}\' type="button" aria-label="' + tab.label + '" aria-current="' + (isActive ? 'page' : 'false') + '">';
      html += '  <div class="kan-tab-icon-pill">';
      html += '    ' + getTabIconHTML(iconName);
      html += '  </div>';
      html += '  <span class="kan-tab-label">' + tab.label + '</span>';
      html += '</button>';
    });

    tabbar.innerHTML = html;
  }

  // تابع تغییر تب
  w.kanSelectTab = function(tabId) {
    if (w.App && typeof w.App.go === 'function') {
      w.App.go(tabId);
    } else if (w.App && typeof w.App.act === 'function') {
      w.App.act('go', {s: tabId});
    }
    renderEnhancedTabbar(tabId);
  };

  // تابع باز کردن درس
  w.kanOpenLesson = function(idx, customKey) {
    var curCourse = getCurrentCourse();
    if (curCourse === 'hsk1' && (idx === 'lesson0' || customKey === 'lesson0' || idx === -1 || idx === '-1')) {
      if (w.UnitSystem && typeof w.UnitSystem.openUnit === 'function') {
        w.UnitSystem.openUnit('hsk1', 0, 'lesson0');
        return;
      }
      if (w.App && typeof w.App.go === 'function') {
        w.App.go('pyIntro');
        return;
      }
    }
    if ((curCourse === 'hsk2' || curCourse === 'hsk3' || curCourse === 'hsk4' || curCourse === 'hsk5') && !isProUser()) {
      w.kanOpenProPaywall(curCourse);
      return;
    }
    var numIdx = Number(idx);
    if (isNaN(numIdx)) numIdx = 0;
    if (w.UnitSystem && typeof w.UnitSystem.openUnit === 'function') {
      w.UnitSystem.openUnit(curCourse, numIdx, customKey);
      return;
    }
    if (w.App && typeof w.App.go === 'function') {
      w.App.go('unit');
    }
  };

  // ════════════════════════════════════════════════════════════
  // ۳. لیسنر رویدادهای کلیک گلوبال (Capture Phase)
  // تضمین عملکرد ۱۰۰٪ تمام دکمه‌ها بدون تداخل و بدون نیاز به inline onclick
  // ════════════════════════════════════════════════════════════
  
  // باز کردن مودال مدرن انتخاب سطح (HSK 1 / HSK 2)
  // هدایت به درگاه پرداخت آنلاین (جهت اتصال به زرین‌پال / شاپرک در آپدیت بعدی)
  w.kanGoToPaymentGateway = function(planId, targetLevel) {
    var planData = {
      'monthly': { name: 'اشتراک ۱ ماهه Chinify PRO', price: '۷۵۰,۰۰۰ تومان' },
      'annual': { name: 'اشتراک ۱ ساله Chinify PRO (۳۰٪ تخفیف)', price: '۶,۳۰۰,۰۰۰ تومان' },
      'quarterly': { name: 'اشتراک ۳ ماهه Chinify PRO', price: '۱,۹۵۰,۰۰۰ تومان' }
    };
    var plan = planData[planId] || planData['annual'];

    // بستن مودال خرید
    var existingModal = document.getElementById('kanProModal');
    if (existingModal) existingModal.remove();

    var existingGw = document.getElementById('kanGatewayNotice');
    if (existingGw) existingGw.remove();

    var gw = document.createElement('div');
    gw.id = 'kanGatewayNotice';
    gw.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.75);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);direction:rtl;';
    gw.innerHTML = 
      '<div style="background:#FFFFFF;border-radius:24px;padding:26px 20px;max-width:390px;width:100%;text-align:center;box-shadow:0 24px 48px rgba(0,0,0,0.25);animation:kanFadeIn 0.25s ease;">' +
        '<div style="width:68px;height:68px;background:#EFF6FF;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;box-shadow:0 4px 12px rgba(59,130,246,0.15);">' +
          '💳' +
        '</div>' +
        '<h3 style="font-size:18px;font-weight:900;color:#0F172A;margin:0 0 10px;">انتقال به درگاه پرداخت آنلاین</h3>' +
        '<div style="background:#F8FAFC;border:1.5px solid #E2E8F0;border-radius:16px;padding:14px;margin-bottom:16px;text-align:right;">' +
          '<div style="font-size:12px;color:#64748B;margin-bottom:4px;">بسته انتخابی:</div>' +
          '<div style="font-size:14px;font-weight:900;color:#0F172A;margin-bottom:6px;">' + plan.name + '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed #CBD5E1;padding-top:8px;margin-top:6px;">' +
            '<span style="font-size:12.5px;color:#475569;">مبلغ قابل پرداخت:</span>' +
            '<span style="font-size:14px;font-weight:900;color:#059669;">' + plan.price + '</span>' +
          '</div>' +
        '</div>' +
        '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:14px;padding:12px 14px;margin-bottom:20px;text-align:right;">' +
          '<div style="font-size:13px;font-weight:800;color:#92400E;margin-bottom:4px;display:flex;align-items:center;gap:6px;">' +
            '<span>⏳</span>' +
            '<span>درگاه پرداخت در حال آماده‌سازی</span>' +
          '</div>' +
          '<div style="font-size:12px;color:#B45309;line-height:1.6;">' +
            'ماژول اتصال بانکی شاپرک پس از تکمیل مجوزها در آپدیت بعدی فعال خواهد شد. در حال حاضر مبلغی کسر نگردید و اشتراک فعال نشد.' +
          '</div>' +
        '</div>' +
        '<button id="kanCloseGwNotice" style="width:100%;height:48px;background:#0F172A;color:#FFFFFF;border:none;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;">بستن و بازگشت</button>' +
      '</div>';

    document.body.appendChild(gw);

    document.getElementById('kanCloseGwNotice').addEventListener('click', function() {
      gw.remove();
      w.renderEnhancedHome();
    });
    gw.addEventListener('click', function(e) {
      if (e.target === gw) {
        gw.remove();
        w.renderEnhancedHome();
      }
    });
  };

  // باز کردن پنجره اختصاصی و شکیل خرید اشتراک Chinify PRO
  w.kanOpenProPaywall = function(targetLevel) {
    var existing = document.getElementById('kanProModal');
    if (existing) existing.remove();

    var targetName = targetLevel === 'hsk5' ? 'سطح ۵ (HSK 5)' : (targetLevel === 'hsk4' ? 'سطح ۴ (HSK 4)' : (targetLevel === 'hsk3' ? 'سطح ۳ (HSK 3)' : (targetLevel === 'hsk2' ? 'سطح ۲ (HSK 2)' : 'سطوح پیشرفته HSK 2، 3، 4 و 5')));

    var modal = document.createElement('div');
    modal.id = 'kanProModal';
    modal.className = 'kan-pro-modal-overlay';
    modal.innerHTML = 
      '<div class="kan-pro-sheet">' +
        '<button class="kan-pro-sheet-close" type="button" aria-label="بستن">✕</button>' +
        '<div class="kan-pro-crown-header">' +
          '<div class="kan-pro-crown-icon-big">👑</div>' +
          '<h2 class="kan-pro-title">اشتراک ویژه Chinify PRO</h2>' +
          '<p class="kan-pro-sub">برای دسترسی به ' + targetName + ' و صدها تمرین تعاملی، نسخه ویژه را فعال کنید.</p>' +
        '</div>' +

        '<div class="kan-pro-benefits">' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>دسترسی کامل و نامحدود به ۶۰ درس HSK 2، HSK 3، HSK 4 و HSK 5</span>' +
          '</div>' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>بیش از ۲۸۰۰ واژه تخصصی به همراه صوت بومی و فلش‌کارت</span>' +
          '</div>' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>۳۲۰ نکته گرامری پیشرفته با تمرین و فیدبک هوشمند</span>' +
          '</div>' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>مکالمات روزمره، متون تحلیلی و آمادگی کامل آزمون رسمی HSK</span>' +
          '</div>' +
        '</div>' +

        '<div class="kan-pro-plans">' +
          '<div class="kan-pro-plan-box" data-plan="monthly">' +
            '<div class="kan-pro-plan-right">' +
              '<div class="kan-pro-plan-radio"></div>' +
              '<div class="kan-pro-plan-name">اشتراک ۱ ماهه</div>' +
            '</div>' +
            '<div class="kan-pro-plan-price">۷۵۰,۰۰۰ تومان</div>' +
          '</div>' +

          '<div class="kan-pro-plan-box is-selected" data-plan="annual">' +
            '<div class="kan-pro-plan-right">' +
              '<div class="kan-pro-plan-radio"></div>' +
              '<div>' +
                '<div class="kan-pro-plan-name" style="display:flex;align-items:center;gap:6px;">اشتراک ۱ ساله <span class="kan-pro-plan-off">۳۰٪ تخفیف</span></div>' +
                '<div style="font-size:11px;color:#64748B;">محبوب‌ترین انتخاب زبان‌آموزان (ماهی ۵۲۵,۰۰۰ تومان)</div>' +
              '</div>' +
            '</div>' +
            '<div class="kan-pro-plan-price">۶,۳۰۰,۰۰۰ تومان</div>' +
          '</div>' +

          '<div class="kan-pro-plan-box" data-plan="quarterly">' +
            '<div class="kan-pro-plan-right">' +
              '<div class="kan-pro-plan-radio"></div>' +
              '<div class="kan-pro-plan-name">اشتراک ۳ ماهه</div>' +
            '</div>' +
            '<div class="kan-pro-plan-price">۱,۹۵۰,۰۰۰ تومان</div>' +
          '</div>' +
        '</div>' +

        '<button class="kan-pro-cta-btn" type="button">' +
          '<span>💳</span>' +
          '<span>ورود به درگاه پرداخت و فعال‌سازی</span>' +
        '</button>' +
        '<div style="font-size:11.5px;color:#64748B;text-align:center;margin-top:-6px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:5px;">' +
          '<span>🔒</span>' +
          '<span>اتصال امن به درگاه پرداخت اینترنتی شاپرک / عضو شتاب</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // مدیریت کلیک‌ها درون شیت پرو
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.closest('.kan-pro-sheet-close')) {
        modal.remove();
        return;
      }

      var planBox = e.target.closest('.kan-pro-plan-box');
      if (planBox) {
        modal.querySelectorAll('.kan-pro-plan-box').forEach(function(b) { b.classList.remove('is-selected'); });
        planBox.classList.add('is-selected');
        return;
      }

      // کلیک دکمه اصلی پرداخت / اتصال به درگاه (بدون فعال‌سازی مستقیم پرو)
      var ctaBtn = e.target.closest('.kan-pro-cta-btn');
      if (ctaBtn) {
        var selectedBox = modal.querySelector('.kan-pro-plan-box.is-selected');
        var planId = selectedBox ? selectedBox.getAttribute('data-plan') : 'annual';
        if (typeof w.kanGoToPaymentGateway === 'function') {
          w.kanGoToPaymentGateway(planId, targetLevel);
        }
        return;
      }
    });
  };

  w.kanOpenLevelPicker = function() {
    var curCourse = getCurrentCourse();
    var isPro = isProUser();
    var existing = document.getElementById('kanLevelModal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'kanLevelModal';
    modal.className = 'kan-level-modal-overlay';
    modal.innerHTML = 
      '<div class="kan-level-modal-sheet">' +
        '<div class="kan-level-modal-header">' +
          '<div class="kan-level-modal-title">انتخاب سطح آموزشی (دوره HSK)</div>' +
          '<button class="kan-level-modal-close" type="button" aria-label="بستن">✕</button>' +
        '</div>' +
        '<div class="kan-level-options">' +
          '<div class="kan-level-card ' + (curCourse === 'hsk1' ? 'is-active' : '') + '" data-level="hsk1">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk1">HSK 1</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۱: مقدماتی (HSK 1)</span>' +
                  '<span class="kan-level-tag-free">رایگان</span>' +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۱۵۰ واژه · الفبا و مکالمات پایه</div>' +
              '</div>' +
            '</div>' +
            (curCourse === 'hsk1' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>') +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk2' ? 'is-active' : '') + (!isPro ? ' is-pro-card' : '') + '" data-level="hsk2">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk2">HSK 2</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۲: متوسط مقدماتی (HSK 2)</span>' +
                  (!isPro ? '<span class="kan-level-tag-pro">👑 PRO</span>' : '<span class="kan-level-tag-unlocked">فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۳۰۰ واژه · سفر، کار، احساسات و گرامر</div>' +
              '</div>' +
            '</div>' +
            (!isPro ? '<div class="kan-level-lock-badge">🔒</div>' : (curCourse === 'hsk2' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>')) +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk3' ? 'is-active' : '') + (!isPro ? ' is-pro-card' : '') + '" data-level="hsk3">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk3">HSK 3</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۳: متوسط (HSK 3)</span>' +
                  (!isPro ? '<span class="kan-level-tag-pro">👑 PRO</span>' : '<span class="kan-level-tag-unlocked">فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۶۰۰ واژه · متون، گرامرهای پیشرفته و مکالمه</div>' +
              '</div>' +
            '</div>' +
            (!isPro ? '<div class="kan-level-lock-badge">🔒</div>' : (curCourse === 'hsk3' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>')) +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk4' ? 'is-active' : '') + (!isPro ? ' is-pro-card' : '') + '" data-level="hsk4">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk4">HSK 4</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۴: پیشرفته و کاری (HSK 4)</span>' +
                  (!isPro ? '<span class="kan-level-tag-pro">👑 PRO</span>' : '<span class="kan-level-tag-unlocked">فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۶۰۰ واژه · جامعه، فناوری، مدیریت و آزمون HSK 4</div>' +
              '</div>' +
            '</div>' +
            (!isPro ? '<div class="kan-level-lock-badge">🔒</div>' : (curCourse === 'hsk4' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>')) +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk5' ? 'is-active' : '') + (!isPro ? ' is-pro-card' : '') + '" data-level="hsk5">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk5">HSK 5</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۵: فوق‌پیشرفته و تخصصی (HSK 5)</span>' +
                  (!isPro ? '<span class="kan-level-tag-pro">👑 PRO</span>' : '<span class="kan-level-tag-unlocked">فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۱۳۰۰ واژه · تحلیل ادبی، بوم‌شناسی، تجارت و تسلط جامع</div>' +
              '</div>' +
            '</div>' +
            (!isPro ? '<div class="kan-level-lock-badge">🔒</div>' : (curCourse === 'hsk5' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>')) +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.closest('.kan-level-modal-close')) {
        modal.remove();
        return;
      }
      var card = e.target.closest('.kan-level-card');
      if (card) {
        var lvl = card.getAttribute('data-level');
        if (lvl) {
          modal.remove();
          if ((lvl === 'hsk2' || lvl === 'hsk3' || lvl === 'hsk4' || lvl === 'hsk5') && !isProUser()) {
            w.kanOpenProPaywall(lvl);
          } else {
            w.kanSelectCourseLevel(lvl);
          }
        }
      }
    });
  };

  w.renderEnhancedHome = function() {
    var host = document.getElementById('screen-host');
    if (host) {
      host.innerHTML = getHomeHTML();
      host.scrollTop = 0;
    }
    var tabbar = document.getElementById('tabbar');
    if (tabbar && !tabbar.hidden) {
      renderEnhancedTabbar('home');
    }
  };

  w.kanSelectCourseLevel = function(level) {
    var modal = document.getElementById('kanLevelModal');
    if (modal) modal.remove();
    try {
      localStorage.setItem('chinifa_current_course', level);
      if (w.Store && w.Store.set) {
        w.Store.set({ currentCourse: level });
      }
    } catch(e) {}

    if (w.UnitSystem && w.UnitSystem.runner) {
      w.UnitSystem.runner.unitKey = level + ':0';
    }

    w.renderEnhancedHome();
    if (w.UI && w.UI.toast) {
      w.UI.toast('دوره آموزشی به ' + (level === 'hsk5' ? 'HSK 5' : (level === 'hsk4' ? 'HSK 4' : (level === 'hsk3' ? 'HSK 3' : (level === 'hsk2' ? 'HSK 2' : 'HSK 1')))) + ' تغییر یافت.');
    }
  };

  function handleGlobalTap(e) {
    // ۱. بررسی کلیک روی تب‌های بار پایین
    var tabBtn = e.target.closest('.kan-tab-btn');
    if (tabBtn) {
      var tabId = tabBtn.getAttribute('data-tab');
      if (tabId) {
        e.preventDefault();
        e.stopPropagation();
        w.kanSelectTab(tabId);
        return;
      }
    }

    // ۲. بررسی کلیک روی کارت‌های درس، سکوها یا کادرهای آزمون مرور
    var lessonEl = e.target.closest('.lesson-card-item, .milestone-review-box');
    if (lessonEl) {
      var lessonIdx = lessonEl.getAttribute('data-lesson-idx');
      if (lessonIdx !== null && lessonIdx !== undefined) {
        e.preventDefault();
        e.stopPropagation();
        if (lessonIdx === "lesson0") {
          w.kanOpenLesson("lesson0");
        } else {
          var num = parseInt(lessonIdx, 10);
          if (isLessonUnlocked(num)) {
            w.kanOpenLesson(num);
          } else {
            var numFa = lessonEl.getAttribute('data-lesson-num') || ('درس ' + (num + 1));
            if (window.UI && UI.toast) {
              UI.toast('«' + numFa + '» قفل است. لطفاً ابتدا درس قبلی را کامل کنید.');
            }
          }
        }
        return;
      }
    }

    // ۴. بررسی کلیک روی چیپ Streak / امروز
    var streakBtn = e.target.closest('.kan-chip-streak');
    if (streakBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (w.App && typeof w.App.go === 'function') {
        w.App.go('myProgress');
      }
      return;
    }

    // بررسی کلیک روی بنر ارتقا به پرو
    var proBanner = e.target.closest('.kan-pro-roadmap-banner, [data-act="openProPaywall"]');
    if (proBanner) {
      e.preventDefault();
      e.stopPropagation();
      w.kanOpenProPaywall(getCurrentCourse());
      return;
    }

    // ۵. بررسی کلیک روی چیپ Level / انتخاب سطح دوره
    var levelBtn = e.target.closest('.kan-level-chip');
    if (levelBtn) {
      e.preventDefault();
      e.stopPropagation();
      w.kanOpenLevelPicker();
      return;
    }

    // ۶. دکمه بازگشت شناور درون درس‌ها و زیردرس‌ها
    var backBtn = e.target.closest('.screen-back-btn');
    if (backBtn) {
      var act = backBtn.getAttribute('data-act');
      var argStr = backBtn.getAttribute('data-arg');
      e.preventDefault();
      e.stopPropagation();
      if (act === 'unitGoPath') {
        if (w.UnitActions && typeof w.UnitActions.unitGoPath === 'function') {
          w.UnitActions.unitGoPath();
          return;
        }
        if (w.UnitSystem && typeof w.UnitSystem.unitGoPath === 'function') {
          w.UnitSystem.unitGoPath();
          return;
        }
      }
      if (argStr) {
        try {
          var parsed = JSON.parse(argStr);
          if (parsed && parsed.s && w.App && typeof w.App.go === 'function') {
            w.App.go(parsed.s);
            return;
          }
        } catch (err) {}
      }
      if (w.App && typeof w.App.go === 'function') {
        w.App.go('home');
      }
      return;
    }

    // ۷. کلیک روی ۴ جزیره معلق درس (واژگان، گرامر، تلفظ، مکالمه)
    var podEl = e.target.closest('.subtask-interactive-pod');
    if (podEl) {
      var pAct = podEl.getAttribute('data-act');
      var pArgStr = podEl.getAttribute('data-arg');
      var pArg = {};
      if (pArgStr) try { pArg = JSON.parse(pArgStr); } catch(err) {}
      e.preventDefault();
      e.stopPropagation();
      if ((pAct === 'go' || (pArg && pArg.s)) && w.App && typeof w.App.go === 'function') {
        w.App.go((pArg && pArg.s) || (pAct === 'go' ? pArgStr : 'home'));
      } else if (pAct === 'unitSelectSection' && w.UnitSystem && typeof w.UnitSystem.unitSelectSection === 'function') {
        w.UnitSystem.unitSelectSection(pArg);
      } else if (pAct === 'unitLockedToast' && w.UI && typeof w.UI.toast === 'function') {
        w.UI.toast('بخش ' + (pArg.name || '') + ' قفل است. ابتدا بخش قبل را کامل کنید.');
      }
      return;
    }

    // ۸. کلیک روی کارت‌های مراحل تمرین زیردرس
    var stageCard = e.target.closest('.practice-stage-card');
    if (stageCard) {
      var sAct = stageCard.getAttribute('data-act');
      var sArgStr = stageCard.getAttribute('data-arg');
      var sArg = {};
      if (sArgStr) try { sArg = JSON.parse(sArgStr); } catch(err) {}
      e.preventDefault();
      e.stopPropagation();
      if ((sAct === 'unitStartExercise' || sAct === 'unitStartMiniPath') && w.UnitActions && typeof w.UnitActions.unitStartExercise === 'function') {
        w.UnitActions.unitStartExercise(sArg);
      } else if ((sAct === 'unitStartExercise' || sAct === 'unitStartMiniPath') && w.UnitSystem && typeof w.UnitSystem.unitStartMiniPath === 'function') {
        w.UnitSystem.unitStartMiniPath(sArg);
      } else if ((sAct === 'unitLockedToast' || sAct === 'unitLockedMiniToast') && w.UI && typeof w.UI.toast === 'function') {
        w.UI.toast('این مرحله قفل است. ابتدا مراحل قبل را به پایان برسانید.');
      }
      return;
    }
  }

  document.addEventListener('click', handleGlobalTap, true);

  // ════════════════════════════════════════════════════════════
  // ۴. اتصال مستقیم به سیستم SCREENS و موتور رندر chinifa
  // ════════════════════════════════════════════════════════════
  function setupScreensOverride() {
    if (!w.SCREENS) w.SCREENS = {};

    w.SCREENS.home = {
      render: function() {
        return getHomeHTML();
      },
      update: function(host) {
        if (!host || !host.querySelector('.kan-home-roadmap')) {
          return false;
        }
        var curChip = host.querySelector('.kan-level-chip');
        var expected = getCurrentCourse() === 'hsk5' ? 'HSK 5' : (getCurrentCourse() === 'hsk4' ? 'HSK 4' : (getCurrentCourse() === 'hsk3' ? 'HSK 3' : (getCurrentCourse() === 'hsk2' ? 'HSK 2' : 'HSK 1')));
        if (curChip && curChip.innerText.indexOf(expected) === -1) {
          return false;
        }
        return true;
      },
      after: function(host) {
        // اطمینان از اسکرول و وضعیت تب‌بار
        var tabbar = document.getElementById('tabbar');
        if (tabbar && !tabbar.hidden) {
          renderEnhancedTabbar('home');
        }
      }
    };
  }

  function applyEnhancements() {
    if (!w.App) return;
    try { if (w.Capacitor && w.Capacitor.Plugins && w.Capacitor.Plugins.SplashScreen) w.Capacitor.Plugins.SplashScreen.hide(); if (w.navigator && w.navigator.splashscreen) w.navigator.splashscreen.hide(); } catch(e){}

    setupScreensOverride();

    // ۱. بررسی صفحه خانه: اگر کاربر در خانه است و هنوز نقشه کامل نیست، تزریق فوری
    if (w.App.screen === 'home') {
      var host = document.getElementById('screen-host');
      if (host) {
        var roadmap = host.querySelector('.kan-home-roadmap');
        if (!roadmap) {
          host.innerHTML = getHomeHTML();
          host.scrollTop = 0;
        }
      }
    }

    // ۲. به‌روزرسانی نوار پایین ۶ گزینه‌ای سه‌بعدی
    var tabbar = document.getElementById('tabbar');
    if (tabbar && !tabbar.hidden) {
      renderEnhancedTabbar(w.App.screen);
    }
  }

  function hookLifecycle() {
    if (!w.App || (typeof w.App.rerender !== 'function' && typeof w.App.go !== 'function')) {
      return setTimeout(hookLifecycle, 50);
    }

    setupScreensOverride();

    // ۱. هوک App.go جهت ناوبری بدون خطا
    if (typeof w.App.go === 'function') {
      var origGo = w.App.go;
      w.App.go = function(screen, opts) {
        var ret = origGo.apply(this, arguments);
        setTimeout(applyEnhancements, 0);
        return ret;
      };
    }

    // ۲. هوک App.rerender اصلی اپلیکیشن
    if (typeof w.App.rerender === 'function') {
      var origRerender = w.App.rerender;
      w.App.rerender = function() {
        setupScreensOverride();
        var ret = origRerender.apply(this, arguments);
        setTimeout(applyEnhancements, 0);
        return ret;
      };
    }

    // ۳. هوک UI.tabbar
    if (w.UI && typeof w.UI.tabbar === 'function') {
      var origTabbar = w.UI.tabbar;
      w.UI.tabbar = function(screen) {
        var ret = origTabbar.apply(this, arguments);
        var tabbarEl = document.getElementById('tabbar');
        var mainTabs = ['home', 'explore', 'vocab', 'library', 'me'];
        var currentScreen = screen || (w.App ? w.App.screen : 'home');
        if (mainTabs.indexOf(currentScreen) >= 0 && tabbarEl) {
          tabbarEl.hidden = false;
          renderEnhancedTabbar(currentScreen);
        } else if (tabbarEl && !tabbarEl.hidden) {
          renderEnhancedTabbar(currentScreen);
        }
        return ret;
      };
    }

    // اجرای فوری
    applyEnhancements();
  }

  function initAppSplash() {
    var splash = document.getElementById('chinifa-splash');
    if (!splash || splash.__initDone) return;
    splash.__initDone = true;

    // افکت صوتی صعود و درخشش اژدهای چی‌نی‌فا
    try {
      var shine = new Audio('art/sfx/gold-shine.mp3');
      shine.volume = 0.45;
      shine.play().catch(function() {});
    } catch(e) {}

    if (typeof window.__dismissSplash === 'function') {
      return;
    }

    var dismissed = false;
    function dismissSplash() {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add('is-out');
      setTimeout(function() {
        if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
      }, 250);
    }

    splash.addEventListener('click', dismissSplash);
    splash.addEventListener('touchstart', dismissSplash, { passive: true });

    setTimeout(dismissSplash, 2300);
  }

  // ثبت فوری override ها حتی قبل از DOMContentLoaded
  setupScreensOverride();
  initAppSplash();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initAppSplash();
      hookLifecycle();
    });
  } else {
    initAppSplash();
    hookLifecycle();
  }

}(window);
