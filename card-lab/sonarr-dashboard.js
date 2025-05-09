document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // SONARR DASHBOARD INTEGRATION
  // =====================================================
  
  // Configuration variables
  let sonarrConfig = {
    url: localStorage.getItem("sonarrUrl") || "",
    apiKey: localStorage.getItem("sonarrApiKey") || "",
    useProxy: localStorage.getItem("sonarrUseProxy") === "true" || false,
    connected: false
  };

  // Globals to track view mode
  let sonarrViewMode = localStorage.getItem("sonarrViewMode") || "grid"; // Default to grid view

  // DOM elements
  let sonarrDashboardElement = null;
  let sonarrConnectBtn = null;
  let sonarrShowsContainer = null;
  let sonarrViewToggle = null;

  // Initialize Sonarr Dashboard UI
  async function initSonarrDashboard() {
    // Create a fullscreen Sonarr dashboard container that overlays the main content
    const sonarrContainer = document.createElement("div");
    sonarrContainer.id = "sonarr-dashboard";
    sonarrContainer.className = "sonarr-dashboard-fullscreen";
    sonarrContainer.style.display = "none"; // Initially hidden
    
    // Create HTML for Sonarr connection UI
    sonarrContainer.innerHTML = `      <div class="sonarr-header">
        <div class="sonarr-header-title">
          <h2>Sonarr Integration</h2>
          <p class="sonarr-subtitle">Browse and select shows from your Sonarr library</p>
        </div>
        <button id="sonarr-close-btn" class="action-button">
          <img class="action-icon" src="../assets/poster-overlay-icons/back.png" alt="Back Icon" style="width:24px;height:24px;object-fit:contain;">
          Return to Card Lab
        </button>
      </div>      <div class="sonarr-connection-form">
        <div class="sonarr-form-header">
          <h3>Connect to Sonarr</h3>
          <p class="connection-info">Enter your Sonarr instance URL and API key to connect</p>
        </div>
        <div class="sonarr-form-content">
          <div class="connection-stack">
            <div class="form-group full-width">
              <label for="sonarr-url">Sonarr URL</label>
              <div class="input-with-icon">
                <input type="text" id="sonarr-url" placeholder="https://your-sonarr-url.com" value="${sonarrConfig.url}">
              </div>
            </div>
            <div class="form-group full-width">
              <label for="sonarr-username">Username (if required)</label>
              <div class="input-with-icon">
                <input type="text" id="sonarr-username" placeholder="Sonarr username">
              </div>
            </div>
            <div class="form-group full-width">
              <label for="sonarr-password">Password (if required)</label>
              <div class="input-with-icon">
                <input type="password" id="sonarr-password" placeholder="Sonarr password">
              </div>
            </div>
            <div class="form-group full-width">
              <label for="sonarr-api-key">API Key</label>
              <div class="input-with-icon">
                <input type="password" id="sonarr-api-key" placeholder="Your Sonarr API key" value="${sonarrConfig.apiKey}">
              </div>
            </div>
            <div class="form-group full-width">
              <div class="toggle-container">
                <span class="toggle-label">Use CORS Proxy (for HTTP/HTTPS mixing issues)</span>
                <div class="toggle-switch">
                  <input type="checkbox" id="sonarr-use-proxy" ${sonarrConfig.useProxy ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </div>
              </div>
              <p class="helper-text">Enable this if you're getting mixed content errors when connecting to HTTP Sonarr from HTTPS site</p>
            </div>
            <div class="form-group full-width">
              <button id="sonarr-connect-btn" class="action-button connect-btn full-width">
                <img class="action-icon" src="../assets/poster-overlay-icons/power.png" alt="Power Icon" style="width:24px;height:24px;object-fit:contain;">
                Connect to Sonarr
              </button>
            </div>
            <div class="form-group full-width">
              <p id="sonarr-status" class="status-text"></p>
            </div>
          </div>
        </div>
      </div>
      
      <div id="sonarr-view-controls" class="sonarr-view-controls" style="display:none;">
        <div class="view-toggle-container">
          <button id="grid-view-btn" class="view-toggle-btn active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Grid
          </button>
          <button id="table-view-btn" class="view-toggle-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            Table
          </button>
        </div>
        <div class="sonarr-search-container">
          <input type="text" id="show-search" placeholder="Search shows..." class="sonarr-search-input">
        </div>
      </div>
      
      <div class="sonarr-shows-container" id="sonarr-shows-container">
        <!-- Shows will be populated here -->
      </div>
    `;
  
    // Add to the body so it overlays everything
    document.body.appendChild(sonarrContainer);
    
    // Store references to created elements
    sonarrDashboardElement = sonarrContainer;
    sonarrConnectBtn = document.getElementById("sonarr-connect-btn");
    sonarrShowsContainer = document.getElementById("sonarr-shows-container");
    
    // Initialize view toggle buttons
    const gridViewBtn = document.getElementById("grid-view-btn");
    const tableViewBtn = document.getElementById("table-view-btn");
    
    // Set initial active state based on saved preference
    if (sonarrViewMode === "table") {
      gridViewBtn.classList.remove("active");
      tableViewBtn.classList.add("active");
    } else {
      gridViewBtn.classList.add("active");
      tableViewBtn.classList.remove("active");
    }
    
    // Add view toggle events
    gridViewBtn.addEventListener("click", () => {
      sonarrViewMode = "grid";
      localStorage.setItem("sonarrViewMode", "grid");
      gridViewBtn.classList.add("active");
      tableViewBtn.classList.remove("active");
      if (sonarrConfig.connected) {
        loadSonarrShows();
      }
    });
    
    tableViewBtn.addEventListener("click", () => {
      sonarrViewMode = "table";
      localStorage.setItem("sonarrViewMode", "table");
      tableViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      if (sonarrConfig.connected) {
        loadSonarrShows();
      }
    });
    
    // Initialize search functionality
    const searchInput = document.getElementById("show-search");
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterShows(searchTerm);
    });
    
    // Add event listeners
    sonarrConnectBtn.addEventListener("click", connectToSonarr);
    
    // Add close button listener
    const closeBtn = document.getElementById("sonarr-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", hideSonarrDashboard);
    }
      // Set up the button in the sidebar - now it just shows/hides the dashboard
    const sonarrButton = document.getElementById("sonarr-button");
    if (sonarrButton) {
      // Add button click event listener - shows the dashboard
      sonarrButton.addEventListener("click", () => {
        showSonarrDashboard();
        localStorage.setItem("sonarrEnabled", "true");
      });
      
      // Don't auto-open the dashboard on page load, just restore the toggle state
      // We keep the checkbox state, but don't actually show the dashboard
      // This way users need to explicitly click to open it
    }
      // Make sure the dashboard is initially hidden, regardless of previous state
    hideSonarrDashboard();
      // Check if we have saved credentials and try to auto-connect
    // but don't show the dashboard unless the user clicks the toggle
    if (sonarrConfig.url && sonarrConfig.apiKey) {
      try {
        const success = await testSonarrConnection();
        if (success) {
          // If connection is successful, hide the form
          hideConnectionForm();
          // Load shows but don't actually show the dashboard
          loadSonarrShows();
        }
      } catch (error) {
        console.error("Auto-connection failed:", error);
        // Keep showing the connection form if auto-connection fails
      }
    }
  }
    // Show the Sonarr Dashboard
  function showSonarrDashboard() {
    if (sonarrDashboardElement) {
      sonarrDashboardElement.style.display = "flex";
      document.body.classList.add("sonarr-dashboard-open");
    }
  }
  
  // Hide the Sonarr Dashboard
  function hideSonarrDashboard() {
    if (sonarrDashboardElement) {
      sonarrDashboardElement.style.display = "none";
      document.body.classList.remove("sonarr-dashboard-open");
    }
  }
  // Hide the connection form and show just the show listings
  function hideConnectionForm() {
    const connectionForm = document.querySelector('.sonarr-connection-form');
    if (connectionForm) {
      connectionForm.style.display = 'none';
    }
    
    // Add a connection status bar with disconnect option if it doesn't exist
    let connectionStatus = document.getElementById('sonarr-connection-status');
    if (!connectionStatus) {
      connectionStatus = document.createElement('div');
      connectionStatus.id = 'sonarr-connection-status';
      connectionStatus.className = 'sonarr-connection-status';      connectionStatus.innerHTML = `
        <div class="connection-info">
          <span class="connection-url">${sonarrConfig.url}</span>
          <span class="connection-badge">Connected</span>
        </div>        <button id="disconnect-sonarr" class="action-button small">
          <img class="action-icon" src="../assets/poster-overlay-icons/power-off.png" alt="Power Off Icon" style="width:18px;height:18px;object-fit:contain;">
          Disconnect
        </button>
      `;
      
      // Insert it after the header
      const header = document.querySelector('.sonarr-header');
      if (header && header.nextSibling) {
        header.parentNode.insertBefore(connectionStatus, header.nextSibling);
      }
      
      // Add event listener for disconnect button
      document.getElementById('disconnect-sonarr').addEventListener('click', showConnectionForm);
    }
    
    // Show view controls
    const viewControls = document.getElementById('sonarr-view-controls');
    if (viewControls) {
      viewControls.style.display = 'flex';
      
      // Ensure the correct view button is active
      const gridViewBtn = document.getElementById("grid-view-btn");
      const tableViewBtn = document.getElementById("table-view-btn");
      
      if (sonarrViewMode === "table") {
        gridViewBtn.classList.remove("active");
        tableViewBtn.classList.add("active");
      } else {
        gridViewBtn.classList.add("active");
        tableViewBtn.classList.remove("active");
      }
    }
  }
    // Show the connection form (used when disconnecting)
  function showConnectionForm() {
    // Remove the connection status bar if it exists
    const connectionStatus = document.getElementById('sonarr-connection-status');
    if (connectionStatus) {
      connectionStatus.remove();
    }
    
    // Show the connection form
    const connectionForm = document.querySelector('.sonarr-connection-form');
    if (connectionForm) {
      connectionForm.style.display = 'block';
    }
    
    // Hide view controls
    const viewControls = document.getElementById('sonarr-view-controls');
    if (viewControls) {
      viewControls.style.display = 'none';
    }
    
    // Clear the shows container
    if (sonarrShowsContainer) {
      sonarrShowsContainer.innerHTML = '';
    }
    
    // Reset the connection status
    sonarrConfig.connected = false;
    
    // Keep the URL and API key in the form, but optionally clear them
    // if you want to force the user to re-enter them
    // const urlInput = document.getElementById("sonarr-url");
    // const apiKeyInput = document.getElementById("sonarr-api-key");
    // if (urlInput) urlInput.value = "";
    // if (apiKeyInput) apiKeyInput.value = "";
    
    // Update the status display
    const statusEl = document.getElementById("sonarr-status");
    if (statusEl) {
      statusEl.textContent = "Disconnected. Please reconnect.";
      statusEl.className = "status-text";
    }
  }
  
  // Connect to Sonarr API
  async function connectToSonarr() {
    const urlInput = document.getElementById("sonarr-url");
    const apiKeyInput = document.getElementById("sonarr-api-key");
    const usernameInput = document.getElementById("sonarr-username");
    const passwordInput = document.getElementById("sonarr-password");
    const useProxyInput = document.getElementById("sonarr-use-proxy");
    const statusEl = document.getElementById("sonarr-status");

    // Get values and trim whitespace
    sonarrConfig.url = urlInput.value.trim();
    sonarrConfig.apiKey = apiKeyInput.value.trim();
    const username = usernameInput ? usernameInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";
    sonarrConfig.username = username;
    sonarrConfig.useProxy = useProxyInput ? useProxyInput.checked : false;
    // Do NOT store password in config/localStorage for security

    // Save proxy setting to localStorage
    localStorage.setItem("sonarrUseProxy", sonarrConfig.useProxy ? "true" : "false");

    // Basic validation
    if (!sonarrConfig.url || !sonarrConfig.apiKey) {
      statusEl.textContent = "Please enter both URL and API key";
      statusEl.className = "status-text error";
      return;
    }

    // Remove trailing slash from URL if present
    if (sonarrConfig.url.endsWith("/")) {
      sonarrConfig.url = sonarrConfig.url.slice(0, -1);
    }
    // Update button state
    sonarrConnectBtn.disabled = true;
    sonarrConnectBtn.innerHTML = `
      <img class="action-icon spinning" src="../assets/poster-overlay-icons/power.png" alt="Power Icon" style="width:24px;height:24px;object-fit:contain;opacity:0.7;animation:spin 1s linear infinite;">
      Connecting...
    `;
    statusEl.textContent = "Testing connection...";
    statusEl.className = "status-text";
    
    try {
      // Test connection with Sonarr
      const success = await testSonarrConnection();
      if (success) {
        // Save credentials to localStorage
        localStorage.setItem("sonarrUrl", sonarrConfig.url);
        localStorage.setItem("sonarrApiKey", sonarrConfig.apiKey);
            // Update UI
        sonarrConfig.connected = true;
        statusEl.textContent = "Connected successfully!";
        statusEl.className = "status-text success";
        
        // Hide the connection form and show the shows
        hideConnectionForm();
        
        // Load shows from Sonarr
        loadSonarrShows();
      }
    } catch (error) {
      console.error("Error connecting to Sonarr:", error);
      statusEl.textContent = `Error: ${error.message || "Could not connect to Sonarr"}`;
      statusEl.className = "status-text error";
    } finally {      // Reset button state
      sonarrConnectBtn.disabled = false;      sonarrConnectBtn.innerHTML = `
        <img class="action-icon" src="../assets/poster-overlay-icons/power.png" alt="Power Icon" style="width:24px;height:24px;object-fit:contain;">
        Connect to Sonarr
      `;
    }
  }
  // Test connection to Sonarr API
  async function testSonarrConnection() {
    try {
      // Get username/password from the form (do not store password)
      const usernameInput = document.getElementById("sonarr-username");
      const passwordInput = document.getElementById("sonarr-password");
      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      const headers = {
        'X-Api-Key': sonarrConfig.apiKey,
        'Content-Type': 'application/json'
      };
      if (username && password) {
        const basicAuth = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${basicAuth}`;
      }

      // Choose URL based on proxy setting
      let requestURL;
      if (sonarrConfig.useProxy) {
        // Use Cloudflare Worker proxy
        requestURL = `https://sonarr-helper.pejamas.workers.dev/?url=${encodeURIComponent(sonarrConfig.url)}&path=${encodeURIComponent('/api/v3/system/status')}`;
      } else {
        requestURL = `${sonarrConfig.url}/api/v3/system/status`;
      }

      const response = await fetch(requestURL, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("Sonarr connection successful:", data);

      // Set connected state and hide the connection form
      sonarrConfig.connected = true;

      return true;
    } catch (error) {
      console.error("Failed to connect to Sonarr:", error);
      throw error;
    }
  }
  
  // Load all shows from Sonarr
  async function loadSonarrShows() {
    if (!sonarrConfig.connected) {
      return;
    }
    
    // Show loading state
    sonarrShowsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading your shows from Sonarr...</p>
      </div>
    `;
    
    try {
      // Get username/password from the form (do not store password)
      const usernameInput = document.getElementById("sonarr-username");
      const passwordInput = document.getElementById("sonarr-password");
      const username = usernameInput ? usernameInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      const headers = {
        'X-Api-Key': sonarrConfig.apiKey,
        'Content-Type': 'application/json'
      };
      if (username && password) {
        const basicAuth = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${basicAuth}`;
      }      // Choose URL based on proxy setting
      let requestURL;
      if (sonarrConfig.useProxy) {
        // Use Cloudflare Worker proxy
        requestURL = `https://sonarr-helper.pejamas.workers.dev/?url=${encodeURIComponent(sonarrConfig.url)}&path=${encodeURIComponent('/api/v3/series')}`;
      } else {
        requestURL = `${sonarrConfig.url}/api/v3/series`;
      }

      // Fetch series from Sonarr
      const response = await fetch(requestURL, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const shows = await response.json();
      // Log the first show to console for debugging
      if (shows && shows.length > 0) {
        console.log("Sample show data from Sonarr:", shows[0]);
      }
      renderSonarrShows(shows);
    } catch (error) {
      console.error("Error loading shows from Sonarr:", error);      sonarrShowsContainer.innerHTML = `
        <div class="error-message">
          <p>Error loading shows: ${error.message || "Unknown error"}</p>
          <button id="retry-loading-shows" class="action-button">
            <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path><path d="M13 21h6v-6"></path></svg>
            Retry
          </button>
        </div>
      `;

      // Add retry button event listener
      document.getElementById("retry-loading-shows")?.addEventListener("click", loadSonarrShows);
    }
  }
    // Render Sonarr shows in the UI
  function renderSonarrShows(shows) {
    if (!shows || shows.length === 0) {
      sonarrShowsContainer.innerHTML = `
        <div class="empty-message">
          <p>No shows found in your Sonarr library.</p>
        </div>
      `;
      return;
    }
    
    // Sort shows alphabetically by title
    shows.sort((a, b) => a.title.localeCompare(b.title));
    
    // Show view controls
    document.getElementById('sonarr-view-controls').style.display = 'flex';
    
    // Create shows list HTML - either grid or table view
    let showsHtml = `<h3>Your Sonarr Shows (${shows.length})</h3>`;
    
    if (sonarrViewMode === 'grid') {
      // GRID VIEW
      showsHtml += `<div class="sonarr-shows-list">`;
      shows.forEach(show => {
        // Create thumbnail URL (if available from Sonarr)
        const posterUrl = show.images && show.images.find(img => img.coverType === 'poster');
        // Format show info
        const stats = show.statistics || {};
        const seasonCount = stats.seasonCount || show.seasonCount || 0;
        const episodeCount = stats.episodeFileCount || stats.episodeCount || show.episodeCount || 0;

        // --- Title Card Completion State Logic ---
        const titleCardData = getTitleCardSeasonsForShow(show.tvdbId);
        const markedSeasons = titleCardData ? Object.values(titleCardData).filter(Boolean).length : 0;
        let completionClass = 'no-titlecards';
        let badgeHtml = `<span class="completion-badge none">None</span>`;
        if (markedSeasons === seasonCount && seasonCount > 0) {
          completionClass = 'has-titlecards';
          badgeHtml = `<span class="completion-badge complete">Complete</span>`;
        } else if (markedSeasons > 0 && markedSeasons < seasonCount) {
          completionClass = 'partial-titlecards';
          badgeHtml = `<span class="completion-badge partial">Partial</span>`;
        }

        showsHtml += `
          <div class="sonarr-show-item ${completionClass}" data-tvdbid="${show.tvdbId}" data-title="${show.title}" data-seasons="${seasonCount}">
            <div class="sonarr-show-poster">
              ${posterUrl ? `<img src="${posterUrl.remoteUrl}" alt="${show.title}" loading="lazy">` : 
              `<div class="no-poster">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="m9.5 15 5-5"></path><path d="m9.5 10 5 5"></path></svg>
                <span>No Poster</span>
              </div>`}
            </div>
            <div class="sonarr-show-info">
              <div class="info-content">
                <h4>${show.title}</h4>
                <p>${show.year || 'Unknown Year'} • ${show.status}</p>
                <p>${seasonCount} Seasons • ${episodeCount} Episodes</p>
                ${badgeHtml}
              </div>
              <button class="mark-titlecards-btn action-button small" data-tvdbid="${show.tvdbId}" data-title="${show.title}" data-seasons="${seasonCount}">
                <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 12l2 2 4-4"></path></svg>
                Mark Title Cards
              </button>
            </div>
          </div>
        `;
      });
      showsHtml += `</div>`;
    } else {      // TABLE VIEW
      showsHtml += `<div class="sonarr-shows-table-wrapper">
        <table class="sonarr-shows-table">
          <thead>
            <tr>
              <th class="sortable sort-asc" data-column="0">Title</th>
              <th class="sortable" data-column="1">Year</th>
              <th class="sortable" data-column="2">Status</th>
              <th class="sortable" data-column="3">Seasons</th>
              <th class="sortable" data-column="4">Episodes</th>
              <th class="sortable" data-column="5">Title Cards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>`;
      
      shows.forEach(show => {
        // Format show info
        const stats = show.statistics || {};
        const seasonCount = stats.seasonCount || show.seasonCount || 0;
        const episodeCount = stats.episodeFileCount || stats.episodeCount || show.episodeCount || 0;
        
        // Title Card Completion State Logic
        const titleCardData = getTitleCardSeasonsForShow(show.tvdbId);
        const markedSeasons = titleCardData ? Object.values(titleCardData).filter(Boolean).length : 0;
        
        // Create season breakdown list for tooltip
        let seasonBreakdown = '';
        if (markedSeasons > 0) {
          seasonBreakdown = '<ul class="season-breakdown">';
          for (let i = 1; i <= seasonCount; i++) {
            const hasCard = titleCardData && titleCardData[i];
            seasonBreakdown += `<li>Season ${i}: ${hasCard ? '✓' : '✗'}</li>`;
          }
          seasonBreakdown += '</ul>';
        }
        
        let completionClass = 'no-titlecards';
        let badgeHtml = `<span class="completion-badge none">None</span>`;
        if (markedSeasons === seasonCount && seasonCount > 0) {
          completionClass = 'has-titlecards';
          badgeHtml = `<span class="completion-badge complete">Complete (${markedSeasons}/${seasonCount})</span>`;
        } else if (markedSeasons > 0) {
          completionClass = 'partial-titlecards';
          badgeHtml = `<span class="completion-badge partial" title="Click to see details">Partial (${markedSeasons}/${seasonCount})</span>`;
        }
        
        showsHtml += `
          <tr class="${completionClass}" data-tvdbid="${show.tvdbId}" data-title="${show.title}" data-seasons="${seasonCount}">
            <td class="show-title">${show.title}</td>
            <td>${show.year || 'Unknown'}</td>
            <td>${show.status || 'Unknown'}</td>
            <td>${seasonCount}</td>
            <td>${episodeCount}</td>
            <td class="title-cards-status">
              ${badgeHtml}
              ${markedSeasons > 0 ? `<div class="season-breakdown-tooltip">${seasonBreakdown}</div>` : ''}
            </td>
            <td>
              <button class="mark-titlecards-btn action-button small" data-tvdbid="${show.tvdbId}" data-title="${show.title}" data-seasons="${seasonCount}">
                <svg class="action-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 12l2 2 4-4"></path></svg>
                Mark Title Cards
              </button>
            </td>
          </tr>
        `;
      });
      
      showsHtml += `
          </tbody>
        </table>
      </div>`;
    }
      sonarrShowsContainer.innerHTML = showsHtml;
    if (sonarrViewMode === 'grid') {
      // Add click event listeners to shows in grid view (for selection)
      document.querySelectorAll('.sonarr-show-item').forEach(showEl => {
        showEl.addEventListener('click', (e) => {
          // Prevent click if Mark Title Cards button was clicked
          if (e.target.closest('.mark-titlecards-btn')) return;
          const tvdbId = showEl.dataset.tvdbid;
          const title = showEl.dataset.title;
          selectSonarrShow(tvdbId, title);
        });
      });
    } else {
      // Add click event listeners to table rows (for selection)
      document.querySelectorAll('.sonarr-shows-table tbody tr').forEach(row => {
        row.addEventListener('click', (e) => {
          // Prevent click if Mark Title Cards button or title card status cell was clicked
          if (e.target.closest('.mark-titlecards-btn') || e.target.closest('.title-cards-status')) return;
          const tvdbId = row.dataset.tvdbid;
          const title = row.dataset.title;
          selectSonarrShow(tvdbId, title);
        });
      });

      // Add event listeners for title card status cells in table view
      document.querySelectorAll('.title-cards-status .completion-badge:not(.none)').forEach(badge => {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          const row = badge.closest('tr');
          if (row) {
            const tvdbId = row.dataset.tvdbid;
            const title = row.dataset.title;
            const seasons = parseInt(row.dataset.seasons, 10) || 0;
            showTitleCardSeasonModal(tvdbId, title, seasons);
          }
        });
      });
      
      // Add event listeners for sortable table headers
      document.querySelectorAll('.sonarr-shows-table th.sortable').forEach(header => {
        header.addEventListener('click', () => {
          const columnIndex = parseInt(header.dataset.column, 10);
          const isAscending = !header.classList.contains('sort-asc');
          sortTableByColumn(columnIndex, isAscending);
        });
      });
    }

    // Add event listeners for Mark Title Cards buttons (both views)
    document.querySelectorAll('.mark-titlecards-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tvdbId = btn.dataset.tvdbid;
        const title = btn.dataset.title;
        const seasons = parseInt(btn.dataset.seasons, 10) || 0;
        showTitleCardSeasonModal(tvdbId, title, seasons);
      });
    });
    // --- Title Card Tracking Logic ---
  }

  // Get title card season data for a show from localStorage
  function getTitleCardSeasonsForShow(tvdbId) {
    const raw = localStorage.getItem('sonarrTitleCards_' + tvdbId);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  // Set title card season data for a show in localStorage
  function setTitleCardSeasonsForShow(tvdbId, data) {
    localStorage.setItem('sonarrTitleCards_' + tvdbId, JSON.stringify(data));
  }

  // Show modal to pick seasons with title cards
  function showTitleCardSeasonModal(tvdbId, title, seasonCount) {
    // Remove any existing modal
    document.getElementById('titlecard-season-modal')?.remove();

    // Get current data
    const current = getTitleCardSeasonsForShow(tvdbId);

    // Build modal HTML
    let modalHtml = `<div class="titlecard-season-modal" id="titlecard-season-modal">
      <div class="modal-content">
        <h3>Mark Title Cards for <span>${title}</span></h3>
        <form id="titlecard-season-form">
          <div class="season-checkbox-list">`;
    for (let s = 1; s <= seasonCount; s++) {
      modalHtml += `<label><input type="checkbox" name="season" value="${s}" ${current[s] ? 'checked' : ''}> Season ${s}</label>`;
    }
    modalHtml += `</div>
          <div class="modal-actions">
            <button type="submit" class="action-button small">Save</button>
            <button type="button" class="action-button small" id="close-titlecard-modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add event listeners
    document.getElementById('close-titlecard-modal').onclick = () => {
      document.getElementById('titlecard-season-modal')?.remove();
    };
    document.getElementById('titlecard-season-form').onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {};
      form.querySelectorAll('input[name="season"]').forEach(cb => {
        data[cb.value] = cb.checked;
      });
      setTitleCardSeasonsForShow(tvdbId, data);
      document.getElementById('titlecard-season-modal')?.remove();
      // Refresh show highlights
      loadSonarrShows();
    };
  }


  // Add styles for highlights and modal
  function addTitleCardStyles() {
    if (document.getElementById('titlecard-style')) return;
    const style = document.createElement('style');
    style.id = 'titlecard-style';
    style.textContent = `
      .sonarr-show-item.has-titlecards {
        border: 2px solid #4caf50;
        background: rgba(76,175,80,0.08);
      }      .mark-titlecards-btn {
        margin-top: 8px;
        margin-right: auto;
        margin-left: 0;
        width: calc(100% - 10px);
        background: linear-gradient(135deg, #00bfa5, #8e24aa);
        color: #ffffff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.95em;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 2px 6px rgba(0, 191, 165, 0.3);
      }
      .titlecard-season-modal {
        position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;
      }
      .titlecard-season-modal .modal-content {
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(15, 15, 15, 0.97));
        padding: 25px;
        border-radius: 12px;
        min-width: 320px;
        max-width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(0, 191, 165, 0.15);
        color: #ffffff;
      }
      .titlecard-season-modal h3 { margin-top: 0; font-size: 1.15em; }
      .season-checkbox-list { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
      .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px; }
    `;
    document.head.appendChild(style);
  }

  // Call style on dashboard load
  addTitleCardStyles();

  // --- Sonarr Helper Functions (moved inside IIFE) ---

  // Handle selecting a show from Sonarr
  async function selectSonarrShow(tvdbId, title) {
    console.log(`Selected show: ${title} (TVDB ID: ${tvdbId})`);
    
    // First, we need to get TMDB ID from TVDB ID
    try {
      // Find corresponding show in TMDB using the title and external IDs
      const tmdbResponse = await fetch(`https://api.themoviedb.org/3/find/${tvdbId}?api_key=${window.TMDB_API_KEY}&external_source=tvdb_id`);
      
      if (!tmdbResponse.ok) {
        throw new Error(`HTTP error ${tmdbResponse.status}`);
      }
      
      const tmdbData = await tmdbResponse.json();
      const tvResults = tmdbData.tv_results;
      
      if (tvResults && tvResults.length > 0) {
        // Found a matching show on TMDB
        const tmdbId = tvResults[0].id;
        console.log(`Found TMDB ID: ${tmdbId} for show: ${title}`);
        
        // Now load this show's details in the main app
        loadShowDetails(tmdbId, title);
      } else {
        // No match found in TMDB, fall back to search
        console.log(`No direct TMDB match for ${title}, trying search...`);
        searchTMDBByTitle(title);
      }
    } catch (error) {
      console.error(`Error finding TMDB ID for ${title}:`, error);
      // Fall back to search by title
      searchTMDBByTitle(title);
    }
  }
  
  // Helper function to search TMDB by title
  async function searchTMDBByTitle(title) {
    try {
      const query = encodeURIComponent(title);
      const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${window.TMDB_API_KEY}&query=${query}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const searchData = await response.json();
      
      if (searchData.results && searchData.results.length > 0) {
        // Use the first result (most relevant)
        const tmdbId = searchData.results[0].id;
        console.log(`Found TMDB ID via search: ${tmdbId} for show: ${title}`);
        
        // Load show details in the main app
        loadShowDetails(tmdbId, title);
      } else {
        console.error(`No search results found for title: ${title}`);
        // Show error message to the user
        alert(`Could not find "${title}" on TMDB. Please search for it manually.`);
      }
    } catch (error) {
      console.error(`Error searching TMDB for ${title}:`, error);
      alert(`Error searching for "${title}". Please try again later.`);
    }
  }
  
  // Function to load show details and transition to TMDB view
  function loadShowDetails(tmdbId, title) {
    // Hide the Sonarr dashboard when a show is selected
    hideSonarrDashboard();
    
    // Check if the main app has the required functions
    // This assumes these functions exist in the main Card Lab app.js
    if (typeof window.handleShowSelection === 'function') {
      // Call the main app's function to handle show selection
      window.handleShowSelection({
        id: tmdbId,
        name: title,
        source: 'sonarr' // Mark this as coming from Sonarr
      });
    } else {
      console.error("Required functions not found in main app. Make sure they're properly exposed.");
      alert("Unable to load show details. Please try searching manually.");
    }
  }
  // Check for title cards in the filesystem
  async function checkTitleCardsForShow(showTitle) {
    // This would need to be implemented in a different way since browser JS
    // cannot directly access the file system due to security restrictions.
    // You would need a backend service to scan folders and report back.
    
    // For now, we'll return a placeholder that indicates we don't know
    return {
      hasCards: null,
      count: null
    };
  }
  // Filter shows based on search term
  function filterShows(searchTerm) {
    if (!searchTerm) {
      // If search term is empty, show all items
      if (sonarrViewMode === 'grid') {
        document.querySelectorAll('.sonarr-show-item').forEach(item => {
          item.style.display = 'flex';
        });
      } else {
        document.querySelectorAll('.sonarr-shows-table tbody tr').forEach(row => {
          row.style.display = '';
        });
      }
      return;
    }
    
    // Convert search term to lowercase for case-insensitive matching
    searchTerm = searchTerm.toLowerCase();
    
    if (sonarrViewMode === 'grid') {
      // Filter grid view items
      document.querySelectorAll('.sonarr-show-item').forEach(item => {
        const title = item.dataset.title.toLowerCase();
        if (title.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    } else {
      // Filter table rows
      document.querySelectorAll('.sonarr-shows-table tbody tr').forEach(row => {
        const title = row.dataset.title.toLowerCase();
        if (title.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  }
  
  // Sort the table by column
  function sortTableByColumn(columnIndex, ascending = true) {
    const table = document.querySelector('.sonarr-shows-table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Add sort indicators to headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => header.classList.remove('sort-asc', 'sort-desc'));
    
    const header = headers[columnIndex];
    if (header) {
      header.classList.add(ascending ? 'sort-asc' : 'sort-desc');
    }
    
    // Sort function
    const sortFunction = (a, b) => {
      let aValue = a.cells[columnIndex].textContent.trim();
      let bValue = b.cells[columnIndex].textContent.trim();
      
      // For Title Cards column, extract the number values from parentheses if they exist
      if (columnIndex === 5) { // Title Cards column
        const aMatch = aValue.match(/\((\d+)\/(\d+)\)/);
        const bMatch = bValue.match(/\((\d+)\/(\d+)\)/);
        
        if (aMatch && bMatch) {
          // Compare by completion ratio
          const aRatio = parseInt(aMatch[1]) / parseInt(aMatch[2]);
          const bRatio = parseInt(bMatch[1]) / parseInt(bMatch[2]);
          return ascending ? aRatio - bRatio : bRatio - aRatio;
        } else if (aMatch) {
          return ascending ? 1 : -1;
        } else if (bMatch) {
          return ascending ? -1 : 1;
        }
        
        // If no numbers in parentheses, fall back to text comparison
        if (aValue.includes("None")) aValue = "0";
        if (aValue.includes("Partial")) aValue = "1";
        if (aValue.includes("Complete")) aValue = "2";
        if (bValue.includes("None")) bValue = "0";
        if (bValue.includes("Partial")) bValue = "1";
        if (bValue.includes("Complete")) bValue = "2";
      }
      
      // For numeric columns like Year, Seasons, Episodes (can be detected)
      if (!isNaN(parseInt(aValue)) && !isNaN(parseInt(bValue))) {
        return ascending 
          ? parseInt(aValue) - parseInt(bValue)
          : parseInt(bValue) - parseInt(aValue);
      }
      
      // For string columns
      return ascending 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    };
    
    // Sort rows and re-append to table
    rows.sort(sortFunction).forEach(row => tbody.appendChild(row));
  }
  // Add CSS styles for Sonarr dashboard
  function addSonarrDashboardStyles() {
    // Import external CSS file instead of inline styles
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'sonarr-dashboard.css';
    document.head.appendChild(linkEl);
  }

  // Initialize the dashboard when DOM is ready
  addSonarrDashboardStyles();

  // Execute init as an async function with proper error handling
  (async () => {
    try {
      await initSonarrDashboard();
      // Check if we have saved credentials and try to auto-connect
      if (sonarrConfig.url && sonarrConfig.apiKey) {
        try {
          const success = await testSonarrConnection();
          if (success) {
            // If connection is successful, hide the form
            hideConnectionForm();
            // Load shows but don't actually show the dashboard
            loadSonarrShows();
          }
        } catch (error) {
          console.error("Auto-connection failed:", error);
          // Keep showing the connection form if auto-connection fails
        }
      }
    } catch (error) {
      console.error("Error initializing Sonarr dashboard:", error);
    }
  })();

});
