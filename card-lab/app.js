document.addEventListener('DOMContentLoaded', () => {
    
    const TMDB_API_KEY = '96c821c9e98fab6a43bff8021d508d1d'; 
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const TMDB_IMG_BASE_URL = 'https://image.tmdb.org/t/p/';
    
    window['text-color'] = '#ffffff';
    window['info-color'] = '#ffffff';
    window['text-shadow-color'] = '#000000';
    window['text-outline-color'] = '#000000';
    window['info-shadow-color'] = '#000000';
    window['info-outline-color'] = '#000000';
    window['gradient-color'] = '#000000';
    
    function initializeTextOptionsUI() {
        
        const customFontUploadContainer = document.querySelector('.custom-font-upload-container');
        const customFontUpload = document.getElementById('custom-font-upload');
        const fontFamily = document.getElementById('font-family');
        const infoFontFamily = document.getElementById('info-font-family');
        
        const thumbnailContainer = document.getElementById('thumbnail-container');
const thumbnailUpload = document.getElementById('thumbnail-upload');

if (thumbnailContainer && thumbnailUpload) {
    
    thumbnailContainer.addEventListener('click', () => {
        thumbnailUpload.click();
    });

    thumbnailUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const img = new Image();
            img.onload = () => {
                thumbnailImg = img; 
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
        
        if (customFontUploadContainer && customFontUpload) {
            customFontUploadContainer.addEventListener('click', () => {
                customFontUpload.click();
            });
            
            customFontUpload.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const fontName = file.name.split('.')[0]; 
                    customFontUploadContainer.textContent = file.name;
                    
                    const fontUrl = URL.createObjectURL(file);
                    const fontFace = new FontFace('CustomFont', `url(${fontUrl})`);
                    
                    fontFace.load().then(function(loadedFace) {
                        document.fonts.add(loadedFace);
                        
                        window.customFontFamily = 'CustomFont';
                        
                        const customFontOption = document.getElementById('custom-font-option');
                        if (customFontOption) {
                            customFontOption.style.display = 'block';
                            customFontOption.textContent = `Custom: ${fontName}`;
                            fontFamily.value = 'custom-font';
                        }
                        
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
        
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
        updateSliderValueDisplay('title-info-spacing', 'spacing-value', 'px');
        
        document.getElementById('text-shadow-blur').value = 0;
        document.getElementById('text-outline-width').value = 0;
        document.getElementById('info-shadow-blur').value = 0;
        document.getElementById('info-outline-width').value = 0;
        
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
    }
    
    function updateSliderValueDisplay(sliderId, valueId, unit) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (slider && valueDisplay) {
            
            valueDisplay.textContent = `${slider.value}${unit}`;
            
            slider.addEventListener('input', () => {
                valueDisplay.textContent = `${slider.value}${unit}`;
            });
        }
    }

function initializePickrs() {
    
    window['text-color'] = '#ffffff';
    window['info-color'] = '#ffffff';
    window['text-shadow-color'] = '#000000';
    window['text-outline-color'] = '#000000';
    window['info-shadow-color'] = '#000000';
    window['info-outline-color'] = '#000000';
    window['gradient-color'] = '#000000';

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

    const effectPickrOptions = {
        ...mainPickrOptions,
        position: 'top-start',
        padding: 10
    };

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

    textColorPickr.setColor(window['text-color']);
    infoColorPickr.setColor(window['info-color']);
    shadowColorPickr.setColor(window['text-shadow-color']);
    outlineColorPickr.setColor(window['text-outline-color']);
    infoShadowColorPickr.setColor(window['info-shadow-color']);
    infoOutlineColorPickr.setColor(window['info-outline-color']);
    gradientColorPickr.setColor(window['gradient-color']);

    setupPickrEvents(textColorPickr, 'text-color');
    setupPickrEvents(infoColorPickr, 'info-color');
    setupPickrEvents(shadowColorPickr, 'text-shadow-color');
    setupPickrEvents(outlineColorPickr, 'text-outline-color');
    setupPickrEvents(infoShadowColorPickr, 'info-shadow-color');
    setupPickrEvents(infoOutlineColorPickr, 'info-outline-color');
    setupPickrEvents(gradientColorPickr, 'gradient-color');
}

function setupPickrEvents(pickr, colorName) {
    
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

function updateCard() {
    drawCard();
}

function updateBothViews() {
    drawCard();
    if (isTMDBMode && episodeTitleCards.length > 0) {
        updateEpisodeCardSettings();
        renderEpisodeGrid();
    }
}
    
function updateEpisodeCardSettings() {
    
    if (!isTMDBMode || episodeTitleCards.length === 0) return;
    
    const currentColors = {};
    if (Pickr.all) {
        Pickr.all.forEach(pickr => {
            if (!pickr._root || !pickr._root.button || !pickr._root.button.id) return;
            
            const id = pickr._root.button.id;
            
            if (pickr.getColor && typeof pickr.getColor === 'function') {
                const colorValue = pickr.getColor().toHEXA().toString();
                
                if (id === 'text-color-pickr') {
                    currentColors.textColor = colorValue;
                    
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
    
    const fallbackColors = {
        textColor: window['text-color'] || '#ffffff',
        infoColor: window['info-color'] || '#ffffff',
        textShadowColor: window['text-shadow-color'] || '#000000',
        textOutlineColor: window['text-outline-color'] || '#000000',
        infoShadowColor: window['info-shadow-color'] || '#000000',
        infoOutlineColor: window['info-outline-color'] || '#000000',
        gradientColor: window['gradient-color'] || '#000000'
    };
    
    for (const card of episodeTitleCards) {
        
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
            titleWrapping: document.getElementById('title-wrapping').value,
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
    
    const canvas = document.getElementById('titlecard-canvas');
    const gridCanvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    const gridCtx = gridCanvas.getContext('2d');
    
    const titleInput = document.getElementById('title-text');
    const seasonNumberInput = document.getElementById('season-number');
    const episodeNumberInput = document.getElementById('episode-number');
    const separatorType = document.getElementById('separator-type');
    
    const presetSelect = document.getElementById('preset-select');
    const fontFamily = document.getElementById('font-family');
    const textSize = document.getElementById('text-size');
    const textShadowBlur = document.getElementById('text-shadow-blur');
    const textOutlineWidth = document.getElementById('text-outline-width');
    const titleInfoSpacing = document.getElementById('title-info-spacing');
    const titleWrapping = document.getElementById('title-wrapping');
    
    const thumbnailInput = document.getElementById('thumbnail-upload');
    const thumbnailFullsize = document.getElementById('thumbnail-fullsize');
    
    const effectType = document.getElementById('effect-type');
    const gradientOpacity = document.getElementById('gradient-opacity');
    const blendMode = document.getElementById('blend-mode');
    
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const loadConfigBtn = document.getElementById('loadConfigBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const returnToGridBtn = document.getElementById('returnToGridBtn');
    
    let currentShowData = null;
    let currentSeasonData = [];
    let currentSeasonNumber = 1;
    let episodeTitleCards = [];
    let selectedCardIndex = -1;
    let isTMDBMode = false;
    let thumbnailImg = null;
    let hasSearchResults = false;
    
    let gridCardWidth = 240;
    let gridCardHeight = 135;
    let gridGap = 10;
    let gridColumns = 4;
    
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
    
    function showProgressOverlay(message, showProgressBar = false) {
        
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
            
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }
            
            const messageEl = document.createElement('div');
            messageEl.id = 'progress-message';
            messageEl.style.color = 'white';
            messageEl.style.fontSize = '16px';
            messageEl.style.fontFamily = 'Gabarito, sans-serif';
            messageEl.style.textAlign = 'center';
            messageEl.style.maxWidth = '80%';
            messageEl.style.margin = '0 0 20px 0';
            overlay.appendChild(messageEl);
            
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
        
        const messageEl = document.getElementById('progress-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = showProgressBar ? 'block' : 'none';
        }
        
        if (showProgressBar) {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }
        
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
            img.crossOrigin = 'Anonymous'; 
            
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
    
    const searchForm = document.getElementById('show-search-form');
    const searchInput = document.getElementById('show-search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
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
                
                hasSearchResults = (results && results.length > 0);
                
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
                
                document.getElementById('season-selector').innerHTML = '<div class="loading">Loading show details...</div>';
                
                await selectShow(show.id);
                
                resultsContainer.innerHTML = '';
                searchInput.value = show.name;
            });
            
            resultsContainer.appendChild(showEl);
        });
    }
    
    async function selectShow(showId) {
        const showDetails = await getShowDetails(showId);
        if (!showDetails) return;
        
        currentShowData = showDetails;
        isTMDBMode = true; 
        hasSearchResults = true; 
        
        displaySeasonSelector(showDetails);
        
        await selectSeason(1);
        
        showGridView();
    }
    
    function displaySeasonSelector(show) {
        const seasonSelector = document.getElementById('season-selector');
        seasonSelector.innerHTML = '';
        
        if (show.seasons.length === 0) {
            seasonSelector.innerHTML = '<div class="no-results">No seasons found</div>';
            return;
        }
        
        const selectEl = document.createElement('select');
        selectEl.id = 'season-select';
        
        const seasons = show.seasons.filter(s => s.season_number > 0 || show.seasons.length === 1);
        
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_number;
            option.textContent = `Season ${season.season_number} (${season.episode_count} episodes)`;
            selectEl.appendChild(option);
        });
        
        selectEl.addEventListener('change', () => {
            const selectedSeason = parseInt(selectEl.value);
            selectSeason(selectedSeason);
        });
        
        seasonSelector.appendChild(selectEl);
    }
    
    async function selectSeason(seasonNumber) {
        currentSeasonNumber = seasonNumber;
        
        showProgressOverlay(`Loading Season ${seasonNumber}...`, true);
        updateProgressOverlay(5, 'Fetching season details');
        
        const seasonData = await getSeasonDetails(currentShowData.id, seasonNumber);
        if (!seasonData) {
            hideProgressOverlay();
            return;
        }
        
        currentSeasonData = seasonData.episodes;
        updateProgressOverlay(15, `Found ${seasonData.episodes.length} episodes`);
        
        await createEpisodeTitleCards(seasonData.episodes);
        
        if (isTMDBMode) {
            updateProgressOverlay(95, 'Rendering episode grid');
            renderEpisodeGrid();
            updateProgressOverlay(100, 'Complete!');
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
    
    async function createEpisodeTitleCards(episodes) {
        episodeTitleCards = [];
        
        updateProgressOverlay(20, `Processing ${episodes.length} episodes...`);
        
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
        
        const fallbackColors = {
            textColor: '#ffffff',
            infoColor: '#ffffff',
            textShadowColor: '#000000',
            textOutlineColor: '#000000',
            infoShadowColor: '#000000',
            infoOutlineColor: '#000000',
            gradientColor: '#000000'
        };
        
        const totalOperations = episodes.length;
        let completedOperations = 0;
        
        for (const episode of episodes) {
            
            const progress = 20 + Math.floor((completedOperations / totalOperations) * 75); 
            updateProgressOverlay(progress, `Loading episode ${episode.episode_number}: ${episode.name}`);
            
            const card = {
                title: episode.name,
                seasonNumber: String(episode.season_number).padStart(2, '0'),
                episodeNumber: String(episode.episode_number).padStart(2, '0'),
                thumbnailImg: null,
                canvasData: null,  
                allImages: [],     
                allImagePaths: [],  
                
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
            
            if (episode.still_path) {
                try {
                    updateProgressOverlay(progress, `Loading thumbnail for episode ${episode.episode_number}...`);
                    card.thumbnailImg = await getEpisodeThumbnail(episode.still_path);
                    card.allImagePaths.push(episode.still_path); 
                    
                    if (currentShowData && currentShowData.id) {
                        updateProgressOverlay(progress, `Checking for alternative images for episode ${episode.episode_number}...`);
                        const additionalImages = await getEpisodeImages(
                            currentShowData.id, 
                            episode.season_number, 
                            episode.episode_number
                        );
                        
                        for (const img of additionalImages) {
                            if (img.file_path && img.file_path !== episode.still_path) {
                                card.allImagePaths.push(img.file_path);
                            }
                        }
                        
                        if (card.allImagePaths.length > 1) {
                            updateProgressOverlay(progress, `Found ${card.allImagePaths.length} images for episode ${episode.episode_number}...`);
                        }
                        
                        const imagesToLoad = card.allImagePaths.slice(0, 5);
                        for (let i = 0; i < imagesToLoad.length; i++) {
                            if (i === 0) { 
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
        
        updateProgressOverlay(95, 'All episodes processed successfully! Preparing grid view...');
    }
    
    function renderEpisodeGrid() {
        if (episodeTitleCards.length === 0) return;
        
        const maxColumns = 4;
        
        const availableWidth = Math.min(window.innerWidth - 360, 2000); 
        
        let cardWidth = Math.floor((availableWidth * 0.9) / maxColumns) - 10;
        cardWidth = Math.max(cardWidth, 280);
        
        const cardGap = Math.floor(availableWidth * 0.01); 
        
        let columns;
        if (episodeTitleCards.length <= 3) {
            columns = episodeTitleCards.length;
            
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
        
        gridCardHeight = Math.floor(gridCardWidth * (9/16));
        
        const rows = Math.ceil(episodeTitleCards.length / columns);
        
        const totalWidth = (columns * gridCardWidth) + ((columns - 1) * cardGap);
        const totalHeight = (rows * (gridCardHeight + 24)) + ((rows - 1) * cardGap) + 50; 
        
        gridCanvas.width = totalWidth + 40; 
        gridCanvas.height = totalHeight + 30; 
        
        gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
        
        gridCtx.fillStyle = '#10102a';
        gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
        
        gridCtx.font = 'bold 24px Gabarito, sans-serif';
        gridCtx.fillStyle = '#ffffff';
        gridCtx.textAlign = 'center';
        gridCtx.fillText(
            `${currentShowData.name} - Season ${currentSeasonNumber}`, 
            gridCanvas.width / 2, 
            30
        );
        
        episodeTitleCards.forEach((card, index) => {
            
            const row = Math.floor(index / columns);
            const col = index % columns;
            const x = 20 + (col * (gridCardWidth + gridGap));
            const y = 50 + (row * (gridCardHeight + gridGap + 24));
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = gridCardWidth;
            tempCanvas.height = gridCardHeight;
            const tempCtx = tempCanvas.getContext('2d');
            
            drawCardToTempContext(tempCtx, card, gridCardWidth, gridCardHeight);
            
            gridCtx.drawImage(tempCanvas, x, y);
            
            gridCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            gridCtx.fillRect(x, y, 50, 16);
            
            gridCtx.font = 'bold 10px Gabarito, sans-serif';
            gridCtx.fillStyle = '#00bfa5';
            gridCtx.textAlign = 'left';
            gridCtx.fillText(`S${card.seasonNumber}E${card.episodeNumber}`, x + 4, y + 12);
            
            gridCtx.font = '12px Gabarito, sans-serif';
            gridCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            gridCtx.textAlign = 'center';
            gridCtx.fillText(card.title, x + (gridCardWidth / 2), y + gridCardHeight + 16, gridCardWidth);
            
            card.gridCoords = {
                x: x,
                y: y,
                width: gridCardWidth,
                height: gridCardHeight
            };
        });
        
        if (!gridCanvas.onclick) {
            gridCanvas.onclick = handleGridCanvasClick;
        }
    }
    
    function selectEpisode(index) {
        if (index < 0 || index >= episodeTitleCards.length) return;
        
        selectedCardIndex = index;
        const card = episodeTitleCards[index];
        
        titleInput.value = card.title;
        seasonNumberInput.value = card.seasonNumber;
        episodeNumberInput.value = card.episodeNumber;
        
        if (card.thumbnailImg) {
            thumbnailImg = card.thumbnailImg;
        }
        
        if (card.currentSettings) {
            
            window['text-color'] = card.currentSettings.textColor;
            window['info-color'] = card.currentSettings.infoColor;
            window['text-shadow-color'] = card.currentSettings.textShadowColor;
            window['text-outline-color'] = card.currentSettings.textOutlineColor;
            window['info-shadow-color'] = card.currentSettings.infoShadowColor;
            window['info-outline-color'] = card.currentSettings.infoOutlineColor;
            window['gradient-color'] = card.currentSettings.gradientColor;
            
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
        
        displayAlternativeImages(card);
        
        drawCard();
    }
    
    function displayAlternativeImages(card) {
        const altImagesContainer = document.getElementById('alt-images-container');
        const altImagesInfo = document.getElementById('alt-images-info');
        
        altImagesContainer.innerHTML = '';
        
        if (!card.allImages || card.allImages.length <= 1) {
            
            altImagesInfo.textContent = 'No alternative images available for this episode';
            return;
        }
        
        altImagesInfo.textContent = `${card.allImages.length} images available - click to select`;
        
        card.allImages.forEach((img, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'alt-image-item';
            if (card.thumbnailImg === img) {
                imageItem.classList.add('selected');
            }
            
            const imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = `Alternative image ${index + 1}`;
            imageItem.appendChild(imgEl);
            
            const badge = document.createElement('span');
            badge.className = 'image-badge';
            badge.textContent = index + 1;
            imageItem.appendChild(badge);
            
            imageItem.addEventListener('click', () => {
                
                thumbnailImg = img;
                card.thumbnailImg = img;
                
                document.querySelectorAll('.alt-image-item').forEach(item => {
                    item.classList.remove('selected');
                });
                imageItem.classList.add('selected');
                
                drawCard();
            });
            
            altImagesContainer.appendChild(imageItem);
        });
        
        document.querySelector('.collapsible:nth-child(1)').classList.add('active');
    }
    
    function handleGridCanvasClick(event) {
        
        const rect = gridCanvas.getBoundingClientRect();
        const scaleX = gridCanvas.width / rect.width;
        const scaleY = gridCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        for (let i = 0; i < episodeTitleCards.length; i++) {
            const card = episodeTitleCards[i];
            if (card.gridCoords) {
                const { x: cardX, y: cardY, width: cardWidth, height: cardHeight } = card.gridCoords;
                
                if (x >= cardX && x <= cardX + cardWidth && 
                    y >= cardY && y <= cardY + cardHeight) {
                    
                    selectEpisode(i);
                    showSingleCardView();
                    return;
                }
            }
        }
    }
    
    function showSingleCardView() {
        canvas.style.display = 'block';
        gridCanvas.style.display = 'none';
        
        if (hasSearchResults) {
            returnToGridBtn.style.display = 'flex';
        } else {
            returnToGridBtn.style.display = 'none';
        }
    }
    
    function showGridView() {
        canvas.style.display = 'none';
        gridCanvas.style.display = 'block';
        returnToGridBtn.style.display = 'none';
    }
    
    function drawCardToContext(targetCtx, width, height) {
        
        targetCtx.clearRect(0, 0, width, height);
        
        targetCtx.fillStyle = '#000000';
        targetCtx.fillRect(0, 0, width, height);
        
        if (thumbnailImg) {
            targetCtx.save();
            
            targetCtx.globalAlpha = 1.0; 
            
            if (thumbnailFullsize && thumbnailFullsize.checked) {
                
                targetCtx.drawImage(thumbnailImg, 0, 0, width, height);
            } else {
                
                const scale = 1.0; 
                let w, h;
                
                if (thumbnailImg.width / thumbnailImg.height > width / height) {
                    
                    h = height * scale;
                    w = thumbnailImg.width * (h / thumbnailImg.height);
                } else {
                    
                    w = width * scale;
                    h = thumbnailImg.height * (w / thumbnailImg.width);
                }
                
                const x = (width - w) / 2;
                const y = (height - h) / 2;
                
                targetCtx.drawImage(thumbnailImg, x, y, w, h);
            }
            
            targetCtx.restore();
        }
        
        if (effectType.value !== 'none') {
            
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
                    
                    gradient = effectCtx.createRadialGradient(
                        width / 2, height / 2, 0,
                        width / 2, height / 2, Math.max(width, height) / 1.5
                    );
                    gradient.addColorStop(0, transparentColor);
                    gradient.addColorStop(1, alphaColor);
                    break;
            }
            
            effectCtx.fillStyle = gradient;
            effectCtx.fillRect(0, 0, width, height);
            
            targetCtx.save();
            targetCtx.globalCompositeOperation = blendMode.value;
            targetCtx.drawImage(effectCanvas, 0, 0);
            targetCtx.restore();
        }
        
        const preset = presetLayoutConfig[presetSelect.value] || presetLayoutConfig['centerMiddle'];
        
        let titleSize;
        switch (textSize.value) {
            case 'small': titleSize = Math.round(56 * (width / 1280)); break;
            case 'large': titleSize = Math.round(86 * (width / 1280)); break;
            default: titleSize = Math.round(72 * (width / 1280));
        }
        
        let infoSize;
        const infoTextSize = document.getElementById('info-text-size');
        switch (infoTextSize.value) {
            case 'small': infoSize = Math.round(32 * (width / 1280)); break;
            case 'large': infoSize = Math.round(48 * (width / 1280)); break;
            default: infoSize = Math.round(36 * (width / 1280));
        }
        
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
        
        targetCtx.save();
        
        let tFont = ''; 
        
        let fontSizeAdjustment = 1;
        if (fontFamily.value === 'Exo 2') {
            fontSizeAdjustment = 1.2; 
        }
        
        const fontToUse = (fontFamily.value === 'custom-font' && window.customFontFamily) 
    ? window.customFontFamily 
    : fontFamily.value;
    
tFont += `${Math.round(titleSize * fontSizeAdjustment)}px "${fontToUse}", sans-serif`;

document.fonts.load(tFont);
targetCtx.font = tFont;
        
        targetCtx.textAlign = textAlign;
        targetCtx.textBaseline = 'top';
        
        targetCtx.shadowColor = window['text-shadow-color'] || '#000000';
        targetCtx.shadowBlur = parseInt(textShadowBlur.value) * (width / 1280);
        targetCtx.shadowOffsetX = 2 * (width / 1280);
        targetCtx.shadowOffsetY = 2 * (height / 720);
        
const titleText = titleInput.value || '';
targetCtx.fillStyle = window['text-color'] || '#ffffff';

const titleWrappingMode = document.getElementById('title-wrapping') ? 
    document.getElementById('title-wrapping').value : 'singleLine';
const shouldWrap = titleWrappingMode === 'multiLine';

let actualInfoY;

if (shouldWrap && titleText.length > 20) {
    
    const lineHeight = Math.round(titleSize * 1.2);
    
    const wrapText = (text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = targetCtx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    };
    
    const lines = wrapText(titleText, maxWidth);
    
    const totalTextHeight = lines.length * lineHeight;
    let startY;
    
    if (preset.position.includes('Top')) {
        
        startY = textBoxY;
    } else if (preset.position.includes('Bottom')) {
        
        startY = textBoxY - totalTextHeight + lineHeight;
    } else {
        
        startY = textBoxY - (totalTextHeight / 2) + (titleSize / 2);
    }
    
    lines.forEach((line, index) => {
        const y = startY + (index * lineHeight);
        
        if (parseInt(textOutlineWidth.value) > 0) {
            targetCtx.lineWidth = parseInt(textOutlineWidth.value) * (width / 1280);
            targetCtx.strokeStyle = window['text-outline-color'] || '#000000';
            targetCtx.strokeText(line, textBoxX, y, maxWidth);
        }
        
        targetCtx.fillText(line, textBoxX, y, maxWidth);
    });
    
    const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
    actualInfoY = startY + totalTextHeight + spacing;
} else {
    
    if (parseInt(textOutlineWidth.value) > 0) {
        targetCtx.lineWidth = parseInt(textOutlineWidth.value) * (width / 1280);
        targetCtx.strokeStyle = window['text-outline-color'] || '#000000';
        targetCtx.strokeText(titleText, textBoxX, textBoxY, maxWidth);
    }
    
    targetCtx.fillText(titleText, textBoxX, textBoxY, maxWidth);
    
    const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
    actualInfoY = textBoxY + titleSize + spacing;
}

targetCtx.restore();
        
        if (seasonNumberInput.value || episodeNumberInput.value) {
            const spacing = parseInt(titleInfoSpacing.value) * (height / 720);
            let infoY = actualInfoY;
            
            let infoText = '';
            let separator = '';
            
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
                
                const infoFontFamily = document.getElementById('info-font-family');
                let infoFontToUse;
                
                if (infoFontFamily.value === 'same-as-title') {
                    infoFontToUse = fontToUse;
                } else if (infoFontFamily.value === 'custom-font' && window.customFontFamily) {
                    infoFontToUse = window.customFontFamily;
                } else {
                    infoFontToUse = infoFontFamily.value;
                }
                
                let iFont = '';
                
                let infoFontSizeAdjustment = 1;
                if (infoFontToUse === 'Exo 2') {
                    infoFontSizeAdjustment = 1.2; 
                }
                
                iFont += `${Math.round(infoSize * infoFontSizeAdjustment)}px "${infoFontToUse}", sans-serif`;
                targetCtx.font = iFont;
                
                targetCtx.textAlign = textAlign;
                targetCtx.textBaseline = 'top';
                
                const infoShadowBlur = document.getElementById('info-shadow-blur');
                const infoOutlineWidth = document.getElementById('info-outline-width');
                
                targetCtx.shadowColor = window['info-shadow-color'] || '#000000';
                targetCtx.shadowBlur = parseInt(infoShadowBlur.value) * (width / 1280);
                targetCtx.shadowOffsetX = 1 * (width / 1280);
                targetCtx.shadowOffsetY = 1 * (height / 720);
                
                if (parseInt(infoOutlineWidth.value) > 0) {
                    targetCtx.lineWidth = parseInt(infoOutlineWidth.value) * (width / 1280);
                    targetCtx.strokeStyle = window['info-outline-color'] || '#000000';
                    targetCtx.strokeText(infoText, textBoxX, infoY, maxWidth);
                }
                
                targetCtx.fillStyle = window['info-color'] || '#ffffff';
                targetCtx.fillText(infoText, textBoxX, infoY, maxWidth);
                targetCtx.restore();
            }
        }
    }
    
    function hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    const presetLayoutConfig = {
        
        centerMiddle: {
            position: 'centerMiddle',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'none',
            textShadowBlur: 8
        },
        
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
        
        giggle: {
            position: 'centerBottom',
            textColor: '#FFFFFF',
            infoColor: '#CCCCCC',
            textSize: 'normal',
            textBold: true,
            effectType: 'none',
            textShadowBlur: 10
        },
        
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
    
function drawCardToTempContext(tempCtx, card, width, height) {
    
    const originalTitle = titleInput.value;
    const originalSeason = seasonNumberInput.value;
    const originalEpisode = episodeNumberInput.value;
    const originalThumbnail = thumbnailImg;
    
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
    
    const originalColors = {};
    for (const colorName of ['text-color', 'info-color', 'text-shadow-color', 
                           'text-outline-color', 'info-shadow-color',
                           'info-outline-color', 'gradient-color']) {
        originalColors[colorName] = window[colorName];
    }
    
    titleInput.value = card.title;
    seasonNumberInput.value = card.seasonNumber;
    episodeNumberInput.value = card.episodeNumber;
    thumbnailImg = card.thumbnailImg;
    
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

    if (document.getElementById('title-wrapping')) {
        document.getElementById('title-wrapping').value = card.currentSettings.titleWrapping || 'singleLine';
    }
        
        console.log("Applying colors to grid card:", {
            textColor: card.currentSettings.textColor,
            infoColor: card.currentSettings.infoColor
        });
        
        window['text-color'] = card.currentSettings.textColor || '#ffffff';
        window['info-color'] = card.currentSettings.infoColor || '#ffffff';
        window['text-shadow-color'] = card.currentSettings.textShadowColor || '#000000';
        window['text-outline-color'] = card.currentSettings.textOutlineColor || '#000000';
        window['info-shadow-color'] = card.currentSettings.infoShadowColor || '#000000';
        window['info-outline-color'] = card.currentSettings.infoOutlineColor || '#000000';
        window['gradient-color'] = card.currentSettings.gradientColor || '#000000';
    }
    
    drawCardToContext(tempCtx, width, height);
    
    titleInput.value = originalTitle;
    seasonNumberInput.value = originalSeason;
    episodeNumberInput.value = originalEpisode;
    thumbnailImg = originalThumbnail;
    
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
    
    for (const [colorName, value] of Object.entries(originalColors)) {
        window[colorName] = value;
    }
}
    
    async function batchDownloadTitleCards() {
        
        if (!window.JSZip) {
            alert('Loading required library for batch download...');
            await loadJSZip();
        }
        
        const zip = new JSZip();
        const showName = currentShowData.name.replace(/[^\w\s]/gi, '');
        const seasonFolder = zip.folder(`${showName} - Season ${currentSeasonNumber}`);
        
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
        
        const promises = episodeTitleCards.map((card, index) => {
            return new Promise(resolve => {
                const episodeCanvas = document.createElement('canvas');
                episodeCanvas.width = 1280;  
                episodeCanvas.height = 720;
                
                drawCardToTempContext(episodeCanvas.getContext('2d'), card, 1280, 720);
                
                episodeCanvas.toBlob(blob => {
                    const filename = `S${card.seasonNumber}E${card.episodeNumber} - ${card.title.replace(/[/\\?%*:|"<>]/g, '-')}.png`;
                    seasonFolder.file(filename, blob);
                    resolve();
                }, 'image/png');
            });
        });
        
        try {
            
            await Promise.all(promises);
            
            const content = await zip.generateAsync({ type: 'blob' });
            document.body.removeChild(loadingMsg);
            
            const link = document.createElement('a');
            link.download = `${showName} - Season ${currentSeasonNumber} Title Cards.zip`;
            link.href = URL.createObjectURL(content);
            link.click();
            
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
        titleWrapping: "singleLine",
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
    
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        
        titleInput.value = defaultValues.title;
        seasonNumberInput.value = defaultValues.seasonNumber;
        episodeNumberInput.value = defaultValues.episodeNumber;
        separatorType.value = defaultValues.separator;
        fontFamily.value = defaultValues.font;
        textSize.value = defaultValues.textSize;
        
        const infoFontFamily = document.getElementById('info-font-family');
        const infoTextSize = document.getElementById('info-text-size');
        if (infoFontFamily) infoFontFamily.value = defaultValues.infoFont;
        if (infoTextSize) infoTextSize.value = defaultValues.infoTextSize;
        
        textShadowBlur.value = defaultValues.textShadowBlur;
        textOutlineWidth.value = defaultValues.textOutlineWidth;
        titleInfoSpacing.value = defaultValues.titleInfoSpacing;
        
        const infoShadowBlur = document.getElementById('info-shadow-blur');
        const infoOutlineWidth = document.getElementById('info-outline-width');
        if (infoShadowBlur) infoShadowBlur.value = defaultValues.infoShadowBlur;
        if (infoOutlineWidth) infoOutlineWidth.value = defaultValues.infoOutlineWidth;

        if (document.getElementById('title-wrapping')) {
            document.getElementById('title-wrapping').value = defaultValues.titleWrapping;
        }
        
        updateSliderValueDisplay('text-shadow-blur', 'shadow-value', 'px');
        updateSliderValueDisplay('text-outline-width', 'outline-value', 'px');
        updateSliderValueDisplay('info-shadow-blur', 'info-shadow-value', 'px');
        updateSliderValueDisplay('info-outline-width', 'info-outline-value', 'px');
        updateSliderValueDisplay('title-info-spacing', 'spacing-value', 'px');
        
        thumbnailFullsize.checked = defaultValues.thumbnailFullsize;
        effectType.value = defaultValues.effectType;
        gradientOpacity.value = defaultValues.gradientOpacity;
        blendMode.value = defaultValues.blendMode;
        
        textColor = defaultValues.textColor;
        infoColor = defaultValues.infoColor;
        textShadowColor = defaultValues.shadowColor;
        textOutlineColor = defaultValues.outlineColor;
        
        window['info-shadow-color'] = defaultValues.infoShadowColor;
        window['info-outline-color'] = defaultValues.infoOutlineColor;
        
        resetColorPickers();
        
        const customFontOption = document.getElementById('custom-font-option');
        const infoCustomOption = document.getElementById('info-custom-font-option');
        if (customFontOption) customFontOption.style.display = 'none';
        if (infoCustomOption) infoCustomOption.style.display = 'none';
        
        window.customFontFamily = null;
        
        document.querySelector('.custom-font-upload-container').textContent = 'Upload Custom Font';
        
        thumbnailImg = null;
        
        if (effectType.value === 'none') {
            document.getElementById('gradient-controls').style.display = 'none';
        }
        
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('season-selector').innerHTML = '';
        document.getElementById('alt-images-container').innerHTML = '';
        document.getElementById('alt-images-info').textContent = 'Select an episode to see available images';
        document.getElementById('show-search-input').value = '';
        
        currentShowData = null;
        currentSeasonData = [];
        episodeTitleCards = [];
        selectedCardIndex = -1;
        isTMDBMode = false;
        hasSearchResults = false;
        
        showSingleCardView();
        returnToGridBtn.style.display = 'none';
        
        updateBothViews();
        
        showToast("Title card has been reset to defaults");
    });
    
    function resetColorPickers() {
        
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
    
    downloadBtn.addEventListener('click', () => {
        
        if (canvas.style.display === 'block') {
            
            downloadSingleCard();
        } else if (hasSearchResults && episodeTitleCards.length > 0) {
            
            batchDownloadTitleCards();
        } else {
            
            downloadSingleCard();
        }
    });
    
    function downloadSingleCard() {
        
        let filename = 'title-card.png';
        if (titleInput.value) {
            filename = titleInput.value.replace(/[/\\?%*:|"<>]/g, '-');
            if (seasonNumberInput.value && episodeNumberInput.value) {
                filename = `S${seasonNumberInput.value}E${episodeNumberInput.value} - ${filename}`;
            }
            filename += '.png';
        }
        
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
        
        showToast("Title card downloaded successfully");
    }
    
    returnToGridBtn.addEventListener('click', () => {
        renderEpisodeGrid(); 
        showGridView();
    });
    
    function drawCard() {
        drawCardToContext(ctx, canvas.width, canvas.height);
    }
    
    returnToGridBtn.style.display = 'none';
    
    drawCard();
    
    function calculateGridDimensions(episodeCount) {
        
        if (episodeCount <= 4) {
            gridColumns = episodeCount;
            gridCardWidth = 270;
        } else if (episodeCount <= 8) {
            gridColumns = Math.min(4, episodeCount);
            gridCardWidth = 260;
        } else if (episodeCount <= 16) {
            gridColumns = 5; 
            gridCardWidth = 230;
        } else {
            gridColumns = 6; 
            gridCardWidth = 210;
        }
        
        const rows = Math.ceil(episodeCount / gridColumns);
        
        gridCardHeight = Math.round(gridCardWidth * (9/16));
        
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
    
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.parentElement;
            const content = header.nextElementSibling;
            const icon = header.querySelector('.toggle-icon');
            
            parent.classList.toggle('active');
            
        });
    });
    
titleInput.addEventListener('input', updateBothViews);
seasonNumberInput.addEventListener('input', updateBothViews);
episodeNumberInput.addEventListener('input', updateBothViews);
separatorType.addEventListener('change', updateBothViews);
presetSelect.addEventListener('change', updateBothViews);

textSize.addEventListener('change', updateBothViews);
titleWrapping.addEventListener('change', updateBothViews);
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
    
    updateBothViews();
});
gradientOpacity.addEventListener('input', updateBothViews);
blendMode.addEventListener('change', updateBothViews);

const infoFontFamily = document.getElementById('info-font-family');
const infoTextSize = document.getElementById('info-text-size');
const infoShadowBlur = document.getElementById('info-shadow-blur');
const infoOutlineWidth = document.getElementById('info-outline-width');

fontFamily.addEventListener('change', function() {
    const selectedFont = fontFamily.value;
    
    const currentTextColor = window['text-color'];
    const currentInfoColor = window['info-color'];
    
    if (selectedFont !== 'custom-font') {
        
        const tempSpan = document.createElement('span');
        tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
        tempSpan.style.visibility = 'hidden';
        tempSpan.textContent = 'Font Loading Test';
        document.body.appendChild(tempSpan);
        
        setTimeout(() => {
            document.body.removeChild(tempSpan);
            
            window['text-color'] = currentTextColor;
            window['info-color'] = currentInfoColor;
            
            drawCard();
            
            if (isTMDBMode && episodeTitleCards.length > 0) {
                updateEpisodeCardSettings();
                renderEpisodeGrid();
            }
        }, 50);
    } else {
        
        window['text-color'] = currentTextColor;
        window['info-color'] = currentInfoColor;
        
        drawCard();
        if (isTMDBMode && episodeTitleCards.length > 0) {
            updateEpisodeCardSettings();
            renderEpisodeGrid();
        }
    }
});

if (infoFontFamily) {
    infoFontFamily.addEventListener('change', function() {
        const selectedFont = infoFontFamily.value;
        
        if (selectedFont !== 'custom-font' && selectedFont !== 'same-as-title') {
            
            const tempSpan = document.createElement('span');
            tempSpan.style.fontFamily = `"${selectedFont}", sans-serif`;
            tempSpan.style.visibility = 'hidden';
            tempSpan.textContent = 'Font Loading Test';
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
            
            drawCard();
            if (isTMDBMode && episodeTitleCards.length > 0) {
                updateEpisodeCardSettings();
                renderEpisodeGrid();
            }
        }
    });
}

if (infoTextSize) infoTextSize.addEventListener('change', updateBothViews);
if (infoShadowBlur) infoShadowBlur.addEventListener('input', updateBothViews);
if (infoOutlineWidth) infoOutlineWidth.addEventListener('input', updateBothViews);
    
    initializeTextOptionsUI();
    initializePickrs();
    
    canvas.width = 1280;
    canvas.height = 720;
    
    drawCard();
    
    function showToast(message, duration = 3000) {
        
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
});