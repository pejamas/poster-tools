(function initializeStyles() {
  const exportWrapper = document.getElementById("export-wrapper");
  if (exportWrapper) {
    // Set default gradient colors
    const bgStart = "#2c3e50";
    const bgEnd = "#6a11cb";

    document.documentElement.style.setProperty("--bg-start", bgStart);
    document.documentElement.style.setProperty("--bg-end", bgEnd);

    exportWrapper.style.setProperty("--bg-start", bgStart);
    exportWrapper.style.setProperty("--bg-end", bgEnd);
    exportWrapper.style.background = `linear-gradient(135deg, ${bgStart}, ${bgEnd})`;
    exportWrapper.style.backgroundImage = `linear-gradient(135deg, ${bgStart}, ${bgEnd})`;
  }
})();

const apiState = {
  connected: false,
  url: "",
  key: "",
  showId: "",
  showSets: null,
  selectedSetId: null,
};

function updateApiStatus(message, isConnected) {
  const statusElement = document.getElementById("api-status");
  statusElement.textContent = message;

  if (isConnected) {
    statusElement.className = "status-connected";
  } else {
    statusElement.className = "status-disconnected";
  }
}

function populateSetSelector(showSets) {
  const selectorElement = document.getElementById("set-selector");
  selectorElement.innerHTML = "";

  console.log(`Found ${showSets.length} total sets`);

  showSets.forEach((set, index) => {
    // Log each set's content to help diagnose issues
    const posterCount = (set.showPoster?.length || 0) + (set.seasonPosters?.length || 0);
    const titlecardCount = set.titlecards?.length || 0;

    console.log(`Set ${index + 1}: "${set.set_title || "Unnamed"}" (ID: ${set.id})`);
    console.log(` - Posters: ${posterCount}, Titlecards: ${titlecardCount}`);

    // Create the set item in the UI
    const setItem = document.createElement("div");
    setItem.className = "set-item";
    setItem.dataset.setId = set.id;

    const createdDate = new Date(set.date_created);
    const formattedDate = createdDate.toLocaleDateString();

    setItem.innerHTML = `

<div class="set-title">${set.set_title || "Untitled Set"}</div>
<div class="set-details">
Created by: ${set.user_created?.username || "Unknown"}<br>
Created: ${formattedDate}<br>
Assets: ${posterCount} posters, ${titlecardCount} titlecards
</div>
`;

    // Add click event to load this set
    setItem.addEventListener("click", () => loadShowSet(set));

    selectorElement.appendChild(setItem);
  });
}

function sortPostersAndTitlecards() {
  const posterGrid = document.getElementById("poster-grid");
  const posters = Array.from(posterGrid.querySelectorAll(".poster-wrapper"));
  posters.sort((a, b) => a.querySelector("img").src.localeCompare(b.querySelector("img").src));
  posters.forEach((p) => posterGrid.appendChild(p));

  const titlecardGrid = document.getElementById("titlecard-grid");
  const wrappers = Array.from(titlecardGrid.querySelectorAll(".titlecard-wrapper"));
  wrappers.sort((a, b) => {
    const seasonA = parseInt(a.dataset.season || "0");
    const seasonB = parseInt(b.dataset.season || "0");
    const epA = parseInt(a.dataset.episode || "0");
    const epB = parseInt(b.dataset.episode || "0");
    return seasonA - seasonB || epA - epB;
  });

  const headers = Array.from(titlecardGrid.querySelectorAll(".season-header"));
  titlecardGrid.innerHTML = "";
  headers.forEach((header) => {
    titlecardGrid.appendChild(header);
    const seasonNumber = parseInt(header.textContent.match(/\d+/)?.[0] || "0");
    const matching = wrappers.filter((w) => parseInt(w.dataset.season) === seasonNumber);
    matching.forEach((el) => titlecardGrid.appendChild(el));
  });
}

