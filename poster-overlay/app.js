// Changelog Configuration
const CURRENT_VERSION = '1.3.0';
const CHANGELOG = [
  {
    version: '1.3.0',
    date: 'March 25, 2026',
    changes: [
      { type: 'feature',     text: 'Quick Edit Bar — floating two-row control bar above the canvas for fast access to poster fit, title logo, overlays, season label, and download/reset without opening the sidebar' },
      { type: 'improvement', text: 'Season Suite wider layout — grid now expands up to the full viewport width so shows with 20+ seasons display in fewer rows' },
      { type: 'improvement', text: 'Network Logo and Bottom Gradient toggles now sync correctly on show load — the edit bar button reflects the real state immediately' },
      { type: 'improvement', text: 'Season Label always visible — no longer hidden until a TV show is searched; works on any poster' },
      { type: 'improvement', text: 'Edit bar width is stable — bar keeps a consistent size regardless of whether a show or movie is loaded' },
    ]
  },
  {
    version: '1.2.0',
    date: 'March 25, 2026',
    changes: [
      { type: 'feature',     text: 'Poster Fit modes — choose between Stretch, Contain, Cover, or Manual resize/reposition for each poster independently' },
      { type: 'feature',     text: 'Manual fit controls — scale slider and X/Y offset sliders let you precisely position and size the poster on the canvas' },
      { type: 'improvement', text: 'Per-poster fit settings — each show poster and season poster remembers its own fit mode, scale, and offsets independently' },
      { type: 'improvement', text: 'Season Suite save states — switching between show poster and season posters now correctly saves and restores each poster\'s image and fit settings' },
      { type: 'improvement', text: 'Upload to active poster — manually uploading an image now saves to whichever poster is currently active (show or season), not always the show poster' },
      { type: 'improvement', text: 'Individual download filenames — the single download button now uses context-aware filenames (e.g. "Breaking Bad - Season 01.png") matching the batch ZIP naming' },
      { type: 'improvement', text: 'Guidelines off by default — placement guidelines overlay is now disabled on load' },
      { type: 'fix',         text: 'Fixed show poster being overwritten by a season image when navigating between Season Suite cards' },
      { type: 'fix',         text: 'Fixed season poster not rendering correctly after loading via Season Suite' }
    ]
  },
  {
    version: '1.1.0',
    date: 'March 23, 2026',
    changes: [
      { type: 'feature',     text: 'Bottom Gradient overlay — toggle with adjustable opacity, height, and custom colour' },
      { type: 'feature',     text: 'Title Logo / Poster Designer — pick a clearlogo, position it with X/Y sliders or drag it directly on the canvas, scale, and apply a drop shadow' },
      { type: 'feature',     text: 'Logo tint colour — multiply-blend any colour onto your clearlogo while preserving transparency' },
      { type: 'feature',     text: 'Season Suite — automated season grid for TV shows; click a season to load its poster and edit independently' },
      { type: 'feature',     text: 'Season Label — add a text label (Season 1, etc.) with font picker, size, vertical position, letter-spacing, and colour' },
      { type: 'feature',     text: 'Batch download all seasons — export every season poster as a ZIP in one click' },
      { type: 'feature',     text: 'Browse Posters — new in-tool poster browser powered by TMDB and Mediux' },
      { type: 'feature',     text: 'Drag-and-drop poster — drop an image file directly onto the canvas or drop zone' },
      { type: 'feature',     text: 'Canvas composition guidelines — toggleable overlay to help with framing' },
      { type: 'feature',     text: 'Auto thumbnail captures — Season Suite thumbnails update live as you make changes' },
      { type: 'feature',     text: 'Fanart.tv API key — manage your key in the settings menu; smart connected/change state indicator' },
      { type: 'feature',     text: 'Settings & Config dropdown — gear icon in the header for save/load/export/import and Fanart.tv key' },
      { type: 'improvement', text: 'All colour pickers upgraded to themed Pickr (monolith dark UI) for Gradient, Network Logo, Designer Logo, and Season Label' },
      { type: 'improvement', text: 'Network logo scale slider now uses ± buttons alongside the range input' }
    ]
  },
  {
    version: '1.0.0',
    date: 'October 2025',
    changes: [
      { type: 'feature', text: 'Poster image upload' },
      { type: 'feature', text: 'Banner overlay selector' },
      { type: 'feature', text: 'Network logo selection with colour tinting and scale' },
      { type: 'feature', text: 'TMDB & Mediux search integration' },
      { type: 'feature', text: 'Canvas download (PNG)' },
      { type: 'feature', text: 'Mobile-friendly layout with tabbed menu' }
    ]
  }
];

// Changelog Modal Functions (defined before DOMContentLoaded)
function checkAndShowChangelog() {
  const lastSeenVersion = localStorage.getItem('overlay_lastSeenVersion');
  const dontShowAgain = localStorage.getItem(`overlay_dontShowChangelog_${CURRENT_VERSION}`);

  if (lastSeenVersion !== CURRENT_VERSION && dontShowAgain !== 'true') {
    setTimeout(() => {
      showChangelogModal();
    }, 1000);
  }

  updateWhatsNewBadge(lastSeenVersion !== CURRENT_VERSION && dontShowAgain !== 'true');
}

function updateWhatsNewBadge(showBadge) {
  setTimeout(() => {
    const badge = document.querySelector('.whats-new-badge');
    if (badge) {
      badge.style.display = showBadge ? 'inline-block' : 'none';
    }
  }, 100);
}

window.showChangelogModal = function() {
  let modal = document.getElementById('changelogOverlay');

  if (!modal || modal.parentElement !== document.body) {
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'changelogOverlay';
    modal.className = 'changelog-overlay';
    modal.innerHTML = `
      <div class="changelog-modal">
        <h3>What's New</h3>
        <div id="changelogContent" class="changelog-content"></div>
        <div class="changelog-footer">
          <label class="changelog-checkbox">
            <input type="checkbox" id="dontShowChangelogAgain">
            <span>Don't show this again for this version</span>
          </label>
          <button onclick="closeChangelogModal()" class="custom-btn">Got it!</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  if (!modal) return;

  const content = document.getElementById('changelogContent');
  if (!content) return;

  content.innerHTML = '';

  CHANGELOG.forEach((release, index) => {
    const releaseDiv = document.createElement('div');
    releaseDiv.className = 'changelog-release';

    const header = document.createElement('div');
    header.className = 'changelog-header';
    header.innerHTML = `
      <div class="changelog-header-left">
        <h4>Version ${release.version}</h4>
        <span class="changelog-date">${release.date}</span>
      </div>
      <button class="changelog-toggle" data-index="${index}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    `;
    releaseDiv.appendChild(header);

    const changesList = document.createElement('ul');
    changesList.className = 'changelog-list';

    release.changes.forEach(change => {
      const item = document.createElement('li');
      item.className = `changelog-item changelog-${change.type}`;

      const badge = document.createElement('span');
      badge.className = 'changelog-badge';
      badge.textContent = change.type === 'feature' ? 'NEW' :
                          change.type === 'improvement' ? 'IMPROVED' : 'FIXED';

      const text = document.createElement('span');
      text.textContent = change.text;

      item.appendChild(badge);
      item.appendChild(text);
      changesList.appendChild(item);
    });

    releaseDiv.appendChild(changesList);
    content.appendChild(releaseDiv);

    const toggleBtn = header.querySelector('.changelog-toggle');
    if (toggleBtn) {
      if (index > 0) {
        changesList.style.display = 'none';
        toggleBtn.classList.add('collapsed');
      }

      toggleBtn.addEventListener('click', () => {
        const isCollapsed = changesList.style.display === 'none';
        changesList.style.display = isCollapsed ? 'block' : 'none';
        toggleBtn.classList.toggle('collapsed');
      });
    }
  });

  const dontShowCheckbox = document.getElementById('dontShowChangelogAgain');
  if (dontShowCheckbox) {
    dontShowCheckbox.checked = false;
  }

  modal.style.setProperty('display', 'flex', 'important');
  localStorage.setItem('overlay_lastSeenVersion', CURRENT_VERSION);
  updateWhatsNewBadge(false);
};

window.closeChangelogModal = function() {
  const modal = document.getElementById('changelogOverlay');
  const dontShowCheckbox = document.getElementById('dontShowChangelogAgain');

  if (dontShowCheckbox && dontShowCheckbox.checked) {
    localStorage.setItem(`overlay_dontShowChangelog_${CURRENT_VERSION}`, 'true');
  }

  if (modal) {
    modal.style.display = 'none';
  }
};

// Close changelog modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('changelogOverlay');
  if (modal && e.target === modal) {
    closeChangelogModal();
  }
});

// Logo scale state
let logoScale = 1;
const posterUpload = document.getElementById("poster-upload");
const uploadPosterBtn = document.getElementById("upload-poster-btn");

if (uploadPosterBtn && posterUpload) {
  uploadPosterBtn.addEventListener("click", () => {
    posterUpload.click();
  });
}
const overlaySelect = document.getElementById("overlay-select");
const canvas = document.getElementById("overlay-canvas");
const ctx = canvas.getContext("2d");
let baseImage = null;
let overlayImage = new Image();

const metaPanel = document.getElementById("metadata-panel");
const TMDB_API_KEY = "96c821c9e98fab6a43bff8021d508d1d";
const networkLogoSelect = document.getElementById("network-logo-select");

// Add loading overlay variables
let loadingOverlay = null;
let loadingProgressBar = null;
let loadingDetailsText = null;

let networkLogoImage = null;
let currentLogoPath = "none";
let selectedLogoColor = "#ffffff";

// ── Poster Image Fit state ────────────────────────────────
// Poster fit settings are now per-poster (per season or base)
function getCurrentPosterKey() {
  return activeSeasonNum === null ? 'base' : activeSeasonNum;
}
function getPosterFitSettings(key) {
  return seasonSavedImages.get(key)?.fit || { mode: 'stretch', scale: 1.0, offsetX: 0, offsetY: 0 };
}
function setPosterFitSettings(key, fit) {
  const entry = seasonSavedImages.get(key) || {};
  entry.fit = fit;
  seasonSavedImages.set(key, entry);
}
let posterFitMode   = 'stretch';
let posterScale     = 1.0;
let posterOffsetX   = 0;
let posterOffsetY   = 0;

// ── Poster Designer state ──────────────────────────────────
let designerLogoImage   = null;
let designerLogoUrl     = '';   // URL of the currently loaded clearlogo (persisted in config)
let designerLogoX       = 0;
let designerLogoY       = 55;
let designerLogoScale   = 1.0;
let designerShadowEnabled = false;
let designerShadowBlur  = 20;
let currentDesignerId   = null;
let currentDesignerType = 'movie';
let currentDesignerTitle = '';
let isDraggingLogo      = false;
let dragStartMouseX = 0, dragStartMouseY = 0;
let dragStartLogoX  = 0, dragStartLogoY  = 0;
let fanartApiKey = localStorage.getItem('postertools_fanart_key') || '';

// ── Season Suite state ────────────────────────────────────
let seasonSuiteData   = null;   // { showId, seasons: [...] }
let activeSeasonNum   = null;   // currently highlighted season number (null = base)
let seasonLabelEnabled  = false;
let seasonLabelText     = '';
let seasonLabelFontSize = 60;
let seasonLabelColor    = '#ffffff';
let seasonLabelYPct     = 91;
let seasonLabelFont     = 'Bebas Neue';
let seasonLabelSpacing  = 0;   // % of canvas height
let showBasePosterPath  = null; // TMDB poster_path for the base show
let baseShowImage       = null; // stored Image for restoring base poster
let seasonSavedImages   = new Map(); // key (seasonNum | 'base') → { img, labelText, labelColor, logoColor }

// ── Gradient overlay state ────────────────────────
let gradientEnabled  = false;
let gradientOpacity  = 0.7;
let gradientHeight   = 50;   // % of canvas height the gradient covers
let gradientColor    = '#000000';

// ── Designer logo tint state ───────────────────────
let designerLogoColor = '#ffffff'; // '#ffffff' = no tint (draw as-is)

// Pickr instances (initialized in DOMContentLoaded)
let networkLogoColorPickr  = null;
let gradientColorPickr     = null;
let designerLogoColorPickr = null;
let seasonLabelColorPickr  = null;

// ── Thumbnail auto-update state ─────────────────────────
let _capturingThumb    = false; // prevents drawCanvas auto-schedule from looping
let _thumbDebounceTimer = null; // debounce handle for auto thumbnail updates

// ── Guidelines overlay state ──────────────────────────────
let guidelinesEnabled = false;
const guidelinesImage = new Image();
guidelinesImage.src = '../assets/guidelines_poster.jpg';
guidelinesImage.onload = () => {
  // On initial load, do not draw guidelines or any image by default
  if (!baseImage) ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function drawGuidelinesBackdrop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(guidelinesImage, 0, 0, canvas.width, canvas.height);
}
function showLoadingOverlay(title, message) {
  // Remove any existing overlay
  hideLoadingOverlay();
  
  // Create overlay
  loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.style.position = "fixed";
  loadingOverlay.style.top = "0";
  loadingOverlay.style.left = "0";
  loadingOverlay.style.width = "100%";
  loadingOverlay.style.height = "100%";
  loadingOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  loadingOverlay.style.display = "flex";
  loadingOverlay.style.flexDirection = "column";
  loadingOverlay.style.alignItems = "center";
  loadingOverlay.style.justifyContent = "center";
  loadingOverlay.style.zIndex = "9999";
  loadingOverlay.style.backdropFilter = "blur(4px)";
  
  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.className = "custom-modal loading-modal";
  modalContainer.style.background = "#1a1a1a";
  modalContainer.style.borderRadius = "12px";
  modalContainer.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
  modalContainer.style.padding = "25px 30px";
  modalContainer.style.width = "320px";
  modalContainer.style.display = "flex";
  modalContainer.style.flexDirection = "column";
  modalContainer.style.alignItems = "center";
  modalContainer.style.textAlign = "center";
  
  // Create spinner
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner-large";
  spinner.style.border = "3px solid rgba(255, 255, 255, 0.1)";
  spinner.style.borderTop = "3px solid #00bfa5";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "50px";
  spinner.style.height = "50px";
  spinner.style.animation = "spin 1s linear infinite";
  spinner.style.marginBottom = "15px";
  
  // Add spinner animation if it doesn't exist
  if (!document.getElementById("spinner-style")) {
    const style = document.createElement("style");
    style.id = "spinner-style";
    style.textContent = "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
    document.head.appendChild(style);
  }
  
  // Create title element
  const titleEl = document.createElement("h3");
  titleEl.id = "loading-title";
  titleEl.textContent = title || "Loading";
  titleEl.style.color = "white";
  titleEl.style.margin = "0 0 10px 0";
  titleEl.style.fontFamily = "Gabarito, sans-serif";
  
  // Create message element
  const messageEl = document.createElement("p");
  messageEl.id = "loading-message";
  messageEl.textContent = message || "Please wait...";
  messageEl.style.color = "white";
  messageEl.style.margin = "0 0 15px 0";
  messageEl.style.fontFamily = "Gabarito, sans-serif";
  
  // Create progress container
  const progressContainer = document.createElement("div");
  progressContainer.style.width = "100%";
  progressContainer.style.height = "6px";
  progressContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  progressContainer.style.borderRadius = "3px";
  progressContainer.style.margin = "15px 0";
  progressContainer.style.overflow = "hidden";
  
  // Create progress bar
  loadingProgressBar = document.createElement("div");
  loadingProgressBar.id = "loading-progress-bar";
  loadingProgressBar.style.width = "0%";
  loadingProgressBar.style.height = "100%";
  loadingProgressBar.style.background = "linear-gradient(90deg, #00bfa5, #6a11cb)";
  loadingProgressBar.style.transition = "width 0.3s ease";
  loadingProgressBar.style.borderRadius = "3px";
  
  // Create details text
  loadingDetailsText = document.createElement("p");
  loadingDetailsText.id = "loading-details";
  loadingDetailsText.textContent = "Starting...";
  loadingDetailsText.style.color = "rgba(255, 255, 255, 0.7)";
  loadingDetailsText.style.fontSize = "14px";
  loadingDetailsText.style.fontFamily = "Gabarito, sans-serif";
  loadingDetailsText.style.margin = "10px 0 0 0";
  
  // Assemble all components
  progressContainer.appendChild(loadingProgressBar);
  modalContainer.appendChild(spinner);
  modalContainer.appendChild(titleEl);
  modalContainer.appendChild(messageEl);
  modalContainer.appendChild(progressContainer);
  modalContainer.appendChild(loadingDetailsText);
  loadingOverlay.appendChild(modalContainer);
  
  document.body.appendChild(loadingOverlay);
  
  return loadingOverlay;
}

// Update loading overlay progress
function updateLoadingProgress(percent, detailText) {
  if (loadingProgressBar) {
    loadingProgressBar.style.width = `${percent}%`;
  }
  
  if (loadingDetailsText && detailText) {
    loadingDetailsText.textContent = detailText;
  }
}

// Hide and remove loading overlay
function hideLoadingOverlay() {
  if (loadingOverlay && loadingOverlay.parentNode) {
    loadingOverlay.style.opacity = "0";
    loadingOverlay.style.transition = "opacity 0.3s ease";
    
    setTimeout(() => {
      if (loadingOverlay && loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
      loadingOverlay = null;
      loadingProgressBar = null;
      loadingDetailsText = null;
    }, 300);
  }
}

const LOGO_WIDTH = 160;
const LOGO_MARGIN_LEFT = 50;
const LOGO_MARGIN_TOP = 50;
const mediaTypeButtons = document.querySelectorAll(".media-type-btn");
let currentMediaType = "movie";

mediaTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mediaTypeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    currentMediaType = button.dataset.type;

    document.getElementById("tmdb-search-input").value = "";
    document.getElementById("tmdb-suggestions").innerHTML = "";
  });
});

function advancedContentTypeDetection(filename) {
  const cleanName = filename.toLowerCase().replace(/\.[^/.]+$/, "");

  const tvPatterns = [
    /s\d{1,2}e\d{1,2}/,
    /season\s*\d+/i,
    /\d{1,2}x\d{1,2}/,
    /episode\s*\d+\b/i,
    /\bseries\b/i,
    /\bseason\b/i,
    /\bshow\b/i,
    /\bpilot\b/i,
    /\bfinale\b/i,
    /\bepisodes?\b/i,
    /\b(tv|television)\b/i,
    /\bseries\s+\d+\b/i,
    /\bcomplete\s+series\b/i,
    /\bbox\s+set\b/i,
    /[\s.-]complete[\s.-]/i,
  ];

  const moviePatterns = [
    /\bfilm\b/i,
    /\bmovie\b/i,
    /\bcinema\b/i,
    /\bfeature\b/i,
    /\bextended\b/i,
    /\bdirectors?.?cut\b/i,
    /\btheatrical\b/i,
    /\b(dvdscr|camrip|hdts)\b/i,
    /\b(bluray|brrip)\b/i,
  ];

  for (const pattern of tvPatterns) {
    if (pattern.test(cleanName)) {
      return "tv";
    }
  }

  for (const pattern of moviePatterns) {
    if (pattern.test(cleanName)) {
      return "movie";
    }
  }

  const yearMatch = cleanName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const multiYearMatch = cleanName.match(/\b(19|20)\d{2}[-–]\s*(19|20)\d{2}\b/);
    if (multiYearMatch) {
      return "tv";
    }

    const yearPosition = yearMatch.index;
    if (yearPosition > cleanName.length - 6) {
      return "movie";
    }
  }

  const qualityMarkers = /(480p|720p|1080p|2160p|4k|uhd|hdr|x264|x265|hevc|aac|dd5\.1)/i;
  if (qualityMarkers.test(cleanName)) {
    return "movie";
  }

  return "movie";
}

