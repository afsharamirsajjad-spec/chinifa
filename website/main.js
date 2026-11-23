/* ============================================================
   chinifa (چی‌نی‌فا) — اسکریپت تعاملی وب‌سایت
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ۱. نوار هدر و منوی همبرگری موبایل
  var menuToggle = document.getElementById('menu-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('is-open');
    });

    // بستن منو با کلیک روی هر لینک
    var navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('is-open');
      });
    });
  }

  // ۲. مدیریت باز و بسته شدن مودال QR Code
  var btnOpenQr = document.getElementById('btn-open-qr');
  var qrModal = document.getElementById('qr-modal');
  var btnCloseQr = document.getElementById('qr-modal-close');

  if (btnOpenQr && qrModal) {
    btnOpenQr.addEventListener('click', function() {
      qrModal.hidden = false;
    });

    if (btnCloseQr) {
      btnCloseQr.addEventListener('click', function() {
        qrModal.hidden = true;
      });
    }

    // بستن مودال با کلیک روی پس‌زمینه بیرونی
    qrModal.addEventListener('click', function(e) {
      if (e.target === qrModal) {
        qrModal.hidden = true;
      }
    });

    // بستن با کلید Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !qrModal.hidden) {
        qrModal.hidden = true;
      }
    });
  }

  // ۳. ایجاد سایه شیشه‌ای روی هدر هنگام اسکرول
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // ۴. انیمیشن شمارنده اعداد آمار هنگام ورود به ویوپورت
  var statNumbers = document.querySelectorAll('.stat-num[data-count]');
  var statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    var statsSection = document.querySelector('.stats-strip');
    if (!statsSection) return;

    var rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 50) {
      statsAnimated = true;
      statNumbers.forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        var start = 0;
        var duration = 1200;
        var stepTime = 25;
        var steps = duration / stepTime;
        var increment = target / steps;

        var timer = setInterval(function() {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          // نمایش فارسی رقم‌ها
          var formatted = Math.floor(start).toLocaleString('fa-IR');
          if (target === 300) formatted += '+';
          if (target === 100) formatted += '٪';
          el.textContent = formatted;
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // اجرای اولیه در صورتی که صفحه لود شده باشد

  // ۵. تعامل دکمه دانلود (نشان دادن فیدبک شروع دانلود)
  var heroDlBtn = document.getElementById('hero-download-btn');
  if (heroDlBtn) {
    heroDlBtn.addEventListener('click', function() {
      var origText = heroDlBtn.querySelector('.btn-maintext');
      if (origText) {
        var prev = origText.textContent;
        origText.textContent = 'در حال آماده‌سازی دانلود...';
        setTimeout(function() {
          origText.textContent = prev;
        }, 2500);
      }
    });
  }

  // ۶. دکمه باز کردن مستقیم اپلیکیشن (Deep Linking & Web App Fallback)
  var btnOpenApp = document.getElementById('btn-open-app');
  if (btnOpenApp) {
    btnOpenApp.addEventListener('click', function() {
      var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        var start = Date.now();
        // تلاش برای باز کردن با intent یا scheme اپلیکیشن
        window.location.href = 'intent://open#Intent;scheme=chinifa;package=com.chinifa.app;end';
        setTimeout(function() {
          if (Date.now() - start < 1500) {
            // در صورت عدم نصب، دانلود فایل APK آغاز می‌شود
            var dl = document.getElementById('hero-download-btn');
            if (dl) dl.click();
          }
        }, 800);
      } else {
        // روی کامپیوتر مستقیماً نسخه تحت وب باز می‌شود
        window.open('../app/index.html', '_blank');
      }
    });
  }

  // ۷. تب‌های سطوح گرامر HSK
  var hskTabs = document.querySelectorAll('.hsk-tab-btn');
  var gpText = document.querySelector('.gp-text b');
  var gpFill = document.querySelector('.gp-fill');
  var gPointsCount = {
    '1': {cnt: '۳۲ مبحث کلیدی', pct: '100%'},
    '2': {cnt: '۴۸ مبحث سطح دوم', pct: '85%'},
    '3': {cnt: '۶۴ مبحث سطح متوسط', pct: '70%'},
    '4': {cnt: '۸۲ مبحث تخصصی', pct: '55%'},
    '5': {cnt: '۱۰۵ مبحث پیشرفته', pct: '40%'},
    '6': {cnt: '۱۳۰ مبحث تسلط کامل', pct: '25%'}
  };

  hskTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      hskTabs.forEach(function(t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var lvl = tab.getAttribute('data-level');
      if (gPointsCount[lvl] && gpText && gpFill) {
        gpText.textContent = gPointsCount[lvl].cnt;
        gpFill.style.width = gPointsCount[lvl].pct;
      }
    });
  });

  // ۸. ویجت آزمون تعاملی آنلاین گرامر در وب‌سایت
  var quizData = [
    {
      q: 'برای تبدیل جمله «他是老师» (او معلم است) به حالت پرسشی، کدام واژه در انتهای جمله قرار می‌گیرد؟',
      opts: ['A) 了 (le)', 'B) 吗 (ma)', 'C) 呢 (ne)', 'D) 的 (de)'],
      ans: 1,
      exp: 'آفرین! در دستور زبان چینی، برای سؤالی کردن جملات خبری، ذره «吗» به انتهای جمله اضافه می‌شود.'
    },
    {
      q: 'در ساختار جمله «我 __ 一本书» برای بیان مالکیت (داشتن کتاب) کدام فعل صحیح است؟',
      opts: ['A) 是 (shì)', 'B) 有 (yǒu)', 'C) 在 (zài)', 'D) 会 (huì)'],
      ans: 1,
      exp: 'دقیقاً! فعل «有» به معنای داشتن و وجود است و منفی آن «没有» می‌باشد.'
    },
    {
      q: 'کدام گزینه برای بیان تغییر وضعیت یا رخداد به کار می‌رود؟ (مانند: 太好了)',
      opts: ['A) 了 (le)', 'B) 不 (bù)', 'C) 很 (hěn)', 'D) 没 (méi)'],
      ans: 0,
      exp: 'عالی! کلمه «了» نشان‌دهنده تغییر حالت، تکمیل یا وقوع رویداد است.'
    }
  ];

  var curQuiz = 0;
  var qStepLbl = document.getElementById('quiz-step-label');
  var qTxt = document.getElementById('quiz-question-txt');
  var qOptsList = document.getElementById('quiz-options-list');
  var qFeedback = document.getElementById('quiz-feedback');
  var btnNextQ = document.getElementById('btn-next-quiz');

  function renderQuiz(idx) {
    if (!qTxt || !qOptsList) return;
    var data = quizData[idx];
    if (qStepLbl) qStepLbl.textContent = 'سؤال ' + (idx + 1).toLocaleString('fa-IR') + ' از ' + quizData.length.toLocaleString('fa-IR');
    qTxt.textContent = data.q;
    qOptsList.innerHTML = '';
    if (qFeedback) qFeedback.hidden = true;
    if (btnNextQ) btnNextQ.style.display = 'none';

    data.opts.forEach(function(optText, oIdx) {
      var btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.setAttribute('data-idx', oIdx);
      btn.innerHTML = '<span>' + optText + '</span>';
      btn.addEventListener('click', function() {
        handleQuizAnswer(idx, oIdx, btn);
      });
      qOptsList.appendChild(btn);
    });
  }

  function handleQuizAnswer(qIdx, selectedIdx, clickedBtn) {
    var data = quizData[qIdx];
    var allBtns = qOptsList.querySelectorAll('.quiz-opt');
    allBtns.forEach(function(b) { b.disabled = true; });

    if (qFeedback) {
      qFeedback.hidden = false;
      var statusEl = qFeedback.querySelector('.qf-status');
      var expEl = qFeedback.querySelector('.qf-explanation');

      if (selectedIdx === data.ans) {
        clickedBtn.classList.add('opt-correct');
        statusEl.textContent = '✅ پاسخ شما کاملاً درست است!';
        statusEl.style.color = '#2bd19d';
        expEl.textContent = data.exp;
      } else {
        clickedBtn.classList.add('opt-wrong');
        allBtns[data.ans].classList.add('opt-correct');
        statusEl.textContent = '❌ پاسخ اشتباه بود!';
        statusEl.style.color = '#ef4444';
        expEl.textContent = 'گزینه صحیح: ' + data.opts[data.ans] + ' — ' + data.exp;
      }
    }

    if (btnNextQ && qIdx < quizData.length - 1) {
      btnNextQ.style.display = 'inline-flex';
    }
  }

  if (btnNextQ) {
    btnNextQ.addEventListener('click', function() {
      curQuiz++;
      if (curQuiz >= quizData.length) curQuiz = 0;
      renderQuiz(curQuiz);
    });
  }

  // ۹. دکمه پیش‌نمایش پخش پادکست نمونه
  var btnDemoPlay = document.getElementById('btn-demo-play');
  if (btnDemoPlay) {
    var isPlaying = false;
    btnDemoPlay.addEventListener('click', function() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        btnDemoPlay.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      } else {
        btnDemoPlay.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      }
    });
  }

});