async function loadShowSet(set) {
  // Show loading overlay
  const loadingOverlay = document.getElementById("loading-overlay");
  const progressBar = document.getElementById("loading-progress-bar");
  const loadingDetails = document.getElementById("loading-details");

  loadingOverlay.style.display = "flex";
  progressBar.style.width = "0%";
  loadingDetails.textContent = "Starting download...";

  document.getElementById("api-loading").style.display = "block";
  updateApiStatus("Loading assets...", true);

  try {
    apiState.selectedSetId = set.id;

    const posterGrid = document.getElementById("poster-grid");
    const titlecardGrid = document.getElementById("titlecard-grid");
    posterGrid.innerHTML = "";
    titlecardGrid.innerHTML = "";

    // Set title & creator
    if (set.set_title) {
      document.getElementById("set-id").value = set.set_title;
      document.getElementById("set-id-line").textContent = set.set_title;
    }

    if (set.user_created?.username) {
      document.getElementById("creator-name").value = set.user_created.username;
      document.getElementById("credit-text").textContent = set.user_created.username;
    }

    // Create arrays to hold all assets before adding to DOM
    const allPosters = [];

    // Calculate total assets for progress tracking
    const totalShowPosters = set.showPoster?.length || 0;
    const totalSeasonPosters = set.seasonPosters?.length || 0;
    const totalTitlecards = set.titlecards?.length || 0;
    const totalAssets = totalShowPosters + totalSeasonPosters + totalTitlecards;
    let assetsLoaded = 0;

    // Update progress function
    const updateProgress = (assetType) => {
      assetsLoaded++;
      const percentage = Math.floor((assetsLoaded / totalAssets) * 100);
      progressBar.style.width = `${percentage}%`;
      loadingDetails.textContent = `Loading ${assetType}... (${assetsLoaded}/${totalAssets})`;
    };

    // Load posters (show-level + season-level)
    if (set.showPoster?.length) {
      loadingDetails.textContent = "Loading show posters...";
      for (const poster of set.showPoster) {
        try {
          const dataUrl = await fetchAssetAsDataUrl(poster.id);
          allPosters.push({
            dataUrl,
            id: poster.id,
            type: "show",
            seasonNumber: -1, // Main show posters come first
          });
          updateProgress("show posters");
        } catch (error) {
          console.error(`Failed to load show poster ${poster.id}:`, error);
          updateProgress("show posters");
        }
      }
    }

    if (set.seasonPosters?.length) {
      loadingDetails.textContent = "Loading season posters...";
      for (const poster of set.seasonPosters) {
        try {
          const dataUrl = await fetchAssetAsDataUrl(poster.id);
          // Handle special case for "specials" or Season 0
          const seasonNum = poster.season?.season_number;
          let seasonNumber = -10; // Default for unknown

          if (seasonNum !== undefined && seasonNum !== null) {
            // Convert to number and handle special cases
            seasonNumber = Number(seasonNum);
            // Special handling for "specials" (Season 0)
            if (seasonNumber === 0) {
              seasonNumber = -0.5; // Place specials after main posters but before other seasons
            }
          }

          allPosters.push({
            dataUrl,
            id: poster.id,
            type: "season",
            seasonNumber: seasonNumber,
          });
          updateProgress("season posters");
        } catch (error) {
          console.error(`Failed to load season poster ${poster.id}:`, error);
          updateProgress("season posters");
        }
      }
    }

    // Sort posters: main show posters first, then specials, then seasons in numerical order
    allPosters.sort((a, b) => {
      // First by type (show posters come before season posters)
      if (a.type !== b.type) {
        return a.type === "show" ? -1 : 1;
      }

      // Then by season number
      return a.seasonNumber - b.seasonNumber;
    });

    // Add sorted posters to the grid
    for (const poster of allPosters) {
      addImageToGrid(poster.dataUrl, "poster");
    }

    // Handle titlecards
    loadingDetails.textContent = "Loading titlecards...";
    if (set.titlecards?.length) {
      // Group by season
      const titlecardsBySeason = {};

      for (const titlecard of set.titlecards) {
        const season = titlecard.episode?.season_id?.season_number || 0;
        const episode = titlecard.episode?.episode_number || 0;

        if (!titlecardsBySeason[season]) {
          titlecardsBySeason[season] = [];
        }

        try {
          const dataUrl = await fetchAssetAsDataUrl(titlecard.id);
          titlecardsBySeason[season].push({
            dataUrl,
            id: titlecard.id,
            season: season,
            episode: episode,
          });
          updateProgress("titlecards");
        } catch (error) {
          console.error(`Failed to load titlecard ${titlecard.id}:`, error);
          updateProgress("titlecards");
        }
      }

      // Sort seasons numerically
      const sortedSeasons = Object.keys(titlecardsBySeason)
        .map(Number)
        .sort((a, b) => a - b);

      // Process each season
      for (const season of sortedSeasons) {
        // Add season header
        const header = document.createElement("div");
        header.className = "season-header";
        header.textContent = `Season ${String(season).padStart(2, "0")}`;
        titlecardGrid.appendChild(header);

        // Sort titlecards by episode number
        const seasonTitlecards = titlecardsBySeason[season];
        seasonTitlecards.sort((a, b) => a.episode - b.episode);

        // Add sorted titlecards to the season
        for (const tc of seasonTitlecards) {
          addTitlecardToGrid(tc.dataUrl, tc.season, tc.episode);
        }
      }
    }

    // Finalize with a complete status
    loadingDetails.textContent = "All assets loaded successfully!";
    progressBar.style.width = "100%";

    // Finally rebuild the grid structure
    rebuildGrids();

    updateApiStatus("Assets loaded successfully", true);

    // Hide loading overlay after a short delay to show completion
    setTimeout(() => {
      loadingOverlay.style.display = "none";
    }, 1000);
  } catch (error) {
    console.error("Error loading show set:", error);
    loadingDetails.textContent = `Error: ${error.message}`;
    updateApiStatus("Failed to load assets: " + error.message, false);

    // Hide loading overlay on error after delay
    setTimeout(() => {
      loadingOverlay.style.display = "none";
    }, 2000);
  } finally {
    document.getElementById("api-loading").style.display = "none";
  }
}

// Helper function to fetch an asset and convert to data URL
async function fetchAssetAsDataUrl(fileId) {
  if (!apiState.connected) {
    throw new Error("API not connected");
  }

  try {
    // Call your worker with the asset ID
    const workerUrl = "https://api-frontend.pejamas.workers.dev"; // No trailing slash

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: `/assets/${fileId}`,
        body: {}, // Empty body for asset requests
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText} (${response.status})`);
    }

    // Convert response to blob and then to data URL
    const blob = await response.blob();
    return await blobToDataURL(blob);
  } catch (error) {
    console.error(`Error loading file ${fileId}:`, error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded - attaching API button handler");

  const connectButton = document.getElementById("connect-api-btn");
  if (connectButton) {
    connectButton.addEventListener("click", function () {
      console.log("Connect button clicked!");
      connectAndFetchSets();
    });
  } else {
    console.error("Connect API button not found in DOM");
  }

  // Set API URL (fixed for now)
  apiState.url = atob("aHR0cHM6Ly9zdGFnZWQubWVkaXV4Lmlv");

  updateApiStatus("Not Connected", false);
});

async function connectAndFetchSets() {
  // Reference DOM elements safely
  const showIdInput = document.getElementById("show-id");
  const apiLoadingEl = document.getElementById("api-loading");
  const apiStatusEl = document.getElementById("api-status");

  if (!showIdInput) {
    console.error("show-id input element not found");
    return;
  }

  const showId = showIdInput.value.trim();

  if (apiLoadingEl) {
    apiLoadingEl.style.display = "block";
  }

  updateApiStatus("Connecting...", false);

  if (!showId) {
    updateApiStatus("Please enter a Show ID", false);
    if (apiLoadingEl) apiLoadingEl.style.display = "none";
    return;
  }

  try {
    // The GraphQL query remains the same
    const query = `

query {
shows_by_id(id: "${showId}") {
id
title

# Get all sets without any filtering
show_sets {
id
set_title
user_created {
  username
}
date_created
date_updated
description

# Get posters and titlecards separately
showPoster: files(
  filter: { 
    _and: [ 
      { file_type: { _eq: "poster" } }, 
      { show: { id: { _neq: null } } } 
    ] 
  }
) {
  id
  modified_on
}

seasonPosters: files(
  filter: { 
    _and: [ 
      { file_type: { _eq: "poster" } }, 
      { season: { id: { _neq: null } } } 
    ] 
  }
) {
  id
  modified_on
  season { 
    season_number 
  }
}

titlecards: files(
  filter: { 
    _and: [ 
      { file_type: { _eq: "titlecard" } }, 
      { episode: { id: { _neq: null } } } 
    ] 
  }
) {
  id
  modified_on
  episode {
    episode_number
    season_id { 
      season_number 
    }
  }
}
}
}
}
`;

    console.log("Connecting to API via worker...");

    // Call your worker with the GraphQL query
    const workerUrl = "https://api-frontend.pejamas.workers.dev";

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: "/graphql",
        body: {
          query,
        },
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Process the response
    const data = await response.json();

    if (!data?.data?.shows_by_id) {
      throw new Error("Invalid API response or show not found");
    }

    const showData = data.data.shows_by_id;

    // Store data in apiState
    apiState.connected = true;
    apiState.url = atob("aHR0cHM6Ly9zdGFnZWQubWVkaXV4Lmlv");
    apiState.showId = showId;
    apiState.showSets = showData.show_sets;

    // Update UI
    updateApiStatus(`Connected: ${showData.title} (${showData.show_sets.length} sets)`, true);

    const setSelectorEl = document.getElementById("set-selector");
    if (setSelectorEl) {
      populateSetSelector(showData.show_sets);
      setSelectorEl.style.display = "block";
    }
  } catch (err) {
    console.error("API Connection Error:", err);
    updateApiStatus("Connection failed: " + err.message, false);
  } finally {
    if (apiLoadingEl) {
      apiLoadingEl.style.display = "none";
    }
  }
}

// Fixed loadFileFromAPI function with correct URL construction
async function loadFileFromAPI(fileId, fileType, metadata = {}) {
  if (!apiState.connected || !apiState.url || !apiState.key) {
    throw new Error("API not connected");
  }

  try {
    // Construct file URL - this needs the asset ID only
    const fileUrl = `${apiState.url}/assets/${fileId}`;

    // Use the correct proxy URL format
    const corsProxyUrl = "https://poster-proxy.pejamas.workers.dev/?url=";
    const fullUrl = corsProxyUrl + fileUrl; // Don't append /graphql here

    console.log(`Fetching ${fileType} (ID: ${fileId}) from: ${fullUrl}`);

    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${apiState.key}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText} (${response.status})`);
    }

    // Convert response to blob and then to data URL
    const blob = await response.blob();
    const dataUrl = await blobToDataURL(blob);

    // Add file to the appropriate grid
    if (fileType === "poster") {
      addImageToGrid(dataUrl, "poster");
    } else if (fileType === "titlecard") {
      addTitlecardToGrid(dataUrl, metadata.season, metadata.episode);
    }

    return true;
  } catch (error) {
    console.error(`Error loading file ${fileId}:`, error);
    throw error;
  }
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function addImageToGrid(src, className) {
  const wrapper = createImageElement(src, className);
  document.getElementById(`${className}-grid`).appendChild(wrapper);
}

