// editor-bar.js
// Editor Bar logic for Card Lab
// This file creates a quick-access editor bar above the canvas/grid, synced with sidebar options.

(function() {
  // Helper to create elements
  function createEl(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'style') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el[k.toLowerCase()] = v;
      else el.setAttribute(k, v);
    }
    for (const child of children) {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    }
    return el;
  }

  // Try to load saved options
  function loadEditorBarOptions() {
    try {
      const saved = localStorage.getItem('card-lab-editor-bar-options');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading editor bar options', e);
    }
    return null;
  }
  
  // Save current options
  function saveEditorBarOptions(options) {
    try {
      localStorage.setItem('card-lab-editor-bar-options', JSON.stringify(
        options.map(opt => ({ id: opt.id, hide: !!opt.hide }))
      ));
    } catch (e) {
      console.error('Error saving editor bar options', e);
    }
  }

  // Default options for the bar (can be customized by user)
  let editorOptions = [
    { id: 'font-family', label: 'Font', type: 'select', section: 'title' },
    { id: 'text-size', label: 'Size', type: 'select', section: 'title' },
    { id: 'text-color', label: 'Color', type: 'pickr', section: 'title' },
    { id: 'title-bold', label: 'Bold', type: 'checkbox', section: 'title' },
    { id: 'title-uppercase', label: 'Upper', type: 'checkbox', section: 'title' },
    { id: 'title-lowercase', label: 'Lower', type: 'checkbox', section: 'title' },
    { id: 'text-shadow-blur', label: 'Shadow', type: 'range', min: 0, max: 20, step: 1, section: 'title' },
    { id: 'text-outline-width', label: 'Outline', type: 'range', min: 0, max: 10, step: 1, section: 'title' },
    { id: 'title-wrapping', label: 'Wrap', type: 'select', section: 'title' },
    { id: 'line-spacing', label: 'Spacing', type: 'range', min: 0.8, max: 1.5, step: 0.05, section: 'title' },
    { id: 'info-font-family', label: 'Info Font', type: 'select', section: 'info' },
    { id: 'info-text-size', label: 'Info Size', type: 'select', section: 'info' },
    { id: 'info-color', label: 'Info Color', type: 'pickr', section: 'info' },
    { id: 'info-season-bold', label: 'S Bold', type: 'checkbox', section: 'info' },
    { id: 'info-season-uppercase', label: 'S Up', type: 'checkbox', section: 'info' },
    { id: 'info-season-lowercase', label: 'S Low', type: 'checkbox', section: 'info' },
    { id: 'info-episode-bold', label: 'E Bold', type: 'checkbox', section: 'info' },
    { id: 'info-episode-uppercase', label: 'E Up', type: 'checkbox', section: 'info' },
    { id: 'info-episode-lowercase', label: 'E Low', type: 'checkbox', section: 'info' },
    { id: 'info-shadow-blur', label: 'I Shadow', type: 'range', min: 0, max: 20, step: 1, section: 'info' },
    { id: 'info-outline-width', label: 'I Outline', type: 'range', min: 0, max: 10, step: 1, section: 'info' }
  ];

  // Create the bar
  function createEditorBar() {
    if (document.getElementById('editor-bar')) return;
    
    // Load saved options if available
    const savedOptions = loadEditorBarOptions();
    if (savedOptions) {
      savedOptions.forEach(savedOpt => {
        const opt = editorOptions.find(o => o.id === savedOpt.id);
        if (opt) opt.hide = !!savedOpt.hide;
      });
    }
    
    // Active section (default to title)
    let activeSection = localStorage.getItem('card-lab-active-section') || 'title';
    
    const bar = createEl('div', { id: 'editor-bar' });

    // Toggle button
    const toggleBtn = createEl('button', { id: 'editor-bar-toggle' }, 'Hide Editor');
    toggleBtn.onclick = () => {
      bar.style.display = 'none';
      showShowBtn.style.display = 'inline-block';
    };

    // Show button (hidden by default)
    const showShowBtn = createEl('button', { id: 'editor-bar-show-btn' }, 'Show Editor');
    showShowBtn.onclick = () => {
      bar.style.display = 'flex';
      showShowBtn.style.display = 'none';
    };

    // Insert show button and bar above canvas/grid, not above sidebar
    const main = document.querySelector('.main');
    if (main) {
      main.insertBefore(showShowBtn, main.firstChild);
      main.insertBefore(bar, main.firstChild);
    }

    // Option selector for customizing bar
    const optionSelectorBtn = createEl('button', {
      id: 'editor-bar-options-btn',
    }, '⚙');
    optionSelectorBtn.title = 'Customize Editor Bar';
    optionSelectorBtn.onclick = function() {
      let modal = document.getElementById('editor-bar-options-modal');
      if (modal) modal.remove();
      modal = createEl('div', { id: 'editor-bar-options-modal', style: {
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%,-50%)',
        zIndex: 9999, 
        minWidth: '320px'
      } });
      modal.appendChild(createEl('h3', {}, 'Editor Bar Options'));
      
      // Group options by section for better organization
      const modalSections = { title: [], info: [] };
      
      editorOptions.forEach(opt => {
        modalSections[opt.section].push(opt);
      });
      
      for (const [sectionName, options] of Object.entries(modalSections)) {
        const sectionTitle = createEl('h4', { 
          style: { 
            color: '#00bfa5', 
            marginTop: '15px', 
            marginBottom: '8px', 
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          } 
        }, sectionName === 'title' ? 'Title Controls' : 'Info Text Controls');
        modal.appendChild(sectionTitle);
        
        options.forEach(opt => {
          const cb = createEl('input', { 
            type: 'checkbox', 
            checked: !opt.hide, 
            style: { marginRight: '8px' } 
          });
          cb.onchange = () => { opt.hide = !cb.checked; rebuildBar(); };
          modal.appendChild(createEl('div', { 
            style: { 
              marginBottom: '8px', 
              display: 'flex', 
              alignItems: 'center',
              padding: '4px 0'
            } 
          }, cb, createEl('span', { 
            style: { color: '#fff', fontSize: '0.9rem' } 
          }, opt.label)));
        });
      }
      
      const closeBtn = createEl('button', { 
        style: { 
          marginTop: '18px', 
          background: '#00bfa5', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          padding: '8px 18px', 
          fontWeight: 600, 
          cursor: 'pointer', 
          fontSize: '0.9rem',
          width: '100%'
        } 
      }, 'Save & Close');
      closeBtn.onclick = () => {
        // Save options to localStorage before closing
        saveEditorBarOptions(editorOptions);
        modal.remove();
      };
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);
    };
    bar.appendChild(optionSelectorBtn);

    // Helper to add Pickr color pickers
    function addPickr(targetId, colorName) {
      const container = createEl('div', { id: targetId+'-pickr-container', style: { display: 'inline-block', verticalAlign: 'middle' } });
      setTimeout(() => {
        if (window.Pickr) {
          const pickr = window.Pickr.create({
            el: '#' + targetId + '-pickr-container',
            theme: 'monolith',
            default: window[colorName] || '#ffffff',
            swatches: [ '#ffffff', '#000000', '#00bfa5', '#8e24aa', '#ff4081', '#ffd600', '#00fff0' ],
            components: {
              preview: true, opacity: true, hue: true,
              interaction: { hex: true, rgba: true, input: true, save: true }
            }
          });
          pickr.on('save', (color) => {
            const hex = color.toHEXA().toString();
            window[colorName] = hex;
            syncSidebar(colorName === 'text-color' ? 'text-color' : 'info-color', hex);
            if (window.updateBothViews) window.updateBothViews();
          });
          pickr.on('change', (color) => {
            const hex = color.toHEXA().toString();
            window[colorName] = hex;
            syncSidebar(colorName === 'text-color' ? 'text-color' : 'info-color', hex);
            if (window.updateBothViews) window.updateBothViews();
          });
        }
      }, 0);
      return container;
    }

    // Create section tabs for switching between title and info
    const sectionTabs = createEl('div', { id: 'editor-section-tabs' });
    
    // Title tab
    const titleTab = createEl('button', { 
      class: 'section-tab' + (activeSection === 'title' ? ' active' : ''),
      'data-section': 'title'
    }, 'Title');
    
    // Info tab
    const infoTab = createEl('button', { 
      class: 'section-tab' + (activeSection === 'info' ? ' active' : ''),
      'data-section': 'info'
    }, 'Info');
    
    sectionTabs.appendChild(titleTab);
    sectionTabs.appendChild(infoTab);
    bar.appendChild(sectionTabs);
    
    // Build controls (now only shown based on active section)
    const groupLabels = { title: 'Title', info: 'Info' };
    const sections = {};
    
    ['title', 'info'].forEach((section) => {
      const group = createEl('div', { 
        class: 'editor-section',
        style: { 
          display: section === activeSection ? 'flex' : 'none'
        }
      });
      
      // Store section element for later reference
      sections[section] = group;
      
      // Group label with icon
      const icon = document.createElement('span');
      icon.className = 'editor-section-title';
      icon.innerHTML = (section === 'title' ? 
        '<svg width="12" height="12" style="margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>' : 
        '<svg width="12" height="12" style="margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>');
      icon.appendChild(document.createTextNode(groupLabels[section]));
      group.appendChild(icon);
      
      // Container for all controls in this section
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'section-controls';
      controlsContainer.style.display = 'flex';
      controlsContainer.style.alignItems = 'center';
      group.appendChild(controlsContainer);

      editorOptions.filter(opt => opt.section === section && !opt.hide).forEach(opt => {
        let input;
        if (opt.type === 'select') {
          input = document.getElementById(opt.id)?.cloneNode(true);
          if (!input) return;
          input.id = 'editor-bar-' + opt.id;
          input.onchange = e => {
            syncSidebar(opt.id, e.target.value);
            if (window.updateBothViews) window.updateBothViews();
          };
          input.value = document.getElementById(opt.id)?.value;
        } else if (opt.type === 'pickr') {
          input = addPickr('editor-bar-' + opt.id, opt.id === 'text-color' ? 'text-color' : 'info-color');
        } else if (opt.type === 'checkbox') {
          // Use icon buttons for toggles
          const iconMap = {
            'Bold': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 0 1 0 8H6z"/></svg>',
            'Upper': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4h2l8 16h2V4"/></svg>',
            'Lower': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h2l8-16h2v16"/></svg>',
            'S Bold': '<b>S</b>',
            'S Up': 'S↑',
            'S Low': 'S↓',
            'E Bold': '<b>E</b>',
            'E Up': 'E↑',
            'E Low': 'E↓'
          };
          input = createEl('button', {
            class: 'editor-btn',
            id: 'editor-bar-' + opt.id,
            'aria-pressed': !!document.getElementById(opt.id)?.checked,
            title: opt.label,
            style: { margin: '0 2px' }
          });
          input.innerHTML = iconMap[opt.label] || opt.label;
          input.onclick = e => {
            const checked = !document.getElementById(opt.id)?.checked;
            syncSidebar(opt.id, checked);
            input.setAttribute('aria-pressed', checked);
            if (window.updateBothViews) window.updateBothViews();
          };
        } else if (opt.type === 'range') {
          input = createEl('input', { type: 'range', id: 'editor-bar-' + opt.id, min: opt.min, max: opt.max, step: opt.step, value: document.getElementById(opt.id)?.value });
          input.oninput = e => {
            syncSidebar(opt.id, e.target.value);
            if (window.updateBothViews) window.updateBothViews();
          };
        }
        if (input) {
          if (opt.type !== 'checkbox') {
            const label = createEl('label', { for: input.id }, opt.label);
            // Create control group with divider between different controls
            const wrap = createEl('div', { class: 'control-group' }, label, input);
            controlsContainer.appendChild(wrap);
          } else {
            const wrap = createEl('div', { class: 'control-group' }, input);
            controlsContainer.appendChild(wrap);
          }
        }
      });
      
      bar.appendChild(group);
    });
    
    // Add click handlers to tabs
    titleTab.onclick = () => {
      activateSection('title');
      localStorage.setItem('card-lab-active-section', 'title');
    };
    
    infoTab.onclick = () => {
      activateSection('info');
      localStorage.setItem('card-lab-active-section', 'info');
    };
    
    // Function to activate a section
    function activateSection(sectionName) {
      // Update tab states
      titleTab.className = 'section-tab' + (sectionName === 'title' ? ' active' : '');
      infoTab.className = 'section-tab' + (sectionName === 'info' ? ' active' : '');
      
      // Show/hide sections
      sections.title.style.display = sectionName === 'title' ? 'flex' : 'none';
      sections.info.style.display = sectionName === 'info' ? 'flex' : 'none';
      
      // Update active section
      activeSection = sectionName;
    }
    
    bar.appendChild(toggleBtn);

    // Helper to rebuild bar (for option selection)
    function rebuildBar() {
      bar.innerHTML = '';
      bar.appendChild(optionSelectorBtn);
      
      // Recreate section tabs
      const rebuildTabs = createEl('div', { id: 'editor-section-tabs' });
      
      // Title tab
      const rebuildTitleTab = createEl('button', { 
        class: 'section-tab' + (activeSection === 'title' ? ' active' : ''),
        'data-section': 'title'
      }, 'Title');
      
      // Info tab
      const rebuildInfoTab = createEl('button', { 
        class: 'section-tab' + (activeSection === 'info' ? ' active' : ''),
        'data-section': 'info'
      }, 'Info');
      
      rebuildTabs.appendChild(rebuildTitleTab);
      rebuildTabs.appendChild(rebuildInfoTab);
      bar.appendChild(rebuildTabs);
      
      // Store section elements for reference
      const rebuildSections = {};
      
      ['title', 'info'].forEach((section) => {
        // Create section container with modern styling
        const group = createEl('div', { 
          class: 'editor-section',
          style: { display: section === activeSection ? 'flex' : 'none' }
        });
        
        // Store section element
        rebuildSections[section] = group;
        
        // Section title with icon
        const icon = document.createElement('span');
        icon.className = 'editor-section-title';
        icon.innerHTML = (section === 'title' ? 
          '<svg width="12" height="12" style="margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>' : 
          '<svg width="12" height="12" style="margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>');
        icon.appendChild(document.createTextNode(groupLabels[section]));
        group.appendChild(icon);
        
        // Container for controls in this section
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'section-controls';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.alignItems = 'center';
        group.appendChild(controlsContainer);
        
        editorOptions.filter(opt => opt.section === section && !opt.hide).forEach(opt => {
          let input;
          if (opt.type === 'select') {
            input = document.getElementById(opt.id)?.cloneNode(true);
            if (!input) return;
            input.id = 'editor-bar-' + opt.id;
            input.onchange = e => {
              syncSidebar(opt.id, e.target.value);
              if (window.updateBothViews) window.updateBothViews();
            };
            input.value = document.getElementById(opt.id)?.value;
          } else if (opt.type === 'pickr') {
            input = addPickr('editor-bar-' + opt.id, opt.id === 'text-color' ? 'text-color' : 'info-color');
          } else if (opt.type === 'checkbox') {
            const iconMap = {
              'Bold': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zm0 8h9a4 4 0 0 1 0 8H6z"/></svg>',
              'Upper': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4h2l8 16h2V4"/></svg>',
              'Lower': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h2l8-16h2v16"/></svg>',
              'S Bold': '<b>S</b>',
              'S Up': 'S↑',
              'S Low': 'S↓',
              'E Bold': '<b>E</b>',
              'E Up': 'E↑',
              'E Low': 'E↓'
            };
            input = createEl('button', {
              class: 'editor-btn',
              id: 'editor-bar-' + opt.id,
              'aria-pressed': !!document.getElementById(opt.id)?.checked,
              title: opt.label
            });
            input.innerHTML = iconMap[opt.label] || opt.label;
            input.onclick = e => {
              const checked = !document.getElementById(opt.id)?.checked;
              syncSidebar(opt.id, checked);
              input.setAttribute('aria-pressed', checked);
              if (window.updateBothViews) window.updateBothViews();
            };
          } else if (opt.type === 'range') {
            input = createEl('input', { type: 'range', id: 'editor-bar-' + opt.id, min: opt.min, max: opt.max, step: opt.step, value: document.getElementById(opt.id)?.value });
            input.oninput = e => {
              syncSidebar(opt.id, e.target.value);
              if (window.updateBothViews) window.updateBothViews();
            };
          }
          
          if (input) {
            if (opt.type !== 'checkbox') {
              const label = createEl('label', { for: input.id }, opt.label);
              const wrap = createEl('div', { class: 'control-group' }, label, input);
              controlsContainer.appendChild(wrap);
            } else {
              const wrap = createEl('div', { class: 'control-group' }, input);
              controlsContainer.appendChild(wrap);
            }
          }
        });
        
        bar.appendChild(group);
      });
      
      // Add click handlers to rebuild tabs
      rebuildTitleTab.onclick = () => {
        activateRebuildSection('title');
        localStorage.setItem('card-lab-active-section', 'title');
      };
      
      rebuildInfoTab.onclick = () => {
        activateRebuildSection('info');
        localStorage.setItem('card-lab-active-section', 'info');
      };
      
      // Function to activate a section in rebuild context
      function activateRebuildSection(sectionName) {
        // Update tab states
        rebuildTitleTab.className = 'section-tab' + (sectionName === 'title' ? ' active' : '');
        rebuildInfoTab.className = 'section-tab' + (sectionName === 'info' ? ' active' : '');
        
        // Show/hide sections
        rebuildSections.title.style.display = sectionName === 'title' ? 'flex' : 'none';
        rebuildSections.info.style.display = sectionName === 'info' ? 'flex' : 'none';
        
        // Update active section
        activeSection = sectionName;
      }
      
      bar.appendChild(toggleBtn);
    }

    // Sync sidebar -> bar
    function syncBarFromSidebar() {
      for (const opt of editorOptions) {
        const sidebarEl = document.getElementById(opt.id);
        const barEl = document.getElementById('editor-bar-' + opt.id);
        if (sidebarEl && barEl) {
          if (opt.type === 'checkbox') {
            if (barEl.tagName === 'BUTTON') {
              barEl.setAttribute('aria-pressed', !!sidebarEl.checked);
            } else {
              barEl.checked = sidebarEl.checked;
            }
          } else {
            barEl.value = sidebarEl.value;
          }
        }
      }
    }

    // Sync bar -> sidebar
    function syncSidebar(id, value) {
      const sidebarEl = document.getElementById(id);
      if (!sidebarEl) return;
      if (sidebarEl.type === 'checkbox') sidebarEl.checked = value;
      else sidebarEl.value = value;
      // If sidebar has an event, trigger it
      sidebarEl.dispatchEvent(new Event('input', { bubbles: true }));
      sidebarEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Listen for sidebar changes
    for (const opt of editorOptions) {
      const sidebarEl = document.getElementById(opt.id);
      if (sidebarEl) {
        sidebarEl.addEventListener('input', syncBarFromSidebar);
        sidebarEl.addEventListener('change', syncBarFromSidebar);
      }
    }
    
    // Initial sync
    syncBarFromSidebar();
  }

  // Expose for app.js
  window.createEditorBar = createEditorBar;
})();
