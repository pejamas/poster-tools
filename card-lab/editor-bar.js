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
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    });
    
    // Add SVG gear icon programmatically
    const gearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    gearSvg.setAttribute("width", "14");
    gearSvg.setAttribute("height", "14");
    gearSvg.setAttribute("viewBox", "0 0 24 24");
    gearSvg.setAttribute("fill", "none");
    gearSvg.setAttribute("stroke", "currentColor");
    gearSvg.setAttribute("stroke-width", "2");
    gearSvg.setAttribute("stroke-linecap", "round");
    gearSvg.setAttribute("stroke-linejoin", "round");
    
    // Create circle element
    const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleEl.setAttribute("cx", "12");
    circleEl.setAttribute("cy", "12");
    circleEl.setAttribute("r", "3");
    gearSvg.appendChild(circleEl);
    
    // Create path element
    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z");
    gearSvg.appendChild(pathEl);
    
    // Append SVG to button
    optionSelectorBtn.appendChild(gearSvg);
    optionSelectorBtn.title = 'Customize Editor Bar';
    optionSelectorBtn.onclick = function() {
      let modal = document.getElementById('editor-bar-options-modal');
      if (modal) modal.remove();      modal = createEl('div', { 
        id: 'editor-bar-options-modal', 
        style: {
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%,-50%)',
          zIndex: 9999, 
          minWidth: '350px',
          background: 'linear-gradient(135deg, rgba(15, 12, 41, 0.97), rgba(48, 43, 99, 0.97))',
          borderRadius: '10px',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 240, 0.2), 0 0 15px rgba(106, 17, 203, 0.2)',
          color: '#fff',
          padding: '20px',
          fontFamily: '"Gabarito", sans-serif',
          border: '1px solid rgba(106, 17, 203, 0.3)'
        }
      });
      
      // Modal header with icon
      const modalHeader = createEl('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px',
          borderBottom: '1px solid rgba(106, 17, 203, 0.3)',
          paddingBottom: '12px'
        }
      });      // Add gear icon to header
      const headerIcon = createEl('div', {
        style: {
          marginRight: '10px',
          color: '#00fff0',
          display: 'flex',
          alignItems: 'center'
        }
      });
      
      // Create gear SVG for header
      const headerGearSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      headerGearSvg.setAttribute("width", "20");
      headerGearSvg.setAttribute("height", "20");
      headerGearSvg.setAttribute("viewBox", "0 0 24 24");
      headerGearSvg.setAttribute("fill", "none");
      headerGearSvg.setAttribute("stroke", "currentColor");
      headerGearSvg.setAttribute("stroke-width", "2");
      headerGearSvg.setAttribute("stroke-linecap", "round");
      headerGearSvg.setAttribute("stroke-linejoin", "round");
      headerGearSvg.style.marginRight = '8px';
      
      // Create circle element
      const headerCircleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      headerCircleEl.setAttribute("cx", "12");
      headerCircleEl.setAttribute("cy", "12");
      headerCircleEl.setAttribute("r", "3");
      headerGearSvg.appendChild(headerCircleEl);
      
      // Create path element
      const headerPathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      headerPathEl.setAttribute("d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z");
      headerGearSvg.appendChild(headerPathEl);
      
      // Append SVG to headerIcon
      headerIcon.appendChild(headerGearSvg);
      
      const modalTitle = createEl('h3', {
        style: {
          margin: '0',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#ffffff'
        }
      }, 'Editor Bar Configuration');
      
      modalHeader.appendChild(headerIcon);
      modalHeader.appendChild(modalTitle);
      modal.appendChild(modalHeader);
      
      // Create tab navigation for sections
      const tabNav = createEl('div', {
        style: {
          display: 'flex',
          marginBottom: '15px',
          background: 'rgba(19, 19, 28, 0.6)',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }
      });
      
      // Tab containers for content
      const tabContents = {};
      
      // Group options by section for better organization
      const modalSections = { title: [], info: [] };
      
      editorOptions.forEach(opt => {
        modalSections[opt.section].push(opt);
      });
      
      // Create tabs for each section
      for (const [sectionName, options] of Object.entries(modalSections)) {
        // Create tab button
        const tabBtn = createEl('button', {
          'data-tab': sectionName,
          style: {
            flex: '1',
            border: 'none',
            background: 'transparent',
            color: sectionName === 'title' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }
        }, sectionName === 'title' ? 'Title Controls' : 'Info Text Controls');
        
        // Active tab indicator
        if (sectionName === 'title') {          tabBtn.style.background = 'rgba(106, 17, 203, 0.15)';
          tabBtn.style.boxShadow = 'inset 0 -2px 0 #00fff0';
        }
        
        tabNav.appendChild(tabBtn);
        
        // Create content container for this tab
        const tabContent = createEl('div', {
          'data-tab-content': sectionName,
          style: {
            display: sectionName === 'title' ? 'block' : 'none'
          }
        });
        
        tabContents[sectionName] = tabContent;
        modal.appendChild(tabContent);
        
        // Add section title to content
        const sectionTitle = createEl('h4', { 
          style: { 
            color: '#00fff0', 
            margin: '0 0 12px 0', 
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center'
          } 
        });
        
        // Add icon based on section
        if (sectionName === 'title') {
          sectionTitle.innerHTML = '<svg width="14" height="14" style="margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>Title Display Options';
        } else {
          sectionTitle.innerHTML = '<svg width="14" height="14" style="margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>Info Text Display Options';
        }
          tabContent.appendChild(sectionTitle);
        
        // Group options by category for better organization
        const optionCategories = {
          'appearance': { title: 'Appearance', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>', items: [] },
          'typography': { title: 'Typography', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"></path></svg>', items: [] },
          'effects': { title: 'Effects', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>', items: [] },
          'layout': { title: 'Layout', icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', items: [] }
        };
        
        // Sort options into categories
        options.forEach(opt => {
          if (opt.type === 'select' && (opt.id.includes('font') || opt.id.includes('family'))) {
            optionCategories.typography.items.push(opt);
          } else if (opt.type === 'pickr' || opt.id.includes('color')) {
            optionCategories.appearance.items.push(opt);
          } else if (opt.id.includes('shadow') || opt.id.includes('outline')) {
            optionCategories.effects.items.push(opt);
          } else if (opt.id.includes('spacing') || opt.id.includes('wrapping') || opt.id.includes('position')) {
            optionCategories.layout.items.push(opt);
          } else if (opt.id.includes('uppercase') || opt.id.includes('lowercase') || opt.id.includes('bold')) {
            optionCategories.typography.items.push(opt);
          } else if (opt.id.includes('size')) {
            optionCategories.typography.items.push(opt);
          } else {
            // Default for anything not categorized
            optionCategories.appearance.items.push(opt);
          }
        });
        
        // Render each category that has items
        Object.entries(optionCategories).forEach(([categoryKey, category]) => {
          if (category.items.length === 0) return;
          
          // Create category header
          const categoryHeader = createEl('div', {
            style: {
              borderBottom: '1px solid rgba(106, 17, 203, 0.15)',
              marginBottom: '8px',
              paddingBottom: '5px',
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center'
            }
          });
          
          const categoryIcon = createEl('span', {
            style: {
              marginRight: '6px',
              color: 'rgba(255, 255, 255, 0.6)'
            },
            innerHTML: category.icon
          });
          
          const categoryTitle = createEl('span', {
            style: {
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600'
            }
          }, category.title);
          
          categoryHeader.appendChild(categoryIcon);
          categoryHeader.appendChild(categoryTitle);
          tabContent.appendChild(categoryHeader);
          
          // Create option grid for this category
          const optionGrid = createEl('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '8px',
              marginBottom: '10px'
            }
          });
          
          // Add each option in this category
          category.items.forEach(opt => {
            const optionItem = createEl('div', {
              style: {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                padding: '8px 10px',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                boxShadow: opt.hide ? 'none' : 'inset 0 0 0 1px rgba(106, 17, 203, 0.3)'
              }
            });
            
            // Label with styled checkbox
            const label = createEl('label', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: opt.hide ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }
            });
            
            // Add friendly label text
            let labelText = opt.label || opt.id
              .replace(/-/g, ' ')
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .replace('text', '')
              .replace('size', 'Size')
              .replace('color', 'Color')
              .replace('info', 'Info')
              .replace('shadow blur', 'Shadow')
              .replace('outline width', 'Outline')
              .trim();
              
            label.appendChild(document.createTextNode(labelText));
            
            // Create the toggle switch
            const toggleSwitch = createEl('div', {
              style: {
                position: 'relative',
                width: '28px',
                height: '16px',
                borderRadius: '8px',
                background: opt.hide ? 'rgba(255, 255, 255, 0.15)' : 'linear-gradient(135deg, #00fff0, #6a11cb)',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }
            });
            
            const toggleSlider = createEl('div', {
              style: {
                position: 'absolute',
                top: '2px',
                left: opt.hide ? '2px' : '12px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffffff',
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }
            });
            
            toggleSwitch.appendChild(toggleSlider);
            label.appendChild(toggleSwitch);
            optionItem.appendChild(label);
            
            // Make the entire option item clickable
            optionItem.addEventListener('click', () => {
              opt.hide = !opt.hide;
              optionItem.style.boxShadow = opt.hide ? 'none' : 'inset 0 0 0 1px rgba(106, 17, 203, 0.3)';
              label.style.color = opt.hide ? 'rgba(255, 255, 255, 0.4)' : '#ffffff';
              toggleSwitch.style.background = opt.hide ? 'rgba(255, 255, 255, 0.15)' : 'linear-gradient(135deg, #00fff0, #6a11cb)';
              toggleSlider.style.left = opt.hide ? '2px' : '12px';
              // Immediately save and update bar
              saveEditorBarOptions(editorOptions);
              rebuildBar();
            });
            
            optionGrid.appendChild(optionItem);
          });
          
          tabContent.appendChild(optionGrid);
        });
      }
      
      // Add tab click handlers
      const tabs = tabNav.querySelectorAll('button[data-tab]');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Update tab buttons
          tabs.forEach(t => {
            t.style.color = 'rgba(255, 255, 255, 0.7)';
            t.style.background = 'transparent';
            t.style.boxShadow = 'none';
          });
            tab.style.color = '#ffffff';
          tab.style.background = 'rgba(106, 17, 203, 0.15)';
          tab.style.boxShadow = 'inset 0 -2px 0 #00fff0';
          
          // Show corresponding content
          const tabName = tab.getAttribute('data-tab');
          Object.entries(tabContents).forEach(([name, content]) => {
            content.style.display = name === tabName ? 'block' : 'none';
          });
        });
      });
      
      modal.appendChild(tabNav);
      
      // Action buttons at bottom
      const actionButtons = createEl('div', {
        style: {
          display: 'flex',
          marginTop: '15px',
          gap: '10px'
        }
      });
      
      const cancelBtn = createEl('button', { 
        style: { 
          flex: '1',
          background: 'rgba(255, 255, 255, 0.1)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          padding: '10px', 
          fontWeight: 600, 
          cursor: 'pointer', 
          fontSize: '0.85rem',
          transition: 'all 0.2s ease'
        } 
      }, 'Cancel');
      
      cancelBtn.onmouseover = () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
        cancelBtn.style.transform = 'translateY(-1px)';
        cancelBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      };
      
      cancelBtn.onmouseout = () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        cancelBtn.style.transform = 'translateY(0)';
        cancelBtn.style.boxShadow = 'none';
      };
      
      cancelBtn.onclick = () => {
        modal.remove();
      };
      
      const saveBtn = createEl('button', { 
        style: { 
          flex: '2',
          background: 'linear-gradient(135deg, #00fff0, #6a11cb)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          padding: '10px', 
          fontWeight: 600, 
          cursor: 'pointer', 
          fontSize: '0.85rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 255, 255, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        } 
      }, 'Save & Apply Changes');
      
      // Add shine effect to the button
      const shine = createEl('span', {
        style: {
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))',
          animation: 'shine 2.5s infinite',
          pointerEvents: 'none'
        }
      });
      
      // Create keyframe animation style element
      if (!document.getElementById('shine-animation')) {
        const shineAnimation = createEl('style', { id: 'shine-animation' });
        shineAnimation.innerHTML = `
          @keyframes shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
          }
        `;
        document.head.appendChild(shineAnimation);
      }
      
      saveBtn.appendChild(shine);
      
      saveBtn.onmouseover = () => {
        saveBtn.style.boxShadow = '0 4px 12px rgba(0, 255, 255, 0.5)';
        saveBtn.style.transform = 'translateY(-1px)';
        saveBtn.style.background = 'linear-gradient(135deg, #00e5ff, #8e2de2)';
      };
      
      saveBtn.onmouseout = () => {
        saveBtn.style.boxShadow = '0 2px 8px rgba(0, 255, 255, 0.3)';
        saveBtn.style.transform = 'translateY(0)';
        saveBtn.style.background = 'linear-gradient(135deg, #00fff0, #6a11cb)';
      };
      
      saveBtn.onclick = () => {
        // Save options to localStorage before closing
        saveEditorBarOptions(editorOptions);
        rebuildBar();
        // Also force updateBothViews to refresh info text etc
        if (window.updateBothViews) window.updateBothViews();
        modal.remove();
      };
      
      actionButtons.appendChild(cancelBtn);
      actionButtons.appendChild(saveBtn);
      modal.appendChild(actionButtons);
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
      sections[section] = group;

      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'section-controls';
      controlsContainer.style.display = 'flex';
      controlsContainer.style.alignItems = 'center';
      group.appendChild(controlsContainer);

      // For info section, group S/E toggles as segmented controls, keep order
      if (section === 'info') {
        // Find indices for S/E toggles
        const opts = editorOptions.filter(opt => opt.section === section && !opt.hide);
        // Find indices for S/E toggles
        const sStart = opts.findIndex(opt => opt.id === 'info-season-bold');
        const sEnd = opts.findIndex(opt => opt.id === 'info-season-lowercase');
        const eStart = opts.findIndex(opt => opt.id === 'info-episode-bold');
        const eEnd = opts.findIndex(opt => opt.id === 'info-episode-lowercase');

        // Render controls before S toggles
        for (let i = 0; i < sStart; ++i) {
          addControl(opts[i]);
        }

        // Render Season segmented control
        if (sStart !== -1 && sEnd !== -1) {
          const seg = createEl('div', { class: 'segmented-control', style: { display: 'flex', alignItems: 'center', margin: '0 12px 0 0' } });
          seg.appendChild(createEl('span', {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              marginRight: '10px',
              fontSize: '13px',
              color: '#fff',
              background: 'linear-gradient(90deg, #6a11cb 0%, #00fff0 100%)',
              padding: '2px 14px 2px 8px',
              borderRadius: '20px',
              letterSpacing: '1px',
              textTransform: 'capitalize',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              border: '1.5px solid #00fff0',
              fontFamily: 'Gabarito, sans-serif',
              textShadow: '0 1px 2px #000, 0 0 2px #00fff0'
            }
          }, 'Season'));
          const sOpts = opts.slice(sStart, sEnd + 1);
          sOpts.forEach(opt => seg.appendChild(makeSegBtn(opt)));
          controlsContainer.appendChild(seg);
        }

        // Render controls between S and E toggles
        for (let i = sEnd + 1; i < eStart; ++i) {
          addControl(opts[i]);
        }

        // Render Episode segmented control
        if (eStart !== -1 && eEnd !== -1) {
          const seg = createEl('div', { class: 'segmented-control', style: { display: 'flex', alignItems: 'center', margin: '0 12px 0 0' } });
          seg.appendChild(createEl('span', {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              marginRight: '10px',
              fontSize: '13px',
              color: '#fff',
              background: 'linear-gradient(90deg, #00fff0 0%, #6a11cb 100%)',
              padding: '2px 14px 2px 8px',
              borderRadius: '20px',
              letterSpacing: '1px',
              textTransform: 'capitalize',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              border: '1.5px solid #6a11cb',
              fontFamily: 'Gabarito, sans-serif',
              textShadow: '0 1px 2px #000, 0 0 2px #6a11cb'
            }
          }, 'Episode'));
          const eOpts = opts.slice(eStart, eEnd + 1);
          eOpts.forEach(opt => seg.appendChild(makeSegBtn(opt)));
          controlsContainer.appendChild(seg);
        }

        // Render controls after E toggles
        for (let i = eEnd + 1; i < opts.length; ++i) {
          addControl(opts[i]);
        }

        function makeSegBtn(opt) {
          // Use Lucide icons for Bold/case-upper/case-lower
          const iconMap = {
            'S Bold': '<i data-lucide="bold" style="width:16px;height:16px;vertical-align:middle;"></i>',
            'S Up': '<i data-lucide="case-upper" style="width:16px;height:16px;vertical-align:middle;"></i>',
            'S Low': '<i data-lucide="case-lower" style="width:16px;height:16px;vertical-align:middle;"></i>',
            'E Bold': '<i data-lucide="bold" style="width:16px;height:16px;vertical-align:middle;"></i>',
            'E Up': '<i data-lucide="case-upper" style="width:16px;height:16px;vertical-align:middle;"></i>',
            'E Low': '<i data-lucide="case-lower" style="width:16px;height:16px;vertical-align:middle;"></i>'
          };
          const btn = createEl('button', {
            class: 'editor-btn',
            id: 'editor-bar-' + opt.id,
            'aria-pressed': !!document.getElementById(opt.id)?.checked,
            title: opt.label,
            style: { margin: '0 2px' }
          });
          btn.innerHTML = iconMap[opt.label] || opt.label;
          btn.onclick = e => {
            const checked = !document.getElementById(opt.id)?.checked;
            syncSidebar(opt.id, checked);
            btn.setAttribute('aria-pressed', checked);
            if (window.updateBothViews) window.updateBothViews();
            if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
          };
          return btn;
        }

        function addControl(opt) {
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
            // Only for non S/E toggles
            const iconMap = {
              'Bold': '<i data-lucide="bold" style="width:16px;height:16px;vertical-align:middle;"></i>',
              'Upper': '<i data-lucide="case-upper" style="width:16px;height:16px;vertical-align:middle;"></i>',
              'Lower': '<i data-lucide="case-lower" style="width:16px;height:16px;vertical-align:middle;"></i>'
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
              if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
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
        }
      } else {
        // Title section: render as before, but use Lucide icons for Bold/Upper/Lower
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
              'Bold': '<i data-lucide="bold" style="width:16px;height:16px;vertical-align:middle;"></i>',
              'Upper': '<i data-lucide="case-upper" style="width:16px;height:16px;vertical-align:middle;"></i>',
              'Lower': '<i data-lucide="case-lower" style="width:16px;height:16px;vertical-align:middle;"></i>'
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
              if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
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
      }

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
          // Use Lucide icons for Bold/case-upper/case-lower
          const iconMap = {
            'Bold': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h9a4 4 0 0 1 0 8H6zm0 8h11a4 4 0 0 1 0 8H6z"/></svg>',
            'Upper': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11m-4 0h6"/><path d="M15 12v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm0 0v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4"/></svg>',
            'Lower': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v11m-4 0h6"/><path d="M17 20v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"/></svg>',
            'S Bold': '<span style="font-weight:bold;font-size:13px;">S</span>',
            'S Up': '<span style="font-size:13px;">S&#8593;</span>',
            'S Low': '<span style="font-size:13px;">S&#8595;</span>',
            'E Bold': '<span style="font-weight:bold;font-size:13px;">E</span>',
            'E Up': '<span style="font-size:13px;">E&#8593;</span>',
            'E Low': '<span style="font-size:13px;">E&#8595;</span>'
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
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
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
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Expose for app.js
  window.createEditorBar = createEditorBar;
})();
