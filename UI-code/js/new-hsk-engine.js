/* ============================================================
   new-hsk-engine.js — موتور تطبیقی درس‌های New HSK (HSK 1 تا HSK 5)
   پشتیبانی از معماری ۶ زیردرسی، ۴۰ تمرین، ۷ ویجت تعاملی،
   قوانین نمایش پین‌یین بر اساس سطح و کارت جایزه (小语的彩蛋)
   ============================================================ */
!function(window) {
  "use strict";

  if (!window.UnitSystem) window.UnitSystem = {};
  if (!window.UnitSystem.UNITS) window.UnitSystem.UNITS = {};

  var PHASE_META = {
    phonetics: { labelFa: "فاز ۱ · آوا و نواخت", badge: "آواشناسی" },
    radicals_strokes: { labelFa: "فاز ۲ · کاراکتر و ریشه", badge: "کاراکترشناسی" },
    reading_transition: { labelFa: "فاز ۳ · خواندن و هم‌آیی", badge: "گذر به متن" },
    advanced_academic: { labelFa: "فاز ۴ · متن بلند و اصطلاح", badge: "پیشرفته" }
  };

  var SKILL_LABELS = {
    listening: { cat: "شنیداری", icon: "headphones" },
    vocabulary: { cat: "واژگان", icon: "book-open" },
    grammar: { cat: "گرامر", icon: "cpu" },
    dialogue_or_speaking: { cat: "مکالمه و گفتار", icon: "message-circle" }
  };

  function resolveCourseId(level) {
    var lv = String(level || "HSK1").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (/^hsk[1-5]$/.test(lv)) return lv;
    return "hsk1";
  }

  function defaultPinyinForLevel(level, explicit) {
    if (typeof explicit === "boolean") return explicit;
    var lv = resolveCourseId(level);
    return lv === "hsk1" || lv === "hsk2";
  }

  function buildTilesFromText(text) {
    var s = String(text || "").trim();
    if (!s) return [];
    if (/\s+/.test(s)) {
      return s.split(/\s+/).filter(Boolean);
    }
    var clean = s.replace(/[。！？，、；：.!?,]/g, "");
    return clean ? clean.split("") : [];
  }

  function convertExercise(ex, sub, vocabById) {
    var widget = String(ex.widget || "W1_VOCAB_SELECT").trim();
    var skillTag = String(ex.skill_tag || "vocabulary").trim();
    var stim = ex.stimulus || {};
    var opts = Array.isArray(ex.options) ? ex.options.slice() : [];
    var ansIdx = typeof ex.answer_index === "number" ? ex.answer_index : 0;
    var targetVocab = (ex.target_vocab_ids || []).map(function(id) { return vocabById[id]; }).filter(Boolean);
    var primaryVocab = targetVocab[0] || null;
    var stimZh = stim.hanzi || (primaryVocab ? primaryVocab.hanzi : "") || "";
    var stimPy = stim.pinyin || (primaryVocab ? primaryVocab.pinyin : "") || "";
    var stimFa = stim.text_fa || "";
    var feedbackFa = ex.feedback_fa || "";

    if (widget === "W2_AUDIO_DRILL") {
      return {
        id: ex.ex_id,
        type: "audio_choice",
        widget: widget,
        skillTag: skillTag,
        q: ex.prompt_fa || "به صدا گوش دهید و گزینه درست را انتخاب کنید.",
        audio: stimZh || stimPy,
        hanzi: stimZh,
        pinyin: stimPy,
        textFa: stimFa,
        mediaPlaceholder: stim.media_placeholder || "",
        opts: opts,
        ans: ansIdx,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    if (widget === "W3_SENTENCE_BUILD") {
      var target = ex.target || (opts[ansIdx] ? String(opts[ansIdx]) : stimZh) || "";
      var tiles = Array.isArray(ex.tiles) && ex.tiles.length ? ex.tiles.slice() : buildTilesFromText(target);
      var shuffled = tiles.slice();
      if (shuffled.length > 1) {
        shuffled.sort(function(a, b) { return a < b ? -1 : a > b ? 1 : 0; });
        if (shuffled.join("") === target.replace(/[。！？，、]/g, "")) {
          shuffled.reverse();
        }
      }
      return {
        id: ex.ex_id,
        type: "order",
        widget: widget,
        skillTag: skillTag,
        prompt: ex.prompt_fa || "جمله را مرتب کنید.",
        fa: stimFa || (primaryVocab ? primaryVocab.example_fa : "") || "",
        tiles: shuffled,
        target: target.replace(/[。！？，、]/g, ""),
        hanzi: stimZh,
        pinyin: stimPy,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    if (widget === "W4_FILL_BLANK") {
      return {
        id: ex.ex_id,
        type: "fill_blank",
        widget: widget,
        skillTag: skillTag,
        q: ex.prompt_fa || "جای خالی را با گزینه مناسب پر کنید.",
        sentenceZh: stimZh,
        sentencePy: stimPy,
        sentenceFa: stimFa,
        opts: opts,
        ans: ansIdx,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    if (widget === "W5_DIALOGUE_REPLY") {
      return {
        id: ex.ex_id,
        type: "dialogue_reply",
        widget: widget,
        skillTag: skillTag,
        q: ex.prompt_fa || "پاسخ منطقی و متناسب با مکالمه را انتخاب کنید.",
        hanzi: stimZh,
        pinyin: stimPy,
        textFa: stimFa,
        audio: stimZh || stimPy,
        opts: opts,
        ans: ansIdx,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    if (widget === "W6_PICTURE_MATCH") {
      return {
        id: ex.ex_id,
        type: "picture_match",
        widget: widget,
        skillTag: skillTag,
        q: ex.prompt_fa || "متن یا تصویر زیر را با گزینه درست تطبیق دهید.",
        hanzi: stimZh,
        pinyin: stimPy,
        textFa: stimFa,
        mediaPlaceholder: stim.media_placeholder || "",
        opts: opts,
        ans: ansIdx,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    if (widget === "W7_SHADOW_SPEAK") {
      return {
        id: ex.ex_id,
        type: "repeat",
        widget: widget,
        skillTag: skillTag,
        q: ex.prompt_fa || "به تلفظ گوش دهید و با صدای بلند تکرار کنید.",
        hanzi: stimZh,
        target: stimZh,
        pinyin: stimPy,
        py: stimPy,
        meaning: stimFa,
        fa: stimFa,
        feedbackFa: feedbackFa,
        tip: feedbackFa,
        targetVocabIds: ex.target_vocab_ids || []
      };
    }

    // Default: W1_VOCAB_SELECT
    var hasZhPrompt = !!stimZh;
    return {
      id: ex.ex_id,
      type: "choice",
      subtype: hasZhPrompt ? "zh_to_fa" : "fa_to_zh",
      widget: widget,
      skillTag: skillTag,
      q: ex.prompt_fa || (hasZhPrompt ? "معنی این واژه چیست؟" : "معادل چینی این واژه کدام است؟"),
      hanzi: hasZhPrompt ? stimZh : "",
      pinyin: hasZhPrompt ? stimPy : "",
      fa: !hasZhPrompt ? stimFa : "",
      textFa: stimFa,
      audio: stimZh || "",
      opts: opts,
      ans: ansIdx,
      feedbackFa: feedbackFa,
      tip: feedbackFa,
      targetVocabIds: ex.target_vocab_ids || []
    };
  }

  function compileSubLesson(sub, meta, unitKey) {
    var vocab = Array.isArray(sub.vocabulary) ? sub.vocabulary : [];
    var vocabById = {};
    vocab.forEach(function(v) {
      if (v && v.vocab_id) vocabById[v.vocab_id] = v;
    });

    var ctx = sub.context_card || null;
    var gram = sub.grammar_card || null;
    var exercises = Array.isArray(sub.exercises) ? sub.exercises : [];
    var isCheckpoint = sub.sub_index === 6 || sub.slot_type === "checkpoint";
    var secId = sub.sub_id || ("sub_" + sub.sub_index);

    var miniLessons = [];

    // ۱) کارت معرفی واژگان (در تمام سطوح نمایش پینیین کنار صوت در بخش 生词 فعال است)
    if (vocab.length > 0 && !isCheckpoint) {
      miniLessons.push({
        id: secId + "_vocab",
        num: 1,
        title: "واژگان جدید (生词 · " + vocab.length + " واژه)",
        desc: "شنیدن تلفظ، مشاهده پین‌یین و مرور واژگان اصلی و تمرینی",
        exercises: vocab.map(function(v) {
          return {
            type: "flash",
            widget: "VOCAB_CARD",
            skillTag: "vocabulary",
            alwaysShowPinyin: true,
            isCore: v.is_core !== false,
            vocabId: v.vocab_id,
            pos: v.pos || "",
            tones: v.tones || [],
            hanzi: v.hanzi,
            py: v.pinyin,
            fa: v.meaning_fa,
            ex: v.example_zh || "",
            exFa: v.example_fa || ""
          };
        })
      });
    }

    // ۲) کارت متن/مکالمه + نکته دستوری (در صورت وجود)
    var hasContextLines = ctx && Array.isArray(ctx.lines) && ctx.lines.length > 0;
    var hasGrammar = gram && gram.has_grammar;
    if ((hasContextLines || hasGrammar) && !isCheckpoint) {
      var studyExercises = [];
      if (hasContextLines) {
        studyExercises.push({
          type: "context_card",
          widget: "CONTEXT_CARD",
          skillTag: "dialogue_or_speaking",
          mode: ctx.mode || "dialogue",
          lines: ctx.lines,
          grammarCard: hasGrammar ? gram : null
        });
      }
      if (hasGrammar) {
        studyExercises.push({
          type: "gram",
          widget: "GRAMMAR_CARD",
          skillTag: "grammar",
          mark: (gram.formula || "").split(/\s+/)[0] || "语法",
          rule: sub.title_fa || "نکته گرامری",
          catFa: "نکته دستوری",
          formula: gram.formula || "",
          explain: gram.explanation_fa || "",
          mistake: gram.persian_learner_tip || "",
          examples: gram.example_zh ? [{
            ch: gram.example_zh,
            py: "",
            fa: gram.example_fa || ""
          }] : []
        });
      }
      miniLessons.push({
        id: secId + "_context",
        num: miniLessons.length + 1,
        title: hasContextLines && hasGrammar ? "مکالمه، متن و گرامر" : (hasGrammar ? "نکته دستوری" : "مکالمه و متن"),
        desc: "درک ساختار جمله، بافت مکالمه و نکته ویژه فارسی‌زبانان",
        exercises: studyExercises
      });
    }

    // ۳) تمرین‌های تعاملی (۶ تمرین در زیردرس‌های ۱-۵ و ۱۰ تمرین در زیردرس ۶)
    if (exercises.length > 0) {
      miniLessons.push({
        id: secId + "_practice",
        num: miniLessons.length + 1,
        title: isCheckpoint ? "آزمون جامع پایان درس (" + exercises.length + " پرسش)" : "تمرین‌های تعاملی (" + exercises.length + " تمرین)",
        desc: isCheckpoint ? "ارزیابی نهایی واژگان، گرامر، شنیداری و مکالمه + باز شدن کارت جایزه" : "تمرین متوازن شنیداری، واژگان، گرامر و مکالمه",
        exercises: exercises.map(function(ex) {
          return convertExercise(ex, sub, vocabById);
        })
      });
    }

    var introWords = vocab.map(function(v) {
      return {
        hanzi: v.hanzi,
        py: v.pinyin,
        fa: v.meaning_fa,
        ex: v.example_zh || "",
        exFa: v.example_fa || "",
        isCore: v.is_core !== false
      };
    });

    return {
      id: secId,
      subIndex: sub.sub_index,
      slotType: sub.slot_type || "dialogue_or_text",
      isCheckpoint: isCheckpoint,
      num: sub.sub_index,
      title: sub.title_fa,
      titleFa: sub.title_fa,
      titleZh: isCheckpoint ? "小语的彩蛋 · 测验" : ("第" + sub.sub_index + "部分"),
      icon: isCheckpoint ? "award" : (sub.slot_type === "skill_slot" ? "sparkles" : "book-open"),
      desc: isCheckpoint ? "آزمون جامع ۱۰ پرسشی و کارت جایزه فرهنگی" : (sub.title_fa || ""),
      intro: {
        title: sub.title_fa,
        lead: "",
        words: introWords
      },
      contextCard: ctx,
      grammarCard: gram,
      miniLessons: miniLessons
    };
  }

  UnitSystem.compileNewHskLesson = function(lessonJson, overrideKey) {
    if (!lessonJson || !lessonJson.meta || !Array.isArray(lessonJson.sub_lessons)) {
      throw new Error("Invalid New HSK lesson JSON schema");
    }
    var meta = lessonJson.meta;
    var courseId = resolveCourseId(meta.level);
    var lessonNum = Number(meta.lesson_number) || 1;
    var unitIdx = Math.max(0, lessonNum - 1);
    var unitKey = overrideKey || meta.unit_key || (courseId + ":" + unitIdx);
    var showPy = defaultPinyinForLevel(meta.level, meta.show_pinyin_default);
    var phaseInfo = PHASE_META[meta.phase] || PHASE_META.phonetics;

    var sections = lessonJson.sub_lessons
      .slice()
      .sort(function(a, b) { return (a.sub_index || 0) - (b.sub_index || 0); })
      .map(function(sub) {
        return compileSubLesson(sub, meta, unitKey);
      });

    return {
      id: unitKey,
      lessonId: meta.lesson_id || (courseId.toUpperCase() + "_L" + String(lessonNum).padStart(2, "0")),
      courseId: courseId,
      unitIndex: unitIdx,
      unitNum: lessonNum,
      isNewHsk: true,
      phase: meta.phase || "phonetics",
      phaseLabelFa: phaseInfo.labelFa,
      phaseBadgeFa: phaseInfo.badge,
      showPinyinDefault: showPy,
      title: meta.title_zh || meta.title_fa,
      titleFa: meta.title_fa || ("درس " + lessonNum),
      titleZh: meta.title_zh || "",
      level: String(meta.level || "HSK1").toUpperCase(),
      desc: phaseInfo.labelFa + " · ۶ زیردرس و ۴۰ تمرین استاندارد",
      bonusCard: lessonJson.bonus_card || null,
      sections: sections
    };
  };

  UnitSystem.registerNewHskLesson = function(lessonJson, overrideKey) {
    var compiled = UnitSystem.compileNewHskLesson(lessonJson, overrideKey);
    UnitSystem.UNITS[compiled.id] = compiled;
    return compiled;
  };

  UnitSystem.registerNewHskLessons = function(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function(item) {
      return UnitSystem.registerNewHskLesson(item);
    });
  };

  UnitSystem.importNewHskJson = function(jsonOrStr, overrideKey) {
    var parsed = typeof jsonOrStr === "string" ? JSON.parse(jsonOrStr) : jsonOrStr;
    return UnitSystem.registerNewHskLesson(parsed, overrideKey);
  };

  UnitSystem.NEW_HSK_SKILL_LABELS = SKILL_LABELS;
  UnitSystem.NEW_HSK_PHASE_META = PHASE_META;

}(window);
