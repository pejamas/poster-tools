// Changelog Configuration
const CURRENT_VERSION = '1.7.1';
const CHANGELOG = [
    {
        version: '1.7.1',
        date: 'November 2, 2025',
        changes: [
            { type: 'feature', text: 'Visual indicator showing alternate image count on grid thumbnails' },
            { type: 'feature', text: 'Tooltip on custom placement checkbox explaining its purpose' },
            { type: 'improvement', text: 'Improved badge visibility with larger font and better contrast' },
            { type: 'improvement', text: 'Custom badge moved to bottom-right to avoid hiding resolution info' },
            { type: 'fix', text: 'Fixed click detection for episode cards and custom placement checkboxes' }
        ]
    },
    {
        version: '1.7.0',
        date: 'November 2, 2025',
        changes: [
            { type: 'feature', text: 'Roman numeral support for episode and season numbers' },
            { type: 'feature', text: 'Drag-and-drop reordering of episodes in grid view' },
            { type: 'feature', text: 'Auto-reordering when episode numbers are manually changed' },
            { type: 'feature', text: 'Select specific seasons to download with checkbox modal' },
            { type: 'improvement', text: 'Enhanced download options: Current View, All Cached, or Select Seasons' },
            { type: 'improvement', text: 'Detailed caching progress shows current activity (fetching, loading, rendering)' },
            { type: 'improvement', text: 'Episode reordering now persists when switching between seasons' },
            { type: 'improvement', text: 'Settings dropdown changed from hover to click-based for better reliability' },
            { type: 'fix', text: 'Drag operation no longer triggers single card view accidentally' }
        ]
    },
    {
        version: '1.6.0',
        date: 'November 1, 2025',
        changes: [
            { type: 'feature', text: 'Instant season switching with pre-rendered card caching' },
            { type: 'improvement', text: 'Parallel background caching loads all seasons simultaneously' },
            { type: 'improvement', text: 'Cached seasons restore instantly without re-rendering' },
            { type: 'fix', text: 'Resolved race conditions in parallel caching system' }
        ]
    },
    {
        version: '1.5.0',
        date: 'October 31, 2025',
        changes: [
            { type: 'feature', text: 'Download all seasons at once with organized folders' },
            { type: 'feature', text: 'Background caching for all seasons improves performance' },
            { type: 'feature', text: 'Episode edits (title, numbers) now persist across navigation' },
            { type: 'improvement', text: 'Non-blocking corner notifications allow continued work' },
            { type: 'improvement', text: 'Fast loading for cached seasons with progress indicators' },
            { type: 'improvement', text: 'Unified purple/cyan theme across all UI elements' }
        ]
    },
    {
        version: '1.4.0',
        date: 'October 30, 2025',
        changes: [
            { type: 'feature', text: 'Resolution badges on episode thumbnails' },
            { type: 'feature', text: 'Config export/import for browser switching' },
            { type: 'improvement', text: 'Prioritized highest resolution TMDB images' },
            { type: 'improvement', text: 'Optimized file sizes with JPEG export at 95% quality' },
            { type: 'fix', text: 'Streamlined header UI with dropdown menu' }
        ]
    }
];

// Changelog Modal Functions (defined before DOMContentLoaded)
function checkAndShowChangelog() {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    const dontShowAgain = localStorage.getItem(`dontShowChangelog_${CURRENT_VERSION}`);
    
    // Show if it's a new version and user hasn't opted out
    if (lastSeenVersion !== CURRENT_VERSION && dontShowAgain !== 'true') {
        setTimeout(() => {
            showChangelogModal();
        }, 1000); // Increased delay to ensure DOM is fully loaded
    }
    
    // Show badge if there are new updates
    updateWhatsNewBadge(lastSeenVersion !== CURRENT_VERSION && dontShowAgain !== 'true');
}

function updateWhatsNewBadge(showBadge) {
    // Called after DOM is loaded to show/hide the NEW badge
    setTimeout(() => {
        const badge = document.querySelector('.whats-new-badge');
        if (badge) {
            badge.style.display = showBadge ? 'inline-block' : 'none';
        }
    }, 100);
}

window.showChangelogModal = function() {
    let modal = document.getElementById('changelogOverlay');
    
    // If modal doesn't exist or isn't at body level, recreate it at body level
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
    
    if (!modal) {
        console.error('Changelog modal element not found!');
        return;
    }
    
    // Populate changelog content
    const content = document.getElementById('changelogContent');
    if (!content) {
        console.error('Changelog content element not found!');
        return;
    }
    
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
        
        // Add collapse functionality
        const toggleBtn = header.querySelector('.changelog-toggle');
        if (toggleBtn) {
            // Collapse older versions by default (keep first one expanded)
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
    
    // Reset checkbox
    const dontShowCheckbox = document.getElementById('dontShowChangelogAgain');
    if (dontShowCheckbox) {
        dontShowCheckbox.checked = false;
    }
    
    // Show modal
    modal.style.setProperty('display', 'flex', 'important');
    localStorage.setItem('lastSeenVersion', CURRENT_VERSION);
    
    // Hide the badge after viewing
    updateWhatsNewBadge(false);
}

window.closeChangelogModal = function() {
    const modal = document.getElementById('changelogOverlay');
    const dontShowCheckbox = document.getElementById('dontShowChangelogAgain');
    
    if (dontShowCheckbox && dontShowCheckbox.checked) {
        localStorage.setItem(`dontShowChangelog_${CURRENT_VERSION}`, 'true');
    }
    
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close changelog modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('changelogOverlay');
    if (modal && e.target === modal) {
        closeChangelogModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
  // Check and show changelog on version updates
  checkAndShowChangelog();

  // SPOILER/BLUR OPTION LOGIC (single instance)

  // =====================================================
  // SEASON/EPISODE NUMBER THEME OPTION
  // =====================================================

  // Add option for number theme: 'padded' (01,02) or 'plain' (1,2)
  let numberTheme = 'padded'; // default
  
  // Helper function to convert numbers to Roman numerals
  function toRomanNumeral(num) {
    if (isNaN(num) || num < 1) return String(num);
    const romanNumerals = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    let result = '';
    for (const [roman, value] of romanNumerals) {
      while (num >= value) {
        result += roman;
        num -= value;
      }
    }
    return result;
  }
  
  // Add UI: select box for number theme
  const numberThemeContainer = document.createElement('div');
  numberThemeContainer.id = 'number-theme-container';
  numberThemeContainer.style.margin = '10px 0 18px 0';
  numberThemeContainer.innerHTML = `
    <label for="number-theme-select" style="margin-right: 12px; font-weight: 500; color: #00bfa5;">Number Style:</label>
    <select id="number-theme-select" style="padding: 6px 12px; border-radius: 5px; background: #222; color: white; border: 1px solid rgba(255,255,255,0.15); font-size: 1rem;">
      <option value="padded">Formatted (01)</option>
      <option value="plain">Simple (1)</option>
      <option value="roman">Roman (I)</option>
    </select>
  `;
  // Insert into DOM near the season/episode number inputs
  const episodeNumberInputEl = document.getElementById("episode-number");
  if (episodeNumberInputEl && episodeNumberInputEl.parentElement) {
    episodeNumberInputEl.parentElement.parentElement.insertBefore(numberThemeContainer, episodeNumberInputEl.parentElement.nextSibling);
  }
  // Listen for changes
  const numberThemeSelect = numberThemeContainer.querySelector('#number-theme-select');
  if (numberThemeSelect) {
    numberThemeSelect.value = numberTheme;
    numberThemeSelect.addEventListener('change', function() {
      numberTheme = this.value;
      updateBothViews();
    });
  }
  // =====================
  // LANGUAGE MAP FOR I18N
  // =====================
  const i18n = {
    en: { season: "Season", episode: "Episode" },
    fr: { season: "Saison", episode: "Épisode" },
    de: { season: "Staffel", episode: "Folge" },
    es: { season: "Temporada", episode: "Episodio" },
    it: { season: "Stagione", episode: "Episodio" },
    pt: { season: "Temporada", episode: "Episódio" },
    nl: { season: "Seizoen", episode: "Aflevering" },
    sv: { season: "Säsong", episode: "Avsnitt" },
    pl: { season: "Sezon", episode: "Odcinek" },
    tr: { season: "Sezon", episode: "Bölüm" },
    ru: { season: "Сезон", episode: "Серия" },
    ja: { season: "シーズン", episode: "エピソード" },
    zh: { season: "季", episode: "集" },
  };
  let currentLang = 'en';

  // Get language select element
  const languageSelect = document.getElementById("language-select");
if (languageSelect) {
  languageSelect.addEventListener("change", async function() {
    currentLang = languageSelect.value;
    // If TMDB mode, reload show/season in new language
    if (isTMDBMode && currentShowData && currentShowData.id) {
      // Refetch show details and season in new language
      const showDetails = await getShowDetails(currentShowData.id, currentLang);
      if (showDetails) {
        currentShowData = showDetails;
        displaySeasonSelector(showDetails);
        await selectSeason(currentSeasonNumber);
      }
    } else {
      updateBothViews();
    }
  });
}  
  // =====================================================
  // CONFIGURATION CONSTANTS
  // =====================================================

  const TMDB_API_KEY = "96c821c9e98fab6a43bff8021d508d1d";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_IMG_BASE_URL = "https://image.tmdb.org/t/p/";
  const LOCAL_STORAGE_KEY = "cardLabShowConfigs";
  
  // Expose TMDB API key for sonarr-dashboard.js
  window.TMDB_API_KEY = TMDB_API_KEY;// Key for storing show configurations

  // =====================================================
  // GLOBAL COLOR STATE VARIABLES
  // =====================================================

  window["text-color"] = "#ffffff";
  window["info-color"] = "#ffffff";
  window["text-shadow-color"] = "#000000";
  window["text-outline-color"] = "#000000";
  window["info-shadow-color"] = "#000000";
  window["info-outline-color"] = "#000000";
  window["gradient-color"] = "#000000";

  // =====================================================
  // ELEMENT REFERENCES
  // =====================================================

  const canvas = document.getElementById("titlecard-canvas");
  const gridCanvas = document.getElementById("grid-canvas");

  // SPOILER/BLUR OPTION LOGIC (single instance, after canvas/gridCanvas are defined)
var spoilerToggle = document.getElementById("spoiler-toggle");
function isSpoilerBlurEnabled() {
  return spoilerToggle && spoilerToggle.checked;
}
if (spoilerToggle) {
  spoilerToggle.addEventListener("change", function() {
    updateBothViews();
  });
}
  // (Moved below canvas/gridCanvas declarations)
  const ctx = canvas.getContext("2d");
  const gridCtx = gridCanvas.getContext("2d");
  const infoPosition = document.getElementById("info-position");
  const titleInput = document.getElementById("title-text");
  const seasonNumberInput = document.getElementById("season-number");
  const episodeNumberInput = document.getElementById("episode-number");
  const seasonNumberDisplay = document.getElementById("season-number-display");
  const episodeNumberDisplay = document.getElementById("episode-number-display");
  const separatorType = document.getElementById("separator-type");
  const seriesType = document.getElementById("series-type");
  const horizontalPosition = document.getElementById("horizontal-position");
  const verticalPosition = document.getElementById("vertical-position");

  // Make Y offset update in real time
  if (verticalPosition) {
    verticalPosition.addEventListener("input", function () {
      updateSliderValueDisplay("vertical-position", "position-y-value", "px");
      updateBothViews();
    });
  }
  // Make X offset update in real time (if not already)
  if (horizontalPosition) {
    horizontalPosition.addEventListener("input", function () {
      updateSliderValueDisplay("horizontal-position", "position-value", "px");
      updateBothViews();
    });
  }

  const presetSelect = document.getElementById("preset-select");
  const fontFamily = document.getElementById("font-family");
  const textSize = document.getElementById("text-size");
  const textShadowBlur = document.getElementById("text-shadow-blur");
  const textOutlineWidth = document.getElementById("text-outline-width");
  const titleInfoSpacing = document.getElementById("title-info-spacing");
  const titleWrapping = document.getElementById("title-wrapping");

  const thumbnailInput = document.getElementById("thumbnail-upload");
  const thumbnailFullsize = document.getElementById("thumbnail-fullsize");

  const effectType = document.getElementById("effect-type");
  const gradientOpacity = document.getElementById("gradient-opacity");
  const blendMode = document.getElementById("blend-mode");

  const saveConfigBtn = document.getElementById("saveConfigBtn");
  const loadConfigBtn = document.getElementById("loadConfigBtn");
  const exportConfigBtn = document.getElementById("exportConfigBtn");
  const importConfigBtn = document.getElementById("importConfigBtn");
  const returnToGridBtn = document.getElementById("returnToGridBtn");

  // =====================================================
  // APPLICATION STATE VARIABLES
  // =====================================================

  let currentShowData = null;
  let currentSeasonData = [];
  let currentSeasonNumber = 1;
  let episodeTitleCards = [];
  let selectedCardIndex = -1;
  let isTMDBMode = false;
  let thumbnailImg = null;
  let hasSearchResults = false;
  let originalThumbnail = null; // To store original thumbnail for revert functionality

  let gridCardWidth = 240;
  let gridCardHeight = 135;
  let gridGap = 10;
  let gridColumns = 4;
  // =====================================================
  // DEFAULT CONFIGURATION VALUES
  // =====================================================
  const defaultValues = {
    title: "",
    seasonNumber: "",
    episodeNumber: "",
    showSeasonNumber: true,
    showEpisodeNumber: true,
    separator: "dot",
    font: "Gabarito",
    infoFont: "Gabarito",
    textColor: "#ffffff",
    infoColor: "#ffffff",
    textSize: "normal",
    infoTextSize: "normal",
    titleWrapping: "singleLine",
    lineSpacing: 1.2,
    infoPosition: "above",
    textShadowBlur: 0,
    textOutlineWidth: 0,
    horizontalPosition: 0,
    verticalPosition: 0,
    infoShadowBlur: 0,
    infoOutlineWidth: 0,
    titleInfoSpacing: 15,
    thumbnailFullsize: true,
    effectType: "none",
    gradientOpacity: 0.7,
    gradientColor: "#000000",
    blendMode: "normal",
    shadowColor: "#000000",
    outlineColor: "#000000",
    infoShadowColor: "#000000",
    infoOutlineColor: "#000000",
    preset: "leftMiddle",
    titleUppercase: false,
    titleLowercase: false,
    titleBold: false,
    infoSeasonUppercase: false,
    infoSeasonLowercase: false,
    infoSeasonBold: false,
    infoEpisodeUppercase: false,
    infoEpisodeLowercase: false,
    infoEpisodeBold: false
  };
  // ===============================
  // TEXT CASE TRANSFORM HELPERS
  // ===============================
  function applyCaseTransform(text, uppercase, lowercase) {
    if (lowercase) return text.toLocaleLowerCase();
    if (uppercase) return text.toLocaleUpperCase();
    return text;
  }

  // =====================================================
  // PRESET LAYOUT CONFIGURATIONS
  // =====================================================

  const presetLayoutConfig = {
    centerMiddle: {
      position: "centerMiddle",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "normal",
      textBold: true,
      effectType: "none",
      textShadowBlur: 8,
    },
    manhunt: {
      position: "leftBottom",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "large",
      textBold: true,
      effectType: "vignette",
      vignetteIntensity: 0.5,
      textShadowBlur: 5,
    },
    giggle: {
      position: "centerBottom",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "normal",
      textBold: true,
      effectType: "none",
      textShadowBlur: 10,
    },
    leftMiddle: {
      position: "leftMiddle",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "normal",
      textBold: true,
      effectType: "rightToLeft",
      gradientColor: "#000000",
      gradientOpacity: 0.7,
      textShadowBlur: 10,
    },
    rightMiddle: {
      position: "rightMiddle",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "normal",
      textBold: true,
      effectType: "leftToRight",
      gradientColor: "#000000",
      gradientOpacity: 0.7,
      textShadowBlur: 10,
    },
    centerTop: {
      position: "centerTop",
      textColor: "#FFFFFF",
      infoColor: "#CCCCCC",
      textSize: "normal",
      textBold: true,
      effectType: "bottomToTop",
      gradientColor: "#000000",
      gradientOpacity: 0.6,
      textShadowBlur: 12,
    },
  };

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================

  // Add the wrapText function here, before any other functions that might use it

  // Function to wrap text with proper line breaks
  function wrapText(ctx, text, maxWidth, textAlign) {
    // Split text into words
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    // Process each word
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    // Add the last line
    lines.push(currentLine);

    return lines;
  }

  // =====================================================
  // INITIALIZATION FUNCTIONS
  // =====================================================

  // Initialize text options for sliders, toggles, etc.
  function initializeTextOptionsUI() {
    // --- Custom Info Font Size Option ---
    const infoTextSize = document.getElementById("info-text-size");
    const customInfoTextSize = document.getElementById("custom-info-text-size");
    if (infoTextSize && customInfoTextSize) {
      infoTextSize.addEventListener("change", function () {
        if (this.value === "custom") {
          customInfoTextSize.style.display = "inline-block";
          if (!customInfoTextSize.value) customInfoTextSize.value = 36;
        } else {
          customInfoTextSize.style.display = "none";
        }
        updateBothViews();
      });
      customInfoTextSize.addEventListener("input", updateBothViews);
    }
    // --- Custom Title Font Size Option ---
    const customTextSize = document.getElementById("custom-text-size");
    if (textSize && customTextSize) {
      textSize.addEventListener("change", function () {
        if (this.value === "custom") {
          customTextSize.style.display = "inline-block";
          if (!customTextSize.value) customTextSize.value = 72;
        } else {
          customTextSize.style.display = "none";
        }
        updateBothViews();
      });
      customTextSize.addEventListener("input", updateBothViews);
    }
    // Set default state for new checkboxes (including new lowercase options)
    document.getElementById("title-uppercase").checked = defaultValues.titleUppercase;
    document.getElementById("title-lowercase").checked = defaultValues.titleLowercase || false;
    document.getElementById("title-bold").checked = defaultValues.titleBold;
    document.getElementById("info-season-uppercase").checked = defaultValues.infoSeasonUppercase;
    document.getElementById("info-season-lowercase").checked = defaultValues.infoSeasonLowercase || false;
    document.getElementById("info-season-bold").checked = defaultValues.infoSeasonBold;
    document.getElementById("info-episode-uppercase").checked = defaultValues.infoEpisodeUppercase;
    document.getElementById("info-episode-lowercase").checked = defaultValues.infoEpisodeLowercase || false;
    document.getElementById("info-episode-bold").checked = defaultValues.infoEpisodeBold;

    // Add event listeners to update views (including new lowercase options)
    [
      "title-uppercase","title-lowercase","title-bold",
      "info-season-uppercase","info-season-lowercase","info-season-bold",
      "info-episode-uppercase","info-episode-lowercase","info-episode-bold"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", updateBothViews);
    });
    const customFontUploadContainer = document.querySelector(
      ".custom-font-upload-container"
    );
    const customFontUpload = document.getElementById("custom-font-upload");

    // Set up new thumbnail/revert buttons
    const uploadThumbnailBtn = document.getElementById("upload-thumbnail-btn");
    const thumbnailInput = document.getElementById("thumbnail-upload");
    const uploadThumbnailAllBtn = document.getElementById("upload-thumbnail-all-btn");
    const thumbnailInputAll = document.getElementById("thumbnail-upload-all");
    const revertAllThumbnailsBtn = document.getElementById("revert-all-thumbnails-btn");

    // Upload for single episode
    if (uploadThumbnailBtn && thumbnailInput) {
      uploadThumbnailBtn.addEventListener("click", () => {
        thumbnailInput.click();
      });
      thumbnailInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const img = new Image();
          img.onload = () => {
            thumbnailImg = img;
            if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
              if (!episodeTitleCards[selectedCardIndex].originalThumbnail && episodeTitleCards[selectedCardIndex].thumbnailImg) {
                episodeTitleCards[selectedCardIndex].originalThumbnail = episodeTitleCards[selectedCardIndex].thumbnailImg;
              }
              episodeTitleCards[selectedCardIndex].thumbnailImg = img;
            }
            updateBothViews();
          };
          img.onerror = () => {
            console.error("Failed to load selected thumbnail image.");
          };
          img.src = URL.createObjectURL(file);
        }
      });
    }

    // Upload for all episodes
    if (uploadThumbnailAllBtn && thumbnailInputAll) {
      uploadThumbnailAllBtn.addEventListener("click", () => {
        thumbnailInputAll.click();
      });
      thumbnailInputAll.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const img = new Image();
          img.onload = () => {
            episodeTitleCards.forEach((card) => {
              if (!card.originalThumbnail && card.thumbnailImg) {
                card.originalThumbnail = card.thumbnailImg;
              }
              card.thumbnailImg = img;
            });
            if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
              thumbnailImg = img;
            }
            updateBothViews();
          };
          img.onerror = () => {
            console.error("Failed to load selected thumbnail image for all episodes.");
          };
          img.src = URL.createObjectURL(file);
        }
      });
    }

    // Revert all thumbnails to original
    if (revertAllThumbnailsBtn) {
      revertAllThumbnailsBtn.addEventListener("click", () => {
        let reverted = false;
        episodeTitleCards.forEach((card) => {
          if (card.originalThumbnail) {
            card.thumbnailImg = card.originalThumbnail;
            reverted = true;
          }
        });
        if (reverted) {
          if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
            thumbnailImg = episodeTitleCards[selectedCardIndex].thumbnailImg;
          }
          updateBothViews();
          showToast("All episode thumbnails reverted to default.");
        } else {
          showToast("No original thumbnails to revert to.");
        }
      });
    }

    // Set up custom font upload handling (multiple fonts, colored options)
    if (customFontUploadContainer && customFontUpload) {
      customFontUpload.setAttribute('multiple', 'multiple');
      window.customFonts = window.customFonts || {};
      customFontUploadContainer.addEventListener("click", () => {
        customFontUpload.click();
      });
      customFontUpload.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
          let fontNames = [];
          Array.from(this.files).forEach(file => {
            const fontName = file.name.split(".")[0];
            fontNames.push(fontName);
            const fontUrl = URL.createObjectURL(file);
            const fontFace = new FontFace(fontName, `url(${fontUrl})`);
            fontFace.load().then(function (loadedFace) {
              document.fonts.add(loadedFace);
              window.customFonts[fontName] = loadedFace;
              // Add to title font dropdown
              let existingOption = fontFamily.querySelector(`option[value="custom-${fontName}"]`);
              if (!existingOption) {
                const opt = document.createElement('option');
                opt.value = `custom-${fontName}`;
                opt.textContent = fontName;
                opt.style.color = '#00bfa5';
                fontFamily.appendChild(opt);
              }
              // Add to info font dropdown
              let infoFontFamily = document.getElementById("info-font-family");
              if (infoFontFamily) {
                let infoExisting = infoFontFamily.querySelector(`option[value="custom-${fontName}"]`);
                if (!infoExisting) {
                  const opt2 = document.createElement('option');
                  opt2.value = `custom-${fontName}`;
                  opt2.textContent = fontName;
                  opt2.style.color = '#00bfa5';
                  infoFontFamily.appendChild(opt2);
                }
              }
              updateBothViews();
            }).catch(function (error) {
              console.error("Error loading font:", error);
              customFontUploadContainer.textContent = "Error loading font";
            });
          });
          customFontUploadContainer.textContent = fontNames.join(", ");
        } else {
          customFontUploadContainer.textContent = "Upload Custom Font";
        }
      });
    }

    // Initialize slider value displays
    updateSliderValueDisplay("text-shadow-blur", "shadow-value", "px");
    updateSliderValueDisplay("text-outline-width", "outline-value", "px");
    updateSliderValueDisplay("info-shadow-blur", "info-shadow-value", "px");
    updateSliderValueDisplay("info-outline-width", "info-outline-value", "px");
    updateSliderValueDisplay("title-info-spacing", "spacing-value", "px");
    updateSliderValueDisplay("horizontal-position", "position-value", "px");
    updateSliderValueDisplay("vertical-position", "position-y-value", "px");

    // Add increment/decrement logic for sidebar sliders
    function setupSidebarRangeButton(id, step, min, max) {
      const input = document.getElementById(id);
      const decBtn = document.getElementById(id + "-decrement");
      const incBtn = document.getElementById(id + "-increment");
      if (!input || !decBtn || !incBtn) return;
      decBtn.addEventListener("click", () => {
        let value = parseFloat(input.value);
        value = Math.max(min, value - step);
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      incBtn.addEventListener("click", () => {
        let value = parseFloat(input.value);
        value = Math.min(max, value + step);
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    // Wait for DOM to update (sliders/buttons are in HTML)
    setTimeout(() => {
      setupSidebarRangeButton("horizontal-position", 5, -350, 350);
      setupSidebarRangeButton("vertical-position", 5, -350, 350);
      setupSidebarRangeButton("title-info-spacing", 5, -50, 50);
    }, 0);

    // Set default values for sliders
    document.getElementById("text-shadow-blur").value = 0;
    document.getElementById("text-outline-width").value = 0;
    document.getElementById("info-shadow-blur").value = 0;
    document.getElementById("info-outline-width").value = 0;

    // Update slider value displays again after setting defaults
    updateSliderValueDisplay("text-shadow-blur", "shadow-value", "px");
    updateSliderValueDisplay("text-outline-width", "outline-value", "px");
    updateSliderValueDisplay("info-shadow-blur", "info-shadow-value", "px");
    updateSliderValueDisplay("info-outline-width", "info-outline-value", "px");
    updateSliderValueDisplay("vertical-position", "position-y-value", "px");
  }

  // Updates the display of slider values
  function updateSliderValueDisplay(sliderId, valueId, unit) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    if (slider && valueDisplay) {
      valueDisplay.textContent = `${slider.value}${unit}`;

      slider.addEventListener("input", () => {
        valueDisplay.textContent = `${slider.value}${unit}`;
      });
    }
  }

  // Initialize color pickers
  function initializePickrs() {
    window["text-color"] = "#ffffff";
    window["info-color"] = "#ffffff";
    window["text-shadow-color"] = "#000000";
    window["text-outline-color"] = "#000000";
    window["info-shadow-color"] = "#000000";
    window["info-outline-color"] = "#000000";
    window["gradient-color"] = "#000000";

    const mainPickrOptions = {
      theme: "monolith",
      position: "right-middle",
      padding: 40,
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
    };

    const effectPickrOptions = {
      ...mainPickrOptions,
      position: "top-start",
      padding: 10,
    };

    // Create all color pickers
    const textColorPickr = Pickr.create({
      el: document.getElementById("text-color-pickr"),
      default: window["text-color"],
      ...mainPickrOptions,
    });
    const infoColorPickr = Pickr.create({
      el: document.getElementById("info-color-pickr"),
      default: window["info-color"],
      ...mainPickrOptions,
    });
    const shadowColorPickr = Pickr.create({
      el: document.getElementById("text-shadow-color-pickr"),
      default: window["text-shadow-color"],
      ...effectPickrOptions,
    });
    const outlineColorPickr = Pickr.create({
      el: document.getElementById("text-outline-color-pickr"),
      default: window["text-outline-color"],
      ...effectPickrOptions,
    });
    const infoShadowColorPickr = Pickr.create({
      el: document.getElementById("info-shadow-color-pickr"),
      default: window["info-shadow-color"],
      ...effectPickrOptions,
    });
    const infoOutlineColorPickr = Pickr.create({
      el: document.getElementById("info-outline-color-pickr"),
      default: window["info-outline-color"],
      ...effectPickrOptions,
    });
    const gradientColorPickr = Pickr.create({
      el: document.getElementById("gradient-color-pickr"),
      default: window["gradient-color"],
      ...mainPickrOptions,
    });

    // Set initial colors
    textColorPickr.setColor(window["text-color"]);
    infoColorPickr.setColor(window["info-color"]);
    shadowColorPickr.setColor(window["text-shadow-color"]);
    outlineColorPickr.setColor(window["text-outline-color"]);
    infoShadowColorPickr.setColor(window["info-shadow-color"]);
    infoOutlineColorPickr.setColor(window["info-outline-color"]);
    gradientColorPickr.setColor(window["gradient-color"]);

    // Setup events for all pickers
    setupPickrEvents(textColorPickr, "text-color");
    setupPickrEvents(infoColorPickr, "info-color");
    setupPickrEvents(shadowColorPickr, "text-shadow-color");
    setupPickrEvents(outlineColorPickr, "text-outline-color");
    setupPickrEvents(infoShadowColorPickr, "info-shadow-color");
    setupPickrEvents(infoOutlineColorPickr, "info-outline-color");
    setupPickrEvents(gradientColorPickr, "gradient-color");
  }
  // Setup events for a color picker
  function setupPickrEvents(pickr, colorName) {
    window[colorName] = pickr.getColor().toHEXA().toString();

    pickr.on("change", (color) => {
      const hexColor = color.toHEXA().toString();
      // Store color in global window object for persistence
      window[colorName] = hexColor;
      
      // Explicitly update all episode cards with the new color to ensure persistence
      if (isTMDBMode && episodeTitleCards.length > 0) {
        episodeTitleCards.forEach(card => {
          if (colorName === "text-color") {
            card.currentSettings.textColor = hexColor;
          } else if (colorName === "info-color") {
            card.currentSettings.infoColor = hexColor;
          } else if (colorName === "text-shadow-color") {
            card.currentSettings.textShadowColor = hexColor;
          } else if (colorName === "text-outline-color") {
            card.currentSettings.textOutlineColor = hexColor;
          } else if (colorName === "info-shadow-color") {
            card.currentSettings.infoShadowColor = hexColor;
          } else if (colorName === "info-outline-color") {
            card.currentSettings.infoOutlineColor = hexColor;
          } else if (colorName === "gradient-color") {
            card.currentSettings.gradientColor = hexColor;
          }
        });
      }
      
      updateBothViews();
    });

    pickr.on("save", (color) => {
      const hexColor = color.toHEXA().toString();
      window[colorName] = hexColor;
      
      // Same update as in change event
      if (isTMDBMode && episodeTitleCards.length > 0) {
        episodeTitleCards.forEach(card => {
          if (colorName === "text-color") {
            card.currentSettings.textColor = hexColor;
          } else if (colorName === "info-color") {
            card.currentSettings.infoColor = hexColor;
          } else if (colorName === "text-shadow-color") {
            card.currentSettings.textShadowColor = hexColor;
          } else if (colorName === "text-outline-color") {
            card.currentSettings.textOutlineColor = hexColor;
          } else if (colorName === "info-shadow-color") {
            card.currentSettings.infoShadowColor = hexColor;
          } else if (colorName === "info-outline-color") {
            card.currentSettings.infoOutlineColor = hexColor;
          } else if (colorName === "gradient-color") {
            card.currentSettings.gradientColor = hexColor;
          }
        });
      }
      
      pickr.hide();
      updateBothViews();
    });
  }

  // Initialize color values from Pickr instances
  function initializeColorValuesFromPickr() {
    if (Pickr && Pickr.all && Pickr.all.length > 0) {
      console.log("Initializing color values from Pickr instances...");

      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id)
          return;

        const id = pickr._root.button.id;
        const colorValue = pickr.getColor()?.toHEXA()?.toString();

        if (!colorValue) return;

        if (id === "text-color-pickr") window["text-color"] = colorValue;
        else if (id === "info-color-pickr") window["info-color"] = colorValue;
        else if (id === "text-shadow-color-pickr")
          window["text-shadow-color"] = colorValue;
        else if (id === "text-outline-color-pickr")
          window["text-outline-color"] = colorValue;
        else if (id === "info-shadow-color-pickr")
          window["info-shadow-color"] = colorValue;
        else if (id === "info-outline-color-pickr")
          window["info-outline-color"] = colorValue;
        else if (id === "gradient-color-pickr")
          window["gradient-color"] = colorValue;
      });

      drawCard();
    } else {
      console.log("Pickr instances not ready yet, retrying in 100ms...");
      setTimeout(initializeColorValuesFromPickr, 100);
    }
  }

  // =====================================================
  // VIEW MANAGEMENT FUNCTIONS
  // =====================================================

  // Update the single card view
  function updateCard() {
    drawCard();
  }

  // Update both single card and grid views
  function updateBothViews() {
    // Save current episode's specific data if we're editing a card
    if (isTMDBMode && selectedCardIndex >= 0 && selectedCardIndex < episodeTitleCards.length) {
      const currentCard = episodeTitleCards[selectedCardIndex];
      
      // Format the numbers based on numberTheme
      const formatNumber = (n) => {
        if (numberTheme === 'plain') return String(Number(n));
        if (numberTheme === 'roman') return toRomanNumeral(Number(n));
        return String(n).padStart(2, "0");
      };
      
      // Update the card's specific properties
      currentCard.title = titleInput.value;
      currentCard.seasonNumber = formatNumber(seasonNumberInput.value);
      currentCard.episodeNumber = formatNumber(episodeNumberInput.value);
      
      // Sort cards by episode number after updating
      sortEpisodeCards();
    }
    
    drawCard();
    if (isTMDBMode && episodeTitleCards.length > 0) {
      updateEpisodeCardSettings();
      renderEpisodeGrid();
    }
  }
  
  // Sort episode cards by episode number
  function sortEpisodeCards() {
    episodeTitleCards.sort((a, b) => {
      const aNum = parseInt(a.episodeNumber) || 0;
      const bNum = parseInt(b.episodeNumber) || 0;
      return aNum - bNum;
    });
    
    // Update selectedCardIndex to maintain selection on the same card
    if (selectedCardIndex >= 0 && selectedCardIndex < episodeTitleCards.length) {
      const currentCard = episodeTitleCards[selectedCardIndex];
      selectedCardIndex = episodeTitleCards.findIndex(card => card === currentCard);
    }
    
    // Update the cache with the new sorted order
    if (currentShowData && currentShowData.id) {
      const cacheKey = `${currentShowData.id}-${currentSeasonNumber}`;
      if (artworkCache.has(cacheKey)) {
        const cached = artworkCache.get(cacheKey);
        // Update the cached rendered cards with the new order
        cached.renderedCards = [...episodeTitleCards];
        artworkCache.set(cacheKey, cached);
      }
    }
  }

  // Update episode card settings for all cards in the grid
  function updateEpisodeCardSettings() {
    if (!isTMDBMode || episodeTitleCards.length === 0) return;

    // Get current colors from color pickers
    const currentColors = {};
    if (Pickr.all) {
      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id)
          return;

        const id = pickr._root.button.id;

        if (pickr.getColor && typeof pickr.getColor === "function") {
          const colorValue = pickr.getColor().toHEXA().toString();

          if (id === "text-color-pickr") {
            currentColors.textColor = colorValue;
            window["text-color"] = colorValue;
          } else if (id === "info-color-pickr") {
            currentColors.infoColor = colorValue;
            window["info-color"] = colorValue;
          } else if (id === "text-shadow-color-pickr") {
            currentColors.textShadowColor = colorValue;
            window["text-shadow-color"] = colorValue;
          } else if (id === "text-outline-color-pickr") {
            currentColors.textOutlineColor = colorValue;
            window["text-outline-color"] = colorValue;
          } else if (id === "info-shadow-color-pickr") {
            currentColors.infoShadowColor = colorValue;
            window["info-shadow-color"] = colorValue;
          } else if (id === "info-outline-color-pickr") {
            currentColors.infoOutlineColor = colorValue;
            window["info-outline-color"] = colorValue;
          } else if (id === "gradient-color-pickr") {
            currentColors.gradientColor = colorValue;
            window["gradient-color"] = colorValue;
          }
        }
      });
    }

    // Fallback colors in case the pickers fail
    const fallbackColors = {
      textColor: window["text-color"] || "#ffffff",
      infoColor: window["info-color"] || "#ffffff",
      textShadowColor: window["text-shadow-color"] || "#000000",
      textOutlineColor: window["text-outline-color"] || "#000000",
      infoShadowColor: window["info-shadow-color"] || "#000000",
      infoOutlineColor: window["info-outline-color"] || "#000000",
      gradientColor: window["gradient-color"] || "#000000",
    };    // Update each card's settings
    for (const card of episodeTitleCards) {
      card.currentSettings = {
        fontFamily: fontFamily.value,
        infoFontFamily: document.getElementById("info-font-family").value,
        textSize: textSize.value,
        infoTextSize: document.getElementById("info-text-size").value,
        textShadowBlur: textShadowBlur.value,
        infoPosition: infoPosition.value,
        textOutlineWidth: textOutlineWidth.value,
        infoShadowBlur: document.getElementById("info-shadow-blur").value,
        infoOutlineWidth: document.getElementById("info-outline-width").value,
        titleInfoSpacing: titleInfoSpacing.value,
        horizontalPosition: horizontalPosition.value, // Include horizontal position for info text
        titleWrapping: document.getElementById("title-wrapping").value,
        showSeasonNumber: seasonNumberDisplay.checked,
        showEpisodeNumber: episodeNumberDisplay.checked,
        textColor: currentColors.textColor || fallbackColors.textColor,
        infoColor: currentColors.infoColor || fallbackColors.infoColor,
        textShadowColor:
          currentColors.textShadowColor || fallbackColors.textShadowColor,
        textOutlineColor:
          currentColors.textOutlineColor || fallbackColors.textOutlineColor,
        infoShadowColor:
          currentColors.infoShadowColor || fallbackColors.infoShadowColor,
        infoOutlineColor:
          currentColors.infoOutlineColor || fallbackColors.infoOutlineColor,
        effectType: effectType.value,
        gradientColor:
          currentColors.gradientColor || fallbackColors.gradientColor,
        gradientOpacity: gradientOpacity.value,
        blendMode: blendMode.value,
      };
    }
  }

  // Switch to single card view
  function showSingleCardView() {
    canvas.style.display = "block";
    gridCanvas.style.display = "none";

    // Show the modular frame below the canvas when in single card view
    document.getElementById("modular-frame").style.display = "block";

    if (hasSearchResults) {
      // Hide the sidebar version of the return button, using the modular frame one instead
      returnToGridBtn.style.display = "none";
    } else {
      returnToGridBtn.style.display = "none";
    }
  }

  // Switch to grid view
  function showGridView() {
    // Save the current episode's data before switching to grid view
    if (selectedCardIndex >= 0 && selectedCardIndex < episodeTitleCards.length) {
      const currentCard = episodeTitleCards[selectedCardIndex];
      
      // Format the numbers based on numberTheme
      const formatNumber = (n) => {
        if (numberTheme === 'plain') return String(Number(n));
        if (numberTheme === 'roman') return toRomanNumeral(Number(n));
        return String(n).padStart(2, "0");
      };
      
      // Update the card's specific properties
      currentCard.title = titleInput.value;
      currentCard.seasonNumber = formatNumber(seasonNumberInput.value);
      currentCard.episodeNumber = formatNumber(episodeNumberInput.value);
    }
    
    canvas.style.display = "none";
    gridCanvas.style.display = "block";
    returnToGridBtn.style.display = "none";
    
    // Hide the modular frame when in grid view
    document.getElementById("modular-frame").style.display = "none";
  }

  // =====================================================
  // CARD DRAWING FUNCTIONS
  // =====================================================

  // Main function to draw a card to the main canvas
  function drawCard() {
    drawCardToContext(ctx, canvas.width, canvas.height);
  }

  // Convert hex color to RGBA format
  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Draw card to a temporary context for grid view
  function drawCardToTempContext(tempCtx, card, width, height) {    // Save original values to restore after drawing
    const originalTitle = titleInput.value;
    const originalSeason = seasonNumberInput.value;
    const originalEpisode = episodeNumberInput.value;
    const originalSeasonDisplay = seasonNumberDisplay.checked;
    const originalEpisodeDisplay = episodeNumberDisplay.checked;
    const originalThumbnail = thumbnailImg;

    const originalFontFamily = fontFamily.value;
    const originalTextSize = textSize.value;
    const originalInfoFontFamily =
      document.getElementById("info-font-family").value;
    const originalInfoTextSize =
      document.getElementById("info-text-size").value;
    const originalTextShadowBlur = textShadowBlur.value;
    const originalTextOutlineWidth = textOutlineWidth.value;
    const originalInfoShadowBlur =
      document.getElementById("info-shadow-blur").value;
    const originalInfoOutlineWidth =
      document.getElementById("info-outline-width").value;
    const originalBlendMode = blendMode.value;
    const originalEffectType = effectType.value;
    const originalPreset = presetSelect.value;

    // Save original colors
    const originalColors = {};
    for (const colorName of [
      "text-color",
      "info-color",
      "text-shadow-color",
      "text-outline-color",
      "info-shadow-color",
      "info-outline-color",
      "gradient-color",
    ]) {
      originalColors[colorName] = window[colorName];
    }

    // Set values for this card
    titleInput.value = card.title;
    seasonNumberInput.value = card.seasonNumber;
    episodeNumberInput.value = card.episodeNumber;
    thumbnailImg = card.thumbnailImg;

    // Check if this card has custom placement settings
    if (card.hasCustomPlacement && card.customPlacement) {
      // Apply custom placement settings
      if (card.customPlacement.placement) {
        presetSelect.value = card.customPlacement.placement;
      }
      if (card.customPlacement.effectType) {
        effectType.value = card.customPlacement.effectType;
      }
      if (card.customPlacement.blendMode) {
        blendMode.value = card.customPlacement.blendMode;
      }
      // Do NOT set horizontalPosition.value or verticalPosition.value here!
    }    // Apply card's saved settings if available
    if (card.currentSettings) {
      fontFamily.value = card.currentSettings.fontFamily;
      document.getElementById("info-font-family").value =
        card.currentSettings.infoFontFamily;
      textSize.value = card.currentSettings.textSize;
      document.getElementById("info-text-size").value =
        card.currentSettings.infoTextSize;
      textShadowBlur.value = card.currentSettings.textShadowBlur;
      textOutlineWidth.value = card.currentSettings.textOutlineWidth;
      document.getElementById("info-shadow-blur").value =
        card.currentSettings.infoShadowBlur;
      document.getElementById("info-outline-width").value =
        card.currentSettings.infoOutlineWidth;
      
      // Apply season/episode display settings
      if (typeof card.currentSettings.showSeasonNumber !== 'undefined') {
        seasonNumberDisplay.checked = card.currentSettings.showSeasonNumber;
      }
      if (typeof card.currentSettings.showEpisodeNumber !== 'undefined') {
        episodeNumberDisplay.checked = card.currentSettings.showEpisodeNumber;
      }
      
      // Only apply these if not overridden by custom placement
      if (!card.hasCustomPlacement || !card.customPlacement) {
        effectType.value = card.currentSettings.effectType;
        blendMode.value = card.currentSettings.blendMode;
      }

      if (document.getElementById("title-wrapping")) {
        document.getElementById("title-wrapping").value =
          card.currentSettings.titleWrapping || "singleLine";
      }

      // Apply colors
      window["text-color"] = card.currentSettings.textColor || "#ffffff";
      window["info-color"] = card.currentSettings.infoColor || "#ffffff";
      window["text-shadow-color"] =
        card.currentSettings.textShadowColor || "#000000";
      window["text-outline-color"] =
        card.currentSettings.textOutlineColor || "#000000";
      window["info-shadow-color"] =
        card.currentSettings.infoShadowColor || "#000000";
      window["info-outline-color"] =
        card.currentSettings.infoOutlineColor || "#000000";
      window["gradient-color"] =
        card.currentSettings.gradientColor || "#000000";
    }

    // Draw the card, passing the card object for per-episode overrides
    drawCardToContext(tempCtx, width, height, card);    // Restore original values
    titleInput.value = originalTitle;
    seasonNumberInput.value = originalSeason;
    episodeNumberInput.value = originalEpisode;
    seasonNumberDisplay.checked = originalSeasonDisplay;
    episodeNumberDisplay.checked = originalEpisodeDisplay;
    thumbnailImg = originalThumbnail;

    fontFamily.value = originalFontFamily;
    textSize.value = originalTextSize;
    document.getElementById("info-font-family").value = originalInfoFontFamily;
    document.getElementById("info-text-size").value = originalInfoTextSize;
    textShadowBlur.value = originalTextShadowBlur;
    textOutlineWidth.value = originalTextOutlineWidth;
    document.getElementById("info-shadow-blur").value = originalInfoShadowBlur;
    document.getElementById("info-outline-width").value =
      originalInfoOutlineWidth;
    blendMode.value = originalBlendMode;
    effectType.value = originalEffectType;
    presetSelect.value = originalPreset;

    // Restore original colors
    for (const [colorName, value] of Object.entries(originalColors)) {
      window[colorName] = value;
    }
  }