function parseFileName(filename) {
  let cleanName = filename
    .replace(/(480p|720p|1080p|2160p|4k|uhd|hdr|x264|x265|hevc|aac|dd5\.1)/gi, "")
    .replace(/\b(19|20)\d{2}\b/g, "")
    .replace(/s\d{1,2}e\d{1,2}/gi, "")
    .replace(/\b(complete|extended|directors.?cut|theatrical|unrated)\b/gi, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanName;
}

posterUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Reset poster fit state for the new image (per-poster)
  const key = getCurrentPosterKey();
  posterFitMode = 'stretch';
  posterScale = 1.0;
  posterOffsetX = 0;
  posterOffsetY = 0;
  setPosterFitSettings(key, { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
  const fitModeEl = document.getElementById('poster-fit-mode');
  const scaleEl   = document.getElementById('poster-scale');
  const oxEl      = document.getElementById('poster-offset-x');
  const oyEl      = document.getElementById('poster-offset-y');
  const fitPanel  = document.getElementById('poster-fit-controls');
  if (fitModeEl) fitModeEl.value = 'stretch';
  if (scaleEl)   scaleEl.value = 1;
  if (oxEl)      oxEl.value = 0;
  if (oyEl)      oyEl.value = 0;
  if (fitPanel)  fitPanel.style.display = 'none';
  const dispScale = document.getElementById('poster-scale-display');
  const dispX     = document.getElementById('poster-offset-x-display');
  const dispY     = document.getElementById('poster-offset-y-display');
  if (dispScale) dispScale.textContent = '100%';
  if (dispX)     dispX.textContent = '0';
  if (dispY)     dispY.textContent = '0';

  const reader = new FileReader();
  reader.onload = function (evt) {
    baseImage = new Image();
    baseImage.onload = () => {
      // If a TV show suite is already active, save to the CURRENT poster's slot
      // (show poster if activeSeasonNum === null, or the active season otherwise)
      if (seasonSuiteData) {
        const uploadKey = activeSeasonNum === null ? 'base' : activeSeasonNum;
        if (activeSeasonNum === null) baseShowImage = baseImage;
        const fit = { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY };
        const existing = seasonSavedImages.get(uploadKey);
        const gradient = { enabled: gradientEnabled, opacity: gradientOpacity, height: gradientHeight, color: gradientColor };
        seasonSavedImages.set(uploadKey, {
          img: baseImage,
          labelText: existing?.labelText ?? seasonLabelText,
          labelColor: existing?.labelColor ?? seasonLabelColor,
          logoColor: existing?.logoColor ?? designerLogoColor,
          gradient,
          fit
        });
      }
      drawCanvas();

      const suggestedType = advancedContentTypeDetection(file.name);

      multiStepSearch(file.name, currentMediaType).then((results) => {
        if (results.length === 1) {
          fetchMetadataById(results[0].id, results[0].type);
        } else if (results.length > 1) {
          showSearchResultsDialog(results);
        } else {
          const alternateType = suggestedType === "movie" ? "tv" : "movie";

          multiStepSearch(file.name, alternateType).then((alternateResults) => {
            if (alternateResults.length > 0) {
              if (alternateResults.length === 1) {
                fetchMetadataById(alternateResults[0].id, alternateResults[0].type);
              } else {
                showSearchResultsDialog(alternateResults);
              }
            } else {
              showContentTypeDialog(parseFileName(file.name));
            }
          });
        }
      });
    };
    baseImage.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

overlaySelect.addEventListener("change", () => {
  if (!baseImage) return;
  drawCanvas();
  deferredThumbUpdate();
});

const networkLogoSearch = document.getElementById("network-logo-search");
const networkLogoSuggestions = document.getElementById("network-logo-suggestions");
const networkLogoCheckbox = document.getElementById("network-logo-checkbox");

const logoNames = [
  "ABC TV",
  "Acorn TV",
  "ABC",
  "Adult Swim",
  "AMC",
  "AMC+",
  "Apple TV+",
  "Binge",
  "BBC",
  "BET+",
  "BritBox",
  "CBC Television",
  "CBS",
  "Channel 4",
  "Cinemax",
  "Comedy Central",
  "Crave",
  "Discovery",
  "discovery+",
  "Disney+",
  "Epix",
  "ESPN",
  "FOX",
  "Freevee",
  "Fuji TV",
  "FX",
  "FXX",
  "Hbo Max",
  "HBO",
  "History",
  "Hulu",
  "Itv",
  "Max",
  "MGM+",
  "National Geographic",
  "NBC",
  "Netflix",
  "Network 10",
  "Paramount+",
  "PBS",
  "Peacock",
  "Prime Video",
  "RTE One",
  "S4C",
  "Showcase",
  "Showtime",
  "Shudder",
  "Sky",
  "Spike",
  "Stan",
  "Starz",
  "Syfy",
  "TBS",
  "The CW",
  "Three",
  "TNT",
  "truTV",
  "USA Network",
  "Vice",
  "CNN",
  "Nebula",
  "YouTube",
  "Facebook Watch",
  "The WB",
  "MTV",
  "Nick Jr",
  "Nickelodeon",
  "Hallmark",
  "Dropout",
  "Disney Channel",
  "Dave",
  "CBC Gem",
  "Cartoon Network",
  "Apple TV+",
];

const availableLogos = logoNames.map((name) => ({
  name,
  path: `../assets/network-logos/${name}.png`,
}));

function filterLogos(query) {
  query = query.toLowerCase();
  return availableLogos.filter((logo) => logo.name.toLowerCase().includes(query));
}

function displayLogoSuggestions(logos) {
  networkLogoSuggestions.innerHTML = "";

  if (logos.length === 0) {
    networkLogoSuggestions.innerHTML = '<div class="suggestion-item">No logos found</div>';
    return;
  }

  logos.forEach((logo) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    const logoImg = document.createElement("img");
    logoImg.src = logo.path;
    logoImg.alt = logo.name;
    logoImg.className = "logo-preview-img";
    logoImg.style.maxWidth = "120px";
    logoImg.style.maxHeight = "30px";
    logoImg.style.width = "auto";
    logoImg.style.height = "auto";
    logoImg.style.display = "block";

    logoImg.onerror = () => {
      logoImg.style.display = "none";
      const fallbackText = document.createElement("div");
      fallbackText.textContent = logo.name;
      fallbackText.style.textAlign = "center";
      fallbackText.style.color = "white";
      fallbackText.style.fontSize = "0.9rem";
      div.appendChild(fallbackText);
      console.log(`Failed to load logo: ${logo.path}`);
    };

    div.appendChild(logoImg);

    div.addEventListener("click", () => {
      networkLogoSearch.value = logo.name;
      networkLogoSuggestions.style.display = "none";
      currentLogoPath = logo.path;

      if (networkLogoCheckbox.checked) {
        updateNetworkLogo(logo.path);
      } else {
        networkLogoCheckbox.checked = true;
        networkLogoCheckbox.dispatchEvent(new Event('change'));
        updateNetworkLogo(logo.path);
      }
    });

    networkLogoSuggestions.appendChild(div);
  });

  networkLogoSuggestions.style.display = "block";
}

function updateNetworkLogo(logoPath) {
  if (!logoPath) {
    networkLogoImage = null;
    if (baseImage) drawCanvas();
    return;
  }

  currentLogoPath = logoPath;
  networkLogoImage = new Image();
  networkLogoImage.crossOrigin = "Anonymous";
  networkLogoImage.onload = () => {
    if (baseImage && baseImage.complete && baseImage.naturalWidth > 0) {
      drawCanvas();
    }
  };

  networkLogoImage.onerror = () => {
    console.warn("Network logo failed to load:", currentLogoPath);
    networkLogoImage = null;
  };

  networkLogoImage.src = currentLogoPath;
}

networkLogoSearch.addEventListener("input", () => {
  const query = networkLogoSearch.value.trim();

  if (query === "") {
    networkLogoSuggestions.style.display = "none";

    if (!networkLogoCheckbox.checked) {
      networkLogoImage = null;
      currentLogoPath = null;
      if (baseImage) drawCanvas();
    }
    return;
  }

  const filteredLogos = filterLogos(query);
  displayLogoSuggestions(filteredLogos);
});

networkLogoSearch.addEventListener("focus", () => {
  if (networkLogoSearch.value.trim() === "") {
    displayLogoSuggestions(availableLogos);
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".network-logo-search-container")) {
    networkLogoSuggestions.style.display = "none";
  }
});

networkLogoCheckbox.addEventListener("change", () => {
  if (networkLogoCheckbox.checked) {
    if (!currentLogoPath || currentLogoPath === "none") {
      return;
    }

    networkLogoImage = new Image();
    networkLogoImage.crossOrigin = "Anonymous";

    networkLogoImage.onload = () => {
      if (baseImage && baseImage.complete && baseImage.naturalWidth > 0) {
        drawCanvas();
      }
    };

    networkLogoImage.onerror = () => {
      console.warn("Network logo failed to load:", currentLogoPath);
      networkLogoImage = null;
    };

    networkLogoImage.src = currentLogoPath;
  } else {
    networkLogoImage = null;
    if (baseImage) drawCanvas();
  }
});

// ── Canvas draw helpers ──────────────────────────────
function hexToRgbArr(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Multiply-blend tint: white logo + tint → tint color, preserves alpha & brightness
function applyLogoTint(srcImage, w, h, hexColor) {
  const tc = document.createElement('canvas');
  tc.width  = Math.ceil(w);
  tc.height = Math.ceil(h);
  const tctx = tc.getContext('2d');
  tctx.drawImage(srcImage, 0, 0, w, h);
  if (hexColor && hexColor.toLowerCase() !== '#ffffff') {
    const [tr, tg, tb] = hexToRgbArr(hexColor).map(v => v / 255);
    const imgData = tctx.getImageData(0, 0, tc.width, tc.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0) {
        d[i]     = Math.round(d[i]     * tr);
        d[i + 1] = Math.round(d[i + 1] * tg);
        d[i + 2] = Math.round(d[i + 2] * tb);
      }
    }
    tctx.putImageData(imgData, 0, 0);
  }
  return tc;
}

function drawBaseImage() {
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = baseImage.naturalWidth;
  const ih = baseImage.naturalHeight;

  if (posterFitMode === 'stretch') {
    ctx.drawImage(baseImage, 0, 0, cw, ch);
    return;
  }

  const imgRatio    = iw / ih;
  const canvasRatio = cw / ch;

  if (posterFitMode === 'contain') {
    let dw, dh;
    if (imgRatio > canvasRatio) { dw = cw; dh = cw / imgRatio; }
    else                        { dh = ch; dw = ch * imgRatio; }
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(baseImage, dx, dy, dw, dh);
    return;
  }

  if (posterFitMode === 'cover') {
    let dw, dh;
    if (imgRatio > canvasRatio) { dh = ch; dw = ch * imgRatio; }
    else                        { dw = cw; dh = cw / imgRatio; }
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, cw, ch);
    ctx.clip();
    ctx.drawImage(baseImage, dx, dy, dw, dh);
    ctx.restore();
    return;
  }

  // manual mode
  if (posterFitMode === 'manual') {
    let dw, dh;
    if (imgRatio > canvasRatio) { dw = cw * posterScale; dh = dw / imgRatio; }
    else                        { dh = ch * posterScale; dw = dh * imgRatio; }
    const dx = (cw - dw) / 2 + posterOffsetX;
    const dy = (ch - dh) / 2 + posterOffsetY;
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, cw, ch);
    ctx.clip();
    ctx.drawImage(baseImage, dx, dy, dw, dh);
    ctx.restore();
  }
}

function drawCanvas(onComplete) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Layer 1: base poster or guidelines backdrop
  if (baseImage) {
    // Load fit settings for current poster
    const fit = getPosterFitSettings(getCurrentPosterKey());
    posterFitMode = fit.mode;
    posterScale = fit.scale;
    posterOffsetX = fit.offsetX;
    posterOffsetY = fit.offsetY;
    // Update UI controls to match
    const fitModeEl = document.getElementById('poster-fit-mode');
    const scaleEl   = document.getElementById('poster-scale');
    const oxEl      = document.getElementById('poster-offset-x');
    const oyEl      = document.getElementById('poster-offset-y');
    if (fitModeEl) fitModeEl.value = posterFitMode;
    if (scaleEl)   scaleEl.value = posterScale;
    if (oxEl)      oxEl.value = posterOffsetX;
    if (oyEl)      oyEl.value = posterOffsetY;
    drawBaseImage();
  } else {
    if (guidelinesImage.complete && guidelinesImage.naturalWidth > 0) {
      ctx.drawImage(guidelinesImage, 0, 0, canvas.width, canvas.height);
    }
    // Draw designer logo preview on the backdrop, then stop
    drawDesignerLogoLayer();
    if (onComplete) onComplete();
    return;
  }

  // Layer 2: bottom gradient — drawn before logos so logos appear on top
  if (gradientEnabled) {
    const gradH = canvas.height * (gradientHeight / 100);
    const [gr, gg, gb] = hexToRgbArr(gradientColor);
    const grd = ctx.createLinearGradient(0, canvas.height - gradH, 0, canvas.height);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, `rgba(${gr},${gg},${gb},${gradientOpacity})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, canvas.height - gradH, canvas.width, gradH);
  }

  if (networkLogoImage && activeSeasonNum === null) {
    const TARGET_WIDTH = 250 * logoScale;
    const TARGET_HEIGHT = 43 * logoScale;
    const MARGIN_LEFT = 54;
    const MARGIN_TOP = 55 + ((43 - TARGET_HEIGHT) / 2);
    const logoRatio = networkLogoImage.width / networkLogoImage.height;
    let logoWidth, logoHeight;

    if (logoRatio > TARGET_WIDTH / TARGET_HEIGHT) {
      logoWidth = TARGET_WIDTH;
      logoHeight = logoWidth / logoRatio;
    } else {
      logoHeight = TARGET_HEIGHT;
      logoWidth = logoHeight * logoRatio;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = networkLogoImage.width;
    tempCanvas.height = networkLogoImage.height;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(networkLogoImage, 0, 0);
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return {
        r,
        g,
        b,
      };
    };

    const targetColor = hexToRgb(selectedLogoColor);

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200 && data[i + 3] > 0) {
        const alpha = data[i + 3];
        data[i] = targetColor.r;
        data[i + 1] = targetColor.g;
        data[i + 2] = targetColor.b;
        data[i + 3] = alpha;
      }
    }

    tempCtx.putImageData(imageData, 0, 0);

    ctx.drawImage(tempCanvas, MARGIN_LEFT, MARGIN_TOP, logoWidth, logoHeight);
  }

  // Layer 3: designer clearlogo
  drawDesignerLogoLayer();

  // Layer 4: banner overlay + guidelines on top
  if (overlaySelect.value !== "none") {
    overlayImage = new Image();
    overlayImage.onload = () => {
      ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
      // Draw guidelines overlay on top of everything
      if (guidelinesEnabled && guidelinesImage.complete && guidelinesImage.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.drawImage(guidelinesImage, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      // Season label on top of everything
      drawSeasonLabel();
      if (onComplete) onComplete();
      _scheduleThumbUpdate();
    };
    overlayImage.src = overlaySelect.value;
  } else {
    if (guidelinesEnabled && guidelinesImage.complete && guidelinesImage.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.drawImage(guidelinesImage, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    // Season label on top of everything
    drawSeasonLabel();
    if (onComplete) onComplete();
    _scheduleThumbUpdate();
  }
}

function _scheduleThumbUpdate() {
  if (_capturingThumb || !seasonSuiteData) return;
  clearTimeout(_thumbDebounceTimer);
  _thumbDebounceTimer = setTimeout(() => {
    const key = activeSeasonNum === null ? 'base' : activeSeasonNum;
    captureCanvasThumb(key);
  }, 250);
}

// ── Season label canvas draw ──────────────────────────────
function drawSeasonLabel() {
  if (!seasonLabelEnabled || !seasonLabelText.trim() || activeSeasonNum === null) return;
  const y = canvas.height * (seasonLabelYPct / 100);
  ctx.save();
  // Weight: Exo 2 is a regular-weight font, others are display/bold
  const weight = seasonLabelFont === 'Exo 2' ? '400' : '700';
  ctx.font = `${weight} ${seasonLabelFontSize}px '${seasonLabelFont}', 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = seasonLabelColor;
  if (seasonLabelSpacing !== 0) {
    ctx.letterSpacing = seasonLabelSpacing + 'px';
  }
  ctx.fillText(seasonLabelText, canvas.width / 2, y);
  ctx.restore();
}

// ── Drag-and-drop poster onto the window / drop zone ────────
(function wirePosterDrop() {
  function handleDroppedFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    // Reuse the existing posterUpload change pipeline
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    posterUpload.files = dataTransfer.files;
    posterUpload.dispatchEvent(new Event('change'));
  }

  const dropZone = document.getElementById('poster-drop-zone');
  const canvasContainer = document.querySelector('.canvas-container');
  const targets = [dropZone, canvasContainer].filter(Boolean);

  // Prevent default for the whole window so browser doesn't open the image
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop',     e => e.preventDefault());

  targets.forEach(el => {
    el.addEventListener('dragover', e => {
      e.preventDefault();
      el.classList.add('drop-active');
    });
    el.addEventListener('dragleave', e => {
      if (!el.contains(e.relatedTarget)) el.classList.remove('drop-active');
    });
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drop-active');
      const file = e.dataTransfer.files[0];
      handleDroppedFile(file);
    });
  });
}());


const logoScaleSlider = document.getElementById("logo-scale-slider");
const logoScaleValue = document.getElementById("logo-scale-value");
if (logoScaleSlider && logoScaleValue) {
  logoScaleSlider.addEventListener("input", function () {
    logoScale = parseFloat(logoScaleSlider.value);
    logoScaleValue.textContent = Math.round(logoScale * 100) + "%";
    if (networkLogoImage && baseImage) {
      drawCanvas();
    }
    deferredThumbUpdate();
  });
}

function multiStepSearch(title, type) {
  const originalTitle = title
    .replace(/\.[^/.]+$/, "")
    .replace(/[_.-]/g, " ")
    .trim();

  return searchTMDB(originalTitle, type)
    .then((results) => {
      if (results.length > 0) {
        return results;
      }

      const parsedTitle = parseFileName(originalTitle);
      if (parsedTitle !== originalTitle) {
        return searchTMDB(parsedTitle, type);
      }

      return [];
    })
    .then((results) => {
      if (results.length > 0) {
        return results;
      }

      const keywords = originalTitle
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .filter((word) => !/(480p|720p|1080p|4k|uhd|hdr|x264|x265|hevc)/i.test(word));

      const keywordTitle = keywords.slice(0, 3).join(" ");

      if (keywordTitle && keywordTitle !== originalTitle) {
        return searchTMDB(keywordTitle, type);
      }

      return [];
    });
}

function searchTMDB(query, type) {
  return fetch(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results?.length > 0) {
        return data.results
          .filter((item) => item.poster_path)
          .map((item) => ({
            id: item.id,
            title: type === "movie" ? item.title : item.name,
            year: type === "movie" ? item.release_date?.slice(0, 4) || "—" : item.first_air_date?.slice(0, 4) || "—",
            overview: item.overview,
            poster_path: item.poster_path,
            type: type,
          }));
      }
      return [];
    });
}

const searchInput = document.getElementById("tmdb-search-input");
const suggestionsBox = document.getElementById("tmdb-suggestions");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (!query) {
    suggestionsBox.innerHTML = "";
    return;
  }

  if (currentMediaType === "movie") {
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    )
      .then((res) => res.json())
      .then((data) => {
        const results = data.results
          .filter((movie) => movie.poster_path)
          .slice(0, 10)
          .map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date?.slice(0, 4) || "—",
            poster_path: movie.poster_path,
            type: "movie",
          }));

        displaySearchResults(results);
      });
  } else {
    fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        query
      )}&api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    )
      .then((res) => res.json())
      .then((data) => {
        const results = data.results
          .filter((show) => show.poster_path)
          .slice(0, 10)
          .map((show) => ({
            id: show.id,
            title: show.name,
            year: show.first_air_date?.slice(0, 4) || "—",
            poster_path: show.poster_path,
            type: "tv",
          }));

        displaySearchResults(results);
      });
  }
});

const mediuxInput = document.getElementById("mediux-search-input");
const mediuxSuggestions = document.getElementById("mediux-suggestions");

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

mediuxInput.addEventListener(
  "input",
  debounce(() => {
    const query = mediuxInput.value.trim();
    if (!query) {
      mediuxSuggestions.innerHTML = "";
      return;
    }

    mediuxSuggestions.innerHTML = '<div class="search-result-item">Searching...</div>';

    searchMediux(query);
  }, 300)
);

function searchMediux(query) {
  const currentMediaType = document.querySelector(".media-type-btn.active").dataset.type;
  
  const gqlQuery = currentMediaType === "movie" ? 
    `
    query {
      movies(
        limit: 15, 
        filter: {title: {_icontains: "${query}"}}
      ) {
        id
        title
        release_date
        posters: files(
          filter: {
            _and: [
              { file_type: { _eq: "poster" } }
              { movie: { id: { _neq: null } } }
            ]
          }
        ) {
          id
          uploaded_by {
            username
          }
        }
        collection_id {
          id
          collection_name
        }
      }
    }
    ` : 
    `
    query {
      shows(
        limit: 15, 
        filter: {title: {_icontains: "${query}"}}
      ) {
        id
        title
        first_air_date
        posters: files(
          filter: {
            _and: [
              { file_type: { _eq: "poster" } }
              { show: { id: { _neq: null } } }
            ]
          }
        ) {
          id
          uploaded_by {
            username
          }
        }
      }
    }
    `;

  mediuxSuggestions.innerHTML = '<div class="search-result-item">Searching...</div>';

  fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "/graphql",
      body: {
        query: gqlQuery,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      if (currentMediaType === "movie") {
        const movies = data.data?.movies || [];
        if (movies.length > 0) {
          displayMediuxResults(movies, "movie");
        } else {
          mediuxSuggestions.innerHTML = '<div class="search-result-item">Searching TMDB...</div>';
          searchTMDBForMediux(query);
        }
      } else {
        const shows = data.data?.shows || [];
        if (shows.length > 0) {
          displayMediuxResults(shows, "tv");
        } else {
          mediuxSuggestions.innerHTML = '<div class="search-result-item">Searching TMDB...</div>';
          searchTMDBForMediux(query, "tv");
        }
      }
    })
    .catch((err) => {
      console.error("Error fetching Mediux data:", err);
      mediuxSuggestions.innerHTML = '<div class="search-result-item">Searching TMDB...</div>';
      searchTMDBForMediux(query, currentMediaType);
    });
}

function searchTMDBForMediux(query, type = "movie") {
  fetch(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        mediuxSuggestions.innerHTML = '<div class="search-result-item">No results found</div>';
        return;
      }

      const tmdbResults = data.results
        .filter((item) => item.poster_path)
        .slice(0, 10)
        .map((item) => ({
          id: item.id.toString(),
          title: type === "movie" ? item.title : item.name,
          release_date: type === "movie" ? item.release_date : item.first_air_date,
          tmdb_id: item.id,
          is_tmdb_result: true,
          type: type
        }));

      displayTMDBResultsForMediux(tmdbResults, type);
    })
    .catch((err) => {
      console.error("Error in TMDB fallback search:", err);
      mediuxSuggestions.innerHTML = '<div class="search-result-item">Search failed</div>';
    });
}

function displayTMDBResultsForMediux(movies, type = "movie") {
  mediuxSuggestions.innerHTML = "";

  if (movies.length === 0) {
    mediuxSuggestions.innerHTML = '<div class="search-result-item">No results found</div>';
    return;
  }

  const header = document.createElement("div");
  header.className = "result-header";
  header.textContent = "Results from TMDB";
  header.style.backgroundColor = "rgba(1, 180, 228, 0.3)";
  mediuxSuggestions.appendChild(header);

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    const badge = document.createElement("span");
    badge.className = `type-badge ${type}`;
    badge.innerHTML = type === "movie" ? 
      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M2 6h20v12H2z" fill="none" stroke="white" stroke-width="2"/><path d="M7 6v12M17 6v12" stroke="white" stroke-width="2"/></svg>` : 
      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v12H4z" fill="none" stroke="white" stroke-width="2"/><path d="M2 20h20M12 16v4" stroke="white" stroke-width="2"/></svg>`;
    
    const year = movie.release_date ? movie.release_date.substring(0, 4) : "—";
    const tmdbBadge = document.createElement("span");
    tmdbBadge.style.marginLeft = "8px";
    tmdbBadge.style.padding = "2px 5px";
    tmdbBadge.style.fontSize = "0.7rem";
    tmdbBadge.style.backgroundColor = "rgba(1, 180, 228, 0.3)";
    tmdbBadge.style.borderRadius = "4px";
    tmdbBadge.textContent = "TMDB";
    div.textContent = `${movie.title} (${year})`;
    div.appendChild(tmdbBadge);
    div.appendChild(badge);
    div.addEventListener("click", () => {
      mediuxInput.value = movie.title;
      mediuxSuggestions.innerHTML = "";

      if (type === "movie") {
        lookupMediuxByTMDBId(movie.tmdb_id, movie.title, type);
      } else {
        lookupMediuxShowByTMDBId(movie.tmdb_id, movie.title);
      }
    });

    mediuxSuggestions.appendChild(div);
  });
}

function lookupMediuxShowByTMDBId(tmdbId, title) {
  const gqlQuery = `
    query {
      shows(
        filter: {
          _or: [
            { tmdb_id: { _eq: "${tmdbId}" } },
            { title: { _eq: "${title}" } }
          ]
        }
      ) {
        id
        title
        first_air_date
      }
    }
  `;

  showPosterModal(`Looking for "${title}" in Mediux...`);

  fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "/graphql",
      body: {
        query: gqlQuery,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const mediuxShows = data.data?.shows || [];

      if (mediuxShows.length > 0) {
        fetchShowPosters(mediuxShows[0].id, mediuxShows[0].title);
      } else {
        showPosterModal(`"${title}" was found in TMDB but not in Mediux yet. Try searching for another title.`);
      }
    })
    .catch((err) => {
      console.error("Error looking up show in Mediux:", err);
      showPosterModal(`Error looking up "${title}" in Mediux.`);
    });
}

function lookupMediuxByTMDBId(tmdbId, title, type = "movie") {
  const isMovie = type === "movie";
  const gqlQuery = isMovie ? 
    `
    query {
      movies(
        filter: {
          _or: [
            { tmdb_id: { _eq: "${tmdbId}" } },
            { title: { _eq: "${title}" } }
          ]
        }
      ) {
        id
        title
        release_date
      }
    }
    ` : 
    `
    query {
      shows(
        filter: {
          _or: [
            { tmdb_id: { _eq: "${tmdbId}" } },
            { title: { _eq: "${title}" } }
          ]
        }
      ) {
        id
        title
        first_air_date
      }
    }
    `;

  showPosterModal(`Looking for "${title}" in Mediux...`);

  fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "/graphql",
      body: {
        query: gqlQuery,
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (isMovie) {
        const mediuxMovies = data.data?.movies || [];
        if (mediuxMovies.length > 0) {
          fetchMoviePosters(mediuxMovies[0].id, mediuxMovies[0].title);
        } else {
          showPosterModal(`"${title}" was found in TMDB but not in Mediux yet. Try searching for another title.`);
        }
      } else {
        const mediuxShows = data.data?.shows || [];
        if (mediuxShows.length > 0) {
          fetchShowPosters(mediuxShows[0].id, mediuxShows[0].title);
        } else {
          showPosterModal(`"${title}" was found in TMDB but not in Mediux yet. Try searching for another title.`);
        }
      }
    })
    .catch((err) => {
      console.error("Error looking up content in Mediux:", err);
      showPosterModal(`Error looking up "${title}" in Mediux.`);
    });
}

function displayMediuxResults(items, type = "movie") {
  mediuxSuggestions.innerHTML = "";

  if (items.length === 0) {
    mediuxSuggestions.innerHTML = '<div class="search-result-item">No results found</div>';
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    const badge = document.createElement("span");
    badge.className = `type-badge ${type}`;
    
    if (type === "movie") {
      badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M2 6h20v12H2z" fill="none" stroke="white" stroke-width="2"/><path d="M7 6v12M17 6v12" stroke="white" stroke-width="2"/></svg>`;
      const year = item.release_date ? item.release_date.substring(0, 4) : "—";
      const hasDirectPosters = item.posters && item.posters.length > 0;
      const hasSetPosters = item.movie_sets && item.movie_sets.some((set) => set.files && set.files.length > 0);
      const hasCollection = item.collection_id && item.collection_id.id;
      div.textContent = `${item.title} (${year})`;
      
      if (hasDirectPosters || hasSetPosters) {
        const posterBadge = document.createElement("span");
        posterBadge.style.marginLeft = "8px";
        posterBadge.style.padding = "2px 5px";
        posterBadge.style.fontSize = "0.7rem";
        posterBadge.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
        posterBadge.style.borderRadius = "4px";
        posterBadge.textContent = "Has Posters";
        div.appendChild(posterBadge);
      } else if (hasCollection) {
        const collectionBadge = document.createElement("span");
        collectionBadge.style.marginLeft = "8px";
        collectionBadge.style.padding = "2px 5px";
        collectionBadge.style.fontSize = "0.7rem";
        collectionBadge.style.backgroundColor = "rgba(255, 215, 0, 0.3)";
        collectionBadge.style.borderRadius = "4px";
        collectionBadge.textContent = "Collection";
        div.appendChild(collectionBadge);
      } else {
        const noPosterBadge = document.createElement("span");
        noPosterBadge.style.marginLeft = "8px";
        noPosterBadge.style.padding = "2px 5px";
        noPosterBadge.style.fontSize = "0.7rem";
        noPosterBadge.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        noPosterBadge.style.borderRadius = "4px";
        noPosterBadge.textContent = "No Posters";
        div.appendChild(noPosterBadge);
      }
    } else {
      // TV Show
      badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v12H4z" fill="none" stroke="white" stroke-width="2"/><path d="M2 20h20M12 16v4" stroke="white" stroke-width="2"/></svg>`;
      const year = item.first_air_date ? item.first_air_date.substring(0, 4) : "—";
      const hasDirectPosters = item.posters && item.posters.length > 0;
      const hasSetPosters = item.show_sets && item.show_sets.some((set) => set.files && set.files.length > 0);
      div.textContent = `${item.title} (${year})`;
      
      if (hasDirectPosters || hasSetPosters) {
        const posterBadge = document.createElement("span");
        posterBadge.style.marginLeft = "8px";
        posterBadge.style.padding = "2px 5px";
        posterBadge.style.fontSize = "0.7rem";
        posterBadge.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
        posterBadge.style.borderRadius = "4px";
        posterBadge.textContent = "Has Posters";
        div.appendChild(posterBadge);
      } else {
        const noPosterBadge = document.createElement("span");
        noPosterBadge.style.marginLeft = "8px";
        noPosterBadge.style.padding = "2px 5px";
        noPosterBadge.style.fontSize = "0.7rem";
        noPosterBadge.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        noPosterBadge.style.borderRadius = "4px";
        noPosterBadge.textContent = "No Posters";
        div.appendChild(noPosterBadge);
      }
    }

    div.appendChild(badge);
    div.addEventListener("click", () => {
      mediuxInput.value = item.title;
      mediuxSuggestions.innerHTML = "";

      if (type === "movie") {
        const hasDirectPosters = item.posters && item.posters.length > 0;
        const hasSetPosters = item.movie_sets && item.movie_sets.some((set) => set.files && set.files.length > 0);
        const hasCollection = item.collection_id && item.collection_id.id;
        
        if (hasDirectPosters || hasSetPosters || hasCollection) {
          fetchMoviePosters(item.id, item.title);
        } else {
          showPosterModal(`No custom posters found for "${item.title}"`);
        }
      } else {
        const hasDirectPosters = item.posters && item.posters.length > 0;
        const hasSetPosters = item.show_sets && item.show_sets.some((set) => set.files && set.files.length > 0);
        
        if (hasDirectPosters || hasSetPosters) {
          fetchShowPosters(item.id, item.title);
        } else {
          showPosterModal(`No custom posters found for "${item.title}"`);
        }
      }
    });

    mediuxSuggestions.appendChild(div);
  });

  updateMobileMediuxSuggestions();
}

