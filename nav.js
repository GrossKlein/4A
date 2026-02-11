/* ============================================================
   nav.js — SyncPilot Dossier Master Navigation
   Single source of truth. Add a chapter = add one object below.
   ============================================================ */
(function () {
  'use strict';

  /* ── Chapter Registry ─────────────────────────────────── */
  var chapters = [
    { id: '00', file: 'index.html',              en: 'Index',                              de: 'Übersicht' },
    { id: '01', file: '01_ubo_directory.html',    en: 'Who Controls This Company?',          de: 'Wer kontrolliert das Unternehmen?' },
    { id: '02', file: '02_capital_events.html',   en: '14 Capital Events, Zero Oversight',   de: '14 Kapitalmaßnahmen, null Aufsicht' },
    { id: '03', file: '03_valuation.html',        en: 'What Is It Actually Worth?',          de: 'Was ist es wirklich wert?' },
    { id: '04', file: '04_revenue.html',          en: 'Where Is the Revenue?',               de: 'Wo bleibt der Umsatz?' },
    { id: '05', file: '05_risk_ratings.html',     en: 'Five Red Flags',                      de: 'Fünf Warnsignale' },
    { id: '06', file: '06_perseus_breach.html',   en: 'The 95% Discount',                    de: 'Der 95%-Rabatt' },
    { id: '07', file: '07_treasury_deficit.html',  en: 'Treasury Deficit',                    de: 'Bilanzdefizit' },
    { id: '08', file: '08_wash_trades.html',      en: 'Circular Control & Wash Trades',      de: 'Zirkuläre Kontrolle' },
    { id: '09', file: '09_bleicher_profile.html',  en: 'Bleicher — The Architect',            de: 'Bleicher — Der Architekt' },
    { id: '10', file: '10_pictet_investment.html', en: 'The Pictet Investment',               de: 'Die Pictet-Investition' },
    { id: '11', file: '11_lvs_loan.html',         en: 'The LVS Convertible Loan',            de: 'Das LVS-Wandeldarlehen' },
    { id: '12', file: '12_goldfinger.html',       en: 'The Goldfinger Connection',            de: 'Die Goldfinger-Verbindung' }
  ];

  /* ── Detect Current Page ──────────────────────────────── */
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (currentFile === '') currentFile = 'index.html';
  var currentIdx = -1;
  for (var i = 0; i < chapters.length; i++) {
    if (chapters[i].file === currentFile) { currentIdx = i; break; }
  }

  /* ── Language State ───────────────────────────────────── */
  var lang = 'en';
  try { lang = localStorage.getItem('dossier-lang') || 'en'; } catch (e) {}

  function applyLang() {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-de', lang === 'de');
    var btn = document.getElementById('navLangBtn');
    if (btn) btn.textContent = lang === 'en' ? 'DE' : 'EN';
    document.querySelectorAll('.nav-ch-en').forEach(function (el) { el.style.display = lang === 'en' ? '' : 'none'; });
    document.querySelectorAll('.nav-ch-de').forEach(function (el) { el.style.display = lang === 'de' ? '' : 'none'; });
    document.querySelectorAll('.pn-en').forEach(function (el) { el.style.display = lang === 'en' ? '' : 'none'; });
    document.querySelectorAll('.pn-de').forEach(function (el) { el.style.display = lang === 'de' ? '' : 'none'; });
  }

  function toggleLang() {
    lang = lang === 'en' ? 'de' : 'en';
    applyLang();
  }

  /* ── Inject Styles (only what nav needs — won't clash) ── */
  var style = document.createElement('style');
  style.textContent = [
    '/* ── nav.js injected styles ── */',
    '.site-nav{position:fixed;top:0;left:0;right:0;height:var(--nav-height,56px);background:var(--slate,#262A33);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:1000}',
    '.nav-left{display:flex;align-items:center;gap:16px}',
    '.nav-title{font-family:var(--font-ui,"Source Sans 3",sans-serif);font-weight:700;font-size:1rem;color:var(--paper,#FFF1E5);text-decoration:none}',
    '.side-menu-logo{display:block;margin:0 24px 16px;height:20px;opacity:.45}',
    '.nav-right{display:flex;align-items:center;gap:12px}',
    '.lang-toggle{background:transparent;border:1px solid rgba(255,241,229,.25);color:var(--paper,#FFF1E5);font-family:var(--font-ui,"Source Sans 3",sans-serif);font-size:.78rem;font-weight:600;padding:4px 10px;border-radius:3px;cursor:pointer;letter-spacing:.04em;transition:background .15s}',
    '.lang-toggle:hover{background:rgba(255,241,229,.12)}',
    '.hamburger{background:none;border:none;cursor:pointer;padding:4px;display:flex;flex-direction:column;gap:4px}',
    '.hamburger span{display:block;width:20px;height:2px;background:var(--paper,#FFF1E5);border-radius:1px;transition:transform .2s,opacity .2s}',
    '.hamburger.active span:nth-child(1){transform:translateY(6px) rotate(45deg)}',
    '.hamburger.active span:nth-child(2){opacity:0}',
    '.hamburger.active span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}',
    '.side-menu{position:fixed;top:var(--nav-height,56px);left:-300px;width:280px;height:calc(100vh - var(--nav-height,56px));background:var(--white,#FFFFFF);border-right:1px solid var(--wheat,#F2DFCE);overflow-y:auto;transition:left .25s;z-index:999;padding:24px 0}',
    '.side-menu.open{left:0}',
    '.side-menu-overlay{position:fixed;inset:0;top:var(--nav-height,56px);background:rgba(0,0,0,.3);opacity:0;pointer-events:none;transition:opacity .25s;z-index:998}',
    '.side-menu-overlay.visible{opacity:1;pointer-events:auto}',
    '.menu-link{display:block;font-family:var(--font-ui,"Source Sans 3",sans-serif);font-size:.88rem;color:var(--slate,#262A33);text-decoration:none;padding:8px 24px;transition:background .12s;line-height:1.4}',
    '.menu-link:hover{background:rgba(242,223,206,.5);text-decoration:none}',
    '.menu-link.active{border-left:3px solid var(--claret,#990F3D);padding-left:21px;background:rgba(242,223,206,.3);font-weight:600}',
    '.ch-num{display:inline-block;width:26px;font-weight:600;color:rgba(38,42,51,.4);font-size:.78rem}',
    '.chapter-nav{display:flex;justify-content:space-between;padding:32px var(--sp-6,24px);margin:32px auto 0;border-top:2px solid var(--wheat,#F2DFCE);max-width:var(--max-width,780px)}',
    '.chapter-nav a{font-family:var(--font-ui,"Source Sans 3",sans-serif);font-size:.88rem;font-weight:600;color:var(--oxford,#0D7680);text-decoration:none;max-width:45%}',
    '.chapter-nav a:hover{color:var(--claret,#990F3D)}',
    '.chapter-nav-prev::before{content:""}',
    '.chapter-nav-next::after{content:""}',
    '@media print{.site-nav,.side-menu,.side-menu-overlay,.chapter-nav{display:none!important}}',
    '@media(max-width:640px){.chapter-nav a{font-size:.78rem}}',
    '/* Bilingual toggle — nav.js controls body class */',
    'body.lang-en [data-lang-de]{display:none!important}',
    'body.lang-de [data-lang-en]{display:none!important}',
    'body.lang-de [data-lang-de]{display:block!important}',
    'body.lang-en [data-lang-en]{display:block!important}',
    'body.lang-de span[data-lang-de],body.lang-en span[data-lang-en]{display:inline!important}',
    'body.lang-de div[data-lang-de],body.lang-en div[data-lang-en]{display:block!important}'
  ].join('\n');
  document.head.appendChild(style);

  /* ── Build Top Nav Bar ────────────────────────────────── */
  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('role', 'navigation');
  nav.innerHTML =
    '<div class="nav-left">' +
      '<button class="hamburger" id="navHamburger" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '<a class="nav-title" href="index.html">The SyncPilot\u00a0Dossier</a>' +
    '</div>' +
    '<div class="nav-right">' +
      '<button class="lang-toggle" id="navLangBtn" aria-label="Switch language">DE</button>' +
    '</div>';

  /* ── Build Side Menu ──────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.className = 'side-menu-overlay';
  overlay.id = 'navOverlay';

  var aside = document.createElement('aside');
  aside.className = 'side-menu';
  aside.id = 'navSideMenu';

  var menuHTML = '<img src="SYNCPILOT%20logo%201.png" alt="SYNCPILOT" class="side-menu-logo" onerror="this.style.display=\'none\'">';
  for (var j = 0; j < chapters.length; j++) {
    var ch = chapters[j];
    var isActive = j === currentIdx;
    var cls = 'menu-link' + (isActive ? ' active' : '');
    if (ch.id === '00') {
      menuHTML +=
        '<a href="' + ch.file + '" class="' + cls + '" style="font-weight:700;margin-bottom:8px">' +
          '<span class="nav-ch-en">' + ch.en + '</span>' +
          '<span class="nav-ch-de" style="display:none">' + ch.de + '</span>' +
        '</a>';
    } else {
      menuHTML +=
        '<a href="' + ch.file + '" class="' + cls + '">' +
          '<span class="ch-num">' + ch.id + '</span> ' +
          '<span class="nav-ch-en">' + escapeHTML(ch.en) + '</span>' +
          '<span class="nav-ch-de" style="display:none">' + escapeHTML(ch.de) + '</span>' +
        '</a>';
    }
  }
  aside.innerHTML = menuHTML;

  /* ── Build Prev / Next Arrows ─────────────────────────── */
  var chapterNav = null;
  if (currentIdx >= 0) {
    chapterNav = document.createElement('div');
    chapterNav.className = 'chapter-nav';
    var prevHTML = '<span></span>';
    var nextHTML = '<span></span>';

    if (currentIdx > 0) {
      var prev = chapters[currentIdx - 1];
      var pLbl = prev.id === '00' ? '' : ('Ch\u00a0' + prev.id + ' \u2014 ');
      prevHTML =
        '<a href="' + prev.file + '" class="chapter-nav-prev">\u2190 ' +
          '<span class="pn-en">' + pLbl + escapeHTML(prev.en) + '</span>' +
          '<span class="pn-de" style="display:none">' + pLbl + escapeHTML(prev.de) + '</span>' +
        '</a>';
    }
    if (currentIdx < chapters.length - 1) {
      var next = chapters[currentIdx + 1];
      var nLbl = next.id === '00' ? '' : ('Ch\u00a0' + next.id + ' \u2014 ');
      nextHTML =
        '<a href="' + next.file + '" class="chapter-nav-next">' +
          '<span class="pn-en">' + nLbl + escapeHTML(next.en) + '</span>' +
          '<span class="pn-de" style="display:none">' + nLbl + escapeHTML(next.de) + '</span>' +
        ' \u2192</a>';
    }
    chapterNav.innerHTML = prevHTML + nextHTML;
  }

  /* ── Inject Into DOM ──────────────────────────────────── */
  document.body.insertBefore(aside, document.body.firstChild);
  document.body.insertBefore(overlay, document.body.firstChild);
  document.body.insertBefore(nav, document.body.firstChild);

  if (chapterNav) {
    var footer = document.querySelector('.site-footer');
    if (footer) {
      footer.parentNode.insertBefore(chapterNav, footer);
    } else {
      var contentArea = document.querySelector('.content-area');
      if (contentArea) contentArea.appendChild(chapterNav);
    }
  }

  /* ── Hamburger Toggle ─────────────────────────────────── */
  function toggleMenu() {
    var menu = document.getElementById('navSideMenu');
    var ov = document.getElementById('navOverlay');
    var hb = document.getElementById('navHamburger');
    if (!menu) return;
    var isOpen = menu.classList.toggle('open');
    if (ov) ov.classList.toggle('visible', isOpen);
    if (hb) hb.classList.toggle('active', isOpen);
  }

  document.getElementById('navHamburger').addEventListener('click', toggleMenu);
  document.getElementById('navOverlay').addEventListener('click', toggleMenu);
  document.getElementById('navLangBtn').addEventListener('click', toggleLang);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var menu = document.getElementById('navSideMenu');
      if (menu && menu.classList.contains('open')) toggleMenu();
    }
  });

  /* ── Apply Language ───────────────────────────────────── */
  applyLang();

  /* ── Expose Globally (for any legacy onclick= attrs) ─── */
  window.toggleLang = toggleLang;
  window.toggleMenu = toggleMenu;

  /* ── Utility ──────────────────────────────────────────── */
  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

})();
