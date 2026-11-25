/* ============================================================
   chinifa (چی‌نی‌فا) — اسکریپت تعاملی وب‌سایت
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ۱. منوی موبایل
  var menuToggle = document.getElementById('menu-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      var isOpen = navMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
      });
    });
  }

  // ۲. مودال QR Code
  var btnOpenQr = document.getElementById('btn-open-qr');
  var qrModal = document.getElementById('qr-modal');
  var btnCloseQr = document.getElementById('qr-modal-close');

  if (btnOpenQr && qrModal) {
    btnOpenQr.addEventListener('click', function() {
      qrModal.hidden = false;
    });
    if (btnCloseQr) {
      btnCloseQr.addEventListener('click', function() { qrModal.hidden = true; });
    }
    qrModal.addEventListener('click', function(e) {
      if (e.target === qrModal) qrModal.hidden = true;
    });
  }

  // ۳. سایه هدر هنگام اسکرول
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.style.boxShadow = window.scrollY > 16 ? '0 4px 20px rgba(15, 23, 42, 0.06)' : 'none';
    }, { passive: true });
  }

  // ۴. بازخورد دکمه دانلود APK
  var heroDlBtn = document.getElementById('hero-download-btn');
  if (heroDlBtn) {
    heroDlBtn.addEventListener('click', function() {
      var origText = heroDlBtn.querySelector('.btn-maintext');
      if (origText) {
        var prev = origText.textContent;
        origText.textContent = 'در حال آماده‌سازی دانلود...';
        setTimeout(function() { origText.textContent = prev; }, 2500);
      }
    });
  }

  // ==========================================================================
  // ۵. سیستم احراز هویت یکپارچه (OTP با Resend + ورود با رمز عبور)
  // ==========================================================================
  var authModal = document.getElementById('auth-modal');
  var btnOpenAuth = document.getElementById('btn-open-auth');
  var btnCloseAuth = document.getElementById('auth-modal-close');
  var userChipMenu = document.getElementById('user-chip-menu');
  var userChipBtn = document.getElementById('user-chip-btn');
  var userDropdownCard = document.getElementById('user-dropdown-card');
  var btnLogout = document.getElementById('btn-logout');

  var stepEmail = document.getElementById('auth-step-email');
  var stepOtp = document.getElementById('auth-step-otp');
  var stepPassword = document.getElementById('auth-step-password');
  var authModalTitle = document.getElementById('auth-modal-title');
  var authModalSubtitle = document.getElementById('auth-modal-subtitle');

  var formOtpRequest = document.getElementById('form-otp-request');
  var formOtpVerify = document.getElementById('form-otp-verify');
  var formPasswordLogin = document.getElementById('form-password-login');
  var authAlert = document.getElementById('auth-alert');

  var currentOtpEmail = '';
  var otpTimer = null;

  function getSavedUser() {
    try {
      var str = localStorage.getItem('chinifa_auth_user');
      return str ? JSON.parse(str) : null;
    } catch (e) { return null; }
  }

  function showAuthAlert(text, type) {
    if (!authAlert) return;
    authAlert.hidden = false;
    authAlert.className = 'auth-alert is-' + (type || 'error');
    authAlert.innerHTML = text;
  }

  function hideAuthAlert() {
    if (authAlert) authAlert.hidden = true;
  }

  function showAuthStep(step) {
    if (stepEmail) stepEmail.hidden = step !== 'email';
    if (stepOtp) stepOtp.hidden = step !== 'otp';
    if (stepPassword) stepPassword.hidden = step !== 'password';

    if (authModalTitle && authModalSubtitle) {
      if (step === 'otp') {
        authModalTitle.textContent = 'تایید ایمیل';
        authModalSubtitle.textContent = 'کد ۶ رقمی ارسال‌شده به ایمیلتان را وارد کنید';
      } else if (step === 'password') {
        authModalTitle.textContent = 'ورود با رمز عبور';
        authModalSubtitle.textContent = 'ایمیل و رمز عبور خود را وارد کنید';
      } else {
        authModalTitle.textContent = 'ورود به چی‌نی‌فا';
        authModalSubtitle.textContent = 'برای ورود یا ساخت حساب، ایمیل خود را وارد کنید';
      }
    }
    hideAuthAlert();
  }

  function openAuthModal() {
    if (!authModal) return;
    authModal.hidden = false;
    showAuthStep('email');
    var emailInput = document.getElementById('otp-email');
    if (emailInput) setTimeout(function() { emailInput.focus(); }, 60);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.hidden = true;
    hideAuthAlert();
    if (otpTimer) clearInterval(otpTimer);
  }

  function updateAuthUI() {
    var user = getSavedUser();
    if (user && user.email) {
      if (btnOpenAuth) btnOpenAuth.hidden = true;
      if (userChipMenu) userChipMenu.hidden = false;

      var name = user.fullName || user.email.split('@')[0];
      var initial = name.charAt(0).toUpperCase() || '龙';
      var isProUser = !!(user.isPro || user.pro || localStorage.getItem('chinifa_pro') === 'true');

      var chipName = document.getElementById('user-chip-name');
      var chipAvatar = document.getElementById('user-chip-avatar');
      var dropName = document.getElementById('dropdown-name');
      var dropEmail = document.getElementById('dropdown-email');
      var dropLevel = document.getElementById('dropdown-level');

      if (chipName) chipName.innerHTML = name + (isProUser ? ' <span class="user-chip-pro-badge">PRO</span>' : '');
      if (chipAvatar) chipAvatar.textContent = initial;
      if (dropName) dropName.textContent = name;
      if (dropEmail) dropEmail.textContent = user.email;
      if (dropLevel) dropLevel.textContent = isProUser ? '👑 اشتراک طلایی PRO فعال است' : 'حساب تایید شده';
    } else {
      if (btnOpenAuth) btnOpenAuth.hidden = false;
      if (userChipMenu) userChipMenu.hidden = true;
    }
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

  function onAuthSuccess(data) {
    showAuthAlert('خوش آمدید! ورود با موفقیت انجام شد 🌸', 'success');
    try {
      if (data.token) localStorage.setItem('chinifa_auth_token', data.token);
      if (data.user) {
        localStorage.setItem('chinifa_auth_user', JSON.stringify(data.user));
        if (data.user.isPro || data.user.pro || data.isPro) {
          localStorage.setItem('chinifa_pro', 'true');
        }

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
    } catch (e) {}

    updateAuthUI();
    setTimeout(closeAuthModal, 900);

    if (window._pendingBuyPlan) {
      var p = window._pendingBuyPlan;
      window._pendingBuyPlan = null;
      setTimeout(function() {
        openPaymentModal(p.id, p.name, p.price);
      }, 1000);
    }
  }

  updateAuthUI();

  if (btnOpenAuth) btnOpenAuth.addEventListener('click', openAuthModal);
  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) closeAuthModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (authModal && !authModal.hidden) closeAuthModal();
      if (qrModal && !qrModal.hidden) qrModal.hidden = true;
      if (paymentModal && !paymentModal.hidden) closePaymentModal();
      if (paymentSuccessModal && !paymentSuccessModal.hidden) closePaymentSuccessModal();
    }
  });

  var btnSwitchPassword = document.getElementById('btn-switch-password');
  var btnSwitchOtp = document.getElementById('btn-switch-otp');
  var btnChangeEmail = document.getElementById('btn-change-email');

  if (btnSwitchPassword) {
    btnSwitchPassword.addEventListener('click', function() { showAuthStep('password'); });
  }
  if (btnSwitchOtp) {
    btnSwitchOtp.addEventListener('click', function() { showAuthStep('email'); });
  }
  if (btnChangeEmail) {
    btnChangeEmail.addEventListener('click', function() {
      if (otpTimer) clearInterval(otpTimer);
      showAuthStep('email');
    });
  }

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

  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      localStorage.removeItem('chinifa_auth_user');
      localStorage.removeItem('chinifa_auth_token');
      try {
        var chinState = JSON.parse(localStorage.getItem('cheh-chin-state') || '{}');
        chinState.signedIn = false;
        chinState.username = '';
        localStorage.setItem('cheh-chin-state', JSON.stringify(chinState));
      } catch (e) {}
      updateAuthUI();
      if (userDropdownCard) userDropdownCard.hidden = true;
      fetch('/api/auth?action=logout', { method: 'POST' }).catch(function() {});
    });
  }

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
        submitBtn.innerHTML = '<span>در حال ارسال کد...</span>';
      }
      hideAuthAlert();

      try {
        var res = await fetch('/api/auth?action=send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || 'خطا در ارسال کد تایید');

        currentOtpEmail = email;
        showAuthStep('otp');

        var sentEmailEl = document.getElementById('sent-email-display');
        if (sentEmailEl) sentEmailEl.textContent = email;

        startCountdown(120);

        if (data.devMode && data.code) {
          showAuthAlert('حالت آزمایشی: کد تایید شما <strong>' + data.code + '</strong> است.', 'info');
        } else {
          showAuthAlert('کد تایید به ایمیلتان ارسال شد.', 'success');
        }

        var codeInput = document.getElementById('otp-code');
        if (codeInput) {
          codeInput.value = '';
          setTimeout(function() { codeInput.focus(); }, 60);
        }
      } catch (err) {
        showAuthAlert(err.message, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  }

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
          if (d.devMode && d.code) {
            showAuthAlert('کد تایید جدید: <strong>' + d.code + '</strong>', 'info');
          } else {
            showAuthAlert('کد تایید مجدداً ارسال شد.', 'success');
          }
        } else {
          showAuthAlert(d.message || 'خطا در ارسال مجدد', 'error');
        }
      }).catch(function(err) {
        showAuthAlert(err.message, 'error');
      });
    });
  }

  if (formOtpVerify) {
    formOtpVerify.addEventListener('submit', async function(e) {
      e.preventDefault();
      var codeInput = document.getElementById('otp-code');
      var code = codeInput ? codeInput.value.trim() : '';
      if (!code || code.length !== 6) {
        showAuthAlert('لطفاً کد ۶ رقمی را کامل وارد کنید.', 'error');
        return;
      }

      var verifyBtn = document.getElementById('btn-verify-otp');
      var origText = verifyBtn ? verifyBtn.innerHTML : '';
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<span>در حال بررسی...</span>';
      }
      hideAuthAlert();

      try {
        var res = await fetch('/api/auth?action=verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentOtpEmail, code: code })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.message || 'کد وارد شده صحیح نیست.');

        onAuthSuccess(data);
      } catch (err) {
        showAuthAlert(err.message, 'error');
      } finally {
        if (verifyBtn) {
          verifyBtn.disabled = false;
          verifyBtn.innerHTML = origText;
        }
      }
    });
  }

  if (formPasswordLogin) {
    formPasswordLogin.addEventListener('submit', async function(e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value.trim();
      var pass = document.getElementById('login-pass').value;

      var btn = document.getElementById('btn-login-pass');
      var origText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = '<span>در حال ورود...</span>'; }
      hideAuthAlert();

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
        showAuthAlert(err.message, 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = origText; }
      }
    });
  }

  // ==========================================================================
  // ۶. مدیریت خرید اشتراک Chinify PRO
  // ==========================================================================
  var paymentModal = document.getElementById('payment-modal');
  var paymentSuccessModal = document.getElementById('payment-success-modal');
  var paymentModalClose = document.getElementById('payment-modal-close');
  var btnClosePaymentSuccess = document.getElementById('btn-close-payment-success');
  var btnConfirmPayment = document.getElementById('btn-confirm-payment');
  var payPlanNameEl = document.getElementById('pay-plan-name');
  var payPlanPriceEl = document.getElementById('pay-plan-price');
  var payUserEmailEl = document.getElementById('pay-user-email');
  var paymentAlertEl = document.getElementById('payment-alert');
  var successUserEmailEl = document.getElementById('success-user-email');

  var currentSelectedPlan = { id: 'annual', name: 'اشتراک ۱ ساله (طلایی)', price: '۶,۳۰۰,۰۰۰ تومان' };

  function openPaymentModal(planId, planName, planPrice) {
    var user = getSavedUser();
    if (!user || !user.email) {
      window._pendingBuyPlan = { id: planId, name: planName, price: planPrice };
      openAuthModal();
      showAuthAlert('برای خرید اشتراک، ابتدا ایمیل خود را وارد و تایید کنید.', 'info');
      return;
    }

    currentSelectedPlan = {
      id: planId || 'annual',
      name: planName || 'اشتراک ۱ ساله (طلایی)',
      price: planPrice || '۶,۳۰۰,۰۰۰ تومان'
    };

    if (payPlanNameEl) payPlanNameEl.textContent = currentSelectedPlan.name;
    if (payPlanPriceEl) payPlanPriceEl.textContent = currentSelectedPlan.price;
    if (payUserEmailEl) payUserEmailEl.textContent = user.email;
    if (paymentAlertEl) paymentAlertEl.hidden = true;
    if (paymentModal) paymentModal.hidden = false;
  }

  function closePaymentModal() {
    if (paymentModal) paymentModal.hidden = true;
  }

  function closePaymentSuccessModal() {
    if (paymentSuccessModal) paymentSuccessModal.hidden = true;
  }

  if (paymentModalClose) paymentModalClose.addEventListener('click', closePaymentModal);
  if (btnClosePaymentSuccess) btnClosePaymentSuccess.addEventListener('click', closePaymentSuccessModal);

  if (paymentModal) {
    paymentModal.addEventListener('click', function(e) {
      if (e.target === paymentModal) closePaymentModal();
    });
  }
  if (paymentSuccessModal) {
    paymentSuccessModal.addEventListener('click', function(e) {
      if (e.target === paymentSuccessModal) closePaymentSuccessModal();
    });
  }

  document.querySelectorAll('.btn-buy-plan').forEach(function(btn) {
    btn.addEventListener('click', function() {
      openPaymentModal(
        btn.getAttribute('data-plan') || 'annual',
        btn.getAttribute('data-title') || 'اشتراک ۱ ساله (طلایی)',
        btn.getAttribute('data-price') || '۶,۳۰۰,۰۰۰ تومان'
      );
    });
  });

  if (btnConfirmPayment) {
    btnConfirmPayment.addEventListener('click', function() {
      var user = getSavedUser();
      if (!user || !user.email) {
        closePaymentModal();
        openAuthModal();
        return;
      }

      var btnPayText = document.getElementById('btn-pay-text');
      if (btnPayText) btnPayText.textContent = 'در حال فعال‌سازی...';
      btnConfirmPayment.disabled = true;

      fetch('/api/auth?action=subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, planId: currentSelectedPlan.id })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        btnConfirmPayment.disabled = false;
        if (btnPayText) btnPayText.textContent = 'پرداخت و فعال‌سازی فوری';

        if (data.ok) {
          localStorage.setItem('chinifa_pro', 'true');
          user.isPro = true;
          user.pro = true;
          user.plan = currentSelectedPlan.id;
          localStorage.setItem('chinifa_auth_user', JSON.stringify(user));

          updateAuthUI();
          closePaymentModal();

          if (successUserEmailEl) successUserEmailEl.textContent = user.email;
          if (paymentSuccessModal) paymentSuccessModal.hidden = false;
        } else if (paymentAlertEl) {
          paymentAlertEl.hidden = false;
          paymentAlertEl.textContent = data.message || 'خطا در فعال‌سازی اشتراک.';
        }
      })
      .catch(function(err) {
        btnConfirmPayment.disabled = false;
        if (btnPayText) btnPayText.textContent = 'پرداخت و فعال‌سازی فوری';
        if (paymentAlertEl) {
          paymentAlertEl.hidden = false;
          paymentAlertEl.textContent = 'خطای اتصال به سرور: ' + (err.message || String(err));
        }
      });
    });
  }

});
