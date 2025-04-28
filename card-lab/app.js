document.addEventListener('DOMContentLoaded', () => {
    // --- TMDB API Configuration ---
    const TMDB_API_KEY = '96c821c9e98fab6a43bff8021d508d1d'; 
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p/';
    // Initialize default color values immediately to ensure they're available
    window['text-color'] = '#ffffff';
    window['info-color'] = '#ffffff';
    window['text-shadow-color'] = '#000000';
    window['text-outline-color'] = '#000000';
    window['info-shadow-color'] = '#000000';
    window['info-outline-color'] = '#000000';
    window['gradient-color'] = '#000000';
    // Initialize Text Options UI
    function initializeTextOptionsUI() {
        // Set up custom font upload UI
        const customFontUploadContainer = document.querySelector('.custom-font-upload-container');
        const customFontUpload = document.getElementById('custom-font-upload');
        const fontFamily = document.getElementById('font-family');
        const infoFontFamily = document.getElementById('info-font-family');
        
        const thumbnailContainer = document.getElementById('thumbnail-container');
const thumbnailUpload = document.getElementById('thumbnail-upload');

if (thumbnailContainer && thumbnailUpload) {
    // Make the whole container clickable
    thumbnailContainer.addEventListener('click', () => {
        thumbnailUpload.click();
    });

    // Handle file selection
    thumbnailUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const img = new Image();
            img.onload = () => {
                thumbnailImg = img; // Replace the current thumbnail image
                updateBothViews();
                thumbnailContainer.querySelector('span').textContent = 'Thumbnail Selected';
            };
            img.onerror = () => {
                console.error('Failed to load selected thumbnail image.');
                thumbnailContainer.querySelector('span').textContent = 'Error loading thumbnail';
            };
            img.src = URL.createObjectURL(file);
        } else {
            thumbnailContainer.querySelector('span').textContent = 'Upload Show Thumbnail';
        }
    });
}        
        // Make the whole container clickable to trigger file input
        if (customFontUploadContainer && customFontUpload) {
            customFontUploadContainer.addEventListener('click', () => {
                customFontUpload.click();
            });
            
            // Update the displayed file name when a file is selected
            customFontUpload.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const fontName = file.name.split('.')[0]; // Use filename as font name
                    customFontUploadContainer.textContent = file.name;
                    
                    // Add the font to the document
                    const fontUrl = URL.createObjectURL(file);
                    const fontFace = new FontFace('CustomFont', `url(${fontUrl})`);
                    
                    fontFace.load().then(function(loadedFace) {
                        document.fonts.add(loadedFace);
                        
                        // Store custom font name for later use
                        window.customFontFamily = 'CustomFont';
                        
                        // Make the custom font option visible and selected in both dropdowns
                        const customFontOption = document.getElementById('custom-font-option');
                        if (customFontOption) {
                            customFontOption.style.display = 'block';
                            customFontOption.textContent = `Custom: ${fontName}`;
                            fontFamily.value = 'custom-font';
                        }
                        // Add custom font option to info font dropdown if it doesn't exist
                        let infoCustomOption = document.getElementById('info-custom-font-option');
                        if (!infoCustomOption && infoFontFamily) {
                            infoCustomOption = document.createElement('option');
                            infoCustomOption.id = 'info-custom-font-option';
                            infoCustomOption.value = 'custom-font';
                            infoCustomOption.textContent = `Custom: ${fontName}`;
                            infoFontFamily.appendChild(infoCustomOption);
                        } else if (infoCustomOption) {
                            infoCustomOption.style.display = 'block';
                            infoCustomOption.textContent = `Custom: ${fontName}`;
                        }
                        
                        // Update the card with new font - use updateBothViews for consistency
                        updateBothViews();
                    }).catch(function(error) {
                        console.error('Error loading font:', error);
                        customFontUploadContainer.textContent = 'Error loading font';
                    });
                } else {
                    customFontUploadContainer.textContent = 'Upload Custom Font';
                }
            });
        }
        
        // Set up slider value displays
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
        updateSliderValueDisplay('title-info-spacing', 'spacing-value', 'px');
        
        // Initialize shadow/outline sliders to minimum values
        document.getElementById('text-shadow-blur').value = 0;
        document.getElementById('text-outline-width').value = 0;
        document.getElementById('info-shadow-blur').value = 0;
        document.getElementById('info-outline-width').value = 0;
        
        // Update the value displays for sliders
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
    }
    
    // Update slider value displays
    function updateSliderValueDisplay(sliderId, valueId, unit) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (slider && valueDisplay) {
            // Set initial value
            valueDisplay.textContent = `${slider.value}${unit}`;
            
            // Update when slider changes
            slider.addEventListener('input', () => {
                valueDisplay.textContent = `${slider.value}${unit}`;
            });
        }
    }