function addTitlecardToGrid(src, season, episode) {
  const wrapper = document.createElement("div");
  wrapper.className = "titlecard-wrapper";
  wrapper.dataset.season = season;
  wrapper.dataset.episode = episode;

  const img = document.createElement("img");
  img.src = src;
  img.className = "titlecard";
  img.draggable = true;

  const btn = document.createElement("button");
  btn.className = "delete-btn";
  btn.textContent = "×";
  btn.onclick = () => {
    wrapper.remove();
    rebuildGrids();
  };

  wrapper.appendChild(img);
  wrapper.appendChild(btn);

  img.addEventListener("dragstart", () => (wrapper.dataset.dragging = true));
  img.addEventListener("dragend", () => delete wrapper.dataset.dragging);
  wrapper.addEventListener("dragover", (e) => e.preventDefault());
  wrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragging = document.querySelector("[data-dragging]");
    if (dragging && dragging !== wrapper) {
      wrapper.parentNode.insertBefore(dragging.closest(".titlecard-wrapper"), wrapper);
      rebuildGrids();
    }
  });

  document.getElementById("titlecard-grid").appendChild(wrapper);
}

document.getElementById("creator-icon-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const icon = document.getElementById("creator-icon");
      icon.src = evt.target.result;
      icon.alt = ""; // No alt text
      icon.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("creator-name").addEventListener("input", (e) => {
  document.getElementById("credit-text").textContent = e.target.value;
});

document.getElementById("show-posters-header").addEventListener("change", (e) => {
  document.getElementById("posters-header").style.display = e.target.checked ? "block" : "none";
});

document.getElementById("show-titlecards-header").addEventListener("change", (e) => {
  document.getElementById("titlecards-header").style.display = e.target.checked ? "block" : "none";
});

document.getElementById("logo-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = document.getElementById("logo-preview");
    img.src = evt.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
});

document.getElementById("use-backdrop-toggle").addEventListener("change", (e) => {
  toggleBackgroundType(e.target.checked);
});

document.getElementById("file-input").addEventListener("change", async (e) => {
  await handleFiles(e.target.files, "poster");
});

document.getElementById("titlecard-input").addEventListener("change", async (e) => {
  await handleFiles(e.target.files, "titlecard");
});

function updateGradientBackground() {
  const exportWrapper = document.getElementById("export-wrapper");
  // Get colors from CSS variables instead of non-existent input elements
  const bgStart = getComputedStyle(document.documentElement).getPropertyValue("--bg-start") || "#2c3e50";
  const bgEnd = getComputedStyle(document.documentElement).getPropertyValue("--bg-end") || "#6a11cb";

  console.log("Updating gradient with colors:", bgStart, bgEnd);

  exportWrapper.style.setProperty("--bg-start", bgStart);
  exportWrapper.style.setProperty("--bg-end", bgEnd);

  if (!document.getElementById("use-backdrop-toggle").checked || !window._currentBackdropURL) {
    exportWrapper.style.removeProperty("background");
    exportWrapper.style.removeProperty("backgroundImage");
    exportWrapper.style.backgroundColor = "transparent";

    void exportWrapper.offsetWidth;

    const gradientStyle = `linear-gradient(135deg, ${bgStart}, ${bgEnd})`;
    exportWrapper.style.background = gradientStyle;
    exportWrapper.style.backgroundImage = gradientStyle;

    const bgContainer = document.getElementById("export-bg-container");
    if (bgContainer) {
      bgContainer.style.background = gradientStyle;
    }
  }
}

function toggleBackgroundType(useBackdrop) {
  const exportWrapper = document.getElementById("export-wrapper");
  const bgImage = document.getElementById("export-background-image");
  const bgContainer = document.getElementById("export-bg-container");

  console.log("Toggle background:", useBackdrop ? "Using backdrop" : "Using gradient");
  console.log("Has backdrop URL:", !!window._currentBackdropURL);

  if (bgImage) {
    bgImage.style.display = useBackdrop && window._currentBackdropURL ? "block" : "none";
  }

  // Reset all background properties first
  exportWrapper.style.removeProperty("background");
  exportWrapper.style.backgroundColor = "transparent";
  exportWrapper.style.backgroundImage = "none";

  // Force a reflow to prevent rendering issues
  void exportWrapper.offsetWidth;

  // Only apply backdrop if toggle is on AND we actually have a backdrop URL
  if (useBackdrop && window._currentBackdropURL) {
    console.log("Applying backdrop URL:", window._currentBackdropURL.substring(0, 50) + "...");
    exportWrapper.style.backgroundImage = `url(${window._currentBackdropURL})`;
    exportWrapper.style.backgroundSize = "cover";
    exportWrapper.style.backgroundPosition = "center";
    exportWrapper.style.borderRadius = "12px";
    exportWrapper.style.overflow = "hidden";

    if (bgContainer) {
      bgContainer.style.background = "none";
    }
  } else {
    // If no backdrop or toggle is off, fall back to gradient
    updateGradientBackground();

    // Make sure the toggle reflects the actual state
    document.getElementById("use-backdrop-toggle").checked = useBackdrop && window._currentBackdropURL;
  }
}

