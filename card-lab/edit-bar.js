// Edit Bar - Word Style Toolbar
document.addEventListener("DOMContentLoaded", () => {
  // Reference to the main instance of Pickr objects
  const pickrInstances = {
    text: null,
    info: null,
    textShadow: null,
    textOutline: null,
    infoShadow: null,
    infoOutline: null,
    gradient: null
  };

  // Initialize the edit bar
  function initEditBar() {
    createEditBarElements();
    initEditBarPickrs();
    setupEventListeners();
  }

  // Create the edit bar elements in the DOM
  function createEditBarElements() {
    // --- Tab Switcher ---
    const tabSwitcher = document.createElement("div");
    tabSwitcher.className = "edit-bar-tabs";
    tabSwitcher.innerHTML = `
      <button class="edit-bar-settings-btn" data-tooltip="Edit Bar Settings" style="margin-right:6px;display:flex;align-items:center;background:transparent;border:none;cursor:pointer;padding:4px 8px;min-width:32px;min-height:32px;">
        <i data-lucide="settings" width="20" height="20"></i>
      </button>
      <button class="edit-bar-tab active" data-tab="title" data-tooltip="Title Controls" style="padding:4px 8px;min-width:32px;min-height:32px;display:flex;align-items:center;justify-content:center;">
        <i data-lucide="type" class="lucide" width="20" height="20"></i>
      </button>
      <button class="edit-bar-tab" data-tab="info" data-tooltip="Info Controls" style="padding:4px 8px;min-width:32px;min-height:32px;display:flex;align-items:center;justify-content:center;">
        <i data-lucide="info" class="lucide" width="20" height="20"></i>
      </button>
    `;

    // Create container elements
    const editBarContainer = document.createElement("div");
    editBarContainer.className = "edit-bar-container";
    
    // Create toggle button
    const toggleButton = document.createElement("button");
    toggleButton.className = "edit-bar-toggle floating-edit-bar-toggle";
    toggleButton.innerHTML = `
      <i data-lucide="edit-3" width="20" height="20" style="margin-right:8px;"></i>
      <span class="edit-bar-toggle-label">Edit Bar</span>
    `;
    // Style: center under header/canvas frame, floating, more prominent
    toggleButton.style.position = "absolute";
    toggleButton.style.left = "50%";
    toggleButton.style.transform = "translateX(-50%)";
    toggleButton.style.top = "24px";
    toggleButton.style.zIndex = "1001";
    toggleButton.style.height = "36px";
    toggleButton.style.minWidth = "0";
    toggleButton.style.maxWidth = "160px";
    toggleButton.style.overflow = "hidden";
    toggleButton.style.textOverflow = "ellipsis";
    toggleButton.style.whiteSpace = "nowrap";
    toggleButton.style.padding = "0 8px";
    toggleButton.style.borderRadius = "8px";
    toggleButton.style.background = "linear-gradient(135deg, #00bfa5, #8e24aa)";
    toggleButton.style.color = "#fff";
    toggleButton.style.display = "flex";
    toggleButton.style.alignItems = "center";
    toggleButton.style.justifyContent = "center";
    toggleButton.style.fontWeight = "600";
    toggleButton.style.fontSize = "1rem";
    toggleButton.style.letterSpacing = ".02em";
    toggleButton.style.boxShadow = "0 6px 24px rgba(0,0,0,0.22)";
    toggleButton.style.border = "1px solid #fff";
    toggleButton.style.cursor = "pointer";
    // Use data-tooltip instead of title for custom tooltip system
    toggleButton.setAttribute('data-tooltip', 'Show/Hide Edit Bar');
    
    // Create the edit bar itself
    const editBar = document.createElement("div");
    editBar.className = "edit-bar";
    
    // Font and text options group
    const fontGroup = document.createElement("div");
    fontGroup.className = "edit-bar-group";
    fontGroup.innerHTML = `
      <span class="edit-bar-group-label">Font</span>
      <select id="edit-bar-font-family" class="edit-bar-select">
        ${document.getElementById("font-family").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <select id="edit-bar-text-size" class="edit-bar-select">
        ${document.getElementById("text-size").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <span class="edit-bar-group-label">Wrap</span>
      <select id="edit-bar-title-wrap" class="edit-bar-select">
        ${document.getElementById("title-wrapping").innerHTML}
      </select>
    `;
    
    // Text formatting group
    const formatGroup = document.createElement("div");
    formatGroup.className = "edit-bar-group";
    formatGroup.innerHTML = `
      <span class="edit-bar-group-label">Format</span>
      <button id="edit-bar-bold" class="format-btn" data-tooltip="Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-uppercase" class="format-btn" data-tooltip="Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-lowercase" class="format-btn" data-tooltip="Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
    `;
    

    
    // Effects group
    const effectsGroup = document.createElement("div");
    effectsGroup.className = "edit-bar-group";
    effectsGroup.innerHTML = `
      <span class="edit-bar-group-label">Gradient</span>
      <select id="edit-bar-effect-type">
        ${document.getElementById("effect-type").innerHTML}
      </select>
      <div class="edit-bar-range">
        <input type="range" id="edit-bar-gradient-opacity" min="0" max="1" step="0.01" value="0.7" style="width:80px;height:4px;vertical-align:middle;">
        <span class="range-value" id="edit-bar-gradient-opacity-value">0.70</span>
      </div>
      <div class="edit-bar-divider"></div>
    `;
    
    // Position group
    const positionGroup = document.createElement("div");
    positionGroup.className = "edit-bar-group";
    positionGroup.innerHTML = `
      <span class="edit-bar-group-label">Position</span>
      <select id="edit-bar-preset-select">
        ${document.getElementById("preset-select").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <select id="edit-bar-info-position">
        ${document.getElementById("info-position").innerHTML}
      </select>
    `;
    

    // --- Title Controls ---
    const titleControls = document.createElement("div");
    titleControls.className = "edit-bar-tab-content edit-bar-tab-title";
    titleControls.style.display = "flex";
    titleControls.style.background = "linear-gradient(90deg, #1e1e1e 80%, #00bfa5 120%)";
    titleControls.style.borderRadius = "8px 8px 0 0";
    titleControls.style.boxShadow = "0 2px 12px rgba(0,191,165,0.08)";
    titleControls.style.borderBottom = "2px solid #00bfa5";
    titleControls.style.marginBottom = "-2px";
    titleControls.style.padding = "8px 0 8px 0";
    titleControls.appendChild(fontGroup);
    titleControls.appendChild(formatGroup);
    // titleControls.appendChild(effectsGroup); // Moved to the end of Title tab controls
    titleControls.appendChild(positionGroup);

    // --- Info Controls (No Effects/Position, Expanded Format) ---
    const infoControls = document.createElement("div");
    infoControls.className = "edit-bar-tab-content edit-bar-tab-info";
    infoControls.style.display = "none";
    infoControls.style.background = "linear-gradient(90deg, #232323 80%, #8e24aa 120%)";
    infoControls.style.borderRadius = "0 0 8px 8px";
    infoControls.style.boxShadow = "0 2px 12px rgba(142,36,170,0.10)";
    infoControls.style.borderTop = "2px solid #8e24aa";
    infoControls.style.marginTop = "-2px";
    infoControls.style.padding = "8px 0 8px 0";
    // Add a class for info theme styling
    infoControls.classList.add('info-theme');

    // Font group for info
    // Create a new infoFontGroup without the Wrap control
    const infoFontGroup = document.createElement("div");
    infoFontGroup.className = "edit-bar-group info-theme";
    infoFontGroup.innerHTML = `
      <span class="edit-bar-group-label">Font</span>
      <select id="edit-bar-info-font-family" class="edit-bar-select">
        ${document.getElementById("info-font-family") ? document.getElementById("info-font-family").innerHTML : document.getElementById("font-family").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <select id="edit-bar-info-text-size" class="edit-bar-select">
        ${document.getElementById("info-text-size") ? document.getElementById("info-text-size").innerHTML : document.getElementById("text-size").innerHTML}
      </select>
    `;

    // Remove Wrap controls from the cloned infoFontGroup as they are not needed in the Info tab
    const allSelectsInInfoFontGroup = infoFontGroup.querySelectorAll('select');
    if (allSelectsInInfoFontGroup.length > 2) {
      const wrapSelectInInfo = allSelectsInInfoFontGroup[2]; // This is the "Wrap" select element
      const wrapLabelInInfo = wrapSelectInInfo.previousElementSibling; // This should be the "Wrap" label
      const wrapDividerInInfo = wrapLabelInInfo ? wrapLabelInInfo.previousElementSibling : null; // This should be the divider before the label

      // Remove the select element for "Wrap"
      wrapSelectInInfo.remove();
      // Remove the "Wrap" label if it exists and is a span with the correct class
      if (wrapLabelInInfo && wrapLabelInInfo.tagName === 'SPAN' && wrapLabelInInfo.classList.contains('edit-bar-group-label')) {
        wrapLabelInInfo.remove();
      }
      // Remove the divider before the "Wrap" label if it exists and is a div with the correct class
      if (wrapDividerInInfo && wrapDividerInInfo.tagName === 'DIV' && wrapDividerInInfo.classList.contains('edit-bar-divider')) {
        wrapDividerInInfo.remove();
      }
    }

    // Expanded Format group for Info: Season and Episode
    const infoFormatGroup = document.createElement("div");
    infoFormatGroup.className = "edit-bar-group info-format-group info-theme";
    // Match the Title tab's group background, but keep purple accents for labels/buttons
    infoFormatGroup.style.background = "#232323";
    infoFormatGroup.style.border = "1px solid rgba(142,36,170,0.13)";
    infoFormatGroup.style.boxShadow = "0 1px 6px rgba(142,36,170,0.10)";
    infoFormatGroup.innerHTML = `
      <span class="edit-bar-group-label">Format</span>
      <span class="edit-bar-divider" style="height:18px;width:1.5px;background:rgba(255,255,255,0.15);margin:0 8px 0 8px;"></span>
      <i data-lucide="layers" class="info-format-label" width="18" height="18" data-tooltip="Season"></i>
      <button id="edit-bar-info-season-bold" class="format-btn info-theme" data-tooltip="Season Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-season-uppercase" class="format-btn info-theme" data-tooltip="Season Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-season-lowercase" class="format-btn info-theme" data-tooltip="Season Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
      <span class="edit-bar-divider" style="height:18px;width:1.5px;background:rgba(255,255,255,0.15);margin:0 8px 0 8px;"></span>
      <i data-lucide="hash" class="info-format-label" width="18" height="18" data-tooltip="Episode"></i>
      <button id="edit-bar-info-episode-bold" class="format-btn info-theme" data-tooltip="Episode Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-episode-uppercase" class="format-btn info-theme" data-tooltip="Episode Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-episode-lowercase" class="format-btn info-theme" data-tooltip="Episode Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
    `;

    // --- Info X/Y Offset Group ---
    // Move Offset group to Title tab
    const infoOffsetGroup = document.createElement("div");
    infoOffsetGroup.className = "edit-bar-group";
    infoOffsetGroup.innerHTML = `
      <span class="edit-bar-group-label">Offset</span>
      <div class="edit-bar-range" style="gap:14px;">
        <label style="display:flex;align-items:center;gap:6px;">
          <span style="min-width:18px;">X</span>
          <button type="button" class="edit-bar-range-btn" id="edit-bar-info-x-offset-decrement" tabindex="-1">-</button>
          <input id="edit-bar-info-x-offset" type="range" min="-350" max="350" value="0" step="5" style="width:90px;">
          <button type="button" class="edit-bar-range-btn" id="edit-bar-info-x-offset-increment" tabindex="-1">+</button>
          <span id="edit-bar-info-x-offset-value" class="range-value">0</span>
        </label>
        <label style="display:flex;align-items:center;gap:6px;">
          <span style="min-width:18px;">Y</span>
          <button type="button" class="edit-bar-range-btn" id="edit-bar-info-y-offset-decrement" tabindex="-1">-</button>
          <input id="edit-bar-info-y-offset" type="range" min="-350" max="350" value="0" step="5" style="width:90px;">
          <button type="button" class="edit-bar-range-btn" id="edit-bar-info-y-offset-increment" tabindex="-1">+</button>
          <span id="edit-bar-info-y-offset-value" class="range-value">0</span>
        </label>
      </div>
    `;

    // --- Info Spoiler Blur Group ---
    // Move Spoiler Blur group to Title tab
    const infoBlurGroup = document.createElement("div");
    infoBlurGroup.className = "edit-bar-group";
    infoBlurGroup.innerHTML = `
      <span class="edit-bar-group-label">Spoiler Blur</span>
      <label style="display:flex;align-items:center;gap:8px;">
        <input id="edit-bar-info-spoiler-blur" type="checkbox" style="accent-color:#00bfa5;width:18px;height:18px;">
      </label>
    `;

    // --- Info Text Spacing ---
    const infoSpacingGroupInfo = document.createElement("div");
    infoSpacingGroupInfo.className = "edit-bar-group info-theme";
    infoSpacingGroupInfo.innerHTML = `
      <span class="edit-bar-group-label">Info Spacing</span>
      <div class="edit-bar-range info-theme">
        <button type="button" class="edit-bar-range-btn info-theme" id="edit-bar-info-info-spacing-decrement" tabindex="-1">-</button>
        <input id="edit-bar-info-info-spacing" type="range" min="0" max="40" value="10" style="width:60px;">
        <button type="button" class="edit-bar-range-btn info-theme" id="edit-bar-info-info-spacing-increment" tabindex="-1">+</button>
        <span id="edit-bar-info-info-spacing-value" class="range-value">10</span>
      </div>
    `;

    // --- Info Number Style & Separator Style ---
    const infoNumberStyleGroup = document.createElement("div");
    infoNumberStyleGroup.className = "edit-bar-group info-theme";
    infoNumberStyleGroup.innerHTML = `
      <span class="edit-bar-group-label">Number Style</span>
      <select id="edit-bar-info-number-style" class="edit-bar-select">
        ${document.getElementById("number-theme-select").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <span class="edit-bar-group-label">Separator</span>
      <select id="edit-bar-info-separator-style" class="edit-bar-select">
        ${document.getElementById("separator-type").innerHTML}
      </select>
    `;

    // --- Info Season/Episode Toggles ---
    const infoSeasonEpisodeToggleGroup = document.createElement("div");
    infoSeasonEpisodeToggleGroup.className = "edit-bar-group info-theme";
    infoSeasonEpisodeToggleGroup.innerHTML = `
      <span class="edit-bar-group-label">Show</span>
      <button type="button" id="edit-bar-info-toggle-season" class="toggle-pill info-theme" aria-pressed="false" tabindex="0">Season</button>
      <button type="button" id="edit-bar-info-toggle-episode" class="toggle-pill info-theme" aria-pressed="false" tabindex="0">Episode</button>
    `;
    // --- Add purple theme styles for Info tab controls ---
    // Only add once
    if (!document.getElementById('edit-bar-info-theme-style')) {
      const style = document.createElement('style');
      style.id = 'edit-bar-info-theme-style';
      style.textContent = `
        /* Info tab group labels */
        .edit-bar-tab-info .info-theme .edit-bar-group-label,
        .edit-bar-tab-info .info-theme .info-format-label {
          color: #8e24aa !important;
        }
        /* Info tab range slider thumb only (track is handled in CSS) */
        .edit-bar-tab-info .info-theme input[type="range"]::-webkit-slider-thumb {
          background: #8e24aa;
        }
        .edit-bar-tab-info .info-theme input[type="range"]::-ms-fill-lower,
        .edit-bar-tab-info .info-theme input[type="range"]::-ms-fill-upper {
          background: #8e24aa;
        }
        .edit-bar-tab-info .info-theme input[type="range"]::-moz-range-thumb {
          background: #8e24aa;
        }
        .edit-bar-tab-info .info-theme input[type="range"] {
          accent-color: #8e24aa;
        }
      `;
      document.head.appendChild(style);
    }

    // Add to Info tab (hidden by default, toggled by settings)
    // Offset and Blur now go in Title tab, not Info tab
    // Add Offset and Blur to Title tab (after positionGroup)
    titleControls.appendChild(infoOffsetGroup);
    titleControls.appendChild(infoBlurGroup);
    titleControls.appendChild(effectsGroup); // effectsGroup moved here

    // Append groups to infoControls in the new specified order
    infoControls.appendChild(infoFontGroup);
    infoControls.appendChild(infoFormatGroup);
    infoControls.appendChild(infoSpacingGroupInfo);
    infoControls.appendChild(infoNumberStyleGroup);
    infoControls.appendChild(infoSeasonEpisodeToggleGroup);

    // Add tab switcher and tab contents to the bar
    editBar.appendChild(tabSwitcher);
    editBar.appendChild(titleControls);
    editBar.appendChild(infoControls);

    // --- Increment/Decrement Button Logic for Info Sliders ---
    function setupRangeButton(id, step, min, max) {
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

    // Wait for DOM to update (sliders are in innerHTML)
    setTimeout(() => {
      setupRangeButton("edit-bar-info-x-offset", 5, -350, 350);
      setupRangeButton("edit-bar-info-y-offset", 5, -350, 350);
      setupRangeButton("edit-bar-info-info-spacing", 5, -50, 50);
    }, 0);

    // Enable horizontal scroll with mouse wheel (vertical wheel scrolls horizontally)
    setTimeout(() => {
      editBar.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          editBar.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    }, 0);
    
    // Append the edit bar to the container
    editBarContainer.appendChild(editBar);
    
    // Find where to insert the edit bar (before the canvas)
    const main = document.querySelector(".main");
    const canvas = document.getElementById("titlecard-canvas");
    
    // Insert the toggle button and edit bar container
    // Insert the toggle button at the top of the main area, before the canvas
    main.insertBefore(toggleButton, canvas);
    main.insertBefore(editBarContainer, canvas);
    
    // Initialize Lucide icons in the edit bar
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
      // Force white color for Lucide icons in .format-btn after icon injection
      const formatIcons = editBar.querySelectorAll('.format-btn i, .info-format-group .format-btn i');
      formatIcons.forEach(icon => {
        icon.style.color = '#fff';
        // For SVGs injected by Lucide, also set stroke
        if (icon.firstElementChild && icon.firstElementChild.tagName === 'svg') {
          icon.firstElementChild.style.stroke = '#fff';
        }
      });
      // Make settings icon white
      const settingsIcon = tabSwitcher.querySelector('.edit-bar-settings-btn i');
      if (settingsIcon) {
        settingsIcon.style.color = '#fff';
        if (settingsIcon.firstElementChild && settingsIcon.firstElementChild.tagName === 'svg') {
          settingsIcon.firstElementChild.style.stroke = '#fff';
        }
      }
      // Remove native title attributes from all edit bar buttons/icons to prevent native tooltips
      editBar.querySelectorAll('[data-tooltip][title]').forEach(el => el.removeAttribute('title'));
      editBar.querySelectorAll('.format-btn [title]').forEach(el => el.removeAttribute('title'));
      // Remove <title> elements from Lucide SVGs to prevent native SVG tooltips
      editBar.querySelectorAll('.format-btn svg title').forEach(el => el.remove());
      editBar.querySelectorAll('.info-format-group .format-btn svg title').forEach(el => el.remove());
    }

    // --- Modal for settings ---
    const settingsModal = document.createElement('div');
    settingsModal.className = 'edit-bar-settings-modal';
    settingsModal.style.display = 'none';
    settingsModal.innerHTML = `
      <div class="edit-bar-settings-backdrop"></div>
      <div class="edit-bar-settings-frame" style="max-width:400px;width:96vw;min-width:0;">
        <div class="edit-bar-settings-header">
          <span>Edit Bar Settings</span>
          <button class="edit-bar-settings-close" data-tooltip="Close Settings"><i data-lucide="x" width="20" height="20"></i></button>
        </div>
        <form id="edit-bar-settings-form" autocomplete="off">
        <div class="edit-bar-settings-content" style="padding:0 0 8px 0;">
          <div style="margin-bottom:18px;">
            <div style="background:linear-gradient(90deg,#1e1e1e 80%,#00bfa5 120%);border-radius:7px 7px 0 0;padding:8px 18px 6px 18px;border-bottom:2px solid #00bfa5;box-shadow:0 2px 8px rgba(0,191,165,0.08);font-weight:700;font-size:1.08em;color:#fff;letter-spacing:.01em;">Title Controls</div>
            <div style="background:#18181a;border-radius:0 0 7px 7px;padding:12px 18px 8px 18px;display:flex;flex-wrap:wrap;gap:10px 18px;border-bottom:1.5px solid #222;">
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-title-font" checked style="accent-color:#00bfa5;">
                <span>Show Font Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-title-format" checked style="accent-color:#00bfa5;">
                <span>Show Format Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-title-effects" checked style="accent-color:#00bfa5;">
                <span>Show Effects Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-title-position" checked style="accent-color:#00bfa5;">
                <span>Show Position Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-offset" style="accent-color:#00bfa5;">
                <span>Show X/Y Offset Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-blur" style="accent-color:#00bfa5;">
                <span>Show Spoiler Blur Control</span>
              </label>
            </div>
          </div>
          <div style="margin-bottom:0;">
            <div style="background:linear-gradient(90deg,#232323 80%,#8e24aa 120%);border-radius:7px 7px 0 0;padding:8px 18px 6px 18px;border-bottom:2px solid #8e24aa;box-shadow:0 2px 8px rgba(142,36,170,0.10);font-weight:700;font-size:1.08em;color:#fff;letter-spacing:.01em;">Info Controls</div>
            <div style="background:#19181c;border-radius:0 0 7px 7px;padding:12px 18px 8px 18px;display:flex;flex-wrap:wrap;gap:10px 18px;">
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-font" checked style="accent-color:#8e24aa;">
                <span>Show Font Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-format" checked style="accent-color:#8e24aa;">
                <span>Show Format Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-spacing" style="accent-color:#8e24aa;">
                <span>Show Info Text Spacing</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-number-style" style="accent-color:#8e24aa;">
                <span>Show Number/Separator Style Controls</span>
              </label>
              <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;min-width:180px;">
                <input type="checkbox" id="toggle-info-season-episode" style="accent-color:#8e24aa;">
                <span>Show Season/Episode Toggles</span>
              </label>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;padding:0 24px 18px 24px;">
          <button type="button" class="edit-bar-settings-reset" style="background:#232323;color:#fff;border:1px solid #00bfa5;border-radius:6px;padding:7px 18px;font-weight:600;cursor:pointer;">Reset</button>
          <button type="submit" class="edit-bar-settings-save" style="background:linear-gradient(135deg,#00bfa5,#8e24aa);color:#fff;border:none;border-radius:6px;padding:7px 18px;font-weight:600;cursor:pointer;">Save</button>
        </div>
        </form>
      </div>
    `;
    document.body.appendChild(settingsModal);

    // Open modal on settings button click
    const settingsBtn = tabSwitcher.querySelector('.edit-bar-settings-btn');
    settingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'block';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
    // Close modal on close button or backdrop click
    settingsModal.querySelector('.edit-bar-settings-close').addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
    settingsModal.querySelector('.edit-bar-settings-backdrop').addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });

    // --- Settings persistence logic ---
    const SETTINGS_KEY = 'editBarSettingsV2';
    const settingsForm = settingsModal.querySelector('#edit-bar-settings-form');
    const allToggles = [
      'toggle-title-font',
      'toggle-title-format',
      'toggle-title-effects',
      'toggle-title-position',
      'toggle-info-font',
      'toggle-info-format',
      'toggle-info-spacing',
      'toggle-info-number-style',
      'toggle-info-season-episode',
      'toggle-info-offset',
      'toggle-info-blur',
    ];

    // Save settings to localStorage
    function saveSettings() {
      const obj = {};
      allToggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) obj[id] = el.checked;
      });
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
    }
    // Load settings from localStorage
    function loadSettings() {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      try {
        const obj = JSON.parse(raw);
        allToggles.forEach(id => {
          const el = document.getElementById(id);
          if (el && typeof obj[id] === 'boolean') {
            el.checked = obj[id];
            // Also update group visibility
            updateGroupVisibility(id);
          }
        });
      } catch {}
    }
    // Reset settings to default
    function resetSettings() {
      allToggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          // Default: all title/info main groups ON, new info groups OFF
          if ([
            'toggle-title-font',
            'toggle-title-format',
            'toggle-title-effects',
            'toggle-title-position',
            'toggle-info-font',
            'toggle-info-format',
            'toggle-info-effects',
            'toggle-info-position',
          ].includes(id)) {
            el.checked = true;
          } else {
            el.checked = false;
          }
          updateGroupVisibility(id);
        }
      });
      localStorage.removeItem(SETTINGS_KEY);
    }

    // Save on submit
    settingsForm.addEventListener('submit', e => {
      e.preventDefault();
      saveSettings();
      settingsModal.style.display = 'none';
    });
    // Reset button
    settingsForm.querySelector('.edit-bar-settings-reset').addEventListener('click', e => {
      e.preventDefault();
      resetSettings();
    });

    // Load settings on open
    settingsBtn.addEventListener('click', loadSettings);

    // --- Load settings on page load (after DOM ready) ---
    // Wait for toggles to exist, then apply
    setTimeout(loadSettings, 0);

    // --- Settings toggles logic ---
    // Map: settings checkbox id -> [array of control group DOM elements]
    const controlGroups = {
      'toggle-title-font': [fontGroup],
      'toggle-title-format': [formatGroup],
      'toggle-title-effects': [effectsGroup],
      'toggle-title-position': [positionGroup],
      'toggle-info-offset': [infoOffsetGroup],
      'toggle-info-blur': [infoBlurGroup],
      'toggle-info-font': [infoFontGroup],
      'toggle-info-format': [infoFormatGroup],
      'toggle-info-spacing': [infoSpacingGroupInfo],
      'toggle-info-number-style': [infoNumberStyleGroup],
      'toggle-info-season-episode': [infoSeasonEpisodeToggleGroup],
    };

    // Helper: show/hide group(s) based on checkbox
    function updateGroupVisibility(checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      const groups = controlGroups[checkboxId];
      if (!checkbox || !groups) return;
      groups.forEach(group => {
        group.style.display = checkbox.checked ? '' : 'none';
      });
    }

    // Initial state: set all group visibility from checkboxes


    Object.keys(controlGroups).forEach(checkboxId => {
      updateGroupVisibility(checkboxId);
      // Listen for changes
      const checkbox = document.getElementById(checkboxId);
      if (checkbox) {
        checkbox.addEventListener('change', () => {
          updateGroupVisibility(checkboxId);
        });
        // Set new Info controls to off by default
        if ([
          'toggle-info-offset',
          'toggle-info-blur',
          'toggle-info-spacing',
          'toggle-info-number-style',
          'toggle-info-season-episode'
        ].includes(checkboxId)) {
          checkbox.checked = false;
          updateGroupVisibility(checkboxId);
        }
      }
    });

    // Attach tooltips to edit bar controls after creation
    if (window.attachEditBarTooltips) window.attachEditBarTooltips();
  }

  // Initialize color pickers in the edit bar
  function initEditBarPickrs() {
    const mainPickrOptions = {
      theme: 'monolith',
      position: 'bottom-middle',
      swatches: [
        '#ffffff', '#cccccc', '#00bfa5', '#8e24aa', '#f44336',
        '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#000000'
      ],
      components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
          hex: true,
          input: true,
          save: true
        }
      }
    };
    
    // No color pickers for the edit bar
  }

  // Setup synchronization between edit bar pickrs and main sidebar pickrs
  function setupPickrSync(pickrInstance, colorName) {
    // Update the edit bar pickr's color from the window global color
    pickrInstance.setColor(window[colorName]);

    // When edit bar pickr changes, update the global color
    pickrInstance.on('change', (color) => {
      const hexColor = color.toHEXA().toString();
      window[colorName] = hexColor;
      // If you want to sync with the sidebar, trigger a custom event or update the sidebar color here if you have a reference
    });
    // If you want to sync from the sidebar to the edit bar, you can add a custom event listener here if needed
  }

  // Setup all event listeners for edit bar elements
  function setupEventListeners() {
    // --- Info tab new controls sync ---
    // Info X Offset
    syncRangeElements('edit-bar-info-x-offset', 'horizontal-position', 'edit-bar-info-x-offset-value', 'position-value', '');
    // Info Y Offset
    syncRangeElements('edit-bar-info-y-offset', 'vertical-position', 'edit-bar-info-y-offset-value', 'position-y-value', '');
    // Info Spoiler Blur (sync checkbox with sidebar's 'spoiler-toggle')
    const editBarSpoiler = document.getElementById('edit-bar-info-spoiler-blur');
    const sidebarSpoiler = document.getElementById('spoiler-toggle');
    if (editBarSpoiler && sidebarSpoiler) {
      // Set initial state
      editBarSpoiler.checked = sidebarSpoiler.checked;
      // When edit bar changes
      editBarSpoiler.addEventListener('change', () => {
        sidebarSpoiler.checked = editBarSpoiler.checked;
        sidebarSpoiler.dispatchEvent(new Event('change'));
      });
      // When sidebar changes
      sidebarSpoiler.addEventListener('change', () => {
        editBarSpoiler.checked = sidebarSpoiler.checked;
      });
    }
    // Info Text Spacing
    syncRangeElements('edit-bar-info-info-spacing', 'title-info-spacing', 'edit-bar-info-info-spacing-value', 'spacing-value', 'px');
    // Info Number Style
    syncSelectElements('edit-bar-info-number-style', 'number-theme-select');
    // Info Separator Style
    syncSelectElements('edit-bar-info-separator-style', 'separator-type');
    // Info Season/Episode Toggles
    syncButtonWithCheckbox('edit-bar-info-toggle-season', 'season-number-display');
    syncButtonWithCheckbox('edit-bar-info-toggle-episode', 'episode-number-display');
    // --- Info tab event listeners ---
    // Font family sync (info)
    syncSelectElements('edit-bar-info-font-family', 'info-font-family');
    // Text size sync (info)
    syncSelectElements('edit-bar-info-text-size', 'info-text-size');

    // Info formatting button sync (season)
    syncButtonWithCheckbox('edit-bar-info-season-bold', 'info-season-bold');
    syncButtonWithCheckbox('edit-bar-info-season-uppercase', 'info-season-uppercase');
    syncButtonWithCheckbox('edit-bar-info-season-lowercase', 'info-season-lowercase');
    // Info formatting button sync (episode)
    syncButtonWithCheckbox('edit-bar-info-episode-bold', 'info-episode-bold');
    syncButtonWithCheckbox('edit-bar-info-episode-uppercase', 'info-episode-uppercase');
    syncButtonWithCheckbox('edit-bar-info-episode-lowercase', 'info-episode-lowercase');
    // Tab switching logic
    const tabButtons = document.querySelectorAll('.edit-bar-tab');
    const tabContents = document.querySelectorAll('.edit-bar-tab-content');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        tabContents.forEach(tc => {
          if (tc.classList.contains('edit-bar-tab-' + tab)) {
            tc.style.display = 'flex';
          } else {
            tc.style.display = 'none';
          }
        });
      });
    });
    // Toggle edit bar visibility
    const toggleButton = document.querySelector('.floating-edit-bar-toggle');
    const editBarContainer = document.querySelector('.edit-bar-container');
    toggleButton.addEventListener('click', () => {
      editBarContainer.classList.toggle('visible');
      toggleButton.classList.toggle('active');
      // Change icon and label depending on state
      if (editBarContainer.classList.contains('visible')) {
        toggleButton.innerHTML = '<i data-lucide="x" width="24" height="24" style="margin-right:8px;"></i><span class="edit-bar-toggle-label">Close Edit Bar</span>';
      } else {
        toggleButton.innerHTML = '<i data-lucide="edit-3" width="20" height="20" style="margin-right:8px;"></i><span class="edit-bar-toggle-label">Edit Bar</span>';
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
    // Set initial icon and label
    if (!editBarContainer.classList.contains('visible')) {
      toggleButton.innerHTML = '<i data-lucide="edit-3" width="20" height="20" style="margin-right:8px;"></i><span class="edit-bar-toggle-label">Edit Bar</span>';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
    
    // Font family sync
    syncSelectElements('edit-bar-font-family', 'font-family');
    
    // Text size sync
    syncSelectElements('edit-bar-text-size', 'text-size');
    
    // Effect type sync
    syncSelectElements('edit-bar-effect-type', 'effect-type');

    // Gradient opacity sync
    const editBarGradientOpacity = document.getElementById('edit-bar-gradient-opacity');
    const sidebarGradientOpacity = document.getElementById('gradient-opacity');
    const editBarGradientOpacityValue = document.getElementById('edit-bar-gradient-opacity-value');
    const sidebarGradientOpacityValue = document.getElementById('gradient-opacity-value');
    if (editBarGradientOpacity && sidebarGradientOpacity) {
      // Set initial value
      editBarGradientOpacity.value = sidebarGradientOpacity.value;
      if (editBarGradientOpacityValue) {
        editBarGradientOpacityValue.textContent = Number(editBarGradientOpacity.value).toFixed(2);
      }
      // When edit bar slider changes
      editBarGradientOpacity.addEventListener('input', () => {
        sidebarGradientOpacity.value = editBarGradientOpacity.value;
        if (editBarGradientOpacityValue) {
          editBarGradientOpacityValue.textContent = Number(editBarGradientOpacity.value).toFixed(2);
        }
        if (sidebarGradientOpacityValue) {
          sidebarGradientOpacityValue.textContent = Number(editBarGradientOpacity.value).toFixed(2);
        }
        sidebarGradientOpacity.dispatchEvent(new Event('input'));
      });
      // When sidebar slider changes
      sidebarGradientOpacity.addEventListener('input', () => {
        editBarGradientOpacity.value = sidebarGradientOpacity.value;
        if (editBarGradientOpacityValue) {
          editBarGradientOpacityValue.textContent = Number(sidebarGradientOpacity.value).toFixed(2);
        }
      });
    }

    // Preset select sync
    syncSelectElements('edit-bar-preset-select', 'preset-select');

    // Info position sync
    syncSelectElements('edit-bar-info-position', 'info-position');

    // Text outline width sync

    // (Removed edit-bar-text-outline-width sync)

    // Title wrap select sync (for dropdown)
    syncSelectElements('edit-bar-title-wrap', 'title-wrapping');
    
    // Text formatting button sync
    syncButtonWithCheckbox('edit-bar-bold', 'title-bold');
    syncButtonWithCheckbox('edit-bar-uppercase', 'title-uppercase');
    syncButtonWithCheckbox('edit-bar-lowercase', 'title-lowercase');
  }

  // Utility function to synchronize select elements
  function syncSelectElements(editBarId, sidebarId) {
    const editBarElement = document.getElementById(editBarId);
    const sidebarElement = document.getElementById(sidebarId);
    
    if (editBarElement && sidebarElement) {
      // Initially set edit bar select value from sidebar
      editBarElement.value = sidebarElement.value;
      
      // When edit bar select changes
      editBarElement.addEventListener('change', () => {
        sidebarElement.value = editBarElement.value;
        // Trigger change event on sidebar element to update card
        sidebarElement.dispatchEvent(new Event('change'));
      });
      
      // When sidebar select changes
      sidebarElement.addEventListener('change', () => {
        editBarElement.value = sidebarElement.value;
      });
    }
  }

  // Utility function to synchronize range elements
  function syncRangeElements(editBarId, sidebarId, editBarValueId, sidebarValueId, unit) {
    const editBarElement = document.getElementById(editBarId);
    const sidebarElement = document.getElementById(sidebarId);
    const editBarValueElement = document.getElementById(editBarValueId);
    const sidebarValueElement = document.getElementById(sidebarValueId);
    
    if (editBarElement && sidebarElement) {
      // Initially set edit bar range value from sidebar
      editBarElement.value = sidebarElement.value;
      if (editBarValueElement) {
        editBarValueElement.textContent = `${editBarElement.value}${unit}`;
      }
      
      // When edit bar range changes
      editBarElement.addEventListener('input', () => {
        sidebarElement.value = editBarElement.value;
        if (editBarValueElement) {
          editBarValueElement.textContent = `${editBarElement.value}${unit}`;
        }
        if (sidebarValueElement) {
          sidebarValueElement.textContent = `${editBarElement.value}${unit}`;
        }
        // Trigger input event on sidebar element to update card
        sidebarElement.dispatchEvent(new Event('input'));
      });
      
      // When sidebar range changes
      sidebarElement.addEventListener('input', () => {
        editBarElement.value = sidebarElement.value;
        if (editBarValueElement) {
          editBarValueElement.textContent = `${sidebarElement.value}${unit}`;
        }
      });
    }
  }

  // Utility function to synchronize button with checkbox
  function syncButtonWithCheckbox(buttonId, checkboxId) {
    const button = document.getElementById(buttonId);
    const checkbox = document.getElementById(checkboxId);
    
    if (button && checkbox) {
      // Initially set button state from checkbox
      button.classList.toggle('active', checkbox.checked);
      
      // When button is clicked
      button.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        button.classList.toggle('active', checkbox.checked);
        // Trigger change event on checkbox to update card
        checkbox.dispatchEvent(new Event('change'));
      });
      
      // When checkbox changes
      checkbox.addEventListener('change', () => {
        button.classList.toggle('active', checkbox.checked);
      });
    }
  }

  // Initialize the edit bar when the DOM is fully loaded
  initEditBar();
});