function fetchMoviePosters(movieId, movieTitle) {
  // Show loading overlay with initial message
  showLoadingOverlay("Loading Posters", `Finding posters for "${movieTitle}"`);
  updateLoadingProgress(10, "Initializing search...");

  const usernameFilter = document.getElementById("mediux-username-filter").value.trim();

  let usernameFilterQuery = "";
  if (usernameFilter) {
    usernameFilterQuery = `, { uploaded_by: { username: { _icontains: "${usernameFilter}" } } }`;
  }

  const gqlQuery = `
  query {
    movies_by_id(id: ${movieId}) {
      id
      title
      files(
        filter: {
          _and: [
            { file_type: { _eq: "poster" } }
            ${usernameFilter ? usernameFilterQuery : ""}
          ]
        }
      ) {
        id
        uploaded_by {
          username
        }
      }
      movie_sets {
        id
        set_title
        files(
          filter: {
            _and: [
              { file_type: { _eq: "poster" } }
              ${usernameFilter ? usernameFilterQuery : ""}
            ]
          }
        ) {
          id
          uploaded_by {
            username
          }
        }
      }
    }
  }
`;

  console.log(
    "Fetching Mediux posters for movie ID:",
    movieId,
    usernameFilter ? `filtered by username: ${usernameFilter}` : ""
  );

  updateLoadingProgress(20, "Connecting to Mediux API...");

  fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "/graphql",
      body: {
        query: gqlQuery,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}: ${res.statusText}`);
      }
      updateLoadingProgress(30, "Processing API response...");
      return res.json();
    })
    .then((data) => {
      console.log("API response:", data);
      updateLoadingProgress(40, "Finding poster assets...");

      if (!data.data || !data.data.movies_by_id) {
        console.error("Movie not found or invalid response format:", data);
        hideLoadingOverlay();
        showPosterModal(`Movie not found or invalid response`);
        return;
      }

      const movie = data.data.movies_by_id;
      
      // Track unique file IDs to avoid duplicates - ADD THIS
      const processedFileIds = new Set();
      const allPosters = [];
      const posterPromises = [];
      
      const directPosters = movie.files || [];
      console.log(`Found ${directPosters.length} direct posters`);

      directPosters.forEach((file) => {
        // Check for duplicates - ADD THIS
        if (processedFileIds.has(file.id)) {
          return; // Skip duplicate IDs
        }
        
        // Add to processed set - ADD THIS
        processedFileIds.add(file.id);
        
        posterPromises.push(
          fetchAssetAsDataUrl(file.id)
            .then((dataUrl) => {
              if (dataUrl) {
                allPosters.push({
                  id: file.id,
                  dataUrl,
                  set: "Direct Poster",
                  creator: file.uploaded_by?.username || "Unknown",
                });
              }
            })
            .catch((error) => {
              console.error(`Error fetching direct poster ${file.id}:`, error);
            })
        );
      });

      const movieSets = movie.movie_sets || [];
      movieSets.forEach((set) => {
        const setPosters = set.files || [];
        console.log(`Found ${setPosters.length} posters in set "${set.set_title}"`);

        setPosters.forEach((file) => {
          // Check for duplicates - ADD THIS
          if (processedFileIds.has(file.id)) {
            return; // Skip duplicate IDs
          }
          
          // Add to processed set - ADD THIS
          processedFileIds.add(file.id);
          
          posterPromises.push(
            fetchAssetAsDataUrl(file.id)
              .then((dataUrl) => {
                if (dataUrl) {
                  allPosters.push({
                    id: file.id,
                    dataUrl,
                    set: set.set_title || "Untitled Set",
                    creator: file.uploaded_by?.username || "Unknown",
                  });
                }
              })
              .catch((error) => {
                console.error(`Error fetching set poster ${file.id}:`, error);
              })
          );
        });
      });

      if (movie.collection_id) {
        const collectionPosters = movie.collection_id.files || [];
        console.log("Collection poster structure sample:", collectionPosters.length > 0 ? collectionPosters[0] : "No posters");
        
        collectionPosters.forEach((file) => {
          // Skip any files that don't have movie_id - these are likely the collection posters
          if (!file.movie_id) {
            console.log("Skipping likely collection poster:", file.id);
            return;
          }
          
          // Check for duplicates - ADD THIS
          if (processedFileIds.has(file.id)) {
            return; // Skip duplicate IDs
          }
          
          // Add to processed set - ADD THIS
          processedFileIds.add(file.id);
          
          posterPromises.push(
            fetchAssetAsDataUrl(file.id)
              .then((dataUrl) => {
                if (dataUrl) {
                  allPosters.push({
                    id: file.id,
                    dataUrl,
                    set: `Collection: ${movie.collection_id.collection_name}`,
                    creator: file.uploaded_by?.username || "Unknown",
                  });
                }
              })
              .catch((error) => {
                console.error(`Error fetching collection poster ${file.id}:`, error);
              })
          );
        });
      }

      if (posterPromises.length === 0) {
        console.log("No posters found");
        hideLoadingOverlay();
        showPosterModal(`No posters found for "${movieTitle}"`);
        return;
      }

      updateLoadingProgress(50, `Found ${posterPromises.length} posters. Downloading...`);
      
      // Track progress for loading each poster
      let loadedCount = 0;
      const totalCount = posterPromises.length;
      
      // Update the progress function to show loading progress
      const originalFetch = window.fetchAssetAsDataUrl;
      window.fetchAssetAsDataUrl = async function(fileId) {
        const result = await originalFetch(fileId);
        loadedCount++;
        const percent = 50 + Math.floor((loadedCount / totalCount) * 45); // Progress from 50% to 95%
        updateLoadingProgress(percent, `Loading poster ${loadedCount}/${totalCount}`);
        return result;
      };

      Promise.allSettled(posterPromises).then((results) => {
        // Restore original function
        window.fetchAssetAsDataUrl = originalFetch;
        
        updateLoadingProgress(95, "Processing complete!");
        
        console.log(
          `Finished processing ${results.length} posters. Success: ${
            results.filter((r) => r.status === "fulfilled").length
          }, Failed: ${results.filter((r) => r.status === "rejected").length}`
        );
        const usernameFilter = document.getElementById("mediux-username-filter").value.trim();

        if (allPosters.length === 0) {
          hideLoadingOverlay();
          if (usernameFilter) {
            showPosterModal(`No posters found for "${movieTitle}" by creator "${usernameFilter}"`);
          } else {
            showPosterModal(`Could not load any posters for "${movieTitle}"`);
          }
        } else {
          updateLoadingProgress(100, `Found ${allPosters.length} posters!`);
          
          // Hide loading overlay after a small delay to show completion
          setTimeout(() => {
            hideLoadingOverlay();
            displayPosters(allPosters, movieTitle);
          }, 500);
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching movie details:", err);
      hideLoadingOverlay();
      showPosterModal(`Error: ${err.message}`);
    });
}

function fetchShowPosters(showId, showTitle) {
  // Show loading overlay with initial message
  showLoadingOverlay("Loading Posters", `Finding posters for "${showTitle}"`);
  updateLoadingProgress(10, "Initializing search...");

  const usernameFilter = document.getElementById("mediux-username-filter").value.trim();

  let usernameFilterQuery = "";
  if (usernameFilter) {
    usernameFilterQuery = `, { uploaded_by: { username: { _icontains: "${usernameFilter}" } } }`;
  }

  const gqlQuery = `
    query {
      shows_by_id(id: ${showId}) {
        id
        title
        files(
          filter: {
            _and: [
              { file_type: { _eq: "poster" } }
              { show: { id: { _neq: null } } }
              { season: { id: { _eq: null } } }
              ${usernameFilter ? usernameFilterQuery : ""}
            ]
          }
        ) {
          id
          uploaded_by {
            username
          }
        }
        show_sets {
          id
          set_title
          files(
            filter: {
              _and: [
                { file_type: { _eq: "poster" } }
                { season: { id: { _eq: null } } }
                ${usernameFilter ? usernameFilterQuery : ""}
              ]
            }
          ) {
            id
            uploaded_by {
              username
            }
          }
        }
      }
    }
  `;

  console.log(
    "Fetching Mediux posters for show ID:",
    showId,
    usernameFilter ? `filtered by username: ${usernameFilter}` : ""
  );

  updateLoadingProgress(20, "Connecting to Mediux API...");

  fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: "/graphql",
      body: {
        query: gqlQuery,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}: ${res.statusText}`);
      }
      updateLoadingProgress(30, "Processing API response...");
      return res.json();
    })
    .then((data) => {
      console.log("API response:", data);
      updateLoadingProgress(40, "Finding poster assets...");

      if (!data.data || !data.data.shows_by_id) {
        console.error("Show not found or invalid response format:", data);
        hideLoadingOverlay();
        showPosterModal(`Show not found or invalid response`);
        return;
      }

      const show = data.data.shows_by_id;
      
      // Track unique file IDs to avoid duplicates
      const processedFileIds = new Set();
      const allPosters = [];
      const posterPromises = [];
      
      // Process direct posters
      const directPosters = show.files || [];
      console.log(`Found ${directPosters.length} direct posters`);

      directPosters.forEach((file) => {
        if (processedFileIds.has(file.id)) {
          return; // Skip duplicate IDs
        }
        
        processedFileIds.add(file.id);
        posterPromises.push(
          fetchAssetAsDataUrl(file.id)
            .then((dataUrl) => {
              if (dataUrl) {
                allPosters.push({
                  id: file.id,
                  dataUrl,
                  set: "Direct Poster",
                  creator: file.uploaded_by?.username || "Unknown",
                });
              }
            })
            .catch((error) => {
              console.error(`Error fetching direct poster ${file.id}:`, error);
            })
        );
      });

      // Process set posters
      const showSets = show.show_sets || [];
      showSets.forEach((set) => {
        const setPosters = set.files || [];
        console.log(`Found ${setPosters.length} posters in set "${set.set_title}"`);

        setPosters.forEach((file) => {
          if (processedFileIds.has(file.id)) {
            return; // Skip duplicate IDs
          }
          
          processedFileIds.add(file.id);
          posterPromises.push(
            fetchAssetAsDataUrl(file.id)
              .then((dataUrl) => {
                if (dataUrl) {
                  allPosters.push({
                    id: file.id,
                    dataUrl,
                    set: set.set_title || "Untitled Set",
                    creator: file.uploaded_by?.username || "Unknown",
                  });
                }
              })
              .catch((error) => {
                console.error(`Error fetching set poster ${file.id}:`, error);
              })
          );
        });
      });

      if (posterPromises.length === 0) {
        console.log("No posters found");
        hideLoadingOverlay();
        showPosterModal(`No posters found for "${showTitle}"`);
        return;
      }

      updateLoadingProgress(50, `Found ${posterPromises.length} posters. Downloading...`);
      
      // Track progress for loading each poster
      let loadedCount = 0;
      const totalCount = posterPromises.length;
      
      // Update the progress function to show loading progress
      const originalFetch = window.fetchAssetAsDataUrl;
      window.fetchAssetAsDataUrl = async function(fileId) {
        const result = await originalFetch(fileId);
        loadedCount++;
        const percent = 50 + Math.floor((loadedCount / totalCount) * 45); // Progress from 50% to 95%
        updateLoadingProgress(percent, `Loading poster ${loadedCount}/${totalCount}`);
        return result;
      };

      Promise.allSettled(posterPromises).then((results) => {
        // Restore original function
        window.fetchAssetAsDataUrl = originalFetch;
        
        updateLoadingProgress(95, "Processing complete!");
        
        console.log(
          `Finished processing ${results.length} posters. Success: ${
            results.filter((r) => r.status === "fulfilled").length
          }, Failed: ${results.filter((r) => r.status === "rejected").length}`
        );
        const usernameFilter = document.getElementById("mediux-username-filter").value.trim();

        if (allPosters.length === 0) {
          hideLoadingOverlay();
          if (usernameFilter) {
            showPosterModal(`No posters found for "${showTitle}" by creator "${usernameFilter}"`);
          } else {
            showPosterModal(`Could not load any posters for "${showTitle}"`);
          }
        } else {
          updateLoadingProgress(100, `Found ${allPosters.length} posters!`);
          
          // Hide loading overlay after a small delay to show completion
          setTimeout(() => {
            hideLoadingOverlay();
            displayPosters(allPosters, showTitle, "tv");
          }, 500);
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching show details:", err);
      hideLoadingOverlay();
      showPosterModal(`Error: ${err.message}`);
    });
}

function displayPosters(posters, title, contentType = "movie") {
  if (!posters || !posters.length) return;

  // Build a temporary grid inside the poster picker modal
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const titleEl  = document.getElementById('poster-picker-title');
  const grid     = document.getElementById('poster-picker-grid');
  const tabsEl   = document.getElementById('poster-lang-tabs');

  const usernameFilter = document.getElementById("mediux-username-filter").value.trim();
  if (titleEl) titleEl.textContent = usernameFilter
    ? `${posters.length} posters by "${usernameFilter}"`
    : `Posters — ${title || 'Results'} (${posters.length})`;

  if (tabsEl) tabsEl.innerHTML = '';
  if (grid)   grid.innerHTML   = '';

  posters.forEach((poster) => {
    const item = document.createElement('div');
    item.className = 'poster-picker-item';
    const img = document.createElement('img');
    img.src = poster.dataUrl;
    img.alt = title || 'Poster';

    img.addEventListener("mouseenter", (e) => {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) {
        tooltip.textContent = `by ${poster.creator}`;
        tooltip.style.opacity = 1;
        tooltip.style.transform = "translateY(-8px)";
      }
    });
    img.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) {
        tooltip.style.left = `${e.pageX + 12}px`;
        tooltip.style.top  = `${e.pageY - 28}px`;
      }
    });
    img.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) tooltip.style.opacity = 0;
    });

    item.addEventListener('click', () => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        baseImage = image;
        if (overlaySelect.value !== 'none') overlayImage.src = overlaySelect.value;
        drawCanvas();
        closePosterPicker();
        fetchTMDBMetadataForTitle(title, contentType);
      };
      image.src = poster.dataUrl;
    });

    item.appendChild(img);
    grid.appendChild(item);
  });

  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function fetchTMDBMetadataForTitle(title, contentType = "movie") {
  metaPanel.style.display = "flex";
  document.getElementById("meta-title").textContent = title;
  document.getElementById("meta-overview").textContent = "Loading metadata...";

  if (contentType === "tv") {
    fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const showId = data.results[0].id;
          fetchMetadataById(showId, "tv");
        } else {
          document.getElementById("meta-overview").textContent =
            "No detailed metadata found. The poster was loaded successfully.";
        }
      })
      .catch((err) => {
        console.error("Error fetching TMDB TV data:", err);
        document.getElementById("meta-overview").textContent =
          "Error loading metadata. The poster was loaded successfully.";
      });
  } else {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const movieId = data.results[0].id;
          fetchMetadataById(movieId, "movie");
        } else {
          // Fallback to TV search if no movie results
          return fetch(
            `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`
          )
            .then((res) => res.json())
            .then((tvData) => {
              if (tvData.results && tvData.results.length > 0) {
                const showId = tvData.results[0].id;
                fetchMetadataById(showId, "tv");
              } else {
                document.getElementById("meta-overview").textContent =
                  "No detailed metadata found. The poster was loaded successfully.";
              }
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching TMDB data:", err);
        document.getElementById("meta-overview").textContent =
          "Error loading metadata. The poster was loaded successfully.";
      });
  }
}

function fetchAssetAsDataUrl(fileId) {
  console.log(`Fetching asset: ${fileId}`);

  return fetch("https://api-frontend.pejamas.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endpoint: `/assets/${fileId}`,
      body: {},
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`Asset fetch failed: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch asset: ${response.status} ${response.statusText}`);
      }
      return response.blob();
    })
    .then((blob) => {
      if (!blob || blob.size === 0) {
        console.error(`Asset ${fileId} is empty (0 bytes)`);
        throw new Error("Received empty asset");
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log(`Successfully converted asset ${fileId} to data URL`);
          resolve(reader.result);
        };
        reader.onerror = (err) => {
          console.error(`Error reading blob for asset ${fileId}:`, err);
          reject(err);
        };
        reader.readAsDataURL(blob);
      });
    });
}

function displaySearchResults(results) {
  suggestionsBox.innerHTML = "";

  if (results.length === 0) {
    const div = document.createElement("div");
    div.textContent = "No results found";
    suggestionsBox.appendChild(div);
    return;
  }

  results.forEach((item) => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    div.textContent = `${item.title} (${item.year})`;
    const badge = document.createElement("span");
    badge.className = `type-badge ${item.type}`;
    badge.innerHTML =
      item.type === "movie"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M2 6h20v12H2z" fill="none" stroke="white" stroke-width="2"/><path d="M7 6v12M17 6v12" stroke="white" stroke-width="2"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v12H4z" fill="none" stroke="white" stroke-width="2"/><path d="M2 20h20M12 16v4" stroke="white" stroke-width="2"/></svg>`;

    div.appendChild(badge);
    div.addEventListener("click", () => {
      searchInput.value = item.title;
      suggestionsBox.innerHTML = "";

      fetchAndDisplayPostersById(item.id, item.title, item.type);
    });

    suggestionsBox.appendChild(div);
  });
}

function getImageProxyCandidates(originalUrl) {
  const urlWithoutScheme = originalUrl.replace(/^https?:\/\//i, "");

  return [
    // Own Cloudflare Worker proxy — most reliable
    `https://poster-proxy.pejamas.workers.dev/?url=${encodeURIComponent(originalUrl)}`,

    // Direct (some CDNs allow CORS)
    originalUrl,

    // Public fallbacks
    `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`,
    `https://images.weserv.nl/?url=${encodeURIComponent(urlWithoutScheme)}`,
  ];
}

function fetchImageAsObjectUrl(originalUrl) {
  const candidates = getImageProxyCandidates(originalUrl);

  return candidates.reduce((promiseChain, candidateUrl) => {
    return promiseChain.catch((previousError) => {
      return fetch(candidateUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
          }

          const contentType = response.headers.get("content-type") || "";
          if (contentType && contentType.includes("text/html")) {
            throw new Error(`Unexpected content-type: ${contentType}`);
          }

          return response.blob();
        })
        .then((blob) => {
          if (!blob || blob.size === 0) {
            throw new Error("Received empty image blob");
          }

          return URL.createObjectURL(blob);
        })
        .catch((err) => {
          console.warn("Image fetch candidate failed:", candidateUrl, err);
          throw err;
        });
    });
  }, Promise.reject(new Error("No image fetch attempts yet")));
}

function fetchAndDisplayPostersById(id, title, type = "movie") {
  currentDesignerId    = id;
  currentDesignerType  = type;
  currentDesignerTitle = title;
  // Also kick off the clearlogo strip for the logo picker
  fetchAndDisplayClearlogos(id, type);
  // Open the new poster picker modal
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const titleEl  = document.getElementById('poster-picker-title');
  if (titleEl) titleEl.textContent = `Posters — ${title}`;
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
  fetchAndRenderPosterPicker(id, type);
}


function showSearchResultsDialog(results) {
  if (!document.getElementById("search-results-dialog")) {
    const dialog = document.createElement("div");
    dialog.id = "search-results-dialog";
    dialog.className = "modal-dialog";

    dialog.innerHTML = `
                <div class="modal-content">
                    <h3>Select the correct title</h3>
                    <div id="search-results-list" class="search-results-list"></div>
                    <button id="close-search-dialog" class="dialog-btn">Cancel</button>
                </div>
            `;

    document.body.appendChild(dialog);
    document.getElementById("close-search-dialog").addEventListener("click", () => {
      document.getElementById("search-results-dialog").style.display = "none";
    });
  }

  document.getElementById("search-results-dialog").style.display = "flex";
  const resultsList = document.getElementById("search-results-list");
  resultsList.innerHTML = "";
  results.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";

    const svgIcon =
      item.type === "movie"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M2 6h20v12H2z" fill="none" stroke="white" stroke-width="2"/><path d="M7 6v12M17 6v12" stroke="white" stroke-width="2"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M4 4h16v12H4z" fill="none" stroke="white" stroke-width="2"/><path d="M2 20h20M12 16v4" stroke="white" stroke-width="2"/></svg>`;

    const typeText = item.type === "movie" ? "Movie" : "TV Show";

    resultItem.innerHTML = `
    <div class="result-poster">
        ${
          item.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w92${item.poster_path}" alt="${item.title}">`
            : '<div class="no-poster">No Image</div>'
        }
    </div>
    <div class="result-info">
        <div class="result-title">${item.title}</div>
        <div class="result-year">${item.year}</div>
        <div class="result-type">
  <span class="icon-badge">${svgIcon}</span>
  ${typeText}
</div>
    </div>
`;

    resultItem.addEventListener("click", () => {
      document.getElementById("search-results-dialog").style.display = "none";
      fetchMetadataById(item.id, item.type);
    });

    resultsList.appendChild(resultItem);
  });
}

function showContentTypeDialog(title) {
  Promise.all([searchTMDB(title, "movie"), searchTMDB(title, "tv")]).then(([movies, tvs]) => {
    const allEmpty = (!movies || movies.length === 0) && (!tvs || tvs.length === 0);

    if (allEmpty) {
      const dialog = document.createElement("div");
      dialog.id = "search-results-dialog";
      dialog.className = "modal-dialog";
      dialog.innerHTML = `
                <div class="modal-content">
                    <h3>No results found</h3>
                    <p>We couldn't find anything for "${title}".</p>
                    <button class="dialog-btn" onclick="document.getElementById('search-results-dialog').remove()">Close</button>
                </div>
            `;
      document.body.appendChild(dialog);
      return;
    }

    if (!document.getElementById("search-results-dialog")) {
      const dialog = document.createElement("div");
      dialog.id = "search-results-dialog";
      dialog.className = "modal-dialog";
      dialog.innerHTML = `
                <div class="modal-content large-modal">
                    <h3>Select the correct title</h3>
                    <div class="result-section">
                        ${
                          movies.length > 0
                            ? `<div><h4>Movies</h4><div class="search-results-list" id="movie-results"></div></div>`
                            : ""
                        }
                        ${
                          tvs.length > 0
                            ? `<div><h4>TV Shows</h4><div class="search-results-list" id="tv-results"></div></div>`
                            : ""
                        }
                    </div>
                    <button id="close-search-dialog" class="dialog-btn">Cancel</button>
                </div>
            `;
      document.body.appendChild(dialog);

      document.getElementById("close-search-dialog").addEventListener("click", () => {
        document.getElementById("search-results-dialog").style.display = "none";
      });
    }

    document.getElementById("search-results-dialog").style.display = "flex";

    if (movies.length > 0) populateResultList("movie-results", movies);
    if (tvs.length > 0) populateResultList("tv-results", tvs);
  });
}

function populateResultList(containerId, results) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  results.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    const svgIcon =
      item.type === "movie"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M2 6h20v12H2z" fill="none" stroke="white" stroke-width="2"/><path d="M7 6v12M17 6v12" stroke="white" stroke-width="2"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M4 4h16v12H4z" fill="none" stroke="white" stroke-width="2"/><path d="M2 20h20M12 16v4" stroke="white" stroke-width="2"/></svg>`;

    resultItem.innerHTML = `
            <div class="result-poster">
                ${
                  item.poster_path
                    ? `<img src="https://image.tmdb.org/t/p/w92${item.poster_path}" alt="${item.title}">`
                    : '<div class="no-poster">No Image</div>'
                }
            </div>
            <div class="result-info">
                <div class="result-title">${item.title}</div>
                <div class="result-year">${item.year}</div>
                <div class="result-type">
                    <span class="icon-badge">${svgIcon}</span>
                    ${item.type === "movie" ? "Movie" : "TV Show"}
                </div>
            </div>
        `;

    resultItem.addEventListener("click", () => {
      document.getElementById("search-results-dialog").style.display = "none";
      fetchMetadataById(item.id, item.type);
    });

    container.appendChild(resultItem);
  });
}

