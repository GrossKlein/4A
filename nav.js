/* ============================================================
   SyncPilot SE Investigative Dossier — Shared Navigation JS
   Hamburger · Language Toggle · Client-Side Search
   ============================================================ */

(function () {
  'use strict';

  // ---- State (in-memory, no localStorage) ----
  let currentLang = 'en';
  let menuOpen = false;
  let searchOpen = false;

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupHamburger();
    setupLanguageToggle();
    setupSearch();
    setupAccordions();
    setupSmoothScroll();
  }

  // ============================================================
  //  HAMBURGER MENU
  // ============================================================
  function setupHamburger() {
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.side-menu-overlay');
    if (!btn || !menu) return;

    btn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    // Mark active chapter in menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('.menu-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });

    function toggleMenu() {
      menuOpen = !menuOpen;
      btn.classList.toggle('active', menuOpen);
      menu.classList.toggle('open', menuOpen);
      if (overlay) overlay.classList.toggle('visible', menuOpen);
    }

    function closeMenu() {
      menuOpen = false;
      btn.classList.remove('active');
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
    }
  }

  // ============================================================
  //  LANGUAGE TOGGLE
  // ============================================================
  function setupLanguageToggle() {
    const btn = document.querySelector('.lang-toggle');
    if (!btn) return;

    updateLangDisplay();

    btn.addEventListener('click', function () {
      currentLang = currentLang === 'en' ? 'de' : 'en';
      updateLangDisplay();
    });

    function updateLangDisplay() {
      document.body.classList.toggle('lang-de', currentLang === 'de');
      document.body.classList.toggle('lang-en', currentLang === 'en');
      btn.textContent = currentLang === 'en' ? 'DE' : 'EN';
      btn.setAttribute('aria-label',
        currentLang === 'en' ? 'Switch to German' : 'Auf Englisch wechseln'
      );
    }
  }

  // ============================================================
  //  CLIENT-SIDE SEARCH
  // ============================================================
  function setupSearch() {
    const btn = document.querySelector('.search-btn');
    const overlay = document.querySelector('.search-overlay');
    const input = document.querySelector('.search-input');
    const resultsDiv = document.querySelector('.search-results');
    if (!btn || !overlay) return;

    btn.addEventListener('click', function () {
      searchOpen = !searchOpen;
      overlay.classList.toggle('open', searchOpen);
      if (searchOpen && input) {
        setTimeout(function () { input.focus(); }, 100);
      }
    });

    // Close on Escape or click outside
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        searchOpen = false;
        overlay.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOpen) {
        searchOpen = false;
        overlay.classList.remove('open');
      }
    });

    // Search logic — uses the embedded searchIndex if present
    if (input && resultsDiv) {
      let debounce = null;
      input.addEventListener('input', function () {
        clearTimeout(debounce);
        debounce = setTimeout(function () { performSearch(input.value, resultsDiv); }, 200);
      });
    }
  }

  function performSearch(query, resultsDiv) {
    resultsDiv.innerHTML = '';
    if (!query || query.length < 2) return;

    // searchIndex is expected to be a global array defined inline in each page or in index.html
    // Format: [{ chapter: "Ch 1", title: "UBO Directory", href: "01_ubo.html", text: "..." }, ...]
    var index = window.searchIndex || [];
    if (index.length === 0) {
      resultsDiv.innerHTML = '<div class="search-no-results">Search index not loaded. Search is available from the index page.</div>';
      return;
    }

    var terms = query.toLowerCase().split(/\s+/).filter(function (t) { return t.length >= 2; });
    var results = [];

    index.forEach(function (entry) {
      var haystack = (entry.title + ' ' + entry.text).toLowerCase();
      var score = 0;
      terms.forEach(function (term) {
        var idx = haystack.indexOf(term);
        if (idx !== -1) score += 10;
        // Bonus for title match
        if (entry.title.toLowerCase().indexOf(term) !== -1) score += 20;
      });
      if (score > 0) {
        results.push({ entry: entry, score: score });
      }
    });

    results.sort(function (a, b) { return b.score - a.score; });

    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="search-no-results">No results found for "' + escapeHtml(query) + '"</div>';
      return;
    }

    results.slice(0, 15).forEach(function (r) {
      var snippet = getSnippet(r.entry.text, terms[0], 120);
      var a = document.createElement('a');
      a.className = 'search-result-item';
      a.href = r.entry.href;
      a.innerHTML =
        '<div class="result-chapter">' + escapeHtml(r.entry.chapter) + '</div>' +
        '<div class="result-text">' + highlightTerms(snippet, terms) + '</div>';
      resultsDiv.appendChild(a);
    });
  }

  function getSnippet(text, term, maxLen) {
    if (!text) return '';
    var lower = text.toLowerCase();
    var idx = lower.indexOf(term.toLowerCase());
    if (idx === -1) return text.substring(0, maxLen) + '…';
    var start = Math.max(0, idx - 40);
    var end = Math.min(text.length, idx + maxLen - 40);
    var snippet = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
    return snippet;
  }

  function highlightTerms(text, terms) {
    var result = escapeHtml(text);
    terms.forEach(function (term) {
      var re = new RegExp('(' + escapeRegExp(term) + ')', 'gi');
      result = result.replace(re, '<mark>$1</mark>');
    });
    return result;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ============================================================
  //  ACCORDION SECTIONS
  // ============================================================
  function setupAccordions() {
    document.querySelectorAll('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var acc = header.closest('.accordion');
        if (acc) acc.classList.toggle('open');
      });
    });
  }

  // ============================================================
  //  SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  function setupSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 56;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }

})();