// Initialize all Pickr color pickers
function initializePickrs() {
    // IMPORTANT: Set default color values explicitly at the very beginning
    window['text-color'] = '#ffffff';
    window['info-color'] = '#ffffff';
    window['text-shadow-color'] = '#000000';
    window['text-outline-color'] = '#000000';
    window['info-shadow-color'] = '#000000';
    window['info-outline-color'] = '#000000';
    window['gradient-color'] = '#000000';

    // Common Pickr options
    const mainPickrOptions = {
        theme: 'monolith',
        position: 'right-middle',
        padding: 40,
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

    // Options for smaller effect pickrs
    const effectPickrOptions = {
        ...mainPickrOptions,
        position: 'top-start',
        padding: 10
    };

    // Create Pickr instances
    const textColorPickr = Pickr.create({
        el: document.getElementById('text-color-pickr'),
        default: window['text-color'],
        ...mainPickrOptions
    });
    const infoColorPickr = Pickr.create({
        el: document.getElementById('info-color-pickr'),
        default: window['info-color'],
        ...mainPickrOptions
    });
    const shadowColorPickr = Pickr.create({
        el: document.getElementById('text-shadow-color-pickr'),
        default: window['text-shadow-color'],
        ...effectPickrOptions
    });
    const outlineColorPickr = Pickr.create({
        el: document.getElementById('text-outline-color-pickr'),
        default: window['text-outline-color'],
        ...effectPickrOptions
    });
    const infoShadowColorPickr = Pickr.create({
        el: document.getElementById('info-shadow-color-pickr'),
        default: window['info-shadow-color'],
        ...effectPickrOptions
    });
    const infoOutlineColorPickr = Pickr.create({
        el: document.getElementById('info-outline-color-pickr'),
        default: window['info-outline-color'],
        ...effectPickrOptions
    });
    const gradientColorPickr = Pickr.create({
        el: document.getElementById('gradient-color-pickr'),
        default: window['gradient-color'],
        ...mainPickrOptions
    });

    // Immediately sync Pickr instances to initialized color values
    textColorPickr.setColor(window['text-color']);
    infoColorPickr.setColor(window['info-color']);
    shadowColorPickr.setColor(window['text-shadow-color']);
    outlineColorPickr.setColor(window['text-outline-color']);
    infoShadowColorPickr.setColor(window['info-shadow-color']);
    infoOutlineColorPickr.setColor(window['info-outline-color']);
    gradientColorPickr.setColor(window['gradient-color']);

    // Setup Pickr event tracking
    setupPickrEvents(textColorPickr, 'text-color');
    setupPickrEvents(infoColorPickr, 'info-color');
    setupPickrEvents(shadowColorPickr, 'text-shadow-color');
    setupPickrEvents(outlineColorPickr, 'text-outline-color');
    setupPickrEvents(infoShadowColorPickr, 'info-shadow-color');
    setupPickrEvents(infoOutlineColorPickr, 'info-outline-color');
    setupPickrEvents(gradientColorPickr, 'gradient-color');
}

// Helper function to set up Pickr event listeners
function setupPickrEvents(pickr, colorName) {
    // Track color values immediately
    window[colorName] = pickr.getColor().toHEXA().toString();

    pickr.on('change', (color) => {
        const hexColor = color.toHEXA().toString();
        window[colorName] = hexColor;
        updateBothViews();
    });

    pickr.on('save', (color) => {
        const hexColor = color.toHEXA().toString();
        window[colorName] = hexColor;
        pickr.hide();
        updateBothViews();
    });
}

// New function to reinforce color initialization (if needed later)
function initializeColorValuesFromPickr() {
    if (Pickr && Pickr.all && Pickr.all.length > 0) {
        console.log("Initializing color values from Pickr instances...");

        Pickr.all.forEach(pickr => {
            if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;

            const id = pickr._root.button.id;
            const colorValue = pickr.getColor()?.toHEXA()?.toString();

            if (!colorValue) return;

            if (id === 'text-color-pickr') window['text-color'] = colorValue;
            else if (id === 'info-color-pickr') window['info-color'] = colorValue;
            else if (id === 'text-shadow-color-pickr') window['text-shadow-color'] = colorValue;
            else if (id === 'text-outline-color-pickr') window['text-outline-color'] = colorValue;
            else if (id === 'info-shadow-color-pickr') window['info-shadow-color'] = colorValue;
            else if (id === 'info-outline-color-pickr') window['info-outline-color'] = colorValue;
            else if (id === 'gradient-color-pickr') window['gradient-color'] = colorValue;
        });

        drawCard();
    } else {
        console.log("Pickr instances not ready yet, retrying in 100ms...");
        setTimeout(initializeColorValuesFromPickr, 100);
    }
}

// Function to update the card
function updateCard() {
    drawCard();
}

// Function to update both single card and grid view
function updateBothViews() {
    drawCard();
    if (isTMDBMode && episodeTitleCards.length > 0) {
        updateEpisodeCardSettings();
        renderEpisodeGrid();
    }
}
    
// 1. First, enhance the updateEpisodeCardSettings function to ensure color values
// are correctly captured from Pickr instances:
function updateEpisodeCardSettings() {
    // Don't do anything if we're not in TMDB mode or no cards
    if (!isTMDBMode || episodeTitleCards.length === 0) return;
    
    // Get current color values directly from Pickr instances
    const currentColors = {};
    if (Pickr.all) {
        Pickr.all.forEach(pickr => {
            if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
            
            const id = pickr._root.button.id;
            // Make sure the Pickr instance has a valid color
            if (pickr.getColor && typeof pickr.getColor === 'function') {
                const colorValue = pickr.getColor().toHEXA().toString();
                
                if (id === 'text-color-pickr') {
                    currentColors.textColor = colorValue;
                    // Also update the window variable for immediate use
                    window['text-color'] = colorValue;
                } else if (id === 'info-color-pickr') {
                    currentColors.infoColor = colorValue;
                    window['info-color'] = colorValue;
                } else if (id === 'text-shadow-color-pickr') {
                    currentColors.textShadowColor = colorValue;
                    window['text-shadow-color'] = colorValue;
                } else if (id === 'text-outline-color-pickr') {
                    currentColors.textOutlineColor = colorValue;
                    window['text-outline-color'] = colorValue;
                } else if (id === 'info-shadow-color-pickr') {
                    currentColors.infoShadowColor = colorValue;
                    window['info-shadow-color'] = colorValue;
                } else if (id === 'info-outline-color-pickr') {
                    currentColors.infoOutlineColor = colorValue;
                    window['info-outline-color'] = colorValue;
                } else if (id === 'gradient-color-pickr') {
                    currentColors.gradientColor = colorValue;
                    window['gradient-color'] = colorValue;
                }
            }
        });
    }
    
    // Use window values as fallback
    const fallbackColors = {
        textColor: window['text-color'] || '#ffffff',
        infoColor: window['info-color'] || '#ffffff',
        textShadowColor: window['text-shadow-color'] || '#000000',
        textOutlineColor: window['text-outline-color'] || '#000000',
        infoShadowColor: window['info-shadow-color'] || '#000000',
        infoOutlineColor: window['info-outline-color'] || '#000000',
        gradientColor: window['gradient-color'] || '#000000'
    };
    
    // Copy the current settings to all episode cards
    for (const card of episodeTitleCards) {
        // Keep the card's original data (title, episode number, etc.)
        // but apply current style settings to ensure consistency
        card.currentSettings = {
            fontFamily: fontFamily.value,
            infoFontFamily: document.getElementById('info-font-family').value,
            textSize: textSize.value,
            infoTextSize: document.getElementById('info-text-size').value,
            textShadowBlur: textShadowBlur.value,
            textOutlineWidth: textOutlineWidth.value,
            infoShadowBlur: document.getElementById('info-shadow-blur').value,
            infoOutlineWidth: document.getElementById('info-outline-width').value,
            titleInfoSpacing: titleInfoSpacing.value,
            textColor: currentColors.textColor || fallbackColors.textColor,
            infoColor: currentColors.infoColor || fallbackColors.infoColor,
            textShadowColor: currentColors.textShadowColor || fallbackColors.textShadowColor,
            textOutlineColor: currentColors.textOutlineColor || fallbackColors.textOutlineColor,
            infoShadowColor: currentColors.infoShadowColor || fallbackColors.infoShadowColor,
            infoOutlineColor: currentColors.infoOutlineColor || fallbackColors.infoOutlineColor,
            effectType: effectType.value,
            gradientColor: currentColors.gradientColor || fallbackColors.gradientColor,
            gradientOpacity: gradientOpacity.value,
            blendMode: blendMode.value
        };
    }
}
    // --- TITLE CARD MAKER LOGIC ---
    const canvas = document.getElementById('titlecard-canvas');
    const gridCanvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    const gridCtx = gridCanvas.getContext('2d');
    
    // Input element references
    const titleInput = document.getElementById('title-text');
    const seasonNumberInput = document.getElementById('season-number');
    const episodeNumberInput = document.getElementById('episode-number');
    const separatorType = document.getElementById('separator-type');
    
    // Style controls
    const presetSelect = document.getElementById('preset-select');
    const fontFamily = document.getElementById('font-family');
    const textSize = document.getElementById('text-size');
    const textShadowBlur = document.getElementById('text-shadow-blur');
    const textOutlineWidth = document.getElementById('text-outline-width');
    const titleInfoSpacing = document.getElementById('title-info-spacing');
    
    // Show thumbnail
    const thumbnailInput = document.getElementById('thumbnail-upload');
    const thumbnailFullsize = document.getElementById('thumbnail-fullsize');
    
    // Visual effects
    const effectType = document.getElementById('effect-type');
    const gradientOpacity = document.getElementById('gradient-opacity');
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
    let isTMDBMode = false;
    let thumbnailImg = null;
    let hasSearchResults = false;
    
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
    
    // Function to show loading progress overlay
    function showProgressOverlay(message, showProgressBar = false) {
        // Create or get overlay
        let overlay = document.getElementById('progress-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'progress-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '9999';
            overlay.style.backdropFilter = 'blur(4px)';
            document.body.appendChild(overlay);
            
            // Create spinner
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.style.border = '3px solid rgba(255, 255, 255, 0.1)';
            spinner.style.borderTop = '3px solid #00bfa5';
            spinner.style.borderRadius = '50%';
            spinner.style.width = '40px';
            spinner.style.height = '40px';
            spinner.style.animation = 'spin 1s linear infinite';
            spinner.style.marginBottom = '20px';
            overlay.appendChild(spinner);
            
            // Add CSS for the spinner if it doesn't exist yet
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
            
            // Create message element
            const messageEl = document.createElement('div');
            messageEl.id = 'progress-message';
            messageEl.style.color = 'white';
            messageEl.style.fontSize = '16px';
            messageEl.style.fontFamily = 'Gabarito, sans-serif';
            messageEl.style.textAlign = 'center';
            messageEl.style.maxWidth = '80%';
            messageEl.style.margin = '0 0 20px 0';
            overlay.appendChild(messageEl);
            
            // Create progress container and bar
            const progressContainer = document.createElement('div');
            progressContainer.id = 'progress-container';
            progressContainer.style.width = '300px';
            progressContainer.style.height = '6px';
            progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            progressContainer.style.borderRadius = '3px';
            progressContainer.style.overflow = 'hidden';
            progressContainer.style.display = showProgressBar ? 'block' : 'none';
            
            const progressBar = document.createElement('div');
            progressBar.id = 'progress-bar';
            progressBar.style.width = '0%';
            progressBar.style.height = '100%';
            progressBar.style.backgroundColor = '#00bfa5';
            progressBar.style.transition = 'width 0.3s ease';
            
            progressContainer.appendChild(progressBar);
            overlay.appendChild(progressContainer);
            
            // Create details element for additional info
            const detailsEl = document.createElement('div');
            detailsEl.id = 'progress-details';
            detailsEl.style.color = 'rgba(255, 255, 255, 0.7)';
            detailsEl.style.fontSize = '14px';
            detailsEl.style.fontFamily = 'Gabarito, sans-serif';
            detailsEl.style.textAlign = 'center';
            detailsEl.style.maxWidth = '80%';
            detailsEl.style.marginTop = '10px';
            overlay.appendChild(detailsEl);
        }
        
        // Update message
        const messageEl = document.getElementById('progress-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        // Show/hide progress bar
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = showProgressBar ? 'block' : 'none';
        }
        
        // Reset progress bar if showing
        if (showProgressBar) {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }
        
        // Reset details
        const detailsEl = document.getElementById('progress-details');
        if (detailsEl) {
            detailsEl.textContent = '';
        }
        
        return overlay;
    }
    
    function updateProgressOverlay(progress, detailMessage = '') {
        const progressBar = document.getElementById('progress-bar');
        const detailsEl = document.getElementById('progress-details');
        
        if (progressBar) {
            // Ensure progress is between 0-100
            const safeProgress = Math.max(0, Math.min(100, progress));
            progressBar.style.width = `${safeProgress}%`;
        }
        
        if (detailsEl && detailMessage) {
            detailsEl.textContent = detailMessage;
        }
    }
    
    function hideProgressOverlay() {
        const overlay = document.getElementById('progress-overlay');
        if (overlay) {
            // Fade out
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
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
            
            // Show loading progress overlay instead of inline loading message
            showProgressOverlay(`Searching for "${query}"...`);
            
            try {
                const results = await searchShow(query);
                
                // Briefly show results count
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
                
                // Set flag for search results
                hasSearchResults = (results && results.length > 0);
                
                // Always hide the return to grid button initially after a new search
                returnToGridBtn.style.display = 'none';
            } catch (err) {
                console.error('Search error:', err);
                hideProgressOverlay();
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
        
        // Show loading progress overlay with progress bar
        showProgressOverlay(`Loading Season ${seasonNumber}...`, true);
        updateProgressOverlay(5, 'Fetching season details');
        
        // Fetch season details
        const seasonData = await getSeasonDetails(currentShowData.id, seasonNumber);
        if (!seasonData) {
            hideProgressOverlay();
            return;
        }
        
        currentSeasonData = seasonData.episodes;
        updateProgressOverlay(15, `Found ${seasonData.episodes.length} episodes`);
        
        // Process episodes and create title cards
        await createEpisodeTitleCards(seasonData.episodes);
        
        // In TMDB mode, always show grid view
        if (isTMDBMode) {
            updateProgressOverlay(95, 'Rendering episode grid');
            renderEpisodeGrid();
            updateProgressOverlay(100, 'Complete!');
            setTimeout(() => {
                hideProgressOverlay();
                showGridView();
            }, 500); // Show 100% for a moment before hiding
        } else {
            // In manual mode (if TMDB wasn't used), show single card
            hideProgressOverlay();
            selectEpisode(0);
            showSingleCardView();
        }
    }
    
    // Function to create title cards for all episodes
    async function createEpisodeTitleCards(episodes) {
        episodeTitleCards = [];
        
        // Show progress overlay with current progress
        updateProgressOverlay(20, `Processing ${episodes.length} episodes...`);
        
        // Get current color values directly from Pickr instances to avoid timing issues
        const currentColors = {};
        if (Pickr.all) {
            Pickr.all.forEach(pickr => {
                const id = pickr._root.button.id;
                const colorValue = pickr.getColor().toHEXA().toString();
                
                if (id === 'text-color-pickr') {
                    currentColors.textColor = colorValue;
                } else if (id === 'info-color-pickr') {
                    currentColors.infoColor = colorValue;
                } else if (id === 'text-shadow-color-pickr') {
                    currentColors.textShadowColor = colorValue;
                } else if (id === 'text-outline-color-pickr') {
                    currentColors.textOutlineColor = colorValue;
                } else if (id === 'info-shadow-color-pickr') {
                    currentColors.infoShadowColor = colorValue;
                } else if (id === 'info-outline-color-pickr') {
                    currentColors.infoOutlineColor = colorValue;
                } else if (id === 'gradient-color-pickr') {
                    currentColors.gradientColor = colorValue;
                }
            });
        }
        
        // Fallback values if Pickr instances aren't available
        const fallbackColors = {
            textColor: '#ffffff',
            infoColor: '#ffffff',
            textShadowColor: '#000000',
            textOutlineColor: '#000000',
            infoShadowColor: '#000000',
            infoOutlineColor: '#000000',
            gradientColor: '#000000'
        };
        
        // Calculate total operations for progress tracking
        const totalOperations = episodes.length;
        let completedOperations = 0;
        
        for (const episode of episodes) {
            // Calculate and show current progress
            const progress = 20 + Math.floor((completedOperations / totalOperations) * 75); // Scale between 20-95%
            updateProgressOverlay(progress, `Loading episode ${episode.episode_number}: ${episode.name}`);
            
            // Create a title card configuration object
            const card = {
                title: episode.name,
                seasonNumber: String(episode.season_number).padStart(2, '0'),
                episodeNumber: String(episode.episode_number).padStart(2, '0'),
                thumbnailImg: null,
                canvasData: null,  // Will store the image data once rendered
                allImages: [],     // Will store all available images
                allImagePaths: [],  // Will store all image paths for reference
                
                // Add initial color and font settings using direct Pickr values instead of window variables
                currentSettings: {
                    fontFamily: fontFamily.value,
                    infoFontFamily: document.getElementById('info-font-family').value,
                    textSize: textSize.value,
                    infoTextSize: document.getElementById('info-text-size').value,
                    textShadowBlur: textShadowBlur.value,
                    textOutlineWidth: textOutlineWidth.value,
                    infoShadowBlur: document.getElementById('info-shadow-blur').value,
                    infoOutlineWidth: document.getElementById('info-outline-width').value,
                    titleInfoSpacing: titleInfoSpacing.value,
                    textColor: currentColors.textColor || fallbackColors.textColor,
                    infoColor: currentColors.infoColor || fallbackColors.infoColor,
                    textShadowColor: currentColors.textShadowColor || fallbackColors.textShadowColor,
                    textOutlineColor: currentColors.textOutlineColor || fallbackColors.textOutlineColor,
                    infoShadowColor: currentColors.infoShadowColor || fallbackColors.infoShadowColor,
                    infoOutlineColor: currentColors.infoOutlineColor || fallbackColors.infoOutlineColor,
                    effectType: effectType.value,
                    gradientColor: currentColors.gradientColor || fallbackColors.gradientColor,
                    gradientOpacity: gradientOpacity.value,
                    blendMode: blendMode.value
                }
            };
            
            // Try to load thumbnail image
            if (episode.still_path) {
                try {
                    updateProgressOverlay(progress, `Loading thumbnail for episode ${episode.episode_number}...`);
                    card.thumbnailImg = await getEpisodeThumbnail(episode.still_path);
                    card.allImagePaths.push(episode.still_path); // Store the default image path
                    
                    // Get all additional images for this episode
                    if (currentShowData && currentShowData.id) {
                        updateProgressOverlay(progress, `Checking for alternative images for episode ${episode.episode_number}...`);
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
                        
                        // Show additional images count in progress
                        if (card.allImagePaths.length > 1) {
                            updateProgressOverlay(progress, `Found ${card.allImagePaths.length} images for episode ${episode.episode_number}...`);
                        }
                        
                        // Load additional images if there are any (limit to 5 total for performance)
                        const imagesToLoad = card.allImagePaths.slice(0, 5);
                        for (let i = 0; i < imagesToLoad.length; i++) {
                            if (i === 0) { // First image already loaded as thumbnailImg
                                card.allImages.push(card.thumbnailImg);
                            } else {
                                try {
                                    updateProgressOverlay(progress, `Loading alternative image ${i}/${imagesToLoad.length-1} for episode ${episode.episode_number}...`);
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
                    updateProgressOverlay(progress, `Failed to load thumbnail for episode ${episode.episode_number}...`);
                }
            } else {
                updateProgressOverlay(progress, `No thumbnail available for episode ${episode.episode_number}...`);
            }
            
            episodeTitleCards.push(card);
            completedOperations++;
        }
        
        // Final progress update
        updateProgressOverlay(95, 'All episodes processed successfully! Preparing grid view...');
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
            const x = 20 + (col * (gridCardWidth + gridGap));
            const y = 50 + (row * (gridCardHeight + gridGap + 24));
            
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
        
        // IMPORTANT: Apply card's stored settings to window variables
        if (card.currentSettings) {
            // Apply color settings from the card to window variables
            window['text-color'] = card.currentSettings.textColor;
            window['info-color'] = card.currentSettings.infoColor;
            window['text-shadow-color'] = card.currentSettings.textShadowColor;
            window['text-outline-color'] = card.currentSettings.textOutlineColor;
            window['info-shadow-color'] = card.currentSettings.infoShadowColor;
            window['info-outline-color'] = card.currentSettings.infoOutlineColor;
            window['gradient-color'] = card.currentSettings.gradientColor;
            
            // Update Pickr instances with these colors if available
            if (Pickr.all) {
                Pickr.all.forEach(pickr => {
                    if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
                    
                    const id = pickr._root.button.id;
                    if (id === 'text-color-pickr') {
                        pickr.setColor(card.currentSettings.textColor);
                    } else if (id === 'info-color-pickr') {
                        pickr.setColor(card.currentSettings.infoColor);
                    } else if (id === 'text-shadow-color-pickr') {
                        pickr.setColor(card.currentSettings.textShadowColor);
                    } else if (id === 'text-outline-color-pickr') {
                        pickr.setColor(card.currentSettings.textOutlineColor);
                    } else if (id === 'info-shadow-color-pickr') {
                        pickr.setColor(card.currentSettings.infoShadowColor);
                    } else if (id === 'info-outline-color-pickr') {
                        pickr.setColor(card.currentSettings.infoOutlineColor);
                    } else if (id === 'gradient-color-pickr') {
                        pickr.setColor(card.currentSettings.gradientColor);
                    }
                });
            }
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
            const color = window['gradient-color'] || gradientColor;
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
        
        // Calculate info text size based on info-text-size dropdown
        let infoSize;
        const infoTextSize = document.getElementById('info-text-size');
        switch (infoTextSize.value) {
            case 'small': infoSize = Math.round(32 * (width / 1280)); break;
            case 'large': infoSize = Math.round(48 * (width / 1280)); break;
            default: infoSize = Math.round(36 * (width / 1280));
        }
        
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
        let tFont = ''; // Removing hardcoded bold styling
        
        // Fix for Exo 2 and other fonts that might render too small
        let fontSizeAdjustment = 1;
        if (fontFamily.value === 'Exo 2') {
            fontSizeAdjustment = 1.2; // Make Exo 2 20% larger
        }
        
        // Get the font family to use - either selected font or custom font
        const fontToUse = (fontFamily.value === 'custom-font' && window.customFontFamily) 
    ? window.customFontFamily 
    : fontFamily.value;
    
// Apply size adjustment to the font
tFont += `${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;
// Add this line to ensure the font is properly set before measuring/rendering
document.fonts.load(tFont);
targetCtx.font = tFont;
        
        // Text alignment
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'top';
        
        // Apply text effects - get color from the window object
        targetCtx.shadowColor = window['text-shadow-color'] || '#000000';
        targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
        targetCtx.shadowOffsetX = 2 * (width / 1280);
        targetCtx.shadowOffsetY = 2 * (height / 720);
        
        // Apply outline if specified
        if (parseInt(textOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(textOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window['text-outline-color'] || '#000000';
            targetCtx.strokeText(titleInput.value || '', textBoxX, textBoxY, maxWidth);
        }
        
        // Draw title text - get color from the window object
        targetCtx.fillStyle = window['text-color'] || '#ffffff'; 
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
                
                // Get the info font family
                const infoFontFamily = document.getElementById('info-font-family');
                let infoFontToUse;
                
                if (infoFontFamily.value === 'same-as-title') {
                    infoFontToUse = fontToUse;
                } else if (infoFontFamily.value === 'custom-font' && window.customFontFamily) {
                    infoFontToUse = window.customFontFamily;
                } else {
                    infoFontToUse = infoFontFamily.value;
                }
                
                // Set font for info text
                let iFont = '';
                
                // Apply the same size adjustment to info text for consistency
                let infoFontSizeAdjustment = 1;
                if (infoFontToUse === 'Exo 2') {
                    infoFontSizeAdjustment = 1.2; // Make Exo 2 20% larger
                }
                
                iFont += `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
                targetCtx.font = iFont;
                
                // Use same alignment as title
                targetCtx.textAlign = textAlign;
                targetCtx.textBaseline = 'top';
                
                // Get shadow and outline settings for info text
                const infoShadowBlur = document.getElementById('info-shadow-blur');
                const infoOutlineWidth = document.getElementById('info-outline-width');
                
                // Apply text effects for info text
                targetCtx.shadowColor = window['info-shadow-color'] || '#000000';
                targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
                targetCtx.shadowOffsetX = 1 * (width / 1280);
                targetCtx.shadowOffsetY = 1 * (height / 720);
                
                // Apply outline if specified
                if (parseInt(infoOutlineWidth.value) > 0) {
                    targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
                    targetCtx.strokeStyle = window['info-outline-color'] || '#000000';
                    targetCtx.strokeText(infoText, textBoxX, infoY, maxWidth);
                }
                
                // Draw info text
                targetCtx.fillStyle = window['info-color'] || '#ffffff';
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
    
    // Store original UI settings to restore later
    const originalFontFamily = fontFamily.value;
    const originalTextSize = textSize.value;
    const originalInfoFontFamily = document.getElementById('info-font-family').value;
    const originalInfoTextSize = document.getElementById('info-text-size').value;
    const originalTextShadowBlur = textShadowBlur.value;
    const originalTextOutlineWidth = textOutlineWidth.value;
    const originalInfoShadowBlur = document.getElementById('info-shadow-blur').value;
    const originalInfoOutlineWidth = document.getElementById('info-outline-width').value;
    const originalBlendMode = blendMode.value;
    const originalEffectType = effectType.value;
    
    // Save ALL original color values - important for preserving colors
    const originalColors = {};
    for (const colorName of ['text-color', 'info-color', 'text-shadow-color', 
                           'text-outline-color', 'info-shadow-color',
                           'info-outline-color', 'gradient-color']) {
        originalColors[colorName] = window[colorName];
    }
    
    // Set the card data temporarily
    titleInput.value = card.title;
    seasonNumberInput.value = card.seasonNumber;
    episodeNumberInput.value = card.episodeNumber;
    thumbnailImg = card.thumbnailImg;
    
    // Use card-specific settings if available
    if (card.currentSettings) {
        fontFamily.value = card.currentSettings.fontFamily;
        document.getElementById('info-font-family').value = card.currentSettings.infoFontFamily;
        textSize.value = card.currentSettings.textSize;
        document.getElementById('info-text-size').value = card.currentSettings.infoTextSize;
        textShadowBlur.value = card.currentSettings.textShadowBlur;
        textOutlineWidth.value = card.currentSettings.textOutlineWidth;
        document.getElementById('info-shadow-blur').value = card.currentSettings.infoShadowBlur;
        document.getElementById('info-outline-width').value = card.currentSettings.infoOutlineWidth;
        effectType.value = card.currentSettings.effectType;
        blendMode.value = card.currentSettings.blendMode;
        
        // IMPORTANT: Make sure color values are properly set from card settings
        // Log the colors being applied for debugging
        console.log("Applying colors to grid card:", {
            textColor: card.currentSettings.textColor,
            infoColor: card.currentSettings.infoColor
        });
        
        // Set color values directly from card settings
        window['text-color'] = card.currentSettings.textColor || '#ffffff';
        window['info-color'] = card.currentSettings.infoColor || '#ffffff';
        window['text-shadow-color'] = card.currentSettings.textShadowColor || '#000000';
        window['text-outline-color'] = card.currentSettings.textOutlineColor || '#000000';
        window['info-shadow-color'] = card.currentSettings.infoShadowColor || '#000000';
        window['info-outline-color'] = card.currentSettings.infoOutlineColor || '#000000';
        window['gradient-color'] = card.currentSettings.gradientColor || '#000000';
    }
    
    // Draw the card
    drawCardToContext(tempCtx, width, height);
    
    // Restore original values
    titleInput.value = originalTitle;
    seasonNumberInput.value = originalSeason;
    episodeNumberInput.value = originalEpisode;
    thumbnailImg = originalThumbnail;
    
    // Restore original UI settings
    fontFamily.value = originalFontFamily;
    textSize.value = originalTextSize;
    document.getElementById('info-font-family').value = originalInfoFontFamily;
    document.getElementById('info-text-size').value = originalInfoTextSize;
    textShadowBlur.value = originalTextShadowBlur;
    textOutlineWidth.value = originalTextOutlineWidth;
    document.getElementById('info-shadow-blur').value = originalInfoShadowBlur;
    document.getElementById('info-outline-width').value = originalInfoOutlineWidth;
    blendMode.value = originalBlendMode;
    effectType.value = originalEffectType;
    
    // Restore original color values
    for (const [colorName, value] of Object.entries(originalColors)) {
        window[colorName] = value;
    }
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
        infoFont: "same-as-title",
        textColor: "#ffffff",
        infoColor: "#ffffff",
        textSize: "normal",
        infoTextSize: "normal",
        textShadowBlur: 0,
        textOutlineWidth: 0,
        infoShadowBlur: 0,
        infoOutlineWidth: 0,
        titleInfoSpacing: 15,
        thumbnailFullsize: true,
        effectType: "none",
        gradientOpacity: 0.7,
        gradientColor: "#000000",
        blendMode: "overlay",
        shadowColor: "#000000",
        outlineColor: "#000000",
        infoShadowColor: "#000000",
        infoOutlineColor: "#000000"
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
        textSize.value = defaultValues.textSize;
        
        // Reset info text controls
        const infoFontFamily = document.getElementById('info-font-family');
        const infoTextSize = document.getElementById('info-text-size');
        if (infoFontFamily) infoFontFamily.value = defaultValues.infoFont;
        if (infoTextSize) infoTextSize.value = defaultValues.infoTextSize;
        
        // Reset sliders
        textShadowBlur.value = defaultValues.textShadowBlur;
        textOutlineWidth.value = defaultValues.textOutlineWidth;
        titleInfoSpacing.value = defaultValues.titleInfoSpacing;
        
        // Reset info text sliders
        const infoShadowBlur = document.getElementById('info-shadow-blur');
        const infoOutlineWidth = document.getElementById('info-outline-width');
        if (infoShadowBlur) infoShadowBlur.value = defaultValues.infoShadowBlur;
        if (infoOutlineWidth) infoOutlineWidth.value = defaultValues.infoOutlineWidth;
        
        // Update slider value displays
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
        updateSliderValueDisplay('title-info-spacing', 'spacing-value', 'px');
        
        // Reset other controls
        thumbnailFullsize.checked = defaultValues.thumbnailFullsize;
        effectType.value = defaultValues.effectType;
        gradientOpacity.value = defaultValues.gradientOpacity;
        blendMode.value = defaultValues.blendMode;
        
        // Reset color values
        textColor = defaultValues.textColor;
        infoColor = defaultValues.infoColor;
        textShadowColor = defaultValues.shadowColor;
        textOutlineColor = defaultValues.outlineColor;
        
        // Reset info text color values
        window['info-shadow-color'] = defaultValues.infoShadowColor;
        window['info-outline-color'] = defaultValues.infoOutlineColor;
        
        // Reset color pickers
        resetColorPickers();
        
        // Clear custom font options
        const customFontOption = document.getElementById('custom-font-option');
        const infoCustomOption = document.getElementById('info-custom-font-option');
        if (customFontOption) customFontOption.style.display = 'none';
        if (infoCustomOption) infoCustomOption.style.display = 'none';
        
        // Clear custom font data
        window.customFontFamily = null;
        
        // Reset custom font upload container text
        document.querySelector('.custom-font-upload-container').textContent = 'Upload Custom Font';
        
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
    
    // Reset all color pickers to default values
    function resetColorPickers() {
        // Find all pickr instances and reset them
        const allPickrs = Pickr.all;
        if (allPickrs) {
            for (const pickr of allPickrs) {
                const id = pickr._root.button.id;
                if (id === 'text-color-pickr') {
                    pickr.setColor(defaultValues.textColor);
                } else if (id === 'info-color-pickr') {
                    pickr.setColor(defaultValues.infoColor);
                } else if (id === 'text-shadow-color-pickr') {
                    pickr.setColor(defaultValues.shadowColor);
                } else if (id === 'text-outline-color-pickr') {
                    pickr.setColor(defaultValues.outlineColor);
                } else if (id === 'gradient-color-pickr') {
                    pickr.setColor(defaultValues.gradientColor);
                } else if (id === 'info-shadow-color-pickr') {
                    pickr.setColor(defaultValues.infoShadowColor);
                } else if (id === 'info-outline-color-pickr') {
                    pickr.setColor(defaultValues.infoOutlineColor);
                }
            }
        }
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
    
// Apply input event listeners to update the UI
titleInput.addEventListener('input', updateBothViews);
seasonNumberInput.addEventListener('input', updateBothViews);
episodeNumberInput.addEventListener('input', updateBothViews);
separatorType.addEventListener('change', updateBothViews);
presetSelect.addEventListener('change', updateBothViews);
// Remove the basic fontFamily listener since we'll replace it with an enhanced one
// fontFamily.addEventListener('change', updateBothViews); 
textSize.addEventListener('change', updateBothViews);
textShadowBlur.addEventListener('input', updateBothViews);
textOutlineWidth.addEventListener('input', updateBothViews);
titleInfoSpacing.addEventListener('input', updateBothViews);
thumbnailFullsize.addEventListener('change', updateBothViews);
effectType.addEventListener('change', function() {
    const gradientControls = document.getElementById('gradient-controls');
    
    if (effectType.value === 'none') {
        gradientControls.style.display = 'none';
    } else {
        gradientControls.style.display = 'block';
    }
    
    // Update both views after changing effect
    updateBothViews();
});
gradientOpacity.addEventListener('input', updateBothViews);
blendMode.addEventListener('change', updateBothViews);
// Define these elements once
const infoFontFamily = document.getElementById('info-font-family');
const infoTextSize = document.getElementById('info-text-size');
const infoShadowBlur = document.getElementById('info-shadow-blur');
const infoOutlineWidth = document.getElementById('info-outline-width');
// 1. First, modify the fontFamily event listener to ensure fonts are loaded before rendering
// Update the fontFamily event listener to properly maintain colors
fontFamily.addEventListener('change', function() {
    const selectedFont = fontFamily.value;
    
    // Capture current color values before changing anything
    const currentTextColor = window['text-color'];
    const currentInfoColor = window['info-color'];
    
    // Force font loading before drawing
    if (selectedFont !== 'custom-font') {
        // Create a temporary span to load the font
        const tempSpan = document.createElement('span');
        tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
        tempSpan.style.visibility = 'hidden';
        tempSpan.textContent = 'Font Loading Test';
        document.body.appendChild(tempSpan);
        
        // Give the font a moment to load, then update
        setTimeout(() => {
            document.body.removeChild(tempSpan);
            
            // Ensure colors are preserved
            window['text-color'] = currentTextColor;
            window['info-color'] = currentInfoColor;
            
            // First update the single card view
            drawCard();
            
            // Then make sure ALL cards in the grid get updated with the new font
            if (isTMDBMode && episodeTitleCards.length > 0) {
                updateEpisodeCardSettings();
                renderEpisodeGrid();
            }
        }, 50);
    } else {
        // Ensure colors are preserved
        window['text-color'] = currentTextColor;
        window['info-color'] = currentInfoColor;
        
        // For custom fonts, just update normally
        drawCard();
        if (isTMDBMode && episodeTitleCards.length > 0) {
            updateEpisodeCardSettings();
            renderEpisodeGrid();
        }
    }
});
// 2. Do the same for info font
if (infoFontFamily) {
    infoFontFamily.addEventListener('change', function() {
        const selectedFont = infoFontFamily.value;
        
        // Special case: "same-as-title" doesn't need pre-loading
        if (selectedFont !== 'custom-font' && selectedFont !== 'same-as-title') {
            // Create a temporary span to load the font
            const tempSpan = document.createElement('span');
            tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
            tempSpan.style.visibility = 'hidden';
            tempSpan.textContent = 'Font Loading Test';
            document.body.appendChild(tempSpan);
            
            // Give the font a moment to load, then update
            setTimeout(() => {
                document.body.removeChild(tempSpan);
                drawCard();
                if (isTMDBMode && episodeTitleCards.length > 0) {
                    updateEpisodeCardSettings();
                    renderEpisodeGrid();
                }
            }, 50);
        } else {
            // For custom fonts or same-as-title, just update normally
            drawCard();
            if (isTMDBMode && episodeTitleCards.length > 0) {
                updateEpisodeCardSettings();
                renderEpisodeGrid();
            }
        }
    });
}
// Add the rest of the input listeners
if (infoTextSize) infoTextSize.addEventListener('change', updateBothViews);
if (infoShadowBlur) infoShadowBlur.addEventListener('input', updateBothViews);
if (infoOutlineWidth) infoOutlineWidth.addEventListener('input', updateBothViews);
    
    // Initialize UI components
    initializeTextOptionsUI();
    initializePickrs();
    
    // Set canvas size
    canvas.width = 1280;
    canvas.height = 720;
    
    // Initial render
    drawCard();
    // Function to show toast notification
    function showToast(message, duration = 3000) {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create and show new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Set animation to show
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Set automatic removal
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            
            // Remove from DOM after fade out
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
});
