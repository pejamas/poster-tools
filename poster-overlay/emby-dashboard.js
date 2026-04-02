// emby-dashboard.js — Emby Integration for Poster Overlay
// Allows pushing the current canvas artwork directly to an Emby server.
// Only active when the app is accessed from a local network address.

(function () {
  'use strict';

  // ── Local-access gate ──────────────────────────────────────────────────
  function isLocalAccess() {
    const h = window.location.hostname;
    return (
      h === 'localhost' ||
      h === '127.0.0.1' ||
      h === '' ||
      /^192\.168\./.test(h) ||
      /^10\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
      h.endsWith('.local')
    );
  }

  // ── Persisted config ───────────────────────────────────────────────────
  let embyConfig = {
    url: localStorage.getItem('embyUrl') || '',
    apiKey: (() => {
      const s = localStorage.getItem('embyApiKey');
      if (!s) return '';
      try { return atob(s); } catch (e) { return s; }
    })(),
    connected: false,
    serverName: ''
  };

  // ── State ──────────────────────────────────────────────────────────────
  let dashboardEl    = null;
  let connectBtn     = null;
  let libraryContainer = null;
  let searchTimeout  = null;
  let selectedTarget = null; // { id, name, type }
  let allItems       = [];
  let sortBy         = localStorage.getItem('embySortBy')   || 'name-asc';
  let viewMode       = localStorage.getItem('embyViewMode') || 'grid';
  let gridSize       = localStorage.getItem('embyGridSize') || 'medium';
  let qualityFilter  = localStorage.getItem('embyQualityFilter') || 'all';
  let serverQualityFilter = 'all'; // tracks what server-side quality param was used in last loadLibrary
  let showCustomised = localStorage.getItem('embyShowCustomised') || 'all'; // 'all' | 'only' | 'hide'

  // Cache-bust timestamps for items pushed to Emby (so Refresh shows updated art)
  const pushedTimestamps = new Map();

  // Customised items — set of Emby item IDs that have been pushed to
  let customisedIds = (function () {
    try { return new Set(JSON.parse(localStorage.getItem('embyCustomisedIds') || '[]')); }
    catch (e) { return new Set(); }
  }());

  function saveCustomisedIds() {
    localStorage.setItem('embyCustomisedIds', JSON.stringify(Array.from(customisedIds)));
  }

  // Season ID cache — persisted so progress badges survive page reload
  // seriesSeasonIds[showId] = [showPosterId, season1Id, season2Id, ...]
  let seriesSeasonIds = (function () {
    try { return JSON.parse(localStorage.getItem('embySeriesSeasonIds') || '{}'); }
    catch (e) { return {}; }
  }());

  function saveSeriesSeasonIds() {
    localStorage.setItem('embySeriesSeasonIds', JSON.stringify(seriesSeasonIds));
  }

  // Restore last active season map so Season Suite badges reappear on reload
  window._embyActiveSeasonMap = (function () {
    try { return JSON.parse(localStorage.getItem('embyActiveSeasonMap') || 'null'); }
    catch (e) { return null; }
  }());

  const GRID_SIZES = { small: '130px', medium: '180px', large: '240px' };

  // Multi-select state
  let multiSelectMode  = false;
  let multiSelectedIds = new Set();

  // Active show context — set when a season is loaded to the canvas from the modal
  // Allows push to return to the same show's season picker instead of the full library
  let activeShowCtx = null; // { showId, showName, tmdbId }

  // ── Emby fetch helper ──────────────────────────────────────────────────
  function embyAuthHeaders() {
    return {
      'X-Emby-Token': embyConfig.apiKey,
      'X-MediaBrowser-Token': embyConfig.apiKey
    };
  }

  // ── Dashboard initialisation ───────────────────────────────────────────
  function initEmbyDashboard() {
    const el = document.createElement('div');
    el.id = 'emby-dashboard';
    el.className = 'emby-dashboard-fullscreen';
    el.style.display = 'none';

    el.innerHTML = `
      <!-- Header -->
      <div class="emby-header">
        <div class="emby-header-title">
          <div class="emby-header-title-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#52b54b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h2>Emby Integration</h2>
          </div>
          <p class="emby-subtitle">Push artwork directly to your Emby media server</p>
        </div>
        <button id="emby-close-btn" class="action-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-right:6px;"><polyline points="15 18 9 12 15 6"/></svg>
          Return to Poster Overlay
        </button>
      </div>

      <!-- Connection form -->
      <div class="emby-connection-form" id="emby-connection-form">
        <div class="emby-form-header">
          <h3>Connect to Emby</h3>
          <p class="emby-connection-info">Enter your Emby server URL and API key to connect</p>
        </div>
        <div class="emby-form-content">
          <div class="emby-connection-stack">
            <div class="emby-form-group">
              <label for="emby-url-input">Emby Server URL</label>
              <input type="text" id="emby-url-input" placeholder="http://192.168.1.10:8096" value="${escapeAttr(embyConfig.url)}" autocomplete="off" />
              <p class="emby-form-hint">Include the port — e.g. http://192.168.1.10:8096</p>
            </div>
            <div class="emby-form-group">
              <label for="emby-key-input">API Key</label>
              <input type="password" id="emby-key-input" placeholder="Your Emby API key" value="${escapeAttr(embyConfig.apiKey)}" autocomplete="off" />
              <p class="emby-form-hint">Dashboard → Admin → Advanced → API Keys</p>
            </div>
            <div class="emby-form-group">
              <label class="emby-checkbox-label">
                <input type="checkbox" id="emby-store-key" />
                Store API key in this browser
              </label>
              <div id="emby-store-disclaimer" class="emby-disclaimer" style="display:none;">
                <strong>Warning:</strong> Your API key will be saved (obfuscated) in this browser's local storage. Only use this on private, secure devices.
              </div>
            </div>
            <div class="emby-form-group">
              <button id="emby-connect-btn" class="action-button emby-connect-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-right:6px;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                Connect to Emby
              </button>
              <p id="emby-status" class="emby-status-text"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Push bar (shown when a target is selected) -->
      <div id="emby-push-bar" class="emby-push-bar" style="display:none;">
        <div class="emby-push-bar-info">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#52b54b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Selected: <strong id="emby-push-target-name"></strong></span>
        </div>
        <button id="emby-push-btn" class="action-button emby-push-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Push Current Canvas to Emby
        </button>
        <button id="emby-push-clear" class="emby-push-clear-btn" title="Clear selection" aria-label="Clear selection">✕</button>
      </div>

      <!-- Library browser (shown after connection) -->
      <div id="emby-library-section" class="emby-library-section" style="display:none;">
        <div class="emby-library-toolbar">
          <div class="emby-toolbar-left">
            <div class="emby-search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" id="emby-search" class="emby-search-input" placeholder="Search library\u2026" />
              <button id="emby-search-clear" class="emby-search-clear" title="Clear search" style="display:none;">\u2715</button>
            </div>
            <div class="emby-filter-tabs" id="emby-filter-tabs">
              <button class="emby-filter-tab active" data-type="all">All</button>
              <button class="emby-filter-tab" data-type="Series">TV Shows</button>
              <button class="emby-filter-tab" data-type="Movie">Movies</button>
            </div>
            <select id="emby-genre-select" class="emby-sort-select emby-genre-select" title="Filter by genre">
              <option value="">All Genres</option>
            </select>
          </div>
          <div class="emby-toolbar-right">
            <span id="emby-item-count" class="emby-item-count"></span>
            <select id="emby-quality-filter" class="emby-sort-select" title="Filter by quality">
              <option value="all">All Quality</option>
              <option value="sd">SD</option>
              <option value="hd">HD</option>
              <option value="4k">4K UHD</option>
              <option value="hdr">HDR</option>
              <option value="dv">Dolby Vision</option>
            </select>
            <select id="emby-customised-filter" class="emby-sort-select" title="Customised filter">
              <option value="all">All Items</option>
              <option value="only">Customised Only</option>
              <option value="hide">Hide Customised</option>
            </select>
            <select id="emby-sort-select" class="emby-sort-select">
              <option value="name-asc">Name A\u2192Z</option>
              <option value="name-desc">Name Z\u2192A</option>
              <option value="year-desc">Year \u2193</option>
              <option value="year-asc">Year \u2191</option>
            </select>
            <div class="emby-size-toggle" title="Card size">
              <button class="emby-size-btn" data-size="small" title="Small cards">S</button>
              <button class="emby-size-btn" data-size="medium" title="Medium cards">M</button>
              <button class="emby-size-btn" data-size="large" title="Large cards">L</button>
            </div>
            <div class="emby-view-toggle">
              <button class="emby-view-btn" data-view="grid" title="Grid view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button class="emby-view-btn" data-view="list" title="List view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
              </button>
            </div>
            <button id="emby-refresh-btn" class="emby-icon-btn" title="Refresh library">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
            <button id="emby-multiselect-btn" class="emby-icon-btn" title="Select multiple items">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 12 11 14 15 10"/></svg>
            </button>
          </div>
        </div>
        <div id="emby-bulk-bar" class="emby-bulk-bar" style="display:none;">
          <span id="emby-bulk-count" class="emby-bulk-count">0 selected</span>
          <button id="emby-bulk-mark-btn" class="emby-bulk-btn mark">\u2713 Mark Customised</button>
          <button id="emby-bulk-unmark-btn" class="emby-bulk-btn unmark">\u2715 Remove Mark</button>
          <button id="emby-bulk-clear-btn" class="emby-bulk-btn clear">Clear Selection</button>
        </div>
        <div id="emby-library-container" class="emby-library-container"></div>
      </div>

      <!-- Context menu (right-click on card) -->
      <div id="emby-ctx-menu" class="emby-ctx-menu" style="display:none;">
        <button class="emby-ctx-btn" id="emby-ctx-toggle-custom">\u2713 Mark as Customised</button>
        <div class="emby-ctx-sep"></div>
        <button class="emby-ctx-btn emby-ctx-muted" id="emby-ctx-select">Select as Push Target</button>
      </div>
    `;

    document.body.appendChild(el);
    dashboardEl      = el;
    // Move context menu to body so its z-index is in the root stacking context
    // (dashboardEl is position:fixed with z-index which would otherwise trap it)
    document.body.appendChild(el.querySelector('#emby-ctx-menu'));
    connectBtn       = el.querySelector('#emby-connect-btn');
    libraryContainer = el.querySelector('#emby-library-container');

    // Store-key toggle
    const storeChk   = el.querySelector('#emby-store-key');
    const disclaimer = el.querySelector('#emby-store-disclaimer');
    if (localStorage.getItem('embyApiKey')) storeChk.checked = true;
    if (storeChk.checked) disclaimer.style.display = '';
    storeChk.addEventListener('change', () => {
      disclaimer.style.display = storeChk.checked ? '' : 'none';
    });

    // Buttons
    el.querySelector('#emby-close-btn').addEventListener('click', hideEmbyDashboard);
    connectBtn.addEventListener('click', connectToEmby);
    el.querySelector('#emby-push-btn').addEventListener('click', pushCanvasToEmby);
    el.querySelector('#emby-push-clear').addEventListener('click', clearSelection);

    // Search
    el.querySelector('#emby-search').addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => filterLibrary(this.value), 200);
    });

    // Filter tabs
    el.querySelectorAll('.emby-filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        el.querySelectorAll('.emby-filter-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        filterLibrary(el.querySelector('#emby-search').value);
      });
    });

    // Sort
    const sortSel = el.querySelector('#emby-sort-select');
    if (sortSel) {
      sortSel.value = sortBy;
      sortSel.addEventListener('change', function () {
        sortBy = this.value;
        localStorage.setItem('embySortBy', sortBy);
        filterLibrary(el.querySelector('#emby-search').value);
      });
    }

    // Quality filter
    const qualSel = el.querySelector('#emby-quality-filter');
    if (qualSel) {
      qualSel.value = qualityFilter;
      qualSel.addEventListener('change', function () {
        qualityFilter = this.value;
        localStorage.setItem('embyQualityFilter', qualityFilter);
        handleQualityFilterChange();
      });
    }

    // Customised filter
    const custSel = el.querySelector('#emby-customised-filter');
    if (custSel) {
      custSel.value = showCustomised;
      custSel.addEventListener('change', function () {
        showCustomised = this.value;
        localStorage.setItem('embyShowCustomised', showCustomised);
        filterLibrary(el.querySelector('#emby-search').value);
      });
    }

    // Grid size toggle
    el.querySelectorAll('.emby-size-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.size === gridSize);
      btn.addEventListener('click', function () {
        gridSize = btn.dataset.size;
        localStorage.setItem('embyGridSize', gridSize);
        el.querySelectorAll('.emby-size-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyGridSize();
      });
    });

    // View mode toggle
    el.querySelectorAll('.emby-view-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.view === viewMode);
      btn.addEventListener('click', function () {
        viewMode = btn.dataset.view;
        localStorage.setItem('embyViewMode', viewMode);
        el.querySelectorAll('.emby-view-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterLibrary(el.querySelector('#emby-search').value);
      });
    });

    // Search clear button
    const searchInput = el.querySelector('#emby-search');
    const searchClear = el.querySelector('#emby-search-clear');
    if (searchClear) {
      searchClear.addEventListener('click', function () {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filterLibrary('');
        searchInput.focus();
      });
    }
    if (searchInput && searchClear) {
      searchInput.addEventListener('input', function () {
        searchClear.style.display = this.value ? '' : 'none';
      });
    }

    // Refresh button
    const refreshBtn = el.querySelector('#emby-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (!embyConfig.connected) return;
        loadLibrary();
      });
    }

    const multiSelectBtn = el.querySelector('#emby-multiselect-btn');
    if (multiSelectBtn) {
      multiSelectBtn.addEventListener('click', function () {
        multiSelectMode = !multiSelectMode;
        multiSelectBtn.classList.toggle('active', multiSelectMode);
        el.classList.toggle('select-mode-active', multiSelectMode);
        if (!multiSelectMode) {
          multiSelectedIds.clear();
          el.querySelectorAll('.multi-selected').forEach(function (c) { c.classList.remove('multi-selected'); });
        }
        updateBulkBar();
      });
    }

    const bulkMarkBtn   = el.querySelector('#emby-bulk-mark-btn');
    const bulkUnmarkBtn = el.querySelector('#emby-bulk-unmark-btn');
    const bulkClearBtn  = el.querySelector('#emby-bulk-clear-btn');

    if (bulkMarkBtn) {
      bulkMarkBtn.addEventListener('click', function () {
        multiSelectedIds.forEach(function (id) {
          if (!customisedIds.has(id)) {
            customisedIds.add(id);
            const card = el.querySelector('[data-id="' + id + '"]');
            if (card) card.classList.add('customised');
          }
        });
        saveCustomisedIds();
        showToast('Marked ' + multiSelectedIds.size + ' item(s) as customised', 'success');
        exitMultiSelectMode();
      });
    }

    if (bulkUnmarkBtn) {
      bulkUnmarkBtn.addEventListener('click', function () {
        multiSelectedIds.forEach(function (id) {
          customisedIds.delete(id);
          const card = el.querySelector('[data-id="' + id + '"]');
          if (card) {
            card.classList.remove('customised');
            const badge = card.querySelector('.emby-customised-badge');
            if (badge) badge.remove();
          }
        });
        saveCustomisedIds();
        showToast('Removed customised mark from ' + multiSelectedIds.size + ' item(s)', 'info');
        exitMultiSelectMode();
      });
    }

    if (bulkClearBtn) {
      bulkClearBtn.addEventListener('click', function () {
        exitMultiSelectMode();
      });
    }

    // Context menu (moved to body — use getElementById, not el.querySelector)
    const ctxMenu = document.getElementById('emby-ctx-menu');
    let ctxTargetEl = null;

    el.querySelector('#emby-library-container').addEventListener('contextmenu', function (e) {
      const card = e.target.closest('.emby-item, .emby-list-item');
      if (!card) return;
      e.preventDefault();
      ctxTargetEl = card;
      const isCustom = customisedIds.has(card.dataset.id);
      ctxMenu.querySelector('#emby-ctx-toggle-custom').textContent =
        isCustom ? '\u2715 Remove Customised Mark' : '\u2713 Mark as Customised';
      const mx = Math.min(e.clientX, window.innerWidth - 210);
      const my = Math.min(e.clientY, window.innerHeight - 90);
      ctxMenu.style.left = mx + 'px';
      ctxMenu.style.top  = my + 'px';
      ctxMenu.style.display = 'block';
    });

    // Context menu also works on season items inside the modal (body-appended)
    document.addEventListener('contextmenu', function (e) {
      const card = e.target.closest('.emby-season-item');
      if (!card) return;
      if (!dashboardEl || dashboardEl.style.display === 'none') return;
      e.preventDefault();
      ctxTargetEl = card;
      const isCustom = customisedIds.has(card.dataset.id);
      ctxMenu.querySelector('#emby-ctx-toggle-custom').textContent =
        isCustom ? '\u2715 Remove Customised Mark' : '\u2713 Mark as Customised';
      const mx = Math.min(e.clientX, window.innerWidth - 210);
      const my = Math.min(e.clientY, window.innerHeight - 90);
      ctxMenu.style.left = mx + 'px';
      ctxMenu.style.top  = my + 'px';
      ctxMenu.style.display = 'block';
    });

    ctxMenu.querySelector('#emby-ctx-toggle-custom').addEventListener('click', function () {
      if (!ctxTargetEl) return;
      const id       = ctxTargetEl.dataset.id;
      const name     = ctxTargetEl.dataset.name;
      const isSeries = ctxTargetEl.dataset.type === 'Series';
      const isSeasonItem = ctxTargetEl.classList.contains('emby-season-item');

      if (customisedIds.has(id)) {
        // Unmark — if it's a Series card, also unmark all known seasons
        customisedIds.delete(id);
        ctxTargetEl.classList.remove('customised');
        const badge = ctxTargetEl.querySelector('.emby-customised-badge');
        if (badge) badge.remove();
        if (isSeries && seriesSeasonIds[id]) {
          seriesSeasonIds[id].forEach(function (sid) { customisedIds.delete(sid); });
        }
        showToast('Removed customised mark from \u201c' + name + '\u201d', 'info');
      } else {
        // Mark — if it's a Series card, also mark all known seasons
        customisedIds.add(id);
        if (isSeries && seriesSeasonIds[id]) {
          seriesSeasonIds[id].forEach(function (sid) { customisedIds.add(sid); });
        }
        ctxTargetEl.classList.add('customised');
        if (ctxTargetEl.classList.contains('emby-list-item')) {
          const meta = ctxTargetEl.querySelector('.emby-list-item-meta');
          if (meta && !meta.querySelector('.emby-customised-badge')) {
            const badge = document.createElement('span');
            badge.className = 'emby-customised-badge';
            badge.textContent = '\u2713 Customised';
            meta.appendChild(badge);
          }
        }
        showToast('Marked \u201c' + name + '\u201d as customised', 'info');
      }
      saveCustomisedIds();

      // If a Series card: update its pill/state and sync the open modal if any
      if (isSeries) {
        updateMainCardState(id);
        const modal = document.getElementById('emby-seasons-modal');
        if (modal && modal.dataset.showId === id) {
          // Sync season item classes inside the modal
          modal.querySelectorAll('.emby-season-item').forEach(function (s) {
            if (customisedIds.has(s.dataset.id)) s.classList.add('customised');
            else s.classList.remove('customised');
          });
          refreshSeasonsPanelProgress(modal);
        }
      }

      // If a season item in the modal: refresh modal progress + parent card
      if (isSeasonItem) {
        const modal = document.getElementById('emby-seasons-modal');
        if (modal) {
          refreshSeasonsPanelProgress(modal);
          updateMainCardState(modal.dataset.showId);
        }
      }
      ctxMenu.style.display = 'none';
      ctxTargetEl = null;
    });

    ctxMenu.querySelector('#emby-ctx-select').addEventListener('click', function () {
      if (!ctxTargetEl) return;
      selectTarget(ctxTargetEl.dataset.id, ctxTargetEl.dataset.name, ctxTargetEl.dataset.type);
      ctxMenu.style.display = 'none';
      ctxTargetEl = null;
    });

    // Hide context menu on any click or scroll outside
    document.addEventListener('click', function onCtxClose(e) {
      if (!e.target.closest('#emby-ctx-menu')) ctxMenu.style.display = 'none';
    });
    el.querySelector('#emby-library-container').addEventListener('scroll', function () {
      ctxMenu.style.display = 'none';
    });

    // Auto-connect if saved credentials exist
    if (embyConfig.url && embyConfig.apiKey) {
      connectToEmby(true);
    }
  }

  function showEmbyDashboard() {
    if (!dashboardEl) initEmbyDashboard();
    dashboardEl.style.display = 'flex';
    document.body.classList.add('emby-dashboard-open');
    document.addEventListener('keydown', onDashboardKeyDown);
  }

  function hideEmbyDashboard() {
    if (!dashboardEl) return;
    dashboardEl.style.display = 'none';
    document.body.classList.remove('emby-dashboard-open');
    document.removeEventListener('keydown', onDashboardKeyDown);
  }

  function onDashboardKeyDown(e) {
    if (e.key === 'Escape') {
      // Close seasons modal first if open
      const modal    = document.getElementById('emby-seasons-modal');
      const backdrop = document.getElementById('emby-seasons-backdrop');
      if (modal || backdrop) {
        if (modal)    { modal.classList.remove('open');    setTimeout(function () { modal.remove(); },    200); }
        if (backdrop) { backdrop.classList.remove('open'); setTimeout(function () { backdrop.remove(); }, 200); }
        dashboardEl.querySelectorAll('.emby-item.expanded').forEach(function (c) { c.classList.remove('expanded'); });
        return;
      }
      if (multiSelectMode) {
        exitMultiSelectMode();
      } else {
        hideEmbyDashboard();
      }
    }
  }

  function applyGridSize() {
    const grid = libraryContainer && libraryContainer.querySelector('.emby-library-grid');
    if (grid) {
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + GRID_SIZES[gridSize] + ', 1fr))';
    }
  }

  function refreshSeasonsPanelProgress(container) {
    const items = container.querySelectorAll('.emby-season-item');
    const done  = Array.from(items).filter(function (i) { return customisedIds.has(i.dataset.id); }).length;
    const prog  = container.querySelector('.emby-seasons-progress');
    if (prog) prog.textContent = done + '\u202f/\u202f' + items.length + ' customised';
  }

  // Refresh the partial/full/none state and progress pill on a main library card
  function updateMainCardState(showId) {
    const card = libraryContainer && libraryContainer.querySelector('[data-id="' + showId + '"]');
    if (!card) return;
    const ids = seriesSeasonIds[showId];
    card.classList.remove('customised', 'partial');
    var pill = card.querySelector('.emby-item-progress-pill');
    if (!ids || !ids.length) {
      if (customisedIds.has(showId)) card.classList.add('customised');
      if (pill) pill.remove();
      return;
    }
    const done  = ids.filter(function (sid) { return customisedIds.has(sid); }).length;
    const total = ids.length;
    if (done === total && done > 0)      card.classList.add('customised');
    else if (done > 0)                   card.classList.add('partial');
    // Update/inject pill
    var badgesEl = card.querySelector('.emby-item-badges');
    if (done > 0) {
      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'emby-item-progress-pill';
        if (badgesEl) badgesEl.appendChild(pill);
      }
      pill.textContent = done + '\u202f/\u202f' + total;
      pill.classList.toggle('partial', done < total);
      pill.classList.toggle('full',    done === total);
    } else {
      if (pill) pill.remove();
    }
  }

  // Re-open the seasons modal for a show by its ID — used after a push to keep context
  async function openShowModal(showId, showName, tmdbId) {
    // Re-open the seasons modal over the editor (no dashboard flash).
    // If the card is present in the library, trigger item click to rebuild the modal.
    // Fall back to showing the dashboard only if the card is missing (e.g. filtered out).
    const card = libraryContainer && libraryContainer.querySelector('[data-id="' + showId + '"]');
    if (card) {
      onItemClick(card, null);
    } else {
      showEmbyDashboard();
    }
  }

  function updateBulkBar() {    const bar = dashboardEl && dashboardEl.querySelector('#emby-bulk-bar');
    const countEl = dashboardEl && dashboardEl.querySelector('#emby-bulk-count');
    if (!bar) return;
    const n = multiSelectedIds.size;
    if (countEl) countEl.textContent = n + ' selected';
    bar.style.display = multiSelectMode ? 'flex' : 'none';
  }

  function exitMultiSelectMode() {
    multiSelectMode  = false;
    multiSelectedIds.clear();
    lastMultiSelectIndex = -1;
    if (dashboardEl) {
      dashboardEl.classList.remove('select-mode-active');
      dashboardEl.querySelectorAll('.multi-selected').forEach(function (el) {
        el.classList.remove('multi-selected');
      });
      const msBtn = dashboardEl.querySelector('#emby-multiselect-btn');
      if (msBtn) msBtn.classList.remove('active');
    }
    updateBulkBar();
  }

  // ── Connect ────────────────────────────────────────────────────────────
  async function connectToEmby(silent) {
    silent = silent === true;
    const urlInput    = document.getElementById('emby-url-input');
    const keyInput    = document.getElementById('emby-key-input');
    const statusEl    = document.getElementById('emby-status');

    embyConfig.url    = urlInput.value.trim().replace(/\/+$/, '');
    embyConfig.apiKey = keyInput.value.trim();

    if (!embyConfig.url || !embyConfig.apiKey) {
      if (!silent) {
        statusEl.textContent = 'Please enter both URL and API key.';
        statusEl.className = 'emby-status-text error';
      }
      return;
    }

    if (!silent) {
      connectBtn.disabled = true;
      connectBtn.innerHTML = '<svg class="emby-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Connecting\u2026';
      statusEl.textContent = 'Testing connection\u2026';
      statusEl.className = 'emby-status-text';
    }

    try {
      const res = await fetch(embyConfig.url + '/System/Info', {
        headers: embyAuthHeaders()
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const info = await res.json();

      embyConfig.connected  = true;
      embyConfig.serverName = info.ServerName || 'Emby';

      // Persist config
      localStorage.setItem('embyUrl', embyConfig.url);
      const storeChk = document.getElementById('emby-store-key');
      if (storeChk && storeChk.checked) {
        localStorage.setItem('embyApiKey', btoa(embyConfig.apiKey));
      } else if (!silent) {
        localStorage.removeItem('embyApiKey');
      }

      if (!silent) {
        statusEl.textContent = 'Connected to ' + embyConfig.serverName;
        statusEl.className = 'emby-status-text success';
      }

      showLibrarySection();
      loadLibrary();
      setCanvasPushButtonsVisible(true);

    } catch (err) {
      embyConfig.connected = false;
      if (!silent) {
        statusEl.textContent = 'Could not connect: ' + err.message;
        statusEl.className = 'emby-status-text error';
      }
    } finally {
      if (!silent) {
        connectBtn.disabled = false;
        connectBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-right:6px;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' +
          ' Connect to Emby';
      }
    }
  }

  function showLibrarySection() {
    document.getElementById('emby-connection-form').style.display = 'none';
    document.getElementById('emby-library-section').style.display = 'flex';

    // Insert connected bar if not already present
    if (!document.getElementById('emby-connected-bar')) {
      const bar = document.createElement('div');
      bar.id = 'emby-connected-bar';
      bar.className = 'emby-connected-bar';
      bar.innerHTML =
        '<div class="emby-connected-info">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52b54b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '<span class="emby-connected-label">Connected to <strong>' + escapeHtml(embyConfig.serverName) + '</strong></span>' +
          '<span class="emby-connected-url">' + escapeHtml(embyConfig.url) + '</span>' +
        '</div>' +
        '<button id="emby-disconnect-btn" class="action-button small">Disconnect</button>';

      const header = dashboardEl.querySelector('.emby-header');
      header.insertAdjacentElement('afterend', bar);
      document.getElementById('emby-disconnect-btn').addEventListener('click', disconnectEmby);
    }
  }

  function disconnectEmby() {
    embyConfig.connected = false;
    const bar = document.getElementById('emby-connected-bar');
    if (bar) bar.remove();
    document.getElementById('emby-connection-form').style.display = 'block';
    document.getElementById('emby-library-section').style.display = 'none';
    document.getElementById('emby-push-bar').style.display = 'none';
    const statusEl = document.getElementById('emby-status');
    statusEl.textContent = 'Disconnected.';
    statusEl.className = 'emby-status-text';
    selectedTarget = null;
    allItems = [];
    setCanvasPushButtonsVisible(false);
  }

  function setCanvasPushButtonsVisible(visible) {
    var display = visible ? '' : 'none';
    var sidebarBtn = document.getElementById('emby-push-canvas-btn');
    var ebBtn      = document.getElementById('eb-emby-push-btn');
    if (sidebarBtn) sidebarBtn.style.display = display;
    if (ebBtn)      ebBtn.style.display      = display;
  }

  function handleCanvasPush() {
    if (!selectedTarget) {
      // No target yet — open the dashboard so user can pick one
      showEmbyDashboard();
      showToast('Select a title from the library to push to.', 'info');
      return;
    }
    pushCanvasToEmby();
  }

  // ── Library ────────────────────────────────────────────────────────────

  // Quality filters: 4k/hd/sd are server-side (refetch); hdr/dv are client-side (VideoInfoTags)
  function handleQualityFilterChange() {
    const serverTarget = ['4k', 'hd', 'sd'].includes(qualityFilter) ? qualityFilter : 'all';
    if (serverTarget !== serverQualityFilter) {
      loadLibrary(); // refetch with new server-side params
    } else {
      filterLibrary(document.getElementById('emby-search') ? document.getElementById('emby-search').value : '');
    }
  }

  async function loadLibrary() {
    libraryContainer.innerHTML = '<div class="emby-loading"><div class="emby-spinner"></div><p>Loading library\u2026</p></div>';

    let qualityParams = '';
    if (qualityFilter === '4k') qualityParams = '&Is4K=true';
    else if (qualityFilter === 'hd') qualityParams = '&IsHD=true&Is4K=false';
    else if (qualityFilter === 'sd') qualityParams = '&IsHD=false';
    // 'hdr' and 'dv' are filtered client-side from MediaStreams.VideoRangeType

    try {
      const res = await fetch(
        embyConfig.url + '/Items?IncludeItemTypes=Movie,Series&Recursive=true' +
          '&Fields=PrimaryImageAspectRatio,BasicSyncInfo,ProviderIds,Genres,MediaStreams' +
          '&SortBy=SortName&SortOrder=Ascending&Limit=2000' + qualityParams,
        { headers: embyAuthHeaders() }
      );
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      allItems = data.Items || [];
      serverQualityFilter = ['4k', 'hd', 'sd'].includes(qualityFilter) ? qualityFilter : 'all';
      populateGenreFilter();
      filterLibrary(document.getElementById('emby-search') ? document.getElementById('emby-search').value : '');
    } catch (err) {
      libraryContainer.innerHTML =
        '<div class="emby-error"><p>Failed to load library: ' + escapeHtml(err.message) + '</p>' +
        '<button class="action-button" id="emby-retry-btn">Retry</button></div>';
      const retryBtn = document.getElementById('emby-retry-btn');
      if (retryBtn) retryBtn.addEventListener('click', loadLibrary);
    }
  }

  function populateGenreFilter() {
    const sel = document.getElementById('emby-genre-select');
    if (!sel) return;
    const genres = new Set();
    allItems.forEach(function (item) {
      if (Array.isArray(item.Genres)) {
        item.Genres.forEach(function (g) { genres.add(g); });
      }
    });
    const sorted = Array.from(genres).sort();
    // Keep the "All Genres" option, replace the rest
    sel.innerHTML = '<option value="">All Genres</option>' +
      sorted.map(function (g) {
        return '<option value="' + escapeAttr(g) + '">' + escapeHtml(g) + '</option>';
      }).join('');
    sel.value = '';
    // Wire once (guarded by flag)
    if (!sel._embyGenreWired) {
      sel._embyGenreWired = true;
      sel.addEventListener('change', function () {
        const q = document.getElementById('emby-search');
        filterLibrary(q ? q.value : '');
      });
    }
  }

  function getActiveFilterType() {
    const tab = dashboardEl.querySelector('.emby-filter-tab.active');
    return tab ? tab.dataset.type : 'all';
  }

  function filterLibrary(query) {
    const type  = getActiveFilterType();
    const q     = (query || '').toLowerCase();
    const genreSel  = document.getElementById('emby-genre-select');
    const genreVal  = genreSel ? genreSel.value : '';

    const filtered = allItems.filter(function (item) {
      const matchType   = type === 'all' || item.Type === type;
      const matchName   = !q || item.Name.toLowerCase().includes(q);
      const matchGenre  = !genreVal || (Array.isArray(item.Genres) && item.Genres.includes(genreVal));
      const isCustom    = customisedIds.has(item.Id);
      const matchCustom = showCustomised === 'all' ||
                          (showCustomised === 'only' && isCustom) ||
                          (showCustomised === 'hide' && !isCustom);
      // Quality: server-side filters (4k/hd/sd) already applied on allItems, only client-side needed
      const matchQuality = qualityFilter === 'all' ||
                           (qualityFilter === '4k' && !itemHasHdr(item) && !itemHasDv(item)) ||
                           qualityFilter === 'hd' ||
                           qualityFilter === 'sd' ||
                           (qualityFilter === 'hdr' && itemHasHdr(item)) ||
                           (qualityFilter === 'dv'  && itemHasDv(item));
      return matchType && matchName && matchGenre && matchCustom && matchQuality;
    });
    const sorted = sortItems(filtered);
    const countEl = document.getElementById('emby-item-count');
    if (countEl) countEl.textContent = sorted.length + ' of ' + allItems.length;
    renderLibrary(sorted);
  }

  function getVideoRangeType(item) {
    if (!Array.isArray(item.MediaStreams)) return '';
    const vs = item.MediaStreams.find(function (s) { return s.Type === 'Video'; });
    return vs ? (vs.VideoRangeType || vs.VideoRange || '') : '';
  }

  function itemHasHdr(item) {
    const vrt = getVideoRangeType(item).toLowerCase();
    // Exclude DV titles — DV is handled separately by itemHasDv
    const hasDv = vrt.includes('dovi') || vrt.includes('dolbyvision');
    return !hasDv && (vrt.includes('hdr') || vrt === 'hlg');
  }

  function itemHasDv(item) {
    const vrt = getVideoRangeType(item).toLowerCase();
    return vrt.includes('dovi') || vrt.includes('dolbyvision');
  }

  function getQualityBadgeHtml(item) {
    const vrt = getVideoRangeType(item);
    if (!vrt || vrt.toUpperCase() === 'SDR') return '';
    if (itemHasDv(item))  return '<span class="emby-quality-badge dv">DV</span>';
    if (itemHasHdr(item)) return '<span class="emby-quality-badge hdr">HDR</span>';
    return '';
  }

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      switch (sortBy) {
        case 'name-desc': return b.Name.localeCompare(a.Name);
        case 'year-desc': return (b.ProductionYear || 0) - (a.ProductionYear || 0);
        case 'year-asc':  return (a.ProductionYear || 0) - (b.ProductionYear || 0);
        default:          return a.Name.localeCompare(b.Name);
      }
    });
  }

  function thumbUrl(itemId) {
    const bust = pushedTimestamps.has(itemId) ? '&_t=' + pushedTimestamps.get(itemId) : '';
    return embyConfig.url + '/Items/' + itemId + '/Images/Primary?maxWidth=150&quality=75' +
      '&X-Emby-Token=' + encodeURIComponent(embyConfig.apiKey) + bust;
  }

  function renderLibrary(items) {
    lastMultiSelectIndex = -1;
    if (!items.length) {
      libraryContainer.innerHTML = '<div class="emby-empty"><p>No items found.</p></div>';
      return;
    }

    if (viewMode === 'list') {
      let html = '<div class="emby-list-view">';
      items.forEach(function (item) {
        const typeLabel  = item.Type === 'Series' ? 'TV Show' : 'Movie';
        const typeClass  = item.Type === 'Series' ? 'series' : 'movie';
        const tmdbId     = (item.ProviderIds && item.ProviderIds.Tmdb) ? item.ProviderIds.Tmdb : '';
        const qualBadge  = getQualityBadgeHtml(item);
        // Partial/full customised state
        var cardStateClass = '';
        var progressPill = '';
        var isCustom = false;
        if (item.Type === 'Series' && seriesSeasonIds[item.Id]) {
          const sids  = seriesSeasonIds[item.Id];
          const sdone = sids.filter(function (sid) { return customisedIds.has(sid); }).length;
          const stot  = sids.length;
          isCustom = sdone === stot && sdone > 0;
          if (sdone === stot && sdone > 0)    cardStateClass = ' customised';
          else if (sdone > 0)                 cardStateClass = ' partial';
          if (sdone > 0) progressPill = ' <span class="emby-item-progress-pill ' + (sdone < stot ? 'partial' : 'full') + '">' + sdone + '\u202f/\u202f' + stot + '</span>';
        } else {
          isCustom = customisedIds.has(item.Id);
          if (isCustom) cardStateClass = ' customised';
        }
        html +=
          '<div class="emby-list-item' + cardStateClass + (multiSelectedIds.has(item.Id) ? ' multi-selected' : '') +
            '" data-id="' + escapeAttr(item.Id) +
            '" data-name="' + escapeAttr(item.Name) +
            '" data-type="' + escapeAttr(item.Type) +
            '" data-tmdb-id="' + escapeAttr(tmdbId) + '">' +
            '<div class="emby-list-item-thumb">' +
              '<img src="' + thumbUrl(item.Id) + '" loading="lazy" onerror="this.style.display=\'none\'" />' +
            '</div>' +
            '<div class="emby-list-item-info">' +
              '<span class="emby-list-item-name">' + escapeHtml(item.Name) + '</span>' +
              '<span class="emby-list-item-meta">' +
                (item.ProductionYear ? item.ProductionYear + ' \u00b7 ' : '') +
                '<span class="emby-type-badge ' + typeClass + '">' + typeLabel + '</span>' +
                (qualBadge ? ' ' + qualBadge : '') +
                (isCustom ? ' <span class="emby-customised-badge">\u2713 Customised</span>' : progressPill) +
              '</span>' +
            '</div>' +
            '<div class="emby-list-item-action">' +
              (item.Type === 'Series'
                ? '<span class="emby-load-hint">Pick season \u2192</span>'
                : '<span class="emby-load-hint">Load to canvas \u2192</span>') +
            '</div>' +
          '</div>';
      });
      html += '</div>';
      libraryContainer.innerHTML = html;
      libraryContainer.querySelectorAll('.emby-list-item').forEach(function (el) {
        el.addEventListener('click', function (e) { onItemClick(el, e); });
      });
    } else {
      let html = '<div class="emby-library-grid">';
      items.forEach(function (item) {
        const typeLabel  = item.Type === 'Series' ? 'TV Show' : 'Movie';
        const typeClass  = item.Type === 'Series' ? 'series' : 'movie';
        const tmdbId     = (item.ProviderIds && item.ProviderIds.Tmdb) ? item.ProviderIds.Tmdb : '';
        const qualBadge  = getQualityBadgeHtml(item);
        // Partial/full customised state
        var cardStateClass = '';
        var progressPill = '';
        if (item.Type === 'Series' && seriesSeasonIds[item.Id]) {
          const sids  = seriesSeasonIds[item.Id];
          const sdone = sids.filter(function (sid) { return customisedIds.has(sid); }).length;
          const stot  = sids.length;
          if (sdone === stot && sdone > 0)    cardStateClass = ' customised';
          else if (sdone > 0)                 cardStateClass = ' partial';
          if (sdone > 0) progressPill = '<span class="emby-item-progress-pill ' + (sdone < stot ? 'partial' : 'full') + '">' + sdone + '\u202f/\u202f' + stot + '</span>';
        } else {
          if (customisedIds.has(item.Id)) cardStateClass = ' customised';
        }
        html +=
          '<div class="emby-item' + cardStateClass + (multiSelectedIds.has(item.Id) ? ' multi-selected' : '') +
            '" data-id="' + escapeAttr(item.Id) +
            '" data-name="' + escapeAttr(item.Name) +
            '" data-type="' + escapeAttr(item.Type) +
            '" data-tmdb-id="' + escapeAttr(tmdbId) + '">' +
            '<div class="emby-item-thumb">' +
              '<img src="' + thumbUrl(item.Id) + '" alt="' + escapeAttr(item.Name) + '" loading="lazy" onerror="this.parentElement.classList.add(\'no-image\');this.remove()" />' +

              '<div class="emby-item-checkbox"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
              '<div class="emby-item-hover-overlay">' +
                (item.Type === 'Series'
                  ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg><span>Pick season</span>'
                  : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 3 12 12 3 21 12 19 12"/><polyline points="19 12 19 21 5 21 5 12"/></svg><span>Load to canvas</span>') +
              '</div>' +
            '</div>' +
            '<div class="emby-item-name">' + escapeHtml(item.Name) + '</div>' +
            '<div class="emby-item-badges">' +
              '<span class="emby-type-badge ' + typeClass + '">' + typeLabel + '</span>' +
              (qualBadge ? qualBadge : '') +
              (item.ProductionYear ? '<span class="emby-item-year-inline">' + item.ProductionYear + '</span>' : '') +
              (progressPill ? progressPill : '') +
            '</div>' +
          '</div>';
      });
      html += '</div>';
      libraryContainer.innerHTML = html;
      libraryContainer.querySelectorAll('.emby-item').forEach(function (el) {
        el.addEventListener('click', function (e) { onItemClick(el, e); });
      });
      applyGridSize();
    }
  }

  let lastMultiSelectIndex = -1;

  async function onItemClick(el, e) {
    const id     = el.dataset.id;
    const name   = el.dataset.name;
    const type   = el.dataset.type;
    const tmdbId = el.dataset.tmdbId || '';

    // Multi-select mode: toggle selection on the card
    if (multiSelectMode) {
      const cardSelector = el.classList.contains('emby-item') ? '.emby-item' : '.emby-list-item';
      const allCards = Array.from(libraryContainer.querySelectorAll(cardSelector));
      const clickedIndex = allCards.indexOf(el);

      if (e && e.shiftKey && lastMultiSelectIndex !== -1) {
        // Range select: add all cards between lastMultiSelectIndex and clickedIndex
        const from = Math.min(lastMultiSelectIndex, clickedIndex);
        const to   = Math.max(lastMultiSelectIndex, clickedIndex);
        for (let i = from; i <= to; i++) {
          const card = allCards[i];
          multiSelectedIds.add(card.dataset.id);
          card.classList.add('multi-selected');
        }
      } else {
        // Normal toggle
        if (multiSelectedIds.has(id)) {
          multiSelectedIds.delete(id);
          el.classList.remove('multi-selected');
        } else {
          multiSelectedIds.add(id);
          el.classList.add('multi-selected');
        }
        lastMultiSelectIndex = clickedIndex;
      }
      updateBulkBar();
      return;
    }

    if (type === 'Series') {
      // Close any existing seasons modal first (one at a time)
      const existing = document.getElementById('emby-seasons-modal');
      if (existing) {
        const prevId = existing.dataset.showId;
        existing.remove();
        document.getElementById('emby-seasons-backdrop') && document.getElementById('emby-seasons-backdrop').remove();
        // If toggling the same show, just close
        if (prevId === id) {
          dashboardEl.querySelectorAll('.emby-item.expanded').forEach(function (c) { c.classList.remove('expanded'); });
          return;
        }
      }
      dashboardEl.querySelectorAll('.emby-item.expanded').forEach(function (c) { c.classList.remove('expanded'); });
      el.classList.add('expanded');

      try {
        const res = await fetch(embyConfig.url + '/Shows/' + id + '/Seasons', {
          headers: embyAuthHeaders()
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data    = await res.json();
        const seasons = data.Items || [];

        // Cache season IDs for this show so the main card can show partial state
        seriesSeasonIds[id] = [id].concat(seasons.map(function (s) { return s.Id; }));
        saveSeriesSeasonIds();

        // Expose a season-number → Emby-ID map for the editor's Season Suite badge overlay
        var activeSeasonMap = { base: id, _showName: name };
        seasons.forEach(function (s) {
          if (s.IndexNumber != null) activeSeasonMap[s.IndexNumber] = s.Id;
        });
        window._embyActiveSeasonMap = activeSeasonMap;
        try { localStorage.setItem('embyActiveSeasonMap', JSON.stringify(activeSeasonMap)); } catch (e) {}

        function buildSeasonItem(itemId, itemName, itemType, labelHtml, isSeriesPoster) {
          const isCustom = customisedIds.has(itemId);
          return '<div class="emby-season-item' +
            (isCustom ? ' customised' : '') +
            (isSeriesPoster ? ' series-poster-item' : '') +
            '" data-id="' + escapeAttr(itemId) +
            '" data-name="' + escapeAttr(itemName) +
            '" data-type="' + escapeAttr(itemType) +
            '" data-tmdb-id="' + escapeAttr(tmdbId) + '">' +
            '<div class="emby-season-thumb-wrap">' +
              '<img src="' + thumbUrl(itemId) + '" loading="lazy" onerror="this.parentElement.classList.add(\'no-img\')" />' +
              '<div class="emby-season-hover-overlay"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 3 12 12 3 21 12 19 12"/><polyline points="19 12 19 21 5 21 5 12"/></svg><span>Load</span></div>' +
            '</div>' +
            '<div class="emby-season-label">' + labelHtml + '</div>' +
          '</div>';
        }

        let seasonItems = buildSeasonItem(id, name, 'Series',
          '<span class="emby-season-name">Show Poster</span>', true);

        seasons.forEach(function (s) {
          const seasonNum = s.IndexNumber != null ? s.IndexNumber : null;
          const label = seasonNum != null
            ? '<span class="emby-season-name">' + (seasonNum === 0 ? escapeHtml(s.Name) : 'Season\u00a0' + seasonNum) + '</span>'
            : '<span class="emby-season-name">' + escapeHtml(s.Name) + '</span>';
          seasonItems += buildSeasonItem(s.Id, name + ' \u2014 ' + s.Name, 'Season', label, false);
        });

        const customisedCount = seasons.filter(function (s) { return customisedIds.has(s.Id); }).length +
                                (customisedIds.has(id) ? 1 : 0);
        const totalCount = seasons.length + 1;

        function closeModal() {
          const m = document.getElementById('emby-seasons-modal');
          const b = document.getElementById('emby-seasons-backdrop');
          if (m) { m.classList.remove('open'); setTimeout(function () { m.remove(); }, 200); }
          if (b) { b.classList.remove('open'); setTimeout(function () { b.remove(); }, 200); }
          el.classList.remove('expanded');
        }

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'emby-seasons-backdrop';
        backdrop.className = 'emby-seasons-backdrop';
        backdrop.addEventListener('click', closeModal);
        document.body.appendChild(backdrop);

        // Modal
        const modal = document.createElement('div');
        modal.id = 'emby-seasons-modal';
        modal.className = 'emby-seasons-modal';
        modal.dataset.showId = id;
        modal.innerHTML =
          '<div class="emby-seasons-header">' +
            '<div class="emby-seasons-title">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.55;flex-shrink:0"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' +
              '<span>' + escapeHtml(name) + '</span>' +
              '<span class="emby-seasons-progress">' + customisedCount + '\u202f/\u202f' + totalCount + ' customised</span>' +
            '</div>' +
            '<button class="emby-seasons-close" aria-label="Close">\u2715</button>' +
          '</div>' +
          '<div class="emby-seasons-list">' + seasonItems + '</div>' +
          '<div class="emby-seasons-footer">' +
            '<button class="emby-seasons-footer-btn back" data-action="back-library">\u2190 Library</button>' +
            '<button class="emby-seasons-footer-btn mark" data-action="mark-all">\u2713 Mark All</button>' +
            '<button class="emby-seasons-footer-btn unmark" data-action="unmark-all">\u2715 Unmark All</button>' +
            '<button class="emby-seasons-footer-btn next" data-action="next-season">\u2192 Next</button>' +
          '</div>';

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(function () {
          backdrop.classList.add('open');
          modal.classList.add('open');
        });

        modal.querySelector('.emby-seasons-close').addEventListener('click', function (e) {
          e.stopPropagation();
          closeModal();
        });

        modal.querySelector('[data-action="back-library"]').addEventListener('click', function () {
          activeShowCtx = null;
          closeModal();
          showEmbyDashboard();
        });

        modal.querySelector('[data-action="next-season"]').addEventListener('click', function () {
          const items = Array.from(modal.querySelectorAll('.emby-season-item'));
          const next  = items.find(function (s) { return !customisedIds.has(s.dataset.id); });
          if (!next) { showToast('All seasons customised ✓', 'success'); return; }
          closeModal();
          activeShowCtx = { showId: id, showName: name, tmdbId: tmdbId };
          loadItemToCanvas(next.dataset.id, next.dataset.name, next.dataset.tmdbId, 'tv');
          selectTarget(next.dataset.id, next.dataset.name, next.dataset.type);
          hideEmbyDashboard();
        });

        modal.querySelector('[data-action="mark-all"]').addEventListener('click', function () {
          modal.querySelectorAll('.emby-season-item').forEach(function (s) {
            customisedIds.add(s.dataset.id);
            s.classList.add('customised');
          });
          saveCustomisedIds();
          refreshSeasonsPanelProgress(modal);
          updateMainCardState(id);
        });

        modal.querySelector('[data-action="unmark-all"]').addEventListener('click', function () {
          modal.querySelectorAll('.emby-season-item').forEach(function (s) {
            customisedIds.delete(s.dataset.id);
            s.classList.remove('customised');
          });
          saveCustomisedIds();
          refreshSeasonsPanelProgress(modal);
          updateMainCardState(id);
        });

        modal.querySelectorAll('.emby-season-item').forEach(function (s) {
          s.addEventListener('click', function (e) {
            if (e.button !== 0) return;
            closeModal();
            loadItemToCanvas(s.dataset.id, s.dataset.name, s.dataset.tmdbId, 'tv');
            selectTarget(s.dataset.id, s.dataset.name, s.dataset.type);
            activeShowCtx = { showId: id, showName: name, tmdbId: tmdbId };
            hideEmbyDashboard();
          });
        });

      } catch (err) {
        showToast('Could not load seasons: ' + err.message, 'error');
        el.classList.remove('expanded');
      }

    } else {
      // Movie — load poster to canvas, select as push target, return to editor
      loadItemToCanvas(id, name, tmdbId, 'movie');
      selectTarget(id, name, type);
      hideEmbyDashboard();
    }
  }

  // ── Load Emby image onto the canvas ────────────────────────────────────
  async function loadItemToCanvas(id, name, tmdbId, tmdbType) {
    try {
      const res = await fetch(
        embyConfig.url + '/Items/' + id + '/Images/Primary',
        { headers: embyAuthHeaders() }
      );
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const blob = await res.blob();
      const file = new File([blob], (name || 'poster') + '.jpg', { type: blob.type || 'image/jpeg' });
      const dt   = new DataTransfer();
      dt.items.add(file);
      const posterUpload = document.getElementById('poster-upload');
      if (!posterUpload) { showToast('Canvas input not found.', 'error'); return; }

      // Clear previous title's clearlogo so it doesn't bleed into the new canvas render
      if (typeof window._embyClearLogoState === 'function') window._embyClearLogoState();

      // If we have a TMDB ID, set the hint so app.js skips its filename search
      if (tmdbId) {
        window._embyTmdbHint = { id: tmdbId, type: tmdbType || 'movie' };
      }

      // Auto-apply banner overlay based on HDR/DV from MediaStreams.VideoRangeType
      var autoLabel = null;
      var item = allItems.find(function (i) { return i.Id === id; });
      var overlaySelectEl = document.getElementById('overlay-select');
      if (overlaySelectEl) {
        var newOverlayVal = 'none';
        if (item) {
          if (itemHasDv(item)) {
            newOverlayVal = '../assets/movie-overlays/4K with DV.png';
            autoLabel = 'Dolby Vision banner auto-applied';
          } else if (itemHasHdr(item)) {
            newOverlayVal = '../assets/movie-overlays/4K with HDR.png';
            autoLabel = 'HDR banner auto-applied';
          } else if (qualityFilter === '4k') {
            newOverlayVal = '../assets/movie-overlays/4K no HDR.png';
            autoLabel = 'Ultra HD banner auto-applied';
          }
        }
        // Set all three overlay selects in sync (change event not dispatched here —
        // drawCanvas will use overlaySelect.value when the new image loads)
        overlaySelectEl.value = newOverlayVal;
        var ebOverlay     = document.getElementById('eb-overlay-select');
        var mobileOverlay = document.getElementById('mobile-overlay-select');
        if (ebOverlay)     ebOverlay.value     = newOverlayVal;
        if (mobileOverlay) mobileOverlay.value = newOverlayVal;
      }

      posterUpload.files = dt.files;
      posterUpload.dispatchEvent(new Event('change'));

      if (autoLabel) {
        setTimeout(function () { showToast(autoLabel, 'info'); }, 400);
      }
    } catch (err) {
      window._embyTmdbHint = null;
      showToast('Could not load image to canvas: ' + err.message, 'error');
    }
  }

  function selectTarget(id, name, type) {
    selectedTarget = { id: id, name: name, type: type };

    dashboardEl.querySelectorAll('.emby-item.selected').forEach(function (el) {
      el.classList.remove('selected');
    });
    const card = dashboardEl.querySelector('.emby-item[data-id="' + id + '"]');
    if (card) card.classList.add('selected');

    document.getElementById('emby-push-target-name').textContent = name;
    const bar = document.getElementById('emby-push-bar');
    bar.style.display = 'flex';

    // Update canvas-view button tooltips
    var sidebarBtn = document.getElementById('emby-push-canvas-btn');
    var ebBtn      = document.getElementById('eb-emby-push-btn');
    var tip = 'Push to Emby \u2014 ' + name;
    if (sidebarBtn) sidebarBtn.title = tip;
    if (ebBtn)      ebBtn.setAttribute('data-tooltip', tip);
  }

  function clearSelection() {
    selectedTarget = null;
    dashboardEl.querySelectorAll('.emby-item.selected').forEach(function (el) {
      el.classList.remove('selected');
    });
    document.getElementById('emby-push-bar').style.display = 'none';
  }

  // ── Push canvas to Emby ────────────────────────────────────────────────
  async function pushCanvasToEmby() {
    if (!selectedTarget) return;

    const canvas = document.getElementById('overlay-canvas');
    if (!canvas) {
      showToast('Canvas not found.', 'error');
      return;
    }

    const pushBtn = document.getElementById('emby-push-btn');
    pushBtn.disabled = true;
    pushBtn.innerHTML =
      '<svg class="emby-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' +
      ' Pushing\u2026';

    try {
      // Emby expects a raw Base64 string (no data-URL prefix) as the POST body
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const base64  = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

      const headers = Object.assign({ 'Content-Type': 'image/jpeg' }, embyAuthHeaders());
      const res = await fetch(
        embyConfig.url + '/Items/' + selectedTarget.id + '/Images/Primary',
        { method: 'POST', headers: headers, body: base64 }
      );

      if (!res.ok) {
        const errText = await res.text().catch(function () { return ''; });
        throw new Error('HTTP ' + res.status + (errText ? ': ' + errText.slice(0, 120) : ''));
      }

      // Store push timestamp for cache-busting
      pushedTimestamps.set(selectedTarget.id, Date.now());

      // Visual feedback — update card image src immediately (cache-busted), then pulse
      const pushedId = selectedTarget.id;
      const pushedCard = dashboardEl.querySelector(
        '.emby-item[data-id="' + pushedId + '"], .emby-list-item[data-id="' + pushedId + '"]'
      );
      if (pushedCard) {
        // Brief delay — let Emby finish processing before fetching the new thumb
        setTimeout(function () {
          const img = pushedCard.querySelector('img');
          if (img) img.src = thumbUrl(pushedId);
        }, 800);

        pushedCard.classList.add('customised', 'push-pulse');
        setTimeout(function () { pushedCard.classList.remove('push-pulse'); }, 900);
        // Add badge to list item if not already present
        if (pushedCard.classList.contains('emby-list-item')) {
          const meta = pushedCard.querySelector('.emby-list-item-meta');
          if (meta && !meta.querySelector('.emby-customised-badge')) {
            const badge = document.createElement('span');
            badge.className = 'emby-customised-badge';
            badge.textContent = '\u2713 Customised';
            meta.appendChild(badge);
          }
        }
      }

      showToast('\u2713 Artwork pushed to \u201c' + selectedTarget.name + '\u201d', 'success');

      // Auto-mark the pushed item as customised
      customisedIds.add(selectedTarget.id);
      saveCustomisedIds();

      // Notify season suite to refresh its badges
      if (typeof window._embyRefreshSeasonSuiteBadges === 'function') {
        window._embyRefreshSeasonSuiteBadges(selectedTarget.id);
      }

      // If we came from a season modal, reopen that show's picker; otherwise return to library
      if (activeShowCtx) {
        updateMainCardState(activeShowCtx.showId);
        openShowModal(activeShowCtx.showId, activeShowCtx.showName, activeShowCtx.tmdbId);
      } else {
        showEmbyDashboard();
        // Refresh any open seasons modal progress counter
        const modal = document.getElementById('emby-seasons-modal');
        if (modal) refreshSeasonsPanelProgress(modal);
      }

    } catch (err) {
      showToast('Push failed: ' + err.message, 'error');
    } finally {
      pushBtn.disabled = false;
      pushBtn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
        ' Push Current Canvas to Emby';
    }
  }

  // ── Toast ──────────────────────────────────────────────────────────────
  function showToast(msg, type) {
    const existing = document.querySelector('.emby-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'emby-toast emby-toast-' + (type || 'info');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('show'); });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3500);
  }

  // ── Escape helpers ─────────────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  // ── Public API ─────────────────────────────────────────────────────────
  window.showEmbyDashboard = showEmbyDashboard;
  window.hideEmbyDashboard = hideEmbyDashboard;

  // Read-only access to customised state for season suite badges
  window._embyGetState = function () {
    return {
      customisedIds:  customisedIds,
      seriesSeasonIds: seriesSeasonIds,
      activeShowCtx:  activeShowCtx
    };
  };

  // Allow app.js Season Suite card clicks to keep selectedTarget in sync
  window._embySetTarget = function (id, name, type) {
    selectTarget(id, name, type);
  };

  // ── Boot ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('emby-button');
    if (!btn) return;

    if (!isLocalAccess()) {
      btn.setAttribute('data-tooltip', 'Emby integration is only available when running locally');
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      return;
    }

    btn.addEventListener('click', showEmbyDashboard);
    initEmbyDashboard();

    // Wire canvas-view push buttons
    var sidebarPushBtn = document.getElementById('emby-push-canvas-btn');
    var ebPushBtn      = document.getElementById('eb-emby-push-btn');
    if (sidebarPushBtn) sidebarPushBtn.addEventListener('click', handleCanvasPush);
    if (ebPushBtn)      ebPushBtn.addEventListener('click', handleCanvasPush);
  });

}());
