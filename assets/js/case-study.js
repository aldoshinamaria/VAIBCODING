(function () {
  'use strict';

  var themeKey = 'ma-digital-theme';
  var toggle = document.getElementById('case-theme-toggle');
  var yearEl = document.getElementById('case-year');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function syncThemeUi() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    if (toggle) {
      toggle.setAttribute('aria-label', t === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
      toggle.textContent = t === 'light' ? '☀' : '☾';
    }
  }

  function setTheme(next) {
    if (next !== 'light' && next !== 'dark') next = 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(themeKey, next);
    } catch (e) {}
    syncThemeUi();
  }

  if (toggle) {
    syncThemeUi();
    toggle.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      setTheme(cur === 'light' ? 'dark' : 'light');
    });
  }
})();
