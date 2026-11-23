/* ============================================================
   chinifa (چی‌نی‌فا) — اسکریپت اصلی پنل مدیریت و داشبورد آماری
   شامل: موتور ترسیم نمودار بومی بدون کتابخانه خارجی، مدیریت نشست و جدول کاربران
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  var currentView = 'overview';
  var editingUserId = null;

  // المان‌های DOM اصلی
  var loginOverlay = document.getElementById('login-overlay');
  var loginForm = document.getElementById('login-form');
  var loginError = document.getElementById('login-error');
  var adminShell = document.getElementById('admin-shell');
  var pageTitle = document.getElementById('page-title');
  var btnLogout = document.getElementById('btn-logout');
  var sessionUsername = document.getElementById('session-username');

  // المان‌های جدول و جستجو
  var userSearchInput = document.getElementById('user-search-input');
  var userStatusFilter = document.getElementById('user-status-filter');
  var userLevelFilter = document.getElementById('user-level-filter');
  var usersTbody = document.getElementById('users-tbody');
  var tableCountInfo = document.getElementById('table-count-info');

  // المان‌های مودال ویرایش
  var editModal = document.getElementById('edit-user-modal');
  var editForm = document.getElementById('edit-user-form');
  var modalTitle = document.getElementById('modal-title');
  var btnCloseModal = document.getElementById('modal-close');
  var btnCancelModal = document.getElementById('btn-cancel-edit');
  var btnCreateUser = document.getElementById('btn-open-create-user');
  var btnExportCsv = document.getElementById('btn-export-csv');

  // ════════════════════════════════════════════════════════════
  // ۱. بررسی ورود و مدیریت نشست ادمین
  // ════════════════════════════════════════════════════════════
  function checkAuth() {
    var session = window.AdminAPI ? AdminAPI.getSession() : null;
    if (session) {
      loginOverlay.hidden = true;
      adminShell.hidden = false;
      if (sessionUsername) sessionUsername.textContent = session.username || 'ادمین ارشد';
      initDashboard();
    } else {
      loginOverlay.hidden = false;
      adminShell.hidden = true;
    }
  }

  // ثبت فرم ورود
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var u = document.getElementById('admin-user').value.trim();
      var p = document.getElementById('admin-pass').value;
      loginError.hidden = true;

      AdminAPI.login(u, p).then(function(res) {
        checkAuth();
      }).catch(function(err) {
        loginError.hidden = false;
        loginError.textContent = err.message || 'خطا در ورود به سیستم';
      });
    });
  }

  // خروج از حساب
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      if (confirm('آیا از خروج از پنل مدیریت اطمینان دارید؟')) {
        AdminAPI.logout().then(function() {
          checkAuth();
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // ۲. ناوبری و تغییر صفحات سایدبار
  // ════════════════════════════════════════════════════════════
  var navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var viewId = item.getAttribute('data-view');
      if (viewId) {
        switchView(viewId);
      }
    });
  });

  function switchView(viewId) {
    currentView = viewId;

    // به‌روزرسانی فعال بودن دکمه سایدبار
    navItems.forEach(function(btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-view') === viewId);
    });

    // مخفی‌سازی تمام نماها و نمایش نمای فعال
    var views = document.querySelectorAll('.admin-view');
    views.forEach(function(v) {
      v.classList.remove('is-active');
    });

    var targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.add('is-active');

    // تغییر عنوان هدر
    if (pageTitle) {
      var titles = {
        'overview': 'داشبورد نظارت و آمار جامع',
        'users': 'مدیریت و لیست زبان‌آموزان',
        'analytics': 'تحلیل پیشرفت و عملکرد درس‌ها'
      };
      pageTitle.textContent = titles[viewId] || 'پنل مدیریت';
    }

    if (viewId === 'overview') {
      loadOverviewData();
    } else if (viewId === 'users') {
      loadUsersTable();
    } else if (viewId === 'analytics') {
      loadAnalyticsData();
    }
  }

  // ════════════════════════════════════════════════════════════
  // ۳. بارگذاری و رندر نمای داشبورد آماری (Overview)
  // ════════════════════════════════════════════════════════════
  function loadOverviewData() {
    AdminAPI.getStats().then(function(s) {
      var elTotal = document.getElementById('kpi-total-users');
      var elActive = document.getElementById('kpi-active-month');
      var elWords = document.getElementById('kpi-total-words');
      var elComp = document.getElementById('kpi-completion-rate');

      if (elTotal) elTotal.textContent = Number(s.totalUsers).toLocaleString('fa-IR');
      if (elActive) elActive.textContent = Number(s.activeMonth).toLocaleString('fa-IR');
      if (elWords) elWords.textContent = Number(s.totalWords).toLocaleString('fa-IR');
      if (elComp) elComp.textContent = s.completionRate + '٪';
    });

    // رسم نمودار خطی رشد
    AdminAPI.getUserGrowthChart().then(function(growth) {
      drawGrowthLineChart('chart-growth', growth.labels, growth.data);
    });

    // رسم نمودار میله‌ای قیف درس‌ها
    AdminAPI.getLessonFunnelChart().then(function(funnel) {
      drawFunnelBarChart('chart-funnel', funnel.labels, funnel.data);
    });
  }

  // ════════════════════════════════════════════════════════════
  // ۴. موتور رسم نمودار بومی با Canvas (بدون کتابخانه حجیم خارجی)
  // ════════════════════════════════════════════════════════════
  function setupHiDPICanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx: ctx, width: rect.width, height: rect.height };
  }

  // رسم نمودار خطی زیبا با گرادیان پرتو
  function drawGrowthLineChart(canvasId, labels, data) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var setup = setupHiDPICanvas(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;

    ctx.clearRect(0, 0, w, h);

    var padX = 40;
    var padY = 30;
    var chartW = w - padX * 2;
    var chartH = h - padY * 2;

    var maxVal = Math.max.apply(null, data) * 1.15;
    var minVal = 0;

    // خطوط پس‌زمینه افقی
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padY + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();
    }

    // محاسبه نقاط داده
    var points = [];
    var stepX = chartW / (data.length - 1);
    for (var d = 0; d < data.length; d++) {
      var px = padX + d * stepX;
      var py = padY + chartH - ((data[d] - minVal) / (maxVal - minVal)) * chartH;
      points.push({ x: px, y: py, val: data[d] });
    }

    // ناحیه زیر نمودار (گرادیان رنگ زمردی تا شفاف)
    var grad = ctx.createLinearGradient(0, padY, 0, padY + chartH);
    grad.addColorStop(0, 'rgba(15, 169, 104, 0.35)');
    grad.addColorStop(1, 'rgba(15, 169, 104, 0.00)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padY + chartH);
    for (var p = 0; p < points.length; p++) {
      ctx.lineTo(points[p].x, points[p].y);
    }
    ctx.lineTo(points[points.length - 1].x, padY + chartH);
    ctx.closePath();
    ctx.fill();

    // خط اصلی منحنی
    ctx.strokeStyle = '#0FA968';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (var k = 0; k < points.length; k++) {
      if (k === 0) ctx.moveTo(points[k].x, points[k].y);
      else ctx.lineTo(points[k].x, points[k].y);
    }
    ctx.stroke();

    // رسم نقاط و برچسب‌های متن
    ctx.fillStyle = '#fff';
    ctx.font = "12px 'Vazirmatn', sans-serif";
    ctx.textAlign = 'center';

    for (var j = 0; j < points.length; j++) {
      var pt = points[j];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
      ctx.strokeStyle = '#0B130E';
      ctx.lineWidth = 2;
      ctx.stroke();

      // برچسب ماه پایین
      ctx.fillStyle = '#82948C';
      ctx.fillText(labels[j], pt.x, h - 8);

      // مقدار روی هر نقطه
      ctx.fillStyle = '#F3F8F5';
      ctx.fillText(Number(pt.val).toLocaleString('fa-IR'), pt.x, pt.y - 10);
    }
  }

  // رسم نمودار میله‌ای قیف درس‌ها
  function drawFunnelBarChart(canvasId, labels, data) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var setup = setupHiDPICanvas(canvas);
    var ctx = setup.ctx;
    var w = setup.width;
    var h = setup.height;

    ctx.clearRect(0, 0, w, h);

    var padX = 25;
    var padY = 30;
    var chartW = w - padX * 2;
    var chartH = h - padY * 2;

    var maxVal = 1600;
    var barCount = data.length;
    var barWidth = (chartW / barCount) * 0.65;
    var step = chartW / barCount;

    // خطوط پس‌زمینه
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 3; i++) {
      var lineY = padY + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padX, lineY);
      ctx.lineTo(w - padX, lineY);
      ctx.stroke();
    }

    for (var d = 0; d < data.length; d++) {
      var x = padX + d * step + (step - barWidth) / 2;
      var barH = (data[d] / maxVal) * chartH;
      var y = padY + chartH - barH;

      // میله با گرادیان زمردی
      var barGrad = ctx.createLinearGradient(0, y, 0, y + barH);
      barGrad.addColorStop(0, '#10B981');
      barGrad.addColorStop(1, '#064E3B');

      ctx.fillStyle = barGrad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      // برچسب درس پایین (هر ۲ درس یکی جهت عدم تداخل)
      if (d % 2 === 0 || d === data.length - 1) {
        ctx.fillStyle = '#63776C';
        ctx.font = "10px 'Vazirmatn', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('د' + (d + 1), x + barWidth / 2, h - 8);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  // ۵. جدول مدیریت کاربران (Users View)
  // ════════════════════════════════════════════════════════════
  function loadUsersTable() {
    var filters = {
      search: userSearchInput ? userSearchInput.value : '',
      status: userStatusFilter ? userStatusFilter.value : 'all',
      level: userLevelFilter ? userLevelFilter.value : 'all'
    };

    AdminAPI.getUsers(filters).then(function(users) {
      renderUsersRows(users);
    });
  }

  function renderUsersRows(users) {
    if (!usersTbody) return;
    usersTbody.innerHTML = '';

    if (tableCountInfo) {
      tableCountInfo.textContent = 'نمایش ' + users.length.toLocaleString('fa-IR') + ' زبان‌آموز در سامانه';
    }

    if (users.length === 0) {
      usersTbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:32px; color:var(--text-sub);">هیچ کاربری با این مشخصات یافت نشد.</td></tr>';
      return;
    }

    users.forEach(function(u) {
      var tr = document.createElement('tr');

      var statusClasses = {
        'active': 'status--active',
        'vip': 'status--vip',
        'suspended': 'status--suspended'
      };
      var statusTitles = {
        'active': 'فعال',
        'vip': 'ویژه (VIP)',
        'suspended': 'مسدود'
      };

      var initial = (u.name || u.username || 'ک').trim().charAt(0);

      tr.innerHTML = 
        '<td>' +
          '<div class="user-cell">' +
            '<div class="user-avatar-circle">' + initial + '</div>' +
            '<div class="user-names">' +
              '<span class="user-name-txt">' + (u.name || 'بدون نام') + '</span>' +
              '<span class="user-uname-txt">@' + u.username + '</span>' +
            '</div>' +
          '</div>' +
        '</td>' +
        '<td><span style="font-family:monospace; font-size:12px; color:var(--text-muted);">' + (u.email || '—') + '</span></td>' +
        '<td><span style="font-weight:700;">' + u.level + '</span> <span style="color:var(--brand-light); font-size:12px;">(درس ' + (u.currentLesson || 0) + ')</span></td>' +
        '<td>' + (u.wordsLearned || 0) + ' کلمه</td>' +
        '<td><span style="color:#f59e0b; font-weight:700;">🔥 ' + (u.streak || 0) + '</span> روز</td>' +
        '<td><span class="badge-status ' + (statusClasses[u.status] || 'status--active') + '">' + (statusTitles[u.status] || u.status) + '</span></td>' +
        '<td><span style="font-size:12px; color:var(--text-sub);">' + u.lastActive + '</span></td>' +
        '<td>' +
          '<div class="table-actions">' +
            '<button class="btn-icon-action" data-edit-id="' + u.id + '" title="ویرایش">' +
              '<svg viewBox="0 0 24 24" class="svg-icon-sm"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>' +
            '</button>' +
            '<button class="btn-icon-action danger" data-delete-id="' + u.id + '" title="حذف کاربر">' +
              '<svg viewBox="0 0 24 24" class="svg-icon-sm"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>' +
            '</button>' +
          '</div>' +
        '</td>';

      usersTbody.appendChild(tr);
    });

    // رویدادهای دکمه‌های جدول
    usersTbody.querySelectorAll('[data-edit-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var uid = btn.getAttribute('data-edit-id');
        openEditModal(uid);
      });
    });

    usersTbody.querySelectorAll('[data-delete-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var uid = btn.getAttribute('data-delete-id');
        if (confirm('آیا از حذف این زبان‌آموز از سامانه اطمینان دارید؟')) {
          AdminAPI.deleteUser(uid).then(function() {
            loadUsersTable();
          });
        }
      });
    });
  }

  // رویدادهای فیلتر و جستجو
  if (userSearchInput) userSearchInput.addEventListener('input', loadUsersTable);
  if (userStatusFilter) userStatusFilter.addEventListener('change', loadUsersTable);
  if (userLevelFilter) userLevelFilter.addEventListener('change', loadUsersTable);

  // ════════════════════════════════════════════════════════════
  // ۶. مودال ویرایش و افزودن کاربر
  // ════════════════════════════════════════════════════════════
  function openEditModal(userId) {
    editingUserId = userId;
    if (userId) {
      modalTitle.textContent = 'ویرایش مشخصات کاربر';
      AdminAPI.getUser(userId).then(function(u) {
        if (!u) return;
        document.getElementById('edit-user-id').value = u.id;
        document.getElementById('edit-name').value = u.name || '';
        document.getElementById('edit-username').value = u.username || '';
        document.getElementById('edit-email').value = u.email || '';
        document.getElementById('edit-level').value = u.level || 'HSK 1';
        document.getElementById('edit-status').value = u.status || 'active';
        document.getElementById('edit-lesson').value = u.currentLesson || 0;
        editModal.hidden = false;
      });
    } else {
      modalTitle.textContent = 'افزودن زبان‌آموز جدید';
      document.getElementById('edit-user-id').value = '';
      document.getElementById('edit-name').value = '';
      document.getElementById('edit-username').value = '';
      document.getElementById('edit-email').value = '';
      document.getElementById('edit-level').value = 'HSK 1';
      document.getElementById('edit-status').value = 'active';
      document.getElementById('edit-lesson').value = 1;
      editModal.hidden = false;
    }
  }

  function closeEditModal() {
    editModal.hidden = true;
    editingUserId = null;
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeEditModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeEditModal);

  if (btnCreateUser) {
    btnCreateUser.addEventListener('click', function() {
      openEditModal(null);
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = {
        name: document.getElementById('edit-name').value.trim(),
        username: document.getElementById('edit-username').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        level: document.getElementById('edit-level').value,
        status: document.getElementById('edit-status').value,
        currentLesson: parseInt(document.getElementById('edit-lesson').value, 10) || 0
      };

      if (editingUserId) {
        AdminAPI.updateUser(editingUserId, data).then(function() {
          closeEditModal();
          loadUsersTable();
          if (currentView === 'overview') loadOverviewData();
        });
      } else {
        AdminAPI.createUser(data).then(function() {
          closeEditModal();
          loadUsersTable();
          if (currentView === 'overview') loadOverviewData();
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // ۷. بخش تحلیل پیشرفت درس‌ها (Course Analytics)
  // ════════════════════════════════════════════════════════════
  function loadAnalyticsData() {
    var container = document.getElementById('lessons-stats-list');
    if (!container) return;
    container.innerHTML = '';

    var lessonNames = [
      'درس ۱: سلام و احوالپرسی (你好)',
      'درس ۲: معرفی با فعل ربطی (是)',
      'درس ۳: پرسش با کلمه (什么)',
      'درس ۴: اعداد و سن و سال',
      'درس ۵: احترام با 您 و جمع 们',
      'درس ۶: داشتن و وجود داشتن (有)',
      'درس ۷: مکان و جهت‌ها (哪儿)',
      'درس ۸: صفت‌ها با قید (很)',
      'درس ۹: سوالات با 几 و 多少',
      'درس ۱۰: سن و ابعاد با 多大',
      'درس ۱۱: نحوه انجام با 怎么',
      'درس ۱۲: نفی با 不 و 没',
      'درس ۱۳: توانایی با فعل 会',
      'درس ۱۴: تاکید با 太...了 و زمان',
      'درس ۱۵: افعال حرکتی 去 و کلمات شمارشگر'
    ];

    var percentages = [98, 92, 86, 79, 74, 69, 63, 58, 52, 47, 43, 39, 36, 34, 31];

    lessonNames.forEach(function(title, i) {
      var pct = percentages[i];
      var row = document.createElement('div');
      row.className = 'lesson-stat-row';
      row.innerHTML = 
        '<div class="lesson-stat-name">' + title + '</div>' +
        '<div class="lesson-progress-bar-wrap">' +
          '<div class="lesson-progress-bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<div class="lesson-stat-count">' + pct + '٪ اتمام</div>';
      container.appendChild(row);
    });
  }

  // ════════════════════════════════════════════════════════════
  // ۸. خروجی اکسل و CSV
  // ════════════════════════════════════════════════════════════
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', function() {
      var csvData = AdminAPI.exportCSV();
      var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'chinifa_users_report_' + new Date().toISOString().slice(0, 10) + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function initDashboard() {
    switchView(currentView);
  }

  // شروع اجرای برنامه با بررسی وضعیت احراز هویت
  checkAuth();
});