const posterGrid = document.getElementById("poster-grid");
const titlecardGrid = document.getElementById("titlecard-grid");
const columnsSelect = document.getElementById("columns-select");
const titlecardColumnsSelect = document.getElementById("titlecard-columns-select");
const bgImage = document.getElementById("export-background-image");
let originalBgDataURL = null;
let blurredBackdropDataURL = null;
let backdropCanvas = document.createElement("canvas");
let backdropCtx = backdropCanvas.getContext("2d");

function groupIntoRows(items, perRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    const row = document.createElement("div");
    row.className = "row";
    row.append(...items.slice(i, i + perRow));
    rows.push(row);
  }
  return rows;
}

function renderGrid(container, items, perRow) {
  container.innerHTML = "";
  groupIntoRows(items, perRow).forEach((row) => container.appendChild(row));
}

function collectItems(gridClass) {
  return [...document.querySelectorAll(`.${gridClass}`)].map((el) => el.closest(`.${gridClass}-wrapper`));
}

function groupItemsWithHeaders(container, perRow) {
  const elements = Array.from(container.querySelectorAll(".season-header, .titlecard-wrapper"));
  container.innerHTML = "";

  let currentRow = null,
    count = 0;

  elements.forEach((el, index) => {
    if (el.classList.contains("season-header")) {
      if (currentRow && currentRow.children.length > 0) {
        container.appendChild(currentRow);
        currentRow = null;
        count = 0;
      }

      if (index !== 0) {
        const divider = document.createElement("hr");
        divider.style.cssText = "width: 100%; border-color: rgba(255,255,255,0.2); margin: 10px 0;";
        container.appendChild(divider);
      }

      container.appendChild(el);
    } else {
      if (!currentRow || count >= perRow) {
        if (currentRow) container.appendChild(currentRow);
        currentRow = document.createElement("div");
        currentRow.className = "row";
        count = 0;
      }
      currentRow.appendChild(el);
      count++;
    }
  });

  if (currentRow && currentRow.children.length > 0) {
    container.appendChild(currentRow);
  }
}

function rebuildGrids() {
  const posterItems = collectItems("poster");
  renderGrid(posterGrid, posterItems, parseInt(columnsSelect.value));

  const albumArtItems = collectItems("album-art");
  const albumArtGrid = document.getElementById("album-art-grid");
  const albumArtColumnsSelect = document.getElementById("album-art-columns-select");
  renderGrid(albumArtGrid, albumArtItems, parseInt(albumArtColumnsSelect.value));

  groupItemsWithHeaders(titlecardGrid, parseInt(titlecardColumnsSelect.value));
}

function createImageElement(src, className) {
  const wrapper = document.createElement("div");
  wrapper.className = `${className}-wrapper`;
  const img = document.createElement("img");
  img.src = src;
  img.className = className;
  img.draggable = true;

  const btn = document.createElement("button");
  btn.className = "delete-btn";
  btn.textContent = "×";
  btn.onclick = () => {
    wrapper.remove();
    rebuildGrids();
  };

  wrapper.appendChild(img);
  wrapper.appendChild(btn);
  img.addEventListener("dragstart", () => (wrapper.dataset.dragging = true));
  img.addEventListener("dragend", () => delete wrapper.dataset.dragging);
  wrapper.addEventListener("dragover", (e) => e.preventDefault());
  wrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    const dragging = document.querySelector("[data-dragging]");
    if (dragging && dragging !== wrapper) {
      wrapper.parentNode.insertBefore(dragging.closest(`.${className}-wrapper`), wrapper);
      rebuildGrids();
    }
  });

  return wrapper;
}

async function handleFiles(files, className) {
  const fileArray = [...files];

  if (className === "poster") {
    fileArray.sort((a, b) => {
      const normalize = (name) =>
        name
          .toLowerCase()
          .replace(/\.[^/.]+$/, "")
          .trim();
      const getSortKey = (filename) => {
        const name = normalize(filename.name);
        const seasonMatch = name.match(/ - season (\d{1,3})$/i);
        const baseName = name.replace(/ - season \d{1,3}$/i, "");
        const seasonNumber = seasonMatch ? parseInt(seasonMatch[1], 10) : -1;
        return {
          baseName,
          seasonNumber,
        };
      };
      const aKey = getSortKey(a);
      const bKey = getSortKey(b);
      if (aKey.baseName !== bKey.baseName) {
        return aKey.baseName.localeCompare(bKey.baseName);
      }
      return aKey.seasonNumber - bKey.seasonNumber;
    });

    const container = document.querySelector(`#${className}-grid`);
    const existingPosters = Array.from(container.querySelectorAll(".poster-wrapper")).map(
      (wrapper) => wrapper.querySelector("img").src
    );

    const newPosterSrcs = await Promise.all(
      fileArray.map(async (file) => {
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      })
    );

    const allPosterSrcs = [...existingPosters, ...newPosterSrcs];

    container.innerHTML = "";

    const wrappers = allPosterSrcs.map((src) => {
      const wrapper = document.createElement("div");
      wrapper.className = `${className}-wrapper`;

      const img = document.createElement("img");
      img.src = src;
      img.className = className;
      img.draggable = true;

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.textContent = "×";
      btn.onclick = () => {
        wrapper.remove();
        rebuildGrids();
      };

      wrapper.appendChild(img);
      wrapper.appendChild(btn);

      img.addEventListener("dragstart", () => (wrapper.dataset.dragging = true));
      img.addEventListener("dragend", () => delete wrapper.dataset.dragging);
      wrapper.addEventListener("dragover", (e) => e.preventDefault());
      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector("[data-dragging]");
        if (dragging && dragging !== wrapper) {
          wrapper.parentNode.insertBefore(dragging.closest(`.${className}-wrapper`), wrapper);
          rebuildGrids();
        }
      });

      return wrapper;
    });

    wrappers.forEach((wrapper) => container.appendChild(wrapper));
    rebuildGrids();
  } else if (className === "titlecard") {
    const parseInfo = (name) => {
      const cleaned = name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .trim();
      const match = cleaned.match(/s(\d{1,2})[\s\.]?e(\d{1,2})/i);
      const season = match ? parseInt(match[1], 10) : 0;
      const episode = match ? parseInt(match[2], 10) : 0;
      return {
        name,
        season,
        episode,
      };
    };

    const container = document.querySelector(`#${className}-grid`);

    const existingWrappers = Array.from(container.querySelectorAll(".titlecard-wrapper"));
    const existingCards = existingWrappers.map((wrapper) => ({
      src: wrapper.querySelector("img").src,
      season: parseInt(wrapper.dataset.season || "0"),
      episode: parseInt(wrapper.dataset.episode || "0"),
    }));

    const newCards = await Promise.all(
      fileArray.map(async (file) => {
        const src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        const { season, episode } = parseInfo(file.name);
        return {
          src,
          season,
          episode,
        };
      })
    );

    const allCards = [...existingCards, ...newCards].sort((a, b) => a.season - b.season || a.episode - b.episode);

    container.innerHTML = "";

    let currentSeason = null;

    allCards.forEach((card) => {
      if (card.season !== currentSeason) {
        currentSeason = card.season;
        const heading = document.createElement("div");
        heading.className = "season-header";
        heading.textContent = `Season ${String(card.season).padStart(2, "0")}`;
        container.appendChild(heading);
      }

      const wrapper = document.createElement("div");
      wrapper.className = "titlecard-wrapper";
      wrapper.dataset.season = card.season;
      wrapper.dataset.episode = card.episode;

      const img = document.createElement("img");
      img.src = card.src;
      img.className = "titlecard";
      img.draggable = true;

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.textContent = "×";
      btn.onclick = () => {
        wrapper.remove();
        rebuildGrids();
      };

      wrapper.appendChild(img);
      wrapper.appendChild(btn);

      img.addEventListener("dragstart", () => (wrapper.dataset.dragging = true));
      img.addEventListener("dragend", () => delete wrapper.dataset.dragging);
      wrapper.addEventListener("dragover", (e) => e.preventDefault());
      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector("[data-dragging]");
        if (dragging && dragging !== wrapper) {
          wrapper.parentNode.insertBefore(dragging.closest(".titlecard-wrapper"), wrapper);
          rebuildGrids();
        }
      });

      container.appendChild(wrapper);
    });

    groupItemsWithHeaders(container, parseInt(titlecardColumnsSelect.value));
  }
}

