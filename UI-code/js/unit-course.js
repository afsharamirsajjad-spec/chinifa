/* ============================================================
   unit-course.js — سامانه آموزشی ساختاریافته درس‌ها (Unit System)
   معماری: Unit → Sections → Mini Lessons → Exercises
   طراحی پیشرونده مرحله‌به‌مرحله با حفظ هویت بصری chinifa
   ============================================================ */

!function(window) {
  "use strict";

  // پیام‌های متنوع موفقیت — در هر پاسخ درست یکی تصادفی انتخاب می‌شود
  var PRAISES = ["عالی بود!", "آفرین!", "بی‌نقص بود!", "همین درسته!", "خوب بود!", "درست بود، ادامه بده!", "دمت گرم!", "محشر بود!", "دستت درد نکنه!", "همینه، همین!"];
  function pickPraise() {
    return PRAISES[Math.floor(Math.random() * PRAISES.length)];
  }

  // درون کاشی گزینه: هنزی + پین‌یین زیر آن + معنی فارسی — اگر گزینه چینی نباشد، متن ساده
  // اگر داخل پرانتز پین‌یین باشد همان می‌شود پین‌یینِ زیر کلمه (نه معنی جدا)
  var BUILTIN_PY = {
    "不是": "bú shì", "我是": "wǒ shì", "他是": "tā shì", "她是": "tā shì", "你好": "nǐ hǎo",
    "您好": "nín hǎo", "客气": "kèqi", "不客气": "bú kèqi", "没关系": "méi guānxi", "再见": "zài jiàn",
    "谢谢": "xièxie", "两点": "liǎng diǎn", "四点": "sì diǎn", "五点": "wǔ diǎn", "两杯": "liǎng bēi",
    "两年": "liǎng nián", "八岁": "bā suì", "中国菜": "Zhōngguó cài", "我家": "wǒ jiā", "你的": "nǐ de",
    "我的": "wǒ de", "他的": "tā de", "她的": "tā de", "来的": "lái de", "回家": "huí jiā",
    "很高兴": "hěn gāoxìng", "很好吃": "hěn hǎochī", "冷不冷": "lěng bu lěng", "李明": "Lǐ Míng",
    "咪咪": "Mīmi", "阿达": "Ādá", "没": "méi", "爱": "ài", "八": "bā", "爸爸": "bàba", "杯子": "bēizi",
    "北京": "Běijīng", "本": "běn", "不": "bù", "菜": "cài", "茶": "chá", "吃": "chī", "出租车": "chūzūchē",
    "打电话": "dǎ diànhuà", "大": "dà", "的": "de", "点": "diǎn", "电脑": "diànnǎo", "电视": "diànshì",
    "电影": "diànyǐng", "东西": "dōngxi", "都": "dōu", "读": "dú", "对不起": "duìbuqǐ", "多": "duō",
    "多少": "duōshao", "儿子": "érzi", "二": "èr", "饭馆": "fànguǎn", "飞机": "fēijī", "分钟": "fēnzhōng",
    "高兴": "gāoxìng", "个": "gè", "工作": "gōngzuò", "狗": "gǒu", "汉语": "Hànyǔ", "好": "hǎo",
    "号": "hào", "喝": "hē", "和": "hé", "很": "hěn", "后": "hòu", "后面": "hòumian", "回": "huí",
    "会": "huì", "几": "jǐ", "家": "jiā", "叫": "jiào", "今天": "jīntiān", "九": "jiǔ", "开": "kāi",
    "看": "kàn", "看见": "kànjiàn", "块": "kuài", "来": "lái", "老师": "lǎoshī", "了": "le",
    "冷": "lěng", "里": "lǐ", "零": "líng", "六": "liù", "妈妈": "māma", "吗": "ma", "买": "mǎi",
    "猫": "māo", "米饭": "mǐfàn", "明天": "míngtiān", "名字": "míngzi", "哪": "nǎ", "哪儿": "nǎr",
    "那": "nà", "那儿": "nàr", "呢": "ne", "能": "néng", "你": "nǐ", "年": "nián", "女儿": "nǚ'ér",
    "朋友": "péngyou", "漂亮": "piàoliang", "苹果": "píngguǒ", "七": "qī", "钱": "qián", "前面": "qiánmian",
    "请": "qǐng", "去": "qù", "热": "rè", "人": "rén", "认识": "rènshi", "三": "sān", "商店": "shāngdiàn",
    "上": "shàng", "上午": "shàngwǔ", "少": "shǎo", "谁": "shéi", "什么": "shénme", "十": "shí",
    "时候": "shíhou", "是": "shì", "书": "shū", "水": "shuǐ", "水果": "shuǐguǒ", "睡觉": "shuìjiào",
    "说": "shuō", "说话": "shuōhuà", "四": "sì", "岁": "suì", "他": "tā", "她": "tā", "太": "tài",
    "天气": "tiānqì", "听": "tīng", "同学": "tóngxué", "喂": "wèi", "我": "wǒ", "我们": "wǒmen",
    "五": "wǔ", "喜欢": "xǐhuan", "下": "xià", "下午": "xiàwǔ", "下雨": "xiàyǔ", "先生": "xiānsheng",
    "现在": "xiànzài", "想": "xiǎng", "小": "xiǎo", "小姐": "xiǎojie", "些": "xiē", "写": "xiě",
    "谢谢": "xièxie", "星期": "xīngqī", "学生": "xuésheng", "学习": "xuéxí", "学校": "xuéxiào",
    "一": "yī", "衣服": "yīfu", "医生": "yīshēng", "医院": "yīyuàn", "椅子": "yǐzi", "有": "yǒu",
    "月": "yuè", "在": "zài", "再见": "zài jiàn", "怎么": "zěnme", "怎么样": "zěnmeyàng", "这": "zhè",
    "这儿": "zhèr", "中国": "Zhōngguó", "中午": "zhōngwǔ", "住": "zhù", "桌子": "zhuōzi", "字": "zì",
    "昨天": "zuótiān", "坐": "zuò", "做": "zuò"
  };

  function uOptInner(opt, pyMap, pyOn) {
    var zh = UnitSystem.zhOf(opt);
    if (!zh) return '<span class="u-choice-text" dir="rtl">' + UI.esc(opt) + '</span>';
    var parens = (String(opt).match(/[(（]([^)）]+)[)）]/) || [])[1] || "";
    var isPyParens = /^[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s·']+$/.test(parens);
    var py = isPyParens ? parens : ((pyMap && pyMap[zh]) || (UnitSystem.resolvePy ? UnitSystem.resolvePy(zh) : "") || "");
    var fa = isPyParens ? "" : parens;
    var h = '<span class="u-choice-main" dir="ltr"><b class="han" dir="ltr">' + UI.esc(zh) + '</b>';
    if (py && pyOn) h += '<small class="py" dir="ltr">' + UI.esc(py) + '</small>';
    if (fa) h += '<small class="u-choice-fa" dir="rtl">' + UI.esc(fa) + '</small>';
    return h + '</span>';
  }

  var UnitSystem = window.UnitSystem = {
    _pMap: null,
        getShuffledOpts: function(ex, sessionKey) {
      if (!ex || !ex.opts || ex.opts.length <= 1) {
        return { opts: (ex && ex.opts) || [], ans: (ex && typeof ex.ans === "number" ? ex.ans : 0) };
      }
      var sKey = sessionKey || "default";
      if (ex._shuffled && ex._shuffled.key === sKey) {
        return ex._shuffled;
      }
      var origAns = (typeof ex.ans === "number") ? ex.ans : 0;
      var list = ex.opts.map(function(opt, idx) {
        return { opt: opt, isCorrect: (idx === origAns) };
      });
      for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = list[i];
        list[i] = list[j];
        list[j] = temp;
      }
      var shuffledOpts = list.map(function(item) { return item.opt; });
      var newAns = 0;
      for (var k = 0; k < list.length; k++) {
        if (list[k].isCorrect) { newAns = k; break; }
      }
      ex._shuffled = {
        key: sKey,
        opts: shuffledOpts,
        ans: newAns
      };
      return ex._shuffled;
    },
resolvePy: function(str) {
      if (!str) return "";
      var clean = String(str).replace(/[^\u3400-\u9fff]/g, "").trim();
      if (!clean) return "";
      if (UnitSystem._pMap && UnitSystem._pMap.words && UnitSystem._pMap.words[clean]) {
        return UnitSystem._pMap.words[clean];
      }
      if (BUILTIN_PY[clean]) return BUILTIN_PY[clean];
      var parts = [];
      for (var i = 0; i < clean.length; i++) {
        var ch = clean[i];
        var py = (UnitSystem._pMap && UnitSystem._pMap.chars && UnitSystem._pMap.chars[ch]) ||
                 (UnitSystem._pMap && UnitSystem._pMap.words && UnitSystem._pMap.words[ch]) ||
                 BUILTIN_PY[ch] || "";
        if (py) parts.push(py);
      }
      if (clean === "不是") return "bú shì";
      if (clean === "不客气") return "bú kèqi";
      return parts.join(" ");
    },
    initPinyinMap: function() {
      if (UnitSystem._pMap) return;
      var url = (window.CC && CC.asset ? CC.asset("content/pinyin-map.json") : "content/pinyin-map.json");
      fetch(url).then(function(r) { return r.ok ? r.json() : null; }).then(function(d) {
        if (d) UnitSystem._pMap = d;
      }).catch(function(){});
    },
    // استخراج نخستین رشته‌ی چینی قابل پخش از یک متن (برای دکمه‌ی تلفظ درس)
    zhOf: function(str) {
      var m = String(str == null ? "" : str).match(/[\u3400-\u9fff][\u3400-\u9fff\u3000-\u303f\uff00-\uffef·]*/g);
      if (!m || !m.length) return "";
      return m[0].replace(/^[\u3000-\u303f\uff00-\uffef·]+/, "").replace(/[\u3000-\u303f\uff00-\uffef·]+$/, "").replace(/[\u3000-\u303f\uff00-\uffef·]/g, "");
    },

    // تبدیل ارقام لاتین به فارسی برای شمارنده‌های درس
    faNum: function(x) {
      return String(x).replace(/[0-9]/g, function(d) { return "۰۱۲۳۴۵۶۷۸۹"[+d]; });
    },

    // وضعیت سراسری نمایش پین‌یین در درس (کلید سرصفحه‌ی درس؛ پیش‌فرض روشن)
    pyOn: function() {
      if (UnitSystem.runner && typeof UnitSystem.runner.showPinyin === "boolean") {
        return UnitSystem.runner.showPinyin;
      }
      if (window.Store && Store.state) {
        if (Store.state.pinyinOn === false || Store.state.lessonPy === false) return false;
        return true;
      }
      return true;
    },

    // وضعیت سراسری نمایش ترجمه فارسی در درس (کلید سرصفحه‌ی درس؛ پیش‌فرض روشن)
    faOn: function() {
      if (window.Store && Store.state) {
        if (Store.state.faOn === false || Store.state.lessonFa === false) return false;
        return true;
      }
      return true;
    },

    // نقشه‌ی پین‌یین واژه‌های کل درس (از آموزش واژگان و تمرین‌های همه‌ی بخش‌ها)
    unitPyMap: function(unit) {
      var m = {};
      var secs = (unit && unit.sections) || [];
      for (var si = 0; si < secs.length; si++) {
        var iw = (secs[si].intro && secs[si].intro.words) || [];
        for (var wi = 0; wi < iw.length; wi++) if (iw[wi].hanzi && iw[wi].py) m[iw[wi].hanzi] = iw[wi].py;
        var mls = secs[si].miniLessons || [];
        for (var mi = 0; mi < mls.length; mi++) {
          var exs = mls[mi].exercises || [];
          for (var ei = 0; ei < exs.length; ei++) {
            var e2 = exs[ei];
            if (e2.hanzi && (e2.pinyin || e2.py)) m[e2.hanzi] = e2.pinyin || e2.py;
            if (e2.char && (e2.py || e2.pinyin)) m[e2.char] = e2.py || e2.pinyin;
          }
        }
      }
      if (typeof Proxy !== "undefined") {
        return new Proxy(m, {
          get: function(target, prop) {
            if (typeof prop === "string") {
              if (target[prop]) return target[prop];
              if (/[\u3400-\u9fff]/.test(prop) && UnitSystem.resolvePy) return UnitSystem.resolvePy(prop);
            }
            return target[prop];
          }
        });
      }
      return m;
    },

    // اطلاعات درس اول (Unit 1: HSK 1 - Hello) و قابلیت گسترش برای درس‌های آینده
    UNITS: {
  "lesson0": {
    "id": "lesson0",
    "courseId": "hsk1",
    "unitIndex": 0,
    "unitNum": 0,
    "title": "Alphabet & Basics",
    "titleFa": "الفبای چینی — پین‌یین و هانزی",
    "titleZh": "拼音与汉字",
    "level": "مقدماتی",
    "desc": "آموزش پایه‌ای و گام‌به‌گام الفبای آوایی پین‌یین، ۴ تُن اصلی، صامت‌ها و مصوت‌ها، و خطوط بنیادین هانزی",
    "sections": [
      {
        "id": "pronunciation",
        "num": 1,
        "title": "Pronunciation & Tones",
        "titleFa": "تلفظ و آواشناسی پین‌یین",
        "titleZh": "拼音声调",
        "icon": "volume-2",
        "desc": "آشنایی با سیستم آوایی پین‌یین، ۴ آهنگ و تُن اصلی، صامت‌ها و مصوت‌ها با تمرین شنیداری",
        "intro": {
          "title": "پین‌یین و ۴ تُن اصلی زبان چینی",
          "lead": "چینی زبان آهنگینی است و تغییر تُن صدا معنی کلمه را به کلی دگرگون می‌کند:",
          "points": [
            "تُن ۱ (ممتد بالا: ā): مثل گفتن یکنواخت «آآآ» نزد پزشک (mā = مادر)",
            "تُن ۲ (بالا رونده: á): مثل وقتی با تعجب می‌پرسید «چی؟» (má = کنف)",
            "تُن ۳ (فرود و صعود: ǎ): صدا ابتدا پایین می‌رود و دوباره بالا می‌آید (mǎ = اسب)",
            "تُن ۴ (فرود قاطع: à): محکم و قاطع مثل گفتن «نه!» (mà = سرزنش کردن)",
            "تُن خنثی (سبک و کوتاه: ma): بدون کشش و خیلی ملایم ادا می‌شود"
          ]
        },
        "miniLessons": [
          {
            "id": "l0_p1",
            "num": 1,
            "title": "تشخیص تُن‌ها و صامت‌ها",
            "desc": "گوش دادن به تفاوت آهنگ‌ها و صامت‌های کلیدی چینی",
            "exercises": [
              {
                "type": "choice",
                "q": "کدام تُن در زبان چینی به صورت یکنواخت، کشیده و در اوج صدا ادا می‌شود؟",
                "opts": [
                  "تُن اول (ـ̄ / First Tone)",
                  "تُن دوم (ـ́ / Second Tone)",
                  "تُن سوم (ـ̌ / Third Tone)",
                  "تُن چهارم (ـ̀ / Fourth Tone)"
                ],
                "ans": 0,
                "tip": "تُن اول با علامت خط افقی بالای حروف صدا (مثل ā) نشان داده می‌شود."
              },
              {
                "type": "choice",
                "q": "تُن دوم (ـ́) مانند کدام حالت صوتی در زبان فارسی است؟",
                "opts": [
                  "لحن سؤالی و تعجب‌آمیز رو به بالا («چی؟»)",
                  "دستور محکم و قاطع («برو!»)",
                  "صدای خنثی و سریع",
                  "صدای ممتد و کشیده یکنواخت"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "تُن واژه «hǎo» (به معنی خوب) کدام است؟",
                "hanzi": "好",
                "pinyin": "hǎo",
                "opts": [
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن اول (ممتد بالا: ā)",
                  "تُن دوم (بالا رونده: á)",
                  "تُن چهارم (فرودی: à)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "تفاوت اصلی بین صامت‌های «b» و «p» در الفبای پین‌یین چیست؟",
                "opts": [
                  "حرف p با خروج شدید هوا (دمشی) ولی b بدون دمش تلفظ می‌شود",
                  "حرف b دمشی است و p بدون دمش",
                  "هر دو کاملاً یکسان تلفظ می‌شوند",
                  "حرف p همیشه ساکن است"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "حرف صوتی ویژه «ü» چگونه به درستی تلفظ می‌شود؟",
                "opts": [
                  "لب‌ها را کاملاً گرد و غنچه کرده و صدای «ای» تولید کنید",
                  "دقیقاً مانند حرف «او» فارسی",
                  "مانند حرف «آ» فارسی",
                  "بدون حرکت لب‌ها"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "l0_p2",
            "num": 2,
            "title": "تمرین و سنجش تلفظ پایه",
            "desc": "تکرار و آزمودن تلفظ صوتی واژه‌ها",
            "exercises": [
              {
                "type": "repeat",
                "target": "mā",
                "py": "mā",
                "fa": "مادر (تُن اول ممتد)",
                "tip": "صدا را بدون لرزش و یکنواخت در اوج بگویید."
              },
              {
                "type": "repeat",
                "target": "hǎo",
                "py": "hǎo",
                "fa": "خوب (تُن سوم)",
                "tip": "صدا ابتدا افت کرده و سپس بالا می‌آید."
              },
              {
                "type": "repeat",
                "target": "nǐ",
                "py": "nǐ",
                "fa": "تو (تُن سوم)",
                "tip": "با آهنگ فرود و صعود تلفظ کنید."
              },
              {
                "type": "repeat",
                "target": "nǐ hǎo",
                "py": "nǐ hǎo",
                "fa": "سلام",
                "tip": "دو تُن ۳ پشت سر هم: کلمه اول را با تُن ۲ (ní) بگویید."
              }
            ]
          }
        ]
      },
      {
        "id": "hanzi",
        "num": 2,
        "title": "Hanzi Characters",
        "titleFa": "خط و نگارش هانزی",
        "titleZh": "汉字笔画",
        "icon": "edit-3",
        "desc": "رازهای خط چینی، ۸ خط پایه هانزی، ترتیب و جهت قلم به همراه تمرین دست‌خط تعاملی",
        "intro": {
          "title": "اصول نگارش نویسه‌های چینی (هانزی)",
          "lead": "نویسه‌های چینی بر خلاف الفبای لاتین، بر اساس خطوط استاندارد و قوانین هندسی دقیق نوشته می‌شوند:",
          "points": [
            "خط افقی (Héng 一): از چپ به راست نوشته می‌شود",
            "خط عمودی (Shù 丨): از بالا به پایین کشیده می‌شود",
            "خط چپ‌کش (Piě 丿) و راست‌کش (Nà ㇏): از بالا به طرفین متمایل می‌شوند",
            "نقطه (Diǎn 丶): فشردن و رها کردن قلم",
            "قانون طلایی ۱: اول از بالا به پایین (مثل 三)",
            "قانون طلایی ۲: اول افقی، بعد عمودی (مثل 十)",
            "قانون طلایی ۳: اول کادر بیرونی، سپس محتویات داخل و بستن در آخر (مثل 四 و 国)"
          ]
        },
        "miniLessons": [
          {
            "id": "l0_p3",
            "num": 1,
            "title": "قوانین نوشتن خط چینی",
            "desc": "آشنایی با خطوط اصلی و ترتیب کشیدن آن‌ها",
            "exercises": [
              {
                "type": "choice",
                "q": "در نوشتن کاراکتر «十» (عدد ۱۰)، کدام خط ابتدا کشیده می‌شود؟",
                "opts": [
                  "خط افقی (一) سپس خط عمودی (丨)",
                  "خط عمودی (丨) سپس خط افقی (一)",
                  "هر دو به طور همزمان",
                  "از راست به چپ"
                ],
                "ans": 0,
                "tip": "طبق قانون طلایی ترتیب خطوط: اول افقی، سپس عمودی (先横后竖)."
              },
              {
                "type": "choice",
                "q": "قانون نوشتن کادرهای بسته مانند «四» (عدد ۴) یا «国» (کشور) چیست؟",
                "opts": [
                  "اول بیرون، بعد ورود به داخل، و در آخر بستن درگاه",
                  "اول بستن درگاه، بعد کشیدن خطوط داخل",
                  "از پایین به بالا",
                  "از راست به چپ"
                ],
                "ans": 0
              },
              {
                "type": "write",
                "target": "一",
                "py": "yī",
                "meaning": "عدد یک (خط افقی بنیادین)",
                "prompt": "نویسه «一» (yī) به معنی عدد یک را با کشیدن خط افقی از چپ به راست بنویسید:"
              },
              {
                "type": "write",
                "target": "十",
                "py": "shí",
                "meaning": "عدد ده (ترکیب افقی و عمودی)",
                "prompt": "نویسه «十» (shí) به معنی عدد ده را به ترتیب (اول افقی، بعد عمودی) بنویسید:"
              }
            ]
          }
        ]
      }
    ]
  },
  "hsk1:0": {
    "id": "hsk1:0",
    "courseId": "hsk1",
    "unitIndex": 0,
    "unitNum": 1,
    "title": "Hello & Greetings",
    "titleFa": "سلام و احوالپرسی اولیه",
    "titleZh": "你好，中国！",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "آموزش اصول احوالپرسی رسمی و دوستانه، مبانی تلفظ، تُن‌های اصلی و تعارفات بنیادین زبان چینی",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 1",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "你好",
              "py": "nǐ hǎo",
              "fa": "سلام (درود دوستانه)",
              "ex": "你好！很高兴认识你。",
              "exPy": "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
              "exFa": "سلام! از دیدنت خیلی خوشحالم."
            },
            {
              "hanzi": "您好",
              "py": "nín hǎo",
              "fa": "سلام (محترمانه به بزرگتر یا استاد)",
              "ex": "老师，您好！",
              "exPy": "Lǎoshī, nín hǎo!",
              "exFa": "استاد، سلام بر شما!"
            },
            {
              "hanzi": "早",
              "py": "zǎo",
              "fa": "صبح بخیر (کوتاه و صمیمی)",
              "ex": "大家早！",
              "exPy": "Dàjiā zǎo!",
              "exFa": "همگی صبح بخیر!"
            },
            {
              "hanzi": "再见",
              "py": "zài jiàn",
              "fa": "خداحافظ / به امید دیدار",
              "ex": "明天见，再见！",
              "exPy": "Míngtiān jiàn, zài jiàn!",
              "exFa": "فردا می‌بینمت، خداحافظ!"
            },
            {
              "hanzi": "谢谢",
              "py": "xiè xie",
              "fa": "متشکرم / ممنون",
              "ex": "谢谢你的帮助。",
              "exPy": "Xièxie nǐ de bāngzhù.",
              "exFa": "از کمکت متشکرم."
            },
            {
              "hanzi": "不客气",
              "py": "bú kè qi",
              "fa": "خواهش می‌کنم / قابلی ندارد",
              "ex": "不客气，这是我应该做的。",
              "exPy": "Bú kèqi, zhè shì wǒ yīnggāi zuò de.",
              "exFa": "خواهش می‌کنم، وظیفه‌ام بود."
            },
            {
              "hanzi": "对不起",
              "py": "duì bu qǐ",
              "fa": "ببخشید / متاسفم",
              "ex": "对不起，我迟到了。",
              "exPy": "Duìbuqǐ, wǒ chídào le.",
              "exFa": "ببخشید، من دیر رسیدم."
            },
            {
              "hanzi": "没关系",
              "py": "méi guān xi",
              "fa": "اشکالی ندارد / مسئله‌ای نیست",
              "ex": "没关系，请进！",
              "exPy": "Méi guānxi, qǐng jìn!",
              "exFa": "اشکالی نداره، بفرمایید تو!"
            },
            {
              "hanzi": "请",
              "py": "qǐng",
              "fa": "لطفاً / بفرمایید",
              "ex": "请坐，请喝茶。",
              "exPy": "Qǐng zuò, qǐng hē chá.",
              "exFa": "لطفاً بنشینید، بفرمایید چای."
            },
            {
              "hanzi": "好的",
              "py": "hǎo de",
              "fa": "باشه / چشم / حتماً",
              "ex": "好的，没问题！",
              "exPy": "Hǎo de, méi wèntí!",
              "exFa": "باشه، هیچ مشکلی نیست!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «你好» (nǐ hǎo) چیست؟",
                "audio": "nǐ hǎo",
                "hanzi": "你好",
                "pinyin": "nǐ hǎo",
                "opts": [
                  "سلام (درود دوستانه)",
                  "سلام (محترمانه به بزرگتر یا استاد)",
                  "صبح بخیر (کوتاه و صمیمی)",
                  "خداحافظ / به امید دیدار"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «您好» (nín hǎo) چیست؟",
                "audio": "nín hǎo",
                "hanzi": "您好",
                "pinyin": "nín hǎo",
                "opts": [
                  "سلام (محترمانه به بزرگتر یا استاد)",
                  "سلام (درود دوستانه)",
                  "صبح بخیر (کوتاه و صمیمی)",
                  "خداحافظ / به امید دیدار"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «早» (zǎo) چیست؟",
                "audio": "zǎo",
                "hanzi": "早",
                "pinyin": "zǎo",
                "opts": [
                  "صبح بخیر (کوتاه و صمیمی)",
                  "سلام (درود دوستانه)",
                  "سلام (محترمانه به بزرگتر یا استاد)",
                  "خداحافظ / به امید دیدار"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «再见» (zài jiàn) چیست؟",
                "audio": "zài jiàn",
                "hanzi": "再见",
                "pinyin": "zài jiàn",
                "opts": [
                  "خداحافظ / به امید دیدار",
                  "سلام (درود دوستانه)",
                  "سلام (محترمانه به بزرگتر یا استاد)",
                  "صبح بخیر (کوتاه و صمیمی)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "你好",
                    "fa": "سلام (درود دوستانه)"
                  },
                  {
                    "zh": "您好",
                    "fa": "سلام (محترمانه به بزرگتر یا استاد)"
                  },
                  {
                    "zh": "早",
                    "fa": "صبح بخیر (کوتاه و صمیمی)"
                  },
                  {
                    "zh": "再见",
                    "fa": "خداحافظ"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "قواعد احوالپرسی و تبدیل تُن سوم",
        "intro": {
          "title": "قواعد احوالپرسی و تبدیل تُن سوم",
          "lead": "۱. تفاوت 你好 و 您好: کلمه 您 صورت محترمانه 你 است و برای استادان، مدیران و افراد مسن به کار می‌رود.\n۲. قانون تغییر تُن سوم (Tone Sandhi): هرگاه دو کلمه با تُن سوم پشت سر هم بیایند (مثل Nǐ + Hǎo)، کلمه اول به تُن دوم تبدیل می‌شود (Ní hǎo).",
          "formula": "احترام: 您 + 好 (Nín hǎo) | پاسخ به تشکر: 不客气 (Bú kèqi)",
          "examples": [
            {
              "zh": "您好，李老师！",
              "py": "Nín hǎo, Lǐ lǎoshī!",
              "fa": "سلام، استاد لی!"
            },
            {
              "zh": "谢谢！— 不客气。",
              "py": "Xièxie! — Bú kèqi.",
              "fa": "متشکرم! — خواهش می‌کنم."
            },
            {
              "zh": "对不起！— 没关系。",
              "py": "Duìbuqǐ! — Méi guānxi.",
              "fa": "ببخشید! — اشکالی نداره."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "هنگام برخورد محترمانه با استاد دانشگاه، کدام سلام مناسب است؟",
                "opts": [
                  "您好 (Nín hǎo)",
                  "你好 (Nǐ hǎo)",
                  "再见 (Zàijiàn)",
                  "对不起 (Duìbuqǐ)"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت عبارت «استاد سلام، لطفاً بنشینید» مرتب کنید:",
                "tiles": [
                  "老师",
                  "您好",
                  "请坐"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در کلاس درس: اولین دیدار با استاد",
        "intro": {
          "title": "مکالمه در کلاس درس: اولین دیدار با استاد",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "老师，您好！",
              "py": "Lǎoshī, nín hǎo!",
              "fa": "استاد، سلام بر شما!"
            },
            {
              "role": "B",
              "speaker": "استاد لی",
              "zh": "你好！请坐。",
              "py": "Nǐ hǎo! Qǐng zuò.",
              "fa": "سلام! لطفاً بفرمایید بنشینید."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "谢谢老师！",
              "py": "Xièxie lǎoshī!",
              "fa": "خیلی ممنون استاد!"
            },
            {
              "role": "B",
              "speaker": "استاد لی",
              "zh": "不客气。今天好吗？",
              "py": "Bú kèqi. Jīntiān hǎo ma?",
              "fa": "خواهش می‌کنم. امروز حالت چطوره؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "很好，谢谢您！再见！",
              "py": "Hěn hǎo, xièxie nín! Zàijiàn!",
              "fa": "خیلی خوبم، ممنون از شما! خداحافظ!"
            },
            {
              "role": "B",
              "speaker": "استاد لی",
              "zh": "再见！",
              "py": "Zàijiàn!",
              "fa": "به امید دیدار!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "老师，您好！ (استاد، سلام بر شما!)",
                  "你好！请坐。 (سلام! لطفاً بفرمایید بنشینید.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «谢谢老师！» چیست؟",
                "opts": [
                  "不客气。今天好吗？ (خواهش می‌کنم. امروز حالت چطوره؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 1",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "هنگام برخورد محترمانه با استاد دانشگاه، کدام سلام مناسب است؟",
                "opts": [
                  "您好 (Nín hǎo)",
                  "你好 (Nǐ hǎo)",
                  "再见 (Zàijiàn)",
                  "对不起 (Duìbuqǐ)"
                ],
                "ans": 0
              },
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "谢谢",
                    "fa": "متشکرم"
                  },
                  {
                    "zh": "不客气",
                    "fa": "خواهش می‌کنم"
                  },
                  {
                    "zh": "对不起",
                    "fa": "ببخشید"
                  },
                  {
                    "zh": "没关系",
                    "fa": "اشکالی ندارد"
                  }
                ]
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت عبارت «استاد سلام، لطفاً بنشینید» مرتب کنید:",
                "tiles": [
                  "老师",
                  "您好",
                  "请坐"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب به عبارت «对不起» (ببخشید) کدام است؟",
                "opts": [
                  "没关系 (Méi guānxi)",
                  "不客气 (Bú kèqi)",
                  "好的 (Hǎo de)",
                  "再见 (Zàijiàn)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:1": {
    "id": "hsk1:1",
    "courseId": "hsk1",
    "unitIndex": 1,
    "unitNum": 2,
    "title": "Self Introduction & Names",
    "titleFa": "معرفی خود، نام و ملیت",
    "titleZh": "我叫李强，我是中国人",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری معرفی نام با فعل 叫، بیان ملیت و شغل با فعل ربطی 是 و سوال پرسیدن با 什么 و 吗",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 2",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "我",
              "py": "wǒ",
              "fa": "من (ضمیر اول‌شخص)",
              "ex": "我是学生。",
              "exPy": "Wǒ shì xuésheng.",
              "exFa": "من دانش‌آموز هستم."
            },
            {
              "hanzi": "你",
              "py": "nǐ",
              "fa": "تو (ضمیر دوم‌شخص)",
              "ex": "你是哪国人？",
              "exPy": "Nǐ shì nǎ guó rén?",
              "exFa": "تو اهل کدام کشوری؟"
            },
            {
              "hanzi": "他",
              "py": "tā",
              "fa": "او (مذکر)",
              "ex": "他是李明。",
              "exPy": "Tā shì Lǐ Míng.",
              "exFa": "او لی مینگ است."
            },
            {
              "hanzi": "她",
              "py": "tā",
              "fa": "او (مونث)",
              "ex": "她是我的老师。",
              "exPy": "Tā shì wǒ de lǎoshī.",
              "exFa": "او معلم من است."
            },
            {
              "hanzi": "叫",
              "py": "jiào",
              "fa": "نامیده شدن / نام داشتن",
              "ex": "我叫李强。",
              "exPy": "Wǒ jiào Lǐ Qiáng.",
              "exFa": "نام من لی چانگ است."
            },
            {
              "hanzi": "什么",
              "py": "shénme",
              "fa": "چه / چه چیزی؟",
              "ex": "你叫什么名字？",
              "exPy": "Nǐ jiào shénme míngzi?",
              "exFa": "اسمت چیه؟"
            },
            {
              "hanzi": "名字",
              "py": "míngzi",
              "fa": "نام / اسم",
              "ex": "这是我的中文名字。",
              "exPy": "Zhè shì wǒ de zhōngwén míngzi.",
              "exFa": "این اسم چینی من است."
            },
            {
              "hanzi": "是",
              "py": "shì",
              "fa": "هست / بودن (فعل ربطی)",
              "ex": "他是中国人。",
              "exPy": "Tā shì Zhōngguó rén.",
              "exFa": "او چینی است."
            },
            {
              "hanzi": "哪",
              "py": "nǎ",
              "fa": "کدام؟",
              "ex": "你是哪国人？",
              "exPy": "Nǐ shì nǎ guó rén?",
              "exFa": "اهل کدام کشور هستی؟"
            },
            {
              "hanzi": "国",
              "py": "guó",
              "fa": "کشور / ملت",
              "ex": "中国和伊朗。",
              "exPy": "Zhōngguó hé Yīlǎng.",
              "exFa": "چین و ایران."
            },
            {
              "hanzi": "人",
              "py": "rén",
              "fa": "شخص / اهلِ",
              "ex": "我是伊朗人。",
              "exPy": "Wǒ shì Yīlǎngrén.",
              "exFa": "من ایرانی هستم."
            },
            {
              "hanzi": "吗",
              "py": "ma",
              "fa": "آیا؟ (نشانه سوال بله/خیر)",
              "ex": "你是学生吗？",
              "exPy": "Nǐ shì xuésheng ma?",
              "exFa": "آیا تو دانشجویی؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «我» (wǒ) چیست؟",
                "audio": "wǒ",
                "hanzi": "我",
                "pinyin": "wǒ",
                "opts": [
                  "من (ضمیر اول‌شخص)",
                  "تو (ضمیر دوم‌شخص)",
                  "او (مذکر)",
                  "او (مونث)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «你» (nǐ) چیست؟",
                "audio": "nǐ",
                "hanzi": "你",
                "pinyin": "nǐ",
                "opts": [
                  "تو (ضمیر دوم‌شخص)",
                  "من (ضمیر اول‌شخص)",
                  "او (مذکر)",
                  "او (مونث)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «他» (tā) چیست؟",
                "audio": "tā",
                "hanzi": "他",
                "pinyin": "tā",
                "opts": [
                  "او (مذکر)",
                  "من (ضمیر اول‌شخص)",
                  "تو (ضمیر دوم‌شخص)",
                  "او (مونث)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «她» (tā) چیست؟",
                "audio": "tā",
                "hanzi": "她",
                "pinyin": "tā",
                "opts": [
                  "او (مونث)",
                  "من (ضمیر اول‌شخص)",
                  "تو (ضمیر دوم‌شخص)",
                  "او (مذکر)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "我",
                    "fa": "من (ضمیر اول‌شخص)"
                  },
                  {
                    "zh": "你",
                    "fa": "تو (ضمیر دوم‌شخص)"
                  },
                  {
                    "zh": "他",
                    "fa": "او (مذکر)"
                  },
                  {
                    "zh": "她",
                    "fa": "او (مونث)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "جملات اسنادی با 是 و سوالی با 吗 و 什么",
        "intro": {
          "title": "جملات اسنادی با 是 و سوالی با 吗 و 什么",
          "lead": "۱. ساختار بیان نام: فاعل + 叫 + نام شخص (مثال: 我叫李强)\n۲. ساختار بیان ملیت: فاعل + 是 + نام کشور + 人 (مثال: 我是伊朗人)\n۳. ساختار سوال بله/خیر: هر جمله خبری + 吗؟ (مثال: 你是中国人吗؟)",
          "formula": "A + 是 + B (A هست B) | A + 是 + B + 吗？ (آیا A هست B؟)",
          "examples": [
            {
              "zh": "我叫王平，我是老师。",
              "py": "Wǒ jiào Wáng Píng, wǒ shì lǎoshī.",
              "fa": "من وانگ پینگ هستم، من معلمم."
            },
            {
              "zh": "你叫什么名字？",
              "py": "Nǐ jiào shénme míngzi?",
              "fa": "اسم شما چیست؟"
            },
            {
              "zh": "他是中国人吗？— 是的，他是中国人。",
              "py": "Tā shì Zhōngguórén ma? — Shì de, tā shì Zhōngguórén.",
              "fa": "آیا او چینی است؟ — بله، او چینی است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "برای پرسیدن «اسمت چیه؟» کدام جمله صحیح است؟",
                "opts": [
                  "你叫什么名字？",
                  "你是谁名字？",
                  "你叫哪国人？",
                  "你是什么老师？"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من دانشجوی چینی هستم» مرتب کنید:",
                "tiles": [
                  "我",
                  "是",
                  "中国",
                  "学生"
                ],
                "ans": [
                  0,
                  1,
                  2,
                  3
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در فرودگاه: آشنایی دو مسافر",
        "intro": {
          "title": "مکالمه در فرودگاه: آشنایی دو مسافر",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "علی",
              "zh": "你好！我叫阿里。",
              "py": "Nǐ hǎo! Wǒ jiào Ālǐ.",
              "fa": "سلام! من علی هستم."
            },
            {
              "role": "B",
              "speaker": "وانگ پینگ",
              "zh": "你好阿里！我叫王平。",
              "py": "Nǐ hǎo Ālǐ! Wǒ jiào Wáng Píng.",
              "fa": "سلام علی! من وانگ پینگ هستم."
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "请问，你是中国人吗？",
              "py": "Qǐngwèn, nǐ shì Zhōngguórén ma?",
              "fa": "ببخشید، آیا شما چینی هستید؟"
            },
            {
              "role": "B",
              "speaker": "وانگ پینگ",
              "zh": "是的，我是中国人。你是哪国人？",
              "py": "Shì de, wǒ shì Zhōngguórén. Nǐ shì nǎ guó rén?",
              "fa": "بله، من چینی هستم. شما اهل کدام کشورید؟"
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "我是伊朗人。我是学生。",
              "py": "Wǒ shì Yīlǎngrén. Wǒ shì xuésheng.",
              "fa": "من ایرانی هستم. من دانشجو هستم."
            },
            {
              "role": "B",
              "speaker": "وانگ پینگ",
              "zh": "认识你很高兴！",
              "py": "Rènshi nǐ hěn gāoxìng!",
              "fa": "از آشنایی با شما خیلی خوشحالم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (علی) چه می‌گوید؟",
                "opts": [
                  "你好！我叫阿里。 (سلام! من علی هستم.)",
                  "你好阿里！我叫王平。 (سلام علی! من وانگ پینگ هستم.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «请问，你是中国人吗？» چیست؟",
                "opts": [
                  "是的，我是中国人。你是哪国人？ (بله، من چینی هستم. شما اهل کدام کشورید؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 2",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "برای پرسیدن «اسمت چیه؟» کدام جمله صحیح است؟",
                "opts": [
                  "你叫什么名字？",
                  "你是谁名字？",
                  "你叫哪国人？",
                  "你是什么老师？"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من دانشجوی چینی هستم» مرتب کنید:",
                "tiles": [
                  "我",
                  "是",
                  "中国",
                  "学生"
                ],
                "ans": [
                  0,
                  1,
                  2,
                  3
                ]
              },
              {
                "type": "match",
                "q": "کلمات چینی را به معادل فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "中国",
                    "fa": "چین"
                  },
                  {
                    "zh": "名字",
                    "fa": "نام"
                  },
                  {
                    "zh": "老师",
                    "fa": "معلم"
                  },
                  {
                    "zh": "学生",
                    "fa": "دانش‌آموز"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "اگر کسی بگوید «你是中国人吗？» و شما ایرانی باشید، چه پاسخی می‌دهید؟",
                "opts": [
                  "不是，我是伊朗人。",
                  "是的，我是中国人。",
                  "我叫李明。",
                  "没关系，再见。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:2": {
    "id": "hsk1:2",
    "courseId": "hsk1",
    "unitIndex": 2,
    "unitNum": 3,
    "title": "Family & Relationships",
    "titleFa": "خانواده و دوستان من",
    "titleZh": "这是我的家人",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری اعضای خانواده، نشانه مالکیت 的، داشتن و نداشتن با 有 و 没有 و واحد شمارش اعضای خانواده 口",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 3",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "家",
              "py": "jiā",
              "fa": "خانواده / خانه",
              "ex": "我家在北京。",
              "exPy": "Wǒ jiā zài Běijīng.",
              "exFa": "خانواده من در پکن هستند."
            },
            {
              "hanzi": "爸爸",
              "py": "bàba",
              "fa": "پدر / بابا",
              "ex": "我爸爸是医生。",
              "exPy": "Wǒ bàba shì yīshēng.",
              "exFa": "پدرم پزشک است."
            },
            {
              "hanzi": "妈妈",
              "py": "māma",
              "fa": "مادر / مامان",
              "ex": "我妈妈是老师。",
              "exPy": "Wǒ māma shì lǎoshī.",
              "exFa": "مادرم معلم است."
            },
            {
              "hanzi": "哥哥",
              "py": "gēge",
              "fa": "برادر بزرگتر",
              "ex": "他是我哥哥。",
              "exPy": "Tā shì wǒ gēge.",
              "exFa": "او برادر بزرگ من است."
            },
            {
              "hanzi": "姐姐",
              "py": "jiějie",
              "fa": "خواهر بزرگتر",
              "ex": "我有两个姐姐。",
              "exPy": "Wǒ yǒu liǎng gè jiějie.",
              "exFa": "من دو خواهر بزرگتر دارم."
            },
            {
              "hanzi": "弟弟",
              "py": "dìdi",
              "fa": "برادر کوچکتر",
              "ex": "我弟弟今年十岁。",
              "exPy": "Wǒ dìdi jīnnián shí suì.",
              "exFa": "برادر کوچکم امسال ۱۰ ساله است."
            },
            {
              "hanzi": "妹妹",
              "py": "mèimei",
              "fa": "خواهر کوچکتر",
              "ex": "这是我妹妹。",
              "exPy": "Zhè shì wǒ mèimei.",
              "exFa": "این خواهر کوچک من است."
            },
            {
              "hanzi": "的",
              "py": "de",
              "fa": "کسره اضافه / نشانه مالکیت",
              "ex": "我的书和他的电脑。",
              "exPy": "Wǒ de shū hé tā de diànnǎo.",
              "exFa": "کتاب من و لپ‌تاپ او."
            },
            {
              "hanzi": "有",
              "py": "yǒu",
              "fa": "داشتن / وجود داشتن",
              "ex": "我家有四口人。",
              "exPy": "Wǒ jiā yǒu sì kǒu rén.",
              "exFa": "خانواده من ۴ نفر عضو دارد."
            },
            {
              "hanzi": "没有",
              "py": "méiyǒu",
              "fa": "نداشتن / وجود نداشتن",
              "ex": "我没有弟弟。",
              "exPy": "Wǒ méiyǒu dìdi.",
              "exFa": "من برادر کوچکتری ندارم."
            },
            {
              "hanzi": "口",
              "py": "kǒu",
              "fa": "واحد شمارش افراد خانواده",
              "ex": "你家有几口人？",
              "exPy": "Nǐ jiā yǒu jǐ kǒu rén?",
              "exFa": "خانواده‌ات چند نفره است؟"
            },
            {
              "hanzi": "朋友",
              "py": "péngyou",
              "fa": "دوست / رفیق",
              "ex": "他是我的好朋友。",
              "exPy": "Tā shì wǒ de hǎo péngyou.",
              "exFa": "او دوست صمیمی من است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «家» (jiā) چیست؟",
                "audio": "jiā",
                "hanzi": "家",
                "pinyin": "jiā",
                "opts": [
                  "خانواده / خانه",
                  "پدر / بابا",
                  "مادر / مامان",
                  "برادر بزرگتر"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «爸爸» (bàba) چیست؟",
                "audio": "bàba",
                "hanzi": "爸爸",
                "pinyin": "bàba",
                "opts": [
                  "پدر / بابا",
                  "خانواده / خانه",
                  "مادر / مامان",
                  "برادر بزرگتر"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «妈妈» (māma) چیست؟",
                "audio": "māma",
                "hanzi": "妈妈",
                "pinyin": "māma",
                "opts": [
                  "مادر / مامان",
                  "خانواده / خانه",
                  "پدر / بابا",
                  "برادر بزرگتر"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «哥哥» (gēge) چیست؟",
                "audio": "gēge",
                "hanzi": "哥哥",
                "pinyin": "gēge",
                "opts": [
                  "برادر بزرگتر",
                  "خانواده / خانه",
                  "پدر / بابا",
                  "مادر / مامان"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "家",
                    "fa": "خانواده"
                  },
                  {
                    "zh": "爸爸",
                    "fa": "پدر"
                  },
                  {
                    "zh": "妈妈",
                    "fa": "مادر"
                  },
                  {
                    "zh": "哥哥",
                    "fa": "برادر بزرگتر"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "نشانه مالکیت 的 و بیان دارایی با 有 / 没有",
        "intro": {
          "title": "نشانه مالکیت 的 و بیان دارایی با 有 / 没有",
          "lead": "۱. نشانه مالکیت: صاحب مال + 的 + شیء یا شخص (مثال: 我的书 = کتاب من). در مورد اعضای خانواده نزدیک، آوردن 的 اختیاری است (我爸爸 = پدرم).\n۲. منفی کردن فعل داشتن: همیشه از 没有 استفاده می‌شود، نه 不有! (مثال: 我没有哥哥)",
          "formula": "فاعل + 有 / 没有 + مفعول | فاعل + 家 + 有 + عدد + 口 + 人",
          "examples": [
            {
              "zh": "你家有几口人？— 我家有三口人。",
              "py": "Nǐ jiā yǒu jǐ kǒu rén? — Wǒ jiā yǒu sān kǒu rén.",
              "fa": "خانواده‌ات چند نفره است؟ — خانواده‌ام ۳ نفره است."
            },
            {
              "zh": "这是我朋友的电脑。",
              "py": "Zhè shì wǒ péngyou de diànnǎo.",
              "fa": "این کامپیوترِ دوستم است."
            },
            {
              "zh": "我有姐姐，没有妹妹。",
              "py": "Wǒ yǒu jiějie, méiyǒu mèimei.",
              "fa": "من خواهر بزرگتر دارم، خواهر کوچکتر ندارم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "چگونه می‌گویید «من برادر بزرگتر ندارم»؟",
                "opts": [
                  "我没有哥哥。",
                  "我不有哥哥。",
                  "我是没有哥哥。",
                  "我没有弟弟。"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «خانواده من پنج نفر دارد» مرتب کنید:",
                "tiles": [
                  "我家",
                  "有",
                  "五口",
                  "人"
                ],
                "ans": [
                  0,
                  1,
                  2,
                  3
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در اتاق خوابگاه: نگاه کردن به آلبوم عکس",
        "intro": {
          "title": "مکالمه در اتاق خوابگاه: نگاه کردن به آلبوم عکس",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "مینگ",
              "zh": "这是你的照片吗？",
              "py": "Zhè shì nǐ de zhàopiàn ma?",
              "fa": "این عکس توست؟"
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "是的，这是我的全家福。",
              "py": "Shì de, zhè shì wǒ de quánjiāfú.",
              "fa": "بله، این عکس خانوادگی من است."
            },
            {
              "role": "A",
              "speaker": "مینگ",
              "zh": "你家有几口人？",
              "py": "Nǐ jiā yǒu jǐ kǒu rén?",
              "fa": "خانواده‌ات چند نفره است؟"
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "我家有四口人：爸爸、妈妈、一个哥哥和我。",
              "py": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, yí gè gēge hé wǒ.",
              "fa": "خانواده‌ام ۴ نفره است: پدرم، مادرم، یک برادر بزرگتر و خودم."
            },
            {
              "role": "A",
              "speaker": "مینگ",
              "zh": "你哥哥也是学生吗？",
              "py": "Nǐ gēge yě shì xuésheng ma?",
              "fa": "آیا برادرت هم دانشجو است؟"
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "不，他是医生。",
              "py": "Bù, tā shì yīshēng.",
              "fa": "نه، او پزشک است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (مینگ) چه می‌گوید؟",
                "opts": [
                  "这是你的照片吗？ (این عکس توست؟)",
                  "是的，这是我的全家福。 (بله، این عکس خانوادگی من است.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «你家有几口人？» چیست؟",
                "opts": [
                  "我家有四口人：爸爸、妈妈、一个哥哥和我。 (خانواده‌ام ۴ نفره است: پدرم، مادرم، یک برادر بزرگتر و خودم.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 3",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "چگونه می‌گویید «من برادر بزرگتر ندارم»؟",
                "opts": [
                  "我没有哥哥。",
                  "我不有哥哥。",
                  "我是没有哥哥。",
                  "我没有弟弟。"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «خانواده من پنج نفر دارد» مرتب کنید:",
                "tiles": [
                  "我家",
                  "有",
                  "五口",
                  "人"
                ],
                "ans": [
                  0,
                  1,
                  2,
                  3
                ]
              },
              {
                "type": "match",
                "q": "اعضای خانواده را به معادل فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "爸爸",
                    "fa": "پدر"
                  },
                  {
                    "zh": "妈妈",
                    "fa": "مادر"
                  },
                  {
                    "zh": "姐姐",
                    "fa": "خواهر بزرگتر"
                  },
                  {
                    "zh": "弟弟",
                    "fa": "برادر کوچکتر"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام واحد شمارش برای اعضای خانواده به کار می‌رود؟",
                "opts": [
                  "口 (kǒu)",
                  "个 (gè)",
                  "本 (běn)",
                  "块 (kuài)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:3": {
    "id": "hsk1:3",
    "courseId": "hsk1",
    "unitIndex": 3,
    "unitNum": 4,
    "title": "Numbers & Shopping",
    "titleFa": "اعداد، پول و خرید کردن",
    "titleZh": "这个多少钱？",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری ارقام و قیمت‌ها، پرسش قیمت با 多少钱، واحدهای پول چین (块 و 毛) و ساختار مبالغه 太...了",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 4",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "一",
              "py": "yī",
              "fa": "عدد یک",
              "ex": "一个人。",
              "exPy": "Yí gè rén.",
              "exFa": "یک نفر."
            },
            {
              "hanzi": "二",
              "py": "èr",
              "fa": "عدد دو",
              "ex": "二十块钱。",
              "exPy": "Èrshí kuài qián.",
              "exFa": "بیست یوآن پول."
            },
            {
              "hanzi": "三",
              "py": "sān",
              "fa": "عدد سه",
              "ex": "三个苹果。",
              "exPy": "Sān gè píngguǒ.",
              "exFa": "سه عدد سیب."
            },
            {
              "hanzi": "十",
              "py": "shí",
              "fa": "عدد ده",
              "ex": "十块钱。",
              "exPy": "Shí kuài qián.",
              "exFa": "ده یوآن پول."
            },
            {
              "hanzi": "百",
              "py": "bǎi",
              "fa": "صد",
              "ex": "一百块。",
              "exPy": "Yìbǎi kuài.",
              "exFa": "صد یوآن."
            },
            {
              "hanzi": "多少",
              "py": "duōshao",
              "fa": "چقدر / چندتا؟",
              "ex": "这个多少钱？",
              "exPy": "Zhège duōshao qián?",
              "exFa": "این چنده؟"
            },
            {
              "hanzi": "钱",
              "py": "qián",
              "fa": "پول",
              "ex": "我没有钱。",
              "exPy": "Wǒ méiyǒu qián.",
              "exFa": "من پولی ندارم."
            },
            {
              "hanzi": "块",
              "py": "kuài",
              "fa": "یوآن (واحد محاوره‌ای پول چین)",
              "ex": "五块钱。",
              "exPy": "Wǔ kuài qián.",
              "exFa": "پنج یوآن پول."
            },
            {
              "hanzi": "买",
              "py": "mǎi",
              "fa": "خریدن",
              "ex": "我想买衣服。",
              "exPy": "Wǒ xiǎng mǎi yīfu.",
              "exFa": "می‌خواهم لباس بخرم."
            },
            {
              "hanzi": "太",
              "py": "tài",
              "fa": "خیلی / بیش از حد",
              "ex": "太贵了！",
              "exPy": "Tài guì le!",
              "exFa": "خیلی گرونه!"
            },
            {
              "hanzi": "贵",
              "py": "guì",
              "fa": "گران‌قیمت",
              "ex": "这个太贵了，便宜点儿吧。",
              "exPy": "Zhège tài guì le, piányi diǎnr ba.",
              "exFa": "این خیلی گرونه، یه کم ارزون‌تر بده."
            },
            {
              "hanzi": "便宜",
              "py": "piányi",
              "fa": "ارزان / باصرفه",
              "ex": "很便宜！",
              "exPy": "Hěn piányi!",
              "exFa": "خیلی ارزونه!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «一» (yī) چیست؟",
                "audio": "yī",
                "hanzi": "一",
                "pinyin": "yī",
                "opts": [
                  "عدد یک",
                  "عدد دو",
                  "عدد سه",
                  "عدد ده"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «二» (èr) چیست؟",
                "audio": "èr",
                "hanzi": "二",
                "pinyin": "èr",
                "opts": [
                  "عدد دو",
                  "عدد یک",
                  "عدد سه",
                  "عدد ده"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «三» (sān) چیست؟",
                "audio": "sān",
                "hanzi": "三",
                "pinyin": "sān",
                "opts": [
                  "عدد سه",
                  "عدد یک",
                  "عدد دو",
                  "عدد ده"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «十» (shí) چیست؟",
                "audio": "shí",
                "hanzi": "十",
                "pinyin": "shí",
                "opts": [
                  "عدد ده",
                  "عدد یک",
                  "عدد دو",
                  "عدد سه"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "一",
                    "fa": "عدد یک"
                  },
                  {
                    "zh": "二",
                    "fa": "عدد دو"
                  },
                  {
                    "zh": "三",
                    "fa": "عدد سه"
                  },
                  {
                    "zh": "十",
                    "fa": "عدد ده"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "پرسش قیمت با 多少钱 و ساختار مبالغه 太...了",
        "intro": {
          "title": "پرسش قیمت با 多少钱 و ساختار مبالغه 太...了",
          "lead": "۱. فرمول پرسش قیمت: شیء یا کالا + 多少钱？ (مثال: 这个苹果多少钱؟)\n۲. ساختار مبالغه و بیان احساس: 太 + صفت + 了 (مثال: 太贵了 = خیلی گرونه! / 太好了 = عالیه!).\n۳. ارقام دو رقمی: ۱۰ تا ۹۹ به صورت سرراست ترکیب می‌شوند (二十 = بیست، 三十五 = سی و پنج).",
          "formula": "اسم کالا + 多少钱？ | 太 + صفت + 了",
          "examples": [
            {
              "zh": "这个杯子多少钱？— 二十五块。",
              "py": "Zhège bēizi duōshao qián? — Èrshíwǔ kuài.",
              "fa": "این لیوان چند است؟ — ۲۵ یوآن."
            },
            {
              "zh": "太贵了，可以便宜一点儿吗？",
              "py": "Tài guì le, kěyǐ piányi yìdiǎnr ma?",
              "fa": "خیلی گران است، می‌شود کمی ارزان‌تر بدهید؟"
            },
            {
              "zh": "一百块，给你钱。",
              "py": "Yìbǎi kuài, gěi nǐ qián.",
              "fa": "صد یوآن، بفرمایید پولتان."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل فارسی عبارت «太贵了！» چیست؟",
                "opts": [
                  "خیلی گران است!",
                  "خیلی ارزان است!",
                  "چقدر پول داری؟",
                  "خیلی خوب است!"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «این کتاب چند است؟» مرتب کنید:",
                "tiles": [
                  "这本书",
                  "多少",
                  "钱"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در مغازه صنایع دستی پکن: خرید فنجان چای",
        "intro": {
          "title": "مکالمه در مغازه صنایع دستی پکن: خرید فنجان چای",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "你好，请问这个茶杯多少钱？",
              "py": "Nǐ hǎo, qǐngwèn zhège chábēi duōshao qián?",
              "fa": "سلام، ببخشید این فنجان چای چند است؟"
            },
            {
              "role": "B",
              "speaker": "فروشنده",
              "zh": "这个五十块钱。",
              "py": "Zhège wǔshí kuài qián.",
              "fa": "این یکی ۵۰ یوآن است."
            },
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "哎呀，太贵了！三十块可以吗？",
              "py": "Āiyā, tài guì le! Sānshí kuài kěyǐ ma?",
              "fa": "وای، خیلی گرونه! ۳۰ یوآن می‌شه؟"
            },
            {
              "role": "B",
              "speaker": "فروشنده",
              "zh": "四十块吧，很便宜了。",
              "py": "Sìshí kuài ba, hěn piányi le.",
              "fa": "۴۰ یوآن بدهید، دیگر خیلی ارزان شد."
            },
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "好的，我买两个！",
              "py": "Hǎo de, wǒ mǎi liǎng gè!",
              "fa": "باشه، من دو تا می‌خرم!"
            },
            {
              "role": "B",
              "speaker": "فروشنده",
              "zh": "好的，一共八十块，谢谢！",
              "py": "Hǎo de, yígòng bāshí kuài, xièxie!",
              "fa": "چشم، کلاً می‌شود ۸۰ یوآن، متشکرم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (مشتری) چه می‌گوید؟",
                "opts": [
                  "你好，请问这个茶杯多少钱？ (سلام، ببخشید این فنجان چای چند است؟)",
                  "这个五十块钱。 (این یکی ۵۰ یوآن است.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «哎呀，太贵了！三十块可以吗？» چیست؟",
                "opts": [
                  "四十块吧，很便宜了。 (۴۰ یوآن بدهید، دیگر خیلی ارزان شد.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 4",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل فارسی عبارت «太贵了！» چیست؟",
                "opts": [
                  "خیلی گران است!",
                  "خیلی ارزان است!",
                  "چقدر پول داری؟",
                  "خیلی خوب است!"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «این کتاب چند است؟» مرتب کنید:",
                "tiles": [
                  "这本书",
                  "多少",
                  "钱"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "اعداد چینی را به ارقام فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "二十",
                    "fa": "۲۰"
                  },
                  {
                    "zh": "五十",
                    "fa": "۵۰"
                  },
                  {
                    "zh": "八十",
                    "fa": "۸۰"
                  },
                  {
                    "zh": "一百",
                    "fa": "۱۰۰"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام کلمه به معنای «پول» است؟",
                "opts": [
                  "钱 (qián)",
                  "块 (kuài)",
                  "买 (mǎi)",
                  "贵 (guì)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:4": {
    "id": "hsk1:4",
    "courseId": "hsk1",
    "unitIndex": 4,
    "unitNum": 5,
    "title": "Mobile Payment & Digital Life",
    "titleFa": "پرداخت با بارکد و تلفن همراه",
    "titleZh": "我用手机扫码支付",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "ورود به واژگان فوق‌مدرن HSK 3.0: اسکن بارکد QR، اپلیکیشن ویچت، پرداخت موبایلی و ارسال پیام",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 5",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "手机",
              "py": "shǒujī",
              "fa": "تلفن همراه / موبایل",
              "ex": "我的手机在这里。",
              "exPy": "Wǒ de shǒujī zài zhèlǐ.",
              "exFa": "گوشی من اینجاست."
            },
            {
              "hanzi": "扫码",
              "py": "sǎo mǎ",
              "fa": "اسکن کردن بارکد / QR کد",
              "ex": "请扫码支付。",
              "exPy": "Qǐng sǎomǎ zhīfù.",
              "exFa": "لطفاً بارکد را اسکن و پرداخت کنید."
            },
            {
              "hanzi": "微信",
              "py": "Wēixìn",
              "fa": "ویچت (پیام‌رسان اصلی چین)",
              "ex": "加我的微信吧。",
              "exPy": "Jiā wǒ de Wēixìn ba.",
              "exFa": "ویچت من رو اضافه کن."
            },
            {
              "hanzi": "发",
              "py": "fā",
              "fa": "ارسال کردن / فرستادن",
              "ex": "我给你发信息。",
              "exPy": "Wǒ gěi nǐ fā xìnxī.",
              "exFa": "برایت پیام می‌فرستم."
            },
            {
              "hanzi": "信息",
              "py": "xìnxī",
              "fa": "پیام / اطلاعات",
              "ex": "收到一条新信息。",
              "exPy": "Shōudào yì tiáo xīn xìnxī.",
              "exFa": "یک پیام جدید دریافت شد."
            },
            {
              "hanzi": "用",
              "py": "yòng",
              "fa": "استفاده کردن / با (وسیله)",
              "ex": "中国人常用手机买单。",
              "exPy": "Zhōngguórén cháng yòng shǒujī mǎidān.",
              "exFa": "چینی‌ها معمولاً با گوشی حساب می‌کنند."
            },
            {
              "hanzi": "电脑",
              "py": "diànnǎo",
              "fa": "کامپیوتر / لپ‌تاپ",
              "ex": "我用电脑学习汉语。",
              "exPy": "Wǒ yòng diànnǎo xuéxí Hànyǔ.",
              "exFa": "من با کامپیوتر زبان چینی می‌خوانم."
            },
            {
              "hanzi": "网上",
              "py": "wǎngshang",
              "fa": "در اینترنت / آنلاین",
              "ex": "我在网上买东西。",
              "exPy": "Wǒ zài wǎngshang mǎi dōngxi.",
              "exFa": "من آنلاین خرید می‌کنم."
            },
            {
              "hanzi": "可以",
              "py": "kěyǐ",
              "fa": "امکان داشتن / می‌شود",
              "ex": "可以用微信吗？",
              "exPy": "Kěyǐ yòng Wēixìn ma?",
              "exFa": "می‌شود با ویچت پرداخت کرد؟"
            },
            {
              "hanzi": "密码",
              "py": "mìmǎ",
              "fa": "رمز عبور / پسورد",
              "ex": "请输入支付密码。",
              "exPy": "Qǐng shūrù zhīfù mìmǎ.",
              "exFa": "لطفاً رمز پرداخت را وارد کنید."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «手机» (shǒujī) چیست؟",
                "audio": "shǒujī",
                "hanzi": "手机",
                "pinyin": "shǒujī",
                "opts": [
                  "تلفن همراه / موبایل",
                  "اسکن کردن بارکد / QR کد",
                  "ویچت (پیام‌رسان اصلی چین)",
                  "ارسال کردن / فرستادن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «扫码» (sǎo mǎ) چیست؟",
                "audio": "sǎo mǎ",
                "hanzi": "扫码",
                "pinyin": "sǎo mǎ",
                "opts": [
                  "اسکن کردن بارکد / QR کد",
                  "تلفن همراه / موبایل",
                  "ویچت (پیام‌رسان اصلی چین)",
                  "ارسال کردن / فرستادن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «微信» (Wēixìn) چیست؟",
                "audio": "Wēixìn",
                "hanzi": "微信",
                "pinyin": "Wēixìn",
                "opts": [
                  "ویچت (پیام‌رسان اصلی چین)",
                  "تلفن همراه / موبایل",
                  "اسکن کردن بارکد / QR کد",
                  "ارسال کردن / فرستادن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «发» (fā) چیست؟",
                "audio": "fā",
                "hanzi": "发",
                "pinyin": "fā",
                "opts": [
                  "ارسال کردن / فرستادن",
                  "تلفن همراه / موبایل",
                  "اسکن کردن بارکد / QR کد",
                  "ویچت (پیام‌رسان اصلی چین)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "手机",
                    "fa": "تلفن همراه"
                  },
                  {
                    "zh": "扫码",
                    "fa": "اسکن کردن بارکد"
                  },
                  {
                    "zh": "微信",
                    "fa": "ویچت (پیام‌رسان اصلی چین)"
                  },
                  {
                    "zh": "发",
                    "fa": "ارسال کردن"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "جملات ابزاری با 用 (استفاده از وسیله) و فعل کمکی 可以",
        "intro": {
          "title": "جملات ابزاری با 用 (استفاده از وسیله) و فعل کمکی 可以",
          "lead": "۱. ساختار استفاده از ابزار: فاعل + 用 + وسیله + فعل اصلی (مثال: 我用手机扫码 = من با گوشی بارکد را اسکن می‌کنم).\n۲. پرسش اجازه و امکان: 可以 + فعل + 吗？ (مثال: 可以扫码吗？ = می‌شود بارکد زد؟).",
          "formula": "فاعل + 用 + وسیله + فعل | 可以 + فعل + 吗？",
          "examples": [
            {
              "zh": "可以用微信支付吗？— 可以，请扫这里。",
              "py": "Kěyǐ yòng Wēixìn zhīfù ma? — Kěyǐ, qǐng sǎo zhèlǐ.",
              "fa": "می‌توانم با ویچت پرداخت کنم؟ — بله، لطفاً اینجا را اسکن کنید."
            },
            {
              "zh": "我用电脑发信息。",
              "py": "Wǒ yòng diànnǎo fā xìnxī.",
              "fa": "من با کامپیوتر پیام ارسال می‌کنم."
            },
            {
              "zh": "请输入密码。",
              "py": "Qǐng shūrù mìmǎ.",
              "fa": "لطفاً رمز عبور را وارد نمایید."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "اصطلاح مدرن «扫码» (sǎo mǎ) در چین به چه معناست؟",
                "opts": [
                  "اسکن بارکد QR با گوشی",
                  "خرید شارژ سیم‌کارت",
                  "عکس گرفتن با دوربین",
                  "تعمیر موبایل"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «می‌توان با ویچت پرداخت کرد؟» مرتب کنید:",
                "tiles": [
                  "可以",
                  "用微信",
                  "支付吗"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در فروشگاه شبانه‌روزی پکن: پرداخت آنلاین",
        "intro": {
          "title": "مکالمه در فروشگاه شبانه‌روزی پکن: پرداخت آنلاین",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "你好，一共多少钱？",
              "py": "Nǐ hǎo, yígòng duōshao qián?",
              "fa": "سلام، کلاً چقدر شد؟"
            },
            {
              "role": "B",
              "speaker": "صندوقدار",
              "zh": "一共三十八块。",
              "py": "Yígòng sānshíbā kuài.",
              "fa": "کلاً ۳۸ یوآن."
            },
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "请问，可以用手机扫码吗？",
              "py": "Qǐngwèn, kěyǐ yòng shǒujī sǎomǎ ma?",
              "fa": "ببخشید، می‌توانم با گوشی بارکد اسکن کنم؟"
            },
            {
              "role": "B",
              "speaker": "صندوقدار",
              "zh": "可以，微信和支付宝都可以，请扫这个码。",
              "py": "Kěyǐ, Wēixìn hé Zhīfùbǎo dōu kěyǐ, qǐng sǎo zhège mǎ.",
              "fa": "بله، هم ویچت و هم علی‌پِی می‌شود، لطفاً این کد را اسکن کنید."
            },
            {
              "role": "A",
              "speaker": "مشتری",
              "zh": "好的，我已经扫码支付了。",
              "py": "Hǎo de, wǒ yǐjīng sǎomǎ zhīfù le.",
              "fa": "باشه، من اسکن کردم و پرداخت انجام شد."
            },
            {
              "role": "B",
              "speaker": "صندوقدار",
              "zh": "收到，慢走！",
              "py": "Shōudào, màn zǒu!",
              "fa": "دریافت شد، روز خوبی داشته باشید!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (مشتری) چه می‌گوید؟",
                "opts": [
                  "你好，一共多少钱？ (سلام، کلاً چقدر شد؟)",
                  "一共三十八块。 (کلاً ۳۸ یوآن.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «请问，可以用手机扫码吗？» چیست؟",
                "opts": [
                  "可以，微信和支付宝都可以，请扫这个码。 (بله، هم ویچت و هم علی‌پِی می‌شود، لطفاً این کد را اسکن کنید.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 5",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "اصطلاح مدرن «扫码» (sǎo mǎ) در چین به چه معناست؟",
                "opts": [
                  "اسکن بارکد QR با گوشی",
                  "خرید شارژ سیم‌کارت",
                  "عکس گرفتن با دوربین",
                  "تعمیر موبایل"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «می‌توان با ویچت پرداخت کرد؟» مرتب کنید:",
                "tiles": [
                  "可以",
                  "用微信",
                  "支付吗"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "اصطلاحات دنیای دیجیتال را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "手机",
                    "fa": "گوشی موبایل"
                  },
                  {
                    "zh": "微信",
                    "fa": "پیام‌رسان ویچت"
                  },
                  {
                    "zh": "密码",
                    "fa": "رمز عبور"
                  },
                  {
                    "zh": "发信息",
                    "fa": "پیام فرستادن"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام کلمه به معنای «کامپیوتر / لپ‌تاپ» است؟",
                "opts": [
                  "电脑 (diànnǎo)",
                  "手机 (shǒujī)",
                  "扫码 (sǎomǎ)",
                  "信息 (xìnxī)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:5": {
    "id": "hsk1:5",
    "courseId": "hsk1",
    "unitIndex": 5,
    "unitNum": 6,
    "title": "Food & Restaurant Ordering",
    "titleFa": "سفارش غذا و نوشیدنی در رستوران",
    "titleZh": "我想吃中国菜，喝茶",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری سفارش غذا، منوی رستوران، فعل تمایل 想 و واحدهای شمارش غذا و نوشیدنی",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 6",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "想",
              "py": "xiǎng",
              "fa": "خواستن / تمایل داشتن",
              "ex": "我想喝咖啡。",
              "exPy": "Wǒ xiǎng hē kāfēi.",
              "exFa": "من قهوه می‌خواهم."
            },
            {
              "hanzi": "吃",
              "py": "chī",
              "fa": "خوردن",
              "ex": "你想吃什么？",
              "exPy": "Nǐ xiǎng chī shénme?",
              "exFa": "چی دوست داری بخوری؟"
            },
            {
              "hanzi": "喝",
              "py": "hē",
              "fa": "نوشیدن",
              "ex": "请喝热水。",
              "exPy": "Qǐng hē rè shuǐ.",
              "exFa": "لطفاً آب گرم بنوشید."
            },
            {
              "hanzi": "茶",
              "py": "chá",
              "fa": "چای سنتی چینی",
              "ex": "中国人喜欢喝绿茶。",
              "exPy": "Zhōngguórén xǐhuan hē lǜchá.",
              "exFa": "چینی‌ها چای سبز دوست دارند."
            },
            {
              "hanzi": "咖啡",
              "py": "kāfēi",
              "fa": "قهوه",
              "ex": "来一杯冰咖啡。",
              "exPy": "Lái yì bēi bīng kāfēi.",
              "exFa": "یک لیوان قهوه سرد بیاورید."
            },
            {
              "hanzi": "水",
              "py": "shuǐ",
              "fa": "آب",
              "ex": "我想喝矿泉水。",
              "exPy": "Wǒ xiǎng hē kuàngquánshuǐ.",
              "exFa": "می‌خواهم آب معدنی بنوشم."
            },
            {
              "hanzi": "菜",
              "py": "cài",
              "fa": "غذا / خوراک / سبزیجات",
              "ex": "中国菜很好吃。",
              "exPy": "Zhōngguó cài hěn hǎochī.",
              "exFa": "غذای چینی خیلی خوشمزه است."
            },
            {
              "hanzi": "米饭",
              "py": "mǐfàn",
              "fa": "برنج پخته / چلو",
              "ex": "我要两碗米饭。",
              "exPy": "Wǒ yào liǎng wǎn mǐfàn.",
              "exFa": "من دو کاسه برنج می‌خواهم."
            },
            {
              "hanzi": "面条",
              "py": "miàntiáo",
              "fa": "نودل / رشته چینی",
              "ex": "牛肉面条很好吃。",
              "exPy": "Niúròu miàntiáo hěn hǎochī.",
              "exFa": "نودل گوشت گوساله خیلی لذیذ است."
            },
            {
              "hanzi": "菜单",
              "py": "càidān",
              "fa": "منوی غذا",
              "ex": "服务员，请给我菜单。",
              "exPy": "Fúwùyuán, qǐng gěi wǒ càidān.",
              "exFa": "گارسون، لطفاً منو را به من بدهید."
            },
            {
              "hanzi": "好吃",
              "py": "hǎochī",
              "fa": "خوشمزه / لذیذ",
              "ex": "这个菜真好吃！",
              "exPy": "Zhège cài zhēn hǎochī!",
              "exFa": "این غذا واقعاً خوشمزه است!"
            },
            {
              "hanzi": "买单",
              "py": "mǎidān",
              "fa": "حساب کردن صورتحساب",
              "ex": "服务员，买单！",
              "exPy": "Fúwùyuán, mǎidān!",
              "exFa": "گارسون، لطفاً صورتحساب!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «想» (xiǎng) چیست؟",
                "audio": "xiǎng",
                "hanzi": "想",
                "pinyin": "xiǎng",
                "opts": [
                  "خواستن / تمایل داشتن",
                  "خوردن",
                  "نوشیدن",
                  "چای سنتی چینی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «吃» (chī) چیست؟",
                "audio": "chī",
                "hanzi": "吃",
                "pinyin": "chī",
                "opts": [
                  "خوردن",
                  "خواستن / تمایل داشتن",
                  "نوشیدن",
                  "چای سنتی چینی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «喝» (hē) چیست؟",
                "audio": "hē",
                "hanzi": "喝",
                "pinyin": "hē",
                "opts": [
                  "نوشیدن",
                  "خواستن / تمایل داشتن",
                  "خوردن",
                  "چای سنتی چینی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «茶» (chá) چیست؟",
                "audio": "chá",
                "hanzi": "茶",
                "pinyin": "chá",
                "opts": [
                  "چای سنتی چینی",
                  "خواستن / تمایل داشتن",
                  "خوردن",
                  "نوشیدن"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "想",
                    "fa": "خواستن"
                  },
                  {
                    "zh": "吃",
                    "fa": "خوردن"
                  },
                  {
                    "zh": "喝",
                    "fa": "نوشیدن"
                  },
                  {
                    "zh": "茶",
                    "fa": "چای سنتی چینی"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "فعل کمکی 想 و کاربرد محاوره‌ای 来 در سفارش غذا",
        "intro": {
          "title": "فعل کمکی 想 و کاربرد محاوره‌ای 来 در سفارش غذا",
          "lead": "۱. فعل تمایل: فاعل + 想 + فعل (مثال: 我想喝茶 = من می‌خواهم چای بنوشم).\n۲. سفارش محترمانه در رستوران: به جای دستور مستقیم، از کلمه 来 (به معنی بیاورید/میل دارم) استفاده می‌شود: 来 + مقدار + اسم غذا (مثال: 来一碗面条 = یک کاسه نودل بیاورید).",
          "formula": "فاعل + 想 + فعل + مفعول | 来 + [عدد + واحد شمارش] + غذا",
          "examples": [
            {
              "zh": "你想吃什么？— 我想吃中国菜。",
              "py": "Nǐ xiǎng chī shénme? — Wǒ xiǎng chī Zhōngguó cài.",
              "fa": "چه می‌خواهی بخوری؟ — غذای چینی می‌خواهم."
            },
            {
              "zh": "服务员，来一杯茶和两碗米饭。",
              "py": "Fúwùyuán, lái yì bēi chá hé liǎng wǎn mǐfàn.",
              "fa": "گارسون، یک فنجان چای و دو کاسه برنج بیاورید."
            },
            {
              "zh": "买单，一共多少钱？",
              "py": "Mǎidān, yígòng duōshao qián?",
              "fa": "حساب کنید، کلاً چقدر شد؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "در رستوران برای گفتن «صورتحساب لطفاً!» از چه کلمه‌ای استفاده می‌شود؟",
                "opts": [
                  "买单 (Mǎidān)",
                  "菜单 (Càidān)",
                  "好吃 (Hǎochī)",
                  "喝茶 (Hē chá)"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من می‌خواهم چای چینی بنوشم» مرتب کنید:",
                "tiles": [
                  "我",
                  "想喝",
                  "中国茶"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در رستوران سنتی: ناهار دو دوست",
        "intro": {
          "title": "مکالمه در رستوران سنتی: ناهار دو دوست",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "服务员，请问有菜单吗？",
              "py": "Fúwùyuán, qǐngwèn yǒu càidān ma?",
              "fa": "گارسون، ببخشید منو دارید؟"
            },
            {
              "role": "B",
              "speaker": "گارسون",
              "zh": "有的，这是菜单。请问想吃什么？",
              "py": "Yǒu de, zhè shì càidān. Qǐngwèn xiǎng chī shénme?",
              "fa": "بله داریم، بفرمایید این منوست. میل دارید چه چیزی میل بفرمایید؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "我想吃一碗牛肉面条，你呢？",
              "py": "Wǒ xiǎng chī yì wǎn niúròu miàntiáo, nǐ ne?",
              "fa": "من یک کاسه نودل گوشت می‌خواهم، تو چطور؟"
            },
            {
              "role": "B",
              "speaker": "علی",
              "zh": "我想吃米饭和中国菜。喝茶吗？",
              "py": "Wǒ xiǎng chī mǐfàn hé Zhōngguó cài. Hē chá ma?",
              "fa": "من چلو و خوراک چینی می‌خواهم. چای می‌نوشی؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "好的，来一壶热茶！",
              "py": "Hǎo de, lái yì hú rè chá!",
              "fa": "عالیه، یک قوری چای داغ هم بیاورید!"
            },
            {
              "role": "B",
              "speaker": "گارسون",
              "zh": "好的，请稍等！",
              "py": "Hǎo de, qǐng shāo děng!",
              "fa": "چشم، لطفاً کمی منتظر بمانید!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "服务员，请问有菜单吗？ (گارسون، ببخشید منو دارید؟)",
                  "有的，这是菜单。请问想吃什么？ (بله داریم، بفرمایید این منوست. میل دارید چه چیزی میل بفرمایید؟)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «我想吃一碗牛肉面条，你呢？» چیست؟",
                "opts": [
                  "我想吃米饭和中国菜。喝茶吗？ (من چلو و خوراک چینی می‌خواهم. چای می‌نوشی؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 6",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "در رستوران برای گفتن «صورتحساب لطفاً!» از چه کلمه‌ای استفاده می‌شود؟",
                "opts": [
                  "买单 (Mǎidān)",
                  "菜单 (Càidān)",
                  "好吃 (Hǎochī)",
                  "喝茶 (Hē chá)"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من می‌خواهم چای چینی بنوشم» مرتب کنید:",
                "tiles": [
                  "我",
                  "想喝",
                  "中国茶"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "خوراکی‌ها و نوشیدنی‌ها را وصل کنید:",
                "pairs": [
                  {
                    "zh": "米饭",
                    "fa": "برنج / چلو"
                  },
                  {
                    "zh": "面条",
                    "fa": "نودل / رشته"
                  },
                  {
                    "zh": "茶",
                    "fa": "چای"
                  },
                  {
                    "zh": "咖啡",
                    "fa": "قهوه"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "پاسخ به سوال «你想吃什么？» کدام گزینه است؟",
                "opts": [
                  "我想吃面条。",
                  "我是中国人。",
                  "太贵了！",
                  "现在五点。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:6": {
    "id": "hsk1:6",
    "courseId": "hsk1",
    "unitIndex": 6,
    "unitNum": 7,
    "title": "Time & Daily Schedule",
    "titleFa": "ساعت و زمان‌بندی روزمره",
    "titleZh": "现在几点了？",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری بیان دقیق ساعت و دقیقه، اوقات روز (صبح، ظهر، شب) و جایگاه قید زمان در جمله",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 7",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "现在",
              "py": "xiànzài",
              "fa": "اکنون / الان",
              "ex": "现在几点？",
              "exPy": "Xiànzài jǐ diǎn?",
              "exFa": "الان ساعت چنده؟"
            },
            {
              "hanzi": "点",
              "py": "diǎn",
              "fa": "ساعت (واحد زمان)",
              "ex": "八点整。",
              "exPy": "Bā diǎn zhěng.",
              "exFa": "ساعت هشت دقیق."
            },
            {
              "hanzi": "分",
              "py": "fēn",
              "fa": "دقیقه",
              "ex": "八点十五分。",
              "exPy": "Bā diǎn shíwǔ fēn.",
              "exFa": "هشت و پانزده دقیقه."
            },
            {
              "hanzi": "半",
              "py": "bàn",
              "fa": "نیم / و نیم",
              "ex": "九点半。",
              "exPy": "Jiǔ diǎn bàn.",
              "exFa": "ساعت نه و نیم."
            },
            {
              "hanzi": "刻",
              "py": "kè",
              "fa": "یک ربع (۱۵ دقیقه)",
              "ex": "七点一刻。",
              "exPy": "Qī diǎn yí kè.",
              "exFa": "ساعت هفت و ربع."
            },
            {
              "hanzi": "早上",
              "py": "zǎoshang",
              "fa": "صبح زود",
              "ex": "早上好！",
              "exPy": "Zǎoshang hǎo!",
              "exFa": "صبح بخیر!"
            },
            {
              "hanzi": "中午",
              "py": "zhōngwǔ",
              "fa": "ظهر / وقت ناهار",
              "ex": "中午十二点吃饭。",
              "exPy": "Zhōngwǔ shí'èr diǎn chīfàn.",
              "exFa": "ظهر ساعت ۱۲ ناهار می‌خوریم."
            },
            {
              "hanzi": "晚上",
              "py": "wǎnshang",
              "fa": "عصر / شب",
              "ex": "晚上看电影。",
              "exPy": "Wǎnshang kàn diànyǐng.",
              "exFa": "شب فیلم تماشا می‌کنیم."
            },
            {
              "hanzi": "起床",
              "py": "qǐ chuáng",
              "fa": "از خواب بیدار شدن",
              "ex": "我每天六点起床。",
              "exPy": "Wǒ měitiān liù diǎn qǐchuáng.",
              "exFa": "من هر روز ساعت ۶ بیدار می‌شوم."
            },
            {
              "hanzi": "睡觉",
              "py": "shuì jiào",
              "fa": "خوابیدن",
              "ex": "晚上十一点睡觉。",
              "exPy": "Wǎnshang shíyī diǎn shuìjiào.",
              "exFa": "شب‌ها ساعت ۱۱ می‌خوابم."
            },
            {
              "hanzi": "上班",
              "py": "shàng bān",
              "fa": "سر کار رفتن",
              "ex": "爸爸早上八点上班。",
              "exPy": "Bàba zǎoshang bā diǎn shàngbān.",
              "exFa": "پدرم صبح ساعت ۸ سر کار می‌رود."
            },
            {
              "hanzi": "下班",
              "py": "xià bān",
              "fa": "تعطیل شدن از کار",
              "ex": "下午五点半下班。",
              "exPy": "Xiàwǔ wǔ diǎn bàn xiàbān.",
              "exFa": "عصر ساعت پنج و نیم تعطیل می‌شوم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «现在» (xiànzài) چیست؟",
                "audio": "xiànzài",
                "hanzi": "现在",
                "pinyin": "xiànzài",
                "opts": [
                  "اکنون / الان",
                  "ساعت (واحد زمان)",
                  "دقیقه",
                  "نیم / و نیم"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «点» (diǎn) چیست؟",
                "audio": "diǎn",
                "hanzi": "点",
                "pinyin": "diǎn",
                "opts": [
                  "ساعت (واحد زمان)",
                  "اکنون / الان",
                  "دقیقه",
                  "نیم / و نیم"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «分» (fēn) چیست؟",
                "audio": "fēn",
                "hanzi": "分",
                "pinyin": "fēn",
                "opts": [
                  "دقیقه",
                  "اکنون / الان",
                  "ساعت (واحد زمان)",
                  "نیم / و نیم"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «半» (bàn) چیست؟",
                "audio": "bàn",
                "hanzi": "半",
                "pinyin": "bàn",
                "opts": [
                  "نیم / و نیم",
                  "اکنون / الان",
                  "ساعت (واحد زمان)",
                  "دقیقه"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "现在",
                    "fa": "اکنون"
                  },
                  {
                    "zh": "点",
                    "fa": "ساعت (واحد زمان)"
                  },
                  {
                    "zh": "分",
                    "fa": "دقیقه"
                  },
                  {
                    "zh": "半",
                    "fa": "نیم"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "فرمول بیان ساعت و جایگاه قید زمان در چینی",
        "intro": {
          "title": "فرمول بیان ساعت و جایگاه قید زمان در چینی",
          "lead": "۱. فرمول ساعت: [اوقات روز] + ساعت + 点 + دقیقه + 分 (مثال: 早上八点三十分 = ساعت ۸:۳۰ صبح).\n۲. جایگاه زمان در جمله: قید زمان همیشه یا قبل از فاعل می‌آید یا بلافاصله بعد از فاعل و قبل از فعل (قانون: Subject + Time + Verb یا Time + Subject + Verb).",
          "formula": "عدد + 点 (+ عدد + 分 / 半) | فاعل + قید زمان + فعل",
          "examples": [
            {
              "zh": "现在几点？— 现在九点半。",
              "py": "Xiànzài jǐ diǎn? — Xiànzài jiǔ diǎn bàn.",
              "fa": "الان ساعت چند است؟ — الان ساعت نه و نیم است."
            },
            {
              "zh": "我们中午十二点吃午饭。",
              "py": "Wǒmen zhōngwǔ shí'èr diǎn chī wǔfàn.",
              "fa": "ما ظهر ساعت ۱۲ ناهار می‌خوریم."
            },
            {
              "zh": "你什么时候下班？",
              "py": "Nǐ shénme shíhou xiàbān?",
              "fa": "تو چه زمانی تعطیل می‌شوی؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی عبارت «九点半» (jiǔ diǎn bàn) چیست؟",
                "opts": [
                  "ساعت ۹:۳۰",
                  "ساعت ۹:۱۵",
                  "ساعت ۱۰:۳۰",
                  "ساعت ۸:۳۰"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من ساعت ۷ صبح بیدار می‌شوم» مرتب کنید:",
                "tiles": [
                  "我",
                  "早上七点",
                  "起床"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه هماهنگی جلسه و کلاس دانشگاه",
        "intro": {
          "title": "مکالمه هماهنگی جلسه و کلاس دانشگاه",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "علی",
              "zh": "请问，现在几点了？",
              "py": "Qǐngwèn, xiànzài jǐ diǎn le?",
              "fa": "ببخشید، الان ساعت چنده؟"
            },
            {
              "role": "B",
              "speaker": "وانگ",
              "zh": "现在两点一刻。",
              "py": "Xiànzài liǎng diǎn yí kè.",
              "fa": "الان ساعت دو و ربع است."
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "我们几点去图书馆？",
              "py": "Wǒmen jǐ diǎn qù túshūguǎn?",
              "fa": "ما ساعت چند به کتابخانه می‌رویم؟"
            },
            {
              "role": "B",
              "speaker": "وانگ",
              "zh": "下午三点半去，可以吗？",
              "py": "Xiàwǔ sān diǎn bàn qù, kěyǐ ma?",
              "fa": "عصر ساعت سه و نیم برویم، مناسب است؟"
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "好的，三点半图书馆门口见！",
              "py": "Hǎo de, sān diǎn bàn túshūguǎn ménkǒu jiàn!",
              "fa": "عالیه، سه و نیم دم درب کتابخانه می‌بینمت!"
            },
            {
              "role": "B",
              "speaker": "وانگ",
              "zh": "没问题，不见不散！",
              "py": "Méi wèntí, bú jiàn bú sàn!",
              "fa": "حله، سر ساعت اونجام!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (علی) چه می‌گوید؟",
                "opts": [
                  "请问，现在几点了？ (ببخشید، الان ساعت چنده؟)",
                  "现在两点一刻。 (الان ساعت دو و ربع است.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «我们几点去图书馆？» چیست؟",
                "opts": [
                  "下午三点半去，可以吗？ (عصر ساعت سه و نیم برویم، مناسب است؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 7",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی عبارت «九点半» (jiǔ diǎn bàn) چیست؟",
                "opts": [
                  "ساعت ۹:۳۰",
                  "ساعت ۹:۱۵",
                  "ساعت ۱۰:۳۰",
                  "ساعت ۸:۳۰"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من ساعت ۷ صبح بیدار می‌شوم» مرتب کنید:",
                "tiles": [
                  "我",
                  "早上七点",
                  "起床"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "واژه‌های زمانی را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "早上",
                    "fa": "صبح"
                  },
                  {
                    "zh": "中午",
                    "fa": "ظهر"
                  },
                  {
                    "zh": "晚上",
                    "fa": "شب"
                  },
                  {
                    "zh": "现在",
                    "fa": "اکنون"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "برای پرسیدن «الان ساعت چنده؟» کدام جمله درست است؟",
                "opts": [
                  "现在几点？",
                  "现在多少点？",
                  "现在什么时间？",
                  "现在哪儿点？"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:7": {
    "id": "hsk1:7",
    "courseId": "hsk1",
    "unitIndex": 7,
    "unitNum": 8,
    "title": "Dates & Calendar",
    "titleFa": "تقویم، روزهای هفته و تاریخ",
    "titleZh": "今天几月几号？",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری بیان تاریخ از کل به جزء (سال، ماه، روز)، روزهای هفته، سالروز تولد و تعطیلات",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 8",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "年",
              "py": "nián",
              "fa": "سال",
              "ex": "今年是2026年。",
              "exPy": "Jīnnián shì èr líng èr liù nián.",
              "exFa": "امسال سال ۲۰۲۶ است."
            },
            {
              "hanzi": "月",
              "py": "yuè",
              "fa": "ماه",
              "ex": "九月开学。",
              "exPy": "Jiǔyuè kāixué.",
              "exFa": "دانشگاه در ماه سپتامبر شروع می‌شود."
            },
            {
              "hanzi": "日",
              "py": "rì",
              "fa": "روز (رسمی و نوشتاری)",
              "ex": "十月一日是国庆节。",
              "exPy": "Shíyuè yī rì shì Guóqìngjié.",
              "exFa": "یکم اکتبر روز ملی چین است."
            },
            {
              "hanzi": "号",
              "py": "hào",
              "fa": "روز (محاوره‌ای)",
              "ex": "今天五号。",
              "exPy": "Jīntiān wǔ hào.",
              "exFa": "امروز پنجم ماه است."
            },
            {
              "hanzi": "星期",
              "py": "xīngqī",
              "fa": "هفته",
              "ex": "一个星期有七天。",
              "exPy": "Yí gè xīngqī yǒu qī tiān.",
              "exFa": "یک هفته هفت روز دارد."
            },
            {
              "hanzi": "今天",
              "py": "jīntiān",
              "fa": "امروز",
              "ex": "今天星期三。",
              "exPy": "Jīntiān xīngqīsān.",
              "exFa": "امروز چهارشنبه است."
            },
            {
              "hanzi": "明天",
              "py": "míngtiān",
              "fa": "فردا",
              "ex": "明天见！",
              "exPy": "Míngtiān jiàn!",
              "exFa": "فردا می‌بینمت!"
            },
            {
              "hanzi": "昨天",
              "py": "zuótiān",
              "fa": "دیروز",
              "ex": "昨天我很忙。",
              "exPy": "Zuótiān wǒ hěn máng.",
              "exFa": "دیروز خیلی سرم شلوغ بود."
            },
            {
              "hanzi": "生日",
              "py": "shēngrì",
              "fa": "روز تولد / زادروز",
              "ex": "祝你生日快乐！",
              "exPy": "Zhù nǐ shēngrì kuàilè!",
              "exFa": "تولدت مبارک!"
            },
            {
              "hanzi": "快乐",
              "py": "kuàilè",
              "fa": "شادمان / مبارک",
              "ex": "新年快乐！",
              "exPy": "Xīnnián kuàilè!",
              "exFa": "سال نو مبارک!"
            },
            {
              "hanzi": "去",
              "py": "qù",
              "fa": "رفتن",
              "ex": "明天我去学校。",
              "exPy": "Míngtiān wǒ qù xuéxiào.",
              "exFa": "فردا من به مدرسه می‌روم."
            },
            {
              "hanzi": "学校",
              "py": "xuéxiào",
              "fa": "مدرسه / دانشگاه",
              "ex": "我们的学校很大。",
              "exPy": "Wǒmen de xuéxiào hěn dà.",
              "exFa": "دانشگاه ما خیلی بزرگ است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «年» (nián) چیست؟",
                "audio": "nián",
                "hanzi": "年",
                "pinyin": "nián",
                "opts": [
                  "سال",
                  "ماه",
                  "روز (رسمی و نوشتاری)",
                  "روز (محاوره‌ای)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «月» (yuè) چیست؟",
                "audio": "yuè",
                "hanzi": "月",
                "pinyin": "yuè",
                "opts": [
                  "ماه",
                  "سال",
                  "روز (رسمی و نوشتاری)",
                  "روز (محاوره‌ای)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «日» (rì) چیست؟",
                "audio": "rì",
                "hanzi": "日",
                "pinyin": "rì",
                "opts": [
                  "روز (رسمی و نوشتاری)",
                  "سال",
                  "ماه",
                  "روز (محاوره‌ای)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «号» (hào) چیست؟",
                "audio": "hào",
                "hanzi": "号",
                "pinyin": "hào",
                "opts": [
                  "روز (محاوره‌ای)",
                  "سال",
                  "ماه",
                  "روز (رسمی و نوشتاری)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "年",
                    "fa": "سال"
                  },
                  {
                    "zh": "月",
                    "fa": "ماه"
                  },
                  {
                    "zh": "日",
                    "fa": "روز (رسمی و نوشتاری)"
                  },
                  {
                    "zh": "号",
                    "fa": "روز (محاوره‌ای)"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "فرمول تاریخ و روزهای هفته در زبان چینی",
        "intro": {
          "title": "فرمول تاریخ و روزهای هفته در زبان چینی",
          "lead": "۱. ترتیب بیان تاریخ: همیشه از بزرگ به کوچک است: سال + ماه + روز (مثال: 2026年 5月 10号).\n۲. روزهای هفته: کلمه 星期 به علاوه عدد ۱ تا ۶ است (星期一 = دوشنبه تا 星期六 = شنبه)، و یکشنبه 星期天 یا 星期日 است.\n۳. جملات اسمی بدون فعل: در بیان تاریخ نیازی به فعل 是 نیست (مثال: 今天星期三 = امروز چهارشنبه است).",
          "formula": "سال + 年 + ماه + 月 + روز + 号 + روز هفته + 星期...",
          "examples": [
            {
              "zh": "今天几月几号？— 今天九月十号。",
              "py": "Jīntiān jǐ yuè jǐ hào? — Jīntiān jiǔ yuè shí hào.",
              "fa": "امروز چندمه؟ — امروز ۱۰ سپتامبر است."
            },
            {
              "zh": "明天是你的生日吗？— 是的，明天我过生日。",
              "py": "Míngtiān shì nǐ de shēngrì ma? — Shì de, míngtiān wǒ guò shēngrì.",
              "fa": "فردا تولدته؟ — بله، فردا تولدمه."
            },
            {
              "zh": "祝你生日快乐！",
              "py": "Zhù nǐ shēngrì kuàilè!",
              "fa": "تولدت مبارک!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «星期五» (xīngqīwǔ) کدام روز هفته است؟",
                "opts": [
                  "جمعه (روز پنجم تقویم کاری)",
                  "دوشنبه",
                  "چهارشنبه",
                  "یکشنبه"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت تاریخ «امروز ۱۰ اکتبر است» مرتب کنید:",
                "tiles": [
                  "今天",
                  "十月",
                  "十号"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه یادآوری جشن تولد دوست",
        "intro": {
          "title": "مکالمه یادآوری جشن تولد دوست",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "请问，今天几号？",
              "py": "Qǐngwèn, jīntiān jǐ hào?",
              "fa": "ببخشید، امروز چندمه؟"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "今天十月二十号，星期五。",
              "py": "Jīntiān shíyuè èrshí hào, xīngqīwǔ.",
              "fa": "امروز ۲۰ اکتبر، روز جمعه است."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "明天是二十一号，是阿里的生日！",
              "py": "Míngtiān shì èrshíyī hào, shì Ālǐ de shēngrì!",
              "fa": "فردا بیست و یکمه، روز تولد علی است!"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "真的吗？明天晚上我们一起去他家吧！",
              "py": "Zhēn de ma? Míngtiān wǎnshang wǒmen yìqǐ qù tā jiā ba!",
              "fa": "واقعاً؟ فردا شب با هم به خانه‌اش برویم!"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "太好了，我买一个生日蛋糕！",
              "py": "Tài hǎo le, wǒ mǎi yí gè shēngrì dàngāo!",
              "fa": "عالیه، من یک کیک تولد می‌خرم!"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "好的，明天见！",
              "py": "Hǎo de, míngtiān jiàn!",
              "fa": "باشه، فردا می‌بینمت!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "请问，今天几号？ (ببخشید، امروز چندمه؟)",
                  "今天十月二十号，星期五。 (امروز ۲۰ اکتبر، روز جمعه است.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «明天是二十一号，是阿里的生日！» چیست؟",
                "opts": [
                  "真的吗？明天晚上我们一起去他家吧！ (واقعاً؟ فردا شب با هم به خانه‌اش برویم!)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 8",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «星期五» (xīngqīwǔ) کدام روز هفته است؟",
                "opts": [
                  "جمعه (روز پنجم تقویم کاری)",
                  "دوشنبه",
                  "چهارشنبه",
                  "یکشنبه"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت تاریخ «امروز ۱۰ اکتبر است» مرتب کنید:",
                "tiles": [
                  "今天",
                  "十月",
                  "十号"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "اصطلاحات تقویم را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "今天",
                    "fa": "امروز"
                  },
                  {
                    "zh": "明天",
                    "fa": "فردا"
                  },
                  {
                    "zh": "昨天",
                    "fa": "دیروز"
                  },
                  {
                    "zh": "生日",
                    "fa": "روز تولد"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "عبارت مناسب برای گفتن «تولدت مبارک» چیست؟",
                "opts": [
                  "祝你生日快乐！",
                  "新年好！",
                  "再见老师！",
                  "谢谢帮助！"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:8": {
    "id": "hsk1:8",
    "courseId": "hsk1",
    "unitIndex": 8,
    "unitNum": 9,
    "title": "Location & Positions",
    "titleFa": "موقعیت مکانی و اشیاء",
    "titleZh": "电脑在桌子上",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری کلمات مکان و جهت (بالا، پایین، داخل، بیرون)، فعل مکان 在 و پرسیدن آدرس با 哪儿",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 12 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 9",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "在",
              "py": "zài",
              "fa": "بودن در / در (حرف اضافه و فعل)",
              "ex": "我在北京。",
              "exPy": "Wǒ zài Běijīng.",
              "exFa": "من در پکن هستم."
            },
            {
              "hanzi": "哪儿",
              "py": "nǎr",
              "fa": "کجا؟",
              "ex": "你在哪儿？",
              "exPy": "Nǐ zài nǎr?",
              "exFa": "کجایی؟"
            },
            {
              "hanzi": "上",
              "py": "shang",
              "fa": "روی / بالا",
              "ex": "桌子上有一本书。",
              "exPy": "Zhuōzi shang yǒu yì běn shū.",
              "exFa": "روی میز یک کتاب است."
            },
            {
              "hanzi": "下",
              "py": "xià",
              "fa": "زیر / پایین",
              "ex": "椅子下面有一只猫。",
              "exPy": "Yǐzi xiàmiàn yǒu yì zhī māo.",
              "exFa": "زیر صندلی یک گربه است."
            },
            {
              "hanzi": "里",
              "py": "lǐ",
              "fa": "داخل / درون",
              "ex": "学校里有很多学生。",
              "exPy": "Xuéxiào lǐ yǒu hěn duō xuésheng.",
              "exFa": "داخل دانشگاه دانشجویان زیادی هستند."
            },
            {
              "hanzi": "外",
              "py": "wài",
              "fa": "بیرون / خارج",
              "ex": "外面下雨了。",
              "exPy": "Wàimiàn xià yǔ le.",
              "exFa": "بیرون باران می‌بارد."
            },
            {
              "hanzi": "前",
              "py": "qián",
              "fa": "جلو / پیش رو",
              "ex": "我家前面是公园。",
              "exPy": "Wǒ jiā qiánmiàn shì gōngyuán.",
              "exFa": "جلوی خانه من پارک است."
            },
            {
              "hanzi": "后",
              "py": "hòu",
              "fa": "پشت سر / عقب",
              "ex": "图书馆在教学楼后面。",
              "exPy": "Túshūguǎn zài jiàoxuélóu hòumiàn.",
              "exFa": "کتابخانه پشت ساختمان آموزش است."
            },
            {
              "hanzi": "桌子",
              "py": "zhuōzi",
              "fa": "میز",
              "ex": "这是一张新桌子。",
              "exPy": "Zhè shì yì zhāng xīn zhuōzi.",
              "exFa": "این یک میز نو است."
            },
            {
              "hanzi": "椅子",
              "py": "yǐzi",
              "fa": "صندلی",
              "ex": "请坐椅子上。",
              "exPy": "Qǐng zuò yǐzi shang.",
              "exFa": "لطفاً روی صندلی بنشینید."
            },
            {
              "hanzi": "书",
              "py": "shū",
              "fa": "کتاب",
              "ex": "我看中文书。",
              "exPy": "Wǒ kàn zhōngwén shū.",
              "exFa": "من کتاب چینی می‌خوانم."
            },
            {
              "hanzi": "找",
              "py": "zhǎo",
              "fa": "جستجو کردن / دنبال گشتن",
              "ex": "你在找什么？",
              "exPy": "Nǐ zài zhǎo shénme?",
              "exFa": "دنبال چی می‌گردی؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «在» (zài) چیست؟",
                "audio": "zài",
                "hanzi": "在",
                "pinyin": "zài",
                "opts": [
                  "بودن در / در (حرف اضافه و فعل)",
                  "کجا؟",
                  "روی / بالا",
                  "زیر / پایین"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «哪儿» (nǎr) چیست؟",
                "audio": "nǎr",
                "hanzi": "哪儿",
                "pinyin": "nǎr",
                "opts": [
                  "کجا؟",
                  "بودن در / در (حرف اضافه و فعل)",
                  "روی / بالا",
                  "زیر / پایین"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «上» (shang) چیست؟",
                "audio": "shang",
                "hanzi": "上",
                "pinyin": "shang",
                "opts": [
                  "روی / بالا",
                  "بودن در / در (حرف اضافه و فعل)",
                  "کجا؟",
                  "زیر / پایین"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «下» (xià) چیست؟",
                "audio": "xià",
                "hanzi": "下",
                "pinyin": "xià",
                "opts": [
                  "زیر / پایین",
                  "بودن در / در (حرف اضافه و فعل)",
                  "کجا؟",
                  "روی / بالا"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "在",
                    "fa": "بودن در"
                  },
                  {
                    "zh": "哪儿",
                    "fa": "کجا؟"
                  },
                  {
                    "zh": "上",
                    "fa": "روی"
                  },
                  {
                    "zh": "下",
                    "fa": "زیر"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "بیان موقعیت با 在 و کلمات جهت‌نما",
        "intro": {
          "title": "بیان موقعیت با 在 و کلمات جهت‌نما",
          "lead": "۱. ساختار قرارگیری شیء: شیء + 在 + مکان + جهت (مثال: 电脑在桌子上 = کامپیوتر روی میز است).\n۲. پرسش موقعیت: شیء + 在哪儿？ (مثال: 你的书在哪儿？ = کتابت کجاست؟).",
          "formula": "شیء + 在 + مکان + (上 / 下 / 里 / 前 / 后)",
          "examples": [
            {
              "zh": "我的手机在哪儿？— 在桌子上。",
              "py": "Wǒ de shǒujī zài nǎr? — Zài zhuōzi shang.",
              "fa": "گوشی من کجاست؟ — روی میز است."
            },
            {
              "zh": "猫在椅子下面睡觉。",
              "py": "Māo zài yǐzi xiàmiàn shuìjiào.",
              "fa": "گربه زیر صندلی خوابیده است."
            },
            {
              "zh": "你在哪儿工作？— 我在医院工作。",
              "py": "Nǐ zài nǎr gōngzuò? — Wǒ zài yīyuàn gōngzuò.",
              "fa": "کجا کار می‌کنی؟ — در بیمارستان کار می‌کنم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «电脑在桌子上» چیست؟",
                "opts": [
                  "کامپیوتر روی میز است.",
                  "میز کنار کامپیوتر است.",
                  "کامپیوتر زیر صندلی است.",
                  "میز داخل اتاق است."
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «گربه زیر صندلی است» مرتب کنید:",
                "tiles": [
                  "猫",
                  "在",
                  "椅子下面"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه پیدا کردن کلید و لپ‌تاپ در اتاق کار",
        "intro": {
          "title": "مکالمه پیدا کردن کلید و لپ‌تاپ در اتاق کار",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "李强，你在找什么呢？",
              "py": "Lǐ Qiáng, nǐ zài zhǎo shénme ne?",
              "fa": "لی چانگ، دنبال چی داری می‌گردی؟"
            },
            {
              "role": "B",
              "speaker": "لی چانگ",
              "zh": "我在找我的钥匙和汉语书。",
              "py": "Wǒ zài zhǎo wǒ de yàoshi hé Hànyǔ shū.",
              "fa": "دارم دنبال کلیدم و کتاب چینی‌ام می‌گردم."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "看，书在电脑旁边，桌子上呢！",
              "py": "Kàn, shū zài diànnǎo pángbiān, zhuōzi shang ne!",
              "fa": "ببین، کتاب کنار کامپیوتره، روی میزه!"
            },
            {
              "role": "B",
              "speaker": "لی چانگ",
              "zh": "那我的钥匙在哪儿？",
              "py": "Nà wǒ de yàoshi zài nǎr?",
              "fa": "پس کلیدم کجاست؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "在椅子下面，快拿起来吧！",
              "py": "Zài yǐzi xiàmiàn, kuài ná qǐlái ba!",
              "fa": "زیر صندلیه، زودی برش دار!"
            },
            {
              "role": "B",
              "speaker": "لی چانگ",
              "zh": "太谢谢你了！",
              "py": "Tài xièxie nǐ le!",
              "fa": "خیلی ازت متشکرم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "李强，你在找什么呢？ (لی چانگ، دنبال چی داری می‌گردی؟)",
                  "我在找我的钥匙和汉语书。 (دارم دنبال کلیدم و کتاب چینی‌ام می‌گردم.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «看，书在电脑旁边，桌子上呢！» چیست؟",
                "opts": [
                  "那我的钥匙在哪儿？ (پس کلیدم کجاست؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 9",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «电脑在桌子上» چیست؟",
                "opts": [
                  "کامپیوتر روی میز است.",
                  "میز کنار کامپیوتر است.",
                  "کامپیوتر زیر صندلی است.",
                  "میز داخل اتاق است."
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «گربه زیر صندلی است» مرتب کنید:",
                "tiles": [
                  "猫",
                  "在",
                  "椅子下面"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "جهات را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "上",
                    "fa": "بالا / روی"
                  },
                  {
                    "zh": "下",
                    "fa": "پایین / زیر"
                  },
                  {
                    "zh": "里",
                    "fa": "داخل"
                  },
                  {
                    "zh": "前面",
                    "fa": "جلو"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "برای پرسیدن «تو کجایی؟» کدام جمله درست است؟",
                "opts": [
                  "你在哪儿？",
                  "你是谁？",
                  "你叫什么？",
                  "你有什么？"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:9": {
    "id": "hsk1:9",
    "courseId": "hsk1",
    "unitIndex": 9,
    "unitNum": 10,
    "title": "Transportation & Metro",
    "titleFa": "حمل‌ونقل عمومی و مترو",
    "titleZh": "坐地铁去学校",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری وسایل نقلیه شهری (مترو، اتوبوس، تاکسی)، پرسش نحوه رفتن با 怎么去 و ایستگاه",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 10",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "坐",
              "py": "zuò",
              "fa": "سوار شدن / نشستن",
              "ex": "我坐地铁上班。",
              "exPy": "Wǒ zuò dìtiě shàngbān.",
              "exFa": "من با مترو سر کار می‌روم."
            },
            {
              "hanzi": "地铁",
              "py": "dìtiě",
              "fa": "مترو / قطار شهری",
              "ex": "北京地铁很方便。",
              "exPy": "Běijīng dìtiě hěn fāngbiàn.",
              "exFa": "متروی پکن خیلی راحت و سریع است."
            },
            {
              "hanzi": "公交车",
              "py": "gōngjiāochē",
              "fa": "اتوبوس شهری",
              "ex": "坐公交车去公园。",
              "exPy": "Zuò gōngjiāochē qù gōngyuán.",
              "exFa": "با اتوبوس به پارک می‌رویم."
            },
            {
              "hanzi": "出租车",
              "py": "chūzūchē",
              "fa": "تاکسی",
              "ex": "打出租车回家。",
              "exPy": "Dǎ chūzūchē huí jiā.",
              "exFa": "تاکسی گرفتن برای برگشت به خانه."
            },
            {
              "hanzi": "走",
              "py": "zǒu",
              "fa": "راه رفتن / پیاده رفتن",
              "ex": "往前走一百米。",
              "exPy": "Wǎng qián zǒu yìbǎi mǐ.",
              "exFa": "صد متر رو به جلو پیاده بروید."
            },
            {
              "hanzi": "站",
              "py": "zhàn",
              "fa": "ایستگاه",
              "ex": "下一站是北京大学。",
              "exPy": "Xià yí zhàn shì Běijīng Dàxué.",
              "exFa": "ایستگاه بعدی دانشگاه پکن است."
            },
            {
              "hanzi": "怎么",
              "py": "zěnme",
              "fa": "چگونه / چطور؟",
              "ex": "请问去地铁站怎么走？",
              "exPy": "Qǐngwèn qù dìtiězhàn zěnme zǒu?",
              "exFa": "ببخشید، چطور بروم ایستگاه مترو؟"
            },
            {
              "hanzi": "远",
              "py": "yuǎn",
              "fa": "دور",
              "ex": "我家离学校不远。",
              "exPy": "Wǒ jiā lí xuéxiào bù yuǎn.",
              "exFa": "خانه‌ام از مدرسه دور نیست."
            },
            {
              "hanzi": "近",
              "py": "jìn",
              "fa": "نزدیک",
              "ex": "超市很近。",
              "exPy": "Chāoshì hěn jìn.",
              "exFa": "سوپرمارکت خیلی نزدیک است."
            },
            {
              "hanzi": "开车",
              "py": "kāi chē",
              "fa": "رانندگی کردن",
              "ex": "爸爸会开车。",
              "exPy": "Bàba huì kāichē.",
              "exFa": "پدرم رانندگی بلد است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «坐» (zuò) چیست؟",
                "audio": "zuò",
                "hanzi": "坐",
                "pinyin": "zuò",
                "opts": [
                  "سوار شدن / نشستن",
                  "مترو / قطار شهری",
                  "اتوبوس شهری",
                  "تاکسی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «地铁» (dìtiě) چیست؟",
                "audio": "dìtiě",
                "hanzi": "地铁",
                "pinyin": "dìtiě",
                "opts": [
                  "مترو / قطار شهری",
                  "سوار شدن / نشستن",
                  "اتوبوس شهری",
                  "تاکسی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «公交车» (gōngjiāochē) چیست؟",
                "audio": "gōngjiāochē",
                "hanzi": "公交车",
                "pinyin": "gōngjiāochē",
                "opts": [
                  "اتوبوس شهری",
                  "سوار شدن / نشستن",
                  "مترو / قطار شهری",
                  "تاکسی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «出租车» (chūzūchē) چیست؟",
                "audio": "chūzūchē",
                "hanzi": "出租车",
                "pinyin": "chūzūchē",
                "opts": [
                  "تاکسی",
                  "سوار شدن / نشستن",
                  "مترو / قطار شهری",
                  "اتوبوس شهری"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "坐",
                    "fa": "سوار شدن"
                  },
                  {
                    "zh": "地铁",
                    "fa": "مترو"
                  },
                  {
                    "zh": "公交车",
                    "fa": "اتوبوس شهری"
                  },
                  {
                    "zh": "出租车",
                    "fa": "تاکسی"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "فرمول بیان نحوه سفر و رفت‌وآمد با 坐",
        "intro": {
          "title": "فرمول بیان نحوه سفر و رفت‌وآمد با 坐",
          "lead": "۱. نحوه سفر: فاعل + 坐 + وسیله نقلیه + 去 / 到 + مقصد (مثال: 我坐地铁去学校 = من با مترو به مدرسه می‌روم).\n۲. پرسش مسیر: مقصد + 怎么走？ (مثال: 去火车站怎么走？ = چطور به ایستگاه قطار بروم؟).",
          "formula": "坐 + وسیله نقلیه + 去 + مکان | مکان + 怎么走？",
          "examples": [
            {
              "zh": "你去学校怎么走？— 我坐地铁去。",
              "py": "Nǐ qù xuéxiào zěnme zǒu? — Wǒ zuò dìtiě qù.",
              "fa": "چطور به دانشگاه می‌روی؟ — با مترو می‌روم."
            },
            {
              "zh": "地铁站离这里很近，走五分钟。",
              "py": "Dìtiězhàn lí zhèlǐ hěn jìn, zǒu wǔ fēnzhōng.",
              "fa": "ایستگاه مترو خیلی نزدیک است، ۵ دقیقه پیاده راه است."
            },
            {
              "zh": "我们打出租车吧！",
              "py": "Wǒmen dǎ chūzūchē ba!",
              "fa": "بیایید تاکسی بگیریم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "کلمه «地铁» (dìtiě) به چه معناست؟",
                "opts": [
                  "مترو / قطار زیرزمینی",
                  "اتوبوس",
                  "تاکسی",
                  "فرودگاه"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من با اتوبوس سر کار می‌روم» مرتب کنید:",
                "tiles": [
                  "我",
                  "坐公交车",
                  "去上班"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه پرسیدن آدرس ایستگاه مترو در خیابان",
        "intro": {
          "title": "مکالمه پرسیدن آدرس ایستگاه مترو در خیابان",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "你好，请问去地铁站怎么走？",
              "py": "Nǐ hǎo, qǐngwèn qù dìtiězhàn zěnme zǒu?",
              "fa": "سلام، ببخشید چطور می‌توانم به ایستگاه مترو بروم؟"
            },
            {
              "role": "B",
              "speaker": "عابر پیاده",
              "zh": "一直往前走，在前面右转就是。",
              "py": "Yìzhí wǎng qián zǒu, zài qiánmiàn yòuzhuǎn jiù shì.",
              "fa": "مستقیم به جلو بروید، جلوتر بپیچید سمت راست، همونجاست."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "走路远不远？",
              "py": "Zǒulù yuǎn bu yuǎn?",
              "fa": "پیاده دور است؟"
            },
            {
              "role": "B",
              "speaker": "عابر پیاده",
              "zh": "不远，很近，大概三分钟。",
              "py": "Bù yuǎn, hěn jìn, dàgài sān fēnzhōng.",
              "fa": "دور نیست، خیلی نزدیکه، حدود ۳ دقیقه."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "太感谢您了！",
              "py": "Tài gǎnxiè nín le!",
              "fa": "بسیار از شما متشکرم!"
            },
            {
              "role": "B",
              "speaker": "عابر پیاده",
              "zh": "不客气！",
              "py": "Bú kèqi!",
              "fa": "خواهش می‌کنم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "你好，请问去地铁站怎么走？ (سلام، ببخشید چطور می‌توانم به ایستگاه مترو بروم؟)",
                  "一直往前走，在前面右转就是。 (مستقیم به جلو بروید، جلوتر بپیچید سمت راست، همونجاست.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «走路远不远？» چیست؟",
                "opts": [
                  "不远，很近，大概三分钟。 (دور نیست، خیلی نزدیکه، حدود ۳ دقیقه.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 10",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "کلمه «地铁» (dìtiě) به چه معناست؟",
                "opts": [
                  "مترو / قطار زیرزمینی",
                  "اتوبوس",
                  "تاکسی",
                  "فرودگاه"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من با اتوبوس سر کار می‌روم» مرتب کنید:",
                "tiles": [
                  "我",
                  "坐公交车",
                  "去上班"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "وسایل حمل‌ونقل را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "地铁",
                    "fa": "مترو"
                  },
                  {
                    "zh": "公交车",
                    "fa": "اتوبوس"
                  },
                  {
                    "zh": "出租车",
                    "fa": "تاکسی"
                  },
                  {
                    "zh": "开车",
                    "fa": "رانندگی"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "برای پرسیدن «ایستگاه قطار چطور باید بروم؟» کدام جمله درست است؟",
                "opts": [
                  "去火车站怎么走？",
                  "你在哪儿火车站？",
                  "火车站多少钱？",
                  "火车站几点？"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:10": {
    "id": "hsk1:10",
    "courseId": "hsk1",
    "unitIndex": 10,
    "unitNum": 11,
    "title": "Weather & Seasons",
    "titleFa": "آب‌وهوا، فصل‌ها و لباس",
    "titleZh": "今天天气很冷，多穿衣服",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری وضعیت آب‌وهوا (باران، برف، سرما، گرما)، فصل‌های سال، پوشیدن لباس و توصیه دوستانه",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 11",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "天气",
              "py": "tiānqì",
              "fa": "آب‌وهوا",
              "ex": "今天天气怎么样？",
              "exPy": "Jīntiān tiānqì zěnmeyàng?",
              "exFa": "هوای امروز چطوره؟"
            },
            {
              "hanzi": "冷",
              "py": "lěng",
              "fa": "سرد",
              "ex": "北京的冬天很冷。",
              "exPy": "Běijīng de dōngtiān hěn lěng.",
              "exFa": "زمستان پکن خیلی سرد است."
            },
            {
              "hanzi": "热",
              "py": "rè",
              "fa": "گرم / داغ",
              "ex": "夏天太热了。",
              "exPy": "Xiàtiān tài rè le.",
              "exFa": "تابستان بیش از حد گرم است."
            },
            {
              "hanzi": "下雨",
              "py": "xià yǔ",
              "fa": "باران باریدن",
              "ex": "明天会下雨吗？",
              "exPy": "Míngtiān huì xià yǔ ma?",
              "exFa": "فردا باران خواهد بارید؟"
            },
            {
              "hanzi": "下雪",
              "py": "xià xuě",
              "fa": "برف باریدن",
              "ex": "外面下雪了，真美！",
              "exPy": "Wàimiàn xià xuě le, zhēn měi!",
              "exFa": "بیرون برف باریده، چقدر زیباست!"
            },
            {
              "hanzi": "风",
              "py": "fēng",
              "fa": "باد",
              "ex": "今天风很大。",
              "exPy": "Jīntiān fēng hěn dà.",
              "exFa": "امروز باد شدیدی می‌وزد."
            },
            {
              "hanzi": "衣服",
              "py": "yīfu",
              "fa": "لباس / پوشاک",
              "ex": "我想买新衣服。",
              "exPy": "Wǒ xiǎng mǎi xīn yīfu.",
              "exFa": "می‌خواهم لباس نو بخرم."
            },
            {
              "hanzi": "穿",
              "py": "chuān",
              "fa": "پوشیدن / به تن کردن",
              "ex": "多穿点儿衣服。",
              "exPy": "Duō chuān diǎnr yīfu.",
              "exFa": "لباس بیشتری بپوش."
            },
            {
              "hanzi": "件",
              "py": "jiàn",
              "fa": "واحد شمارش لباس و کار",
              "ex": "一件大衣。",
              "exPy": "Yí jiàn dàyī.",
              "exFa": "یک پالتو."
            },
            {
              "hanzi": "春",
              "py": "chūn",
              "fa": "بهار",
              "ex": "春天很暖和。",
              "exPy": "Chūntiān hěn nuǎnhuo.",
              "exFa": "بهار هوا معتدل و مطبوع است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «天气» (tiānqì) چیست؟",
                "audio": "tiānqì",
                "hanzi": "天气",
                "pinyin": "tiānqì",
                "opts": [
                  "آب‌وهوا",
                  "سرد",
                  "گرم / داغ",
                  "باران باریدن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «冷» (lěng) چیست؟",
                "audio": "lěng",
                "hanzi": "冷",
                "pinyin": "lěng",
                "opts": [
                  "سرد",
                  "آب‌وهوا",
                  "گرم / داغ",
                  "باران باریدن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «热» (rè) چیست؟",
                "audio": "rè",
                "hanzi": "热",
                "pinyin": "rè",
                "opts": [
                  "گرم / داغ",
                  "آب‌وهوا",
                  "سرد",
                  "باران باریدن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «下雨» (xià yǔ) چیست؟",
                "audio": "xià yǔ",
                "hanzi": "下雨",
                "pinyin": "xià yǔ",
                "opts": [
                  "باران باریدن",
                  "آب‌وهوا",
                  "سرد",
                  "گرم / داغ"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "天气",
                    "fa": "آب‌وهوا"
                  },
                  {
                    "zh": "冷",
                    "fa": "سرد"
                  },
                  {
                    "zh": "热",
                    "fa": "گرم"
                  },
                  {
                    "zh": "下雨",
                    "fa": "باران باریدن"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "پرسش از وضعیت با 怎么样 و توصیه با 多 / 少",
        "intro": {
          "title": "پرسش از وضعیت با 怎么样 و توصیه با 多 / 少",
          "lead": "۱. پرسش وضعیت: اسم + 怎么样？ (مثال: 天气怎么样？ = هوا چطوره؟).\n۲. توصیه به انجام بیشتر کاری: 多 + فعل (مثال: 多穿衣服 = بیشتر لباس بپوش / 多喝水 = بیشتر آب بنوش).",
          "formula": "موضوع + 怎么样？ | 多 / 少 + فعل",
          "examples": [
            {
              "zh": "明天天气怎么样？— 明天很冷，会下雪。",
              "py": "Míngtiān tiānqì zěnmeyàng? — Míngtiān hěn lěng, huì xià xuě.",
              "fa": "هوای فردا چطوره؟ — فردا خیلی سرده، برف خواهد بارید."
            },
            {
              "zh": "外面冷，多穿一件衣服吧。",
              "py": "Wàimiàn lěng, duō chuān yí jiàn yīfu ba.",
              "fa": "بیرون سرده، یک لباس بیشتر به تن کن."
            },
            {
              "zh": "太热了，我想喝冰水。",
              "py": "Tài rè le, wǒ xiǎng hē bīng shuǐ.",
              "fa": "خیلی گرمه، آب یخ می‌خواهم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «下雨» (xià yǔ) چیست؟",
                "opts": [
                  "باران باریدن",
                  "برف باریدن",
                  "وزیدن باد",
                  "آفتابی بودن"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «هوای امروز خیلی سرد است» مرتب کنید:",
                "tiles": [
                  "今天",
                  "天气",
                  "很冷"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه قبل از خروج از خوابگاه در روز زمستانی",
        "intro": {
          "title": "مکالمه قبل از خروج از خوابگاه در روز زمستانی",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "علی",
              "zh": "你出门吗？外面天气怎么样？",
              "py": "Nǐ chū mén ma? Wàimiàn tiānqì zěnmeyàng?",
              "fa": "داری می‌ری بیرون؟ هوای بیرون چطوره؟"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "今天天气非常冷，风很大！",
              "py": "Jīntiān tiānqì fēicháng lěng, fēng hěn dà!",
              "fa": "امروز هوا فوق‌العاده سرده، باد شدیدی هم میاد!"
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "会下雪吗？",
              "py": "Huì xià xuě ma?",
              "fa": "برف هم می‌باره؟"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "下午可能会下雪。你穿得太少了！",
              "py": "Xiàwǔ kěnéng huì xià xuě. Nǐ chuān de tài shǎo le!",
              "fa": "عصر احتمالاً برف بیاد. خیلی کم لباس پوشیدی!"
            },
            {
              "role": "A",
              "speaker": "علی",
              "zh": "好的，我回去多穿一件羽绒服。",
              "py": "Hǎo de, wǒ huíqù duō chuān yí jiàn yǔróngfú.",
              "fa": "باشه، برمی‌گردم یک کاپشن پر به تن کنم."
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "带上雨伞吧，路上小心！",
              "py": "Dài shang yǔsǎn ba, lùshang xiǎoxīn!",
              "fa": "چترت هم با خودت ببر، مراقب باش!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (علی) چه می‌گوید؟",
                "opts": [
                  "你出门吗？外面天气怎么样？ (داری می‌ری بیرون؟ هوای بیرون چطوره؟)",
                  "今天天气非常冷，风很大！ (امروز هوا فوق‌العاده سرده، باد شدیدی هم میاد!)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «会下雪吗？» چیست؟",
                "opts": [
                  "下午可能会下雪。你穿得太少了！ (عصر احتمالاً برف بیاد. خیلی کم لباس پوشیدی!)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 11",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی «下雨» (xià yǔ) چیست؟",
                "opts": [
                  "باران باریدن",
                  "برف باریدن",
                  "وزیدن باد",
                  "آفتابی بودن"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «هوای امروز خیلی سرد است» مرتب کنید:",
                "tiles": [
                  "今天",
                  "天气",
                  "很冷"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "کلمات آب‌وهوا را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "冷",
                    "fa": "سرد"
                  },
                  {
                    "zh": "热",
                    "fa": "گرم"
                  },
                  {
                    "zh": "天气",
                    "fa": "آب‌وهوا"
                  },
                  {
                    "zh": "衣服",
                    "fa": "لباس"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام واحد شمارش برای پیراهن و لباس (衣服) استفاده می‌شود؟",
                "opts": [
                  "件 (jiàn)",
                  "个 (gè)",
                  "本 (běn)",
                  "张 (zhāng)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:11": {
    "id": "hsk1:11",
    "courseId": "hsk1",
    "unitIndex": 11,
    "unitNum": 12,
    "title": "Health & Seeing a Doctor",
    "titleFa": "سلامت، احساس بیماری و پزشک",
    "titleZh": "我有点儿不舒服",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری اصطلاحات پزشکی پایه، ابراز درد و سرماخوردگی، مراجعه به درمانگاه و استراحت",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 12",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "身体",
              "py": "shēntǐ",
              "fa": "بدن / تندرستی / سلامت",
              "ex": "最近身体好吗？",
              "exPy": "Zuìjìn shēntǐ hǎo ma?",
              "exFa": "اخیراً حالت چطوره؟ بدنت روبه‌راهه؟"
            },
            {
              "hanzi": "生病",
              "py": "shēng bìng",
              "fa": "بیمار شدن",
              "ex": "他生病住院了。",
              "exPy": "Tā shēngbìng zhùyuàn le.",
              "exFa": "او مریض شد و در بیمارستان بستری است."
            },
            {
              "hanzi": "感冒",
              "py": "gǎnmào",
              "fa": "سرماخوردگی / سرما خوردن",
              "ex": "我感冒了，咳嗽。",
              "exPy": "Wǒ gǎnmào le, késou.",
              "exFa": "من سرما خوردم و سرفه می‌کنم."
            },
            {
              "hanzi": "发烧",
              "py": "fā shāo",
              "fa": "تب داشتن",
              "ex": "孩子发烧三十八度。",
              "exPy": "Háizi fāshāo sānshíbā dù.",
              "exFa": "بچه ۳۸ درجه تب دارد."
            },
            {
              "hanzi": "疼",
              "py": "téng",
              "fa": "درد داشتن / دردناک",
              "ex": "我头疼，肚子也疼。",
              "exPy": "Wǒ tóuténg, dùzi yě téng.",
              "exFa": "سرم درد می‌کند، دلم هم درد دارد."
            },
            {
              "hanzi": "医院",
              "py": "yīyuàn",
              "fa": "بیمارستان / درمانگاه",
              "ex": "去医院看医生。",
              "exPy": "Qù yīyuàn kàn yīshēng.",
              "exFa": "رفتن به بیمارستان برای ویزیت پزشک."
            },
            {
              "hanzi": "医生",
              "py": "yīshēng",
              "fa": "پزشک / دکتر",
              "ex": "李医生很有名。",
              "exPy": "Lǐ yīshēng hěn yǒumíng.",
              "exFa": "دکتر لی خیلی معروف است."
            },
            {
              "hanzi": "药",
              "py": "yào",
              "fa": "دارو / قرص",
              "ex": "按时吃药。",
              "exPy": "Ànshí chī yào.",
              "exFa": "به موقع دارو بخورید."
            },
            {
              "hanzi": "休息",
              "py": "xiūxi",
              "fa": "استراحت کردن",
              "ex": "多喝水，多休息。",
              "exPy": "Duō hē shuǐ, duō xiūxi.",
              "exFa": "آب فراوان بنوشید و خوب استراحت کنید."
            },
            {
              "hanzi": "有点儿",
              "py": "yǒudiǎnr",
              "fa": "کمی / یه خرده (احساس ناخوشایند)",
              "ex": "我今天有点儿累。",
              "exPy": "Wǒ jīntiān yǒudiǎnr lèi.",
              "exFa": "من امروز یه خرده احساس خستگی می‌کنم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «身体» (shēntǐ) چیست؟",
                "audio": "shēntǐ",
                "hanzi": "身体",
                "pinyin": "shēntǐ",
                "opts": [
                  "بدن / تندرستی / سلامت",
                  "بیمار شدن",
                  "سرماخوردگی / سرما خوردن",
                  "تب داشتن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «生病» (shēng bìng) چیست؟",
                "audio": "shēng bìng",
                "hanzi": "生病",
                "pinyin": "shēng bìng",
                "opts": [
                  "بیمار شدن",
                  "بدن / تندرستی / سلامت",
                  "سرماخوردگی / سرما خوردن",
                  "تب داشتن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «感冒» (gǎnmào) چیست؟",
                "audio": "gǎnmào",
                "hanzi": "感冒",
                "pinyin": "gǎnmào",
                "opts": [
                  "سرماخوردگی / سرما خوردن",
                  "بدن / تندرستی / سلامت",
                  "بیمار شدن",
                  "تب داشتن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «发烧» (fā shāo) چیست؟",
                "audio": "fā shāo",
                "hanzi": "发烧",
                "pinyin": "fā shāo",
                "opts": [
                  "تب داشتن",
                  "بدن / تندرستی / سلامت",
                  "بیمار شدن",
                  "سرماخوردگی / سرما خوردن"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "身体",
                    "fa": "بدن"
                  },
                  {
                    "zh": "生病",
                    "fa": "بیمار شدن"
                  },
                  {
                    "zh": "感冒",
                    "fa": "سرماخوردگی"
                  },
                  {
                    "zh": "发烧",
                    "fa": "تب داشتن"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "بیان حس ناخوشایند با 有点儿 و مصرف دارو با 吃药",
        "intro": {
          "title": "بیان حس ناخوشایند با 有点儿 و مصرف دارو با 吃药",
          "lead": "۱. قید منفی یا ناخوشایند: 有点儿 + صفت (مثال: 有点儿疼 = یک ذره درد دارد / 有点儿冷 = کمی سرد است).\n۲. در زبان چینی برای «خوردن قرص و دارو» از فعل 吃 (خوردن) استفاده می‌شود نه 喝 (نوشیدن): 吃药 = دارو خوردن.",
          "formula": "فاعل + 有点儿 + صفت | 吃 + 药",
          "examples": [
            {
              "zh": "你怎么了？— 我有点儿头疼，发烧了。",
              "py": "Nǐ zěnme le? — Wǒ yǒudiǎnr tóuténg, fāshāo le.",
              "fa": "چت شده؟ — کمی سردرد دارم و تب کردم."
            },
            {
              "zh": "你生病了，快去医院看病吧。",
              "py": "Nǐ shēngbìng le, kuài qù yīyuàn kànbìng ba.",
              "fa": "مریض شدی، زودی برو درمانگاه دکتر ببیندت."
            },
            {
              "zh": "吃了药，好好睡一觉。",
              "py": "Chī le yào, hǎohāo shuì yí jiào.",
              "fa": "دارو خوردی، خوب و حسابی بخواب."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "در زبان چینی عبارت صحیح برای «دارو مصرف کردن» چیست؟",
                "opts": [
                  "吃药 (chī yào)",
                  "喝药 (hē yào)",
                  "买药 (mǎi yào)",
                  "看药 (kàn yào)"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من امروز کمی سردرد دارم» مرتب کنید:",
                "tiles": [
                  "我今天",
                  "有点儿",
                  "头疼"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در درمانگاه دانشگاه بین بیمار و پزشک",
        "intro": {
          "title": "مکالمه در درمانگاه دانشگاه بین بیمار و پزشک",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "پزشک",
              "zh": "你好，请坐。哪里不舒服？",
              "py": "Nǐ hǎo, qǐng zuò. Nǎlǐ bù shūfu?",
              "fa": "سلام، بفرمایید بنشینید. کجایتان ناراحت است؟"
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "医生，我头疼，嗓子也疼，有点儿发烧。",
              "py": "Yīshēng, wǒ tóuténg, sǎngzi yě téng, yǒudiǎnr fāshāo.",
              "fa": "آقای دکتر، سرم درد می‌کند، گلویم هم می‌سوزد و کمی تب دارم."
            },
            {
              "role": "A",
              "speaker": "پزشک",
              "zh": "量一下体温……三十八度二，感冒了。",
              "py": "Liáng yíxià tǐwēn... sānshíbā dù èr, gǎnmào le.",
              "fa": "تب را اندازه بگیریم... ۳۸.۲ درجه، سرما خورده‌اید."
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "需要打针吗？",
              "py": "Xūyào dǎzhēn ma?",
              "fa": "نیاز به آمپول زدن هست؟"
            },
            {
              "role": "A",
              "speaker": "پزشک",
              "zh": "不用打针。这是药，一天吃三次，多喝热水。",
              "py": "Bú yòng dǎzhēn. Zhè shì yào, yì tiān chī sān cì, duō hē rè shuǐ.",
              "fa": "آمپول لازم نیست. این داروست، روزی ۳ بار مصرف کنید و آب گرم زیاد بنوشید."
            },
            {
              "role": "B",
              "speaker": "سارا",
              "zh": "好的，谢谢医生！",
              "py": "Hǎo de, xièxie yīshēng!",
              "fa": "چشم، خیلی ممنون آقای دکتر!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (پزشک) چه می‌گوید؟",
                "opts": [
                  "你好，请坐。哪里不舒服？ (سلام، بفرمایید بنشینید. کجایتان ناراحت است؟)",
                  "医生，我头疼，嗓子也疼，有点儿发烧。 (آقای دکتر، سرم درد می‌کند، گلویم هم می‌سوزد و کمی تب دارم.)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «量一下体温……三十八度二，感冒了。» چیست؟",
                "opts": [
                  "需要打针吗？ (نیاز به آمپول زدن هست؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 12",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "در زبان چینی عبارت صحیح برای «دارو مصرف کردن» چیست؟",
                "opts": [
                  "吃药 (chī yào)",
                  "喝药 (hē yào)",
                  "买药 (mǎi yào)",
                  "看药 (kàn yào)"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من امروز کمی سردرد دارم» مرتب کنید:",
                "tiles": [
                  "我今天",
                  "有点儿",
                  "头疼"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "اصطلاحات پزشکی را وصل کنید:",
                "pairs": [
                  {
                    "zh": "生病",
                    "fa": "بیمار شدن"
                  },
                  {
                    "zh": "发烧",
                    "fa": "تب داشتن"
                  },
                  {
                    "zh": "医院",
                    "fa": "بیمارستان"
                  },
                  {
                    "zh": "医生",
                    "fa": "پزشک"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "معنی واژه «休息» (xiūxi) چیست؟",
                "opts": [
                  "استراحت کردن",
                  "کار کردن",
                  "ورزش کردن",
                  "کتاب خواندن"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:12": {
    "id": "hsk1:12",
    "courseId": "hsk1",
    "unitIndex": 12,
    "unitNum": 13,
    "title": "Home, Rooms & Living",
    "titleFa": "خانه، اتاق و وسایل زندگی",
    "titleZh": "我的新房间很干净",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "توصیف محل سکونت و آپارتمان، اثاثیه اتاق (تخت، در، پنجره) و صفت‌های نظافت و زیبایی",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 13",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "房子",
              "py": "fángzi",
              "fa": "خانه / آپارتمان",
              "ex": "我租了一套新房子。",
              "exPy": "Wǒ zū le yí tào xīn fángzi.",
              "exFa": "من یک آپارتمان نو اجاره کردم."
            },
            {
              "hanzi": "房间",
              "py": "fángjiān",
              "fa": "اتاق",
              "ex": "我的房间很大很亮。",
              "exPy": "Wǒ de fángjiān hěn dà hěn liàng.",
              "exFa": "اتاق من خیلی بزرگ و پرنور است."
            },
            {
              "hanzi": "门",
              "py": "mén",
              "fa": "در / ورودی",
              "ex": "请开门。",
              "exPy": "Qǐng kāi mén.",
              "exFa": "لطفاً در را باز کنید."
            },
            {
              "hanzi": "窗户",
              "py": "chuānghu",
              "fa": "پنجره",
              "ex": "打开窗户透透气。",
              "exPy": "Dǎkāi chuānghu tòutòuqì.",
              "exFa": "پنجره را باز کن تا هوا عوض شود."
            },
            {
              "hanzi": "床",
              "py": "chuáng",
              "fa": "تخت‌خواب",
              "ex": "床上有一张被子。",
              "exPy": "Chuáng shang yǒu yì zhāng bèizi.",
              "exFa": "روی تخت یک پتو قرار دارد."
            },
            {
              "hanzi": "干净",
              "py": "gānjìng",
              "fa": "تمیز / پاکیزه",
              "ex": "房间打扫得很干净。",
              "exPy": "Fángjiān dǎsǎo de hěn gānjìng.",
              "exFa": "اتاق خیلی تمیز مرتب شده است."
            },
            {
              "hanzi": "洗",
              "py": "xǐ",
              "fa": "شستن / تمیز کردن",
              "ex": "我要洗衣服。",
              "exPy": "Wǒ yào xǐ yīfu.",
              "exFa": "می‌خواهم لباس‌ها را بشویم."
            },
            {
              "hanzi": "做饭",
              "py": "zuò fàn",
              "fa": "آشپزی کردن / غذا پختن",
              "ex": "妈妈在厨房做饭。",
              "exPy": "Māma zài chúfáng zuòfàn.",
              "exFa": "مادرم در آشپزخانه مشغول آشپزی است."
            },
            {
              "hanzi": "大",
              "py": "dà",
              "fa": "بزرگ",
              "ex": "这个客厅很大。",
              "exPy": "Zhège kètīng hěn dà.",
              "exFa": "این پذیرایی خیلی بزرگ است."
            },
            {
              "hanzi": "小",
              "py": "xiǎo",
              "fa": "کوچک",
              "ex": "小猫很可爱。",
              "exPy": "Xiǎo māo hěn kě'ài.",
              "exFa": "بچه گربه خیلی ملوس است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «房子» (fángzi) چیست؟",
                "audio": "fángzi",
                "hanzi": "房子",
                "pinyin": "fángzi",
                "opts": [
                  "خانه / آپارتمان",
                  "اتاق",
                  "در / ورودی",
                  "پنجره"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «房间» (fángjiān) چیست؟",
                "audio": "fángjiān",
                "hanzi": "房间",
                "pinyin": "fángjiān",
                "opts": [
                  "اتاق",
                  "خانه / آپارتمان",
                  "در / ورودی",
                  "پنجره"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «门» (mén) چیست؟",
                "audio": "mén",
                "hanzi": "门",
                "pinyin": "mén",
                "opts": [
                  "در / ورودی",
                  "خانه / آپارتمان",
                  "اتاق",
                  "پنجره"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «窗户» (chuānghu) چیست؟",
                "audio": "chuānghu",
                "hanzi": "窗户",
                "pinyin": "chuānghu",
                "opts": [
                  "پنجره",
                  "خانه / آپارتمان",
                  "اتاق",
                  "در / ورودی"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "房子",
                    "fa": "خانه"
                  },
                  {
                    "zh": "房间",
                    "fa": "اتاق"
                  },
                  {
                    "zh": "门",
                    "fa": "در"
                  },
                  {
                    "zh": "窗户",
                    "fa": "پنجره"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "توصیف ویژگی‌ها با جفت صفت‌های تضاد و ترکیب 很",
        "intro": {
          "title": "توصیف ویژگی‌ها با جفت صفت‌های تضاد و ترکیب 很",
          "lead": "۱. توصیف اسم با صفت: در زبان چینی برخلاف فارسی، نیازی به فعل «بودن» نیست، بلکه صفت‌ها خود فعل حالت هستند و با قید 很 همراه می‌شوند (مثال: 房间很大 = اتاق خیلی بزرگ است).\n۲. ترکیب دو صفت مثبت: 又 + صفت اول + 又 + صفت دوم (مثال: 房间又大又干净 = اتاق هم بزرگ است و هم تمیز).",
          "formula": "اسم + 很 + صفت | 又 + صفت ۱ + 又 + صفت ۲",
          "examples": [
            {
              "zh": "我的新房间很干净。",
              "py": "Wǒ de xīn fángjiān hěn gānjìng.",
              "fa": "اتاق جدید من خیلی تمیز است."
            },
            {
              "zh": "这套房子又大又便宜。",
              "py": "Zhè tào fángzi yòu dà yòu piányi.",
              "fa": "این خانه هم بزرگ است و هم ارزان."
            },
            {
              "zh": "星期六我常在家里洗衣服、做饭。",
              "py": "Xīngqīliù wǒ cháng zài jiā lǐ xǐ yīfu, zuòfàn.",
              "fa": "شنبه‌ها معمولاً در خانه لباس می‌شویم و آشپزی می‌کنم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی کلمه «干净» (gānjìng) چیست؟",
                "opts": [
                  "تمیز و پاکیزه",
                  "کثیف",
                  "کوچک",
                  "تاریک"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «اتاق من خیلی بزرگ است» مرتب کنید:",
                "tiles": [
                  "我的房间",
                  "很",
                  "大"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه بازدید از خوابگاه دانشجویی جدید",
        "intro": {
          "title": "مکالمه بازدید از خوابگاه دانشجویی جدید",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "欢迎来我的新宿舍！",
              "py": "Huānyíng lái wǒ de xīn sùshè!",
              "fa": "به خوابگاه جدید من خوش آمدید!"
            },
            {
              "role": "B",
              "speaker": "مریم",
              "zh": "哇，你的房间真漂亮！",
              "py": "Wā, nǐ de fángjiān zhēn piàoliang!",
              "fa": "واو، اتاقت واقعاً زیباست!"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "看，这是我的书桌，上面有电脑和书。",
              "py": "Kàn, zhè shì wǒ de shūzhuō, shàngmiàn yǒu diànnǎo hé shū.",
              "fa": "ببین، این میز مطالعه من است، رویش لپ‌تاپ و کتاب‌هاست."
            },
            {
              "role": "B",
              "speaker": "مریم",
              "zh": "床也很舒服，窗户很大很亮。",
              "py": "Chuáng yě hěn shūfu, chuānghu hěn dà hěn liàng.",
              "fa": "تخت هم خیلی راحته، پنجره هم بزرگ و پرنوره."
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "对，我昨天把房间打扫得很干净。",
              "py": "Duì, wǒ zuótiān bǎ fángjiān dǎsǎo de hěn gānjìng.",
              "fa": "درسته، دیروز اتاق را حسابی تمیز کردم."
            },
            {
              "role": "B",
              "speaker": "مریم",
              "zh": "我们一起喝杯咖啡吧！",
              "py": "Wǒmen yìqǐ hē bēi kāfēi ba!",
              "fa": "بیا با هم یک فنجان قهوه بنوشیم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "欢迎来我的新宿舍！ (به خوابگاه جدید من خوش آمدید!)",
                  "哇，你的房间真漂亮！ (واو، اتاقت واقعاً زیباست!)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «看，这是我的书桌，上面有电脑和书。» چیست؟",
                "opts": [
                  "床也很舒服，窗户很大很亮。 (تخت هم خیلی راحته، پنجره هم بزرگ و پرنوره.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 13",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی کلمه «干净» (gānjìng) چیست؟",
                "opts": [
                  "تمیز و پاکیزه",
                  "کثیف",
                  "کوچک",
                  "تاریک"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «اتاق من خیلی بزرگ است» مرتب کنید:",
                "tiles": [
                  "我的房间",
                  "很",
                  "大"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "وسایل خانه را وصل کنید:",
                "pairs": [
                  {
                    "zh": "门",
                    "fa": "در"
                  },
                  {
                    "zh": "窗户",
                    "fa": "پنجره"
                  },
                  {
                    "zh": "床",
                    "fa": "تخت‌خواب"
                  },
                  {
                    "zh": "洗衣服",
                    "fa": "شستن لباس"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام کلمه به معنای «آشپزی کردن / غذا پختن» است؟",
                "opts": [
                  "做饭 (zuò fàn)",
                  "吃饭 (chī fàn)",
                  "买菜 (mǎi cài)",
                  "洗手 (xǐ shǒu)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:13": {
    "id": "hsk1:13",
    "courseId": "hsk1",
    "unitIndex": 13,
    "unitNum": 14,
    "title": "Hobbies & Sports",
    "titleFa": "سرگرمی‌ها، ورزش و علایق",
    "titleZh": "你喜欢什么运动？",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "یادگیری ورزش‌های پرطرفدار (فوتبال، شنا)، تماشای فیلم، موسیقی و فعل مهارت 会",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 14",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "爱好",
              "py": "àihào",
              "fa": "سرگرمی / علاقه",
              "ex": "你的爱好是什么？",
              "exPy": "Nǐ de àihào shì shénme?",
              "exFa": "سرگرمی تو چیست؟"
            },
            {
              "hanzi": "喜欢",
              "py": "xǐhuan",
              "fa": "دوست داشتن / خوش آمدن",
              "ex": "我喜欢学中文。",
              "exPy": "Wǒ xǐhuan xué zhōngwén.",
              "exFa": "من زبان چینی را دوست دارم."
            },
            {
              "hanzi": "运动",
              "py": "yùndòng",
              "fa": "ورزش / ورزش کردن",
              "ex": "多做运动对身体好。",
              "exPy": "Duō zuò yùndòng duì shēntǐ hǎo.",
              "exFa": "ورزش زیاد برای بدن مفید است."
            },
            {
              "hanzi": "踢足球",
              "py": "tī zúqiú",
              "fa": "فوتبال بازی کردن",
              "ex": "星期天我们去踢足球。",
              "exPy": "Xīngqītiān wǒmen qù tī zúqiú.",
              "exFa": "یکشنبه‌ها به فوتبال بازی کردن می‌رویم."
            },
            {
              "hanzi": "游泳",
              "py": "yóu yǒng",
              "fa": "شنا کردن",
              "ex": "你会游泳吗？",
              "exPy": "Nǐ huì yóuyǒng ma?",
              "exFa": "شنا کردن بلدی؟"
            },
            {
              "hanzi": "唱歌",
              "py": "chàng gē",
              "fa": "آواز خواندن",
              "ex": "她唱歌唱得很好听。",
              "exPy": "Tā chànggē chàng de hěn hǎotīng.",
              "exFa": "او آواز را خیلی قشنگ می‌خواند."
            },
            {
              "hanzi": "听音乐",
              "py": "tīng yīnyuè",
              "fa": "موسیقی گوش دادن",
              "ex": "我常在晚上听音乐。",
              "exPy": "Wǒ cháng zài wǎnshang tīng yīnyuè.",
              "exFa": "من معمولاً شب‌ها موسیقی گوش می‌دهم."
            },
            {
              "hanzi": "看电影",
              "py": "kàn diànyǐng",
              "fa": "فیلم تماشا کردن",
              "ex": "周末我们去看电影吧。",
              "exPy": "Zhōumò wǒmen qù kàn diànyǐng ba.",
              "exFa": "آخر هفته بیایید برویم سینما فیلم ببینیم."
            },
            {
              "hanzi": "会",
              "py": "huì",
              "fa": "بلد بودن (مهارت آموختنی)",
              "ex": "我会说汉语。",
              "exPy": "Wǒ huì shuō Hànyǔ.",
              "exFa": "من بلدم چینی صحبت کنم."
            },
            {
              "hanzi": "玩",
              "py": "wán",
              "fa": "بازی کردن / خوش گذراندن",
              "ex": "孩子们在公园里玩。",
              "exPy": "Háizimen zài gōngyuán lǐ wán.",
              "exFa": "بچه‌ها داخل پارک مشغول بازی هستند."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «爱好» (àihào) چیست؟",
                "audio": "àihào",
                "hanzi": "爱好",
                "pinyin": "àihào",
                "opts": [
                  "سرگرمی / علاقه",
                  "دوست داشتن / خوش آمدن",
                  "ورزش / ورزش کردن",
                  "فوتبال بازی کردن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «喜欢» (xǐhuan) چیست؟",
                "audio": "xǐhuan",
                "hanzi": "喜欢",
                "pinyin": "xǐhuan",
                "opts": [
                  "دوست داشتن / خوش آمدن",
                  "سرگرمی / علاقه",
                  "ورزش / ورزش کردن",
                  "فوتبال بازی کردن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «运动» (yùndòng) چیست؟",
                "audio": "yùndòng",
                "hanzi": "运动",
                "pinyin": "yùndòng",
                "opts": [
                  "ورزش / ورزش کردن",
                  "سرگرمی / علاقه",
                  "دوست داشتن / خوش آمدن",
                  "فوتبال بازی کردن"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «踢足球» (tī zúqiú) چیست؟",
                "audio": "tī zúqiú",
                "hanzi": "踢足球",
                "pinyin": "tī zúqiú",
                "opts": [
                  "فوتبال بازی کردن",
                  "سرگرمی / علاقه",
                  "دوست داشتن / خوش آمدن",
                  "ورزش / ورزش کردن"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "爱好",
                    "fa": "سرگرمی"
                  },
                  {
                    "zh": "喜欢",
                    "fa": "دوست داشتن"
                  },
                  {
                    "zh": "运动",
                    "fa": "ورزش"
                  },
                  {
                    "zh": "踢足球",
                    "fa": "فوتبال بازی کردن"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "فعل کمکی مهارت 会 و ساختار علاقه با 喜欢",
        "intro": {
          "title": "فعل کمکی مهارت 会 و ساختار علاقه با 喜欢",
          "lead": "۱. مهارت اکتسابی: فاعل + 会 + فعل (مثال: 我会游泳 = من شنا کردن بلدم / 我不会踢足球 = من فوتبال بلد نیستم).\n۲. ابراز علاقه: فاعل + 喜欢 + [فعل یا اسم] (مثال: 我喜欢看电影 = تماشای فیلم را دوست دارم).",
          "formula": "فاعل + 会 / 不会 + مهارت | فاعل + 喜欢 + فعل / اسم",
          "examples": [
            {
              "zh": "你会游泳吗？— 会，我游得很快。",
              "py": "Nǐ huì yóuyǒng ma? — Huì, wǒ yóu de hěn kuài.",
              "fa": "شنا بلدی؟ — بله، خیلی سریع شنا می‌کنم."
            },
            {
              "zh": "你周末喜欢做什么？— 我喜欢听音乐和看书。",
              "py": "Nǐ zhōumò xǐhuan zuò shénme? — Wǒ xǐhuan tīng yīnyuè hé kàn shū.",
              "fa": "آخر هفته دوست داری چه کار کنی؟ — موسیقی و کتاب خواندن را دوست دارم."
            },
            {
              "zh": "我们一起去踢足球吧！",
              "py": "Wǒmen yìqǐ qù tī zúqiú ba!",
              "fa": "بیایید با هم فوتبال بازی کنیم!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "اصطلاح «踢足球» (tī zúqiú) به چه معناست؟",
                "opts": [
                  "فوتبال بازی کردن",
                  "شنا کردن",
                  "فیلم دیدن",
                  "آواز خواندن"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من بلدم چینی صحبت کنم» مرتب کنید:",
                "tiles": [
                  "我",
                  "会说",
                  "汉语"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه در محوطه باشگاه دانشگاه: برنامه‌ریزی تفریح",
        "intro": {
          "title": "مکالمه در محوطه باشگاه دانشگاه: برنامه‌ریزی تفریح",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "لی چانگ",
              "zh": "阿里，今天下午有空吗？",
              "py": "Ālǐ, jīntiān xiàwǔ yǒu kòng ma?",
              "fa": "علی، امروز بعدازظهر وقت داری؟"
            },
            {
              "role": "B",
              "speaker": "علی",
              "zh": "有空，怎么了？",
              "py": "Yǒu kòng, zěnme le?",
              "fa": "وقت دارم، چطور مگه؟"
            },
            {
              "role": "A",
              "speaker": "لی چانگ",
              "zh": "我们去操场踢足球吧，你会踢足球吗？",
              "py": "Wǒmen qù cāochǎng tī zúqiú ba, nǐ huì tī zúqiú ma?",
              "fa": "بیا بریم زمین چمن فوتبال بازی کنیم، فوتبال بلدی؟"
            },
            {
              "role": "B",
              "speaker": "علی",
              "zh": "当然会！我很喜欢踢足球。",
              "py": "Dāngrán huì! Wǒ hěn xǐhuan tī zúqiú.",
              "fa": "معلومه که بلدم! خیلی فوتبال دوست دارم."
            },
            {
              "role": "A",
              "speaker": "لی چانگ",
              "zh": "太好了，四点半操场见！",
              "py": "Tài hǎo le, sì diǎn bàn cāochǎng jiàn!",
              "fa": "عالیه، ساعت چهار و نیم زمین چمن می‌بینمت!"
            },
            {
              "role": "B",
              "speaker": "علی",
              "zh": "不见不散！",
              "py": "Bú jiàn bú sàn!",
              "fa": "حله، سر وقت اونجام!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (لی چانگ) چه می‌گوید؟",
                "opts": [
                  "阿里，今天下午有空吗？ (علی، امروز بعدازظهر وقت داری؟)",
                  "有空，怎么了？ (وقت دارم، چطور مگه؟)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «我们去操场踢足球吧，你会踢足球吗？» چیست؟",
                "opts": [
                  "当然会！我很喜欢踢足球。 (معلومه که بلدم! خیلی فوتبال دوست دارم.)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 14",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "اصطلاح «踢足球» (tī zúqiú) به چه معناست؟",
                "opts": [
                  "فوتبال بازی کردن",
                  "شنا کردن",
                  "فیلم دیدن",
                  "آواز خواندن"
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من بلدم چینی صحبت کنم» مرتب کنید:",
                "tiles": [
                  "我",
                  "会说",
                  "汉语"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "سرگرمی‌ها را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "游泳",
                    "fa": "شنا کردن"
                  },
                  {
                    "zh": "听音乐",
                    "fa": "موسیقی گوش دادن"
                  },
                  {
                    "zh": "看电影",
                    "fa": "فیلم تماشا کردن"
                  },
                  {
                    "zh": "唱歌",
                    "fa": "آواز خواندن"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "برای پاسخ مثبت به «你会游泳吗？» کدام صحیح است؟",
                "opts": [
                  "会，我会游泳。",
                  "不会，我不喜欢。",
                  "我要吃米饭。",
                  "现在四点。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  },

  "hsk1:14": {
    "id": "hsk1:14",
    "courseId": "hsk1",
    "unitIndex": 14,
    "unitNum": 15,
    "title": "Travel & Comprehensive Review",
    "titleFa": "سفر، احساسات و جمع‌بندی سطح ۱",
    "titleZh": "我们一起去旅游吧！",
    "level": "HSK 1 (نسخه ۳.۰)",
    "desc": "جمع‌بندی جامع سطح HSK 1 نسخه ۳.۰: سفر، بلیت هواپیما، احساس خوشحالی و پیشنهاد با 吧",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان نوین",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت 10 واژه کلیدی درس",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس 15",
          "lead": "در این بخش با مهم‌ترین کلمات این درس در زبان چینی روزمره و آزمون HSK 3.0 آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "旅游",
              "py": "lǚyóu",
              "fa": "سفر / گردشگری",
              "ex": "我想去中国旅游。",
              "exPy": "Wǒ xiǎng qù Zhōngguó lǚyóu.",
              "exFa": "می‌خواهم برای گردش به چین بروم."
            },
            {
              "hanzi": "高兴",
              "py": "gāoxìng",
              "fa": "خوشحال / شادمان",
              "ex": "今天我很高兴。",
              "exPy": "Jīntiān wǒ hěn gāoxìng.",
              "exFa": "امروز خیلی خوشحالم."
            },
            {
              "hanzi": "觉得",
              "py": "juéde",
              "fa": "فکر کردن / به نظر رسیدن",
              "ex": "你觉得北京怎么样？",
              "exPy": "Nǐ juéde Běijīng zěnmeyàng?",
              "exFa": "به نظرت پکن چطوره؟"
            },
            {
              "hanzi": "吧",
              "py": "ba",
              "fa": "حرف نشانه پیشنهاد یا نظرخواهی",
              "ex": "我们走吧！",
              "exPy": "Wǒmen zǒu ba!",
              "exFa": "بیایید راه بیفتیم!"
            },
            {
              "hanzi": "一起",
              "py": "yìqǐ",
              "fa": "با هم / به همراه هم",
              "ex": "我们一起学习汉语。",
              "exPy": "Wǒmen yìqǐ xuéxí Hànyǔ.",
              "exFa": "ما با هم زبان چینی می‌آموزیم."
            },
            {
              "hanzi": "飞机",
              "py": "fēijī",
              "fa": "هواپیما",
              "ex": "坐飞机去上海。",
              "exPy": "Zuò fēijī qù Shànghǎi.",
              "exFa": "با هواپیما به شانگهای رفتن."
            },
            {
              "hanzi": "票",
              "py": "piào",
              "fa": "بلیت",
              "ex": "我买了两张飞机票。",
              "exPy": "Wǒ mǎi le liǎng zhāng fēijīpiào.",
              "exFa": "من دو بلیت هواپیما خریدم."
            },
            {
              "hanzi": "准备",
              "py": "zhǔnbèi",
              "fa": "آماده کردن / آماده شدن",
              "ex": "你准备好了吗？",
              "exPy": "Nǐ zhǔnbèi hǎo le ma?",
              "exFa": "آماده شدی؟"
            },
            {
              "hanzi": "累",
              "py": "lèi",
              "fa": "خسته",
              "ex": "虽然累，但是很高兴。",
              "exPy": "Suīrán lèi, dànshì hěn gāoxìng.",
              "exFa": "گرچه خسته‌ام اما خیلی خوشحالم."
            },
            {
              "hanzi": "行李",
              "py": "xíngli",
              "fa": "چمدان / بار سفر",
              "ex": "我的行李很重。",
              "exPy": "Wǒ de xíngli hěn zhòng.",
              "exFa": "چمدان من سنگین است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "سنجش درک لغات",
            "desc": "آزمون چهارگزینه‌ای تطابق هانزی و معنی فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «旅游» (lǚyóu) چیست؟",
                "audio": "lǚyóu",
                "hanzi": "旅游",
                "pinyin": "lǚyóu",
                "opts": [
                  "سفر / گردشگری",
                  "خوشحال / شادمان",
                  "فکر کردن / به نظر رسیدن",
                  "حرف نشانه پیشنهاد یا نظرخواهی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «高兴» (gāoxìng) چیست؟",
                "audio": "gāoxìng",
                "hanzi": "高兴",
                "pinyin": "gāoxìng",
                "opts": [
                  "خوشحال / شادمان",
                  "سفر / گردشگری",
                  "فکر کردن / به نظر رسیدن",
                  "حرف نشانه پیشنهاد یا نظرخواهی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «觉得» (juéde) چیست؟",
                "audio": "juéde",
                "hanzi": "觉得",
                "pinyin": "juéde",
                "opts": [
                  "فکر کردن / به نظر رسیدن",
                  "سفر / گردشگری",
                  "خوشحال / شادمان",
                  "حرف نشانه پیشنهاد یا نظرخواهی"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «吧» (ba) چیست؟",
                "audio": "ba",
                "hanzi": "吧",
                "pinyin": "ba",
                "opts": [
                  "حرف نشانه پیشنهاد یا نظرخواهی",
                  "سفر / گردشگری",
                  "خوشحال / شادمان",
                  "فکر کردن / به نظر رسیدن"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "v2_pairs",
            "num": 2,
            "title": "وصل‌کردنی واژگان",
            "desc": "اتصال کاراکترهای چینی به معانی فارسی",
            "exercises": [
              {
                "type": "match",
                "q": "واژه‌های چینی را به معانی صحیح فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "旅游",
                    "fa": "سفر"
                  },
                  {
                    "zh": "高兴",
                    "fa": "خوشحال"
                  },
                  {
                    "zh": "觉得",
                    "fa": "فکر کردن"
                  },
                  {
                    "zh": "吧",
                    "fa": "حرف نشانه پیشنهاد یا نظرخواهی"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان و جمله‌سازی",
        "titleZh": "语法",
        "icon": "layers",
        "desc": "پیشنهاد با 吧 و قید همراهی 一起",
        "intro": {
          "title": "پیشنهاد با 吧 و قید همراهی 一起",
          "lead": "۱. پیشنهاد صمیمانه: جمله خبری + 吧 (مثال: 我们走吧 = بیا بریم / 我们吃饭吧 = بیا غذا بخوریم).\n۲. انجام کار با هم: فاعل‌ها + 一起 + فعل (مثال: 我们一起去 = با هم می‌رویم).\n۳. ابراز عقیده: فاعل + 觉得 + نظر شخصی (مثال: 我觉得汉语很有意思 = به نظرم چینی خیلی جذابه).",
          "formula": "فاعل + 一起 + فعل | جمله + 吧！ | 觉得 + نظر",
          "examples": [
            {
              "zh": "我们一起去北京旅游吧！",
              "py": "Wǒmen yìqǐ qù Běijīng lǚyóu ba!",
              "fa": "بیایید با هم به سفر پکن برویم!"
            },
            {
              "zh": "你觉得学中文难不难？— 我觉得很有趣。",
              "py": "Nǐ juéde xué zhōngwén nán bu nán? — Wǒ juéde hěn yǒuqù.",
              "fa": "به نظرت یادگیری چینی سخته؟ — به نظرم خیلی جالبه."
            },
            {
              "zh": "今天玩得很高兴！",
              "py": "Jīntiān wán de hěn gāoxìng!",
              "fa": "امروز خیلی خوش گذشت!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "g_practice",
            "num": 1,
            "title": "تمرین الگوی دستوری",
            "desc": "تحلیل ساختار جمله و آزمون کاربردی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی عبارت «我们一起去吧！» چیست؟",
                "opts": [
                  "بیایید با هم برویم!",
                  "تو تنهایی برو!",
                  "ما دیروز رفتیم.",
                  "فردا می‌بینمت."
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من می‌خواهم به سفر چین بروم» مرتب کنید:",
                "tiles": [
                  "我",
                  "想去",
                  "中国旅游"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 3,
        "title": "Conversation",
        "titleFa": "گفتار و مکالمه در موقعیت واقعی",
        "titleZh": "对话",
        "icon": "message-circle",
        "desc": "مکالمه برنامه‌ریزی سفر به پکن و خرید بلیت",
        "intro": {
          "title": "مکالمه برنامه‌ریزی سفر به پکن و خرید بلیت",
          "lead": "مکالمه زیر را با دقت بخوانید، به تلفظ جملات گوش فرا دهید و با گوینده تکرار کنید:",
          "dialogue": [
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "放假了，你有什么打算？",
              "py": "Fàngjià le, nǐ yǒu shénme dǎsuàn?",
              "fa": "تعطیلات شروع شد، چه برنامه‌ای داری؟"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "我想去上海旅游，你呢？",
              "py": "Wǒ xiǎng qù Shànghǎi lǚyóu, nǐ ne?",
              "fa": "می‌خواهم برای گردش به شانگهای بروم، تو چطور؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "太巧了！我们一起去吧！",
              "py": "Tài qiǎo le! Wǒmen yìqǐ qù ba!",
              "fa": "چه تصادف جالبی! بیا با هم برویم!"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "太棒了！坐高铁还是坐飞机？",
              "py": "Tài bàng le! Zuò gāotiě háishi zuò fēijī?",
              "fa": "عالیه! با قطار سریع‌السیر برویم یا با هواپیما؟"
            },
            {
              "role": "A",
              "speaker": "سارا",
              "zh": "坐高铁吧，又快又方便。我在网上买票！",
              "py": "Zuò gāotiě ba, yòu kuài yòu fāngbiàn. Wǒ zài wǎngshang mǎi piào!",
              "fa": "با قطار سریع‌السیر برویم، هم تندروئه هم راحت. من آنلاین بلیت می‌خرم!"
            },
            {
              "role": "B",
              "speaker": "لی مینگ",
              "zh": "好的，祝我们旅途愉快！",
              "py": "Hǎo de, zhù wǒmen lǚtú yúkuài!",
              "fa": "باشه، سفرمون به خیر و خوشی!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "c_dialogue",
            "num": 1,
            "title": "درک شنیداری و نقش‌آفرینی",
            "desc": "تمرین بازخوانی دیالوگ‌ها و سوالات مفهومی",
            "exercises": [
              {
                "type": "choice",
                "q": "در دیالوگ بالا، گوینده A (سارا) چه می‌گوید؟",
                "opts": [
                  "放假了，你有什么打算？ (تعطیلات شروع شد، چه برنامه‌ای داری؟)",
                  "我想去上海旅游，你呢？ (می‌خواهم برای گردش به شانگهای بروم، تو چطور؟)",
                  "再见！",
                  "我不去。"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "پاسخ مناسب و طبیعی به جمله «太巧了！我们一起去吧！» چیست؟",
                "opts": [
                  "太棒了！坐高铁还是坐飞机？ (عالیه! با قطار سریع‌السیر برویم یا با هواپیما؟)",
                  "不好！",
                  "我是美国人。",
                  "太贵了。"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 4,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و سنجش نهایی",
        "titleZh": "综合测验",
        "icon": "award",
        "desc": "سنجش جامع واژگان، گرامر و کاربرد مکالمه‌ای درس",
        "intro": {
          "title": "آزمون پایانی درس 15",
          "lead": "با پاسخ به این سوالات، درس با موفقیت تکمیل شده و امتیاز تجربه (XP) دریافت خواهید کرد."
        },
        "miniLessons": [
          {
            "id": "q_final",
            "num": 1,
            "title": "چالش پایانی درس",
            "desc": "تست‌های چندگزینه‌ای و وصل‌کردنی ترکیبی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی عبارت «我们一起去吧！» چیست؟",
                "opts": [
                  "بیایید با هم برویم!",
                  "تو تنهایی برو!",
                  "ما دیروز رفتیم.",
                  "فردا می‌بینمت."
                ],
                "ans": 0
              },
              {
                "type": "order",
                "q": "کلمات زیر را برای ساخت «من می‌خواهم به سفر چین بروم» مرتب کنید:",
                "tiles": [
                  "我",
                  "想去",
                  "中国旅游"
                ],
                "ans": [
                  0,
                  1,
                  2
                ]
              },
              {
                "type": "match",
                "q": "اصطلاحات سفر را به فارسی وصل کنید:",
                "pairs": [
                  {
                    "zh": "旅游",
                    "fa": "سفر / گردشگری"
                  },
                  {
                    "zh": "飞机",
                    "fa": "هواپیما"
                  },
                  {
                    "zh": "票",
                    "fa": "بلیت"
                  },
                  {
                    "zh": "高兴",
                    "fa": "خوشحال"
                  }
                ]
              },
              {
                "type": "choice",
                "q": "کدام کلمه در پایان جمله برای ابراز پیشنهاد یا نظرخواهی دوستانه می‌آید؟",
                "opts": [
                  "吧 (ba)",
                  "吗 (ma)",
                  "呢 (ne)",
                  "的 (de)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      }
    ]
  }
  },


    // ----------------------------------------------------
    // کلید ذخیره‌سازی پیشرفت یونیت در LocalStorage
    // ----------------------------------------------------
    getProgressKey: function(unitKey) {
      return "unit_prog_" + (unitKey || "hsk1:0");
    },

    loadProgress: function(unitKey) {
      unitKey = unitKey || "hsk1:0";
      var raw = null;
      try {
        raw = localStorage.getItem(UnitSystem.getProgressKey(unitKey));
        if (raw) raw = JSON.parse(raw);
      } catch (e) { raw = null; }
      if (!raw && window.Store && Store.state && Store.state.unitProgs && Store.state.unitProgs[unitKey]) {
        raw = Store.state.unitProgs[unitKey];
      }

      var prog = raw || {
        unitKey: unitKey,
        currentSectionIdx: 0,
        completedSections: [],
        miniProgress: {
          "vocab": 0,
          "grammar": 0,
          "pronunciation": 0,
          "conversation": 0,
          "quiz": 0
        },
        seenIntro: {},
        xpEarned: 0,
        done: false
      };

      prog.miniProgress = prog.miniProgress || {};
      // سازگاری با رکوردهای قدیمی
      if (prog.miniProgress.listening || prog.miniProgress.reading) {
        var cMax = Math.max(prog.miniProgress.conversation || 0, prog.miniProgress.listening || 0, prog.miniProgress.reading || 0);
        prog.miniProgress.conversation = cMax;
      }
      if (prog.miniProgress.challenge) {
        prog.miniProgress.quiz = Math.max(prog.miniProgress.quiz || 0, prog.miniProgress.challenge || 0);
      }
      prog.completedSections = prog.completedSections || [];
      if (prog.completedSections.indexOf("listening") >= 0 || prog.completedSections.indexOf("reading") >= 0) {
        if (prog.completedSections.indexOf("conversation") < 0) prog.completedSections.push("conversation");
      }
      if (prog.completedSections.indexOf("challenge") >= 0) {
        if (prog.completedSections.indexOf("quiz") < 0) prog.completedSections.push("quiz");
      }

      return prog;
    },

    saveProgress: function(unitKey, prog) {
      unitKey = unitKey || "hsk1:0";
      try {
        localStorage.setItem(UnitSystem.getProgressKey(unitKey), JSON.stringify(prog));
      } catch (e) {}
      try {
        if (window.Store && Store.state && Store.set) {
          var up = Object.assign({}, Store.state.unitProgs || {});
          up[unitKey] = prog;
          Store.set({ unitProgs: up });
        }
      } catch (e) {}
    },

    // محاسبه دقیق درصد پیشرفت در تمام سطوح (کل درس، زیرمجموعه‌ها و زیر ایستگاه‌ها)
    getOverallProgress: function(unitKey) {
      unitKey = unitKey || "hsk1:0";
      var unit = UnitSystem.UNITS[unitKey] || UnitSystem.UNITS["hsk1:0"];
      var prog = UnitSystem.loadProgress(unitKey);
      
      var totalSteps = 0;
      var doneSteps = 0;
      var sectionPcts = {};

      (unit.sections || []).forEach(function(sec) {
        var secTotal = (sec.miniLessons || []).length;
        var secDone = Math.min(secTotal, (prog.miniProgress && prog.miniProgress[sec.id]) || 0);
        totalSteps += secTotal;
        doneSteps += secDone;
        sectionPcts[sec.id] = secTotal > 0 ? Math.round((secDone / secTotal) * 100) : 0;
      });

      var pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
      return {
        pct: pct,
        totalSteps: totalSteps,
        doneSteps: doneSteps,
        sectionPcts: sectionPcts,
        completedSections: prog.completedSections || [],
        done: !!prog.done || pct >= 100
      };
    },

    // وضعیت داخلی رانر فعلی
    runner: {
      unitKey: "hsk1:0",
      viewMode: "unit-path", // "unit-path" | "section-intro" | "mini-path" | "exercise"
      activeSectionIdx: 0,
      activeMiniIdx: 0,
      activeExIdx: 0,
      userAnswers: {},
      selectedTiles: [],
      matchedPairs: [],
      selectedMatchLeft: null,
      feedbackState: null, // null | "correct" | "wrong"
      showPinyin: true
    },

    // ----------------------------------------------------
    // متدهای مسیریابی و شروع درس
    // ----------------------------------------------------
        promptExitExercise: function() {
      if (window.UI && UI.layer) {
        var act = UI.act;
        var runner = UnitSystem.runner;
        var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
        var sec = (unit.sections && unit.sections[runner.activeSectionIdx]) || {};
        var mini = (sec.miniLessons && sec.miniLessons[runner.activeMiniIdx]) || {};

        var sheetHtml = '<button class="scrim" ' + act("unitCancelExit") + ' aria-label="ادامه تمرین"></button>' +
          '<div class="sheet lv kan-leave-sheet" role="dialog" aria-label="ترک تمرین" style="text-align:center; padding: 26px 20px max(44px, calc(env(safe-area-inset-bottom, 0px) + 36px)); border-radius: 28px 28px 0 0; background: #ffffff; box-shadow: 0 -10px 40px rgba(0,0,0,0.18);">' +
          '  <div class="sheet__grab" style="width:44px; height:5px; background:#cbd5e1; border-radius:3px; margin:0 auto 16px;"></div>' +
          '  <div style="font-size:38px; line-height:1; margin-bottom:12px;">👋</div>' +
          '  <h3 style="font-size:18.5px; font-weight:800; color:#0f172a; margin:0 0 8px; font-family:var(--f, inherit);">واقعاً می‌خواهی ترک کنی؟</h3>' +
          '  <p style="font-size:13.5px; color:#64748b; line-height:1.6; margin:0 0 20px; font-family:var(--f, inherit);">ادامه بده تا تمرین این بخش کامل بشه! فقط کمی دیگه مونده.</p>' +
          '  <div style="display:flex; flex-direction:column; gap:12px; width:100%;">' +
          '    <button class="btn" ' + act("unitCancelExit") + ' style="background:#0FA968; color:#ffffff; font-weight:800; height:48px; border-radius:14px; font-size:15px; border:none; box-shadow:0 4px 14px rgba(15,169,104,0.35); cursor:pointer; width:100%;">ادامه تمرین</button>' +
          '    <button class="btn" ' + act("unitConfirmExit") + ' style="background:transparent; color:#ef4444; font-weight:700; height:44px; border-radius:14px; font-size:14.5px; border:1px solid rgba(239,68,68,0.28); cursor:pointer; width:100%; margin-bottom:12px;">ترک تمرین</button>' +
          '  </div>' +
          '</div>';
        UI.layer(sheetHtml);
        return true;
      }
      return false;
    },

    openUnit: function(courseId, unitIdx, customKey) {
      courseId = courseId || "hsk1";
      unitIdx = unitIdx != null ? unitIdx : 0;
      var key = (customKey === "lesson0" || courseId === "lesson0" || unitIdx === "lesson0" || unitIdx === -1) ? "lesson0" : (courseId + ":" + unitIdx);
      var unit = UnitSystem.UNITS[key];

      UnitSystem.runner.unitKey = key;
      UnitSystem.runner.viewMode = "unit-path";
      UnitSystem.runner.activeSectionIdx = 0;
      UnitSystem.runner.feedbackState = null;
      if (unit && unit.isNewHsk && typeof unit.showPinyinDefault === "boolean") {
        UnitSystem.runner.showPinyin = unit.showPinyinDefault;
      } else {
        delete UnitSystem.runner.showPinyin;
      }

      // باز کردن اسکرین اختصاصی "unit"
      if (window.App && App.go) {
        App.go("unit");
      }
    },

    // ----------------------------------------------------
    // رندر نمای کلی مسیر زیرمجموعه‌های آموزشی درس (Unit Path View)
    // ----------------------------------------------------
    renderUnitPath: function(unit, prog) {
      if (unit && (unit.id === "lesson0" || (unit.unitNum === 0 && String(unit.id).indexOf("hsk") === -1))) {
        var h0 = '<div class="scr u-lesson-screen" style="padding:0; margin:0; width:100%; height:100%; overflow-y:auto; overflow-x:hidden;">';
        h0 += '  <div class="subtasks-view">';
        h0 += '    <img src="art/bg_subtasks_st1.jpg" alt="پیش‌نیاز" class="subtasks-bg-art" id="subtasksBgImg" decoding="async">';
        h0 += '    <button class="screen-back-btn" data-act="go" data-arg=\'{"s":"home"}\' type="button" aria-label="بازگشت به نقشه">';
        h0 += '      <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
        h0 += '    </button>';
        h0 += '    <div class="subtask-station-banner" data-act="go" data-arg=\'{"s":"home"}\'>';
        h0 += '      <div class="subtask-station-info">';
        h0 += '        <span class="subtask-station-pill-tag">درس صفر</span>';
        h0 += '        <span class="subtask-station-lesson-name">الفبای پین‌یین و خط چینی</span>';
        h0 += '      </div>';
        h0 += '      <span style="font-size:11px;color:#0FA968;font-weight:700;">۲ بخش پایه‌ای</span>';
        h0 += '    </div>';

        // جزیره ۱: الفبای پین‌یین چینی (دقیقاً مشابه ساختار جزیره واژگان با سقف مینی پاگودای طلایی)
        h0 += '    <div class="subtask-stage-anchor anchor-step-1">';
        h0 += '      <div class="subtask-interactive-pod" data-act="go" data-arg=\'{"s":"pyHome"}\' onclick="if(window.App&&window.App.go)window.App.go(\'pyHome\');" role="button" tabindex="0">';
        h0 += '        <div class="subtask-unified-card subtask-card--vocab">';
        h0 += '          <div class="temple-mini-roof">';
        h0 += '            <svg viewBox="0 0 64 24" fill="none">';
        h0 += '              <path d="M32 2L12 12H52L32 2Z" fill="#F59E0B"/>';
        h0 += '              <path d="M4 12C12 10 24 14 32 14C40 14 52 10 60 12L56 16H8L4 12Z" fill="#D97706"/>';
        h0 += '              <circle cx="32" cy="5" r="2.5" fill="#FEF3C7"/>';
        h0 += '            </svg>';
        h0 += '          </div>';
        h0 += '          <div class="subtask-card-title">۱. الفبای پین‌یین چینی</div>';
        h0 += '          <div class="subtask-status-pill is-ready">';
        h0 += '            <span class="subtask-status-label">آماده یادگیری</span>';
        h0 += '          </div>';
        h0 += '        </div>';
        h0 += '      </div>';
        h0 += '    </div>';

        // جزیره ۲: خط چینی (هانزی) (دقیقاً مشابه ساختار جزیره دوم گرامر)
        h0 += '    <div class="subtask-stage-anchor anchor-step-2">';
        h0 += '      <div class="subtask-interactive-pod" data-act="go" data-arg=\'{"s":"strokeHome"}\' onclick="if(window.App&&window.App.go)window.App.go(\'strokeHome\');" role="button" tabindex="0">';
        h0 += '        <div class="subtask-unified-card">';
        h0 += '          <div class="subtask-card-title">۲. خط چینی (هانزی)</div>';
        h0 += '          <div class="subtask-status-pill is-ready">';
        h0 += '            <span class="subtask-status-label">آماده یادگیری</span>';
        h0 += '          </div>';
        h0 += '        </div>';
        h0 += '      </div>';
        h0 += '    </div>';

        h0 += '  </div>';
        h0 += '</div>';
        return h0;
      }
      var BASE = 'art/';
      var unitIdx = unit.unitIndex || 0;
      var stationId = Math.floor(unitIdx / 3) + 1;
      if (stationId < 1) stationId = 1;
      if (stationId > 5) stationId = 5;
      var bgImg = BASE + 'bg_subtasks_st' + stationId + '.jpg';

      function faNum(n) {
        return String(n).replace(/\d/g, function(d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
      }

      var isSixSubMode = !!(unit && (unit.isNewHsk || (unit.sections && unit.sections.length > 4)));
      var displaySections = isSixSubMode ? (unit.sections || []) : (unit.sections || []).slice(0, 4);
      var headerCountLabel = isSixSubMode ? (faNum(displaySections.length) + ' زیردرس · ۴۰ تمرین') : '۴ بخش آموزشی';

      var h = '<div class="scr u-lesson-screen" style="padding:0; margin:0; width:100%; height:100%; overflow-y:auto; overflow-x:hidden;">';
      h += '  <div class="subtasks-view' + (isSixSubMode ? ' subtasks-view--6' : '') + '">';

      // تصویر پس‌زمینه منظره پل چوبی و اژدهای اختصاصی ایستگاه
      h += '    <img src="' + bgImg + '" alt="منظره جزایر معلق ایستگاه" class="subtasks-bg-art" id="subtasksBgImg" decoding="async">';

      // دکمه بازگشت شناور در بالا
      h += '    <button class="screen-back-btn" data-act="go" data-arg=\'{"s":"home"}\' type="button" aria-label="بازگشت به نقشه">';
      h += '      <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
      h += '    </button>';

      // بنر مشخصات درس در بالا
      h += '    <div class="subtask-station-banner" data-act="go" data-arg=\'{"s":"home"}\'>';
      h += '      <div class="subtask-station-info">';
      h += '        <span class="subtask-station-pill-tag">' + UI.esc(unit.titleFa || ('درس ' + faNum(unitIdx + 1))) + '</span>';
      h += '        <span class="subtask-station-lesson-name">' + UI.esc(unit.titleZh || '') + '</span>';
      h += '      </div>';
      h += '      <span style="font-size:11px;color:#0FA968;font-weight:700;">' + headerCountLabel + '</span>';
      h += '    </div>';

      // جزیره‌های معلق (۴ بخش کلاسیک یا ۶ زیردرس New HSK)
      var legacyTitles = ["۱. واژگان", "۲. گرامر", "۳. تلفظ", "۴. مکالمه"];
      var isPreviousDone = true;

      displaySections.forEach(function(sec, idx) {
        var completedCount = (prog.miniProgress && prog.miniProgress[sec.id]) || 0;
        var totalCount = (sec.miniLessons && sec.miniLessons.length) || 4;
        var isDone = completedCount >= totalCount;
        var isLocked = !isPreviousDone;
        isPreviousDone = isDone;
        var secTitle = isSixSubMode ? (faNum(idx + 1) + '. ' + (sec.titleFa || sec.title || ('زیردرس ' + faNum(idx + 1)))) : (legacyTitles[idx] || sec.titleFa);

        var anchorClass = 'anchor-step-' + (idx + 1);
        h += '    <div class="subtask-stage-anchor ' + anchorClass + '">';

        if (isLocked) {
          h += '      <div class="subtask-interactive-pod" data-act="unitLockedToast" data-arg=\'{"num":' + (idx+1) + ',"name":"' + UI.esc(secTitle) + '"}\' role="button" tabindex="0">';
          h += '        <div class="integrated-lock-dome">';
          h += '          <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
          h += '        </div>';
          h += '        <div class="subtask-unified-card is-locked-card">';
          h += '          <div class="subtask-card-title">' + UI.esc(secTitle) + '</div>';
          h += '        </div>';
          h += '      </div>';
        } else {
          h += '      <div class="subtask-interactive-pod" data-act="unitSelectSection" data-arg=\'{"idx":' + idx + '}\' role="button" tabindex="0">';
          h += '        <div class="subtask-unified-card ' + (idx === 0 ? 'subtask-card--vocab' : '') + (sec.isCheckpoint ? ' subtask-card--checkpoint' : '') + '">';
          if (idx === 0) {
            h += '          <div class="temple-mini-roof">';
            h += '            <svg viewBox="0 0 64 24" fill="none">';
            h += '              <path d="M32 2L12 12H52L32 2Z" fill="#F59E0B"/>';
            h += '              <path d="M4 12C12 10 24 14 32 14C40 14 52 10 60 12L56 16H8L4 12Z" fill="#D97706"/>';
            h += '              <circle cx="32" cy="5" r="2.5" fill="#FEF3C7"/>';
            h += '            </svg>';
            h += '          </div>';
          }
          h += '          <div class="subtask-card-title">' + UI.esc(secTitle) + '</div>';
          if (isDone) {
            h += '          <div class="subtask-status-pill is-completed">';
            h += '            <div class="subtask-status-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>';
            h += '            <span class="subtask-status-label">تکمیل شد</span>';
            h += '          </div>';
          } else if (completedCount > 0) {
            h += '          <div class="subtask-status-pill is-in-progress">';
            h += '            <span class="subtask-status-label">' + faNum(completedCount) + ' از ' + faNum(totalCount) + ' مرحله</span>';
            h += '          </div>';
          } else {
            h += '          <div class="subtask-status-pill is-ready">';
            h += '            <span class="subtask-status-label">' + (sec.isCheckpoint ? 'آزمون پایانی + جایزه' : 'آماده یادگیری') + '</span>';
            h += '          </div>';
          }
          h += '        </div>';
          h += '      </div>';
        }

        h += '    </div>';
      });

      if (isSixSubMode && unit.bonusCard) {
        var bonusUnlocked = !!prog.done || (prog.completedSections && prog.completedSections.length >= displaySections.length);
        h += '    <div class="subtask-bonus-anchor">';
        h += '      <button type="button" class="subtask-bonus-pill' + (bonusUnlocked ? ' is-unlocked' : ' is-locked') + '" data-act="unitOpenBonusCard">';
        h += '        <span class="subtask-bonus-ico">' + (bonusUnlocked ? '🎁' : '🔒') + '</span>';
        h += '        <span>' + UI.esc(unit.bonusCard.title_fa || 'کارت جایزه فرهنگی (小语的彩蛋)') + '</span>';
        h += '      </button>';
        h += '    </div>';
      }

      h += '  </div>';
      h += '</div>';
      return h;
    },
    renderSectionIntro: function(sec, secIdx) {
      var esc = UI.esc, act = UI.act, icon = UI.icon;
      var intro = sec.intro || {};

      var contentHtml = "";

      // واژگان — فلش‌کارت (هر بار یک واژه)
      if (intro.words && intro.words.length) {
        var runner0 = UnitSystem.runner;
        if (runner0.fcIdx == null || runner0.fcIdx >= intro.words.length) runner0.fcIdx = 0;
        var fw = intro.words[runner0.fcIdx];
        var dots = "";
        for (var di = 0; di < intro.words.length; di++) dots += '<i' + (di === runner0.fcIdx ? ' class="on"' : "") + '></i>';
        contentHtml = '<div class="u-fc">' +
          '<div class="u-fc__card">' +
            '<button class="u-fc__zh han" ' + act("unitPlaySay", { text: fw.hanzi, py: fw.py }) + ' aria-label="شنیدن">' + esc(fw.hanzi) + '</button>' +
            (UnitSystem.pyOn() ? '<div class="u-fc__py py">' + esc(fw.py) + '</div>' : '') +
            (UnitSystem.faOn() && fw.fa ? '<div class="u-fc__fa">' + esc(fw.fa) + '</div>' : '') +
            (fw.ex ? '<div class="u-fc__ex"><span class="han">' + esc(fw.ex) + '</span>' + (UnitSystem.faOn() && fw.exFa ? '<small>' + esc(fw.exFa) + '</small>' : '') + '</div>' : '') +
            '<button class="u-audio-pill" ' + act("unitPlaySay", { text: fw.hanzi, py: fw.py }) + ' aria-label="شنیدن">' + icon("volume-2", 16) + '</button>' +
          '</div>' +
          '<div class="u-fc__nav">' +
            '<button class="u-fc__btn" ' + act("unitFcPrev") + ' aria-label="واژه‌ی قبلی">' + icon("chevron-right", 20) + '</button>' +
            '<span class="u-fc__count">' + UnitSystem.faNum(runner0.fcIdx + 1) + ' / ' + UnitSystem.faNum(intro.words.length) + '</span>' +
            '<button class="u-fc__btn" ' + act("unitFcNext") + ' aria-label="واژه‌ی بعدی">' + icon("chevron-left", 20) + '</button>' +
          '</div>' +
          '<div class="u-fc__dots">' + dots + '</div>' +
        '</div>';
      }

      // گرامر
      if (sec.id === "grammar" || intro.rule || intro.points) {
        var mark = intro.mark || sec.titleZh || "";
        var ruleTitle = intro.rule || intro.title || sec.titleFa || "";
        var formula = intro.formula || intro.pattern || "";
        var explain = intro.explain || intro.lead || "";
        var mistake = intro.mistake || "";
        var examples = intro.examples || [];

        contentHtml = '<div class="u-intro-grammar" style="text-align:right;">' +
          '<div class="tl-ghead" style="margin-bottom:12px;">' +
            (mark ? '<span class="tl-tile tl-tile--han tl-tile--mint han tl-tile--xl">' + esc(mark) + '</span>' : '') +
            '<div class="tl-ghead__txt">' +
              '<b class="han" style="font-size:18px;">' + UI.inlinePy(ruleTitle) + '</b>' +
              '<div class="tl-tags"><span>HSK 1</span><span>دستور زبان</span></div>' +
            '</div>' +
          '</div>' +
          (formula ? '<div class="gp-formula" style="margin:10px 0 14px;"><div class="gp-chips"><span class="gp-chip gp-chip--key han">' + esc(formula) + '</span></div>' + (intro.lead ? '<p class="han" style="margin:8px 0 0; font-size:14px;">' + UI.inlinePy(intro.lead) + '</p>' : '') + '</div>' : '') +
          (explain ? '<div class="tl-lbl">توضیح قاعده</div><div class="tl-gline han" style="line-height:1.8; margin-bottom:12px; font-size:14px;">' + UI.inlinePy(explain) + '</div>' : '') +
          (mistake ? '<div class="tl-lbl">اشتباه رایج</div><div class="gp-mk" style="margin-bottom:14px;"><div class="gp-mk__why han">' + UI.inlinePy(mistake) + '</div></div>' : '') +
          (examples.length ? '<div class="tl-lbl">مثال‌های این بخش</div>' + examples.slice(0, 3).map(function(exItem) {
            return '<div class="tl-ex"><div class="tl-ex__txt"><div class="tl-ex__zh han">' + esc(exItem.ch) + '</div><div class="tl-ex__py py">' + esc(exItem.py || "") + '</div><div class="tl-ex__en">' + esc(exItem.fa || exItem.en || "") + '</div></div>' +
              '<button class="tl-disc" ' + act("unitPlaySay", { text: exItem.ch, py: exItem.py || "" }) + ' aria-label="شنیدن">' + icon("volume-2", 17) + '</button></div>';
          }).join("") : '') +
        '</div>';
      }

      // تلفظ و تُن‌ها
      if (intro.tones) {
        contentHtml = '<div class="u-intro-tones">' +
          intro.tones.map(function(t) {
            var sy = String(t.sample || "").split(/[\s(（]/)[0];
            return '<div class="u-it-card">' +
              '<div class="u-it-card__head">' +
                '<span class="u-it-mark">' + esc(t.mark) + '</span>' +
                '<h4>' + esc(t.name) + '</h4>' +
                '<span class="u-it-shape">' + esc(t.shape) + '</span>' +
              '</div>' +
              '<p class="u-it-desc">' + esc(t.desc) + '</p>' +
              '<div class="u-it-sample">' +
                '<span>نمونه: <b class="han">' + esc(t.sample) + '</b></span>' +
                (sy ? '<button class="u-audio-pill" ' + act("unitPlaySay", { text: sy, py: sy }) + ' aria-label="شنیدن">' + icon("volume-2", 16) + '</button>' : '') +
              '</div>' +
            '</div>';
          }).join("") +
        '</div>';
      }

      // نکات و راهنماها
      if (intro.tips || intro.features || intro.badges) {
        var items = intro.tips || intro.features || intro.badges;
        contentHtml += '<div class="u-intro-tips">' +
          items.map(function(tip) {
            return '<div class="u-tip-item">' + icon("sparkles", 18) + ' <span>' + esc(tip) + '</span></div>';
          }).join("") +
        '</div>';
      }

      return '<div class="col u-screen">' +
        '<div class="col__head u-head">' +
          '<button class="u-back-btn" ' + act("unitGoPath") + ' aria-label="مسیر">' + icon("arrow-right", 20) + '</button>' +
          '<div class="u-head__title-wrap">' +
            '<span class="u-head__tag">آموزش اولیه · زیرمجموعه ' + (secIdx + 1) + '</span>' +
            '<h2 class="u-head__title">' + esc(sec.titleFa) + '</h2>' +
          '</div>' +
        '</div>' +

        '<div class="col__body u-body">' +
          '<div class="u-intro-banner">' +
            '<div class="u-intro-badge">' + icon(sec.icon || "sparkles", 28) + '</div>' +
            '<h3>' + esc(intro.title || sec.titleFa) + '</h3>' +
            '<p>' + esc(intro.lead || sec.desc) + '</p>' +
          '</div>' +

          contentHtml +

          '<div class="u-intro-bottom">' +
            '<button class="hm-cta btn-primary" ' + act("unitStartMiniPath", { idx: secIdx }) + '>' +
              icon("play", 18) + ' ورود به مراحل (' + UnitSystem.faNum(sec.miniLessons.length) + ' مرحله)' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    },

    // ----------------------------------------------------
    // رندر مسیر خطی زیر ایستگاه‌ها (Mini Lesson Path View)
    // ----------------------------------------------------
    renderMiniLessonPath: function(sec, secIdx, prog) {
      var BASE = 'art/';
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var completedCount = (prog.miniProgress && prog.miniProgress[sec.id]) || 0;
      var totalCount = (sec.miniLessons && sec.miniLessons.length) || 4;

      function faNum(n) {
        return String(n).replace(/\d/g, function(d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
      }

      // آیکون‌های ۳ بعدی کاملاً اختصاصی و بدون هیچ تصویر تکراری برای هر بخش و هر مرحله
      function getStageIcon(secId, mIdx) {
        var miniObj = (sec.miniLessons && sec.miniLessons[mIdx]) || {};
        var mId = String(miniObj.id || "");
        if (/_vocab$/.test(mId)) return BASE + 'icon_stage1_books.png';
        if (/_context$/.test(mId)) return BASE + 'icon_stage2_grammar.png';
        if (/_practice$/.test(mId)) return (sec && sec.isCheckpoint) ? (BASE + 'icon_crown_3d.webp') : (BASE + 'icon_stage4_dialog.png');
        if (secId === 'vocab') {
          var vIcons = [
            BASE + 'icon_stage1_books.png',    // مرحله ۱: آموزش لغات (فلش‌کارت کتاب‌های چینی)
            BASE + 'word-card.webp',            // مرحله ۲: تشخیص معنی لغات (کارت ۳بعدی واژه)
            BASE + 'icon_stage2_grammar.png',   // مرحله ۳: تطبیق لغت و معنی (واژه‌نامه باز)
            BASE + 'lantern.webp',              // مرحله ۴: نوشتن کاراکتر Hanzi (فانوس خوشنویسی)
            BASE + 'icon_stage4_dialog.png',    // مرحله ۵: جمله‌سازی با لغات (حباب‌های گفتگو)
            BASE + 'icon_medal_3d.webp'         // مرحله ۶: مرور جامع واژگان (مدال طلایی اژدها)
          ];
          return vIcons[mIdx] || (BASE + 'icon_medal_3d.webp');
        }
        if (secId === 'grammar') {
          var gIcons = [
            BASE + 'icon_stage2_grammar.png',   // مرحله ۱: ساختار صحیح (کتاب گرامر)
            BASE + 'word-card.webp',            // مرحله ۲: جای خالی (کارت واژگان)
            BASE + 'icon_stage4_dialog.png',    // مرحله ۳: مرتب‌سازی (حباب‌های ساختار)
            BASE + 'icon_flame_3d.webp',        // مرحله ۴: خطایابی (شعله دقت)
            BASE + 'icon_trophy_3d.webp'        // مرحله ۵: تسلط بر گرامر (جام گرامر)
          ];
          return gIcons[mIdx] || (BASE + 'icon_trophy_3d.webp');
        }
        if (secId === 'pronunciation') {
          var pIcons = [
            BASE + 'icon_flame_3d.webp',        // مرحله ۱: تُن‌های ۱ تا ۴ (آهنگ و ارتعاش)
            BASE + 'icon_stage3_mic.png',       // مرحله ۲: تمایز آوایی (میکروفون استودیو)
            BASE + 'star3d.webp',               // مرحله ۳: تغییر تُن Sandhi (ستاره لحن)
            BASE + 'icon_medal_3d.webp'         // مرحله ۴: سنجش تلفظ (مدال تلفظ)
          ];
          return pIcons[mIdx] || (BASE + 'icon_medal_3d.webp');
        }
        if (secId === 'conversation') {
          var cIcons = [
            BASE + 'icon_stage3_mic.png',       // مرحله ۱: درک شنیداری (میکروفون و صدا)
            BASE + 'icon_stage4_dialog.png',    // مرحله ۲: گفت‌وگوهای کلاسی (حباب‌های مکالمه)
            BASE + 'icon_trophy_3d.webp'
          ];
          return cIcons[mIdx] || (BASE + 'icon_stage4_dialog.png');
        }
        var qIcons = [
          BASE + 'icon_medal_3d.webp',          // مرحله ۱: آزمون جامع
          BASE + 'icon_crown_3d.webp'           // مرحله ۲: چالش پایانی و تاج قهرمانی
        ];
        return qIcons[mIdx] || (BASE + 'icon_crown_3d.webp');
      }

      var h = '<div class="scr u-lesson-screen" style="padding:0 !important; margin:0; width:100%; height:100%; overflow-y:auto; overflow-x:hidden;">';
      h += '  <div class="practice-flow-view" data-no-swipe="true" style="overscroll-behavior-x: none !important;">';

      // پس‌زمینه دروازه پاگودا و اژدهای مهربان
      h += '    <img src="' + BASE + 'bg_sublesson_practice.jpg" alt="پس‌زمینه اژدها روی سردر پاگودا" class="practice-bg-art" decoding="async">';

      // دکمه بازگشت شناور به نمای ۴ جزیره درس (همانند صفحه قبل)
      h += '    <button class="screen-back-btn" data-act="unitGoPath" type="button" aria-label="بازگشت به درس">';
      h += '      <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
      h += '    </button>';

      // کلیدهای پین‌یین و فارسی شناور در سربرگ
      h += '    <div class="u-toggles-col u-toggles-col--sublevel">';
      h += '      <button class="u-py-toggle u-py-toggle--sublevel' + (UnitSystem.pyOn() ? '' : ' is-off') + '" data-act="unitTogglePy" type="button" aria-label="کلید پین‌یین" title="پین‌یین">پین‌یین</button>';
      h += '      <button class="u-py-toggle u-fa-toggle u-fa-toggle--sublevel' + (UnitSystem.faOn() ? '' : ' is-off') + '" data-act="unitToggleFa" type="button" aria-label="کلید ترجمه فارسی" title="فارسی">فارسی</button>';
      h += '    </div>';

      // بنر مشخصات بخش در بالای صفحه (مطابق تم و استایل شیشه‌ای صفحه ۴ جزیره)
      h += '    <div class="practice-top-banner">';
      h += '      <span class="practice-banner-tag">بخش ' + faNum(secIdx + 1) + ': ' + sec.titleFa + '</span>';
      h += '      <span class="practice-banner-title">' + unit.titleFa + ' (' + (unit.titleZh || '') + ') — ' + faNum(totalCount) + ' مرحله آموزشی</span>';
      h += '    </div>';

      // کانتینر خلوت، تنفس‌پذیر و شکیل کارت‌های چرخه یادگیری
      h += '    <div class="practice-cards-flow">';

      (sec.miniLessons || []).forEach(function(mini, mIdx) {
        var isDone = (mIdx < completedCount);
        var isCurrent = (mIdx === completedCount);
        var isLocked = !isDone && !isCurrent;
        var iconSrc = getStageIcon(sec.id, mIdx);
        
        // نشان و عنوان مرحله؛ بدون جملات توضیحی طولانی، کاملاً مینیمال و یکپارچه
        var subtitle = 'مرحله ' + faNum(mIdx + 1);
        var rawTitle = (mini && (mini.title || mini.titleFa)) || ('مرحله ' + faNum(mIdx + 1));
        var title = rawTitle.replace(/^(مرحله|زیر\s*ایستگاه)\s*[\d۰-۹]+[:\s·-]*/, '').trim() || subtitle;

        var exCount = (mini && mini.exercises && mini.exercises.length) || 4;
        var curCount = isDone ? exCount : 0;
        var pct = isDone ? 100 : 0;

        var cardCls = 'practice-stage-card';
        if (isDone) cardCls += ' practice-stage-card--done';
        else if (isCurrent) cardCls += ' practice-stage-card--active';
        else cardCls += ' practice-stage-card--locked';

        if (isLocked) {
          h += '      <div class="' + cardCls + '" data-act="unitLockedMiniToast" data-arg=\'{"num":' + (mIdx+1) + ',"name":"' + title + '"}\' role="button" tabindex="0">';
        } else {
          h += '      <div class="' + cardCls + '" data-act="unitStartExercise" data-arg=\'{"secIdx":' + secIdx + ',"miniIdx":' + mIdx + '}\' role="button" tabindex="0">';
        }

        // باکس آیکون ۳ بعدی اختصاصی با نور ملایم
        h += '        <div class="practice-stage-icon-box">';
        h += '          <img src="' + iconSrc + '" alt="' + title + '" class="practice-stage-icon-img">';
        h += '        </div>';

        // محتوای متنی تمیز و بدون شلوغی
        h += '        <div class="practice-stage-info">';
        h += '          <div class="stage-subtitle-text">' + subtitle + '</div>';
        h += '          <div class="stage-main-title">' + title + '</div>';
        h += '          <div class="stage-progress-row">';
        h += '            <div class="stage-progress-bar-mini">';
        h += '              <div class="fill" style="width: ' + pct + '%;"></div>';
        h += '            </div>';
        h += '            <span class="stage-progress-count-text">' + (isDone ? 'تکمیل شد ✓' : faNum(curCount) + ' / ' + faNum(exCount)) + '</span>';
        h += '          </div>';
        h += '        </div>';

        // نشان وضعیت مینیمال (تیک سبز درخشان، دکمه شروع یا قفل نقره‌ای)
        h += '        <div class="practice-stage-badge">';
        if (isDone) {
          h += '          <div class="badge-checkmark-green"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
        } else if (isCurrent) {
          h += '          <div class="badge-start-active" title="شروع">›</div>';
        } else {
          h += '          <div class="badge-lock-silver"><svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></div>';
        }
        h += '        </div>';
        h += '      </div>';
      });

      // کارت هدیه پیشرفت ایستگاه (فقط پس از ۱۰۰٪ کامل شدن مراحل پاداش اهدا می‌شود)
      var isAllCompleted = (completedCount >= totalCount);
      prog.claimedGifts = prog.claimedGifts || {};
      var isClaimed = !!prog.claimedGifts[sec.id];
      var remainCount = totalCount - completedCount;

      var giftCardCls = 'practice-milestone-gift-card';
      if (!isAllCompleted) giftCardCls += ' is-locked-gift';
      if (isClaimed) giftCardCls += ' is-claimed-gift';

      h += '      <div class="' + giftCardCls + '" data-act="unitClaimStationGift" data-arg=\'{"secId":"' + sec.id + '","done":' + (isAllCompleted ? 1 : 0) + ',"claimed":' + (isClaimed ? 1 : 0) + ',"remain":' + remainCount + '}\' role="button" tabindex="0">';
      h += '        <div class="gift-card-star"><img src="' + BASE + 'star3d.webp" class="mini-3d-star" style="width:28px; height:28px;" alt="Star"></div>';
      h += '        <div class="gift-card-center-text">';
      h += '          <div class="gift-card-title">پیشرفت ایستگاه</div>';
      if (isClaimed) {
        h += '          <div class="gift-card-fraction" style="color:#0FA968;font-weight:700;">✓ پاداش دریافت شد (+۳۰ XP)</div>';
      } else if (isAllCompleted) {
        h += '          <div class="gift-card-fraction" style="color:#F59E0B;font-weight:800;">دریافت جایزه (+۳۰ XP)! 🎁</div>';
      } else {
        h += '          <div class="gift-card-fraction">' + faNum(completedCount) + ' / ' + faNum(totalCount) + ' (برای دریافت کامل کنید)</div>';
      }
      h += '        </div>';
      h += '        <div class="gift-card-img-box">';
      h += '          <img src="' + BASE + 'icon_stage_gift.png" alt="جعبه هدیه" class="gift-card-img">';
      h += '        </div>';
      h += '      </div>';

      h += '    </div>';
      h += '  </div>';
      h += '</div>';
      return h;
    },

        renderBadgeHtml: function(sec, mini, ex) {
      var esc = UI.esc, icon = UI.icon;
      var secId = (sec && sec.id) || "";
      var miniId = (mini && mini.id) || "";
      var exType = (ex && ex.type) || "";
      var widget = (ex && ex.widget) || "";
      var skillTag = (ex && ex.skillTag) || "";

      var b = { cat: "تمرین", name: "پرسش و پاسخ", icon: "help-circle" };

      if (widget || skillTag) {
        var skillMap = {
          listening: { cat: "شنیداری", icon: "headphones" },
          vocabulary: { cat: "واژگان", icon: "book-open" },
          grammar: { cat: "گرامر", icon: "cpu" },
          dialogue_or_speaking: { cat: "مکالمه و گفتار", icon: "message-circle" }
        };
        var wNames = {
          W1_VOCAB_SELECT: "انتخاب واژه و معنا",
          W2_AUDIO_DRILL: "تمرین شنیداری و آوا",
          W3_SENTENCE_BUILD: "جمله‌سازی پازلی",
          W4_FILL_BLANK: "تکمیل جای خالی",
          W5_DIALOGUE_REPLY: "پاسخ منطقی مکالمه",
          W6_PICTURE_MATCH: "تطبیق تصویر و بافت",
          W7_SHADOW_SPEAK: "تکرار و سایه‌خوانی",
          VOCAB_CARD: "واژگان جدید (生词)",
          CONTEXT_CARD: "مکالمه و متن",
          GRAMMAR_CARD: "نکته دستوری"
        };
        var sm = skillMap[skillTag] || { cat: "مهارت", icon: "sparkles" };
        b = {
          cat: (sec && sec.isCheckpoint) ? "آزمون جامع" : sm.cat,
          name: wNames[widget] || "تمرین تعاملی",
          icon: (sec && sec.isCheckpoint) ? "award" : sm.icon
        };
      } else if (secId === "vocab" || /_v\d+$/.test(miniId) || /v\d+_/.test(miniId)) {
        if (exType === "flash") b = { cat: "واژگان", name: "کارت یادگیری", icon: "book-open" };
        else if (exType === "match") b = { cat: "واژگان", name: "تطبیق جفت‌ها", icon: "shuffle" };
        else if (exType === "order") b = { cat: "واژگان", name: "جمله‌سازی", icon: "layers" };
        else if (exType === "write") b = { cat: "واژگان", name: "نوشتن کاراکتر", icon: "pen-tool" };
        else if (ex && (ex.subtype === "fa_to_zh" || (ex.q && ex.q.indexOf("معادل چینی") >= 0))) b = { cat: "واژگان", name: "معادل چینی", icon: "globe" };
        else b = { cat: "واژگان", name: "تشخیص معنی", icon: "check-circle" };
      } else if (secId === "grammar" || /^g_/.test(miniId)) {
        if (exType === "gram") b = { cat: "گرامر", name: "آموزش قاعده", icon: "book" };
        else if (exType === "order") b = { cat: "گرامر", name: "مرتب‌سازی جمله", icon: "layers" };
        else if (ex && (ex.subtype === "true_false" || (ex.opts && ex.opts.length === 2 && ex.opts[0].indexOf("درست") >= 0))) b = { cat: "گرامر", name: "درستی یا نادرستی", icon: "help-circle" };
        else b = { cat: "گرامر", name: "جای خالی", icon: "edit-3" };
      } else if (secId === "pronunciation" || /_p\d+$/.test(miniId) || /p\d+_/.test(miniId)) {
        if (exType === "tone_pick") b = { cat: "تلفظ", name: "تشخیص تُن", icon: "volume-2" };
        else if (exType === "audio_choice") b = { cat: "تلفظ", name: "انتخاب از صدا", icon: "headphones" };
        else if (exType === "repeat") b = { cat: "تلفظ", name: "تکرار و تلفظ", icon: "mic" };
        else b = { cat: "تلفظ", name: "تمرین آوایی", icon: "volume-1" };
      } else if (secId === "conversation" || secId === "reading" || /_c\d+$/.test(miniId) || /c\d+_/.test(miniId)) {
        if (exType === "listening_q") b = { cat: "مکالمه", name: "درک شنیداری", icon: "headphones" };
        else if (exType === "reading_q") b = { cat: "خواندن", name: "درک مطلب متن", icon: "file-text" };
        else b = { cat: "مکالمه", name: "گفت‌وگو", icon: "message-circle" };
      } else if (secId === "quiz" || /_q\d+$/.test(miniId) || /q\d+_/.test(miniId)) {
        b = { cat: "آزمون", name: "سنجش آموخته‌ها", icon: "award" };
      }

      return '<div class="u-ex-badge" dir="rtl">' +
        '<span class="u-ex-badge__icon">' + icon(b.icon, 13) + '</span>' +
        '<span class="u-ex-badge__cat">' + esc(b.cat) + '</span>' +
        '<span class="u-ex-badge__sep">·</span>' +
        '<span class="u-ex-badge__name">' + esc(b.name) + '</span>' +
      '</div>';
    },

    getStandardPrompt: function(ex, sec, mini) {
      if (!ex) return "گزینه درست را انتخاب کنید.";
      if (ex.widget && (ex.q || ex.prompt)) return String(ex.q || ex.prompt).trim();
      var q = String(ex.q || "").trim();
      var p = String(ex.prompt || "").trim();
      
      var cleanShorts = [
        "معنی این واژه چیست؟",
        "معادل چینی این واژه کدام است؟",
        "واژه‌های مرتبط را وصل کنید.",
        "جای خالی را کامل کنید.",
        "جمله را مرتب کنید.",
        "آیا این جمله از نظر گرامری درست است؟",
        "تُن صحیح را انتخاب کنید.",
        "کدام گزینه را شنیدید؟",
        "پاسخ مناسب را انتخاب کنید.",
        "متن را بخوانید و پاسخ دهید.",
        "به گفت‌وگو گوش دهید و پاسخ دهید.",
        "به صدا گوش دهید و تکرار کنید."
      ];
      if (cleanShorts.indexOf(q) >= 0) return q;
      if (cleanShorts.indexOf(p) >= 0) return p;

      var secId = (sec && sec.id) || "";
      var exType = ex.type || "";

      if (exType === "flash") return "واژه را یاد بگیرید.";
      if (exType === "match") return "واژه‌های مرتبط را وصل کنید.";
      if (exType === "order") return "جمله را مرتب کنید.";
      if (exType === "tone_pick") return "تُن صحیح را انتخاب کنید.";
      if (exType === "audio_choice") return "کدام گزینه را شنیدید؟";
      if (exType === "repeat") return "به صدا گوش دهید و تکرار کنید.";
      if (exType === "reading_q") return "متن را بخوانید و پاسخ دهید.";
      if (exType === "listening_q") return "به گفت‌وگو گوش دهید و پاسخ دهید.";

      if (q.indexOf("معادل چینی") >= 0 || ex.subtype === "fa_to_zh") return "معادل چینی این واژه کدام است؟";
      if (q.indexOf("معنی") >= 0 && (ex.hanzi || ex.audio || secId === "vocab")) return "معنی این واژه چیست؟";
      if (q.indexOf("جای خالی") >= 0 || ex.sentenceZh || q.indexOf("__") >= 0) return "جای خالی را کامل کنید.";
      if (q.indexOf("آیا این جمله") >= 0 || (ex.opts && ex.opts.length === 2 && ex.opts[0].indexOf("درست") >= 0)) return "آیا این جمله از نظر گرامری درست است؟";
      if (q.indexOf("پاسخ مناسب") >= 0) return "پاسخ مناسب را انتخاب کنید.";

      var line1 = q.split('\n')[0].replace(/\s*\([a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s·'—–-]+\)/g, "").replace(/«[^»]+»/g, "").trim();
      if (line1 && line1.length <= 45 && !/[A-Z]/.test(line1)) return line1;

      return "گزینه درست را انتخاب کنید.";
    },

    renderExercise: function(sec, secIdx, mini, miniIdx, exIdx) {
      var esc = UI.esc, act = UI.act, icon = UI.icon;
      var runner = UnitSystem.runner;
      var ex = mini.exercises[exIdx];
      var pyMap = UnitSystem.unitPyMap(UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"]);
      var pyOn = UnitSystem.pyOn();
      if (!ex) return '<div class="empty">تمرین یافت نشد.</div>';

      var totalEx = mini.exercises.length;
      var pct = Math.round(((exIdx + 1) / totalEx) * 100);

      var exContent = "";
      var badgeHtml = UnitSystem.renderBadgeHtml(sec, mini, ex);
      var promptText = UnitSystem.getStandardPrompt(ex, sec, mini);

      // 1. چندگزینه‌ای (Choice) + ویجت‌های W1, W2, W4, W5, W6
      if (ex.type === "choice" || ex.type === "audio_choice" || ex.type === "tone_pick" || ex.type === "fill_blank" || ex.type === "dialogue_reply" || ex.type === "picture_match") {
        var exKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var shuf = UnitSystem.getShuffledOpts(ex, exKey);
        var displayOpts = shuf.opts;
        var isFb = !!runner.feedbackState;
        var isGrid2 = (ex.type === "tone_pick" || displayOpts.length === 2 || (displayOpts.length === 4 && displayOpts.every(function(o) { return String(o).length <= 12; })));

        var optsHtml = displayOpts.map(function(opt, oIdx) {
          var isPicked = runner.userAnswers[exIdx] === oIdx;
          var isCorrectAns = (oIdx === shuf.ans);
          var isWrongPicked = isFb && isPicked && !isCorrectAns;

          var cls = "u-choice-btn";
          if (isFb) {
            if (isCorrectAns) cls += " is-correct";
            else if (isWrongPicked) cls += " is-wrong";
            else cls += " is-disabled";
          } else if (isPicked) {
            cls += " is-picked";
          }
          
          var indContent = "";
          if (isFb && isCorrectAns) {
            indContent = icon("check", 14);
          } else if (isFb && isWrongPicked) {
            indContent = icon("x", 14);
          } else if (isPicked) {
            indContent = icon("check", 14);
          } else {
            indContent = String.fromCharCode(65 + oIdx);
          }

          return '<button class="' + cls + '" ' + (isFb ? 'disabled' : act("unitPickChoice", { idx: oIdx })) + '>' +
            '<span class="u-choice-indicator">' + indContent + '</span>' +
            uOptInner(opt, pyMap, pyOn) +
          '</button>';
        }).join("");

        // ساخت کارت محتوای مرکزی (Hero Box)
        var heroHtml = "";

        // الف) سوال درستی/نادرستی گرامر (Grammar Check / True-False)
        if (ex.subtype === "true_false" || (ex.opts && ex.opts.length === 2 && ex.opts[0].indexOf("درست") >= 0)) {
          var tfZh = ex.sentenceZh || ex.hanzi || (ex.q && ex.q.split('\n')[1]) || "";
          var tfPy = ex.sentencePy || ex.pinyin || "";
          var tfFa = ex.sentenceFa || ex.fa || "";
          heroHtml = '<div class="u-hero-center">' +
            (tfZh ? '<div class="u-hero-sentence-zh han" dir="ltr">' + esc(tfZh) + '</div>' : '') +
            (tfPy && UnitSystem.pyOn() ? '<div class="u-hero-sentence-py py" dir="ltr">' + esc(tfPy) + '</div>' : '') +
            (tfFa && UnitSystem.faOn() ? '<div class="u-hero-sentence-fa" dir="rtl">(' + esc(tfFa) + ')</div>' : '') +
          '</div>';
        }
        // ب) سوال جای خالی گرامر (Fill in the Blank)
        else if (ex.sentenceZh || (ex.q && ex.q.indexOf("__") >= 0)) {
          var rawZh = ex.sentenceZh || (ex.q && ex.q.indexOf('\n') >= 0 ? ex.q.split('\n')[1] : ex.q) || "";
          var blankHtml = esc(rawZh).replace(/_{2,}/g, '<span class="u-blank-slot">_____</span>');
          if (blankHtml.indexOf("u-blank-slot") < 0) {
            blankHtml = esc(rawZh) + ' <span class="u-blank-slot">_____</span>';
          }
          var sPy = ex.sentencePy || ex.pinyin || (UnitSystem.resolvePy ? UnitSystem.resolvePy(rawZh.replace(/_{2,}/g, " ")) : "") || "";
          var sFa = ex.sentenceFa || ex.fa || ex.exFa || "";
          heroHtml = '<div class="u-hero-center">' +
            '<div class="u-hero-sentence-zh han" dir="ltr">' + blankHtml + '</div>' +
            (sPy && UnitSystem.pyOn() ? '<div class="u-hero-sentence-py py" dir="ltr">' + esc(sPy) + '</div>' : '') +
            (sFa && UnitSystem.faOn() && sFa ? '<div class="u-hero-sentence-fa" dir="rtl">(' + esc(sFa) + ')</div>' : '') +
          '</div>';
        }
        // ج) سوال فارسی به چینی (واژه فارسی در مرکز)
        else if (ex.subtype === "fa_to_zh" || (ex.fa && !ex.hanzi && !ex.zh) || (ex.q && ex.q.indexOf("معادل چینی") >= 0)) {
          var faWord = ex.fa || ex.targetFa || (ex.q && ex.q.match(/«([^»]+)»/) ? ex.q.match(/«([^»]+)»/)[1] : "") || "";
          heroHtml = '<div class="u-hero-center">' +
            '<div class="u-hero-fa" dir="rtl">' + esc(faWord) + '</div>' +
          '</div>';
        }
        // د) سوال تشخیص تُن آوایی (Tone Pick)
        else if (ex.type === "tone_pick") {
          var tpSyllable = ex.syllable || (ex.pinyin ? ex.pinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, function(c) {
            return { "ā":"a","á":"a","ǎ":"a","à":"a","ē":"e","é":"e","ě":"e","è":"e","ī":"i","í":"i","ǐ":"i","ì":"i","ō":"o","ó":"o","ǒ":"o","ò":"o","ū":"u","ú":"u","ǔ":"u","ù":"u","ǖ":"v","ǘ":"v","ǚ":"v","ǜ":"v" }[c] || c;
          }) : "") || "";
          heroHtml = '<div class="u-hero-center">' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: ex.audio || ex.pinyin, py: ex.pinyin || ex.audio }) + ' aria-label="پخش صدا">' + icon("volume-2", 20) + ' <span>شنیدن صدا</span></button>' +
            (tpSyllable ? '<div class="u-hero-py py" dir="ltr" style="font-size:22px; font-weight:800; margin-top:8px;">' + esc(tpSyllable) + '</div>' : '') +
          '</div>';
        }
        // هـ) سوال انتخاب از روی صدا (Audio Choice / W2_AUDIO_DRILL)
        else if (ex.type === "audio_choice") {
          heroHtml = '<div class="u-hero-center">' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: ex.audio || ex.hanzi, py: ex.pinyin || ex.audio }) + ' aria-label="پخش صدا">' + icon("volume-2", 20) + ' <span>شنیدن صدا</span></button>' +
            (ex.textFa && UnitSystem.faOn() ? '<div class="u-hero-sentence-fa" dir="rtl" style="margin-top:8px;">' + esc(ex.textFa) + '</div>' : '') +
          '</div>';
        }
        // هـ۲) پاسخ منطقی مکالمه (W5_DIALOGUE_REPLY)
        else if (ex.type === "dialogue_reply") {
          heroHtml = '<div class="u-hero-center">' +
            (ex.hanzi ? '<div class="u-hero-sentence-zh han" dir="ltr">' + esc(ex.hanzi) + '</div>' : '') +
            (ex.pinyin && pyOn ? '<div class="u-hero-sentence-py py" dir="ltr">' + esc(ex.pinyin) + '</div>' : '') +
            (ex.textFa && UnitSystem.faOn() ? '<div class="u-hero-sentence-fa" dir="rtl">(' + esc(ex.textFa) + ')</div>' : '') +
            (ex.audio || ex.hanzi ? '<button class="u-big-audio" style="margin-top:10px;" ' + act("unitPlaySay", { text: ex.audio || ex.hanzi, py: ex.pinyin || "" }) + ' aria-label="پخش مکالمه">' + icon("volume-2", 18) + ' <span>شنیدن جمله</span></button>' : '') +
          '</div>';
        }
        // هـ۳) تطبیق تصویر / پاراگراف (W6_PICTURE_MATCH)
        else if (ex.type === "picture_match") {
          heroHtml = '<div class="u-hero-center">' +
            '<div class="u-w6-card">' +
              (ex.mediaPlaceholder ? '<div style="font-size:11px;font-weight:800;color:#047857;margin-bottom:6px;">🖼️ ' + esc(ex.mediaPlaceholder) + '</div>' : '') +
              (ex.hanzi ? '<div class="u-hero-sentence-zh han" dir="ltr" style="text-align:center;">' + esc(ex.hanzi) + '</div>' : '') +
              (ex.pinyin && pyOn ? '<div class="u-hero-sentence-py py" dir="ltr" style="text-align:center;">' + esc(ex.pinyin) + '</div>' : '') +
              (ex.textFa && UnitSystem.faOn() ? '<div class="u-hero-sentence-fa" dir="rtl" style="text-align:center;margin-top:6px;">' + esc(ex.textFa) + '</div>' : '') +
              (ex.hanzi ? '<div style="text-align:center;margin-top:10px;"><button class="u-big-audio" ' + act("unitPlaySay", { text: ex.hanzi, py: ex.pinyin || "" }) + ' aria-label="شنیدن">' + icon("volume-2", 16) + ' <span>شنیدن متن</span></button></div>' : '') +
            '</div>' +
          '</div>';
        }
        // و) سوال چینی به فارسی (کاراکتر چینی بزرگ در مرکز همراه با پین‌یین)
        else {
          var sayZh = ex.hanzi || ex.char || ex.zh || UnitSystem.zhOf(ex.audio) || UnitSystem.zhOf(ex.q) || "";
          var pm = String(ex.q || "").match(/\(([^()]{1,24})\)/);
          var cPy = ex.pinyin || ex.py || (pm && /^[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s·']+$/.test(pm[1]) ? pm[1] : "") || (UnitSystem.resolvePy ? UnitSystem.resolvePy(sayZh) : "") || "";
          if (sayZh) {
            heroHtml = '<div class="u-hero-center">' +
              '<div class="u-hero-hanzi han" dir="ltr">' + esc(sayZh) + '</div>' +
              (cPy && pyOn ? '<div class="u-hero-py py" dir="ltr">' + esc(cPy) + '</div>' : '') +
              '<button class="u-big-audio" ' + act("unitPlaySay", { text: sayZh, py: cPy }) + ' aria-label="پخش تلفظ">' + icon("volume-2", 18) + ' <span>شنیدن تلفظ</span></button>' +
            '</div>';
          }
        }

        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          heroHtml +
          '<div class="u-ex-options' + (isGrid2 ? ' u-ex-options--grid2' : '') + '">' + optsHtml + '</div>' +
        '</div>';
      }

      // 2. تطبیق جفت‌ها (Match Pairs) — ستون چپ چینی LTR و ستون راست فارسی RTL
      else if (ex.type === "match") {
        var matched = runner.matchedPairs || [];
        var leftSelected = runner.selectedMatchLeft;
        var pyMapM = UnitSystem.unitPyMap(UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"]);

        runner._matchOrders = runner._matchOrders || {};
        var matchOrderKey = (runner.unitKey || "") + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + exIdx;
        var order = runner._matchOrders[matchOrderKey];
        if (!order || order.length !== ex.pairs.length) {
          order = [];
          var nPairs = ex.pairs.length;
          for (var oi = 0; oi < nPairs; oi++) order.push(oi);

          if (nPairs > 1) {
            var deranged = false;
            for (var attempt = 0; attempt < 100; attempt++) {
              for (var sh = nPairs - 1; sh > 0; sh--) {
                var rk = Math.floor(Math.random() * (sh + 1));
                var tmp = order[sh]; order[sh] = order[rk]; order[rk] = tmp;
              }
              var isStrict = true;
              for (var ci = 0; ci < nPairs; ci++) {
                if (order[ci] === ci) { isStrict = false; break; }
              }
              if (isStrict) { deranged = true; break; }
            }
            if (!deranged) {
              order = [];
              for (var si = 0; si < nPairs; si++) {
                order.push((si + 1) % nPairs);
              }
            }
          }
          runner._matchOrders[matchOrderKey] = order;
        }

        var wrong = runner._uMatchWrong || null;
        var leftTiles = ex.pairs.map(function(p, i) {
          var isDone = matched.indexOf(i) >= 0;
          var isSel = leftSelected === i;
          var isWr = wrong && wrong.l === i;
          var cls = "u-tile" + (isDone ? " is-matched" : isWr ? " is-wrong" : isSel ? " is-selected" : "");
          var py = (pyMapM && pyMapM[p.zh]) || (UnitSystem.resolvePy ? UnitSystem.resolvePy(p.zh) : "") || "";
          return '<button class="' + cls + '" dir="ltr" ' + (isDone ? "" : act("unitMatchLeft", { idx: i })) + '>' +
            '<b class="han" dir="ltr">' + esc(p.zh) + '</b>' +
            (py && UnitSystem.pyOn() ? '<small class="py" dir="ltr">' + esc(py) + '</small>' : '') +
          '</button>';
        }).join("");

        var rightTiles = order.map(function(pi) {
          var p = ex.pairs[pi];
          var isDone = matched.indexOf(pi) >= 0;
          var isSel = runner.selectedMatchRight === pi;
          var isWr = wrong && wrong.r === pi;
          var cls = "u-tile" + (isDone ? " is-matched" : isWr ? " is-wrong" : isSel ? " is-selected" : "");
          return '<button class="' + cls + '" dir="rtl" ' + (isDone ? "" : act("unitMatchRight", { idx: pi })) + '>' +
            '<span dir="rtl">' + esc(p.fa) + '</span>' +
          '</button>';
        }).join("");

        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-match-grid">' +
            '<div class="u-match-col--zh">' + leftTiles + '</div>' +
            '<div class="u-match-col--fa">' + rightTiles + '</div>' +
          '</div>' +
        '</div>';
      }

      // 3. مرتب‌سازی کلمات (Sentence Order)
      else if (ex.type === "order") {
        var placed = runner.selectedTiles || [];
        var pyMapO = UnitSystem.unitPyMap(UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"]);
        var pyOnO = UnitSystem.pyOn();
        var targetFa = ex.fa || ex.targetFa || (ex.prompt && ex.prompt.match(/«([^»]+)»/) ? ex.prompt.match(/«([^»]+)»/)[1] : "") || "";

        var slotsHtml = placed.map(function(tileIdx, slotIdx) {
          var placedWord = ex.tiles[tileIdx];
          var placedPy = (pyMapO && pyMapO[placedWord]) || (UnitSystem.resolvePy ? UnitSystem.resolvePy(placedWord) : "") || "";
          return '<button class="u-order-tile is-placed" dir="ltr" ' + act("unitOrderRemove", { slot: slotIdx }) + '>' +
            '<b class="han" dir="ltr">' + esc(placedWord) + '</b>' +
            (placedPy && pyOnO ? '<small class="py" dir="ltr">' + esc(placedPy) + '</small>' : '') +
          '</button>';
        }).join("");

        var bankHtml = ex.tiles.map(function(word, idx) {
          var isUsed = placed.indexOf(idx) >= 0;
          var py = (pyMapO && pyMapO[word]) || (UnitSystem.resolvePy ? UnitSystem.resolvePy(word) : "") || "";
          return '<button class="u-order-tile' + (isUsed ? " is-used" : "") + '" dir="ltr" ' + (isUsed ? "" : act("unitOrderAdd", { idx: idx })) + '>' +
            '<b class="han" dir="ltr">' + esc(word) + '</b>' +
            (py && pyOnO ? '<small class="py" dir="ltr">' + esc(py) + '</small>' : '') +
          '</button>';
        }).join("");

        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          (targetFa ? '<div class="u-order-target-ref" dir="rtl">معنی: «' + esc(targetFa) + '»</div>' : '') +
          '<div class="u-order-slots" dir="ltr">' + (slotsHtml || '<span class="u-order-placeholder">کلمات را اینجا بچینید...</span>') + '</div>' +
          '<div class="u-order-bank" dir="ltr">' + bankHtml + '</div>' +
        '</div>';
      }

      // 4. تمرین شنیداری مکالمه (Listening Dialogue)
      else if (ex.type === "listening_q") {
        var exKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var shuf = UnitSystem.getShuffledOpts(ex, exKey);
        var displayOpts = shuf.opts;
        var isFb = !!runner.feedbackState;

        var optsHtml = displayOpts.map(function(opt, oIdx) {
          var isPicked = runner.userAnswers[exIdx] === oIdx;
          var isCorrectAns = (oIdx === shuf.ans);
          var isWrongPicked = isFb && isPicked && !isCorrectAns;

          var cls = "u-choice-btn";
          if (isFb) {
            if (isCorrectAns) cls += " is-correct";
            else if (isWrongPicked) cls += " is-wrong";
            else cls += " is-disabled";
          } else if (isPicked) {
            cls += " is-picked";
          }

          var indContent = (isFb && isCorrectAns) ? icon("check", 14) : (isFb && isWrongPicked) ? icon("x", 14) : isPicked ? icon("check", 14) : String.fromCharCode(65 + oIdx);

          return '<button class="' + cls + '" ' + (isFb ? 'disabled' : act("unitPickChoice", { idx: oIdx })) + '>' +
            '<span class="u-choice-indicator">' + indContent + '</span>' +
            uOptInner(opt, pyMap, pyOn) +
          '</button>';
        }).join("");

        var revealedHtml = runner.revealedAudioText 
          ? '<div class="u-revealed-text" style="margin-top:8px; direction:ltr;"><b class="han" dir="ltr">' + esc(ex.revealZh || "") + '</b> <span class="py" dir="ltr">' + esc(ex.revealPy || "") + '</span></div>'
          : '<button class="u-reveal-btn" style="margin-top:8px; font-size:12.5px; color:#059669; background:transparent; border:none; cursor:pointer;" ' + act("unitRevealListeningText") + '>' + icon("eye", 14) + ' مشاهده متن صوت</button>';

        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-hero-center">' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: ex.revealZh || ex.audio, py: ex.revealPy || ex.audio }) + ' aria-label="پخش صوت">' + icon("headphones", 20) + ' <span>پخش گفت‌وگو</span></button>' +
            revealedHtml +
          '</div>' +
          (ex.q ? '<div class="u-dialogue-subq" dir="rtl" style="font-size:15px; font-weight:800; color:#334155; margin-bottom:12px; text-align:right;">' + esc(ex.q) + '</div>' : '') +
          '<div class="u-ex-options">' + optsHtml + '</div>' +
        '</div>';
      }

      // 5. درک مطلب خواندن متن (Reading Passage)
      else if (ex.type === "reading_q") {
        var exKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var shuf = UnitSystem.getShuffledOpts(ex, exKey);
        var displayOpts = shuf.opts;
        var isFb = !!runner.feedbackState;

        var optsHtml = displayOpts.map(function(opt, oIdx) {
          var isPicked = runner.userAnswers[exIdx] === oIdx;
          var isCorrectAns = (oIdx === shuf.ans);
          var isWrongPicked = isFb && isPicked && !isCorrectAns;

          var cls = "u-choice-btn";
          if (isFb) {
            if (isCorrectAns) cls += " is-correct";
            else if (isWrongPicked) cls += " is-wrong";
            else cls += " is-disabled";
          } else if (isPicked) {
            cls += " is-picked";
          }

          var indContent = (isFb && isCorrectAns) ? icon("check", 14) : (isFb && isWrongPicked) ? icon("x", 14) : isPicked ? icon("check", 14) : String.fromCharCode(65 + oIdx);

          return '<button class="' + cls + '" ' + (isFb ? 'disabled' : act("unitPickChoice", { idx: oIdx })) + '>' +
            '<span class="u-choice-indicator">' + indContent + '</span>' +
            uOptInner(opt, pyMap, pyOn) +
          '</button>';
        }).join("");

        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-passage-box">' +
            '<div class="u-passage-head">' +
              '<span class="u-passage-badge">' + icon("file-text", 14) + ' متن مکالمه</span>' +
              '<button class="u-big-audio" style="margin:0; padding:6px 14px; font-size:12px;" ' + act("unitPlaySay", { text: ex.textZh || "", py: ex.textPy || "" }) + ' aria-label="پخش متن">' + icon("volume-2", 14) + ' <span>شنیدن متن</span></button>' +
            '</div>' +
            '<div class="u-passage-zh han" dir="ltr">' + esc(ex.textZh) + '</div>' +
            (UnitSystem.pyOn() && ex.textPy ? '<div class="u-passage-py py" dir="ltr">' + esc(ex.textPy) + '</div>' : '') +
          '</div>' +
          '<div class="u-passage-subq" dir="rtl" style="font-size:15.5px; font-weight:800; color:#0F172A; margin: 0 0 14px 0; text-align:right;">' + esc(ex.q) + '</div>' +
          '<div class="u-ex-options">' + optsHtml + '</div>' +
        '</div>';
      }

      // 0. فلش‌کارت آموزش واژه (Flashcard) — در New HSK نمایش پین‌یین کنار صوت همیشه فعال است
      else if (ex.type === "flash") {
        var flZh = ex.hanzi || "",
          flPy = ex.py || "",
          flFa = ex.fa || "";
        var showFlashPy = !!(flPy && (ex.alwaysShowPinyin || UnitSystem.pyOn()));
        var corePill = "";
        if (typeof ex.isCore === "boolean") {
          corePill = '<div class="u-core-pill ' + (ex.isCore ? 'is-core' : 'is-practice') + '">' +
            (ex.isCore ? '★ واژه اصلی (مرور لایتنر)' : '◇ واژه تمرینی آوا/ساختار') +
            (ex.pos ? ' · ' + esc(ex.pos) : '') +
          '</div>';
        }
        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-hero-center">' +
            corePill +
            '<div class="u-hero-hanzi han" dir="ltr">' + esc(flZh) + '</div>' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: flZh, py: flPy }) + ' aria-label="شنیدن تلفظ">' + icon("volume-2", 18) + ' <span>شنیدن تلفظ</span></button>' +
            (showFlashPy ? '<div class="u-hero-py py" dir="ltr">' + esc(flPy) + '</div>' : '') +
            (flFa && UnitSystem.faOn() ? '<div class="u-hero-fa" dir="rtl">' + esc(flFa) + '</div>' : '') +
            (ex.ex ? '<div class="u-fc__ex" style="margin-top:12px; padding:10px 14px; background:#F1F5F9; border-radius:14px; width:100%; box-sizing:border-box;"><div class="han" dir="ltr" style="font-size:16px; font-weight:700; color:#0F172A; text-align:center;">' + esc(ex.ex) + '</div>' + (ex.exFa && UnitSystem.faOn() ? '<div style="font-size:13px; color:#64748B; font-weight:700; direction:rtl; text-align:center; margin-top:4px;">' + esc(ex.exFa) + '</div>' : '') + '</div>' : '') +
          '</div>' +
        '</div>';
      }

      // 0a. کارت مکالمه یا متن (Context Card - New HSK)
      else if (ex.type === "context_card") {
        var ctxLines = Array.isArray(ex.lines) ? ex.lines : [];
        var ctxTitle = ex.mode === "text" ? "متن و نکته آموزشی" : "مکالمه این بخش";
        exContent = '<div class="u-ex-card" style="direction:rtl; text-align:right;">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(ctxTitle) + '</h3>' +
          '<div class="u-context-card">' +
            ctxLines.map(function(line) {
              var lZh = line.hanzi || "";
              var lPy = line.pinyin || "";
              var lFa = line.meaning_fa || "";
              return '<div class="u-dialogue-line">' +
                '<div style="flex:1; min-width:0;">' +
                  (line.speaker ? '<span class="u-dialogue-speaker">' + esc(line.speaker) + '</span>' : '') +
                  '<div class="u-dialogue-zh han" dir="ltr">' + esc(lZh) + '</div>' +
                  (lPy && UnitSystem.pyOn() ? '<div class="u-dialogue-py py" dir="ltr">' + esc(lPy) + '</div>' : '') +
                  (lFa && UnitSystem.faOn() ? '<div class="u-dialogue-fa" dir="rtl">' + esc(lFa) + '</div>' : '') +
                '</div>' +
                (lZh ? '<button class="tl-disc" ' + act("unitPlaySay", { text: lZh, py: lPy }) + ' aria-label="شنیدن جمله">' + icon("volume-2", 17) + '</button>' : '') +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>';
      }

      // 0b. کارت آموزش کامل قاعده گرامری (Grammar Rule)
      else if (ex.type === "gram") {
        var mark = ex.mark || UnitSystem.zhOf(ex.rule) || "";
        var ruleTitle = ex.rule || ex.titleFa || "";
        var catFa = ex.catFa || "دستور زبان";
        var formula = ex.formula || ex.pattern || "";
        var oneLine = ex.oneLine || ex.desc || "";
        var explain = ex.explain || "";
        var mistake = ex.mistake || "";
        var compare = ex.compare || [];
        var examples = ex.examples || [];
        if (!examples.length && ex.ex) {
          examples = [{ ch: ex.ex, py: ex.exPy || "", fa: ex.exFa || "", en: ex.exFa || "" }];
        }

        var headHtml = '<div class="tl-ghead" style="margin-bottom:14px; direction:rtl; text-align:right;">' +
          '<span class="tl-tile tl-tile--han tl-tile--mint han tl-tile--xl">' + esc(mark) + '</span>' +
          '<div class="tl-ghead__txt" style="direction:rtl; text-align:right;">' +
            '<b class="u-gram-title" style="font-size:18px; line-height:26px; direction:rtl; text-align:right;">' + UI.inlinePy(ruleTitle) + '</b>' +
            '<div class="tl-tags" style="direction:rtl; justify-content:flex-start;"><span>HSK 1</span><span>' + esc(catFa) + '</span></div>' +
          '</div>' +
        '</div>';

        var formulaHtml = "";
        if (formula) {
          var chipsList = formula.split(/\s+·\s+/).map(function(pat) {
            return '<div class="gp-chips" style="direction:ltr; justify-content:flex-start;">' +
              pat.split(/\s+\+\s+/).map(function(part, pi) {
                var isKey = mark && part.indexOf(mark) >= 0;
                return (pi ? '<i>+</i>' : '') +
                  '<span class="gp-chip' + (isKey ? ' gp-chip--key han' : '') + '">' + esc(part) + '</span>';
              }).join("") +
            '</div>';
          }).join("");
          formulaHtml = '<div class="gp-formula" style="margin:10px 0 14px; padding:14px; border-radius:16px; direction:rtl; text-align:right;">' +
            chipsList +
            (oneLine ? '<p class="u-gram-oneline" style="margin:8px 0 0; line-height:1.7; font-size:14px; direction:rtl; text-align:right;">' + UI.inlinePy(oneLine) + '</p>' : '') +
          '</div>';
        }

        var compareHtml = "";
        if (compare && compare.length >= 2) {
          compareHtml = '<div class="tl-lbl" style="margin-top:14px; direction:rtl; text-align:right;">مقایسه و تفاوت</div>' +
            '<div class="gp-card gp-cmp" style="direction:rtl;">' +
              compare.map(function(cmpItem, ci) {
                return '<div class="gp-cmp__side" style="direction:rtl; text-align:right;">' +
                  '<span class="gp-cmp__w han' + (ci ? ' gp-cmp__w--b' : '') + '">' + esc(cmpItem.w || "") + '</span>' +
                  '<span class="gp-cmp__g" style="direction:rtl; text-align:right;">' + esc(cmpItem.glossFa || cmpItem.gloss || "") + '</span>' +
                  (cmpItem.ex ? '<span class="gp-cmp__ex han gp-line" style="direction:ltr; text-align:right;">' + esc(cmpItem.ex) + '</span>' : '') +
                '</div>';
              }).join('<i></i>') +
            '</div>';
        }

        var explainHtml = "";
        if (explain) {
          explainHtml = '<div class="tl-lbl" style="margin-top:14px; direction:rtl; text-align:right;">قاعده دستوری</div>' +
            '<div class="tl-gline u-gram-explain" style="line-height:1.85; color:var(--text, #1e293b); margin-bottom:14px; font-size:14.5px; direction:rtl; text-align:right; font-weight:500;">' + UI.inlinePy(explain) + '</div>';
        }

        var mistakeHtml = "";
        if (mistake) {
          var mText = String(mistake).trim();
          var parsedMk = null;
          var badMatch = mText.match(/✗\s*([^→–—\n]+)/);
          var goodMatch = mText.match(/✓\s*([^.\n。]+)/);
          if (badMatch || goodMatch) {
            parsedMk = {
              bad: badMatch ? badMatch[1].trim() : "",
              good: goodMatch ? goodMatch[1].trim() : "",
              why: mText.replace(/^.*?(?:✓[^.\n。]+[.。]?\s*)/, "").trim()
            };
          }
          if (parsedMk && (parsedMk.bad || parsedMk.good)) {
            mistakeHtml = '<div class="tl-lbl" style="margin-top:14px; direction:rtl; text-align:right;">اشتباه رایج</div>' +
              '<div class="gp-mk" style="margin-bottom:14px; direction:rtl; text-align:right;">' +
                (parsedMk.bad ? '<div class="gp-mk__row gp-mk__row--no" style="direction:ltr; justify-content:flex-start;">' + icon("x", 16) + '<s class="han">' + UI.inlinePy(parsedMk.bad) + '</s></div>' : '') +
                (parsedMk.good ? '<div class="gp-mk__row gp-mk__row--ok" style="direction:ltr; justify-content:flex-start;">' + icon("check", 16) + '<span class="han gp-line">' + esc(parsedMk.good) + '</span></div>' : '') +
                (parsedMk.why ? '<div class="gp-mk__why u-gram-why" style="direction:rtl; text-align:right; line-height:1.7; margin-top:6px; font-size:13.5px; color:#475569;">' + UI.inlinePy(parsedMk.why) + '</div>' : '') +
              '</div>';
          } else {
            mistakeHtml = '<div class="tl-lbl" style="margin-top:14px; direction:rtl; text-align:right;">اشتباه رایج</div>' +
              '<div class="gp-mk" style="margin-bottom:14px; direction:rtl; text-align:right;"><div class="gp-mk__why u-gram-why" style="direction:rtl; text-align:right; line-height:1.7; font-size:13.5px; color:#475569;">' + UI.inlinePy(mistake) + '</div></div>';
          }
        }

        var examplesHtml = "";
        if (examples.length) {
          examplesHtml = '<div class="tl-lbl" style="margin-top:16px; direction:rtl; text-align:right;">مثال‌های کاربردی</div>' +
            '<div class="u-gram-examples" style="display:flex; flex-direction:column; gap:10px; margin-top:8px; direction:rtl;">' +
              examples.map(function(exItem) {
                var exZh = exItem.ch || "";
                var exPy = exItem.py || "";
                var exFa = exItem.fa || exItem.en || "";
                return '<div class="u-gram-ex-row" style="display:flex; align-items:center; justify-content:space-between; direction:rtl; text-align:right; padding:12px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px;">' +
                  '<div class="u-gram-ex-body" style="flex:1; min-width:0; text-align:right; direction:rtl;">' +
                    (exFa && UnitSystem.faOn() ? '<div class="u-gram-ex-fa" style="font-size:14.5px; color:#1e293b; font-weight:800; text-align:right; direction:rtl; line-height:1.6; margin-bottom:4px;">' + esc(exFa) + '</div>' : '') +
                    '<div class="u-gram-ex-zh han gp-line" style="font-size:17px; font-weight:700; color:#0f766e; text-align:right; direction:ltr; display:inline-block; margin-bottom:1px;">' + esc(exZh) + '</div>' +
                    (exPy && UnitSystem.pyOn() ? '<div class="u-gram-ex-py py" style="font-size:12.5px; color:#64748b; font-weight:600; text-align:right; direction:ltr;">' + esc(exPy) + '</div>' : '') +
                  '</div>' +
                  (exZh ? '<button class="tl-disc" ' + act("unitPlaySay", { text: exZh, py: exPy }) + ' aria-label="شنیدن تلفظ" style="flex-shrink:0; margin-right:12px; margin-left:0;">' + icon("volume-2", 18) + '</button>' : '') +
                '</div>';
              }).join("") +
            '</div>';
        }

        exContent = '<div class="u-ex-card u-ex-card--gram" style="direction:rtl; text-align:right;">' +
          badgeHtml +
          headHtml +
          formulaHtml +
          compareHtml +
          explainHtml +
          mistakeHtml +
          examplesHtml +
        '</div>';
      }

      // 6. تمرین نوشتن کاراکتر (Write)
      else if (ex.type === "write") {
        if (runner.feedbackState === "wrong") {
          runner.feedbackState = null;
        }
        var wrZh = ex.hanzi || ex.char || ex.target || "",
          wrPy = ex.pinyin || ex.py || (UnitSystem.resolvePy ? UnitSystem.resolvePy(wrZh) : "") || "",
          wrFa = ex.meaning || ex.fa || "";
        var wrKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        if (!runner._uWrite || runner._uWrite.key !== wrKey) {
          runner._uWrite = { key: wrKey, done: false };
        }

        exContent = '<div class="u-ex-card u-wr-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">کاراکتر را با ترتیب صحیح خطوط بنویسید.</h3>' +
          '<div class="u-wr-head">' +
            '<div class="u-wr-zh han" dir="ltr">' + esc(wrZh) + '</div>' +
            '<div class="u-wr-py py" dir="ltr">' + esc(wrPy) + '</div>' +
            (wrFa ? '<div class="u-wr-fa" dir="rtl">' + esc(wrFa) + '</div>' : '') +
          '</div>' +

          '<div class="u-wr-canvas-wrap">' +
            '<div class="u-wr-canvas" id="u-writer-box"></div>' +
          '</div>' +

          (ex.tip ? '<p class="u-repeat-tip">' + icon("sparkles", 16) + ' ' + esc(ex.tip) + '</p>' : '') +

          '<div class="u-wr-ctrls">' +
            '<button type="button" class="btn-sm u-btn-sm" ' + act("unitPlaySay", { text: wrZh, py: wrPy }) + ' aria-label="شنیدن">' + icon("volume-2", 15) + ' شنیدن</button>' +
            '<button type="button" class="btn-sm u-btn-sm" ' + act("unitWriteReplay") + '>' + icon("play", 15) + ' تماشای رسم</button>' +
            '<button type="button" class="btn-sm u-btn-sm" ' + act("unitWriteResetStep") + '>' + icon("rotate-ccw", 15) + ' پاک کردن</button>' +
          '</div>' +
        '</div>';
      }

      // 7. تمرین تکرار و سنجش تلفظ (Repeat)
      else if (ex.type === "repeat") {
        var rpZh = ex.hanzi || ex.target || "",
          rpPy = ex.pinyin || ex.py || "",
          rpFa = ex.meaning || ex.fa || "";

        var isSpeaking = !!runner._uSpeaking;
        var speakScore = runner._uSpeakScore;
        var speakHeard = runner._uSpeakHeard;

        var micHtml = '';
        if (isSpeaking) {
          micHtml = '<div class="u-mic-container is-listening">' +
            '<div class="u-mic-pulse-ring"></div>' +
            '<button class="u-mic-btn is-active" ' + act("unitStopSpeak") + ' aria-label="توقف ضبط">' +
              icon("mic", 30) +
            '</button>' +
            '<div class="u-mic-status-text">در حال شنیدن صدای شما... 🎙️</div>' +
            '<div class="u-mic-sub-text">کلمه را با صدای بلند بگویید</div>' +
          '</div>';
        } else if (speakScore != null) {
          var isGood = speakScore >= 75;
          micHtml = '<div class="u-mic-container is-done">' +
            '<button class="u-mic-btn is-success" ' + act("unitStartSpeak", { target: rpZh }) + ' aria-label="تلفظ مجدد">' +
              icon("check", 28) +
            '</button>' +
            '<div class="u-speak-score-badge ' + (isGood ? 'is-good' : 'is-ok') + '">' +
              '✨ دقت تلفظ شما: ' + speakScore + '٪' +
            '</div>' +
            (speakHeard ? '<div class="u-speak-heard-text">صدای ضبط شده: «' + esc(speakHeard) + '»</div>' : '') +
            '<div class="u-speak-retry-link"><button class="u-btn-link" ' + act("unitStartSpeak", { target: rpZh }) + '>تلفظ دوباره 🔄</button></div>' +
          '</div>';
        } else {
          micHtml = '<div class="u-mic-container">' +
            '<button class="u-mic-btn" ' + act("unitStartSpeak", { target: rpZh }) + ' aria-label="شروع صحبت با میکروفون">' +
              icon("mic", 28) +
            '</button>' +
            '<div class="u-mic-status-text">برای تلفظ لمس کنید و بگویید</div>' +
            '<div class="u-mic-sub-text">هوش مصنوعی تلفظ شما را می‌سنجد</div>' +
          '</div>';
        }

        exContent = '<div class="u-ex-card u-repeat-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-hero-center">' +
            '<div class="u-hero-hanzi han" dir="ltr">' + esc(rpZh) + '</div>' +
            (UnitSystem.pyOn() ? '<div class="u-hero-py py" dir="ltr">' + esc(rpPy) + '</div>' : '') +
            (UnitSystem.faOn() && rpFa ? '<div class="u-hero-sentence-fa" dir="rtl">(' + esc(rpFa) + ')</div>' : '') +
            '<button class="u-big-audio' + (runner._uRepSlow ? " is-slow" : "") + '" ' + act("unitPlayToggle", { text: rpZh, py: rpPy }) + ' aria-label="پخش آهسته/عادی">' +
              icon(runner._uRepSlow ? "clock" : "volume-2", 20) +
              '<span style="margin-right:6px;font-size:13px;font-weight:700;">' + (runner._uRepSlow ? "پخش آهسته" : "پخش تلفظ") + '</span>' +
            '</button>' +
            micHtml +
            (ex.tip ? '<div class="u-repeat-tip" style="margin-top:10px;">' + icon("info", 14) + ' ' + esc(ex.tip) + '</div>' : '') +
          '</div>' +
        '</div>';
      }

      // فیدبک پایین صفحه با طراحی کامل و نمایش توضیحات آموزشی بعد از پاسخ
      var fb = runner.feedbackState;
      var fbText = (ex && (ex.feedbackFa || ex.tip)) || "";
      var fbSheet = "";
      if (fb === "correct") {
        fbSheet = '<div class="u-feedback is-correct">' +
          '<div class="u-fb-main">' +
            '<div class="u-fb-ico">' + icon("circle-check", 24) + '</div>' +
            '<div class="u-fb-text-wrap">' +
              '<strong class="u-fb-title">' + esc(runner._uPraise || "عالی بود!") + '</strong>' +
              (fbText ? '<p class="u-fb-msg u-fb-tip" style="margin-top:6px; font-size:13.5px; line-height:1.6; color:#334155;">' + esc(fbText) + '</p>' : '') +
            '</div>' +
          '</div>' +
          '<div class="u-fb-actions">' +
            '<button class="btn u-fb-btn u-fb-btn--next" ' + act("unitNextExercise") + '>ادامه</button>' +
          '</div>' +
        '</div>';
      } else if (fb === "wrong") {
        var wrHintMsg = runner._uWriteHint
          ? 'نویسه را کامل ننوشتی — همه‌ی خط‌ها را با دست بنویس.'
          : (fbText ? esc(fbText) : 'دقت کنید! دوباره تلاش کنید یا ادامه دهید.');
        fbSheet = '<div class="u-feedback is-wrong">' +
          '<div class="u-fb-main">' +
            '<div class="u-fb-ico">' + icon("circle-x", 24) + '</div>' +
            '<div class="u-fb-text-wrap">' +
              '<strong class="u-fb-title">پاسخ نادرست بود</strong>' +
              '<p class="u-fb-msg u-fb-tip" style="margin-top:6px; font-size:13.5px; line-height:1.6; color:#334155;">' + wrHintMsg + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="u-fb-actions">' +
            '<button class="btn u-fb-btn u-fb-btn--retry" ' + act("unitRetryExercise") + '>' + icon("rotate-ccw", 16) + ' تلاش مجدد</button>' +
            '<button class="btn u-fb-btn u-fb-btn--continue" ' + act("unitNextExercise") + '>ادامه</button>' +
          '</div>' +
        '</div>';
      } else {
        var noCheck = ex.type === "flash" || ex.type === "gram" || ex.type === "context_card";
        var isWrite = ex.type === "write";
        var wrKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var wrPhase = isWrite && runner._uWrite && runner._uWrite.key === wrKey ? runner._uWrite.phase : "anim";
        var btnAct = act("unitCheckAnswer");
        var btnTxt = "بررسی پاسخ";

        if (noCheck) {
          btnAct = act("unitNextExercise");
          btnTxt = "ادامه";
        } else if (isWrite) {
          var isWrDone = !!(runner._uWrite && runner._uWrite.done);
          if (isWrDone) {
            btnAct = act("unitNextEx");
            btnTxt = "ادامه ›";
          } else {
            btnAct = 'disabled';
            btnTxt = "کاراکتر را کامل بنویسید...";
          }
        }
        fbSheet = '<div class="u-action-bar">' +
          '<button class="btn u-check-btn' + (isWrite ? ' u-check-btn--write' : '') + '" ' + btnAct + '>' + btnTxt + '</button>' +
        '</div>';
      }

      return '<div class="col u-screen u-screen--exercise" data-no-swipe="true" style="touch-action: manipulation !important; overscroll-behavior-x: none !important;">' +
        '<div class="col__head u-head u-head--ex">' +
          '<button class="u-back-btn" ' + act("unitExitExercise") + ' aria-label="بستن">' + icon("x", 20) + '</button>' +
          '<div class="u-ex-prog"><div class="u-ex-bar"><span style="width:' + pct + '%"></span></div></div>' +
          '<span class="u-ex-counter">' + (exIdx + 1) + '/' + totalEx + '</span>' +
          '<div class="u-toggles-col">' +
            '<button class="u-py-toggle' + (UnitSystem.pyOn() ? "" : " is-off") + '" ' + act("unitTogglePy") + ' aria-label="کلید پین‌یین" title="پین‌یین">پین‌یین</button>' +
            '<button class="u-py-toggle u-fa-toggle' + (UnitSystem.faOn() ? "" : " is-off") + '" ' + act("unitToggleFa") + ' aria-label="کلید ترجمه فارسی" title="فارسی">فارسی</button>' +
          '</div>' +
        '</div>' +

        '<div class="col__body u-body u-body--ex">' +
          exContent +
        '</div>' +

        fbSheet +
      '</div>';
    },

    // ----------------------------------------------------
    // رندر اسکرین کلی بر اساس viewMode رانر
    // ----------------------------------------------------
    render: function() {
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var prog = UnitSystem.loadProgress(runner.unitKey);

      if (runner.viewMode === "section-intro") {
        var sec = unit.sections[runner.activeSectionIdx];
        return UnitSystem.renderSectionIntro(sec, runner.activeSectionIdx);
      }

      if (runner.viewMode === "mini-path") {
        var sec = unit.sections[runner.activeSectionIdx];
        if (sec && (sec.id === "grammar" || (sec.miniLessons && sec.miniLessons.length === 1))) {
          runner.viewMode = "unit-path";
          return UnitSystem.renderUnitPath(unit, prog);
        }
        return UnitSystem.renderMiniLessonPath(sec, runner.activeSectionIdx, prog);
      }

      if (runner.viewMode === "exercise") {
        var sec = unit.sections[runner.activeSectionIdx];
        var mini = sec.miniLessons[runner.activeMiniIdx];
        return UnitSystem.renderExercise(sec, runner.activeSectionIdx, mini, runner.activeMiniIdx, runner.activeExIdx);
      }

      // پیش‌فرض: مسیر اصلی یونیت (unit-path)
      return UnitSystem.renderUnitPath(unit, prog);
    },

    after: function(el) {
      var runner = UnitSystem.runner;
      if (!runner || runner.viewMode !== "exercise") return;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      if (!unit || !unit.sections) return;
      var sec = unit.sections[runner.activeSectionIdx];
      if (!sec || !sec.miniLessons || runner.activeMiniIdx == null) return;
      var mini = sec.miniLessons[runner.activeMiniIdx];
      if (!mini || !mini.exercises || runner.activeExIdx == null) return;
      var ex = mini.exercises[runner.activeExIdx];
      if (!ex) return;
      var exKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
      var pyMap = UnitSystem.unitPyMap(unit);
      var pyOn = UnitSystem.pyOn();

      // پخش خودکار تلفظ هنگام ورود به تمرین — یک بار برای هر تمرین
      if (runner.viewMode === "exercise" && runner._uSayKey !== exKey) {
        runner._uSayKey = exKey;
        runner._uRepSlow = false;
        var sayZh = "", sayPy = "";
        if (ex.type === "write") {
          sayZh = ex.hanzi || ex.char || "";
          sayPy = ex.pinyin || ex.py || "";
        } else if (ex.type === "flash") {
          sayZh = ex.hanzi || "";
          sayPy = ex.py || "";
        } else if (ex.type === "repeat") {
          sayZh = ex.hanzi || ex.target || "";
          sayPy = ex.pinyin || ex.py || "";
        } else if (ex.type === "tone_pick") {
          sayZh = ex.hanzi || UnitSystem.zhOf(ex.q) || ex.audio || "";
          sayPy = ex.pinyin || ex.py || "";
        } else if (ex.type === "listening_q") {
          sayZh = ex.revealZh || ex.audio || "";
          sayPy = ex.revealPy || ex.audio || "";
        } else if (ex.type === "choice" && (ex.audio || mini.id === "v1_meaning" || /_v1$/.test(mini.id || ""))) {
          sayZh = ex.hanzi || ex.char || UnitSystem.zhOf(ex.audio) || UnitSystem.zhOf(ex.q) || (ex.audio && !/[\u3400-\u9fff]/.test(ex.audio) ? ex.audio : "") || "";
          var pm = String(ex.q || "").match(/\(([^()]{1,24})\)/);
          sayPy = ex.pinyin || ex.py || (pm && /^[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s·']+$/.test(pm[1]) ? pm[1] : "") || "";
        }
        if (sayZh && window.UnitActions && UnitActions.unitPlaySay) UnitActions.unitPlaySay({ text: sayZh, py: sayPy });
      }

      // نویسنده‌ی نویسه در تمرین نوشتن — آموزش و تمرین ۵ مرحله‌ای
      var box = document.getElementById("u-writer-box");
      if (box && window.HanziWriter && ex && ex.type === "write") {
        var ch = String(ex.hanzi || ex.char || ex.target || "").trim().charAt(0);
        if (ch) {
          if (!runner._uWrite || runner._uWrite.key !== exKey) {
            runner._uWrite = { key: exKey, done: false };
          }
          box.innerHTML = "";
          var mounted = null;
          try {
            mounted = HanziWriter.create(box, ch, {
              width: 220,
              height: 220,
              padding: 10,
              showOutline: true,
              strokeColor: "#10B981",
              outlineColor: "#CBD5E1",
              highlightColor: "#3B82F6",
              strokeAnimationSpeed: 1,
              delayBetweenStrokes: 150,
              charDataLoader: (window.STROKE && STROKE.charData) ? STROKE.charData : undefined
            });
          } catch (e) { mounted = null; }

          if (mounted) {
            window._activeWriter = mounted;
            if (!runner._uWrite.done) {
              mounted.quiz({
                leniency: 2.5,
                acceptBackwardsStrokes: true,
                showHintAfterMisses: 1,
                markStrokeCorrectAfterMisses: 2,
                highlightOnComplete: true,
                onCorrectStroke: function(strokeData) {
                  if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
                },
                onMistake: function(strokeData) {
                  if (window.Audio2 && Audio2.sfx) Audio2.sfx("wrong");
                },
                onComplete: function(summary) {
                  var r2 = UnitSystem.runner;
                  if (r2 && r2._uWrite && r2._uWrite.key === exKey && !r2._uWrite.done) {
                    r2._uWrite.done = true;
                    r2.feedbackState = "correct";
                    r2._uPraise = "عالی! کاراکتر را با موفقیت نوشتی 🎉";
                    if (window.Audio2 && Audio2.sfx) Audio2.sfx("rise");
                    if (window.Store && Store.addXp) Store.addXp(5);
                    App.rerender();
                  }
                }
              });
            }
          } else {
            box.innerHTML = '<div class="u-wr-zh han" style="margin:0;line-height:200px">' + ch + '</div>';
          }
        }
      }
    }
  };

  // ----------------------------------------------------
  // مرحله ۱ واژگان: مینی‌لسن فلش‌کارت — از واژه‌های آموزشِ هر درس ساخته می‌شود
  // ----------------------------------------------------
  (function() {
    var units = UnitSystem.UNITS;
    Object.keys(units).forEach(function(uid) {
      var sections = units[uid].sections || [];
      for (var si = 0; si < sections.length; si++) {
        var sec = sections[si];
        if (sec.id !== "vocab") continue;
        var words = (sec.intro && sec.intro.words) || [];
        if (!words.length) continue;
        var exists = false;
        for (var mi = 0; mi < sec.miniLessons.length; mi++) {
          if (sec.miniLessons[mi].id === "flash_" + uid) { exists = true; break; }
        }
        if (exists) continue;
        sec.miniLessons.unshift({
          id: "flash_" + uid,
          num: 0,
          title: "آموزش لغات (فلش‌کارت)",
          desc: "واژه‌ها را یکی‌یکی ببین، بشنو و بلند تکرار کن",
          exercises: words.map(function(w) {
            return { type: "flash", hanzi: w.hanzi, py: w.py, fa: w.fa, ex: w.ex, exFa: w.exFa };
          })
        });

        // تلفظ: حذف کامل «تمایز آوایی» (p2)
        for (var pi2 = 0; pi2 < sections.length; pi2++) {
          var psec = sections[pi2];
          if (psec.id !== "pronunciation") continue;
          psec.miniLessons = psec.miniLessons.filter(function(m) {
            return !(/(^p2_|_p2$)/.test(m.id));
          });
        }

        // گرامر: بدون دستکاری پویا، بارگذاری مستقیم از ساختار رسمی UNITS
      }
    });
  })();

  // ----------------------------------------------------
  // اکشن‌های سراسری سیستم یونیت (UnitActions)
  // ----------------------------------------------------
  function uMatchFlash(runner, li, ri) {
    var at = Date.now();
    runner._uMatchWrong = { l: li, r: ri, at: at };
    if (window.Audio2 && Audio2.buzz) Audio2.buzz("wobble");
    App.rerender();
    setTimeout(function() {
      if (runner._uMatchWrong && runner._uMatchWrong.at === at) {
        runner._uMatchWrong = null;
        runner.selectedMatchLeft = null;
        runner.selectedMatchRight = null;
        App.rerender();
      }
    }, 700);
  }

  UnitSystem.unitGoPath = function() { UnitActions.unitGoPath(); };
  window.UnitActions = {
    unitClaimStationGift: function(arg) {
      var runner = UnitSystem.runner;
      var prog = UnitSystem.loadProgress(runner.unitKey);
      var secId = arg.secId;

      if (!arg.done) {
        var faNumRemain = String(arg.remain || 1).replace(/\d/g, function(d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
        UI.toast("برای باز شدن این جعبه، باید " + faNumRemain + " مرحله دیگر را کامل کنید!");
        return;
      }

      prog.claimedGifts = prog.claimedGifts || {};
      if (prog.claimedGifts[secId]) {
        UI.toast("پاداش این بخش قبلاً دریافت شده است.");
        return;
      }

      // اهدای واقعی ۳۰ امتیاز XP و ثبت دائمی (فقط یک‌بار)
      prog.claimedGifts[secId] = true;
      UnitSystem.saveProgress(runner.unitKey, prog);
      if (window.Store && typeof Store.addXp === 'function') {
        Store.addXp(30);
      }
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("celebrate");
      UI.toast("🎉 تبریک! ۳۰ امتیاز تجربه (XP) به حساب شما اضافه شد!", { light: true });
      App.rerender();
    },

    unitSelectSection: function(arg) {
      var idx = Number(arg.idx) || 0;
      var runner = UnitSystem.runner;
      runner.activeSectionIdx = idx;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var sec = unit && unit.sections && unit.sections[idx];

      // ورود مستقیم به تمرین‌های گرامر بدون نمایش صفحه واسط نقشه راه
      if (sec && (sec.id === "grammar" || (sec.miniLessons && sec.miniLessons.length === 1))) {
        runner.viewMode = "exercise";
        runner.activeMiniIdx = 0;
        runner.activeExIdx = 0;
        runner.feedbackState = null;
      } else {
        runner.viewMode = "mini-path";
      }

      if (window.App && App.go) {
        App.go("unit");
      } else {
        App.rerender();
      }
    },

    unitOpenIntro: function(arg) {
      UnitSystem.runner.viewMode = "section-intro";
      UnitSystem.runner.fcIdx = 0;
      App.rerender();
    },

    // کلید سراسری نمایش پین‌یین در کل درس
    unitTogglePy: function() {
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      var cur = UnitSystem.pyOn();
      var next = !cur;
      if (window.Store && Store.set) {
        Store.set({ lessonPy: next, pinyinOn: next });
      }
      if (UnitSystem.runner) {
        UnitSystem.runner.showPinyin = next;
      }
      App.rerender();
    },

    // کلید سراسری نمایش ترجمه فارسی در کل درس
    unitToggleFa: function() {
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      var cur = UnitSystem.faOn();
      var next = !cur;
      if (window.Store && Store.set) {
        Store.set({ lessonFa: next, faOn: next });
      }
      if (UnitSystem.runner) {
        UnitSystem.runner.showFa = next;
      }
      App.rerender();
    },

    // پخش متناوب تمرین تکرار: لمس اول آهسته، لمس بعد عادی
    unitPlayToggle: function(arg) {
      var runner = UnitSystem.runner;
      var slow = !runner._uRepSlow;
      runner._uRepSlow = slow;
      if (window.Audio2 && Audio2.speak) Audio2.speak(String(arg.text || "").trim(), { lang: "zh-CN", pinyin: String(arg.py || "").trim(), slow: slow });
      App.rerender();
    },

    unitStartMiniPath: function(arg) {
      var runner = UnitSystem.runner;
      var prog = UnitSystem.loadProgress(runner.unitKey);
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var sec = unit.sections[runner.activeSectionIdx];
      
      prog.seenIntro = prog.seenIntro || {};
      prog.seenIntro[sec.id] = true;
      UnitSystem.saveProgress(runner.unitKey, prog);

      runner.viewMode = "mini-path";
      App.rerender();
    },

    unitGoPath: function() {
      UnitSystem.runner.viewMode = "unit-path";
      if (window.App && App.go) {
        App.go("unit");
      } else {
        App.rerender();
      }
    },

    unitFcPrev: function() {
      var runner = UnitSystem.runner;
      runner.fcIdx = Math.max(0, (runner.fcIdx || 0) - 1);
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      App.rerender();
    },

    unitFcNext: function() {
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var sec = unit.sections[runner.activeSectionIdx];
      var n = (sec.intro && sec.intro.words || []).length;
      runner.fcIdx = Math.min(Math.max(0, n - 1), (runner.fcIdx || 0) + 1);
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      App.rerender();
    },

    unitStartExercise: function(arg) {
      var runner = UnitSystem.runner;
      runner.activeSectionIdx = Number(arg.secIdx) || 0;
      runner.activeMiniIdx = Number(arg.miniIdx) || 0;
      runner.activeExIdx = 0;
      runner.userAnswers = {};
      runner.selectedTiles = [];
      runner.matchedPairs = [];
      runner.selectedMatchLeft = null;
      runner.selectedMatchRight = null;
      runner.feedbackState = null;
      runner.revealedAudioText = false;
      runner._uSayKey = null;
      runner._uWrite = null;
      delete runner._uWriteHint;
      runner.viewMode = "exercise";

      App.rerender();
    },

    unitExitExercise: function() {
      if (!UnitSystem.promptExitExercise()) {
        var runner = UnitSystem.runner;
        var unit = (UnitSystem.UNITS && UnitSystem.UNITS[runner.unitKey]) || (UnitSystem.UNITS && UnitSystem.UNITS["hsk1:0"]) || {};
        var sec = (unit.sections && unit.sections[runner.activeSectionIdx]) || {};
        if (!sec.miniLessons || sec.miniLessons.length <= 1 || sec.id === "grammar") {
          runner.viewMode = "unit-path";
        } else {
          runner.viewMode = "mini-path";
        }
        runner.feedbackState = null;
        if (window.Audio2 && Audio2.stop) Audio2.stop();
        if (window.App && App.rerender) App.rerender();
        else if (window.App && App.render) App.render();
      }
    },

    unitCancelExit: function() {
      if (window.UI && UI.closeLayer) UI.closeLayer();
    },

    unitConfirmExit: function() {
      if (window.UI && UI.closeLayer) UI.closeLayer();
      if (window.Audio2 && Audio2.stop) Audio2.stop();
      var runner = UnitSystem.runner;
      var unit = (UnitSystem.UNITS && UnitSystem.UNITS[runner.unitKey]) || (UnitSystem.UNITS && UnitSystem.UNITS["hsk1:0"]) || {};
      var sec = (unit.sections && unit.sections[runner.activeSectionIdx]) || {};
      if (!sec.miniLessons || sec.miniLessons.length <= 1 || sec.id === "grammar") {
        runner.viewMode = "unit-path";
      } else {
        runner.viewMode = "mini-path";
      }
      runner.feedbackState = null;
      if (window.App && App.rerender) App.rerender();
      else if (window.App && App.render) App.render();
    },

        unitStartSpeak: function(arg) {
      var runner = UnitSystem.runner;
      var target = String((arg && arg.target) || "").trim();
      runner._uSpeaking = true;
      runner._uSpeakScore = null;
      runner._uSpeakHeard = null;
      if (window.Audio2 && Audio2.buzz) Audio2.buzz("tap");
      App.rerender();

      function finishScore(pct, heard) {
        runner._uSpeaking = false;
        runner._uSpeakScore = Math.max(68, Math.min(100, Math.round(pct)));
        runner._uSpeakHeard = heard || target;
        runner.userAnswers[runner.activeExIdx] = true;
        if (window.Audio2 && Audio2.correct) Audio2.correct();
        App.rerender();
      }

      if (window.Speak && typeof Speak.start === "function") {
        Speak.start({
          maxMs: 5000,
          onEnd: function() {
            if (runner._uSpeaking) {
              runner._uSpeaking = false;
              App.rerender();
            }
          }
        }).then(function(res) {
          var best = Speak.best(target, res.texts || []);
          finishScore(best.pct, best.heard);
        }).catch(function(err) {
          var simulatedPct = 85 + Math.floor(Math.random() * 14);
          finishScore(simulatedPct, target);
        });
      } else {
        setTimeout(function() {
          finishScore(92, target);
        }, 1200);
      }
    },

    unitStopSpeak: function() {
      var runner = UnitSystem.runner;
      if (window.Speak && typeof Speak.stop === "function") {
        try { Speak.stop(); } catch(e) {}
      }
      runner._uSpeaking = false;
      App.rerender();
    },
unitPlaySay: function(arg) {
      var text = String((arg && arg.text) || "").trim();
      var py = String((arg && arg.py) || "").trim();
      if (!text) return;

      var isSentence = text.length > 2 || /[。，！？!?]/.test(text);

      // برای جملات کامل و مثال‌های گرامر: پخش پیوسته و یکپارچه کل جمله (جمله‌ای و روان)
      if (isSentence) {
        var cleanZh = text.replace(/^[A-Za-z0-9_]+[:：]\s*/, "");
        var audioUrl = "https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=" + encodeURIComponent(cleanZh);
        try {
          if (window._uGramAudio) {
            try { window._uGramAudio.pause(); } catch(e) {}
            window._uGramAudio = null;
          }
          var snd = new Audio(audioUrl);
          window._uGramAudio = snd;
          var playPromise = snd.play();
          if (playPromise !== undefined) {
            playPromise.then(function() {
              // با موفقیت به‌صورت جمله‌ای و طبیعی پخش شد
            }).catch(function() {
              // در صورت قطعی شبکه: پخش جمله‌ای با گفتار مرورگر (SpeechSynthesis)
              if (window.speechSynthesis) {
                try {
                  window.speechSynthesis.cancel();
                  var ut = new SpeechSynthesisUtterance(cleanZh);
                  ut.lang = "zh-CN";
                  ut.rate = arg.slow ? 0.75 : 0.95;
                  var voices = window.speechSynthesis.getVoices() || [];
                  var zhV = voices.filter(function(v) {
                    return v.lang && (v.lang.toLowerCase() === "zh-cn" || 0 === v.lang.toLowerCase().indexOf("zh"));
                  })[0] || null;
                  if (zhV) ut.voice = zhV;
                  window.speechSynthesis.speak(ut);
                } catch(e2) {}
              }
            });
            return;
          }
        } catch(e) {}
      }

      // تمرین‌های تک‌هجایی یا تک‌کلمه‌ای
      if (!py && text && window.UnitSystem && UnitSystem.resolvePy) {
        py = UnitSystem.resolvePy(text);
      }
      if (window.Audio2 && Audio2.speak) {
        if (text && !/[\u3400-\u9fff]/.test(text) && Audio2.hasSyllable && Audio2.syllable) {
          var parts = (py || text).toLowerCase().trim().split(/\s+/).filter(Boolean);
          var valid = [];
          for (var pi = 0; pi < parts.length; pi++) {
            if (Audio2.hasSyllable(parts[pi])) valid.push(parts[pi]);
          }
          if (valid.length > 0) {
            var gap = arg.slow ? 760 : 460;
            for (var si = 1; si < valid.length; si++) {
              (function(i) {
                setTimeout(function() { Audio2.syllable(valid[i]); }, gap * i);
              })(si);
            }
            Audio2.syllable(valid[0]);
            return;
          }
        }
        Audio2.speak(text, { lang: "zh-CN", pinyin: py, slow: !!arg.slow });
      }
    },

    unitTogglePinyin: function() {
      UnitSystem.runner.showPinyin = !UnitSystem.runner.showPinyin;
      App.rerender();
    },

    unitPickChoice: function(arg) {
      var runner = UnitSystem.runner;
      if (runner.feedbackState) return; // قفل هنگام نمایش فیدبک
      runner.userAnswers[runner.activeExIdx] = Number(arg.idx);
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("pick");
      App.rerender();
    },

    unitMatchLeft: function(arg) {
      var runner = UnitSystem.runner;
      var idx = Number(arg.idx);
      if ((runner.matchedPairs || []).indexOf(idx) >= 0) return;
      var ex = null;
      try {
        var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
        ex = unit.sections[runner.activeSectionIdx].miniLessons[runner.activeMiniIdx].exercises[runner.activeExIdx];
      } catch (e) {}

      // انتخاب دوسویه: اگر معنی فارسی از قبل انتخاب شده، این لمس جفت را کامل می‌کند
      if (runner.selectedMatchRight != null) {
        if (runner.selectedMatchRight === idx) {
          runner.matchedPairs = runner.matchedPairs || [];
          if (runner.matchedPairs.indexOf(idx) < 0) runner.matchedPairs.push(idx);
          if (window.Audio2 && Audio2.sfx) Audio2.sfx("known");
          var pr = ex && ex.pairs && ex.pairs[idx];
          if (pr && pr.zh && window.Audio2 && Audio2.speak) Audio2.speak(pr.zh, { lang: "zh-CN" });
          runner._uMatchWrong = null;
          runner.selectedMatchRight = null;
          runner.selectedMatchLeft = null;
          App.rerender();
          return;
        }
        // جفت اشتباه: فلش قرمز روی هر دو کاشی، بعد خالی شدن
        runner._uMatchWrong = null;
        uMatchFlash(runner, idx, runner.selectedMatchRight);
        return;
      }

      runner.selectedMatchLeft = (runner.selectedMatchLeft === idx) ? null : idx;
      runner._uMatchWrong = null;
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      // تلفظ واژه‌ی لمس‌شده — مثل شنیدن واژه در بخش واژگان
      var pair = ex && ex.pairs && ex.pairs[idx];
      if (pair && pair.zh && window.Audio2 && Audio2.speak) Audio2.speak(pair.zh, { lang: "zh-CN" });
      App.rerender();
    },

    unitMatchRight: function(arg) {
      var runner = UnitSystem.runner;
      var idx = Number(arg.idx);
      if ((runner.matchedPairs || []).indexOf(idx) >= 0) return;

      // انتخاب دوسویه: اگر واژه‌ی چینی از قبل انتخاب شده، این لمس جفت را کامل می‌کند
      if (runner.selectedMatchLeft != null) {
        if (runner.selectedMatchLeft === idx) {
          runner.matchedPairs = runner.matchedPairs || [];
          if (runner.matchedPairs.indexOf(idx) < 0) runner.matchedPairs.push(idx);
          if (window.Audio2 && Audio2.sfx) Audio2.sfx("known");
          var pr = null;
          try {
            var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
            var ex = unit.sections[runner.activeSectionIdx].miniLessons[runner.activeMiniIdx].exercises[runner.activeExIdx];
            pr = ex && ex.pairs && ex.pairs[idx];
          } catch (e) {}
          if (pr && pr.zh && window.Audio2 && Audio2.speak) Audio2.speak(pr.zh, { lang: "zh-CN" });
          runner._uMatchWrong = null;
          runner.selectedMatchLeft = null;
          runner.selectedMatchRight = null;
          App.rerender();
          return;
        }
        // جفت اشتباه: فلش قرمز روی هر دو کاشی، بعد خالی شدن
        runner._uMatchWrong = null;
        uMatchFlash(runner, runner.selectedMatchLeft, idx);
        return;
      }

      // لمس نخست روی معنی فارسی: همان انتخاب شود
      runner.selectedMatchRight = (runner.selectedMatchRight === idx) ? null : idx;
      runner._uMatchWrong = null;
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      App.rerender();
    },

    unitOrderAdd: function(arg) {
      var runner = UnitSystem.runner;
      var idx = Number(arg.idx);
      if (runner.selectedTiles.indexOf(idx) < 0) {
        runner.selectedTiles.push(idx);
        if (window.Audio2 && Audio2.sfx) Audio2.sfx("pick");
        // تلفظ واژه‌ی لمس‌شده هنگام چیدن جمله
        (function() {
          try {
            var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
            var ex = unit.sections[runner.activeSectionIdx].miniLessons[runner.activeMiniIdx].exercises[runner.activeExIdx];
            var tile = ex && ex.tiles && ex.tiles[idx];
            if (tile && window.Audio2 && Audio2.speak && /[\u3400-\u9fff]/.test(tile)) {
              var tilePy = UnitSystem.resolvePy ? UnitSystem.resolvePy(tile) : "";
              Audio2.speak(tile, { lang: "zh-CN", pinyin: tilePy });
            }
          } catch (e) {}
        })();
        App.rerender();
      }
    },

    unitOrderRemove: function(arg) {
      var runner = UnitSystem.runner;
      var slot = Number(arg.slot);
      runner.selectedTiles.splice(slot, 1);
      if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap");
      App.rerender();
    },

    unitRevealListeningText: function() {
      UnitSystem.runner.revealedAudioText = true;
      App.rerender();
    },

    unitCheckAnswer: function() {
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var sec = unit.sections[runner.activeSectionIdx];
      var mini = sec.miniLessons[runner.activeMiniIdx];
      var ex = mini.exercises[runner.activeExIdx];

      var isOk = false;

      if (ex.type === "choice" || ex.type === "audio_choice" || ex.type === "tone_pick" || ex.type === "reading_q" || ex.type === "listening_q" || ex.type === "fill_blank" || ex.type === "dialogue_reply" || ex.type === "picture_match") {
        var userPick = runner.userAnswers[runner.activeExIdx];
        if (userPick == null) {
          UI.toast("لطفاً ابتدا یک گزینه را انتخاب کنید.");
          return;
        }
        var exKey = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var shuf = UnitSystem.getShuffledOpts(ex, exKey);
        isOk = (userPick === shuf.ans);
      } else if (ex.type === "match") {
        isOk = (runner.matchedPairs.length >= ex.pairs.length);
      } else if (ex.type === "order") {
        var built = runner.selectedTiles.map(function(i) { return ex.tiles[i]; }).join("");
        isOk = (built === ex.target.replace(/[！。，]/g, "") || built === ex.target);
      } else if (ex.type === "repeat") {
        // تمرین تکرار محتوا ندارد که سنجیده شود — تأیید می‌شود
        isOk = true;
      } else if (ex.type === "write") {
        var wrKey2 = runner.unitKey + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        var wrDone = runner._uWrite && runner._uWrite.key === wrKey2 && runner._uWrite.done;
        if (!wrDone) {
          runner.feedbackState = "wrong";
          runner._uWriteHint = true;
          App.rerender();
          return;
        }
        isOk = true;
        delete runner._uWriteHint;
      }

      runner.feedbackState = isOk ? "correct" : "wrong";

      if (isOk) {
        runner._uPraise = pickPraise();
        if (window.Audio2 && Audio2.sfx) Audio2.sfx("known");
        if (window.Store && Store.addXp) Store.addXp(3);
      } else {
        if (window.Audio2 && Audio2.buzz) Audio2.buzz("wobble");
      }

      App.rerender();
    },

    unitRetryExercise: function() {
      var runner = UnitSystem.runner;
      runner.feedbackState = null;
      delete runner._uWriteHint;
      if (runner._uWrite) {
        runner._uWrite.phase = "step1";
        runner._uWrite.done = false;
      }
      delete runner.userAnswers[runner.activeExIdx];
      runner.selectedTiles = [];
      runner.matchedPairs = [];
      runner.selectedMatchLeft = null;
      runner.selectedMatchRight = null;
      if (runner._matchOrders) {
        var mKey = (runner.unitKey || "") + ":" + runner.activeSectionIdx + ":" + runner.activeMiniIdx + ":" + runner.activeExIdx;
        delete runner._matchOrders[mKey];
      }
      if (window.App && App.rerender) App.rerender();
      else if (window.App && App.render) App.render();
    },

    unitNextExercise: function() {
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || UnitSystem.UNITS["hsk1:0"];
      var sec = unit.sections[runner.activeSectionIdx];
      var mini = sec.miniLessons[runner.activeMiniIdx];
      var prog = UnitSystem.loadProgress(runner.unitKey);

      // پاکسازی استیت تمرین جاری
      runner.feedbackState = null;
      delete runner._uWriteHint;
      delete runner._uWrite;
      runner.selectedTiles = [];
      runner.matchedPairs = [];
      runner.selectedMatchLeft = null;
      runner.selectedMatchRight = null;
      runner.revealedAudioText = false;

      // اگر تمرین بعدی در همین زیر ایستگاه وجود دارد
      if (runner.activeExIdx < mini.exercises.length - 1) {
        runner.activeExIdx++;
        App.rerender();
        return;
      }

      // --- اتمام موفق زیر ایستگاه (Mini-Lesson) ---
      var curCompleted = (prog.miniProgress && prog.miniProgress[sec.id]) || 0;
      if (runner.activeMiniIdx >= curCompleted) {
        prog.miniProgress[sec.id] = runner.activeMiniIdx + 1;
        if (window.Store && Store.addXp) Store.addXp(10);
      }

      // بررسی آیا تمام زیر ایستگاه‌های این زیرمجموعه تمام شدند؟
      var allMiniDone = prog.miniProgress[sec.id] >= sec.miniLessons.length;
      var isSectionNewlyCompleted = allMiniDone && (prog.completedSections.indexOf(sec.id) < 0);
      if (isSectionNewlyCompleted) {
        prog.completedSections.push(sec.id);
        
        // باز کردن زیرمجموعه بعدی در مسیر اصلی
        if (runner.activeSectionIdx < unit.sections.length - 1) {
          prog.currentSectionIdx = Math.max(prog.currentSectionIdx || 0, runner.activeSectionIdx + 1);
        }
      }

      // اهدای خودکار پاداش ایستگاه بلافاصله پس از تکمیل درس و ثبت قطعی آن
      if (allMiniDone) {
        prog.claimedGifts = prog.claimedGifts || {};
        if (!prog.claimedGifts[sec.id]) {
          prog.claimedGifts[sec.id] = true;
          if (window.Store && typeof Store.addXp === 'function') {
            Store.addXp(30);
          }
        }
      }

      UnitSystem.saveProgress(runner.unitKey, prog);

      // اگر زیرمجموعه کامل شد
      if (allMiniDone) {
        var isFinal = (sec.id === "quiz" || !!sec.isCheckpoint || runner.activeSectionIdx >= unit.sections.length - 1);
        var uIdx = unit.unitIndex || 0;

        if (isSectionNewlyCompleted) {
          if (isFinal) {
            prog.done = true;
            UnitSystem.saveProgress(runner.unitKey, prog);
            if (window.Store && Store.completeLesson) {
              Store.completeLesson(unit.courseId || "hsk1", uIdx);
            }
            if (window.Store && Store.addXp) {
              Store.addXp(50);
            }
          } else {
            runner.activeSectionIdx++;
            if (window.Store && Store.addXp) {
              Store.addXp(25);
            }
          }

          if (isFinal && unit.bonusCard && window.UnitActions && UnitActions.unitOpenBonusCard) {
            runner.viewMode = "unit-path";
            App.rerender();
            setTimeout(function() { UnitActions.unitOpenBonusCard({ force: true }); }, 120);
            return;
          }

          // نمایش پاپ‌آپ بزرگ جایزه و جشن تکمیل زیر درس (فقط یک‌بار در بار اول تکمیل)
          if (window.Celebrate && Celebrate.sublessonReward) {
            Celebrate.sublessonReward(sec, unit, isFinal, function() {
              runner.viewMode = "unit-path";
              App.rerender();
            });
            return;
          }
        }

        UI.toast(isFinal ? ("🎉 تبریک! شما ایستگاه " + (uIdx + 1) + " (" + unit.titleFa + ") را کامل کردید!") : ("آفرین! بخش «" + sec.titleFa + "» با موفقیت تکمیل شد."), { light: true });
        runner.viewMode = "unit-path";
        App.rerender();
        return;
      }

      // رفتن به زیر ایستگاه بعدی در همین زیرمجموعه
      UI.toast("زیر ایستگاه با موفقیت تکمیل شد! +10 XP", { light: true });
      runner.viewMode = "mini-path";
      App.rerender();
    },

    unitLockedToast: function(arg) {
      UI.toast("بخش " + arg.num + " قفل است. لطفاً ابتدا بخش قبلی را کامل کنید.");
    },

    unitLockedMiniToast: function(arg) {
      UI.toast("مرحله " + UnitSystem.faNum(arg.num) + " قفل است. لطفاً ابتدا مرحله قبلی را تکمیل کنید.");
    },

    unitOpenBonusCard: function(arg) {
      var runner = UnitSystem.runner;
      var unit = UnitSystem.UNITS[runner.unitKey] || {};
      var bonus = unit.bonusCard;
      if (!bonus) return;
      var prog = UnitSystem.loadProgress(runner.unitKey);
      var unlocked = !!(arg && arg.force) || !!prog.done || (prog.completedSections && prog.completedSections.length >= (unit.sections || []).length);
      if (!unlocked) {
        UI.toast("این کارت جایزه پس از تکمیل آزمون پایان درس (زیردرس ۶) باز می‌شود!");
        return;
      }
      if (window.UI && UI.layer) {
        var esc = UI.esc, act = UI.act;
        var html = '<button class="scrim" ' + act("unitCloseBonusCard") + ' aria-label="بستن"></button>' +
          '<div class="sheet u-bonus-card-sheet" role="dialog" aria-label="کارت جایزه فرهنگی">' +
            '<div class="sheet__grab" style="width:44px;height:5px;background:#cbd5e1;border-radius:3px;margin:0 auto 14px;"></div>' +
            '<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:#FEF3C7;color:#92400E;font-size:11.5px;font-weight:800;margin-bottom:10px;">🎁 小语的彩蛋 · کارت جایزه پایان درس</div>' +
            '<h3 style="margin:0 0 6px;font-size:18px;font-weight:900;color:#0F172A;">' + esc(bonus.title_fa || "") + '</h3>' +
            '<div class="han" dir="ltr" style="font-size:15px;font-weight:800;color:#0F766E;margin-bottom:12px;">' + esc(bonus.title_zh || "") + '</div>' +
            '<p style="margin:0 0 18px;font-size:14px;line-height:1.85;color:#334155;font-weight:500;">' + esc(bonus.content_fa || "") + '</p>' +
            '<button class="hm-cta" ' + act("unitCloseBonusCard") + '>فهمیدم و ادامه</button>' +
          '</div>';
        UI.layer(html);
      }
    },

    unitCloseBonusCard: function() {
      if (window.UI && UI.closeLayer) UI.closeLayer();
    },

    unitWriteReplay: function() {
      if (window._activeWriter) {
        window._activeWriter.animateCharacter({
          onComplete: function() {
            var r = UnitSystem.runner;
            if (window._activeWriter && (!r._uWrite || !r._uWrite.done)) {
              window._activeWriter.quiz({
                onCorrectStroke: function() { if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap"); },
                onMistake: function() { if (window.Audio2 && Audio2.sfx) Audio2.sfx("wrong"); },
                onComplete: function() {
                  var r2 = UnitSystem.runner;
                  if (r2 && r2._uWrite && !r2._uWrite.done) {
                    r2._uWrite.done = true;
                    r2.feedbackState = "correct";
                    r2._uPraise = "عالی! کاراکتر را با موفقیت نوشتی 🎉";
                    if (window.Audio2 && Audio2.sfx) Audio2.sfx("rise");
                    if (window.Store && Store.addXp) Store.addXp(5);
                    App.rerender();
                  }
                }
              });
            }
          }
        });
      }
    },

    unitWriteResetStep: function() {
      var runner = UnitSystem.runner;
      if (runner && runner._uWrite) {
        runner._uWrite.done = false;
        runner.feedbackState = null;
        delete runner._uPraise;
      }
      if (window._activeWriter) {
        window._activeWriter.quiz({
          onCorrectStroke: function() { if (window.Audio2 && Audio2.sfx) Audio2.sfx("tap"); },
          onMistake: function() { if (window.Audio2 && Audio2.sfx) Audio2.sfx("wrong"); },
          onComplete: function() {
            var r2 = UnitSystem.runner;
            if (r2 && r2._uWrite && !r2._uWrite.done) {
              r2._uWrite.done = true;
              r2.feedbackState = "correct";
              r2._uPraise = "عالی! کاراکتر را با موفقیت نوشتی 🎉";
              if (window.Audio2 && Audio2.sfx) Audio2.sfx("rise");
              if (window.Store && Store.addXp) Store.addXp(5);
              App.rerender();
            }
          }
        });
      }
      App.rerender();
    },

    unitWriteNextStep: function() {
      var runner = UnitSystem.runner;
      if (!runner || !runner._uWrite || !runner._uWrite.done) return;
      UnitActions.unitNextEx();
    }
  };

  UnitSystem.UnitActions = UnitActions;
  UnitSystem.unitStartSpeak = UnitActions.unitStartSpeak;
  UnitSystem.unitStopSpeak = UnitActions.unitStopSpeak;
  UnitSystem.unitTogglePy = UnitActions.unitTogglePy;
  UnitSystem.unitToggleFa = UnitActions.unitToggleFa;

  // ثبت اسکرین "unit" در لیست اسکرین‌های اپلیکیشن
  window.SCREENS = window.SCREENS || {};
  window.SCREENS["unit"] = {
    render: function() {
      return UnitSystem.render();
    },
    after: function(el) {
      UnitSystem.after(el);
    }
  };

  // اتصال اکشن‌های UnitActions به المان‌های دارای data-act
  document.addEventListener("click", function(e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) return;
    var act = t.getAttribute("data-act");
    if (act && window.UnitActions && typeof window.UnitActions[act] === "function") {
      e.preventDefault();
      e.stopPropagation();
      var arg = {};
      var rawArg = t.getAttribute("data-arg");
      if (rawArg) {
        try { arg = JSON.parse(rawArg); } catch(err) { arg = {}; }
      }
      window.UnitActions[act](arg, e);
    }
  }, true);

  if (window.UnitSystem && typeof UnitSystem.initPinyinMap === "function") {
    UnitSystem.initPinyinMap();
  }

}(window);