function showContentSearchDialog(title, type) {
  if (!document.getElementById("search-results-dialog")) {
    const dialog = document.createElement("div");
    dialog.id = "search-results-dialog";
    dialog.className = "modal-dialog";

    dialog.innerHTML = `
                <div class="modal-content">
                    <h3>Select the correct title</h3>
                    <div id="search-results-list" class="search-results-list">
                        <div class="loading">Searching...</div>
                    </div>
                    <button id="close-search-dialog" class="dialog-btn">Cancel</button>
                </div>
            `;

    document.body.appendChild(dialog);

    document.getElementById("close-search-dialog").addEventListener("click", () => {
      document.getElementById("search-results-dialog").style.display = "none";
    });
  }

  document.getElementById("search-results-dialog").style.display = "flex";
  const resultsList = document.getElementById("search-results-list");
  resultsList.innerHTML = '<div class="loading">Searching...</div>';

  fetch(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(title)}&api_key=${TMDB_API_KEY}`)
    .then((res) => res.json())
    .then((data) => {
      const resultsList = document.getElementById("search-results-list");
      resultsList.innerHTML = "";

      if (data.results?.length === 0) {
        resultsList.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }

      data.results.slice(0, 8).forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.className = "search-result-item";
        const title = type === "movie" ? item.title : item.name;
        const year = type === "movie" ? item.release_date?.slice(0, 4) || "—" : item.first_air_date?.slice(0, 4) || "—";

        resultItem.innerHTML = `
                        <div class="result-poster">
                            ${
                              item.poster_path
                                ? `<img src="https://image.tmdb.org/t/p/w92${item.poster_path}" alt="${title}">`
                                : '<div class="no-poster">No Image</div>'
                            }
                        </div>
                        <div class="result-info">
                            <div class="result-title">${title}</div>
                            <div class="result-year">${year}</div>
                        </div>
                    `;

        resultItem.addEventListener("click", () => {
          document.getElementById("search-results-dialog").style.display = "none";
          fetchMetadataById(item.id, item.type);
        });

        resultsList.appendChild(resultItem);
      });
    })
    .catch((err) => {
      resultsList.innerHTML = '<div class="error">Error loading results</div>';
      console.error("Search error:", err);
    });
}

function fetchMetadataById(id, type) {
  fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`)
    .then((res) => res.json())
    .then((details) => {
      if (type === "movie") {
        displayMovieMetadata(details);
      } else {
        displayTVShowMetadata(details);
      }

      metaPanel.style.display = "flex";
    })
    .catch((err) => {
      console.error("Error fetching metadata:", err);
      metaPanel.style.display = "none";
    });
}

function enableHorizontalScrolling() {
  const posterGrid = document.querySelector(".poster-grid");

  if (posterGrid) {
    posterGrid.addEventListener("wheel", function (event) {
      event.preventDefault();

      const scrollAmount = event.deltaY;
      posterGrid.scrollLeft += scrollAmount;
    });
  }
}

function enableTouchScrolling() {
  const posterGrid = document.querySelector(".poster-grid");

  if (posterGrid && "ontouchstart" in window) {
    let startX, scrollLeft;

    posterGrid.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      scrollLeft = posterGrid.scrollLeft;
    });

    posterGrid.addEventListener("touchmove", (e) => {
      if (!startX) return;
      const x = e.touches[0].clientX;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      posterGrid.scrollLeft = scrollLeft - walk;
    });

    posterGrid.addEventListener("touchend", () => {
      startX = null;
    });
  }
}

function displayMovieMetadata(details) {
  document.getElementById("meta-title").textContent = details.title;
  document.getElementById("meta-rating").textContent = details.vote_average?.toFixed(1) || "—";
  document.getElementById("meta-tagline").textContent = details.tagline || "";
  const director = details.credits?.crew?.find((p) => p.job === "Director");
  const cast = details.credits?.cast
    ?.slice(0, 5)
    .map((p) => p.name)
    .join(", ");
  document.getElementById("creator-label").textContent = "Director:";
  document.getElementById("meta-year").textContent = details.release_date?.slice(0, 4) || "—";
  document.getElementById("meta-runtime").textContent = details.runtime ? `${details.runtime} mins` : "—";
  document.getElementById("meta-genres").textContent = details.genres?.map((g) => g.name).join(", ") || "—";
  document.getElementById("meta-director").textContent = director?.name || "—";
  document.getElementById("meta-cast").textContent = cast || "—";
  document.getElementById("meta-language").textContent = details.original_language?.toUpperCase() || "—";
  document.getElementById("meta-country").textContent = details.production_countries?.[0]?.name || "—";
  document.getElementById("meta-overview").textContent = details.overview || "—";
  document.getElementById("meta-seasons-row").style.display = "none";
  document.getElementById("meta-episodes-row").style.display = "none";
  document.getElementById("meta-network-row").style.display = "none";
  document.getElementById("content-type-indicator").textContent = "Movie";
  document.getElementById("content-type-indicator").className = "type-badge movie";

  // Hide TV-only UI
  const _ssp = document.getElementById('season-suite-panel');
  if (_ssp) _ssp.style.display = 'none';
  seasonLabelEnabled = false;
  const _slt = document.getElementById('season-label-toggle');
  if (_slt) { _slt.checked = false; _slt.dispatchEvent(new Event('change')); }
  seasonSuiteData     = null;
  activeSeasonNum     = null;
  showBasePosterPath  = null;
  baseShowImage       = null;
  seasonSavedImages.clear();
}

function displayTVShowMetadata(details) {
  showBasePosterPath = details.poster_path || null;
  document.getElementById("meta-title").textContent = details.name;
  document.getElementById("meta-rating").textContent = details.vote_average?.toFixed(1) || "—";
  document.getElementById("meta-tagline").textContent = details.tagline || "";
  document.getElementById("creator-label").textContent = "Creator:";
  const creator = details.created_by?.[0]?.name || "—";
  const cast = details.credits?.cast
    ?.slice(0, 5)
    .map((p) => p.name)
    .join(", ");
  document.getElementById("meta-year").textContent = `${details.first_air_date?.slice(0, 4) || "—"} - ${
    details.status === "Ended" ? details.last_air_date?.slice(0, 4) || "—" : "Present"
  }`;
  document.getElementById("meta-runtime").textContent = details.episode_run_time?.length
    ? `${details.episode_run_time[0]} mins`
    : "—";
  document.getElementById("meta-genres").textContent = details.genres?.map((g) => g.name).join(", ") || "—";
  document.getElementById("meta-director").textContent = creator;
  document.getElementById("meta-cast").textContent = cast || "—";
  document.getElementById("meta-language").textContent = details.original_language?.toUpperCase() || "—";
  document.getElementById("meta-country").textContent = details.origin_country?.[0] || "—";
  document.getElementById("meta-overview").textContent = details.overview || "—";
  document.getElementById("meta-seasons-row").style.display = "flex";
  document.getElementById("meta-seasons").textContent = details.number_of_seasons || "—";
  document.getElementById("meta-episodes-row").style.display = "flex";
  document.getElementById("meta-episodes").textContent = details.number_of_episodes || "—";
  document.getElementById("meta-network-row").style.display = "flex";
  document.getElementById("meta-network").textContent = details.networks?.map((n) => n.name).join(", ") || "—";
  document.getElementById("content-type-indicator").textContent = "TV Show";
  document.getElementById("content-type-indicator").className = "type-badge tv";

  // Auto-add network logo for TV shows if they have network information
  if (details.networks && details.networks.length > 0) {
    const networkName = details.networks[0].name.toLowerCase();
    console.log(`Looking for network logo match for: ${networkName}`);
    
    // First try for exact match
    let exactMatch = availableLogos.find((logo) => logo.name.toLowerCase() === networkName);

    if (exactMatch) {
      console.log(`Found exact match for ${networkName}: ${exactMatch.name}`);
      networkLogoSearch.value = exactMatch.name;
      updateNetworkLogo(exactMatch.path);
      networkLogoCheckbox.checked = true;
      networkLogoCheckbox.dispatchEvent(new Event('change'));
      hideNetworkSuggestions();
    } else {
      // Check special cases
      const specialCases = {
        hbo: "HBO",
        "hbo max": "Hbo Max",
        fx: "FX",
        fxx: "FXX",
      };

      if (specialCases[networkName]) {
        const specialMatch = availableLogos.find((logo) => logo.name === specialCases[networkName]);
        if (specialMatch) {
          console.log(`Found special case match for ${networkName}: ${specialMatch.name}`);
          networkLogoSearch.value = specialMatch.name;
          updateNetworkLogo(specialMatch.path);
          networkLogoCheckbox.checked = true;
          networkLogoCheckbox.dispatchEvent(new Event('change'));
          hideNetworkSuggestions();
        }
      } else {
        // Try partial/regex match
        let matchFound = false;
        for (const logo of availableLogos) {
          const logoName = logo.name.toLowerCase();

          const networkRegex = new RegExp(`\\b${networkName}\\b`);
          const logoRegex = new RegExp(`\\b${logoName}\\b`);

          if (networkRegex.test(logoName) || logoRegex.test(networkName)) {
            console.log(`Found regex match for ${networkName}: ${logo.name}`);
            networkLogoSearch.value = logo.name;
            updateNetworkLogo(logo.path);
            networkLogoCheckbox.checked = true;
            networkLogoCheckbox.dispatchEvent(new Event('change'));
            hideNetworkSuggestions();
            matchFound = true;
            break;
          }
        }
        
        if (!matchFound) {
          console.log(`No logo match found for network: ${networkName}`);
        }
      }
    }
  }

  // Build season grid below the canvas
  buildSeasonGrid(details.seasons || [], details.id);

  // Show the Season Label card in the sidebar
  // (always visible — nothing to show/hide)
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".tmdb-search")) {
    suggestionsBox.innerHTML = "";
  }
});

document.getElementById("download-btn").addEventListener("click", () => {
  const link = document.createElement("a");
  let filename = "poster-overlay.png";
  const titleElement = document.getElementById("meta-title");
  const showTitle = titleElement?.textContent?.trim();
  if (showTitle && showTitle !== "Title") {
    const safeName = showTitle.replace(/[/\\?%*:|"<>]/g, "-").trim();
    if (activeSeasonNum === null) {
      // Show poster
      filename = `${safeName}.png`;
    } else if (activeSeasonNum === 0) {
      filename = `${safeName} - Specials.png`;
    } else {
      filename = `${safeName} - Season ${String(activeSeasonNum).padStart(2, '0')}.png`;
    }
  }

  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

const _seasonDlAllBtn = document.getElementById('season-download-all-btn');
if (_seasonDlAllBtn) _seasonDlAllBtn.addEventListener('click', () => batchDownloadAllSeasons());

document.getElementById("reset-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  posterUpload.value = "";
  baseImage = null;
  metaPanel.style.display = "none";
  document.getElementById("tmdb-search-input").value = "";
  document.getElementById("tmdb-suggestions").innerHTML = "";
  document.getElementById("mediux-search-input").value = "";
  document.getElementById("mediux-suggestions").innerHTML = "";
  document.getElementById("mediux-username-filter").value = "";
  networkLogoSearch.value = "";
  networkLogoCheckbox.checked = false;
  selectedLogoColor = "#ffffff";
  if (networkLogoColorPickr) networkLogoColorPickr.setColor(selectedLogoColor);
  networkLogoImage = null;
  overlaySelect.value = "none";
  // Reset season suite
  seasonSuiteData    = null;
  activeSeasonNum    = null;
  showBasePosterPath = null;
  baseShowImage      = null;
  seasonSavedImages.clear();
  seasonLabelEnabled = false;
  seasonLabelText    = '';
  seasonLabelColor   = '#ffffff';
  const _ssp = document.getElementById('season-suite-panel');
  if (_ssp) _ssp.style.display = 'none';
  const _slt = document.getElementById('season-label-toggle');
  if (_slt) { _slt.checked = false; _slt.dispatchEvent(new Event('change')); }
  const _sli = document.getElementById('season-label-text');
  if (_sli) _sli.value = '';
  if (seasonLabelColorPickr) seasonLabelColorPickr.setColor('#ffffff');
  // Reset gradient
  gradientEnabled = false; gradientOpacity = 0.7; gradientHeight = 50; gradientColor = '#000000';
  const _gt  = document.getElementById('gradient-toggle');       if (_gt)  { _gt.checked = false; _gt.dispatchEvent(new Event('change')); }
  const _gcp = document.getElementById('gradient-controls-panel'); if (_gcp) _gcp.style.display = 'none';
  const _go  = document.getElementById('gradient-opacity');      if (_go)  _go.value = '70';
  const _gov = document.getElementById('gradient-opacity-val');  if (_gov) _gov.textContent = '70%';
  const _gh  = document.getElementById('gradient-height');       if (_gh)  _gh.value = '50';
  const _ghv = document.getElementById('gradient-height-val');   if (_ghv) _ghv.textContent = '50%';
  if (gradientColorPickr) gradientColorPickr.setColor('#000000');
  // Reset designer logo color
  designerLogoColor = '#ffffff';
  if (designerLogoColorPickr) designerLogoColorPickr.setColor('#ffffff');
  // Redraw guidelines backdrop
  if (guidelinesImage.complete && guidelinesImage.naturalWidth > 0) {
    drawGuidelinesBackdrop();
  }
});

const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenuDropdown = document.getElementById("mobile-menu-dropdown");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

// Mobile menu dropdown toggle
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent document click from firing immediately
    mobileMenuDropdown.classList.toggle("active");
  });
}

// Mobile sidebar toggle - improved implementation
if (sidebarToggle) {
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to document
    sidebar.classList.toggle("expanded");
  });
}

// Close mobile menus when clicking outside
document.addEventListener("click", (e) => {
  // Close mobile dropdown menu if clicking outside
  if (
    mobileMenuDropdown &&
    mobileMenuDropdown.classList.contains("active") &&
    !e.target.closest("#mobile-menu-toggle") &&
    !e.target.closest("#mobile-menu-dropdown")
  ) {
    mobileMenuDropdown.classList.remove("active");
  }

  // Don't close the sidebar when clicking inside it
  if (
    window.innerWidth <= 900 &&
    sidebar.classList.contains("expanded") &&
    !e.target.closest("#sidebar") &&
    !e.target.closest("#sidebar-toggle")
  ) {
    sidebar.classList.remove("expanded");
  }
});

// Better touch handling for posters on mobile
function enableTouchScrolling() {
  const posterGrid = document.querySelector(".poster-grid");

  if (posterGrid && "ontouchstart" in window) {
    let startX, scrollLeft;

    posterGrid.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      scrollLeft = posterGrid.scrollLeft;
    });

    posterGrid.addEventListener("touchmove", (e) => {
      if (!startX) return;
      const x = e.touches[0].clientX;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      posterGrid.scrollLeft = scrollLeft - walk;
    });

    posterGrid.addEventListener("touchend", () => {
      startX = null;
    });
  }
}

// Show a message inside the poster picker modal
function showPosterModal(message) {
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const grid     = document.getElementById('poster-picker-grid');
  const tabsEl   = document.getElementById('poster-lang-tabs');
  if (tabsEl) tabsEl.innerHTML = '';
  if (grid)   grid.innerHTML   = `<p style="color:white; padding:1rem; text-align:center; width:100%;">${message}</p>`;
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Handle orientation changes and resize events
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    sidebar.classList.remove("expanded");
  }

  // Fix poster grid layout on orientation change
  const posterGrid = document.querySelector(".poster-grid");
  if (posterGrid && window.innerWidth <= 900) {
    posterGrid.style.maxWidth = "100%";
  }
});
function setupMobileMenu() {
  // Only add these listeners on mobile screens
  if (window.innerWidth <= 900) {
    // Get references to mobile elements
    const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileTabs = document.querySelectorAll(".mobile-menu-tab");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    // Override the sidebar toggle functionality on mobile
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        // Instead of expanding the sidebar, show our custom mobile menu
        mobileMenuOverlay.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling

        // Sync the current state of the UI with our mobile UI
        syncDesktopToMobileUI();
      });
    }

    // Close button functionality
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", () => {
        mobileMenuOverlay.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling

        // Apply any changes from mobile UI to the actual sidebar
        syncMobileToDesktopUI();
      });
    }

    // Tab switching
    mobileTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and content
        mobileTabs.forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".mobile-tab-content").forEach((c) => c.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        tab.classList.add("active");
        const tabId = tab.getAttribute("data-tab");
        document.getElementById(`mobile-tab-${tabId}`).classList.add("active");
      });
    });

    // Click outside to close
    mobileMenuOverlay.addEventListener("click", (e) => {
      if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.style.display = "none";
        document.body.style.overflow = "";
        syncMobileToDesktopUI();
      }
    });

    // Mobile action buttons
    const mobileDownloadBtn = document.getElementById("mobile-download-btn");
    if (mobileDownloadBtn) {
      // Replace the existing event listener with this improved version
      mobileDownloadBtn.addEventListener("click", () => {
        // Disable the button to prevent multiple clicks
        mobileDownloadBtn.disabled = true;
        mobileDownloadBtn.style.opacity = "0.7";
        mobileDownloadBtn.textContent = "Downloading...";

        // Trigger a single download
        document.getElementById("download-btn").click();

        // Hide the menu and restore the button after a short delay
        setTimeout(() => {
          mobileMenuOverlay.style.display = "none";
          document.body.style.overflow = "";

          // Reset the button
          setTimeout(() => {
            mobileDownloadBtn.disabled = false;
            mobileDownloadBtn.style.opacity = "1";
            mobileDownloadBtn.innerHTML =
              '<img src="../assets/poster-overlay-icons/download.svg" class="icon" style="margin-right: 8px;"> Download';
          }, 500);
        }, 1000);
      });
    }

    const mobileResetBtn = document.getElementById("mobile-reset-btn");
    if (mobileResetBtn) {
      mobileResetBtn.addEventListener("click", () => {
        document.getElementById("reset-btn").click();
        mobileMenuOverlay.style.display = "none";
        document.body.style.overflow = "";
      });
    }

    // Mobile search functionality - TMDB
    const mobileTMDBSearch = document.getElementById("mobile-tmdb-search");
    const mobileTMDBSuggestions = document.getElementById("mobile-tmdb-suggestions");

    if (mobileTMDBSearch) {
      // Clear the input value when the mobile menu is opened
      document.getElementById("sidebar-toggle").addEventListener("click", () => {
        mobileTMDBSearch.value = "";
        if (mobileTMDBSuggestions) {
          mobileTMDBSuggestions.style.display = "none";
        }
      });

      mobileTMDBSearch.addEventListener("input", () => {
        // Mirror input to desktop search
        document.getElementById("tmdb-search-input").value = mobileTMDBSearch.value;
        document.getElementById("tmdb-search-input").dispatchEvent(new Event("input"));

        // Show suggestions in mobile UI
        updateMobileTMDBSuggestions();
      });

      // Close suggestions when input loses focus
      mobileTMDBSearch.addEventListener("blur", () => {
        // Small delay to allow for clicking on suggestions
        setTimeout(() => {
          if (mobileTMDBSuggestions) {
            mobileTMDBSuggestions.style.display = "none";
          }
        }, 200);
      });
    }

    // Similar updates for Mediux search
    const mobileMediuxSearch = document.getElementById("mobile-mediux-search");
    const mobileMediuxSuggestions = document.getElementById("mobile-mediux-suggestions");

    if (mobileMediuxSearch) {
      // Clear the input value when the mobile menu is opened
      document.getElementById("sidebar-toggle").addEventListener("click", () => {
        mobileMediuxSearch.value = "";
        if (mobileMediuxSuggestions) {
          mobileMediuxSuggestions.style.display = "none";
        }
      });

      mobileMediuxSearch.addEventListener("input", () => {
        // Mirror input to desktop search
        document.getElementById("mediux-search-input").value = mobileMediuxSearch.value;
        document.getElementById("mediux-search-input").dispatchEvent(new Event("input"));

        // Show suggestions in mobile UI
        updateMobileMediuxSuggestions();
      });

      // Close suggestions when input loses focus
      mobileMediuxSearch.addEventListener("blur", () => {
        // Small delay to allow for clicking on suggestions
        setTimeout(() => {
          if (mobileMediuxSuggestions) {
            mobileMediuxSuggestions.style.display = "none";
          }
        }, 200);
      });
    }

    // Mobile network logo search
    const mobileNetworkSearch = document.getElementById("mobile-network-search");
    const mobileNetworkSuggestions = document.getElementById("mobile-network-suggestions");

    if (mobileNetworkSearch) {
      mobileNetworkSearch.addEventListener("input", () => {
        // Mirror input to desktop search
        document.getElementById("network-logo-search").value = mobileNetworkSearch.value;
        document.getElementById("network-logo-search").dispatchEvent(new Event("input"));

        // Show suggestions in mobile UI
        updateMobileNetworkSuggestions();
      });

      mobileNetworkSearch.addEventListener("focus", () => {
        if (mobileNetworkSearch.value.trim() === "") {
          const availableLogos = window.availableLogos || [];
          displayMobileLogoSuggestions(availableLogos);
        }
      });
    }

    // Mobile filter by username
    const mobileMediuxFilter = document.getElementById("mobile-mediux-filter");
    if (mobileMediuxFilter) {
      mobileMediuxFilter.addEventListener("input", () => {
        document.getElementById("mediux-username-filter").value = mobileMediuxFilter.value;
      });
    }

    // Mobile network logo checkbox
    const mobileNetworkCheckbox = document.getElementById("mobile-network-checkbox");
    if (mobileNetworkCheckbox) {
      mobileNetworkCheckbox.addEventListener("change", () => {
        document.getElementById("network-logo-checkbox").checked = mobileNetworkCheckbox.checked;
        document.getElementById("network-logo-checkbox").dispatchEvent(new Event("change"));
      });
    }

    // Mobile overlay select
    const mobileOverlaySelect = document.getElementById("mobile-overlay-select");
    if (mobileOverlaySelect) {
      mobileOverlaySelect.addEventListener("change", () => {
        document.getElementById("overlay-select").value = mobileOverlaySelect.value;
        document.getElementById("overlay-select").dispatchEvent(new Event("change"));
      });
    }

    // Mobile poster upload
    const mobilePosterUpload = document.getElementById("mobile-poster-upload");
    if (mobilePosterUpload) {
      mobilePosterUpload.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          // Create a new FileList with the same file
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(e.target.files[0]);

          // Set the file input value
          document.getElementById("poster-upload").files = dataTransfer.files;
          document.getElementById("poster-upload").dispatchEvent(new Event("change"));

          // Close the mobile menu
          mobileMenuOverlay.style.display = "none";
          document.body.style.overflow = "";
        }
      });
    }

    // Mobile media type buttons proper handling
    const mobileMediaTypeButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
    if (mobileMediaTypeButtons) {
      mobileMediaTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // First update mobile UI
          mobileMediaTypeButtons.forEach((btn) => {
            btn.classList.remove("active");
            // Force reset styles to ensure consistency
            btn.style.removeProperty("background");
            btn.style.removeProperty("opacity");
            btn.style.removeProperty("filter");
          });
          
          button.classList.add("active");
          
          // Explicitly set the gradient background and ensure opacity is 1
          button.style.background = "linear-gradient(to right, #00bfa5, #8e24aa)";
          button.style.opacity = "1";
          button.style.filter = "none";
          
          // Sync with desktop
          const type = button.dataset.type;
          const desktopButton = document.querySelector(`.sidebar .media-type-btn[data-type="${type}"]`);
          if (desktopButton && !desktopButton.classList.contains("active")) {
            desktopButton.click();
          }
        });
      });
    }

    // Initialize Pickr for mobile
    if (typeof Pickr !== "undefined" && document.getElementById("mobile-pickr")) {
      const mobilePicker = Pickr.create({
        el: document.getElementById("mobile-pickr"),
        theme: "monolith",
        default: "#ffffff",
        swatches: false,
        useAsButton: false,
        inline: false, 
        components: {
          preview: true,
          opacity: false,
          hue: true,
          interaction: {
            hex: true,
            input: true,
            save: true,
          },
        },
      });

      mobilePicker.on("change", (color) => {
        const hex = color.toHEXA().toString();
        document.getElementById("mobile-pickr").style.background = hex;

        // Sync to main pickr
        window.pickr.setColor(hex);
      });

      mobilePicker.on("save", (color) => {
        const hex = color.toHEXA().toString();
        document.getElementById("mobile-pickr").style.background = hex;

        window.pickr.setColor(hex);
        mobilePicker.hide();
      });
    }
  }
}

