/**
 * ============================================
 * MEDIA.JS - Media Asset Management
 * Handles images, videos, sounds, and GIFs
 * ============================================
 */

const Media = {
    /**
     * Cached media elements
     */
    cache: {
        images: new Map(),
        videos: new Map(),
        sounds: new Map(),
        gifs: new Map(),
    },

    /**
     * Audio context for sound playback
     */
    audioContext: null,

    /**
     * Initialize media manager
     */
    init() {
        this.preloadImages(CONFIG.media.images.backgrounds);
        this.preloadVideos(CONFIG.media.videos.overlays);
        this.setupAudio();
        Utils.log('Media manager initialized');
    },

    /**
     * Setup audio context
     */
    setupAudio() {
        if (!CONFIG.media.sounds.enabled) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            Utils.warn('Web Audio API not supported');
        }
    },

    /**
     * Preload images
     * @param {Array} imagePaths - Array of image paths
     */
    async preloadImages(imagePaths) {
        if (!imagePaths || imagePaths.length === 0) return;

        const promises = imagePaths.map(async (path) => {
            try {
                const img = await Utils.loadImage(path);
                this.cache.images.set(path, img);
                Utils.log(`Image preloaded: ${path}`);
            } catch (error) {
                Utils.error(`Failed to preload image: ${path}`, error);
            }
        });

        await Promise.all(promises);
    },

    /**
     * Preload videos
     * @param {Array} videoPaths - Array of video paths
     */
    async preloadVideos(videoPaths) {
        if (!videoPaths || videoPaths.length === 0) return;

        const promises = videoPaths.map(async (path) => {
            try {
                const video = document.createElement('video');
                video.src = path;
                video.preload = 'auto';
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                
                await new Promise((resolve, reject) => {
                    video.onloadeddata = resolve;
                    video.onerror = reject;
                });
                
                this.cache.videos.set(path, video);
                Utils.log(`Video preloaded: ${path}`);
            } catch (error) {
                Utils.error(`Failed to preload video: ${path}`, error);
            }
        });

        await Promise.all(promises);
    },

    /**
     * Load image with caching
     * @param {string} path - Image path
     * @returns {Promise<HTMLImageElement>} Loaded image
     */
    async loadImage(path) {
        if (this.cache.images.has(path)) {
            return this.cache.images.get(path);
        }

        try {
            const img = await Utils.loadImage(path);
            this.cache.images.set(path, img);
            return img;
        } catch (error) {
            Utils.error(`Failed to load image: ${path}`, error);
            throw error;
        }
    },

    /**
     * Set background image
     * @param {string} path - Image path
     * @param {Object} options - Display options
     */
    async setBackgroundImage(path, options = {}) {
        const layer = document.getElementById('background-layer');
        if (!layer) return;

        try {
            const img = await this.loadImage(path);
            
            layer.style.backgroundImage = `url(${path})`;
            layer.style.backgroundSize = options.size || 'cover';
            layer.style.backgroundPosition = options.position || 'center';
            layer.style.backgroundRepeat = options.repeat || 'no-repeat';
            
            if (options.opacity !== undefined) {
                layer.style.opacity = options.opacity.toString();
            }
            
            Utils.log(`Background image set: ${path}`);
        } catch (error) {
            Utils.error(`Failed to set background image`, error);
        }
    },

    /**
     * Create video background element
     * @param {string} path - Video path
     * @param {Object} options - Video options
     * @returns {HTMLVideoElement} Video element
     */
    createVideoBackground(path, options = {}) {
        const video = document.createElement('video');
        video.src = path;
        video.autoplay = options.autoplay !== false;
        video.loop = options.loop !== false;
        video.muted = options.muted !== false;
        video.playsInline = true;
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '-1';
        video.style.opacity = options.opacity || '1';

        if (this.cache.videos.has(path)) {
            const cached = this.cache.videos.get(path);
            video.src = cached.src;
        }

        return video;
    },

    /**
     * Play sound effect
     * @param {string} soundName - Sound name from config
     * @param {Object} options - Playback options
     */
    async playSound(soundName, options = {}) {
        if (!CONFIG.media.sounds.enabled) return;
        
        const soundPath = CONFIG.media.sounds.files[soundName];
        if (!soundPath) {
            Utils.warn(`Sound not found: ${soundName}`);
            return;
        }

        try {
            // Check cache
            if (this.cache.sounds.has(soundPath)) {
                const audio = this.cache.sounds.get(soundPath);
                audio.currentTime = 0;
                audio.volume = options.volume || CONFIG.media.sounds.volume;
                await audio.play();
                return;
            }

            // Load new sound
            const audio = new Audio(soundPath);
            audio.volume = options.volume || CONFIG.media.sounds.volume;
            audio.preload = 'auto';
            
            this.cache.sounds.set(soundPath, audio);
            
            await audio.play();
            Utils.log(`Sound played: ${soundName}`);
        } catch (error) {
            Utils.error(`Failed to play sound: ${soundName}`, error);
        }
    },

    /**
     * Stop all sounds
     */
    stopAllSounds() {
        this.cache.sounds.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    },

    /**
     * Set volume for all sounds
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        CONFIG.media.sounds.volume = Math.max(0, Math.min(1, volume));
        this.cache.sounds.forEach(audio => {
            audio.volume = CONFIG.media.sounds.volume;
        });
    },

    /**
     * Display GIF reaction
     * @param {string} gifUrl - GIF URL
     * @param {Object} options - Display options
     */
    async showGif(gifUrl, options = {}) {
        const container = options.container || document.getElementById('recent-events');
        if (!container) return;

        try {
            const img = await this.loadImage(gifUrl);
            
            const gifElement = document.createElement('div');
            gifElement.className = 'gif-reaction notification-toast';
            gifElement.style.animation = 'toast-in 0.3s ease-out';
            
            gifElement.innerHTML = `
                <img src="${gifUrl}" alt="Reaction" style="max-width: 100px; max-height: 100px; border-radius: 8px;">
            `;

            container.appendChild(gifElement);

            // Auto-remove after duration
            const duration = options.duration || 3000;
            setTimeout(() => {
                gifElement.style.animation = 'fade-out 0.3s ease-out';
                setTimeout(() => gifElement.remove(), 300);
            }, duration);

            Utils.log(`GIF displayed: ${gifUrl}`);
        } catch (error) {
            Utils.error(`Failed to show GIF`, error);
        }
    },

    /**
     * Create avatar image element
     * @param {string} url - Avatar URL
     * @param {HTMLElement} target - Target element
     */
    async setAvatar(url, target) {
        if (!target) {
            target = document.getElementById('streamer-avatar');
        }
        if (!target) return;

        try {
            const img = await this.loadImage(url);
            target.src = url;
            target.alt = 'Streamer Avatar';
            Utils.log('Avatar updated');
        } catch (error) {
            Utils.error('Failed to set avatar', error);
            target.src = CONFIG.media.images.defaultAvatar;
        }
    },

    /**
     * Clear media cache
     * @param {string} type - Cache type ('images', 'videos', 'sounds', 'all')
     */
    clearCache(type = 'all') {
        if (type === 'all' || type === 'images') {
            this.cache.images.clear();
        }
        if (type === 'all' || type === 'videos') {
            this.cache.videos.clear();
        }
        if (type === 'all' || type === 'sounds') {
            this.cache.sounds.clear();
        }
        if (type === 'all' || type === 'gifs') {
            this.cache.gifs.clear();
        }
        Utils.log(`Media cache cleared: ${type}`);
    },

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getCacheStats() {
        return {
            images: this.cache.images.size,
            videos: this.cache.videos.size,
            sounds: this.cache.sounds.size,
            gifs: this.cache.gifs.size,
        };
    },

    /**
     * Optimize cache (remove oldest entries)
     * @param {number} maxSize - Maximum cache size per type
     */
    optimizeCache(maxSize = 50) {
        // Simple implementation - could be enhanced with LRU
        for (const [type, cache] of Object.entries(this.cache)) {
            if (cache.size > maxSize) {
                const keys = Array.from(cache.keys());
                const toRemove = keys.slice(0, cache.size - maxSize);
                toRemove.forEach(key => cache.delete(key));
            }
        }
        Utils.log('Cache optimized');
    },

    /**
     * Create overlay video element
     * @param {string} path - Video path
     * @param {Object} options - Overlay options
     * @returns {HTMLVideoElement} Video element
     */
    createOverlayVideo(path, options = {}) {
        const video = document.createElement('video');
        video.src = path;
        video.autoplay = options.autoplay !== false;
        video.loop = options.loop !== false;
        video.muted = options.muted !== false;
        video.playsInline = true;
        video.style.position = 'absolute';
        video.style.top = options.top || '0';
        video.style.left = options.left || '0';
        video.style.width = options.width || '100%';
        video.style.height = options.height || '100%';
        video.style.objectFit = options.fit || 'contain';
        video.style.pointerEvents = 'none';
        video.style.zIndex = options.zIndex || '5';
        video.style.opacity = options.opacity || '1';

        if (options.mixBlendMode) {
            video.style.mixBlendMode = options.mixBlendMode;
        }

        return video;
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Media;
}
