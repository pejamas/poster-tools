const posterUpload = document.getElementById("poster-upload");
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

// Create loading overlay function
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

const pickrElement = document.getElementById("pickr");
const pickr = Pickr.create({
  el: pickrElement,
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

pickr.on("change", (color) => {
  const hex = color.toHEXA().toString();
  selectedLogoColor = hex;

  pickrElement.style.background = hex;

  if (networkLogoImage && baseImage) {
    drawCanvas();
  }
});

pickr.on("save", (color) => {
  const hex = color.toHEXA().toString();
  selectedLogoColor = hex;

  pickrElement.style.background = hex;

  if (networkLogoImage && baseImage) {
    drawCanvas();
  }

  pickr.hide();
});

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

  const reader = new FileReader();
  reader.onload = function (evt) {
    baseImage = new Image();
    baseImage.onload = () => {
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
});

const networkLogoSearch = document.getElementById("network-logo-search");
const networkLogoSuggestions = document.getElementById("network-logo-suggestions");
const networkLogoCheckbox = document.getElementById("network-logo-checkbox");

const logoNames = [
  "ABC TV",
  "ABC",
  "Adult Swim",
  "AMC",
  "AMC+",
  "Apple TV+",
  "BBC",
  "BET+",
  "BritBox",
  "CBS",
  "Channel 4",
  "Cinemax",
  "Comedy Central",
  "Crave",
  "Discovery",
  "discovery+",
  "Disney+",
  "Epix",
  "FOX",
  "Freevee",
  "Fuji TV",
  "FX",
  "FXX",
  "Hbo Max",
  "HBO",
  "History",
  "Hulu",
  "ITV",
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
  "Showcase",
  "Showtime",
  "Sky",
  "Spike",
  "Stan",
  "Starz",
  "Syfy",
  "TBS",
  "The CW",
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
  "CBC",
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

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  if (networkLogoImage) {
    const TARGET_WIDTH = 250;
    const TARGET_HEIGHT = 43;
    const MARGIN_LEFT = 54;
    const MARGIN_TOP = 55;
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

  if (overlaySelect.value !== "none") {
    overlayImage = new Image();
    overlayImage.onload = () => {
      ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
    };
    overlayImage.src = overlaySelect.value;
  }
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
  const modal = document.getElementById("poster-modal");
  const container = document.getElementById("poster-results");
  container.innerHTML = "";
  const usernameFilter = document.getElementById("mediux-username-filter").value.trim();

  if (usernameFilter) {
    modal.querySelector(".close-modal").textContent = `${posters.length} posters by "${usernameFilter}"`;
  } else {
    modal.querySelector(".close-modal").textContent = `Close (${posters.length} posters)`;
  }

  container.className = "poster-grid";
  posters.forEach((poster) => {
    const img = document.createElement("img");
    img.src = poster.dataUrl;
    img.alt = title || "Poster";

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
        tooltip.style.top = `${e.pageY - 28}px`;
      }
    });

    img.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("tooltip");
      if (tooltip) {
        tooltip.style.opacity = 0;
      }
    });

    img.addEventListener("click", () => {
      const imageDataUrl = poster.dataUrl;

      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        baseImage = image;

        if (overlaySelect.value !== "none") {
          overlayImage.src = overlaySelect.value;
        }

        drawCanvas();
        modal.style.display = "none";

        fetchTMDBMetadataForTitle(title, contentType);
      };

      image.src = imageDataUrl;
    });

    container.appendChild(img);
  });

  const gridWrapper = document.querySelector(".poster-grid-wrapper");
  if (gridWrapper) {
    gridWrapper.removeAttribute("style");
  }

  modal.style.display = "flex";

  enableHorizontalScrolling();
  enableTouchScrolling(); // Add touch support for mobile
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

