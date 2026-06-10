/**
 * MA.digital — админ-панель заявок (/admin)
 */
(function () {
  'use strict';

  var Leads = window.LeadsService;
  var loginPanel = document.getElementById('admin-login');
  var dashboard = document.getElementById('admin-dashboard');
  var loginForm = document.getElementById('admin-login-form');
  var loginError = document.getElementById('admin-login-error');
  var logoutBtn = document.getElementById('admin-logout');
  var refreshBtn = document.getElementById('admin-refresh');
  var tableBody = document.getElementById('admin-table-body');
  var emptyState = document.getElementById('admin-empty');
  var loadingEl = document.getElementById('admin-loading');
  var modal = document.getElementById('admin-modal');
  var modalClose = document.getElementById('admin-modal-close');
  var modalTitle = document.getElementById('admin-modal-title');
  var modalBody = document.getElementById('admin-modal-body');
  var headerActions = document.getElementById('admin-dashboard-actions');

  var leadsCache = [];

  function showLogin() {
    if (loginPanel) loginPanel.hidden = false;
    if (dashboard) dashboard.hidden = true;
    if (headerActions) headerActions.hidden = true;
  }

  function showDashboard() {
    if (loginPanel) loginPanel.hidden = true;
    if (dashboard) dashboard.hidden = false;
    if (headerActions) headerActions.hidden = false;
    loadLeads();
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch (e) {
      return iso;
    }
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function truncate(str, max) {
    var s = String(str || '');
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + '…';
  }

  function telegramLink(value) {
    var v = String(value || '').trim();
    if (!v) return '';
    if (v.indexOf('http') === 0) return v;
    var username = v.replace(/^@/, '');
    return 'https://t.me/' + encodeURIComponent(username);
  }

  function renderTable(leads) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (!leads.length) {
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (emptyState) emptyState.hidden = true;

    leads.forEach(function (lead, index) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-index', String(index));
      tr.innerHTML =
        '<td>' +
        escapeHtml(lead.name) +
        '</td>' +
        '<td>' +
        escapeHtml(lead.telegram) +
        '</td>' +
        '<td>' +
        escapeHtml(truncate(lead.recommendation, 72)) +
        '</td>' +
        '<td>' +
        escapeHtml(formatDate(lead.created_at)) +
        '</td>';
      tableBody.appendChild(tr);
    });
  }

  function openLeadCard(lead) {
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.textContent = lead.name || 'Заявка';
    var tg = lead.telegram || '';
    var tgHref = telegramLink(tg);

    modalBody.innerHTML =
      '<dl class="admin__detail-grid">' +
      detailRow('Имя', escapeHtml(lead.name)) +
      detailRow(
        'Telegram',
        tgHref
          ? '<a href="' + escapeHtml(tgHref) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(tg) + '</a>'
          : '—'
      ) +
      detailRow('Кто вы', escapeHtml(lead.client_type)) +
      detailRow('Цель', escapeHtml(lead.goal)) +
      detailRow('Что уже есть', escapeHtml(lead.current_state)) +
      detailRow('Срок', escapeHtml(lead.urgency)) +
      detailRow('Рекомендация', escapeHtml(lead.recommendation)) +
      detailRow('Описание задачи', escapeHtml(lead.description || '—')) +
      detailRow('Дата', escapeHtml(formatDate(lead.created_at))) +
      '</dl>';

    modal.hidden = false;
  }

  function detailRow(label, valueHtml) {
    return (
      '<div class="admin__detail-row"><dt>' +
      escapeHtml(label) +
      '</dt><dd>' +
      valueHtml +
      '</dd></div>'
    );
  }

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  function setLoading(visible) {
    if (loadingEl) loadingEl.hidden = !visible;
  }

  function loadLeads() {
    setLoading(true);
    Leads.fetchLeads()
      .then(function (res) {
        if (res.error) throw res.error;
        leadsCache = res.data || [];
        renderTable(leadsCache);
      })
      .catch(function (err) {
        console.error('[admin]', err);
        if (tableBody) tableBody.innerHTML = '';
        if (emptyState) {
          emptyState.hidden = false;
          emptyState.textContent = 'Не удалось загрузить заявки. Проверьте вход и права доступа.';
        }
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function init() {
    if (!Leads.isConfigured()) {
      if (loginError) {
        loginError.textContent =
          'Supabase не настроен. Скопируйте assets/js/config/supabase.config.example.js → supabase.config.js';
        loginError.hidden = false;
      }
      return;
    }

    Leads.getSession().then(function (res) {
      if (res.data && res.data.session) {
        showDashboard();
      } else {
        showLogin();
      }
    });

    Leads.onAuthStateChange(function (_event, session) {
      if (session) showDashboard();
      else showLogin();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = loginForm.elements.email.value.trim();
      var password = loginForm.elements.password.value;
      if (loginError) loginError.hidden = true;
      var btn = loginForm.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      Leads.signIn(email, password)
        .then(function (res) {
          if (res.error) throw res.error;
          showDashboard();
        })
        .catch(function () {
          if (loginError) {
            loginError.textContent = 'Неверный email или пароль.';
            loginError.hidden = false;
          }
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      Leads.signOut();
      showLogin();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadLeads);
  }

  if (tableBody) {
    tableBody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr[data-index]');
      if (!tr) return;
      var idx = parseInt(tr.getAttribute('data-index'), 10);
      if (leadsCache[idx]) openLeadCard(leadsCache[idx]);
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  init();
})();