document.getElementById("backdrop-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const dataURL = evt.target.result;

    try {
      const originalImg = new Image();
      originalImg.src = dataURL;

      await new Promise((resolve) => {
        originalImg.onload = resolve;
      });

      window._originalBackdropImage = originalImg;

      const blurAmount = parseInt(document.getElementById("blur-amount").value);

      document.getElementById("use-backdrop-toggle").checked = true;

      applySmartBlur(originalImg, blurAmount);

      toggleBackgroundType(true);
    } catch (error) {
      console.error("Error in backdrop processing:", error);
      alert("There was an error processing your image. Please try another one.");
    }
  };

  reader.readAsDataURL(file);
  e.target.value = "";
});

document.getElementById("blur-amount").addEventListener("input", async (e) => {
  if (!window._originalBackdropImage) return;

  const blurAmount = parseInt(e.target.value);
  applySmartBlur(window._originalBackdropImage, blurAmount);
});

document.getElementById("logo-scale").addEventListener("input", (e) => {
  document.getElementById("logo-preview").style.transform = `scale(${e.target.value})`;
});

document.getElementById("columns-select").addEventListener("change", rebuildGrids);
document.getElementById("album-art-columns-select").addEventListener("change", rebuildGrids);
document.getElementById("titlecard-columns-select").addEventListener("change", rebuildGrids);

document.getElementById("set-id").addEventListener("input", (e) => {
  document.getElementById("set-id-line").textContent = e.target.value || "";
});

// Removed old event listeners for bg-start and bg-end inputs as they no longer exist

function applySmartBlur(originalImg, blurAmount) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const scaleFactor = Math.max(0.1, 1 - blurAmount * 0.03);
  canvas.width = Math.floor(originalImg.width * scaleFactor);
  canvas.height = Math.floor(originalImg.height * scaleFactor);

  ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height);

  if (blurAmount > 5) {
    const blurPx = Math.min(20, blurAmount - 5);
    ctx.filter = `blur(${blurPx}px)`;
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";
  }

  const padding = 50;
  const finalCanvas = document.createElement("canvas");
  const finalCtx = finalCanvas.getContext("2d");

  const maxDimension = Math.max(originalImg.width, originalImg.height);
  const targetSize = Math.min(1920, maxDimension);
  let finalWidth, finalHeight;
  if (originalImg.width > originalImg.height) {
    finalWidth = targetSize + padding * 2;
    finalHeight = (originalImg.height / originalImg.width) * targetSize + padding * 2;
  } else {
    finalHeight = targetSize + padding * 2;
    finalWidth = (originalImg.width / originalImg.height) * targetSize + padding * 2;
  }

  finalCanvas.width = finalWidth;
  finalCanvas.height = finalHeight;

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = "high";

  finalCtx.drawImage(canvas, -padding, -padding, finalWidth + padding * 2, finalHeight + padding * 2);

  finalCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
  finalCtx.fillRect(0, 0, finalWidth, finalHeight);

  const blurredDataURL = finalCanvas.toDataURL("image/jpeg", 0.92);
  blurredBackdropDataURL = blurredDataURL;
  window._currentBackdropURL = blurredDataURL;

  const bgImage = document.getElementById("export-background-image");
  if (bgImage) {
    bgImage.src = blurredDataURL;
    bgImage.style.display = "block";
  }

  const useBackdrop = document.getElementById("use-backdrop-toggle").checked;
  if (useBackdrop) {
    const exportWrapper = document.getElementById("export-wrapper");
    exportWrapper.style.removeProperty("background");
    exportWrapper.style.backgroundColor = "transparent";
    exportWrapper.style.backgroundImage = "none";

    void exportWrapper.offsetWidth;

    exportWrapper.style.backgroundImage = `url('${blurredDataURL}')`;
    exportWrapper.style.backgroundSize = "cover";
    exportWrapper.style.backgroundPosition = "center";
    exportWrapper.style.borderRadius = "12px";
    exportWrapper.style.overflow = "hidden";
  }
}

