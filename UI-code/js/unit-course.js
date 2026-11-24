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
    "title": "Hello",
    "titleFa": "سلام و احوالپرسی",
    "titleZh": "你好",
    "level": "HSK 1",
    "desc": "آموزش گام‌به‌گام لغات پایه، قواعد جمله‌سازی با 是 و 吗، تُن‌ها و مکالمات اولیه",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت ۸ واژه کلیدی سلام، تشکر، عذرخواهی و معرفی",
        "intro": {
          "title": "آشنایی با واژه‌های کلیدی درس اول",
          "lead": "در این بخش با مهم‌ترین کلمات برای سلام و احوالپرسی روزمره در زبان چینی آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "你好",
              "py": "nǐ hǎo",
              "fa": "سلام (درود)",
              "ex": "你好！我是李明。",
              "exPy": "Nǐ hǎo! Wǒ shì Lǐ Míng.",
              "exFa": "سلام! من لی مینگ هستم."
            },
            {
              "hanzi": "谢谢",
              "py": "xiè xie",
              "fa": "متشکرم / ممنون",
              "ex": "谢谢你！",
              "exPy": "Xiè xie nǐ!",
              "exFa": "از تو متشکرم!"
            },
            {
              "hanzi": "不客气",
              "py": "bú kè qi",
              "fa": "خواهش می‌کنم / قابلی نداره",
              "ex": "不客气，再见！",
              "exPy": "Bú kè qi, zài jiàn!",
              "exFa": "خواهش می‌کنم، خداحافظ!"
            },
            {
              "hanzi": "对不起",
              "py": "duì bu qǐ",
              "fa": "ببخشید / متاسفم",
              "ex": "对不起！— 没关系。",
              "exPy": "Duì bu qǐ! — Méi guān xi.",
              "exFa": "ببخشید! — اشکالی نداره."
            },
            {
              "hanzi": "没关系",
              "py": "méi guān xi",
              "fa": "اشکالی ندارد / مسئله‌ای نیست",
              "ex": "没关系，谢谢。",
              "exPy": "Méi guān xi, xiè xie.",
              "exFa": "اشکالی نداره، ممنون."
            },
            {
              "hanzi": "我",
              "py": "wǒ",
              "fa": "من (ضمیر اول‌شخص)",
              "ex": "我是学生。",
              "exPy": "Wǒ shì xuésheng.",
              "exFa": "من دانش‌آموز هستم."
            },
            {
              "hanzi": "是",
              "py": "shì",
              "fa": "هستم / بودن (فعل ربطی)",
              "ex": "他是老师。",
              "exPy": "Tā shì lǎoshī.",
              "exFa": "او معلم است."
            },
            {
              "hanzi": "再见",
              "py": "zài jiàn",
              "fa": "خداحافظ / به امید دیدار",
              "ex": "明天见，再见！",
              "exPy": "Míngtiān jiàn, zài jiàn!",
              "exFa": "فردا می‌بینمت، خداحافظ!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "v1_meaning",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «你好» (nǐ hǎo) چیست؟",
                "audio": "nǐ hǎo",
                "hanzi": "你好",
                "pinyin": "nǐ hǎo",
                "opts": [
                  "سلام",
                  "خداحافظ",
                  "متشکرم",
                  "ببخشید"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "معنی واژه «谢谢» (xiè xie) چیست؟",
                "audio": "xiè xie",
                "hanzi": "谢谢",
                "pinyin": "xiè xie",
                "opts": [
                  "ببخشید",
                  "متشکرم / ممنون",
                  "خواهش می‌کنم",
                  "سلام"
                ],
                "ans": 1
              },
              {
                "type": "choice",
                "q": "معنی واژه «对不起» (duì bu qǐ) چیست؟",
                "audio": "duì bu qǐ",
                "hanzi": "对不起",
                "pinyin": "duì bu qǐ",
                "opts": [
                  "اشکالی نداره",
                  "سلام",
                  "ببخشید / متاسفم",
                  "خداحافظ"
                ],
                "ans": 2
              },
              {
                "type": "choice",
                "q": "معنی واژه «再见» (zài jiàn) چیست؟",
                "audio": "zài jiàn",
                "hanzi": "再见",
                "pinyin": "zài jiàn",
                "opts": [
                  "بله",
                  "خداحافظ",
                  "من",
                  "هستم"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "v2_match",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "你好",
                    "fa": "سلام"
                  },
                  {
                    "zh": "谢谢",
                    "fa": "ممنون"
                  },
                  {
                    "zh": "不客气",
                    "fa": "خواهش می‌کنم"
                  },
                  {
                    "zh": "没关系",
                    "fa": "اشکالی نداره"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "我",
                    "fa": "من"
                  },
                  {
                    "zh": "是",
                    "fa": "هستم"
                  },
                  {
                    "zh": "对不起",
                    "fa": "ببخشید"
                  },
                  {
                    "zh": "再见",
                    "fa": "خداحافظ"
                  }
                ]
              }
            ]
          },
          {
            "id": "v4_write",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "你",
                "py": "nǐ",
                "fa": "تو (شما)",
                "tip": "کاراکتر «你» از دو بخش تشکیل شده: سمت چپ رادیکال انسان (亻) و سمت راست (尔)."
              },
              {
                "type": "write",
                "char": "好",
                "py": "hǎo",
                "fa": "خوب / نیکو",
                "tip": "کاراکتر «好» ترکیب زن (女) و فرزند (子) است که نماد خوبی و آرامش است."
              },
              {
                "type": "write",
                "char": "我",
                "py": "wǒ",
                "fa": "من",
                "tip": "کاراکتر «我» دارای ۷ خط است و با خط افقی و چنگکی سمت راست کامل می‌شود."
              }
            ]
          },
          {
            "id": "v5_sentence",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ایجاد عبارات سلام و تعارف",
            "exercises": [
              {
                "type": "order",
                "prompt": "عبارت «سلام!» را بسازید:",
                "tiles": [
                  "你好",
                  "！"
                ],
                "target": "你好！"
              },
              {
                "type": "order",
                "prompt": "جمله «خواهش می‌کنم!» را مرتب کنید:",
                "tiles": [
                  "客气",
                  "不",
                  "！"
                ],
                "target": "不客气！"
              },
              {
                "type": "order",
                "prompt": "جمله را مرتب کنید.",
                "fa": "اشکالی نداره، ممنون.",
                "tiles": [
                  "谢谢",
                  "没关系",
                  "。"
                ],
                "target": "没关系，谢谢。"
              }
            ]
          },
          {
            "id": "v6_review",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "وقتی کسی می‌گوید «对不起» (ببخشید)، در پاسخ چه می‌گوییم؟",
                "audio": "méi guān xi",
                "opts": [
                  "没关系 (اشکالی نداره)",
                  "不客气 (خواهش می‌کنم)",
                  "再见 (خداحافظ)",
                  "我是 (من هستم)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "وقتی کسی می‌گوید «谢谢» (متشکرم)، بهترین پاسخ چیست؟",
                "audio": "bú kè qi",
                "opts": [
                  "你好",
                  "不客气",
                  "没关系",
                  "再见"
                ],
                "ans": 1
              },
              {
                "type": "choice",
                "q": "معنی این عبارت چیست؟",
                "hanzi": "我是李华",
                "pinyin": "wǒ shì Lǐ Huá",
                "audio": "wǒ shì Lǐ Huá",
                "opts": [
                  "من لی هوا هستم",
                  "او لی هوا است",
                  "لی هوا کجاست؟",
                  "خداحافظ لی هوا"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (是)",
        "titleZh": "是",
        "icon": "sliders-horizontal",
        "desc": "是‏ دو اسم را به هم وصل می‌کند: اینکه کسی یا چیزی چیست.",
        "intro": {
          "title": "آموزش گرامر: 是‏ · A است B",
          "lead": "是‏ دو اسم را به هم وصل می‌کند: اینکه کسی یا چیزی چیست.",
          "rule": "是‏ · A است B",
          "mark": "是",
          "pattern": "A + 是 + B · A + 不是 + B",
          "explain": "是‏ یک شخص یا چیز را به آنچه هست وصل می‌کند — نام، شغل، ملیت. برای نفی، 不‏ را قبلش بیاورید: 不是‏. فقط برای اسم‌هاست؛ با صفت‌ها چینی به‌جایش از 很‏ استفاده می‌کند (ببینید: 很‏ · صفت‌ها).",
          "mistake": "✗ 我是很高兴‏。 → ✓ 我很高兴‏。 صفت‌ها 是‏ نمی‌گیرند.",
          "compare": [
            {
              "w": "是",
              "gloss": "before a noun",
              "ex": "我是老师"
            },
            {
              "w": "很",
              "gloss": "before an adjective",
              "ex": "我很高兴"
            }
          ],
          "examples": [
            {
              "ch": "我是老师。",
              "py": "wǒ shì lǎoshī.",
              "en": "I am a teacher.",
              "fa": "I am a teacher."
            },
            {
              "ch": "他是我朋友。",
              "py": "tā shì wǒ péngyou.",
              "en": "He is my friend.",
              "fa": "He is my friend."
            },
            {
              "ch": "她不是医生，她是学生。",
              "py": "tā bú shì yīshēng, tā shì xuésheng.",
              "en": "She isn't a doctor, she's a student.",
              "fa": "She isn't a doctor, she's a student."
            }
          ],
          "points": [
            "الگوی ساختاری: A + 是 + B · A + 不是 + B",
            "توضیح قاعده: 是‏ یک شخص یا چیز را به آنچه هست وصل می‌کند — نام، شغل، ملیت. برای نفی، 不‏ را قبلش بیاورید: 不是‏. فقط برای اسم‌هاست؛ با صفت‌ها چینی به‌جایش از 很‏ استفاده می‌کند (ببینید: 很‏ · صفت‌ها).",
            "اشتباه رایج: ✗ 我是很高兴‏。 → ✓ 我很高兴‏。 صفت‌ها 是‏ نمی‌گیرند."
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_shi",
            "num": 1,
            "title": "آموزش و آزمون گرامر 是",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 是‏ · A است B",
            "exercises": [
              {
                "type": "gram",
                "id": "shi",
                "mark": "是",
                "rule": "是‏ · A است B",
                "titleFa": "是‏ · A است B",
                "catFa": "ساختار جمله",
                "formula": "A + 是 + B · A + 不是 + B",
                "pattern": "A + 是 + B · A + 不是 + B",
                "desc": "是‏ دو اسم را به هم وصل می‌کند: اینکه کسی یا چیزی چیست.",
                "oneLine": "是‏ دو اسم را به هم وصل می‌کند: اینکه کسی یا چیزی چیست.",
                "explain": "是‏ یک شخص یا چیز را به آنچه هست وصل می‌کند — نام، شغل، ملیت. برای نفی، 不‏ را قبلش بیاورید: 不是‏. فقط برای اسم‌هاست؛ با صفت‌ها چینی به‌جایش از 很‏ استفاده می‌کند (ببینید: 很‏ · صفت‌ها).",
                "mistake": "✗ 我是很高兴‏。 → ✓ 我很高兴‏。 صفت‌ها 是‏ نمی‌گیرند.",
                "compare": [
                                {
                                                "w": "是",
                                                "gloss": "before a noun",
                                                "glossFa": "قبل از اسم (بیان هویت)",
                                                "ex": "我是老师"
                                },
                                {
                                                "w": "很",
                                                "gloss": "before an adjective",
                                                "glossFa": "قبل از صفت (بیان حالت)",
                                                "ex": "我很高兴"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我是老师。",
                                                "py": "wǒ shì lǎoshī.",
                                                "en": "I am a teacher.",
                                                "fa": "من معلم هستم."
                                },
                                {
                                                "ch": "他是我朋友。",
                                                "py": "tā shì wǒ péngyou.",
                                                "en": "He is my friend.",
                                                "fa": "او دوست من است."
                                },
                                {
                                                "ch": "她不是医生，她是学生。",
                                                "py": "tā bú shì yīshēng, tā shì xuésheng.",
                                                "en": "She isn't a doctor, she's a student.",
                                                "fa": "او پزشک نیست، او دانش‌آموز است."
                                }
                ],
                "ex": "我是老师。",
                "exPy": "wǒ shì lǎoshī.",
                "exFa": "I am a teacher."
},
              {
                "type": "choice",
                "q": "جای خالی را کامل کنید.",
                "sentenceZh": "我妈妈__医生。",
                "sentencePy": "Wǒ māma ____ yīshēng.",
                "sentenceFa": "مامانم پزشک است.",
                "opts": [
                  "是",
                  "很",
                  "在"
                ],
                "ans": 0,
                "tip": "برای شغل و هویت از فعل ربطی «是» استفاده می‌شود: «我妈妈是医生» (مادرم پزشک است)." },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "这不是我的杯子",
                "tiles": [
                  "这",
                  "不是",
                  "我的",
                  "杯子"
                ],
                "en": "این لیوان من نیست.",
                "tip": "A + 不是‏ + B: 不‏ درست قبل از 是‏ می‌آید.",
                "py": "zhè bù shi wǒ de bēi zi",
                "pinyin": "zhè bù shi wǒ de bēi zi"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我同学是北京人。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "北京人‏ اسم است، پس 是‏ اینجا درست است.",
                "exFa": "همکلاسی‌ام پکنی است."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n她是很漂亮。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "漂亮‏ صفت است، پس 是‏ را حذف کنید و از 很‏ استفاده کنید. (جمله صحیح: 她很漂亮。)",
                "exFa": "او خیلی خوشگل است."
              },
              {
                "type": "choice",
                "q": "جای خالی را کامل کنید.",
                "sentenceZh": "那个人不__我的朋友。",
                "sentencePy": "Nà ge rén bù ____ wǒ de péngyou.",
                "sentenceFa": "آن شخص دوست من نیست.",
                "opts": [
                  "是",
                  "叫",
                  "在",
                  "有"
                ],
                "ans": 0,
                "tip": "در جمله منفی، «不» قبل از «是» می‌آید: «不是» (نیست)."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تشخیص ۴ تُن اصلی چینی، تُن خنثی و قانون تغییر تُن در 你好",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی (قانون تغییر تُن): در عبارت «你好» هر دو واژه تن ۳ دارند (nǐ + hǎo). در زبان چینی دو تن ۳ پشت سر هم دشوار است، بنابراین واژه اول خودبه‌خود به تن ۲ تبدیل می‌شود: [ní hǎo]!"
        },
        "miniLessons": [
          {
            "id": "p1_tones",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "mā",
                "pinyin": "mā",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "این سیلاب کدام تُن است؟",
                "audio": "mǎ",
                "pinyin": "mǎ",
                "opts": [
                  "تُن اول (ā)",
                  "تُن دوم (á)",
                  "تُن سوم (ǎ)",
                  "تُن چهارم (à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "این سیلاب با چه تُنی بیان شد؟",
                "audio": "shì",
                "pinyin": "shì",
                "opts": [
                  "تُن اول (ā)",
                  "تُن دوم (á)",
                  "تُن سوم (ǎ)",
                  "تُن چهارم (à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "p2_pairs",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «mǎ» (اسب — تُن ۳) را پخش می‌کند؟",
                "audio": "mǎ",
                "opts": [
                  "mǎ (اسب - تُن ۳)",
                  "mā (مادر - تُن ۱)",
                  "mà (سرزنش - تُن ۴)",
                  "má (کنف - تُن ۲)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه سیلاب «shì» (بودن — تُن ۴) است؟",
                "audio": "shì",
                "opts": [
                  "shí (عدد ۱۰ - تُن ۲)",
                  "shī (شعر - تُن ۱)",
                  "shì (بودن - تُن ۴)",
                  "shǐ (تاریخ - تُن ۳)"
                ],
                "ans": 2
              }
            ]
          },
          {
            "id": "p3_sandhi",
            "num": 3,
            "title": "قانون تغییر تُن در 你好",
            "desc": "سنجش فهم تغییر آوایی دو تُن ۳ پشت سر هم",
            "exercises": [
              {
                "type": "choice",
                "q": "عبارت «你好» (nǐ hǎo) در مکالمه واقعی با چه تُن‌هایی خوانده می‌شود؟",
                "opts": [
                  "ní hǎo (تُن ۲ سپس تُن ۳)",
                  "nǐ hǎo (هر دو تُن ۳)",
                  "nì hào (هر دو تُن ۴)",
                  "nī hāo (هر دو تُن ۱)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "چرا کلمه «你» در عبارت «你好» تغییر تُن می‌دهد؟",
                "opts": [
                  "چون دو تُن ۳ متوالی برای تلفظ روان‌تر به تُن ۲ + ۳ تبدیل می‌شوند",
                  "چون یک فعل است",
                  "چون انتهای جمله قرار گرفته",
                  "تغییری نمی‌کند"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "p4_repeat",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "你好",
                "py": "nǐ hǎo",
                "fa": "سلام",
                "tip": "با دقت به افت و خیز صدا، کلمه را با صدای بلند تکرار کنید."
              },
              {
                "type": "repeat",
                "target": "谢谢",
                "py": "xiè xie",
                "fa": "متشکرم",
                "tip": "واژه اول تُن ۴ محکم و واژه دوم تُن خنثی سبک است."
              },
              {
                "type": "repeat",
                "target": "再见",
                "py": "zài jiàn",
                "fa": "خداحافظ",
                "tip": "هر دو واژه تُن ۴ قاطع دارند: zài + jiàn."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره سلام، معرفی و احوالپرسی",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت بومی و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در بخش‌های صوتی، ابتدا بدون نگاه کردن به متن به گفت‌وگو گوش دهید.",
            "۲. کلمات کلیدی مانند 你好، 谢谢 یا 对不起 را در کلام گوینده شناسایی کنید.",
            "۳. در صورت نیاز با کلید پین‌یین می‌توانید نحوه خواندن کاراکترها را بررسی کنید.",
            "۴. مکالمات را تکرار کنید تا آهنگ جملات در ذهن شما ثبت شود."
          ]
        },
        "miniLessons": [
          {
            "id": "c1_listening",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید و کلمه‌ای را که شنیدید انتخاب کنید:",
                "audio": "duì bu qǐ",
                "opts": [
                  "对不起",
                  "没关系",
                  "不客气",
                  "谢谢"
                ],
                "ans": 0,
                "revealZh": "对不起",
                "revealPy": "duì bu qǐ"
              },
              {
                "type": "listening_q",
                "prompt": "کدام واژه را شنیدید؟",
                "audio": "bú kè qi",
                "opts": [
                  "谢谢",
                  "不客气",
                  "再见",
                  "你好"
                ],
                "ans": 1,
                "revealZh": "不客气",
                "revealPy": "bú kè qi"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور گوینده چیست؟",
                "audio": "wǒ shì lǎo shī",
                "opts": [
                  "من معلم هستم",
                  "من دانش‌آموز هستم",
                  "شما معلم هستید؟",
                  "سلام معلم"
                ],
                "ans": 0,
                "revealZh": "我是老师。",
                "revealPy": "Wǒ shì lǎoshī."
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه عبارتی گفت؟",
                "audio": "nǐ hǎo ma",
                "opts": [
                  "سلام!",
                  "حالت چطوره؟",
                  "خداحافظ!",
                  "متشکرم!"
                ],
                "ans": 1,
                "revealZh": "你好吗？",
                "revealPy": "Nǐ hǎo ma?"
              }
            ]
          },
          {
            "id": "c2_dialogue",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای کلاسی و احوالپرسی",
            "desc": "خواندن و درک متون کوتاه مکالمه روزمره",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "你好！我是王明。我是学生。他是张老师。",
                "textPy": "Nǐ hǎo! Wǒ shì Wáng Míng. Wǒ shì xuésheng. Tā shì Zhāng lǎoshī.",
                "textFa": "سلام! من وانگ مینگ هستم. من دانش‌آموز هستم. او آقای ژانگ، معلم است.",
                "q": "طبق متن بالا، «وانگ مینگ» چه کاره است؟",
                "opts": [
                  "دانش‌آموز (学生)",
                  "معلم (老师)",
                  "پزشک",
                  "راننده"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 你是老师吗？\nB: 我不是老师，我是学生。",
                "textPy": "A: Nǐ shì lǎoshī ma?\nB: Wǒ bú shì lǎoshī, wǒ shì xuésheng.",
                "textFa": "A: آیا شما معلم هستید؟\nB: من معلم نیستم، من دانش‌آموز هستم.",
                "q": "آیا گزاره «شخص B معلم است» درست است یا غلط؟",
                "opts": [
                  "غلط (او دانش‌آموز است)",
                  "درست (او معلم است)"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "李华：对不起！\n王明：没关系。谢谢你！\n李华：……，再见！",
                "textPy": "Lǐ Huá: Duì bu qǐ!\nWáng Míng: Méi guān xi. Xiè xie nǐ!\nLǐ Huá: ..., zài jiàn!",
                "textFa": "لی‌هوا: ببخشید!\nوانگ‌مینگ: اشکالی نداره. از تو ممنونم!\nلی‌هوا: (……)، خداحافظ!",
                "q": "در پاسخ به تشکر وانگ‌مینگ، جای خالی با کدام عبارت کامل می‌شود؟",
                "opts": [
                  "不客气 (خواهش می‌کنم)",
                  "对不起 (ببخشید)",
                  "没关系 (اشکالی نداره)",
                  "你好 (سلام)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع درک لغات، ساختار جملات و سنجش پایانی درس اول",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس اول رسیدید! این بخش تسلط کامل شما روی واژه‌ها، قواعد و درک مطلب را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی واژگان و دستور زبان",
            "سنجش تلفظ و درک شنیداری",
            "آزمون نهایی هیروگلیف و مفهوم جمله",
            "با پاس کردن این بخش، ایستگاه ۱ کامل شده و ایستگاه ۲ باز خواهد شد!"
          ]
        },
        "miniLessons": [
          {
            "id": "q1_practice",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله با 是 و پرسش با 吗",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی عبارت «خواهش می‌کنم» کدام است؟",
                "audio": "bú kè qi",
                "opts": [
                  "不客气 (bú kè qi)",
                  "对不起 (duì bu qǐ)",
                  "没关系 (méi guān xi)",
                  "谢谢 (xiè xie)"
                ],
                "ans": 0
              },
              {
                "type": "choice",
                "q": "کاراکتر «我» به چه معناست؟",
                "audio": "wǒ",
                "opts": [
                  "تو",
                  "او",
                  "من",
                  "ما"
                ],
                "ans": 2
              },
              {
                "type": "order",
                "prompt": "جمله «آیا تو دانش‌آموز هستی؟» را مرتب کنید:",
                "tiles": [
                  "吗",
                  "学生",
                  "是",
                  "你"
                ],
                "target": "你是学生吗"
              },
              {
                "type": "order",
                "prompt": "جمله منفی «من معلم نیستم.» را مرتب کنید:",
                "tiles": [
                  "老师",
                  "不是",
                  "我"
                ],
                "target": "我不是老师"
              }
            ]
          },
          {
            "id": "q2_challenge",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس اول",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "Xièxie nǐ!  Zài jiàn!",
                "opts": [
                  "از تو متشکرم! خداحافظ!",
                  "سلام! حالت چطوره؟",
                  "ببخشید، اشکالی نداره!",
                  "من دانش‌آموز هستم."
                ],
                "ans": 0,
                "revealZh": "谢谢你！再见！",
                "revealPy": "Xiè xie nǐ! Zài jiàn!"
              },
              {
                "type": "reading_q",
                "textZh": "你好！我是李华。他是王老师。张明是学生。\n王老师：你好吗？\n李华：我很好，谢谢老师！",
                "textPy": "Nǐ hǎo! Wǒ shì Lǐ Huá. Tā shì Wáng lǎoshī. Zhāng Míng shì xuésheng.\nWáng lǎoshī: Nǐ hǎo ma?\nLǐ Huá: Wǒ hěn hǎo, xièxie lǎoshī!",
                "textFa": "سلام! من لی‌هوا هستم. او آقای وانگ معلم است. ژانگ مینگ دانش‌آموز است.\nآقای وانگ: حالت چطوره؟\nلی‌هوا: خیلی خوبم، ممنون استاد!",
                "q": "«ژانگ مینگ» (张明) طبق متن بالا چه سمتی دارد؟",
                "opts": [
                  "دانش‌آموز است (学生)",
                  "معلم است (老师)",
                  "راننده است",
                  "پزشک است"
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
  "title": "Thank you!",
  "titleFa": "متشکرم!",
  "titleZh": "谢谢你",
  "level": "HSK 1",
  "desc": "آموزش بیان تشکر و پاسخ آن، ضمیر احترامی «您»، جمع «你们» و منفی‌ساز «不» همراه قانون تغییر تُن",
  "sections": [
    {
      "id": "vocab",
      "num": 1,
      "title": "Vocabulary",
      "titleFa": "واژگان",
      "titleZh": "生词",
      "icon": "book-open",
      "desc": "آموزش و تثبیت واژه‌های تشکر، احترام و ضمایر جمع",
      "intro": {
        "title": "آشنایی با واژه‌های تشکر و احترام درس دوم",
        "lead": "در این بخش با کلمات کلیدی برای تشکر کردن، پاسخ دادن مؤدبانه و خطاب قرار دادن دیگران آشنا می‌شوید:",
        "words": [
          {
            "hanzi": "谢谢",
            "py": "xiè xie",
            "fa": "متشکرم / ممنون",
            "ex": "谢谢您！",
            "exPy": "Xiè xie nín!",
            "exFa": "از شما متشکرم!"
          },
          {
            "hanzi": "不客气",
            "py": "bú kè qi",
            "fa": "خواهش می‌کنم",
            "ex": "不客气，再见！",
            "exPy": "Bú kè qi, zài jiàn!",
            "exFa": "خواهش می‌کنم، خداحافظ!"
          },
          {
            "hanzi": "再见",
            "py": "zài jiàn",
            "fa": "خداحافظ / به امید دیدار",
            "ex": "老师再见！",
            "exPy": "Lǎoshī zài jiàn!",
            "exFa": "خداحافظ استاد!"
          },
          {
            "hanzi": "您",
            "py": "nín",
            "fa": "شما (محترمانه)",
            "ex": "您好，您是老师吗？",
            "exPy": "Nín hǎo, nín shì lǎoshī ma?",
            "exFa": "سلام، آیا شما معلم هستید؟"
          },
          {
            "hanzi": "你们",
            "py": "nǐ men",
            "fa": "شما (جمع)",
            "ex": "你们好！",
            "exPy": "Nǐmen hǎo!",
            "exFa": "سلام شماها!"
          },
          {
            "hanzi": "不",
            "py": "bù",
            "fa": "نه / منفی‌ساز",
            "ex": "他不是学生。",
            "exPy": "Tā bú shì xuésheng.",
            "exFa": "او دانش‌آموز نیست."
          },
          {
            "hanzi": "你好",
            "py": "nǐ hǎo",
            "fa": "سلام (مرور درس ۱)",
            "ex": "你好，谢谢！",
            "exPy": "Nǐ hǎo, xiè xie!",
            "exFa": "سلام، ممنون!"
          },
          {
            "hanzi": "没关系",
            "py": "méi guān xi",
            "fa": "اشکالی ندارد (مرور درس ۱)",
            "ex": "没关系，谢谢您。",
            "exPy": "Méi guān xi, xiè xie nín.",
            "exFa": "اشکالی نداره، از شما ممنونم."
          }
        ]
      },
      "miniLessons": [
        {
          "id": "hsk1:1_v1",
          "num": 1,
          "title": "تشخیص معنی لغات",
          "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
          "exercises": [
            {
              "type": "choice",
              "q": "معنی این واژه چیست؟",
              "hanzi": "谢谢",
              "pinyin": "xiè xie",
              "opts": [
                "متشکرم",
                "خداحافظ",
                "خواهش می‌کنم",
                "شما (محترمانه)"
              ],
              "ans": 0,
              "audio": "xiè xie",
              "tip": "«谢谢» متداول‌ترین عبارت برای تشکر و قدردانی در زبان چینی است."
            },
            {
              "type": "choice",
              "q": "معنی این واژه چیست؟",
              "hanzi": "不",
              "pinyin": "bù",
              "opts": [
                "نه / منفی‌ساز",
                "بله",
                "خوب",
                "بسیار"
              ],
              "ans": 0,
              "audio": "bù",
              "tip": "«不» حرف منفی‌ساز است و قبل از فعل یا صفت می‌آید."
            },
            {
              "type": "choice",
              "q": "معنی این واژه چیست؟",
              "hanzi": "不客气",
              "pinyin": "bú kè qi",
              "opts": [
                "خواهش می‌کنم",
                "متشکرم",
                "خداحافظ",
                "سلام"
              ],
              "ans": 0,
              "audio": "bú kè qi",
              "tip": "«不客气» پاسخ مؤدبانه به تشکر است: به معنای تعارف نکنید / خواهش می‌کنم."
            },
            {
              "type": "choice",
              "q": "معنی این واژه چیست؟",
              "hanzi": "再见",
              "pinyin": "zài jiàn",
              "opts": [
                "خداحافظ",
                "صبح بخیر",
                "ببخشید",
                "خواهش می‌کنم"
              ],
              "ans": 0,
              "audio": "zài jiàn",
              "tip": "«再见» از دو بخش 再 (دوباره) و 见 (دیدن) تشکیل شده؛ یعنی به امید دیدار."
            }
          ]
        },
        {
          "id": "hsk1:1_v2",
          "num": 2,
          "title": "تطبیق لغت و معنی",
          "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
          "exercises": [
            {
              "type": "match",
              "title": "واژه‌های مرتبط را وصل کنید.",
              "pairs": [
                {
                  "zh": "谢谢",
                  "fa": "متشکرم"
                },
                {
                  "zh": "不",
                  "fa": "نه"
                },
                {
                  "zh": "不客气",
                  "fa": "خواهش می‌کنم"
                }
              ],
              "tip": "هر واژه چینی را به معنی فارسی متناظرش متصل کنید."
            },
            {
              "type": "match",
              "title": "واژه‌های مرتبط را وصل کنید.",
              "pairs": [
                {
                  "zh": "再见",
                  "fa": "خداحافظ"
                },
                {
                  "zh": "您",
                  "fa": "شما (محترمانه)"
                },
                {
                  "zh": "你们",
                  "fa": "شما (جمع)"
                }
              ],
              "tip": "«您» شکل محترمانه مفرد و «你们» شکل جمع است."
            }
          ]
        },
        {
          "id": "hsk1:1_v4",
          "num": 4,
          "title": "نوشتن کاراکتر (Hanzi)",
          "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
          "exercises": [
            {
              "type": "write",
              "char": "谢",
              "py": "xiè",
              "fa": "تشکر کردن",
              "tip": "کاراکتر «谢» با رادیکال سخن (讠) شروع می‌شود؛ یعنی کلمات تشکر با زبان بیان می‌شوند."
            },
            {
              "type": "write",
              "char": "您",
              "py": "nín",
              "fa": "شما (محترمانه)",
              "tip": "کاراکتر «您» از «你» (تو) + «心» (قلب) ساخته شده: برای احترام، از دل بگوئید!"
            },
            {
              "type": "write",
              "char": "再",
              "py": "zài",
              "fa": "دوباره دیدن",
              "tip": "کاراکتر «再» به معنای دوباره بودن است؛ در «再见» یعنی دوباره ببینیم."
            }
          ]
        },
        {
          "id": "hsk1:1_v5",
          "num": 5,
          "title": "جمله‌سازی با لغات",
          "desc": "چیدمان کلمات برای ساخت جملات این درس",
          "exercises": [
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "از شما متشکرم!",
              "tiles": [
                "您",
                "谢谢",
                "！"
              ],
              "target": "谢谢您！",
              "tip": "در چینی برای تشکر محترمانه ابتدا فعل تشکر و سپس ضمیر می‌آید: 谢谢您！"
            },
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "خواهش می‌کنم، خداحافظ!",
              "tiles": [
                "再见",
                "不客气",
                "，",
                "！"
              ],
              "target": "不客气，再见！",
              "tip": "پاسخ تشکر و خداحافظی: 不客气，再见！"
            },
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "او دانش‌آموز نیست.",
              "tiles": [
                "学生",
                "不是",
                "他",
                "。"
              ],
              "target": "他不是学生。",
              "tip": "ساختار منفی: فاعل (他) + فعل منفی (不是) + مفعول (学生)."
            }
          ]
        },
        {
          "id": "hsk1:1_v6",
          "num": 6,
          "title": "مرور جامع واژگان",
          "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
          "exercises": [
            {
              "type": "choice",
              "q": "پاسخ مناسب را انتخاب کنید.",
              "sentenceZh": "谢谢！",
              "sentenceFa": "متشکرم!",
              "opts": [
                "不客气",
                "对不起",
                "没关系",
                "你好"
              ],
              "ans": 0,
              "audio": "bú kè qi",
              "tip": "در پاسخ به «谢谢» (متشکرم)، عبارت «不客气» (خواهش می‌کنم) بیان می‌شود."
            },
            {
              "type": "choice",
              "subtype": "fa_to_zh",
              "q": "معادل چینی این واژه کدام است؟",
              "fa": "شما (محترمانه)",
              "opts": [
                "您",
                "你",
                "他",
                "你们"
              ],
              "ans": 0,
              "audio": "nín",
              "tip": "«您» (nín) ضمیر دوم‌شخص محترمانه برای ادای احترام به بزرگ‌ترها یا اساتید است."
            },
            {
              "type": "choice",
              "q": "معنی این واژه چیست؟",
              "hanzi": "你们好",
              "pinyin": "nǐ men hǎo",
              "opts": [
                "سلام به همگی (شماها)",
                "سلام به تو",
                "او معلم است",
                "من خوبم"
              ],
              "ans": 0,
              "audio": "nǐ men hǎo",
              "tip": "«你们» جمع مخاطب است و «你们好» یعنی سلام به همگی شما."
            }
          ]
        }
      ]
    },
    {
      "id": "grammar",
      "num": 2,
      "title": "Grammar",
      "titleFa": "دستور زبان (什么)",
      "titleZh": "什么",
      "icon": "sliders-horizontal",
      "desc": "什么 را همان‌جا بگذارید که پاسخ قرار می‌گیرد؛ ترتیب کلمات حفظ می‌شود.",
      "intro": {
        "title": "آموزش گرامر: 什么 · چه چیزی",
        "lead": "什么 را همان‌جا بگذارید که پاسخ قرار می‌گیرد؛ ترتیب کلمات همان می‌ماند.",
        "rule": "什么 · چه چیزی",
        "mark": "什么",
        "pattern": "فاعل + فعل + 什么 (+ اسم)？",
        "explain": "پرسش‌های چینی ترتیب جمله خبری را حفظ می‌کنند: واژه پرسشی دقیقاً همان‌جا می‌نشیند که پاسخ می‌نشیند. 你叫什么名字？ → 我叫李月. 什么 می‌تواند قبل از اسم هم بیاید: 什么书 (چه کتابی).",
        "mistake": "✗ 什么你想吃？ → ✓ 你想吃什么？ واژه پرسشی را به اول جمله نیاورید.",
        "compare": [
          {
            "w": "什么",
            "gloss": "چه چیزی / چه نوع",
            "glossFa": "چه نوع",
            "ex": "你看什么书"
          },
          {
            "w": "哪",
            "gloss": "کدام یک",
            "glossFa": "کدام",
            "ex": "你看哪本书"
          }
        ],
        "examples": [
          {
            "ch": "你叫什么名字？",
            "py": "nǐ jiào shénme míngzi?",
            "fa": "نام شما چیست؟"
          },
          {
            "ch": "你想喝什么？",
            "py": "nǐ xiǎng hē shénme?",
            "fa": "چه چیزی میل دارید بنوشید؟"
          },
          {
            "ch": "这是什么？",
            "py": "zhè shì shénme?",
            "fa": "این چیست؟"
          }
        ],
        "points": [
          "الگوی ساختاری: فاعل + فعل + 什么 (+ اسم)؟",
          "توضیح قاعده: ترتیب جمله خبری حفظ می‌شود و واژه پرسشی در جایگاه مفعول یا پاسخ می‌آید.",
          "اشتباه رایج: ✗ 什么你想吃？ → ✓ 你想吃什么？"
        ]
      },
      "miniLessons": [
        {
          "id": "g_prac_shenme",
          "num": 1,
          "title": "آموزش و آزمون گرامر 什么",
          "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 什么 · چه چیزی",
          "exercises": [
            {
              "type": "gram",
              "rule": "什么 · چه چیزی",
              "mark": "什么",
              "pattern": "فاعل + فعل + 什么 (+ اسم)？",
              "explain": "پرسش‌های چینی ترتیب جمله خبری را حفظ می‌کنند: واژه پرسشی دقیقاً همان‌جا می‌نشیند که پاسخ می‌نشیند. 你叫什么名字？ → 我叫李月. 什么 می‌تواند قبل از اسم هم بیاید: 什么书 (چه کتابی).",
              "mistake": "✗ 什么你想吃？ → ✓ 你想吃什么？ واژه پرسشی را به اول جمله نیاورید.",
              "compare": [
                {
                  "w": "什么",
                  "gloss": "چه چیزی / چه نوع",
                  "glossFa": "چه نوع",
                  "ex": "你看什么书"
                },
                {
                  "w": "哪",
                  "gloss": "کدام یک",
                  "glossFa": "کدام",
                  "ex": "你看哪本书"
                }
              ],
              "examples": [
                {
                  "ch": "你叫什么名字？",
                  "py": "nǐ jiào shénme míngzi?",
                  "fa": "نام شما چیست؟"
                },
                {
                  "ch": "你想喝什么？",
                  "py": "nǐ xiǎng hē shénme?",
                  "fa": "چه چیزی میل دارید بنوشید؟"
                },
                {
                  "ch": "这是什么？",
                  "py": "zhè shì shénme?",
                  "fa": "این چیست؟"
                }
              ]
            },
            {
              "type": "choice",
              "q": "جای خالی را کامل کنید.",
              "sentenceZh": "你昨天买了__？",
              "sentencePy": "Nǐ zuótiān mǎi le ____?",
              "sentenceFa": "دیروز چه چیزی خریدی؟",
              "opts": [
                "什么",
                "吗",
                "哪",
                "谁"
              ],
              "ans": 0,
              "tip": "در زبان چینی واژه پرسشی «什么» دقیقاً در همان جایگاه مفعول یا کلمه پاسخ می‌نشیند."
            },
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "سگ تو چه اسمی دارد؟",
              "tiles": [
                "你的狗",
                "叫",
                "什么",
                "名字"
              ],
              "target": "你的狗叫什么名字",
              "tip": "ترتیب ساختار پرسشی: فاعل (你的狗) + فعل (叫) + واژه پرسشی (什么) + اسم (名字)."
            },
            {
              "type": "choice",
              "subtype": "true_false",
              "q": "آیا این جمله از نظر گرامری درست است؟",
              "sentenceZh": "这是什么水果？",
              "sentencePy": "Zhè shì shénme shuǐguǒ?",
              "sentenceFa": "این چه میوه‌ای است؟",
              "opts": [
                "درست ✓",
                "نادرست ✗"
              ],
              "ans": 0,
              "tip": "جمله کاملاً درست است. «什么» قبل از اسم «水果» (میوه) آمده و معنای «چه میوه‌ای» می‌دهد."
            },
            {
              "type": "choice",
              "subtype": "true_false",
              "q": "آیا این جمله از نظر گرامری درست است؟",
              "sentenceZh": "什么你想看？",
              "sentencePy": "Shénme nǐ xiǎng kàn?",
              "sentenceFa": "می‌خواهی چه ببینی؟",
              "opts": [
                "درست ✓",
                "نادرست ✗"
              ],
              "ans": 1,
              "tip": "نادرست است! واژه پرسشی در چینی به ابتدای جمله منتقل نمی‌شود. ساختار صحیح: «你想看什么？»."
            },
            {
              "type": "choice",
              "q": "جای خالی را کامل کنید.",
              "sentenceZh": "你爸爸做__工作？",
              "sentencePy": "Nǐ bàba zuò ____ gōngzuò?",
              "sentenceFa": "پدر شما چه کاری انجام می‌دهد؟",
              "opts": [
                "什么",
                "吗",
                "哪儿",
                "怎么"
              ],
              "ans": 0,
              "tip": "«什么工作» یعنی «چه شغلی» و قبل از اسم شغل قرار می‌گیرد."
            }
          ]
        }
      ]
    },
    {
      "id": "pronunciation",
      "num": 3,
      "title": "Pronunciation",
      "titleFa": "تلفظ",
      "titleZh": "发音与声调",
      "icon": "audio-lines",
      "desc": "تمرین تُن واژه‌ها و قانون تغییر تُن 不 (bù→bú)",
      "intro": {
        "title": "آشنایی با تُن‌های آوایی زبان چینی",
        "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
        "tones": [
          {
            "no": 1,
            "mark": "ā",
            "name": "تُن اول (بالا و ممتد)",
            "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
            "sample": "mā (مادر)"
          },
          {
            "no": 2,
            "mark": "á",
            "name": "تُن دوم (بالارونده)",
            "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
            "sample": "má (کنف)"
          },
          {
            "no": 3,
            "mark": "ǎ",
            "name": "تُن سوم (فرود و صعود)",
            "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
            "sample": "mǎ (اسب)"
          },
          {
            "no": 4,
            "mark": "à",
            "name": "تُن چهارم (کوتاه و قاطع)",
            "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
            "sample": "mà (سرزنش کردن)"
          },
          {
            "no": 0,
            "mark": "a",
            "name": "تُن خنثی (سبک و کوتاه)",
            "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
            "sample": "ma (نشانه سؤال)"
          }
        ],
        "sandhiNote": "نکته طلایی این درس (قانون تغییر تُن 不): واژه «不» معمولاً تُن ۴ دارد (bù)، اما وقتی قبل از واژه‌ای با تُن ۴ بیاید، به تُن ۲ تبدیل می‌شود: 不客气 → bú kè qi، 不是 → bú shì!"
      },
      "miniLessons": [
        {
          "id": "hsk1:1_p1",
          "num": 1,
          "title": "تشخیص تُن‌های ۱ تا ۴",
          "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
          "exercises": [
            {
              "type": "tone_pick",
              "q": "تُن صحیح را انتخاب کنید.",
              "audio": "nín",
              "pinyin": "nín",
              "syllable": "nin",
              "opts": [
                "تُن اول (ā - ممتد)",
                "تُن دوم (á - صعودی)",
                "تُن سوم (ǎ - فرود و صعود)",
                "تُن چهارم (à - نزولی)"
              ],
              "ans": 1,
              "tip": "سیلاب «nín» دارای تُن دوم (بالارونده / صعودی: á) است."
            },
            {
              "type": "tone_pick",
              "q": "تُن صحیح را انتخاب کنید.",
              "audio": "zài",
              "pinyin": "zài",
              "syllable": "zai",
              "opts": [
                "تُن اول (ā - ممتد)",
                "تُن دوم (á - صعودی)",
                "تُن سوم (ǎ - فرود و صعود)",
                "تُن چهارم (à - نزولی)"
              ],
              "ans": 3,
              "tip": "سیلاب «zài» دارای تُن چهارم (کوتاه و قاطع / نزولی: à) است."
            },
            {
              "type": "tone_pick",
              "q": "تُن صحیح را انتخاب کنید.",
              "audio": "bú",
              "pinyin": "bú",
              "syllable": "bu",
              "opts": [
                "تُن اول (ā - ممتد)",
                "تُن دوم (á - صعودی)",
                "تُن سوم (ǎ - فرود و صعود)",
                "تُن چهارم (à - نزولی)"
              ],
              "ans": 1,
              "tip": "سیلاب «bú» دارای تُن دوم (بالارونده / صعودی: á) است."
            }
          ]
        },
        {
          "id": "hsk1:1_p2",
          "num": 2,
          "title": "تمایز آوایی کلمات مشابه",
          "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
          "exercises": [
            {
              "type": "audio_choice",
              "q": "کدام گزینه را شنیدید؟",
              "audio": "nín",
              "opts": [
                "nín",
                "mén",
                "nǐ",
                "nà"
              ],
              "ans": 0,
              "tip": "صدای پخش شده سیلاب «nín» (شما محترمانه - تُن ۲) بود."
            },
            {
              "type": "audio_choice",
              "q": "کدام گزینه را شنیدید؟",
              "audio": "bú",
              "opts": [
                "bú",
                "pú",
                "bù",
                "bǔ"
              ],
              "ans": 0,
              "tip": "صدای پخش شده سیلاب «bú» (تُن ۲) بود."
            },
            {
              "type": "audio_choice",
              "q": "کدام گزینه را شنیدید؟",
              "audio": "xiè",
              "opts": [
                "xiè",
                "xié",
                "jiě",
                "xīe"
              ],
              "ans": 0,
              "tip": "صدای پخش شده سیلاب «xiè» (تُن ۴) بود."
            }
          ]
        },
        {
          "id": "hsk1:1_p3",
          "num": 3,
          "title": "پدیده آوایی این درس",
          "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
          "exercises": [
            {
              "type": "choice",
              "q": "گزینه درست را انتخاب کنید.",
              "sentenceZh": "不客气",
              "sentencePy": "bú kè qi",
              "sentenceFa": "تلفظ واقعی 不客气 کدام است؟",
              "opts": [
                "bú kè qi",
                "bù kè qi",
                "bū kè qi",
                "bǔ kè qi"
              ],
              "ans": 0,
              "audio": "bú kè qi",
              "tip": "وقتی «不» قبل از هجایی با تُن ۴ (مانند 客) بیاید، به تُن ۲ (bú) تبدیل می‌شود: bú kè qi."
            },
            {
              "type": "choice",
              "q": "گزینه درست را انتخاب کنید.",
              "sentenceFa": "چه زمانی واژه «不» تغییر تُن می‌دهد؟",
              "opts": [
                "قبل از کلمه‌ای با تُن چهارم",
                "وقتی در انتهای جمله بیاید",
                "در تمام جملات سؤالی",
                "تُن 不 هرگز تغییر نمی‌کند"
              ],
              "ans": 0,
              "tip": "قانون تغییر تُن 不: 不 (bù - تُن ۴) قبل از یک هجای تُن ۴، تبدیل به bú (تُن ۲) می‌شود."
            }
          ]
        },
        {
          "id": "hsk1:1_p4",
          "num": 4,
          "title": "تکرار و سنجش تلفظ",
          "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
          "exercises": [
            {
              "type": "repeat",
              "target": "谢谢您",
              "py": "xiè xie nín",
              "fa": "از شما متشکرم",
              "tip": "واژه 谢谢 با تُن ۴ + تُن خنثی و 您 با تُن ۲ ادا می‌شود."
            },
            {
              "type": "repeat",
              "target": "不客气",
              "py": "bú kè qi",
              "fa": "خواهش می‌کنم",
              "tip": "دقت کنید که 不 در اینجا به دلیل هجای ۴ بعدی، به تُن ۲ (bú) تبدیل شده است."
            },
            {
              "type": "repeat",
              "target": "你们好",
              "py": "nǐ men hǎo",
              "fa": "سلام به همگی",
              "tip": "تلفظ 你们 با تُن ۳ + تُن خنثی و 好 با تُن ۳ است."
            }
          ]
        }
      ]
    },
    {
      "id": "conversation",
      "num": 4,
      "title": "Conversation",
      "titleFa": "مکالمه و درک مطلب",
      "titleZh": "课文与对话",
      "icon": "message-square",
      "desc": "مکالمات کوتاه کاربردی برای تشکر و پاسخ مؤدبانه",
      "intro": {
        "title": "مکالمه‌های این درس",
        "lead": "در این بخش دو مکالمه کوتاه کاربردی برای موقعیت‌های روزمره تشکر و خداحافظی را می‌شنوید:",
        "dialogues": [
          {
            "title": "مکالمه ۱: در کلاس درس",
            "lines": [
              {
                "speaker": "A",
                "ch": "谢谢你！",
                "py": "Xièxie nǐ!",
                "fa": "از تو متشکرم!"
              },
              {
                "speaker": "B",
                "ch": "不客气！",
                "py": "Bú kèqi!",
                "fa": "خواهش می‌کنم!"
              }
            ]
          },
          {
            "title": "مکالمه ۲: خداحافظی محترمانه",
            "lines": [
              {
                "speaker": "A",
                "ch": "谢谢您！",
                "py": "Xièxie nín!",
                "fa": "از شما متشکرم!"
              },
              {
                "speaker": "B",
                "ch": "不客气，再见！",
                "py": "Bú kèqi, zàijiàn!",
                "fa": "خواهش می‌کنم، خداحافظ!"
              },
              {
                "speaker": "A",
                "ch": "再见！",
                "py": "Zàijiàn!",
                "fa": "خداحافظ!"
              }
            ]
          }
        ]
      },
      "miniLessons": [
        {
          "id": "hsk1:1_c1",
          "num": 1,
          "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
          "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
          "exercises": [
            {
              "type": "listening_q",
              "prompt": "به گفت‌وگو گوش دهید و پاسخ دهید.",
              "audio": "Xièxie nín!",
              "revealZh": "谢谢您！",
              "revealPy": "Xièxie nín!",
              "opts": [
                "از شما متشکرم",
                "خداحافظ",
                "خواهش می‌کنم",
                "سلام"
              ],
              "ans": 0,
              "tip": "گوینده گفت: «谢谢您！» به معنای «از شما متشکرم!»."
            },
            {
              "type": "listening_q",
              "prompt": "به گفت‌وگو گوش دهید و پاسخ دهید.",
              "audio": "Bú kèqi, zàijiàn!",
              "revealZh": "不客气，再见！",
              "revealPy": "Bú kèqi, zàijiàn!",
              "opts": [
                "خواهش می‌کنم، خداحافظ!",
                "اشکالی نداره، سلام!",
                "ببخشید، متشکرم!",
                "او معلم ماست."
              ],
              "ans": 0,
              "tip": "گوینده گفت: «不客气，再见！» یعنی «خواهش می‌کنم، خداحافظ!»."
            },
            {
              "type": "listening_q",
              "prompt": "به گفت‌وگو گوش دهید و پاسخ دهید.",
              "audio": "Nǐmen shì xuésheng ma?",
              "revealZh": "你们是学生吗？",
              "revealPy": "Nǐmen shì xuésheng ma?",
              "opts": [
                "آیا شماها دانش‌آموز هستید؟",
                "آیا او معلم است؟",
                "اسم شما چیست؟",
                "حال شما چطور است؟"
              ],
              "ans": 0,
              "tip": "جمله شنیداری: «你们是学生吗？» یعنی «آیا شماها دانش‌آموز هستید؟»."
            },
            {
              "type": "listening_q",
              "prompt": "به گفت‌وگو گوش دهید و پاسخ دهید.",
              "audio": "Tā bú shì lǎoshī.",
              "revealZh": "他不是老师。",
              "revealPy": "Tā bú shì lǎoshī.",
              "opts": [
                "او معلم نیست",
                "او دانش‌آموز است",
                "من معلم نیستم",
                "او پزشک است"
              ],
              "ans": 0,
              "tip": "جمله شنیداری: «他不是老师。» یعنی «او معلم نیست»."
            }
          ]
        },
        {
          "id": "hsk1:1_c2",
          "num": 2,
          "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
          "desc": "خواندن و درک متون کوتاه مکالمه این درس",
          "exercises": [
            {
              "type": "reading_q",
              "prompt": "متن را بخوانید و پاسخ دهید.",
              "textZh": "李华：谢谢您！\n王明：不客气，再见！",
              "textPy": "Lǐ Huá: Xièxie nín!\nWáng Míng: Bú kèqi, zàijiàn!",
              "textFa": "لی‌هوا: از شما متشکرم!\nوانگ‌مینگ: خواهش می‌کنم، خداحافظ!",
              "q": "وانگ‌مینگ به تشکر لی‌هوا چه پاسخی داد؟",
              "opts": [
                "不客气 (خواهش می‌کنم)",
                "对不起 (ببخشید)",
                "没关系 (اشکالی نداره)",
                "你好 (سلام)"
              ],
              "ans": 0,
              "tip": "وانگ‌مینگ در پاسخ گفت: «不客气» یعنی «خواهش می‌کنم»."
            },
            {
              "type": "reading_q",
              "prompt": "متن را بخوانید و پاسخ دهید.",
              "textZh": "A: 你们好！你们是学生吗？\nB: 我们不是学生，我们是老师。",
              "textPy": "A: Nǐmen hǎo! Nǐmen shì xuésheng ma?\nB: Wǒmen bú shì xuésheng, wǒmen shì lǎoshī.",
              "textFa": "A: سلام شماها! آیا شماها دانش‌آموز هستید؟\nB: ما دانش‌آموز نیستیم، ما معلمیم.",
              "q": "شخص B چه سمتی دارد؟",
              "opts": [
                "معلم (老师)",
                "دانش‌آموز (学生)",
                "پدر (爸爸)",
                "پزشک (医生)"
              ],
              "ans": 0,
              "tip": "شخص B گفت: «我们是老师» یعنی «ما معلم هستیم»."
            },
            {
              "type": "reading_q",
              "prompt": "متن را بخوانید و پاسخ دهید.",
              "textZh": "王明：小姐，您好！\n李华：你好！谢谢您。\n王明：不客气。再见！",
              "textPy": "Wáng Míng: Xiǎojiě, nín hǎo!\nLǐ Huá: Nǐ hǎo! Xièxie nín.\nWáng Míng: Bú kèqi. Zàijiàn!",
              "textFa": "وانگ‌مینگ: خانم، سلام!\nلی‌هوا: سلام! از شما متشکرم.\nوانگ‌مینگ: خواهش می‌کنم. خداحافظ!",
              "q": "وانگ‌مینگ با چه واژه‌ای احترام گذاشت؟",
              "opts": [
                "您好 (شما محترمانه)",
                "你们好 (شماها)",
                "你好 (تو)",
                "再见 (خداحافظ)"
              ],
              "ans": 0,
              "tip": "وانگ‌مینگ از واژه احترامی «您好» (سلام به شما) استفاده کرد."
            }
          ]
        }
      ]
    },
    {
      "id": "quiz",
      "num": 5,
      "title": "Practice & Quiz",
      "titleFa": "تمرین و آزمون",
      "titleZh": "测验",
      "icon": "award",
      "desc": "آزمون جامع واژه‌های احترام، ضمایر جمع و منفی‌سازی",
      "intro": {
        "title": "آزمون و تمرین جامع پایانی",
        "lead": "به مرحله نهایی درس دوم رسیدید! این بخش تسلط شما روی تشکر، ضمیر احترامی و قانون تُن 不 را می‌سنجد:",
        "badges": [
          "آزمون ترکیبی واژگان احترام و ضمایر",
          "سنجش قانون تغییر تُن 不 (bù→bú)",
          "درک شنیداری مکالمات تشکر و خداحافظی",
          "با پاس کردن این بخش، ایستگاه ۲ کامل می‌شود!"
        ]
      },
      "miniLessons": [
        {
          "id": "hsk1:1_q1",
          "num": 1,
          "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
          "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
          "exercises": [
            {
              "type": "choice",
              "subtype": "fa_to_zh",
              "q": "معادل چینی این واژه کدام است؟",
              "fa": "خواهش می‌کنم",
              "opts": [
                "不客气",
                "对不起",
                "谢谢",
                "再见"
              ],
              "ans": 0,
              "audio": "bú kè qi",
              "tip": "معادل چینی «خواهش می‌کنم»، عبارت «不客气» (bú kè qi) است."
            },
            {
              "type": "choice",
              "q": "گزینه درست را انتخاب کنید.",
              "opts": [
                "我不是学生。",
                "我学生不是。",
                "不是我学生。",
                "我学生是不。"
              ],
              "ans": 0,
              "tip": "ترتیب صحیح ساختار منفی: فاعل (我) + فعل منفی (不是) + مفعول (学生)."
            },
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "آیا شماها معلم هستید؟",
              "tiles": [
                "你们",
                "是",
                "老师",
                "吗"
              ],
              "target": "你们是老师吗",
              "tip": "ترتیب پرسشی: فاعل (你们) + فعل (是) + مفعول (老师) + نشانه سؤال (吗)."
            },
            {
              "type": "order",
              "prompt": "جمله را مرتب کنید.",
              "fa": "خداحافظ استاد!",
              "tiles": [
                "老师",
                "再见"
              ],
              "target": "老师再见",
              "tip": "خطاب احترام در ابتدا می‌آید: 老师 (استاد) + 再见 (خداحافظ)."
            }
          ]
        },
        {
          "id": "hsk1:1_q2",
          "num": 2,
          "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
          "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
          "exercises": [
            {
              "type": "listening_q",
              "prompt": "به گفت‌وگو گوش دهید و پاسخ دهید.",
              "audio": "Xièxie nǐmen! Zàijiàn!",
              "revealZh": "谢谢你们！再见！",
              "revealPy": "Xièxie nǐmen! Zàijiàn!",
              "opts": [
                "از شماها متشکرم! خداحافظ!",
                "سلام به همگی! به امید دیدار!",
                "او دانش‌آموز ماست.",
                "ببخشید، متشکرم!"
              ],
              "ans": 0,
              "tip": "پیام صوتی: «谢谢你们！再见！» یعنی «از شماها متشکرم! خداحافظ!»."
            },
            {
              "type": "reading_q",
              "prompt": "متن را بخوانید و پاسخ دهید.",
              "textZh": "李华：王老师，谢谢您！\n王明：不客气，再见！",
              "textPy": "Lǐ Huá: Wáng lǎoshī, xièxie nín!\nWáng Míng: Bú kèqi, zàijiàn!",
              "textFa": "لی‌هوا: استاد وانگ، از شما متشکرم!\nوانگ‌مینگ: خواهش می‌کنم، خداحافظ!",
              "q": "در این مکالمه چه کسی تشکر کرد؟",
              "opts": [
                "لی‌هوا (李华)",
                "استاد وانگ (王老师)",
                "هر دو نفر",
                "هیچ‌کدام"
              ],
              "ans": 0,
              "tip": "لی‌هوا گفت: «王老师，谢谢您！» یعنی او از استاد تشکر کرد."
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
    "title": "What's your name?",
    "titleFa": "اسمت چیه؟",
    "titleZh": "你叫什么名字",
    "level": "HSK 1",
    "desc": "آموزش پرسیدن و گفتن اسم با «叫»، ذره پرسشی «吗» و معرفی ملیت با 中国 و 美国",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های اسم، شغل و ملیت",
        "intro": {
          "title": "آشنایی با واژه‌های معرفی و ملیت درس سوم",
          "lead": "در این بخش با کلمات کلیدی برای پرسیدن اسم، معرفی خود و گفتن ملیت آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "叫",
              "py": "jiào",
              "fa": "نامیدن / نام داشتن",
              "ex": "我叫李明。",
              "exPy": "Wǒ jiào Lǐ Míng.",
              "exFa": "اسم من لی مینگ است."
            },
            {
              "hanzi": "什么",
              "py": "shén me",
              "fa": "چه / چه چیزی",
              "ex": "你叫什么名字？",
              "exPy": "Nǐ jiào shénme míngzi?",
              "exFa": "اسمت چیست؟"
            },
            {
              "hanzi": "名字",
              "py": "míng zi",
              "fa": "اسم / نام",
              "ex": "他的名字很好。",
              "exPy": "Tāde míngzi hěn hǎo.",
              "exFa": "اسمش خیلی قشنگ است."
            },
            {
              "hanzi": "老师",
              "py": "lǎo shī",
              "fa": "معلم / استاد",
              "ex": "王老师是我的老师。",
              "exPy": "Wáng lǎoshī shì wǒde lǎoshī.",
              "exFa": "آقای وانگ معلم من است."
            },
            {
              "hanzi": "学生",
              "py": "xué sheng",
              "fa": "دانش‌آموز / شاگرد",
              "ex": "我是学生。",
              "exPy": "Wǒ shì xuésheng.",
              "exFa": "من دانش‌آموز هستم."
            },
            {
              "hanzi": "人",
              "py": "rén",
              "fa": "شخص / آدم",
              "ex": "他是好人。",
              "exPy": "Tā shì hǎo rén.",
              "exFa": "او آدم خوبی است."
            },
            {
              "hanzi": "中国",
              "py": "Zhōng guó",
              "fa": "چین",
              "ex": "我是中国人。",
              "exPy": "Wǒ shì Zhōngguó rén.",
              "exFa": "من چینی هستم."
            },
            {
              "hanzi": "美国",
              "py": "Měi guó",
              "fa": "آمریکا",
              "ex": "他是美国人。",
              "exPy": "Tā shì Měiguó rén.",
              "exFa": "او آمریکایی است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:2_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «叫» (jiào) چیست؟",
                "opts": [
                  "هستم",
                  "من",
                  "معلم",
                  "نامیدن"
                ],
                "ans": 3,
                "audio": "jiào",
                "hanzi": "叫",
                "pinyin": "jiào"
              },
              {
                "type": "choice",
                "q": "معنی واژه «什么» (shén me) چیست؟",
                "opts": [
                  "نامیدن",
                  "هستم",
                  "چه",
                  "من"
                ],
                "ans": 2,
                "audio": "shén me",
                "hanzi": "什么",
                "pinyin": "shén me"
              },
              {
                "type": "choice",
                "q": "معنی واژه «名字» (míng zi) چیست؟",
                "opts": [
                  "اسم",
                  "آمریکا",
                  "هستم",
                  "معلم"
                ],
                "ans": 0,
                "audio": "míng zi",
                "hanzi": "名字",
                "pinyin": "míng zi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «老师» (lǎo shī) چیست؟",
                "opts": [
                  "ذره پرسشی بله",
                  "نامیدن",
                  "معلم",
                  "چه"
                ],
                "ans": 2,
                "audio": "lǎo shī",
                "hanzi": "老师",
                "pinyin": "lǎo shī"
              }
            ]
          },
          {
            "id": "hsk1:2_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "叫",
                    "fa": "نامیدن"
                  },
                  {
                    "zh": "什么",
                    "fa": "چه"
                  },
                  {
                    "zh": "名字",
                    "fa": "اسم"
                  },
                  {
                    "zh": "我",
                    "fa": "من"
                  },
                  {
                    "zh": "是",
                    "fa": "هستم"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "老师",
                    "fa": "معلم"
                  },
                  {
                    "zh": "吗",
                    "fa": "ذره پرسشی بله"
                  },
                  {
                    "zh": "学生",
                    "fa": "دانش‌آموز"
                  },
                  {
                    "zh": "人",
                    "fa": "شخص"
                  },
                  {
                    "zh": "中国",
                    "fa": "چین"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:2_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "叫",
                "py": "jiào",
                "fa": "نامیدن",
                "tip": "کاراکتر «叫» از رادیکال دهان (口) ساخته شده: اسم را با دهان می‌گوئیم."
              },
              {
                "type": "write",
                "char": "名",
                "py": "míng",
                "fa": "اسم / نام",
                "tip": "کاراکتر «名» ترکیب شب (夕) و دهان (口) است؛ در تاریکی اسم خود را می‌گوئی تا بشناسندت."
              },
              {
                "type": "write",
                "char": "师",
                "py": "shī",
                "fa": "استاد / معلم",
                "tip": "کاراکتر «师» در واژه «老师» معلم را نشان می‌دهد؛ خطوطش از چپ به راست و سپس پایین نوشته می‌شوند."
              }
            ]
          },
          {
            "id": "hsk1:2_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "جمله «اسمت چیست؟» را بسازید:",
                "tiles": [
                  "名字",
                  "叫",
                  "你",
                  "什么"
                ],
                "target": "你叫什么名字"
              },
              {
                "type": "order",
                "prompt": "جمله «اسم من لی مینگ است.» را بسازید:",
                "tiles": [
                  "李明",
                  "叫",
                  "我"
                ],
                "target": "我叫李明"
              },
              {
                "type": "order",
                "prompt": "جمله «من چینی هستم.» را بسازید:",
                "tiles": [
                  "中国",
                  "人",
                  "是",
                  "我"
                ],
                "target": "我是中国人"
              }
            ]
          },
          {
            "id": "hsk1:2_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«你叫什么名字？» یعنی چه؟",
                "opts": [
                  "کجایی؟",
                  "اسمت چیست؟",
                  "شما کی هستید؟",
                  "چطور می‌نویسند؟"
                ],
                "ans": 1,
                "audio": "nǐ jiào shén me míngzi"
              },
              {
                "type": "choice",
                "q": "کدام جمله «او آمریکایی است.» است؟",
                "opts": [
                  "他是美国人。",
                  "他是中国学生。",
                  "她是中国人。",
                  "我是美国人吗？"
                ],
                "ans": 0,
                "audio": "tā shì měi guó rén"
              },
              {
                "type": "choice",
                "q": "وقتی بپرسند «你是学生吗？» پاسخ مثبت چیست؟",
                "opts": [
                  "我是。(بله، هستم)",
                  "不是，谢谢。",
                  "我叫学生。",
                  "你是我。"
                ],
                "ans": 0,
                "audio": "wǒ shì"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (十)",
        "titleZh": "十",
        "icon": "sliders-horizontal",
        "desc": "اعداد را مثل یک جمع بسازید: 三十五‏ یعنی سه-ده-پنج.",
        "intro": {
          "title": "آموزش گرامر: اعداد تا 99",
          "lead": "اعداد را مثل یک جمع بسازید: 三十五‏ یعنی سه-ده-پنج.",
          "rule": "اعداد تا 99",
          "mark": "十",
          "pattern": "tens digit + 十 + units digit",
          "explain": "تا 99 فقط ده واژه لازم است. 十一‏ = 11, 二十‏ = 20, 九十九‏ = 99. هنگام شمردن چیزها، 2 پیش از واژهٔ شمارش 两‏ می‌شود (两个‏)، اما داخل اعداد بزرگ‌تر 二‏ می‌ماند (十二‏, 二十‏).",
          "mistake": "✗ 我有二个儿子。 → ✓ 我有两个儿子。",
          "compare": [
            {
              "w": "二",
              "gloss": "inside a number",
              "ex": "二十二"
            },
            {
              "w": "两",
              "gloss": "before a measure word",
              "ex": "两个人"
            }
          ],
          "examples": [
            {
              "ch": "我儿子十二岁。",
              "py": "wǒ érzi shí'èr suì.",
              "en": "My son is twelve.",
              "fa": "My son is twelve."
            },
            {
              "ch": "我们学校有八十个老师。",
              "py": "wǒmen xuéxiào yǒu bāshí ge lǎoshī.",
              "en": "Our school has eighty teachers.",
              "fa": "Our school has eighty teachers."
            },
            {
              "ch": "这个杯子九十九块。",
              "py": "zhège bēizi jiǔshíjiǔ kuài.",
              "en": "This cup is ninety-nine yuan.",
              "fa": "This cup is ninety-nine yuan."
            }
          ],
          "points": [
            "الگوی ساختاری: tens digit + 十 + units digit",
            "توضیح قاعده: تا 99 فقط ده واژه لازم است. 十一‏ = 11, 二十‏ = 20, 九十九‏ = 99. هنگام شمردن چیزها، 2 پیش از واژهٔ شمارش 两‏ می‌شود (两个‏)، اما داخل اعداد بزرگ‌تر 二‏ می‌ماند (十二‏, 二十‏).",
            "اشتباه رایج: ✗ 我有二个儿子。 → ✓ 我有两个儿子。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_numbers",
            "num": 1,
            "title": "آموزش و آزمون گرامر 十",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی اعداد تا 99",
            "exercises": [
              {
                "type": "gram",
                "id": "numbers",
                "mark": "十",
                "rule": "اعداد تا 99",
                "titleFa": "اعداد تا 99",
                "catFa": "دستور زبان",
                "formula": "tens digit + 十 + units digit",
                "pattern": "tens digit + 十 + units digit",
                "desc": "اعداد را مثل یک جمع بسازید: 三十五‏ یعنی سه-ده-پنج.",
                "oneLine": "اعداد را مثل یک جمع بسازید: 三十五‏ یعنی سه-ده-پنج.",
                "explain": "تا 99 فقط ده واژه لازم است. 十一‏ = 11, 二十‏ = 20, 九十九‏ = 99. هنگام شمردن چیزها، 2 پیش از واژهٔ شمارش 两‏ می‌شود (两个‏)، اما داخل اعداد بزرگ‌تر 二‏ می‌ماند (十二‏, 二十‏).",
                "mistake": "✗ 我有二个儿子。 → ✓ 我有两个儿子。",
                "compare": [
                                {
                                                "w": "二",
                                                "gloss": "inside a number",
                                                "glossFa": "در ترکیب اعداد و شمارش ساده",
                                                "ex": "二十二"
                                },
                                {
                                                "w": "两",
                                                "gloss": "before a measure word",
                                                "glossFa": "قبل از واژه شمارش (دو تا)",
                                                "ex": "两个人"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我儿子十二岁。",
                                                "py": "wǒ érzi shí'èr suì.",
                                                "en": "My son is twelve.",
                                                "fa": "پسرم دوازده‌ساله است."
                                },
                                {
                                                "ch": "我们学校有八十个老师。",
                                                "py": "wǒmen xuéxiào yǒu bāshí ge lǎoshī.",
                                                "en": "Our school has eighty teachers.",
                                                "fa": "مدرسه ما هشتاد تا معلم دارد."
                                },
                                {
                                                "ch": "这个杯子九十九块。",
                                                "py": "zhège bēizi jiǔshíjiǔ kuài.",
                                                "en": "This cup is ninety-nine yuan.",
                                                "fa": "این فنجان نود و نه یوان است."
                                }
                ],
                "ex": "我儿子十二岁。",
                "exPy": "wǒ érzi shí'èr suì.",
                "exFa": "My son is twelve."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我有__个女儿，一个八岁，一个五岁。",
                "opts": [
                  "两",
                  "二",
                  "三"
                ],
                "ans": 0,
                "tip": "قبل از واژه شمارا، دو می‌شود 两‏، نه 二‏.",
                "exFa": "من دو دختر دارم - یکی هشت‌ساله است، یکی پنج‌ساله."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我们学校有九十六个老师",
                "tiles": [
                  "我们学校",
                  "有",
                  "九十",
                  "六",
                  "个",
                  "老师"
                ],
                "en": "مدرسه‌ی ما نودوشش معلم دارد.",
                "tip": "مثل یک جمع بسازید: 九十‏ + 六‏ = 96، سپس واژه‌ی شمارا.",
                "py": "wǒ men xué xiào yǒu jiǔ shí liù gè lǎo shī",
                "pinyin": "wǒ men xué xiào yǒu jiǔ shí liù gè lǎo shī"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我妈妈今年五十二岁。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "داخل عدد بزرگ‌تر، 2 همان 二‏ می‌ماند.",
                "exFa": "مامانم امسال پنجاه‌ودوساله است."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我有二本书。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "در شمردن چیزها، 2 قبل از واژه شمارا می‌شود 两‏. (جمله صحیح: 我有两本书。)",
                "exFa": "من دو کتاب دارم."
              },
              {
                "type": "choice",
                "q": "کلمه «十» باید در کدام جایگاه قرار گیرد؟\n[A] 我 [B] 女儿 [C] 今年 [D] 一 [E] 岁。 [F]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]",
                  "جایگاه [F]"
                ],
                "ans": 3,
                "tip": "یازده = ده + یک: 十一‏.",
                "exFa": "دخترم امسال یازده‌ساله است."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تُن خنثی در 什么 و 名字",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (تُن خنثی): هجای دوم واژه‌های 什么 (shén me)، 名字 (míng zi)، 学生 (xué sheng) و 吗 (ma) تُن خنثی دارند؛ یعنی کوتاه، سبک و بدون علامت ادا می‌شوند."
        },
        "miniLessons": [
          {
            "id": "hsk1:2_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "jiào",
                "pinyin": "jiào",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shén",
                "pinyin": "shén",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "rén",
                "pinyin": "rén",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:2_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «shì» (بودن — تُن ۴) را پخش می‌کند؟",
                "audio": "shì",
                "opts": [
                  "shǐ (تُن ۳)",
                  "shī (师 - تُن ۱)",
                  "shí (تُن ۲)",
                  "shì (是 - تُن ۴)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «jiào» (نامیدن — تُن ۴) است؟",
                "audio": "jiào",
                "opts": [
                  "jiā (家 - تُن ۱)",
                  "jiǎo (تُن ۳)",
                  "jiào xué",
                  "jiào (叫 - تُن ۴)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «míng» (اسم — تُن ۲) است؟",
                "audio": "míng",
                "opts": [
                  "mìn (تُن ۴)",
                  "míng (名 - تُن ۲)",
                  "mīn",
                  "mǐng"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:2_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "واژه «名字» چگونه ادا می‌شود؟",
                "opts": [
                  "míng zi — هجای دوم تُن خنثی دارد",
                  "míng zì — هر دو هجا تُن ۴ دارند",
                  "mǐng zǐ — هر دو تُن ۳",
                  "míng zǐ — هجای دوم تُن ۳"
                ],
                "ans": 0,
                "audio": "míng zi"
              },
              {
                "type": "choice",
                "q": "در پرسش «你是老师吗？» ذره 吗 چگونه ادا می‌شود؟",
                "opts": [
                  "با تُن ۲ بلند",
                  "با تُن ۴ قاطع",
                  "کاملاً حذف می‌شود",
                  "سبک و کوتاه با تُن خنثی"
                ],
                "ans": 3,
                "audio": "ma"
              }
            ]
          },
          {
            "id": "hsk1:2_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "你叫什么名字",
                "py": "nǐ jiào shén me míngzi",
                "fa": "اسمت چیست؟",
                "tip": "هجای me در 什么 و zi در 名字 را کوتاه و سبک بگوئید."
              },
              {
                "type": "repeat",
                "target": "我叫李明",
                "py": "wǒ jiào Lǐ Míng",
                "fa": "اسم من لی مینگ است",
                "tip": "我 تُن ۳ و 叫 تُن ۴ دارد؛ اسم را با تُن‌های اصلی بخوانید."
              },
              {
                "type": "repeat",
                "target": "我是中国人",
                "py": "wǒ shì Zhōng guó rén",
                "fa": "من چینی هستم",
                "tip": "中 با تُن ۱ یکنواخت و 国 با تُن ۲ بالارونده ادا می‌شود."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. اول بدون متن گوش بدهید و به دنبال «jiào shénme míngzi» باشید.",
            "۲. پاسخ‌های «我叫...» را در مکالمه پیدا کنید.",
            "۳. به تُن خنثی هجای دوم واژه‌ها دقت کنید.",
            "۴. هر مکالمه را دو بار گوش دهید: یک بار برای معنی، یک بار برای تُن‌ها."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:2_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه گفت؟",
                "audio": "nǐ jiào shén me míngzi",
                "opts": [
                  "اسمت چیست؟",
                  "کجایی؟",
                  "شما معلم هستید؟",
                  "او کیست؟"
                ],
                "ans": 0,
                "revealZh": "你叫什么名字？",
                "revealPy": "Nǐ jiào shénme míngzi?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ jiào Lǐ Míng",
                "opts": [
                  "او لی مینگ است",
                  "من معلمم",
                  "اسم من لی مینگ است",
                  "لی مینگ کیست؟"
                ],
                "ans": 2,
                "revealZh": "我叫李明。",
                "revealPy": "Wǒ jiào Lǐ Míng."
              },
              {
                "type": "listening_q",
                "prompt": "کدام جمله را شنیدید؟",
                "audio": "wǒ shì Zhōng guó rén",
                "opts": [
                  "我叫王明。",
                  "你是老师吗？",
                  "他是美国人。",
                  "我是中国人。"
                ],
                "ans": 3,
                "revealZh": "我是中国人。",
                "revealPy": "Wǒ shì Zhōngguó rén."
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه پرسید؟",
                "audio": "nǐ shì lǎo shī ma",
                "opts": [
                  "آیا تو معلم هستی؟",
                  "تو دانش‌آموز نیستی؟",
                  "اسمت چیست؟",
                  "او کجاست؟"
                ],
                "ans": 0,
                "revealZh": "你是老师吗？",
                "revealPy": "Nǐ shì lǎoshī ma?"
              }
            ]
          },
          {
            "id": "hsk1:2_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：你好！你叫什么名字？\n阿达：我叫阿达。你是中国人吗？\n李华：我是中国人。你是美国人吗？\n阿达：不，我是英国人。",
                "textPy": "Lǐ Huá: Nǐ hǎo! Nǐ jiào shénme míngzi?\nĀ Dá: Wǒ jiào Ā Dá. Nǐ shì Zhōngguó rén ma?\nLǐ Huá: Wǒ shì Zhōngguó rén. Nǐ shì Měiguó rén ma?\nĀ Dá: Bú shì, wǒ shì Yīngguó rén.",
                "textFa": "لی‌هوا: سلام! اسمت چیه؟\nآدا: اسم من آداست. تو چینی هستی؟\nلی‌هوا: من چینی هستم. تو آمریکایی هستی؟\nآدا: نه، من انگلیسی‌ام.",
                "q": "阿达 اسمش را چگونه گفت؟",
                "opts": [
                  "你叫阿达。(اسمت آداست)",
                  "他叫阿达。(اسم او آداست)",
                  "我是阿达。(من آدا هستم)",
                  "我叫阿达。(اسم من آداست)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "王老师：你叫什么名字？\n咪咪：我叫咪咪。我是学生。\n王老师：我是老师。",
                "textPy": "Wáng lǎoshī: Nǐ jiào shénme míngzi?\nMīmī: Wǒ jiào Mīmī. Wǒ shì xuésheng.\nWáng lǎoshī: Wǒ shì lǎoshī.",
                "textFa": "استاد وانگ: اسمت چیه؟\nمی‌می: اسم من می‌میه. من دانش‌آموزم.\nاستاد وانگ: من معلمم.",
                "q": "کدام گزاره درست است؟",
                "opts": [
                  "هر دو معلم‌اند",
                  "咪咪 دانش‌آموز است و 王老师 معلم است",
                  "هر دو دانش‌آموزند",
                  "咪咪 معلم است"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "A: 先生，你叫什么名字？\nB: 我叫大山。我是美国人。\nA: 我是中国人。谢谢，再见！",
                "textPy": "A: Xiānsheng, nǐ jiào shénme míngzi?\nB: Wǒ jiào Dàshān. Wǒ shì Měiguó rén.\nA: Wǒ shì Zhōngguó rén. Xièxie, zàijiàn!",
                "textFa": "A: آقا، اسم شما چیه؟\nB: اسم من دا شانه. من آمریکایی هستم.\nA: من چینی هستم. ممنون، خداحافظ!",
                "q": "大山 اهل کجاست؟",
                "opts": [
                  "中国 (چین)",
                  "不是中国 (غیر از چین)",
                  "美国 (آمریکا)",
                  "北京 (پکن)"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع پرسیدن اسم، ذره 吗 و ملیت‌ها",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس سوم رسیدید! این بخش تسلط شما روی معرفی، پرسش با 吗 و ملیت‌ها را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی واژگان اسم و ملیت",
            "سنجش ساختار 叫 + اسم و سؤال با 吗",
            "درک شنیداری مکالمات معرفی",
            "با پاس کردن این بخش، ایستگاه ۳ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:2_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «اسمت چیه؟» کدام است؟",
                "opts": [
                  "你是什么老师？",
                  "我叫什么名字？",
                  "你是名字吗？",
                  "你叫什么名字？"
                ],
                "ans": 3,
                "audio": "nǐ jiào shén me míngzi"
              },
              {
                "type": "choice",
                "q": "کلمه «什么» به چه معناست؟",
                "opts": [
                  "چه کسی",
                  "کجا",
                  "چطور",
                  "چه / چه چیزی"
                ],
                "ans": 3,
                "audio": "shén me"
              },
              {
                "type": "order",
                "prompt": "جمله «او آمریکایی است.» را مرتب کنید:",
                "tiles": [
                  "美国",
                  "人",
                  "他",
                  "是"
                ],
                "target": "他是美国人"
              },
              {
                "type": "order",
                "prompt": "سؤال «آیا تو چینی هستی؟» را مرتب کنید:",
                "tiles": [
                  "中国",
                  "人",
                  "你",
                  "是",
                  "吗"
                ],
                "target": "你是中国人吗"
              }
            ]
          },
          {
            "id": "hsk1:2_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ jiào Ā Dá,  wǒ shì xuésheng",
                "opts": [
                  "اسمت چیه؟ تو دانش‌آموزی؟",
                  "من آمریکایی‌ام؛ او چینیه",
                  "اسم او آداست؛ او معلمه",
                  "اسم من آداست؛ من دانش‌آموزم"
                ],
                "ans": 3,
                "revealZh": "我叫阿达，我是学生。",
                "revealPy": "Wǒ jiào Ā Dá, wǒ shì xuésheng."
              },
              {
                "type": "reading_q",
                "textZh": "李华：你叫什么名字？\n大山：我叫大山。我是美国人。你是哪国人？\n李华：我是中国人。",
                "textPy": "Lǐ Huá: Nǐ jiào shénme míngzi?\nDàshān: Wǒ jiào Dàshān. Wǒ shì Měiguó rén. Nǐ shì nǎ guó rén?\nLǐ Huá: Wǒ shì Zhōngguó rén.",
                "textFa": "لی‌هوا: اسمت چیه؟\nدا شان: اسم من دا شانه. من آمریکایی‌ام. تو اهل کدوم کشوریه؟\nلی‌هوا: من چینی‌ام.",
                "q": "大山 و 李华 اهل چه کشورهایی هستند؟",
                "opts": [
                  "大山 چینی و 李华 آمریکایی",
                  "大山 آمریکایی و 李华 چینی",
                  "هر دو آمریکایی",
                  "هر دو چینی"
                ],
                "ans": 1
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
    "title": "Who is she?",
    "titleFa": "اون خانم کیه؟",
    "titleZh": "她是谁",
    "level": "HSK 1",
    "desc": "آموزش پرسیدن «که؟» با 谁، ذره مالکیت «的»، ضمایر 她/他 و ذره پرسشی «呢»",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های پرسش شخص، مالکیت و آشنایان",
        "intro": {
          "title": "آشنایی با واژه‌های معرفی دیگران درس چهارم",
          "lead": "در این بخش با کلمات کلیدی برای پرسیدن «کی؟»، گفتن مالکیت و معرفی دوستان آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "她",
              "py": "tā",
              "fa": "او (زن)",
              "ex": "她是我的老师。",
              "exPy": "Tā shì wǒde lǎoshī.",
              "exFa": "او معلم من است."
            },
            {
              "hanzi": "谁",
              "py": "shéi",
              "fa": "چه کسی / کی",
              "ex": "她是谁？",
              "exPy": "Tā shì shéi?",
              "exFa": "او کیست؟"
            },
            {
              "hanzi": "的",
              "py": "de",
              "fa": "ذره مالکیت («های» فارسی)",
              "ex": "我的朋友",
              "exPy": "wǒde péngyou",
              "exFa": "دوستِ من"
            },
            {
              "hanzi": "汉语",
              "py": "Hàn yǔ",
              "fa": "زبان چینی",
              "ex": "我学汉语。",
              "exPy": "Wǒ xué Hànyǔ.",
              "exFa": "من چینی یاد می‌گیرم."
            },
            {
              "hanzi": "哪",
              "py": "nǎ",
              "fa": "کدام",
              "ex": "她是哪国人？",
              "exPy": "Tā shì nǎ guó rén?",
              "exFa": "او اهل کدام کشور است؟"
            },
            {
              "hanzi": "呢",
              "py": "ne",
              "fa": "ذره پرسشی «و ...؟»",
              "ex": "你呢？",
              "exPy": "Nǐ ne?",
              "exFa": "و تو؟"
            },
            {
              "hanzi": "同学",
              "py": "tóng xué",
              "fa": "همکلاسی",
              "ex": "他是我的同学。",
              "exPy": "Tā shì wǒde tóngxué.",
              "exFa": "او همکلاسی من است."
            },
            {
              "hanzi": "朋友",
              "py": "péng you",
              "fa": "دوست",
              "ex": "她是我朋友。",
              "exPy": "Tā shì wǒ péngyou.",
              "exFa": "او دوست من است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:3_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «她» (tā) چیست؟",
                "opts": [
                  "همکلاسی",
                  "چه کسی",
                  "کشور",
                  "او (زن)"
                ],
                "ans": 3,
                "audio": "tā",
                "hanzi": "她",
                "pinyin": "tā"
              },
              {
                "type": "choice",
                "q": "معنی واژه «谁» (shéi) چیست؟",
                "opts": [
                  "زبان چینی",
                  "ذره پرسشی «و ...؟»",
                  "دوست",
                  "چه کسی"
                ],
                "ans": 3,
                "audio": "shéi",
                "hanzi": "谁",
                "pinyin": "shéi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «的» (de) چیست؟",
                "opts": [
                  "کشور",
                  "ذره مالکیت («های» فارسی)",
                  "زبان چینی",
                  "او (مرد)"
                ],
                "ans": 1,
                "audio": "de",
                "hanzi": "的",
                "pinyin": "de"
              },
              {
                "type": "choice",
                "q": "معنی واژه «汉语» (Hàn yǔ) چیست؟",
                "opts": [
                  "کدام",
                  "زبان چینی",
                  "دوست",
                  "همکلاسی"
                ],
                "ans": 1,
                "audio": "Hàn yǔ",
                "hanzi": "汉语",
                "pinyin": "Hàn yǔ"
              }
            ]
          },
          {
            "id": "hsk1:3_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "她",
                    "fa": "او (زن)"
                  },
                  {
                    "zh": "谁",
                    "fa": "چه کسی"
                  },
                  {
                    "zh": "的",
                    "fa": "ذره مالکیت («های» فارسی)"
                  },
                  {
                    "zh": "汉语",
                    "fa": "زبان چینی"
                  },
                  {
                    "zh": "哪",
                    "fa": "کدام"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "国",
                    "fa": "کشور"
                  },
                  {
                    "zh": "呢",
                    "fa": "ذره پرسشی «و ...؟»"
                  },
                  {
                    "zh": "他",
                    "fa": "او (مرد)"
                  },
                  {
                    "zh": "同学",
                    "fa": "همکلاسی"
                  },
                  {
                    "zh": "朋友",
                    "fa": "دوست"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:3_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "她",
                "py": "tā",
                "fa": "او (زن)",
                "tip": "کاراکتر «她» با رادیکال زن (女) شروع می‌شود؛ تلفظش دقیقاً مثل 他 (او مرد) است: tā."
              },
              {
                "type": "write",
                "char": "谁",
                "py": "shéi",
                "fa": "چه کسی",
                "tip": "کاراکتر «谁» با رادیکال سخن (讠) ساخته شده: «کی؟» با زبان پرسیده می‌شود."
              },
              {
                "type": "write",
                "char": "朋",
                "py": "péng",
                "fa": "دوست",
                "tip": "کاراکتر «朋» دو ماه (月) کنار هم است: دو نفر مثل دو ماه، دوستان هم هستند."
              }
            ]
          },
          {
            "id": "hsk1:3_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «او کیست؟» را بسازید:",
                "tiles": [
                  "她",
                  "谁",
                  "是"
                ],
                "target": "她是谁"
              },
              {
                "type": "order",
                "prompt": "عبارت «معلمِ من» را بسازید:",
                "tiles": [
                  "老师",
                  "我",
                  "的"
                ],
                "target": "我的老师"
              },
              {
                "type": "order",
                "prompt": "سؤال «و تو؟» را بسازید:",
                "tiles": [
                  "你",
                  "呢"
                ],
                "target": "你呢"
              }
            ]
          },
          {
            "id": "hsk1:3_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«她是谁？» یعنی چه؟",
                "opts": [
                  "او چیست؟",
                  "او کجاست؟",
                  "کِی می‌آید؟",
                  "او (خانم) کیست؟"
                ],
                "ans": 3,
                "audio": "tā shì shéi"
              },
              {
                "type": "choice",
                "q": "معنی «我的同学» چیست؟",
                "opts": [
                  "همکلاسیِ من",
                  "همکلاسی او",
                  "من همکلاسی تو",
                  "تو معلم من"
                ],
                "ans": 0,
                "audio": "wǒde tóng xué"
              },
              {
                "type": "choice",
                "q": "پاسخ «你呢？» در مکالمه یعنی چه؟",
                "opts": [
                  "تو کی هستی؟",
                  "و تو؟ (تو چطور؟)",
                  "تو کجایی؟",
                  "نه، تو"
                ],
                "ans": 1,
                "audio": "nǐ ne"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (们)",
        "titleZh": "们",
        "icon": "sliders-horizontal",
        "desc": "您‏ یک 你‏ مودبانه است. وقتی بیش از یک نفر است، 们‏ را به 我‏، 你‏، 他‏ یا 她‏ اضافه کنید.",
        "intro": {
          "title": "آموزش گرامر: 您‏ و 们‏ · شما مؤدبانه، بیش از یک نفر",
          "lead": "您‏ یک 你‏ مودبانه است. وقتی بیش از یک نفر است، 们‏ را به 我‏، 你‏، 他‏ یا 她‏ اضافه کنید.",
          "rule": "您‏ و 们‏ · شما مؤدبانه، بیش از یک نفر",
          "mark": "们",
          "pattern": "我 / 你 / 他 / 她 + 们",
          "explain": "我们‏ = ما، 你们‏ = شما (بیش از یک نفر)، 他们‏ / 她们‏ = آن‌ها. به معلم، فرد مسن‌تر یا مشتری 您‏ بگویید: 您好‏！ برای سلام به یک گروه بگویید 你们好‏！ اسم‌های اشخاص هم می‌توانند 们‏ بگیرند (老师们‏, 学生们‏)، اما وقتی عدد پیش از آن‌ها می‌آید نه: 三个学生‏، نه 三个学生们‏.",
          "mistake": "✗ 我有三个朋友们。 → ✓ 我有三个朋友。",
          "compare": [
            {
              "w": "你",
              "gloss": "you",
              "ex": "你好"
            },
            {
              "w": "您",
              "gloss": "you (polite)",
              "ex": "您好"
            }
          ],
          "examples": [
            {
              "ch": "您好！",
              "py": "nín hǎo!",
              "en": "Hello! (polite)",
              "fa": "Hello! (polite)"
            },
            {
              "ch": "你们好！",
              "py": "nǐmen hǎo!",
              "en": "Hello, all of you!",
              "fa": "Hello, all of you!"
            },
            {
              "ch": "我们是学生。",
              "py": "wǒmen shì xuésheng.",
              "en": "We are students.",
              "fa": "We are students."
            }
          ],
          "points": [
            "الگوی ساختاری: 我 / 你 / 他 / 她 + 们",
            "توضیح قاعده: 我们‏ = ما، 你们‏ = شما (بیش از یک نفر)، 他们‏ / 她们‏ = آن‌ها. به معلم، فرد مسن‌تر یا مشتری 您‏ بگویید: 您好‏！ برای سلام به یک گروه بگویید 你们好‏！ اسم‌های اشخاص هم می‌توانند 们‏ بگیرند (老师们‏, 学生们‏)، اما وقتی عدد پیش از آن‌ها می‌آید نه: 三个学生‏، نه 三个学生们‏.",
            "اشتباه رایج: ✗ 我有三个朋友们。 → ✓ 我有三个朋友。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_nin-men",
            "num": 1,
            "title": "آموزش و آزمون گرامر 们",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 您‏ و 们‏ · شما مؤدبانه، بیش از یک نفر",
            "exercises": [
              {
                "type": "gram",
                "id": "nin-men",
                "mark": "们",
                "rule": "您‏ و 们‏ · شما مؤدبانه، بیش از یک نفر",
                "titleFa": "您‏ و 们‏ · شما مؤدبانه، بیش از یک نفر",
                "catFa": "ساختار جمله",
                "formula": "我 / 你 / 他 / 她 + 们",
                "pattern": "我 / 你 / 他 / 她 + 们",
                "desc": "您‏ یک 你‏ مودبانه است. وقتی بیش از یک نفر است، 们‏ را به 我‏، 你‏، 他‏ یا 她‏ اضافه کنید.",
                "oneLine": "您‏ یک 你‏ مودبانه است. وقتی بیش از یک نفر است، 们‏ را به 我‏، 你‏، 他‏ یا 她‏ اضافه کنید.",
                "explain": "我们‏ = ما، 你们‏ = شما (بیش از یک نفر)، 他们‏ / 她们‏ = آن‌ها. به معلم، فرد مسن‌تر یا مشتری 您‏ بگویید: 您好‏！ برای سلام به یک گروه بگویید 你们好‏！ اسم‌های اشخاص هم می‌توانند 们‏ بگیرند (老师们‏, 学生们‏)، اما وقتی عدد پیش از آن‌ها می‌آید نه: 三个学生‏، نه 三个学生们‏.",
                "mistake": "✗ 我有三个朋友们。 → ✓ 我有三个朋友。",
                "compare": [
                                {
                                                "w": "你",
                                                "gloss": "you",
                                                "glossFa": "تو (عادی و دوستانه)",
                                                "ex": "你好"
                                },
                                {
                                                "w": "您",
                                                "gloss": "you (polite)",
                                                "glossFa": "شما (مؤدبانه و رسمی)",
                                                "ex": "您好"
                                }
                ],
                "examples": [
                                {
                                                "ch": "您好！",
                                                "py": "nín hǎo!",
                                                "en": "Hello! (polite)",
                                                "fa": "سلام! (محترمانه)"
                                },
                                {
                                                "ch": "你们好！",
                                                "py": "nǐmen hǎo!",
                                                "en": "Hello, all of you!",
                                                "fa": "سلام به همگی شما!"
                                },
                                {
                                                "ch": "我们是学生。",
                                                "py": "wǒmen shì xuésheng.",
                                                "en": "We are students.",
                                                "fa": "ما دانش‌آموز هستیم."
                                }
                ],
                "ex": "您好！",
                "exPy": "nín hǎo!",
                "exFa": "Hello! (polite)"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n老师，__好！",
                "opts": [
                  "您",
                  "你们",
                  "我们"
                ],
                "ans": 0,
                "tip": "یک معلم، پس 您‏ مؤدبانه. 你们‏ برای بیش از یک نفر است.",
                "exFa": "سلام معلم!"
              },
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n__好！我是你们的老师。",
                "opts": [
                  "你们",
                  "您",
                  "我们"
                ],
                "ans": 0,
                "tip": "معلم به کل کلاس سلام می‌کند، پس 你们‏.",
                "exFa": "سلام به همه‌تان! من معلم شما هستم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我们是学生",
                "tiles": [
                  "我们",
                  "是",
                  "学生"
                ],
                "en": "ما دانش‌آموز هستیم.",
                "tip": "我们‏ فاعل است، پس اول می‌آید.",
                "py": "wǒ men shì xué sheng",
                "pinyin": "wǒ men shì xué sheng"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我有三个朋友们。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "وقتی عدد قبلش می‌آید، 朋友‏ 们‏ نمی‌گیرد. (جمله صحیح: 我有三个朋友。)",
                "exFa": "من سه دوست دارم."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n她们是我的老师。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "她们‏ = آن‌ها (زنان): 们‏ 她‏ را چندنفره می‌کند.",
                "exFa": "آن‌ها معلم‌های من هستند."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تمایز هوموفون‌های 她/他 (tā)",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (هوموفون‌ها): کاراکترهای 她 (او زن) و 他 (او مرد) دقیقاً یکسان تلفظ می‌شوند: tā با تُن ۱! معنی را فقط از نوشتار و متن مکالمه می‌فهمیم."
        },
        "miniLessons": [
          {
            "id": "hsk1:3_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "tā",
                "pinyin": "tā",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shéi",
                "pinyin": "shéi",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "hàn",
                "pinyin": "hàn",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:3_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «nǎ» (کدام — تُن ۳) را پخش می‌کند؟",
                "audio": "nǎ",
                "opts": [
                  "nǎ (哪 - تُن ۳)",
                  "lǎ (تُن ۳)",
                  "nā (تُن ۱)",
                  "nà (那 - تُن ۴)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «tóng» (هم — تُن ۲) است؟",
                "audio": "tóng",
                "opts": [
                  "tòng (تُن ۴)",
                  "tōng (تُن ۱)",
                  "tǒng (تُن ۳)",
                  "tóng (同 - تُن ۲)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «péng» (دوست — تُن ۲) است؟",
                "audio": "péng",
                "opts": [
                  "pèng (تُن ۴)",
                  "pēng (تُن ۱)",
                  "pěng (تُن ۳)",
                  "péng (朋 - تُن ۲)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:3_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "واژه‌های 她 و 他 چگونه تلفظ می‌شوند؟",
                "opts": [
                  "她 tā و 他 tà",
                  "هر دو یکسان: tā با تُن ۱",
                  "هر دو tǎ با تُن ۳",
                  "她 tà و 他 tā"
                ],
                "ans": 1,
                "audio": "tā"
              },
              {
                "type": "choice",
                "q": "در عبارت «我的老师» ذره 的 چگونه ادا می‌شود؟",
                "opts": [
                  "سبک و کوتاه با تُن خنثی (de)",
                  "کاملاً کشیده (dē)",
                  "با تُن ۴ قاطع (dè)",
                  "با تُن ۲ (dé)"
                ],
                "ans": 0,
                "audio": "wǒde lǎo shī"
              }
            ]
          },
          {
            "id": "hsk1:3_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "她是谁",
                "py": "tā shì shéi",
                "fa": "او کیست؟",
                "tip": "tā با تُن ۱ یکنواخت و shéi با تُن ۲ بالارونده ادا می‌شود."
              },
              {
                "type": "repeat",
                "target": "她是我的朋友",
                "py": "tā shì wǒde péngyou",
                "fa": "او دوست من است",
                "tip": "ذره 的 را خیلی کوتاه و سبک بخوانید."
              },
              {
                "type": "repeat",
                "target": "我是学生，你呢",
                "py": "wǒ shì xuésheng,  nǐ ne?",
                "fa": "من دانش‌آموزم؛ و تو؟",
                "tip": "در پایان، 呢 را با آهنگ بالا و خنثی بگوئید."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه صوتی به دنبال «shì shéi» و «nǎ guó rén» باشید.",
            "۲. از واژه‌های 她/他 فقط از متن بفهمید مرد است یا زن — صدا یکسان است!",
            "۳. به پاسخ‌های کوتاه با 呢 گوش کنید (你呢？ 他呢？).",
            "۴. مکالمه را نقش‌بازی کنید: یک نفر می‌پرسد، دیگری معرفی می‌کند."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:3_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "tā shì shéi",
                "opts": [
                  "او دانش‌آموز است؟",
                  "این چیست؟",
                  "او (خانم) کیست؟",
                  "او کجاست؟"
                ],
                "ans": 2,
                "revealZh": "她是谁？",
                "revealPy": "Tā shì shéi?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "tā shì wǒde péngyou",
                "opts": [
                  "او معلم من است",
                  "دوست او منم",
                  "من کیستم؟",
                  "او دوست من است"
                ],
                "ans": 3,
                "revealZh": "她是我的朋友。",
                "revealPy": "Tā shì wǒde péngyou."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "tā shì nǎ guó rén",
                "opts": [
                  "او آمریکایی است؟",
                  "او اهل کدام کشور است؟",
                  "او کیست؟",
                  "تو اهل چین هستی؟"
                ],
                "ans": 1,
                "revealZh": "她是哪国人？",
                "revealPy": "Tā shì nǎ guó rén?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ xué Hàn yǔ",
                "opts": [
                  "چینی خیلی خوبه",
                  "من معلم چینیم",
                  "او چینی یاد می‌گیرد",
                  "من زبان چینی یاد می‌گیرم"
                ],
                "ans": 3,
                "revealZh": "我学汉语。",
                "revealPy": "Wǒ xué Hànyǔ."
              }
            ]
          },
          {
            "id": "hsk1:3_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "阿达：她是谁？\n李华：她是李老师，我的汉语老师。\n阿达：她是哪国人？\n李华：她是中国人。",
                "textPy": "Ā Dá: Tā shì shéi?\nLǐ Huá: Tā shì Lǐ lǎoshī, wǒde Hànyǔ lǎoshī.\nĀ Dá: Tā shì nǎ guó rén?\nLǐ Huá: Tā shì Zhōngguó rén.",
                "textFa": "آدا: او کیه؟\nلی‌هوا: او خانم لی، معلم زبان چینی منه.\nآدا: اهل کدام کشوره؟\nلی‌هوا: اون چینیه.",
                "q": "李老师 چه کاره است؟",
                "opts": [
                  "معلم زبان چینی (汉语老师)",
                  "دانش‌آموز (学生)",
                  "دوست (朋友)",
                  "پزشک (医生)"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 他是谁？\nB: 他是王明，我的同学。\nA: 你呢？你是他的朋友吗？\nB: 是，我们是好朋友。",
                "textPy": "A: Tā shì shéi?\nB: Tā shì Wáng Míng, wǒde tóngxué.\nA: Nǐ ne? Nǐ shì tāde péngyou ma?\nB: Shì, wǒmen shì hǎo péngyou.",
                "textFa": "A: او کیه؟\nB: اون وانگ مینگه، همکلاسی من.\nA: و تو؟ دوست او هستی؟\nB: آره، ما دوستان خوبی هستیم.",
                "q": "王明 و B چه رابطه‌ای دارند؟",
                "opts": [
                  "پدر و پسر",
                  "دو غریبه",
                  "معلم و دانش‌آموز",
                  "همکلاسی (同学)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "李华：她是我朋友，她是美国人。\n咪咪：你呢？你是哪国人？\n李华：我是中国人。",
                "textPy": "Lǐ Huá: Tā shì wǒ péngyou, tā shì Měiguó rén.\nMīmī: Nǐ ne? Nǐ shì nǎ guó rén?\nLǐ Huá: Wǒ shì Zhōngguó rén.",
                "textFa": "لی‌هوا: او دوستمه، آمریکاییه.\nمی‌می: و تو؟ اهل کدوم کشوریه؟\nلی‌هوا: من چینی‌ام.",
                "q": "دوستِ 李华 اهل کجاست؟",
                "opts": [
                  "美国 (آمریکا)",
                  "معلوم نیست",
                  "中国 (چین)",
                  "北京 (پکن)"
                ],
                "ans": 0
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع ذره 的، پرسش با 谁 و سؤال کوتاه 呢",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس چهارم رسیدید! این بخش تسلط شما روی مالکیت، پرسش شخص و معرفی دوستان را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی ذره 的 و واژه‌های آشنایان",
            "سنجش ساختار 谁/哪国人 و 呢",
            "درک شنیداری مکالمات معرفی دیگران",
            "با پاس کردن این بخش، ایستگاه ۴ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:3_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «معلمِ من» کدام است؟",
                "opts": [
                  "是的我老师",
                  "我的老师",
                  "老师是我",
                  "我的老师是"
                ],
                "ans": 1,
                "audio": "wǒde lǎo shī"
              },
              {
                "type": "choice",
                "q": "کدام واژه «همکلاسی» است؟",
                "opts": [
                  "朋友 (péngyou)",
                  "学生 (xuésheng)",
                  "同学 (tóngxué)",
                  "老师 (lǎoshī)"
                ],
                "ans": 2,
                "audio": "tóng xué"
              },
              {
                "type": "order",
                "prompt": "سؤال «او اهل کدام کشور است؟» را مرتب کنید:",
                "tiles": [
                  "哪",
                  "是",
                  "国",
                  "她",
                  "人"
                ],
                "target": "她是哪国人"
              },
              {
                "type": "order",
                "prompt": "عبارت «دوستِ من» را بسازید:",
                "tiles": [
                  "朋友",
                  "的",
                  "我"
                ],
                "target": "我的朋友"
              }
            ]
          },
          {
            "id": "hsk1:3_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "tā shì wǒde Hàn yǔ lǎo shī",
                "opts": [
                  "او دانش‌آموز آمریکاییه",
                  "او معلم زبان چینی من است",
                  "من معلم چینیم",
                  "او دوست من نیست"
                ],
                "ans": 1,
                "revealZh": "她是我的汉语老师。",
                "revealPy": "Tā shì wǒde Hànyǔ lǎoshī."
              },
              {
                "type": "reading_q",
                "textZh": "阿达：她是谁？\n李华：她是咪咪，我的同学。\n阿达：她是哪国人？\n李华：她是美国人。",
                "textPy": "Ā Dá: Tā shì shéi?\nLǐ Huá: Tā shì Mīmī, wǒde tóngxué.\nĀ Dá: Tā shì nǎ guó rén?\nLǐ Huá: Tā shì Měiguó rén.",
                "textFa": "آدا: اون کیه؟\nلی‌هوا: او می‌میه، همکلاسی منه.\nآدا: اهل کجاست؟\nلی‌هوا: آمریکاییه.",
                "q": "咪咪 کیست؟",
                "opts": [
                  "معلمِ 李华",
                  "دوستِ 阿达 از آمریکا",
                  "همکلاسیِ 李华 (李华的同学)",
                  "معلم آمریکایی"
                ],
                "ans": 2
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
    "title": "How many people are in your family?",
    "titleFa": "خانواده‌ات چند نفره است؟",
    "titleZh": "你家有几口人",
    "level": "HSK 1",
    "desc": "آموزش فعل «有» برای داشتن، پرسش تعداد با «几»، شمارنده «口» و پرسیدن سن",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های خانواده، تعداد و سن",
        "intro": {
          "title": "آشنایی با واژه‌های خانواده و سن در درس پنجم",
          "lead": "در این بخش با کلمات کلیدی برای صحبت درباره خانواده، تعداد اعضا و سن آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "家",
              "py": "jiā",
              "fa": "خانه / خانواده",
              "ex": "我家有五口人。",
              "exPy": "Wǒ jiā yǒu wǔ kǒu rén.",
              "exFa": "خانواده ما پنج نفره است."
            },
            {
              "hanzi": "有",
              "py": "yǒu",
              "fa": "داشتن",
              "ex": "我有一个女儿。",
              "exPy": "Wǒ yǒu yí gè nǚ'ér.",
              "exFa": "من یک دختر دارم."
            },
            {
              "hanzi": "口",
              "py": "kǒu",
              "fa": "شمارنده اعضای خانواده",
              "ex": "你家有几口人？",
              "exPy": "Nǐ jiā yǒu jǐ kǒu rén?",
              "exFa": "خانواده‌ات چند نفره است؟"
            },
            {
              "hanzi": "女儿",
              "py": "nǚ'ér",
              "fa": "دختر (فرزند)",
              "ex": "他的女儿今年八岁。",
              "exPy": "Tāde nǚ'ér jīnnián bā suì.",
              "exFa": "دخترش امسال هشت‌ساله است."
            },
            {
              "hanzi": "几",
              "py": "jǐ",
              "fa": "چند",
              "ex": "你有几个孩子？",
              "exPy": "Nǐ yǒu jǐ gè háizi?",
              "exFa": "چند تا بچه داری؟"
            },
            {
              "hanzi": "岁",
              "py": "suì",
              "fa": "سال (سن)",
              "ex": "我今年二十岁。",
              "exPy": "Wǒ jīnnián èrshí suì.",
              "exFa": "امسال بیست‌سالم است."
            },
            {
              "hanzi": "今年",
              "py": "jīn nián",
              "fa": "امسال",
              "ex": "今年我二十岁。",
              "exPy": "Jīnnián wǒ èrshí suì.",
              "exFa": "امسال بیست‌سالم است."
            },
            {
              "hanzi": "多大",
              "py": "duō dà",
              "fa": "چقدر بزرگ / چندسال",
              "ex": "你今年多大？",
              "exPy": "Nǐ jīnnián duō dà?",
              "exFa": "امسال چندتا سالته؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:4_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «家» (jiā) چیست؟",
                "opts": [
                  "خانه",
                  "امسال",
                  "بزرگ",
                  "ذره تغییر وضعیت"
                ],
                "ans": 0,
                "audio": "jiā",
                "hanzi": "家",
                "pinyin": "jiā"
              },
              {
                "type": "choice",
                "q": "معنی واژه «有» (yǒu) چیست؟",
                "opts": [
                  "بزرگ",
                  "دختر (فرزند)",
                  "داشتن",
                  "سال (سن)"
                ],
                "ans": 2,
                "audio": "yǒu",
                "hanzi": "有",
                "pinyin": "yǒu"
              },
              {
                "type": "choice",
                "q": "معنی واژه «口» (kǒu) چیست؟",
                "opts": [
                  "چند",
                  "شمارنده اعضای خانواده",
                  "خانه",
                  "امسال"
                ],
                "ans": 1,
                "audio": "kǒu",
                "hanzi": "口",
                "pinyin": "kǒu"
              },
              {
                "type": "choice",
                "q": "معنی واژه «女儿» (nǚ ér) چیست؟",
                "opts": [
                  "داشتن",
                  "چند",
                  "دختر (فرزند)",
                  "سال (سن)"
                ],
                "ans": 2,
                "audio": "nǚ ér",
                "hanzi": "女儿",
                "pinyin": "nǚ ér"
              }
            ]
          },
          {
            "id": "hsk1:4_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "家",
                    "fa": "خانه"
                  },
                  {
                    "zh": "有",
                    "fa": "داشتن"
                  },
                  {
                    "zh": "口",
                    "fa": "شمارنده اعضای خانواده"
                  },
                  {
                    "zh": "女儿",
                    "fa": "دختر (فرزند)"
                  },
                  {
                    "zh": "几",
                    "fa": "چند"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "岁",
                    "fa": "سال (سن)"
                  },
                  {
                    "zh": "了",
                    "fa": "ذره تغییر وضعیت"
                  },
                  {
                    "zh": "今年",
                    "fa": "امسال"
                  },
                  {
                    "zh": "多",
                    "fa": "زیاد"
                  },
                  {
                    "zh": "大",
                    "fa": "بزرگ"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:4_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "家",
                "py": "jiā",
                "fa": "خانه / خانواده",
                "tip": "کاراکتر «家» سقف خانه (宀) روی خوک (豕) است: حیوان اهلی زیر سقف = خانه."
              },
              {
                "type": "write",
                "char": "有",
                "py": "yǒu",
                "fa": "داشتن",
                "tip": "کاراکتر «有» دست (月/یگر) که چیزی را نگه داشته: داشتن."
              },
              {
                "type": "write",
                "char": "女",
                "py": "nǚ",
                "fa": "زن / دختر",
                "tip": "کاراکتر «女» شکل زنی نشسته با دست‌های بسته است؛ رادیکال واژه‌های زنانه."
              }
            ]
          },
          {
            "id": "hsk1:4_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «خانواده‌ات چند نفره است؟» را بسازید:",
                "tiles": [
                  "几",
                  "口",
                  "你",
                  "家",
                  "有",
                  "人"
                ],
                "target": "你家有几口人"
              },
              {
                "type": "order",
                "prompt": "جمله «من یک دختر دارم.» را بسازید:",
                "tiles": [
                  "女儿",
                  "一",
                  "有",
                  "个",
                  "我"
                ],
                "target": "我有一个女儿"
              },
              {
                "type": "order",
                "prompt": "سؤال «امسال چندتا سالته؟» را بسازید:",
                "tiles": [
                  "今年",
                  "多大",
                  "你"
                ],
                "target": "你今年多大"
              }
            ]
          },
          {
            "id": "hsk1:4_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«你家有几口人？» یعنی چه؟",
                "opts": [
                  "خانه‌ات کجاست؟",
                  "دختری داری؟",
                  "چند سالته؟",
                  "خانواده‌ات چند نفره است؟"
                ],
                "ans": 3,
                "audio": "nǐ jiā yǒu jǐ kǒu rén"
              },
              {
                "type": "choice",
                "q": "معنی «我有一个女儿» چیست؟",
                "opts": [
                  "دختر من بزرگه",
                  "من در خانه‌ام",
                  "من پسر دارم",
                  "من یک دختر دارم"
                ],
                "ans": 3,
                "audio": "wǒ yǒu yí gè nǚ ér"
              },
              {
                "type": "choice",
                "q": "برای پرسیدن سن یک بچه کوچک چه می‌گوئیم؟",
                "opts": [
                  "几岁？ (چندساله است؟)",
                  "谁呢？",
                  "几口？",
                  "多大？ فقط برای بزرگ‌ترها"
                ],
                "ans": 0,
                "audio": "jǐ suì"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (有)",
        "titleZh": "有",
        "icon": "sliders-horizontal",
        "desc": "有‏ یعنی «داشتن»، و وقتی اول مکان بیاید یعنی «وجود دارد».",
        "intro": {
          "title": "آموزش گرامر: 有‏ · داشتن، وجود داشتن",
          "lead": "有‏ یعنی «داشتن»، و وقتی اول مکان بیاید یعنی «وجود دارد».",
          "rule": "有‏ · داشتن، وجود داشتن",
          "mark": "有",
          "pattern": "Person + 有 + thing · Place + 有 + thing",
          "explain": "有‏ دو نقش دارد. وقتی اول شخص بیاید، ملکیت است: 我有一个儿子‏. وقتی اول مکان بیاید، می‌گوید چه چیزی آنجاست: 桌子上有一本书‏. منفی همیشه 没有‏ است — هرگز 不有‏ نه.",
          "mistake": "✗ 我不有钱。 → ✓ 我没有钱。",
          "compare": [
            {
              "w": "有",
              "gloss": "what is there",
              "ex": "桌子上有书"
            },
            {
              "w": "在",
              "gloss": "where it is",
              "ex": "书在桌子上"
            }
          ],
          "examples": [
            {
              "ch": "我有一个女儿。",
              "py": "wǒ yǒu yí ge nǚ'ér.",
              "en": "I have a daughter.",
              "fa": "I have a daughter."
            },
            {
              "ch": "桌子上有一个杯子。",
              "py": "zhuōzi shang yǒu yí ge bēizi.",
              "en": "There is a cup on the table.",
              "fa": "There is a cup on the table."
            },
            {
              "ch": "商店里没有苹果。",
              "py": "shāngdiàn li méiyǒu píngguǒ.",
              "en": "The shop has no apples.",
              "fa": "The shop has no apples."
            }
          ],
          "points": [
            "الگوی ساختاری: Person + 有 + thing · Place + 有 + thing",
            "توضیح قاعده: 有‏ دو نقش دارد. وقتی اول شخص بیاید، ملکیت است: 我有一个儿子‏. وقتی اول مکان بیاید، می‌گوید چه چیزی آنجاست: 桌子上有一本书‏. منفی همیشه 没有‏ است — هرگز 不有‏ نه.",
            "اشتباه رایج: ✗ 我不有钱。 → ✓ 我没有钱。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_you",
            "num": 1,
            "title": "آموزش و آزمون گرامر 有",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 有‏ · داشتن، وجود داشتن",
            "exercises": [
              {
                "type": "gram",
                "id": "you",
                "mark": "有",
                "rule": "有‏ · داشتن، وجود داشتن",
                "titleFa": "有‏ · داشتن، وجود داشتن",
                "catFa": "افعال و کاربردها",
                "formula": "Person + 有 + thing · Place + 有 + thing",
                "pattern": "Person + 有 + thing · Place + 有 + thing",
                "desc": "有‏ یعنی «داشتن»، و وقتی اول مکان بیاید یعنی «وجود دارد».",
                "oneLine": "有‏ یعنی «داشتن»، و وقتی اول مکان بیاید یعنی «وجود دارد».",
                "explain": "有‏ دو نقش دارد. وقتی اول شخص بیاید، ملکیت است: 我有一个儿子‏. وقتی اول مکان بیاید، می‌گوید چه چیزی آنجاست: 桌子上有一本书‏. منفی همیشه 没有‏ است — هرگز 不有‏ نه.",
                "mistake": "✗ 我不有钱。 → ✓ 我没有钱。",
                "compare": [
                                {
                                                "w": "有",
                                                "gloss": "what is there",
                                                "glossFa": "چیزی که وجود دارد / داشتن",
                                                "ex": "桌子上有书"
                                },
                                {
                                                "w": "在",
                                                "gloss": "where it is",
                                                "glossFa": "جایی که قرار دارد (مکان)",
                                                "ex": "书在桌子上"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我有一个女儿。",
                                                "py": "wǒ yǒu yí ge nǚ'ér.",
                                                "en": "I have a daughter.",
                                                "fa": "من یک دختر دارم."
                                },
                                {
                                                "ch": "桌子上有一个杯子。",
                                                "py": "zhuōzi shang yǒu yí ge bēizi.",
                                                "en": "There is a cup on the table.",
                                                "fa": "روی میز یک فنجان است."
                                },
                                {
                                                "ch": "商店里没有苹果。",
                                                "py": "shāngdiàn li méiyǒu píngguǒ.",
                                                "en": "The shop has no apples.",
                                                "fa": "در فروشگاه سیب وجود ندارد."
                                }
                ],
                "ex": "我有一个女儿。",
                "exPy": "wǒ yǒu yí ge nǚ'ér.",
                "exFa": "I have a daughter."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我今天__钱。",
                "opts": [
                  "没有",
                  "不有",
                  "不是"
                ],
                "ans": 0,
                "tip": "منفیِ 有‏ همیشه 没有‏ است، هرگز 不有‏ نیست.",
                "exFa": "امروز پول ندارم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我家后面有一个医院",
                "tiles": [
                  "我家",
                  "后面",
                  "有",
                  "一个",
                  "医院"
                ],
                "en": "پشت خانه‌ام بیمارستانی هست.",
                "tip": "ابتدا مکان، سپس 有‏، سپس آنچه هست.",
                "py": "wǒ jiā hòu mian yǒu yí ge yī yuàn",
                "pinyin": "wǒ jiā hòu mian yǒu yí ge yī yuàn"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n这儿有出租车吗？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "مکان + 有‏ + چیز می‌پرسد آنجا چه هست.",
                "exFa": "اینجا تاکسی هست؟"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我不有中国朋友。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "有‏ فقط 没‏ می‌گیرد: 没有‏. (جمله صحیح: 我没有中国朋友。)",
                "exFa": "من هیچ دوست چینی ندارم."
              },
              {
                "type": "choice",
                "q": "کلمه «有» باید در کدام جایگاه قرار گیرد؟\n[A] 我的 [B] 电脑 [C] 里 [D] 很多 [E] 中国电影。 [F]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]",
                  "جایگاه [F]"
                ],
                "ans": 3,
                "tip": "مکان (电脑里‏) + 有‏ + آنچه هست.",
                "exFa": "روی کامپیوترم فیلم‌های چینی زیادی هست."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و قانون دو تُن ۳ متوالی در 几口",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (دو تُن ۳ متوالی): وقتی دو سیلاب با تُن ۳ پشت هم بیایند، اولی به تُن ۲ تبدیل می‌شود: 几口 → jí kǒu، 很好 → hén hǎo! در پین‌یین علامت ۳ می‌ماند اما تلفظ تغییر می‌کند."
        },
        "miniLessons": [
          {
            "id": "hsk1:4_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "jiā",
                "pinyin": "jiā",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "yǒu",
                "pinyin": "yǒu",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "suì",
                "pinyin": "suì",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:4_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «jǐ» (چند — تُن ۳) را پخش می‌کند؟",
                "audio": "jǐ",
                "opts": [
                  "jǐ (几 - تُن ۳)",
                  "jì (تُن ۴)",
                  "jī (家 پایه - تُن ۱)",
                  "jí (تُن ۲)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «duō» (زیاد — تُن ۱) است؟",
                "audio": "duō",
                "opts": [
                  "dǒ (تُن ۳)",
                  "duō (多 - تُن ۱)",
                  "duò (تُن ۴)",
                  "tuō (تُن ۱)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «kǒu» (شمارنده — تُن ۳) است؟",
                "audio": "kǒu",
                "opts": [
                  "kòu (تُن ۴)",
                  "kǒu (口 - تُن ۳)",
                  "kōu (تُن ۱)",
                  "gǒu (سگ - تُن ۳)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:4_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در پرسش «你家有几口人？» عبارت 几口 چگونه خوانده می‌شود؟",
                "opts": [
                  "هر دو تُن ۲ می‌شوند",
                  "هر دو تُن ۳ می‌مانند",
                  "دومی تُن ۴ می‌شود",
                  "jǐ→jí: اولی تُن ۲ می‌شود، دومی تُن ۳ می‌ماند"
                ],
                "ans": 3,
                "audio": "jí kǒu"
              },
              {
                "type": "choice",
                "q": "در «我很好» عبارت 很好 چگونه ادا می‌شود؟",
                "opts": [
                  "hēn hǎo — اولی تُن ۱",
                  "hěn hǎo — هر دو تُن ۳",
                  "hěn hào — دومی تُن ۴",
                  "hén hǎo — واژه اول به تُن ۲ تبدیل می‌شود"
                ],
                "ans": 3,
                "audio": "hén hǎo"
              }
            ]
          },
          {
            "id": "hsk1:4_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "我家有几口人",
                "py": "wǒ jiā yǒu jǐ kǒu rén",
                "fa": "خانواده من چند نفره است؟",
                "tip": "几口 را jí kǒu بخوانید: تُن ۲ سپس تُن ۳."
              },
              {
                "type": "repeat",
                "target": "我有一个女儿",
                "py": "wǒ yǒu yí gè nǚ ér",
                "fa": "من یک دختر دارم",
                "tip": "一 قبل از 个 (تُن ۴) به yí تغییر می‌کند."
              },
              {
                "type": "repeat",
                "target": "你今年多大",
                "py": "nǐ jīn nián duō dà",
                "fa": "امسال چندتا سالته؟",
                "tip": "今年 هر دو سیلاب تُن ۱ دارند؛ قاطع و یکنواخت بگوئید."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «jǐ kǒu rén» گوش کنید: پرسش تعداد اعضای خانواده.",
            "۲. پاسخ‌هایی مثل 我家有…口人 را پیدا کنید.",
            "۳. به قانون دو تُن ۳ در 几口 دقت کنید.",
            "۴. درباره خانواده خودتان نقش‌بازی کنید: چند نفره است؟"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:4_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "nǐ jiā yǒu jǐ kǒu rén",
                "opts": [
                  "خانه‌ات کجاست؟",
                  "دختری داری؟",
                  "چندسالته؟",
                  "خانواده‌ات چند نفره است؟"
                ],
                "ans": 3,
                "revealZh": "你家有几口人？",
                "revealPy": "Nǐ jiā yǒu jǐ kǒu rén?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ jiā yǒu sì kǒu rén",
                "opts": [
                  "من چهار سالته",
                  "خانواده من پنج نفره است",
                  "خانه من بزرگه",
                  "خانواده ما چهار نفره است"
                ],
                "ans": 3,
                "revealZh": "我家有四口人。",
                "revealPy": "Wǒ jiā yǒu sì kǒu rén."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "nǐ nǚ ér jīn nián duō dà",
                "opts": [
                  "پسرت چندساله است؟",
                  "دخترت کجاست؟",
                  "دختری داری؟",
                  "دخترت امسال چندتا سالشه؟"
                ],
                "ans": 3,
                "revealZh": "你女儿今年多大？",
                "revealPy": "Nǐ nǚ'ér jīnnián duō dà?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ yǒu yí gè nǚ ér",
                "opts": [
                  "من یک پسر دارم",
                  "من چند دختر دارم",
                  "من یک دختر دارم",
                  "او یک دختره"
                ],
                "ans": 2,
                "revealZh": "我有一个女儿。",
                "revealPy": "Wǒ yǒu yí gè nǚ'ér."
              }
            ]
          },
          {
            "id": "hsk1:4_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：你家有几口人？\n阿达：我家有五口人：爸爸、妈妈、女儿、儿子和我。",
                "textPy": "Lǐ Huá: Nǐ jiā yǒu jǐ kǒu rén?\nĀ Dá: Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, nǚ'ér, érzi hé wǒ.",
                "textFa": "لی‌هوا: خانواده‌ات چند نفره است؟\nآدا: خانواده ما پنج نفره است: پدر، مادر، دختر، پسر و من.",
                "q": "阿达 چند خواهر و برادر دارد؟",
                "opts": [
                  "ندارد",
                  "سه نفر",
                  "یک نفر",
                  "دو نفر (یک خواهر و یک برادر)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "A: 你女儿今年多大？\nB: 她今年八岁了。\nA: 你儿子呢？\nB: 他今年两岁。",
                "textPy": "A: Nǐ nǚ'ér jīnnián duō dà?\nB: Tā jīnnián bā suì le.\nA: Nǐ érzi ne?\nB: Tā jīnnián liǎng suì.",
                "textFa": "A: دخترت امسال چندتا سالشه؟\nB: امسال هشت‌ساله شده.\nA: پسرت چطور؟\nB: اون امسال دوسالشه.",
                "q": "پسر B چند ساله است؟",
                "opts": [
                  "دو سال (两岁)",
                  "هشت سال",
                  "معلوم نیست",
                  "بزرگ است"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "李华：你有几个孩子？\n王明：我有一个女儿，没有儿子。",
                "textPy": "Lǐ Huá: Nǐ yǒu jǐ gè háizi?\nWáng Míng: Wǒ yǒu yí gè nǚ'ér, méi yǒu érzi.",
                "textFa": "لی‌هوا: چندتا بچه داری؟\nوانگ مینگ: من یک دختر دارم، پسر ندارم.",
                "q": "王明 پسر دارد؟",
                "opts": [
                  "معلوم نیست",
                  "دو پسر دارد",
                  "آره، یک پسر دارد",
                  "نه، ندارد (没有儿子)"
                ],
                "ans": 3
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع فعل 有، شمارنده 口 و پرسیدن سن",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس پنجم رسیدید! این بخش تسلط شما روی داشتن، تعداد و سن را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی فعل 有 و شمارنده‌ها",
            "سنجش پرسش تعداد و سن",
            "درک شنیداری مکالمات خانواده",
            "با پاس کردن این بخش، ایستگاه ۱ کامل شده و ایستگاه ۲ باز می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:4_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «من یک دختر دارم» کدام است؟",
                "opts": [
                  "我家有女儿。",
                  "我有一个女儿。",
                  "我有女儿一个有。",
                  "我有一个儿子。"
                ],
                "ans": 1,
                "audio": "wǒ yǒu yí gè nǚ ér"
              },
              {
                "type": "choice",
                "q": "کدام سؤال درباره سن است؟",
                "opts": [
                  "你是谁？",
                  "你今年多大？",
                  "你家有几口人？",
                  "你有几个？"
                ],
                "ans": 1,
                "audio": "nǐ jīn nián duō dà"
              },
              {
                "type": "order",
                "prompt": "سؤال «خانواده‌ات چند نفره است؟» را مرتب کنید:",
                "tiles": [
                  "几",
                  "口",
                  "你",
                  "家",
                  "有",
                  "人"
                ],
                "target": "你家有几口人"
              },
              {
                "type": "order",
                "prompt": "جمله «من یک پسر دارم.» را بسازید:",
                "tiles": [
                  "儿子",
                  "一",
                  "有",
                  "个",
                  "我"
                ],
                "target": "我有一个儿子"
              }
            ]
          },
          {
            "id": "hsk1:4_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ jiā yǒu wǔ kǒu rén",
                "opts": [
                  "خانواده من سه نفره است",
                  "خانه من پنج‌تا اتاق دارد",
                  "من پنج سالته",
                  "خانواده من پنج نفره است"
                ],
                "ans": 3,
                "revealZh": "我家有五口人。",
                "revealPy": "Wǒ jiā yǒu wǔ kǒu rén."
              },
              {
                "type": "reading_q",
                "textZh": "李华：你家有几口人？\n咪咪：我家有四口人。我有一个女儿和一个儿子。\n李华：他们今年多大？\n咪咪：女儿八岁，儿子两岁。",
                "textPy": "Lǐ Huá: Nǐ jiā yǒu jǐ kǒu rén?\nMīmī: Wǒ jiā yǒu sì kǒu rén. Wǒ yǒu yí gè nǚ'ér hé yí gè érzi.\nLǐ Huá: Tāmen jīnnián duō dà?\nMīmī: Nǚ'ér bā suì, érzi liǎng suì.",
                "textFa": "لی‌هوا: خانواده‌ات چند نفره است؟\nمی‌می: چهار نفره. یک دختر و یک پسر دارم.\nلی‌هوا: امسال چندتا سالشون؟\nمی‌می: دخترم هشت‌ساله، پسرم دوساله.",
                "q": "فرزندان 咪咪 چند ساله‌اند؟",
                "opts": [
                  "هر دو ۸ سال",
                  "دختر ۸ و پسر ۲ سال",
                  "هر دو ۲ سال",
                  "دختر ۲ و پسر ۸ سال"
                ],
                "ans": 1
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
    "title": "Can you cook Chinese food?",
    "titleFa": "بلدی غذای چینی درست کنی؟",
    "titleZh": "你会做中国菜吗",
    "level": "HSK 1",
    "desc": "آموزش توانستن مهارتی با «会»، پرسش چگونگی با «怎么» و صفت‌ها با «很»",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های مهارت، غذا و نویسه‌ها",
        "intro": {
          "title": "آشنایی با واژه‌های مهارت و غذا در درس ششم",
          "lead": "در این بخش با کلمات کلیدی برای گفتن «بلدم»، پرسیدن «چطور؟» و تعریف غذا آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "会",
              "py": "huì",
              "fa": "بلد بودن (مهارت آموخته)",
              "ex": "我会做中国菜。",
              "exPy": "Wǒ huì zuò Zhōngguó cài.",
              "exFa": "من بلدم غذای چینی درست کنم."
            },
            {
              "hanzi": "做",
              "py": "zuò",
              "fa": "درست کردن / انجام دادن",
              "ex": "妈妈做菜很好吃。",
              "exPy": "Māma zuò cài hěn hǎochī.",
              "exFa": "غذایی که مادرم می‌پزد خیلی خوشمزه است."
            },
            {
              "hanzi": "说",
              "py": "shuō",
              "fa": "گفتن / صحبت کردن",
              "ex": "我会说汉语。",
              "exPy": "Wǒ huì shuō Hànyǔ.",
              "exFa": "من بلدم چینی صحبت کنم."
            },
            {
              "hanzi": "菜",
              "py": "cài",
              "fa": "غذا / سبزیجات",
              "ex": "中国菜很好吃。",
              "exPy": "Zhōngguó cài hěn hǎochī.",
              "exFa": "غذای چینی خیلی خوشمزه است."
            },
            {
              "hanzi": "好吃",
              "py": "hǎo chī",
              "fa": "خوشمزه",
              "ex": "妈妈做的菜好吃。",
              "exPy": "Māma zuòde cài hǎochī.",
              "exFa": "غذای دست‌پخت مامان خوشمزه است."
            },
            {
              "hanzi": "很",
              "py": "hěn",
              "fa": "خیلی / بسیار",
              "ex": "汉字很难。",
              "exPy": "Hànzì hěn nán.",
              "exFa": "نویسه‌های چینی خیلی سخت‌اند."
            },
            {
              "hanzi": "写",
              "py": "xiě",
              "fa": "نوشتن",
              "ex": "我会写汉字。",
              "exPy": "Wǒ huì xiě Hànzì.",
              "exFa": "من بلدم نویسه چینی بنویسم."
            },
            {
              "hanzi": "怎么",
              "py": "zěn me",
              "fa": "چطور / چگونه",
              "ex": "这个字怎么读？",
              "exPy": "Zhège zì zěnme dú?",
              "exFa": "این نویسه چطور خوانده می‌شود؟"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:5_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «会» (huì) چیست؟",
                "opts": [
                  "بلد بودن",
                  "غذا",
                  "نوشتن",
                  "خیلی"
                ],
                "ans": 0,
                "audio": "huì",
                "hanzi": "会",
                "pinyin": "huì"
              },
              {
                "type": "choice",
                "q": "معنی واژه «说» (shuō) چیست؟",
                "opts": [
                  "نویسه چینی (هانزی)",
                  "نوشتن",
                  "گفتن",
                  "خیلی"
                ],
                "ans": 2,
                "audio": "shuō",
                "hanzi": "说",
                "pinyin": "shuō"
              },
              {
                "type": "choice",
                "q": "معنی واژه «菜» (cài) چیست؟",
                "opts": [
                  "مادر",
                  "غذا",
                  "نوشتن",
                  "گفتن"
                ],
                "ans": 1,
                "audio": "cài",
                "hanzi": "菜",
                "pinyin": "cài"
              },
              {
                "type": "choice",
                "q": "معنی واژه «很» (hěn) چیست؟",
                "opts": [
                  "درست کردن",
                  "غذا",
                  "خیلی",
                  "نویسه چینی (هانزی)"
                ],
                "ans": 2,
                "audio": "hěn",
                "hanzi": "很",
                "pinyin": "hěn"
              }
            ]
          },
          {
            "id": "hsk1:5_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "会",
                    "fa": "بلد بودن"
                  },
                  {
                    "zh": "说",
                    "fa": "گفتن"
                  },
                  {
                    "zh": "妈妈",
                    "fa": "مادر"
                  },
                  {
                    "zh": "菜",
                    "fa": "غذا"
                  },
                  {
                    "zh": "很",
                    "fa": "خیلی"
                  },
                  {
                    "zh": "好吃",
                    "fa": "خوشمزه"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "做",
                    "fa": "درست کردن"
                  },
                  {
                    "zh": "写",
                    "fa": "نوشتن"
                  },
                  {
                    "zh": "汉字",
                    "fa": "نویسه چینی (هانزی)"
                  },
                  {
                    "zh": "字",
                    "fa": "نویسه"
                  },
                  {
                    "zh": "怎么",
                    "fa": "چطور"
                  },
                  {
                    "zh": "读",
                    "fa": "خواندن (متن)"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:5_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "好",
                "py": "hǎo",
                "fa": "خوب",
                "tip": "کاراکتر «好» ترکیب زن (女) و فرزند (子) است: نماد خوبی و آرامش."
              },
              {
                "type": "write",
                "char": "字",
                "py": "zì",
                "fa": "نویسه / حرف",
                "tip": "کاراکتر «字» سقف (宀) روی بچه (子) است: نویسه‌ها «بچه‌های» زبان‌اند."
              },
              {
                "type": "write",
                "char": "说",
                "py": "shuō",
                "fa": "گفتن",
                "tip": "کاراکتر «说» با رادیکال سخن (讠) شروع می‌شود؛ گفتن با زبان انجام می‌شود."
              }
            ]
          },
          {
            "id": "hsk1:5_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «بلدی غذای چینی درست کنی؟» را بسازید:",
                "tiles": [
                  "中国",
                  "会",
                  "做",
                  "菜",
                  "吗",
                  "你"
                ],
                "target": "你会做中国菜吗"
              },
              {
                "type": "order",
                "prompt": "جمله «من بلدم چینی صحبت کنم.» را بسازید:",
                "tiles": [
                  "汉语",
                  "会",
                  "说",
                  "我"
                ],
                "target": "我会说汉语"
              },
              {
                "type": "order",
                "prompt": "سؤال «این نویسه چطور خوانده می‌شود؟» را بسازید:",
                "tiles": [
                  "读",
                  "字",
                  "怎么",
                  "这个"
                ],
                "target": "这个字怎么读"
              }
            ]
          },
          {
            "id": "hsk1:5_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«你会做中国菜吗？» یعنی چه؟",
                "opts": [
                  "می‌روی غذای چینی بخوری؟",
                  "غذای چینی کجاست؟",
                  "غذای چینی خوشمزه است؟",
                  "بلدی غذای چینی درست کنی؟"
                ],
                "ans": 3,
                "audio": "nǐ huì zuò Zhōng guó cài ma"
              },
              {
                "type": "choice",
                "q": "«很» در جمله چه نقشی دارد؟",
                "opts": [
                  "قید «خیلی» برای صفت‌ها",
                  "شمارنده",
                  "ذره پرسشی",
                  "فعل «بودن»"
                ],
                "ans": 0,
                "audio": "hěn"
              },
              {
                "type": "choice",
                "q": "برای پرسیدن «این نویسه چطور خوانده می‌شود؟» چه می‌گوئیم؟",
                "opts": [
                  "怎么写这个读？",
                  "这个字是什么？",
                  "你会读吗读？",
                  "这个字怎么读？"
                ],
                "ans": 3,
                "audio": "zhège zì zěn me dú"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (哪)",
        "titleZh": "哪",
        "icon": "sliders-horizontal",
        "desc": "哪‏ + واژهٔ شمارش = کدام‌یک؛ 哪儿‏ = کجا.",
        "intro": {
          "title": "آموزش گرامر: 哪‏ / 哪儿‏ · کدام، کجا",
          "lead": "哪‏ + واژهٔ شمارش = کدام‌یک؛ 哪儿‏ = کجا.",
          "rule": "哪‏ / 哪儿‏ · کدام، کجا",
          "mark": "哪",
          "pattern": "哪 + (number) + measure + noun · 在 + 哪儿",
          "explain": "哪‏ یکی را از میان یک گروه برمی‌گزیند و بعدش واژهٔ شمارش یا اسم می‌خواهد: 哪个‏, 哪本书‏, 哪国人‏. 哪儿‏ دربارهٔ مکان می‌پرسد و معمولاً با 在‏ یا 去‏ می‌آید: 你在哪儿‏？ 你去哪儿‏？ این دو را از هم تشخیص دهید: 哪‏ nǎ, 那‏ nà (آن).",
          "mistake": "✗ 你住在哪‏？ شنیده می‌شود، اما 哪‏ به‌تنهایی ناقص است — ✓ 你住在哪儿‏？",
          "compare": [
            {
              "w": "哪儿",
              "gloss": "where? (asking)",
              "ex": "你在哪儿"
            },
            {
              "w": "那儿",
              "gloss": "there (pointing)",
              "ex": "我在那儿"
            }
          ],
          "examples": [
            {
              "ch": "你想买哪本书？",
              "py": "nǐ xiǎng mǎi nǎ běn shū?",
              "en": "Which book do you want to buy?",
              "fa": "Which book do you want to buy?"
            },
            {
              "ch": "你喜欢哪个？",
              "py": "nǐ xǐhuan nǎge?",
              "en": "Which one do you like?",
              "fa": "Which one do you like?"
            },
            {
              "ch": "你的狗在哪儿？",
              "py": "nǐ de gǒu zài nǎr?",
              "en": "Where is your dog?",
              "fa": "Where is your dog?"
            }
          ],
          "points": [
            "الگوی ساختاری: 哪 + (number) + measure + noun · 在 + 哪儿",
            "توضیح قاعده: 哪‏ یکی را از میان یک گروه برمی‌گزیند و بعدش واژهٔ شمارش یا اسم می‌خواهد: 哪个‏, 哪本书‏, 哪国人‏. 哪儿‏ دربارهٔ مکان می‌پرسد و معمولاً با 在‏ یا 去‏ می‌آید: 你在哪儿‏？ 你去哪儿‏？ این دو را از هم تشخیص دهید: 哪‏ nǎ, 那‏ nà (آن).",
            "اشتباه رایج: ✗ 你住在哪‏？ شنیده می‌شود، اما 哪‏ به‌تنهایی ناقص است — ✓ 你住在哪儿‏？"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_na-nar",
            "num": 1,
            "title": "آموزش و آزمون گرامر 哪",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 哪‏ / 哪儿‏ · کدام، کجا",
            "exercises": [
              {
                "type": "gram",
                "id": "na-nar",
                "mark": "哪",
                "rule": "哪‏ / 哪儿‏ · کدام، کجا",
                "titleFa": "哪‏ / 哪儿‏ · کدام، کجا",
                "catFa": "پرسش‌ها",
                "formula": "哪 + (number) + measure + noun · 在 + 哪儿",
                "pattern": "哪 + (number) + measure + noun · 在 + 哪儿",
                "desc": "哪‏ + واژهٔ شمارش = کدام‌یک؛ 哪儿‏ = کجا.",
                "oneLine": "哪‏ + واژهٔ شمارش = کدام‌یک؛ 哪儿‏ = کجا.",
                "explain": "哪‏ یکی را از میان یک گروه برمی‌گزیند و بعدش واژهٔ شمارش یا اسم می‌خواهد: 哪个‏, 哪本书‏, 哪国人‏. 哪儿‏ دربارهٔ مکان می‌پرسد و معمولاً با 在‏ یا 去‏ می‌آید: 你在哪儿‏？ 你去哪儿‏？ این دو را از هم تشخیص دهید: 哪‏ nǎ, 那‏ nà (آن).",
                "mistake": "✗ 你住在哪‏？ شنیده می‌شود، اما 哪‏ به‌تنهایی ناقص است — ✓ 你住在哪儿‏？",
                "compare": [
                                {
                                                "w": "哪儿",
                                                "gloss": "where? (asking)",
                                                "glossFa": "کجا؟ (پرسش)",
                                                "ex": "你在哪儿"
                                },
                                {
                                                "w": "那儿",
                                                "gloss": "there (pointing)",
                                                "glossFa": "آنجا (اشاره)",
                                                "ex": "我在那儿"
                                }
                ],
                "examples": [
                                {
                                                "ch": "你想买哪本书？",
                                                "py": "nǐ xiǎng mǎi nǎ běn shū?",
                                                "en": "Which book do you want to buy?",
                                                "fa": "کدام کتاب را می‌خواهی بخری؟"
                                },
                                {
                                                "ch": "你喜欢哪个？",
                                                "py": "nǐ xǐhuan nǎge?",
                                                "en": "Which one do you like?",
                                                "fa": "از کدام‌یک خوشت می‌آید؟"
                                },
                                {
                                                "ch": "你的狗在哪儿？",
                                                "py": "nǐ de gǒu zài nǎr?",
                                                "en": "Where is your dog?",
                                                "fa": "سگ تو کجاست؟"
                                }
                ],
                "ex": "你想买哪本书？",
                "exPy": "nǐ xiǎng mǎi nǎ běn shū?",
                "exFa": "Which book do you want to buy?"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n你想买__个？",
                "opts": [
                  "哪",
                  "哪儿",
                  "什么"
                ],
                "ans": 0,
                "tip": "«کدام‌یک» = 哪‏ + واژه شمارا؛ 哪儿‏ یعنی کجا.",
                "exFa": "کدام‌یک را می‌خواهی بخری؟"
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "你妈妈在哪儿工作",
                "tiles": [
                  "你妈妈",
                  "在",
                  "哪儿",
                  "工作"
                ],
                "en": "مامانت کجا کار می‌کند؟",
                "tip": "在‏ + 哪儿‏ مکان را می‌پرسد و قبل از فعل می‌آید.",
                "py": "nǐ mā ma zài nǎ r gōng zuò",
                "pinyin": "nǐ mā ma zài nǎ r gōng zuò"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你们在哪儿学习汉语？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "在‏ + 哪儿‏ مکان را می‌پرسد، قبل از فعل.",
                "exFa": "کجا چینی می‌خوانی؟"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你喜欢哪儿个？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "«کدام‌یک» می‌شود 哪个‏؛ 哪儿‏ فقط کجا را می‌پرسد. (جمله صحیح: 你喜欢哪个？)",
                "exFa": "کدام‌یک را دوست داری؟"
              },
              {
                "type": "choice",
                "q": "کلمه «哪儿» باید در کدام جایگاه قرار گیرد؟\n[A] 你 [B] 女儿 [C] 在 [D] ？ [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 3,
                "tip": "哪儿‏ بعد از 在‏ می‌آید، جایی که مکان قرار می‌گیرد.",
                "exFa": "دخترت کجاست؟"
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تُن‌های 好吃 و 怎么",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: در «好吃» واژه 好 (hǎo) قبل از تُن ۱ بدون تغییر تُن ۳ می‌ماند (برخلاف 你好). در «怎么» هجای دوم تُن خنثی است. و در «不会» واژه 不 به‌خاطر تُن ۴ واژه 会 به «bú» تغییر می‌کند!"
        },
        "miniLessons": [
          {
            "id": "hsk1:5_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "huì",
                "pinyin": "huì",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shuō",
                "pinyin": "shuō",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "dú",
                "pinyin": "dú",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:5_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «zuò» (درست کردن — تُن ۴) را پخش می‌کند؟",
                "audio": "zuò",
                "opts": [
                  "zuō (تُن ۱)",
                  "zùo",
                  "zuó (تُن ۲)",
                  "zuò (做 - تُن ۴)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «huì» (بلد بودن — تُن ۴) است؟",
                "audio": "huì",
                "opts": [
                  "huì (会 - تُن ۴)",
                  "huí (برگشتن - تُن ۲)",
                  "huǐ (تُن ۳)",
                  "hūi"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «hěn» (خیلی — تُن ۳) است؟",
                "audio": "hěn",
                "opts": [
                  "hēn (تُن ۱)",
                  "hén (تُن ۲)",
                  "hèn (تُن ۴)",
                  "hěn (很 - تُن ۳)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:5_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در عبارت «不会» واژه 不 چگونه ادا می‌شود؟",
                "opts": [
                  "bū huì — تُن ۱",
                  "bú huì — چون 会 تُن ۴ دارد، 不 به تُن ۲ تبدیل می‌شود",
                  "bù huì — تُن ۴ می‌ماند",
                  "bǔ huì — تُن ۳"
                ],
                "ans": 1,
                "audio": "bú huì"
              },
              {
                "type": "choice",
                "q": "واژه «怎么» چگونه ادا می‌شود؟",
                "opts": [
                  "zěn me — هجای دوم تُن خنثی",
                  "zěn mē — هر دو تُن ۱",
                  "zěn mé — هر دو تُن ۲",
                  "zēn mè"
                ],
                "ans": 0,
                "audio": "zěn me"
              }
            ]
          },
          {
            "id": "hsk1:5_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "我会说汉语",
                "py": "wǒ huì shuō Hàn yǔ",
                "fa": "من بلدم چینی صحبت کنم",
                "tip": "会 تُن ۴ قاطع و 说 تُن ۱ یکنواخت است."
              },
              {
                "type": "repeat",
                "target": "中国菜很好吃",
                "py": "Zhōng guó cài hěn hǎo chī",
                "fa": "غذای چینی خیلی خوشمزه است",
                "tip": "很 با تُن ۳ و 好吃 با تُن ۳ + تُن ۱؛ دقت کنید 好 اینجا تُنش تغییر نمی‌کند."
              },
              {
                "type": "repeat",
                "target": "这个字怎么读",
                "py": "zhège zì zěn me dú",
                "fa": "این نویسه چطور خوانده می‌شود؟",
                "tip": "هجای me و ge را کوتاه و خنثی بخوانید؛ 读 با تُن ۲ بالا می‌رود."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به دنبال «huì...ma» باشید: پرسش بلدی.",
            "۲. تعریف‌های غذایی مثل 很好吃 را پیدا کنید.",
            "۳. به پرسش‌های 怎么读/怎么写 گوش کنید.",
            "۴. با تکرار بلدی‌های خودتان (会说汉语？ 会写汉字？) تمرین کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:5_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "nǐ huì shuō Hàn yǔ ma",
                "opts": [
                  "بلدی چینی صحبت کنی؟",
                  "چینی می‌نویسی؟",
                  "چینی می‌خوری؟",
                  "چینی خیلی سخته؟"
                ],
                "ans": 0,
                "revealZh": "你会说汉语吗？",
                "revealPy": "Nǐ huì shuō Hànyǔ ma?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "māma zuòde cài hěn hǎo chī",
                "opts": [
                  "من بلدم مثل مامان بپزم",
                  "غذای دست‌پخت مامان خیلی خوشمزه است",
                  "غذای مامان بد است",
                  "مامان نمی‌دونه چه بپزه"
                ],
                "ans": 1,
                "revealZh": "妈妈做的菜很好吃。",
                "revealPy": "Māma zuòde cài hěn hǎochī."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "zhège zì zěn me dú",
                "opts": [
                  "این نویسه چطور خوانده می‌شود؟",
                  "این چیست؟",
                  "این نویسه چطور نوشته می‌شود؟",
                  "این چند است؟"
                ],
                "ans": 0,
                "revealZh": "这个字怎么读？",
                "revealPy": "Zhège zì zěnme dú?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ huì xiě Hàn zì",
                "opts": [
                  "من بلدم نویسه چینی بخوانم",
                  "او بلده بنویسد",
                  "من بلدم نویسه چینی بنویسم",
                  "من نویسه چینی ندارم"
                ],
                "ans": 2,
                "revealZh": "我会写汉字。",
                "revealPy": "Wǒ huì xiě Hànzì."
              }
            ]
          },
          {
            "id": "hsk1:5_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：你会做中国菜吗？\n阿达：我不会做。我妈妈会做，很好吃！\n李华：你会说汉语吗？\n阿达：会，我会说。",
                "textPy": "Lǐ Huá: Nǐ huì zuò Zhōngguó cài ma?\nĀ Dá: Wǒ bú huì zuò. Wǒ māma huì zuò, hěn hǎochī!\nLǐ Huá: Nǐ huì shuō Hànyǔ ma?\nĀ Dá: Huì, wǒ huì shuō.",
                "textFa": "لی‌هوا: بلدی غذای چینی درست کنی؟\nآدا: بلد نیستم. مامانم بلده، خیلی هم خوشمزه!\nلی‌هوا: بلدی چینی صحبت کنی؟\nآدا: بلدم!",
                "q": "阿达 بلد است غذای چینی درست کند؟",
                "opts": [
                  "نه، ولی مادرش بلد است",
                  "فقط پدرش بلد است",
                  "آره، خیلی خوب می‌پزد",
                  "هیچ‌کس بلد نیست"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 这个字怎么读？\nB: 我不知道。你去问老师吧。\nA: 老师在哪儿？\nB: 她在那儿。",
                "textPy": "A: Zhège zì zěnme dú?\nB: Wǒ bù zhīdào. Nǐ qù wèn lǎoshī ba.\nA: Lǎoshī zài nǎr?\nB: Tā zài nàr.",
                "textFa": "A: این نویسه چطور خونده می‌شه؟\nB: نمی‌دونم. برو از معلم بپرس.\nA: معلم کجاست؟\nB: اونجاست.",
                "q": "گوینده اول به دنبال کیست؟",
                "opts": [
                  "مادر (妈妈)",
                  "همکلاسی (同学)",
                  "دوست (朋友)",
                  "معلم (老师)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "王明：你会写汉字吗？\n李华：我会写一点儿。汉字很难！\n王明：是，很难。我会读，不会写。",
                "textPy": "Wáng Míng: Nǐ huì xiě Hànzì ma?\nLǐ Huá: Wǒ huì xiě yìdiǎnr. Hànzì hěn nán!\nWáng Míng: Shì, hěn nán. Wǒ huì dú, bú huì xiě.",
                "textFa": "وانگ مینگ: بلدی نویسه چینی بنویسی؟\nلی‌هوا: کمی بلدم. نویسه‌ها خیلی سخته!\nوانگ مینگ: آره، سخته. من بلدم بخونم، بلد نیستم بنویسم.",
                "q": "王明 چه بلدی‌هایی دارد؟",
                "opts": [
                  "هیچ‌کدام",
                  "فقط نوشتن",
                  "هم خواندن هم نوشتن",
                  "خواندن دارد، نوشتن ندارد"
                ],
                "ans": 3
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 会، 怎么 و قید 很",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس ششم رسیدید! این بخش تسلط شما روی بلدی‌ها، پرسش چگونگی و تعریف غذا را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی فعل 会 و پرسش 怎么",
            "سنجش قید 很 و صفات غذا",
            "درک شنیداری مکالمات بلدی و غذا",
            "با پاس کردن این بخش، ایستگاه ۶ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:5_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «من بلدم چینی صحبت کنم» کدام است؟",
                "opts": [
                  "我说会汉语。",
                  "我会说汉语。",
                  "我会汉语说。",
                  "我会说汉语吗？"
                ],
                "ans": 1,
                "audio": "wǒ huì shuō Hàn yǔ"
              },
              {
                "type": "choice",
                "q": "کدام واژه «درست کردن» است؟",
                "opts": [
                  "做 (zuò)",
                  "坐 (zuò - نشستن)",
                  "字 (zì)",
                  "吃 (chī)"
                ],
                "ans": 0,
                "audio": "zuò"
              },
              {
                "type": "order",
                "prompt": "سؤال «بلدی غذای چینی درست کنی؟» را مرتب کنید:",
                "tiles": [
                  "中国",
                  "会",
                  "做",
                  "菜",
                  "吗",
                  "你"
                ],
                "target": "你会做中国菜吗"
              },
              {
                "type": "order",
                "prompt": "جمله «غذای چینی خیلی خوشمزه است.» را بسازید:",
                "tiles": [
                  "中国",
                  "菜",
                  "很",
                  "好吃"
                ],
                "target": "中国菜很好吃"
              }
            ]
          },
          {
            "id": "hsk1:5_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ huì dú,  bú huì xiě",
                "opts": [
                  "نه می‌خوانم نه می‌نویسم",
                  "او بلد نیست بخواند",
                  "بلدم بخوانم، بلد نیستم بنویسم",
                  "بلدم بنویسم، بلد نیستم بخوانم"
                ],
                "ans": 2,
                "revealZh": "我会读，不会写。",
                "revealPy": "Wǒ huì dú, bú huì xiě."
              },
              {
                "type": "reading_q",
                "textZh": "李华：你会做中国菜吗？\n咪咪：我会做。妈妈做的菜很好吃！\n李华：你妈妈会说汉语吗？\n咪咪：会，她是中国人。",
                "textPy": "Lǐ Huá: Nǐ huì zuò Zhōngguó cài ma?\nMīmī: Wǒ huì zuò. Māma zuòde cài hěn hǎochī!\nLǐ Huá: Nǐ māma huì shuō Hànyǔ ma?\nMīmī: Huì, tā shì Zhōngguó rén.",
                "textFa": "لی‌هوا: بلدی غذای چینی درست کنی؟\nمی‌می: بلدم! غذای مامانم خیلی خوشمزه است!\nلی‌هوا: مامانت بلده چینی صحبت کنه؟\nمی‌می: آره، او چینیه.",
                "q": "چرا مادر 咪咪 بلد است چینی صحبت کند؟",
                "opts": [
                  "معلوم نیست",
                  "چون او چینی است (她是中国人)",
                  "چون خیلی خوشمزه می‌پزد",
                  "چون می‌دونه بنویسد"
                ],
                "ans": 1
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
    "title": "What day is tomorrow?",
    "titleFa": "فردا چندشنبه است؟",
    "titleZh": "明天星期几",
    "level": "HSK 1",
    "desc": "آموزش تاریخ و روزهای هفته با «月/号/星期»، درخواست مؤدبانه «请问» و رفتن با «去»",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های زمان، تاریخ و مدرسه",
        "intro": {
          "title": "آشنایی با واژه‌های زمان و تاریخ در درس هفتم",
          "lead": "در این بخش با کلمات کلیدی برای پرسیدن روز و تاریخ و رفتن به مکان‌ها آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "请问",
              "py": "qǐng wèn",
              "fa": "اجازه بدهید بپرسم",
              "ex": "请问，今天几月几号？",
              "exPy": "Qǐngwèn, jīntiān jǐ yuè jǐ hào?",
              "exFa": "ببخشید، امروز چندم ماه است؟"
            },
            {
              "hanzi": "今天",
              "py": "jīn tiān",
              "fa": "امروز",
              "ex": "今天星期三。",
              "exPy": "Jīntiān xīngqī sān.",
              "exFa": "امروز سه‌شنبه است."
            },
            {
              "hanzi": "星期",
              "py": "xīng qī",
              "fa": "هفته / روز هفته",
              "ex": "星期天我不去学校。",
              "exPy": "Xīngqī tiān wǒ bú qù xuéxiào.",
              "exFa": "یکشنبه به مدرسه نمی‌روم."
            },
            {
              "hanzi": "明天",
              "py": "míng tiān",
              "fa": "فردا",
              "ex": "明天我去看书。",
              "exPy": "Míngtiān wǒ qù kàn shū.",
              "exFa": "فردا می‌روم کتاب بخوانم."
            },
            {
              "hanzi": "昨天",
              "py": "zuó tiān",
              "fa": "دیروز",
              "ex": "昨天我去了学校。",
              "exPy": "Zuótiān wǒ qùle xuéxiào.",
              "exFa": "دیروز به مدرسه رفتم."
            },
            {
              "hanzi": "去",
              "py": "qù",
              "fa": "رفتن",
              "ex": "我明天去学校。",
              "exPy": "Wǒ míngtiān qù xuéxiào.",
              "exFa": "فردا به مدرسه می‌روم."
            },
            {
              "hanzi": "学校",
              "py": "xué xiào",
              "fa": "مدرسه",
              "ex": "我们的学校很大。",
              "exPy": "Wǒmen de xuéxiào hěn dà.",
              "exFa": "مدرسه ما خیلی بزرگ است."
            },
            {
              "hanzi": "看书",
              "py": "kàn shū",
              "fa": "کتاب خواندن / کتاب دیدن",
              "ex": "我喜欢看书。",
              "exPy": "Wǒ xǐhuan kàn shū.",
              "exFa": "من دوست دارم کتاب بخوانم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:6_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «请问» (qǐng wèn) چیست؟",
                "opts": [
                  "دیروز",
                  "امروز",
                  "روز ماه",
                  "اجازه بدهید بپرسم"
                ],
                "ans": 3,
                "audio": "qǐng wèn",
                "hanzi": "请问",
                "pinyin": "qǐng wèn"
              },
              {
                "type": "choice",
                "q": "معنی واژه «今天» (jīn tiān) چیست؟",
                "opts": [
                  "امروز",
                  "هفته",
                  "دیدن",
                  "ماه"
                ],
                "ans": 0,
                "audio": "jīn tiān",
                "hanzi": "今天",
                "pinyin": "jīn tiān"
              },
              {
                "type": "choice",
                "q": "معنی واژه «星期» (xīng qī) چیست؟",
                "opts": [
                  "ماه",
                  "هفته",
                  "دیدن",
                  "رفتن"
                ],
                "ans": 1,
                "audio": "xīng qī",
                "hanzi": "星期",
                "pinyin": "xīng qī"
              },
              {
                "type": "choice",
                "q": "معنی واژه «昨天» (zuó tiān) چیست؟",
                "opts": [
                  "هفته",
                  "دیدن",
                  "دیروز",
                  "رفتن"
                ],
                "ans": 2,
                "audio": "zuó tiān",
                "hanzi": "昨天",
                "pinyin": "zuó tiān"
              }
            ]
          },
          {
            "id": "hsk1:6_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "请问",
                    "fa": "اجازه بدهید بپرسم"
                  },
                  {
                    "zh": "今天",
                    "fa": "امروز"
                  },
                  {
                    "zh": "号",
                    "fa": "روز ماه"
                  },
                  {
                    "zh": "月",
                    "fa": "ماه"
                  },
                  {
                    "zh": "星期",
                    "fa": "هفته"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "昨天",
                    "fa": "دیروز"
                  },
                  {
                    "zh": "明天",
                    "fa": "فردا"
                  },
                  {
                    "zh": "去",
                    "fa": "رفتن"
                  },
                  {
                    "zh": "学校",
                    "fa": "مدرسه"
                  },
                  {
                    "zh": "看",
                    "fa": "دیدن"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:6_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "明",
                "py": "míng",
                "fa": "روشن / فردا",
                "tip": "کاراکتر «明» ترکیب خورشید (日) و ماه (月) است: روشنایی؛ در «明天» یعنی فردا."
              },
              {
                "type": "write",
                "char": "书",
                "py": "shū",
                "fa": "کتاب",
                "tip": "کاراکتر «书» شکل قلمی است که روی کاغذ حرکت می‌کند: کتاب و نوشتن."
              },
              {
                "type": "write",
                "char": "月",
                "py": "yuè",
                "fa": "ماه",
                "tip": "کاراکتر «月» هلال ماه است؛ هم «ماه» و هم رادیکال بخش‌های گوشتی بدن."
              }
            ]
          },
          {
            "id": "hsk1:6_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «فردا چندشنبه است؟» را بسازید:",
                "tiles": [
                  "星期",
                  "明天",
                  "几"
                ],
                "target": "明天星期几"
              },
              {
                "type": "order",
                "prompt": "جمله «فردا به مدرسه می‌روم.» را بسازید:",
                "tiles": [
                  "学校",
                  "去",
                  "明天",
                  "我"
                ],
                "target": "我明天去学校"
              },
              {
                "type": "order",
                "prompt": "عبارت «ببخشید، می‌خواستم بپرسم» را بسازید:",
                "tiles": [
                  "问",
                  "请"
                ],
                "target": "请问"
              }
            ]
          },
          {
            "id": "hsk1:6_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«明天星期几？» یعنی چه؟",
                "opts": [
                  "امروز چه روزیه؟",
                  "فردا کجا می‌ری؟",
                  "فردا چندشنبه است؟",
                  "هفته چند روزه است؟"
                ],
                "ans": 2,
                "audio": "míng tiān xīng qī jǐ"
              },
              {
                "type": "choice",
                "q": "«请问» کجا استفاده می‌شود؟",
                "opts": [
                  "برای پاسخ دادن",
                  "برای تشکر",
                  "برای خداحافظی",
                  "قبل از یک سؤال، برای مؤدبانه پرسیدن"
                ],
                "ans": 3,
                "audio": "qǐng wèn"
              },
              {
                "type": "choice",
                "q": "کدام جمله «فردا به مدرسه می‌روم.» است؟",
                "opts": [
                  "我明天看书。",
                  "明天我去吗学校。",
                  "我明天去学校。",
                  "我昨天去学校。"
                ],
                "ans": 2,
                "audio": "wǒ míng tiān qù xué xiào"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (很)",
        "titleZh": "很",
        "icon": "sliders-horizontal",
        "desc": "بگویید 我很忙‏، نه 我是忙‏ — صفت، کل گزاره است.",
        "intro": {
          "title": "آموزش گرامر: 很‏ · صفت‌ها 是‏ نمی‌خواهند",
          "lead": "بگویید 我很忙‏، نه 我是忙‏ — صفت، کل گزاره است.",
          "rule": "很‏ · صفت‌ها 是‏ نمی‌خواهند",
          "mark": "很",
          "pattern": "Subject + 很 + adjective",
          "explain": "در چینی یک صفت می‌تواند خودش فعل جمله باشد. صفتِ تنها شبیه مقایسه به نظر می‌رسد (今天冷‏ — سردتر از چیزی)، پس یک 很‏ِ سبک اضافه می‌شود. اینجا 很‏ ضعیف است؛ همیشه به معنی «خیلی» نیست.",
          "mistake": "✗ 天气是热。 → ✓ 天气很热。",
          "compare": [
            {
              "w": "很",
              "gloss": "describes a quality",
              "ex": "天气很热"
            },
            {
              "w": "是",
              "gloss": "says what it is",
              "ex": "他是医生"
            }
          ],
          "examples": [
            {
              "ch": "今天很冷。",
              "py": "jīntiān hěn lěng.",
              "en": "It's cold today.",
              "fa": "It's cold today."
            },
            {
              "ch": "这个杯子很漂亮。",
              "py": "zhège bēizi hěn piàoliang.",
              "en": "This cup is pretty.",
              "fa": "This cup is pretty."
            },
            {
              "ch": "我妈妈很高兴。",
              "py": "wǒ māma hěn gāoxìng.",
              "en": "My mum is happy.",
              "fa": "My mum is happy."
            }
          ],
          "points": [
            "الگوی ساختاری: Subject + 很 + adjective",
            "توضیح قاعده: در چینی یک صفت می‌تواند خودش فعل جمله باشد. صفتِ تنها شبیه مقایسه به نظر می‌رسد (今天冷‏ — سردتر از چیزی)، پس یک 很‏ِ سبک اضافه می‌شود. اینجا 很‏ ضعیف است؛ همیشه به معنی «خیلی» نیست.",
            "اشتباه رایج: ✗ 天气是热。 → ✓ 天气很热。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_hen-adj",
            "num": 1,
            "title": "آموزش و آزمون گرامر 很",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 很‏ · صفت‌ها 是‏ نمی‌خواهند",
            "exercises": [
              {
                "type": "gram",
                "id": "hen-adj",
                "mark": "很",
                "rule": "很‏ · صفت‌ها 是‏ نمی‌خواهند",
                "titleFa": "很‏ · صفت‌ها 是‏ نمی‌خواهند",
                "catFa": "ساختار جمله",
                "formula": "Subject + 很 + adjective",
                "pattern": "Subject + 很 + adjective",
                "desc": "بگویید 我很忙‏، نه 我是忙‏ — صفت، کل گزاره است.",
                "oneLine": "بگویید 我很忙‏، نه 我是忙‏ — صفت، کل گزاره است.",
                "explain": "در چینی یک صفت می‌تواند خودش فعل جمله باشد. صفتِ تنها شبیه مقایسه به نظر می‌رسد (今天冷‏ — سردتر از چیزی)، پس یک 很‏ِ سبک اضافه می‌شود. اینجا 很‏ ضعیف است؛ همیشه به معنی «خیلی» نیست.",
                "mistake": "✗ 天气是热。 → ✓ 天气很热。",
                "compare": [
                                {
                                                "w": "很",
                                                "gloss": "describes a quality",
                                                "glossFa": "توصیف ویژگی یا صفت",
                                                "ex": "天气很热"
                                },
                                {
                                                "w": "是",
                                                "gloss": "says what it is",
                                                "glossFa": "بیان هویت یا ماهیت",
                                                "ex": "他是医生"
                                }
                ],
                "examples": [
                                {
                                                "ch": "今天很冷。",
                                                "py": "jīntiān hěn lěng.",
                                                "en": "It's cold today.",
                                                "fa": "امروز خیلی سرد است."
                                },
                                {
                                                "ch": "这个杯子很漂亮。",
                                                "py": "zhège bēizi hěn piàoliang.",
                                                "en": "This cup is pretty.",
                                                "fa": "این فنجان خیلی زیباست."
                                },
                                {
                                                "ch": "我妈妈很高兴。",
                                                "py": "wǒ māma hěn gāoxìng.",
                                                "en": "My mum is happy.",
                                                "fa": "مادرم خیلی خوشحال است."
                                }
                ],
                "ex": "今天很冷。",
                "exPy": "jīntiān hěn lěng.",
                "exFa": "It's cold today."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我今天__高兴。",
                "opts": [
                  "很",
                  "是",
                  "有"
                ],
                "ans": 0,
                "tip": "高兴‏ صفت است: 很‏ می‌گیرد، نه 是‏.",
                "exFa": "امروز خوشحالم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "这个苹果很大",
                "tiles": [
                  "这个",
                  "苹果",
                  "很",
                  "大"
                ],
                "en": "این سیب بزرگ است.",
                "tip": "很‏ درست قبل از صفت قرار می‌گیرد.",
                "py": "zhè ge píng guǒ hěn dà",
                "pinyin": "zhè ge píng guǒ hěn dà"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n那个商店很大。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "فاعل + 很‏ + صفت، بدون 是‏.",
                "exFa": "آن مغازه بزرگ است."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我的电脑是小。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "صفت به 是‏ نیاز ندارد؛ یک 很‏ ملایم جلویش می‌آید. (جمله صحیح: 我的电脑很小。)",
                "exFa": "کامپیوترم کوچک است."
              },
              {
                "type": "choice",
                "q": "کلمه «很» باید در کدام جایگاه قرار گیرد؟\n[A] 这儿的 [B] 衣服 [C] 都 [D] 漂亮。 [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 3,
                "tip": "很‏ درست قبل از صفت می‌آید، بعد از 都‏.",
                "exFa": "لباس‌های اینجا همه قشنگ‌اند."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و هوموفون 明/名 (míng)",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: واژه‌های 明天 (míng) و 名字 (míng) دقیقاً هم‌صدا هستند (míng تُن ۲)! و در «请问» تُن ۳ 请 با تُن ۴ 问 می‌آید و بدون تغییر ادا می‌شود."
        },
        "miniLessons": [
          {
            "id": "hsk1:6_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "jīn",
                "pinyin": "jīn",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "míng",
                "pinyin": "míng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "qù",
                "pinyin": "qù",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:6_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «shū» (کتاب — تُن ۱) را پخش می‌کند؟",
                "audio": "shū",
                "opts": [
                  "shù (تُن ۴)",
                  "shǔ (تُن ۳)",
                  "chū (تُن ۱)",
                  "shū (书 - تُن ۱)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «yuè» (ماه — تُن ۴) است؟",
                "audio": "yuè",
                "opts": [
                  "yù (تُن ۴ فقط)",
                  "yuè (月 - تُن ۴)",
                  "yuē (تُن ۱)",
                  "yǒu (تُن ۳)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «xīng» (ستاره — تُن ۱) است؟",
                "audio": "xīng",
                "opts": [
                  "xìng (تُن ۴)",
                  "qǐng (تُن ۳)",
                  "xíng (تُن ۲)",
                  "xīng (星 - تُن ۱)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:6_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در عبارت «明天» دو هجا چگونه تلفظ می‌شوند؟",
                "opts": [
                  "هر دو تُن ۲",
                  "mìng تُن ۴ و tiān تُن ۱",
                  "míng تُن ۳ و tiān تُن ۱",
                  "míng تُن ۲ و tiān تُن ۱"
                ],
                "ans": 3,
                "audio": "míng tiān"
              },
              {
                "type": "choice",
                "q": "واژه «请问» چگونه ادا می‌شود؟",
                "opts": [
                  "qǐng wēn — دومی تُن ۱",
                  "qǐng تُن ۳ سپس wèn تُن ۴ (بدون تغییر)",
                  "هر دو تُن ۳",
                  "qíng wèn — اولی تُن ۲ می‌شود"
                ],
                "ans": 1,
                "audio": "qǐng wèn"
              }
            ]
          },
          {
            "id": "hsk1:6_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "明天星期几",
                "py": "míng tiān xīng qī jǐ",
                "fa": "فردا چندشنبه است؟",
                "tip": "星期 هر دو تُن ۱ دارند؛ 几 با تُن ۳ در پایان بالا و پایین می‌رود."
              },
              {
                "type": "repeat",
                "target": "请问，今天几号",
                "py": "qǐng wèn,  jīn tiān jǐ hào",
                "fa": "ببخشید، امروز چندمه؟",
                "tip": "请问 را مؤدبانه و آهسته شروع کنید."
              },
              {
                "type": "repeat",
                "target": "我明天去学校",
                "py": "wǒ míng tiān qù xué xiào",
                "fa": "فردا به مدرسه می‌روم",
                "tip": "去 با تُن ۴ قاطع مثل دستور «برو!» ادا می‌شود."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «qǐngwèn» گوش کنید: شروع سؤال مؤدبانه.",
            "۲. روزهای هفته (星期X) را در کلام تشخیص دهید.",
            "۳. به برنامه‌های 去 + مکان دقت کنید.",
            "۴. برنامه هفته خودتان را با صدای بلند بگوئید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:6_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "qǐng wèn,  míng tiān xīng qī jǐ",
                "opts": [
                  "ببخشید، فردا چندشنبه است؟",
                  "امروز چندشنبه است؟",
                  "فردا کجا می‌ری؟",
                  "فردا چندم ماهه؟"
                ],
                "ans": 0,
                "revealZh": "请问，明天星期几？",
                "revealPy": "Qǐngwèn, míngtiān xīngqī jǐ?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ míng tiān qù xué xiào",
                "opts": [
                  "فردا کتاب می‌خوانم",
                  "دیروز به مدرسه رفتم",
                  "فردا به مدرسه می‌روم",
                  "من در مدرسه‌ام"
                ],
                "ans": 2,
                "revealZh": "我明天去学校。",
                "revealPy": "Wǒ míngtiān qù xuéxiào."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "jīn tiān jǐ yuè jǐ hào",
                "opts": [
                  "فردا چندم ماهه؟",
                  "امروز چندشنبه است؟",
                  "ماه چند روزه است؟",
                  "امروز چندم ماه است؟"
                ],
                "ans": 3,
                "revealZh": "今天几月几号？",
                "revealPy": "Jīntiān jǐ yuè jǐ hào?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ míng tiān kàn shū",
                "opts": [
                  "فردا کتاب می‌خوانم",
                  "او کتاب خواندن را دوست دارد",
                  "امروز کتاب می‌خوانم",
                  "مدرسه خوبه"
                ],
                "ans": 0,
                "revealZh": "我明天看书。",
                "revealPy": "Wǒ míngtiān kàn shū."
              }
            ]
          },
          {
            "id": "hsk1:6_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：请问，今天星期几？\n阿达：今天星期三。\n李华：明天你去学校吗？\n阿达：去，明天星期四我们去学校。",
                "textPy": "Lǐ Huá: Qǐngwèn, jīntiān xīngqī jǐ?\nĀ Dá: Jīntiān xīngqī sān.\nLǐ Huá: Míngtiān nǐ qù xuéxiào ma?\nĀ Dá: Qù, míngtiān xīngqī sì wǒmen qù xuéxiào.",
                "textFa": "لی‌هوا: ببخشید، امروز چندشنبه است؟\nآدا: امروز سه‌شنبه است.\nلی‌هوا: فردا به مدرسه می‌ری؟\nآدا: آره، فردا چهارشنبه به مدرسه می‌ریم.",
                "q": "فردا چه روزی است؟",
                "opts": [
                  "星期三 (سه‌شنبه)",
                  "星期四 (چهارشنبه)",
                  "星期天 (یکشنبه)",
                  "星期五 (پنج‌شنبه)"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "A: 请问，今天几月几号？\nB: 今天十月一号，星期天。\nA: 谢谢！\nB: 不客气。",
                "textPy": "A: Qǐngwèn, jīntiān jǐ yuè jǐ hào?\nB: Jīntiān shí yuè yī hào, xīngqī tiān.\nA: Xièxie!\nB: Bú kèqi.",
                "textFa": "A: ببخشید، امروز چندم ماهه؟\nB: امروز اول اکتبر، یکشنبه است.\nA: ممنون!\nB: خواهش می‌کنم.",
                "q": "امروز چه روزی از هفته است؟",
                "opts": [
                  "星期六 (شنبه)",
                  "星期一 (دوشنبه)",
                  "معلوم نیست",
                  "星期天 (یکشنبه)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：明天星期几？\n王明：明天星期五。我们去看书吗？\n咪咪：好！我们星期五去看书。",
                "textPy": "Mīmī: Míngtiān xīngqī jǐ?\nWáng Míng: Míngtiān xīngqī wǔ. Wǒmen qù kàn shū ma?\nMīmī: Hǎo! Wǒmen xīngqī wǔ qù kàn shū.",
                "textFa": "می‌می: فردا چندشنبه است؟\nوانگ مینگ: پنج‌شنبه‌ست. بریم کتاب بخونیم؟\nمی‌می: باشه! پنج‌شنبه می‌ریم کتاب بخونیم.",
                "q": "آنها چه برنامه‌ای دارند؟",
                "opts": [
                  "پنج‌شنبه به مدرسه می‌روند",
                  "امروز کتاب می‌خوانند",
                  "فردا فیلم می‌بینند",
                  "پنج‌شنبه کتاب می‌خوانند"
                ],
                "ans": 3
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع تاریخ، 请问 و ساختار 去",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس هفتم رسیدید! این بخش تسلط شما روی روزهای هفته، تاریخ و برنامه‌ها را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی تاریخ و روزهای هفته",
            "سنجش ساختار 去 + مکان",
            "درک شنیداری مکالمات برنامه‌ریزی",
            "با پاس کردن این بخش، ایستگاه ۷ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:6_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «فردا چندشنبه است؟» کدام است؟",
                "opts": [
                  "明天星期几号？",
                  "明天星期几？",
                  "明天几月几号？",
                  "今天星期几？"
                ],
                "ans": 1,
                "audio": "míng tiān xīng qī jǐ"
              },
              {
                "type": "choice",
                "q": "کدام واژه «ماه» است؟",
                "opts": [
                  "号 (hào)",
                  "月 (yuè)",
                  "看 (kàn)",
                  "书 (shū)"
                ],
                "ans": 1,
                "audio": "yuè"
              },
              {
                "type": "order",
                "prompt": "جمله «فردا به مدرسه می‌روم.» را مرتب کنید:",
                "tiles": [
                  "学校",
                  "去",
                  "明天",
                  "我"
                ],
                "target": "我明天去学校"
              },
              {
                "type": "order",
                "prompt": "سؤال مؤدبانه «امروز چندشنبه است؟» را بسازید:",
                "tiles": [
                  "问",
                  "请",
                  "星期",
                  "今天",
                  "几"
                ],
                "target": "请问今天星期几"
              }
            ]
          },
          {
            "id": "hsk1:6_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "xīng qī tiān wǒ bú qù xué xiào",
                "opts": [
                  "فردا می‌روم مدرسه",
                  "یکشنبه به مدرسه می‌روم",
                  "امروز نمی‌روم مدرسه",
                  "یکشنبه به مدرسه نمی‌روم"
                ],
                "ans": 3,
                "revealZh": "星期天我不去学校。",
                "revealPy": "Xīngqītiān wǒ bú qù xuéxiào."
              },
              {
                "type": "reading_q",
                "textZh": "李华：请问，明天星期几？\n王明：明天星期六。\n李华：我们去学校吗？\n王明：不去！星期六我们看书。",
                "textPy": "Lǐ Huá: Qǐngwèn, míngtiān xīngqī jǐ?\nWáng Míng: Míngtiān xīngqī liù.\nLǐ Huá: Wǒmen qù xuéxiào ma?\nWáng Míng: Bú qù! Xīngqīliù wǒmen kàn shū.",
                "textFa": "لی‌هوا: ببخشید، فردا چندشنبه است؟\nوانگ مینگ: شنبه‌ست.\nلی‌هوا: به مدرسه بریم؟\nوانگ مینگ: نه! شنبه کتاب می‌خونیم.",
                "q": "شنبه چه برنامه‌ای دارند؟",
                "opts": [
                  "به مدرسه می‌روند",
                  "کتاب نمی‌خوانند",
                  "فیلم می‌بینند",
                  "کتاب می‌خوانند (看书)"
                ],
                "ans": 3
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
    "title": "What would you like to eat?",
    "titleFa": "دوست داری چی بخوری؟",
    "titleZh": "你想吃什么",
    "level": "HSK 1",
    "desc": "آموزش خواستن با «想»، خوردن و نوشیدن، خرید در مغازه و پرسیدن قیمت با «多少钱»",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های خوردن، نوشیدن و خرید",
        "intro": {
          "title": "آشنایی با واژه‌های غذا و خرید در درس هشتم",
          "lead": "در این بخش با کلمات کلیدی برای سفارش غذا، خرید و پرسیدن قیمت آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "想",
              "py": "xiǎng",
              "fa": "خواستن / فکر کردن",
              "ex": "我想喝茶。",
              "exPy": "Wǒ xiǎng hē chá.",
              "exFa": "من می‌خوام چای بخورم."
            },
            {
              "hanzi": "吃",
              "py": "chī",
              "fa": "خوردن",
              "ex": "你想吃什么？",
              "exPy": "Nǐ xiǎng chī shénme?",
              "exFa": "دوست داری چی بخوری؟"
            },
            {
              "hanzi": "喝",
              "py": "hē",
              "fa": "نوشیدن",
              "ex": "我想喝一杯茶。",
              "exPy": "Wǒ xiǎng hē yì bēi chá.",
              "exFa": "می‌خوام یه فنجون چای بخورم."
            },
            {
              "hanzi": "米饭",
              "py": "mǐ fàn",
              "fa": "برنج / برپک",
              "ex": "我想吃米饭。",
              "exPy": "Wǒ xiǎng chī mǐfàn.",
              "exFa": "می‌خوام برنج بخورم."
            },
            {
              "hanzi": "买",
              "py": "mǎi",
              "fa": "خریدن",
              "ex": "我下午去商店买茶。",
              "exPy": "Wǒ xiàwǔ qù shāngdiàn mǎi chá.",
              "exFa": "بعدازظهر می‌روم مغازه چای بخرم."
            },
            {
              "hanzi": "多少",
              "py": "duō shao",
              "fa": "چند / چه مقدار",
              "ex": "这个多少钱？",
              "exPy": "Zhège duōshao qián?",
              "exFa": "این چند تا پوله؟"
            },
            {
              "hanzi": "钱",
              "py": "qián",
              "fa": "پول",
              "ex": "你没有钱吗？",
              "exPy": "Nǐ méiyǒu qián ma?",
              "exFa": "پول نداری؟"
            },
            {
              "hanzi": "块",
              "py": "kuài",
              "fa": "یوان (واحد پول چین)",
              "ex": "五块钱。",
              "exPy": "Wǔ kuài qián.",
              "exFa": "پنج یوان."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:7_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «想» (xiǎng) چیست؟",
                "opts": [
                  "چند",
                  "فنجان",
                  "خواستن",
                  "نوشیدن"
                ],
                "ans": 2,
                "audio": "xiǎng",
                "hanzi": "想",
                "pinyin": "xiǎng"
              },
              {
                "type": "choice",
                "q": "معنی واژه «喝» (hē) چیست؟",
                "opts": [
                  "نوشیدن",
                  "مغازه",
                  "چند",
                  "فنجان"
                ],
                "ans": 0,
                "audio": "hē",
                "hanzi": "喝",
                "pinyin": "hē"
              },
              {
                "type": "choice",
                "q": "معنی واژه «吃» (chī) چیست؟",
                "opts": [
                  "خوردن",
                  "این",
                  "یوان (واحد پول)",
                  "چند"
                ],
                "ans": 0,
                "audio": "chī",
                "hanzi": "吃",
                "pinyin": "chī"
              },
              {
                "type": "choice",
                "q": "معنی واژه «米饭» (mǐ fàn) چیست؟",
                "opts": [
                  "آن",
                  "برنج",
                  "این",
                  "مغازه"
                ],
                "ans": 1,
                "audio": "mǐ fàn",
                "hanzi": "米饭",
                "pinyin": "mǐ fàn"
              }
            ]
          },
          {
            "id": "hsk1:7_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "想",
                    "fa": "خواستن"
                  },
                  {
                    "zh": "喝",
                    "fa": "نوشیدن"
                  },
                  {
                    "zh": "茶",
                    "fa": "چای"
                  },
                  {
                    "zh": "吃",
                    "fa": "خوردن"
                  },
                  {
                    "zh": "米饭",
                    "fa": "برنج"
                  },
                  {
                    "zh": "下午",
                    "fa": "بعدازظهر"
                  },
                  {
                    "zh": "商店",
                    "fa": "مغازه"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "买",
                    "fa": "خریدن"
                  },
                  {
                    "zh": "个",
                    "fa": "شمارنده عمومی"
                  },
                  {
                    "zh": "杯子",
                    "fa": "فنجان"
                  },
                  {
                    "zh": "这",
                    "fa": "این"
                  },
                  {
                    "zh": "多少",
                    "fa": "چند"
                  },
                  {
                    "zh": "钱",
                    "fa": "پول"
                  },
                  {
                    "zh": "块",
                    "fa": "یوان (واحد پول)"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:7_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "吃",
                "py": "chī",
                "fa": "خوردن",
                "tip": "کاراکتر «吃» با رادیکال دهان (口) شروع می‌شود؛ غذا با دهان خورده می‌شود."
              },
              {
                "type": "write",
                "char": "茶",
                "py": "chá",
                "fa": "چای",
                "tip": "کاراکتر «茶» برگ و گیاه روی سایبان است: چایِ زیر سقف چایخانه."
              },
              {
                "type": "write",
                "char": "买",
                "py": "mǎi",
                "fa": "خریدن",
                "tip": "کاراکتر «买» قدیمی شکل شبکه‌ای بود که ترجمه را می‌گرفت: خرید و داد‌وستد."
              }
            ]
          },
          {
            "id": "hsk1:7_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «دوست داری چی بخوری؟» را بسازید:",
                "tiles": [
                  "吃",
                  "什么",
                  "想",
                  "你"
                ],
                "target": "你想吃什么"
              },
              {
                "type": "order",
                "prompt": "جمله «این چقدر پوله؟» را بسازید:",
                "tiles": [
                  "钱",
                  "多少",
                  "这",
                  "个"
                ],
                "target": "这个多少钱"
              },
              {
                "type": "order",
                "prompt": "جمله «من می‌خوام چای بخورم.» را بسازید:",
                "tiles": [
                  "茶",
                  "想",
                  "喝",
                  "我"
                ],
                "target": "我想喝茶"
              }
            ]
          },
          {
            "id": "hsk1:7_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«你想吃什么？» یعنی چه؟",
                "opts": [
                  "چی خوردی؟",
                  "دوست داری چی بخوری؟",
                  "غذا کجاست؟",
                  "دوست داری چی بنوشی؟"
                ],
                "ans": 1,
                "audio": "nǐ xiǎng chī shén me"
              },
              {
                "type": "choice",
                "q": "برای پرسیدن قیمت چه می‌گوئیم؟",
                "opts": [
                  "去哪儿？",
                  "什么菜？",
                  "多少钱？",
                  "几岁？"
                ],
                "ans": 2,
                "audio": "duōshao qián"
              },
              {
                "type": "choice",
                "q": "کدام جمله «بعدازظهر می‌روم مغازه خرید کنم.» است؟",
                "opts": [
                  "我下午去商店买茶。",
                  "我下午去商店吃米饭。",
                  "我下午买商店东西。",
                  "我商店买下午东西。"
                ],
                "ans": 0,
                "audio": "wǒ xià wǔ qù shāng diàn mǎi dōngxi"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (几)",
        "titleZh": "几",
        "icon": "sliders-horizontal",
        "desc": "几‏ انتظار عدد کوچک دارد و واژهٔ شمارش می‌خواهد؛ 多少‏ برای هر مقداری است.",
        "intro": {
          "title": "آموزش گرامر: 几‏ vs 多少‏ · چند",
          "lead": "几‏ انتظار عدد کوچک دارد و واژهٔ شمارش می‌خواهد؛ 多少‏ برای هر مقداری است.",
          "rule": "几‏ vs 多少‏ · چند",
          "mark": "几",
          "pattern": "几 + measure + noun · 多少 (+ measure) + noun",
          "explain": "几‏ را وقتی به کار ببرید که انتظار زیر ده را دارید، و برای تاریخ‌ها، ساعت‌ها و سن: 几点‏, 几号‏, 几岁‏. 多少‏ برای مقدارهای بیشتر یا نامعلوم است و همیشه برای قیمت‌ها: 多少钱‏. 几‏ باید واژهٔ شمارش داشته باشد (几个人‏)؛ 多少‏ می‌تواند آن را حذف کند (多少人‏).",
          "mistake": "✗ 这个几钱？ → ✓ 这个多少钱？",
          "compare": [
            {
              "w": "几",
              "gloss": "small numbers",
              "ex": "几个人",
              "py": "jǐ"
            },
            {
              "w": "多少",
              "gloss": "any amount, prices",
              "ex": "多少钱",
              "py": "duōshao"
            }
          ],
          "examples": [
            {
              "ch": "现在几点？",
              "py": "xiànzài jǐ diǎn?",
              "en": "What time is it now?",
              "fa": "What time is it now?"
            },
            {
              "ch": "你家有几个人？",
              "py": "nǐ jiā yǒu jǐ ge rén?",
              "en": "How many people are in your family?",
              "fa": "How many people are in your family?"
            },
            {
              "ch": "这个杯子多少钱？",
              "py": "zhège bēizi duōshao qián?",
              "en": "How much is this cup?",
              "fa": "How much is this cup?"
            }
          ],
          "points": [
            "الگوی ساختاری: 几 + measure + noun · 多少 (+ measure) + noun",
            "توضیح قاعده: 几‏ را وقتی به کار ببرید که انتظار زیر ده را دارید، و برای تاریخ‌ها، ساعت‌ها و سن: 几点‏, 几号‏, 几岁‏. 多少‏ برای مقدارهای بیشتر یا نامعلوم است و همیشه برای قیمت‌ها: 多少钱‏. 几‏ باید واژهٔ شمارش داشته باشد (几个人‏)؛ 多少‏ می‌تواند آن را حذف کند (多少人‏).",
            "اشتباه رایج: ✗ 这个几钱？ → ✓ 这个多少钱？"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_ji-duoshao",
            "num": 1,
            "title": "آموزش و آزمون گرامر 几",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 几‏ vs 多少‏ · چند",
            "exercises": [
              {
                "type": "gram",
                "id": "ji-duoshao",
                "mark": "几",
                "rule": "几‏ vs 多少‏ · چند",
                "titleFa": "几‏ vs 多少‏ · چند",
                "catFa": "دستور زبان",
                "formula": "几 + measure + noun · 多少 (+ measure) + noun",
                "pattern": "几 + measure + noun · 多少 (+ measure) + noun",
                "desc": "几‏ انتظار عدد کوچک دارد و واژهٔ شمارش می‌خواهد؛ 多少‏ برای هر مقداری است.",
                "oneLine": "几‏ انتظار عدد کوچک دارد و واژهٔ شمارش می‌خواهد؛ 多少‏ برای هر مقداری است.",
                "explain": "几‏ را وقتی به کار ببرید که انتظار زیر ده را دارید، و برای تاریخ‌ها، ساعت‌ها و سن: 几点‏, 几号‏, 几岁‏. 多少‏ برای مقدارهای بیشتر یا نامعلوم است و همیشه برای قیمت‌ها: 多少钱‏. 几‏ باید واژهٔ شمارش داشته باشد (几个人‏)؛ 多少‏ می‌تواند آن را حذف کند (多少人‏).",
                "mistake": "✗ 这个几钱？ → ✓ 这个多少钱？",
                "compare": [
                                {
                                                "w": "几",
                                                "gloss": "small numbers",
                                                "glossFa": "تعداد کم (معمولاً زیر ۱۰)",
                                                "ex": "几个人",
                                                "py": "jǐ"
                                },
                                {
                                                "w": "多少",
                                                "gloss": "any amount, prices",
                                                "glossFa": "هر مقدار یا قیمت کالا",
                                                "ex": "多少钱",
                                                "py": "duōshao"
                                }
                ],
                "examples": [
                                {
                                                "ch": "现在几点？",
                                                "py": "xiànzài jǐ diǎn?",
                                                "en": "What time is it now?",
                                                "fa": "الان ساعت چند است؟"
                                },
                                {
                                                "ch": "你家有几个人？",
                                                "py": "nǐ jiā yǒu jǐ ge rén?",
                                                "en": "How many people are in your family?",
                                                "fa": "خانواده‌ات چند نفر هستند؟"
                                },
                                {
                                                "ch": "这个杯子多少钱？",
                                                "py": "zhège bēizi duōshao qián?",
                                                "en": "How much is this cup?",
                                                "fa": "این فنجان چقدر قیمت دارد؟"
                                }
                ],
                "ex": "现在几点？",
                "exPy": "xiànzài jǐ diǎn?",
                "exFa": "What time is it now?"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n这些苹果__钱？",
                "opts": [
                  "多少",
                  "几",
                  "什么"
                ],
                "ans": 0,
                "tip": "قیمت‌ها همیشه از 多少‏ استفاده می‌کنند: 多少钱‏.",
                "exFa": "این سیب‌ها چند است؟"
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "你们学校有多少学生",
                "tiles": [
                  "你们",
                  "学校",
                  "有",
                  "多少",
                  "学生"
                ],
                "en": "مدرسه‌ات چند دانش‌آموز دارد؟",
                "tip": "عددِ بزرگ 多少‏ می‌گیرد، و می‌تواند واژه‌ی شمارا را حذف کند.",
                "py": "nǐ men xué xiào yǒu duō shao xué sheng",
                "pinyin": "nǐ men xué xiào yǒu duō shao xué sheng"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你想买几本书？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "عددِ کوچک 几‏ به‌علاوه‌ی واژه‌ی شمارا می‌گیرد: 几本‏.",
                "exFa": "چند کتاب می‌خواهید بخرید؟"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你有几朋友？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "几‏ حتماً باید واژه‌ی شمارا داشته باشد: 几个‏. (جمله صحیح: 你有几个朋友？)",
                "exFa": "چند دوست داری؟"
              },
              {
                "type": "choice",
                "q": "کلمه «几» باید در کدام جایگاه قرار گیرد؟\n[A] 你 [B] 有 [C] 个 [D] 中国朋友 [E] ？ [F]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]",
                  "جایگاه [F]"
                ],
                "ans": 2,
                "tip": "几‏ درست قبل از واژه‌ی شمارا 个‏ می‌آید.",
                "exFa": "چند دوست چینی داری؟"
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تمایز 吃/茶 و 买/卖",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: «吃» (chī تُن ۱) و «茶» (chá تُن ۲) هم‌آوا هستند اما تُنشان فرق دارد! و در «多少» هجای دوم تُن خنثی است."
        },
        "miniLessons": [
          {
            "id": "hsk1:7_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "xiǎng",
                "pinyin": "xiǎng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "chá",
                "pinyin": "chá",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "qián",
                "pinyin": "qián",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:7_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «chī» (خوردن — تُن ۱) را پخش می‌کند؟",
                "audio": "chī",
                "opts": [
                  "chá (چای - تُن ۲)",
                  "chǐ (تُن ۳)",
                  "chí (تُن ۲)",
                  "chī (吃 - تُن ۱)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «mǎi» (خریدن — تُن ۳) است؟",
                "audio": "mǎi",
                "opts": [
                  "mài (فروختن - تُن ۴)",
                  "mái",
                  "mǎi (买 - تُن ۳)",
                  "mǐ (برنج - تُن ۳)"
                ],
                "ans": 2
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «hē» (نوشیدن — تُن ۱) است؟",
                "audio": "hē",
                "opts": [
                  "hè (تُن ۴)",
                  "hé (و - تُن ۲)",
                  "hē (喝 - تُن ۱)",
                  "hēr"
                ],
                "ans": 2
              }
            ]
          },
          {
            "id": "hsk1:7_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "واژه «多少» چگونه ادا می‌شود؟",
                "opts": [
                  "duò shào — هر دو تُن ۴",
                  "duō shǎo — هجای دوم تُن ۳",
                  "duō shao — هجای دوم تُن خنثی",
                  "duó shǎo"
                ],
                "ans": 2,
                "audio": "duōshao"
              },
              {
                "type": "choice",
                "q": "در «我想喝茶» دو تُن چگونه هستند؟",
                "opts": [
                  "喝 تُن ۴ و 茶 تُن ۱",
                  "همه تُن ۳ دارند",
                  "我 تُن ۴، 想 تُن ۱",
                  "我 تُن ۳، 想 تُن ۳، 喝 تُن ۱، 茶 تُن ۲"
                ],
                "ans": 3,
                "audio": "wǒ xiǎng hē chá"
              }
            ]
          },
          {
            "id": "hsk1:7_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "你想吃什么",
                "py": "nǐ xiǎng chī shén me",
                "fa": "دوست داری چی بخوری؟",
                "tip": "想 با تُن ۳ و 吃 با تُن ۱؛ me را خنثی بخوانید."
              },
              {
                "type": "repeat",
                "target": "这个多少钱",
                "py": "zhège duōshao qián",
                "fa": "این چقدر پوله؟",
                "tip": "ge و shao را کوتاه؛ 钱 با تُن ۲ بالا رونده."
              },
              {
                "type": "repeat",
                "target": "我想喝一杯茶",
                "py": "wǒ xiǎng hē yì bēi chá",
                "fa": "می‌خوام یه فنجون چای بخورم",
                "tip": "一 قبل از 杯 به yì تبدیل می‌شود؛ 喝 تُن ۱ و 茶 تُن ۲."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «xiǎng chī/hē» گوش کنید: خواستن غذا و نوشیدنی.",
            "۲. پرسش‌های قیمت «duōshao qián» را پیدا کنید.",
            "۳. به پاسخ‌های قیمت با 块 دقت کنید.",
            "۴. سفارش غذا را نقش‌بازی کنید: فروشنده و مشتری."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:7_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "nǐ xiǎng chī shén me",
                "opts": [
                  "چی خریدی؟",
                  "دوست داری چی بنوشی؟",
                  "این چقدر پوله؟",
                  "دوست داری چی بخوری؟"
                ],
                "ans": 3,
                "revealZh": "你想吃什么？",
                "revealPy": "Nǐ xiǎng chī shénme?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ xiǎng hē chá",
                "opts": [
                  "او می‌خواد چای بخوره",
                  "من می‌خوام برنج بخورم",
                  "من چای می‌خرم",
                  "من می‌خوام چای بخورم"
                ],
                "ans": 3,
                "revealZh": "我想喝茶。",
                "revealPy": "Wǒ xiǎng hē chá."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "zhège duōshao qián",
                "opts": [
                  "那个多少钱？",
                  "این چقدر پوله؟",
                  "چندسالته؟",
                  "چند فنجون؟"
                ],
                "ans": 1,
                "revealZh": "这个多少钱？",
                "revealPy": "Zhège duōshao qián?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ xià wǔ qù shāng diàn",
                "opts": [
                  "امروز می‌روم مدرسه",
                  "بعدازظهر می‌روم مغازه",
                  "او می‌رود مغازه",
                  "بعدازظهر می‌روم سینما"
                ],
                "ans": 1,
                "revealZh": "我下午去商店。",
                "revealPy": "Wǒ xiàwǔ qù shāngdiàn."
              }
            ]
          },
          {
            "id": "hsk1:7_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：你想吃什么？\n阿达：我想吃米饭。你呢？\n李华：我想喝茶。那个杯子多少钱？\n阿达：五块钱。",
                "textPy": "Lǐ Huá: Nǐ xiǎng chī shénme?\nĀ Dá: Wǒ xiǎng chī mǐfàn. Nǐ ne?\nLǐ Huá: Wǒ xiǎng hē chá. Nàge bēizi duōshao qián?\nĀ Dá: Wǔ kuài qián.",
                "textFa": "لی‌هوا: دوست داری چی بخوری؟\nآدا: می‌خوام برنج بخورم. تو چی؟\nلی‌هوا: من می‌خوام چای بخورم. اون فنجون چنده؟\nآدا: پنج یوان.",
                "q": "阿达 چی می‌خواهد بخورد؟",
                "opts": [
                  "苹果 (سیب)",
                  "茶 (چای)",
                  "米饭 (برنج)",
                  "هیچی"
                ],
                "ans": 2
              },
              {
                "type": "reading_q",
                "textZh": "A: 请问，这个多少钱？\nB: 那个杯子十二块钱。\nA: 那个呢？\nB: 五块钱。",
                "textPy": "A: Qǐngwèn, zhège duōshao qián?\nB: Nàge bēizi shí'èr kuài qián.\nA: Tài guì le! Nàge ne?\nB: Wǔ kuài qián.",
                "textFa": "A: ببخشید، این چنده؟\nB: اون فنجون دوازده یوانه.\nA: این یکی چطور؟\nB: پنج یوان.",
                "q": "فنجون گرون چقدر است؟",
                "opts": [
                  "دوازده یوان (十二块)",
                  "دو یوان",
                  "پنجاه یوان",
                  "پنج یوان"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：下午我们去商店买东西吗？\n王明：好！我想买茶。\n咪咪：我想买几个杯子。",
                "textPy": "Mīmī: Xiàwǔ wǒmen qù shāngdiàn mǎi dōngxi ma?\nWáng Míng: Hǎo! Wǒ xiǎng mǎi chá.\nMīmī: Wǒ xiǎng mǎi jǐ gè bēizi.",
                "textFa": "می‌می: بعدازظهر بریم مغازه خرید کنیم؟\nوانگ مینگ: باشه! من می‌خوام یه کم چای بخرم.\nمی‌می: من می‌خوام چندتا فنجون بخرم.",
                "q": "王明 چه می‌خواهد بخرد؟",
                "opts": [
                  "فنجون (杯子)",
                  "برنج (米饭)",
                  "چای (茶)",
                  "سیب (苹果)"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 想، قیمت و شمارنده‌ها",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس هشتم رسیدید! این بخش تسلط شما روی سفارش غذا، خرید و قیمت را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی فعل 想 و خوردن/نوشیدن",
            "سنجش پرسش قیمت و شمارنده‌ها",
            "درک شنیداری مکالمات خرید",
            "با پاس کردن این بخش، ایستگاه ۸ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:7_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «من می‌خوام چای بخورم» کدام است؟",
                "opts": [
                  "我喝茶想。",
                  "我想喝米饭。",
                  "我想喝茶。",
                  "我想吃茶。"
                ],
                "ans": 2,
                "audio": "wǒ xiǎng hē chá"
              },
              {
                "type": "choice",
                "q": "کدام واژه «پول» است؟",
                "opts": [
                  "茶 (chá)",
                  "钱 (qián)",
                  "买 (mǎi)",
                  "块 (kuài)"
                ],
                "ans": 1,
                "audio": "qián"
              },
              {
                "type": "order",
                "prompt": "سؤال «این چقدر پوله؟» را مرتب کنید:",
                "tiles": [
                  "钱",
                  "多少",
                  "这",
                  "个"
                ],
                "target": "这个多少钱"
              },
              {
                "type": "order",
                "prompt": "جمله «دوست داری چی بنوشی؟» را بسازید:",
                "tiles": [
                  "喝",
                  "什么",
                  "想",
                  "你"
                ],
                "target": "你想喝什么"
              }
            ]
          },
          {
            "id": "hsk1:7_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ xiǎng chī yìdiǎnr mǐ fàn",
                "opts": [
                  "می‌خوام یه کم برنج بخورم",
                  "می‌خوام همه برنج رو بخورم",
                  "می‌خوام یه کم چای بخورم",
                  "او می‌خواد برنج بخوره"
                ],
                "ans": 0,
                "revealZh": "我想吃一点儿米饭。",
                "revealPy": "Wǒ xiǎng chī yìdiǎnr mǐfàn."
              },
              {
                "type": "reading_q",
                "textZh": "李华：你想喝什么？\n王明：我想喝茶。这个杯子多少钱？\n李华：这个杯子五块钱。\n王明：好，我买两个杯子。",
                "textPy": "Lǐ Huá: Nǐ xiǎng hē shénme?\nWáng Míng: Wǒ xiǎng hē chá. Zhège bēizi duōshao qián?\nLǐ Huá: Zhège bēizi wǔ kuài qián.\nWáng Míng: Hǎo, wǒ mǎi liǎng gè bēizi.",
                "textFa": "لی‌هوا: دوست داری چی بنوشی؟\nوانگ مینگ: چای. این فنجون چنده؟\nلی‌هوا: این فنجون پنج یوانه.\nوانگ مینگ: باشه، دوتا فنجون می‌خرم.",
                "q": "王明 چندتا فنجون می‌خرد و قیمت هرکدام چیست؟",
                "opts": [
                  "دوتا؛ هرکدام پنج یوان",
                  "دوتا؛ هرکدام دوازده یوان",
                  "پنج‌تا؛ هرکدام دو یوان",
                  "یک‌تا؛ پنج یوان"
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
    "title": "Where is Ada?",
    "titleFa": "آدا کجاست؟",
    "titleZh": "阿达在哪儿",
    "level": "HSK 1",
    "desc": "آموزش موقعیت مکانی با «在»، پرسش «کجا؟» با 哪儿 و جهت‌نماها مثل 下面 و 上面",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های مکان، حیوانات و محل کار",
        "intro": {
          "title": "آشنایی با واژه‌های مکان در درس نهم",
          "lead": "در این بخش با کلمات کلیدی برای پرسیدن مکان و توصیف موقعیت آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "在",
              "py": "zài",
              "fa": "در / بودن در مکان",
              "ex": "猫在椅子下面。",
              "exPy": "Māo zài yǐzi xiàmiàn.",
              "exFa": "گربه زیر صندلی است."
            },
            {
              "hanzi": "哪儿",
              "py": "nǎr",
              "fa": "کجا",
              "ex": "阿达在哪儿？",
              "exPy": "Ā Dá zài nǎr?",
              "exFa": "آدا کجاست؟"
            },
            {
              "hanzi": "那儿",
              "py": "nàr",
              "fa": "آنجا",
              "ex": "他在那儿。",
              "exPy": "Tā zài nàr.",
              "exFa": "او آنجاست."
            },
            {
              "hanzi": "小猫",
              "py": "xiǎo māo",
              "fa": "بچه‌گربه / گربه کوچک",
              "ex": "小猫在桌子下面。",
              "exPy": "Xiǎomāo zài zhuōzi xiàmiàn.",
              "exFa": "بچه‌گربه زیر میز است."
            },
            {
              "hanzi": "椅子",
              "py": "yǐ zi",
              "fa": "صندلی",
              "ex": "椅子在哪儿？",
              "exPy": "Yǐzi zài nǎr?",
              "exFa": "صندلی کجاست؟"
            },
            {
              "hanzi": "工作",
              "py": "gōng zuò",
              "fa": "کار / کار کردن",
              "ex": "你在哪儿工作？",
              "exPy": "Nǐ zài nǎr gōngzuò?",
              "exFa": "کجا کار می‌کنی؟"
            },
            {
              "hanzi": "医院",
              "py": "yī yuàn",
              "fa": "بیمارستان",
              "ex": "爸爸在医院工作。",
              "exPy": "Bàba zài yīyuàn gōngzuò.",
              "exFa": "بابام در بیمارستان کار می‌کنه."
            },
            {
              "hanzi": "医生",
              "py": "yī shēng",
              "fa": "پزشک / دکتر",
              "ex": "他是医生。",
              "exPy": "Tā shì yīshēng.",
              "exFa": "او پزشک است."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:8_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «在» (zài) چیست؟",
                "opts": [
                  "کار",
                  "کوچک",
                  "در",
                  "صندلی"
                ],
                "ans": 2,
                "audio": "zài",
                "hanzi": "在",
                "pinyin": "zài"
              },
              {
                "type": "choice",
                "q": "معنی واژه «那儿» (nàr) چیست؟",
                "opts": [
                  "کار",
                  "آنجا",
                  "صندلی",
                  "پدر"
                ],
                "ans": 1,
                "audio": "nàr",
                "hanzi": "那儿",
                "pinyin": "nàr"
              },
              {
                "type": "choice",
                "q": "معنی واژه «椅子» (yǐ zi) چیست؟",
                "opts": [
                  "در",
                  "پسر (فرزند)",
                  "سگ",
                  "صندلی"
                ],
                "ans": 3,
                "audio": "yǐ zi",
                "hanzi": "椅子",
                "pinyin": "yǐ zi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «哪儿» (nǎr) چیست؟",
                "opts": [
                  "گربه",
                  "کوچک",
                  "پدر",
                  "کجا"
                ],
                "ans": 3,
                "audio": "nǎr",
                "hanzi": "哪儿",
                "pinyin": "nǎr"
              }
            ]
          },
          {
            "id": "hsk1:8_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "小",
                    "fa": "کوچک"
                  },
                  {
                    "zh": "猫",
                    "fa": "گربه"
                  },
                  {
                    "zh": "在",
                    "fa": "در"
                  },
                  {
                    "zh": "那儿",
                    "fa": "آنجا"
                  },
                  {
                    "zh": "狗",
                    "fa": "سگ"
                  },
                  {
                    "zh": "椅子",
                    "fa": "صندلی"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "下面",
                    "fa": "زیر"
                  },
                  {
                    "zh": "哪儿",
                    "fa": "کجا"
                  },
                  {
                    "zh": "工作",
                    "fa": "کار"
                  },
                  {
                    "zh": "儿子",
                    "fa": "پسر (فرزند)"
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
              }
            ]
          },
          {
            "id": "hsk1:8_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "猫",
                "py": "māo",
                "fa": "گربه",
                "tip": "کاراکتر «猫» ترکیب رادیکال چهارپا (犭) و مزرعه/غله (苗): حیوانی که از غلات مزرعه موش می‌گیرد."
              },
              {
                "type": "write",
                "char": "在",
                "py": "zài",
                "fa": "در / بودن",
                "tip": "کاراکتر «在» نشان دادن حضور چیزی در زمین است: بودن در مکان."
              },
              {
                "type": "write",
                "char": "工",
                "py": "gōng",
                "fa": "کار",
                "tip": "کاراکتر «工» گونیای نجاری است: ابزار کار و ساختن."
              }
            ]
          },
          {
            "id": "hsk1:8_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «آدا کجاست؟» را بسازید:",
                "tiles": [
                  "哪儿",
                  "阿达",
                  "在"
                ],
                "target": "阿达在哪儿"
              },
              {
                "type": "order",
                "prompt": "جمله «گربه زیر صندلی است.» را بسازید:",
                "tiles": [
                  "猫",
                  "椅子",
                  "下面",
                  "在"
                ],
                "target": "猫在椅子下面"
              },
              {
                "type": "order",
                "prompt": "سؤال «کجا کار می‌کنی؟» را بسازید:",
                "tiles": [
                  "工作",
                  "你",
                  "哪儿",
                  "在"
                ],
                "target": "你在哪儿工作"
              }
            ]
          },
          {
            "id": "hsk1:8_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«阿达在哪儿？» یعنی چه؟",
                "opts": [
                  "آدا چندساله است؟",
                  "آدا کجاست؟",
                  "آدا کی می‌آید؟",
                  "آدا کیه؟"
                ],
                "ans": 1,
                "audio": "Ā Dá zài nǎr"
              },
              {
                "type": "choice",
                "q": "معنی «猫在椅子下面» چیست؟",
                "opts": [
                  "گربه روی صندلی است",
                  "گربه صندلی دارد",
                  "گربه زیر صندلی است",
                  "صندلی زیر گربه است"
                ],
                "ans": 2,
                "audio": "māo zài yǐzi xià miàn"
              },
              {
                "type": "choice",
                "q": "پدر 李华 در «爸爸在医院工作» کجا کار می‌کند؟",
                "opts": [
                  "بیمارستان (医院)",
                  "خانه (家)",
                  "مغازه (商店)",
                  "مدرسه (学校)"
                ],
                "ans": 0,
                "audio": "bàba zài yī yuàn gōng zuò"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (多大)",
        "titleZh": "多大",
        "icon": "sliders-horizontal",
        "desc": "几岁‏ برای کودک، 多大‏ برای بزرگسال.",
        "intro": {
          "title": "آموزش گرامر: 多大‏ / 几岁‏ · پرسیدن سن",
          "lead": "几岁‏ برای کودک، 多大‏ برای بزرگسال.",
          "rule": "多大‏ / 几岁‏ · پرسیدن سن",
          "mark": "多大",
          "pattern": "… + 几岁了？ · … + 多大了？",
          "explain": "از کودک با 几岁‏ بپرس (پاسخ، عددی کوچک است). از بزرگ‌تر با 多大‏ بپرس؛ طبیعی‌تر و مؤدبانه‌تر است. 了‏ در پایان رایج است: سن چیزی است که تغییر می‌کند.",
          "mistake": "از فرد بزرگ‌تر پرسیدنِ 你几岁‏？ شبیه صحبت با کودک است — ✓ 你多大了‏？",
          "compare": [
            {
              "w": "多大",
              "gloss": "asking an adult",
              "ex": "你多大了"
            },
            {
              "w": "几岁",
              "gloss": "asking a child",
              "ex": "你女儿几岁了"
            }
          ],
          "examples": [
            {
              "ch": "你女儿几岁了？",
              "py": "nǐ nǚ'ér jǐ suì le?",
              "en": "How old is your daughter?",
              "fa": "How old is your daughter?"
            },
            {
              "ch": "你今年多大了？",
              "py": "nǐ jīnnián duō dà le?",
              "en": "How old are you this year?",
              "fa": "How old are you this year?"
            },
            {
              "ch": "我儿子九岁了。",
              "py": "wǒ érzi jiǔ suì le.",
              "en": "My son is nine now.",
              "fa": "My son is nine now."
            }
          ],
          "points": [
            "الگوی ساختاری: … + 几岁了？ · … + 多大了？",
            "توضیح قاعده: از کودک با 几岁‏ بپرس (پاسخ، عددی کوچک است). از بزرگ‌تر با 多大‏ بپرس؛ طبیعی‌تر و مؤدبانه‌تر است. 了‏ در پایان رایج است: سن چیزی است که تغییر می‌کند.",
            "اشتباه رایج: از فرد بزرگ‌تر پرسیدنِ 你几岁‏？ شبیه صحبت با کودک است — ✓ 你多大了‏？"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_duoda",
            "num": 1,
            "title": "آموزش و آزمون گرامر 多大",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 多大‏ / 几岁‏ · پرسیدن سن",
            "exercises": [
              {
                "type": "gram",
                "id": "duoda",
                "mark": "多大",
                "rule": "多大‏ / 几岁‏ · پرسیدن سن",
                "titleFa": "多大‏ / 几岁‏ · پرسیدن سن",
                "catFa": "پرسش‌ها",
                "formula": "… + 几岁了？ · … + 多大了？",
                "pattern": "… + 几岁了？ · … + 多大了？",
                "desc": "几岁‏ برای کودک، 多大‏ برای بزرگسال.",
                "oneLine": "几岁‏ برای کودک، 多大‏ برای بزرگسال.",
                "explain": "از کودک با 几岁‏ بپرس (پاسخ، عددی کوچک است). از بزرگ‌تر با 多大‏ بپرس؛ طبیعی‌تر و مؤدبانه‌تر است. 了‏ در پایان رایج است: سن چیزی است که تغییر می‌کند.",
                "mistake": "از فرد بزرگ‌تر پرسیدنِ 你几岁‏？ شبیه صحبت با کودک است — ✓ 你多大了‏？",
                "compare": [
                                {
                                                "w": "多大",
                                                "gloss": "asking an adult",
                                                "glossFa": "پرسیدن سن نوجوانان و بزرگسالان",
                                                "ex": "你多大了"
                                },
                                {
                                                "w": "几岁",
                                                "gloss": "asking a child",
                                                "glossFa": "پرسیدن سن کودکان (زیر ۱۰ سال)",
                                                "ex": "你女儿几岁了"
                                }
                ],
                "examples": [
                                {
                                                "ch": "你女儿几岁了？",
                                                "py": "nǐ nǚ'ér jǐ suì le?",
                                                "en": "How old is your daughter?",
                                                "fa": "دخترت چند سال دارد؟"
                                },
                                {
                                                "ch": "你今年多大了？",
                                                "py": "nǐ jīnnián duō dà le?",
                                                "en": "How old are you this year?",
                                                "fa": "امسال چندساله می‌شوی؟"
                                },
                                {
                                                "ch": "我儿子九岁了。",
                                                "py": "wǒ érzi jiǔ suì le.",
                                                "en": "My son is nine now.",
                                                "fa": "پسرم اکنون ۹ ساله است."
                                }
                ],
                "ex": "你女儿几岁了？",
                "exPy": "nǐ nǚ'ér jǐ suì le?",
                "exFa": "How old is your daughter?"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n你爸爸今年__了？",
                "opts": [
                  "多大",
                  "几",
                  "多少"
                ],
                "ans": 0,
                "tip": "برای بزرگسال 多大‏ بپرس؛ 几‏ و 多少‏ به یک اندازه مثل 岁‏ نیاز دارند.",
                "exFa": "امسال پدرت چند سالش است؟"
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "你的狗几岁了",
                "tiles": [
                  "你的",
                  "狗",
                  "几岁",
                  "了"
                ],
                "en": "سگت چند سالش است؟",
                "tip": "几岁了‏ سن بچه یا حیوان خانگی را می‌پرسد.",
                "py": "nǐ de gǒu jǐ suì le",
                "pinyin": "nǐ de gǒu jǐ suì le"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n小朋友，你几岁了？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "هنگام صحبت با بچه، 几岁‏ کاملاً مناسب است.",
                "exFa": "تو کوچولو چند سالت است؟"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你儿子几了？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "几‏ یعنی «چند»، پس بعدش به 岁‏ نیاز دارد. 多大‏ 岁‏ نمی‌گیرد. (جمله صحیح: 你儿子几岁了？)",
                "exFa": "پسرت چند سالش است؟"
              },
              {
                "type": "choice",
                "q": "کلمه «多大» باید در کدام جایگاه قرار گیرد؟\n[A] 你 [B] 朋友 [C] 今年 [D] 了 [E] ？ [F]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]",
                  "جایگاه [F]"
                ],
                "ans": 3,
                "tip": "多大‏ بعد از واژه‌ی زمان می‌آید، درست قبل از 了‏.",
                "exFa": "امسال دوستت چند سالش است؟"
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و پسوند er در 哪儿/那儿",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (er پسوند): واژه‌های 哪儿 (nǎr) و 那儿 (nàr) پسوند «r» دارند — کلمه «儿» خیلی سبک و ادغام‌شده در هجای قبل ادا می‌شود. و 小猫 با تُن ۳ + تُن ۱ ادا می‌شود."
        },
        "miniLessons": [
          {
            "id": "hsk1:8_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "xiǎo",
                "pinyin": "xiǎo",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "zài",
                "pinyin": "zài",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "gōng",
                "pinyin": "gōng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "hsk1:8_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «nǎr» (کجا) را پخش می‌کند؟",
                "audio": "nǎr",
                "opts": [
                  "nàr (那儿 — آنجا)",
                  "nǎr (哪儿 — کجا)",
                  "nǎ (بدون r — کدام)",
                  "lǎr"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «māo» (گربه — تُن ۱) است؟",
                "audio": "māo",
                "opts": [
                  "mā (مادر)",
                  "māo (猫 - تُن ۱)",
                  "mào (تُن ۴)",
                  "mǎo"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «yīyuàn» (بیمارستان) است؟",
                "audio": "yī yuàn",
                "opts": [
                  "yīshēng (医生 — پزشک)",
                  "yǐzi (椅子 — صندلی)",
                  "yīyuàn (医院 — بیمارستان)",
                  "yīyué"
                ],
                "ans": 2
              }
            ]
          },
          {
            "id": "hsk1:8_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در «阿达在哪儿？» واژه 哪儿 چگونه ادا می‌شود؟",
                "opts": [
                  "nǎ ér — دو هجای جدا",
                  "nǎr با تُن ۱",
                  "nàr — تُن ۴",
                  "nǎr — «儿» سبک و ادغام‌شده در هجای قبل (er پسوند)"
                ],
                "ans": 3,
                "audio": "nǎr"
              },
              {
                "type": "choice",
                "q": "در «小猫» تُن‌ها چگونه‌اند؟",
                "opts": [
                  "هر دو تُن ۳",
                  "xiǎo mào",
                  "xiǎo تُن ۳ و māo تُن ۱ (بدون تغییر)",
                  "xiáo māo — اولی تُن ۲ می‌شود"
                ],
                "ans": 2,
                "audio": "xiǎo māo"
              }
            ]
          },
          {
            "id": "hsk1:8_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "阿达在哪儿",
                "py": "Ā Dá zài nǎr",
                "fa": "آدا کجاست؟",
                "tip": "阿达 هر دو تُن ۲ دارند؛ 哪儿 با er پسوند ادا می‌شود."
              },
              {
                "type": "repeat",
                "target": "猫在椅子下面",
                "py": "māo zài yǐzi xià miàn",
                "fa": "گربه زیر صندلی است",
                "tip": "zi در 椅子 خنثی است؛ 在 با تُن ۴ قاطع."
              },
              {
                "type": "repeat",
                "target": "你爸爸在哪儿工作",
                "py": "nǐ bàba zài nǎr gōng zuò",
                "fa": "بابات کجا کار می‌کنه؟",
                "tip": "ba در 爸爸 را سبک بخوانید؛ 工作 با تُن ۱ + تُن ۴."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «zài nǎr» گوش کنید: پرسش کجا.",
            "۲. جهت‌نماها (下面/上面/里面) را در کلام تشخیص دهید.",
            "۳. به مکان‌های کار مثل 医院 دقت کنید.",
            "۴. جای وسایل اتاق خودتان را توصیف کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:8_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "Ā Dá zài nǎr",
                "opts": [
                  "آدا کجاست؟",
                  "آدا چه کاره است؟",
                  "آدا چندساله است؟",
                  "آدا کیه؟"
                ],
                "ans": 0,
                "revealZh": "阿达在哪儿？",
                "revealPy": "Ā Dá zài nǎr?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "māo zài yǐzi xià miàn",
                "opts": [
                  "گربه در خانه است",
                  "گربه زیر صندلی است",
                  "گربه روی صندلی است",
                  "صندلی زیر میز است"
                ],
                "ans": 1,
                "revealZh": "猫在椅子下面。",
                "revealPy": "Māo zài yǐzi xiàmiàn."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "nǐ bàba zài nǎr gōng zuò",
                "opts": [
                  "بابات کجا کار می‌کنه؟",
                  "بابات پزشکه؟",
                  "کجا مدرسه می‌ری؟",
                  "مامانت کجا کار می‌کنه؟"
                ],
                "ans": 0,
                "revealZh": "你爸爸在哪儿工作？",
                "revealPy": "Nǐ bàba zài nǎr gōngzuò?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ érzi shì yī shēng",
                "opts": [
                  "پسرم پزشک است",
                  "پسرم معلمه",
                  "پدرم پزشکه",
                  "دخترم پزشکه"
                ],
                "ans": 0,
                "revealZh": "我儿子是医生。",
                "revealPy": "Wǒ érzi shì yīshēng."
              }
            ]
          },
          {
            "id": "hsk1:8_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：阿达在哪儿？\n王明：他在那儿，椅子上面的猫旁边。\n李华：哪只猫？\n王明：那只小猫，狗的朋友。",
                "textPy": "Lǐ Huá: Ā Dá zài nǎr?\nWáng Míng: Tā zài nàr, yǐzi shàngmiande māo pángbiān.\nLǐ Huá: Nǎ zhī māo?\nWáng Míng: Nà zhī xiǎomāo, gǒude péngyou.",
                "textFa": "لی‌هوا: آدا کجاست؟\nوانگ مینگ: اونجاست، کنار گربه‌ای که روی صندلیه.\nلی‌هوا: کدوم گربه؟\nوانگ مینگ: همون گربه کوچیک، دوست سگ.",
                "q": "小猫 کجاست؟",
                "opts": [
                  "روی صندلی (椅子上面的)",
                  "زیر میز",
                  "داخل خانه",
                  "کنار سگ روی زمین"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 你爸爸在哪儿工作？\nB: 他在医院工作。他是医生。\nA: 你妈妈呢？\nB: 她在学校工作。",
                "textPy": "A: Nǐ bàba zài nǎr gōngzuò?\nB: Tā zài yīyuàn gōngzuò. Tā shì yīshēng.\nA: Nǐ māma ne?\nB: Tā zài xuéxiào gōngzuò.",
                "textFa": "A: بابات کجا کار می‌کنه؟\nB: در بیمارستان. پزشکه.\nA: مامانت چطور؟\nB: اون در مدرسه کار می‌کنه.",
                "q": "مادر B کجا کار می‌کند؟",
                "opts": [
                  "مغازه (商店)",
                  "مدرسه (学校)",
                  "خانه (家)",
                  "بیمارستان (医院)"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "李华：小猫在哪儿？\n咪咪：小猫在椅子下面。狗在椅子上面的桌子旁边。",
                "textPy": "Lǐ Huá: Xiǎomāo zài nǎr?\nMīmī: Xiǎomāo zài yǐzi xiàmiàn. Gǒu zài yǐzi shàngmiande zhuōzi pángbiān.",
                "textFa": "لی‌هوا: گربه کوچولو کجاست؟\nمی‌می: زیر صندلیه. سگ هم کنار میزیه که روی صندلیه.",
                "q": "سگ کجاست؟",
                "opts": [
                  "روی میز",
                  "داخل بیمارستان",
                  "کنار میزِ روی صندلی",
                  "زیر صندلی"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 在، 哪儿 و جهت‌نماها",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس نهم رسیدید! این بخش تسلط شما روی مکان‌ها و جهت‌نماها را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی فعل 在 و جهت‌نماها",
            "سنجش پرسش 哪儿 و پاسخ مکان",
            "درک شنیداری مکالمات مکان",
            "با پاس کردن این بخش، ایستگاه ۹ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:8_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «گربه زیر صندلی است» کدام است؟",
                "opts": [
                  "猫在椅子上面的。",
                  "猫椅子下面在。",
                  "猫在椅子下面。",
                  "猫在椅子里面。"
                ],
                "ans": 2,
                "audio": "māo zài yǐzi xià miàn"
              },
              {
                "type": "choice",
                "q": "کدام واژه «پزشک» است؟",
                "opts": [
                  "老师 (lǎoshī)",
                  "医院 (yīyuàn)",
                  "医生 (yīshēng)",
                  "学生 (xuésheng)"
                ],
                "ans": 2,
                "audio": "yī shēng"
              },
              {
                "type": "order",
                "prompt": "سؤال «آدا کجاست؟» را مرتب کنید:",
                "tiles": [
                  "哪儿",
                  "阿达",
                  "在"
                ],
                "target": "阿达在哪儿"
              },
              {
                "type": "order",
                "prompt": "جمله «رایانه روی میز است.» را بسازید:",
                "tiles": [
                  "电脑",
                  "桌子",
                  "上面",
                  "在"
                ],
                "target": "电脑在桌子上面"
              }
            ]
          },
          {
            "id": "hsk1:8_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ érzi zài yī yuàn gōng zuò",
                "opts": [
                  "پسرم در مدرسه کار می‌کند",
                  "پسرم در بیمارستان کار می‌کند",
                  "دخترم پزشک است",
                  "پدرم در بیمارستان است"
                ],
                "ans": 1,
                "revealZh": "我儿子在医院工作。",
                "revealPy": "Wǒ érzi zài yīyuàn gōngzuò."
              },
              {
                "type": "reading_q",
                "textZh": "李华：猫在哪儿？\n王明：猫在桌子下面。狗在哪儿？\n李华：狗在那儿，椅子上面的。",
                "textPy": "Lǐ Huá: Māo zài nǎr?\nWáng Míng: Māo zài zhuōzi xiàmiàn. Gǒu zài nǎr?\nLǐ Huá: Gǒu zài nàr, yǐzi shàngmiande.",
                "textFa": "لی‌هوا: گربه کجاست؟\nوانگ مینگ: زیر میزه. سگ کجاست؟\nلی‌هوا: اونجاست، روی صندلی.",
                "q": "گربه کجاست؟",
                "opts": [
                  "زیر صندلی",
                  "زیر میز (桌子下面)",
                  "روی میز",
                  "روی صندلی"
                ],
                "ans": 1
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
    "title": "Can I sit behind you?",
    "titleFa": "می‌تونم پشت سرت بشینم؟",
    "titleZh": "我能坐你后面吗",
    "level": "HSK 1",
    "desc": "آموزش اجازه با «能»، نفی داشتن با «没有» و حرف ربط «和» همراه مکان‌های دقیق‌تر",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های کلاس، اجازه و نفی",
        "intro": {
          "title": "آشنایی با واژه‌های اجازه و اشیاء در درس دهم",
          "lead": "در این بخش با کلمات کلیدی برای درخواست اجازه، گفتن نداشتن و اشیاء کلاس آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "能",
              "py": "néng",
              "fa": "توانستن / اجازه",
              "ex": "我能坐这儿吗？",
              "exPy": "Wǒ néng zuò zhèr ma?",
              "exFa": "می‌تونم اینجا بشینم؟"
            },
            {
              "hanzi": "坐",
              "py": "zuò",
              "fa": "نشستن",
              "ex": "我能坐你后面吗？",
              "exPy": "Wǒ néng zuò nǐ hòumiàn ma?",
              "exFa": "می‌تونم پشت سرت بشینم؟"
            },
            {
              "hanzi": "桌子",
              "py": "zhuō zi",
              "fa": "میز",
              "ex": "电脑在桌子上。",
              "exPy": "Diànnǎo zài zhuōzi shàng.",
              "exFa": "رایانه روی میز است."
            },
            {
              "hanzi": "电脑",
              "py": "diàn nǎo",
              "fa": "رایانه / کامپیوتر",
              "ex": "我有一台电脑。",
              "exPy": "Wǒ yǒu yì tái diànnǎo.",
              "exFa": "من یک رایانه دارم."
            },
            {
              "hanzi": "和",
              "py": "hé",
              "fa": "و",
              "ex": "桌子和椅子",
              "exPy": "zhuōzi hé yǐzi",
              "exFa": "میز و صندلی"
            },
            {
              "hanzi": "没有",
              "py": "méi yǒu",
              "fa": "نداشتن / نبودن",
              "ex": "我没有电脑。",
              "exPy": "Wǒ méiyǒu diànnǎo.",
              "exFa": "من رایانه ندارم."
            },
            {
              "hanzi": "前面",
              "py": "qián miàn",
              "fa": "جلو / جلوی",
              "ex": "你前面没有人。",
              "exPy": "Nǐ qiánmiàn méiyǒu rén.",
              "exFa": "جلوت هیچ‌کس نیست."
            },
            {
              "hanzi": "后面",
              "py": "hòu miàn",
              "fa": "عقب / پشتِ",
              "ex": "你后面有人。",
              "exPy": "Nǐ hòumiàn yǒu rén.",
              "exFa": "پشتت یکی هست."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:9_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «桌子» (zhuō zi) چیست؟",
                "opts": [
                  "میز",
                  "و",
                  "اینجا",
                  "داخل"
                ],
                "ans": 0,
                "audio": "zhuō zi",
                "hanzi": "桌子",
                "pinyin": "zhuō zi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «电脑» (diàn nǎo) چیست؟",
                "opts": [
                  "رایانه",
                  "میز",
                  "و",
                  "توانستن"
                ],
                "ans": 0,
                "audio": "diàn nǎo",
                "hanzi": "电脑",
                "pinyin": "diàn nǎo"
              },
              {
                "type": "choice",
                "q": "معنی واژه «和» (hé) چیست؟",
                "opts": [
                  "و",
                  "داخل",
                  "رایانه",
                  "عقب"
                ],
                "ans": 0,
                "audio": "hé",
                "hanzi": "和",
                "pinyin": "hé"
              },
              {
                "type": "choice",
                "q": "معنی واژه «前面» (qián miàn) چیست؟",
                "opts": [
                  "روی",
                  "شمارنده کتاب‌ها",
                  "نشستن",
                  "جلو"
                ],
                "ans": 3,
                "audio": "qián miàn",
                "hanzi": "前面",
                "pinyin": "qián miàn"
              }
            ]
          },
          {
            "id": "hsk1:9_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "桌子",
                    "fa": "میز"
                  },
                  {
                    "zh": "上",
                    "fa": "روی"
                  },
                  {
                    "zh": "电脑",
                    "fa": "رایانه"
                  },
                  {
                    "zh": "和",
                    "fa": "و"
                  },
                  {
                    "zh": "本",
                    "fa": "شمارنده کتاب‌ها"
                  },
                  {
                    "zh": "里",
                    "fa": "داخل"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "前面",
                    "fa": "جلو"
                  },
                  {
                    "zh": "后面",
                    "fa": "عقب"
                  },
                  {
                    "zh": "这儿",
                    "fa": "اینجا"
                  },
                  {
                    "zh": "没有",
                    "fa": "نداشتن"
                  },
                  {
                    "zh": "能",
                    "fa": "توانستن"
                  },
                  {
                    "zh": "坐",
                    "fa": "نشستن"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:9_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "能",
                "py": "néng",
                "fa": "توانستن",
                "tip": "کاراکتر «能» توانایی و قدرت را نشان می‌دهد؛ برای اجازه و امکان."
              },
              {
                "type": "write",
                "char": "坐",
                "py": "zuò",
                "fa": "نشستن",
                "tip": "کاراکتر «坐» دو نفر روی خاک نشسته‌اند: نشستن."
              },
              {
                "type": "write",
                "char": "上",
                "py": "shàng",
                "fa": "روی / بالا",
                "tip": "کاراکتر «上» خطی بالای خط دیگر است: بالا و روی."
              }
            ]
          },
          {
            "id": "hsk1:9_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «می‌تونم پشت سرت بشینم؟» را بسازید:",
                "tiles": [
                  "后面",
                  "能",
                  "坐",
                  "你",
                  "吗",
                  "我"
                ],
                "target": "我能坐你后面吗"
              },
              {
                "type": "order",
                "prompt": "جمله «رایانه روی میز است.» را بسازید:",
                "tiles": [
                  "上",
                  "电脑",
                  "在",
                  "桌子"
                ],
                "target": "电脑在桌子上"
              },
              {
                "type": "order",
                "prompt": "جمله «من رایانه ندارم.» را بسازید:",
                "tiles": [
                  "电脑",
                  "没有",
                  "我"
                ],
                "target": "我没有电脑"
              }
            ]
          },
          {
            "id": "hsk1:9_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«我能坐你后面吗？» یعنی چه؟",
                "opts": [
                  "پشتت کیه؟",
                  "بشین پشت سرم!",
                  "می‌تونم پشت سرت بشینم؟",
                  "می‌تونم جلوت بشینم؟"
                ],
                "ans": 2,
                "audio": "wǒ néng zuò nǐ hòu miàn ma"
              },
              {
                "type": "choice",
                "q": "معنی «我没有电脑» چیست؟",
                "opts": [
                  "او رایانه ندارد",
                  "من رایانه دارم",
                  "من رایانه ندارم",
                  "رایانه من گم شده"
                ],
                "ans": 2,
                "audio": "wǒ méi yǒu diàn nǎo"
              },
              {
                "type": "choice",
                "q": "کدام واژه ربط «و» است؟",
                "opts": [
                  "上 (shàng)",
                  "和 (hé)",
                  "里 (lǐ)",
                  "和吗？ نه — 吗"
                ],
                "ans": 1,
                "audio": "hé"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (怎么)",
        "titleZh": "怎么",
        "icon": "sliders-horizontal",
        "desc": "怎么‏ + فعل، راه انجام کاری را می‌پرسد.",
        "intro": {
          "title": "آموزش گرامر: 怎么‏ · چطور (انجام دادن)",
          "lead": "怎么‏ + فعل، راه انجام کاری را می‌پرسد.",
          "rule": "怎么‏ · چطور (انجام دادن)",
          "mark": "怎么",
          "pattern": "怎么 + verb？",
          "explain": "怎么‏ درست قبل از فعل می‌آید: 怎么去‏ (چطور برویم)، 怎么写‏ (چطور بنویسیم)، 怎么读‏ (چطور بخوانیم). این همان پرسشی است که وقتی گیر کرده‌اید می‌پرسید.",
          "mistake": "✗ 你去学校怎么？ → ✓ 你怎么去学校？",
          "compare": [
            {
              "w": "怎么",
              "gloss": "how to do it",
              "ex": "怎么去"
            },
            {
              "w": "怎么样",
              "gloss": "how is it",
              "ex": "天气怎么样"
            }
          ],
          "examples": [
            {
              "ch": "这个字怎么读？",
              "py": "zhège zì zěnme dú?",
              "en": "How do you read this character?",
              "fa": "How do you read this character?"
            },
            {
              "ch": "你怎么去学校？",
              "py": "nǐ zěnme qù xuéxiào?",
              "en": "How do you get to school?",
              "fa": "How do you get to school?"
            },
            {
              "ch": "\"谢谢\"汉语怎么说？",
              "py": "\"xièxie\" Hànyǔ zěnme shuō?",
              "en": "How do you say \"thank you\" in Chinese?",
              "fa": "How do you say \"thank you\" in Chinese?"
            }
          ],
          "points": [
            "الگوی ساختاری: 怎么 + verb？",
            "توضیح قاعده: 怎么‏ درست قبل از فعل می‌آید: 怎么去‏ (چطور برویم)، 怎么写‏ (چطور بنویسیم)، 怎么读‏ (چطور بخوانیم). این همان پرسشی است که وقتی گیر کرده‌اید می‌پرسید.",
            "اشتباه رایج: ✗ 你去学校怎么？ → ✓ 你怎么去学校？"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_zenme",
            "num": 1,
            "title": "آموزش و آزمون گرامر 怎么",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 怎么‏ · چطور (انجام دادن)",
            "exercises": [
              {
                "type": "gram",
                "id": "zenme",
                "mark": "怎么",
                "rule": "怎么‏ · چطور (انجام دادن)",
                "titleFa": "怎么‏ · چطور (انجام دادن)",
                "catFa": "پرسش‌ها",
                "formula": "怎么 + verb？",
                "pattern": "怎么 + verb？",
                "desc": "怎么‏ + فعل، راه انجام کاری را می‌پرسد.",
                "oneLine": "怎么‏ + فعل، راه انجام کاری را می‌پرسد.",
                "explain": "怎么‏ درست قبل از فعل می‌آید: 怎么去‏ (چطور برویم)، 怎么写‏ (چطور بنویسیم)، 怎么读‏ (چطور بخوانیم). این همان پرسشی است که وقتی گیر کرده‌اید می‌پرسید.",
                "mistake": "✗ 你去学校怎么？ → ✓ 你怎么去学校？",
                "compare": [
                                {
                                                "w": "怎么",
                                                "gloss": "how to do it",
                                                "glossFa": "روش و چگونگی انجام کار",
                                                "ex": "怎么去"
                                },
                                {
                                                "w": "怎么样",
                                                "gloss": "how is it",
                                                "glossFa": "چطور است (کیفیت/نظرخواهی)",
                                                "ex": "天气怎么样"
                                }
                ],
                "examples": [
                                {
                                                "ch": "这个字怎么读？",
                                                "py": "zhège zì zěnme dú?",
                                                "en": "How do you read this character?",
                                                "fa": "این نویسه چطور خوانده می‌شود؟"
                                },
                                {
                                                "ch": "你怎么去学校？",
                                                "py": "nǐ zěnme qù xuéxiào?",
                                                "en": "How do you get to school?",
                                                "fa": "چطور به مدرسه می‌روی؟"
                                },
                                {
                                                "ch": "“谢谢”汉语怎么说？",
                                                "py": "\"xièxie\" Hànyǔ zěnme shuō?",
                                                "en": "How do you say \"thank you\" in Chinese?",
                                                "fa": "«متشکرم» به زبان چینی چطور گفته می‌شود؟"
                                }
                ],
                "ex": "这个字怎么读？",
                "exPy": "zhège zì zěnme dú?",
                "exFa": "How do you read this character?"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n你__去北京？——坐飞机去。",
                "opts": [
                  "怎么",
                  "怎么样",
                  "什么"
                ],
                "ans": 0,
                "tip": "پرسیدن روش انجام کاری: 怎么‏ + فعل.",
                "exFa": "چطور به پکن می‌روی؟ - با هواپیما."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "你怎么回家",
                "tiles": [
                  "你",
                  "怎么",
                  "回",
                  "家"
                ],
                "en": "چطور می‌روی خانه؟",
                "tip": "怎么‏ مستقیم قبل از فعل می‌آید.",
                "py": "nǐ zěn me huí jiā",
                "pinyin": "nǐ zěn me huí jiā"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n这个菜怎么做？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "怎么‏ + فعل می‌پرسد چگونه انجامش دهی.",
                "exFa": "این غذا را چطور می‌پزی؟"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n你去医院怎么？",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "怎么‏ قبل از فعل می‌آید، نه در آخر. (جمله صحیح: 你怎么去医院？)",
                "exFa": "چطور به بیمارستان می‌روی؟"
              },
              {
                "type": "choice",
                "q": "کلمه «怎么» باید در کدام جایگاه قرار گیرد؟\n[A] 我们 [B] 去 [C] 你家 [D] ？ [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 1,
                "tip": "怎么‏ مستقیم قبل از فعل 去‏ قرار می‌گیرد.",
                "exFa": "چطور به خانه‌ات می‌رویم؟"
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و هوموفون‌های 前/钱 (qián)",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: «前» (qián جلو) و «钱» (qián پول) دقیقاً هم‌صدا هستند! و در «没有» ترکیب تُن ۲ + تُن ۳ ادا می‌شود: méi yǒu."
        },
        "miniLessons": [
          {
            "id": "hsk1:9_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "néng",
                "pinyin": "néng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "zuò",
                "pinyin": "zuò",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shàng",
                "pinyin": "shàng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:9_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «qián miàn» (جلو) را پخش می‌کند؟",
                "audio": "qián miàn",
                "opts": [
                  "qiánmiàn (前面 — جلو)",
                  "hòumiàn (后面 — عقب)",
                  "shàngmiàn (上面 — بالا)",
                  "xiàmiàn (下面 — پایین)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «lǐ» (داخل — تُن ۳) است؟",
                "audio": "lǐ",
                "opts": [
                  "nǐ (تو)",
                  "lǐ (里 - تُن ۳)",
                  "lí (تُن ۲)",
                  "lì (تُن ۴)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «běn» (شمارنده کتاب — تُن ۳) است؟",
                "audio": "běn",
                "opts": [
                  "běn (本 - تُن ۳)",
                  "bēn (تُن ۱)",
                  "pén (تُن ۲)",
                  "bèn (تُن ۴)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "hsk1:9_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "واژه‌های 前 و 钱 چگونه تلفظ می‌شوند؟",
                "opts": [
                  "هر دو qiàn تُن ۴",
                  "هر دو qián با تُن ۲",
                  "前 qián تُن ۲ و 钱 qiàn تُن ۴",
                  "前 qiǎn و 钱 qián"
                ],
                "ans": 1,
                "audio": "qián"
              },
              {
                "type": "choice",
                "q": "در «我没有电脑» تُن‌ها چگونه‌اند؟",
                "opts": [
                  "méi تُن ۲، yǒu تُن ۳، diàn تُن ۴، nǎo تُن ۳",
                  "diàn تُن ۲، nǎo تُن ۴",
                  "همه تُن ۴",
                  "méi تُن ۳، yǒu تُن ۲"
                ],
                "ans": 0,
                "audio": "wǒ méi yǒu diàn nǎo"
              }
            ]
          },
          {
            "id": "hsk1:9_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "我能坐你后面吗",
                "py": "wǒ néng zuò nǐ hòu miàn ma",
                "fa": "می‌تونم پشت سرت بشینم؟",
                "tip": "能 تُن ۲ و 坐 تُن ۴؛ ذره ma سبک و خنثی."
              },
              {
                "type": "repeat",
                "target": "电脑在桌子上",
                "py": "diàn nǎo zài zhuōzi shàng",
                "fa": "رایانه روی میز است",
                "tip": "电脑 با تُن ۴ + تُن ۳؛ zi در 桌子 خنثی."
              },
              {
                "type": "repeat",
                "target": "我没有电脑",
                "py": "wǒ méi yǒu diàn nǎo",
                "fa": "من رایانه ندارم",
                "tip": "没有 را méi yǒu بخوانید: تُن ۲ سپس تُن ۳."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «néng...ma» گوش کنید: درخواست اجازه.",
            "۲. پاسخ‌های اجازه/عدم اجازه را تشخیص دهید.",
            "۳. به مکان‌های دقیق (桌子上面، 本里) دقت کنید.",
            "۴. اشیاء کلاس خودتان را با 和 وصل کنید و جمله بسازید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:9_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "wǒ néng zuò nǐ hòu miàn ma",
                "opts": [
                  "می‌تونم پشت سرت بشینم؟",
                  "پشتت کیه؟",
                  "می‌تونم اینجا بشینم؟",
                  "می‌تونم جلوت بشینم؟"
                ],
                "ans": 0,
                "revealZh": "我能坐你后面吗？",
                "revealPy": "Wǒ néng zuò nǐ hòumiàn ma?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ méi yǒu diàn nǎo",
                "opts": [
                  "من رایانه ندارم",
                  "او رایانه ندارد",
                  "من رایانه دارم",
                  "رایانه نداره؟"
                ],
                "ans": 0,
                "revealZh": "我没有电脑。",
                "revealPy": "Wǒ méiyǒu diànnǎo."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "nǐ qián miàn shì shéi",
                "opts": [
                  "تو کی هستی؟",
                  "جلوت کیه؟",
                  "پشتت کیه؟",
                  "او کیه؟"
                ],
                "ans": 1,
                "revealZh": "你前面是谁？",
                "revealPy": "Nǐ qiánmiàn shì shéi?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "diàn nǎo hé shū zài zhuōzi shàng",
                "opts": [
                  "رایانه و کتاب روی میز هستند",
                  "میز و صندلی اینجاست",
                  "کتاب زیر رایانه است",
                  "رایانه روی میز و کتاب داخلش"
                ],
                "ans": 0,
                "revealZh": "电脑和书在桌子上。",
                "revealPy": "Diànnǎo hé shū zài zhuōzi shàng."
              }
            ]
          },
          {
            "id": "hsk1:9_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：我能坐你后面吗？\n阿达：能！我这儿前面没有人。\n李华：谢谢！你的电脑呢？\n阿达：电脑在桌子上，我没有书。",
                "textPy": "Lǐ Huá: Wǒ néng zuò nǐ hòumiàn ma?\nĀ Dá: Néng! Wǒ zhèr qiánmiàn méiyǒu rén.\nLǐ Huá: Xièxie! Nǐde diànnǎo ne?\nĀ Dá: Diànnǎo zài zhuōzi shàng, wǒ méiyǒu shū.",
                "textFa": "لی‌هوا: می‌تونم پشت سرت بشینم؟\nآدا: بله! جلوم هیچ‌کس نیست.\nلی‌هوا: ممنون! رایانه‌ات چطور؟\nآدا: رایانه روی میزه، کتاب ندارم.",
                "q": "阿达 چی ندارد؟",
                "opts": [
                  "میز (桌子)",
                  "کتاب (书)",
                  "رایانه (电脑)",
                  "صندلی (椅子)"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "A: 我能坐你前面吗？\nB: 不能，前面有王明。\nA: 那你后面呢？\nB: 我后面没有椅子。",
                "textPy": "A: Nǐ néng zuò nǐ qiánmiàn ma?\nB: Bùnéng, qiánmiàn yǒu Wáng Míng.\nA: Nà nǐ hòumiàn ne?\nB: Wǒ hòumiàn méiyǒu yǐzi.",
                "textFa": "A: می‌تونی جلوتر بشینی؟\nB: نه، جلو وانگ مینگه.\nA: پس پشتت چطور؟\nB: پشتم صندلی نداره.",
                "q": "پشت B چیست؟",
                "opts": [
                  "صندلی ندارد (没有椅子)",
                  "وانگ مینگ آنجاست",
                  "صندلی دارد",
                  "میز دارد"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：桌子上有什么？\n王明：有一台电脑和三本书。",
                "textPy": "Mīmī: Zhuōzi shàng yǒu shénme?\nWáng Míng: Yǒu yì tái diànnǎo hé sān běn shū.",
                "textFa": "می‌می: روی میز چی داره؟\nوانگ مینگ: یه رایانه و سه‌تا کتاب.",
                "q": "روی میز چندتا کتاب است؟",
                "opts": [
                  "یک‌تا",
                  "دوتا",
                  "سه‌تا (三本)",
                  "هیچ"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 能، 没有 و 和",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس دهم رسیدید! این بخش تسلط شما روی اجازه، نفی و مکان‌های دقیق را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی 能 و 没有",
            "سنجش مکان‌های ترکیبی و ربط 和",
            "درک شنیداری مکالمات کلاس",
            "با پاس کردن این بخش، ایستگاه ۱۰ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:9_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «می‌تونم اینجا بشینم؟» کدام است؟",
                "opts": [
                  "我能坐吗这儿？",
                  "我坐这儿能吗？",
                  "我能坐这儿吗？",
                  "我能这儿坐吗？"
                ],
                "ans": 2,
                "audio": "wǒ néng zuò zhèr ma"
              },
              {
                "type": "choice",
                "q": "کدام جمله «من رایانه ندارم.» است؟",
                "opts": [
                  "我不有电脑。",
                  "我没有电脑吗？",
                  "我没有没有电脑。",
                  "我没有电脑。"
                ],
                "ans": 3,
                "audio": "wǒ méi yǒu diàn nǎo"
              },
              {
                "type": "order",
                "prompt": "سؤال «می‌تونم پشت سرت بشینم؟» را مرتب کنید:",
                "tiles": [
                  "后面",
                  "能",
                  "坐",
                  "你",
                  "吗",
                  "我"
                ],
                "target": "我能坐你后面吗"
              },
              {
                "type": "order",
                "prompt": "جمله «میز و صندلی اینجاست.» را بسازید:",
                "tiles": [
                  "这儿",
                  "桌子",
                  "椅子",
                  "在",
                  "和"
                ],
                "target": "桌子和椅子在这儿"
              }
            ]
          },
          {
            "id": "hsk1:9_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ méi yǒu shū,  wǒ méi yǒu diàn nǎo",
                "opts": [
                  "هر دو را دارم",
                  "نه کتاب دارم نه رایانه",
                  "کتاب دارم، رایانه ندارم",
                  "او هیچ ندارد"
                ],
                "ans": 1,
                "revealZh": "我没有书，我没有电脑。",
                "revealPy": "Wǒ méiyǒu shū, wǒ méiyǒu diànnǎo."
              },
              {
                "type": "reading_q",
                "textZh": "李华：我能坐你后面吗？\n王明：能！你前面是我，我前面没有人。\n李华：电脑在哪儿？\n王明：电脑在桌子上，书在电脑旁边。",
                "textPy": "Lǐ Huá: Wǒ néng zuò nǐ hòumiàn ma?\nWáng Míng: Néng! Nǐ qiánmiàn shì wǒ, wǒ qiánmiàn méiyǒu rén.\nLǐ Huá: Diànnǎo zài nǎr?\nWáng Míng: Diànnǎo zài zhuōzi shàng, shū zài diànnǎo pángbiān.",
                "textFa": "لی‌هوا: می‌تونم پشت سرت بشینم؟\nوانگ مینگ: بله! جلوت منم، جلوم هیچ‌کس نیست.\nلی‌هوا: رایانه کجاست؟\nوانگ مینگ: روی میزه، کتاب هم کنار رایانه.",
                "q": "کتاب کجاست؟",
                "opts": [
                  "پشت صندلی",
                  "داخل رایانه",
                  "زیر میز",
                  "کنار رایانه روی میز"
                ],
                "ans": 3
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
    "title": "What time are we going to the movies?",
    "titleFa": "ساعت چند می‌ریم سینما؟",
    "titleZh": "我们几点去看电影",
    "level": "HSK 1",
    "desc": "آموزش گفتن ساعت با «点/分»، پرسش زمان با «几点» و ساختار زمان + فعل",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های زمان، سینما و شهر",
        "intro": {
          "title": "آشنایی با واژه‌های ساعت و زمان در درس یازدهم",
          "lead": "در این بخش با کلمات کلیدی برای گفتن ساعت، وقت‌ها و رفتن به سینما آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "现在",
              "py": "xiàn zài",
              "fa": "الان / حالا",
              "ex": "现在几点？",
              "exPy": "Xiànzài jǐ diǎn?",
              "exFa": "الان ساعت چند است؟"
            },
            {
              "hanzi": "点",
              "py": "diǎn",
              "fa": "ساعت (شمارنده ساعت)",
              "ex": "现在五点。",
              "exPy": "Xiànzài wǔ diǎn.",
              "exFa": "الان ساعت پنج است."
            },
            {
              "hanzi": "分",
              "py": "fēn",
              "fa": "دقیقه",
              "ex": "现在五点十分。",
              "exPy": "Xiànzài wǔ diǎn shí fēn.",
              "exFa": "الان ساعت پنج و ده دقیقه است."
            },
            {
              "hanzi": "中午",
              "py": "zhōng wǔ",
              "fa": "ظهر",
              "ex": "中午我们去吃饭。",
              "exPy": "Zhōngwǔ wǒmen qù chīfàn.",
              "exFa": "ظهر می‌رویم غذا بخوریم."
            },
            {
              "hanzi": "吃饭",
              "py": "chī fàn",
              "fa": "غذا خوردن",
              "ex": "我们中午吃饭。",
              "exPy": "Wǒmen zhōngwǔ chīfàn.",
              "exFa": "ما ظهر غذا می‌خوریم."
            },
            {
              "hanzi": "时候",
              "py": "shí hou",
              "fa": "وقت / هنگام",
              "ex": "什么时候？",
              "exPy": "Shénme shíhou?",
              "exFa": "چه وقت؟"
            },
            {
              "hanzi": "电影",
              "py": "diàn yǐng",
              "fa": "فیلم / سینما",
              "ex": "我们几点去看电影？",
              "exPy": "Wǒmen jǐ diǎn qù kàn diànyǐng?",
              "exFa": "ساعت چند می‌ریم سینما؟"
            },
            {
              "hanzi": "回",
              "py": "huí",
              "fa": "برگشتن / بازگشتن",
              "ex": "我们下午四点回家。",
              "exPy": "Wǒmen xiàwǔ sì diǎn huí jiā.",
              "exFa": "ما بعدازظهر ساعت چهار برمی‌گردیم خانه."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:10_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «现在» (xiàn zài) چیست؟",
                "opts": [
                  "الان",
                  "قبل",
                  "پکن",
                  "وقت"
                ],
                "ans": 0,
                "audio": "xiàn zài",
                "hanzi": "现在",
                "pinyin": "xiàn zài"
              },
              {
                "type": "choice",
                "q": "معنی واژه «点» (diǎn) چیست؟",
                "opts": [
                  "قبل",
                  "زندگی کردن",
                  "ساعت (شمارنده ساعت)",
                  "غذا خوردن"
                ],
                "ans": 2,
                "audio": "diǎn",
                "hanzi": "点",
                "pinyin": "diǎn"
              },
              {
                "type": "choice",
                "q": "معنی واژه «分» (fēn) چیست؟",
                "opts": [
                  "ما",
                  "دقیقه",
                  "ظهر",
                  "الان"
                ],
                "ans": 1,
                "audio": "fēn",
                "hanzi": "分",
                "pinyin": "fēn"
              },
              {
                "type": "choice",
                "q": "معنی واژه «中午» (zhōng wǔ) چیست؟",
                "opts": [
                  "ظهر",
                  "وقت",
                  "برگشتن",
                  "دقیقه"
                ],
                "ans": 0,
                "audio": "zhōng wǔ",
                "hanzi": "中午",
                "pinyin": "zhōng wǔ"
              }
            ]
          },
          {
            "id": "hsk1:10_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "现在",
                    "fa": "الان"
                  },
                  {
                    "zh": "点",
                    "fa": "ساعت (شمارنده ساعت)"
                  },
                  {
                    "zh": "分",
                    "fa": "دقیقه"
                  },
                  {
                    "zh": "中午",
                    "fa": "ظهر"
                  },
                  {
                    "zh": "吃饭",
                    "fa": "غذا خوردن"
                  },
                  {
                    "zh": "时候",
                    "fa": "وقت"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "回",
                    "fa": "برگشتن"
                  },
                  {
                    "zh": "我们",
                    "fa": "ما"
                  },
                  {
                    "zh": "电影",
                    "fa": "فیلم"
                  },
                  {
                    "zh": "住",
                    "fa": "زندگی کردن"
                  },
                  {
                    "zh": "前",
                    "fa": "قبل"
                  },
                  {
                    "zh": "北京",
                    "fa": "پکن"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:10_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "现",
                "py": "xiàn",
                "fa": "اکنون",
                "tip": "کاراکتر «现» با رادیکال جواهر (王) شروع می‌شود؛ در «现在» یعنی الان."
              },
              {
                "type": "write",
                "char": "点",
                "py": "diǎn",
                "fa": "نقطه / ساعت",
                "tip": "کاراکتر «点» ریشه‌اش سوختن و نقطه است؛ برای ساعت (X点) و نکته."
              },
              {
                "type": "write",
                "char": "回",
                "py": "huí",
                "fa": "برگشتن",
                "tip": "کاراکتر «回» دو حصار تو در تو است: رفتن و برگشتن به درون."
              }
            ]
          },
          {
            "id": "hsk1:10_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «الان ساعت چند است؟» را بسازید:",
                "tiles": [
                  "几点",
                  "现在"
                ],
                "target": "现在几点"
              },
              {
                "type": "order",
                "prompt": "جمله «ظهر می‌رویم غذا بخوریم.» را بسازید:",
                "tiles": [
                  "吃饭",
                  "中午",
                  "去",
                  "我们"
                ],
                "target": "我们中午去吃饭"
              },
              {
                "type": "order",
                "prompt": "سؤال «ساعت چند می‌ریم سینما؟» را بسازید:",
                "tiles": [
                  "电影",
                  "几点",
                  "看",
                  "去",
                  "我们"
                ],
                "target": "我们几点去看电影"
              }
            ]
          },
          {
            "id": "hsk1:10_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«现在几点？» یعنی چه؟",
                "opts": [
                  "الان چندشنبه است؟",
                  "الان کجایی؟",
                  "چندتا سینما هست؟",
                  "الان ساعت چند است؟"
                ],
                "ans": 3,
                "audio": "xiàn zài jǐ diǎn"
              },
              {
                "type": "choice",
                "q": "«我们中午去吃饭» یعنی چه؟",
                "opts": [
                  "من ظهر غذا خوردم",
                  "ما ظهر می‌رویم غذا بخوریم",
                  "ما ظهر فیلم می‌بینیم",
                  "ظهر ساعت چند غذا می‌خورید؟"
                ],
                "ans": 1,
                "audio": "wǒ men zhōng wǔ qù chī fàn"
              },
              {
                "type": "choice",
                "q": "کدام جمله «من در پکن زندگی می‌کنم.» است؟",
                "opts": [
                  "我去北京。",
                  "我住在北京。",
                  "我是北京。",
                  "我在北京工作。"
                ],
                "ans": 1,
                "audio": "wǒ zhù zài Běi jīng"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (不)",
        "titleZh": "不",
        "icon": "sliders-horizontal",
        "desc": "不‏ برای عادت‌ها، خواسته‌ها و آینده؛ 没‏ برای آنچه رخ نداد، و برای 有‏.",
        "intro": {
          "title": "آموزش گرامر: 不‏ در برابر 没‏ · دو نوع «نه»",
          "lead": "不‏ برای عادت‌ها، خواسته‌ها و آینده؛ 没‏ برای آنچه رخ نداد، و برای 有‏.",
          "rule": "不‏ در برابر 没‏ · دو نوع «نه»",
          "mark": "不",
          "pattern": "不 + verb / adjective · 没 (有) + verb · 没有 + noun",
          "explain": "不‏ می‌گوید «نکن / نخواهم / نه»: 我不喝茶‏. 没‏ می‌گوید «نکردم / نکرده‌ام»: 我没有喝茶‏ (چای ننوشیدم؛ 有‏ اغلب حذف می‌شود: 没喝‏). 有‏ فقط 没‏ می‌گیرد: 没有‏. صفت‌ها 不‏ می‌گیرند: 不冷‏. به تُن دقت کن: 不‏ پیش از تُن چهارم bú تلفظ می‌شود (不是‏، 不去‏).",
          "mistake": "✗ 昨天我不去学校。 → ✓ 昨天我没(有)去学校。",
          "compare": [
            {
              "w": "不",
              "gloss": "don't, won't",
              "ex": "明天我不去",
              "py": "bù"
            },
            {
              "w": "没",
              "gloss": "didn't, haven't",
              "ex": "昨天我没有去",
              "py": "méi"
            }
          ],
          "examples": [
            {
              "ch": "我不喜欢下雨。",
              "py": "wǒ bù xǐhuan xià yǔ.",
              "en": "I don't like rain.",
              "fa": "I don't like rain."
            },
            {
              "ch": "昨天我没有去学校。",
              "py": "zuótiān wǒ méiyǒu qù xuéxiào.",
              "en": "I didn't go to school yesterday.",
              "fa": "I didn't go to school yesterday."
            },
            {
              "ch": "今天不冷。",
              "py": "jīntiān bù lěng.",
              "en": "It isn't cold today.",
              "fa": "It isn't cold today."
            }
          ],
          "points": [
            "الگوی ساختاری: 不 + verb / adjective · 没 (有) + verb · 没有 + noun",
            "توضیح قاعده: 不‏ می‌گوید «نکن / نخواهم / نه»: 我不喝茶‏. 没‏ می‌گوید «نکردم / نکرده‌ام»: 我没有喝茶‏ (چای ننوشیدم؛ 有‏ اغلب حذف می‌شود: 没喝‏). 有‏ فقط 没‏ می‌گیرد: 没有‏. صفت‌ها 不‏ می‌گیرند: 不冷‏. به تُن دقت کن: 不‏ پیش از تُن چهارم bú تلفظ می‌شود (不是‏، 不去‏).",
            "اشتباه رایج: ✗ 昨天我不去学校。 → ✓ 昨天我没(有)去学校。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_bu-mei",
            "num": 1,
            "title": "آموزش و آزمون گرامر 不",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 不‏ در برابر 没‏ · دو نوع «نه»",
            "exercises": [
              {
                "type": "gram",
                "id": "bu-mei",
                "mark": "不",
                "rule": "不‏ در برابر 没‏ · دو نوع «نه»",
                "titleFa": "不‏ در برابر 没‏ · دو نوع «نه»",
                "catFa": "دستور زبان",
                "formula": "不 + verb / adjective · 没 (有) + verb · 没有 + noun",
                "pattern": "不 + verb / adjective · 没 (有) + verb · 没有 + noun",
                "desc": "不‏ برای عادت‌ها، خواسته‌ها و آینده؛ 没‏ برای آنچه رخ نداد، و برای 有‏.",
                "oneLine": "不‏ برای عادت‌ها، خواسته‌ها و آینده؛ 没‏ برای آنچه رخ نداد، و برای 有‏.",
                "explain": "不‏ می‌گوید «نکن / نخواهم / نه»: 我不喝茶‏. 没‏ می‌گوید «نکردم / نکرده‌ام»: 我没有喝茶‏ (چای ننوشیدم؛ 有‏ اغلب حذف می‌شود: 没喝‏). 有‏ فقط 没‏ می‌گیرد: 没有‏. صفت‌ها 不‏ می‌گیرند: 不冷‏. به تُن دقت کن: 不‏ پیش از تُن چهارم bú تلفظ می‌شود (不是‏، 不去‏).",
                "mistake": "✗ 昨天我不去学校。 → ✓ 昨天我没(有)去学校。",
                "compare": [
                                {
                                                "w": "不",
                                                "gloss": "don't, won't",
                                                "glossFa": "منفی کردن حال، آینده یا عادت",
                                                "ex": "明天我不去",
                                                "py": "bù"
                                },
                                {
                                                "w": "没",
                                                "gloss": "didn't, haven't",
                                                "glossFa": "منفی کردن گذشته یا نداشتن",
                                                "ex": "昨天我没有去",
                                                "py": "méi"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我不喜欢下雨。",
                                                "py": "wǒ bù xǐhuan xià yǔ.",
                                                "en": "I don't like rain.",
                                                "fa": "من از باران باریدن خوشم نمی‌آید."
                                },
                                {
                                                "ch": "昨天我没有去学校。",
                                                "py": "zuótiān wǒ méiyǒu qù xuéxiào.",
                                                "en": "I didn't go to school yesterday.",
                                                "fa": "دیروز به مدرسه نرفتم."
                                },
                                {
                                                "ch": "今天不冷。",
                                                "py": "jīntiān bù lěng.",
                                                "en": "It isn't cold today.",
                                                "fa": "امروز سرد نیست."
                                }
                ],
                "ex": "我不喜欢下雨。",
                "exPy": "wǒ bù xǐhuan xià yǔ.",
                "exFa": "I don't like rain."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我昨天__看电视，我去看电影了。",
                "opts": [
                  "没有",
                  "不",
                  "不是"
                ],
                "ans": 0,
                "tip": "کاری که اتفاق نیفتاده 没有‏ می‌گیرد، نه 不‏.",
                "exFa": "دیروز تلویزیون تماشا نکردم — رفتم فیلم دیدم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我没有买那本书",
                "tiles": [
                  "我",
                  "没有",
                  "买",
                  "那本",
                  "书"
                ],
                "en": "آن کتاب را نخریدم.",
                "tip": "没有‏ برای «انجام ندادم» درست قبل از فعل می‌آید.",
                "py": "wǒ méi yǒu mǎi nà běn shū",
                "pinyin": "wǒ méi yǒu mǎi nà běn shū"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n明天我不工作。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "آینده 不‏ می‌گیرد: یعنی «انجام نخواهم داد».",
                "exFa": "فردا کار نمی‌کنم."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n昨天下午我不看电视。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "دیروز اتفاق نیفتاده: از 没有‏ استفاده کن، نه 不‏. (جمله صحیح: 昨天下午我没有看电视。)",
                "exFa": "دیروز بعدازظهر تلویزیون تماشا نکردم."
              },
              {
                "type": "choice",
                "q": "کلمه «不» باید در کدام جایگاه قرار گیرد؟\n[A] 我 [B] 喜欢 [C] 这个 [D] 电影。 [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 1,
                "tip": "احساس یا عادت 不‏ می‌گیرد، درست قبل از فعل.",
                "exFa": "این فیلم را دوست ندارم."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تُن‌های 现在 (دو تُن ۴)",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: «现在» دو تُن ۴ پشت هم دارد (xiàn zài) — هر دو محکم و کوتاه ادا می‌شوند. و «什么时候» هجای آخر hou تُن خنثی دارد."
        },
        "miniLessons": [
          {
            "id": "hsk1:10_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "diǎn",
                "pinyin": "diǎn",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "fēn",
                "pinyin": "fēn",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "huí",
                "pinyin": "huí",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:10_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «diàn yǐng» (فیلم) را پخش می‌کند؟",
                "audio": "diàn yǐng",
                "opts": [
                  "diǎn (点 — ساعت)",
                  "diànyǐng (电影 — فیلم)",
                  "diànnǎo (电脑 — رایانه)",
                  "diànhuà (电话 — تلفن)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «zhōngwǔ» (ظهر) است؟",
                "audio": "zhōng wǔ",
                "opts": [
                  "shàngwǔ (上午 — صبح)",
                  "zhōngguó (中国 — چین)",
                  "zhōngwǔ (中午 — ظهر)",
                  "xiàwǔ (下午 — بعدازظهر)"
                ],
                "ans": 2
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «shíhou» (وقت) است؟",
                "audio": "shíhou",
                "opts": [
                  "shíhou (时候 — وقت)",
                  "hòumiàn (后面 — عقب)",
                  "shí fēn (十分 — ده دقیقه)",
                  "shí diǎn (十点 — ساعت ده)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "hsk1:10_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در «现在几点？» واژه 现在 چگونه ادا می‌شود؟",
                "opts": [
                  "xiàn zài — هر دو تُن ۴، محکم و کوتاه",
                  "هر دو تُن ۲",
                  "xián zài — اولی تُن ۲",
                  "xiàn zǎi — دومی تُن ۳"
                ],
                "ans": 0,
                "audio": "xiàn zài"
              },
              {
                "type": "choice",
                "q": "در «我们几点去看电影？» ذره‌ها و تُن‌ها چگونه‌اند؟",
                "opts": [
                  "men با تُن ۲",
                  "去 تُن ۱",
                  "我们 با men خنثی؛ 几 تُن ۳، 点 تُن ۳ — jí diǎn خوانده می‌شود",
                  "几和点 هر دو تُن ۴"
                ],
                "ans": 2,
                "audio": "wǒ men jǐ diǎn qù kàn diàn yǐng"
              }
            ]
          },
          {
            "id": "hsk1:10_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "现在几点",
                "py": "xiàn zài jǐ diǎn",
                "fa": "الان ساعت چند است؟",
                "tip": "几点 را jí diǎn بخوانید: دو تُن ۳ → تُن ۲ + تُن ۳."
              },
              {
                "type": "repeat",
                "target": "我们中午去吃饭",
                "py": "wǒ men zhōng wǔ qù chī fàn",
                "fa": "ما ظهر می‌رویم غذا بخوریم",
                "tip": "men را خنثی؛ 中午 با تُن ۱ + تُن ۳."
              },
              {
                "type": "repeat",
                "target": "我们几点去看电影",
                "py": "wǒ men jǐ diǎn qù kàn diàn yǐng",
                "fa": "ساعت چند می‌ریم سینما؟",
                "tip": "去 تُن ۴ قاطع؛ 电影 با تُن ۴ + تُن ۳."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «jǐ diǎn» گوش کنید: پرسش ساعت.",
            "۲. پاسخ‌های ساعت با 点 و 分 را پیدا کنید.",
            "۳. برنامه‌های زمانی (中午/下午 + فعل) را تشخیص دهید.",
            "۴. برنامه امروز خود را با ساعت بگویید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:10_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "xiàn zài jǐ diǎn",
                "opts": [
                  "چندسالته؟",
                  "ساعت چند می‌ری؟",
                  "الان کجایی؟",
                  "الان ساعت چند است؟"
                ],
                "ans": 3,
                "revealZh": "现在几点？",
                "revealPy": "Xiànzài jǐ diǎn?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ men zhōng wǔ qù chī fàn",
                "opts": [
                  "ما ظهر می‌رویم غذا بخوریم",
                  "ظهر ساعت چند است؟",
                  "ما ظهر فیلم می‌بینیم",
                  "من ظهر غذا می‌خورم"
                ],
                "ans": 0,
                "revealZh": "我们中午去吃饭。",
                "revealPy": "Wǒmen zhōngwǔ qù chīfàn."
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "wǒ men shén me shíhou qù kàn diàn yǐng",
                "opts": [
                  "تو کی می‌ری سینما؟",
                  "ما چه وقت می‌رویم سینما؟",
                  "فیلم چه وقت شروع می‌شه؟",
                  "ساعت چند می‌رویم سینما؟"
                ],
                "ans": 1,
                "revealZh": "我们什么时候去看电影？",
                "revealPy": "Wǒmen shénme shíhou qù kàn diànyǐng?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ zhù zài Běi jīng",
                "opts": [
                  "من به پکن می‌روم",
                  "او در پکن زندگی می‌کند",
                  "من در پکن زندگی می‌کنم",
                  "من کار می‌کنم پکن"
                ],
                "ans": 2,
                "revealZh": "我住在北京。",
                "revealPy": "Wǒ zhù zài Běijīng."
              }
            ]
          },
          {
            "id": "hsk1:10_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：现在几点？\n阿达：现在是十二点。\n李华：我们中午去吃饭吗？\n阿达：好！下午两点我们去看电影。",
                "textPy": "Lǐ Huá: Xiànzài jǐ diǎn?\nĀ Dá: Xiànzài shì shí'èr diǎn.\nLǐ Huá: Wǒmen zhōngwǔ qù chīfàn ma?\nĀ Dá: Hǎo! Xiàwǔ liǎng diǎn wǒmen qù kàn diànyǐng.",
                "textFa": "لی‌هوا: الان ساعت چند است؟\nآدا: الان دوازده است.\nلی‌هوا: ظهر بریم غذا بخوریم؟\nآدا: باشه! بعدازظهر ساعت دو می‌ریم سینما.",
                "q": "بعدازظهر چه برنامه‌ای دارند؟",
                "opts": [
                  "ساعت دو می‌روند سینما",
                  "ظهر غذا می‌خورند",
                  "ساعت دو برمی‌گردند خانه",
                  "الان سینما می‌روند"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 我们几点去看电影？\nB: 下午四点，看电影以前我们吃饭。\nA: 好的！什么时候回家？\nB: 晚上十点。",
                "textPy": "A: Wǒmen jǐ diǎn qù kàn diànyǐng?\nB: Xiàwǔ sì diǎn, kàn diànyǐng yǐqián wǒmen chīfàn.\nA: Hǎode! Shénme shíhou huí jiā?\nB: Wǎnshang shí diǎn.",
                "textFa": "A: ساعت چند می‌ریم سینما؟\nB: بعدازظهر چهار؛ قبل فیلم غذا می‌خوریم.\nA: عالیه! کی برمی‌گردیم خونه؟\nB: ساعت ده شب.",
                "q": "قبل از فیلم چه می‌کنند؟",
                "opts": [
                  "خرید می‌کنند",
                  "غذا می‌خورند (吃饭)",
                  "کتاب می‌خوانند",
                  "به خانه برمی‌گردند"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "李华：你住在哪里？\n王明：我住在北京。你呢？\n李华：我住在上海，我们明天去北京。",
                "textPy": "Lǐ Huá: Nǐ zhù zài nǎlǐ?\nWáng Míng: Wǒ zhù zài Běijīng. Nǐ ne?\nLǐ Huá: Wǒ zhù zài Shànghǎi, wǒmen míngtiān qù Běijīng.",
                "textFa": "لی‌هوا: کجا زندگی می‌کنی؟\nوانگ مینگ: من پکن زندگی می‌کنم. تو چطور؟\nلی‌هوا: من شانگهای؛ ما فردا می‌ریم پکن.",
                "q": "王明 کجا زندگی می‌کند؟",
                "opts": [
                  "美国 (آمریکا)",
                  "北京 (پکن)",
                  "معلوم نیست",
                  "上海 (شانگهای)"
                ],
                "ans": 1
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع ساعت، 时候 و ساختار زمان+فعل",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس یازدهم رسیدید! این بخش تسلط شما روی ساعت و برنامه‌های زمانی را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی ساعت با 点/分",
            "سنجش پرسش 几点 و 时候",
            "درک شنیداری مکالمات برنامه‌ریزی",
            "با پاس کردن این بخش، ایستگاه ۱۱ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:10_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «الان ساعت چند است؟» کدام است؟",
                "opts": [
                  "现在几点？",
                  "几点现在？",
                  "现在几点是？",
                  "现在是几点？"
                ],
                "ans": 0,
                "audio": "xiàn zài jǐ diǎn"
              },
              {
                "type": "choice",
                "q": "کدام واژه «دقیقه» است؟",
                "opts": [
                  "点 (diǎn)",
                  "块 (kuài)",
                  "分 (fēn)",
                  "号 (hào)"
                ],
                "ans": 2,
                "audio": "fēn"
              },
              {
                "type": "order",
                "prompt": "جمله «ما ظهر می‌رویم غذا بخوریم.» را مرتب کنید:",
                "tiles": [
                  "吃饭",
                  "中午",
                  "去",
                  "我们"
                ],
                "target": "我们中午去吃饭"
              },
              {
                "type": "order",
                "prompt": "سؤال «ساعت چند می‌ریم سینما؟» را بسازید:",
                "tiles": [
                  "电影",
                  "几点",
                  "看",
                  "去",
                  "我们"
                ],
                "target": "我们几点去看电影"
              }
            ]
          },
          {
            "id": "hsk1:10_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ men xià wǔ sì diǎn huí jiā",
                "opts": [
                  "ساعت چهار ظهر است",
                  "ما بعدازظهر ساعت چهار می‌رویم سینما",
                  "ما بعدازظهر ساعت چهار برمی‌گردیم خانه",
                  "من ساعت چهار برمی‌گردم"
                ],
                "ans": 2,
                "revealZh": "我们下午四点回家。",
                "revealPy": "Wǒmen xiàwǔ sì diǎn huí jiā."
              },
              {
                "type": "reading_q",
                "textZh": "李华：现在几点？\n王明：现在两点。我们去看电影吗？\n李华：好！我们中午以前吃饭，两点去看电影。",
                "textPy": "Lǐ Huá: Xiànzài jǐ diǎn?\nWáng Míng: Xiànzài liǎng diǎn. Wǒmen qù kàn diànyǐng ma?\nLǐ Huá: Hǎo! Wǒmen zhōngwǔ yǐqián chīfàn, liǎng diǎn qù kàn diànyǐng.",
                "textFa": "لی‌هوا: الان ساعت چند است؟\nوانگ مینگ: دوئه. بریم سینما؟\nلی‌هوا: باشه! قبل ظهر غذا می‌خوریم، دوئه می‌ریم سینما.",
                "q": "قبل از ساعت دو چه می‌کنند؟",
                "opts": [
                  "می‌خوابند",
                  "سینما می‌روند",
                  "خرید می‌کنند",
                  "غذا می‌خورند"
                ],
                "ans": 3
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
    "title": "Is it cold in Beijing?",
    "titleFa": "پکن سرد است؟",
    "titleZh": "北京冷不冷",
    "level": "HSK 1",
    "desc": "آموزش پرسش «A不A» مثل 冷不冷، ساختار «太...了» و صحبت درباره آب‌وهوا",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های آب‌وهوا، احساسات و میوه‌ها",
        "intro": {
          "title": "آشنایی با واژه‌های آب‌وهوا در درس دوازدهم",
          "lead": "در این بخش با کلمات کلیدی برای صحبت درباره هوا و احساسات آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "天气",
              "py": "tiān qì",
              "fa": "هوا (آب‌وهوا)",
              "ex": "北京天气怎么样？",
              "exPy": "Běijīng tiānqì zěnmeyàng?",
              "exFa": "هوای پکن چطور است؟"
            },
            {
              "hanzi": "冷",
              "py": "lěng",
              "fa": "سرد",
              "ex": "北京冷不冷？",
              "exPy": "Běijīng lěng bu lěng?",
              "exFa": "پکن سرد است؟"
            },
            {
              "hanzi": "热",
              "py": "rè",
              "fa": "گرم / داغ",
              "ex": "今天太热了！",
              "exPy": "Jīntiān tài rè le!",
              "exFa": "امروز خیلی گرمه!"
            },
            {
              "hanzi": "下雨",
              "py": "xià yǔ",
              "fa": "باران آمدن",
              "ex": "今天下雨了。",
              "exPy": "Jīntiān xiàyǔ le.",
              "exFa": "امروز بارون اومد."
            },
            {
              "hanzi": "太",
              "py": "tài",
              "fa": "بیش از حد / خیلی",
              "ex": "太冷了！",
              "exPy": "Tài lěng le!",
              "exFa": "خیلی سرده!"
            },
            {
              "hanzi": "怎么样",
              "py": "zěn me yàng",
              "fa": "چطور / چه طور",
              "ex": "你的身体怎么样？",
              "exPy": "Nǐde shēntǐ zěnmeyàng?",
              "exFa": "حالت جسمت چطوره؟"
            },
            {
              "hanzi": "水",
              "py": "shuǐ",
              "fa": "آب",
              "ex": "我想喝水。",
              "exPy": "Wǒ xiǎng hē shuǐ.",
              "exFa": "می‌خوام آب بخورم."
            },
            {
              "hanzi": "水果",
              "py": "shuǐ guǒ",
              "fa": "میوه",
              "ex": "我爱吃水果。",
              "exPy": "Wǒ ài chī shuǐguǒ.",
              "exFa": "من عاشق میوه‌خوردنم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:11_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «天气» (tiān qì) چیست؟",
                "opts": [
                  "میوه",
                  "خانم",
                  "گرم",
                  "هوا (آب‌وهوا)"
                ],
                "ans": 3,
                "audio": "tiān qì",
                "hanzi": "天气",
                "pinyin": "tiān qì"
              },
              {
                "type": "choice",
                "q": "معنی واژه «怎么样» (zěn me yàng) چیست؟",
                "opts": [
                  "آمدن",
                  "بدن",
                  "آب",
                  "چطور"
                ],
                "ans": 3,
                "audio": "zěn me yàng",
                "hanzi": "怎么样",
                "pinyin": "zěn me yàng"
              },
              {
                "type": "choice",
                "q": "معنی واژه «太» (tài) چیست؟",
                "opts": [
                  "میوه",
                  "بدن",
                  "خانم",
                  "بیش از حد"
                ],
                "ans": 3,
                "audio": "tài",
                "hanzi": "太",
                "pinyin": "tài"
              },
              {
                "type": "choice",
                "q": "معنی واژه «热» (rè) چیست؟",
                "opts": [
                  "بیش از حد",
                  "گرم",
                  "آمدن",
                  "آب"
                ],
                "ans": 1,
                "audio": "rè",
                "hanzi": "热",
                "pinyin": "rè"
              }
            ]
          },
          {
            "id": "hsk1:11_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "天气",
                    "fa": "هوا (آب‌وهوا)"
                  },
                  {
                    "zh": "怎么样",
                    "fa": "چطور"
                  },
                  {
                    "zh": "太",
                    "fa": "بیش از حد"
                  },
                  {
                    "zh": "热",
                    "fa": "گرم"
                  },
                  {
                    "zh": "冷",
                    "fa": "سرد"
                  },
                  {
                    "zh": "下雨",
                    "fa": "باران آمدن"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "小姐",
                    "fa": "خانم"
                  },
                  {
                    "zh": "来",
                    "fa": "آمدن"
                  },
                  {
                    "zh": "身体",
                    "fa": "بدن"
                  },
                  {
                    "zh": "爱",
                    "fa": "دوست داشتن"
                  },
                  {
                    "zh": "些",
                    "fa": "چند"
                  },
                  {
                    "zh": "水果",
                    "fa": "میوه"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:11_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "热",
                "py": "rè",
                "fa": "گرم / داغ",
                "tip": "کاراکتر «热» پایه‌اش دست‌های بالای آتش است: گرمای آتش."
              },
              {
                "type": "write",
                "char": "水",
                "py": "shuǐ",
                "fa": "آب",
                "tip": "کاراکتر «水» جریان رودخانه را نشان می‌دهد؛ رادیکال واژه‌های آب‌دار."
              },
              {
                "type": "write",
                "char": "天",
                "py": "tiān",
                "fa": "آسمان / روز",
                "tip": "کاراکتر «天» خط بالای بزرگ (大) است: آسمان بالای ما."
              }
            ]
          },
          {
            "id": "hsk1:11_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «پکن سرد است؟» را بسازید:",
                "tiles": [
                  "冷不冷",
                  "北京"
                ],
                "target": "北京冷不冷"
              },
              {
                "type": "order",
                "prompt": "سؤال «هوای پکن چطوره؟» را بسازید:",
                "tiles": [
                  "天气",
                  "怎么样",
                  "北京"
                ],
                "target": "北京天气怎么样"
              },
              {
                "type": "order",
                "prompt": "جمله «امروز خیلی گرمه!» را بسازید:",
                "tiles": [
                  "热",
                  "了",
                  "太",
                  "今天"
                ],
                "target": "今天太热了"
              }
            ]
          },
          {
            "id": "hsk1:11_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«北京冷不冷？» یعنی چه؟",
                "opts": [
                  "پکن کجاست؟",
                  "پکن سرد است؟",
                  "پکن بارانی است؟",
                  "پکن گرم است؟"
                ],
                "ans": 1,
                "audio": "Běi jīng lěng bu lěng"
              },
              {
                "type": "choice",
                "q": "«太热了» یعنی چه؟",
                "opts": [
                  "برام گرم بیار",
                  "خیلی سرده!",
                  "کمی گرمه",
                  "خیلی گرمه!"
                ],
                "ans": 3,
                "audio": "tài rè le"
              },
              {
                "type": "choice",
                "q": "برای پرسیدن وضع هوا چه می‌گوئیم؟",
                "opts": [
                  "你怎么样？",
                  "天气多少钱？",
                  "天气怎么样？",
                  "天气几岁？"
                ],
                "ans": 2,
                "audio": "tiān qì zěn me yàng"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (会)",
        "titleZh": "会",
        "icon": "sliders-horizontal",
        "desc": "会‏ + فعل: یاد گرفته‌اید چطور انجامش دهید.",
        "intro": {
          "title": "آموزش گرامر: 会‏ · بلد بودن (مهارت آموخته‌شده)",
          "lead": "会‏ + فعل: یاد گرفته‌اید چطور انجامش دهید.",
          "rule": "会‏ · بلد بودن (مهارت آموخته‌شده)",
          "mark": "会",
          "pattern": "Subject + 会 / 不会 + verb",
          "explain": "会‏ برای توانایی‌هایی است که باید یاد می‌گرفتید: زبان‌ها، آشپزی، نوشتن، رانندگی. برای توانستن همین حالا یا اجازه داشتن، به جایش 能‏ به کار ببرید.",
          "mistake": "✗ 我会说汉语很好‏。 → ✓ 我会说汉语‏。 (چقدر خوب را الگوی بعدی می‌گوید: 说得很好‏.)",
          "compare": [
            {
              "w": "会",
              "gloss": "a learned skill",
              "ex": "我会说汉语"
            },
            {
              "w": "能",
              "gloss": "possible or allowed",
              "ex": "我今天不能来"
            }
          ],
          "examples": [
            {
              "ch": "我会说汉语。",
              "py": "wǒ huì shuō Hànyǔ.",
              "en": "I can speak Chinese.",
              "fa": "I can speak Chinese."
            },
            {
              "ch": "我妈妈会做中国菜。",
              "py": "wǒ māma huì zuò Zhōngguó cài.",
              "en": "My mum can cook Chinese food.",
              "fa": "My mum can cook Chinese food."
            },
            {
              "ch": "你会写这个字吗？",
              "py": "nǐ huì xiě zhège zì ma?",
              "en": "Can you write this character?",
              "fa": "Can you write this character?"
            }
          ],
          "points": [
            "الگوی ساختاری: Subject + 会 / 不会 + verb",
            "توضیح قاعده: 会‏ برای توانایی‌هایی است که باید یاد می‌گرفتید: زبان‌ها، آشپزی، نوشتن، رانندگی. برای توانستن همین حالا یا اجازه داشتن، به جایش 能‏ به کار ببرید.",
            "اشتباه رایج: ✗ 我会说汉语很好‏。 → ✓ 我会说汉语‏。 (چقدر خوب را الگوی بعدی می‌گوید: 说得很好‏.)"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_hui",
            "num": 1,
            "title": "آموزش و آزمون گرامر 会",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 会‏ · بلد بودن (مهارت آموخته‌شده)",
            "exercises": [
              {
                "type": "gram",
                "id": "hui",
                "mark": "会",
                "rule": "会‏ · بلد بودن (مهارت آموخته‌شده)",
                "titleFa": "会‏ · بلد بودن (مهارت آموخته‌شده)",
                "catFa": "افعال و کاربردها",
                "formula": "Subject + 会 / 不会 + verb",
                "pattern": "Subject + 会 / 不会 + verb",
                "desc": "会‏ + فعل: یاد گرفته‌اید چطور انجامش دهید.",
                "oneLine": "会‏ + فعل: یاد گرفته‌اید چطور انجامش دهید.",
                "explain": "会‏ برای توانایی‌هایی است که باید یاد می‌گرفتید: زبان‌ها، آشپزی، نوشتن، رانندگی. برای توانستن همین حالا یا اجازه داشتن، به جایش 能‏ به کار ببرید.",
                "mistake": "✗ 我会说汉语很好‏。 → ✓ 我会说汉语‏。 (چقدر خوب را الگوی بعدی می‌گوید: 说得很好‏.)",
                "compare": [
                                {
                                                "w": "会",
                                                "gloss": "a learned skill",
                                                "glossFa": "مهارت آموخته‌شده",
                                                "ex": "我会说汉语"
                                },
                                {
                                                "w": "能",
                                                "gloss": "possible or allowed",
                                                "glossFa": "امکان داشتن یا مجاز بودن",
                                                "ex": "我今天不能来"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我会说汉语。",
                                                "py": "wǒ huì shuō Hànyǔ.",
                                                "en": "I can speak Chinese.",
                                                "fa": "من بلدم چینی صحبت کنم."
                                },
                                {
                                                "ch": "我妈妈会做中国菜。",
                                                "py": "wǒ māma huì zuò Zhōngguó cài.",
                                                "en": "My mum can cook Chinese food.",
                                                "fa": "مادرم بلد است غذای چینی درست کند."
                                },
                                {
                                                "ch": "你会写这个字吗？",
                                                "py": "nǐ huì xiě zhège zì ma?",
                                                "en": "Can you write this character?",
                                                "fa": "بلدی این نویسه را بنویسی؟"
                                }
                ],
                "ex": "我会说汉语。",
                "exPy": "wǒ huì shuō Hànyǔ.",
                "exFa": "I can speak Chinese."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n你__说汉语吗？——会，我学习了两年。",
                "opts": [
                  "会",
                  "能",
                  "想"
                ],
                "ans": 0,
                "tip": "زبان مهارتی آموخته‌شده است، پس 会‏ می‌گیرد.",
                "exFa": "چینی بلدی؟ - بله، دو سال درسش را خواندم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我妈妈会说一点儿汉语",
                "tiles": [
                  "我妈妈",
                  "会",
                  "说",
                  "一点儿",
                  "汉语"
                ],
                "en": "مامانم کمی چینی بلد است.",
                "tip": "会‏ درست قبل از فعل 说‏ می‌آید.",
                "py": "wǒ mā ma huì shuō yì diǎn r Hàn yǔ",
                "pinyin": "wǒ mā ma huì shuō yì diǎn r Hàn yǔ"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我不会做中国菜，我妈妈会。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "آشپزی مهارتی آموخته‌شده است: 会‏ و 不会‏.",
                "exFa": "من بلد نیستم غذای چینی درست کنم، اما مامانم بلد است."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我妈妈做会中国菜。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "会‏ قبل از فعل می‌آید، نه بعد از آن. (جمله صحیح: 我妈妈会做中国菜。)",
                "exFa": "مامانم می‌تواند غذای چینی درست کند."
              },
              {
                "type": "choice",
                "q": "کلمه «会» باید در کدام جایگاه قرار گیرد؟\n[A] 我爸爸 [B] 不 [C] 说 [D] 汉语。 [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 2,
                "tip": "不会‏ به‌عنوان یک واحد درست قبل از فعل می‌آید.",
                "exFa": "بابام چینی بلد نیست."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و تُن‌های A不A",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (A不A): در «冷不冷» حرف میانی bu تُن خنثی دارد و سبک ادا می‌شود: lěng bu lěng. و در «太热了» هر دو واژه 太/热 تُن ۴ هستند."
        },
        "miniLessons": [
          {
            "id": "hsk1:11_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "rè",
                "pinyin": "rè",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "lěng",
                "pinyin": "lěng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "ài",
                "pinyin": "ài",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:11_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «lěng» (سرد — تُن ۳) را پخش می‌کند؟",
                "audio": "lěng",
                "opts": [
                  "rè (گرم)",
                  "lěng (冷 - تُن ۳)",
                  "léng (تُن ۲)",
                  "lèng (تُن ۴)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «shuǐguǒ» (میوه) است؟",
                "audio": "shuǐ guǒ",
                "opts": [
                  "shuǐguǒ (水果 — میوه)",
                  "xiàwǔ (下午 — بعدازظهر)",
                  "píngguǒ (苹果 — سیب)",
                  "shuǐ (水 — آب)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «xiǎojiě» (خانم) است؟",
                "audio": "xiǎo jiě",
                "opts": [
                  "xiàwǔ (下午 — بعدازظهر)",
                  "xiǎojiě (小姐 — خانم)",
                  "xiānsheng (先生 — آقا)",
                  "xiǎomāo (小猫 — گربه)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:11_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در «冷不冷？» واژه میانی 不 چگونه ادا می‌شود؟",
                "opts": [
                  "bu تُن خنثی و سبک",
                  "bú با تُن ۲",
                  "bù با تُن ۴",
                  "کاملاً حذف می‌شود"
                ],
                "ans": 0,
                "audio": "lěng bu lěng"
              },
              {
                "type": "choice",
                "q": "در «太热了» تُن‌ها چگونه‌اند؟",
                "opts": [
                  "tài تُن ۲، rè تُن ۴",
                  "هر سه تُن ۴",
                  "tài تُن ۴، rè تُن ۴، le خنثی",
                  "tài تُن ۴، rè تُن ۱"
                ],
                "ans": 2,
                "audio": "tài rè le"
              }
            ]
          },
          {
            "id": "hsk1:11_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "北京冷不冷",
                "py": "Běi jīng lěng bu lěng",
                "fa": "پکن سرد است؟",
                "tip": "北京 با تُن ۳ + تُن ۱؛ 不 میانی را خنثی و سبک بخوانید."
              },
              {
                "type": "repeat",
                "target": "今天太热了",
                "py": "jīn tiān tài rè le",
                "fa": "امروز خیلی گرمه",
                "tip": "太热 را محکم و قاطع بخوانید؛ 了 سبک."
              },
              {
                "type": "repeat",
                "target": "天气怎么样",
                "py": "tiān qì zěn me yàng",
                "fa": "هوا چطوره؟",
                "tip": "怎么样 را zěnme yàng بخوانید: me خنثی و yàng تُن ۴."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «bù/bu» گوش کنید: سؤال A不A یا منفی ساده.",
            "۲. تعریف‌های هوا (太热了/太冷了) را پیدا کنید.",
            "۳. به پرسش‌های 怎么样 دقت کنید.",
            "۴. درباره هوای شهر خودتان نقش‌بازی کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:11_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "Běi jīng lěng bu lěng",
                "opts": [
                  "پکن گرم است؟",
                  "پکن کجاست؟",
                  "پکن سرد است؟",
                  "امروز سرد است؟"
                ],
                "ans": 2,
                "revealZh": "北京冷不冷？",
                "revealPy": "Běijīng lěng bu lěng?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "jīn tiān tài rè le",
                "opts": [
                  "امروز چه روزیه؟",
                  "امروز بارون اومد!",
                  "امروز خیلی سرده!",
                  "امروز خیلی گرمه!"
                ],
                "ans": 3,
                "revealZh": "今天太热了！",
                "revealPy": "Jīntiān tài rè le!"
              },
              {
                "type": "listening_q",
                "prompt": "کدام پرسش را شنیدید؟",
                "audio": "Běi jīng tiān qì zěn me yàng",
                "opts": [
                  "هوای امروز چطوره؟",
                  "پکن کجاست؟",
                  "هوای پکن چطوره؟",
                  "ببدنت چطوره؟"
                ],
                "ans": 2,
                "revealZh": "北京天气怎么样？",
                "revealPy": "Běijīng tiānqì zěnmeyàng?"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "jīn tiān xià yǔ le",
                "opts": [
                  "امروز خیلی گرمه",
                  "فردا بارون میاد",
                  "امروز برف اومد",
                  "امروز بارون اومد"
                ],
                "ans": 3,
                "revealZh": "今天下雨了。",
                "revealPy": "Jīntiān xiàyǔ le."
              }
            ]
          },
          {
            "id": "hsk1:11_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：北京天气怎么样？\n阿达：冬天很冷，夏天很热。\n李华：现在呢？\n阿达：现在不下雨，很好。",
                "textPy": "Lǐ Huá: Běijīng tiānqì zěnmeyàng?\nĀ Dá: Dōngtiān hěn lěng, xiàtiān hěn rè.\nLǐ Huá: Xiànzài ne?\nĀ Dá: Xiànzài bú xiàyǔ, hěn hǎo.",
                "textFa": "لی‌هوا: هوای پکن چطوره؟\nآدا: زمستون خیلی سرده، تابستون خیلی گرم.\nلی‌هوا: الان چطور؟\nآدا: الان بارون نمیاد، هواخوبه.",
                "q": "زمستان پکن چطور است؟",
                "opts": [
                  "خیلی سرد (很冷)",
                  "بارانی",
                  "خوب",
                  "خیلی گرم"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 小姐，你的身体怎么样？\nB: 我很好，谢谢！北京冷不冷？\nA: 太冷了！你要多喝水。",
                "textPy": "A: Xiǎojiě, nǐde shēntǐ zěnmeyàng?\nB: Wǒ hěn hǎo, xièxie! Běijīng lěng bu lěng?\nA: Tài lěng le! Nǐ yào duō hē shuǐ.",
                "textFa": "A: خانم، حالت جسمت چطوره؟\nB: خوبم ممنون! پکن سرده؟\nA: خیلی سرده! باید زیاد آب بخوری.",
                "q": "پاسخ A درباره هوای پکن چیست؟",
                "opts": [
                  "خوب است",
                  "خیلی گرم است",
                  "خیلی سرد است (太冷了)",
                  "باران می‌آید"
                ],
                "ans": 2
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：你爱吃什么水果？\n王明：我爱吃苹果。你呢？\n咪咪：我爱吃一点儿水果，喝很多水。",
                "textPy": "Mīmī: Nǐ ài chī shénme shuǐguǒ?\nWáng Míng: Wǒ ài chī píngguǒ. Nǐ ne?\nMīmī: Wǒ ài chī yìdiǎnr shuǐguǒ, hē hěn duō shuǐ.",
                "textFa": "می‌می: دوست داری چه میوه‌ای بخوری؟\nوانگ مینگ: سیب. تو چی؟\nمی‌می: من کم میوه دوست دارم، آب زیاد می‌خورم.",
                "q": "王明 چه میوه‌ای دوست دارد؟",
                "opts": [
                  "هیچی",
                  "همه میوه‌ها",
                  "سیب (苹果)",
                  "معلوم نیست"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع A不A، 太...了 و 怎么样",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس دوازدهم رسیدید! این بخش تسلط شما روی پرسش‌های A不A و توصیف هوا را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی پرسش A不A",
            "سنجش ساختار 太...了 و 怎么样",
            "درک شنیداری مکالمات آب‌وهوا",
            "با پاس کردن این بخش، ایستگاه ۱۲ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:11_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «پکن سرد است؟» کدام است؟",
                "opts": [
                  "北京不冷。",
                  "北京冷不冷？",
                  "北京冷。",
                  "北京很冷。"
                ],
                "ans": 1,
                "audio": "Běi jīng lěng bu lěng"
              },
              {
                "type": "choice",
                "q": "کدام واژه «هوا» است؟",
                "opts": [
                  "下雨 (xiàyǔ)",
                  "水 (shuǐ)",
                  "水果 (shuǐguǒ)",
                  "天气 (tiānqì)"
                ],
                "ans": 3,
                "audio": "tiān qì"
              },
              {
                "type": "order",
                "prompt": "جمله «امروز خیلی سرده!» را بسازید:",
                "tiles": [
                  "冷",
                  "了",
                  "太",
                  "今天"
                ],
                "target": "今天太冷了"
              },
              {
                "type": "order",
                "prompt": "سؤال «هوای پکن چطوره؟» را مرتب کنید:",
                "tiles": [
                  "天气",
                  "怎么样",
                  "北京"
                ],
                "target": "北京天气怎么样"
              }
            ]
          },
          {
            "id": "hsk1:11_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "jīn tiān xià yǔ le,  tài lěng le",
                "opts": [
                  "فردا بارون میاد!",
                  "امروز بارون اومد، خیلی سرده!",
                  "امروز هواخوبه!",
                  "امروز بارون نمیاد، خیلی گرمه!"
                ],
                "ans": 1,
                "revealZh": "今天下雨了，太冷了！",
                "revealPy": "Jīntiān xiàyǔ le, tài lěng le!"
              },
              {
                "type": "reading_q",
                "textZh": "李华：北京冷不冷？\n咪咪：冬天太冷了！夏天很热。现在不下雨。",
                "textPy": "Lǐ Huá: Běijīng lěng bu lěng?\nMīmī: Dōngtiān tài lěng le! Xiàtiān hěn rè. Xiànzài bú xiàyǔ.",
                "textFa": "لی‌هوا: پکن سرده؟\nمی‌می: زمستون خیلی سرده! تابستون گرمه. الان بارون نمیاد.",
                "q": "تابستان پکن چگونه است؟",
                "opts": [
                  "بارانی",
                  "گرم (很热)",
                  "سرد",
                  "معلوم نیست"
                ],
                "ans": 1
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
    "title": "Mimi is sleeping",
    "titleFa": "میمی خوابیده",
    "titleZh": "咪咪在睡觉呢",
    "level": "HSK 1",
    "desc": "آموزش زمان استمراری با «在...呢»، حرف «也»، افعال روزمره و تلفن زدن با 给...打电话",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های تلفن، تلویزیون و فعالیت‌های روزانه",
        "intro": {
          "title": "آشنایی با واژه‌های فعالیت روزانه در درس سیزدهم",
          "lead": "در این بخش با کلمات کلیدی برای گفتن «الان دارم...» و فعالیت‌های روزمره آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "在...呢",
              "py": "zài...ne",
              "fa": "در حال ... بودن",
              "ex": "咪咪在睡觉呢。",
              "exPy": "Mīmī zài shuìjiào ne.",
              "exFa": "می‌می داره می‌خوابه."
            },
            {
              "hanzi": "睡觉",
              "py": "shuì jiào",
              "fa": "خوابیدن",
              "ex": "他在睡觉。",
              "exPy": "Tā zài shuìjiào.",
              "exFa": "او داره می‌خوابه."
            },
            {
              "hanzi": "电视",
              "py": "diàn shì",
              "fa": "تلویزیون",
              "ex": "我喜欢看电视。",
              "exPy": "Wǒ xǐhuan kàn diànshì.",
              "exFa": "من دوست دارم تلویزیون ببینم."
            },
            {
              "hanzi": "喜欢",
              "py": "xǐ huan",
              "fa": "دوست داشتن",
              "ex": "你也喜欢汉语吗？",
              "exPy": "Nǐ yě xǐhuan Hànyǔ ma?",
              "exFa": "تو هم چینی رو دوست داری؟"
            },
            {
              "hanzi": "也",
              "py": "yě",
              "fa": "نیز / هم",
              "ex": "我也学汉语。",
              "exPy": "Wǒ yě xué Hànyǔ.",
              "exFa": "من هم چینی یاد می‌گیرم."
            },
            {
              "hanzi": "学习",
              "py": "xué xí",
              "fa": "درس خواندن / یاد گرفتن",
              "ex": "我们上午学习汉语。",
              "exPy": "Wǒmen shàngwǔ xuéxí Hànyǔ.",
              "exFa": "ما صبح چینی یاد می‌گیریم."
            },
            {
              "hanzi": "打电话",
              "py": "dǎ diàn huà",
              "fa": "تلفن زدن",
              "ex": "我给妈妈打电话。",
              "exPy": "Wǒ gěi māma dǎ diànhuà.",
              "exFa": "به مامانم زنگ می‌زنم."
            },
            {
              "hanzi": "吧",
              "py": "ba",
              "fa": "ذره پیشنهاد («باشه؟»)",
              "ex": "我们去看电影吧！",
              "exPy": "Wǒmen qù kàn diànyǐng ba!",
              "exFa": "بریم سینما!"
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:12_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «也» (yě) چیست؟",
                "opts": [
                  "ذره پیشنهاد (مثل «باشه؟»)",
                  "نیز",
                  "تلفن زدن",
                  "خوابیدن"
                ],
                "ans": 1,
                "audio": "yě",
                "hanzi": "也",
                "pinyin": "yě"
              },
              {
                "type": "choice",
                "q": "معنی واژه «学习» (xué xí) چیست؟",
                "opts": [
                  "ذره پیشنهاد (مثل «باشه؟»)",
                  "تلویزیون",
                  "درس خواندن",
                  "الو"
                ],
                "ans": 2,
                "audio": "xué xí",
                "hanzi": "学习",
                "pinyin": "xué xí"
              },
              {
                "type": "choice",
                "q": "معنی واژه «睡觉» (shuì jiào) چیست؟",
                "opts": [
                  "دوست داشتن",
                  "الو",
                  "تلویزیون",
                  "خوابیدن"
                ],
                "ans": 3,
                "audio": "shuì jiào",
                "hanzi": "睡觉",
                "pinyin": "shuì jiào"
              },
              {
                "type": "choice",
                "q": "معنی واژه «电视» (diàn shì) چیست؟",
                "opts": [
                  "درس خواندن",
                  "الو",
                  "ذره پیشنهاد (مثل «باشه؟»)",
                  "تلویزیون"
                ],
                "ans": 3,
                "audio": "diàn shì",
                "hanzi": "电视",
                "pinyin": "diàn shì"
              }
            ]
          },
          {
            "id": "hsk1:12_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "喂",
                    "fa": "الو"
                  },
                  {
                    "zh": "也",
                    "fa": "نیز"
                  },
                  {
                    "zh": "学习",
                    "fa": "درس خواندن"
                  },
                  {
                    "zh": "上午",
                    "fa": "صبح"
                  },
                  {
                    "zh": "睡觉",
                    "fa": "خوابیدن"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "电视",
                    "fa": "تلویزیون"
                  },
                  {
                    "zh": "喜欢",
                    "fa": "دوست داشتن"
                  },
                  {
                    "zh": "给",
                    "fa": "به"
                  },
                  {
                    "zh": "打电话",
                    "fa": "تلفن زدن"
                  },
                  {
                    "zh": "吧",
                    "fa": "ذره پیشنهاد (مثل «باشه؟»)"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:12_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "学",
                "py": "xué",
                "fa": "یاد گرفتن",
                "tip": "کاراکتر «学» بچه (子) زیر سایبان دست‌ها است: یادگیری از بزرگان."
              },
              {
                "type": "write",
                "char": "电",
                "py": "diàn",
                "fa": "برق",
                "tip": "کاراکتر «电» در واژه‌های 电脑 (رایانه)، 电视 (تلویزیون) و 电话 (تلفن) می‌آید: برق."
              },
              {
                "type": "write",
                "char": "睡",
                "py": "shuì",
                "fa": "خوابیدن",
                "tip": "کاراکتر «睡» با رادیکال چشم (目) شروع می‌شود: چشم بسته = خواب."
              }
            ]
          },
          {
            "id": "hsk1:12_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "جمله «می‌می داره می‌خوابه.» را بسازید:",
                "tiles": [
                  "睡觉",
                  "在",
                  "咪咪",
                  "呢"
                ],
                "target": "咪咪在睡觉呢"
              },
              {
                "type": "order",
                "prompt": "جمله «من هم چینی یاد می‌گیرم.» را بسازید:",
                "tiles": [
                  "汉语",
                  "学",
                  "也",
                  "我"
                ],
                "target": "我也学汉语"
              },
              {
                "type": "order",
                "prompt": "جمله «به مامانم زنگ می‌زنم.» را بسازید:",
                "tiles": [
                  "打电话",
                  "妈妈",
                  "给",
                  "我"
                ],
                "target": "我给妈妈打电话"
              }
            ]
          },
          {
            "id": "hsk1:12_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«咪咪在睡觉呢» یعنی چه؟",
                "opts": [
                  "می‌می بیداره",
                  "می‌می داره می‌خوابه",
                  "می‌می خواب دیده",
                  "می‌می می‌خواد بخوابه"
                ],
                "ans": 1,
                "audio": "Mī mī zài shuì jiào ne"
              },
              {
                "type": "choice",
                "q": "«也» کجای جمله می‌آید؟",
                "opts": [
                  "قبل از فاعل",
                  "بعد از فاعل و قبل از فعل: 我也学汉语",
                  "انتهای جمله",
                  "ابتدای جمله"
                ],
                "ans": 1,
                "audio": "yě"
              },
              {
                "type": "choice",
                "q": "«给妈妈打电话» یعنی چه؟",
                "opts": [
                  "تلفن مامان را بردار",
                  "تلفن بخر برای مامان",
                  "به مامان زنگ بزن",
                  "مامان زنگ می‌زند"
                ],
                "ans": 2,
                "audio": "gěi māma dǎ diàn huà"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (太)",
        "titleZh": "太",
        "icon": "sliders-horizontal",
        "desc": "太‏ + صفت + 了‏ = زیادی، یا (با خوشحالی) فوق‌العاده.",
        "intro": {
          "title": "آموزش گرامر: 太‏……了‏ · خیلی، این‌قدر",
          "lead": "太‏ + صفت + 了‏ = زیادی، یا (با خوشحالی) فوق‌العاده.",
          "rule": "太‏……了‏ · خیلی، این‌قدر",
          "mark": "太",
          "pattern": "太 + adjective + 了",
          "explain": "太‏……了‏ می‌تواند گلایه باشد (太贵了‏، خیلی گران است) یا تعجب و تحسین (太好了‏، عالی!). 了‏ِ پایان جمله بخشی از ساختار است. در منفی، 了‏ حذف می‌شود: 不太冷‏ (خیلی سرد نیست).",
          "mistake": "✗ 不太冷了。 → ✓ 不太冷。",
          "compare": [
            {
              "w": "太……了",
              "gloss": "too much, or wow",
              "ex": "太冷了"
            },
            {
              "w": "很",
              "gloss": "just describing",
              "ex": "今天很冷"
            }
          ],
          "examples": [
            {
              "ch": "太好了！",
              "py": "tài hǎo le!",
              "en": "Great!",
              "fa": "Great!"
            },
            {
              "ch": "今天太热了。",
              "py": "jīntiān tài rè le.",
              "en": "It's too hot today.",
              "fa": "It's too hot today."
            },
            {
              "ch": "这个不太大。",
              "py": "zhège bú tài dà.",
              "en": "This one isn't very big.",
              "fa": "This one isn't very big."
            }
          ],
          "points": [
            "الگوی ساختاری: 太 + adjective + 了",
            "توضیح قاعده: 太‏……了‏ می‌تواند گلایه باشد (太贵了‏، خیلی گران است) یا تعجب و تحسین (太好了‏، عالی!). 了‏ِ پایان جمله بخشی از ساختار است. در منفی، 了‏ حذف می‌شود: 不太冷‏ (خیلی سرد نیست).",
            "اشتباه رایج: ✗ 不太冷了。 → ✓ 不太冷。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_tai-le",
            "num": 1,
            "title": "آموزش و آزمون گرامر 太",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 太‏……了‏ · خیلی، این‌قدر",
            "exercises": [
              {
                "type": "gram",
                "id": "tai-le",
                "mark": "太",
                "rule": "太‏……了‏ · خیلی، این‌قدر",
                "titleFa": "太‏……了‏ · خیلی، این‌قدر",
                "catFa": "دستور زبان",
                "formula": "太 + adjective + 了",
                "pattern": "太 + adjective + 了",
                "desc": "太‏ + صفت + 了‏ = زیادی، یا (با خوشحالی) فوق‌العاده.",
                "oneLine": "太‏ + صفت + 了‏ = زیادی، یا (با خوشحالی) فوق‌العاده.",
                "explain": "太‏……了‏ می‌تواند گلایه باشد (太贵了‏، خیلی گران است) یا تعجب و تحسین (太好了‏، عالی!). 了‏ِ پایان جمله بخشی از ساختار است. در منفی، 了‏ حذف می‌شود: 不太冷‏ (خیلی سرد نیست).",
                "mistake": "✗ 不太冷了。 → ✓ 不太冷。",
                "compare": [
                                {
                                                "w": "太……了",
                                                "gloss": "too much, or wow",
                                                "glossFa": "بسیار زیاد یا ابراز شگفتی",
                                                "ex": "太冷了"
                                },
                                {
                                                "w": "很",
                                                "gloss": "just describing",
                                                "glossFa": "توصیف ساده درجه صفت",
                                                "ex": "今天很冷"
                                }
                ],
                "examples": [
                                {
                                                "ch": "太好了！",
                                                "py": "tài hǎo le!",
                                                "en": "Great!",
                                                "fa": "عالی شد! (خیلی خوب شد!)"
                                },
                                {
                                                "ch": "今天太热了。",
                                                "py": "jīntiān tài rè le.",
                                                "en": "It's too hot today.",
                                                "fa": "امروز خیلی گرم است."
                                },
                                {
                                                "ch": "这个不太大。",
                                                "py": "zhège bú tài dà.",
                                                "en": "This one isn't very big.",
                                                "fa": "این یکی خیلی بزرگ نیست."
                                }
                ],
                "ex": "太好了！",
                "exPy": "tài hǎo le!",
                "exFa": "Great!"
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n这个杯子太小__！",
                "opts": [
                  "了",
                  "的",
                  "吗"
                ],
                "ans": 0,
                "tip": "了‏ در آخر بخشی از 太‏……了‏ است.",
                "exFa": "این لیوان خیلی کوچک است!"
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "你的狗太大了",
                "tiles": [
                  "你的",
                  "狗",
                  "太",
                  "大",
                  "了"
                ],
                "en": "سگت چه بزرگ است!",
                "tip": "太‏ + صفت + 了‏.",
                "py": "nǐ de gǒu tài dà le",
                "pinyin": "nǐ de gǒu tài dà le"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n那个商店的东西不太多。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "در منفیِ 不太‏، 了‏ حذف می‌شود.",
                "exFa": "آن مغازه چیز زیادی ندارد."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我太高兴。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "太‏ + صفت به 了‏ در آخر نیاز دارد. (جمله صحیح: 我太高兴了！)",
                "exFa": "خیلی خوشحالم!"
              },
              {
                "type": "choice",
                "q": "کلمه «太» باید در کدام جایگاه قرار گیرد؟\n[A] 北京 [B] 今天 [C] 冷 [D] 了！ [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 2,
                "tip": "太‏ درست قبل از صفت می‌آید.",
                "exFa": "امروز پکن چه سرد است!"
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و هوموفون‌های 电话/电影",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: «学习» دو تُن ۲ پشت هم دارد (xué xí). و «喂» در تلفن با تُن ۴ (wèi) ادا می‌شود نه تُن ۱!"
        },
        "miniLessons": [
          {
            "id": "hsk1:12_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "wèi",
                "pinyin": "wèi",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shuì",
                "pinyin": "shuì",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "xué",
                "pinyin": "xué",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 1
              }
            ]
          },
          {
            "id": "hsk1:12_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «diànhuà» (تلفن) را پخش می‌کند؟",
                "audio": "diàn huà",
                "opts": [
                  "diànhuà (电话 — تلفن)",
                  "diànshì (电视 — تلویزیون)",
                  "diànnǎo (电脑 — رایانه)",
                  "diànyǐng (电影 — فیلم)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «xǐhuan» (دوست داشتن) است؟",
                "audio": "xǐhuan",
                "opts": [
                  "xuéxí (学习 — یاد گرفتن)",
                  "xiǎojiě (小姐 — خانم)",
                  "shuìjiào (睡觉 — خوابیدن)",
                  "xǐhuan (喜欢 — دوست داشتن)"
                ],
                "ans": 3
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «wèi» (الو) است؟",
                "audio": "wèi",
                "opts": [
                  "wēi (تُن ۱)",
                  "wéi (تُن ۲)",
                  "wèi (喂 — الو، تُن ۴)",
                  "wěi (تُن ۳)"
                ],
                "ans": 2
              }
            ]
          },
          {
            "id": "hsk1:12_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در تلفن زدن «喂» چگونه ادا می‌شود؟",
                "opts": [
                  "wēi با تُن ۱",
                  "خنثی بدون تُن",
                  "wéi با تُن ۲",
                  "wèi با تُن ۴ (الوِ محکم)"
                ],
                "ans": 3,
                "audio": "wèi"
              },
              {
                "type": "choice",
                "q": "در «学习汉语» واژه 学习 چگونه ادا می‌شود؟",
                "opts": [
                  "xué xǐ — تُن ۲ و تُن ۳",
                  "xué xí — هر دو تُن ۲ بالارونده",
                  "xuè xì — هر دو تُن ۴",
                  "xuē xǐ — تُن ۱ و تُن ۳"
                ],
                "ans": 1,
                "audio": "xué xí"
              }
            ]
          },
          {
            "id": "hsk1:12_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "咪咪在睡觉呢",
                "py": "Mī mī zài shuì jiào ne",
                "fa": "می‌می داره می‌خوابه",
                "tip": "睡觉 با تُن ۴ + تُن ۴؛ 呢 را سبک و با آهنگ بالا بگوئید."
              },
              {
                "type": "repeat",
                "target": "我也喜欢看电视",
                "py": "wǒ yě xǐhuan kàn diàn shì",
                "fa": "من هم تلویزیون دیدن رو دوست دارم",
                "tip": "也 با تُن ۳؛ huan در 喜欢 خنثی است."
              },
              {
                "type": "repeat",
                "target": "我给妈妈打电话",
                "py": "wǒ gěi māma dǎ diàn huà",
                "fa": "به مامانم زنگ می‌زنم",
                "tip": "给 با تُن ۳؛ 打电话 با تُن ۳ + تُن ۴ + تُن ۴."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه تلفنی به «wèi» گوش کنید: شروع مکالمه.",
            "۲. جملات استمراری «在...呢» را تشخیص دهید.",
            "۳. پیشنهادهای «...吧» را پیدا کنید.",
            "۴. یک مکالمه تلفنی کوتاه نقش‌بازی کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:12_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چیست؟ (پاسخ تلفن)",
                "audio": "wèi",
                "opts": [
                  "الو / بله؟",
                  "ببخشید!",
                  "خداحافظ!",
                  "سلام!"
                ],
                "ans": 0,
                "revealZh": "喂？",
                "revealPy": "Wèi?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "Mī mī zài shuì jiào ne",
                "opts": [
                  "می‌می بیدار شد",
                  "می‌می تلویزیون می‌بینه",
                  "می‌می خوابید",
                  "می‌می داره می‌خوابه"
                ],
                "ans": 3,
                "revealZh": "咪咪在睡觉呢。",
                "revealPy": "Mīmī zài shuìjiào ne."
              },
              {
                "type": "listening_q",
                "prompt": "کدام جمله را شنیدید؟",
                "audio": "wǒ yě xǐhuan kàn diàn shì",
                "opts": [
                  "من تلویزیون ندارم",
                  "من فیلم دیدن رو دوست دارم",
                  "من هم تلویزیون دیدن رو دوست دارم",
                  "او هم تلویزیون دوست داره"
                ],
                "ans": 2,
                "revealZh": "我也喜欢看电视。",
                "revealPy": "Wǒ yě xǐhuan kàn diànshì."
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "wǒ gěi māma dǎ diàn huà",
                "opts": [
                  "من تلفن می‌خرم",
                  "به مامانم زنگ می‌زنم",
                  "تلفن مامانم گم شده",
                  "مامانم بهم زنگ می‌زنه"
                ],
                "ans": 1,
                "revealZh": "我给妈妈打电话。",
                "revealPy": "Wǒ gěi māma dǎ diànhuà."
              }
            ]
          },
          {
            "id": "hsk1:12_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：喂？\n王明：喂，我是王明。咪咪在吗？\n李华：她在睡觉呢。你给她打电话吧。\n王明：好，下午我再打电话。",
                "textPy": "Lǐ Huá: Wèi?\nWáng Míng: Wèi, wǒ shì Wáng Míng. Mīmī zài ma?\nLǐ Huá: Tā zài shuìjiào ne. Nǐ gěi tā dǎ diànhuà ba.\nWáng Míng: Hǎo, xiàwǔ wǒ zài dǎ diànhuà.",
                "textFa": "لی‌هوا: الو؟\nوانگ مینگ: الو، من وانگ مینگم. می‌می هست؟\nلی‌هوا: اون داره می‌خوابه. بهش زنگ بزن.\nوانگ مینگ: باشه، بعدازظهر دوباره زنگ می‌زنم.",
                "q": "咪咪 الان چه کار می‌کند؟",
                "opts": [
                  "داره تلویزیون می‌بینه",
                  "داره تلفن می‌زنه",
                  "داره درس می‌خونه",
                  "داره می‌خوابه (在睡觉呢)"
                ],
                "ans": 3
              },
              {
                "type": "reading_q",
                "textZh": "A: 你上午做什么？\nB: 我上午学习汉语。\nA: 你喜欢学汉语吗？\nB: 喜欢！我妈妈也学汉语。",
                "textPy": "A: Nǐ shàngwǔ zuò shénme?\nB: Wǒ shàngwǔ xuéxí Hànyǔ.\nA: Nǐ xǐhuan xué Hànyǔ ma?\nB: Xǐhuan! Wǒ māma yě xuéxí Hànyǔ.",
                "textFa": "A: صبح‌ها چیکار می‌کنی؟\nB: صبح چینی یاد می‌گیرم.\nA: چینی خوندن رو دوست داری؟\nB: آره! مامانم هم یاد می‌گیره.",
                "q": "مادر B چه کار می‌کند؟",
                "opts": [
                  "می‌خوابد",
                  "چینی یاد می‌گیرد",
                  "تلویزیون می‌بیند",
                  "تلفن می‌زند"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：喂？\n李华：喂，咪咪！我们下午去看电影吧？\n咪咪：好！一点钟我给你打电话。",
                "textPy": "Mīmī: Wèi?\nLǐ Huá: Wèi, Mīmī! Wǒmen xiàwǔ qù kàn diànyǐng ba?\nMīmī: Hǎo! Yì diǎn zhōng wǒ gěi nǐ dǎ diànhuà.",
                "textFa": "می‌می: الو؟\nلی‌هوا: الو می‌می! بعدازظهر بریم سینما؟\nمی‌می: باشه! ساعت یک بهت زنگ می‌زنم.",
                "q": "咪咪 ساعت چند زنگ می‌زند؟",
                "opts": [
                  "الان",
                  "بعدازظهر چهار",
                  "ساعت یک (一点)",
                  "ساعت دو"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع استمرار 在...呢، 也 و تلفن",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس سیزدهم رسیدید! این بخش تسلط شما روی استمرار، 也 و مکالمه تلفنی را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی زمان استمراری",
            "سنجش قید 也 و پیشنهاد با 吧",
            "درک شنیداری مکالمات تلفنی",
            "با پاس کردن این بخش، ایستگاه ۱۳ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:12_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «او داره تلویزیون می‌بینه» کدام است؟",
                "opts": [
                  "他看电视在呢。",
                  "他电视在看。",
                  "他在呢看电视。",
                  "他在看电视呢。"
                ],
                "ans": 3,
                "audio": "tā zài kàn diàn shì ne"
              },
              {
                "type": "choice",
                "q": "کدام واژه «تلویزیون» است؟",
                "opts": [
                  "电视 (diànshì)",
                  "电话 (diànhuà)",
                  "电脑 (diànnǎo)",
                  "电影 (diànyǐng)"
                ],
                "ans": 0,
                "audio": "diàn shì"
              },
              {
                "type": "order",
                "prompt": "جمله «می‌می داره می‌خوابه.» را مرتب کنید:",
                "tiles": [
                  "睡觉",
                  "在",
                  "咪咪",
                  "呢"
                ],
                "target": "咪咪在睡觉呢"
              },
              {
                "type": "order",
                "prompt": "جمله «به مامان زنگ بزن!» را بسازید:",
                "tiles": [
                  "打电话",
                  "妈妈",
                  "给"
                ],
                "target": "给妈妈打电话"
              }
            ]
          },
          {
            "id": "hsk1:12_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ yě zài xué xí Hàn yǔ",
                "opts": [
                  "من چینی یاد نمی‌گیرم",
                  "او هم داره یاد می‌گیره",
                  "من هم دارم چینی یاد می‌گیرم",
                  "من دوست دارم یاد بگیرم"
                ],
                "ans": 2,
                "revealZh": "我也在学习汉语。",
                "revealPy": "Wǒ yě zài xuéxí Hànyǔ."
              },
              {
                "type": "reading_q",
                "textZh": "李华：喂？\n王明：喂！你妈妈在吗？\n李华：她在睡觉呢。\n王明：好，我下午再打电话吧。",
                "textPy": "Lǐ Huá: Wèi?\nWáng Míng: Wèi! Nǐ māma zài ma?\nLǐ Huá: Tā zài shuìjiào ne.\nWáng Míng: Hǎo, wǒ xiàwǔ zài dǎ diànhuà ba.",
                "textFa": "لی‌هوا: الو؟\nوانگ مینگ: الو! مامانت هست؟\nلی‌هوا: داره می‌خوابه.\nوانگ مینگ: باشه، بعدازظهر دوباره زنگ می‌زنم.",
                "q": "چرا 王明 الان زنگ نمی‌زند؟",
                "opts": [
                  "چون 李华 نمی‌خواد",
                  "چون مادر 李华 داره می‌خوابه",
                  "چون تلفن نداره",
                  "معلوم نیست"
                ],
                "ans": 1
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
    "title": "Are these all yours?",
    "titleFa": "این‌ها همه‌اش مال توئه؟",
    "titleZh": "这些都是你的吗",
    "level": "HSK 1",
    "desc": "آموزش اشاره جمع با «这些»، قید «都»، مقدار کم با «一点儿» و صفات ظاهری",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های اشاره جمع، لباس و میوه",
        "intro": {
          "title": "آشنایی با واژه‌های اشاره جمع در درس چهاردهم",
          "lead": "در این بخش با کلمات کلیدی برای اشاره به اشیاء جمع و توصیفشان آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "东西",
              "py": "dōng xi",
              "fa": "چیز / وسایل",
              "ex": "这些东西都是我的。",
              "exPy": "Zhèxiē dōngxi dōu shì wǒde.",
              "exFa": "این‌ها همه مال من است."
            },
            {
              "hanzi": "这些",
              "py": "zhè xiē",
              "fa": "این‌ها / این چند تا",
              "ex": "这些苹果很好吃。",
              "exPy": "Zhèxiē píngguǒ hěn hǎochī.",
              "exFa": "این سیب‌ها خیلی خوشمزه‌اند."
            },
            {
              "hanzi": "都",
              "py": "dōu",
              "fa": "همه / همگی",
              "ex": "我们都是学生。",
              "exPy": "Wǒmen dōu shì xuésheng.",
              "exFa": "ما همه دانش‌آموزیم."
            },
            {
              "hanzi": "一点儿",
              "py": "yì diǎnr",
              "fa": "کمی / اندکی",
              "ex": "我要买一点儿水果。",
              "exPy": "Wǒ yào mǎi yìdiǎnr shuǐguǒ.",
              "exFa": "می‌خوام یه کم میوه بخرم."
            },
            {
              "hanzi": "苹果",
              "py": "píng guǒ",
              "fa": "سیب",
              "ex": "这个苹果很漂亮。",
              "exPy": "Zhège píngguǒ hěn piàoliang.",
              "exFa": "این سیب خیلی قشنگه."
            },
            {
              "hanzi": "衣服",
              "py": "yī fu",
              "fa": "لباس",
              "ex": "你的衣服很漂亮！",
              "exPy": "Nǐde yīfu hěn piàoliang!",
              "exFa": "لباست خیلی قشنگه!"
            },
            {
              "hanzi": "漂亮",
              "py": "piào liang",
              "fa": "زیبا / خوشگل",
              "ex": "这个商店很漂亮。",
              "exPy": "Zhège shāngdiàn hěn piàoliang.",
              "exFa": "این مغازه خیلی قشنگه."
            },
            {
              "hanzi": "回来",
              "py": "huí lái",
              "fa": "برگشتن به اینجا",
              "ex": "他十分钟以后回来。",
              "exPy": "Tā shí fēnzhōng yǐhòu huílái.",
              "exFa": "او ده دقیقه بعد برمی‌گرده."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:13_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «东西» (dōng xi) چیست؟",
                "opts": [
                  "لباس",
                  "ماشین",
                  "چیز",
                  "این‌ها"
                ],
                "ans": 2,
                "audio": "dōng xi",
                "hanzi": "东西",
                "pinyin": "dōng xi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «一点儿» (yì diǎnr) چیست؟",
                "opts": [
                  "بعد",
                  "کمی",
                  "دقیقه",
                  "لباس"
                ],
                "ans": 1,
                "audio": "yì diǎnr",
                "hanzi": "一点儿",
                "pinyin": "yì diǎnr"
              },
              {
                "type": "choice",
                "q": "معنی واژه «苹果» (píng guǒ) چیست؟",
                "opts": [
                  "دیدن (مشمول‌الرؤیه)",
                  "این‌ها",
                  "سیب",
                  "دقیقه"
                ],
                "ans": 2,
                "audio": "píng guǒ",
                "hanzi": "苹果",
                "pinyin": "píng guǒ"
              },
              {
                "type": "choice",
                "q": "معنی واژه «回来» (huí lái) چیست؟",
                "opts": [
                  "چیز",
                  "برگشتن",
                  "دیدن (مشمول‌الرؤیه)",
                  "دقیقه"
                ],
                "ans": 1,
                "audio": "huí lái",
                "hanzi": "回来",
                "pinyin": "huí lái"
              }
            ]
          },
          {
            "id": "hsk1:13_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "东西",
                    "fa": "چیز"
                  },
                  {
                    "zh": "一点儿",
                    "fa": "کمی"
                  },
                  {
                    "zh": "苹果",
                    "fa": "سیب"
                  },
                  {
                    "zh": "看见",
                    "fa": "دیدن (مشمول‌الرؤیه)"
                  },
                  {
                    "zh": "先生",
                    "fa": "آقا"
                  },
                  {
                    "zh": "开",
                    "fa": "روشن کردن"
                  },
                  {
                    "zh": "车",
                    "fa": "ماشین"
                  },
                  {
                    "zh": "回来",
                    "fa": "برگشتن"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "分钟",
                    "fa": "دقیقه"
                  },
                  {
                    "zh": "后",
                    "fa": "بعد"
                  },
                  {
                    "zh": "衣服",
                    "fa": "لباس"
                  },
                  {
                    "zh": "漂亮",
                    "fa": "زیبا"
                  },
                  {
                    "zh": "啊",
                    "fa": "ذره تعجب"
                  },
                  {
                    "zh": "少",
                    "fa": "کم"
                  },
                  {
                    "zh": "这些",
                    "fa": "این‌ها"
                  },
                  {
                    "zh": "都",
                    "fa": "همه"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:13_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "果",
                "py": "guǒ",
                "fa": "میوه",
                "tip": "کاراکتر «果» میوه روی درخت است؛ در «苹果» سیب و «水果» میوه."
              },
              {
                "type": "write",
                "char": "车",
                "py": "chē",
                "fa": "ماشین / وسیله",
                "tip": "کاراکتر «车» چرخ و بدنه عرابه است؛ در «出租车» تاکسی."
              },
              {
                "type": "write",
                "char": "衣",
                "py": "yī",
                "fa": "لباس",
                "tip": "کاراکتر «衣» شکل لباس با یقه است؛ رادیکال واژه‌های پوشیدنی."
              }
            ]
          },
          {
            "id": "hsk1:13_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «این‌ها همه مال توست؟» را بسازید:",
                "tiles": [
                  "你的",
                  "吗",
                  "都",
                  "这些",
                  "东西",
                  "是"
                ],
                "target": "这些东西都是你的吗"
              },
              {
                "type": "order",
                "prompt": "جمله «این سیب‌ها خیلی خوشمزه‌اند.» را بسازید:",
                "tiles": [
                  "苹果",
                  "很好吃",
                  "这些"
                ],
                "target": "这些苹果很好吃"
              },
              {
                "type": "order",
                "prompt": "جمله «ما همه دانش‌آموزیم.» را بسازید:",
                "tiles": [
                  "学生",
                  "都",
                  "我们",
                  "是"
                ],
                "target": "我们都是学生"
              }
            ]
          },
          {
            "id": "hsk1:13_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«这些东西都是你的吗？» یعنی چه؟",
                "opts": [
                  "این وسایل مال کیه؟",
                  "این وسایل همه مال توست؟",
                  "تو چی خریدی؟",
                  "چندتا وسایل داری؟"
                ],
                "ans": 1,
                "audio": "zhè xiē dōngxi dōu shì nǐde ma"
              },
              {
                "type": "choice",
                "q": "«都» کجای جمله می‌آید؟",
                "opts": [
                  "بعد از فاعل و قبل از فعل/صفت",
                  "فقط در سؤال‌ها",
                  "همیشه انتهای جمله",
                  "قبل از فاعل"
                ],
                "ans": 0,
                "audio": "dōu"
              },
              {
                "type": "choice",
                "q": "«你的衣服很漂亮» یعنی چه؟",
                "opts": [
                  "لباس من قشنگه",
                  "لباست خیلی قشنگه",
                  "لباست خیلی گرونه",
                  "او لباس دارد"
                ],
                "ans": 1,
                "audio": "nǐde yīfu hěn piàoliang"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (去)",
        "titleZh": "去",
        "icon": "sliders-horizontal",
        "desc": "زبان چینی کارها را به همان ترتیبی که اتفاق می‌افتند کنار هم می‌چیند.",
        "intro": {
          "title": "آموزش گرامر: 去‏ + مکان + کار · رفتن برای انجام کاری",
          "lead": "زبان چینی کارها را به همان ترتیبی که اتفاق می‌افتند کنار هم می‌چیند.",
          "rule": "去‏ + مکان + کار · رفتن برای انجام کاری",
          "mark": "去",
          "pattern": "Subject + 去 / 来 + place + verb (+ object)",
          "explain": "ابتدا جایی می‌روید، سپس آنجا کاری انجام می‌دهید، و جمله همین ترتیب را بازمی‌گوید: 我去商店买东西‏. نیازی به واژه‌ای برای «به» یا «برای اینکه» نیست.",
          "mistake": "✗ 我买水果去商店。 → ✓ 我去商店买水果。",
          "compare": [
            {
              "w": "去",
              "gloss": "away from here",
              "ex": "去商店买书"
            },
            {
              "w": "来",
              "gloss": "towards here",
              "ex": "来我家喝茶"
            }
          ],
          "examples": [
            {
              "ch": "我去商店买水果。",
              "py": "wǒ qù shāngdiàn mǎi shuǐguǒ.",
              "en": "I'm going to the shop to buy fruit.",
              "fa": "I'm going to the shop to buy fruit."
            },
            {
              "ch": "他来中国学习汉语。",
              "py": "tā lái Zhōngguó xuéxí Hànyǔ.",
              "en": "He came to China to study Chinese.",
              "fa": "He came to China to study Chinese."
            },
            {
              "ch": "我们去商店买东西吧。",
              "py": "wǒmen qù shāngdiàn mǎi dōngxi ba.",
              "en": "Let's go to the shop and buy some things.",
              "fa": "Let's go to the shop and buy some things."
            }
          ],
          "points": [
            "الگوی ساختاری: Subject + 去 / 来 + place + verb (+ object)",
            "توضیح قاعده: ابتدا جایی می‌روید، سپس آنجا کاری انجام می‌دهید، و جمله همین ترتیب را بازمی‌گوید: 我去商店买东西‏. نیازی به واژه‌ای برای «به» یا «برای اینکه» نیست.",
            "اشتباه رایج: ✗ 我买水果去商店。 → ✓ 我去商店买水果。"
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_qu-do",
            "num": 1,
            "title": "آموزش و آزمون گرامر 去",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی 去‏ + مکان + کار · رفتن برای انجام کاری",
            "exercises": [
              {
                "type": "gram",
                "id": "qu-do",
                "mark": "去",
                "rule": "去‏ + مکان + کار · رفتن برای انجام کاری",
                "titleFa": "去‏ + مکان + کار · رفتن برای انجام کاری",
                "catFa": "ساختار جمله",
                "formula": "Subject + 去 / 来 + place + verb (+ object)",
                "pattern": "Subject + 去 / 来 + place + verb (+ object)",
                "desc": "زبان چینی کارها را به همان ترتیبی که اتفاق می‌افتند کنار هم می‌چیند.",
                "oneLine": "زبان چینی کارها را به همان ترتیبی که اتفاق می‌افتند کنار هم می‌چیند.",
                "explain": "ابتدا جایی می‌روید، سپس آنجا کاری انجام می‌دهید، و جمله همین ترتیب را بازمی‌گوید: 我去商店买东西‏. نیازی به واژه‌ای برای «به» یا «برای اینکه» نیست.",
                "mistake": "✗ 我买水果去商店。 → ✓ 我去商店买水果。",
                "compare": [
                                {
                                                "w": "去",
                                                "gloss": "away from here",
                                                "glossFa": "رفتن (دور شدن از گوینده)",
                                                "ex": "去商店买书"
                                },
                                {
                                                "w": "来",
                                                "gloss": "towards here",
                                                "glossFa": "آمدن (نزدیک شدن به گوینده)",
                                                "ex": "来我家喝茶"
                                }
                ],
                "examples": [
                                {
                                                "ch": "我去商店买水果。",
                                                "py": "wǒ qù shāngdiàn mǎi shuǐguǒ.",
                                                "en": "I'm going to the shop to buy fruit.",
                                                "fa": "می‌روم فروشگاه تا میوه بخرم."
                                },
                                {
                                                "ch": "他来中国学习汉语。",
                                                "py": "tā lái Zhōngguó xuéxí Hànyǔ.",
                                                "en": "He came to China to study Chinese.",
                                                "fa": "او به چین آمد تا زبان چینی بخواند."
                                },
                                {
                                                "ch": "我们去商店买东西吧。",
                                                "py": "wǒmen qù shāngdiàn mǎi dōngxi ba.",
                                                "en": "Let's go to the shop and buy some things.",
                                                "fa": "بیا برویم فروشگاه تا خرید کنیم."
                                }
                ],
                "ex": "我去商店买水果。",
                "exPy": "wǒ qù shāngdiàn mǎi shuǐguǒ.",
                "exFa": "I'm going to the shop to buy fruit."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我在家，你__我家喝茶吧。",
                "opts": [
                  "来",
                  "去",
                  "是"
                ],
                "ans": 0,
                "tip": "آمدن به سمت گوینده 来‏ می‌گیرد؛ مکان قبل از کاری که آنجا می‌کنید می‌آید.",
                "exFa": "من در خانه‌ام - بیا پیش من برای چای."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我想去北京学习汉语",
                "tiles": [
                  "我",
                  "想",
                  "去",
                  "北京",
                  "学习",
                  "汉语"
                ],
                "en": "می‌خواهم به پکن بروم تا چینی بخوانم.",
                "tip": "اول بروید جایی، سپس بگویید آنجا چه می‌کنید.",
                "py": "wǒ xiǎng qù Běi jīng xué xí Hàn yǔ",
                "pinyin": "wǒ xiǎng qù Běi jīng xué xí Hàn yǔ"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我朋友来我家吃中国菜。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "来‏ + مکان + کار، به همان ترتیبی که اتفاق می‌افتد.",
                "exFa": "دوستم می‌آید خانه‌ی من تا غذای چینی بخورد."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n妈妈看医生去医院。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "ابتدا رفتن می‌آید، سپس آنچه آنجا می‌کنید. (جمله صحیح: 妈妈去医院看医生。)",
                "exFa": "مامان دارد می‌رود بیمارستان تا دکتر ببیند."
              },
              {
                "type": "choice",
                "q": "کلمه «去» باید در کدام جایگاه قرار گیرد؟\n[A] 明天 [B] 我 [C] 饭店 [D] 吃 [E] 中国菜。 [F]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]",
                  "جایگاه [F]"
                ],
                "ans": 2,
                "tip": "去‏ + مکان قبل از کاری که آنجا انجام می‌شود می‌آید.",
                "exFa": "فردا می‌روم رستوران تا غذای چینی بخورم."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و قانون تغییر تُن 一 در 一点儿",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس (قانون 一): واژه «一» معمولاً تُن ۱ دارد (yī)، اما قبل از تُن ۳ به yì تبدیل می‌شود: 一点儿 → yì diǎnr! و «东西» هجای دوم خنثی است."
        },
        "miniLessons": [
          {
            "id": "hsk1:13_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "kāi",
                "pinyin": "kāi",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "piào",
                "pinyin": "piào",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "shǎo",
                "pinyin": "shǎo",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 2
              }
            ]
          },
          {
            "id": "hsk1:13_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «piàoliang» (زیبا) را پخش می‌کند؟",
                "audio": "piàoliang",
                "opts": [
                  "biàoliang",
                  "piàoliang (漂亮 — زیبا)",
                  "piào (تُن ۴)",
                  "piāoliang"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «yīfu» (لباس) است؟",
                "audio": "yīfu",
                "opts": [
                  "yī diǎnr (一点儿 — کمی)",
                  "yīfu (衣服 — لباس)",
                  "yīyuàn (医院 — بیمارستان)",
                  "yīshēng (医生 — پزشک)"
                ],
                "ans": 1
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «dōngxi» (چیز) است؟",
                "audio": "dōngxi",
                "opts": [
                  "dòng (تُن ۴)",
                  "dōng (شرق)",
                  "dōngtiān (زمستان)",
                  "dōngxi (东西 — چیز)"
                ],
                "ans": 3
              }
            ]
          },
          {
            "id": "hsk1:13_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در «一点儿» واژه 一 چگونه ادا می‌شود؟",
                "opts": [
                  "yì — قبل از تُن ۳ به yì تبدیل می‌شود",
                  "yí — به تُن ۲ تبدیل می‌شود",
                  "yī — تُن ۱ می‌ماند",
                  "خنثی می‌شود"
                ],
                "ans": 0,
                "audio": "yìdiǎnr"
              },
              {
                "type": "choice",
                "q": "در «东西» هجای دوم چگونه است؟",
                "opts": [
                  "xǐ با تُن ۳",
                  "xī با تُن ۱",
                  "xi تُن خنثی و سبک",
                  "xì با تُن ۴"
                ],
                "ans": 2,
                "audio": "dōngxi"
              }
            ]
          },
          {
            "id": "hsk1:13_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "这些东西都是你的吗",
                "py": "zhè xiē dōngxi dōu shì nǐde ma",
                "fa": "این وسایل همه مال توست؟",
                "tip": "东西 با xi خنثی؛ 都 با تُن ۱ یکنواخت."
              },
              {
                "type": "repeat",
                "target": "这些苹果很好吃",
                "py": "zhè xiē píng guǒ hěn hǎo chī",
                "fa": "این سیب‌ها خیلی خوشمزه‌اند",
                "tip": "苹果 با تُن ۲ + تُن ۳؛ 很好 را hén hǎo بخوانید."
              },
              {
                "type": "repeat",
                "target": "你的衣服很漂亮",
                "py": "nǐde yīfu hěn piàoliang",
                "fa": "لباست خیلی قشنگه",
                "tip": "漂亮 را piào liang با liang خنثی بخوانید."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «zhèxiē» و «dōu» گوش کنید: اشاره جمع.",
            "۲. تعریف‌های زیبایی (很漂亮) را پیدا کنید.",
            "۳. به مقدارها (一点儿/很多) دقت کنید.",
            "۴. وسایل روی میزتان را با 这些 توصیف کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:13_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "zhè xiē dōngxi dōu shì nǐde ma",
                "opts": [
                  "تو چندتا وسایل داری؟",
                  "این وسایل مال کیه؟",
                  "این وسایل همه مال توست؟",
                  "چی خریدی؟"
                ],
                "ans": 2,
                "revealZh": "这些东西都是你的吗？",
                "revealPy": "Zhèxiē dōngxi dōu shì nǐde ma?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "zhè xiē píng guǒ hěn piàoliang",
                "opts": [
                  "می‌خوام یه‌کم سیب",
                  "این سیب‌ها خیلی قشنگ‌اند",
                  "این سیب‌ها خیلی خوشمزه‌اند",
                  "سیب‌های تو کجاست؟"
                ],
                "ans": 1,
                "revealZh": "这些苹果很漂亮。",
                "revealPy": "Zhèxiē píngguǒ hěn piàoliang."
              },
              {
                "type": "listening_q",
                "prompt": "کدام جمله را شنیدید؟",
                "audio": "wǒ mǎi yìdiǎnr shuǐ guǒ",
                "opts": [
                  "میوه نمی‌خرم",
                  "میوه‌ها همه مال منه",
                  "خیلی میوه می‌خرم",
                  "یه‌کم میوه می‌خرم"
                ],
                "ans": 3,
                "revealZh": "我买一点儿水果。",
                "revealPy": "Wǒ mǎi yìdiǎnr shuǐguǒ."
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "tā shí fēn zhōng yǐ hòu huí lái",
                "opts": [
                  "او ساعت ده برمی‌گرده",
                  "او ده دقیقه قبل رفت",
                  "من ده دقیقه بعد برمی‌گردم",
                  "او ده دقیقه بعد برمی‌گرده"
                ],
                "ans": 3,
                "revealZh": "他十分钟以后回来。",
                "revealPy": "Tā shí fēnzhōng yǐhòu huílái."
              }
            ]
          },
          {
            "id": "hsk1:13_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "先生：这些东西都是你的吗？\n咪咪：不，只有一点儿是我的。那些衣服是我朋友的。\n先生：啊，你的衣服很漂亮！",
                "textPy": "Xiānsheng: Zhèxiē dōngxi dōu shì nǐde ma?\nMīmī: Bú, zhǐyǒu yìdiǎnr shì wǒde. Nàxiē yīfu shì wǒ péngyou de.\nXiānsheng: A, nǐde yīfu hěn piàoliang!",
                "textFa": "آقا: این وسایل همه مال شماست؟\nمی‌می: نه، فقط یه‌کمش مال منه. اون لباس‌ها مال دوستمه.\nآقا: آه، لباس‌تون خیلی قشنگه!",
                "q": "چه چیزی مال 咪咪 است؟",
                "opts": [
                  "اون لباس‌ها",
                  "یه‌کم از وسایل (一点儿东西)",
                  "هیچی",
                  "همه وسایل"
                ],
                "ans": 1
              },
              {
                "type": "reading_q",
                "textZh": "A: 你看见我的车了吗？\nB: 看见了，车在商店前面。\nA: 谢谢！我十分钟以后回来。",
                "textPy": "A: Nǐ kànjiàn wǒde chē le ma?\nB: Kànjiàn le, chē zài shāngdiàn qiánmiàn.\nA: Xièxie! Wǒ shí fēnzhōng yǐhòu huílái.",
                "textFa": "A: ماشینم رو دیدی؟\nB: دیدم، ماشین جلوی مغازه‌ست.\nA: ممنون! ده دقیقه بعد برمی‌گردم.",
                "q": "ماشین کجاست؟",
                "opts": [
                  "داخل خانه",
                  "داخل مغازه",
                  "جلوی مغازه (商店前面)",
                  "پشت مغازه"
                ],
                "ans": 2
              },
              {
                "type": "reading_q",
                "textZh": "李华：这些苹果都是你的吗？\n王明：都是我的。你要一点儿吗？\n李华：好，我要一点儿。苹果很漂亮！",
                "textPy": "Lǐ Huá: Zhèxiē píngguǒ dōu shì nǐde ma?\nWáng Míng: Dōu shì wǒde. Nǐ yào yìdiǎnr ma?\nLǐ Huá: Hǎo, wǒ yào yìdiǎnr. Píngguǒ hěn piàoliang!",
                "textFa": "لی‌هوا: این سیب‌ها همه مال توئه؟\nوانگ مینگ: همه مال من. یه‌کم می‌خوای؟\nلی‌هوا: باشه، یه‌کم می‌خوام. سیب‌ها خیلی قشنگ‌اند!",
                "q": "王明 سیب‌ها را کجا داشت؟",
                "opts": [
                  "مال دوستش بود",
                  "خریده بود برای 李华",
                  "همه مال خودش بود",
                  "معلوم نیست"
                ],
                "ans": 2
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 这些، 都 و 一点儿",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس چهاردهم رسیدید! این بخش تسلط شما روی اشاره جمع و مقدار را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی 这些/那些 و 都",
            "سنجش مقدار با 一点儿 و 少",
            "درک شنیداری مکالمات اشیاء",
            "با پاس کردن این بخش، ایستگاه ۱۴ کامل می‌شود!"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:13_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «این‌ها همه مال من است» کدام است؟",
                "opts": [
                  "这些是都我的。",
                  "这些都是我的。",
                  "这些都我的是。",
                  "这些都是我吗。"
                ],
                "ans": 1,
                "audio": "zhè xiē dōu shì wǒde"
              },
              {
                "type": "choice",
                "q": "کدام واژه «سیب» است؟",
                "opts": [
                  "东西 (dōngxi)",
                  "水果 (shuǐguǒ)",
                  "衣服 (yīfu)",
                  "苹果 (píngguǒ)"
                ],
                "ans": 3,
                "audio": "píng guǒ"
              },
              {
                "type": "order",
                "prompt": "سؤال «این وسایل همه مال توست؟» را مرتب کنید:",
                "tiles": [
                  "你的",
                  "吗",
                  "都",
                  "这些",
                  "东西",
                  "是"
                ],
                "target": "这些东西都是你的吗"
              },
              {
                "type": "order",
                "prompt": "جمله «ما همه چینیهستیم.» را بسازید:",
                "tiles": [
                  "中国",
                  "人",
                  "都",
                  "我们",
                  "是"
                ],
                "target": "我们都是中国人"
              }
            ]
          },
          {
            "id": "hsk1:13_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ yào mǎi yìdiǎnr dōngxi",
                "opts": [
                  "می‌خوام لباس بخرم",
                  "می‌خوام همه چیزها رو بخرم",
                  "می‌خوام یه‌کم چیز بخرم",
                  "این‌ها مال منه"
                ],
                "ans": 2,
                "revealZh": "我要买一点儿东西。",
                "revealPy": "Wǒ yào mǎi yìdiǎnr dōngxi."
              },
              {
                "type": "reading_q",
                "textZh": "先生：这些衣服都是你的吗？\n李华：不，都是我朋友的。我的衣服很少。\n先生：啊，你的朋友的衣服很漂亮！",
                "textPy": "Xiānsheng: Zhèxiē yīfu dōu shì nǐde ma?\nLǐ Huá: Bú, dōu shì wǒ péngyou de. Wǒde yīfu hěn shǎo.\nXiānsheng: A, nǐ péngyou de yīfu hěn piàoliang!",
                "textFa": "آقا: این لباس‌ها همه مال توست؟\nلی‌هوا: نه، همه مال دوستمه. لباس‌های من کمه.\nآقا: آه، لباس‌های دوستت خیلی قشنگه!",
                "q": "لباس‌های 李华 چقدر است؟",
                "opts": [
                  "خیلی زیاد",
                  "همه این‌ها",
                  "معلوم نیست",
                  "کم (很少)"
                ],
                "ans": 3
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
    "title": "Did you come by taxi?",
    "titleFa": "با تاکسی اومدی؟",
    "titleZh": "你是坐出租车来的吗",
    "level": "HSK 1",
    "desc": "آموزش ساختار تأکیدی «是...的»، شناختن با «认识» و رفتن با هم «一起»",
    "sections": [
      {
        "id": "vocab",
        "num": 1,
        "title": "Vocabulary",
        "titleFa": "واژگان",
        "titleZh": "生词",
        "icon": "book-open",
        "desc": "آموزش و تثبیت واژه‌های سفر، دانشگاه و احساس خوشحالی",
        "intro": {
          "title": "آشنایی با واژه‌های سفر و آشنایی در درس پانزدهم",
          "lead": "در این بخش با کلمات کلیدی برای گفتن نحوه رفتن و شناختن آشنا می‌شوید:",
          "words": [
            {
              "hanzi": "认识",
              "py": "rèn shi",
              "fa": "شناختن / آشنا بودن",
              "ex": "我认识他。",
              "exPy": "Wǒ rènshi tā.",
              "exFa": "من اونو می‌شناسم."
            },
            {
              "hanzi": "大学",
              "py": "dà xué",
              "fa": "دانشگاه",
              "ex": "我在大学学习汉语。",
              "exPy": "Wǒ zài dàxué xuéxí Hànyǔ.",
              "exFa": "من دانشگاه چینی یاد می‌گیرم."
            },
            {
              "hanzi": "出租车",
              "py": "chū zū chē",
              "fa": "تاکسی",
              "ex": "我们坐出租车去饭店。",
              "exPy": "Wǒmen zuò chūzūchē qù fàndiàn.",
              "exFa": "با تاکسی می‌ریم رستوران."
            },
            {
              "hanzi": "飞机",
              "py": "fēi jī",
              "fa": "هواپیما",
              "ex": "他坐飞机来北京。",
              "exPy": "Tā zuò fēijī lái Běijīng.",
              "exFa": "او با هواپیما به پکن میاد."
            },
            {
              "hanzi": "一起",
              "py": "yì qǐ",
              "fa": "با هم / یکجا",
              "ex": "我们一起去饭店吧！",
              "exPy": "Wǒmen yìqǐ qù fàndiàn ba!",
              "exFa": "با هم بریم رستوران!"
            },
            {
              "hanzi": "高兴",
              "py": "gāo xìng",
              "fa": "خوشحال",
              "ex": "我很高兴认识你！",
              "exPy": "Wǒ hěn gāoxìng rènshi nǐ!",
              "exFa": "از آشنایی با تو خیلی خوشحالم!"
            },
            {
              "hanzi": "听",
              "py": "tīng",
              "fa": "شنیدن / گوش دادن",
              "ex": "我喜欢听汉语歌。",
              "exPy": "Wǒ xǐhuan tīng Hànyǔ gē.",
              "exFa": "من دوست دارم آهنگ چینی گوش کنم."
            },
            {
              "hanzi": "年",
              "py": "nián",
              "fa": "سال",
              "ex": "我学了两年汉语。",
              "exPy": "Wǒ xuéle liǎng nián Hànyǔ.",
              "exFa": "دو سال چینی خوندم."
            }
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:14_v1",
            "num": 1,
            "title": "تشخیص معنی لغات",
            "desc": "سنجش درک مفهوم کاراکترها و ترجمه فارسی",
            "exercises": [
              {
                "type": "choice",
                "q": "معنی واژه «认识» (rèn shi) چیست؟",
                "opts": [
                  "تاکسی",
                  "با هم",
                  "شناختن",
                  "دانشگاه"
                ],
                "ans": 2,
                "audio": "rèn shi",
                "hanzi": "认识",
                "pinyin": "rèn shi"
              },
              {
                "type": "choice",
                "q": "معنی واژه «年» (nián) چیست؟",
                "opts": [
                  "تاکسی",
                  "سال",
                  "هواپیما",
                  "رستوران"
                ],
                "ans": 1,
                "audio": "nián",
                "hanzi": "年",
                "pinyin": "nián"
              },
              {
                "type": "choice",
                "q": "معنی واژه «大学» (dà xué) چیست؟",
                "opts": [
                  "شناختن",
                  "شنیدن",
                  "دانشگاه",
                  "خوشحال"
                ],
                "ans": 2,
                "audio": "dà xué",
                "hanzi": "大学",
                "pinyin": "dà xué"
              },
              {
                "type": "choice",
                "q": "معنی واژه «出租车» (chū zū chē) چیست؟",
                "opts": [
                  "تاکسی",
                  "خوشحال",
                  "سال",
                  "شناختن"
                ],
                "ans": 0,
                "audio": "chū zū chē",
                "hanzi": "出租车",
                "pinyin": "chū zū chē"
              }
            ]
          },
          {
            "id": "hsk1:14_v2",
            "num": 2,
            "title": "تطبیق لغت و معنی",
            "desc": "جفت کردن واژه‌های چینی با ترجمه مناسب",
            "exercises": [
              {
                "type": "match",
                "title": "کلمات چینی را به معنی فارسی متصل کنید:",
                "pairs": [
                  {
                    "zh": "认识",
                    "fa": "شناختن"
                  },
                  {
                    "zh": "年",
                    "fa": "سال"
                  },
                  {
                    "zh": "大学",
                    "fa": "دانشگاه"
                  },
                  {
                    "zh": "饭店",
                    "fa": "رستوران"
                  }
                ]
              },
              {
                "type": "match",
                "title": "کلمات چینی زیر را با معنی متناظر جفت کنید:",
                "pairs": [
                  {
                    "zh": "出租车",
                    "fa": "تاکسی"
                  },
                  {
                    "zh": "一起",
                    "fa": "با هم"
                  },
                  {
                    "zh": "高兴",
                    "fa": "خوشحال"
                  },
                  {
                    "zh": "听",
                    "fa": "شنیدن"
                  }
                ]
              }
            ]
          },
          {
            "id": "hsk1:14_v4",
            "num": 4,
            "title": "نوشتن کاراکتر (Hanzi)",
            "desc": "آشنایی با خطوط قلم و رسم کاراکترهای پایه",
            "exercises": [
              {
                "type": "write",
                "char": "飞",
                "py": "fēi",
                "fa": "پرواز کردن",
                "tip": "کاراکتر «飞» بال پرنده را نشان می‌دهد؛ در «飞机» یعنی هواپیما."
              },
              {
                "type": "write",
                "char": "高",
                "py": "gāo",
                "fa": "بلند / بالا",
                "tip": "کاراکتر «高» برج با سقف است؛ در «高兴» یعنی بالا بودن روحیه."
              },
              {
                "type": "write",
                "char": "车",
                "py": "chē",
                "fa": "ماشین / وسیله",
                "tip": "کاراکتر «车» چرخ و بدنه عرابه است؛ در «出租车» تاکسی."
              }
            ]
          },
          {
            "id": "hsk1:14_v5",
            "num": 5,
            "title": "جمله‌سازی با لغات",
            "desc": "چیدمان کلمات برای ساخت جملات این درس",
            "exercises": [
              {
                "type": "order",
                "prompt": "سؤال «با تاکسی اومدی؟» را بسازید:",
                "tiles": [
                  "来的",
                  "是",
                  "出租车",
                  "坐",
                  "你"
                ],
                "target": "你是坐出租车来的"
              },
              {
                "type": "order",
                "prompt": "جمله «از آشنایی با تو خیلی خوشحالم!» را بسازید:",
                "tiles": [
                  "认识",
                  "你",
                  "很高兴",
                  "我"
                ],
                "target": "我很高兴认识你"
              },
              {
                "type": "order",
                "prompt": "جمله «با هم بریم رستوران!» را بسازید:",
                "tiles": [
                  "去",
                  "一起",
                  "饭店",
                  "我们",
                  "吧"
                ],
                "target": "我们一起去饭店吧"
              }
            ]
          },
          {
            "id": "hsk1:14_v6",
            "num": 6,
            "title": "مرور جامع واژگان",
            "desc": "ارزیابی نهایی لغات قبل از ورود به بخش گرامر",
            "exercises": [
              {
                "type": "choice",
                "q": "«你是坐出租车来的吗？» یعنی چه؟",
                "opts": [
                  "با هواپیما اومدی؟",
                  "تاکسی کجاست؟",
                  "با تاکسی اومدی؟",
                  "تاکسی داری؟"
                ],
                "ans": 2,
                "audio": "nǐ shì zuò chū zū chē láide ma"
              },
              {
                "type": "choice",
                "q": "«我很高兴认识你» کجا استفاده می‌شود؟",
                "opts": [
                  "وقتی آشنا می‌شویم و سلام می‌کنیم",
                  "وقتی تشکر می‌کنیم",
                  "وقتی عذرخواهی می‌کنیم",
                  "وقتی خداحافظی می‌کنیم"
                ],
                "ans": 0,
                "audio": "wǒ hěn gāo xìng rènshi nǐ"
              },
              {
                "type": "choice",
                "q": "«我们一起去吧» یعنی چه؟",
                "opts": [
                  "چرا نرفتی؟",
                  "با هم بریم!",
                  "من می‌روم، تو نمی‌روی",
                  "فردا می‌رویم"
                ],
                "ans": 1,
                "audio": "wǒ men yì qǐ qù ba"
              }
            ]
          }
        ]
      },
      {
        "id": "grammar",
        "num": 2,
        "title": "Grammar",
        "titleFa": "دستور زبان (个)",
        "titleZh": "个",
        "icon": "sliders-horizontal",
        "desc": "بین عدد (یا 这‏ / 那‏) و اسم همیشه یک واژهٔ شمارش هست.",
        "intro": {
          "title": "آموزش گرامر: واژه‌های شمارش · 一个人‏",
          "lead": "بین عدد (یا 这‏ / 那‏) و اسم همیشه یک واژهٔ شمارش هست.",
          "rule": "واژه‌های شمارش · 一个人‏",
          "mark": "个",
          "pattern": "Number / 这 / 那 + measure + noun",
          "explain": "نمی‌توانید بگویید 一书‏ — باید 一本书‏ باشد. 个‏ واژهٔ عمومی است و برای افراد و چیزهای فراوان به کار می‌رود؛ 本‏ برای کتاب‌ها است، 块‏ برای پول. 这‏ و 那‏ هم واژهٔ شمارش می‌گیرند: 这个‏, 那本书‏.",
          "mistake": "✗ 我有三朋友‏。 → ✓ 我有三个朋友‏。 و پیش از واژهٔ شمارش 两‏ می‌آید، نه 二‏: 两本书‏.",
          "compare": [],
          "examples": [
            {
              "ch": "我有三个朋友。",
              "py": "wǒ yǒu sān ge péngyou.",
              "en": "I have three friends.",
              "fa": "I have three friends."
            },
            {
              "ch": "我想买两本书。",
              "py": "wǒ xiǎng mǎi liǎng běn shū.",
              "en": "I want to buy two books.",
              "fa": "I want to buy two books."
            },
            {
              "ch": "那个人是我老师。",
              "py": "nàge rén shì wǒ lǎoshī.",
              "en": "That person is my teacher.",
              "fa": "That person is my teacher."
            }
          ],
          "points": [
            "الگوی ساختاری: Number / 这 / 那 + measure + noun",
            "توضیح قاعده: نمی‌توانید بگویید 一书‏ — باید 一本书‏ باشد. 个‏ واژهٔ عمومی است و برای افراد و چیزهای فراوان به کار می‌رود؛ 本‏ برای کتاب‌ها است، 块‏ برای پول. 这‏ و 那‏ هم واژهٔ شمارش می‌گیرند: 这个‏, 那本书‏.",
            "اشتباه رایج: ✗ 我有三朋友‏。 → ✓ 我有三个朋友‏。 و پیش از واژهٔ شمارش 两‏ می‌آید، نه 二‏: 两本书‏."
          ]
        },
        "miniLessons": [
          {
            "id": "g_prac_measure",
            "num": 1,
            "title": "آموزش و آزمون گرامر 个",
            "desc": "یادگیری کامل قاعده و ۵ تمرین تعاملی واژه‌های شمارش · 一个人‏",
            "exercises": [
              {
                "type": "gram",
                "id": "measure",
                "mark": "个",
                "rule": "واژه‌های شمارش · 一个人‏",
                "titleFa": "واژه‌های شمارش · 一个人‏",
                "catFa": "دستور زبان",
                "formula": "Number / 这 / 那 + measure + noun",
                "pattern": "Number / 这 / 那 + measure + noun",
                "desc": "بین عدد (یا 这‏ / 那‏) و اسم همیشه یک واژهٔ شمارش هست.",
                "oneLine": "بین عدد (یا 这‏ / 那‏) و اسم همیشه یک واژهٔ شمارش هست.",
                "explain": "نمی‌توانید بگویید 一书‏ — باید 一本书‏ باشد. 个‏ واژهٔ عمومی است و برای افراد و چیزهای فراوان به کار می‌رود؛ 本‏ برای کتاب‌ها است، 块‏ برای پول. 这‏ و 那‏ هم واژهٔ شمارش می‌گیرند: 这个‏, 那本书‏.",
                "mistake": "✗ 我有三朋友‏。 → ✓ 我有三个朋友‏。 و پیش از واژهٔ شمارش 两‏ می‌آید، نه 二‏: 两本书‏.",
                "compare": [],
                "examples": [
                                {
                                                "ch": "我有三个朋友。",
                                                "py": "wǒ yǒu sān ge péngyou.",
                                                "en": "I have three friends.",
                                                "fa": "من سه تا دوست دارم."
                                },
                                {
                                                "ch": "我想买两本书。",
                                                "py": "wǒ xiǎng mǎi liǎng běn shū.",
                                                "en": "I want to buy two books.",
                                                "fa": "می‌خواهم دو جلد کتاب بخرم."
                                },
                                {
                                                "ch": "那个人是我老师。",
                                                "py": "nàge rén shì wǒ lǎoshī.",
                                                "en": "That person is my teacher.",
                                                "fa": "آن شخص معلم من است."
                                }
                ],
                "ex": "我有三个朋友。",
                "exPy": "wǒ yǒu sān ge péngyou.",
                "exFa": "I have three friends."
},
              {
                "type": "choice",
                "q": "جای خالی را با کلمه مناسب کامل کنید:\n我想买两__书。",
                "opts": [
                  "本",
                  "个",
                  "块"
                ],
                "ans": 0,
                "tip": "کتاب‌ها واژه‌ی شمارا 本‏ می‌گیرند.",
                "exFa": "می‌خواهم دو کتاب بخرم."
              },
              {
                "type": "order",
                "title": "کلمات زیر را برای ساختن جمله مرتب کنید:",
                "target": "我有两个中国朋友",
                "tiles": [
                  "我",
                  "有",
                  "两",
                  "个",
                  "中国",
                  "朋友"
                ],
                "en": "من دو دوست چینی دارم.",
                "tip": "عدد + واژه شمارا + اسم: 两个中国朋友‏.",
                "py": "wǒ yǒu liǎng gè Zhōng guó péng you",
                "pinyin": "wǒ yǒu liǎng gè Zhōng guó péng you"
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n那个杯子三块钱。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 0,
                "tip": "那‏ هم به واژه شمارا نیاز دارد: 那个杯子‏.",
                "exFa": "آن لیوان سه یوان است."
              },
              {
                "type": "choice",
                "q": "آیا این جمله از نظر گرامری درست است؟\n我想买这书。",
                "opts": [
                  "درست (✓)",
                  "نادرست (✗)"
                ],
                "ans": 1,
                "tip": "这‏ قبل از اسم به واژه شمارا نیاز دارد: 这本书‏. (جمله صحیح: 我想买这本书。)",
                "exFa": "می‌خواهم این کتاب را بخرم."
              },
              {
                "type": "choice",
                "q": "کلمه «个» باید در کدام جایگاه قرار گیرد؟\n[A] 这 [B] 人 [C] 是 [D] 我朋友。 [E]",
                "opts": [
                  "جایگاه [A]",
                  "جایگاه [B]",
                  "جایگاه [C]",
                  "جایگاه [D]",
                  "جایگاه [E]"
                ],
                "ans": 1,
                "tip": "واژه شمارا بین 这‏ و اسم قرار می‌گیرد.",
                "exFa": "این شخص دوست من است."
              }
            ]
          }
        ]
      },
      {
        "id": "pronunciation",
        "num": 3,
        "title": "Pronunciation",
        "titleFa": "تلفظ",
        "titleZh": "发音与声调",
        "icon": "audio-lines",
        "desc": "تمرین تُن واژه‌ها و قانون 一 در 一起",
        "intro": {
          "title": "آشنایی با تُن‌های آوایی زبان چینی",
          "lead": "زبان چینی یک زبان تُن‌دار است؛ یعنی زیر و بم صدا معنی کلمه را به کلی عوض می‌کند!",
          "tones": [
            {
              "no": 1,
              "mark": "ā",
              "name": "تُن اول (بالا و ممتد)",
              "desc": "صدایی یکنواخت و با فرکانس بالا (مانند کشیدن صدای آ در معاینه پزشکی).",
              "sample": "mā (مادر)"
            },
            {
              "no": 2,
              "mark": "á",
              "name": "تُن دوم (بالارونده)",
              "desc": "صدا از پایین به بالا اوج می‌گیرد (مانند حالت تعجب یا گفتن «چی؟»).",
              "sample": "má (کنف)"
            },
            {
              "no": 3,
              "mark": "ǎ",
              "name": "تُن سوم (فرود و صعود)",
              "desc": "صدا ابتدا پایین می‌رود و سپس کمی بالا می‌آید (مانند تأمل: «آها...»).",
              "sample": "mǎ (اسب)"
            },
            {
              "no": 4,
              "mark": "à",
              "name": "تُن چهارم (کوتاه و قاطع)",
              "desc": "صدا به سرعت و با قدرت سقوط می‌کند (مانند گفتن یک دستور قاطع: «نه!»).",
              "sample": "mà (سرزنش کردن)"
            },
            {
              "no": 0,
              "mark": "a",
              "name": "تُن خنثی (سبک و کوتاه)",
              "desc": "بدون علامت روی حرف؛ بسیار کوتاه، آرام و بی‌وزن ادا می‌شود.",
              "sample": "ma (نشانه سؤال)"
            }
          ],
          "sandhiNote": "نکته طلایی این درس: در «一起» واژه 一 قبل از تُن ۳ (qǐ) به yì تبدیل می‌شود: yì qǐ! و «出租车» سه سیلاب با تُن‌های ۱-۱-۱ یکنواخت است."
        },
        "miniLessons": [
          {
            "id": "hsk1:14_p1",
            "num": 1,
            "title": "تشخیص تُن‌های ۱ تا ۴",
            "desc": "شنیدن فایل صوتی و انتخاب شماره تُن صحیح",
            "exercises": [
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "rèn",
                "pinyin": "rèn",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 3
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "tīng",
                "pinyin": "tīng",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              },
              {
                "type": "tone_pick",
                "q": "به صدا گوش دهید: این سیلاب با کدام تُن ادا شد؟",
                "audio": "gāo",
                "pinyin": "gāo",
                "opts": [
                  "تُن اول (بالا و یکنواخت: ā)",
                  "تُن دوم (بالارونده: á)",
                  "تُن سوم (فرود و صعود: ǎ)",
                  "تُن چهارم (قاطع: à)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "hsk1:14_p2",
            "num": 2,
            "title": "تمایز آوایی کلمات مشابه",
            "desc": "مقایسه کلماتی که فقط در تُن یا آوا با هم تفاوت دارند",
            "exercises": [
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «chūzūchē» (تاکسی) را پخش می‌کند؟",
                "audio": "chū zū chē",
                "opts": [
                  "huǒchē (قطار)",
                  "chē (车 — ماشین)",
                  "chūzūchē (出租车 — تاکسی)",
                  "fēijī (飞机 — هواپیما)"
                ],
                "ans": 2
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «fēijī» (هواپیما) است؟",
                "audio": "fēi jī",
                "opts": [
                  "fēijī (飞机 — هواپیما)",
                  "jī (تُن ۱)",
                  "fèijī",
                  "fēi (پرواز)"
                ],
                "ans": 0
              },
              {
                "type": "audio_choice",
                "q": "کدام گزینه صدای «gāoxìng» (خوشحال) است؟",
                "audio": "gāo xìng",
                "opts": [
                  "gāoxìng (高兴 — خوشحال)",
                  "gǎoxìng",
                  "xìng (تُن ۴)",
                  "gāo (بلند)"
                ],
                "ans": 0
              }
            ]
          },
          {
            "id": "hsk1:14_p3",
            "num": 3,
            "title": "پدیده آوایی این درس",
            "desc": "سنجش فهم تغییر تُن و قواعد آوایی واژه‌های درس",
            "exercises": [
              {
                "type": "choice",
                "q": "در «一起» واژه 一 چگونه ادا می‌شود؟",
                "opts": [
                  "yí — تُن ۲",
                  "yī — تُن ۱ می‌ماند",
                  "yì — قبل از تُن ۳ به yì تبدیل می‌شود",
                  "خنثی"
                ],
                "ans": 2,
                "audio": "yì qǐ"
              },
              {
                "type": "choice",
                "q": "در «出租车» تُن‌ها چگونه‌اند؟",
                "opts": [
                  "هر سه تُن ۱ (chū zū chē)",
                  "chú zǔ chè",
                  "هر سه تُن ۴",
                  "chū zù chē — وسط تُن ۴"
                ],
                "ans": 0,
                "audio": "chū zū chē"
              }
            ]
          },
          {
            "id": "hsk1:14_p4",
            "num": 4,
            "title": "تکرار و سنجش تلفظ",
            "desc": "شنیدن تلفظ باکیفیت و تمرین بازخوانی آوایی",
            "exercises": [
              {
                "type": "repeat",
                "target": "你是坐出租车来的吗",
                "py": "nǐ shì zuò chū zū chē láide ma",
                "fa": "با تاکسی اومدی؟",
                "tip": "出租车 هر سه تُن ۱؛ 是...的 را نرم و متصل بخوانید."
              },
              {
                "type": "repeat",
                "target": "我很高兴认识你",
                "py": "wǒ hěn gāo xìng rènshi nǐ",
                "fa": "از آشنایی با تو خیلی خوشحالم",
                "tip": "很好 را hén hǎo (تُن ۲+۳) بخوانید؛ shi در 认识 خنثی است."
              },
              {
                "type": "repeat",
                "target": "我们一起去饭店吧",
                "py": "wǒ men yì qǐ qù fàn diàn ba",
                "fa": "با هم بریم رستوران!",
                "tip": "一起 با yì شروع می‌شود؛ 吧 در پایان سبک و دوستانه ادا می‌شود."
              }
            ]
          }
        ]
      },
      {
        "id": "conversation",
        "num": 4,
        "title": "Conversation",
        "titleFa": "مکالمه",
        "titleZh": "会话",
        "icon": "message-circle",
        "desc": "درک مکالمات واقعی صوتی و گفت‌وگوهای روزمره این درس",
        "intro": {
          "title": "راهنمای مکالمه و درک شنیداری",
          "lead": "در این بخش مکالمات کاربردی روزمره چینی را هم از طریق صوت و هم متون کوتاه تمرین می‌کنید:",
          "tips": [
            "۱. در مکالمه به «shì...de» گوش کنید: تأکید بر نحوه رفتن.",
            "۲. به وسایل نقلیه (出租车/飞机) دقت کنید.",
            "۳. پیشنهادهای «一起...吧» را پیدا کنید.",
            "۴. جمله «很高兴认识你» را با صدای بلند تمرین کنید."
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:14_c1",
            "num": 1,
            "title": "زیر ایستگاه ۱: مکالمه صوتی و درک شنیداری",
            "desc": "تشخیص دقیق کلمات و جملات کاربردی در مکالمه واقعی",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به صوت گوش دهید: گوینده چه پرسید؟",
                "audio": "nǐ shì zuò chū zū chē láide ma",
                "opts": [
                  "تاکسی می‌خوری؟",
                  "تاکسی کجاست؟",
                  "با هواپیما اومدی؟",
                  "با تاکسی اومدی؟"
                ],
                "ans": 3,
                "revealZh": "你是坐出租车来的吗？",
                "revealPy": "Nǐ shì zuò chūzūchē láide ma?"
              },
              {
                "type": "listening_q",
                "prompt": "به جمله صوتی گوش دهید: منظور چیست؟",
                "audio": "wǒ hěn gāo xìng rènshi nǐ",
                "opts": [
                  "تو خیلی خوشحالی",
                  "از آشنایی با تو خیلی خوشحالم",
                  "خیلی خوشحالم که برگشتی",
                  "من اونو می‌شناسم"
                ],
                "ans": 1,
                "revealZh": "我很高兴认识你！",
                "revealPy": "Wǒ hěn gāoxìng rènshi nǐ!"
              },
              {
                "type": "listening_q",
                "prompt": "کدام جمله را شنیدید؟",
                "audio": "wǒ men yì qǐ qù fàn diàn ba",
                "opts": [
                  "با هم بریم رستوران!",
                  "من می‌روم رستوران",
                  "فردا بریم رستوران؟",
                  "با هم بریم سینما!"
                ],
                "ans": 0,
                "revealZh": "我们一起去饭店吧！",
                "revealPy": "Wǒmen yìqǐ qù fàndiàn ba!"
              },
              {
                "type": "listening_q",
                "prompt": "گوینده چه گفت؟",
                "audio": "tā shì zuò fēi jī láide",
                "opts": [
                  "او هواپیما داره",
                  "او با تاکسی اومده",
                  "من با هواپیما اومدم",
                  "او با هواپیما اومده"
                ],
                "ans": 3,
                "revealZh": "他是坐飞机来的。",
                "revealPy": "Tā shì zuò fēijī láide."
              }
            ]
          },
          {
            "id": "hsk1:14_c2",
            "num": 2,
            "title": "زیر ایستگاه ۲: گفت‌وگوهای روزمره",
            "desc": "خواندن و درک متون کوتاه مکالمه این درس",
            "exercises": [
              {
                "type": "reading_q",
                "textZh": "李华：你是坐出租车来的吗？\n阿达：不，我是坐飞机来的。\n李华：很好！我们一起去饭店吧。\n阿达：好，我很高兴认识你！",
                "textPy": "Lǐ Huá: Nǐ shì zuò chūzūchē láide ma?\nĀ Dá: Bú, wǒ shì zuò fēijī láide.\nLǐ Huá: Hěn hǎo! Wǒmen yìqǐ qù fàndiàn ba.\nĀ Dá: Hǎo, wǒ hěn gāoxìng rènshi nǐ!",
                "textFa": "لی‌هوا: با تاکسی اومدی؟\nآدا: نه، با هواپیما اومدم.\nلی‌هوا: عالیه! با هم بریم رستوران.\nآدا: باشه، از آشنایی با تو خیلی خوشحالم!",
                "q": "阿达 چطور آمده است؟",
                "opts": [
                  "با هواپیما (坐飞机)",
                  "معلوم نیست",
                  "با تاکسی",
                  "با ماشین دوستش"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "A: 你认识王老师吗？\nB: 认识！她是我的汉语老师。\nA: 我也很高兴认识她！",
                "textPy": "A: Nǐ rènshi Wáng lǎoshī ma?\nB: Rènshi! Tā shì wǒde Hànyǔ lǎoshī.\nA: Wǒ yě hěn gāoxìng rènshi tā!",
                "textFa": "A: استاد وانگ رو می‌شناسی؟\nB: آره! اون معلم چینی منه.\nA: منم خوشحالم که می‌شناسمش!",
                "q": "王老师 چه رابطه‌ای با B دارد؟",
                "opts": [
                  "معلم چینی B",
                  "دانشجوی B",
                  "دوست B",
                  "مادر B"
                ],
                "ans": 0
              },
              {
                "type": "reading_q",
                "textZh": "咪咪：我们怎么去大学？\n王明：我们坐出租车去吧。\n咪咪：好！我听说大学的汉语班很好。",
                "textPy": "Mīmī: Wǒmen zěnme qù dàxué?\nWáng Míng: Wǒmen zuò chūzūchē qù ba.\nMīmī: Hǎo! Wǒ tīngshuō dàxuéde Hànyǔ bān hěn hǎo.",
                "textFa": "می‌می: چطور بریم دانشگاه؟\nوانگ مینگ: با تاکسی بریم.\nمی‌می: باشه! شنیدم کلاس‌های چینی دانشگاه خیلی خوبه.",
                "q": "آنها چطور به دانشگاه می‌روند؟",
                "opts": [
                  "با دوستشان",
                  "پیاده",
                  "با هواپیما",
                  "با تاکسی (坐出租车)"
                ],
                "ans": 3
              }
            ]
          }
        ]
      },
      {
        "id": "quiz",
        "num": 5,
        "title": "Practice & Quiz",
        "titleFa": "تمرین و آزمون",
        "titleZh": "测验",
        "icon": "award",
        "desc": "آزمون جامع 是...的، 认识 و 一起",
        "intro": {
          "title": "آزمون و تمرین جامع پایانی",
          "lead": "به مرحله نهایی درس پانزدهم رسیدید! این بخش تسلط شما روی ساختار تأکیدی و آشنایی را می‌سنجد:",
          "badges": [
            "آزمون ترکیبی ساختار 是...的",
            "سنجش 认识 و پیشنهاد با 一起",
            "درک شنیداری مکالمات سفر و آشنایی",
            "با پاس کردن این بخش، کل دوره HSK 1 را کامل کرده‌اید! 🎉"
          ]
        },
        "miniLessons": [
          {
            "id": "hsk1:14_q1",
            "num": 1,
            "title": "زیر ایستگاه ۱: آزمون جامع درک لغات و گرامر",
            "desc": "سنجش ترکیبی ترجمه، ساختار جمله و قواعد این درس",
            "exercises": [
              {
                "type": "choice",
                "q": "معادل چینی «با تاکسی اومدی؟» کدام است؟",
                "opts": [
                  "你是出租车来的坐吗？",
                  "你是坐飞机来的吗？",
                  "你是坐出租车来的吗？",
                  "你坐出租车吗来？"
                ],
                "ans": 2,
                "audio": "nǐ shì zuò chū zū chē láide ma"
              },
              {
                "type": "choice",
                "q": "کدام واژه «هواپیما» است؟",
                "opts": [
                  "飞机 (fēijī)",
                  "电脑 (diànnǎo)",
                  "出租车 (chūzūchē)",
                  "电话 (diànhuà)"
                ],
                "ans": 0,
                "audio": "fēi jī"
              },
              {
                "type": "order",
                "prompt": "جمله «او با هواپیما اومده.» را بسازید:",
                "tiles": [
                  "来的",
                  "飞机",
                  "坐",
                  "是",
                  "他"
                ],
                "target": "他是坐飞机来的"
              },
              {
                "type": "order",
                "prompt": "جمله «با هم بریم رستوران!» را بسازید:",
                "tiles": [
                  "去",
                  "一起",
                  "饭店",
                  "我们",
                  "吧"
                ],
                "target": "我们一起去饭店吧"
              }
            ]
          },
          {
            "id": "hsk1:14_q2",
            "num": 2,
            "title": "زیر ایستگاه ۲: چالش نهایی و سنجش پایانی",
            "desc": "ارزیابی نهایی شنیداری، خواندن متن و تثبیت کامل درس",
            "exercises": [
              {
                "type": "listening_q",
                "prompt": "به این پیام صوتی گوش دهید: گوینده چه گفت؟",
                "audio": "wǒ hěn gāo xìng rènshi nǐ!",
                "opts": [
                  "با هم بریم!",
                  "خیلی خوشحالم که برگشتی!",
                  "من اونو می‌شناسم!",
                  "از آشنایی با تو خیلی خوشحالم!"
                ],
                "ans": 3,
                "revealZh": "我很高兴认识你！",
                "revealPy": "Wǒ hěn gāoxìng rènshi nǐ!"
              },
              {
                "type": "reading_q",
                "textZh": "李华：你是怎么来的？\n阿达：我是坐出租车来的。\n李华：好！我们一起去饭店吃饭吧。\n阿达：我很高兴认识你！",
                "textPy": "Lǐ Huá: Nǐ shì zěnme láide?\nĀ Dá: Wǒ shì zuò chūzūchē láide.\nLǐ Huá: Hǎo! Wǒmen yìqǐ qù fàndiàn chīfàn ba.\nĀ Dá: Wǒ hěn gāoxìng rènshi nǐ!",
                "textFa": "لی‌هوا: چطور اومدی؟\nآدا: با تاکسی اومدم.\nلی‌هوا: عالیه! با هم بریم رستوران غذا بخوریم.\nآدا: از آشنایی با تو خیلی خوشحالم!",
                "q": "阿达 با چه وسیله‌ای آمده است؟",
                "opts": [
                  "ماشین دوستش",
                  "تاکسی (出租车)",
                  "قطار",
                  "هواپیما"
                ],
                "ans": 1
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
      
      UnitSystem.runner.unitKey = key;
      UnitSystem.runner.viewMode = "unit-path";
      UnitSystem.runner.activeSectionIdx = 0;
      UnitSystem.runner.feedbackState = null;

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

      var h = '<div class="scr u-lesson-screen" style="padding:0; margin:0; width:100%; height:100%; overflow-y:auto; overflow-x:hidden;">';
      h += '  <div class="subtasks-view">';

      // تصویر پس‌زمینه منظره پل چوبی و اژدهای اختصاصی ایستگاه
      h += '    <img src="' + bgImg + '" alt="منظره جزایر معلق ایستگاه" class="subtasks-bg-art" id="subtasksBgImg" decoding="async">';

      // دکمه بازگشت شناور در بالا
      h += '    <button class="screen-back-btn" data-act="go" data-arg=\'{"s":"home"}\' type="button" aria-label="بازگشت به نقشه">';
      h += '      <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
      h += '    </button>';

      // بنر مشخصات درس در بالا
      h += '    <div class="subtask-station-banner" data-act="go" data-arg=\'{"s":"home"}\'>';
      h += '      <div class="subtask-station-info">';
      h += '        <span class="subtask-station-pill-tag">' + (unit.titleFa || 'درس ' + faNum(unitIdx + 1)) + '</span>';
      h += '        <span class="subtask-station-lesson-name">' + (unit.titleZh || '') + '</span>';
      h += '      </div>';
      h += '      <span style="font-size:11px;color:#0FA968;font-weight:700;">۴ بخش آموزشی</span>';
      h += '    </div>';

      // ۴ جزیره معلق
      var sectionTitles = ["۱. واژگان", "۲. گرامر", "۳. تلفظ", "۴. مکالمه"];
      var isPreviousDone = true;

      (unit.sections || []).slice(0, 4).forEach(function(sec, idx) {
        var completedCount = (prog.miniProgress && prog.miniProgress[sec.id]) || 0;
        var totalCount = (sec.miniLessons && sec.miniLessons.length) || 4;
        var isDone = completedCount >= totalCount;
        var isLocked = !isPreviousDone;
        isPreviousDone = isDone;

        var anchorClass = 'anchor-step-' + (idx + 1);
        h += '    <div class="subtask-stage-anchor ' + anchorClass + '">';

        if (isLocked) {
          h += '      <div class="subtask-interactive-pod" data-act="unitLockedToast" data-arg=\'{"num":' + (idx+1) + ',"name":"' + sectionTitles[idx] + '"}\' role="button" tabindex="0">';
          h += '        <div class="integrated-lock-dome">';
          h += '          <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
          h += '        </div>';
          h += '        <div class="subtask-unified-card is-locked-card">';
          h += '          <div class="subtask-card-title">' + sectionTitles[idx] + '</div>';
          h += '        </div>';
          h += '      </div>';
        } else {
          h += '      <div class="subtask-interactive-pod" data-act="unitSelectSection" data-arg=\'{"idx":' + idx + '}\' role="button" tabindex="0">';
          h += '        <div class="subtask-unified-card ' + (idx === 0 ? 'subtask-card--vocab' : '') + '">';
          if (idx === 0) {
            h += '          <div class="temple-mini-roof">';
            h += '            <svg viewBox="0 0 64 24" fill="none">';
            h += '              <path d="M32 2L12 12H52L32 2Z" fill="#F59E0B"/>';
            h += '              <path d="M4 12C12 10 24 14 32 14C40 14 52 10 60 12L56 16H8L4 12Z" fill="#D97706"/>';
            h += '              <circle cx="32" cy="5" r="2.5" fill="#FEF3C7"/>';
            h += '            </svg>';
            h += '          </div>';
          }
          h += '          <div class="subtask-card-title">' + sectionTitles[idx] + '</div>';
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
            h += '            <span class="subtask-status-label">آماده یادگیری</span>';
            h += '          </div>';
          }
          h += '        </div>';
          h += '      </div>';
        }

        h += '    </div>';
      });

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
      
      var b = { cat: "تمرین", name: "پرسش و پاسخ", icon: "help-circle" };

      if (secId === "vocab" || /_v\d+$/.test(miniId) || /v\d+_/.test(miniId)) {
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

      // 1. چندگزینه‌ای (Choice) با شافل تصادفی گزینه‌ها و وضعیت بصری پاسخ
      if (ex.type === "choice" || ex.type === "audio_choice" || ex.type === "tone_pick") {
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
        // هـ) سوال انتخاب از روی صدا (Audio Choice)
        else if (ex.type === "audio_choice") {
          heroHtml = '<div class="u-hero-center">' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: ex.audio, py: ex.audio }) + ' aria-label="پخش صدا">' + icon("volume-2", 20) + ' <span>شنیدن صدا</span></button>' +
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
              (cPy ? '<div class="u-hero-py py" dir="ltr">' + esc(cPy) + '</div>' : '') +
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

      // 0. فلش‌کارت آموزش واژه (Flashcard)
      else if (ex.type === "flash") {
        var flZh = ex.hanzi || "",
          flPy = ex.py || "",
          flFa = ex.fa || "";
        exContent = '<div class="u-ex-card">' +
          badgeHtml +
          '<h3 class="u-ex-short-q" dir="rtl">' + esc(promptText) + '</h3>' +
          '<div class="u-hero-center">' +
            '<div class="u-hero-hanzi han" dir="ltr">' + esc(flZh) + '</div>' +
            '<button class="u-big-audio" ' + act("unitPlaySay", { text: flZh, py: flPy }) + ' aria-label="شنیدن تلفظ">' + icon("volume-2", 18) + ' <span>شنیدن تلفظ</span></button>' +
            (flPy && UnitSystem.pyOn() ? '<div class="u-hero-py py" dir="ltr">' + esc(flPy) + '</div>' : '') +
            (flFa && UnitSystem.faOn() ? '<div class="u-hero-fa" dir="rtl">' + esc(flFa) + '</div>' : '') +
            (ex.ex ? '<div class="u-fc__ex" style="margin-top:12px; padding:10px 14px; background:#F1F5F9; border-radius:14px; width:100%; box-sizing:border-box;"><div class="han" dir="ltr" style="font-size:16px; font-weight:700; color:#0F172A; text-align:center;">' + esc(ex.ex) + '</div>' + (ex.exFa && UnitSystem.faOn() ? '<div style="font-size:13px; color:#64748B; font-weight:700; direction:rtl; text-align:center; margin-top:4px;">' + esc(ex.exFa) + '</div>' : '') + '</div>' : '') +
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
      var fbSheet = "";
      if (fb === "correct") {
        fbSheet = '<div class="u-feedback is-correct">' +
          '<div class="u-fb-main">' +
            '<div class="u-fb-ico">' + icon("circle-check", 24) + '</div>' +
            '<div class="u-fb-text-wrap">' +
              '<strong class="u-fb-title">' + esc(runner._uPraise || "عالی بود!") + '</strong>' +
              (ex && ex.tip ? '<p class="u-fb-msg u-fb-tip" style="margin-top:6px; font-size:13.5px; line-height:1.6; color:#334155;">' + esc(ex.tip) + '</p>' : '') +
            '</div>' +
          '</div>' +
          '<div class="u-fb-actions">' +
            '<button class="btn u-fb-btn u-fb-btn--next" ' + act("unitNextExercise") + '>ادامه</button>' +
          '</div>' +
        '</div>';
      } else if (fb === "wrong") {
        var wrHintMsg = runner._uWriteHint
          ? 'نویسه را کامل ننوشتی — همه‌ی خط‌ها را با دست بنویس.'
          : (ex && ex.tip ? esc(ex.tip) : 'دقت کنید! دوباره تلاش کنید یا ادامه دهید.');
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
        var noCheck = ex.type === "flash" || ex.type === "gram";
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

      if (ex.type === "choice" || ex.type === "audio_choice" || ex.type === "tone_pick" || ex.type === "reading_q" || ex.type === "listening_q") {
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
        var isFinal = (sec.id === "quiz" || runner.activeSectionIdx >= unit.sections.length - 1);
        var uIdx = unit.unitIndex || 0;

        if (isSectionNewlyCompleted) {
          if (isFinal) {
            prog.done = true;
            UnitSystem.saveProgress(runner.unitKey, prog);
            if (window.Store && Store.completeLesson) {
              Store.completeLesson("hsk1", uIdx);
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