// Synchronize desktop UI state to mobile UI
function syncDesktopToMobileUI() {
  // Content Type
  const activeMediaType = document.querySelector(".sidebar .media-type-btn.active");
  if (activeMediaType) {
    const type = activeMediaType.dataset.type;
    document.querySelectorAll(".mobile-tab-content .media-type-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });
  }

  // TMDB Search
  document.getElementById("mobile-tmdb-search").value = document.getElementById("tmdb-search-input").value;

  // Mediux Search
  document.getElementById("mobile-mediux-search").value = document.getElementById("mediux-search-input").value;

  // Username filter
  document.getElementById("mobile-mediux-filter").value = document.getElementById("mediux-username-filter").value;

  // Overlay selection
  document.getElementById("mobile-overlay-select").value = document.getElementById("overlay-select").value;

  // Network logo
  document.getElementById("mobile-network-search").value = document.getElementById("network-logo-search").value;
  document.getElementById("mobile-network-checkbox").checked = document.getElementById("network-logo-checkbox").checked;

  // Logo color
  if (window.selectedLogoColor && document.getElementById("mobile-pickr")) {
    document.getElementById("mobile-pickr").style.background = window.selectedLogoColor;
  }
}

// Fix the file upload button
const mobileUploadBtn = document.getElementById("mobile-upload-btn");
const mobileFileInput = document.getElementById("mobile-poster-upload");
const mobileFileName = document.getElementById("mobile-file-name");

if (mobileUploadBtn && mobileFileInput && mobileFileName) {
  mobileUploadBtn.addEventListener("click", () => {
    mobileFileInput.click();
  });

  mobileFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      mobileFileName.textContent = e.target.files[0].name;

      // Create a new FileList and transfer to main input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(e.target.files[0]);
      document.getElementById("poster-upload").files = dataTransfer.files;
      document.getElementById("poster-upload").dispatchEvent(new Event("change"));

      // Close mobile menu after short delay
      setTimeout(() => {
        document.getElementById("mobile-menu-overlay").style.display = "none";
        document.body.style.overflow = "";
      }, 500);
    } else {
      mobileFileName.textContent = "No file chosen";
    }
  });
}
// Synchronize mobile UI state to desktop UI
function syncMobileToDesktopUI() {
  // Not needed for most items as they're synchronized in real-time
  // This function is mainly a placeholder for any cleanup or special cases
}

// Helper function to update TMDB suggestions in mobile UI
function updateMobileTMDBSuggestions() {
  const mobileSuggestions = document.getElementById("mobile-tmdb-suggestions");
  const desktopSuggestions = document.getElementById("tmdb-suggestions");

  if (mobileSuggestions && desktopSuggestions) {
    mobileSuggestions.innerHTML = ""; // Clear mobile suggestions

    const desktopItems = desktopSuggestions.querySelectorAll(".search-result-item");

    desktopItems.forEach((desktopItem) => {
      const clone = desktopItem.cloneNode(true);

      clone.addEventListener("click", () => {
        // Simulate selecting the original desktop item functionality
        desktopItem.click();

        // Clear search inputs
        document.getElementById("mobile-tmdb-search").value = "";
        document.getElementById("tmdb-search-input").value = "";

        // Hide suggestions and mobile overlay
        mobileSuggestions.style.display = "none";
        document.getElementById("mobile-menu-overlay").style.display = "none";
        document.body.style.overflow = "";
      });

      mobileSuggestions.appendChild(clone);
    });

    mobileSuggestions.style.display = desktopItems.length ? "block" : "none";
  }
}

// Helper function to update Mediux suggestions in mobile UI
function updateMobileMediuxSuggestions() {
  const mobileSuggestions = document.getElementById("mobile-mediux-suggestions");
  const desktopSuggestions = document.getElementById("mediux-suggestions");

  if (mobileSuggestions && desktopSuggestions) {
    mobileSuggestions.innerHTML = ""; // Clear mobile suggestions

    const desktopItems = desktopSuggestions.querySelectorAll(".search-result-item");

    desktopItems.forEach((desktopItem) => {
      const clone = desktopItem.cloneNode(true);

      clone.addEventListener("click", () => {
        // Simulate selecting the original desktop item functionality
        desktopItem.click();

        // Clear search inputs
        document.getElementById("mobile-mediux-search").value = "";
        document.getElementById("mediux-search-input").value = "";

        // Hide suggestions and mobile overlay
        mobileSuggestions.style.display = "none";
        document.getElementById("mobile-menu-overlay").style.display = "none";
        document.body.style.overflow = "";
      });

      mobileSuggestions.appendChild(clone);
    });

    mobileSuggestions.style.display = desktopItems.length ? "block" : "none";
  }
}

// Helper function to display logo suggestions in mobile UI
function displayMobileLogoSuggestions(logos) {
  const mobileNetworkSuggestions = document.getElementById("mobile-network-suggestions");
  if (!mobileNetworkSuggestions) return;

  mobileNetworkSuggestions.innerHTML = "";

  if (logos.length === 0) {
    mobileNetworkSuggestions.innerHTML = '<div class="suggestion-item">No logos found</div>';
    return;
  }

  logos.forEach((logo) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    const logoImg = document.createElement("img");
    logoImg.src = logo.path;
    logoImg.alt = logo.name;
    logoImg.className = "logo-preview-img";
    logoImg.style.maxWidth = "120px";
    logoImg.style.maxHeight = "30px";
    logoImg.style.width = "auto";
    logoImg.style.height = "auto";
    logoImg.style.display = "block";

    logoImg.onerror = () => {
      logoImg.style.display = "none";
      const fallbackText = document.createElement("div");
      fallbackText.textContent = logo.name;
      fallbackText.style.textAlign = "center";
      fallbackText.style.color = "white";
      fallbackText.style.fontSize = "0.9rem";
      div.appendChild(fallbackText);
    };

    div.appendChild(logoImg);

    div.addEventListener("click", () => {
      document.getElementById("network-logo-search").value = logo.name;
      document.getElementById("network-logo-search").dispatchEvent(new Event("input"));
      document.getElementById("mobile-network-search").value = logo.name;
      mobileNetworkSuggestions.style.display = "none";

      document.getElementById("network-logo-checkbox").checked = true;
      document.getElementById("mobile-network-checkbox").checked = true;
      document.getElementById("network-logo-checkbox").dispatchEvent(new Event("change"));
    });

    mobileNetworkSuggestions.appendChild(div);
  });

  mobileNetworkSuggestions.style.display = "block";
}

// Helper function to update Network logo suggestions in mobile UI
function updateMobileNetworkSuggestions() {
  const mobileSuggestions = document.getElementById("mobile-network-suggestions");
  const desktopSuggestions = document.getElementById("network-logo-suggestions");

  if (mobileSuggestions && desktopSuggestions) {
    // Clone the desktop suggestions to mobile
    mobileSuggestions.innerHTML = desktopSuggestions.innerHTML;

    // Add click handlers to the mobile suggestion items
    const suggestionItems = mobileSuggestions.querySelectorAll(".suggestion-item");
    suggestionItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        // Trigger click on corresponding desktop suggestion
        const desktopItems = desktopSuggestions.querySelectorAll(".suggestion-item");
        if (desktopItems[index]) {
          desktopItems[index].click();
        }

        // Clear the search input
        document.getElementById("mobile-network-search").value = "";
        document.getElementById("network-logo-search").value = "";
        mobileSuggestions.style.display = "none";

        // Close the mobile menu
        document.getElementById("mobile-menu-overlay").style.display = "none";
        document.body.style.overflow = "";
      });
    });

    if (desktopSuggestions.innerHTML.trim()) {
      mobileSuggestions.style.display = "block";
    } else {
      mobileSuggestions.style.display = "none";
    }
  }
}

const mobilePickrElement = document.getElementById("mobile-pickr");
const mobilePickr = Pickr.create({
  el: mobilePickrElement,
  theme: "monolith",
  position: "right-middle",
  padding: 40,
  default: "#ffffff",
  components: {
    preview: true,
    opacity: false,
    hue: true,
    interaction: {
      hex: true,
      input: true,
      save: true,
    },
  },
});

// Optional: handle color changes if you want
mobilePickr.on("change", (color) => {
  const hex = color.toHEXA().toString();
  mobilePickrElement.style.background = hex;
  selectedLogoColor = hex; // update your selected color
  if (networkLogoImage && baseImage) {
    drawCanvas();
  }
});

mobilePickr.on("save", (color) => {
  const hex = color.toHEXA().toString();
  mobilePickrElement.style.background = hex;
  selectedLogoColor = hex;
  if (networkLogoImage && baseImage) {
    drawCanvas();
  }
  mobilePickr.hide();
});

// Initialize mobile menu when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();

  // Initialize the canvas action buttons
  const mobileCanvasDownloadBtn = document.getElementById("mobile-canvas-download-btn");
  const mobileCanvasResetBtn = document.getElementById("mobile-canvas-reset-btn");

  if (mobileCanvasDownloadBtn) {
    mobileCanvasDownloadBtn.addEventListener("click", () => {
      // Disable the button to prevent multiple clicks
      mobileCanvasDownloadBtn.disabled = true;
      mobileCanvasDownloadBtn.style.opacity = "0.7";
      mobileCanvasDownloadBtn.textContent = "Downloading...";

      // Trigger a single download
      document.getElementById("download-btn").click();

      // Reset the button after a short delay
      setTimeout(() => {
        mobileCanvasDownloadBtn.disabled = false;
        mobileCanvasDownloadBtn.style.opacity = "1";
        mobileCanvasDownloadBtn.innerHTML =
          '<img src="../assets/poster-overlay-icons/download.svg" class="icon"> Download';
      }, 1500);
    });
  }

  if (mobileCanvasResetBtn) {
    mobileCanvasResetBtn.addEventListener("click", () => {
      document.getElementById("reset-btn").click();
    });
  }
});
// Re-initialize on resize (for devices that can switch between mobile/desktop)
window.addEventListener("resize", () => {
  if (window.innerWidth <= 900) {
    setupMobileMenu();
  } else {
    // If we're on desktop, make sure the mobile menu is hidden
    const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    if (mobileMenuOverlay) {
      mobileMenuOverlay.style.display = "none";
    }
    document.body.style.overflow = "";
  }
});
document.addEventListener("click", (e) => {
  // Already existing code for TMDB suggestions
  if (!e.target.closest(".tmdb-search")) {
    suggestionsBox.innerHTML = "";
  }
  
  // New code to handle Mediux suggestions
  if (!e.target.closest(".mediux-search")) {
    mediuxSuggestions.innerHTML = "";
  }
});

// Also add this to the mobile version
document.addEventListener("click", (e) => {
  const mobileMediuxSuggestions = document.getElementById("mobile-mediux-suggestions");
  if (mobileMediuxSuggestions && !e.target.closest("#mobile-mediux-search")) {
    mobileMediuxSuggestions.style.display = "none";
  }
});
// Initialize collapsible sections
document.addEventListener('DOMContentLoaded', function() {
  const collapsibleSections = document.querySelectorAll('.collapsible-section');
  
  collapsibleSections.forEach(section => {
    const header = section.querySelector('.collapsible-header');
    const content = section.querySelector('.collapsible-content');
    
    // Add click event to toggle collapse
    header.addEventListener('click', () => {
      const isCollapsed = section.classList.toggle('collapsed');
      
      if (isCollapsed) {
        content.style.maxHeight = '0';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
    
    // Set initial state (expanded)
    content.style.maxHeight = content.scrollHeight + 'px';
  });
});

document.getElementById("mobile-poster-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    document.getElementById("mobile-file-name").textContent = file.name;
    
    // Trigger the main poster upload to keep functionality in sync
    const mainPosterUpload = document.getElementById("poster-upload");
    
    // Create a new FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Set the files on the main upload input
    mainPosterUpload.files = dataTransfer.files;
    
    // Trigger change event on the main upload input
    mainPosterUpload.dispatchEvent(new Event('change'));
    
    // Close the mobile menu after file selection
    document.getElementById("mobile-menu-overlay").style.display = "none";
  }
});

// Fix mobile content type buttons by directly manipulating DOM properties
function fixMobileContentTypeButtons() {
  const mobileMediaTypeButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
  
  if (mobileMediaTypeButtons) {
    mobileMediaTypeButtons.forEach((button) => {
      // Remove any existing click handlers
      button.removeEventListener("click", handleMobileTypeButtonClick);
      // Add our new click handler
      button.addEventListener("click", handleMobileTypeButtonClick);
    });
  }
}

function handleMobileTypeButtonClick(event) {
  const clickedButton = event.currentTarget;
  const mobileMediaTypeButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
  
  // Remove active class and reset styles for all buttons
  mobileMediaTypeButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.style.background = "transparent";
    btn.style.opacity = "0.6";
    btn.style.filter = "grayscale(50%)";
  });
  
  // Set active class and styles for clicked button
  clickedButton.classList.add("active");
  clickedButton.style.background = "linear-gradient(to right, #00bfa5, #8e24aa)";
  clickedButton.style.opacity = "1";
  clickedButton.style.filter = "none";
  
  // Sync with desktop selection
  const type = clickedButton.dataset.type;
  const desktopButton = document.querySelector(`.sidebar .media-type-btn[data-type="${type}"]`);
  if (desktopButton) {
    desktopButton.click();
  }
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fixMobileContentTypeButtons();
});

// Initialize the mobile menu content type buttons when displayed
function initMobileContentTypeButtons() {
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const mobileMenuToggle = document.getElementById("sidebar-toggle");
  
  if (mobileMenuToggle && mobileMenuOverlay) {
    // Add event listener to sidebar toggle to initialize buttons
    mobileMenuToggle.addEventListener("click", () => {
      // Find the currently active content type in the desktop UI
      const desktopActiveButton = document.querySelector(".sidebar .media-type-btn.active");
      const activeType = desktopActiveButton ? desktopActiveButton.dataset.type : "movie";
      
      // Set up the mobile buttons based on the desktop active state
      const mobileButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
      mobileButtons.forEach(btn => {
        // Clear any inline styles that might be causing issues
        btn.style.removeProperty("background");
        btn.style.removeProperty("opacity");
        btn.style.removeProperty("filter");
        
        if (btn.dataset.type === activeType) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    });
  }
}

// Listen for mobile type button clicks with a delegated event handler
document.addEventListener("click", (e) => {
  const button = e.target.closest(".mobile-tab-content .media-type-btn");
  if (button) {
    const mobileButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
    
    // Remove active class from all buttons
    mobileButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    
    // Add active class to clicked button
    button.classList.add("active");
    
    // Sync with desktop buttons
    const type = button.dataset.type;
    const desktopButton = document.querySelector(`.sidebar .media-type-btn[data-type="${type}"]`);
    if (desktopButton && !desktopButton.classList.contains("active")) {
      desktopButton.click();
    }
  }
});

// Call on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  initMobileContentTypeButtons();
});

// =====================================================
// POSTER DESIGNER
// =====================================================

function showToast(message, duration = 2800) {
  let el = document.getElementById('toast-notification');
  if (!el) return;
  el.textContent = message;
  el.classList.add('toast-visible');
  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(() => el.classList.remove('toast-visible'), duration);
}