document.getElementById("resetBtn").addEventListener("click", () => {
  const overlay = document.getElementById("custom-confirm-overlay");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  overlay.style.display = "flex";

  confirmYes.onclick = () => {
    // Don't clear localStorage! We want to keep saved config

    // Clear form fields directly
    document.getElementById("creator-name").value = "";
    document.getElementById("credit-text").textContent = "";
    document.getElementById("set-id").value = "";
    document.getElementById("set-id-line").textContent = "";

    // Clear creator icon
    const creatorIcon = document.getElementById("creator-icon");
    creatorIcon.src = "";
    creatorIcon.style.display = "none";

    // Clear logo preview
    const logoPreview = document.getElementById("logo-preview");
    logoPreview.src = "";
    logoPreview.style.display = "none";

    // Clear posters and titlecards
    document.getElementById("poster-grid").innerHTML = "";
    document.getElementById("album-art-grid").innerHTML = "";
    document.getElementById("titlecard-grid").innerHTML = "";

    // Reset other form elements
    document.getElementById("columns-select").value = "4";
    document.getElementById("titlecard-columns-select").value = "5";
    document.getElementById("show-posters-header").checked = true;
    document.getElementById("show-titlecards-header").checked = true;
    document.getElementById("posters-header").style.display = "block";
    document.getElementById("titlecards-header").style.display = "block";

    // Reset backdrop
    document.getElementById("use-backdrop-toggle").checked = false;
    window._currentBackdropURL = null;
    document.getElementById("export-background-image").style.display = "none";

    // Reset gradients using Pickr instances - use proper Pickr methods
    const defaultStartColor = "#2c3e50";
    const defaultEndColor = "#6a11cb";

    bgStartPickr.setColor(defaultStartColor);
    bgEndPickr.setColor(defaultEndColor);

    document.documentElement.style.setProperty("--bg-start", defaultStartColor);
    document.documentElement.style.setProperty("--bg-end", defaultEndColor);
    updateGradientBackground();

    // Close the dialog
    overlay.style.display = "none";
  };

  confirmNo.onclick = () => (overlay.style.display = "none");
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const wrapper = document.getElementById("export-wrapper");
  const borderRadius = 24;
  const useBackdrop = document.getElementById("use-backdrop-toggle").checked;
  const hasBlurredBackdrop = window._currentBackdropURL && useBackdrop ? true : false;
  const originalBg = originalBgDataURL;
  const clone = wrapper.cloneNode(true);
  clone.querySelectorAll(".delete-btn").forEach((btn) => btn.remove());

  clone.style.borderRadius = `${borderRadius}px`;
  clone.style.overflow = "hidden";

  clone.style.background = "none";
  clone.style.backgroundColor = "transparent";
  clone.style.backgroundImage = "none";

  const cloneExportWrapper = clone.querySelector("#export-wrapper");
  if (cloneExportWrapper) {
    cloneExportWrapper.style.borderRadius = `${borderRadius}px`;
    cloneExportWrapper.style.overflow = "hidden";
    cloneExportWrapper.style.background = "none";
    cloneExportWrapper.style.backgroundColor = "transparent";
    cloneExportWrapper.style.backgroundImage = "none";
  }

  const bgContainerClone = clone.querySelector("#export-bg-container");
  if (bgContainerClone) bgContainerClone.remove();

  const backdropContainerClone = clone.querySelector("#backdrop-container");
  if (backdropContainerClone) backdropContainerClone.remove();

  const showPostersHeader = document.getElementById("show-posters-header").checked;
  const showTitlecardsHeader = document.getElementById("show-titlecards-header").checked;

  const postersHeaderClone = clone.querySelector("#posters-header");
  const titlecardsHeaderClone = clone.querySelector("#titlecards-header");

  if (postersHeaderClone) {
    postersHeaderClone.style.display = showPostersHeader ? "block" : "none";
  }

  if (titlecardsHeaderClone) {
    titlecardsHeaderClone.style.display = showTitlecardsHeader ? "block" : "none";
  }

  const titlecardGridClone = clone.querySelector("#titlecard-grid");
  if (!titlecardGridClone || titlecardGridClone.children.length === 0) {
    if (titlecardsHeaderClone) titlecardsHeaderClone.remove();
    const wrapper = clone.querySelector("#titlecard-grid-wrapper");
    if (wrapper) wrapper.remove();
  }

  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);

  await new Promise(requestAnimationFrame);
  const contentCanvas = await html2canvas(clone, {
    scale: 2,
    backgroundColor: null,
    logging: false,
    onclone: (document) => {
      const exportWrapper = document.getElementById("export-wrapper");
      if (exportWrapper) {
        exportWrapper.style.background = "none";
        exportWrapper.style.backgroundColor = "transparent";
        exportWrapper.style.backgroundImage = "none";
      }
    },
  });

  document.body.removeChild(clone);

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = contentCanvas.width;
  finalCanvas.height = contentCanvas.height;
  const ctx = finalCanvas.getContext("2d");

  const scaledRadius = borderRadius * 2;
  ctx.beginPath();
  ctx.moveTo(scaledRadius, 0);
  ctx.lineTo(finalCanvas.width - scaledRadius, 0);
  ctx.quadraticCurveTo(finalCanvas.width, 0, finalCanvas.width, scaledRadius);
  ctx.lineTo(finalCanvas.width, finalCanvas.height - scaledRadius);
  ctx.quadraticCurveTo(finalCanvas.width, finalCanvas.height, finalCanvas.width - scaledRadius, finalCanvas.height);
  ctx.lineTo(scaledRadius, finalCanvas.height);
  ctx.quadraticCurveTo(0, finalCanvas.height, 0, finalCanvas.height - scaledRadius);
  ctx.lineTo(0, scaledRadius);
  ctx.quadraticCurveTo(0, 0, scaledRadius, 0);
  ctx.closePath();
  ctx.clip();

  if (hasBlurredBackdrop) {
    const bgImg = new Image();
    await new Promise((resolve, reject) => {
      bgImg.onload = resolve;
      bgImg.onerror = reject;
      bgImg.src = window._currentBackdropURL;
    });

    ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  } else if (originalBg) {
    const bgImg = new Image();
    await new Promise((resolve, reject) => {
      bgImg.onload = resolve;
      bgImg.onerror = reject;
      bgImg.src = originalBg;
    });

    ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, finalCanvas.width, finalCanvas.height);
    // Get colors directly from CSS variables for consistency
    const startColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-start").trim() || "#2c3e50";
    const endColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-end").trim() || "#6a11cb";
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  }

  ctx.drawImage(contentCanvas, 0, 0);

  const link = document.createElement("a");
  link.download = "poster-wall.png";
  link.href = finalCanvas.toDataURL("image/png");
  link.click();
});
document.addEventListener("DOMContentLoaded", () => {
  const toggleApi = document.getElementById("toggle-api");
  const apiSection = document.getElementById("api-section");
  if (toggleApi && apiSection) {
    toggleApi.addEventListener("change", () => {
      apiSection.style.display = toggleApi.checked ? "block" : "none";
    });
    apiSection.style.display = toggleApi.checked ? "block" : "none";
  }
});
document.getElementById("saveConfigBtn").addEventListener("click", () => {
  // Create detailed save selection popup
  const overlay = document.getElementById("save-confirm-overlay");
  const confirmContent = document.getElementById("save-confirm-content") || document.createElement("div");
  
  if (!document.getElementById("save-confirm-content")) {
    confirmContent.id = "save-confirm-content";
    const modalContent = overlay.querySelector(".custom-modal") || overlay;
    modalContent.appendChild(confirmContent);
  }
  
  // Get current values to show in the selection dialog
  const currentValues = {
    creatorName: document.getElementById("creator-name").value || "(empty)",
    hasCreatorIcon: !!document.getElementById("creator-icon").src && 
                  document.getElementById("creator-icon").src !== window.location.href && 
                  document.getElementById("creator-icon").style.display !== "none",
    showPostersHeader: document.getElementById("show-posters-header").checked,
    showAlbumArtHeader: document.getElementById("show-album-art-header").checked,
    showTitlecardsHeader: document.getElementById("show-titlecards-header").checked,
    columns: document.getElementById("columns-select").value,
    titlecardColumns: document.getElementById("titlecard-columns-select").value,
    albumArtColumns: document.getElementById("album-art-columns-select").value
  };
  
  // Build selection interface with simplified options
  let settingsSelectionHTML = `
    <h4>Select settings to save:</h4>
    <div class="settings-selection">
      <div class="settings-group">
        <h5>User Information</h5>
        <label class="checkbox-container">
          <input type="checkbox" id="save-creator-name" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Creator Name</div>
            <div class="setting-status">${currentValues.creatorName}</div>
          </div>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" id="save-creator-icon" ${currentValues.hasCreatorIcon ? 'checked' : ''}>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Creator Icon</div>
            <div class="setting-status">${currentValues.hasCreatorIcon ? 'Present' : 'Not set'}</div>
          </div>
        </label>
      </div>

      <div class="settings-group">
        <h5>Section Headers</h5>
        <label class="checkbox-container">
          <input type="checkbox" id="save-posters-header" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Posters Header</div>
            <div class="setting-status">${currentValues.showPostersHeader ? 'Shown' : 'Hidden'}</div>
          </div>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" id="save-album-art-header" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Album Art Header</div>
            <div class="setting-status">${currentValues.showAlbumArtHeader ? 'Shown' : 'Hidden'}</div>
          </div>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" id="save-titlecards-header" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Titlecards Header</div>
            <div class="setting-status">${currentValues.showTitlecardsHeader ? 'Shown' : 'Hidden'}</div>
          </div>
        </label>
      </div>

      <div class="settings-group">
        <h5>Grid Columns</h5>
        <label class="checkbox-container">
          <input type="checkbox" id="save-posters-columns" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Posters Columns</div>
            <div class="setting-status">${currentValues.columns}</div>
          </div>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" id="save-album-art-columns" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Album Art Columns</div>
            <div class="setting-status">${currentValues.albumArtColumns}</div>
          </div>
        </label>
        <label class="checkbox-container">
          <input type="checkbox" id="save-titlecards-columns" checked>
          <span class="checkmark"></span>
          <div class="setting-label">
            <div class="setting-name">Titlecards Columns</div>
            <div class="setting-status">${currentValues.titlecardColumns}</div>
          </div>
        </label>
      </div>
    </div>

    <div class="save-selection-actions">
      <button id="save-select-all" class="mini-btn">Select All</button>
      <button id="save-deselect-all" class="mini-btn">Deselect All</button>
    </div>
  `;
  
  confirmContent.innerHTML = settingsSelectionHTML;
  
  // Change title to make it clear this is for selection
  const titleElement = overlay.querySelector("h3");
  if (titleElement) {
    titleElement.textContent = "Save Configuration";
  }
  
  // Change Save button text and make it use the gradient style
  const saveButton = document.getElementById("saveConfirmOk");
  if (saveButton) {
    saveButton.textContent = "Save Selected";
    saveButton.style.background = "linear-gradient(135deg, #00bfa5, #8e24aa)";
    saveButton.style.boxShadow = "0 4px 12px rgba(0, 191, 165, 0.3)";
  }
  
  // Add event listeners for the select/deselect all buttons
  setTimeout(() => {
    const selectAllBtn = document.getElementById("save-select-all");
    const deselectAllBtn = document.getElementById("save-deselect-all");
    
    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll('.settings-selection input[type="checkbox"]').forEach(cb => {
          cb.checked = true;
        });
      });
    }
    
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", () => {
        document.querySelectorAll('.settings-selection input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });
      });
    }
    
    // Show the overlay
    overlay.style.display = "flex";
  }, 0);

  // Save button handler
  document.getElementById("saveConfirmOk").onclick = () => {
    const config = {};
    
    // Only save selected settings
    if (document.getElementById("save-creator-name").checked) {
      config.creatorName = document.getElementById("creator-name").value;
    }
    
    // Save creator icon if selected and available
    if (document.getElementById("save-creator-icon").checked) {
      const creatorIcon = document.getElementById("creator-icon");
      if (
        creatorIcon &&
        creatorIcon.src &&
        creatorIcon.src !== window.location.href &&
        creatorIcon.style.display !== "none"
      ) {
        config.creatorIconData = creatorIcon.src;
      }
    }

    // Save individual section header settings
    if (document.getElementById("save-posters-header").checked) {
      config.showPostersHeader = document.getElementById("show-posters-header").checked;
    }
    
    if (document.getElementById("save-album-art-header").checked) {
      config.showAlbumArtHeader = document.getElementById("show-album-art-header").checked;
    }
    
    if (document.getElementById("save-titlecards-header").checked) {
      config.showTitlecardsHeader = document.getElementById("show-titlecards-header").checked;
    }
    
    // Save individual grid column settings
    if (document.getElementById("save-posters-columns").checked) {
      config.columns = document.getElementById("columns-select").value;
    }
    
    if (document.getElementById("save-album-art-columns").checked) {
      config.albumArtColumns = document.getElementById("album-art-columns-select").value;
    }
    
    if (document.getElementById("save-titlecards-columns").checked) {
      config.titlecardColumns = document.getElementById("titlecard-columns-select").value;
    }

    // Save the config
    localStorage.setItem("posterToolsConfig", JSON.stringify(config));
    
    // Show saved confirmation
    confirmContent.innerHTML = `
      <div style="text-align: center; padding: 1rem;">
        <p style="font-size: 1.2rem; margin: 0.5rem 0;">Settings saved successfully!</p>
        <p style="color: #00bfa5; font-size: 0.9rem; margin: 0;">Your configuration has been saved.</p>
      </div>
    `;
    
    // Reset the button text and style
    if (saveButton) {
      saveButton.textContent = "OK";
      saveButton.style.background = "#0ac2b8";
      saveButton.style.boxShadow = "none";
    }
    
    // Reset the title
    if (titleElement) {
      titleElement.textContent = "Settings Saved";
    }
    
    // Auto-close after a delay
    setTimeout(() => {
      overlay.style.display = "none";
    }, 2000);
  };
});

