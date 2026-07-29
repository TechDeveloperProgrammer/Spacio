/**
 * ============================================
 * SMART OVERLAY - MEDIA MANAGER
 * Production-Ready Browser Source Overlay
 * ============================================
 */

const Media = {
    // Cache for loaded media
    cache: new Map(),
    
    // Currently playing audio elements
    activeSounds: [],

    /**
     * Initialize media manager
     */
    init() {
        Utils.log('Media manager initialized');
        this.preloadCriticalAssets();
    },

    /**
     * Preload critical assets
     */
    preloadCriticalAssets() {
        // Preload default avatar
        if (CONFIG.media.defaultAvatar) {
            this.loadImage(CONFIG.media.defaultAvatar);
        }
        
        // Preload default background
        if (CONFIG.media.defaultBackground) {
            this.loadImage(CONFIG.media.defaultBackground);
        }
    },

    /**
     * Load image with caching
     */
    loadImage(src, callback) {
        return new Promise((resolve, reject) => {
            // Check cache first
            if (this.cache.has(src)) {
                const cached = this.cache.get(src);
                if (callback) callback(cached);
                resolve(cached);
                return;
            }
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.cache.set(src, img);
                if (callback) callback(img);
                resolve(img);
            };
            
            img.onerror = (error) => {
                Utils.log(`Failed to load image: ${src}`, 'error');
                if (callback) callback(null);
                reject(error);
            };
            
            img.src = src;
        });
    },

    /**
     * Set avatar for platform
     */
    setAvatar(platform, url) {
        const element = document.getElementById(`${platform}-avatar`);
        if (!element) return;
        
        if (url) {
            this.loadImage(url).then(img => {
                if (img) {
                    element.src = url;
                } else {
                    element.src = CONFIG.media.defaultAvatar;
                }
            });
        } else {
            element.src = CONFIG.media.defaultAvatar;
        }
    },

    /**
     * Set background image/video
     */
    setBackground(source, type = 'image') {
        const layer = document.getElementById('background-layer');
        if (!layer) return;
        
        if (type === 'video') {
            this.setVideoBackground(source);
        } else if (type === 'gif') {
            layer.style.backgroundImage = `url(${source})`;
            layer.style.backgroundSize = 'cover';
            layer.style.backgroundPosition = 'center';
        } else {
            this.loadImage(source).then(img => {
                if (img) {
                    layer.style.backgroundImage = `url(${source})`;
                    layer.style.backgroundSize = 'cover';
                    layer.style.backgroundPosition = 'center';
                }
            });
        }
    },

    /**
     * Set video background
     */
    setVideoBackground(src) {
        const layer = document.getElementById('background-layer');
        if (!layer) return;
        
        // Remove existing video if any
        const existingVideo = layer.querySelector('video');
        if (existingVideo) {
            existingVideo.remove();
        }
        
        const video = document.createElement('video');
        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: ${CONFIG.display.backgroundOpacity || 0.5};
            z-index: -1;
        `;
        
        layer.innerHTML = '';
        layer.appendChild(video);
        
        // Clear background-image style
        layer.style.backgroundImage = 'none';
    },

    /**
     * Play sound effect
     */
    playSound(soundType, volume = CONFIG.sounds.volume) {
        if (!CONFIG.sounds.enabled) return;
        
        const soundPath = CONFIG.sounds[soundType];
        if (!soundPath) {
            Utils.log(`No sound configured for: ${soundType}`, 'debug');
            return;
        }
        
        // Create new audio element
        const audio = new Audio(soundPath);
        audio.volume = volume;
        
        // Auto cleanup when done
        audio.onended = () => {
            this.activeSounds = this.activeSounds.filter(s => s !== audio);
        };
        
        // Play and catch errors
        audio.play().catch(error => {
            Utils.log(`Failed to play sound: ${error.message}`, 'warn');
        });
        
        // Track active sounds
        this.activeSounds.push(audio);
        
        // Limit concurrent sounds
        if (this.activeSounds.length > 5) {
            const oldest = this.activeSounds.shift();
            if (oldest) {
                oldest.pause();
                oldest.currentTime = 0;
            }
        }
    },

    /**
     * Stop all sounds
     */
    stopAllSounds() {
        this.activeSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.activeSounds = [];
    },

    /**
     * Set volume
     */
    setVolume(volume) {
        CONFIG.sounds.volume = Math.max(0, Math.min(1, volume));
        this.activeSounds.forEach(sound => {
            sound.volume = CONFIG.sounds.volume;
        });
    },

    /**
     * Load font
     */
    loadFont(family, url, weight = 'normal', style = 'normal') {
        const fontFace = new FontFace(family, `url(${url})`, {
            weight: weight,
            style: style
        });
        
        return fontFace.load().then(loadedFont => {
            document.fonts.add(loadedFont);
            Utils.log(`Font loaded: ${family}`);
            return loadedFont;
        }).catch(error => {
            Utils.log(`Failed to load font: ${error.message}`, 'error');
            return null;
        });
    },

    /**
     * Apply custom font
     */
    applyFont(family) {
        Utils.setCSSVariable('--font-family', family);
        CONFIG.theme.fonts.family = family;
    },

    /**
     * Create icon element
     */
    createIcon(name, size = 24) {
        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.style.fontSize = `${size}px`;
        icon.textContent = name;
        return icon;
    },

    /**
     * Load SVG icon
     */
    loadSVGIcon(name, container) {
        const path = `${CONFIG.media.icons}${name}.svg`;
        
        fetch(path)
            .then(response => response.text())
            .then(svg => {
                container.innerHTML = svg;
                const svgEl = container.querySelector('svg');
                if (svgEl) {
                    svgEl.classList.add('icon-svg');
                }
            })
            .catch(error => {
                Utils.log(`Failed to load SVG icon: ${name}`, 'warn');
            });
    },

    /**
     * Clear media cache
     */
    clearCache() {
        this.cache.clear();
        Utils.log('Media cache cleared');
    },

    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            memory: this.estimateMemoryUsage()
        };
    },

    /**
     * Estimate memory usage (approximate)
     */
    estimateMemoryUsage() {
        let total = 0;
        this.cache.forEach((value, key) => {
            if (value instanceof Image) {
                total += value.width * value.height * 4; // Approximate RGBA bytes
            }
        });
        return (total / 1024 / 1024).toFixed(2) + ' MB';
    },

    /**
     * Optimize image for display
     */
    optimizeImage(img, maxWidth = 500, maxHeight = 500) {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        return canvas.toDataURL('image/jpeg', 0.8);
    },

    /**
     * Create gradient from colors
     */
    createGradient(colors, direction = 'linear') {
        if (direction === 'linear') {
            return `linear-gradient(135deg, ${colors.join(', ')})`;
        } else if (direction === 'radial') {
            return `radial-gradient(circle, ${colors.join(', ')})`;
        }
        return colors[0];
    },

    /**
     * Set panel background
     */
    setPanelBackground(panelId, source, type = 'color') {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        
        switch (type) {
            case 'gradient':
                panel.style.background = source;
                break;
            case 'image':
                this.loadImage(source).then(() => {
                    panel.style.backgroundImage = `url(${source})`;
                    panel.style.backgroundSize = 'cover';
                });
                break;
            default:
                panel.style.background = source;
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Media;
}