// ── Fanart.tv API key ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const fanartKeyInput   = document.getElementById('fanart-api-key');
  const fanartSaveBtn    = document.getElementById('fanart-save-key-btn');
  const fanartConnected  = document.getElementById('fanart-connected-row');
  const fanartForm       = document.getElementById('fanart-expanded-form');
  const fanartChangeBtn  = document.getElementById('fanart-change-btn');

  function setFanartState(hasKey) {
    if (fanartConnected) fanartConnected.style.display = hasKey ? 'flex' : 'none';
    if (fanartForm)      fanartForm.style.display      = hasKey ? 'none' : 'block';
  }

  // Init: pre-fill if key exists and set correct state
  if (fanartKeyInput && fanartApiKey) fanartKeyInput.value = fanartApiKey;
  setFanartState(!!fanartApiKey);

  // "Change" re-expands the form
  if (fanartChangeBtn) {
    fanartChangeBtn.addEventListener('click', () => {
      setFanartState(false);
      if (fanartKeyInput) fanartKeyInput.focus();
    });
  }

  if (fanartSaveBtn) {
    fanartSaveBtn.addEventListener('click', () => {
      const newKey = fanartKeyInput ? fanartKeyInput.value.trim() : '';
      fanartApiKey = newKey;
      localStorage.setItem('postertools_fanart_key', fanartApiKey);
      setFanartState(!!fanartApiKey);
      if (!fanartApiKey) {
        showToast('Fanart.tv key cleared');
        return;
      }
      if (currentDesignerId) {
        showToast('Key saved — refreshing logos…');
        fetchAndDisplayClearlogos(currentDesignerId, currentDesignerType);
        openLogoPicker();
      } else {
        showToast('Fanart.tv key saved – pick a poster to load logos');
      }
    });
  }

  // ── Logo picker modal open/close ─────────────────────────
  const openLogoPickerBtn  = document.getElementById('open-logo-picker-btn');
  const closeLogoPickerBtn = document.getElementById('close-logo-picker');
  const logoPickerBackdrop = document.getElementById('logo-picker-backdrop');
  if (openLogoPickerBtn)  openLogoPickerBtn.addEventListener('click', openLogoPicker);
  if (closeLogoPickerBtn) closeLogoPickerBtn.addEventListener('click', closeLogoPicker);
  if (logoPickerBackdrop) logoPickerBackdrop.addEventListener('click', closeLogoPicker);
  const logoPickerModal = document.getElementById('logo-picker-modal');

  // ── Poster picker modal open/close ──────────────────────
  const browsePosterBtn      = document.getElementById('browse-posters-btn');
  const closePosterPickerBtn = document.getElementById('close-poster-picker');
  const posterPickerBackdrop = document.getElementById('poster-picker-backdrop');
  if (browsePosterBtn)      browsePosterBtn.addEventListener('click', openPosterPicker);
  if (closePosterPickerBtn) closePosterPickerBtn.addEventListener('click', closePosterPicker);
  if (posterPickerBackdrop) posterPickerBackdrop.addEventListener('click', closePosterPicker);

  const refreshLogosBtn = document.getElementById('refresh-logos-btn');
  if (refreshLogosBtn) {
    refreshLogosBtn.addEventListener('click', () => {
      if (currentDesignerId) {
        fetchAndDisplayClearlogos(currentDesignerId, currentDesignerType);
      } else {
        showToast('Search for a title first');
      }
    });
  }

  // ── Slider controls ──────────────────────────────────────
  function wireSlider(id, displayId, onInput) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const v = onInput(el.value);
      const disp = document.getElementById(displayId);
      if (disp) disp.textContent = v;
      if (designerLogoImage && baseImage) drawCanvas();
      deferredThumbUpdate();
    });
  }

  wireSlider('designer-logo-x', 'designer-x-display', v => { designerLogoX = parseInt(v); return v; });
  wireSlider('designer-logo-y', 'designer-y-display', v => { designerLogoY = parseInt(v); return v; });
  wireSlider('designer-logo-scale', 'designer-scale-display', v => {
    designerLogoScale = parseFloat(v);
    return Math.round(designerLogoScale * 100) + '%';
  });
  wireSlider('designer-shadow-blur', 'designer-shadow-blur-display', v => {
    designerShadowBlur = parseInt(v);
    return v + 'px';
  });

  // Step −/+ buttons for Title Logo sliders
  function wireStepBtn(sliderId, dir) {
    const btn = document.getElementById(sliderId + (dir > 0 ? '-inc' : '-dec'));
    const slider = document.getElementById(sliderId);
    if (!btn || !slider) return;
    btn.addEventListener('click', () => {
      const step = parseFloat(slider.step) || 1;
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const newVal = Math.min(max, Math.max(min, parseFloat(slider.value) + dir * step));
      slider.value = newVal;
      slider.dispatchEvent(new Event('input'));
    });
  }
  ['designer-logo-x', 'designer-logo-y', 'designer-logo-scale', 'designer-shadow-blur', 'logo-scale-slider',
   'gradient-opacity', 'gradient-height'].forEach(id => {
    wireStepBtn(id, -1);
    wireStepBtn(id,  1);
  });

  // ── Poster Fit controls ───────────────────────────────────
  function updatePosterFitControls() {
    const panel = document.getElementById('poster-fit-controls');
    if (panel) panel.style.display = (posterFitMode === 'stretch') ? 'none' : 'block';
  }

  const posterFitModeSelect = document.getElementById('poster-fit-mode');
  if (posterFitModeSelect) {
    posterFitModeSelect.addEventListener('change', () => {
      posterFitMode = posterFitModeSelect.value;
      setPosterFitSettings(getCurrentPosterKey(), { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
      updatePosterFitControls();
      if (baseImage) { drawCanvas(); deferredThumbUpdate(); }
    });
  }

  function wirePosterSlider(sliderId, displayId, onInput) {
    const el = document.getElementById(sliderId);
    if (!el) return;
    el.addEventListener('input', () => {
      const v = onInput(el.value);
      const disp = document.getElementById(displayId);
      if (disp) disp.textContent = v;
      if (baseImage) { drawCanvas(); deferredThumbUpdate(); }
    });
  }

  wirePosterSlider('poster-scale', 'poster-scale-display', v => {
    posterScale = parseFloat(v);
    setPosterFitSettings(getCurrentPosterKey(), { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
    return Math.round(posterScale * 100) + '%';
  });
  wirePosterSlider('poster-offset-x', 'poster-offset-x-display', v => {
    posterOffsetX = parseInt(v);
    setPosterFitSettings(getCurrentPosterKey(), { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
    return v;
  });
  wirePosterSlider('poster-offset-y', 'poster-offset-y-display', v => {
    posterOffsetY = parseInt(v);
    setPosterFitSettings(getCurrentPosterKey(), { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
    return v;
  });

  ['poster-scale', 'poster-offset-x', 'poster-offset-y'].forEach(id => {
    wireStepBtn(id, -1);
    wireStepBtn(id,  1);
  });

  const posterFitResetBtn = document.getElementById('poster-fit-reset-btn');
  if (posterFitResetBtn) {
    posterFitResetBtn.addEventListener('click', () => {
      posterScale = 1.0;
      posterOffsetX = 0;
      posterOffsetY = 0;
      setPosterFitSettings(getCurrentPosterKey(), { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY });
      const scaleEl = document.getElementById('poster-scale');
      const oxEl    = document.getElementById('poster-offset-x');
      const oyEl    = document.getElementById('poster-offset-y');
      if (scaleEl) { scaleEl.value = 1; document.getElementById('poster-scale-display').textContent = '100%'; }
      if (oxEl)    { oxEl.value = 0;    document.getElementById('poster-offset-x-display').textContent = '0'; }
      if (oyEl)    { oyEl.value = 0;    document.getElementById('poster-offset-y-display').textContent = '0'; }
      if (baseImage) { drawCanvas(); deferredThumbUpdate(); }
    });
  }

  // Season Label step buttons (wired after controls are added to DOM via HTML)
  ['season-label-y', 'season-label-size', 'season-label-spacing'].forEach(id => {
    wireStepBtn(id, -1);
    wireStepBtn(id,  1);
  });

  // Season Label font select
  const seasonLabelFontSelect = document.getElementById('season-label-font');
  if (seasonLabelFontSelect) {
    seasonLabelFontSelect.addEventListener('change', () => {
      seasonLabelFont = seasonLabelFontSelect.value;
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    });
  }

  // Season Label letter-spacing slider
  const seasonLabelSpacingSlider = document.getElementById('season-label-spacing');
  const seasonLabelSpacingVal    = document.getElementById('season-label-spacing-val');
  if (seasonLabelSpacingSlider) {
    seasonLabelSpacingSlider.addEventListener('input', () => {
      seasonLabelSpacing = parseFloat(seasonLabelSpacingSlider.value);
      if (seasonLabelSpacingVal) seasonLabelSpacingVal.textContent = seasonLabelSpacing + 'px';
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    });
  }

  // Season Label toggle
  const seasonLabelToggle = document.getElementById('season-label-toggle');
  if (seasonLabelToggle) {
    seasonLabelToggle.addEventListener('change', () => {
      seasonLabelEnabled = seasonLabelToggle.checked;
      drawCanvas();
      deferredThumbUpdate();
    });
  }

  // Season Label text input
  const seasonLabelTextInput = document.getElementById('season-label-text');
  if (seasonLabelTextInput) {
    seasonLabelTextInput.addEventListener('input', () => {
      seasonLabelText = seasonLabelTextInput.value;
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    });
  }

  // Season Label vertical position slider
  const seasonLabelYSlider = document.getElementById('season-label-y');
  const seasonLabelYVal    = document.getElementById('season-label-y-val');
  if (seasonLabelYSlider) {
    seasonLabelYSlider.addEventListener('input', () => {
      seasonLabelYPct = parseFloat(seasonLabelYSlider.value);
      if (seasonLabelYVal) seasonLabelYVal.textContent = seasonLabelYPct + '%';
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    });
  }

  // Season Label font size slider
  const seasonLabelSizeSlider = document.getElementById('season-label-size');
  const seasonLabelSizeVal    = document.getElementById('season-label-size-val');
  if (seasonLabelSizeSlider) {
    seasonLabelSizeSlider.addEventListener('input', () => {
      seasonLabelFontSize = parseFloat(seasonLabelSizeSlider.value);
      if (seasonLabelSizeVal) seasonLabelSizeVal.textContent = seasonLabelFontSize + 'px';
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    });
  }

  // ── Color Pickers (Pickr) ────────────────────────────────────────────────
  const _pickrOpts = {
    theme: 'monolith',
    position: 'right-middle',
    padding: 48,
    components: {
      preview: true, opacity: false, hue: true,
      interaction: { hex: true, input: true, save: true }
    }
  };

  const _nlPickrEl = document.getElementById('network-logo-color-pickr');
  if (_nlPickrEl) {
    networkLogoColorPickr = Pickr.create({ el: _nlPickrEl, default: selectedLogoColor, ..._pickrOpts });
    networkLogoColorPickr.on('change', color => {
      selectedLogoColor = color.toHEXA().toString();
      if (networkLogoImage && baseImage) drawCanvas();
      deferredThumbUpdate();
    }).on('save', (c, p) => p.hide());
  }

  const _slPickrEl = document.getElementById('season-label-color-pickr');
  if (_slPickrEl) {
    seasonLabelColorPickr = Pickr.create({ el: _slPickrEl, default: seasonLabelColor, ..._pickrOpts });
    seasonLabelColorPickr.on('change', color => {
      seasonLabelColor = color.toHEXA().toString();
      if (seasonLabelEnabled) drawCanvas();
      deferredThumbUpdate();
    }).on('save', (c, p) => p.hide());
  }

  // ── Bottom Gradient controls ──────────────────────────────────────────────
  const gradientToggle = document.getElementById('gradient-toggle');
  if (gradientToggle) {
    gradientToggle.addEventListener('change', () => {
      gradientEnabled = gradientToggle.checked;
      const gp = document.getElementById('gradient-controls-panel');
      if (gp) gp.style.display = gradientEnabled ? 'block' : 'none';
      if (baseImage) drawCanvas();
    });
  }
  const gradientOpacitySlider = document.getElementById('gradient-opacity');
  const gradientOpacityVal    = document.getElementById('gradient-opacity-val');
  if (gradientOpacitySlider) {
    gradientOpacitySlider.addEventListener('input', () => {
      gradientOpacity = parseInt(gradientOpacitySlider.value) / 100;
      if (gradientOpacityVal) gradientOpacityVal.textContent = gradientOpacitySlider.value + '%';
      if (gradientEnabled && baseImage) drawCanvas();
    });
  }
  const gradientHeightSlider = document.getElementById('gradient-height');
  const gradientHeightVal    = document.getElementById('gradient-height-val');
  if (gradientHeightSlider) {
    gradientHeightSlider.addEventListener('input', () => {
      gradientHeight = parseInt(gradientHeightSlider.value);
      if (gradientHeightVal) gradientHeightVal.textContent = gradientHeightSlider.value + '%';
      if (gradientEnabled && baseImage) drawCanvas();
    });
  }
  const _gcPickrEl = document.getElementById('gradient-color-pickr');
  if (_gcPickrEl) {
    gradientColorPickr = Pickr.create({ el: _gcPickrEl, default: gradientColor, ..._pickrOpts });
    gradientColorPickr.on('change', color => {
      gradientColor = color.toHEXA().toString();
      if (gradientEnabled && baseImage) drawCanvas();
    }).on('save', (c, p) => p.hide());
  }

  // ── Designer logo tint color ──────────────────────────────────────────────
  const _dlPickrEl = document.getElementById('designer-logo-color-pickr');
  if (_dlPickrEl) {
    designerLogoColorPickr = Pickr.create({ el: _dlPickrEl, default: designerLogoColor, ..._pickrOpts });
    designerLogoColorPickr.on('change', color => {
      designerLogoColor = color.toHEXA().toString();
      if (designerLogoImage) { drawCanvas(); deferredThumbUpdate(); }
    }).on('save', (c, p) => p.hide());
  }

  const shadowToggle = document.getElementById('designer-shadow-toggle');
  if (shadowToggle) {
    shadowToggle.addEventListener('change', () => {
      designerShadowEnabled = shadowToggle.checked;
      const sg = document.getElementById('designer-shadow-group');
      if (sg) sg.style.display = designerShadowEnabled ? 'block' : 'none';
      if (designerLogoImage && baseImage) drawCanvas();
      deferredThumbUpdate();
    });
  }

  const resetBtn = document.getElementById('designer-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      designerLogoX = 0; designerLogoY = 55; designerLogoScale = 1;
      const _rx = document.getElementById('designer-logo-x'); if (_rx) _rx.value = '0';
      const _ry = document.getElementById('designer-logo-y'); if (_ry) _ry.value = '55';
      const sc = document.getElementById('designer-logo-scale'); if (sc) sc.value = '1';
      const _xd = document.getElementById('designer-x-display'); if (_xd) _xd.textContent = '0';
      const _yd = document.getElementById('designer-y-display'); if (_yd) _yd.textContent = '55';
      const sd = document.getElementById('designer-scale-display'); if (sd) sd.textContent = '100%';
      drawCanvas();
      deferredThumbUpdate();
    });
  }

  // ── Guidelines toggle ────────────────────────────────────
  const guidelinesToggleEl = document.getElementById('guidelines-toggle');
  if (guidelinesToggleEl) {
    guidelinesToggleEl.checked = guidelinesEnabled;
    guidelinesToggleEl.addEventListener('change', () => {
      guidelinesEnabled = guidelinesToggleEl.checked;
      if (!baseImage) {
        if (guidelinesEnabled && guidelinesImage.complete) drawGuidelinesBackdrop();
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        drawCanvas();
      }
    });
  }

  // ── Manual logo search ───────────────────────────────────
  const designerSearchInput = document.getElementById('designer-logo-search-input');
  const designerSuggestions = document.getElementById('designer-logo-suggestions');
  if (designerSearchInput) {
    let _dt;
    designerSearchInput.addEventListener('input', () => {
      clearTimeout(_dt);
      const q = designerSearchInput.value.trim();
      if (!q) { if (designerSuggestions) designerSuggestions.innerHTML = ''; return; }
      _dt = setTimeout(() => searchDesignerTitle(q), 420);
    });
    designerSearchInput.addEventListener('blur', () => {
      setTimeout(() => { if (designerSuggestions) designerSuggestions.innerHTML = ''; }, 220);
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#designer-logo-search-input') && !e.target.closest('#designer-logo-suggestions') && designerSuggestions)
        designerSuggestions.innerHTML = '';
    });
  }

  // ── Canvas drag-to-reposition ────────────────────────────
  canvas.addEventListener('mousedown', onCanvasMouseDown);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mouseup',   onCanvasMouseUp);
  canvas.addEventListener('mouseleave', onCanvasMouseUp);
  canvas.addEventListener('touchstart', onCanvasTouchStart, { passive: false });
  canvas.addEventListener('touchmove',  onCanvasTouchMove,  { passive: false });
  canvas.addEventListener('touchend',   onCanvasMouseUp);
});

function getCanvasPoint(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width  / rect.width),
    y: (clientY - rect.top)  * (canvas.height / rect.height),
  };
}

function drawDesignerLogoLayer() {
  if (!designerLogoImage || !designerLogoImage.complete || !designerLogoImage.naturalWidth) return;
  const maxW = Math.min(canvas.width * 0.70, 680) * designerLogoScale;
  const maxH = canvas.height * 0.14 * designerLogoScale;
  const ratio = designerLogoImage.naturalWidth / designerLogoImage.naturalHeight;
  let lw, lh;
  if (ratio > maxW / maxH) { lw = maxW; lh = lw / ratio; }
  else                     { lh = maxH; lw = lh * ratio; }
  const cx = canvas.width  / 2 + designerLogoX;
  const cy = canvas.height * 0.78 + designerLogoY;
  ctx.save();
  if (designerShadowEnabled) {
    ctx.shadowColor    = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur     = designerShadowBlur;
    ctx.shadowOffsetX  = 0;
    ctx.shadowOffsetY  = 3;
  }
  if (designerLogoColor && designerLogoColor.toLowerCase() !== '#ffffff') {
    const tinted = applyLogoTint(designerLogoImage, lw, lh, designerLogoColor);
    ctx.drawImage(tinted, cx - lw / 2, cy - lh / 2, lw, lh);
  } else {
    ctx.drawImage(designerLogoImage, cx - lw / 2, cy - lh / 2, lw, lh);
  }
  ctx.restore();
}

function getDesignerLogoBounds() {
  if (!designerLogoImage || !designerLogoImage.complete || !designerLogoImage.naturalWidth) return null;
  const maxW = Math.min(canvas.width * 0.70, 680) * designerLogoScale;
  const maxH = canvas.height * 0.14 * designerLogoScale;
  const ratio = designerLogoImage.naturalWidth / designerLogoImage.naturalHeight;
  let lw, lh;
  if (ratio > maxW / maxH) { lw = maxW; lh = lw / ratio; }
  else                     { lh = maxH; lw = lh * ratio; }
  const cx = canvas.width  / 2 + designerLogoX;
  const cy = canvas.height * 0.78 + designerLogoY;
  return { x: cx - lw / 2, y: cy - lh / 2, width: lw, height: lh };
}

function onCanvasMouseDown(e) {
  if (!designerLogoImage || !baseImage) return;
  const pt = getCanvasPoint(e.clientX, e.clientY);
  const b  = getDesignerLogoBounds();
  if (!b) return;
  const pad = 24;
  if (pt.x >= b.x - pad && pt.x <= b.x + b.width + pad &&
      pt.y >= b.y - pad && pt.y <= b.y + b.height + pad) {
    isDraggingLogo = true;
    dragStartMouseX = pt.x; dragStartMouseY = pt.y;
    dragStartLogoX  = designerLogoX; dragStartLogoY = designerLogoY;
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  }
}

function onCanvasMouseMove(e) {
  if (!designerLogoImage || !baseImage) return;
  if (isDraggingLogo) {
    const pt = getCanvasPoint(e.clientX, e.clientY);
    designerLogoX = Math.round(dragStartLogoX + (pt.x - dragStartMouseX));
    designerLogoY = Math.round(dragStartLogoY + (pt.y - dragStartMouseY));
    _syncDesignerSliders();
    drawCanvas();
    e.preventDefault();
  } else {
    const pt = getCanvasPoint(e.clientX, e.clientY);
    const b  = getDesignerLogoBounds();
    if (b) {
      const pad = 24;
      canvas.style.cursor = (pt.x >= b.x - pad && pt.x <= b.x + b.width + pad &&
                              pt.y >= b.y - pad && pt.y <= b.y + b.height + pad) ? 'grab' : '';
    } else {
      canvas.style.cursor = '';
    }
  }
}

function onCanvasMouseUp() {
  if (isDraggingLogo) { isDraggingLogo = false; canvas.style.cursor = ''; }
}

function onCanvasTouchStart(e) {
  if (!designerLogoImage || !baseImage || e.touches.length !== 1) return;
  const t = e.touches[0];
  const pt = getCanvasPoint(t.clientX, t.clientY);
  const b  = getDesignerLogoBounds();
  if (!b) return;
  const pad = 36;
  if (pt.x >= b.x - pad && pt.x <= b.x + b.width + pad &&
      pt.y >= b.y - pad && pt.y <= b.y + b.height + pad) {
    isDraggingLogo = true;
    dragStartMouseX = pt.x; dragStartMouseY = pt.y;
    dragStartLogoX  = designerLogoX; dragStartLogoY = designerLogoY;
    e.preventDefault();
  }
}

function onCanvasTouchMove(e) {
  if (!isDraggingLogo || e.touches.length !== 1) return;
  const t  = e.touches[0];
  const pt = getCanvasPoint(t.clientX, t.clientY);
  designerLogoX = Math.round(dragStartLogoX + (pt.x - dragStartMouseX));
  designerLogoY = Math.round(dragStartLogoY + (pt.y - dragStartMouseY));
  _syncDesignerSliders();
  drawCanvas();
  e.preventDefault();
}

function _syncDesignerSliders() {
  const xEl = document.getElementById('designer-logo-x');
  const yEl = document.getElementById('designer-logo-y');
  const xDp = document.getElementById('designer-x-display');
  const yDp = document.getElementById('designer-y-display');
  if (xEl) xEl.value = Math.max(-480, Math.min(480, designerLogoX));
  if (yEl) yEl.value = Math.max(-650, Math.min(650, designerLogoY));
  if (xDp) xDp.textContent = designerLogoX;
  if (yDp) yDp.textContent = designerLogoY;
}

// ── Logo fetch functions ──────────────────────────────────
async function fetchTMDBLogos(tmdbId, mediaType) {
  try {
    const res  = await fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}/images?include_image_language=en,null&api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return (data.logos || [])
      .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      .map(l => ({
        thumbUrl: `https://image.tmdb.org/t/p/w300${l.file_path}`,
        fullUrl:  `https://image.tmdb.org/t/p/original${l.file_path}`,
        source: 'TMDB',
        lang: l.iso_639_1 || '—',
      }));
  } catch { return []; }
}

async function fetchFanartMovieLogos(tmdbId) {
  if (!fanartApiKey) return [];
  const apiUrl = `https://webservice.fanart.tv/v3/movies/${tmdbId}?api_key=${fanartApiKey}`;
  const data = await fetchJsonViaProxy(apiUrl, { skipDirect: true });
  if (!data) return [];
  if (data.status === 'error' || data['error message']) {
    console.warn('[Fanart.tv] API error:', data['error message'] || data.status);
    return [];
  }
  const logos = [];
  for (const arr of [data.hdmovieclearlogo, data.movielogo]) {
    (arr || []).forEach(l => logos.push({
      thumbUrl: `https://images.weserv.nl/?url=${l.url.replace('/fanart/', '/preview/').replace(/^https?:\/\//, '')}`,
      fullUrl:  `https://images.weserv.nl/?url=${l.url.replace(/^https?:\/\//, '')}`,
      source:   'Fanart.tv'
    }));
  }
  return logos;
}

async function fetchFanartTVLogos(tmdbId) {
  if (!fanartApiKey) return [];
  try {
    const extRes  = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`);
    const extData = await extRes.json();
    if (!extData.tvdb_id) { console.warn('[Fanart.tv] No TVDB id for TMDB id', tmdbId); return []; }
    const apiUrl = `https://webservice.fanart.tv/v3/tv/${extData.tvdb_id}?api_key=${fanartApiKey}`;
    const data = await fetchJsonViaProxy(apiUrl, { skipDirect: true });
    if (!data) return [];
    if (data.status === 'error' || data['error message']) {
      console.warn('[Fanart.tv] API error:', data['error message'] || data.status);
      return [];
    }
    const logos = [];
    for (const arr of [data.hdtvlogo, data.clearlogo]) {
      (arr || []).forEach(l => logos.push({
        thumbUrl: `https://images.weserv.nl/?url=${l.url.replace('/fanart/', '/preview/').replace(/^https?:\/\//, '')}`,
        fullUrl:  `https://images.weserv.nl/?url=${l.url.replace(/^https?:\/\//, '')}`,
        source:   'Fanart.tv'
      }));
    }
    return logos;
  } catch (e) { console.warn('[Fanart.tv TV] Error:', e); return []; }
}

// Fetch JSON through a chain of CORS proxies, returning parsed object or null.
// Pass { skipDirect: true } for endpoints known to block CORS (e.g. Fanart.tv).
async function fetchJsonViaProxy(url, { skipDirect = false } = {}) {
  const proxies = [
    ...(skipDirect ? [] : [url]),
    `https://poster-proxy.pejamas.workers.dev/?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];
  for (const candidate of proxies) {
    try {
      const res = await fetch(candidate);
      if (!res.ok) { console.warn(`[fetchJsonViaProxy] ${res.status} from`, candidate); continue; }
      const text = await res.text();
      if (!text || text.trimStart().startsWith('<')) { console.warn('[fetchJsonViaProxy] HTML response from', candidate); continue; }
      return JSON.parse(text);
    } catch (e) {
      console.warn('[fetchJsonViaProxy] Failed:', candidate, e.message);
    }
  }
  console.error('[fetchJsonViaProxy] All proxies failed for', url);
  return null;
}

function openLogoPicker() {
  const modal    = document.getElementById('logo-picker-modal');
  const backdrop = document.getElementById('logo-picker-backdrop');
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeLogoPicker() {
  const modal    = document.getElementById('logo-picker-modal');
  const backdrop = document.getElementById('logo-picker-backdrop');
  if (modal)    modal.style.display    = 'none';
  if (backdrop) backdrop.style.display = 'none';
  document.body.style.overflow = '';
}

function openPosterPicker() {
  if (!currentDesignerId) { showToast('Search for a title first'); return; }
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const titleEl  = document.getElementById('poster-picker-title');
  if (titleEl) titleEl.textContent = currentDesignerTitle ? `Posters — ${currentDesignerTitle}` : 'Browse Posters';
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
  fetchAndRenderPosterPicker(currentDesignerId, currentDesignerType);
}

function closePosterPicker() {
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  if (modal)    modal.style.display    = 'none';
  if (backdrop) backdrop.style.display = 'none';
  document.body.style.overflow = '';
}

async function fetchAndRenderPosterPicker(id, type) {
  const grid   = document.getElementById('poster-picker-grid');
  const tabsEl = document.getElementById('poster-lang-tabs');
  if (grid) {
    grid.innerHTML = '<div class="clearlogo-loading">Fetching posters…</div>';
    grid.style.cssText = ''; // reset any inline styles left over from season picker
  }
  if (tabsEl) tabsEl.innerHTML = '';

  const LANG_NAMES = {
    '__textless__': 'Textless',
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
    'it': 'Italian', 'pt': 'Portuguese', 'ja': 'Japanese', 'ko': 'Korean',
    'zh': 'Chinese', 'ru': 'Russian', 'ar': 'Arabic', 'tr': 'Turkish',
    'nl': 'Dutch', 'pl': 'Polish',
  };

  // Priority order for tabs: Textless first, English second, rest alphabetically
  const TAB_ORDER = ['__textless__', 'en'];

  try {
    const res  = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const all  = data.posters || [];
    if (!all.length) {
      if (grid) grid.innerHTML = '<div class="clearlogo-empty">No posters found</div>';
      return;
    }

    // Group by language (null iso_639_1 = textless)
    const groups = new Map();
    for (const p of all) {
      const key = p.iso_639_1 || '__textless__';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }

    // Sort keys: Textless → English → others alphabetically
    const sortedKeys = [
      ...TAB_ORDER.filter(k => groups.has(k)),
      ...[...groups.keys()].filter(k => !TAB_ORDER.includes(k)).sort(),
    ];

    // Default to first available tab
    let activeKey = sortedKeys[0];

    function renderGrid(key) {
      activeKey = key;
      tabsEl.querySelectorAll('.poster-lang-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.lang === key));
      const posters = groups.get(key) || [];
      if (!grid) return;
      grid.innerHTML = '';
      posters.forEach(p => {
        const item = document.createElement('div');
        item.className = 'poster-picker-item';
        const img = document.createElement('img');
        img.src     = `https://image.tmdb.org/t/p/w185${p.file_path}`;
        img.loading = 'lazy';
        img.alt     = '';
        item.appendChild(img);
        item.addEventListener('click', () =>
          loadPosterFromPicker(`https://image.tmdb.org/t/p/w780${p.file_path}`, id, type));
        grid.appendChild(item);
      });
    }

    // Build tab pills in sorted order
    for (const lang of sortedKeys) {
      const items = groups.get(lang);
      const btn = document.createElement('button');
      btn.className  = 'poster-lang-tab' + (lang === activeKey ? ' active' : '');
      btn.dataset.lang = lang;
      btn.textContent = `${LANG_NAMES[lang] || lang.toUpperCase()} (${items.length})`;
      btn.addEventListener('click', () => renderGrid(lang));
      tabsEl.appendChild(btn);
    }

    renderGrid(activeKey);
  } catch (e) {
    if (grid) grid.innerHTML = '<div class="clearlogo-empty">Failed to load posters</div>';
    console.error('[PosterPicker]', e);
  }
}

function loadPosterFromPicker(posterUrl, id, type) {
  closePosterPicker();
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.innerHTML = '<p>Loading poster…</p>';
  document.body.appendChild(loadingIndicator);

  const tempImage = new Image();
  tempImage.crossOrigin = 'anonymous';

  function finish(img) {
    baseImage = img;
    if (type === 'tv') baseShowImage = img; // save for restoring base

    // If the season suite is already open for this same show, don't rebuild the grid.
    // Just swap the base poster and update its thumbnail.
    if (seasonSuiteData && seasonSuiteData.showId == id) {
      activeSeasonNum = null;
      document.querySelectorAll('.season-card').forEach(c =>
        c.classList.toggle('active', c.dataset.seasonNum === 'base'));
      seasonLabelText = '';
      const _li = document.getElementById('season-label-text');
      if (_li) _li.value = '';
      // Always save fit settings for base poster
      const fit = { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY };
      const gradient = { enabled: gradientEnabled, opacity: gradientOpacity, height: gradientHeight, color: gradientColor };
      seasonSavedImages.set('base', { img, labelText: '', labelColor: seasonLabelColor, logoColor: designerLogoColor, gradient, fit });
      drawCanvas();
      setTimeout(() => captureCanvasThumb('base'), 220);
      if (document.body.contains(loadingIndicator)) document.body.removeChild(loadingIndicator);
      return;
    }

    activeSeasonNum = null;               // entering/re-entering the base context
    drawCanvas();
    fetchMetadataById(id, type);
    if (document.body.contains(loadingIndicator)) document.body.removeChild(loadingIndicator);
  }

  tempImage.onload = () => {
    try {
      const tc = document.createElement('canvas');
      tc.width = tempImage.width; tc.height = tempImage.height;
      tc.getContext('2d').drawImage(tempImage, 0, 0);
      const bi = new Image();
      bi.onload = () => finish(bi);
      bi.src = tc.toDataURL('image/png');
    } catch (e) {
      fetchImageAsObjectUrl(posterUrl)
        .then(url => { const bi = new Image(); bi.onload = () => { URL.revokeObjectURL(url); finish(bi); }; bi.src = url; })
        .catch(() => finish(tempImage));
    }
  };
  tempImage.onerror = () => {
    fetchImageAsObjectUrl(posterUrl)
      .then(url => { const bi = new Image(); bi.onload = () => { URL.revokeObjectURL(url); finish(bi); }; bi.src = url; })
      .catch(() => { const bi = new Image(); bi.onload = () => finish(bi); bi.src = posterUrl; });
  };
  tempImage.src = posterUrl;
}

function openPosterPicker() {
  if (!currentDesignerId) { showToast('Search for a title first'); return; }
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const titleEl  = document.getElementById('poster-picker-title');
  if (titleEl) titleEl.textContent = currentDesignerTitle ? `Posters — ${currentDesignerTitle}` : 'Browse Posters';
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
  fetchAndRenderPosterPicker(currentDesignerId, currentDesignerType);
}

function closePosterPicker() {
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  if (modal)    modal.style.display    = 'none';
  if (backdrop) backdrop.style.display = 'none';
  document.body.style.overflow = '';
}

// ── Season Suite ─────────────────────────────────────────
// ── Season card thumbnail capture ────────────────────────
const SEASON_NUMBER_WORDS = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT',
  'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN',
  'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN', 'TWENTY',
];
function seasonLabelDefault(season) {
  const n = season.season_number;
  if (n === 0) return 'SPECIALS';
  const word = SEASON_NUMBER_WORDS[n];
  return word ? `SEASON ${word}` : `SEASON ${n}`;
}
function captureCanvasThumb(key) {
  try {
    _capturingThumb = true;
    const wasGuidelines = guidelinesEnabled;
    guidelinesEnabled = false;
    // Force a clean redraw (without guidelines), then snapshot once drawCanvas signals done
    drawCanvas(() => {
      requestAnimationFrame(() => {
        const THUMB_W = 300, THUMB_H = 450;
        const tc = document.createElement('canvas');
        tc.width = THUMB_W; tc.height = THUMB_H;
        tc.getContext('2d').drawImage(canvas, 0, 0, THUMB_W, THUMB_H);
        const dataUrl = tc.toDataURL('image/jpeg', 0.88);
        const card = document.querySelector(`.season-card[data-season-num="${key}"]`);
        if (card) {
          let img = card.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            img.alt = '';
            card.insertBefore(img, card.firstChild);
          }
          img.src = dataUrl;
        }
        // Restore guidelines and redraw normally
        guidelinesEnabled = wasGuidelines;
        _capturingThumb = false;
        if (wasGuidelines) drawCanvas();
      });
    });
  } catch (e) {
    _capturingThumb = false;
    console.warn('[SeasonThumb]', e);
  }
}

// Module-level so loadDesignerLogo and other top-level functions can call it
function deferredThumbUpdate() {
  if (!seasonSuiteData) return;
  const key = activeSeasonNum === null ? 'base' : activeSeasonNum;
  setTimeout(() => captureCanvasThumb(key), 150);
}