function resetCreatorFields() {
  const savedConfig = JSON.parse(localStorage.getItem("posterToolsConfig") || "{}");
  const creatorIcon = document.getElementById("creator-icon");
  const creatorNameInput = document.getElementById("creator-name");
  const creditText = document.getElementById("credit-text");

  // Only show icon if it exists in saved config
  if (savedConfig.creatorIconData) {
    creatorIcon.src = savedConfig.creatorIconData;
    creatorIcon.style.display = "inline-block";
  } else {
    creatorIcon.style.display = "none";
    creatorIcon.src = "";
  }

  // Set creator name in both input field and display area
  if (savedConfig.creatorName) {
    creatorNameInput.value = savedConfig.creatorName;
    creditText.textContent = savedConfig.creatorName;
  } else {
    creatorNameInput.value = "";
    creditText.textContent = "";
  }

  // Set footer label if available
  if (savedConfig.setId) {
    document.getElementById("set-id").value = savedConfig.setId;
    document.getElementById("set-id-line").textContent = savedConfig.setId;
  }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", resetCreatorFields);

document.getElementById("loadConfigBtn").addEventListener("click", () => {
  const config = JSON.parse(localStorage.getItem("posterToolsConfig") || "{}");

  // Check if config is empty (no saved configuration)
  if (Object.keys(config).length === 0) {
    alert("No saved configuration found.");
    return;
  }

  // Update creator name ALWAYS when available in config, ensuring it appears in both places
  const creatorNameInput = document.getElementById("creator-name");
  const creditText = document.getElementById("credit-text");

  if (config.creatorName) {
    creatorNameInput.value = config.creatorName;
    creditText.textContent = config.creatorName;
  } else {
    creatorNameInput.value = "";
    creditText.textContent = "";
  }

  // Fix: Update creator icon properly
  const creatorIcon = document.getElementById("creator-icon");
  if (config.creatorIconData) {
    creatorIcon.src = config.creatorIconData;
    creatorIcon.alt = ""; // No alt text to avoid showing text when image fails
    creatorIcon.style.display = "inline-block";
  } else {
    creatorIcon.src = "";
    creatorIcon.alt = ""; // No alt text
    creatorIcon.style.display = "none";
  }

  // Set ID
  if (config.setId) {
    document.getElementById("set-id").value = config.setId;
    document.getElementById("set-id-line").textContent = config.setId;
  } else {
    document.getElementById("set-id").value = "";
    document.getElementById("set-id-line").textContent = "";
  }

  // Show/hide Posters header
  const showPostersHeader = typeof config.showPostersHeader === "boolean" ? config.showPostersHeader : true;
  document.getElementById("show-posters-header").checked = showPostersHeader;
  document.getElementById("posters-header").style.display = showPostersHeader ? "block" : "none";

  // Show/hide Album Art header
  const showAlbumArtHeader = typeof config.showAlbumArtHeader === "boolean" ? config.showAlbumArtHeader : true;
  document.getElementById("show-album-art-header").checked = showAlbumArtHeader;
  document.getElementById("album-art-header").style.display = showAlbumArtHeader ? "block" : "none";
  document.getElementById("album-art-grid-wrapper").style.display = showAlbumArtHeader ? "flex" : "none";

  // Show/hide Titlecards header
  const showTitlecardsHeader = typeof config.showTitlecardsHeader === "boolean" ? config.showTitlecardsHeader : true;
  document.getElementById("show-titlecards-header").checked = showTitlecardsHeader;
  document.getElementById("titlecards-header").style.display = showTitlecardsHeader ? "block" : "none";

  // Rebuild layout if needed
  rebuildGrids();

  // Update gradient colors if they exist in config
  if (config.bgStart) {
    bgStartPickr.setColor(config.bgStart);
    document.getElementById("bg-start-pickr").style.background = config.bgStart;
    document.documentElement.style.setProperty("--bg-start", config.bgStart);
  }

  if (config.bgEnd) {
    bgEndPickr.setColor(config.bgEnd);
    document.getElementById("bg-end-pickr").style.background = config.bgEnd;
    document.documentElement.style.setProperty("--bg-end", config.bgEnd);
  }

  updateGradientBackground();

  // Show custom load confirmation popup instead of alert
  const overlay = document.getElementById("load-confirm-overlay");
  overlay.style.display = "flex";

  document.getElementById("loadConfirmOk").onclick = () => {
    overlay.style.display = "none";
  };
});
document.getElementById("show-album-art-header").addEventListener("change", (e) => {
  document.getElementById("album-art-header").style.display = e.target.checked ? "block" : "none";
  document.getElementById("album-art-grid-wrapper").style.display = e.target.checked ? "flex" : "none";
});

document.getElementById("album-art-upload").addEventListener("change", async (e) => {
  const files = e.target.files;
  const container = document.getElementById("album-art-grid");

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const wrapper = document.createElement("div");
      wrapper.className = "album-art-wrapper";

      const img = document.createElement("img");
      img.src = event.target.result;
      img.className = "album-art";
      img.draggable = true;

      const btn = document.createElement("button");
      btn.className = "delete-btn";
      btn.textContent = "×";
      btn.onclick = () => {
        wrapper.remove();
        rebuildGrids();
      };

      wrapper.appendChild(img);
      wrapper.appendChild(btn);

      img.addEventListener("dragstart", () => (wrapper.dataset.dragging = true));
      img.addEventListener("dragend", () => delete wrapper.dataset.dragging);
      wrapper.addEventListener("dragover", (e) => e.preventDefault());
      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = document.querySelector("[data-dragging]");
        if (dragging && dragging !== wrapper) {
          wrapper.parentNode.insertBefore(dragging, wrapper);
          rebuildGrids();
        }
      });

      container.appendChild(wrapper);
      rebuildGrids();
    };
    reader.readAsDataURL(file);
  }
});

