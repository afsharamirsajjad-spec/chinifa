!function(n) {
  "use strict";

  /* ==========================================================================
     کتابخانه و لغت‌نامه جامع چینی به فارسی (Dictionary & HSK Vocabulary)
     دارای جست‌وجوی هوشمند حتی با ۱ حرف فارسی، رسم‌الخط، تلفظ صوتی و مرور واژگان
     ========================================================================== */

  var e = n.SCREENS = n.SCREENS || {};
  var a = UI.act;
  var s = UI.esc;
  var r = UI.icon;
  var B = n.CC && n.CC.asset ? n.CC.asset("") : "";

  var D = null;
  var DL = false;
  var PAGE_SIZE = 60;

  function load() {
    if (D || DL) return;
    DL = true;
    fetch(B + "content/library/library.json")
      .then(function(x) { return x.ok ? x.json() : null; })
      .then(function(j) {
        DL = false;
        if (j && j.words) {
          D = j.words;

          // افزودن واژه‌ها به دیتابیس سراسری DICT تا در صورت کلیک و باز کردن جزییات، در دسترس باشند
          if (n.DATA && n.DATA.DICT) {
            var existingMap = {};
            n.DATA.DICT.forEach(function(item) { existingMap[item.ch] = 1; });
            j.words.forEach(function(w) {
              if (!existingMap[w.c]) {
                existingMap[w.c] = 1;
                n.DATA.DICT.push({
                  ch: w.c,
                  py: w.p || "",
                  tone: n.UI && UI.toneOfPinyin ? UI.toneOfPinyin(w.p) : 1,
                  en: w.m || w.en || "",
                  km: "",
                  zh: w.c,
                  senses: [{ tag: w.l || "HSK", en: w.m || w.en || "", km: "", zh: "" }],
                  examples: (w.e || []).map(function(ex) {
                    return { ch: ex.c || "", py: ex.p || "", en: ex.f || ex.en || "", km: "" };
                  })
                });
              }
            });
          }

          if (n.App && (App.screen === "library" || App.screen === "dict" || App.screen === "search")) {
            if (typeof App.rerender === "function") App.rerender();
            else if (typeof App.render === "function") App.render();
          }
        }
      })
      .catch(function() { DL = false; });
  }

  load();

  function faNum(x) {
    return String(x).replace(/[0-9]/g, function(d) { return "۰۱۲۳۴۵۶۷۸۹"[+d]; });
  }

  function stripPinyin(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/ü/g, "v")
      .replace(/v/g, "u")
      .replace(/[1-5]/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function normFa(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[\u200c\u200b\u200e\u200f\s\-_·,;؛!؟?\(\)\[\]\.\/\\]/g, "")
      .replace(/[ي]/g, "ی")
      .replace(/[ك]/g, "ک")
      .replace(/[ة]/g, "ه")
      .replace(/[آأإٱ]/g, "ا")
      .replace(/[\u064b-\u065f\u0670]/g, "")
      .replace(/[۰-۹]/g, function(d) { return "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]; });
  }

  function tonePinyinDisplay(py) {
    if (n.Store && Store.state && Store.state.toneStyle === "plain") {
      return n.UI && UI.toNumbers ? UI.toNumbers(py) : String(py || "");
    }
    return String(py || "");
  }

  // رندر یک ردیف واژه به فرمت کاملاً بومی و استاندارد اپلیکیشن (مشابه Image 3)
  function renderWordRow(word) {
    var ch = word.ch || word.c || "";
    var py = word.py || word.p || "";
    var gl = word.gl || word.m || word.en || "";

    if (!gl && n.Tr && Tr.word) {
      gl = Tr.word(ch, word.en || "");
    }

    var kept = n.Store && Store.keptWord ? Store.keptWord(ch, py) : null;
    var isKept = !!kept;

    var chars = Array.from(String(ch || ""));
    var d = chars.length;
    var thumbTxt = (d === 4) ? '<i style="font:inherit;color:inherit;font-style:normal;line-height:1.15;text-align:center">' + s(chars.slice(0, 2).join("")) + "<br>" + s(chars.slice(2).join("")) + '</i>' : s(ch);
    var thumbCls = (d === 4) ? " tl-dthumb--4" : (d > 2) ? " tl-dthumb--3" : (d > 1) ? " tl-dthumb--2" : "";
    var thumbHtml = '<span class="tl-dthumb tl-dthumb--hz han' + thumbCls + '">' + thumbTxt + '</span>';

    var rowHtml = '<div class="tl-drow">' +
      '<button class="tl-drow__main" ' + a("openEntry", { ch: ch, py: py }) + '>' +
        thumbHtml +
        '<span class="tl-drow__txt">' +
          '<b class="han">' + s(ch) + '</b>' +
          (py ? '<small>' + s(tonePinyinDisplay(py)) + '</small>' : '') +
          '<span class="tl-drow__gl">' + s(gl) + '</span>' +
        '</span>' +
      '</button>' +
      '<button class="tl-ico' + (isKept ? ' is-on' : '') + '" ' +
        (isKept ? a("listRemove", { id: kept.id }) + ' aria-pressed="true" aria-label="حذف"' : a("dictSave", { ch: ch, py: py }) + ' aria-label="ذخیره واژه"') + '>' +
        r(isKept ? "bookmark" : "bookmark-line", 17) +
      '</button>' +
      '<button class="tl-ico" ' + a("say", { text: ch, py: py }) + ' aria-label="پخش تلفظ">' +
        r("volume-2", 17) +
      '</button>' +
    '</div>';

    return rowHtml;
  }

  // دریافت واژه‌های پیش‌فرض برای نمایش قبل از جست‌وجو (یا فیلتر شده بر اساس سطح HSK)
  function getBrowsingWords(level, page) {
    if (!D) return [];
    var list = D;
    if (level && level !== "ALL") {
      list = list.filter(function(w) { return w.l === level; });
    }
    var limit = (page || 1) * PAGE_SIZE;
    return list.slice(0, limit);
  }

  function getBrowsingCount(level) {
    if (!D) return 0;
    if (level && level !== "ALL") {
      return D.filter(function(w) { return w.l === level; }).length;
    }
    return D.length;
  }

  // جست‌وجوی محلی در دیتای ۱,۰۰۰ واژه‌ای HSK برای پاسخ آنی
  function localSearch(query, level) {
    if (!D || !query) return [];
    var qClean = String(query).trim();
    if (!qClean) return [];

    var qFa = normFa(qClean);
    var qPy = stripPinyin(qClean);
    var list = D;
    if (level && level !== "ALL") {
      list = list.filter(function(w) { return w.l === level; });
    }

    var scored = [];
    for (var i = 0; i < list.length; i++) {
      var w = list[i];
      var ch = w.c || "";
      var py = w.p || "";
      var pStrip = stripPinyin(py);
      var mRaw = w.m || "";
      var mNorm = normFa(mRaw);
      var enRaw = String(w.en || "").toLowerCase();

      var score = 0;

      // ۱. تطابق کاراکتر چینی
      if (ch === qClean) score += 350;
      else if (ch.indexOf(qClean) === 0) score += 250;
      else if (ch.indexOf(qClean) >= 0) score += 180;

      // ۲. تطابق پین‌یین
      if (qPy) {
        if (pStrip === qPy) score += 300;
        else if (pStrip.indexOf(qPy) === 0) score += 220;
        else if (pStrip.indexOf(qPy) >= 0) score += 150;
      }

      // ۳. تطابق فارسی (شامل شروع با حرف و درون متن)
      if (qFa) {
        if (mNorm === qFa) score += 320;
        else if (mNorm.indexOf(qFa) === 0) score += 260;
        else if (mNorm.indexOf(qFa) >= 0) score += 160;
        else if ((" " + mNorm).indexOf(" " + qFa) >= 0) score += 240;
      }

      // ۴. انگلیسی
      if (qClean.toLowerCase() === enRaw) score += 100;
      else if (enRaw.indexOf(qClean.toLowerCase()) >= 0) score += 60;

      if (score > 0) {
        scored.push({
          score: score,
          item: {
            ch: ch,
            py: py,
            gl: mRaw || w.en || "",
            en: w.en || "",
            l: w.l
          }
        });
      }
    }

    scored.sort(function(a, b) { return b.score - a.score; });
    return scored.map(function(s) { return s.item; });
  }

  // اسکرین کتابخانه / لغت‌نامه
  e.library = {
    render: function() {
      load();

      var v = n.App && App.v;
      if (!v) v = {};
      if (!v.lib) {
        v.lib = { lv: "ALL", page: 1 };
      }

      // خواندن کوئری از dictQuery یا lnQuery
      var query = String(v.dictQuery || v.lnQuery || "").trim();
      var curLevel = v.lib.lv || "ALL";
      var curPage = v.lib.page || 1;

      // سربرگ شکیل لغت‌نامه
      var headerHtml = 
        '<div class="lb-top tl-top" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px 8px;">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<div style="width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#0FA968 0%,#059669 100%);display:grid;place-items:center;color:#fff;box-shadow:0 4px 14px rgba(16,185,129,0.28);flex-shrink:0;">' +
              r("book-open", 22) +
            '</div>' +
            '<div>' +
              '<div style="font-size:18.5px;font-weight:800;color:var(--text,#0F172A);margin-bottom:2px;font-family:var(--f, inherit);">لغت‌نامه چینی و فارسی</div>' +
              '<div style="font-size:11.5px;color:var(--text2,#64748B);font-family:var(--f, inherit);">جست‌وجوی آنی واژه‌ها با تلفظ صوتی و ترجمه فارسی</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      // فیلد جست‌وجو
      var searchBoxHtml = 
        '<div class="tl-search" style="margin: 4px 16px 10px; position:relative; display:flex; align-items:center;">' +
          r("search", 18) +
          '<input id="libDictSearchInput" data-model="dictQuery" value="' + s(v.dictQuery || "") + '" ' +
            'placeholder="جست‌وجو: چینی، پین‌یین یا فارسی (مثلاً: 爱، ni، سلام)..." ' +
            'enterkeyhint="search" inputmode="search" autocapitalize="off" spellcheck="false" lang="zh-CN" style="padding-inline-end: 42px;">' +
          (query ? 
            '<button class="lb-search-clear" data-act="libClearDict" aria-label="پاک کردن جستجو" ' +
              'style="position:absolute;inset-inline-end:10px;width:28px;height:28px;border-radius:50%;background:#E2E8F0;border:0;color:#475569;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12.5px;font-weight:800;">✕</button>' 
            : (n.Audio2 && Audio2.srAvailable && Audio2.srAvailable() ? 
                '<button ' + a("dictVoice") + ' aria-label="جستجوی صوتی" style="position:absolute;inset-inline-end:10px;background:none;border:none;cursor:pointer;color:#64748B;">' + r("mic", 17) + '</button>' 
                : '')
          ) +
        '</div>';

      // فیلترهای سطوح HSK
      var levels = [
        { id: "ALL", label: "همه واژه‌ها" },
        { id: "HSK1", label: "سطح ۱ (HSK 1)" },
        { id: "HSK2", label: "سطح ۲ (HSK 2)" },
        { id: "HSK3", label: "سطح ۳ (HSK 3)" }
      ];

      var chipsHtml = '<div class="lb-chips" style="display:flex;gap:8px;overflow-x:auto;padding:0 16px 10px;-webkit-overflow-scrolling:touch;">' +
        levels.map(function(lv) {
          var isSel = (curLevel === lv.id);
          var bg = isSel ? '#0FA968' : 'rgba(241,245,249,0.95)';
          var col = isSel ? '#FFFFFF' : '#475569';
          var border = isSel ? '1px solid #0FA968' : '1px solid #E2E8F0';
          return '<button class="lb-chip' + (isSel ? ' is-active' : '') + '" data-act="libSetLevel" data-arg="' + lv.id + '" ' +
            'style="padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;border:' + border + ';background:' + bg + ';color:' + col + ';cursor:pointer;white-space:nowrap;font-family:var(--f, inherit);transition:all 0.15s ease;">' +
            lv.label +
          '</button>';
        }).join("") +
      '</div>';

      var bodyHtml = "";

      if (query) {
        // ۱. حالت جست‌وجو: نمایش نتایج
        var resultsMap = {};
        var combinedResults = [];

        // نتایج محلی دیتابیس کتابخانه
        var locResults = localSearch(query, curLevel);
        locResults.forEach(function(item) {
          if (!resultsMap[item.ch]) {
            resultsMap[item.ch] = 1;
            combinedResults.push(item);
          }
        });

        // نتایج ماژول Lookup سراسری اپلیکیشن
        if (n.Lookup && Lookup.find) {
          var lk = Lookup.find(query);
          if (lk) {
            var rawList = (lk.authored || []).concat(lk.entries || []);
            rawList.forEach(function(entry) {
              if (entry && entry.ch && !resultsMap[entry.ch]) {
                resultsMap[entry.ch] = 1;
                var defStr = "";
                if (entry.defs && entry.defs.length) defStr = entry.defs.join("; ");
                else if (entry.en) defStr = entry.en;

                if (n.Tr && Tr.word) {
                  defStr = Tr.word(entry.ch, defStr);
                }

                combinedResults.push({
                  ch: entry.ch,
                  py: entry.py || "",
                  gl: defStr,
                  en: entry.en || ""
                });
              }
            });
          }
        }

        if (combinedResults.length > 0) {
          bodyHtml += '<div class="tl-cap tl-cap--row" style="padding:4px 18px 8px;font-size:13px;font-weight:800;color:#0F172A;display:flex;justify-content:space-between;align-items:center;">' +
            '<span>نتیجه‌ها</span>' +
            '<span style="font-size:11.5px;color:#64748B;">' + faNum(combinedResults.length) + ' واژه</span>' +
          '</div>';
          bodyHtml += '<div class="tl-drows" style="padding-bottom:24px;">' +
            combinedResults.map(renderWordRow).join("") +
          '</div>';
        } else {
          bodyHtml += 
            '<div class="tl-wait" style="text-align:center;padding:50px 20px;">' +
              '<div style="font-size:36px;margin-bottom:12px;">🔍</div>' +
              '<div style="font-size:15px;font-weight:800;color:#0F172A;margin-bottom:6px;font-family:var(--f, inherit);">واژه‌ای یافت نشد</div>' +
              '<div style="font-size:12.5px;color:#64748B;line-height:1.6;font-family:var(--f, inherit);">می‌توانید کلمه را به صورت حروف چینی، پین‌یین یا به زبان فارسی جست‌وجو کنید.</div>' +
            '</div>';
        }

      } else {
        // ۲. حالت قبل از جست‌وجو: نمایش فهرست کامل واژه‌ها
        var totalAvailable = getBrowsingCount(curLevel);
        var displayedWords = getBrowsingWords(curLevel, curPage);

        bodyHtml += '<div class="tl-cap tl-cap--row" style="padding:4px 18px 8px;font-size:13px;font-weight:800;color:#0F172A;display:flex;justify-content:space-between;align-items:center;">' +
          '<span>فهرست واژه‌های کاربردی</span>' +
          '<span style="font-size:11.5px;color:#64748B;">' + faNum(totalAvailable) + ' واژه</span>' +
        '</div>';

        if (!D) {
          bodyHtml += '<div class="tl-wait" style="text-align:center;padding:40px 20px;"><div class="spinner"></div><span style="font-size:13px;color:#64748B;margin-top:10px;display:block;">در حال بارگذاری واژه‌ها…</span></div>';
        } else if (displayedWords.length === 0) {
          bodyHtml += '<div class="tl-wait" style="text-align:center;padding:40px 20px;"><span style="font-size:13px;color:#64748B;">هیچ واژه‌ای در این سطح یافت نشد.</span></div>';
        } else {
          bodyHtml += '<div class="tl-drows">' +
            displayedWords.map(renderWordRow).join("") +
          '</div>';

          // دکمه نمایش واژه‌های بیشتر
          if (displayedWords.length < totalAvailable) {
            bodyHtml += '<div style="padding:14px 18px 34px;text-align:center;">' +
              '<button class="lb-more-btn" data-act="libMoreWords" ' +
                'style="width:100%;height:46px;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:14px;color:#0F172A;font-size:13.5px;font-weight:800;cursor:pointer;font-family:var(--f, inherit);transition:all 0.15s ease;">' +
                'نمایش واژه‌های بیشتر (+ ' + faNum(Math.min(PAGE_SIZE, totalAvailable - displayedWords.length)) + ' واژه دیگر)' +
              '</button>' +
            '</div>';
          } else {
            bodyHtml += '<div style="padding:16px 18px 30px;text-align:center;font-size:12px;color:#94A3B8;font-family:var(--f, inherit);">' +
              'پایان فهرست واژگان' +
            '</div>';
          }
        }
      }

      return '<div class="scr scr--tabs lb tl-col" style="padding:0;margin:0;width:100%;height:100%;overflow-y:auto;overflow-x:hidden;">' +
        headerHtml +
        searchBoxHtml +
        chipsHtml +
        '<div class="tl-body" style="padding:0;">' +
          bodyHtml +
        '</div>' +
      '</div>';
    }
  };

  // مدیریت رویدادهای اختصاصی لغت‌نامه کتابخانه
  document.addEventListener("click", function(ev) {
    var target = ev.target && ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (!target) return;
    var act = target.getAttribute("data-act");
    if (!act || act.slice(0, 3) !== "lib") return;

    var arg = target.getAttribute("data-arg") || "";
    var v = n.App && App.v;
    if (!v) return;
    if (!v.lib) v.lib = { lv: "ALL", page: 1 };

    if (act === "libSetLevel") {
      v.lib.lv = arg || "ALL";
      v.lib.page = 1;
      if (n.App && App.rerender) App.rerender();
      else if (n.App && App.render) App.render();
    } else if (act === "libMoreWords") {
      v.lib.page = (v.lib.page || 1) + 1;
      if (n.App && App.rerender) App.rerender();
      else if (n.App && App.render) App.render();
    } else if (act === "libClearDict") {
      v.dictQuery = "";
      v.lnQuery = "";
      var inp = document.getElementById("libDictSearchInput");
      if (inp) {
        inp.value = "";
        inp.focus();
      }
      if (n.App && App.rerender) App.rerender();
      else if (n.App && App.render) App.render();
    }
  }, true);

}(window);