// ── Async image loader for batch export ──────────────────
function loadImageForDownload(posterPath) {
  const posterUrl = `https://image.tmdb.org/t/p/w780${posterPath}`;
  return new Promise((resolve, reject) => {
    const tempImage = new Image();
    tempImage.crossOrigin = 'anonymous';
    tempImage.onload = () => {
      try {
        const tc = document.createElement('canvas');
        tc.width  = tempImage.width;
        tc.height = tempImage.height;
        tc.getContext('2d').drawImage(tempImage, 0, 0);
        const bi = new Image();
        bi.onload  = () => resolve(bi);
        bi.onerror = () => reject(new Error('re-encode failed'));
        bi.src = tc.toDataURL('image/png');
      } catch (_) {
        fetchImageAsObjectUrl(posterUrl)
          .then(url => {
            const bi = new Image();
            bi.onload  = () => { URL.revokeObjectURL(url); resolve(bi); };
            bi.onerror = reject;
            bi.src = url;
          })
          .catch(reject);
      }
    };
    tempImage.onerror = () => {
      fetchImageAsObjectUrl(posterUrl)
        .then(url => {
          const bi = new Image();
          bi.onload  = () => { URL.revokeObjectURL(url); resolve(bi); };
          bi.onerror = reject;
          bi.src = url;
        })
        .catch(reject);
    };
    tempImage.src = posterUrl;
  });
}

// ── Batch-download all season posters ────────────────────
async function batchDownloadAllSeasons() {
  if (!seasonSuiteData) return;

  const btn = document.getElementById('season-download-all-btn');
  if (btn) btn.disabled = true;

  const showTitle = (document.getElementById('meta-title')?.textContent || 'Show')
    .replace(/[/\\?%*:|"<>]/g, '-').trim();

  const { seasons } = seasonSuiteData;
  const displaySeasons = seasons
    .filter(s => s.season_number > 0 || s.poster_path)
    .sort((a, b) => a.season_number - b.season_number);

  // base poster first, then each season in numeric order
  const tasks = [
    { key: 'base', season: null },
    ...displaySeasons.map(s => ({ key: s.season_number, season: s })),
  ];

  // Only include tasks that actually have a source image
  const downloadTasks = tasks.filter(t => {
    if (t.key === 'base') return !!(seasonSavedImages.get('base') || baseShowImage);
    return !!(seasonSavedImages.get(t.key) || t.season?.poster_path);
  });

  if (downloadTasks.length === 0) {
    showToast('No season posters to download — browse at least one poster first');
    if (btn) btn.disabled = false;
    return;
  }

  // Snapshot current canvas state so we can restore it afterwards
  const savedBaseImage   = baseImage;
  const savedActiveNum   = activeSeasonNum;
  const savedLabelText   = seasonLabelText;
  const savedLabelColor  = seasonLabelColor;
  const savedLogoColor   = designerLogoColor;
  const savedGuidelines  = guidelinesEnabled;
  guidelinesEnabled = false;

  const zip = new JSZip();
  let packed = 0;

  for (const { key, season } of downloadTasks) {
    if (btn) btn.textContent = `Building ${packed + 1} / ${downloadTasks.length}…`;

    const saved = seasonSavedImages.get(key);

    // Determine which image to draw
    let img;
    if (saved) {
      img = saved.img;
    } else if (key === 'base') {
      img = baseShowImage || baseImage;
    } else {
      // Season not yet visited — fetch its poster fresh
      try {
        img = await loadImageForDownload(season.poster_path);
      } catch (e) {
        console.warn(`[BatchDownload] Failed to load Season ${key}`, e);
        continue;
      }
    }

    // Apply canvas state for this poster
    baseImage = img;
    if (key === 'base') {
      activeSeasonNum   = null;
      seasonLabelText   = saved?.labelText ?? '';
      seasonLabelColor  = saved?.labelColor ?? savedLabelColor;
      designerLogoColor = saved?.logoColor  ?? savedLogoColor;
    } else {
      activeSeasonNum   = key;
      seasonLabelText   = saved ? saved.labelText : seasonLabelDefault(season);
      seasonLabelColor  = saved ? saved.labelColor : savedLabelColor;
      designerLogoColor = saved?.logoColor ?? savedLogoColor;
    }
    drawCanvas();

    // Wait for canvas to finish rendering
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Build filename
    let filename;
    if (key === 'base') {
      filename = `${showTitle}.png`;
    } else if (key === 0) {
      filename = `${showTitle} - Specials.png`;
    } else {
      filename = `${showTitle} - Season ${String(key).padStart(2, '0')}.png`;
    }

    // Convert canvas to blob and add to zip
    const dataUrl = canvas.toDataURL('image/png');
    const base64  = dataUrl.split(',')[1];
    zip.file(filename, base64, { base64: true });
    packed++;
  }

  // Restore canvas to its pre-download state
  baseImage         = savedBaseImage;
  activeSeasonNum   = savedActiveNum;
  seasonLabelText   = savedLabelText;
  seasonLabelColor  = savedLabelColor;
  designerLogoColor = savedLogoColor;
  guidelinesEnabled = savedGuidelines;
  drawCanvas();

  if (packed === 0) {
    showToast('Nothing was packed into the zip');
    if (btn) { btn.disabled = false; btn.textContent = '⬇ Download All'; }
    return;
  }

  if (btn) btn.textContent = 'Zipping…';

  const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
  const link = document.createElement('a');
  link.download = `${showTitle} - Season Posters.zip`;
  link.href     = URL.createObjectURL(blob);
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 60000);

  if (btn) {
    btn.disabled    = false;
    btn.textContent = '⬇ Download All';
  }
  showToast(`Zipped ${packed} poster${packed !== 1 ? 's' : ''}`);
}

function buildSeasonGrid(seasons, showId) {
  const isSameShow = seasonSuiteData && String(seasonSuiteData.showId) === String(showId);
  seasonSuiteData = { showId, seasons };
  activeSeasonNum = null;

  if (!isSameShow) {
    seasonSavedImages.clear();
  }

  const panel   = document.getElementById('season-suite-panel');
  const grid    = document.getElementById('season-grid');
  const countEl = document.getElementById('season-suite-count');
  if (!panel || !grid) return;

  // Include season 0 only if it has a poster (Specials)
  const displaySeasons = seasons.filter(s => s.season_number > 0 || s.poster_path);

  if (displaySeasons.length === 0) { panel.style.display = 'none'; return; }

  // Total = base + seasons
  const totalCount = displaySeasons.length + 1;
  if (countEl) countEl.textContent = `${totalCount} poster${totalCount !== 1 ? 's' : ''}`;

  grid.innerHTML = '';

  // ── Base "Show Poster" card (always first) ──
  const baseCard = document.createElement('div');
  baseCard.className = 'season-card active'; // starts active
  baseCard.dataset.seasonNum = 'base';

  if (showBasePosterPath) {
    const bImg = document.createElement('img');
    bImg.src     = `https://image.tmdb.org/t/p/w185${showBasePosterPath}`;
    bImg.alt     = 'Show Poster';
    bImg.loading = 'lazy';
    baseCard.appendChild(bImg);
  } else {
    const ph = document.createElement('div');
    ph.className = 'season-card-placeholder';
    ph.textContent = 'Show Poster';
    baseCard.appendChild(ph);
  }

  // Browse icon for base poster — opens show-level poster picker
  const baseBrowse = document.createElement('div');
  baseBrowse.className = 'season-card-browse';
  baseBrowse.title     = 'Browse show posters';
  baseBrowse.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  baseBrowse.addEventListener('click', (e) => {
    e.stopPropagation();
    openPosterPicker(); // opens the main show-level poster picker
  });
  baseCard.appendChild(baseBrowse);

  baseCard.addEventListener('click', () => {
    if (activeSeasonNum === null) return; // already on base
    // Save current season state before leaving
    if (activeSeasonNum !== null && baseImage) {
      // Save fit settings for the current season poster
      const fit = { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY };
      seasonSavedImages.set(activeSeasonNum, { img: baseImage, labelText: seasonLabelText, labelColor: seasonLabelColor, logoColor: designerLogoColor, gradient: { enabled: gradientEnabled, opacity: gradientOpacity, height: gradientHeight, color: gradientColor }, fit });
    }
    activeSeasonNum = null;
    document.querySelectorAll('.season-card').forEach(c => c.classList.remove('active'));
    baseCard.classList.add('active');
    // Clear season label text
    seasonLabelText = '';
    const li = document.getElementById('season-label-text');
    if (li) li.value = '';
    // Restore base show poster from saved state or baseShowImage
    const saved = seasonSavedImages.get('base');
    let showPosterImg = null;
    if (saved) {
      showPosterImg = saved.img;
      // Restore fit settings for base poster
      if (saved.fit) {
        posterFitMode = saved.fit.mode;
        posterScale = saved.fit.scale;
        posterOffsetX = saved.fit.offsetX;
        posterOffsetY = saved.fit.offsetY;
      }
      applyGradientState(saved.gradient);
    } else if (baseShowImage) {
      showPosterImg = baseShowImage;
    }
    // Only set baseImage if we are in show poster context
    if (showPosterImg) baseImage = showPosterImg;
    drawCanvas();
    setTimeout(() => captureCanvasThumb('base'), 220);
  });

  // Wrap base card + label in outer container
  const baseOuter = document.createElement('div');
  baseOuter.className = 'season-card-outer';
  baseOuter.appendChild(baseCard);
  const baseLbl = document.createElement('span');
  baseLbl.className   = 'season-card-label';
  baseLbl.textContent = 'Show Poster';
  baseOuter.appendChild(baseLbl);

  grid.appendChild(baseOuter);

  // ── Season cards ──
  displaySeasons.forEach(season => {
    const card = document.createElement('div');
    card.className = 'season-card';
    card.dataset.seasonNum  = season.season_number;
    card.dataset.posterPath = season.poster_path || '';
    const seasonName = season.name || `Season ${season.season_number}`;
    card.dataset.seasonName = seasonName;

    if (season.poster_path) {
      const img = document.createElement('img');
      img.src     = `https://image.tmdb.org/t/p/w185${season.poster_path}`;
      img.alt     = seasonName;
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className   = 'season-card-placeholder';
      ph.textContent = 'No Poster';
      card.appendChild(ph);
    }

    // Browse icon — opens textless season poster picker
    const browseBtn = document.createElement('div');
    browseBtn.className   = 'season-card-browse';
    browseBtn.title       = `Browse posters for ${seasonName}`;
    browseBtn.innerHTML   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Activate season context first, then open picker
      activeSeasonNum = season.season_number;
      document.querySelectorAll('.season-card').forEach(c =>
        c.classList.toggle('active', parseInt(c.dataset.seasonNum) === season.season_number));
      seasonLabelText = seasonLabelDefault(season);
      const li = document.getElementById('season-label-text');
      if (li) li.value = seasonLabelText;
      openSeasonPosterPicker(showId, season.season_number, seasonLabelText);
    });
    card.appendChild(browseBtn);

    // Main card click → activate + load its poster
    card.addEventListener('click', () => {
      // Save whatever is currently on canvas before switching
      const prevKey = activeSeasonNum === null ? 'base' : activeSeasonNum;
      if (baseImage) {
        // Save fit settings for the previous poster
        const fit = { mode: posterFitMode, scale: posterScale, offsetX: posterOffsetX, offsetY: posterOffsetY };
        seasonSavedImages.set(prevKey, { img: baseImage, labelText: seasonLabelText, labelColor: seasonLabelColor, logoColor: designerLogoColor, gradient: { enabled: gradientEnabled, opacity: gradientOpacity, height: gradientHeight, color: gradientColor }, fit });
      }

      activeSeasonNum = season.season_number;
      document.querySelectorAll('.season-card').forEach(c =>
        c.classList.toggle('active', parseInt(c.dataset.seasonNum) === season.season_number));

      // Restore saved label text + color for this season, or use defaults
      const savedEntry = seasonSavedImages.get(season.season_number);
      const newLabel = savedEntry ? savedEntry.labelText : seasonLabelDefault(season);
      seasonLabelText = newLabel;
      // Restore fit settings for this season poster
      if (savedEntry && savedEntry.fit) {
        posterFitMode = savedEntry.fit.mode;
        posterScale = savedEntry.fit.scale;
        posterOffsetX = savedEntry.fit.offsetX;
        posterOffsetY = savedEntry.fit.offsetY;
      }
      const labelInput = document.getElementById('season-label-text');
      if (labelInput) labelInput.value = newLabel;

      // Restore per-season label color
      const newColor = savedEntry ? savedEntry.labelColor : '#ffffff';
      seasonLabelColor = newColor;
      if (seasonLabelColorPickr) seasonLabelColorPickr.setColor(newColor);
      // Restore per-season logo tint color
      const newLogoColor = savedEntry?.logoColor ?? '#ffffff';
      designerLogoColor = newLogoColor;
      if (designerLogoColorPickr) designerLogoColorPickr.setColor(newLogoColor);
      applyGradientState(savedEntry?.gradient);

      // If we already have a saved composite for this season, restore it without re-fetching
      if (savedEntry) {
        baseImage = savedEntry.img;
        drawCanvas();
      } else if (season.poster_path) {
        loadSeasonPoster(season.season_number, season.poster_path, seasonName);
      } else {
        openSeasonPosterPicker(showId, season.season_number, seasonName);
      }
    });

    // Wrap card + label in outer container
    const outer = document.createElement('div');
    outer.className = 'season-card-outer';
    outer.appendChild(card);
    const lbl = document.createElement('span');
    lbl.className   = 'season-card-label';
    lbl.textContent = seasonName;
    outer.appendChild(lbl);

    grid.appendChild(outer);
  });

  panel.style.display = '';

  // Capture the base card thumb from the current canvas (show poster is already drawn)
  setTimeout(() => captureCanvasThumb('base'), 250);
}

function loadSeasonPoster(seasonNum, posterPath, seasonName) {
  if (!posterPath) { showToast('No poster available for this season'); return; }

  const posterUrl = `https://image.tmdb.org/t/p/w780${posterPath}`;

  // Ensure active highlight is correct
  activeSeasonNum = seasonNum;
  document.querySelectorAll('.season-card').forEach(c =>
    c.classList.toggle('active', parseInt(c.dataset.seasonNum) === seasonNum));

  // Auto-update season label text to default SEASON WORD format
  const defaultLabelText = seasonLabelDefault({ season_number: seasonNum });
  // Only apply default if not already customised for this season
  if (!seasonSavedImages.has(seasonNum)) {
    seasonLabelText = defaultLabelText;
    const labelInput = document.getElementById('season-label-text');
    if (labelInput) labelInput.value = defaultLabelText;
  }

  // Show spinner on the active card
  const activeCard = document.querySelector(`.season-card[data-season-num="${seasonNum}"]`);
  let spinner = null;
  if (activeCard) {
    spinner = document.createElement('div');
    spinner.className   = 'season-card-loading';
    spinner.textContent = '…';
    activeCard.appendChild(spinner);
  }

  const tempImage = new Image();
  tempImage.crossOrigin = 'anonymous';

  function finishSeason(img) {
    baseImage = img;
    seasonSavedImages.set(seasonNum, { img, labelText: seasonLabelText, labelColor: seasonLabelColor, logoColor: designerLogoColor, gradient: { enabled: gradientEnabled, opacity: gradientOpacity, height: gradientHeight, color: gradientColor } });
    drawCanvas();
    if (spinner && spinner.parentNode) spinner.parentNode.removeChild(spinner);
    // Update the season card thumbnail with the current canvas composite
    setTimeout(() => captureCanvasThumb(seasonNum), 220);
  }

  tempImage.onload = () => {
    try {
      const tc = document.createElement('canvas');
      tc.width  = tempImage.width;
      tc.height = tempImage.height;
      tc.getContext('2d').drawImage(tempImage, 0, 0);
      const bi = new Image();
      bi.onload = () => finishSeason(bi);
      bi.src = tc.toDataURL('image/png');
    } catch (e) {
      fetchImageAsObjectUrl(posterUrl)
        .then(url => {
          const bi = new Image();
          bi.onload = () => { URL.revokeObjectURL(url); finishSeason(bi); };
          bi.src = url;
        })
        .catch(() => finishSeason(tempImage));
    }
  };
  tempImage.onerror = () => {
    fetchImageAsObjectUrl(posterUrl)
      .then(url => {
        const bi = new Image();
        bi.onload = () => { URL.revokeObjectURL(url); finishSeason(bi); };
        bi.src = url;
      })
      .catch(() => {
        const bi = new Image();
        bi.onload = () => finishSeason(bi);
        bi.src = posterUrl;
      });
  };
  tempImage.src = posterUrl;
}

// ── Season-specific poster picker ────────────────────────
function openSeasonPosterPicker(showId, seasonNum, seasonName) {
  const modal    = document.getElementById('poster-picker-modal');
  const backdrop = document.getElementById('poster-picker-backdrop');
  const titleEl  = document.getElementById('poster-picker-title');
  if (titleEl) titleEl.textContent = `Posters — ${seasonName}`;
  if (modal)    modal.style.display    = 'block';
  if (backdrop) backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
  fetchAndRenderSeasonPosterPicker(showId, seasonNum, seasonName);
}

async function fetchAndRenderSeasonPosterPicker(showId, seasonNum, seasonName) {
  const grid   = document.getElementById('poster-picker-grid');
  const tabsEl = document.getElementById('poster-lang-tabs');
  if (grid)   grid.innerHTML   = '<div class="clearlogo-loading">Fetching posters…</div>';
  if (tabsEl) tabsEl.innerHTML = '';

  try {
    // Fetch season-specific images AND show-level images in parallel
    // No include_image_language filter — fetch all, then filter client-side for consistency
    const [seasonRes, showRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNum}/images?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/tv/${showId}/images?api_key=${TMDB_API_KEY}`),
    ]);
    const [seasonData, showData] = await Promise.all([seasonRes.json(), showRes.json()]);

    // Textless = null/falsy iso_639_1 (matches main picker's grouping logic)
    const showTextless   = (showData.posters   || []).filter(p => !p.iso_639_1);
    const seasonTextless = (seasonData.posters || []).filter(p => !p.iso_639_1);

    // Deduplicate show-level posters against season-specific ones
    const seasonPaths = new Set(seasonTextless.map(p => p.file_path));
    const showOnlyTextless = showTextless.filter(p => !seasonPaths.has(p.file_path));

    if (!seasonTextless.length && !showOnlyTextless.length) {
      if (grid) grid.innerHTML = '<div class="clearlogo-empty">No textless posters found</div>';
      return;
    }

    if (!grid) return;
    grid.innerHTML = '';

    function buildPickerSection(posters, label) {
      if (!posters.length) return;
      const section = document.createElement('div');
      section.className = 'poster-picker-section';
      const heading = document.createElement('div');
      heading.className = 'poster-picker-section-label';
      heading.textContent = label;
      section.appendChild(heading);
      const subGrid = document.createElement('div');
      subGrid.className = 'poster-picker-grid';
      posters.forEach(p => {
        const item = document.createElement('div');
        item.className = 'poster-picker-item';
        const img = document.createElement('img');
        img.src     = `https://image.tmdb.org/t/p/w185${p.file_path}`;
        img.loading = 'lazy';
        img.alt     = '';
        item.appendChild(img);
        item.addEventListener('click', () => {
          loadSeasonPoster(seasonNum, p.file_path, seasonName);
          closePosterPicker();
        });
        subGrid.appendChild(item);
      });
      section.appendChild(subGrid);
      grid.appendChild(section);
    }

    buildPickerSection(seasonTextless, `${seasonName} — Textless`);
    buildPickerSection(showOnlyTextless, 'Show — Textless');
  } catch (e) {
    if (grid) grid.innerHTML = '<div class="clearlogo-empty">Failed to load season posters</div>';
    console.error('[SeasonPosterPicker]', e);
  }
}

async function fetchAndDisplayClearlogos(tmdbId, mediaType) {
  currentDesignerId   = tmdbId;
  currentDesignerType = mediaType;
  const strip = document.getElementById('clearlogo-strip');
  if (strip) strip.innerHTML = '<div class="clearlogo-loading">Fetching logos…</div>';
  const [tmdbLogos, fanartLogos] = await Promise.all([
    fetchTMDBLogos(tmdbId, mediaType),
    mediaType === 'movie' ? fetchFanartMovieLogos(tmdbId) : fetchFanartTVLogos(tmdbId),
  ]);
  console.log(`[Logos] TMDB: ${tmdbLogos.length}, Fanart.tv: ${fanartLogos.length}`);
  renderClearlogoStrip(tmdbLogos, fanartLogos);
}