// Initialize the Pickr color pickers
const bgStartPickr = Pickr.create({
  el: document.getElementById("bg-start-pickr"),
  theme: "monolith",
  position: "right-middle",
  padding: 180,
  default: "#2c3e50",
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

const bgEndPickr = Pickr.create({
  el: document.getElementById("bg-end-pickr"),
  theme: "monolith",
  position: "right-middle",
  padding: 60,
  default: "#6a11cb",
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

// Add event listeners for color changes
bgStartPickr.on("change", (color) => {
  const hex = color.toHEXA().toString();
  document.documentElement.style.setProperty("--bg-start", hex);
  updateGradientBackground();
});

bgStartPickr.on("save", (color) => {
  const hex = color.toHEXA().toString();
  document.documentElement.style.setProperty("--bg-start", hex);
  updateGradientBackground();
  bgStartPickr.hide();
});

bgEndPickr.on("change", (color) => {
  const hex = color.toHEXA().toString();
  document.documentElement.style.setProperty("--bg-end", hex);
  updateGradientBackground();
});

bgEndPickr.on("save", (color) => {
  const hex = color.toHEXA().toString();
  document.documentElement.style.setProperty("--bg-end", hex);
  updateGradientBackground();
  bgEndPickr.hide();
});

// Initialize collapsible sections
document.addEventListener("DOMContentLoaded", function () {
  // Initialize collapsible sections
  const collapsibles = document.querySelectorAll(".collapsible-header");
  collapsibles.forEach((header) => {
    header.addEventListener("click", function () {
      const parent = this.parentElement;
      parent.classList.toggle("active");
    });
  });
});