function drawCardToContext(targetCtx, width, height, card) {
    // Format season/episode numbers for display
    const formatNumber = (n) => {
      if (numberTheme === 'plain') return String(Number(n));
      if (numberTheme === 'roman') return toRomanNumeral(Number(n));
      return String(n).padStart(2, "0");
    };
    // Clear the canvas
    targetCtx.clearRect(0, 0, width, height);

    // Set black background
    targetCtx.fillStyle = "#000000";
    targetCtx.fillRect(0, 0, width, height);

    // Draw the thumbnail image if available
    if (thumbnailImg) {
      targetCtx.save();
      targetCtx.globalAlpha = 1.0;

      // Calculate draw dimensions
      let drawX = 0, drawY = 0, drawW = width, drawH = height;
      if (!(thumbnailFullsize && thumbnailFullsize.checked)) {
        // Draw maintaining aspect ratio
        const scale = 1.0;
        if (thumbnailImg.width / thumbnailImg.height > width / height) {
          drawH = height * scale;
          drawW = thumbnailImg.width * (drawH / thumbnailImg.height);
        } else {
          drawW = width * scale;
          drawH = thumbnailImg.height * (drawW / thumbnailImg.width);
        }
        drawX = (width - drawW) / 2;
        drawY = (height - drawH) / 2;
      }

      // If spoiler/blur is enabled, draw with blur filter
      if (isSpoilerBlurEnabled()) {
        // Create an offscreen canvas to apply blur
        const offCanvas = document.createElement('canvas');
        offCanvas.width = drawW;
        offCanvas.height = drawH;
        const offCtx = offCanvas.getContext('2d');
        offCtx.filter = 'blur(18px)';
        offCtx.drawImage(thumbnailImg, 0, 0, drawW, drawH);
        targetCtx.drawImage(offCanvas, drawX, drawY, drawW, drawH);
      } else {
        targetCtx.drawImage(thumbnailImg, drawX, drawY, drawW, drawH);
      }
      targetCtx.restore();
    }

    // Apply gradient effects if selected
    if (effectType.value !== "none") {

      // Create a separate canvas for the effect
      const effectCanvas = document.createElement("canvas");
      effectCanvas.width = width;
      effectCanvas.height = height;
      const effectCtx = effectCanvas.getContext("2d");

      let gradient;
      const color = window["gradient-color"] || "#000000";
      const opacity = parseFloat(gradientOpacity.value);
      const alphaColor = hexToRGBA(color, opacity);
      const transparentColor = hexToRGBA(color, 0);      // Create the appropriate gradient based on effect type
      switch (effectType.value) {
        case "leftToRight":
          gradient = effectCtx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, alphaColor);
          gradient.addColorStop(1, transparentColor);
          break;
        case "rightToLeft":
          gradient = effectCtx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, transparentColor);
          gradient.addColorStop(1, alphaColor);
          break;
        case "leftHalf":
          gradient = effectCtx.createLinearGradient(0, 0, width/2, 0);
          gradient.addColorStop(0, alphaColor);
          gradient.addColorStop(1, transparentColor);
          break;
        case "rightHalf":  
          gradient = effectCtx.createLinearGradient(width/2, 0, width, 0);
          gradient.addColorStop(0, transparentColor);
          gradient.addColorStop(1, alphaColor);
          break;
        case "topToBottom":
          gradient = effectCtx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, alphaColor);
          gradient.addColorStop(1, transparentColor);
          break;
        case "bottomToTop":
          gradient = effectCtx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, transparentColor);
          gradient.addColorStop(1, alphaColor);
          break;
        case "topHalf":
          gradient = effectCtx.createLinearGradient(0, 0, 0, height/2);
          gradient.addColorStop(0, alphaColor);
          gradient.addColorStop(1, transparentColor);
          break;
        case "bottomHalf":
          gradient = effectCtx.createLinearGradient(0, height/2, 0, height);
          gradient.addColorStop(0, transparentColor);
          gradient.addColorStop(1, alphaColor);
          break;
        case "radial":
          gradient = effectCtx.createRadialGradient(
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            Math.max(width, height) / 1.5
          );
          gradient.addColorStop(0, transparentColor);
          gradient.addColorStop(1, alphaColor);
          break;
      }

      // Apply the gradient
      effectCtx.fillStyle = gradient;
      effectCtx.fillRect(0, 0, width, height);

      // Apply the gradient effect with the selected blend mode
      targetCtx.save();
      targetCtx.globalCompositeOperation = blendMode.value;
      targetCtx.drawImage(effectCanvas, 0, 0);
      targetCtx.restore();
    }

    // Get layout preset
    const preset =
      presetLayoutConfig[presetSelect.value] ||
      presetLayoutConfig["centerMiddle"];

    // Calculate text sizes based on canvas dimensions
    let titleSize;
    const customTextSize = document.getElementById("custom-text-size");
    if (textSize.value === "custom" && customTextSize && customTextSize.value) {
      titleSize = Math.round(parseInt(customTextSize.value) * (width / 1280));
    } else {
      titleSize = Math.round(parseInt(textSize.value) * (width / 1280));
    }

    let infoSize;
    const infoTextSize = document.getElementById("info-text-size");
    const customInfoTextSize = document.getElementById("custom-info-text-size");
    if (infoTextSize.value === "custom" && customInfoTextSize && customInfoTextSize.value) {
      infoSize = Math.round(parseInt(customInfoTextSize.value) * (width / 1280));
    } else {
      infoSize = Math.round(parseInt(infoTextSize.value) * (width / 1280));
    }

    // Calculate initial position based on preset
    let textBoxX, textBoxY, textAlign, maxWidth;

    switch (preset.position) {
      case "leftBottom":
        textBoxX = Math.round(50 * (width / 1280));
        textBoxY = height - Math.round(180 * (height / 720));
        textAlign = "left";
        maxWidth = width * 0.8;
        break;
      case "centerBottom":
        textBoxX = width / 2;
        textBoxY = height - Math.round(180 * (height / 720));
        textAlign = "center";
        maxWidth = width * 0.9;
        break;
      case "leftMiddle":
        textBoxX = Math.round(50 * (width / 1280));
        textBoxY = height / 2 - Math.round(50 * (height / 720));
        textAlign = "left";
        maxWidth = width * 0.7;
        break;
      case "rightMiddle":
        textBoxX = width - Math.round(50 * (width / 1280));
        textBoxY = height / 2 - Math.round(50 * (height / 720));
        textAlign = "right";
        maxWidth = width * 0.7;
        break;
      case "centerTop":
        textBoxX = width / 2;
        textBoxY = Math.round(120 * (height / 720));
        textAlign = "center";
        maxWidth = width * 0.9;
        break;
      case "centerMiddle":
      default:
        textBoxX = width / 2;
        textBoxY = height / 2 - Math.round(50 * (height / 720));
        textAlign = "center";
        maxWidth = width * 0.8;
    }

    // Get title text
    let titleText = titleInput.value || "";
    const titleUppercase = document.getElementById("title-uppercase").checked;
    const titleLowercase = document.getElementById("title-lowercase").checked;
    const titleBold = document.getElementById("title-bold").checked;
    titleText = applyCaseTransform(titleText, titleUppercase, titleLowercase);

    // Info text parts (i18n)
    let infoText = "";
    let separator = "";
    let seasonText = "";
    let episodeText = "";
    const infoSeasonUppercase = document.getElementById("info-season-uppercase").checked;
    const infoSeasonLowercase = document.getElementById("info-season-lowercase").checked;
    const infoSeasonBold = document.getElementById("info-season-bold").checked;
    const infoEpisodeUppercase = document.getElementById("info-episode-uppercase").checked;
    const infoEpisodeLowercase = document.getElementById("info-episode-lowercase").checked;
    const infoEpisodeBold = document.getElementById("info-episode-bold").checked;

    // Get language map
    const langMap = i18n[currentLang] || i18n['en'];

    if ((seasonNumberInput.value && seasonNumberDisplay.checked) || (episodeNumberInput.value && episodeNumberDisplay.checked)) {
      switch (separatorType.value) {
        case "dash":
          separator = " - ";
          break;
        case "dot":
          separator = " • ";
          break;
        case "pipe":
          separator = " | ";
          break;
        case "space":
          separator = " ";
          break;
        case "none":
          separator = "";
          break;
        default:
          separator = " - ";
      }

      if (seasonNumberInput.value && seasonNumberDisplay.checked) {
        const seriesTypeValue = seriesType.value;
        const seasonNumDisplay = formatNumber(seasonNumberInput.value);
        if (seriesTypeValue === 'regular' || !seriesTypeValue) {
          seasonText = langMap.season + " " + seasonNumDisplay;
        } else if (seriesTypeValue === 'series') {
          seasonText = "Series " + seasonNumDisplay;
        } else {
          switch (seriesTypeValue) {
            case 'limited':
              seasonText = (currentLang === 'en' ? "Limited Series" : langMap.season + " " + seasonNumDisplay);
              break;
            case 'mini':
              seasonText = (currentLang === 'en' ? "Mini-Series" : langMap.season + " " + seasonNumDisplay);
              break;
            case 'anthology':
              seasonText = (currentLang === 'en' ? "Anthology Series" : langMap.season + " " + seasonNumDisplay);
              break;
            case 'special':
              seasonText = (currentLang === 'en' ? "Special" : langMap.season + " " + seasonNumDisplay);
              break;
            default:
              seasonText = langMap.season + " " + seasonNumDisplay;
          }
        }
        seasonText = applyCaseTransform(seasonText, infoSeasonUppercase, infoSeasonLowercase);
      }

      if (episodeNumberInput.value && episodeNumberDisplay.checked) {
        const episodeNumDisplay = formatNumber(episodeNumberInput.value);
        episodeText = langMap.episode + " " + episodeNumDisplay;
        episodeText = applyCaseTransform(episodeText, infoEpisodeUppercase, infoEpisodeLowercase);
      }

      if (seasonText && episodeText) {
        infoText = seasonText + separator + episodeText;
      } else if (seasonText) {
        infoText = seasonText;
      } else if (episodeText) {
        infoText = episodeText;
      }
    }

    // Setup font settings
    let fontSizeAdjustment = 1;
    if (fontFamily.value === "Exo 2") {
      fontSizeAdjustment = 1.2;
    }
    // Support custom font selection
    let fontToUse;
    if (fontFamily.value && fontFamily.value.startsWith('custom-')) {
      fontToUse = fontFamily.value.replace('custom-', '');
    } else {
      fontToUse = fontFamily.value;
    }

    // Configure info font
    const infoFontFamily = document.getElementById("info-font-family");
    let infoFontToUse;
    if (infoFontFamily.value === "same-as-title") {
      infoFontToUse = fontToUse;
    } else if (infoFontFamily.value && infoFontFamily.value.startsWith('custom-')) {
      infoFontToUse = infoFontFamily.value.replace('custom-', '');
    } else {
      infoFontToUse = infoFontFamily.value;
    }

    let infoFontSizeAdjustment = 1;
    if (infoFontToUse === "Exo 2") {
      infoFontSizeAdjustment = 1.2;
    }

    // Calculate title wrapping parameters
    const titleWrappingMode = document.getElementById("title-wrapping")
      ? document.getElementById("title-wrapping").value
      : "singleLine";

    // Calculate a predefined max width based on text alignment and canvas size
    let titleMaxWidth;
    switch (textAlign) {
      case "left":
        // Make left-aligned text have more width to work with
        titleMaxWidth = Math.min(width * 0.45, 650 * (width / 1280));
        break;
      case "right":
        // Make right-aligned text have more width to work with
        titleMaxWidth = Math.min(width * 0.45, 650 * (width / 1280));
        break;
      case "center":
      default:
        // For center text, we want a narrower width to encourage breaks at natural points
        titleMaxWidth = Math.min(width * 0.45, 650 * (width / 1280));
    }

    // Adjust width based on title length - modified to create more natural breaks
    if (titleText.length > 35) {
      // For very long titles, keep them narrow for better readability
      titleMaxWidth = Math.min(titleMaxWidth, 600 * (width / 1280));
    } else if (titleText.length > 25) {
      // For medium-long titles, slightly narrower than default
      titleMaxWidth = Math.min(titleMaxWidth, 625 * (width / 1280));
    } else if (titleText.length > 15) {
      // For shorter titles that might still need wrapping
      titleMaxWidth = Math.min(titleMaxWidth, 650 * (width / 1280));
    }

    // Determine if we should wrap
    let shouldWrap = false;
    if (titleWrappingMode === "multiLine") {
      shouldWrap = true;
    } else if (titleWrappingMode === "autoWrap") {
      // Configure temp context to measure text
      targetCtx.save();
      const tFont = `${Math.round(
        titleSize * fontSizeAdjustment
      )}px "${fontToUse}", sans-serif`;
      targetCtx.font = tFont;
      // Auto wrap if the title exceeds the max width or is longer than threshold
      const titleWidth = targetCtx.measureText(titleText).width;
      shouldWrap = titleText.length > 20 || titleWidth > titleMaxWidth * 0.9;
      targetCtx.restore();
    } else {
      shouldWrap = false;
    }

    // Function to wrap text
    const wrapTextFunc = (text, maxWidth) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = targetCtx.measureText(currentLine + " " + word).width;

        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      lines.push(currentLine);
      return lines;
    };

    // Get info position setting
    const infoPositionSetting = infoPosition ? infoPosition.value : "below";


    // --- Custom Placement Per-Episode Offset Override ---
    let rawHorizontalOffset, rawVerticalOffset;
    if (typeof card !== 'undefined' && card.hasCustomPlacement && card.customPlacement) {
      // Use per-episode offsets if present
      rawHorizontalOffset = parseInt(card.customPlacement.textXOffset || 0);
      rawVerticalOffset = parseInt(card.customPlacement.textYOffset || 0);
    } else {
      rawHorizontalOffset = parseInt(horizontalPosition.value);
      rawVerticalOffset = parseInt(verticalPosition.value);
    }
    // Scale the offsets based on screen size
    const scaledOffset = rawHorizontalOffset * (width / 1280);
    const scaledYOffset = rawVerticalOffset * (height / 720);

    // Calculate the actual offset based on text alignment
    let horizontalOffset;
    if (textAlign === "center") {
      horizontalOffset = scaledOffset;
    } else if (textAlign === "right") {
      horizontalOffset = -scaledOffset;
    } else {
      horizontalOffset = scaledOffset;
    }

    // Calculate and draw based on the info position setting
    // Apply vertical offset to the entire text block (title and info)
    if (infoPositionSetting === "above" && infoText) {
      // CASE: INFO ABOVE TITLE

      // First calculate total text block height to position properly
      const spacing = parseInt(titleInfoSpacing.value) * (height / 720);

      // Calculate title height based on wrapping
      let titleHeight;
      let titleLines = [];

      // Setup font for measuring
      targetCtx.save();
      const tFont = `${Math.round(
        titleSize * fontSizeAdjustment
      )}px "${fontToUse}", sans-serif`;
      targetCtx.font = tFont;

      if (shouldWrap) {
        titleLines = wrapTextFunc(titleText, titleMaxWidth);
        
        // Get the line spacing value from the slider
        const lineSpacingElement = document.getElementById("line-spacing");
        const lineSpacingMultiplier = lineSpacingElement ? parseFloat(lineSpacingElement.value) : 1.2;
        
        // Calculate total height based on line spacing
        const lineHeight = Math.round(titleSize * lineSpacingMultiplier);
        titleHeight = titleLines.length * lineHeight;
      } else {
        titleHeight = titleSize;
      }
      targetCtx.restore();

      // Calculate total block height (info text + spacing + title text)
      const totalBlockHeight = infoSize + spacing + titleHeight;

      // Calculate vertical starting position to center the entire block
      let startY;
      if (preset.position.includes("Top")) {
        startY = textBoxY + scaledYOffset;
      } else if (preset.position.includes("Bottom")) {
        startY = height - Math.round(180 * (height / 720)) - totalBlockHeight + scaledYOffset;
      } else {
        startY = height / 2 - totalBlockHeight / 2 + scaledYOffset;
      }

      // Draw info text
      const infoY = startY;
      const infoX = textBoxX + horizontalOffset;

      targetCtx.save();
      const iFont = `${Math.round(
        infoSize * infoFontSizeAdjustment
      )}px "${infoFontToUse}", sans-serif`;
      targetCtx.font = iFont;
      targetCtx.textAlign = textAlign;
      targetCtx.textBaseline = "top";

      // Setup info shadow
      const infoShadowBlur = document.getElementById("info-shadow-blur");
      const infoOutlineWidth = document.getElementById("info-outline-width");

      targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
      targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
      targetCtx.shadowOffsetX = 1 * (width / 1280);
      targetCtx.shadowOffsetY = 1 * (height / 720);

      // --- Info text font weight and span logic ---
      // If both season and episode are present, and above title, allow separate bold/uppercase for each
      let infoTextToDraw = infoText;
      let infoFontWeight = "normal";
      let useSpan = false;
      let seasonDraw = seasonText;
      let episodeDraw = episodeText;
      // Only split and style if both are present and above title
      if (infoPositionSetting === "above" && seasonText && episodeText) {
        useSpan = true;
        // Apply uppercase
        if (infoSeasonUppercase) seasonDraw = seasonDraw.toUpperCase();
        if (infoEpisodeUppercase) episodeDraw = episodeDraw.toUpperCase();
        // Draw season/sep/episode as a block, always left-to-right, with correct alignment
        let x = infoX;
        let y = infoY;
        let align = textAlign;
        // Measure widths for each part
        targetCtx.save();
        targetCtx.font = `${infoSeasonBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        let seasonWidth = targetCtx.measureText(seasonDraw).width;
        targetCtx.restore();

        targetCtx.save();
        targetCtx.font = `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        let sepWidth = targetCtx.measureText(separator).width;
        targetCtx.restore();

        targetCtx.save();
        targetCtx.font = `${infoEpisodeBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        let episodeWidth = targetCtx.measureText(episodeDraw).width;
        targetCtx.restore();

        // Calculate total width and starting X for correct order and alignment
        let totalWidth = seasonWidth + sepWidth + episodeWidth;
        let startX = x;
        if (align === "center") {
          startX = x - totalWidth / 2;
        } else if (align === "right") {
          startX = x - totalWidth;
        }
        let seasonX = startX;
        let sepX = seasonX + seasonWidth;
        let episodeX = sepX + sepWidth;

        // Draw season part
        targetCtx.save();
        targetCtx.font = `${infoSeasonBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        targetCtx.textAlign = "left";
        targetCtx.textBaseline = "top";
        if (parseInt(infoOutlineWidth.value) > 0) {
          targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
          targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
          targetCtx.strokeText(seasonDraw, seasonX, y, maxWidth);
        }
        targetCtx.fillStyle = window["info-color"] || "#ffffff";
        targetCtx.fillText(seasonDraw, seasonX, y, maxWidth);
        targetCtx.restore();

        // Draw separator
        targetCtx.save();
        targetCtx.font = `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        targetCtx.textAlign = "left";
        targetCtx.textBaseline = "top";
        targetCtx.fillStyle = window["info-color"] || "#ffffff";
        targetCtx.fillText(separator, sepX, y, maxWidth);
        targetCtx.restore();

        // Draw episode part
        targetCtx.save();
        targetCtx.font = `${infoEpisodeBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        targetCtx.textAlign = "left";
        targetCtx.textBaseline = "top";
        if (parseInt(infoOutlineWidth.value) > 0) {
          targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
          targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
          targetCtx.strokeText(episodeDraw, episodeX, y, maxWidth);
        }
        targetCtx.fillStyle = window["info-color"] || "#ffffff";
        targetCtx.fillText(episodeDraw, episodeX, y, maxWidth);
        targetCtx.restore();
      } else {
        // Not both present or not above title: treat as one string, apply bold if either is checked (even when below)
        infoFontWeight = (seasonText && infoSeasonBold) || (episodeText && infoEpisodeBold) ? "bold" : "normal";
        // Apply uppercase if set
        if (seasonText && infoSeasonUppercase) infoTextToDraw = infoTextToDraw.replace(seasonText, seasonText.toUpperCase());
        if (episodeText && infoEpisodeUppercase) infoTextToDraw = infoTextToDraw.replace(episodeText, episodeText.toUpperCase());
        // Draw info text outline if enabled
        if (parseInt(infoOutlineWidth.value) > 0) {
          targetCtx.save();
          targetCtx.font = `${infoFontWeight} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
          targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
          targetCtx.strokeText(infoTextToDraw, infoX, infoY, maxWidth);
          targetCtx.restore();
        }
        // Draw info text fill
        targetCtx.fillStyle = window["info-color"] || "#ffffff";
        targetCtx.font = `${infoFontWeight} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
        targetCtx.fillText(infoTextToDraw, infoX, infoY, maxWidth);
      }
      targetCtx.restore();

      // Calculate where title should go (below info)
      const titleY = infoY + infoSize + spacing;

      // Draw title text with adjusted position
      targetCtx.save();
      targetCtx.font = `${titleBold ? "bold" : "normal"} ${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;
      targetCtx.textAlign = textAlign;
      targetCtx.textBaseline = "top";

      targetCtx.shadowColor = window["text-shadow-color"] || "#000000";
      targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
      targetCtx.shadowOffsetX = 2 * (width / 1280);
      targetCtx.shadowOffsetY = 2 * (height / 720);

      targetCtx.fillStyle = window["text-color"] || "#ffffff";

      if (shouldWrap) {
        // Get the line spacing value from the slider for multi-line title
        const lineSpacingElement = document.getElementById("line-spacing");
        const lineSpacingMultiplier = lineSpacingElement ? parseFloat(lineSpacingElement.value) : 1.2;
        
        // Set the line height based on the line spacing slider value
        const lineHeight = Math.round(titleSize * lineSpacingMultiplier);

        // Draw each line
        titleLines.forEach((line, index) => {
          const y = titleY + index * lineHeight;
          const x = textBoxX + horizontalOffset;
          let drawLine = titleUppercase ? line.toUpperCase() : line;
          if (parseInt(textOutlineWidth.value) > 0) {
            targetCtx.lineWidth =
              parseInt(textOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["text-outline-color"] || "#000000";
            targetCtx.strokeText(drawLine, x, y, titleMaxWidth);
          }
          targetCtx.fillText(drawLine, x, y, titleMaxWidth);
        });
      } else {
        // Single line title
        const x = textBoxX + horizontalOffset;
        let drawLine = titleUppercase ? titleText.toUpperCase() : titleText;
        if (parseInt(textOutlineWidth.value) > 0) {
          targetCtx.lineWidth =
            parseInt(textOutlineWidth.value) * (width / 1280);
          targetCtx.strokeStyle = window["text-outline-color"] || "#000000";
          targetCtx.strokeText(drawLine, x, titleY, maxWidth);
        }
        targetCtx.fillText(drawLine, x, titleY, maxWidth);
      }

      targetCtx.restore();

    } else {
      // CASE: INFO BELOW TITLE (or no info text)
      // Draw title text
      targetCtx.save();
      const tFont = `${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;
      targetCtx.font = `${titleBold ? "bold" : "normal"} ${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;
      targetCtx.textAlign = textAlign;
      targetCtx.textBaseline = "top";

      targetCtx.shadowColor = window["text-shadow-color"] || "#000000";
      targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
      targetCtx.shadowOffsetX = 2 * (width / 1280);
      targetCtx.shadowOffsetY = 2 * (height / 720);

      targetCtx.fillStyle = window["text-color"] || "#ffffff";

      let infoY;
      if (shouldWrap && titleText.length > 15) {
        // Handle multi-line text
        const lineSpacingElement = document.getElementById("line-spacing");
        const lineSpacingMultiplier = lineSpacingElement ? parseFloat(lineSpacingElement.value) : 1.2;
        const lineHeight = Math.round(titleSize * lineSpacingMultiplier);
        const lines = wrapTextFunc(titleText, titleMaxWidth);
        const totalTextHeight = lines.length * lineHeight;

        // Determine starting Y position
        let startY;
        if (preset.position.includes("Top")) {
          startY = textBoxY + scaledYOffset;
        } else if (preset.position.includes("Bottom")) {
          startY = textBoxY - totalTextHeight + lineHeight + scaledYOffset;
        } else {
          startY = textBoxY - totalTextHeight / 2 + lineHeight / 2 + scaledYOffset;
        }

        // Draw each line
        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          const x = textBoxX + horizontalOffset;
          let drawLine = titleUppercase ? line.toUpperCase() : line;
          if (parseInt(textOutlineWidth.value) > 0) {
            targetCtx.lineWidth =
              parseInt(textOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["text-outline-color"] || "#000000";
            targetCtx.strokeText(drawLine, x, y, titleMaxWidth);
          }
          targetCtx.fillText(drawLine, x, y, titleMaxWidth);
        });

        // Calculate position for info text
        const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
        infoY = startY + totalTextHeight + spacing;
      } else {
        // Single line title
        const x = textBoxX + horizontalOffset;
        let drawLine = titleUppercase ? titleText.toUpperCase() : titleText;
        if (parseInt(textOutlineWidth.value) > 0) {
          targetCtx.lineWidth =
            parseInt(textOutlineWidth.value) * (width / 1280);
          targetCtx.strokeStyle = window["text-outline-color"] || "#000000";
          targetCtx.strokeText(drawLine, x, textBoxY + scaledYOffset, maxWidth);
        }
        targetCtx.fillText(drawLine, x, textBoxY + scaledYOffset, maxWidth);

        // Calculate position for info text
        const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
        infoY = textBoxY + titleSize + spacing + scaledYOffset;
      }

      targetCtx.restore();

      // Draw info text if needed
      if (infoPositionSetting === "below" && infoText) {
        // --- Draw season/sep/episode as a block, with bold/uppercase toggles, just like above ---
        let infoX = textBoxX + horizontalOffset;
        let y = infoY;
        let align = textAlign;
        const infoShadowBlur = document.getElementById("info-shadow-blur");
        const infoOutlineWidth = document.getElementById("info-outline-width");

        // If both season and episode are present, draw separately with separator and correct alignment
        if (seasonText && episodeText) {
          let seasonDraw = seasonText;
          let episodeDraw = episodeText;
          if (infoSeasonUppercase) seasonDraw = seasonDraw.toUpperCase();
          if (infoEpisodeUppercase) episodeDraw = episodeDraw.toUpperCase();

          // Measure widths for each part
          targetCtx.save();
          targetCtx.font = `${infoSeasonBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          let seasonWidth = targetCtx.measureText(seasonDraw).width;
          targetCtx.restore();

          targetCtx.save();
          targetCtx.font = `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          let sepWidth = targetCtx.measureText(separator).width;
          targetCtx.restore();

          targetCtx.save();
          targetCtx.font = `${infoEpisodeBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          let episodeWidth = targetCtx.measureText(episodeDraw).width;
          targetCtx.restore();

          // Calculate total width and starting X for correct order and alignment
          let totalWidth = seasonWidth + sepWidth + episodeWidth;
          let startX = infoX;
          if (align === "center") {
            startX = infoX - totalWidth / 2;
          } else if (align === "right") {
            startX = infoX - totalWidth;
          }
          let seasonX = startX;
          let sepX = seasonX + seasonWidth;
          let episodeX = sepX + sepWidth;

          // Draw season part
          targetCtx.save();
          targetCtx.font = `${infoSeasonBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = "left";
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          if (parseInt(infoOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
            targetCtx.strokeText(seasonDraw, seasonX, y, maxWidth);
          }
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(seasonDraw, seasonX, y, maxWidth);
          targetCtx.restore();

          // Draw separator
          targetCtx.save();
          targetCtx.font = `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = "left";
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(separator, sepX, y, maxWidth);
          targetCtx.restore();

          // Draw episode part
          targetCtx.save();
          targetCtx.font = `${infoEpisodeBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = "left";
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          if (parseInt(infoOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
            targetCtx.strokeText(episodeDraw, episodeX, y, maxWidth);
          }
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(episodeDraw, episodeX, y, maxWidth);
          targetCtx.restore();
        } else if (seasonText) {
          // Only season present
          let seasonDraw = seasonText;
          if (infoSeasonUppercase) seasonDraw = seasonDraw.toUpperCase();
          targetCtx.save();
          targetCtx.font = `${infoSeasonBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = align;
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          if (parseInt(infoOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
            targetCtx.strokeText(seasonDraw, infoX, y, maxWidth);
          }
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(seasonDraw, infoX, y, maxWidth);
          targetCtx.restore();
        } else if (episodeText) {
          // Only episode present
          let episodeDraw = episodeText;
          if (infoEpisodeUppercase) episodeDraw = episodeDraw.toUpperCase();
          targetCtx.save();
          targetCtx.font = `${infoEpisodeBold ? "bold" : "normal"} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = align;
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          if (parseInt(infoOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
            targetCtx.strokeText(episodeDraw, infoX, y, maxWidth);
          }
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(episodeDraw, infoX, y, maxWidth);
          targetCtx.restore();
        } else {
          // Fallback: treat as one string, apply bold if either is checked
          let infoTextToDraw = infoText;
          let infoFontWeight = (seasonText && infoSeasonBold) || (episodeText && infoEpisodeBold) ? "bold" : "normal";
          if (seasonText && infoSeasonUppercase) infoTextToDraw = infoTextToDraw.replace(seasonText, seasonText.toUpperCase());
          if (episodeText && infoEpisodeUppercase) infoTextToDraw = infoTextToDraw.replace(episodeText, episodeText.toUpperCase());
          targetCtx.save();
          targetCtx.font = `${infoFontWeight} ${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
          targetCtx.textAlign = align;
          targetCtx.textBaseline = "top";
          targetCtx.shadowColor = window["info-shadow-color"] || "#000000";
          targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
          targetCtx.shadowOffsetX = 1 * (width / 1280);
          targetCtx.shadowOffsetY = 1 * (height / 720);
          if (parseInt(infoOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window["info-outline-color"] || "#000000";
            targetCtx.strokeText(infoTextToDraw, infoX, y, maxWidth);
          }
          targetCtx.fillStyle = window["info-color"] || "#ffffff";
          targetCtx.fillText(infoTextToDraw, infoX, y, maxWidth);
          targetCtx.restore();
        }
      }
    }
  }

  // =====================================================
  // TMDB API INTEGRATION FUNCTIONS
  // =====================================================

  // Search for a show by name
  async function searchShow(query) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      return data.results;
    } catch (err) {
      console.error("Error searching for show:", err);
      return [];
    }
  }

  // Get detailed information about a show
  async function getShowDetails(showId, lang = currentLang) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}&language=${lang}`
      );
      return await response.json();
    } catch (err) {
      console.error("Error fetching show details:", err);
      return null;
    }
  }

  // Get detailed information about a specific season
  async function getSeasonDetails(showId, seasonNumber, lang = currentLang) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=${lang}`
      );
      return await response.json();
    } catch (err) {
      console.error("Error fetching season details:", err);
      return null;
    }
  }

  // Get images for a specific episode
  async function getEpisodeImages(showId, seasonNumber, episodeNumber) {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.stills || [];
    } catch (err) {
      console.error("Error fetching episode images:", err);
      return [];
    }
  }

  // Load episode thumbnail from TMDB
  async function getEpisodeThumbnail(path) {
    if (!path) return null;

    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      return new Promise((resolve, reject) => {
        // Set a 10-second timeout to prevent hanging
        const timeout = setTimeout(() => {
          console.warn(`[getEpisodeThumbnail] Timeout loading image: ${path}`);
          reject(new Error("Image load timeout"));
        }, 10000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          console.error(`[getEpisodeThumbnail] Failed to load image: ${path}`);
          reject(new Error("Failed to load image"));
        };
        img.src = `${TMDB_IMG_BASE_URL}original${path}`;
      });
    } catch (err) {
      console.error("Error loading episode thumbnail:", err);
      return null;
    }
  }
  // =====================================================
  // SEARCH & SHOW SELECTION UI
  // =====================================================

  // Background cache for all season artwork
  const artworkCache = new Map();
  let isCachingInProgress = false;

  // Create/update background cache notification (separate from main progress)
  function updateBackgroundCacheNotification(progress, message) {
    let notification = document.getElementById("background-cache-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.id = "background-cache-notification";
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.right = "20px";
      notification.style.width = "320px";
      notification.style.backgroundColor = "rgba(22, 24, 48, 0.95)";
      notification.style.borderRadius = "12px";
      notification.style.padding = "16px 20px";
      notification.style.zIndex = "10000"; // Higher than regular progress
      notification.style.backdropFilter = "blur(8px)";
      notification.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(142, 36, 170, 0.3)";
      notification.style.border = "1px solid rgba(142, 36, 170, 0.4)";
      notification.style.transition = "all 0.3s ease";
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";
      }, 10);

      // Create spinner
      const spinner = document.createElement("div");
      spinner.className = "background-cache-spinner";
      spinner.style.border = "2px solid rgba(255, 255, 255, 0.1)";
      spinner.style.borderTop = "2px solid #8e24aa";
      spinner.style.borderRadius = "50%";
      spinner.style.width = "20px";
      spinner.style.height = "20px";
      spinner.style.animation = "spin 1s linear infinite";
      spinner.style.display = "inline-block";
      spinner.style.marginRight = "12px";
      spinner.style.verticalAlign = "middle";

      // Create header with spinner and message
      const headerEl = document.createElement("div");
      headerEl.style.display = "flex";
      headerEl.style.alignItems = "center";
      headerEl.style.marginBottom = "12px";
      headerEl.appendChild(spinner);

      const messageEl = document.createElement("div");
      messageEl.id = "background-cache-message";
      messageEl.style.color = "white";
      messageEl.style.fontSize = "14px";
      messageEl.style.fontWeight = "600";
      messageEl.style.fontFamily = "Gabarito, sans-serif";
      messageEl.style.flex = "1";
      messageEl.textContent = "Caching seasons...";
      headerEl.appendChild(messageEl);
      notification.appendChild(headerEl);

      // Create progress container
      const progressContainer = document.createElement("div");
      progressContainer.id = "background-cache-progress-container";
      progressContainer.style.width = "100%";
      progressContainer.style.height = "4px";
      progressContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      progressContainer.style.borderRadius = "2px";
      progressContainer.style.marginBottom = "8px";
      progressContainer.style.overflow = "hidden";

      const progressBar = document.createElement("div");
      progressBar.id = "background-cache-progress-bar";
      progressBar.style.width = "0%";
      progressBar.style.height = "100%";
      progressBar.style.background = "linear-gradient(90deg, #8e24aa, #00bfa5)";
      progressBar.style.transition = "width 0.3s ease";
      progressBar.style.borderRadius = "2px";

      progressContainer.appendChild(progressBar);
      notification.appendChild(progressContainer);

      // Create details element
      const detailsEl = document.createElement("div");
      detailsEl.id = "background-cache-details";
      detailsEl.style.color = "rgba(255, 255, 255, 0.6)";
      detailsEl.style.fontSize = "12px";
      detailsEl.style.fontFamily = "Gabarito, sans-serif";
      detailsEl.style.marginBottom = "8px";
      notification.appendChild(detailsEl);
      
      // Create status element for current activity
      const statusEl = document.createElement("div");
      statusEl.id = "background-cache-status";
      statusEl.style.color = "rgba(0, 191, 165, 0.9)";
      statusEl.style.fontSize = "11px";
      statusEl.style.fontFamily = "Gabarito, sans-serif";
      statusEl.style.fontWeight = "500";
      notification.appendChild(statusEl);
    }

    // Update progress bar and message
    const progressBar = document.getElementById("background-cache-progress-bar");
    const detailsEl = document.getElementById("background-cache-details");
    const statusEl = document.getElementById("background-cache-status");
    
    if (progressBar) {
      progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
    
    if (detailsEl && message) {
      detailsEl.textContent = message;
    }
  }
  
  function updateBackgroundCacheStatus(status) {
    const statusEl = document.getElementById("background-cache-status");
    if (statusEl) {
      statusEl.textContent = status;
    }
  }

  function hideBackgroundCacheNotification() {
    const notification = document.getElementById("background-cache-notification");
    if (notification) {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  // Background cache all seasons for a show
  async function cacheAllSeasonArtwork(show) {
    console.log('[cacheAllSeasonArtwork] Starting...', { isCachingInProgress });
    if (isCachingInProgress) {
      console.log('[cacheAllSeasonArtwork] Already caching, skipping');
      return;
    }
    isCachingInProgress = true;

    const seasonsToCache = show.seasons.filter(s => s.episode_count > 0);
    const totalSeasons = seasonsToCache.length;
    console.log(`[cacheAllSeasonArtwork] Caching ${totalSeasons} seasons`);
    let cachedSeasons = 0;

    // Cache all seasons in parallel for faster loading
    const cachePromises = seasonsToCache.map(async (season) => {
      const cacheKey = `${show.id}-${season.season_number}`;
      
      console.log(`[cacheAllSeasonArtwork] Processing season ${season.season_number}...`);
      
      // Skip if already cached
      if (artworkCache.has(cacheKey)) {
        console.log(`[cacheAllSeasonArtwork] Season ${season.season_number} already cached`);
        cachedSeasons++;
        updateBackgroundCacheNotification(
          Math.floor((cachedSeasons / totalSeasons) * 100),
          `${cachedSeasons}/${totalSeasons} seasons cached`
        );
        return;
      }

      try {
        updateBackgroundCacheNotification(
          Math.floor((cachedSeasons / totalSeasons) * 100),
          `${cachedSeasons}/${totalSeasons} seasons cached`
        );
        updateBackgroundCacheStatus(`Fetching ${season.name}...`);

        console.log(`[cacheAllSeasonArtwork] Fetching season ${season.season_number} details...`);
        const seasonData = await getSeasonDetails(show.id, season.season_number, currentLang);
        console.log(`[cacheAllSeasonArtwork] Got season ${season.season_number} data, ${seasonData?.episodes?.length} episodes`);
        
        if (seasonData && seasonData.episodes) {
          // Pre-load all episode images BEFORE marking as cached
          const episodeImageData = [];
          
          console.log(`[cacheAllSeasonArtwork] Loading images for ${seasonData.episodes.length} episodes in season ${season.season_number}...`);
          updateBackgroundCacheStatus(`Loading ${seasonData.episodes.length} episode images for ${season.name}...`);
          
          for (const episode of seasonData.episodes) {
            let episodeImages = null;
            if (episode.still_path) {
              try {
                const additionalImages = await getEpisodeImages(
                  show.id,
                  episode.season_number,
                  episode.episode_number
                );
                
                if (additionalImages && additionalImages.length > 0) {
                  // Sort by resolution
                  additionalImages.sort((a, b) => {
                    const aRes = (a.width || 0) * (a.height || 0);
                    const bRes = (b.width || 0) * (b.height || 0);
                    return bRes - aRes;
                  });
                  
                  // Store image metadata but DON'T pre-load the actual images
                  // This makes caching much faster
                  episodeImages = additionalImages;
                }
              } catch (err) {
                console.error(`[cacheAllSeasonArtwork] Error loading images for S${season.season_number}E${episode.episode_number}:`, err);
              }
            }
            
            // Store the image data for this episode
            episodeImageData.push({
              episodeNumber: episode.episode_number,
              images: episodeImages
            });
          }
          
          console.log(`[cacheAllSeasonArtwork] Season ${season.season_number} fully loaded, saving to cache`);
          console.log(`[cacheAllSeasonArtwork] Rendering episode cards for season ${season.season_number}...`);
          updateBackgroundCacheStatus(`Rendering ${seasonData.episodes.length} cards for ${season.name}...`);
          
          // Render the episode cards now and capture the returned array (using local array to avoid race conditions)
          const renderedCards = await createEpisodeTitleCards(seasonData.episodes, true, episodeImageData, true);
          console.log(`[cacheAllSeasonArtwork] Captured ${renderedCards.length} rendered cards for season ${season.season_number}`);
          
          // NOW store season data in cache with pre-rendered cards
          artworkCache.set(cacheKey, {
            seasonData,
            episodeImageData,
            renderedCards: renderedCards, // Use the returned cards array
            timestamp: Date.now()
          });

          cachedSeasons++;
          updateBackgroundCacheNotification(
            Math.floor((cachedSeasons / totalSeasons) * 100),
            `${cachedSeasons}/${totalSeasons} seasons cached`
          );
          
          console.log(`[cacheAllSeasonArtwork] Season ${season.season_number} cached successfully (${cachedSeasons}/${totalSeasons})`);
        }
      } catch (err) {
        console.error(`[cacheAllSeasonArtwork] Failed to cache season ${season.season_number}:`, err);
        cachedSeasons++;
      }
    });

    // Wait for all seasons to finish caching
    console.log('[cacheAllSeasonArtwork] Waiting for all seasons to cache...');
    await Promise.all(cachePromises);
    console.log('[cacheAllSeasonArtwork] All seasons cached!');

    updateBackgroundCacheNotification(100, `All ${totalSeasons} seasons cached!`);
    updateBackgroundCacheStatus('Caching complete ✓');
    
    // Show the download all seasons and select seasons options in the modal
    const downloadAllSeasonsOption = document.getElementById("downloadAllSeasonsOption");
    const downloadSelectSeasonsOption = document.getElementById("downloadSelectSeasonsOption");
    if (downloadAllSeasonsOption) {
      downloadAllSeasonsOption.style.display = "flex";
    }
    if (downloadSelectSeasonsOption) {
      downloadSelectSeasonsOption.style.display = "flex";
    }
    
    setTimeout(hideBackgroundCacheNotification, 2000);
    isCachingInProgress = false;
  }

  // Display search results in the UI
  function displaySearchResults(results) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (!results || results.length === 0) {
      resultsContainer.innerHTML =
        '<div class="no-results">No shows found</div>';
      return;
    }

    results.forEach((show) => {
      const showEl = document.createElement("div");
      showEl.className = "search-result";

      let posterUrl = show.poster_path
        ? `${TMDB_IMG_BASE_URL}w92${show.poster_path}`
        : "../assets/mediux.svg";

      showEl.innerHTML = `
                <img src="${posterUrl}" alt="${show.name}" class="show-poster">
                <div class="show-info">
                    <h4>${show.name}</h4>
                    <span class="year">${
                      show.first_air_date
                        ? show.first_air_date.substring(0, 4)
                        : "Unknown"
                    }</span>
                </div>
            `;

      showEl.addEventListener("click", async () => {
        document.getElementById("season-selector").innerHTML =
          '<div class="loading">Loading show details...</div>';
        await selectShow(show.id);
        resultsContainer.innerHTML = "";
        searchInput.value = show.name;
      });

      resultsContainer.appendChild(showEl);
    });
  }
  // Handle show selection from search results
  async function selectShow(showId) {
    const showDetails = await getShowDetails(showId, currentLang);
    if (!showDetails) return;

    currentShowData = showDetails;
    isTMDBMode = true;
    hasSearchResults = true;

    displaySeasonSelector(showDetails);
    
    // Start background caching IMMEDIATELY (don't await - let it run in background)
    console.log('[selectShow] Starting background cache...');
    cacheAllSeasonArtwork(showDetails).then(() => {
      console.log('[selectShow] Background caching complete!');
    }).catch(err => {
      console.error('[selectShow] Background caching error:', err);
    });
    
    // Load the first season in parallel with caching
    console.log('[selectShow] Loading first season...');
    const firstSeasonNumber = Math.min(...(showDetails.seasons.map(s => s.season_number)));
    await selectSeason(firstSeasonNumber);
    showGridView();
    console.log('[selectShow] First season loaded, cache running in background');
  }
    // Expose the show selection handler for the Sonarr dashboard
  window.handleShowSelection = async function(show) {
    if (!show || !show.id) {
      console.error("Invalid show data provided to handleShowSelection");
      return;
    }
    
    try {
      // Clear search results
      const resultsContainer = document.getElementById("search-results");
      if (resultsContainer) {
        resultsContainer.innerHTML = "";
      }
      
      // Set loading indicator with appropriate source message
      const seasonSelector = document.getElementById("season-selector");
      if (seasonSelector) {
        const sourceText = show.source === 'sonarr' ? 'Sonarr' : 'TMDB';
        seasonSelector.innerHTML = `<div class="loading">Loading show details from ${sourceText}...</div>`;
      }
      
      // Update search input if it exists
      const searchInput = document.getElementById("show-search-input");
      if (searchInput) {
        // Add a Sonarr badge if the show is from Sonarr
        if (show.source === 'sonarr') {
          searchInput.value = `${show.name} [Sonarr]`;
        } else {
          searchInput.value = show.name;
        }
      }
      
      // Process the selected show
      await selectShow(show.id);
    } catch (error) {
      console.error("Error in handleShowSelection:", error);
      alert("Could not load the selected show. Please try again.");
    }
  };

  // Display season selector dropdown for a show
  function displaySeasonSelector(show) {
    const seasonSelector = document.getElementById("season-selector");
    seasonSelector.innerHTML = "";

    if (show.seasons.length === 0) {
      seasonSelector.innerHTML =
        '<div class="no-results">No seasons found</div>';
      return;
    }

    const selectEl = document.createElement("select");
    selectEl.id = "season-select";


    // Always include all seasons, including specials (season_number === 0)
    const seasons = show.seasons;

    seasons.forEach((season) => {
      // Optionally, label specials more clearly
      let label = `Season ${season.season_number} (${season.episode_count} episodes)`;
      if (season.season_number === 0) {
        label = `Specials (${season.episode_count} episodes)`;
      }
      const option = document.createElement("option");
      option.value = season.season_number;
      option.textContent = label;
      selectEl.appendChild(option);
    });

    selectEl.addEventListener("change", () => {
      const selectedSeason = parseInt(selectEl.value);
      selectSeason(selectedSeason);
    });

    seasonSelector.appendChild(selectEl);
  }  // Handle season selection from dropdown
  async function selectSeason(seasonNumber) {
    currentSeasonNumber = seasonNumber;

    // Store and ensure color settings persist across season changes
    // This is crucial for maintaining user color selections
    if (Pickr.all) {
      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
        
        const id = pickr._root.button.id;
        if (pickr.getColor && typeof pickr.getColor === "function") {
          const colorValue = pickr.getColor().toHEXA().toString();
          
          // Persist color values in the global window variables
          if (id === "text-color-pickr") {
            window["text-color"] = colorValue;
          } else if (id === "info-color-pickr") {
            window["info-color"] = colorValue;
          } else if (id === "text-shadow-color-pickr") {
            window["text-shadow-color"] = colorValue;
          } else if (id === "text-outline-color-pickr") {
            window["text-outline-color"] = colorValue;
          } else if (id === "info-shadow-color-pickr") {
            window["info-shadow-color"] = colorValue;
          } else if (id === "info-outline-color-pickr") {
            window["info-outline-color"] = colorValue;
          } else if (id === "gradient-color-pickr") {
            window["gradient-color"] = colorValue;
          }
        }
      });
    }
    
    // Save the current color state for debugging and verification
    console.log("Persisting color settings across season change:", {
      textColor: window["text-color"],
      infoColor: window["info-color"],
      textShadowColor: window["text-shadow-color"],
      textOutlineColor: window["text-outline-color"],
      infoShadowColor: window["info-shadow-color"],
      infoOutlineColor: window["info-outline-color"],
      gradientColor: window["gradient-color"]
    });

    // Check if season data is already cached
    const cacheKey = `${currentShowData.id}-${seasonNumber}`;
    let seasonData;
    let tempOverlay = null;
    
    console.log(`[selectSeason] Checking cache for season ${seasonNumber}, cacheKey: ${cacheKey}`);
    console.log(`[selectSeason] Cache has key: ${artworkCache.has(cacheKey)}`);
    
    if (artworkCache.has(cacheKey)) {
      console.log(`[selectSeason] Season ${seasonNumber} found in cache!`);
      // Use cached data - show brief loading indicator matching theme
      tempOverlay = document.createElement('div');
      tempOverlay.style.position = 'fixed';
      tempOverlay.style.bottom = '20px';
      tempOverlay.style.right = '20px';
      tempOverlay.style.width = '320px';
      tempOverlay.style.backgroundColor = 'rgba(22, 24, 48, 0.95)';
      tempOverlay.style.borderRadius = '12px';
      tempOverlay.style.padding = '16px 20px';
      tempOverlay.style.fontFamily = 'Gabarito, sans-serif';
      tempOverlay.style.zIndex = '10001';
      tempOverlay.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(142, 36, 170, 0.3)';
      tempOverlay.style.border = '1px solid rgba(142, 36, 170, 0.4)';
      tempOverlay.style.backdropFilter = 'blur(8px)';
      
      // Create header with spinner
      const headerEl = document.createElement('div');
      headerEl.style.display = 'flex';
      headerEl.style.alignItems = 'center';
      headerEl.style.marginBottom = '12px';
      
      // Create spinner
      const spinner = document.createElement('div');
      spinner.style.border = '2px solid rgba(255, 255, 255, 0.1)';
      spinner.style.borderTop = '2px solid #8e24aa';
      spinner.style.borderRadius = '50%';
      spinner.style.width = '20px';
      spinner.style.height = '20px';
      spinner.style.animation = 'spin 1s linear infinite';
      spinner.style.display = 'inline-block';
      spinner.style.marginRight = '12px';
      headerEl.appendChild(spinner);
      
      // Create message
      const message = document.createElement('div');
      message.style.color = 'white';
      message.style.fontSize = '14px';
      message.style.fontWeight = '600';
      message.style.flex = '1';
      message.textContent = `Loading Season ${seasonNumber}...`;
      headerEl.appendChild(message);
      tempOverlay.appendChild(headerEl);
      
      // Create progress bar container
      const progressContainer = document.createElement('div');
      progressContainer.style.width = '100%';
      progressContainer.style.height = '4px';
      progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      progressContainer.style.borderRadius = '2px';
      progressContainer.style.overflow = 'hidden';
      
      // Create animated progress bar
      const progressBar = document.createElement('div');
      progressBar.style.width = '0%';
      progressBar.style.height = '100%';
      progressBar.style.background = 'linear-gradient(90deg, #8e24aa, #00bfa5)';
      progressBar.style.borderRadius = '2px';
      progressBar.style.transition = 'width 0.2s ease';
      
      progressContainer.appendChild(progressBar);
      tempOverlay.appendChild(progressContainer);
      document.body.appendChild(tempOverlay);
      
      // Animate progress bar
      setTimeout(() => progressBar.style.width = '30%', 50);
      setTimeout(() => progressBar.style.width = '70%', 150);
      setTimeout(() => progressBar.style.width = '100%', 250);
      const cached = artworkCache.get(cacheKey);
      seasonData = cached.seasonData;
      currentSeasonData = seasonData.episodes;
      
      console.log(`[selectSeason] Using cached season data with ${seasonData.episodes.length} episodes`);
      console.log(`[selectSeason] Cached rendered cards available: ${!!cached.renderedCards}`);
      console.log(`[selectSeason] Rendered cards count: ${cached.renderedCards?.length}`);
      
      // Use cached rendered cards directly - no need to recreate!
      if (cached.renderedCards && cached.renderedCards.length > 0) {
        console.log(`[selectSeason] Restoring ${cached.renderedCards.length} pre-rendered cards`);
        episodeTitleCards = [...cached.renderedCards]; // Restore the cached cards to the global array
      } else {
        // Fallback: render from scratch if no cached cards
        console.log(`[selectSeason] No cached cards, rendering from scratch`);
        await createEpisodeTitleCards(seasonData.episodes, true, cached.episodeImageData);
      }
      
      renderEpisodeGrid();
      
      // Remove loading indicator
      if (tempOverlay && tempOverlay.parentNode) {
        document.body.removeChild(tempOverlay);
      }
      showGridView();
    } else {
      // Fetch fresh data with progress indicator
      console.log(`[selectSeason] Loading uncached season ${seasonNumber}`);
      showProgressOverlay(`Loading Season ${seasonNumber}...`, true);
      updateProgressOverlay(5, "Fetching season details");

      seasonData = await getSeasonDetails(currentShowData.id, seasonNumber, currentLang);
      console.log(`[selectSeason] Got season data:`, seasonData);
      if (!seasonData) {
        console.error(`[selectSeason] No season data returned`);
        hideProgressOverlay();
        return;
      }
      
      updateProgressOverlay(15, `Found ${seasonData.episodes.length} episodes`);
      currentSeasonData = seasonData.episodes;

      console.log(`[selectSeason] Starting createEpisodeTitleCards for ${seasonData.episodes.length} episodes`);
      await createEpisodeTitleCards(seasonData.episodes, false);
      console.log(`[selectSeason] Finished createEpisodeTitleCards`);

      if (isTMDBMode) {
        updateProgressOverlay(95, "Rendering episode grid");
        renderEpisodeGrid();
        updateProgressOverlay(100, "Complete!");
        setTimeout(() => {
          hideProgressOverlay();
          showGridView();
        }, 500);
      } else {
        hideProgressOverlay();
        selectEpisode(0);
        showSingleCardView();
      }
    }
  }

  // =====================================================
  // EPISODE TITLE CARD CREATION
  // =====================================================
  // Create title cards for all episodes in a season
  async function createEpisodeTitleCards(episodes, skipProgressUpdates = false, cachedEpisodeImageData = null, useLocalArray = false) {
    console.log(`[createEpisodeTitleCards] Starting with ${episodes.length} episodes, skipProgressUpdates=${skipProgressUpdates}, hasCachedData=${!!cachedEpisodeImageData}, useLocalArray=${useLocalArray}`);
    
    // Use a local array when caching (to avoid race conditions), or the global array for actual UI display
    const cardsArray = useLocalArray ? [] : (episodeTitleCards = []);

    if (!skipProgressUpdates) {
      updateProgressOverlay(20, `Processing ${episodes.length} episodes...`);
    }

    // Prioritize the global window color values that persist between seasons
    // This ensures custom colors are maintained when switching seasons
    const currentColors = {
      textColor: window["text-color"] || "#ffffff",
      infoColor: window["info-color"] || "#ffffff",
      textShadowColor: window["text-shadow-color"] || "#000000",
      textOutlineColor: window["text-outline-color"] || "#000000",
      infoShadowColor: window["info-shadow-color"] || "#000000",
      infoOutlineColor: window["info-outline-color"] || "#000000",
      gradientColor: window["gradient-color"] || "#000000",
    };
    
    // Update color pickers to match our stored values
    if (Pickr.all) {
      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
        
        const id = pickr._root.button.id;
        if (id === "text-color-pickr") {
          pickr.setColor(currentColors.textColor);
        } else if (id === "info-color-pickr") {
          pickr.setColor(currentColors.infoColor);
        } else if (id === "text-shadow-color-pickr") {
          pickr.setColor(currentColors.textShadowColor);
        } else if (id === "text-outline-color-pickr") {
          pickr.setColor(currentColors.textOutlineColor);
        } else if (id === "info-shadow-color-pickr") {
          pickr.setColor(currentColors.infoShadowColor);
        } else if (id === "info-outline-color-pickr") {
          pickr.setColor(currentColors.infoOutlineColor);
        } else if (id === "gradient-color-pickr") {
          pickr.setColor(currentColors.gradientColor);
        }
      });
    }

    // Fallback colors in case the window variables aren't set
    const fallbackColors = {
      textColor: "#ffffff",
      infoColor: "#ffffff",
      textShadowColor: "#000000",
      textOutlineColor: "#000000",
      infoShadowColor: "#000000",
      infoOutlineColor: "#000000",
      gradientColor: "#000000",
    };

    const totalOperations = episodes.length;
    let completedOperations = 0;

    for (const episode of episodes) {
      const progress =
        20 + Math.floor((completedOperations / totalOperations) * 75);
      
      if (!skipProgressUpdates) {
        updateProgressOverlay(
          progress,
          `Loading episode ${episode.episode_number}: ${episode.name}`
        );
      }

      // Create base card object
      // Use numberTheme for season/episode numbers
      const formatNumber = (n) => {
        if (numberTheme === 'plain') return String(Number(n));
        if (numberTheme === 'roman') return toRomanNumeral(Number(n));
        return String(n).padStart(2, "0");
      };
      const card = {
        title: episode.name,
        seasonNumber: formatNumber(episode.season_number),
        episodeNumber: formatNumber(episode.episode_number),
        thumbnailImg: null,
        originalThumbnail: null, // Store the original TMDB thumbnail for revert
        canvasData: null,
        allImages: [],
        allImagePaths: [],
        imageMetadata: [], // Store width/height for each image
        hasCustomPlacement: false, // Flag to indicate if this episode has custom placement
        customPlacement: null, // Store custom placement settings

        // Store initial settings
        currentSettings: {
          fontFamily: fontFamily.value,
          infoFontFamily: document.getElementById("info-font-family").value,
          textSize: textSize.value,
          infoTextSize: document.getElementById("info-text-size").value,
          textShadowBlur: textShadowBlur.value,
          textOutlineWidth: textOutlineWidth.value,
          infoShadowBlur: document.getElementById("info-shadow-blur").value,
          infoOutlineWidth: document.getElementById("info-outline-width").value,
          titleInfoSpacing: titleInfoSpacing.value,
          textColor: currentColors.textColor || fallbackColors.textColor,
          infoColor: currentColors.infoColor || fallbackColors.infoColor,
          textShadowColor:
            currentColors.textShadowColor || fallbackColors.textShadowColor,
          textOutlineColor:
            currentColors.textOutlineColor || fallbackColors.textOutlineColor,
          infoShadowColor:
            currentColors.infoShadowColor || fallbackColors.infoShadowColor,
          infoOutlineColor:
            currentColors.infoOutlineColor || fallbackColors.infoOutlineColor,
          effectType: effectType.value,
          gradientColor:
            currentColors.gradientColor || fallbackColors.gradientColor,
          gradientOpacity: gradientOpacity.value,
          blendMode: blendMode.value,
          titleWrapping: document.getElementById("title-wrapping") ? 
            document.getElementById("title-wrapping").value : 'singleLine',
        }
      };
      
      // Load episode thumbnail and alternative images
      if (episode.still_path) {
        try {
          // Check if we have cached image data for this episode
          const cachedData = cachedEpisodeImageData?.find(
            data => data.episodeNumber === episode.episode_number
          );
          
          console.log(`[createEpisodeTitleCards] Episode ${episode.episode_number}: cachedData found: ${!!cachedData}, has images: ${!!cachedData?.images}`);
          
          let highestResImage = episode.still_path;
          let allAvailableImages = [{ file_path: episode.still_path, width: 0, height: 0 }];
          
          if (cachedData && cachedData.images) {
            // Use cached image data - no need to fetch!
            console.log(`[createEpisodeTitleCards] Episode ${episode.episode_number}: Using ${cachedData.images.length} cached images`);
            allAvailableImages = cachedData.images;
            highestResImage = allAvailableImages[0].file_path;
          } else if (currentShowData && currentShowData.id) {
            // Fetch images (non-cached path)
            console.log(`[createEpisodeTitleCards] Episode ${episode.episode_number}: No cached data, fetching images...`);
            if (!skipProgressUpdates) {
              updateProgressOverlay(
                progress,
                `Checking for alternative images for episode ${episode.episode_number}...`
              );
            }
            
            const additionalImages = await getEpisodeImages(
              currentShowData.id,
              episode.season_number,
              episode.episode_number
            );
            
            if (additionalImages && additionalImages.length > 0) {
              allAvailableImages = additionalImages;
              
              // Sort by resolution (width * height) to find highest quality
              allAvailableImages.sort((a, b) => {
                const aRes = (a.width || 0) * (a.height || 0);
                const bRes = (b.width || 0) * (b.height || 0);
                return bRes - aRes; // Descending order
              });
              
              // Use highest resolution image as default
              highestResImage = allAvailableImages[0].file_path;
              
              if (!skipProgressUpdates) {
                updateProgressOverlay(
                  progress,
                  `Found ${allAvailableImages.length} images for episode ${episode.episode_number}...`
                );
              }
            }
          }
          
          // Load the highest resolution image as the default thumbnail
          card.thumbnailImg = await getEpisodeThumbnail(highestResImage);
          card.originalThumbnail = card.thumbnailImg; // Store original for revert
          
          // Store all image paths and metadata
          for (const img of allAvailableImages) {
            if (img.file_path) {
              card.allImagePaths.push(img.file_path);
              card.imageMetadata.push({
                width: img.width || 0,
                height: img.height || 0,
                path: img.file_path
              });
            }
          }

          // Load up to 5 images for each episode
          const imagesToLoad = card.allImagePaths.slice(0, 5);
          for (let i = 0; i < imagesToLoad.length; i++) {
            if (i === 0) {
              card.allImages.push(card.thumbnailImg);
            } else {
              try {
                if (!skipProgressUpdates) {
                  updateProgressOverlay(
                    progress,
                    `Loading alternative image ${i}/${
                      imagesToLoad.length - 1
                    } for episode ${episode.episode_number}...`
                  );
                }
                const img = await getEpisodeThumbnail(imagesToLoad[i]);
                card.allImages.push(img);
              } catch (err) {
                console.log(
                  `Could not load additional image ${i} for episode ${episode.episode_number}`
                );
              }
            }
          }
        } catch (err) {
          console.log(
            `Could not load thumbnail for episode ${episode.episode_number}`
          );
          if (!skipProgressUpdates) {
            updateProgressOverlay(
              progress,
              `Failed to load thumbnail for episode ${episode.episode_number}...`
            );
          }
        }
      } else {
        if (!skipProgressUpdates) {
          updateProgressOverlay(
            progress,
            `No thumbnail available for episode ${episode.episode_number}...`
          );
        }
      }

      cardsArray.push(card);
      completedOperations++;
    }

    if (!skipProgressUpdates) {
      updateProgressOverlay(
        95,
        "All episodes processed successfully! Preparing grid view..."
      );
    }
    
    // If using local array, return it; otherwise the global episodeTitleCards is already updated
    return useLocalArray ? cardsArray : episodeTitleCards;
  }

  // Select a specific episode from the grid
  function selectEpisode(index) {
    if (index < 0 || index >= episodeTitleCards.length) return;

    // Save the current episode's data before switching
    if (selectedCardIndex >= 0 && selectedCardIndex < episodeTitleCards.length) {
      const previousCard = episodeTitleCards[selectedCardIndex];
      
      // Format the numbers based on numberTheme
      const formatNumber = (n) => {
        if (numberTheme === 'plain') return String(Number(n));
        if (numberTheme === 'roman') return toRomanNumeral(Number(n));
        return String(n).padStart(2, "0");
      };
      
      // Update the card's specific properties
      previousCard.title = titleInput.value;
      previousCard.seasonNumber = formatNumber(seasonNumberInput.value);
      previousCard.episodeNumber = formatNumber(episodeNumberInput.value);
    }

    selectedCardIndex = index;
    const card = episodeTitleCards[index];

    // Set form values from card data
    titleInput.value = card.title;
    // Always set input fields to plain numbers for editing
    seasonNumberInput.value = String(Number(card.seasonNumber));
    episodeNumberInput.value = String(Number(card.episodeNumber));

    // Store original thumbnail when first selecting an episode
    if (!originalThumbnail && card.thumbnailImg) {
      originalThumbnail = card.thumbnailImg;
    }

    // Set thumbnail image
    if (card.thumbnailImg) {
      thumbnailImg = card.thumbnailImg;
      // Only update the label if the element exists
      const thumbContainer = document.querySelector('#thumbnail-container span');
      if (thumbContainer) {
        thumbContainer.textContent = 'Custom Thumbnail Applied';
      }
    }

    // Apply card-specific settings if available
    if (card.currentSettings) {
      // Apply stored colors
      window["text-color"] = card.currentSettings.textColor;
      window["info-color"] = card.currentSettings.infoColor;
      window["text-shadow-color"] = card.currentSettings.textShadowColor;
      window["text-outline-color"] = card.currentSettings.textOutlineColor;
      window["info-shadow-color"] = card.currentSettings.infoShadowColor;
      window["info-outline-color"] = card.currentSettings.infoOutlineColor;
      window["gradient-color"] = card.currentSettings.gradientColor;

      // Update color pickers
      if (Pickr.all) {
        Pickr.all.forEach((pickr) => {
          if (!pickr._root || !pickr._root.button || !pickr._root.button.id)
            return;

          const id = pickr._root.button.id;
          if (id === "text-color-pickr") {
            pickr.setColor(card.currentSettings.textColor);
          } else if (id === "info-color-pickr") {
            pickr.setColor(card.currentSettings.infoColor);
          } else if (id === "text-shadow-color-pickr") {
            pickr.setColor(card.currentSettings.textShadowColor);
          } else if (id === "text-outline-color-pickr") {
            pickr.setColor(card.currentSettings.textOutlineColor);
          } else if (id === "info-shadow-color-pickr") {
            pickr.setColor(card.currentSettings.infoShadowColor);
          } else if (id === "info-outline-color-pickr") {
            pickr.setColor(card.currentSettings.infoOutlineColor);
          } else if (id === "gradient-color-pickr") {
            pickr.setColor(card.currentSettings.gradientColor);
          }
        });
      }
    }

    // Show alternative images for this episode
    displayAlternativeImages(card);

    // Draw the card
    drawCard();
  }

  // Display alternative images for an episode
  function displayAlternativeImages(card) {
    const modularFrame = document.getElementById("modular-frame");
    const modularFrameImages = document.getElementById("modular-frame-images");
    const modularFrameCount = document.getElementById("modular-frame-count");

    // Clear the container
    modularFrameImages.innerHTML = "";

    if (!card.allImages || card.allImages.length <= 1) {
      modularFrameCount.textContent = "No alternative images available";
      modularFrameImages.style.maxHeight = "auto";
      return;
    }

    // Update text
    modularFrameCount.textContent = `${card.allImages.length} images available`;

    // Determine optimal layout for different image counts
    if (card.allImages.length <= 4) {
      // For 1-4 images: Single row, no scrolling
      modularFrameImages.style.maxHeight = "auto";
      modularFrameImages.style.justifyContent = "center";
    } else if (card.allImages.length <= 8) {
      // For 5-8 images: Two rows without scrolling
      modularFrameImages.style.maxHeight = "160px"; // Height to accommodate 2 rows
      modularFrameImages.style.justifyContent = "center";
    } else if (card.allImages.length <= 16) {
      // For 9-16 images: Three rows with possible scrolling
      modularFrameImages.style.maxHeight = "240px"; // Height to accommodate 3 rows
      modularFrameImages.style.justifyContent = "flex-start"; // Left-align for consistent scrolling
    } else {
      // For more than 16 images: Four rows with scrolling
      modularFrameImages.style.maxHeight = "300px"; // Height to accommodate 4 rows
      modularFrameImages.style.justifyContent = "flex-start"; // Left-align for consistent scrolling
    }

    // Create image items for the modular frame
    card.allImages.forEach((img, index) => {
      // Create image for modular frame
      const modularImageItem = document.createElement("div");
      modularImageItem.className = "alt-image-item";
      if (card.thumbnailImg === img) {
        modularImageItem.classList.add("selected");
      }

      const modularImgEl = document.createElement("img");
      modularImgEl.src = img.src;
      modularImgEl.alt = `Alternative image ${index + 1}`;
      modularImageItem.appendChild(modularImgEl);

      const modularBadge = document.createElement("span");
      modularBadge.className = "image-badge";
      modularBadge.textContent = index + 1;
      modularImageItem.appendChild(modularBadge);

      // Add resolution badge if metadata is available
      if (card.imageMetadata && card.imageMetadata[index]) {
        const resBadge = document.createElement("span");
        resBadge.className = "resolution-badge";
        const meta = card.imageMetadata[index];
        resBadge.textContent = `${meta.width}×${meta.height}`;
        modularImageItem.appendChild(resBadge);
      }

      modularImageItem.addEventListener("click", () => {
        thumbnailImg = img;
        card.thumbnailImg = img;

        // Update selected class
        document.querySelectorAll(".alt-image-item").forEach((item) => {
          item.classList.remove("selected");
        });
        modularImageItem.classList.add("selected");

        drawCard();
      });

      modularFrameImages.appendChild(modularImageItem);
    });
  }

  // Calculate grid dimensions based on episode count
  function calculateGridDimensions(episodeCount) {
    if (episodeCount <= 5) {
      gridColumns = episodeCount;
      gridCardWidth = 270;
    } else if (episodeCount <= 10) {
      gridColumns = Math.min(5, episodeCount); // Changed from 4 to 5
      gridCardWidth = 240;  // Slightly reduced width to accommodate 5 columns
    } else if (episodeCount <= 20) {
      gridColumns = 5; // Always use 5 columns for medium sized collections
      gridCardWidth = 230;
    } else {
      gridColumns = 6;
      gridCardWidth = 210;
    }
  
    const rows = Math.ceil(episodeCount / gridColumns);
    gridCardHeight = Math.round(gridCardWidth * (9 / 16));
  
    gridGap = episodeCount > 20 ? 10 : 12;
  
    return {
      columns: gridColumns,
      rows: rows,
    };
  }

  // =====================================================
  // GRID VIEW RENDERING
  // =====================================================

  // Drag-and-drop state (persistent across renders)
  let dragState = {
    isDragging: false,
    draggedIndex: -1,
    dragStartX: 0,
    dragStartY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    hasMoved: false,
    preventClick: false
  };

  // Render the episode grid
  function renderEpisodeGrid() {
    if (episodeTitleCards.length === 0) return;
  

    // Dynamically set columns based on episode count
    let maxColumns = 5;
    if (episodeTitleCards.length > 40) {
      maxColumns = 10;
    } else if (episodeTitleCards.length > 20) {
      maxColumns = 6;
    }

    // Calculate dimensions based on window size
    const availableWidth = Math.min(window.innerWidth - 360, 2000);
    let cardWidth = Math.floor((availableWidth * 0.9) / maxColumns) - 10;
    cardWidth = Math.max(cardWidth, 180); // Allow smaller cards for large grids
    const cardGap = Math.floor(availableWidth * 0.01) + 15;

    // Determine number of columns based on episode count
    let columns;
    if (episodeTitleCards.length <= 5) {
      columns = episodeTitleCards.length;
      gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 15;
    } else if (episodeTitleCards.length <= 10) {
      columns = Math.min(5, episodeTitleCards.length);
      gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 10;
    } else if (episodeTitleCards.length <= 20) {
      columns = 5;
      gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 10;
    } else if (episodeTitleCards.length <= 40) {
      columns = 6;
      gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 8;
    } else {
      columns = 10;
      gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 6;
    }

    // Update grid layout variables
    gridColumns = columns;
    gridGap = cardGap;
    gridCardHeight = Math.floor(gridCardWidth * (9 / 16));

    const rows = Math.ceil(episodeTitleCards.length / columns);

    // Calculate total dimensions
    const totalWidth = columns * gridCardWidth + (columns - 1) * cardGap;
    const totalHeight =
      rows * (gridCardHeight + 30) + (rows - 1) * cardGap + 60; // Increased to accommodate new styling

    // Set canvas dimensions
    gridCanvas.width = totalWidth + 50;
    gridCanvas.height = totalHeight + 40;

    // Render a modern background gradient
    const gradient = gridCtx.createLinearGradient(0, 0, 0, gridCanvas.height);
    gradient.addColorStop(0, '#10102a');
    gradient.addColorStop(1, '#080818');
    gridCtx.fillStyle = gradient;
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    
    // Add subtle grid pattern
    gridCtx.save();
    gridCtx.globalAlpha = 0.05;
    const gridSize = 40;
    gridCtx.strokeStyle = "#ffffff";
    gridCtx.lineWidth = 0.5;
    
    for (let i = 0; i <= gridCanvas.width; i += gridSize) {
      gridCtx.beginPath();
      gridCtx.moveTo(i, 0);
      gridCtx.lineTo(i, gridCanvas.height);
      gridCtx.stroke();
    }
    
    for (let i = 0; i <= gridCanvas.height; i += gridSize) {
      gridCtx.beginPath();
      gridCtx.moveTo(0, i);
      gridCtx.lineTo(gridCanvas.width, i);
      gridCtx.stroke();
    }
    gridCtx.restore();

    // Draw header with gradient background
    const headerHeight = 40;
    const headerGradient = gridCtx.createLinearGradient(0, 0, gridCanvas.width, 0);
    headerGradient.addColorStop(0, 'rgba(0, 191, 165, 0.3)');
    headerGradient.addColorStop(0.5, 'rgba(142, 36, 170, 0.3)');
    headerGradient.addColorStop(1, 'rgba(0, 191, 165, 0.3)');
    
    gridCtx.fillStyle = headerGradient;
    gridCtx.beginPath();
    gridCtx.roundRect(10, 10, gridCanvas.width - 20, headerHeight, 8);
    gridCtx.fill();
    
    // Draw title with text shadow
    gridCtx.font = "bold 20px Gabarito, sans-serif";
    gridCtx.fillStyle = "#ffffff";
    gridCtx.textAlign = "center";
    gridCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
    gridCtx.shadowBlur = 5;
    gridCtx.shadowOffsetX = 0;
    gridCtx.shadowOffsetY = 2;
    // Use "Series" label if selected in dropdown
    let gridHeaderLabel = "Season";
    if (document.getElementById("series-type") && document.getElementById("series-type").value === "series") {
      gridHeaderLabel = "Series";
    }
    gridCtx.fillText(
      `${currentShowData.name} - ${gridHeaderLabel} ${currentSeasonNumber}`,
      gridCanvas.width / 2,
      35
    );
    gridCtx.shadowColor = "transparent"; // Reset shadow

    // Draw each episode card
    episodeTitleCards.forEach((card, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = 25 + col * (gridCardWidth + gridGap);
      const y = 70 + row * (gridCardHeight + gridGap + 30);

      // Draw card container with shadow effect
      gridCtx.save();
      
      // Create card background with shadow
      gridCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
      gridCtx.shadowBlur = 15;
      gridCtx.shadowOffsetX = 0;
      gridCtx.shadowOffsetY = 5;
      
      // Draw card background
      gridCtx.fillStyle = "#161830";
      gridCtx.beginPath();
      gridCtx.roundRect(x - 5, y - 5, gridCardWidth + 10, gridCardHeight + 35, 8);
      gridCtx.fill();
      
      // Reset shadow for content
      gridCtx.shadowColor = "transparent";
      gridCtx.restore();

      // Create a reference-size canvas (1280x720) for consistent text rendering
      const refWidth = 1280;
      const refHeight = 720;
      const refCanvas = document.createElement("canvas");
      refCanvas.width = refWidth;
      refCanvas.height = refHeight;
      const refCtx = refCanvas.getContext("2d");

      // Draw card at reference size
      drawCardToTempContext(refCtx, card, refWidth, refHeight);

      // Now scale down to grid card size
      // Add rounded corners to the card image
      gridCtx.save();
      gridCtx.beginPath();
      gridCtx.roundRect(x, y, gridCardWidth, gridCardHeight, 6);
      gridCtx.clip();
      // Draw the reference canvas scaled to grid card size
      gridCtx.drawImage(refCanvas, x, y, gridCardWidth, gridCardHeight);
      gridCtx.restore();
      
      // Add a subtle inner border glow
      gridCtx.save();
      gridCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      gridCtx.lineWidth = 1;
      gridCtx.beginPath();
      gridCtx.roundRect(x, y, gridCardWidth, gridCardHeight, 6);
      gridCtx.stroke();
      gridCtx.restore();

      // Draw interactive hover effect hint (slight highlight)
      gridCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
      gridCtx.beginPath();
      gridCtx.roundRect(x, y, gridCardWidth, gridCardHeight, 6);
      gridCtx.fill();

      // Draw episode label with modern styling
      gridCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
      gridCtx.beginPath();
      gridCtx.roundRect(x, y, 50, 22, [6, 0, 0, 0]);
      gridCtx.fill();

      gridCtx.font = "bold 10px Gabarito, sans-serif";
      gridCtx.fillStyle = "#00bfa5";
      gridCtx.textAlign = "left";
      // Use numberTheme for grid label
      const formatNumber = (n) => {
        if (numberTheme === 'plain') return String(Number(n));
        if (numberTheme === 'roman') return toRomanNumeral(Number(n));
        return String(n).padStart(2, "0");
      };
      gridCtx.fillText(
        `S${formatNumber(card.seasonNumber)}E${formatNumber(card.episodeNumber)}`,
        x + 6,
        y + 15
      );

      // Draw episode title with improved text styling
      gridCtx.font = "500 13px Gabarito, sans-serif";
      gridCtx.textAlign = "center";
      
      // Draw text shadow for better readability
      gridCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
      gridCtx.fillText(
        card.title,
        x + gridCardWidth / 2 + 1,
        y + gridCardHeight + 16 + 1,
        gridCardWidth - 10
      );
      
      gridCtx.fillStyle = "rgba(255, 255, 255, 0.95)";
      gridCtx.fillText(
        card.title,
        x + gridCardWidth / 2,
        y + gridCardHeight + 16,
        gridCardWidth - 10
      );

      // Draw checkbox for custom placement using a modern toggle appearance
      const toggleSize = 18;
      const toggleX = x + gridCardWidth - toggleSize - 8;
      const toggleY = y + 8;
      
      // Draw toggle background
      gridCtx.beginPath();
      gridCtx.fillStyle = card.hasCustomPlacement ? 'rgba(0, 191, 165, 0.3)' : 'rgba(0, 0, 0, 0.5)';
      gridCtx.roundRect(toggleX, toggleY, toggleSize, toggleSize, 4);
      gridCtx.fill();
      
      // Draw toggle border
      gridCtx.beginPath();
      gridCtx.strokeStyle = card.hasCustomPlacement ? '#00bfa5' : 'rgba(255, 255, 255, 0.2)';
      gridCtx.lineWidth = 1.5;
      gridCtx.roundRect(toggleX, toggleY, toggleSize, toggleSize, 4);
      gridCtx.stroke();
      
      // Draw check mark if custom placement is enabled
      if (card.hasCustomPlacement) {
        gridCtx.strokeStyle = '#00bfa5';
        gridCtx.lineWidth = 2.5;
        gridCtx.lineCap = 'round';
        gridCtx.lineJoin = 'round';
        gridCtx.beginPath();
        gridCtx.moveTo(toggleX + 4, toggleY + 9);
        gridCtx.lineTo(toggleX + 8, toggleY + 13);
        gridCtx.lineTo(toggleX + 14, toggleY + 5);
        gridCtx.stroke();
      }

      // Draw resolution badge if metadata is available
      if (card.imageMetadata && card.imageMetadata[0]) {
        const meta = card.imageMetadata[0];
        const resBadgeText = `${meta.width}×${meta.height}`;
        
        // Measure text to determine badge size
        gridCtx.font = "bold 10px Gabarito, sans-serif";
        const textWidth = gridCtx.measureText(resBadgeText).width;
        const badgeWidth = textWidth + 10;
        const badgeHeight = 18;
        const badgeX = x + 5;
        const badgeY = y + gridCardHeight - badgeHeight - 5;
        
        // Draw badge background
        gridCtx.fillStyle = "rgba(142, 36, 170, 0.95)";
        gridCtx.beginPath();
        gridCtx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 3);
        gridCtx.fill();
        
        // Draw badge border
        gridCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        gridCtx.lineWidth = 1;
        gridCtx.beginPath();
        gridCtx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 3);
        gridCtx.stroke();
        
        // Draw text
        gridCtx.fillStyle = "#ffffff";
        gridCtx.textAlign = "center";
        gridCtx.textBaseline = "middle";
        gridCtx.fillText(resBadgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
        
        // Show alternate images count if more than 1 image available
        if (card.imageMetadata.length > 1) {
          const altCount = card.imageMetadata.length;
          const altBadgeText = `${altCount} imgs`;
          
          gridCtx.font = "bold 10px Gabarito, sans-serif";
          const altTextWidth = gridCtx.measureText(altBadgeText).width;
          const altBadgeWidth = altTextWidth + 10;
          const altBadgeX = badgeX + badgeWidth + 3;
          
          // Draw badge background with different color
          gridCtx.fillStyle = "rgba(0, 191, 165, 0.95)";
          gridCtx.beginPath();
          gridCtx.roundRect(altBadgeX, badgeY, altBadgeWidth, badgeHeight, 3);
          gridCtx.fill();
          
          // Draw badge border
          gridCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          gridCtx.lineWidth = 1;
          gridCtx.beginPath();
          gridCtx.roundRect(altBadgeX, badgeY, altBadgeWidth, badgeHeight, 3);
          gridCtx.stroke();
          
          // Draw text
          gridCtx.fillStyle = "#ffffff";
          gridCtx.textAlign = "center";
          gridCtx.textBaseline = "middle";
          gridCtx.fillText(altBadgeText, altBadgeX + altBadgeWidth / 2, badgeY + badgeHeight / 2);
        }
      }

      // Add indicator for custom placement
      if (card.hasCustomPlacement) {
        // Draw badge with pill shape on the right side
        const customBadgeWidth = 60;
        const customBadgeX = x + gridCardWidth - customBadgeWidth;
        
        gridCtx.fillStyle = 'rgba(0, 191, 165, 0.9)';
        gridCtx.beginPath();
        gridCtx.roundRect(customBadgeX, y + gridCardHeight - 22, customBadgeWidth, 22, [0, 0, 6, 0]);
        gridCtx.fill();
        
        // Add subtle gradient to badge
        const badgeGradient = gridCtx.createLinearGradient(customBadgeX, y + gridCardHeight - 22, customBadgeX + customBadgeWidth, y + gridCardHeight);
        badgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        badgeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        gridCtx.fillStyle = badgeGradient;
        gridCtx.beginPath();
        gridCtx.roundRect(customBadgeX, y + gridCardHeight - 22, customBadgeWidth, 22, [0, 0, 6, 0]);
        gridCtx.fill();
        
        // Draw "Custom" text with improved styling
        gridCtx.font = "bold 10px Gabarito, sans-serif";
        gridCtx.fillStyle = "#ffffff";
        gridCtx.textAlign = "center";
        gridCtx.fillText("CUSTOM", customBadgeX + customBadgeWidth / 2, y + gridCardHeight - 8);
      }

      // Store card coordinates for click handling
      card.gridCoords = {
        x: x,
        y: y,
        width: gridCardWidth,
        height: gridCardHeight,
        checkbox: {
          x: toggleX,
          y: toggleY,
          width: toggleSize,
          height: toggleSize
        }
      };
    });

    // Add click handler to canvas if not already set
    if (!gridCanvas.onclick) {
      gridCanvas.onclick = handleGridCanvasClick;
    }
    
    // Helper function to determine drop index
    function getDropIndex(x, y) {
      for (let i = 0; i < episodeTitleCards.length; i++) {
        const card = episodeTitleCards[i];
        if (card.gridCoords) {
          const { x: cardX, y: cardY, width: cardWidth, height: cardHeight } = card.gridCoords;
          
          if (x >= cardX && x <= cardX + cardWidth && y >= cardY && y <= cardY + cardHeight) {
            return i;
          }
        }
      }
      return -1;
    }
    
    // Add drag-and-drop event handlers
    if (!gridCanvas.onmousedown) {
      gridCanvas.onmousedown = function(event) {
        const rect = gridCanvas.getBoundingClientRect();
        const scaleX = gridCanvas.width / rect.width;
        const scaleY = gridCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Find clicked card
        for (let i = 0; i < episodeTitleCards.length; i++) {
          const card = episodeTitleCards[i];
          if (card.gridCoords) {
            const { x: cardX, y: cardY, width: cardWidth, height: cardHeight } = card.gridCoords;
            
            // Check if click is NOT on the checkbox
            const checkboxRect = card.gridCoords.checkbox;
            const isOnCheckbox = x >= checkboxRect.x && x <= checkboxRect.x + checkboxRect.width &&
                                y >= checkboxRect.y && y <= checkboxRect.y + checkboxRect.height;
            
            if (!isOnCheckbox && x >= cardX && x <= cardX + cardWidth && y >= cardY && y <= cardY + cardHeight) {
              dragState.isDragging = true;
              dragState.draggedIndex = i;
              dragState.dragStartX = x;
              dragState.dragStartY = y;
              dragState.dragOffsetX = x - cardX;
              dragState.dragOffsetY = y - cardY;
              dragState.hasMoved = false;
              gridCanvas.style.cursor = 'grabbing';
              event.preventDefault();
              break;
            }
          }
        }
      };
    }
    
    // Add hover effects and drag move handler
    if (!gridCanvas.onmousemove) {
      let lastHoveredIndex = -1;
      
      gridCanvas.onmousemove = function(event) {
        const rect = gridCanvas.getBoundingClientRect();
        const scaleX = gridCanvas.width / rect.width;
        const scaleY = gridCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Handle dragging
        if (dragState.isDragging) {
          // Track if mouse has moved significantly (more than 5 pixels)
          const dx = Math.abs(x - dragState.dragStartX);
          const dy = Math.abs(y - dragState.dragStartY);
          if (dx > 5 || dy > 5) {
            dragState.hasMoved = true;
          }
          
          renderEpisodeGrid();
          
          const draggedCard = episodeTitleCards[dragState.draggedIndex];
          const cardX = x - dragState.dragOffsetX;
          const cardY = y - dragState.dragOffsetY;
          
          // Draw semi-transparent dragged card
          gridCtx.save();
          gridCtx.globalAlpha = 0.8;
          gridCtx.shadowColor = "rgba(0, 191, 165, 0.6)";
          gridCtx.shadowBlur = 20;
          
          const refCanvas = document.createElement("canvas");
          refCanvas.width = 1280;
          refCanvas.height = 720;
          const refCtx = refCanvas.getContext("2d");
          drawCardToTempContext(refCtx, draggedCard, 1280, 720);
          
          gridCtx.beginPath();
          gridCtx.roundRect(cardX, cardY, gridCardWidth, gridCardHeight, 6);
          gridCtx.clip();
          gridCtx.drawImage(refCanvas, cardX, cardY, gridCardWidth, gridCardHeight);
          gridCtx.restore();
          
          // Draw insertion indicator
          const dropIndex = getDropIndex(x, y);
          if (dropIndex >= 0 && dropIndex !== dragState.draggedIndex) {
            const targetCard = episodeTitleCards[dropIndex];
            if (targetCard && targetCard.gridCoords) {
              const { x: targetX, y: targetY, width: targetWidth, height: targetHeight } = targetCard.gridCoords;
              
              gridCtx.save();
              gridCtx.strokeStyle = "#00bfa5";
              gridCtx.lineWidth = 4;
              
              const insertBefore = dropIndex < dragState.draggedIndex;
              gridCtx.beginPath();
              if (insertBefore) {
                gridCtx.moveTo(targetX - 5, targetY);
                gridCtx.lineTo(targetX - 5, targetY + targetHeight);
              } else {
                gridCtx.moveTo(targetX + targetWidth + 5, targetY);
                gridCtx.lineTo(targetX + targetWidth + 5, targetY + targetHeight);
              }
              gridCtx.stroke();
              gridCtx.restore();
            }
          }
          return;
        }
        
        // Regular hover handling (when not dragging)
        let hoveredIndex = -1;
        for (let i = 0; i < episodeTitleCards.length; i++) {
          const card = episodeTitleCards[i];
          if (card.gridCoords) {
            const { x: cardX, y: cardY, width: cardWidth, height: cardHeight } = card.gridCoords;
            
            if (x >= cardX && x <= cardX + cardWidth && y >= cardY && y <= cardY + cardHeight) {
              hoveredIndex = i;
              break;
            }
          }
        }
        
        if (hoveredIndex >= 0) {
          const card = episodeTitleCards[hoveredIndex];
          const checkboxRect = card.gridCoords.checkbox;
          const isOnCheckbox = x >= checkboxRect.x && x <= checkboxRect.x + checkboxRect.width &&
                              y >= checkboxRect.y && y <= checkboxRect.y + checkboxRect.height;
          
          gridCanvas.style.cursor = isOnCheckbox ? 'pointer' : 'grab';
          
          // Show tooltip on checkbox hover
          const tooltip = document.querySelector('.tooltip');
          if (tooltip && isOnCheckbox) {
            tooltip.textContent = 'Custom Placement Override';
            tooltip.style.opacity = 1;
            tooltip.style.visibility = 'visible';
            
            // Position tooltip near the checkbox
            const tooltipWidth = tooltip.offsetWidth;
            const canvasRect = gridCanvas.getBoundingClientRect();
            const checkboxScreenX = canvasRect.left + (checkboxRect.x / scaleX);
            const checkboxScreenY = canvasRect.top + (checkboxRect.y / scaleY);
            
            tooltip.style.left = `${checkboxScreenX - tooltipWidth / 2 + 9}px`;
            tooltip.style.top = `${checkboxScreenY - 30}px`;
            tooltip.classList.add('tooltip-top');
          } else if (tooltip) {
            tooltip.style.opacity = 0;
            tooltip.style.visibility = 'hidden';
            tooltip.classList.remove('tooltip-top');
          }
        } else {
          gridCanvas.style.cursor = 'default';
          
          // Hide tooltip when not hovering
          const tooltip = document.querySelector('.tooltip');
          if (tooltip) {
            tooltip.style.opacity = 0;
            tooltip.style.visibility = 'hidden';
            tooltip.classList.remove('tooltip-top');
          }
        }
      };
    }
    
    // Add mouse up handler for drag completion
    if (!gridCanvas.onmouseup) {
      gridCanvas.onmouseup = function(event) {
        if (dragState.isDragging) {
          const rect = gridCanvas.getBoundingClientRect();
          const scaleX = gridCanvas.width / rect.width;
          const scaleY = gridCanvas.height / rect.height;
          const x = (event.clientX - rect.left) * scaleX;
          const y = (event.clientY - rect.top) * scaleY;
          
          const dropIndex = getDropIndex(x, y);
          
          // Only reorder if we actually moved AND dropped on a different position
          if (dragState.hasMoved && dropIndex >= 0 && dropIndex !== dragState.draggedIndex) {
            const draggedCard = episodeTitleCards.splice(dragState.draggedIndex, 1)[0];
            episodeTitleCards.splice(dropIndex, 0, draggedCard);
            
            // Renumber episodes
            const formatNumber = (n) => {
              if (numberTheme === 'plain') return String(n);
              if (numberTheme === 'roman') return toRomanNumeral(n);
              return String(n).padStart(2, "0");
            };
            
            episodeTitleCards.forEach((card, index) => {
              card.episodeNumber = formatNumber(index + 1);
            });
            
            // Update the cache with the new order
            if (currentShowData && currentShowData.id) {
              const cacheKey = `${currentShowData.id}-${currentSeasonNumber}`;
              if (artworkCache.has(cacheKey)) {
                const cached = artworkCache.get(cacheKey);
                // Update the cached rendered cards with the new order
                cached.renderedCards = [...episodeTitleCards];
                artworkCache.set(cacheKey, cached);
              }
            }
            
            // Update selected index
            if (selectedCardIndex === dragState.draggedIndex) {
              selectedCardIndex = dropIndex;
            } else if (selectedCardIndex > dragState.draggedIndex && selectedCardIndex <= dropIndex) {
              selectedCardIndex--;
            } else if (selectedCardIndex < dragState.draggedIndex && selectedCardIndex >= dropIndex) {
              selectedCardIndex++;
            }
            
            showToast("Episode order updated", 2000);
          }
          
          dragState.isDragging = false;
          dragState.draggedIndex = -1;
          
          // Set flag to prevent click handler from firing if we actually moved the card
          if (dragState.hasMoved) {
            dragState.preventClick = true;
          }
          dragState.hasMoved = false;
          
          gridCanvas.style.cursor = 'default';
          renderEpisodeGrid();
        }
      };
    }
    
    // Reset on mouse leave
    if (!gridCanvas.onmouseleave) {
      gridCanvas.onmouseleave = function() {
        if (dragState.isDragging) {
          dragState.isDragging = false;
          dragState.draggedIndex = -1;
          dragState.hasMoved = false;
          renderEpisodeGrid();
        }
        gridCanvas.style.cursor = 'default';
      };
    }
  }

  // Handle clicks on the grid canvas
  function handleGridCanvasClick(event) {
    // Ignore clicks if a drag just occurred
    if (dragState && dragState.preventClick) {
      dragState.preventClick = false; // Reset immediately after blocking
      return;
    }
    
    // Get mouse position relative to canvas
    const rect = gridCanvas.getBoundingClientRect();
    const scaleX = gridCanvas.width / rect.width;
    const scaleY = gridCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if click is on any card's checkbox
    for (let i = 0; i < episodeTitleCards.length; i++) {
      const card = episodeTitleCards[i];
      if (card.gridCoords && card.gridCoords.checkbox) {
        const checkbox = card.gridCoords.checkbox;
        
        // Check if click is on checkbox
        if (
          x >= checkbox.x &&
          x <= checkbox.x + checkbox.width &&
          y >= checkbox.y &&
          y <= checkbox.y + checkbox.height
        ) {
          toggleCustomPlacement(i);
          renderEpisodeGrid(); // Redraw grid to update checkboxes
          return;
        }
      }
    }

    // If not on checkbox, handle regular card click
    for (let i = 0; i < episodeTitleCards.length; i++) {
      const card = episodeTitleCards[i];
      if (card.gridCoords) {
        const {
          x: cardX,
          y: cardY,
          width: cardWidth,
          height: cardHeight,
        } = card.gridCoords;

        if (
          x >= cardX &&
          x <= cardX + cardWidth &&
          y >= cardY &&
          y <= cardY + cardHeight
        ) {
          selectEpisode(i);
          showSingleCardView();
          return;
        }
      }
    }
  }

  // Toggle custom placement for a card
  function toggleCustomPlacement(cardIndex) {
    const card = episodeTitleCards[cardIndex];
    if (!card) return;
    
    // If currently enabled, disable and remove settings
    if (card.hasCustomPlacement) {
      card.hasCustomPlacement = false;
      card.customPlacement = null;
      showToast(`Removed custom placement for Episode ${card.episodeNumber}`);
      renderEpisodeGrid();
      return;
    }

    // Show dialog for custom placement, only apply if confirmed
    showCustomPlacementDialog(cardIndex, {
      onConfirm: (customPlacement) => {
        card.hasCustomPlacement = true;
        card.customPlacement = customPlacement;
        renderEpisodeGrid();
        showToast(`Custom placement applied to Episode ${card.episodeNumber}`);
      },
      onCancel: () => {
        // Do nothing, don't enable custom placement
        card.hasCustomPlacement = false;
        card.customPlacement = null;
        renderEpisodeGrid();
      }
    });
  }

  // Show dialog for custom placement settings
  function showCustomPlacementDialog(cardIndex, callbacks = {}) {
    const card = episodeTitleCards[cardIndex];
    if (!card) return;
    
    // Create dialog overlay
    const overlay = document.createElement("div");
    overlay.className = "custom-overlay";
    overlay.style.display = "flex";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "9999";
    
    // Create dialog content - improved styling to match progress overlay
    const dialog = document.createElement("div");
    dialog.className = "custom-modal custom-placement-modal";
    dialog.style.width = "400px";
    dialog.style.background = "linear-gradient(135deg, #161830 0%, #0F1020 100%)";
    dialog.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.6)";
    dialog.style.border = "1px solid rgba(255, 255, 255, 0.08)";
    dialog.style.borderRadius = "16px";
    dialog.style.padding = "28px 24px";
    dialog.style.animation = "modalFadeIn 0.3s ease-out forwards";
    
    // Add animation for the modal
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleEl);
    
    // Header section with improved styling
    const headerWrapper = document.createElement("div");
    headerWrapper.style.display = "flex";
    headerWrapper.style.flexDirection = "column";
    headerWrapper.style.alignItems = "center";
    headerWrapper.style.textAlign = "center";
    headerWrapper.style.marginBottom = "25px";
    headerWrapper.style.padding = "0 0 20px 0";
    headerWrapper.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";

    // Accent color bar at the top for visual interest
    const accentBar = document.createElement("div");
    accentBar.style.background = "linear-gradient(90deg, #00bfa5, #8e24aa)";
    accentBar.style.height = "4px";
    accentBar.style.width = "60px";
    accentBar.style.borderRadius = "2px";
    accentBar.style.marginBottom = "20px";
    headerWrapper.appendChild(accentBar);

    // Add episode title with improved styling
    const episodeTitle = document.createElement("h3");
    episodeTitle.textContent = card.title;
    episodeTitle.style.margin = "0 0 12px 0";
    episodeTitle.style.color = "#fff";
    episodeTitle.style.fontSize = "24px";
    episodeTitle.style.fontWeight = "600";
    episodeTitle.style.textShadow = "0 2px 4px rgba(0,0,0,0.3)";
    headerWrapper.appendChild(episodeTitle);
    
    // Add episode info with improved styling
    const episodeInfo = document.createElement("div");
    // Use "Series" label if selected in dropdown for custom placement dialog
    let customPlacementLabel = "Season";
    if (document.getElementById("series-type") && document.getElementById("series-type").value === "series") {
      customPlacementLabel = "Series";
    }
    episodeInfo.innerHTML = `${customPlacementLabel} ${parseInt(card.seasonNumber)} <span style="color: #00bfa5; margin: 0 6px;">•</span> Episode ${parseInt(card.episodeNumber)}`;
    episodeInfo.style.color = "#FFFFFF";
    episodeInfo.style.fontSize = "15px";
    episodeInfo.style.opacity = "0.85";
    episodeInfo.style.fontWeight = "500";
    headerWrapper.appendChild(episodeInfo);

    // (Preview container and canvas will be created after tempPlacement is initialized)
    
    dialog.appendChild(headerWrapper);
    
    // Add description with improved styling
    const description = document.createElement("div");
    description.style.background = "rgba(0, 191, 165, 0.08)";
    description.style.padding = "14px 16px";
    description.style.borderRadius = "8px";
    description.style.marginBottom = "25px";
    description.style.borderLeft = "3px solid #00bfa5";
    description.style.width = "80%";
    description.style.margin = "0 auto 28px";
    
    const descText = document.createElement("p");
    descText.innerHTML = "This episode will use <strong>custom placement settings</strong> that override the global settings.";
    descText.style.margin = "0";
    descText.style.color = "rgba(255, 255, 255, 0.9)";
    descText.style.fontSize = "14px";
    descText.style.lineHeight = "1.5";
    descText.style.textAlign = "center";
    
    description.appendChild(descText);
    dialog.appendChild(description);
    
    // Form wrapper for better organization
    const formWrapper = document.createElement("div");
    formWrapper.style.display = "flex";
    formWrapper.style.flexDirection = "column";
    formWrapper.style.gap = "22px";
    formWrapper.style.marginBottom = "25px";

    // Add Text Position setting with improved styling
    const positionGroup = document.createElement("div");
    positionGroup.style.display = "flex";
    positionGroup.style.flexDirection = "column";
    positionGroup.style.gap = "10px";

    const positionLabel = document.createElement("div");
    positionLabel.textContent = "Text Position";
    positionLabel.style.color = "#00bfa5";
    positionLabel.style.fontSize = "14px";
    positionLabel.style.fontWeight = "600";
    positionLabel.style.marginLeft = "2px";
    positionGroup.appendChild(positionLabel);

    const placementSelect = document.createElement("select");
    placementSelect.className = "dialog-select";
    placementSelect.style.width = "100%";
    placementSelect.style.padding = "12px 16px";
    placementSelect.style.backgroundColor = "rgba(15, 16, 32, 0.8)";
    placementSelect.style.color = "white";
    placementSelect.style.border = "1px solid rgba(255, 255, 255, 0.15)";
    placementSelect.style.borderRadius = "6px";
    placementSelect.style.fontSize = "14px";
    placementSelect.style.appearance = "none";
    placementSelect.style.backgroundImage = "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')";
    placementSelect.style.backgroundRepeat = "no-repeat";
    placementSelect.style.backgroundPosition = "right 15px center";
    placementSelect.style.backgroundSize = "12px auto";
    placementSelect.style.paddingRight = "30px";
    placementSelect.style.cursor = "pointer";

    // Add placement options
    const placementOptions = [
      { value: "leftMiddle", text: "Left Middle" },
      { value: "centerMiddle", text: "Center Middle" },
      { value: "rightMiddle", text: "Right Middle" },
      { value: "giggle", text: "Center Bottom" },
      { value: "manhunt", text: "Left Bottom" },
      { value: "centerTop", text: "Center Top" }
    ];

    placementOptions.forEach(option => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.text;
      placementSelect.appendChild(optionEl);
    });





    // --- X and Y Offset Sliders (with step=5 and increment/decrement buttons) ---
    // Use a temporary object for live preview, only commit on Apply
    let tempPlacement = card.customPlacement ? { ...card.customPlacement } : {
      placement: placementSelect.value,
      effectType: effectType.value,
      blendMode: blendMode.value,
      textXOffset: typeof horizontalPosition.value === 'string' ? parseInt(horizontalPosition.value) : (horizontalPosition.value || 0),
      textYOffset: typeof verticalPosition.value === 'string' ? parseInt(verticalPosition.value) : (verticalPosition.value || 0)
    };

    // Set initial value if previously set
    if (card.customPlacement && card.customPlacement.placement) {
      placementSelect.value = card.customPlacement.placement;
    } else {
      placementSelect.value = presetSelect.value;
    }

    // Listen for changes to update tempPlacement and preview
    placementSelect.addEventListener('change', function() {
      tempPlacement.placement = placementSelect.value;
      if (typeof drawPreviewCanvas === 'function') drawPreviewCanvas();
      if (typeof updatePreview === 'function') updatePreview();
    });

    positionGroup.appendChild(placementSelect);
    formWrapper.appendChild(positionGroup);

    // REMOVE duplicate initialPlacement/tempPlacement block below (if present)
    // (This is a fix for the double declaration error)


    // --- X and Y Offset Sliders (with step=5 and increment/decrement buttons) ---
    // (Removed duplicate tempPlacement declaration)

    // Add episode thumbnail with improved styling (PREVIEW CANVAS)
    if (card.thumbnailImg) {
      const previewContainer = document.createElement("div");
      previewContainer.style.width = "220px";
      previewContainer.style.height = "124px";
      previewContainer.style.marginTop = "20px";
      previewContainer.style.overflow = "hidden";
      previewContainer.style.borderRadius = "8px";
      previewContainer.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
      previewContainer.style.border = "2px solid rgba(255, 255, 255, 0.1)";
      previewContainer.style.position = "relative";

      // Add shimmer effect to preview container
      previewContainer.style.background = "linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)";
      previewContainer.style.backgroundSize = "200% 200%";
      previewContainer.style.animation = "shimmer 1.5s infinite";

      // Add shimmer animation
      const shimmerStyle = document.createElement('style');
      shimmerStyle.textContent = `
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
      `;
      document.head.appendChild(shimmerStyle);

      // Create a canvas for live preview
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = 440; // 2x for HiDPI
      previewCanvas.height = 248;
      previewCanvas.style.width = "220px";
      previewCanvas.style.height = "124px";
      previewCanvas.style.display = "block";
      previewCanvas.style.borderRadius = "8px";
      previewCanvas.style.background = "#111";
      previewContainer.appendChild(previewCanvas);
      headerWrapper.appendChild(previewContainer);

      // Helper to draw the preview
      function drawPreviewCanvas() {
        // Create a temp card object with tempPlacement for preview
        const previewCard = { ...card, hasCustomPlacement: true, customPlacement: { ...tempPlacement } };
        // Draw using the same function as grid, but at 1280x720 then scale
        const refWidth = 1280, refHeight = 720;
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = refWidth;
        tempCanvas.height = refHeight;
        const tempCtx = tempCanvas.getContext("2d");
        drawCardToTempContext(tempCtx, previewCard, refWidth, refHeight);
        // Draw scaled to previewCanvas
        const ctx = previewCanvas.getContext("2d");
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(tempCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
      }

      // Initial draw
      drawPreviewCanvas();

      // Redraw preview on any placement change
      const updatePreview = () => drawPreviewCanvas();

      // Attach to slider/select events after they are created
      setTimeout(() => {
        [xOffsetSlider, yOffsetSlider, placementSelect].forEach(el => {
          if (el) el.addEventListener('input', updatePreview);
        });
        if (effectTypeSelect) effectTypeSelect.addEventListener('change', updatePreview);
        if (blendSelect) blendSelect.addEventListener('change', updatePreview);
      }, 0);
    }

    // X Offset
    const xOffsetGroup = document.createElement("div");
    xOffsetGroup.style.display = "flex";
    xOffsetGroup.style.flexDirection = "column";
    xOffsetGroup.style.gap = "6px";
    const xOffsetLabel = document.createElement("div");
    xOffsetLabel.textContent = "Text X Offset";
    xOffsetLabel.style.color = "#00bfa5";
    xOffsetLabel.style.fontSize = "14px";
    xOffsetLabel.style.fontWeight = "600";
    xOffsetLabel.style.marginLeft = "2px";
    xOffsetGroup.appendChild(xOffsetLabel);
    const xOffsetSlider = document.createElement("input");
    xOffsetSlider.type = "range";
    xOffsetSlider.min = "-350";
    xOffsetSlider.max = "350";
    xOffsetSlider.step = "5";
    xOffsetSlider.value = tempPlacement.textXOffset;
    xOffsetSlider.style.width = "100%";
    xOffsetSlider.style.margin = "0";
    xOffsetSlider.style.background = "#222";
    xOffsetSlider.style.borderRadius = "4px";
    xOffsetSlider.style.height = "4px";
    xOffsetSlider.style.appearance = "none";
    xOffsetSlider.style.outline = "none";
    // Value display
    const xOffsetValue = document.createElement("span");
    xOffsetValue.textContent = xOffsetSlider.value;
    xOffsetValue.style.marginLeft = "8px";
    xOffsetValue.style.color = "#fff";
    // - button
    const xOffsetDecBtn = document.createElement("button");
    xOffsetDecBtn.type = "button";
    xOffsetDecBtn.textContent = "-";
    xOffsetDecBtn.className = "edit-bar-range-btn";
    xOffsetDecBtn.style.marginRight = "4px";
    xOffsetDecBtn.tabIndex = -1;
    // + button
    const xOffsetIncBtn = document.createElement("button");
    xOffsetIncBtn.type = "button";
    xOffsetIncBtn.textContent = "+";
    xOffsetIncBtn.className = "edit-bar-range-btn";
    xOffsetIncBtn.style.marginLeft = "4px";
    xOffsetIncBtn.tabIndex = -1;
    // Button logic
    xOffsetDecBtn.addEventListener("click", () => {
      let value = parseInt(xOffsetSlider.value, 10);
      value = Math.max(-350, value - 5);
      xOffsetSlider.value = value;
      xOffsetSlider.dispatchEvent(new Event("input", { bubbles: true }));
    });
    xOffsetIncBtn.addEventListener("click", () => {
      let value = parseInt(xOffsetSlider.value, 10);
      value = Math.min(350, value + 5);
      xOffsetSlider.value = value;
      xOffsetSlider.dispatchEvent(new Event("input", { bubbles: true }));
    });
    xOffsetSlider.addEventListener("input", () => {
      xOffsetValue.textContent = xOffsetSlider.value;
      tempPlacement.textXOffset = parseInt(xOffsetSlider.value, 10);
      // No live preview to grid
    });
    const xOffsetRow = document.createElement("div");
    xOffsetRow.style.display = "flex";
    xOffsetRow.style.alignItems = "center";
    xOffsetRow.appendChild(xOffsetDecBtn);
    xOffsetRow.appendChild(xOffsetSlider);
    xOffsetRow.appendChild(xOffsetIncBtn);
    xOffsetRow.appendChild(xOffsetValue);
    xOffsetGroup.appendChild(xOffsetRow);
    formWrapper.appendChild(xOffsetGroup);

    // Y Offset
    const yOffsetGroup = document.createElement("div");
    yOffsetGroup.style.display = "flex";
    yOffsetGroup.style.flexDirection = "column";
    yOffsetGroup.style.gap = "6px";
    const yOffsetLabel = document.createElement("div");
    yOffsetLabel.textContent = "Text Y Offset";
    yOffsetLabel.style.color = "#00bfa5";
    yOffsetLabel.style.fontSize = "14px";
    yOffsetLabel.style.fontWeight = "600";
    yOffsetLabel.style.marginLeft = "2px";
    yOffsetGroup.appendChild(yOffsetLabel);
    const yOffsetSlider = document.createElement("input");
    yOffsetSlider.type = "range";
    yOffsetSlider.min = "-350";
    yOffsetSlider.max = "350";
    yOffsetSlider.step = "5";
    yOffsetSlider.value = tempPlacement.textYOffset;
    yOffsetSlider.style.width = "100%";
    yOffsetSlider.style.margin = "0";
    yOffsetSlider.style.background = "#222";
    yOffsetSlider.style.borderRadius = "4px";
    yOffsetSlider.style.height = "4px";
    yOffsetSlider.style.appearance = "none";
    yOffsetSlider.style.outline = "none";
    // Value display
    const yOffsetValue = document.createElement("span");
    yOffsetValue.textContent = yOffsetSlider.value;
    yOffsetValue.style.marginLeft = "8px";
    yOffsetValue.style.color = "#fff";
    // - button
    const yOffsetDecBtn = document.createElement("button");
    yOffsetDecBtn.type = "button";
    yOffsetDecBtn.textContent = "-";
    yOffsetDecBtn.className = "edit-bar-range-btn";
    yOffsetDecBtn.style.marginRight = "4px";
    yOffsetDecBtn.tabIndex = -1;
    // + button
    const yOffsetIncBtn = document.createElement("button");
    yOffsetIncBtn.type = "button";
    yOffsetIncBtn.textContent = "+";
    yOffsetIncBtn.className = "edit-bar-range-btn";
    yOffsetIncBtn.style.marginLeft = "4px";
    yOffsetIncBtn.tabIndex = -1;
    // Button logic
    yOffsetDecBtn.addEventListener("click", () => {
      let value = parseInt(yOffsetSlider.value, 10);
      value = Math.max(-350, value - 5);
      yOffsetSlider.value = value;
      yOffsetSlider.dispatchEvent(new Event("input", { bubbles: true }));
    });
    yOffsetIncBtn.addEventListener("click", () => {
      let value = parseInt(yOffsetSlider.value, 10);
      value = Math.min(350, value + 5);
      yOffsetSlider.value = value;
      yOffsetSlider.dispatchEvent(new Event("input", { bubbles: true }));
    });
    yOffsetSlider.addEventListener("input", () => {
      yOffsetValue.textContent = yOffsetSlider.value;
      tempPlacement.textYOffset = parseInt(yOffsetSlider.value, 10);
      // No live preview to grid
    });
    const yOffsetRow = document.createElement("div");
    yOffsetRow.style.display = "flex";
    yOffsetRow.style.alignItems = "center";
    yOffsetRow.appendChild(yOffsetDecBtn);
    yOffsetRow.appendChild(yOffsetSlider);
    yOffsetRow.appendChild(yOffsetIncBtn);
    yOffsetRow.appendChild(yOffsetValue);
    yOffsetGroup.appendChild(yOffsetRow);
    formWrapper.appendChild(yOffsetGroup);
    
    // Add Effect Type setting with improved styling
    const effectGroup = document.createElement("div");
    effectGroup.style.display = "flex";
    effectGroup.style.flexDirection = "column";
    effectGroup.style.gap = "10px";
    
    const effectLabel = document.createElement("div");
    effectLabel.textContent = "Gradient Effect";
    effectLabel.style.color = "#00bfa5";
    effectLabel.style.fontSize = "14px";
    effectLabel.style.fontWeight = "600";
    effectLabel.style.marginLeft = "2px";
    effectGroup.appendChild(effectLabel);
    
    const effectTypeSelect = document.createElement("select");
    effectTypeSelect.className = "dialog-select";
    effectTypeSelect.style.width = "100%";
    effectTypeSelect.style.padding = "12px 16px";
    effectTypeSelect.style.backgroundColor = "rgba(15, 16, 32, 0.8)";
    effectTypeSelect.style.color = "white";
    effectTypeSelect.style.border = "1px solid rgba(255, 255, 255, 0.15)";
    effectTypeSelect.style.borderRadius = "6px";
    effectTypeSelect.style.fontSize = "14px";
    effectTypeSelect.style.appearance = "none";
    effectTypeSelect.style.backgroundImage = "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')";
    effectTypeSelect.style.backgroundRepeat = "no-repeat";
    effectTypeSelect.style.backgroundPosition = "right 15px center";
    effectTypeSelect.style.backgroundSize = "12px auto";
    effectTypeSelect.style.paddingRight = "30px";
    effectTypeSelect.style.cursor = "pointer";
    
    // Add effect type options (including half gradients)
    const effectOptions = [
      { value: "none", text: "None" },
      { value: "leftToRight", text: "Left → Right" },
      { value: "rightToLeft", text: "Right → Left" },
      { value: "topToBottom", text: "Top → Bottom" },
      { value: "bottomToTop", text: "Bottom → Top" },
      { value: "leftHalf", text: "Left Half Only" },
      { value: "rightHalf", text: "Right Half Only" },
      { value: "topHalf", text: "Top Half Only" },
      { value: "bottomHalf", text: "Bottom Half Only" },
      { value: "radial", text: "Radial (Center Out)" }
    ];
    
    effectOptions.forEach(option => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.text;
      effectTypeSelect.appendChild(optionEl);
    });
    
    // Set initial value if previously set
    effectTypeSelect.value = tempPlacement.effectType;
    effectTypeSelect.addEventListener('change', () => {
      tempPlacement.effectType = effectTypeSelect.value;
      // No live preview to grid
    });
    effectGroup.appendChild(effectTypeSelect);
    formWrapper.appendChild(effectGroup);
    
    // Add Blend Mode setting with improved styling
    const blendGroup = document.createElement("div");
    blendGroup.style.display = "flex";
    blendGroup.style.flexDirection = "column";
    blendGroup.style.gap = "10px";
    
    const blendLabel = document.createElement("div");
    blendLabel.textContent = "Blend Mode";
    blendLabel.style.color = "#00bfa5";
    blendLabel.style.fontSize = "14px";
    blendLabel.style.fontWeight = "600";
    blendLabel.style.marginLeft = "2px";
    blendGroup.appendChild(blendLabel);
    
    const blendSelect = document.createElement("select");
    blendSelect.className = "dialog-select";
    blendSelect.style.width = "100%";
    blendSelect.style.padding = "12px 16px";
    blendSelect.style.backgroundColor = "rgba(15, 16, 32, 0.8)";
    blendSelect.style.color = "white";
    blendSelect.style.border = "1px solid rgba(255, 255, 255, 0.15)";
    blendSelect.style.borderRadius = "6px";
    blendSelect.style.fontSize = "14px";
    blendSelect.style.appearance = "none";
    blendSelect.style.backgroundImage = "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')";
    blendSelect.style.backgroundRepeat = "no-repeat";
    blendSelect.style.backgroundPosition = "right 15px center";
    blendSelect.style.backgroundSize = "12px auto";
    blendSelect.style.paddingRight = "30px";
    blendSelect.style.cursor = "pointer";
    
    // Add blend mode options
    const blendOptions = [
      { value: "normal", text: "Normal" },
      { value: "multiply", text: "Multiply" },
      { value: "screen", text: "Screen" },
      { value: "overlay", text: "Overlay" },
      { value: "darken", text: "Darken" },
      { value: "lighten", text: "Lighten" },
      { value: "color-dodge", text: "Color Dodge" },
      { value: "color-burn", text: "Color Burn" },
      { value: "hard-light", text: "Hard Light" },
      { value: "soft-light", text: "Soft Light" }
    ];
    
    blendOptions.forEach(option => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.text;
      blendSelect.appendChild(optionEl);
    });
    
    // Set initial value if previously set
    blendSelect.value = tempPlacement.blendMode;
    blendSelect.addEventListener('change', () => {
      tempPlacement.blendMode = blendSelect.value;
      // No live preview to grid
    });
    blendGroup.appendChild(blendSelect);
    formWrapper.appendChild(blendGroup);
    
    dialog.appendChild(formWrapper);
    
    // Add buttons with improved styling
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "10px";
    buttonsContainer.style.justifyContent = "center";
    buttonsContainer.style.marginTop = "15px";
    buttonsContainer.style.paddingTop = "15px";
    buttonsContainer.style.borderTop = "1px solid rgba(255, 255, 255, 0.08)";
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    cancelButton.style.color = "white";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "6px";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.fontSize = "14px";
    cancelButton.style.fontWeight = "500";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.minWidth = "90px";
    cancelButton.style.transition = "background-color 0.2s ease";
    
    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });
    
    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });
    
    cancelButton.addEventListener("click", () => {
      // On cancel, just close dialog, do not update card or grid
      document.body.removeChild(overlay);
      if (callbacks && callbacks.onCancel) callbacks.onCancel();
    });

    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply Custom Settings";
    applyButton.style.background = "linear-gradient(135deg, #00bfa5, #8e24aa)";
    applyButton.style.color = "white";
    applyButton.style.border = "none";
    applyButton.style.borderRadius = "6px";
    applyButton.style.padding = "10px 20px";
    applyButton.style.fontSize = "14px";
    applyButton.style.fontWeight = "500";
    applyButton.style.cursor = "pointer";
    applyButton.style.minWidth = "180px";
    applyButton.style.transition = "filter 0.2s ease";
    applyButton.style.boxShadow = "0 2px 8px rgba(0, 191, 165, 0.25)";
    applyButton.addEventListener("mouseenter", () => {
      applyButton.style.background = "linear-gradient(135deg, #1de9b6, #a600ff)";
      applyButton.style.transform = "translateY(-2px)";
      applyButton.style.boxShadow = "0 6px 12px rgba(0, 191, 165, 0.3)";
    });
    applyButton.addEventListener("mouseleave", () => {
      applyButton.style.background = "linear-gradient(135deg, #00bfa5, #8e24aa)";
      applyButton.style.transform = "translateY(0)";
      applyButton.style.boxShadow = "0 4px 10px rgba(0, 191, 165, 0.2)";
    });
    applyButton.addEventListener("click", () => {
      // Commit custom placement settings
      document.body.removeChild(overlay);
      if (callbacks && callbacks.onConfirm) callbacks.onConfirm({ ...tempPlacement });
    });

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(applyButton);
    dialog.appendChild(buttonsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }

  // =====================================================
  // PROGRESS OVERLAY FUNCTIONS
  // =====================================================

  // Show progress overlay with message
  function showProgressOverlay(message, showProgressBar = false) {
    let overlay = document.getElementById("progress-overlay");

    if (!overlay) {
      // Create corner notification matching background cache theme
      overlay = document.createElement("div");
      overlay.id = "progress-overlay";
      overlay.style.position = "fixed";
      overlay.style.bottom = "20px";
      overlay.style.right = "20px";
      overlay.style.width = "320px";
      overlay.style.backgroundColor = "rgba(22, 24, 48, 0.95)";
      overlay.style.borderRadius = "12px";
      overlay.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(142, 36, 170, 0.3)";
      overlay.style.border = "1px solid rgba(142, 36, 170, 0.4)";
      overlay.style.padding = "16px 20px";
      overlay.style.zIndex = "9999";
      overlay.style.backdropFilter = "blur(8px)";
      overlay.style.fontFamily = "Gabarito, sans-serif";
      document.body.appendChild(overlay);

      // Create spinner
      const spinner = document.createElement("div");
      spinner.className = "loading-spinner-small";
      spinner.style.border = "2px solid rgba(255, 255, 255, 0.1)";
      spinner.style.borderTop = "2px solid #8e24aa";
      spinner.style.borderRadius = "50%";
      spinner.style.width = "20px";
      spinner.style.height = "20px";
      spinner.style.animation = "spin 1s linear infinite";
      spinner.style.display = "inline-block";
      spinner.style.marginRight = "12px";
      spinner.style.verticalAlign = "middle";

      // Add spinner animation
      if (!document.getElementById("spinner-style")) {
        const style = document.createElement("style");
        style.id = "spinner-style";
        style.textContent =
          "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }";
        document.head.appendChild(style);
      }

      // Create header with spinner and message
      const headerEl = document.createElement("div");
      headerEl.style.display = "flex";
      headerEl.style.alignItems = "center";
      headerEl.style.marginBottom = "12px";
      headerEl.appendChild(spinner);

      // Create message element
      const messageEl = document.createElement("div");
      messageEl.id = "progress-message";
      messageEl.style.color = "white";
      messageEl.style.fontSize = "14px";
      messageEl.style.fontWeight = "600";
      messageEl.style.flex = "1";
      headerEl.appendChild(messageEl);
      overlay.appendChild(headerEl);

      // Create progress container
      const progressContainer = document.createElement("div");
      progressContainer.id = "progress-container";
      progressContainer.style.width = "100%";
      progressContainer.style.height = "4px";
      progressContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      progressContainer.style.borderRadius = "2px";
      progressContainer.style.marginBottom = "8px";
      progressContainer.style.overflow = "hidden";
      progressContainer.style.display = showProgressBar ? "block" : "none";

      // Create progress bar
      const progressBar = document.createElement("div");
      progressBar.id = "progress-bar";
      progressBar.style.width = "0%";
      progressBar.style.height = "100%";
      progressBar.style.background = "linear-gradient(90deg, #8e24aa, #00bfa5)";
      progressBar.style.transition = "width 0.3s ease";
      progressBar.style.borderRadius = "2px";

      progressContainer.appendChild(progressBar);
      overlay.appendChild(progressContainer);

      // Create details element
      const detailsEl = document.createElement("div");
      detailsEl.id = "progress-details";
      detailsEl.style.color = "rgba(255, 255, 255, 0.6)";
      detailsEl.style.fontSize = "12px";
      detailsEl.style.lineHeight = "1.4";
      overlay.appendChild(detailsEl);
    }

    // Update message
    const messageEl = document.getElementById("progress-message");
    if (messageEl) {
      messageEl.textContent = message;
    }

    // Show/hide progress bar
    const progressContainer = document.getElementById("progress-container");
    if (progressContainer) {
      progressContainer.style.display = showProgressBar ? "block" : "none";
    }

    // Reset progress bar
    if (showProgressBar) {
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.width = "0%";
      }
    }

    // Clear details
    const detailsEl = document.getElementById("progress-details");
    if (detailsEl) {
      detailsEl.textContent = "";
    }

    return overlay;
  }

  // Update progress bar and detail message
  function updateProgressOverlay(progress, detailMessage = "") {
    const progressBar = document.getElementById("progress-bar");
    const detailsEl = document.getElementById("progress-details");

    if (progressBar) {
      const safeProgress = Math.max(0, Math.min(100, progress));
      progressBar.style.width = `${safeProgress}%`;
    }

    if (detailsEl && detailMessage) {
      detailsEl.textContent = detailMessage;
    }
  }

  // Hide and remove progress overlay
  function hideProgressOverlay() {
    const overlay = document.getElementById("progress-overlay");
    if (overlay) {
      overlay.style.transition = "opacity 0.3s ease";
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
  }

  // =====================================================
  // DOWNLOAD FUNCTIONALITY
  // =====================================================

  // Download a single title card
  function downloadSingleCard() {
    // Create filename based on title card content
    let filename = "title-card.jpg";
    if (titleInput.value) {
      filename = titleInput.value.replace(/[/\\?%*:|"<>]/g, "-");
      if (seasonNumberInput.value && episodeNumberInput.value) {
        filename = `S${seasonNumberInput.value}E${episodeNumberInput.value} - ${filename}`;
      }
      filename += ".jpg";
    }

    // Export at 1920x1080 regardless of current canvas size
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1920;
    exportCanvas.height = 1080;
    const exportCtx = exportCanvas.getContext("2d");
    drawCardToContext(exportCtx, 1920, 1080);
    // Use toBlob with JPEG format for smaller file size
    exportCanvas.toBlob(function(blob) {
      const link = document.createElement("a");
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      link.click();
      showToast("Title card downloaded successfully");
    }, "image/jpeg", 0.95); // 0.95 = high quality JPEG, much smaller than PNG
  }

  // Dynamically load JSZip library
  async function loadJSZip() {
    return new Promise((resolve, reject) => {
      if (window.JSZip) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = resolve;
      script.onerror = () => {
        reject(new Error("Failed to load JSZip library"));
        alert(
          "Failed to load required library. Please check your internet connection and try again."
        );
      };
      document.head.appendChild(script);
    });
  }

  // Download all episode title cards as a zip file
  async function batchDownloadTitleCards() {
    // Ensure JSZip is loaded
    if (!window.JSZip) {
      showProgressOverlay("Loading required library...", false);
      await loadJSZip();
      hideProgressOverlay();
    }

    const zip = new JSZip();
    const showName = currentShowData.name.replace(/[^\w\s]/gi, "");
    const seasonFolder = zip.folder(
      `${showName} - Season ${currentSeasonNumber}`
    );

    // Show loading message
    const loadingMsg = document.createElement("div");
    loadingMsg.style.position = "fixed";
    loadingMsg.style.top = "50%";
    loadingMsg.style.left = "50%";
    loadingMsg.style.transform = "translate(-50%, -50%)";
    loadingMsg.style.background = "rgba(0, 0, 0, 0.8)";
    loadingMsg.style.color = "white";
    loadingMsg.style.padding = "20px";
    loadingMsg.style.borderRadius = "10px";
    loadingMsg.style.zIndex = "1000";
    loadingMsg.style.backdropFilter = "blur(6px)";
    loadingMsg.style.boxShadow = "0 4px 20px rgba(0, 255, 255, 0.2)";
    loadingMsg.textContent = "Preparing title cards for download...";
    document.body.appendChild(loadingMsg);

    // Create promises for each title card
    const promises = episodeTitleCards.map((card, index) => {
      return new Promise((resolve) => {
        const episodeCanvas = document.createElement("canvas");
        episodeCanvas.width = 1920;
        episodeCanvas.height = 1080;

        drawCardToTempContext(episodeCanvas.getContext("2d"), card, 1920, 1080);

        episodeCanvas.toBlob((blob) => {
          const filename = `S${card.seasonNumber}E${
            card.episodeNumber
          } - ${card.title.replace(/[/\\?%*:|"<>]/g, "-")}.jpg`;
          seasonFolder.file(filename, blob);
          resolve();
        }, "image/jpeg", 0.95); // 0.95 = high quality JPEG, much smaller than PNG
      });
    });

    try {
      // Wait for all cards to be processed
      await Promise.all(promises);

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      document.body.removeChild(loadingMsg);

      // Trigger download
      const link = document.createElement("a");
      link.download = `${showName} - Season ${currentSeasonNumber} Title Cards.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.style.position = "fixed";
      successMsg.style.bottom = "20px";
      successMsg.style.left = "50%";
      successMsg.style.transform = "translateX(-50%)";
      successMsg.style.background = "rgba(0, 255, 255, 0.2)";
      successMsg.style.color = "white";
      successMsg.style.padding = "10px 20px";
      successMsg.style.borderRadius = "6px";
      successMsg.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
      successMsg.style.backdropFilter = "blur(6px)";
      successMsg.style.zIndex = "1000";
      successMsg.textContent = "All title cards downloaded successfully!";
      document.body.appendChild(successMsg);

      // Auto-hide success message
      setTimeout(() => {
        successMsg.style.opacity = "0";
        successMsg.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          document.body.removeChild(successMsg);
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Error creating zip file:", error);
      document.body.removeChild(loadingMsg);
      alert("Failed to create zip file. Please try again.");
    }
  }

  // Download title cards for all cached seasons
  async function downloadAllSeasonsTitleCards() {
    // Ensure JSZip is loaded
    if (!window.JSZip) {
      showProgressOverlay("Loading required library...", false);
      await loadJSZip();
      hideProgressOverlay();
    }

    if (!currentShowData) {
      alert("Please select a show first!");
      return;
    }

    // Check if we have cached seasons
    if (artworkCache.size === 0) {
      alert("No seasons are cached yet. Please wait for caching to complete.");
      return;
    }

    const zip = new JSZip();
    const showName = currentShowData.name.replace(/[^\w\s]/gi, "");
    
    // Show progress notification
    updateBackgroundCacheNotification(0, `Preparing download for all seasons...`);

    try {
      // Get all cached season numbers for this show
      const cachedSeasons = [];
      for (const [key, value] of artworkCache.entries()) {
        if (key.startsWith(`${currentShowData.id}-`)) {
          const seasonNum = key.split('-')[1];
          cachedSeasons.push({ key, seasonNum, data: value.seasonData });
        }
      }

      if (cachedSeasons.length === 0) {
        hideBackgroundCacheNotification();
        alert("No seasons are cached for this show.");
        return;
      }

      // Sort seasons by number
      cachedSeasons.sort((a, b) => parseInt(a.seasonNum) - parseInt(b.seasonNum));

      let totalEpisodes = 0;
      let processedEpisodes = 0;

      // Count total episodes
      cachedSeasons.forEach(season => {
        totalEpisodes += season.data.episodes.length;
      });

      // Process each season
      for (const season of cachedSeasons) {
        const seasonData = season.data;
        const seasonNum = season.seasonNum;
        const seasonFolder = zip.folder(`Season ${seasonNum}`);

        updateBackgroundCacheNotification(
          Math.floor((processedEpisodes / totalEpisodes) * 100),
          `Processing Season ${seasonNum}...`
        );

        // Create promises for each episode in this season
        const episodePromises = seasonData.episodes.map((episode, index) => {
          return new Promise(async (resolve) => {
            try {
              // Create a temporary card object similar to episodeTitleCards structure
              const formatNumber = (n) => {
                if (numberTheme === 'plain') return String(Number(n));
                if (numberTheme === 'roman') return toRomanNumeral(Number(n));
                return String(n).padStart(2, "0");
              };

              const card = {
                title: episode.name,
                seasonNumber: formatNumber(episode.season_number),
                episodeNumber: formatNumber(episode.episode_number),
                thumbnailImg: null,
                currentSettings: {
                  fontFamily: fontFamily.value,
                  infoFontFamily: document.getElementById("info-font-family").value,
                  textSize: textSize.value,
                  infoTextSize: document.getElementById("info-text-size").value,
                  textShadowBlur: textShadowBlur.value,
                  textOutlineWidth: textOutlineWidth.value,
                  infoShadowBlur: document.getElementById("info-shadow-blur").value,
                  infoOutlineWidth: document.getElementById("info-outline-width").value,
                  titleInfoSpacing: titleInfoSpacing.value,
                  textColor: window["text-color"] || "#ffffff",
                  infoColor: window["info-color"] || "#ffffff",
                  textShadowColor: window["text-shadow-color"] || "#000000",
                  textOutlineColor: window["text-outline-color"] || "#000000",
                  infoShadowColor: window["info-shadow-color"] || "#000000",
                  infoOutlineColor: window["info-outline-color"] || "#000000",
                  effectType: effectType.value,
                  gradientColor: window["gradient-color"] || "#000000",
                  gradientOpacity: gradientOpacity.value,
                  blendMode: blendMode.value,
                  titleWrapping: document.getElementById("title-wrapping") ? 
                    document.getElementById("title-wrapping").value : 'singleLine',
                  placement: presetSelect.value,
                },
              };

              // Load thumbnail if available
              if (episode.still_path) {
                try {
                  card.thumbnailImg = await getEpisodeThumbnail(episode.still_path);
                } catch (err) {
                  console.log(`Could not load thumbnail for S${seasonNum}E${episode.episode_number}`);
                }
              }

              // Draw card to canvas
              const episodeCanvas = document.createElement("canvas");
              episodeCanvas.width = 1920;
              episodeCanvas.height = 1080;
              drawCardToTempContext(episodeCanvas.getContext("2d"), card, 1920, 1080);

              // Convert to blob and add to zip
              episodeCanvas.toBlob((blob) => {
                const filename = `S${card.seasonNumber}E${card.episodeNumber} - ${card.title.replace(/[/\\?%*:|"<>]/g, "-")}.jpg`;
                seasonFolder.file(filename, blob);
                processedEpisodes++;
                resolve();
              }, "image/jpeg", 0.95);
            } catch (err) {
              console.error(`Error processing episode ${episode.episode_number}:`, err);
              processedEpisodes++;
              resolve();
            }
          });
        });

        await Promise.all(episodePromises);
      }

      // Generate and download zip
      updateBackgroundCacheNotification(100, "Generating zip file...");
      const content = await zip.generateAsync({ type: "blob" });
      hideBackgroundCacheNotification();

      // Trigger download
      const link = document.createElement("a");
      link.download = `${showName} - All Seasons Title Cards.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      // Show success toast
      showToast("All seasons downloaded successfully!", "success");
    } catch (error) {
      console.error("Error downloading all seasons:", error);
      hideBackgroundCacheNotification();
      alert("Failed to download all seasons. Please try again.");
    }
  }

  // =====================================================
  // SAVE/LOAD CONFIGURATION FUNCTIONS
  // =====================================================

  // Save current configuration for the current show
  function saveCurrentConfig() {
    // Only allow saving if a show is selected
    if (!currentShowData) {
      showToast("Please select a show first", 3000);
      return;
    }

    // Get all current settings    
    // Save custom font info if used
    let customFontName = null;
    if (fontFamily.value && fontFamily.value.startsWith('custom-')) {
      customFontName = fontFamily.value;
    }
    let infoCustomFontName = null;
    const infoFontFamilyEl = document.getElementById("info-font-family");
    if (infoFontFamilyEl && infoFontFamilyEl.value.startsWith('custom-')) {
      infoCustomFontName = infoFontFamilyEl.value;
    }
    const config = {
      showId: currentShowData.id,
      showName: currentShowData.name,
      savedDate: new Date().toISOString(),
      settings: {
        fontFamily: fontFamily.value,
        infoFontFamily: infoFontFamilyEl.value,
        textSize: textSize.value,
        infoTextSize: document.getElementById("info-text-size").value,
        textShadowBlur: textShadowBlur.value,
        textOutlineWidth: textOutlineWidth.value,
        infoShadowBlur: document.getElementById("info-shadow-blur").value,
        infoOutlineWidth: document.getElementById("info-outline-width").value,
        titleInfoSpacing: titleInfoSpacing.value,
        horizontalPosition: horizontalPosition.value,
        verticalPosition: verticalPosition.value,
        infoPosition: infoPosition.value,
        titleWrapping: document.getElementById("title-wrapping") ? 
          document.getElementById("title-wrapping").value : 'singleLine',
        textColor: window["text-color"],
        infoColor: window["info-color"],
        textShadowColor: window["text-shadow-color"],
        textOutlineColor: window["text-outline-color"],
        infoShadowColor: window["info-shadow-color"],
        infoOutlineColor: window["info-outline-color"],
        effectType: effectType.value,
        gradientColor: window["gradient-color"],
        gradientOpacity: gradientOpacity.value,
        blendMode: blendMode.value,
        separator: separatorType.value,
        seriesType: seriesType.value,
        thumbnailFullsize: thumbnailFullsize.checked,
        showSeasonNumber: seasonNumberDisplay.checked,
        showEpisodeNumber: episodeNumberDisplay.checked,
        preset: presetSelect.value,
        titleUppercase: document.getElementById("title-uppercase").checked,
        titleLowercase: document.getElementById("title-lowercase").checked,
        titleBold: document.getElementById("title-bold").checked,
        infoSeasonUppercase: document.getElementById("info-season-uppercase").checked,
        infoSeasonLowercase: document.getElementById("info-season-lowercase").checked, // <-- add this
        infoSeasonBold: document.getElementById("info-season-bold").checked,
        infoEpisodeUppercase: document.getElementById("info-episode-uppercase").checked,
        infoEpisodeLowercase: document.getElementById("info-episode-lowercase").checked, // <-- add this
        infoEpisodeBold: document.getElementById("info-episode-bold").checked,
        customFontName,
        infoCustomFontName
      }
    };

    // Get existing configs or create empty array
    let savedConfigs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    // Look for existing config for this show
    const existingConfigIndex = savedConfigs.findIndex(c => c.showId === config.showId);
    
    if (existingConfigIndex >= 0) {
      // Update existing config
      savedConfigs[existingConfigIndex] = config;
    } else {
      // Add new config
      savedConfigs.push(config);
    }
    
    // Save back to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedConfigs));
    
    // Show confirmation
    const saveConfirmOverlay = document.getElementById("save-confirm-overlay");
    saveConfirmOverlay.style.display = "flex";
    
    // Close confirmation when OK is clicked
    document.getElementById("saveConfirmOk").onclick = () => {
      saveConfirmOverlay.style.display = "none";
    };
    
    showToast(`Configuration saved for "${currentShowData.name}"`, 3000);
  }

  // Export all configs to a JSON file
  function exportAllConfigs() {
    const savedConfigs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    if (savedConfigs.length === 0) {
      showToast("No saved configurations to export", 3000);
      return;
    }
    
    // Create export data with metadata
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      configCount: savedConfigs.length,
      configs: savedConfigs
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `card-lab-configs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast(`Exported ${savedConfigs.length} configuration(s)`, 3000);
  }
  
  // Import configs from a JSON file
  function importConfigs() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        // Validate import data
        if (!importData.configs || !Array.isArray(importData.configs)) {
          showToast("Invalid config file format", 3000);
          return;
        }
        
        // Get existing configs
        let existingConfigs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        
        // Merge configs - check for duplicates
        let addedCount = 0;
        let updatedCount = 0;
        
        importData.configs.forEach(importedConfig => {
          const existingIndex = existingConfigs.findIndex(c => c.showId === importedConfig.showId);
          
          if (existingIndex >= 0) {
            // Update existing
            existingConfigs[existingIndex] = importedConfig;
            updatedCount++;
          } else {
            // Add new
            existingConfigs.push(importedConfig);
            addedCount++;
          }
        });
        
        // Save merged configs
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingConfigs));
        
        // Show success message
        let message = '';
        if (addedCount > 0 && updatedCount > 0) {
          message = `Imported ${addedCount} new and updated ${updatedCount} existing config(s)`;
        } else if (addedCount > 0) {
          message = `Imported ${addedCount} new config(s)`;
        } else if (updatedCount > 0) {
          message = `Updated ${updatedCount} existing config(s)`;
        }
        
        showToast(message, 3000);
        
      } catch (error) {
        console.error('Import error:', error);
        showToast("Failed to import configs. Invalid file.", 3000);
      }
    };
    
    fileInput.click();
  }

  // Load configuration selection dialog
  function showLoadConfigDialog() {
    // Get saved configs
    const savedConfigs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    if (savedConfigs.length === 0) {
      showToast("No saved configurations found", 3000);
      return;
    }
    
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "custom-overlay";
    overlay.style.display = "flex";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "9999";
    
    // Create dialog content
    const dialog = document.createElement("div");
    dialog.className = "custom-modal load-config-modal";
    dialog.style.width = "450px";
    dialog.style.background = "linear-gradient(135deg, #161830 0%, #0F1020 100%)";
    dialog.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.6)";
    dialog.style.border = "1px solid rgba(255, 255, 255, 0.08)";
    dialog.style.borderRadius = "16px";
    dialog.style.padding = "28px 24px";
    dialog.style.animation = "modalFadeIn 0.3s ease-out forwards";
    
    // Add header
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "20px";
    header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
    header.style.paddingBottom = "15px";
    
    const headerTitle = document.createElement("h3");
    headerTitle.textContent = "Load Configuration";
    headerTitle.style.margin = "0 0 10px 0";
    headerTitle.style.fontSize = "24px";
    headerTitle.style.fontWeight = "600";
    headerTitle.style.color = "#fff";
    header.appendChild(headerTitle);
    
    const headerDesc = document.createElement("p");
    headerDesc.textContent = `Select a show to load its saved configuration (${savedConfigs.length} available)`;
    headerDesc.style.margin = "0";
    headerDesc.style.fontSize = "14px";
    headerDesc.style.color = "rgba(255, 255, 255, 0.7)";
    header.appendChild(headerDesc);
    
    dialog.appendChild(header);
    
    // Create config list container with scrolling
    const configListContainer = document.createElement("div");
    configListContainer.style.maxHeight = "300px";
    configListContainer.style.overflowY = "auto";
    configListContainer.style.padding = "5px";
    configListContainer.style.marginBottom = "20px";
    
    // Sort configs by name
    savedConfigs.sort((a, b) => a.showName.localeCompare(b.showName));
    
    // Add each config as a button
    savedConfigs.forEach(config => {
      const item = document.createElement("div");
      item.className = "config-item";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.padding = "12px 15px";
      item.style.margin = "8px 0";
      item.style.borderRadius = "8px";
      item.style.background = "rgba(255, 255, 255, 0.05)";
      item.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      item.style.cursor = "pointer";
      item.style.transition = "all 0.2s ease";
      
      // Hover effects
      item.addEventListener("mouseenter", () => {
        item.style.background = "rgba(0, 191, 165, 0.1)";
        item.style.borderColor = "rgba(0, 191, 165, 0.3)";
        item.style.transform = "translateY(-2px)";
      });
      
      item.addEventListener("mouseleave", () => {
        item.style.background = "rgba(255, 255, 255, 0.05)";
        item.style.borderColor = "rgba(255, 255, 255, 0.1)";
        item.style.transform = "translateY(0)";
      });
      
      // Info section
      const infoSection = document.createElement("div");
      infoSection.style.flexGrow = "1";
      
      const showName = document.createElement("div");
      showName.textContent = config.showName;
      showName.style.fontSize = "16px";
      showName.style.fontWeight = "600";
      showName.style.color = "#fff";
      showName.style.marginBottom = "5px";
      infoSection.appendChild(showName);
      
      const savedDate = document.createElement("div");
      const date = new Date(config.savedDate);
      const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      savedDate.textContent = `Saved on ${formattedDate}`;
      savedDate.style.fontSize = "12px";
      savedDate.style.color = "rgba(255, 255, 255, 0.5)";
      infoSection.appendChild(savedDate);
      
      item.appendChild(infoSection);
      
      // Load button
      const loadButton = document.createElement("button");
      loadButton.textContent = "Load";
      loadButton.style.padding = "8px 16px";
      loadButton.style.background = "linear-gradient(135deg, #00bfa5, #8e24aa)";
      loadButton.style.border = "none";
      loadButton.style.borderRadius = "6px";
      loadButton.style.color = "#fff";
      loadButton.style.fontSize = "14px";
      loadButton.style.cursor = "pointer";
      loadButton.style.fontWeight = "500";
      
      loadButton.addEventListener("click", () => {
        // Load this configuration
        loadConfiguration(config);
        
        // Close the dialog
        document.body.removeChild(overlay);
        
        // Show confirm toast
        const loadConfirmOverlay = document.getElementById("load-confirm-overlay");
        loadConfirmOverlay.style.display = "flex";
        
        document.getElementById("loadConfirmOk").onclick = () => {
          loadConfirmOverlay.style.display = "none";
        };
      });
      
      item.appendChild(loadButton);
      configListContainer.appendChild(item);
    });
    
    dialog.appendChild(configListContainer);
    
    // Add cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.width = "100%";
    cancelButton.style.padding = "12px";
    cancelButton.style.background = "rgba(255, 255, 255, 0.1)";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "8px";
    cancelButton.style.color = "#fff";
    cancelButton.style.fontSize = "14px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.marginTop = "10px";
    
    cancelButton.addEventListener("mouseenter", () => {
      cancelButton.style.background = "rgba(255, 255, 255, 0.15)";
    });
    
    cancelButton.addEventListener("mouseleave", () => {
      cancelButton.style.background = "rgba(255, 255, 255, 0.1)";
    });
    
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    
    dialog.appendChild(cancelButton);
    
    // Add dialog to overlay and overlay to body
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }

  // Apply a saved configuration
  function loadConfiguration(config) {
    // Apply all settings from the config
    const settings = config.settings;
    
    // Apply UI element values
    // Restore custom font for title if needed
    if (settings.customFontName && fontFamily.querySelector(`option[value="${settings.customFontName}"]`)) {
      fontFamily.value = settings.customFontName;
    } else if (settings.fontFamily) {
      fontFamily.value = settings.fontFamily;
    }
    // Restore custom font for info if needed
    const infoFontFamilyEl = document.getElementById("info-font-family");
    if (settings.infoCustomFontName && infoFontFamilyEl && infoFontFamilyEl.querySelector(`option[value="${settings.infoCustomFontName}"]`)) {
      infoFontFamilyEl.value = settings.infoCustomFontName;
    } else if (settings.infoFontFamily && infoFontFamilyEl) {
      infoFontFamilyEl.value = settings.infoFontFamily;
    }
    if (settings.textSize) textSize.value = settings.textSize;
    if (settings.infoTextSize) document.getElementById("info-text-size").value = settings.infoTextSize;    if (typeof settings.textShadowBlur !== 'undefined') textShadowBlur.value = settings.textShadowBlur;
    if (typeof settings.textOutlineWidth !== 'undefined') textOutlineWidth.value = settings.textOutlineWidth;
    if (typeof settings.infoShadowBlur !== 'undefined') document.getElementById("info-shadow-blur").value = settings.infoShadowBlur;
    if (typeof settings.infoOutlineWidth !== 'undefined') document.getElementById("info-outline-width").value = settings.infoOutlineWidth;
    if (typeof settings.titleInfoSpacing !== 'undefined') titleInfoSpacing.value = settings.titleInfoSpacing;
    if (typeof settings.horizontalPosition !== 'undefined') horizontalPosition.value = settings.horizontalPosition;
    if (typeof settings.verticalPosition !== 'undefined') verticalPosition.value = settings.verticalPosition;
    if (settings.infoPosition) infoPosition.value = settings.infoPosition;
    if (settings.titleWrapping && document.getElementById("title-wrapping")) {
      document.getElementById("title-wrapping").value = settings.titleWrapping;
    }    if (settings.effectType) effectType.value = settings.effectType;
    if (typeof settings.gradientOpacity !== 'undefined') gradientOpacity.value = settings.gradientOpacity;
    if (settings.blendMode) blendMode.value = settings.blendMode;
    if (settings.separator) separatorType.value = settings.separator;
    if (settings.seriesType) seriesType.value = settings.seriesType;
    if (typeof settings.thumbnailFullsize !== 'undefined') thumbnailFullsize.checked = settings.thumbnailFullsize;
    if (typeof settings.showSeasonNumber !== 'undefined') seasonNumberDisplay.checked = settings.showSeasonNumber;
    if (typeof settings.showEpisodeNumber !== 'undefined') episodeNumberDisplay.checked = settings.showEpisodeNumber;
    if (settings.preset) presetSelect.value = settings.preset;
    if (typeof settings.titleUppercase !== 'undefined') document.getElementById("title-uppercase").checked = settings.titleUppercase;
    if (typeof settings.titleBold !== 'undefined') document.getElementById("title-bold").checked = settings.titleBold;
    if (typeof settings.infoSeasonUppercase !== 'undefined') document.getElementById("info-season-uppercase").checked = settings.infoSeasonUppercase;
    if (typeof settings.infoSeasonBold !== 'undefined') document.getElementById("info-season-bold").checked = settings.infoSeasonBold;
    if (typeof settings.infoEpisodeUppercase !== 'undefined') document.getElementById("info-episode-uppercase").checked = settings.infoEpisodeUppercase;
    if (typeof settings.infoEpisodeBold !== 'undefined') document.getElementById("info-episode-bold").checked = settings.infoEpisodeBold;
    if (typeof settings.titleLowercase !== 'undefined') document.getElementById("title-lowercase").checked = settings.titleLowercase;
    if (typeof settings.infoSeasonLowercase !== 'undefined') document.getElementById("info-season-lowercase").checked = settings.infoSeasonLowercase;
    if (typeof settings.infoEpisodeLowercase !== 'undefined') document.getElementById("info-episode-lowercase").checked = settings.infoEpisodeLowercase;
    
    // Apply color settings
    if (settings.textColor) window["text-color"] = settings.textColor;
    if (settings.infoColor) window["info-color"] = settings.infoColor;
    if (settings.textShadowColor) window["text-shadow-color"] = settings.textShadowColor;
    if (settings.textOutlineColor) window["text-outline-color"] = settings.textOutlineColor;
    if (settings.infoShadowColor) window["info-shadow-color"] = settings.infoShadowColor;
    if (settings.infoOutlineColor) window["info-outline-color"] = settings.infoOutlineColor;
    if (settings.gradientColor) window["gradient-color"] = settings.gradientColor;
    
    // Update color pickers to match loaded settings
    if (Pickr.all) {
      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id) 
          return;
        
        const id = pickr._root.button.id;
        if (id === "text-color-pickr" && settings.textColor) {
          pickr.setColor(settings.textColor);
        } else if (id === "info-color-pickr" && settings.infoColor) {
          pickr.setColor(settings.infoColor);
        } else if (id === "text-shadow-color-pickr" && settings.textShadowColor) {
          pickr.setColor(settings.textShadowColor);
        } else if (id === "text-outline-color-pickr" && settings.textOutlineColor) {
          pickr.setColor(settings.textOutlineColor);
        } else if (id === "info-shadow-color-pickr" && settings.infoShadowColor) {
          pickr.setColor(settings.infoShadowColor);
        } else if (id === "info-outline-color-pickr" && settings.infoOutlineColor) {
          pickr.setColor(settings.infoOutlineColor);
        } else if (id === "gradient-color-pickr" && settings.gradientColor) {
          pickr.setColor(settings.gradientColor);
        }
      });
    }
    
    // Update slider displays
    updateSliderValueDisplay("text-shadow-blur", "shadow-value", "px");
    updateSliderValueDisplay("text-outline-width", "outline-value", "px");
    updateSliderValueDisplay("info-shadow-blur", "info-shadow-value", "px");
    updateSliderValueDisplay("info-outline-width", "info-outline-value", "px");
    updateSliderValueDisplay("title-info-spacing", "spacing-value", "px");
    updateSliderValueDisplay("horizontal-position", "position-value", "px");
    updateSliderValueDisplay("vertical-position", "position-y-value", "px");
    
    // Show/hide gradient controls based on effect type
    if (settings.effectType === "none") {
      document.getElementById("gradient-controls").style.display = "none";
    } else {
      document.getElementById("gradient-controls").style.display = "block";
    }
    
    // Update current title card and grid view if necessary
    updateBothViews();
    
    // If the loaded show is different from current show, suggest searching for it
    if (currentShowData && config.showId !== currentShowData.id) {
      showToast(`Configuration loaded for "${config.showName}" - Search for this show to see it with these settings`, 5000);
    } else {
      showToast(`Configuration loaded for "${config.showName}"`, 3000);
    }
    
    // Update all episode cards with new settings if in TMDB mode
    if (isTMDBMode && episodeTitleCards.length > 0) {
      updateEpisodeCardSettings();
      renderEpisodeGrid();
    }
  }

  // =====================================================
  // UI EVENT LISTENERS & HANDLERS
  // =====================================================

  // Reset form to default values
  function resetColorPickers() {
    // Reset color pickers
    if (Pickr.all) {
      Pickr.all.forEach((pickr) => {
        if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
        
        const id = pickr._root.button.id;
        if (id === "text-color-pickr") {
          pickr.setColor(defaultValues.textColor);
          window["text-color"] = defaultValues.textColor;
        } else if (id === "info-color-pickr") {
          pickr.setColor(defaultValues.infoColor);
          window["info-color"] = defaultValues.infoColor;
        } else if (id === "text-shadow-color-pickr") {
          pickr.setColor(defaultValues.shadowColor);
          window["text-shadow-color"] = defaultValues.shadowColor;
        } else if (id === "text-outline-color-pickr") {
          pickr.setColor(defaultValues.outlineColor);
          window["text-outline-color"] = defaultValues.outlineColor;
        } else if (id === "info-shadow-color-pickr") {
          pickr.setColor(defaultValues.infoShadowColor);
          window["info-shadow-color"] = defaultValues.infoShadowColor;
        } else if (id === "info-outline-color-pickr") {
          pickr.setColor(defaultValues.infoOutlineColor);
          window["info-outline-color"] = defaultValues.infoOutlineColor;
        } else if (id === "gradient-color-pickr") {
          pickr.setColor("#000000");
          window["gradient-color"] = "#000000";
        }
      });
    }
  }

  // Show toast notification
  function showToast(message, duration = 3000) {
    // Remove existing toast if present
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
      existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 10);

    // Animate out after duration
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";

      // Remove element after animation
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // =====================================================
  // EVENT LISTENERS SETUP
  // =====================================================

  // Setup search form handler
  const searchForm = document.getElementById("show-search-form");
  const searchInput = document.getElementById("show-search-input");

  // Setup revert thumbnail button
  const revertThumbnailBtn = document.getElementById("revert-thumbnail-btn");
  if (revertThumbnailBtn) {
    revertThumbnailBtn.addEventListener("click", () => {
      if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
        const card = episodeTitleCards[selectedCardIndex];
        if (card.originalThumbnail) {
          card.thumbnailImg = card.originalThumbnail;
          thumbnailImg = card.originalThumbnail;
          const thumbContainer = document.querySelector('#thumbnail-container span');
          if (thumbContainer) {
            thumbContainer.textContent = 'Original Thumbnail Restored';
          }
          drawCard();
          if (isTMDBMode) {
            renderEpisodeGrid();
          }
          showToast("Reverted to default thumbnail for this episode");
        } else {
          showToast("No default thumbnail available for this episode");
        }
      } else {
        showToast("No episode selected");
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (query.length < 2) return;

      showProgressOverlay(`Searching for "${query}"...`);

      try {
        const results = await searchShow(query);

        if (results && results.length > 0) {
          updateProgressOverlay(100, `Found ${results.length} shows`);
          setTimeout(() => {
            hideProgressOverlay();
            displaySearchResults(results);
          }, 500);
        } else {
          updateProgressOverlay(100, `No shows found for "${query}"`);
          setTimeout(() => {
            hideProgressOverlay();
            displaySearchResults(results);
          }, 1000);
        }

        hasSearchResults = results && results.length > 0;
        returnToGridBtn.style.display = "none";
      } catch (err) {
        console.error("Search error:", err);
        hideProgressOverlay();
        document.getElementById("search-results").innerHTML =
          '<div class="error">Search failed. Please try again.</div>';
        hasSearchResults = false;
      }
    });
  } else {
    console.error("Search form element not found! Check the HTML structure.");
  }

