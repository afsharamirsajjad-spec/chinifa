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
        { num: 1, idx: 0, numFa: 'درس اول', title: 'سلام و احوالپرسی اولیه', zh: '你好，中国！', py: 'Nǐ hǎo, Zhōngguó!', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'معرفی خود، نام و ملیت', zh: '我叫李强，我是中国人', py: 'Wǒ jiào Lǐ Qiáng, wǒ shì Zhōngguórén', mascot: BASE + 'mascot-idle.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'خانواده و دوستان من', zh: '这是我的家人', py: 'Zhè shì wǒ de jiārén', mascot: BASE + 'mascot-read.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون کوهستان مه', sub: 'سنجش لغات و مباحث ایستگاه اول', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: دهکده بر فراز ابرها',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_station2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'آفرین! به شهر دوم رسیدیم', sub: 'توی این ایستگاه خرید روزمره و سفارش غذا را یاد می‌گیری ☁️' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'اعداد، پول و خرید کردن', zh: '这个多少钱？', py: 'Zhège duōshao qián?', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'پرداخت با بارکد و تلفن همراه', zh: '我用手机扫码支付', py: 'Wǒ yòng shǒujī sǎomǎ zhīfù', mascot: BASE + 'mascot-book.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'سفارش غذا و نوشیدنی در رستوران', zh: '我想吃中国菜，喝茶', py: 'Wǒ xiǎng chī Zhōngguócài, hē chá', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون روستای ابری', sub: 'تثبیت لغات و قواعد خرید و پرداخت دیجیتال', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: شهر رویایی فانوس‌ها',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_station3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'شب‌های درخشان و فانوس‌های سرخ!', sub: 'زمان‌بندی، تاریخ و چیدمان وسایل خانه را تمرین کن 🏮' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'ساعت و زمان‌بندی روزمره', zh: '现在几点了？', py: 'Xiànzài jǐ diǎn le?', mascot: BASE + 'mascot-score.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'تقویم، روزهای هفته و تاریخ', zh: '今天几月几号？', py: 'Jīntiān jǐ yuè jǐ hào?', mascot: BASE + 'mascot-run.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'موقعیت مکانی و اشیاء', zh: '电脑在桌子上', py: 'Diànnǎo zài zhuōzi shang', mascot: BASE + 'mascot-flame.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون شهر فانوس‌ها', sub: 'سنجش مهارت‌های کاربردی زمان و مکان', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: معبد آرامش و پاگودای برفی',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_station4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'هوای برفی و تمرین‌های گرم!', sub: 'مترو، آب‌وهوا و مراقبت‌های پزشکی ❄️' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'حمل‌ونقل عمومی و مترو', zh: '坐地铁去学校', py: 'Zuò dìtiě qù xuéxiào', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'آب‌وهوا، فصل‌ها و لباس', zh: '今天天气很冷，多穿衣服', py: 'Jīntiān tiānqì hěn lěng, duō chuān yīfu', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'سلامت، احساس بیماری و پزشک', zh: '我有点儿不舒服', py: 'Wǒ yǒudiǎnr bù shūfu', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون پاگودای برفی', sub: 'سنجش جامع سفر درون‌شهری، اقلیم و سلامتی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: قصر آسمانی اژدها',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_station5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'تبریک! به قصر نهایی رسیدی!', sub: 'آماده‌ای برای آزمون جامع و جشن پایان HSK 1؟ 🏆' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'خانه، اتاق و وسایل زندگی', zh: '我的新房间很干净', py: 'Wǒ de xīn fángjiān hěn gānjìng', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'سرگرمی‌ها، ورزش و علایق', zh: '你喜欢什么运动？', py: 'Nǐ xǐhuan shénme yùndòng?', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'سفر، احساسات و جمع‌بندی سطح ۱', zh: '我们一起去旅游吧！', py: 'Wǒmen yìqǐ qù lǚyóu ba!', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن پایان سطح ۱', title: 'قصر آسمانی و دریافت نشان اژدها', sub: 'سنجش ۱۵۰ کلمه کلیدی + جشن فارغ‌التحصیلی HSK 1', isGrand: true }
    }
  ];

  var STATIONS_HSK2 = [
    {
      id: 1,
      title: 'ایستگاه اول: بندر کهن بادبان‌ها و فانوس‌ها',
      badge: 'درس ۱ تا ۳',
      bgImg: BASE + 'bg_hsk2_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'خوش آمدید به سطح دوم HSK!', sub: 'سفر به پکن، تندرستی روزانه و انتخاب لباس را یاد می‌گیرید ⛵' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'سفر به پکن در پاییز', zh: '九月去北京旅游最好', py: 'Jiǔyuè qù Běijīng lǚyóu zuì hǎo', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'برنامه روزانه و تندرستی', zh: '我每天六点起床跑步', py: 'Wǒ měitiān liù diǎn qǐchuáng pǎobù', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'انتخاب رنگ و لباس', zh: '左边那个红色的是我的', py: 'Zuǒbiān nàge hóngsè de shì wǒ de', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون بندر کهن', sub: 'سنجش صفت عالی، برنامه صبحگاهی و صفات مالکیت با 的', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: بازار بزرگ ابریشم و بسته‌های پستی',
      badge: 'درس ۴ تا ۶',
      bgImg: BASE + 'bg_hsk2_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'خرید اینترنتی و طعم‌های دلنشین!', sub: 'تحویل مرسولات، تصمیم‌گیری در خرید و عادات غذایی 🍵' },
      lessons: [
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'خرید اینترنتی و تحویل بسته پستی', zh: '这个快递是他帮我取的', py: 'Zhège kuàidì shì tā bāng wǒ qǔ de', mascot: BASE + 'mascot-read.webp' },
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'انتخاب نهایی در مرکز خرید', zh: '就买这件吧', py: 'Jiù mǎi zhè jiàn ba', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'طعم غذاها و عادات غذایی', zh: '你怎么不吃了？', py: 'Nǐ zěnme bù chī le?', mascot: BASE + 'mascot-cheer.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون بازار ابریشم', sub: 'تثبیت تأکید با 是...的، تأکید تصمیمی با 就 و پرسش چرایی با 怎么', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: بارگاه شکوفه‌های گیلاس و گذر زمان',
      badge: 'درس ۷ تا ۹',
      bgImg: BASE + 'bg_hsk2_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'نیمه راه HSK 2!', sub: 'محاسبه مسافت، مشورت و متمم‌های نتیجه در امتحانات 🌸' },
      lessons: [
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'فاصله تا محل کار و وسایل نقلیه', zh: '你家离公司远吗？', py: 'Nǐ jiā lí gōngsī yuǎn ma?', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'فکر کردن و مشورت با دیگران', zh: '让我想想，再告诉你', py: 'Ràng wǒ xiǎngxiang, zài gàosu nǐ', mascot: BASE + 'mascot-point.webp' },
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'امتحان و متمم نتیجه', zh: '题太多，我没做完', py: 'Tí tài duō, wǒ méi zuò wán', mascot: BASE + 'mascot-star.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون باغ گیلاس', sub: 'سنجش ساختار فاصله با 离، افعال سببی 让 و متمم‌های نتیجه با 完 و 懂', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: گذرگاه کوهستانی بامبو و مقایسه‌ها',
      badge: 'درس ۱۰ تا ۱۲',
      bgImg: BASE + 'bg_hsk2_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'مهارت‌های زبانی پیشرفته‌تر!', sub: 'جملات نهی، مقایسه قد و سن با 比 و توصیف عملکرد با 得 🎋' },
      lessons: [
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'جملات نهی و پیدا کردن وسایل', zh: '别找了，手机在桌子上呢', py: 'Bié zhǎo le, shǒujī zài zhuōzi shang ne', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'مقایسه سن، قد و صفات با 比', zh: '他比我大三岁', py: 'Tā bǐ wǒ dà sān suì', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'توصیف حالت و چگونگی با 得', zh: '你穿得太少了', py: 'Nǐ chuān de tài shǎo le', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون گذرگاه بامبو', sub: 'تسلط بر نهی با 别، جملات مقایسه‌ای 比 و متمم‌های توصیفی 得', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: کاخ ققنوس زرین و جشن سال نو',
      badge: 'درس ۱۳ تا ۱۵',
      bgImg: BASE + 'bg_hsk2_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله افتخار سطح ۲!', sub: 'استمرار حالت با 着، تجربیات شیرین با 过 و جشن سال نو چینی 🏮' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'استمرار حالت با 着 و آدرس دادن', zh: '门开着呢，请往前走', py: 'Mén kāi zhe ne, qǐng wǎng qián zǒu', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'تجربیات گذشته با 过 و ربط تضاد', zh: '你看过那个电影吗？', py: 'Nǐ kàn guo nàge diànyǐng ma?', mascot: BASE + 'mascot-star.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'سال نو چینی و جمع‌بندی سطح ۲', zh: '新年就要到了', py: 'Xīnnián jiù yào dào le', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 2', title: 'کاخ ققنوس و دریافت نشان سیمین HSK2', sub: 'سنجش ۳۰۰ کلمه رسمی + گواهی اتمام سطح ۲', isGrand: true }
    }
  ];

  var STATIONS_HSK3 = [
    {
      id: 1,
      title: 'ایستگاه اول: جنگل خیزران و پاگودای کهن',
      badge: 'درس ۱ تا ۴',
      bgImg: BASE + 'bg_hsk3_st1.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'به سطح سوم HSK خوش آمدید!', sub: 'برنامه‌ریزی، متمم‌های جهت ساده، استمرار با 着 و آداب برخورد 🎋' },
      lessons: [
        { num: 1, idx: 0, numFa: 'درس اول', title: 'برنامه‌ریزی برای آخر هفته', zh: '周末你有什么打算？', py: 'Zhōumò nǐ yǒu shénme dǎsuàn?', mascot: BASE + 'mascot-wave.webp' },
        { num: 2, idx: 1, numFa: 'درس دوم', title: 'متمم‌های جهت ساده و بازگشت', zh: '他什么时候回来？', py: 'Tā shénme shíhou huílái?', mascot: BASE + 'mascot-run.webp' },
        { num: 3, idx: 2, numFa: 'درس سوم', title: 'استمرار حالت و قرارگیری اشیاء با 着', zh: '桌子上放着一瓶饮料', py: 'Zhuōzi shang fàng zhe yì píng yǐnliào', mascot: BASE + 'mascot-idle.webp' },
        { num: 4, idx: 3, numFa: 'درس چهارم', title: 'بیان نحوه انجام کار با 着 و قید 总是', zh: '她总是笑着跟客人说话', py: 'Tā zǒngshì xiào zhe gēn kèrén shuōhuà', mascot: BASE + 'mascot-read.webp' }
      ],
      review: { tag: 'مرور فصل ۱', title: 'آزمون جنگل خیزران', sub: 'سنجش ۸۰ واژه، متمم‌های جهت ساده و کاربردهای 着', isGrand: false }
    },
    {
      id: 2,
      title: 'ایستگاه دوم: پل‌های معلق ابر و قله‌های فانوس',
      badge: 'درس ۵ تا ۸',
      bgImg: BASE + 'bg_hsk3_st2.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'بر فراز قله‌های آسمانی!', sub: 'تغییرات تدریجی، متمم توانایی، فرودگاه و ضمایر پرسشی دوتایی 🏮' },
      lessons: [
        { num: 5, idx: 4, numFa: 'درس پنجم', title: 'تغییرات تدریجی با 越来越 و سلامتی', zh: '我最近越来越胖了', py: 'Wǒ zuìjìn yuè lái yuè pàng le', mascot: BASE + 'mascot-score.webp' },
        { num: 6, idx: 5, numFa: 'درس ششم', title: 'متمم‌های توانایی و پیدا کردن اشیاء', zh: '怎么突然找不到了？', py: 'Zěnme tūrán zhǎo bu dào le?', mascot: BASE + 'mascot-cheer.webp' },
        { num: 7, idx: 6, numFa: 'درس هفتم', title: 'سفر هوایی، فرودگاه و ساختار تأکید 是...的', zh: '我是坐飞机来北京的', py: 'Wǒ shì zuò fēijī lái Běijīng de', mascot: BASE + 'mascot-book.webp' },
        { num: 8, idx: 7, numFa: 'درس هشتم', title: 'کاربرد دوگانه ضمایر پرسشی و رستوران', zh: '你去哪儿我就去哪儿', py: 'Nǐ qù nǎr wǒ jiù qù nǎr', mascot: BASE + 'mascot-point.webp' }
      ],
      review: { tag: 'مرور فصل ۲', title: 'آزمون پل‌های آسمانی', sub: 'تثبیت 越来越، متمم توانایی 得/不، ساختار 是...的 و 只要...就', isGrand: false }
    },
    {
      id: 3,
      title: 'ایستگاه سوم: دره گراند کنیون رود یشم',
      badge: 'درس ۹ تا ۱۲',
      bgImg: BASE + 'bg_hsk3_st3.jpg',
      bubbleSide: 'right',
      dragonQuote: { title: 'نیمه راه HSK 3!', sub: 'مقایسه‌های پیشرفته و تسلط کامل بر ساختار پرکاربرد 把 🌊' },
      lessons: [
        { num: 9, idx: 8, numFa: 'درس نهم', title: 'مقایسه برابری با 跟...一样 و متمم توصیفی', zh: '她的汉语说得跟中国人一样好', py: 'Tā de Hànyǔ shuō de gēn Zhōngguórén yíyàng hǎo', mascot: BASE + 'mascot-star.webp' },
        { num: 10, idx: 9, numFa: 'درس دهم', title: 'مقایسه تفصیلی با 多了 و ساختار 一边...一边...', zh: '数学比历史难多了', py: 'Shùxué bǐ lìshǐ nán duō le', mascot: BASE + 'mascot-search.webp' },
        { num: 11, idx: 10, numFa: 'درس یازدهم', title: 'جمله تصرفی 把 و جابجایی اشیاء', zh: '别忘了把空调关了', py: 'Bié wàng le bǎ kōngtiáo guān le', mascot: BASE + 'mascot-peek.webp' },
        { num: 12, idx: 11, numFa: 'درس دوازدهم', title: 'جمله 把 با متمم‌های نتیجه و تمیزکاری', zh: '把这件衣服洗干净', py: 'Bǎ zhè jiàn yīfu xǐ gānjìng', mascot: BASE + 'mascot-grad.webp' }
      ],
      review: { tag: 'مرور فصل ۳', title: 'آزمون دره رود یشم', sub: 'سنجش مقایسه‌ها و تمام قواعد جمله تصرفی 把', isGrand: false }
    },
    {
      id: 4,
      title: 'ایستگاه چهارم: قله برفی اژدها و معبد بلورین یخ',
      badge: 'درس ۱۳ تا ۱۶',
      bgImg: BASE + 'bg_hsk3_st4.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'معابد برفی و گرامرهای طلایی!', sub: 'متمم‌های جهت مرکب، استثناء با 除了، تأکید 连 و شدت احساسات ❄️' },
      lessons: [
        { num: 13, idx: 12, numFa: 'درس سیزدهم', title: 'متمم‌های جهت مرکب و حرکت', zh: '我是走回来的', py: 'Wǒ shì zǒu huílái de', mascot: BASE + 'mascot-cheer.webp' },
        { num: 14, idx: 13, numFa: 'درس چهاردهم', title: 'آوردن و بردن با 把 + متمم جهت مرکب', zh: '你把水果拿过来', py: 'Nǐ bǎ shuǐguǒ ná guòlái', mascot: BASE + 'mascot-run.webp' },
        { num: 15, idx: 14, numFa: 'درس پانزدهم', title: 'استثناء با 除了...以外 و تأکید 连...都', zh: '其他都没什么问题', py: 'Qítā dōu méi shénme wèntí', mascot: BASE + 'mascot-book.webp' },
        { num: 16, idx: 15, numFa: 'درس شانزدهم', title: 'شدت احساسات با 极了 و جملات سببی 让', zh: '我现在累极了', py: 'Wǒ xiànzài lèi jí le', mascot: BASE + 'mascot-idle.webp' }
      ],
      review: { tag: 'مرور فصل ۴', title: 'آزمون معبد بلورین یخ', sub: 'تسلط بر متمم‌های مرکب، ساختار 除了 و جملات سببی', isGrand: false }
    },
    {
      id: 5,
      title: 'ایستگاه پنجم: شهر اژدهای آسمانی و ارگ زمردین',
      badge: 'درس ۱۷ تا ۲۰',
      bgImg: BASE + 'bg_hsk3_st5.jpg',
      bubbleSide: 'left',
      dragonQuote: { title: 'قله افتخار و جشن فارغ‌التحصیلی HSK 3!', sub: 'ضمایر همگانی، ساختار مجهول 被، متمم‌های کشف و گواهی سطح سوم 🏆' },
      lessons: [
        { num: 17, idx: 16, numFa: 'درس هفدهم', title: 'ضمایر شمول همگانی (谁都) و 不但...而且', zh: '谁都想去旅行', py: 'Shéi dōu xiǎng qù lǚxíng', mascot: BASE + 'mascot-star.webp' },
        { num: 18, idx: 17, numFa: 'درس هجدهم', title: 'ساختار مجهول 被 و بیان عقیده و توافق', zh: '我相信他们会同意的', py: 'Wǒ xiāngxìn tāmen huì tóngyì de', mascot: BASE + 'mascot-read.webp' },
        { num: 19, idx: 18, numFa: 'درس نوزدهم', title: 'متمم‌های ادراکی و کشف (看出来 / 想起来)', zh: '你没看出来吗？', py: 'Nǐ méi kàn chūlái ma?', mascot: BASE + 'mascot-peek.webp' },
        { num: 20, idx: 19, numFa: 'درس بیستم', title: 'ساختار 被 در زندگی و جشن فارغ‌التحصیلی HSK 3', zh: '祝贺你通过HSK三级考试', py: 'Zhùhè nǐ tōngguò HSK sānjí kǎoshì', mascot: BASE + 'mascot-sleep.webp' }
      ],
      review: { tag: 'جشن فارغ‌التحصیلی HSK 3', title: 'ارگ زمردین و دریافت نشان اژدهای زرین HSK3', sub: 'سنجش جامع ۲۰ درس و ۴۰۰ واژه کلیدی + گواهی رسمی HSK 3', isGrand: true }
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
      var authUser = localStorage.getItem('chinifa_auth_user');
      if (authUser) {
        var u = JSON.parse(authUser);
        if (u && (u.isPro || u.pro)) return true;
      }
      if (window.Store && Store.state) {
        if (Store.state.isPro || Store.state.pro) return true;
        if (Store.state.user && (Store.state.user.isPro || Store.state.user.pro)) return true;
      }
      if (window.Sync && Sync.state && (Sync.state.isPro || Sync.state.pro)) return true;
      if (window.Pay && typeof window.Pay.isPro === 'function') return window.Pay.isPro();
    } catch(e) {}
    return false;
  }

  function isCourseLocked(courseId) {
    // ناوبری و جابجایی بین تمام دوره‌ها برای همه باز است
    return false;
  }

  // توابع اعتبارسنجی باز بودن و تکمیل دروس
  function isLessonUnlocked(lessonIdx) {
    var curCourse = getCurrentCourse();
    // در HSK 1: درس مقدمه و درس اول باز است، بقیه پس از تکمیل درس قبلی یا با اشتراک ویژه
    if (curCourse === 'hsk1') {
      if (lessonIdx === 'lesson0' || lessonIdx === 0 || lessonIdx === '0' || lessonIdx === 1 || lessonIdx === '1') return true;
      var num = Number(lessonIdx);
      if (isNaN(num) || num <= 1) return true;
      return isLessonCompleted(num - 1) || isProUser();
    }
    // در HSK 2، HSK 3، HSK 4 و HSK 5: درس اول (idx 0) برای همه کاملاً باز و رایگان است!
    if (lessonIdx === 0 || lessonIdx === '0') return true;
    // درس دوم به بعد (idx > 0) نیازمند اشتراک ویژه است
    if (!isProUser()) return false;
    var num = Number(lessonIdx);
    if (isNaN(num) || num <= 1) return true;
    return isLessonCompleted(num - 1) || isProUser();
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
      h += '      <span class="kan-pro-banner-crown">🎁</span>';
      h += '      <div class="kan-pro-banner-text">';
      h += '        <div class="kan-pro-banner-title">درس اول ' + courseFaName + ' رایگان است!</div>';
      h += '        <div class="kan-pro-banner-sub">برای باز شدن درس‌های ۲ تا ۱۵، اشتراک ویژه را در سایت تهیه کنید</div>';
      h += '      </div>';
      h += '    </div>';
      h += '    <button class="kan-pro-banner-action-btn" type="button">خرید در سایت</button>';
      h += '  </div>';
    }

    // ۵ ایستگاه
    getStations().forEach(function(station) {
      h += '  <div class="station-section" id="kan-st-' + station.id + '">';
      h += '    <img src="' + station.bgImg + '" alt="' + station.title + '" class="station-full-bg-art" decoding="async">';
      h += '    <div class="station-content-layer">';

      // نوار عنوان ایستگاه در بالاترین نقطه ایستگاه (معرفی ایستگاه بدون پوشاندن تصویر اژدها)
      h += '      <div class="station-title-strip">';
      h += '        <div class="station-name">';
      h += '          <svg class="station-pin-svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
      h += '          <span>' + station.title + '</span>';
      h += '        </div>';
      h += '        <span class="station-pill-tag">' + station.badge + '</span>';
      h += '      </div>';

      // پاپ‌آپ معرفی شهر و حباب پیام اژدها (با دید کامل و شفاف از اژدهای نمادین)
      h += '      <div class="station-top-header-area">';
      h += '        <div class="dragon-dialogue-bubble ' + (station.bubbleSide === 'left' ? 'bubble-left' : '') + '">';
      h += '          <div class="speech-title">' + station.dragonQuote.title + '</div>';
      h += '          <div class="speech-sub">' + station.dragonQuote.sub + '</div>';
      h += '        </div>';
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
    var numIdx = Number(idx);
    if (isNaN(numIdx)) numIdx = 0;

    // در سطوح HSK 2 به بالا: درس اول (idx 0) کاملاً رایگان است! درس دوم به بعد نیازمند اشتراک است
    if ((curCourse === 'hsk2' || curCourse === 'hsk3' || curCourse === 'hsk4' || curCourse === 'hsk5') && numIdx > 0 && !isProUser()) {
      w.kanOpenProPaywall(curCourse, numIdx);
      return;
    }
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
  // هدایت به وب‌سایت جهت خرید و پرداخت اشتراک ویژه (مطابق قوانین پرداخت وب‌سایت)
  w.kanGoToPaymentGateway = function(planId, targetLevel) {
    var existingModal = document.getElementById('kanProModal');
    if (existingModal) existingModal.remove();

    var websiteUrl = (typeof location !== 'undefined' && /^https?:/i.test(location.protocol) && location.hostname && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1')
      ? (location.origin + "/#pricing")
      : "https://chinifa.vercel.app/#pricing";
    try {
      if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
        window.open(websiteUrl, "_system");
      } else {
        window.open(websiteUrl, "_blank");
      }
    } catch(e) {
      location.href = websiteUrl;
    }
  };

  // باز کردن پنجره اختصاصی و شکیل راهنمای خرید اشتراک chinifa PRO در وب‌سایت chinifarsi
  w.kanOpenProPaywall = function(targetLevel, targetLessonIdx) {
    var existing = document.getElementById('kanProModal');
    if (existing) existing.remove();

    var targetName = targetLevel === 'hsk5' ? 'سطح ۵ (HSK 5)' : (targetLevel === 'hsk4' ? 'سطح ۴ (HSK 4)' : (targetLevel === 'hsk3' ? 'سطح ۳ (HSK 3)' : (targetLevel === 'hsk2' ? 'سطح ۲ (HSK 2)' : 'سطوح پیشرفته')));

    var modal = document.createElement('div');
    modal.id = 'kanProModal';
    modal.className = 'kan-pro-modal-overlay';
    modal.innerHTML = 
      '<div class="kan-pro-sheet">' +
        '<button class="kan-pro-sheet-close" type="button" aria-label="بستن">✕</button>' +
        '<div class="kan-pro-crown-header">' +
          '<div class="kan-pro-crown-icon-big">👑</div>' +
          '<h2 class="kan-pro-title">اشتراک ویژه chinifa PRO</h2>' +
          '<p class="kan-pro-sub">درس اول ' + targetName + ' کاملاً <b>رایگان</b> است! برای دسترسی به درس‌های ۲ تا ۱۵، لطفاً اشتراک را از وب‌سایت chinifarsi تهیه کنید.</p>' +
        '</div>' +

        '<div style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:18px;padding:16px 18px;margin-bottom:16px;text-align:right;">' +
          '<div style="font-size:14px;font-weight:900;color:#166534;margin-bottom:8px;display:flex;align-items:center;gap:8px;">' +
            '<span>🌐</span>' +
            '<span>مراحل پرداخت و فعال‌سازی در وب‌سایت:</span>' +
          '</div>' +
          '<div style="font-size:12.5px;color:#15803D;line-height:1.8;">' +
            '۱. روی دکمه <b>«خرید اشتراک در وب‌سایت»</b> کلیک کنید.<br>' +
            '۲. در سایت وارد حساب خود شوید (یا با ایمیل لاگین کنید).<br>' +
            '۳. پلن دلخواه را انتخاب و پرداخت کنید.<br>' +
            '۴. با همان ایمیل در اپلیکیشن وارد شوید تا تمامی درس‌ها آنی باز شوند.' +
          '</div>' +
        '</div>' +

        '<div class="kan-pro-benefits">' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>دسترسی به تمام ۶۰ درس HSK 2 تا HSK 5</span>' +
          '</div>' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>بیش از ۲۸۰۰ واژه تخصصی با صوت و آزمون تعاملی</span>' +
          '</div>' +
          '<div class="kan-pro-benefit-row">' +
            '<span class="kan-pro-check-circle">✓</span>' +
            '<span>۳۲۰ نکته گرامری پیشرفته و پشتیبانی اختصاصی</span>' +
          '</div>' +
        '</div>' +

        '<button class="kan-pro-cta-btn" id="kanBtnGoWebsitePay" type="button" style="background:linear-gradient(135deg, #059669 0%, #10B981 100%);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 24px rgba(5,150,105,0.35);">' +
          '<span>🌐</span>' +
          '<span>ورود به سایت و خرید اشتراک</span>' +
        '</button>' +

        '<button id="kanBtnAlreadyPaid" type="button" style="width:100%;height:46px;background:#F1F5F9;color:#0F172A;border:1.5px solid #CBD5E1;border-radius:14px;font-size:13px;font-weight:800;cursor:pointer;margin-top:10px;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;">' +
          '<span>👤</span>' +
          '<span>قبلاً در سایت خریده‌ام (ورود به حساب کاربری)</span>' +
        '</button>' +

        '<button id="kanBtnTryFreeLesson1" type="button" style="width:100%;height:40px;background:transparent;color:#059669;border:none;font-size:12.5px;font-weight:800;cursor:pointer;margin-top:6px;font-family:inherit;">' +
          '← بازگشت و شروع درس اول (رایگان)' +
        '</button>' +
      '</div>';

    document.body.appendChild(modal);

    function closeProModal() {
      document.removeEventListener('keydown', onProEsc);
      if (modal && modal.parentNode) modal.remove();
    }
    function onProEsc(ev) {
      if (ev.key === 'Escape') closeProModal();
    }
    document.addEventListener('keydown', onProEsc);

    var closeBtnEl = modal.querySelector('.kan-pro-sheet-close');
    if (closeBtnEl) {
      closeBtnEl.addEventListener('click', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        closeProModal();
      });
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.closest('.kan-pro-sheet-close')) {
        closeProModal();
        return;
      }

      // کلیک روی ورود به سایت
      var goWebBtn = e.target.closest('#kanBtnGoWebsitePay');
      if (goWebBtn) {
        closeProModal();
        w.kanGoToPaymentGateway('annual', targetLevel);
        return;
      }

      // کلیک روی ورود به حساب
      var loginBtn = e.target.closest('#kanBtnAlreadyPaid');
      if (loginBtn) {
        closeProModal();
        if (w.App && typeof w.App.go === 'function') {
          w.App.go('auth');
        } else if (w.Sync && typeof w.Sync.openSignIn === 'function') {
          w.Sync.openSignIn();
        }
        return;
      }

      // کلیک روی درس ۱ رایگان
      var freeBtn = e.target.closest('#kanBtnTryFreeLesson1');
      if (freeBtn) {
        closeProModal();
        if (typeof w.kanOpenLesson === 'function') {
          w.kanOpenLesson(0);
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

          '<div class="kan-level-card ' + (curCourse === 'hsk2' ? 'is-active' : '') + '" data-level="hsk2">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk2">HSK 2</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۲: متوسط مقدماتی (HSK 2)</span>' +
                  (!isPro ? '<span class="kan-level-tag-free">درس ۱ رایگان</span>' : '<span class="kan-level-tag-unlocked">👑 PRO فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۳۰۰ واژه · سفر، کار، احساسات و گرامر</div>' +
              '</div>' +
            '</div>' +
            (curCourse === 'hsk2' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>') +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk3' ? 'is-active' : '') + '" data-level="hsk3">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk3">HSK 3</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۳: متوسط (HSK 3)</span>' +
                  (!isPro ? '<span class="kan-level-tag-free">درس ۱ رایگان</span>' : '<span class="kan-level-tag-unlocked">👑 PRO فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۶۰۰ واژه · متون، گرامرهای پیشرفته و مکالمه</div>' +
              '</div>' +
            '</div>' +
            (curCourse === 'hsk3' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>') +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk4' ? 'is-active' : '') + '" data-level="hsk4">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk4">HSK 4</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۴: پیشرفته و کاری (HSK 4)</span>' +
                  (!isPro ? '<span class="kan-level-tag-free">درس ۱ رایگان</span>' : '<span class="kan-level-tag-unlocked">👑 PRO فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۶۰۰ واژه · جامعه، فناوری، مدیریت و آزمون HSK 4</div>' +
              '</div>' +
            '</div>' +
            (curCourse === 'hsk4' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>') +
          '</div>' +

          '<div class="kan-level-card ' + (curCourse === 'hsk5' ? 'is-active' : '') + '" data-level="hsk5">' +
            '<div class="kan-level-card-left">' +
              '<div class="kan-level-icon-badge kan-level-hsk5">HSK 5</div>' +
              '<div class="kan-level-card-info">' +
                '<div class="kan-level-card-name-row">' +
                  '<span class="kan-level-card-name">سطح ۵: فوق‌پیشرفته و تخصصی (HSK 5)</span>' +
                  (!isPro ? '<span class="kan-level-tag-free">درس ۱ رایگان</span>' : '<span class="kan-level-tag-unlocked">👑 PRO فعال</span>') +
                '</div>' +
                '<div class="kan-level-card-sub">۱۵ درس · ۱۳۰۰ واژه · تحلیل ادبی، بوم‌شناسی، تجارت و تسلط جامع</div>' +
              '</div>' +
            '</div>' +
            (curCourse === 'hsk5' ? '<div class="kan-level-check-icon">✓</div>' : '<div class="kan-level-radio"></div>') +
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
          w.kanSelectCourseLevel(lvl);
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
        if (w.App && w.App.screen === 'home') {
          applyEnhancements();
        }
        return ret;
      };
    }

    // ۲. هوک App.rerender اصلی اپلیکیشن
    if (typeof w.App.rerender === 'function') {
      var origRerender = w.App.rerender;
      w.App.rerender = function() {
        setupScreensOverride();
        var ret = origRerender.apply(this, arguments);
        if (w.App && w.App.screen === 'home') {
          applyEnhancements();
        }
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
    if (typeof window.__dismissSplash === 'function') {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          window.__dismissSplash();
        });
      });
    }
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
