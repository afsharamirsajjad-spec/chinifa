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
  function runChecks() {
    sanitizeDomLoaders();
    removeSleepingDragon();
    enhanceSubtasksScreen();
    enhanceExerciseScreen();
  }

  function initObserver() {
    var observer = new MutationObserver(function() {
      runChecks();
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
      setTimeout(runChecks, 50);
      return res;
    };

    runChecks();
    initObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(hookApp, 200);
    });
  } else {
    setTimeout(hookApp, 200);
  }

}(window);
