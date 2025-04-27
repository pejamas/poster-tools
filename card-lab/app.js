document.addEventListener('DOMContentLoaded', () => {
    // --- TMDB API Configuration ---
    const TMDB_API_KEY = '96c821c9e98fab6a43bff8021d508d1d'; 
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p/';

    // Font preloading to ensure they're available before canvas rendering
    function preloadFonts() {
        // Get all font options from the dropdown
        const fontOptions = Array.from(document.getElementById('font-family').options);
        
        // Create a div to preload fonts (will be invisible)
        const preloadDiv = document.createElement('div');
        preloadDiv.style.opacity = '0';
        preloadDiv.style.position = 'absolute';
        preloadDiv.style.pointerEvents = 'none';
        document.body.appendChild(preloadDiv);
        
        // Create elements with each font to force loading
        fontOptions.forEach(option => {
            const fontName = option.value;
            const el = document.createElement('span');
            el.style.fontFamily = `"${fontName}", sans-serif`;
            el.textContent = 'preload'; 
            preloadDiv.appendChild(el);
        });
        
        // Clean up after a delay (fonts should be loaded by then)
        setTimeout(() => document.body.removeChild(preloadDiv), 2000);
    }
    
    // Call preload function
    preloadFonts();
    
    // --- TITLE CARD MAKER LOGIC ---
    const canvas = document.getElementById('titlecard-canvas');
    const gridCanvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    const gridCtx = gridCanvas.getContext('2d');
    
    // Input element references - moved to the top to avoid reference errors
    const titleInput = document.getElementById('title-text');
    const seasonNumberInput = document.getElementById('season-number');
    const episodeNumberInput = document.getElementById('episode-number');
    const separatorType = document.getElementById('separator-type');
    
    // Style controls
    const presetSelect = document.getElementById('preset-select');
    const fontFamily = document.getElementById('font-family');
    const textColor = document.getElementById('text-color');
    const infoColor = document.getElementById('info-color');
    const textSize = document.getElementById('text-size');
    const textBold = document.getElementById('text-bold');
    const textShadowColor = document.getElementById('text-shadow-color');
    const textShadowBlur = document.getElementById('text-shadow-blur');
    const textOutlineColor = document.getElementById('text-outline-color');
    const textOutlineWidth = document.getElementById('text-outline-width');
    const titleInfoSpacing = document.getElementById('title-info-spacing');
    
    // Show thumbnail
    const thumbnailInput = document.getElementById('thumbnail-upload');
    const thumbnailOpacity = document.getElementById('thumbnail-opacity');
    const thumbnailScale = document.getElementById('thumbnail-scale');
    const thumbnailFullsize = document.getElementById('thumbnail-fullsize');
    
    // Visual effects
    const effectType = document.getElementById('effect-type');
    const gradientOpacity = document.getElementById('gradient-opacity');
    const gradientColor = document.getElementById('gradient-color');
    const blendMode = document.getElementById('blend-mode');
    
    // UI Controls
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const loadConfigBtn = document.getElementById('loadConfigBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const returnToGridBtn = document.getElementById('returnToGridBtn');
    
    // State for storing search results and season data
    let currentShowData = null;
    let currentSeasonData = [];
    let currentSeasonNumber = 1;
    let episodeTitleCards = [];
    let selectedCardIndex = -1;
    let isTMDBMode = false; // Flag to track if we're using TMDB search or manual mode
    let thumbnailImg = null;
    let hasSearchResults = false; // New flag to track if search results are available
    
    // Variables for grid layout
    let gridCardWidth = 240;
    let gridCardHeight = 135;
    let gridGap = 10;
    let gridColumns = 4;

    // --- TMDB Search Functions ---
    async function searchShow(query) {
        try {
            const response = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.results;
        } catch (err) {
            console.error('Error searching for show:', err);
            return [];
        }
    }

    async function getShowDetails(showId) {
        try {
            const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}?api_key=${TMDB_API_KEY}`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching show details:', err);
            return null;
        }
    }

    async function getSeasonDetails(showId, seasonNumber) {
        try {
            const response = await fetch(`${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching season details:', err);
            return null;
        }
    }

    // Function to get all images for a specific episode
    async function getEpisodeImages(showId, seasonNumber, episodeNumber) {
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${TMDB_API_KEY}`
            );
            const data = await response.json();
            return data.stills || [];
        } catch (err) {
            console.error('Error fetching episode images:', err);
            return [];
        }
    }

    async function getEpisodeThumbnail(path) {
        if (!path) return null;
        
        try {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // Enable cross-origin loading
            
            return new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = `${TMDB_IMG_BASE_URL}original${path}`;
            });
        } catch (err) {
            console.error('Error loading episode thumbnail:', err);
            return null;
        }
    }

    // Get the search form element and add event listener
    const searchForm = document.getElementById('show-search-form');
    const searchInput = document.getElementById('show-search-input');

    // Check if elements exist before adding event listeners
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query.length < 2) return;
            
            // Display loading state
            document.getElementById('search-results').innerHTML = '<div class="loading">Searching...</div>';
            
            try {
                const results = await searchShow(query);
                displaySearchResults(results);
                
                // Set flag for search results
                hasSearchResults = (results && results.length > 0);
                
                // Always hide the return to grid button initially after a new search
                returnToGridBtn.style.display = 'none';
            } catch (err) {
                console.error('Search error:', err);
                document.getElementById('search-results').innerHTML = '<div class="error">Search failed. Please try again.</div>';
                hasSearchResults = false;
            }
        });
    } else {
        console.error('Search form element not found! Check the HTML structure.');
    }

    // Function to display search results
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No shows found</div>';
            return;
        }
        
        results.forEach(show => {
            const showEl = document.createElement('div');
            showEl.className = 'search-result';
            
            let posterUrl = show.poster_path 
                ? `${TMDB_IMG_BASE_URL}w92${show.poster_path}` 
                : '../assets/mediux.svg';
            
            showEl.innerHTML = `
                <img src="${posterUrl}" alt="${show.name}" class="show-poster">
                <div class="show-info">
                    <h4>${show.name}</h4>
                    <span class="year">${show.first_air_date ? show.first_air_date.substring(0, 4) : 'Unknown'}</span>
                </div>
            `;
            
            showEl.addEventListener('click', async () => {
                // Show loading state
                document.getElementById('season-selector').innerHTML = '<div class="loading">Loading show details...</div>';
                
                // Fetch and display show details
                await selectShow(show.id);
                
                // Hide search results
                resultsContainer.innerHTML = '';
                searchInput.value = show.name;
            });
            
            resultsContainer.appendChild(showEl);
        });
    }
    
    // Function to select a show and load its details
    async function selectShow(showId) {
        const showDetails = await getShowDetails(showId);
        if (!showDetails) return;
        
        currentShowData = showDetails;
        isTMDBMode = true; // Set TMDB mode active
        hasSearchResults = true; // We now have search results
        
        // Display season selector
        displaySeasonSelector(showDetails);
        
        // Select first season by default
        await selectSeason(1);
        
        // Make sure we switch to grid view
        showGridView();
    }
    
    // Function to display season selector
    function displaySeasonSelector(show) {
        const seasonSelector = document.getElementById('season-selector');
        seasonSelector.innerHTML = '';
        
        if (show.seasons.length === 0) {
            seasonSelector.innerHTML = '<div class="no-results">No seasons found</div>';
            return;
        }
        
        // Create season dropdown
        const selectEl = document.createElement('select');
        selectEl.id = 'season-select';
        
        // Filter out specials (season 0) unless it's the only season
        const seasons = show.seasons.filter(s => s.season_number > 0 || show.seasons.length === 1);
        
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_number;
            option.textContent = `Season ${season.season_number} (${season.episode_count} episodes)`;
            selectEl.appendChild(option);
        });
        
        // Add change event listener
        selectEl.addEventListener('change', () => {
            const selectedSeason = parseInt(selectEl.value);
            selectSeason(selectedSeason);
        });
        
        seasonSelector.appendChild(selectEl);
    }
    
    // Function to select and load a season
    async function selectSeason(seasonNumber) {
        currentSeasonNumber = seasonNumber;
        
        // Display loading message on grid canvas
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        gridCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
        gridCtx.font = '24px Gabarito, sans-serif';
        gridCtx.fillStyle = '#ffffff';
        gridCtx.textAlign = 'center';
        gridCtx.fillText('Loading season details...', gridCanvas.width / 2, gridCanvas.height / 2);
        
        // Fetch season details
        const seasonData = await getSeasonDetails(currentShowData.id, seasonNumber);
        if (!seasonData) return;
        
        currentSeasonData = seasonData.episodes;
        
        // Process episodes and create title cards
        await createEpisodeTitleCards(seasonData.episodes);
        
        // In TMDB mode, always show grid view
        if (isTMDBMode) {
            renderEpisodeGrid();
            showGridView();
        } else {
            // In manual mode (if TMDB wasn't used), show single card
            selectEpisode(0);
            showSingleCardView();
        }
    }
    
    // Function to create title cards for all episodes
    async function createEpisodeTitleCards(episodes) {
        episodeTitleCards = [];
        
        for (const episode of episodes) {
            // Create a title card configuration object
            const card = {
                title: episode.name,
                seasonNumber: String(episode.season_number).padStart(2, '0'),
                episodeNumber: String(episode.episode_number).padStart(2, '0'),
                thumbnailImg: null,
                canvasData: null,  // Will store the image data once rendered
                allImages: [],     // Will store all available images
                allImagePaths: []  // Will store all image paths for reference
            };
            
            // Try to load thumbnail image
            if (episode.still_path) {
                try {
                    card.thumbnailImg = await getEpisodeThumbnail(episode.still_path);
                    card.allImagePaths.push(episode.still_path); // Store the default image path
                    
                    // Get all additional images for this episode
                    if (currentShowData && currentShowData.id) {
                        const additionalImages = await getEpisodeImages(
                            currentShowData.id, 
                            episode.season_number, 
                            episode.episode_number
                        );
                        
                        // Store additional image paths (excluding the default one)
                        for (const img of additionalImages) {
                            if (img.file_path && img.file_path !== episode.still_path) {
                                card.allImagePaths.push(img.file_path);
                            }
                        }
                        
                        // Load additional images if there are any (limit to 5 total for performance)
                        const imagesToLoad = card.allImagePaths.slice(0, 5);
                        for (let i = 0; i < imagesToLoad.length; i++) {
                            if (i === 0) { // First image already loaded as thumbnailImg
                                card.allImages.push(card.thumbnailImg);
                            } else {
                                try {
                                    const img = await getEpisodeThumbnail(imagesToLoad[i]);
                                    card.allImages.push(img);
                                } catch (err) {
                                    console.log(`Could not load additional image ${i} for episode ${episode.episode_number}`);
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.log(`Could not load thumbnail for episode ${episode.episode_number}`);
                }
            }
            
            episodeTitleCards.push(card);
        }
    }
    
    // Function to render all episodes to a single grid canvas
    function renderEpisodeGrid() {
        if (episodeTitleCards.length === 0) return;
        
        // Set fixed values for larger cards that better fill the screen
        const maxColumns = 4;
        
        // Get the available width for the grid (accounting for sidebar)
        const availableWidth = Math.min(window.innerWidth - 360, 2000); 
        
        // Calculate the optimal card width based on available screen width
        // Make cards fill at least 90% of the available width
        let cardWidth = Math.floor((availableWidth * 0.9) / maxColumns) - 10;
        cardWidth = Math.max(cardWidth, 280);
        
        const cardGap = Math.floor(availableWidth * 0.01); // Small proportional gap (1% of width)
        
        // For smaller episode counts, adjust columns to look better
        let columns;
        if (episodeTitleCards.length <= 3) {
            columns = episodeTitleCards.length;
            // Even larger cards for very small episode counts
            gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 15;
        } else if (episodeTitleCards.length <= 6) {
            columns = episodeTitleCards.length;
            gridCardWidth = Math.floor((availableWidth * 0.9) / columns) - 10;
        } else {
            columns = Math.min(maxColumns, episodeTitleCards.length);
            gridCardWidth = cardWidth;
        }
        
        gridColumns = columns;
        gridGap = cardGap;
        
        // Calculate card height based on 16:9 ratio
        gridCardHeight = Math.floor(gridCardWidth * (9/16));
        
        // Calculate rows needed
        const rows = Math.ceil(episodeTitleCards.length / columns);
        
        // Calculate total dimensions with space for title and episode info
        const totalWidth = (columns * gridCardWidth) + ((columns - 1) * cardGap);
        const totalHeight = (rows * (gridCardHeight + 24)) + ((rows - 1) * cardGap) + 50; // 24px for episode info, 50px for header
        
        // Resize grid canvas
        gridCanvas.width = totalWidth + 40; // Add padding
        gridCanvas.height = totalHeight + 30; // Add padding
        
        // Clear the canvas
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        
        // Use a dark blue background like in the reference image
        gridCtx.fillStyle = '#10102a';
        gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
        
        // Draw title
        gridCtx.font = 'bold 24px Gabarito, sans-serif';
        gridCtx.fillStyle = '#ffffff';
        gridCtx.textAlign = 'center';
        gridCtx.fillText(
            `${currentShowData.name} - Season ${currentSeasonNumber}`, 
            gridCanvas.width / 2, 
            30
        );
        
        // Draw each episode card
        episodeTitleCards.forEach((card, index) => {
            // Calculate position in grid
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = 20 + (col * (gridCardWidth + cardGap));
            const y = 50 + (row * (gridCardHeight + cardGap + 24));
            
            // Create temporary canvas for this card
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = gridCardWidth;
            tempCanvas.height = gridCardHeight;
            const tempCtx = tempCanvas.getContext('2d');
            
            // Draw the title card
            drawCardToTempContext(tempCtx, card, gridCardWidth, gridCardHeight);
            
            // Draw the card onto the grid canvas
            gridCtx.drawImage(tempCanvas, x, y);
            
            // Draw episode code (S01E01) on the card - small badge in corner like Breaking Bad image
            gridCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            gridCtx.fillRect(x, y, 50, 16);
            
            gridCtx.font = 'bold 10px Gabarito, sans-serif';
            gridCtx.fillStyle = '#00bfa5';
            gridCtx.textAlign = 'left';
            gridCtx.fillText(`S${card.seasonNumber}E${card.episodeNumber}`, x + 4, y + 12);
            
            // Draw episode title under card
            gridCtx.font = '12px Gabarito, sans-serif';
            gridCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            gridCtx.textAlign = 'center';
            gridCtx.fillText(card.title, x + (gridCardWidth / 2), y + gridCardHeight + 16, gridCardWidth);
            
            // Store the card's coordinates for click detection
            card.gridCoords = {
                x: x,
                y: y,
                width: gridCardWidth,
                height: gridCardHeight
            };
        });
        
        // Add click listener to grid canvas
        if (!gridCanvas.onclick) {
            gridCanvas.onclick = handleGridCanvasClick;
        }
    }
    
    // Handle clicks on the grid canvas
    function handleGridCanvasClick(event) {
        // Get click position relative to canvas
        const rect = gridCanvas.getBoundingClientRect();
        const scaleX = gridCanvas.width / rect.width;
        const scaleY = gridCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        // Check if click is on any episode card
        for (let i = 0; i < episodeTitleCards.length; i++) {
            const card = episodeTitleCards[i];
            if (card.gridCoords) {
                const { x: cardX, y: cardY, width: cardWidth, height: cardHeight } = card.gridCoords;
                
                if (x >= cardX && x <= cardX + cardWidth && 
                    y >= cardY && y <= cardY + cardHeight) {
                    // Card was clicked, switch to single view for editing
                    selectEpisode(i);
                    showSingleCardView();
                    return;
                }
            }
        }
    }
    
    // Function to switch to single card view
    function showSingleCardView() {
        canvas.style.display = 'block';
        gridCanvas.style.display = 'none';
        
        // Only show the Return to Grid button if we have search results
        if (hasSearchResults) {
            returnToGridBtn.style.display = 'flex';
        } else {
            returnToGridBtn.style.display = 'none';
        }
    }
    
    // Function to switch to grid view
    function showGridView() {
        canvas.style.display = 'none';
        gridCanvas.style.display = 'block';
        returnToGridBtn.style.display = 'none';
    }
    
    // Function to draw a card to a specific context with given dimensions
    function drawCardToContext(targetCtx, width, height) {
        // Clear canvas
        targetCtx.clearRect(0, 0, width, height);
        
        // Fill with black background as default
        targetCtx.fillStyle = '#000000';
        targetCtx.fillRect(0, 0, width, height);

        // --- Draw Thumbnail (if present) ---
        if (thumbnailImg) {
            targetCtx.save();
            
            // Set opacity - using default value since control was removed
            targetCtx.globalAlpha = 1.0; // Default to full opacity
            
            if (thumbnailFullsize && thumbnailFullsize.checked) {
                // Draw as fullsize background
                targetCtx.drawImage(thumbnailImg, 0, 0, width, height);
            } else {
                // Draw scaled thumbnail centered - using default scale since control was removed
                const scale = 1.0; // Default to full scale
                let w, h;
                
                // Calculate dimensions keeping aspect ratio
                if (thumbnailImg.width / thumbnailImg.height > width / height) {
                    // Image is wider than canvas
                    h = height * scale;
                    w = thumbnailImg.width * (h / thumbnailImg.height);
                } else {
                    // Image is taller than canvas
                    w = width * scale;
                    h = thumbnailImg.height * (w / thumbnailImg.width);
                }
                
                // Center the image
                const x = (width - w) / 2;
                const y = (height - h) / 2;
                
                targetCtx.drawImage(thumbnailImg, x, y, w, h);
            }
            
            targetCtx.restore();
        }
        
        // --- Apply Visual Effects with mix-blend-mode ---
        if (effectType.value !== 'none') {
            // Create an off-screen canvas for the effect
            const effectCanvas = document.createElement('canvas');
            effectCanvas.width = width;
            effectCanvas.height = height;
            const effectCtx = effectCanvas.getContext('2d');
            
            let gradient;
            const color = gradientColor.value;
            const opacity = parseFloat(gradientOpacity.value);
            const alphaColor = hexToRGBA(color, opacity);
            const transparentColor = hexToRGBA(color, 0);
            
            switch (effectType.value) {
                case 'leftToRight':
                    gradient = effectCtx.createLinearGradient(0, 0, width, 0);
                    gradient.addColorStop(0, alphaColor);
                    gradient.addColorStop(1, transparentColor);
                    break;
                case 'rightToLeft':
                    gradient = effectCtx.createLinearGradient(0, 0, width, 0);
                    gradient.addColorStop(0, transparentColor);
                    gradient.addColorStop(1, alphaColor);
                    break;
                case 'topToBottom':
                    gradient = effectCtx.createLinearGradient(0, 0, 0, height);
                    gradient.addColorStop(0, alphaColor);
                    gradient.addColorStop(1, transparentColor);
                    break;
                case 'bottomToTop':
                    gradient = effectCtx.createLinearGradient(0, 0, 0, height);
                    gradient.addColorStop(0, transparentColor);
                    gradient.addColorStop(1, alphaColor);
                    break;
                case 'radial':
                    // Create radial gradient (centered vignette-like effect)
                    gradient = effectCtx.createRadialGradient(
                        width / 2, height / 2, 0,
                        width / 2, height / 2, Math.max(width, height) / 1.5
                    );
                    gradient.addColorStop(0, transparentColor);
                    gradient.addColorStop(1, alphaColor);
                    break;
            }
            
            // Fill the effect canvas with gradient
            effectCtx.fillStyle = gradient;
            effectCtx.fillRect(0, 0, width, height);
            
            // Apply the effect with selected blend mode
            targetCtx.save();
            targetCtx.globalCompositeOperation = blendMode.value;
            targetCtx.drawImage(effectCanvas, 0, 0);
            targetCtx.restore();
        }

        // Get the preset layout
        const preset = presetLayoutConfig[presetSelect.value] || presetLayoutConfig['centerMiddle'];
        
        // Get text size based on selection
        let titleSize;
        switch (textSize.value) {
            case 'small': titleSize = Math.round(56 * (width / 1280)); break;
            case 'large': titleSize = Math.round(86 * (width / 1280)); break;
            default: titleSize = Math.round(72 * (width / 1280));
        }
        
        // Calculate info text size
        const infoSize = Math.round(titleSize * 0.5); // Info text (season/episode) is 50% of the title size
        
        // Get text position
        let textBoxX, textBoxY, textAlign, maxWidth;
        
        switch (preset.position) {
            case 'leftBottom':
                textBoxX = Math.round(50 * (width / 1280));
                textBoxY = height - Math.round(180 * (height / 720));
                textAlign = 'left';
                maxWidth = width * 0.8;
                break;
            case 'centerBottom':
                textBoxX = width / 2;
                textBoxY = height - Math.round(180 * (height / 720));
                textAlign = 'center';
                maxWidth = width * 0.9;
                break;
            case 'leftMiddle':
                textBoxX = Math.round(50 * (width / 1280));
                textBoxY = height / 2 - Math.round(50 * (height / 720));
                textAlign = 'left';
                maxWidth = width * 0.7;
                break;
            case 'rightMiddle':
                textBoxX = width - Math.round(50 * (width / 1280));
                textBoxY = height / 2 - Math.round(50 * (height / 720));
                textAlign = 'right';
                maxWidth = width * 0.7;
                break;
            case 'centerTop':
                textBoxX = width / 2;
                textBoxY = Math.round(120 * (height / 720));
                textAlign = 'center';
                maxWidth = width * 0.9;
                break;
            case 'centerMiddle':
            default:
                textBoxX = width / 2;
                textBoxY = height / 2 - Math.round(50 * (height / 720));
                textAlign = 'center';
                maxWidth = width * 0.8;
        }
        
        // --- Title (Main show title) ---
        targetCtx.save();
        // Set font for title
        let tFont = '';
        if (textBold.checked) tFont += 'bold ';
        
        // Fix for Exo 2 and other fonts that might render too small
        let fontSizeAdjustment = 1;
        if (fontFamily.value === 'Exo 2') {
            fontSizeAdjustment = 1.2; // Make Exo 2 20% larger
        }
        
        // Get the font family to use - either selected font or custom font
        const fontToUse = (fontFamily.value === 'custom-font' && customFontFamily) 
            ? customFontFamily 
            : fontFamily.value;
            
        // Apply size adjustment to the font
        tFont += `${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;
        targetCtx.font = tFont;
        
        // Text alignment
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'top';
        
        // Apply text effects
        targetCtx.shadowColor = textShadowColor.value;
        targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
        targetCtx.shadowOffsetX = 2 * (width / 1280);
        targetCtx.shadowOffsetY = 2 * (height / 720);
        
        // Apply outline if specified
        if (parseInt(textOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(textOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = textOutlineColor.value;
            targetCtx.strokeText(titleInput.value || '', textBoxX, textBoxY, maxWidth);
        }
        
        // Draw title text
        targetCtx.fillStyle = textColor.value;
        targetCtx.fillText(titleInput.value || '', textBoxX, textBoxY, maxWidth);
        targetCtx.restore();

        // --- Season/Episode Info ---
        if (seasonNumberInput.value || episodeNumberInput.value) {
            const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
            let infoY = textBoxY + titleSize + spacing;
            
            // Create season/episode text with the selected separator
            let infoText = '';
            let separator = '';
            
            // Get the separator
            switch (separatorType.value) {
                case 'dash': separator = ' - '; break;
                case 'dot': separator = ' • '; break;
                case 'pipe': separator = ' | '; break;
                case 'space': separator = ' '; break;
                case 'none': separator = ''; break;
                default: separator = ' - ';
            }
            
            if (seasonNumberInput.value) {
                infoText += 'Season ' + seasonNumberInput.value;
            }
            
            if (seasonNumberInput.value && episodeNumberInput.value) {
                infoText += separator;
            }
            
            if (episodeNumberInput.value) {
                infoText += 'Episode ' + episodeNumberInput.value;
            }
            
            if (infoText) {
                targetCtx.save();
                // Set font for info text
                let iFont = '';
                if (textBold.checked) iFont += 'bold ';
                
                // Apply the same size adjustment to info text for consistency
                let fontSizeAdjustment = 1;
                if (fontFamily.value === 'Exo 2') {
                    fontSizeAdjustment = 1.2; // Make Exo 2 20% larger
                }
                
                // Get the font family to use for info text - either selected font or custom font
                const infoFontToUse = (fontFamily.value === 'custom-font' && customFontFamily) 
                    ? customFontFamily 
                    : fontFamily.value;
                
                iFont += `${Math.round(infoSize * fontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
                targetCtx.font = iFont;
                
                // Use same alignment as title
                targetCtx.textAlign = textAlign;
                targetCtx.textBaseline = 'top';
                
                // Apply text effects
                targetCtx.shadowColor = textShadowColor.value;
                targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
                targetCtx.shadowOffsetX = 1 * (width / 1280);
                targetCtx.shadowOffsetY = 1 * (height / 720);
                
                // Apply outline if specified
                if (parseInt(textOutlineWidth.value) > 0) {
                    targetCtx.lineWidth = parseInt(textOutlineWidth.value) * 0.75 * (width / 1280); // Slightly thinner for info text
                    targetCtx.strokeStyle = textOutlineColor.value;
                    targetCtx.strokeText(infoText, textBoxX, infoY, maxWidth);
                }
                
                // Draw info text
                targetCtx.fillStyle = infoColor.value;
                targetCtx.fillText(infoText, textBoxX, infoY, maxWidth);
                targetCtx.restore();
            }
        }
    }

    // Helper function to convert hex color to rgba
    function hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Preset layouts with positions and style configurations
    const presetLayoutConfig = {
        // The Rookie style - from example image
        centerMiddle: {
            position: 'centerMiddle',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'none',
            textShadowBlur: 8
        },
        // Manhunt style
        manhunt: {
            position: 'leftBottom',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'large',
            textBold: true,
            effectType: 'vignette',
            vignetteIntensity: 0.5,
            textShadowBlur: 5
        },
        // The Giggle style
        giggle: {
            position: 'centerBottom',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'none',
            textShadowBlur: 10
        },
        // Other preset options
        leftMiddle: {
            position: 'leftMiddle',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'rightToLeft',
            gradientColor: '#000000',
            gradientOpacity: 0.7,
            textShadowBlur: 10
        },
        rightMiddle: {
            position: 'rightMiddle',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'leftToRight',
            gradientColor: '#000000',
            gradientOpacity: 0.7,
            textShadowBlur: 10
        },
        centerTop: {
            position: 'centerTop',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'bottomToTop',
            gradientColor: '#000000',
            gradientOpacity: 0.6,
            textShadowBlur: 12
        }
    };
    
    // Function to draw a card to a temporary context for the grid
    function drawCardToTempContext(tempCtx, card, width, height) {
        // Store original values
        const originalTitle = titleInput.value;
        const originalSeason = seasonNumberInput.value;
        const originalEpisode = episodeNumberInput.value;
        const originalThumbnail = thumbnailImg;
        
        // Set the card data temporarily
        titleInput.value = card.title;
        seasonNumberInput.value = card.seasonNumber;
        episodeNumberInput.value = card.episodeNumber;
        thumbnailImg = card.thumbnailImg;
        
        // Draw the card
        drawCardToContext(tempCtx, width, height);
        
        // Restore original values
        titleInput.value = originalTitle;
        seasonNumberInput.value = originalSeason;
        episodeNumberInput.value = originalEpisode;
        thumbnailImg = originalThumbnail;
    }

    // Function to select a specific episode for editing
    function selectEpisode(index) {
        if (index < 0 || index >= episodeTitleCards.length) return;
        
        selectedCardIndex = index;
        const card = episodeTitleCards[index];
        
        // Populate form fields with episode data
        titleInput.value = card.title;
        seasonNumberInput.value = card.seasonNumber;
        episodeNumberInput.value = card.episodeNumber;
        
        // Set thumbnail if available
        if (card.thumbnailImg) {
            thumbnailImg = card.thumbnailImg;
        }
        
        // Display alternative images if available
        displayAlternativeImages(card);
        
        // Draw the selected card
        drawCard();
    }
    
    // Function to display alternative images for an episode
    function displayAlternativeImages(card) {
        const altImagesContainer = document.getElementById('alt-images-container');
        const altImagesInfo = document.getElementById('alt-images-info');
        
        // Clear the container
        altImagesContainer.innerHTML = '';
        
        if (!card.allImages || card.allImages.length <= 1) {
            // No alternative images available
            altImagesInfo.textContent = 'No alternative images available for this episode';
            return;
        }
        
        // Update info text
        altImagesInfo.textContent = `${card.allImages.length} images available - click to select`;
        
        // Create image thumbnails
        card.allImages.forEach((img, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'alt-image-item';
            if (card.thumbnailImg === img) {
                imageItem.classList.add('selected');
            }
            
            // Create image element
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = `Alternative image ${index + 1}`;
            imageItem.appendChild(imgEl);
            
            // Add small index badge
            const badge = document.createElement('span');
            badge.className = 'image-badge';
            badge.textContent = index + 1;
            imageItem.appendChild(badge);
            
            // Add click handler to select this image
            imageItem.addEventListener('click', () => {
                // Update the selected image
                thumbnailImg = img;
                card.thumbnailImg = img;
                
                // Update selected state in UI
                document.querySelectorAll('.alt-image-item').forEach(item => {
                    item.classList.remove('selected');
                });
                imageItem.classList.add('selected');
                
                // Redraw the card
                drawCard();
            });
            
            altImagesContainer.appendChild(imageItem);
        });
        
        // Make the TV Show Search section expanded to show the alternative images
        document.querySelector('.collapsible:nth-child(1)').classList.add('active');
    }

    // Function to download all title cards in batch mode
    async function batchDownloadTitleCards() {
        // Create a zip file containing all title cards
        if (!window.JSZip) {
            alert('Loading required library for batch download...');
            await loadJSZip();
        }
        
        const zip = new JSZip();
        const showName = currentShowData.name.replace(/[^\w\s]/gi, '');
        const seasonFolder = zip.folder(`${showName} - Season ${currentSeasonNumber}`);
        
        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.style.position = 'fixed';
        loadingMsg.style.top = '50%';
        loadingMsg.style.left = '50%';
        loadingMsg.style.transform = 'translate(-50%, -50%)';
        loadingMsg.style.background = 'rgba(0, 0, 0, 0.8)';
        loadingMsg.style.color = 'white';
        loadingMsg.style.padding = '20px';
        loadingMsg.style.borderRadius = '10px';
        loadingMsg.style.zIndex = '1000';
        loadingMsg.style.backdropFilter = 'blur(6px)';
        loadingMsg.style.boxShadow = '0 4px 20px rgba(0, 255, 255, 0.2)';
        loadingMsg.textContent = 'Preparing title cards for download...';
        document.body.appendChild(loadingMsg);
        
        // Create a promise for each title card to be added to zip
        const promises = episodeTitleCards.map((card, index) => {
            return new Promise(resolve => {
                const episodeCanvas = document.createElement('canvas');
                episodeCanvas.width = 1280;  // Full size for download
                episodeCanvas.height = 720;
                
                // Draw the card at full resolution
                drawCardToTempContext(episodeCanvas.getContext('2d'), card, 1280, 720);
                
                // Convert to blob and add to zip
                episodeCanvas.toBlob(blob => {
                    const filename = `S${card.seasonNumber}E${card.episodeNumber} - ${card.title.replace(/[/\\?%*:|"<>]/g, '-')}.png`;
                    seasonFolder.file(filename, blob);
                    resolve();
                }, 'image/png');
            });
        });
        
        try {
            // Wait for all cards to be added to the zip
            await Promise.all(promises);
            
            // Generate and download the zip file
            const content = await zip.generateAsync({ type: 'blob' });
            document.body.removeChild(loadingMsg);
            
            const link = document.createElement('a');
            link.download = `${showName} - Season ${currentSeasonNumber} Title Cards.zip`;
            link.href = URL.createObjectURL(content);
            link.click();
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.style.position = 'fixed';
            successMsg.style.bottom = '20px';
            successMsg.style.left = '50%';
            successMsg.style.transform = 'translateX(-50%)';
            successMsg.style.background = 'rgba(0, 255, 255, 0.2)';
            successMsg.style.color = 'white';
            successMsg.style.padding = '10px 20px';
            successMsg.style.borderRadius = '6px';
            successMsg.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            successMsg.style.backdropFilter = 'blur(6px)';
            successMsg.style.zIndex = '1000';
            successMsg.textContent = 'All title cards downloaded successfully!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.style.opacity = '0';
                successMsg.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    document.body.removeChild(successMsg);
                }, 500);
            }, 2000);
            
        } catch (error) {
            console.error('Error creating zip file:', error);
            document.body.removeChild(loadingMsg);
            alert('Failed to create zip file. Please try again.');
        }
    }
    
    // Function to load JSZip dynamically
    async function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = () => {
                reject(new Error('Failed to load JSZip library'));
                alert('Failed to load required library. Please check your internet connection and try again.');
            };
            document.head.appendChild(script);
        });
    }
    
    // Default values for reset functionality
    const defaultValues = {
        title: "",
        seasonNumber: "",
        episodeNumber: "",
        separator: "dash",
        font: "Gabarito",
        textColor: "#ffffff",
        infoColor: "#cccccc",
        textSize: "normal",
        textBold: true,
        shadowColor: "#000000",
        shadowBlur: 8,
        outlineColor: "#000000",
        outlineWidth: 0,
        titleInfoSpacing: 15,
        thumbnailFullsize: true,
        effectType: "none",
        gradientOpacity: 0.7,
        gradientColor: "#000000",
        blendMode: "overlay"
    };
    
    // Reset button functionality
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        // Reset all fields to default values
        titleInput.value = defaultValues.title;
        seasonNumberInput.value = defaultValues.seasonNumber;
        episodeNumberInput.value = defaultValues.episodeNumber;
        separatorType.value = defaultValues.separator;
        fontFamily.value = defaultValues.font;
        textColor.value = defaultValues.textColor;
        infoColor.value = defaultValues.infoColor;
        textSize.value = defaultValues.textSize;
        textBold.checked = defaultValues.textBold;
        textShadowColor.value = defaultValues.shadowColor;
        textShadowBlur.value = defaultValues.shadowBlur;
        textOutlineColor.value = defaultValues.outlineColor;
        textOutlineWidth.value = defaultValues.outlineWidth;
        titleInfoSpacing.value = defaultValues.titleInfoSpacing;
        thumbnailFullsize.checked = defaultValues.thumbnailFullsize;
        effectType.value = defaultValues.effectType;
        gradientOpacity.value = defaultValues.gradientOpacity;
        gradientColor.value = defaultValues.gradientColor;
        blendMode.value = defaultValues.blendMode;
        
        // Clear thumbnail
        thumbnailImg = null;
        
        // Update gradient controls visibility
        if (effectType.value === 'none') {
            document.getElementById('gradient-controls').style.display = 'none';
        }
        
        // Clear search results and reset search-related UI elements
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('season-selector').innerHTML = '';
        document.getElementById('alt-images-container').innerHTML = '';
        document.getElementById('alt-images-info').textContent = 'Select an episode to see available images';
        document.getElementById('show-search-input').value = '';
        
        // Reset TMDB mode flags and data
        currentShowData = null;
        currentSeasonData = [];
        episodeTitleCards = [];
        selectedCardIndex = -1;
        isTMDBMode = false;
        hasSearchResults = false;
        
        // Always revert to single card view
        showSingleCardView();
        returnToGridBtn.style.display = 'none';
        
        // Update card
        updateBothViews();
        
        // Show success message
        showToast("Title card has been reset to defaults");
    });
    
    // Function to show toast notifications
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(-20px)';
        }, 10);
        
        // Animate out
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(0)';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 2000);
    }
    
    // Download button functionality (works for both single card and batch)
    downloadBtn.addEventListener('click', () => {
        // Check if we're in grid view or single view
        if (canvas.style.display === 'block') {
            // We're in single card view - download the current card
            downloadSingleCard();
        } else if (hasSearchResults && episodeTitleCards.length > 0) {
            // We're in grid view and have search results - download all cards
            batchDownloadTitleCards();
        } else {
            // Fallback to single card download if grid view but no search results
            downloadSingleCard();
        }
    });
    
    // Function to download a single title card
    function downloadSingleCard() {
        // Create a filename with the current title or a default
        let filename = 'title-card.png';
        if (titleInput.value) {
            filename = titleInput.value.replace(/[/\\?%*:|"<>]/g, '-');
            if (seasonNumberInput.value && episodeNumberInput.value) {
                filename = `S${seasonNumberInput.value}E${episodeNumberInput.value} - ${filename}`;
            }
            filename += '.png';
        }
        
        // Convert canvas to data URL and trigger download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
        
        showToast("Title card downloaded successfully");
    }
    
    // Return to grid view button
    returnToGridBtn.addEventListener('click', () => {
        renderEpisodeGrid(); // Re-render grid to capture any changes
        showGridView();
    });
    
    // Update the existing drawCard function to use the new shared logic
    function drawCard() {
        drawCardToContext(ctx, canvas.width, canvas.height);
    }
    
    // Initial setup - hide the Return to Grid button
    returnToGridBtn.style.display = 'none';
    
    // Initial render
    drawCard();

    // Function to calculate grid dimensions based on episode count
    function calculateGridDimensions(episodeCount) {
        // Adjust columns based on episode count and trying to fit more on screen
        if (episodeCount <= 4) {
            gridColumns = episodeCount;
            gridCardWidth = 270;
        } else if (episodeCount <= 8) {
            gridColumns = Math.min(4, episodeCount);
            gridCardWidth = 260;
        } else if (episodeCount <= 16) {
            gridColumns = 5; // More columns to fit more cards
            gridCardWidth = 230;
        } else {
            gridColumns = 6; // Even more columns for larger seasons
            gridCardWidth = 210;
        }
        
        // Calculate rows needed
        const rows = Math.ceil(episodeCount / gridColumns);
        
        // Set card height based on 16:9 ratio
        gridCardHeight = Math.round(gridCardWidth * (9/16));
        
        // Adjust gap based on grid size - reduced for more compact layout
        if (episodeCount > 20) {
            gridGap = 10;
        } else {
            gridGap = 12;
        }
        
        return {
            columns: gridColumns,
            rows: rows
        };
    }

    // Set up collapsible sections in the sidebar
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('.toggle-icon');
            
            // Toggle active class
            parent.classList.toggle('active');
            
            // Remove the icon text content update - we're using CSS for this now
            // No need to set icon.textContent anymore
        });
    });
    
    // Show/hide effect-specific controls based on effect type selection
    effectType.addEventListener('change', () => {
        const gradientControls = document.getElementById('gradient-controls');
        
        if (effectType.value === 'none') {
            gradientControls.style.display = 'none';
        } else {
            gradientControls.style.display = 'block';
        }
        
        // Redraw the card with the
        drawCard();
    });
    
    // Initialize UI state
    if (effectType.value === 'none') {
        document.getElementById('gradient-controls').style.display = 'none';
    } else {
        document.getElementById('gradient-controls').style.display = 'block';
    }
    
    // Add event listeners to update both views when making style changes
    function updateBothViews() {
        drawCard(); // Update single card view
        
        // If we have a selected card, update its data in the episodeTitleCards array
        if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
            // Store the current card's updated data
            episodeTitleCards[selectedCardIndex].title = titleInput.value;
            episodeTitleCards[selectedCardIndex].seasonNumber = seasonNumberInput.value;
            episodeTitleCards[selectedCardIndex].episodeNumber = episodeNumberInput.value;
            episodeTitleCards[selectedCardIndex].thumbnailImg = thumbnailImg;
        }
        
        // Always update grid view to reflect changes immediately, regardless of current view
        renderEpisodeGrid();
    }
    
    // Add update listeners to all input controls
    function addUpdateListeners(element) {
        if (element.type === 'checkbox' || element.type === 'radio') {
            element.addEventListener('change', updateBothViews);
        } else if (element.type === 'range' || element.type === 'color') {
            // For sliders and color pickers, update in real time as they change
            element.addEventListener('input', updateBothViews);
        } else if (element.type === 'text' || element.tagName === 'SELECT') {
            // For text inputs and dropdowns, update both on input and change
            element.addEventListener('input', updateBothViews);
            element.addEventListener('change', updateBothViews);
        }
    }
    
    // Add update listeners to all input controls
    [titleInput, seasonNumberInput, episodeNumberInput, separatorType, 
     presetSelect, textColor, infoColor, textSize, textBold, 
     textShadowColor, textShadowBlur, textOutlineColor, textOutlineWidth, 
     titleInfoSpacing, thumbnailFullsize, 
     effectType, gradientOpacity, gradientColor, blendMode].forEach(element => {
        if (element) {
            addUpdateListeners(element);
        }
    });
    
    // Special handling for font family changes to ensure they update immediately
    fontFamily.addEventListener('change', function(e) {
        // Force font loading if needed
        const fontName = this.value;
        const testSpan = document.createElement('span');
        testSpan.style.fontFamily = `"${fontName}", sans-serif`;
        testSpan.style.visibility = 'hidden';
        testSpan.textContent = 'Font load test';
        document.body.appendChild(testSpan);
        
        // Use a small delay to ensure the font is loaded and applied
        setTimeout(() => {
            document.body.removeChild(testSpan);
            updateBothViews();
            
            // Force a second redraw after a slight delay to ensure the font renders
            setTimeout(() => updateBothViews(), 50);
        }, 10);
    });
    
    // Also handle thumbnail upload
    thumbnailInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = function() {
                    thumbnailImg = img;
                    // Store the thumbnail with the current card
                    if (selectedCardIndex >= 0 && episodeTitleCards[selectedCardIndex]) {
                        episodeTitleCards[selectedCardIndex].thumbnailImg = img;
                    }
                    updateBothViews();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Custom font handling
    let customFontFamily = null;
    const customFontUpload = document.getElementById('custom-font-upload');
    const customFontInfo = document.getElementById('custom-font-info');
    const customFontName = document.getElementById('custom-font-name');
    const customFontOption = document.getElementById('custom-font-option');

    // Handle custom font upload
    customFontUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const fontFile = e.target.files[0];
            
            // Create a unique font family name for this session
            const uniqueFontName = 'customFont_' + Date.now();
            
            // Create a FileReader to read the font file
            const reader = new FileReader();
            reader.onload = function(event) {
                // Create a style element to define the font face
                const fontFace = new FontFace(uniqueFontName, event.target.result);
                
                // Add the font to the document fonts
                fontFace.load().then(function(loadedFontFace) {
                    document.fonts.add(loadedFontFace);
                    
                    // Store the font family name for use in the canvas
                    customFontFamily = uniqueFontName;
                    
                    // Update the UI
                    customFontName.textContent = fontFile.name;
                    customFontInfo.style.display = 'block';
                    customFontOption.style.display = 'block';
                    customFontOption.textContent = fontFile.name;
                    
                    // Select the custom font in the dropdown
                    fontFamily.value = 'custom-font';
                    
                    // Redraw the canvas with the new font
                    updateBothViews();
                    
                    showToast("Custom font loaded successfully");
                }).catch(function(error) {
                    console.error('Error loading font:', error);
                    showToast("Error loading font. Please try another font file.");
                });
            };
            reader.readAsArrayBuffer(fontFile);
        }
    });
    
    // Save Config Button functionality
    saveConfigBtn.addEventListener('click', () => {
        // Create configuration object with all the requested settings
        const config = {
            // Style options
            textPlacementStyle: presetSelect.value,
            effectType: effectType.value,
            gradientOpacity: gradientOpacity.value,
            gradientColor: gradientColor.value,
            blendMode: blendMode.value,
            
            // Text options
            textColor: textColor.value,
            infoColor: infoColor.value,
            textSize: textSize.value,
            textBold: textBold.checked,
            
            // Spacing and separator
            titleInfoSpacing: titleInfoSpacing.value,
            separatorType: separatorType.value
        };

        // Save to localStorage
        localStorage.setItem('titleCardConfig', JSON.stringify(config));
        
        // Show confirmation dialog
        const overlay = document.getElementById('save-confirm-overlay');
        overlay.style.display = 'flex';
        
        document.getElementById('saveConfirmOk').onclick = () => {
            overlay.style.display = 'none';
        };
    });
    
    // Load Config Button functionality
    loadConfigBtn.addEventListener('click', () => {
        // Get saved config from localStorage
        const savedConfig = localStorage.getItem('titleCardConfig');
        
        if (!savedConfig) {
            showToast('No saved configuration found');
            return;
        }
        
        try {
            const config = JSON.parse(savedConfig);
            
            // Apply all saved settings
            if (config.textPlacementStyle) presetSelect.value = config.textPlacementStyle;
            if (config.effectType) effectType.value = config.effectType;
            if (config.gradientOpacity) gradientOpacity.value = config.gradientOpacity;
            if (config.gradientColor) gradientColor.value = config.gradientColor;
            if (config.blendMode) blendMode.value = config.blendMode;
            
            if (config.textColor) textColor.value = config.textColor;
            if (config.infoColor) infoColor.value = config.infoColor;
            if (config.textSize) textSize.value = config.textSize;
            if (config.textBold !== undefined) textBold.checked = config.textBold;
            
            if (config.titleInfoSpacing) titleInfoSpacing.value = config.titleInfoSpacing;
            if (config.separatorType) separatorType.value = config.separatorType;
            
            // Update gradient controls visibility based on loaded effect type
            if (effectType.value === 'none') {
                document.getElementById('gradient-controls').style.display = 'none';
            } else {
                document.getElementById('gradient-controls').style.display = 'block';
            }
            
            // Redraw the card with new settings
            updateBothViews();
            
            // Show confirmation dialog
            const overlay = document.getElementById('load-confirm-overlay');
            overlay.style.display = 'flex';
            
            document.getElementById('loadConfirmOk').onclick = () => {
                overlay.style.display = 'none';
            };
        } catch (error) {
            console.error('Error loading configuration:', error);
            showToast('Error loading configuration');
        }
    });
});
