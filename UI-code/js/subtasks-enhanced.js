/* ============================================================
   subtasks-enhanced.js — ارتقای زیرمجموعه آموزشی، پاپ‌آپ‌ها و لودرها
   chinifa Persian-RTL / Chinese
   ============================================================ */
!function(w) {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     ۰. ریدایرکت سراسری فایل‌های سگ شیبا به اژدهای پرانرژی چینی
  ────────────────────────────────────────────────────────── */
  if (w.CC && typeof w.CC.asset === 'function') {
    var origAsset = w.CC.asset;
    w.CC.asset = function(path) {
      if (typeof path === 'string') {
        // حذف کامل ویدیوهای وبم سگ
        if (/load-write.*\.webm$/i.test(path) || /shiba-.*\.webm$/i.test(path)) {
          return '';
        }
        // ریدایرکت تصویر سگ در حال نوشتن به اژدهای دونده
        if (/load-write.*\.webp$/i.test(path)) {
          return origAsset.call(this, 'art/mascot-run.webp');
        }
        // ریدایرکت سگ پایان داستان به اژدهای کتاب‌خوان
        if (/end-read\.webp$/i.test(path)) {
          return origAsset.call(this, 'art/mascot-read.webp');
        }
        // ریدایرکت سگ طلایی به اژدهای ستاره‌دار
        if (/shiba-still-gold\.webp$/i.test(path)) {
          return origAsset.call(this, 'art/mascot-star.webp');
        }
        // ریدایرکت سایر سگ‌ها به اژدهای دست‌تکان‌دهنده
        if (/shiba-.*\.webp$/i.test(path)) {
          return origAsset.call(this, 'art/mascot-wave-clear.webp');
        }
      }
      return origAsset.apply(this, arguments);
    };
  }

  function asset(p) {
    return (w.CC && CC.asset) ? CC.asset(p) : p;
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toFaNum(n) {
    return String(n).replace(/\d/g, function(d) {
      return '۰۱۲۳۴۵۶۷۸۹'[d];
    });
  }

  /* ──────────────────────────────────────────────────────────
     ۱. بازنویسی اختصاصی لودر برنامه (جایگزینی سگ با اژدها در بازی‌ها و خواندن)
  ────────────────────────────────────────────────────────── */
  function overrideLoadingMascot() {
    if (!w.UI) return setTimeout(overrideLoadingMascot, 100);

    w.UI.loadingMascot = function(t) {
      var size = Math.round(t || 140);
      var isGame = (w.App && (w.App.screen === 'games' || w.App.screen === 'stack' || w.App.screen === 'town')) ||
                   document.querySelector('.stack, .town, .gm-body, .stack__wait, .town__wait');
      var isRead = (w.App && (w.App.screen === 'stories' || w.App.screen === 'podcast' || (w.App.v && w.App.v.exTab === 'read'))) ||
                   document.querySelector('.ex-pane--read, .pd-wait, .st-grid, .st-page');

      var dragonSrc = isRead
        ? asset('art/mascot-read.webp')
        : isGame
        ? asset('art/mascot-run.webp')
        : asset('art/mascot-run.webp');

      var label = isRead
        ? 'در حال آماده‌سازی داستان...'
        : isGame
        ? 'در حال آماده‌سازی بازی...'
        : 'در حال بارگذاری...';

      return (
        '<div class="dragon-loader-box ' + (isRead ? 'dragon-loader--read' : isGame ? 'dragon-loader--game' : '') + '" style="width:' + size + 'px;height:' + size + 'px" aria-hidden="true">' +
          '<div class="dragon-loader-spin"></div>' +
          '<img class="dragon-loader-img" src="' + dragonSrc + '" alt="' + label + '">' +
          '<div class="dragon-loader-sparks">' +
            '<span class="spk spk-1">✨</span>' +
            '<span class="spk spk-2">⭐</span>' +
            '<span class="spk spk-3">✨</span>' +
          '</div>' +
        '</div>'
      );
    };
  }
  overrideLoadingMascot();

  /* ──────────────────────────────────────────────────────────
     ۲. اصلاح لودرهای زنده در DOM اگر ویدیوی سگ لود شده باشد
  ────────────────────────────────────────────────────────── */
  function sanitizeDomLoaders() {
    // اصلاح هر ویدیویی با آیدی kc-load-write یا مربوط به سگ
    var dogVideos = document.querySelectorAll('video#kc-load-write, video[src*="load-write"], video[src*="shiba"]');
    for (var i = 0; i < dogVideos.length; i++) {
      var v = dogVideos[i];
      var parent = v.parentElement;
      if (parent) {
        var isRead = document.querySelector('.ex-pane--read, .pd-wait, .st-grid') || (w.App && w.App.v && w.App.v.exTab === 'read');
        var img = document.createElement('img');
        img.className = 'dragon-loader-img';
        img.src = isRead ? asset('art/mascot-read.webp') : asset('art/mascot-run.webp');
        img.alt = 'اژدهای در حال بارگذاری';
        parent.replaceChild(img, v);
      }
    }

    // اصلاح تصاویر سگ باقیمانده در لودینگ‌ها
    var dogImgs = document.querySelectorAll('img[src*="load-write"], img[src*="shiba-still"], img[src*="shiba-wave"]');
    for (var j = 0; j < dogImgs.length; j++) {
      var di = dogImgs[j];
      var isReading = di.closest('.ex-read, .st-end, .pd-wait') || (w.App && w.App.v && w.App.v.exTab === 'read');
      di.src = isReading ? asset('art/mascot-read.webp') : asset('art/mascot-run.webp');
    }
  }

  /* ──────────────────────────────────────────────────────────
     ۳. پاپ‌آپ با اژدهای خوابیده (Sleeping Dragon on Popup)
  ────────────────────────────────────────────────────────── */
  function removeSleepingDragon() {
    var dragons = document.querySelectorAll('.sleeping-dragon-host');
    for (var i = 0; i < dragons.length; i++) {
      dragons[i].remove();
    }
  }

  /* ──────────────────────────────────────────────────────────
     ۴. ارتقای صفحه زیرمجموعه آموزشی (Subtasks Mini-Path Screen)
  ────────────────────────────────────────────────────────── */
  function enhanceSubtasksScreen() {
    var screen = document.querySelector('.u-subtasks-screen');
    if (!screen) return;

    var list = screen.querySelector('.u-subtasks-list');
    if (!list) return;

    // الف) بنر راهنمای اژدها در بالای مراحل
    if (!screen.querySelector('.u-subtasks-hero-card')) {
      var items = list.querySelectorAll('.u-subtask-item');
      var total = items.length || 6;
      var doneCount = list.querySelectorAll('.u-subtask-item.is-done').length;
      var pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

      var hero = document.createElement('div');
      hero.className = 'u-subtasks-hero-card';
      hero.innerHTML =
        '<div class="u-subtasks-hero-dragon">' +
          '<img src="' + asset('art/mascot-wave-clear.webp') + '" alt="راهنما">' +
        '</div>' +
        '<div class="u-subtasks-hero-info">' +
          '<span class="u-subtasks-hero-badge">مسیر یادگیری واژگان 🐉</span>' +
          '<h3 class="u-subtasks-hero-title">واژگان این بخش را فتح کن!</h3>' +
          '<p class="u-subtasks-hero-sub">' +
            toFaNum(doneCount) + ' از ' + toFaNum(total) + ' مرحله تکمیل شده (' + toFaNum(pct) + '٪ پیشرفت)' +
          '</p>' +
          '<div class="u-subtasks-hero-bar">' +
            '<div class="u-subtasks-hero-fill" style="width:' + pct + '%"></div>' +
          '</div>' +
        '</div>';

      list.parentNode.insertBefore(hero, list);
    }

    // ب) اصلاح و ارتقای کارت‌های هر مرحله
    var stageItems = list.querySelectorAll('.u-subtask-item');
    for (var i = 0; i < stageItems.length; i++) {
      var item = stageItems[i];
      if (item.classList.contains('subtask-enhanced')) continue;
      item.classList.add('subtask-enhanced');

      var isDone = item.classList.contains('is-done');
      var isCur = item.classList.contains('is-cur');
      var isLock = item.classList.contains('is-locked');

      var numEl = item.querySelector('.u-subtask-num');
      if (numEl && !numEl.querySelector('.stage-status-badge')) {
        var badge = document.createElement('span');
        badge.className = 'stage-status-badge';
        badge.style.cssText =
          'display:inline-flex;align-items:center;padding:2px 8px;border-radius:6px;font-size:10.5px;font-weight:800;margin-right:6px;';

        if (isDone) {
          badge.style.background = '#DCFCE7';
          badge.style.color = '#15803D';
          badge.textContent = 'تکمیل شد ✓';
        } else if (isCur) {
          badge.style.background = '#FEF3C7';
          badge.style.color = '#B45309';
          badge.style.border = '1px solid #FDE68A';
          badge.textContent = 'آماده شروع ⚡';
        } else if (isLock) {
          badge.style.background = '#F1F5F9';
          badge.style.color = '#94A3B8';
          badge.textContent = 'قفل 🔒';
        }

        numEl.appendChild(badge);
      }

      // هندل کردن لرزش قفل در هنگام لمس مرحله قفل شده
      if (isLock) {
        item.addEventListener('click', function(e) {
          var target = e.currentTarget;
          target.classList.add('shake-locked');
          setTimeout(function() {
            target.classList.remove('shake-locked');
          }, 450);
        });
      }
    }
  }

  /* ──────────────────────────────────────────────────────────
     ۵. ارتقای صفحه تمرین (Exercise Screen)
  ────────────────────────────────────────────────────────── */
  function enhanceExerciseScreen() {
    var exScreen = document.querySelector('.u-screen--exercise');
    if (!exScreen) return;

    // انیمیشن پالس برای دکمه صدای بزرگ
    var bigAudio = exScreen.querySelector('.u-big-audio:not(.audio-enhanced)');
    if (bigAudio) {
      bigAudio.classList.add('audio-enhanced');
      bigAudio.addEventListener('click', function() {
        bigAudio.style.transform = 'scale(0.94)';
        setTimeout(function() {
          bigAudio.style.transform = '';
        }, 150);
      });
    }
  }

  /* ──────────────────────────────────────────────────────────
     ۶. راه‌اندازی و مانیتورینگ تغییرات DOM
  ────────────────────────────────────────────────────────── */
  var isChecking = false;
  var checkQueued = false;

  function runChecks() {
    if (isChecking) return;
    isChecking = true;
    try {
      sanitizeDomLoaders();
      removeSleepingDragon();
      enhanceSubtasksScreen();
      enhanceExerciseScreen();
    } finally {
      isChecking = false;
    }
  }

  function scheduleChecks() {
    if (checkQueued || isChecking) return;
    checkQueued = true;
    var flush = function() {
      checkQueued = false;
      runChecks();
    };
    if (typeof w.requestAnimationFrame === 'function') {
      w.requestAnimationFrame(flush);
    } else {
      setTimeout(flush, 16);
    }
  }

  function initObserver() {
    var observer = new MutationObserver(function(mutations) {
      if (isChecking) return;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length) {
          scheduleChecks();
          break;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function hookApp() {
    if (!w.App || (typeof w.App.rerender !== 'function' && typeof w.App.render !== 'function')) {
      return setTimeout(hookApp, 150);
    }

    var prevRender = w.App.rerender || w.App.render;
    w.App.rerender = function() {
      var res = prevRender.apply(this, arguments);
      scheduleChecks();
      return res;
    };

    runChecks();
    initObserver();
  }

  /* ──────────────────────────────────────────────────────────
     ۷. اتصال زنده به تنظیمات ادمین (بنر اعلان، تعمیرات، نسخه) و ارسال بازخورد
  ────────────────────────────────────────────────────────── */
  function cmpVer(a, b) {
    var pa = String(a || '0').split('.').map(function(x) { return parseInt(x, 10) || 0; });
    var pb = String(b || '0').split('.').map(function(x) { return parseInt(x, 10) || 0; });
    for (var i = 0; i < 3; i++) {
      var d = (pa[i] || 0) - (pb[i] || 0);
      if (d !== 0) return d < 0 ? -1 : 1;
    }
    return 0;
  }

  function ensureLiveStyles() {
    if (document.getElementById('chinifa-live-cfg-css')) return;
    var st = document.createElement('style');
    st.id = 'chinifa-live-cfg-css';
    st.textContent =
      '#chinifa-ann-banner{margin:10px 14px 4px;padding:10px 14px;border-radius:14px;background:linear-gradient(135deg,#ECFDF5 0%,#D1FAE5 100%);border:1.5px solid #34D399;color:#065F46;display:flex;align-items:center;gap:10px;font-size:13px;font-weight:700;line-height:1.6;box-shadow:0 4px 14px rgba(16,185,129,0.12);direction:rtl;text-align:right;position:relative;z-index:10}' +
      '#chinifa-ann-banner .cf-ann-ico{font-size:18px;flex:0 0 auto}' +
      '#chinifa-ann-banner .cf-ann-txt{flex:1;min-width:0;word-break:break-word}' +
      '#chinifa-ann-banner .cf-ann-x{background:rgba(6,95,70,0.1);border:none;color:#065F46;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:0 0 auto}' +
      '#chinifa-maint-wall{position:fixed;inset:0;z-index:999998;background:radial-gradient(circle at 50% 30%,#065F46 0%,#0B121A 80%);color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;direction:rtl;text-align:center}' +
      '#chinifa-maint-wall .cf-mw-card{max-width:380px;width:100%;background:rgba(19,29,41,0.92);border:1px solid rgba(52,211,153,0.35);border-radius:22px;padding:28px 22px;box-shadow:0 20px 50px rgba(0,0,0,0.5)}' +
      '#chinifa-maint-wall img{width:96px;height:96px;object-fit:contain;margin-bottom:10px}' +
      '#chinifa-maint-wall h2{margin:0 0 8px;font-size:19px;font-weight:900;color:#fff}' +
      '#chinifa-maint-wall p{margin:0 0 18px;font-size:13.5px;line-height:1.8;color:#CBD5E1}' +
      '#chinifa-maint-wall button{background:#10B981;color:#04241A;border:none;border-radius:12px;padding:10px 22px;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer}' +
      '#chinifa-fb-modal{position:fixed;inset:0;z-index:999990;background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px;direction:rtl;text-align:right}' +
      '#chinifa-fb-modal .cf-fb-win{width:100%;max-width:420px;background:#fff;color:#0F172A;border-radius:20px;padding:20px;box-shadow:0 24px 60px rgba(15,23,42,0.3)}' +
      '#chinifa-fb-modal h3{margin:0 0 4px;font-size:17px;font-weight:900;color:#0F172A}' +
      '#chinifa-fb-modal .cf-fb-sub{margin:0 0 14px;font-size:12.5px;color:#64748B}' +
      '#chinifa-fb-modal label{display:block;font-size:12px;font-weight:700;color:#334155;margin:10px 0 4px}' +
      '#chinifa-fb-modal select,#chinifa-fb-modal input,#chinifa-fb-modal textarea{width:100%;box-sizing:border-box;border:1.5px solid #E2E8F0;border-radius:11px;padding:9px 11px;font-family:inherit;font-size:13px;background:#F8FAFC;color:#0F172A}' +
      '#chinifa-fb-modal textarea{min-height:92px;resize:vertical}' +
      '#chinifa-fb-modal .cf-fb-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}' +
      '#chinifa-fb-modal .cf-fb-cancel{background:#F1F5F9;color:#475569;border:none;border-radius:11px;padding:9px 16px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}' +
      '#chinifa-fb-modal .cf-fb-send{background:#10B981;color:#fff;border:none;border-radius:11px;padding:9px 18px;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer}';
    document.head.appendChild(st);
  }

  function renderAppConfigOverlays() {
    var cfg = w.__chinifaAppConfig;
    if (!cfg) return;
    ensureLiveStyles();

    // 1. حالت تعمیرات یا نسخه قدیمی نامعتبر
    var curVer = (w.T && w.T.version) ? w.T.version : '2.4.0';
    var forceUpgrade = !!(cfg.minSupportedVersion && cmpVer(curVer, cfg.minSupportedVersion) < 0);
    var wall = document.getElementById('chinifa-maint-wall');
    if (cfg.maintenanceMode || forceUpgrade) {
      if (!wall) {
        wall = document.createElement('div');
        wall.id = 'chinifa-maint-wall';
        document.body.appendChild(wall);
      }
      var title = forceUpgrade ? 'به‌روزرسانی الزامی نسخه جدید' : 'در حال به‌روزرسانی و تعمیرات';
      var bodyMsg = forceUpgrade
        ? ('نسخه فعلی شما (' + esc(curVer) + ') قدیمی است. لطفاً نسخه ' + esc(cfg.appVersion || 'جدید') + ' را نصب کنید.')
        : (cfg.announcementText || 'سرورهای چی‌نی‌فا در حال به‌روزرسانی هستند. لطفاً دقایقی دیگر مجدداً تلاش کنید.');
      wall.innerHTML =
        '<div class="cf-mw-card">' +
          '<img src="' + asset('art/mascot-sleep.webp') + '" alt="">' +
          '<h2>' + esc(title) + '</h2>' +
          '<p>' + esc(bodyMsg) + '</p>' +
          (forceUpgrade
            ? '<button type="button" id="cfMwAction">دانلود نسخه جدید</button>'
            : '<button type="button" id="cfMwAction">تلاش مجدد</button>') +
        '</div>';
      var mwBtn = document.getElementById('cfMwAction');
      if (mwBtn) {
        mwBtn.onclick = function() {
          if (forceUpgrade) {
            try { w.open('https://www.chinifarsi.ir/Chinifa.apk', '_blank'); } catch(e) {}
          } else {
            fetchLiveAppConfig(true);
          }
        };
      }
      return;
    } else if (wall) {
      wall.remove();
    }

    // 2. بنر اعلان سراسری روی صفحه خانه
    var existingBan = document.getElementById('chinifa-ann-banner');
    var annTxt = String(cfg.announcementText || '').trim();
    var dismissed = '';
    try { dismissed = sessionStorage.getItem('chinifa_ann_dismissed') || ''; } catch(e) {}
    var shouldShow = !!(cfg.announcementActive && annTxt && dismissed !== annTxt && (!w.App || w.App.screen === 'home'));
    if (!shouldShow) {
      if (existingBan) existingBan.remove();
      return;
    }
    var host = document.getElementById('screen-host');
    if (!host) return;
    var roadmap = host.querySelector('.kan-home-roadmap');
    if (!existingBan) {
      existingBan = document.createElement('div');
      existingBan.id = 'chinifa-ann-banner';
      existingBan.innerHTML =
        '<span class="cf-ann-ico">📢</span>' +
        '<span class="cf-ann-txt"></span>' +
        '<button type="button" class="cf-ann-x" aria-label="بستن">✕</button>';
      existingBan.querySelector('.cf-ann-x').onclick = function() {
        try { sessionStorage.setItem('chinifa_ann_dismissed', annTxt); } catch(e) {}
        existingBan.remove();
      };
    }
    var txtEl = existingBan.querySelector('.cf-ann-txt');
    if (txtEl && txtEl.textContent !== annTxt) txtEl.textContent = annTxt;
    if (existingBan.parentNode !== host) {
      host.insertBefore(existingBan, roadmap || host.firstChild);
    }
  }

  var lastCfgFetch = 0;
  function fetchLiveAppConfig(force) {
    if (!force && Date.now() - lastCfgFetch < 30000) return;
    lastCfgFetch = Date.now();
    var url = (w.CC && typeof w.CC.api === 'function') ? w.CC.api('api/auth?action=app-config') : '/api/auth?action=app-config';
    fetch(url, { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(d) {
        if (d && d.ok && d.settings) {
          w.__chinifaAppConfig = d.settings;
          renderAppConfigOverlays();
        }
      })
      .catch(function() {});
  }

  w.chinifaOpenFeedbackModal = function() {
    ensureLiveStyles();
    var old = document.getElementById('chinifa-fb-modal');
    if (old) old.remove();

    var curEmail = (w.Sync && w.Sync.state && w.Sync.state.email) || '';
    var curName = (w.Store && w.Store.state && (w.Store.state.nick || w.Store.state.name)) || (w.Sync && w.Sync.state && w.Sync.state.username) || '';

    var modal = document.createElement('div');
    modal.id = 'chinifa-fb-modal';
    modal.innerHTML =
      '<div class="cf-fb-win" role="dialog" aria-label="ارسال نظر و پشتیبانی">' +
        '<h3>ارسال نظر و پشتیبانی</h3>' +
        '<p class="cf-fb-sub">پیام شما مستقیماً به پنل مدیریت چی‌نی‌فا ارسال می‌شود.</p>' +
        '<label>نوع پیام</label>' +
        '<select id="cfFbType">' +
          '<option value="پیشنهاد">💡 پیشنهاد</option>' +
          '<option value="گزارش باگ">🐞 گزارش خطا / باگ</option>' +
          '<option value="سوال آموزشی">📚 سؤال آموزشی</option>' +
          '<option value="تقدیر و رضایت">⭐ نظر و رضایت</option>' +
        '</select>' +
        '<label>نام شما</label>' +
        '<input type="text" id="cfFbName" value="' + esc(curName) + '" placeholder="نام (اختیاری)">' +
        '<label>ایمیل (اختیاری)</label>' +
        '<input type="email" id="cfFbEmail" dir="ltr" value="' + esc(curEmail) + '" placeholder="name@example.com">' +
        '<label>متن پیام</label>' +
        '<textarea id="cfFbMsg" placeholder="نظر، پیشنهاد یا مشکل خود را بنویسید..."></textarea>' +
        '<div class="cf-fb-actions">' +
          '<button type="button" class="cf-fb-cancel">انصراف</button>' +
          '<button type="button" class="cf-fb-send">ارسال پیام</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    modal.querySelector('.cf-fb-cancel').onclick = function() { modal.remove(); };

    var sendBtn = modal.querySelector('.cf-fb-send');
    sendBtn.onclick = function() {
      var type = modal.querySelector('#cfFbType').value;
      var name = modal.querySelector('#cfFbName').value.trim();
      var email = modal.querySelector('#cfFbEmail').value.trim();
      var msg = modal.querySelector('#cfFbMsg').value.trim();
      if (msg.length < 3) {
        if (w.UI && w.UI.toast) w.UI.toast('لطفاً متن پیام را بنویسید.');
        return;
      }
      sendBtn.disabled = true;
      sendBtn.textContent = 'در حال ارسال...';
      var headers = { 'Content-Type': 'application/json' };
      try {
        var tk = (w.Sync && typeof w.Sync.token === 'function') ? w.Sync.token() : '';
        if (tk) headers.Authorization = 'Bearer ' + tk;
      } catch(e) {}
      var ep = (w.CC && typeof w.CC.api === 'function') ? w.CC.api('api/auth?action=feedback') : '/api/auth?action=feedback';
      fetch(ep, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ type: type, name: name, email: email, message: msg })
      })
        .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
        .then(function(res) {
          if (!res.ok || !res.d || !res.d.ok) {
            throw new Error((res.d && res.d.message) || 'خطا در ارسال پیام');
          }
          modal.remove();
          if (w.UI && w.UI.toast) w.UI.toast('پیام شما با موفقیت ثبت شد ✓');
        })
        .catch(function(err) {
          sendBtn.disabled = false;
          sendBtn.textContent = 'ارسال پیام';
          if (w.UI && w.UI.toast) w.UI.toast(err.message || 'خطا در ارسال پیام');
        });
    };
  };

  document.addEventListener('click', function(e) {
    var fbBtn = e.target && e.target.closest && e.target.closest('[data-act="openFeedbackModal"]');
    if (fbBtn) {
      e.preventDefault();
      e.stopPropagation();
      w.chinifaOpenFeedbackModal();
    }
  }, true);

  var origRunChecks = runChecks;
  runChecks = function() {
    origRunChecks();
    renderAppConfigOverlays();
  };

  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) fetchLiveAppConfig(false);
  });
  setTimeout(function() { fetchLiveAppConfig(true); }, 450);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hookApp, 200);
    });
  } else {
    setTimeout(hookApp, 200);
  }

}(window);
