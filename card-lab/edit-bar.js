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
      <button class="edit-bar-tab active" data-tab="title">Title</button>
      <button class="edit-bar-tab" data-tab="info">Info</button>
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
    toggleButton.title = "Show/Hide Edit Bar";
    
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
      <button id="edit-bar-bold" class="format-btn" title="Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-uppercase" class="format-btn" title="Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-lowercase" class="format-btn" title="Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
    `;
    

    
    // Effects group
    const effectsGroup = document.createElement("div");
    effectsGroup.className = "edit-bar-group";
    effectsGroup.innerHTML = `
      <span class="edit-bar-group-label">Effects</span>
      <select id="edit-bar-effect-type">
        ${document.getElementById("effect-type").innerHTML}
      </select>
      <div class="edit-bar-divider"></div>
      <div class="edit-bar-range">
        <span>Gradient</span>
        <input type="range" id="edit-bar-gradient-opacity" min="0" max="1" step="0.01" value="0.7">
        <span class="range-value" id="edit-bar-gradient-opacity-value">0.70</span>
      </div>
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
    titleControls.appendChild(fontGroup);
    titleControls.appendChild(formatGroup);
    titleControls.appendChild(effectsGroup);
    titleControls.appendChild(positionGroup);


    // --- Info Controls (No Effects/Position, Expanded Format) ---
    const infoControls = document.createElement("div");
    infoControls.className = "edit-bar-tab-content edit-bar-tab-info";
    infoControls.style.display = "none";

    // Font group for info
    const infoFontGroup = fontGroup.cloneNode(true);
    infoFontGroup.querySelector('.edit-bar-group-label').textContent = 'Font';
    const infoFontSelect = infoFontGroup.querySelector('select');
    if (document.getElementById("info-font-family")) {
      infoFontSelect.innerHTML = document.getElementById("info-font-family").innerHTML;
      infoFontSelect.id = "edit-bar-info-font-family";
    } else {
      infoFontSelect.id = "edit-bar-info-font-family";
    }
    const infoTextSizeSelect = infoFontGroup.querySelectorAll('select')[1];
    if (document.getElementById("info-text-size")) {
      infoTextSizeSelect.innerHTML = document.getElementById("info-text-size").innerHTML;
      infoTextSizeSelect.id = "edit-bar-info-text-size";
    } else {
      infoTextSizeSelect.id = "edit-bar-info-text-size";
    }

    // Expanded Format group for Info: Season and Episode
    const infoFormatGroup = document.createElement("div");
    infoFormatGroup.className = "edit-bar-group info-format-group";
    infoFormatGroup.innerHTML = `
      <span class="edit-bar-group-label">Format</span>
      <span class="info-format-label">Season</span>
      <button id="edit-bar-info-season-bold" class="format-btn" title="Season Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-season-uppercase" class="format-btn" title="Season Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-season-lowercase" class="format-btn" title="Season Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
      <span class="info-format-label">Episode</span>
      <button id="edit-bar-info-episode-bold" class="format-btn" title="Episode Bold">
        <i data-lucide="bold" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-episode-uppercase" class="format-btn" title="Episode Uppercase">
        <i data-lucide="case-upper" width="16" height="16"></i>
      </button>
      <button id="edit-bar-info-episode-lowercase" class="format-btn" title="Episode Lowercase">
        <i data-lucide="case-lower" width="16" height="16"></i>
      </button>
    `;

    infoControls.appendChild(infoFontGroup);
    infoControls.appendChild(infoFormatGroup);

    // Add tab switcher and tab contents to the bar
    editBar.appendChild(tabSwitcher);
    editBar.appendChild(titleControls);
    editBar.appendChild(infoControls);
    
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
    }
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