function fetchAndDisplayPostersById(id, title, type = "movie") {
  const container = document.getElementById("poster-results");
  container.innerHTML = "";
  container.dataset.contentType = type;

  fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${TMDB_API_KEY}`)
    .then((res) => res.json())
    .then((images) => {
      const posters = images.posters.filter((p) => !p.iso_639_1 || p.iso_639_1 === "en").slice(0, 30);

      if (posters.length === 0) {
        container.innerHTML = '<p style="color:white;">No posters found.</p>';
        return;
      }

      posters.forEach((poster) => {
        const img = document.createElement("img");
        const posterUrl = `https://image.tmdb.org/t/p/w500${poster.file_path}`;

        // Use a proxy URL to avoid CORS issues
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(posterUrl)}`;

        img.src = posterUrl; // Keep the original URL for display
        img.alt = title;
        img.title = title;

        img.addEventListener("click", () => {
          // Show loading indicator
          const loadingIndicator = document.createElement("div");
          loadingIndicator.className = "loading-indicator";
          loadingIndicator.innerHTML = "<p>Loading poster...</p>";
          document.body.appendChild(loadingIndicator);

          // Try different methods to load the image
          const tempImage = new Image();
          tempImage.crossOrigin = "anonymous";

          tempImage.onload = () => {
            try {
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = tempImage.width;
              tempCanvas.height = tempImage.height;
              const tempCtx = tempCanvas.getContext("2d");
              tempCtx.drawImage(tempImage, 0, 0);

              // Convert canvas to data URL
              const dataUrl = tempCanvas.toDataURL("image/png");

              // Final image from data URL
              baseImage = new Image();
              baseImage.onload = () => {
                drawCanvas();
                fetchMetadataById(id, type);
                document.getElementById("poster-modal").style.display = "none";
                document.body.removeChild(loadingIndicator);
              };
              baseImage.src = dataUrl;
            } catch (e) {
              console.warn("Canvas toDataURL failed, trying fetch method:", e);

              // Try using fetch API as alternative
              fetch(proxyUrl)
                .then((response) => response.blob())
                .then((blob) => {
                  const objectUrl = URL.createObjectURL(blob);
                  baseImage = new Image();
                  baseImage.onload = () => {
                    drawCanvas();
                    fetchMetadataById(id, type);
                    document.getElementById("poster-modal").style.display = "none";
                    document.body.removeChild(loadingIndicator);
                  };
                  baseImage.src = objectUrl;
                })
                .catch((fetchError) => {
                  console.error("All image loading methods failed:", fetchError);
                  document.body.removeChild(loadingIndicator);

                  // Try a final fallback without CORS
                  baseImage = tempImage;
                  drawCanvas();
                  fetchMetadataById(id, type);
                  document.getElementById("poster-modal").style.display = "none";
                });
            }
          };

          tempImage.onerror = () => {
            console.warn("Direct image load failed, trying fetch API with proxy");

            // Try using fetch API with proxy
            fetch(proxyUrl)
              .then((response) => response.blob())
              .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                baseImage = new Image();
                baseImage.onload = () => {
                  drawCanvas();
                  fetchMetadataById(id, type);
                  document.getElementById("poster-modal").style.display = "none";
                  document.body.removeChild(loadingIndicator);
                };
                baseImage.src = objectUrl;
              })
              .catch((fetchError) => {
                console.error("Fetch method also failed:", fetchError);
                document.body.removeChild(loadingIndicator);

                // Just try direct load as last resort without proxy or CORS
                baseImage = new Image();
                baseImage.onload = () => {
                  drawCanvas();
                  fetchMetadataById(id, type);
                  document.getElementById("poster-modal").style.display = "none";
                };
                baseImage.src = posterUrl;
              });
          };

          // Start loading with proxy URL
          tempImage.src = proxyUrl;
        });

        container.appendChild(img);
      });

      container.scrollLeft = 0;
      document.getElementById("poster-modal").style.display = "flex";
      enableHorizontalScrolling();
    })
    .catch((err) => {
      container.innerHTML = '<p style="color:white;">Error loading posters.</p>';
      console.error(err);
    });
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
}

function displayTVShowMetadata(details) {
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

  if (details.networks && details.networks.length > 0) {
    const networkName = details.networks[0].name.toLowerCase();
    let exactMatch = availableLogos.find((logo) => logo.name.toLowerCase() === networkName);

    if (exactMatch) {
      networkLogoSearch.value = exactMatch.name;
      updateNetworkLogo(exactMatch.path);
      networkLogoCheckbox.checked = true;
    } else {
      const specialCases = {
        hbo: "HBO",
        "hbo max": "Hbo Max",
        fx: "FX",
        fxx: "FXX",
      };

      if (specialCases[networkName]) {
        const specialMatch = availableLogos.find((logo) => logo.name === specialCases[networkName]);

        if (specialMatch) {
          networkLogoSearch.value = specialMatch.name;
          updateNetworkLogo(specialMatch.path);
          networkLogoCheckbox.checked = true;
        }
      } else {
        for (const logo of availableLogos) {
          const logoName = logo.name.toLowerCase();

          const networkRegex = new RegExp(`\\b${networkName}\\b`);
          const logoRegex = new RegExp(`\\b${logoName}\\b`);

          if (networkRegex.test(logoName) || logoRegex.test(networkName)) {
            networkLogoSearch.value = logo.name;
            updateNetworkLogo(logo.path);
            networkLogoCheckbox.checked = true;
            break;
          }
        }
      }
    }
  }
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
  if (titleElement && titleElement.textContent && titleElement.textContent !== "Title") {
    filename = titleElement.textContent.replace(/[/\\?%*:|"<>]/g, "-").trim() + ".png";
  }

  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  posterUpload.value = "";
  baseImage = null;
  metaPanel.style.display = "none";
  document.getElementById("tmdb-search-input").value = "";
  document.getElementById("tmdb-suggestions").innerHTML = "";
  document.getElementById("mediux-search-input").value = "";
  document.getElementById("mediux-suggestions").innerHTML = "";
  document.getElementById("poster-modal").style.display = "none";
  document.getElementById("poster-results").innerHTML = "";
  document.getElementById("mediux-username-filter").value = "";
  networkLogoSearch.value = "";
  networkLogoCheckbox.checked = false;
  pickr.setColor("#ffffff");
  selectedLogoColor = "#ffffff";
  networkLogoImage = null;
  overlaySelect.value = "none";
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

// Fix poster modal on mobile
function showPosterModal(message) {
  const modal = document.getElementById("poster-modal");
  const container = document.getElementById("poster-results");
  container.innerHTML = `<p style="color:white; padding: 1rem; text-align:center; width:100%;">${message}</p>`;
  modal.style.display = "flex";

  enableHorizontalScrolling();

  // Ensure close button works on mobile
  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    closeButton.onclick = () => {
      modal.style.display = "none";
    };
  }

  // Allow closing by clicking outside on mobile
  if (window.innerWidth <= 900) {
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    };
  }
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

    // Mobile media type buttons
    const mobileMediaTypeButtons = document.querySelectorAll(".mobile-tab-content .media-type-btn");
    if (mobileMediaTypeButtons) {
      mobileMediaTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Update mobile UI
          mobileMediaTypeButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // Apply gradient styling
          if (button.dataset.type === "movie") {
            button.style.background = "linear-gradient(to right, #00bfa5, #8e24aa)";
            mobileMediaTypeButtons[1].style.background = "transparent";
          } else {
            button.style.background = "linear-gradient(to right, #00bfa5, #8e24aa)";
            mobileMediaTypeButtons[0].style.background = "transparent";
          }

          // Sync to desktop
          const type = button.dataset.type;
          document.querySelector(`.sidebar .media-type-btn[data-type="${type}"]`).click();
        });
      });
    }

    // Initialize Pickr for mobile
    if (typeof Pickr !== "undefined" && document.getElementById("mobile-pickr")) {
      const mobilePicker = Pickr.create({
        el: document.getElementById("mobile-pickr"),
        theme: "monolith",
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
  if (!e.target.closest(".tmdb-search")) {
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