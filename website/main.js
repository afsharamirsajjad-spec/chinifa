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
    '1': {cnt: 'ایستگاه ۱: الفبا، تُن‌های صوتی و پین‌یین', pct: '20%'},
    '2': {cnt: 'ایستگاه ۲: جملات اسمیه و فعل ربطی 是', pct: '40%'},
    '3': {cnt: 'ایستگاه ۳: جملات سؤالی با 吗 و مالکیت 有', pct: '60%'},
    '4': {cnt: 'ایستگاه ۴: افعال، زمان‌ها و تغییر حالت با 了', pct: '80%'},
    '5': {cnt: 'ایستگاه ۵: تسلط جامع بر ۳۲ مبحث HSK 1', pct: '100%'}
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

  // ۱۰. سیستم احراز هویت واقعی و اعتبارسنجی ایمیل با Resend
  initAuthSystem();

  function initAuthSystem() {
    var authModal = document.getElementById('auth-modal');
    var btnOpenAuth = document.getElementById('btn-open-auth');
    var mobileAuthLink = document.getElementById('mobile-auth-link');
    var btnCloseAuth = document.getElementById('auth-modal-close');
    var userChipMenu = document.getElementById('user-chip-menu');
    var userChipBtn = document.getElementById('user-chip-btn');
    var userDropdownCard = document.getElementById('user-dropdown-card');
    var btnLogout = document.getElementById('btn-logout');

    var formOtpRequest = document.getElementById('form-otp-request');
    var formOtpVerify = document.getElementById('form-otp-verify');
    var formPasswordLogin = document.getElementById('form-password-login');
    var formRegister = document.getElementById('form-register');
    var authAlert = document.getElementById('auth-alert');

    var currentOtpEmail = '';
    var otpTimer = null;

    // بارگذاری اولیه وضعیت جلسه
    updateAuthUI();

    function getSavedUser() {
      try {
        var str = localStorage.getItem('chinifa_auth_user');
        return str ? JSON.parse(str) : null;
      } catch(e) { return null; }
    }

    function updateAuthUI() {
      var user = getSavedUser();
      if (user && user.email) {
        if (btnOpenAuth) btnOpenAuth.hidden = true;
        if (userChipMenu) userChipMenu.hidden = false;
        
        var name = user.fullName || user.email.split('@')[0];
        var initial = name.charAt(0).toUpperCase() || '龙';
        
        var chipName = document.getElementById('user-chip-name');
        var chipAvatar = document.getElementById('user-chip-avatar');
        var dropName = document.getElementById('dropdown-name');
        var dropEmail = document.getElementById('dropdown-email');
        
        if (chipName) chipName.textContent = name;
        if (chipAvatar) chipAvatar.textContent = initial;
        if (dropName) dropName.textContent = name;
        if (dropEmail) dropEmail.textContent = user.email;
        if (mobileAuthLink) mobileAuthLink.textContent = '👤 ' + name;
      } else {
        if (btnOpenAuth) btnOpenAuth.hidden = false;
        if (userChipMenu) userChipMenu.hidden = true;
        if (mobileAuthLink) mobileAuthLink.textContent = '👤 ورود / عضویت';
      }
    }

    function showAlert(text, type) {
      if (!authAlert) return;
      authAlert.hidden = false;
      authAlert.className = 'auth-alert is-' + (type || 'error');
      authAlert.innerHTML = text;
    }

    function hideAlert() {
      if (authAlert) authAlert.hidden = true;
    }

    function openModal() {
      if (!authModal) return;
      authModal.hidden = false;
      hideAlert();
      if (formOtpRequest) formOtpRequest.hidden = false;
      if (formOtpVerify) formOtpVerify.hidden = true;
    }

    function closeModal() {
      if (!authModal) return;
      authModal.hidden = true;
      hideAlert();
      if (otpTimer) clearInterval(otpTimer);
    }

    if (btnOpenAuth) btnOpenAuth.addEventListener('click', openModal);
    if (mobileAuthLink) {
      mobileAuthLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    }
    if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeModal);
    if (authModal) {
      authModal.addEventListener('click', function(e) {
        if (e.target === authModal) closeModal();
      });
    }

    // منوی دراپ‌داون پروفایل
    if (userChipBtn && userDropdownCard) {
      userChipBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdownCard.hidden = !userDropdownCard.hidden;
      });

      document.addEventListener('click', function(e) {
        if (userChipMenu && !userChipMenu.contains(e.target)) {
          userDropdownCard.hidden = true;
        }
      });
    }

    // خروج از حساب
    if (btnLogout) {
      btnLogout.addEventListener('click', function() {
        localStorage.removeItem('chinifa_auth_user');
        localStorage.removeItem('chinifa_auth_token');
        try {
          var chinState = JSON.parse(localStorage.getItem('cheh-chin-state') || '{}');
          chinState.signedIn = false;
          chinState.username = '';
          localStorage.setItem('cheh-chin-state', JSON.stringify(chinState));
        } catch(e) {}
        updateAuthUI();
        if (userDropdownCard) userDropdownCard.hidden = true;
        fetch('/api/auth?action=logout', { method: 'POST' }).catch(function(){});
      });
    }

    // جابجایی بین تب‌ها
    var tabBtns = authModal ? authModal.querySelectorAll('.auth-tab-btn') : [];
    tabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var contents = authModal.querySelectorAll('.auth-tab-content');
        contents.forEach(function(c) { c.classList.remove('active'); });
        var targetContent = document.getElementById('tab-' + targetTab);
        if (targetContent) targetContent.classList.add('active');
        hideAlert();
      });
    });

    // ۱. ارسال کد تایید با Resend
    if (formOtpRequest) {
      formOtpRequest.addEventListener('submit', async function(e) {
        e.preventDefault();
        var emailInput = document.getElementById('otp-email');
        var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        if (!email) return;

        var submitBtn = document.getElementById('btn-send-otp');
        var origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>در حال ارسال با Resend...</span>';
        }
        hideAlert();

        try {
          var res = await fetch('/api/auth?action=send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
          });
          var data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'خطا در ارسال کد تایید');
          }

          currentOtpEmail = email;
          formOtpRequest.hidden = true;
          if (formOtpVerify) formOtpVerify.hidden = false;

          var sentEmailEl = document.getElementById('sent-email-display');
          if (sentEmailEl) sentEmailEl.textContent = email;

          startCountdown(120);

          if (data.devMode && data.code) {
            showAlert('حالت تستی فعال است: کد تایید شما <strong>' + data.code + '</strong> است (برای ارسال ایمیل واقعی، متغیر RESEND_API_KEY در ورسل تنظیم شود).', 'info');
          } else {
            showAlert('کد تایید ۶ رقمی به ایمیلتان ارسال گردید. لطفاً اینباکس یا اسپم را مشاهده کنید.', 'success');
          }

          var codeInput = document.getElementById('otp-code');
          if (codeInput) {
            codeInput.value = '';
            codeInput.focus();
          }
        } catch (err) {
          showAlert(err.message, 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
          }
        }
      });
    }

    // ویرایش ایمیل در مرحله دوم
    var btnChangeEmail = document.getElementById('btn-change-email');
    if (btnChangeEmail) {
      btnChangeEmail.addEventListener('click', function() {
        if (formOtpVerify) formOtpVerify.hidden = true;
        if (formOtpRequest) formOtpRequest.hidden = false;
        if (otpTimer) clearInterval(otpTimer);
        hideAlert();
      });
    }

    // ارسال مجدد کد
    var btnResendOtp = document.getElementById('btn-resend-otp');
    if (btnResendOtp) {
      btnResendOtp.addEventListener('click', function() {
        if (!currentOtpEmail) return;
        btnResendOtp.disabled = true;
        fetch('/api/auth?action=send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentOtpEmail })
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d.ok) {
            startCountdown(120);
            showAlert('کد تایید مجدداً ارسال گردید.', 'success');
            if (d.devMode && d.code) {
              showAlert('کد تایید جدید: <strong>' + d.code + '</strong>', 'info');
            }
          } else {
            showAlert(d.message || 'خطا در ارسال مجدد', 'error');
          }
        }).catch(function(err) {
          showAlert(err.message, 'error');
        });
      });
    }

    function startCountdown(seconds) {
      if (otpTimer) clearInterval(otpTimer);
      var countdownEl = document.getElementById('otp-countdown');
      var resendBtn = document.getElementById('btn-resend-otp');
      if (resendBtn) resendBtn.disabled = true;

      var remaining = seconds;
      function tick() {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;
        if (countdownEl) {
          countdownEl.textContent = (m < 10 ? '۰' + m : m) + ':' + (s < 10 ? '۰' + s : s);
        }
        if (remaining <= 0) {
          clearInterval(otpTimer);
          if (resendBtn) resendBtn.disabled = false;
          if (countdownEl) countdownEl.textContent = 'منقضی شد';
        }
        remaining--;
      }
      tick();
      otpTimer = setInterval(tick, 1000);
    }

    // ۲. تایید کد ۶ رقمی
    if (formOtpVerify) {
      formOtpVerify.addEventListener('submit', async function(e) {
        e.preventDefault();
        var codeInput = document.getElementById('otp-code');
        var code = codeInput ? codeInput.value.trim() : '';
        if (!code || code.length !== 6) {
          showAlert('لطفاً کد ۶ رقمی دریافتی را کامل وارد کنید.', 'error');
          return;
        }

        var verifyBtn = document.getElementById('btn-verify-otp');
        var origText = verifyBtn ? verifyBtn.innerHTML : '';
        if (verifyBtn) {
          verifyBtn.disabled = true;
          verifyBtn.innerHTML = '<span>در حال بررسی...</span>';
        }
        hideAlert();

        try {
          var res = await fetch('/api/auth?action=verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentOtpEmail, code: code })
          });
          var data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'کد وارد شده صحیح نیست.');
          }

          onAuthSuccess(data);
        } catch (err) {
          showAlert(err.message, 'error');
        } finally {
          if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = origText;
          }
        }
      });
    }

    // ۳. ورود با رمز عبور
    if (formPasswordLogin) {
      formPasswordLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('login-email').value.trim();
        var pass = document.getElementById('login-pass').value;

        var btn = document.getElementById('btn-login-pass');
        var origText = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '<span>در حال ورود...</span>'; }
        hideAlert();

        try {
          var res = await fetch('/api/auth?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
          });
          var data = await res.json();
          if (!res.ok) throw new Error(data.message || 'ایمیل یا رمز عبور اشتباه است.');

          onAuthSuccess(data);
        } catch (err) {
          showAlert(err.message, 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        }
      });
    }

    // ۴. ثبت‌نام جدید
    if (formRegister) {
      formRegister.addEventListener('submit', async function(e) {
        e.preventDefault();
        var name = document.getElementById('reg-name').value.trim();
        var email = document.getElementById('reg-email').value.trim().toLowerCase();
        var pass = document.getElementById('reg-pass').value;

        var btn = document.getElementById('btn-submit-reg');
        var origText = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '<span>در حال ثبت‌نام...</span>'; }
        hideAlert();

        try {
          var res = await fetch('/api/auth?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: pass })
          });
          var data = await res.json();
          if (!res.ok) throw new Error(data.message || 'خطا در ثبت‌نام.');

          currentOtpEmail = email;
          var tabOtpBtn = authModal.querySelector('[data-tab="otp"]');
          if (tabOtpBtn) tabOtpBtn.click();
          if (formOtpRequest) formOtpRequest.hidden = true;
          if (formOtpVerify) formOtpVerify.hidden = false;

          var sentEmailEl = document.getElementById('sent-email-display');
          if (sentEmailEl) sentEmailEl.textContent = email;
          startCountdown(120);

          showAlert('ثبت‌نام انجام شد! کد تایید ۶ رقمی به ایمیل ارسال گردید.', 'success');
        } catch (err) {
          showAlert(err.message, 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        }
      });
    }

    function onAuthSuccess(data) {
      showAlert('خوش آمدید! ورود با موفقیت انجام شد 🌸', 'success');
      try {
        if (data.token) localStorage.setItem('chinifa_auth_token', data.token);
        if (data.user) {
          localStorage.setItem('chinifa_auth_user', JSON.stringify(data.user));
          
          var chinState = JSON.parse(localStorage.getItem('cheh-chin-state') || '{}');
          chinState.signedIn = true;
          chinState.username = data.user.fullName || data.user.email;
          chinState.email = data.user.email;
          chinState.accountId = data.user.id;
          localStorage.setItem('cheh-chin-state', JSON.stringify(chinState));

          var v1State = JSON.parse(localStorage.getItem('chinifa.v1') || '{}');
          v1State.userName = data.user.fullName;
          v1State.userEmail = data.user.email;
          localStorage.setItem('chinifa.v1', JSON.stringify(v1State));
        }
      } catch(e) {}

      updateAuthUI();
      setTimeout(closeModal, 1200);
    }
  }

});