function renderClearlogoStrip(tmdbLogos, fanartLogos) {
  const strip = document.getElementById('clearlogo-strip');
  if (!strip) return;
  strip.innerHTML = '';

  const allLogos = [...tmdbLogos, ...fanartLogos];
  if (!allLogos.length) {
    strip.innerHTML = '<div class="clearlogo-empty">No logos found for this title</div>';
    if (!fanartApiKey) addFanartHint(strip);
    return;
  }

  // Build a labelled row for each source group
  function buildRow(logos, label) {
    if (!logos.length) return;
    const section = document.createElement('div');
    section.className = 'clearlogo-source-section';
    const heading = document.createElement('div');
    heading.className = 'clearlogo-source-label';
    heading.textContent = label;
    section.appendChild(heading);
    const row = document.createElement('div');
    row.className = 'clearlogo-row';
    logos.forEach((logo, i) => {
      const item = document.createElement('div');
      item.className = 'clearlogo-item';
      const img = document.createElement('img');
      img.src = logo.thumbUrl;
      img.alt = `${label} logo ${i + 1}`;
      img.loading = 'lazy';
      img.onerror = () => { item.style.display = 'none'; };
      item.appendChild(img);
      item.addEventListener('click', () => {
        strip.querySelectorAll('.clearlogo-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        loadDesignerLogo(logo.fullUrl);
        const nameLabel = document.getElementById('designer-selected-logo-name');
        if (nameLabel) {
          nameLabel.textContent = `✓ ${label} logo selected`;
          nameLabel.style.display = 'block';
        }
        closeLogoPicker();
        const panel = document.getElementById('designer-controls-panel');
        if (panel) panel.style.display = 'flex';
      });
      row.appendChild(item);
    });
    section.appendChild(row);
    strip.appendChild(section);
  }

  buildRow(tmdbLogos, 'TMDB');
  buildRow(fanartLogos, 'Fanart.tv');

  if (!fanartApiKey) addFanartHint(strip);
}

function addFanartHint(strip) {
  const hint = document.createElement('div');
  hint.className = 'clearlogo-fanart-hint';
  hint.textContent = '🔑 Add a Fanart.tv key in the sidebar for more logos';
  strip.appendChild(hint);
}

function loadDesignerLogo(url) {
  designerLogoUrl = url;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => { designerLogoImage = img; if (baseImage) { drawCanvas(); deferredThumbUpdate(); } };
  img.onerror = () => {
    fetchImageAsObjectUrl(url)
      .then(objUrl => {
        const img2 = new Image();
        img2.onload  = () => { designerLogoImage = img2; if (baseImage) { drawCanvas(); deferredThumbUpdate(); } };
        img2.onerror = () => showToast('Could not load this logo – try another.');
        img2.src = objUrl;
      })
      .catch(() => showToast('Could not load this logo – try another.'));
  };
  img.src = url;
}

// ════════════════════════════════════════════════════════════════════════════
// Config save / load / export / import
// ════════════════════════════════════════════════════════════════════════════
const OVERLAY_CONFIG_KEY = 'postertools_overlay_configs';

function _getOverlayConfigs() {
  try { return JSON.parse(localStorage.getItem(OVERLAY_CONFIG_KEY) || '[]'); }
  catch { return []; }
}

function _captureOverlaySettings() {
  const overlayEl = document.getElementById('overlay-select');
  return {
    overlay:             overlayEl ? overlayEl.value : '',
    networkLogoPath:     currentLogoPath || '',
    networkLogoColor:    selectedLogoColor,
    networkLogoScale:    parseFloat(document.getElementById('logo-scale-slider')?.value ?? 1),
    designerLogoUrl,
    designerTmdbId:      currentDesignerId,
    designerTmdbType:    currentDesignerType,
    designerTitle:       currentDesignerTitle,
    designerLogoX,
    designerLogoY,
    designerLogoScale,
    designerLogoColor,
    designerShadowEnabled,
    designerShadowBlur,
    gradientEnabled,
    gradientOpacity,
    gradientHeight,
    gradientColor,
    seasonLabelEnabled,
    seasonLabelFont,
    seasonLabelFontSize,
    seasonLabelColor,
    seasonLabelYPct,
    seasonLabelSpacing,
  };
}

function saveOverlayConfig() {
  const name = (currentDesignerTitle || 'Untitled').trim();
  const configs = _getOverlayConfigs();
  configs.push({
    id: Date.now(),
    name,
    savedAt: new Date().toLocaleString(),
    settings: _captureOverlaySettings(),
  });
  localStorage.setItem(OVERLAY_CONFIG_KEY, JSON.stringify(configs));
  showToast(`Config saved: "${name}"`);
}

function _applyOverlaySettings(s) {
  if (!s) return;
  // TMDB metadata
  if (s.designerTmdbId    !== undefined) currentDesignerId    = s.designerTmdbId;
  if (s.designerTmdbType  !== undefined) currentDesignerType  = s.designerTmdbType;
  if (s.designerTitle     !== undefined) currentDesignerTitle = s.designerTitle;
  // Overlay banner
  const overlayEl = document.getElementById('overlay-select');
  if (overlayEl && s.overlay !== undefined) { overlayEl.value = s.overlay; overlayEl.dispatchEvent(new Event('change')); }

  // Network logo path
  if (s.networkLogoPath !== undefined && s.networkLogoPath) {
    updateNetworkLogo(s.networkLogoPath);
    const ns = document.getElementById('network-logo-search');
    if (ns) ns.value = s.networkLogoPath.split('/').pop().replace(/\.\w+$/, '');
  }
  // Network logo color
  if (s.networkLogoColor !== undefined) {
    selectedLogoColor = s.networkLogoColor;
    if (networkLogoColorPickr) networkLogoColorPickr.setColor(selectedLogoColor);
  }
  // Network logo scale
  if (s.networkLogoScale !== undefined) {
    const ns = document.getElementById('logo-scale-slider');
    const nv = document.getElementById('logo-scale-val');
    if (ns) { ns.value = s.networkLogoScale; if (nv) nv.textContent = parseFloat(s.networkLogoScale).toFixed(1) + 'x'; }
  }
  // Designer logo position / scale / shadow / color
  if (s.designerLogoX !== undefined) { designerLogoX = s.designerLogoX; const el = document.getElementById('designer-logo-x'); if (el) el.value = designerLogoX; const vl = document.getElementById('designer-logo-x-val'); if (vl) vl.textContent = designerLogoX; }
  if (s.designerLogoY !== undefined) { designerLogoY = s.designerLogoY; const el = document.getElementById('designer-logo-y'); if (el) el.value = designerLogoY; const vl = document.getElementById('designer-logo-y-val'); if (vl) vl.textContent = designerLogoY; }
  if (s.designerLogoScale !== undefined) { designerLogoScale = s.designerLogoScale; const el = document.getElementById('designer-logo-scale'); if (el) el.value = designerLogoScale; const vl = document.getElementById('designer-logo-scale-val'); if (vl) vl.textContent = parseFloat(designerLogoScale).toFixed(2) + 'x'; }
  if (s.designerLogoColor !== undefined) {
    designerLogoColor = s.designerLogoColor;
    if (designerLogoColorPickr) designerLogoColorPickr.setColor(designerLogoColor);
  }
  if (s.designerShadowEnabled !== undefined) {
    designerShadowEnabled = s.designerShadowEnabled;
    const st = document.getElementById('designer-shadow-toggle'); if (st) st.checked = designerShadowEnabled;
    const sg = document.getElementById('designer-shadow-group');  if (sg) sg.style.display = designerShadowEnabled ? 'block' : 'none';
  }
  if (s.designerShadowBlur !== undefined) { designerShadowBlur = s.designerShadowBlur; const el = document.getElementById('designer-shadow-blur'); if (el) el.value = designerShadowBlur; const vl = document.getElementById('designer-shadow-blur-val'); if (vl) vl.textContent = designerShadowBlur; }
  // Designer logo — re-fetch the clearlogo by URL
  if (s.designerLogoUrl) {
    loadDesignerLogo(s.designerLogoUrl);
    const panel = document.getElementById('designer-controls-panel');
    if (panel) panel.style.display = 'flex';
    const nameLabel = document.getElementById('designer-selected-logo-name');
    if (nameLabel) {
      nameLabel.textContent = `✓ ${s.designerTitle || 'Saved'} logo loaded`;
      nameLabel.style.display = 'block';
    }
  }
  // Gradient
  if (s.gradientEnabled !== undefined) {
    gradientEnabled = s.gradientEnabled;
    const gt = document.getElementById('gradient-toggle'); if (gt) { gt.checked = gradientEnabled; gt.dispatchEvent(new Event('change')); }
    const gp = document.getElementById('gradient-controls-panel'); if (gp) gp.style.display = gradientEnabled ? 'block' : 'none';
  }
  if (s.gradientOpacity !== undefined) { gradientOpacity = s.gradientOpacity; const el = document.getElementById('gradient-opacity'); if (el) el.value = Math.round(gradientOpacity * 100); const vl = document.getElementById('gradient-opacity-val'); if (vl) vl.textContent = Math.round(gradientOpacity * 100) + '%'; }
  if (s.gradientHeight  !== undefined) { gradientHeight  = s.gradientHeight;  const el = document.getElementById('gradient-height');  if (el) el.value = gradientHeight;  const vl = document.getElementById('gradient-height-val');  if (vl) vl.textContent = gradientHeight + '%'; }
  if (s.gradientColor   !== undefined) { gradientColor = s.gradientColor; if (gradientColorPickr) gradientColorPickr.setColor(gradientColor); }
  // Season label
  if (s.seasonLabelEnabled !== undefined) { seasonLabelEnabled = s.seasonLabelEnabled; const el = document.getElementById('season-label-toggle'); if (el) { el.checked = seasonLabelEnabled; el.dispatchEvent(new Event('change')); } }
  if (s.seasonLabelFont    !== undefined) { seasonLabelFont    = s.seasonLabelFont;    const el = document.getElementById('season-label-font');    if (el) el.value = seasonLabelFont; }
  if (s.seasonLabelFontSize!== undefined) { seasonLabelFontSize= s.seasonLabelFontSize;const el = document.getElementById('season-label-size');    if (el) el.value = seasonLabelFontSize; const vl = document.getElementById('season-label-size-val'); if (vl) vl.textContent = seasonLabelFontSize; }
  if (s.seasonLabelColor  !== undefined) { seasonLabelColor = s.seasonLabelColor; if (seasonLabelColorPickr) seasonLabelColorPickr.setColor(seasonLabelColor); }
  if (s.seasonLabelYPct   !== undefined) { seasonLabelYPct    = s.seasonLabelYPct;    const el = document.getElementById('season-label-y');        if (el) el.value = seasonLabelYPct;  const vl = document.getElementById('season-label-y-val');    if (vl) vl.textContent = seasonLabelYPct + '%'; }
  if (s.seasonLabelSpacing!== undefined) { seasonLabelSpacing = s.seasonLabelSpacing; const el = document.getElementById('season-label-spacing');  if (el) el.value = seasonLabelSpacing; const vl = document.getElementById('season-label-spacing-val'); if (vl) vl.textContent = seasonLabelSpacing; }
  drawCanvas();
}

function showLoadConfigModal() {
  const configs = _getOverlayConfigs();
  // Remove any existing modal
  const existing = document.getElementById('overlay-config-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'overlay-config-modal';
  modal.className = 'config-modal-overlay';
  modal.innerHTML = `
    <div class="config-modal-box">
      <div class="config-modal-header">
        <span>Saved Configs</span>
        <button class="config-modal-close" id="cfg-modal-close">&times;</button>
      </div>
      <div class="config-modal-body" id="cfg-modal-list">
        ${configs.length === 0
          ? '<p class="config-empty">No saved configs yet.</p>'
          : configs.map((c, i) => `
            <div class="config-modal-row" data-index="${i}">
              <div class="config-modal-meta">
                <span class="config-modal-name">${c.name}</span>
                <span class="config-modal-date">${c.savedAt}</span>
              </div>
              <div class="config-modal-actions">
                <button class="config-modal-load-btn" data-index="${i}">Load</button>
                <button class="config-modal-del-btn"  data-index="${i}">✕</button>
              </div>
            </div>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(modal);

  document.getElementById('cfg-modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

  modal.querySelectorAll('.config-modal-load-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      _applyOverlaySettings(configs[idx].settings);
      showToast(`Config loaded: "${configs[idx].name}"`);
      modal.remove();
    });
  });
  modal.querySelectorAll('.config-modal-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const updated = _getOverlayConfigs();
      const removed = updated.splice(idx, 1)[0];
      localStorage.setItem(OVERLAY_CONFIG_KEY, JSON.stringify(updated));
      showToast(`Deleted: "${removed?.name}"`);
      modal.remove();
      if (updated.length) showLoadConfigModal();
    });
  });
}

function exportOverlayConfigs() {
  const configs = _getOverlayConfigs();
  if (!configs.length) { showToast('No configs to export'); return; }
  const blob = new Blob([JSON.stringify(configs, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'poster-overlay-configs.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importOverlayConfigs() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'application/json,.json';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!Array.isArray(imported)) throw new Error('Not an array');
        const existing = _getOverlayConfigs();
        const merged = [...existing, ...imported];
        localStorage.setItem(OVERLAY_CONFIG_KEY, JSON.stringify(merged));
        showToast(`Imported ${imported.length} config(s)`);
      } catch {
        showToast('Import failed: invalid JSON file');
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

function searchDesignerTitle(query) {
  const sugg = document.getElementById('designer-logo-suggestions');
  if (!sugg) return;
  sugg.innerHTML = '<div class="suggestion-item">Searching…</div>';
  const type = currentMediaType || 'movie';
  fetch(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`)
    .then(r => r.json())
    .then(data => {
      sugg.innerHTML = '';
      const results = (data.results || []).slice(0, 6);
      if (!results.length) { sugg.innerHTML = '<div class="suggestion-item">No results</div>'; return; }
      results.forEach(item => {
        const div   = document.createElement('div');
        div.className = 'suggestion-item';
        const title = item.title || item.name || 'Unknown';
        const year  = (item.release_date || item.first_air_date || '').substring(0, 4);
        div.textContent = year ? `${title} (${year})` : title;
        div.addEventListener('click', () => {
          sugg.innerHTML = '';
          const inp = document.getElementById('designer-logo-search-input');
          if (inp) inp.value = title;
          fetchAndDisplayClearlogos(item.id, type);
        });
        sugg.appendChild(div);
      });
    })
    .catch(() => { sugg.innerHTML = '<div class="suggestion-item">Search failed</div>'; });
}

function hideNetworkSuggestions() {
  document.getElementById('network-logo-suggestions').style.display = 'none';
  document.getElementById('mobile-network-suggestions').style.display = 'none';
}

// Reset button
function setupResetButton() {
  const resetBtn = document.querySelector("#reset-btn");
  const mobileResetBtn = document.querySelector("#mobile-reset-btn");
  const mobileCanvasResetBtn = document.querySelector("#mobile-canvas-reset-btn");

  const handleReset = (event) => {
    event.preventDefault();
    
    // Show the reset confirmation overlay
    const confirmOverlay = document.getElementById("custom-confirm-overlay");
    confirmOverlay.style.display = "flex";
    
    // Setup confirmation button handlers (one-shot to avoid accumulating listeners)
    document.getElementById("confirmYes").addEventListener("click", function() {
      confirmOverlay.style.display = "none";
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reset upload status
      hideMetadataPanel();
      resetCanvasState();

      // Show guidelines backdrop on the blank canvas
      if (guidelinesEnabled && guidelinesImage.complete && guidelinesImage.naturalWidth > 0) {
        drawGuidelinesBackdrop();
      }
      
      // Reset UI elements
      document.getElementById("network-logo-checkbox").checked = false;
      document.getElementById("overlay-select").value = "none";
      if (document.getElementById("mobile-overlay-select")) {
        document.getElementById("mobile-overlay-select").value = "none";
      }
      if (document.getElementById("mobile-network-checkbox")) {
        document.getElementById("mobile-network-checkbox").checked = false;
      }

      networkLogoImage = null;
      
      // Clear search inputs
      document.getElementById("tmdb-search-input").value = "";
      document.getElementById("mediux-search-input").value = "";
      document.getElementById("network-logo-search").value = "";
      
      if (document.getElementById("mobile-tmdb-search")) {
        document.getElementById("mobile-tmdb-search").value = "";
      }
      if (document.getElementById("mobile-mediux-search")) {
        document.getElementById("mobile-mediux-search").value = "";
      }
      if (document.getElementById("mobile-network-search")) {
        document.getElementById("mobile-network-search").value = "";
      }

      if (typeof pickr !== 'undefined' && pickr) {
        pickr.setColor("#ffffff");
      }

      // Display a message
      showToast("Reset complete");
    }, { once: true });
    
    document.getElementById("confirmNo").addEventListener("click", function() {
      confirmOverlay.style.display = "none";
    }, { once: true });
  };

  // ── Config buttons ────────────────────────────────────────────────────────
  const _cfgSave   = document.getElementById('config-save-btn');
  const _cfgLoad   = document.getElementById('config-load-btn');
  const _cfgExport = document.getElementById('config-export-btn');
  const _cfgImport = document.getElementById('config-import-btn');
  if (_cfgSave)   _cfgSave.addEventListener('click', saveOverlayConfig);
  if (_cfgLoad)   _cfgLoad.addEventListener('click', showLoadConfigModal);
  if (_cfgExport) _cfgExport.addEventListener('click', exportOverlayConfigs);
  if (_cfgImport) _cfgImport.addEventListener('click', importOverlayConfigs);

  // Config dropdown toggle
  const _configDropdown = document.querySelector('.config-dropdown');
  if (_configDropdown) {
    const _configDropdownBtn  = _configDropdown.querySelector('.action-button');
    const _configDropdownMenu = _configDropdown.querySelector('.config-dropdown-menu');
    if (_configDropdownBtn && _configDropdownMenu) {
      _configDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        _configDropdownMenu.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!_configDropdown.contains(e.target)) {
          _configDropdownMenu.classList.remove('show');
        }
      });
      document.querySelectorAll('.config-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          _configDropdownMenu.classList.remove('show');
        });
      });
    }
  }

  resetBtn.addEventListener("click", handleReset);
  
  if (mobileResetBtn) {
    mobileResetBtn.addEventListener("click", handleReset);
  }
  
  if (mobileCanvasResetBtn) {
    mobileCanvasResetBtn.addEventListener("click", handleReset);
  }
}

function resetCanvasState() {
  // Reset variables
  baseImage = null;
  networkLogoImage = null;
  currentLogoPath = "none";

  // Reset Poster Designer state
  designerLogoImage   = null;
  designerLogoUrl     = '';
  designerLogoX       = 0;
  designerLogoY       = 55;
  designerLogoScale   = 1.0;
  designerShadowEnabled = false;
  currentDesignerId   = null;
  const _strip = document.getElementById('clearlogo-strip');
  if (_strip) _strip.innerHTML = '<div class="clearlogo-empty">Select a TMDB poster above to load logos</div>';
  const _modal = document.getElementById('logo-picker-modal');
  if (_modal) _modal.style.display = 'none';
  const _nameLabel = document.getElementById('designer-selected-logo-name');
  if (_nameLabel) { _nameLabel.textContent = ''; _nameLabel.style.display = 'none'; }
  const _frx = document.getElementById('designer-logo-x'); if (_frx) _frx.value = '0';
  const _fry = document.getElementById('designer-logo-y'); if (_fry) _fry.value = '55';
  const _sc = document.getElementById('designer-logo-scale'); if (_sc) _sc.value = '1';
  const _fxd = document.getElementById('designer-x-display'); if (_fxd) _fxd.textContent = '0';
  const _fyd = document.getElementById('designer-y-display'); if (_fyd) _fyd.textContent = '55';
  const _sd = document.getElementById('designer-scale-display'); if (_sd) _sd.textContent = '100%';
  const _st = document.getElementById('designer-shadow-toggle'); if (_st) _st.checked = false;
  const _sg = document.getElementById('designer-shadow-group');  if (_sg) _sg.style.display = 'none';

  // Reset file input
  posterUpload.value = "";
  
  // Hide metadata panel
  hideMetadataPanel();
}

function hideMetadataPanel() {
  metaPanel.style.display = "none";
}

// ── Collapsible sidebar sections ─────────────────────────────────────────
function setupCollapsibleSections() {
  const STORAGE_KEY = 'overlay_section_collapse';

  function getSavedState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }

  function setSectionCollapsed(key, collapsed) {
    const state = getSavedState();
    state[key] = collapsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applyState(wrapper, body, isActive) {
    if (isActive) {
      wrapper.classList.add('active');
      body.classList.remove('collapsed');
    } else {
      wrapper.classList.remove('active');
      body.classList.add('collapsed');
    }
  }

  document.querySelectorAll('.section-toggle').forEach(header => {
    const key = header.dataset.section;
    const wrapper = header.closest('.collapsible');
    const body = document.getElementById(`body-${key}`);
    if (!wrapper || !body) return;

    // Restore saved state immediately (no animation — remove transition briefly)
    const saved = getSavedState();
    if (saved[key] === true) {
      body.style.transition = 'none';
      applyState(wrapper, body, false);
      requestAnimationFrame(() => { body.style.transition = ''; });
    }

    header.addEventListener('click', () => {
      const nowActive = !wrapper.classList.contains('active');
      applyState(wrapper, body, nowActive);
      setSectionCollapsed(key, !nowActive);
    });
  });
}

// Restore per-poster gradient state from a saved entry
function applyGradientState(g) {
  if (!g) return;
  gradientEnabled = !!g.enabled;
  if (g.opacity  !== undefined) gradientOpacity = g.opacity;
  if (g.height   !== undefined) gradientHeight  = g.height;
  if (g.color    !== undefined) gradientColor   = g.color;
  // Sync UI
  const gt = document.getElementById('gradient-toggle');
  if (gt) { gt.checked = gradientEnabled; gt.dispatchEvent(new Event('change')); }
  const gop = document.getElementById('gradient-opacity');
  const gopv = document.getElementById('gradient-opacity-val');
  if (gop) { gop.value = Math.round(gradientOpacity * 100); if (gopv) gopv.textContent = gop.value + '%'; }
  const gh = document.getElementById('gradient-height');
  const ghv = document.getElementById('gradient-height-val');
  if (gh) { gh.value = gradientHeight; if (ghv) ghv.textContent = gradientHeight + '%'; }
  if (gradientColorPickr) gradientColorPickr.setColor(gradientColor);
}

// Auto-collapse Search Functions after a title is selected
function collapseSearchSection() {
  const header  = document.querySelector('[data-section="search"]');
  const wrapper = header ? header.closest('.collapsible') : null;
  const body    = document.getElementById('body-search');
  if (!wrapper || !body || !wrapper.classList.contains('active')) return;
  wrapper.classList.remove('active');
  body.classList.add('collapsed');
  try {
    const state = JSON.parse(localStorage.getItem('overlay_section_collapse') || '{}');
    state['search'] = true;
    localStorage.setItem('overlay_section_collapse', JSON.stringify(state));
  } catch {}
}

// Initialize the reset button confirmation
document.addEventListener("DOMContentLoaded", function() {
  setupResetButton();
  setupCollapsibleSections();
  checkAndShowChangelog();
});

// ═══════════════════════════════════════════════════════════
// QUICK EDIT BAR — bidirectional sync with sidebar controls
// ═══════════════════════════════════════════════════════════
function initPoEditBar() {
  // ── Show/hide toggle with localStorage persistence ────────
  (function initToggle() {
    const btn = document.getElementById('po-eb-toggle');
    const bar = document.getElementById('po-edit-bar');
    if (!btn || !bar) return;
    const STORAGE_KEY = 'po_edit_bar_open';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'false') {
      bar.classList.add('po-eb-collapsed');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        bar.classList.add('po-eb-collapsed');
        btn.setAttribute('aria-expanded', 'false');
        localStorage.setItem(STORAGE_KEY, 'false');
      } else {
        bar.classList.remove('po-eb-collapsed');
        btn.setAttribute('aria-expanded', 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    });
  })();

  // ── Helpers ────────────────────────────────────────────────
  function syncSelects(ebId, sbId) {
    const eb = document.getElementById(ebId);
    const sb = document.getElementById(sbId);
    if (!eb || !sb) return;
    // Populate eb options from sb if sb has more options
    if (sb.options.length > eb.options.length) {
      eb.innerHTML = sb.innerHTML;
    }
    eb.value = sb.value;
    eb.addEventListener('change', () => {
      sb.value = eb.value;
      sb.dispatchEvent(new Event('change'));
    });
    sb.addEventListener('change', () => { eb.value = sb.value; });
  }

  // Sync a checkbox (sidebar) with a toggle button (edit bar).
  function syncCheckboxToggle(ebId, sbId) {
    const eb = document.getElementById(ebId);
    const sb = document.getElementById(sbId);
    if (!eb || !sb) return;
    function updateEb() {
      const on = sb.checked;
      eb.setAttribute('aria-pressed', String(on));
      eb.textContent = on ? 'On' : 'Off';
    }
    updateEb();
    eb.addEventListener('click', () => {
      sb.checked = !sb.checked;
      sb.dispatchEvent(new Event('change'));
      updateEb();
    });
    sb.addEventListener('change', updateEb);
  }

  // Mirror a range slider + display value both ways.
  function syncSlider(ebSliderId, ebValId, ebDecId, ebIncId, sbSliderId, formatFn) {
    const ebSlider = document.getElementById(ebSliderId);
    const ebVal    = document.getElementById(ebValId);
    const ebDec    = document.getElementById(ebDecId);
    const ebInc    = document.getElementById(ebIncId);
    const sbSlider = document.getElementById(sbSliderId);
    if (!ebSlider || !sbSlider) return;

    function updateEbVal(v) {
      if (ebVal) ebVal.textContent = formatFn ? formatFn(v) : v;
    }

    // Seed from sidebar
    ebSlider.value = sbSlider.value;
    updateEbVal(sbSlider.value);

    ebSlider.addEventListener('input', () => {
      sbSlider.value = ebSlider.value;
      sbSlider.dispatchEvent(new Event('input'));
      updateEbVal(ebSlider.value);
    });

    sbSlider.addEventListener('input', () => {
      ebSlider.value = sbSlider.value;
      updateEbVal(sbSlider.value);
    });

    // − / + buttons on the edit bar operate the sidebar slider so existing logic fires
    if (ebDec) {
      ebDec.addEventListener('click', () => {
        const step = parseFloat(sbSlider.step) || 1;
        const min  = parseFloat(sbSlider.min);
        const newVal = Math.max(min, parseFloat(sbSlider.value) - step);
        sbSlider.value = newVal;
        sbSlider.dispatchEvent(new Event('input'));
        ebSlider.value = sbSlider.value;
        updateEbVal(sbSlider.value);
      });
    }
    if (ebInc) {
      ebInc.addEventListener('click', () => {
        const step = parseFloat(sbSlider.step) || 1;
        const max  = parseFloat(sbSlider.max);
        const newVal = Math.min(max, parseFloat(sbSlider.value) + step);
        sbSlider.value = newVal;
        sbSlider.dispatchEvent(new Event('input'));
        ebSlider.value = sbSlider.value;
        updateEbVal(sbSlider.value);
      });
    }
  }

  // ── Title Logo ─────────────────────────────────────────────
  const ebPickLogo = document.getElementById('eb-pick-logo-btn');
  if (ebPickLogo) ebPickLogo.addEventListener('click', () => document.getElementById('open-logo-picker-btn')?.click());

  syncSlider('eb-logo-y', 'eb-logo-y-val', 'eb-logo-y-dec', 'eb-logo-y-inc',
             'designer-logo-y', v => v);
  syncSlider('eb-logo-scale', 'eb-logo-scale-val', 'eb-logo-scale-dec', 'eb-logo-scale-inc',
             'designer-logo-scale', v => Math.round(parseFloat(v) * 100) + '%');

  // ── Poster ─────────────────────────────────────────────────
  syncSelects('eb-fit-mode', 'poster-fit-mode');

  // ── Overlays ───────────────────────────────────────────────
  syncSelects('eb-overlay-select', 'overlay-select');
  syncCheckboxToggle('eb-gradient-toggle', 'gradient-toggle');
  syncCheckboxToggle('eb-network-toggle', 'network-logo-checkbox');

  // ── Season Label ───────────────────────────────────────────
  const ebSeasonToggle = document.getElementById('eb-season-label-toggle');
  const sbSeasonToggle = document.getElementById('season-label-toggle');
  if (ebSeasonToggle && sbSeasonToggle) {
    function updateEbSeasonToggle() {
      const on = sbSeasonToggle.checked;
      ebSeasonToggle.setAttribute('aria-pressed', String(on));
      ebSeasonToggle.textContent = on ? 'On' : 'Off';
    }
    updateEbSeasonToggle();
    ebSeasonToggle.addEventListener('click', () => {
      sbSeasonToggle.checked = !sbSeasonToggle.checked;
      sbSeasonToggle.dispatchEvent(new Event('change'));
      updateEbSeasonToggle();
    });
    sbSeasonToggle.addEventListener('change', updateEbSeasonToggle);
  }

  const ebLabelText = document.getElementById('eb-season-label-text');
  const sbLabelText = document.getElementById('season-label-text');
  if (ebLabelText && sbLabelText) {
    ebLabelText.value = sbLabelText.value;
    ebLabelText.addEventListener('input', () => {
      sbLabelText.value = ebLabelText.value;
      sbLabelText.dispatchEvent(new Event('input'));
    });
    sbLabelText.addEventListener('input', () => { ebLabelText.value = sbLabelText.value; });
  }

  syncSlider('eb-season-y', 'eb-season-y-val', 'eb-season-y-dec', 'eb-season-y-inc',
             'season-label-y', v => parseFloat(v).toFixed(1) + '%');

  // ── Actions ────────────────────────────────────────────────
  const ebDownload = document.getElementById('eb-download-btn');
  if (ebDownload) ebDownload.addEventListener('click', () => document.getElementById('download-btn')?.click());

  const ebReset = document.getElementById('eb-reset-btn');
  if (ebReset) ebReset.addEventListener('click', () => document.getElementById('reset-btn')?.click());
}

document.addEventListener("DOMContentLoaded", initPoEditBar);