// Setup reset button handler
resetBtn.addEventListener("click", () => {
  // Show the reset confirmation overlay
  const confirmOverlay = document.getElementById("custom-confirm-overlay");
  if (confirmOverlay) {
    confirmOverlay.style.display = "flex";
    
    // Setup confirmation button handlers
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");
    
    if (confirmYes) {
      confirmYes.addEventListener("click", function() {
        if (confirmOverlay) confirmOverlay.style.display = "none";
        
        // Reset form fields to default values - add null checks for all elements
        if (titleInput) titleInput.value = defaultValues.title;
        if (seasonNumberInput) seasonNumberInput.value = defaultValues.seasonNumber;
        if (episodeNumberInput) episodeNumberInput.value = defaultValues.episodeNumber;
        if (separatorType) separatorType.value = defaultValues.separator;
        if (horizontalPosition) horizontalPosition.value = defaultValues.horizontalPosition;
        if (verticalPosition) verticalPosition.value = 0;

        if (fontFamily) fontFamily.value = defaultValues.font;
        // --- Title Font Size Reset ---
        if (textSize) {
          // Reset dropdown to default
          textSize.value = "72";
          if (defaultValues.textSize) {
            const validOption = Array.from(textSize.options).some(option => option.value === defaultValues.textSize);
            if (validOption) {
              textSize.value = defaultValues.textSize;
            }
          }
          // Hide and reset custom input
          const customTextSize = document.getElementById("custom-text-size");
          if (customTextSize) {
            customTextSize.style.display = "none";
            customTextSize.value = 72;
          }
        }

        // --- Info Font Family and Size Reset ---
        const infoFontFamily = document.getElementById("info-font-family");
        const infoTextSize = document.getElementById("info-text-size");
        if (infoFontFamily) infoFontFamily.value = defaultValues.infoFont;
        if (infoTextSize) {
          // Reset dropdown to default
          infoTextSize.value = "36";
          if (defaultValues.infoTextSize) {
            const validOption = Array.from(infoTextSize.options).some(option => option.value === defaultValues.infoTextSize);
            if (validOption) {
              infoTextSize.value = defaultValues.infoTextSize;
            }
          }
          // Hide and reset custom input
          const customInfoTextSize = document.getElementById("custom-info-text-size");
          if (customInfoTextSize) {
            customInfoTextSize.style.display = "none";
            customInfoTextSize.value = 36;
          }
        }

        // Reset new text style checkboxes
        document.getElementById("title-uppercase").checked = defaultValues.titleUppercase;
        document.getElementById("title-lowercase").checked = defaultValues.titleLowercase; // <-- add this
        document.getElementById("title-bold").checked = defaultValues.titleBold;
        document.getElementById("info-season-uppercase").checked = defaultValues.infoSeasonUppercase;
        document.getElementById("info-season-lowercase").checked = defaultValues.infoSeasonLowercase; // <-- add this
        document.getElementById("info-season-bold").checked = defaultValues.infoSeasonBold;
        document.getElementById("info-episode-uppercase").checked = defaultValues.infoEpisodeUppercase;
        document.getElementById("info-episode-lowercase").checked = defaultValues.infoEpisodeLowercase; // <-- add this
        document.getElementById("info-episode-bold").checked = defaultValues.infoEpisodeBold;

        if (textShadowBlur) textShadowBlur.value = defaultValues.textShadowBlur;
        if (textOutlineWidth) textOutlineWidth.value = defaultValues.textOutlineWidth;
        if (titleInfoSpacing) titleInfoSpacing.value = defaultValues.titleInfoSpacing;
        if (infoPosition) infoPosition.value = defaultValues.infoPosition;

        const infoShadowBlur = document.getElementById("info-shadow-blur");
        const infoOutlineWidth = document.getElementById("info-outline-width");
        if (infoShadowBlur) infoShadowBlur.value = defaultValues.infoShadowBlur;
        if (infoOutlineWidth) infoOutlineWidth.value = defaultValues.infoOutlineWidth;

        const titleWrapping = document.getElementById("title-wrapping");
        if (titleWrapping) {
          titleWrapping.value = defaultValues.titleWrapping;
        }

        // Update slider displays
        updateSliderValueDisplay("text-shadow-blur", "shadow-value", "px");
        updateSliderValueDisplay("text-outline-width", "outline-value", "px");
        updateSliderValueDisplay("info-shadow-blur", "info-shadow-value", "px");
        updateSliderValueDisplay("info-outline-width", "info-outline-value", "px");
        updateSliderValueDisplay("title-info-spacing", "spacing-value", "px");
        updateSliderValueDisplay("horizontal-position", "position-value", "px");
        updateSliderValueDisplay("vertical-position", "position-y-value", "px");
        if (thumbnailFullsize) thumbnailFullsize.checked = defaultValues.thumbnailFullsize;
        if (seasonNumberDisplay) seasonNumberDisplay.checked = defaultValues.showSeasonNumber;
        if (episodeNumberDisplay) episodeNumberDisplay.checked = defaultValues.showEpisodeNumber;
        if (effectType) effectType.value = defaultValues.effectType;
        if (gradientOpacity) gradientOpacity.value = defaultValues.gradientOpacity;
        if (blendMode) blendMode.value = defaultValues.blendMode;
        if (seriesType) seriesType.value = "regular"; // Reset to regular series type

        // Reset colors
        window["text-color"] = defaultValues.textColor;
        window["info-color"] = defaultValues.infoColor;
        window["text-shadow-color"] = defaultValues.shadowColor;
        window["text-outline-color"] = defaultValues.outlineColor;
        window["info-shadow-color"] = defaultValues.infoShadowColor;
        window["info-outline-color"] = defaultValues.infoOutlineColor;
        window["gradient-color"] = defaultValues.gradientColor || "#000000";

        // Reset color pickers
        resetColorPickers();

        // Hide custom font options
        const customFontOption = document.getElementById("custom-font-option");
        const infoCustomOption = document.getElementById("info-custom-font-option");
        if (customFontOption) customFontOption.style.display = "none";
        if (infoCustomOption) infoCustomOption.style.display = "none";


        // Remove all custom font options from both dropdowns and clear custom font state
        if (window.customFonts) {
          window.customFonts = {};
        }
        // Remove custom font options from title font dropdown
        if (fontFamily) {
          Array.from(fontFamily.querySelectorAll('option'))
            .filter(opt => opt.value.startsWith('custom-'))
            .forEach(opt => fontFamily.removeChild(opt));
        }
        // Remove custom font options from info font dropdown
        const infoFontFamilyDropdown = document.getElementById("info-font-family");
        if (infoFontFamilyDropdown) {
          Array.from(infoFontFamilyDropdown.querySelectorAll('option'))
            .filter(opt => opt.value.startsWith('custom-'))
            .forEach(opt => infoFontFamilyDropdown.removeChild(opt));
        }
        window.customFontFamily = null;
        const customFontUploadContainer = document.querySelector(".custom-font-upload-container");
        if (customFontUploadContainer) {
          customFontUploadContainer.textContent = "Upload Custom Font";
        }

        // Clear thumbnail
        thumbnailImg = null;
        
        // Reset thumbnail container text
        const thumbnailContainer = document.querySelector('#thumbnail-container span');
        if (thumbnailContainer) {
          thumbnailContainer.textContent = 'Upload Show Thumbnail';
        }

        // Hide gradient controls if effect is none
        const gradientControls = document.getElementById("gradient-controls");
        if (gradientControls && effectType && effectType.value === "none") {
          gradientControls.style.display = "none";
        }

        // Clear UI elements with null checks
        const searchResults = document.getElementById("search-results");
        const seasonSelector = document.getElementById("season-selector");
        const altImagesInfo = document.getElementById("alt-images-info");
        const searchInput = document.getElementById("show-search-input");
        
        if (searchResults) searchResults.innerHTML = "";
        if (seasonSelector) seasonSelector.innerHTML = "";
        if (altImagesInfo) altImagesInfo.textContent = "Select an episode to see available images";
        if (searchInput) searchInput.value = "";

        // Reset state variables
        currentShowData = null;
        currentSeasonData = [];
        episodeTitleCards = [];
        selectedCardIndex = -1;
        isTMDBMode = false;
        hasSearchResults = false;
        originalThumbnail = null;

        // Reset modular frame
        const modularFrame = document.getElementById("modular-frame");
        const modularFrameImages = document.getElementById("modular-frame-images");
        const modularFrameCount = document.getElementById("modular-frame-count");
        
        if (modularFrameImages) modularFrameImages.innerHTML = "";
        if (modularFrameCount) modularFrameCount.textContent = "No alternative images available";
        
        
        // Reset view
        showSingleCardView();
        if (returnToGridBtn) returnToGridBtn.style.display = "none";
        if (modularFrame) modularFrame.style.display = "none"; // Ensure it's visible in single card view

        // Update card display
        updateBothViews();

        showToast("Title card has been reset to defaults");
      });
    }
    
    if (confirmNo) {
      confirmNo.addEventListener("click", function() {
        if (confirmOverlay) confirmOverlay.style.display = "none";
      });
    }
  } else {
    // If overlay doesn't exist, perform reset directly or show a simple confirm
    if (confirm("Reset title card to defaults?")) {
      // Implement same reset code as above without the overlay handling
      // (Simplified for brevity)
      
      // Reset all values to defaults...
      
      showToast("Title card has been reset to defaults");
    }
  }
});

  // Setup download button handler
  // Setup download button handlers
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadOptionsOverlay = document.getElementById("download-options-overlay");
  const downloadCurrentOption = document.getElementById("downloadCurrentOption");
  const downloadAllSeasonsOption = document.getElementById("downloadAllSeasonsOption");
  const downloadSelectSeasonsOption = document.getElementById("downloadSelectSeasonsOption");
  const downloadCancel = document.getElementById("downloadCancel");
  const seasonSelectionOverlay = document.getElementById("season-selection-overlay");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      // Update the current view description dynamically
      const currentViewDesc = document.getElementById("currentViewDescription");
      if (canvas.style.display === "block") {
        currentViewDesc.textContent = "Download the current episode card";
      } else if (hasSearchResults && episodeTitleCards.length > 0) {
        currentViewDesc.textContent = `Download all ${episodeTitleCards.length} episodes from Season ${currentSeasonNumber}`;
      } else {
        currentViewDesc.textContent = "Download current view";
      }
      
      // Update all seasons description
      const cachedSeasonCount = Array.from(artworkCache.keys()).length;
      const allSeasonsDesc = document.getElementById("allSeasonsDescription");
      if (allSeasonsDesc && cachedSeasonCount > 0) {
        allSeasonsDesc.textContent = `Download ${cachedSeasonCount} cached season${cachedSeasonCount > 1 ? 's' : ''} at once`;
      }
      
      // Show download options modal
      downloadOptionsOverlay.style.display = "flex";
    });
  }

  if (downloadCancel) {
    downloadCancel.addEventListener("click", () => {
      downloadOptionsOverlay.style.display = "none";
    });
  }

  if (downloadCurrentOption) {
    downloadCurrentOption.addEventListener("click", () => {
      downloadOptionsOverlay.style.display = "none";
      if (canvas.style.display === "block") {
        // Download single card if in single card view
        downloadSingleCard();
      } else if (hasSearchResults && episodeTitleCards.length > 0) {
        // Download all cards if in grid view
        batchDownloadTitleCards();
      } else {
        // Fallback to single card
        downloadSingleCard();
      }
    });
  }

  if (downloadAllSeasonsOption) {
    downloadAllSeasonsOption.addEventListener("click", () => {
      downloadOptionsOverlay.style.display = "none";
      downloadAllSeasonsTitleCards();
    });
  }

  if (downloadSelectSeasonsOption) {
    downloadSelectSeasonsOption.addEventListener("click", () => {
      downloadOptionsOverlay.style.display = "none";
      showSeasonSelectionModal();
    });
  }

  // Season selection modal handlers
  function showSeasonSelectionModal() {
    const seasonSelectionList = document.getElementById("seasonSelectionList");
    seasonSelectionList.innerHTML = "";
    
    // Get all cached seasons
    const cachedSeasons = [];
    artworkCache.forEach((value, key) => {
      const [showId, seasonNum] = key.split('-');
      if (parseInt(showId) === currentShowData.id) {
        cachedSeasons.push({
          seasonNumber: parseInt(seasonNum),
          episodeCount: value.seasonData.episodes.length,
          seasonName: value.seasonData.name
        });
      }
    });
    
    // Sort by season number
    cachedSeasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
    
    // Create checkbox for each season
    cachedSeasons.forEach(season => {
      const item = document.createElement("label");
      item.className = "season-checkbox-item";
      item.innerHTML = `
        <input type="checkbox" class="season-checkbox" data-season="${season.seasonNumber}" checked>
        <div class="season-info">
          <span class="season-name">${season.seasonName}</span>
          <span class="season-episode-count">${season.episodeCount} episode${season.episodeCount > 1 ? 's' : ''}</span>
        </div>
      `;
      seasonSelectionList.appendChild(item);
    });
    
    seasonSelectionOverlay.style.display = "flex";
  }

  const selectAllSeasons = document.getElementById("selectAllSeasons");
  const deselectAllSeasons = document.getElementById("deselectAllSeasons");
  const confirmSeasonDownload = document.getElementById("confirmSeasonDownload");
  const cancelSeasonSelection = document.getElementById("cancelSeasonSelection");

  if (selectAllSeasons) {
    selectAllSeasons.addEventListener("click", () => {
      document.querySelectorAll(".season-checkbox").forEach(cb => cb.checked = true);
    });
  }

  if (deselectAllSeasons) {
    deselectAllSeasons.addEventListener("click", () => {
      document.querySelectorAll(".season-checkbox").forEach(cb => cb.checked = false);
    });
  }

  if (confirmSeasonDownload) {
    confirmSeasonDownload.addEventListener("click", () => {
      const selectedSeasons = [];
      document.querySelectorAll(".season-checkbox:checked").forEach(cb => {
        selectedSeasons.push(parseInt(cb.dataset.season));
      });
      
      if (selectedSeasons.length === 0) {
        showToast("Please select at least one season", 3000);
        return;
      }
      
      seasonSelectionOverlay.style.display = "none";
      downloadSelectedSeasons(selectedSeasons);
    });
  }

  if (cancelSeasonSelection) {
    cancelSeasonSelection.addEventListener("click", () => {
      seasonSelectionOverlay.style.display = "none";
    });
  }

  // Download selected seasons function
  async function downloadSelectedSeasons(seasonNumbers) {
    showToast(`Preparing ${seasonNumbers.length} season${seasonNumbers.length > 1 ? 's' : ''} for download...`, 2000);
    
    // Use the existing downloadAllSeasonsTitleCards logic but filter by selected seasons
    const zip = new JSZip();
    const showName = currentShowData.name.replace(/[<>:"/\\|?*]/g, "_");
    
    let totalProcessed = 0;
    let totalCards = 0;
    
    // Calculate total cards
    seasonNumbers.forEach(seasonNum => {
      const cacheKey = `${currentShowData.id}-${seasonNum}`;
      const cached = artworkCache.get(cacheKey);
      if (cached && cached.renderedCards) {
        totalCards += cached.renderedCards.length;
      }
    });
    
    // Show progress
    showProgressOverlay("Preparing downloads...", true);
    
    for (const seasonNum of seasonNumbers) {
      const cacheKey = `${currentShowData.id}-${seasonNum}`;
      const cached = artworkCache.get(cacheKey);
      
      if (!cached || !cached.renderedCards) continue;
      
      const seasonFolder = zip.folder(`Season ${String(seasonNum).padStart(2, '0')}`);
      
      for (const card of cached.renderedCards) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 1920;
        tempCanvas.height = 1080;
        const tempCtx = tempCanvas.getContext("2d");
        
        drawCardToTempContext(tempCtx, card, 1920, 1080);
        
        const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, "image/jpeg", 0.95));
        const filename = `S${card.seasonNumber}E${card.episodeNumber} - ${card.title.replace(/[<>:"/\\|?*]/g, "_")}.jpg`;
        seasonFolder.file(filename, blob);
        
        totalProcessed++;
        updateProgressOverlay(Math.floor((totalProcessed / totalCards) * 100), 
          `Processing: ${totalProcessed}/${totalCards} cards`);
      }
    }
    
    updateProgressOverlay(95, "Generating ZIP file...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${showName} - Selected Seasons.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    hideProgressOverlay();
    showToast(`Successfully downloaded ${seasonNumbers.length} season${seasonNumbers.length > 1 ? 's' : ''}!`, 3000);
  }

  // Close modal when clicking outside
  downloadOptionsOverlay.addEventListener("click", (e) => {
    if (e.target === downloadOptionsOverlay) {
      downloadOptionsOverlay.style.display = "none";
    }
  });

  // Setup return to grid button handler
  returnToGridBtn.addEventListener("click", () => {
    renderEpisodeGrid();
    showGridView();
  });

  // Setup collapsible panels
  document.querySelectorAll(".collapsible-header").forEach((header) => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      parent.classList.toggle("active");
    });
  });
  // Setup input event listeners
  titleInput.addEventListener("input", updateBothViews);
  seasonNumberInput.addEventListener("input", updateBothViews);
  episodeNumberInput.addEventListener("input", updateBothViews);
  seasonNumberDisplay.addEventListener("change", updateBothViews);
  episodeNumberDisplay.addEventListener("change", updateBothViews);
  separatorType.addEventListener("change", updateBothViews);
  seriesType.addEventListener("change", updateBothViews); // Add event listener for series type
  presetSelect.addEventListener("change", updateBothViews);
  horizontalPosition.addEventListener("input", updateBothViews);
  textSize.addEventListener("change", updateBothViews);
  titleWrapping.addEventListener("change", updateBothViews);
  infoPosition.addEventListener("change", updateBothViews);
  textShadowBlur.addEventListener("input", updateBothViews);
  textOutlineWidth.addEventListener("input", updateBothViews);
  titleInfoSpacing.addEventListener("input", updateBothViews);
  thumbnailFullsize.addEventListener("change", updateBothViews);

  // Handle effect type changes
  effectType.addEventListener("change", function () {
    const gradientControls = document.getElementById("gradient-controls");

    if (effectType.value === "none") {
      gradientControls.style.display = "none";
    } else {
      gradientControls.style.display = "block";
    }

    updateBothViews();
  });

  gradientOpacity.addEventListener("input", updateBothViews);
  blendMode.addEventListener("change", updateBothViews);

  // Get references to info controls
  const infoFontFamily = document.getElementById("info-font-family");
  const infoTextSize = document.getElementById("info-text-size");
  const infoShadowBlur = document.getElementById("info-shadow-blur");
  const infoOutlineWidth = document.getElementById("info-outline-width");

  // Handle font changes
  fontFamily.addEventListener("change", function () {
    const selectedFont = fontFamily.value;

    // Store current colors to restore after font change
    const currentTextColor = window["text-color"];
    const currentInfoColor = window["info-color"];

    if (selectedFont !== "custom-font") {
      // Load selected font
      const tempSpan = document.createElement("span");
      tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
      tempSpan.style.visibility = "hidden";
      tempSpan.textContent = "Font Loading Test";
      document.body.appendChild(tempSpan);

      setTimeout(() => {
        document.body.removeChild(tempSpan);

        // Restore colors after font load
        window["text-color"] = currentTextColor;
        window["info-color"] = currentInfoColor;

        drawCard();

        if (isTMDBMode && episodeTitleCards.length > 0) {
          updateEpisodeCardSettings();
          renderEpisodeGrid();
        }
      }, 50);
    } else {
      // Custom font selected
      window["text-color"] = currentTextColor;
      window["info-color"] = currentInfoColor;

      drawCard();
      if (isTMDBMode && episodeTitleCards.length > 0) {
        updateEpisodeCardSettings();
        renderEpisodeGrid();
      }
    }
  });

  // Handle info font changes
  if (infoFontFamily) {
    infoFontFamily.addEventListener("change", function () {
      const selectedFont = infoFontFamily.value;

      if (selectedFont !== "custom-font" && selectedFont !== "same-as-title") {
        // Load selected font
        const tempSpan = document.createElement("span");
        tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
        tempSpan.style.visibility = "hidden";
        tempSpan.textContent = "Font Loading Test";
        document.body.appendChild(tempSpan);

        setTimeout(() => {
          document.body.removeChild(tempSpan);
          drawCard();
          if (isTMDBMode && episodeTitleCards.length > 0) {
            updateEpisodeCardSettings();
            renderEpisodeGrid();
          }
        }, 50);
      } else {
        // Using title font or custom font
        drawCard();
        if (isTMDBMode && episodeTitleCards.length > 0) {
          updateEpisodeCardSettings();
          renderEpisodeGrid();
        }
      }
    });
  }

  // Setup remaining info control event listeners
  if (infoTextSize) infoTextSize.addEventListener("change", updateBothViews);
  if (infoShadowBlur) infoShadowBlur.addEventListener("input", updateBothViews);
  if (infoOutlineWidth)
    infoOutlineWidth.addEventListener("input", updateBothViews);

  // Setup save/load configuration buttons
  saveConfigBtn.addEventListener("click", saveCurrentConfig);
  loadConfigBtn.addEventListener("click", showLoadConfigDialog);
  exportConfigBtn.addEventListener("click", exportAllConfigs);
  importConfigBtn.addEventListener("click", importConfigs);

  // Setup settings dropdown toggle
  const configDropdown = document.querySelector('.config-dropdown');
  const configDropdownBtn = configDropdown.querySelector('.action-button');
  const configDropdownMenu = configDropdown.querySelector('.config-dropdown-menu');
  
  configDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    configDropdownMenu.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!configDropdown.contains(e.target)) {
      configDropdownMenu.classList.remove('show');
    }
  });
  
  // Close dropdown when clicking a menu item
  document.querySelectorAll('.config-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      configDropdownMenu.classList.remove('show');
    });
  });

  // Setup title wrapping and line spacing relationship
  titleWrapping.addEventListener("change", function() {
    const lineSpacingContainer = document.getElementById("line-spacing-container");
    if (this.value === "singleLine") {
      lineSpacingContainer.style.display = "none";
    } else {
      lineSpacingContainer.style.display = "block";
    }
    updateBothViews();
  });
  
  // Setup line spacing slider
  const lineSpacing = document.getElementById("line-spacing");
  const lineSpacingValue = document.getElementById("line-spacing-value");
  if (lineSpacing && lineSpacingValue) {
    // Initialize with the default value
    lineSpacingValue.textContent = lineSpacing.value;
    
    lineSpacing.addEventListener("input", function() {
      lineSpacingValue.textContent = this.value;
      updateBothViews();
    });
  }

  // Initialize line spacing visibility based on initial title wrapping selection
  if (document.getElementById("title-wrapping")) {
    const lineSpacingContainer = document.getElementById("line-spacing-container");
    if (document.getElementById("title-wrapping").value === "singleLine") {
      lineSpacingContainer.style.display = "none";
    } else {
      lineSpacingContainer.style.display = "block";
    }
  }

  // Setup input event listeners

  // Setup the modular frame return to grid button
  // Setup modular frame navigation buttons
  const modularFrameReturnBtn = document.getElementById("modular-frame-return-btn");
  const modularFramePrevBtn = document.getElementById("modular-frame-prev-btn");
  const modularFrameNextBtn = document.getElementById("modular-frame-next-btn");

  function updateModularFrameNavButtons() {
    if (!modularFramePrevBtn || !modularFrameNextBtn) return;
    modularFramePrevBtn.disabled = selectedCardIndex <= 0;
    modularFrameNextBtn.disabled =
      episodeTitleCards.length === 0 || selectedCardIndex >= episodeTitleCards.length - 1;
  }

  if (modularFrameReturnBtn) {
    modularFrameReturnBtn.addEventListener("click", () => {
      renderEpisodeGrid();
      showGridView();
    });
  }
  function setEpisodeInputsFromCard(card) {
    // Update the sidebar inputs to match the selected episode card
    if (!card) return;
    titleInput.value = card.title || "";
    seasonNumberInput.value = card.seasonNumber || "";
    episodeNumberInput.value = card.episodeNumber || "";
    // If the card has a thumbnail, update the global thumbnailImg
    if (card.thumbnailImg) {
      thumbnailImg = card.thumbnailImg;
    }
  }

  if (modularFramePrevBtn) {
    modularFramePrevBtn.addEventListener("click", () => {
      if (selectedCardIndex > 0) {
        selectedCardIndex--;
        const card = episodeTitleCards[selectedCardIndex];
        setEpisodeInputsFromCard(card);
        updateCard();
        updateModularFrameNavButtons();
        if (card) {
          displayAlternativeImages(card);
        }
      }
    });
  }
  if (modularFrameNextBtn) {
    modularFrameNextBtn.addEventListener("click", () => {
      if (selectedCardIndex < episodeTitleCards.length - 1) {
        selectedCardIndex++;
        const card = episodeTitleCards[selectedCardIndex];
        setEpisodeInputsFromCard(card);
        updateCard();
        updateModularFrameNavButtons();
        if (card) {
          displayAlternativeImages(card);
        }
      }
    });
  }

  // Update nav buttons whenever single card view is shown or card index changes
  function showSingleCardViewWithNavUpdate() {
    showSingleCardView();
    updateModularFrameNavButtons();
  }
  // Patch showSingleCardView to always update nav buttons
  const origShowSingleCardView = showSingleCardView;
  showSingleCardView = function() {
    origShowSingleCardView();
    updateModularFrameNavButtons();
  };

  // =====================================================
  // INITIALIZATION
  // =====================================================

  // Initialize UI components
  initializeTextOptionsUI();
  initializePickrs();

  // Set canvas dimensions to 1920x1080 for main view
  canvas.width = 1920;
  canvas.height = 1080;

  // Hide return to grid button initially
  returnToGridBtn.style.display = "none";

  // Setup tooltips for header action buttons
  function attachHeaderTooltips() {
    const tooltip = document.querySelector('.tooltip');
    if (!tooltip) return;
    
    const headerButtons = document.querySelectorAll('.header-actions [data-tooltip]');
    
    headerButtons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        const tooltipText = this.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        tooltip.textContent = tooltipText;
        tooltip.style.opacity = 1;
        tooltip.style.visibility = 'visible';
        
        const rect = this.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const buttonCenterX = rect.left + (rect.width / 2);
        
        let leftPos = buttonCenterX - (tooltipWidth / 2);
        leftPos = Math.max(10, Math.min(leftPos, window.innerWidth - tooltipWidth - 10));
        
        const topPos = rect.bottom + 10;
        tooltip.classList.remove('tooltip-top');
        tooltip.classList.add('tooltip-bottom');
        
        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
      });
      
      btn.addEventListener('mouseleave', function() {
        tooltip.style.opacity = 0;
        setTimeout(() => {
          tooltip.style.visibility = 'hidden';
        }, 200);
      });
    });
  }
  
  // Wait for tooltip.js to create the tooltip element, then attach header tooltips
  setTimeout(attachHeaderTooltips, 100);

  // Draw initial card
  drawCard();
});
