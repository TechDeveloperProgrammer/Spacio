/**
 * ============================================
 * UTILS.JS - Utility Functions
 * Helper functions used throughout the application
 * ============================================
 */

const Utils = {
    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function to limit execution frequency
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Format numbers with K, M, B suffixes
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Format uptime from seconds to HH:MM:SS
     * @param {number} seconds - Total seconds
     * @returns {string} Formatted time string
     */
    formatUptime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return [
            hrs.toString().padStart(2, '0'),
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    },

    /**
     * Format timestamp to relative time (e.g., "5 min ago")
     * @param {Date|string|number} timestamp - Timestamp to format
     * @returns {string} Relative time string
     */
    formatRelativeTime(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now - then;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hr ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return then.toLocaleDateString();
    },

    /**
     * Generate random ID
     * @param {number} length - Length of ID
     * @returns {string} Random ID
     */
    generateId(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    },

    /**
     * Merge objects deeply
     * @param {Object} target - Target object
     * @param {...Object} sources - Source objects
     * @returns {Object} Merged object
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        
        const source = sources.shift();
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        
        return this.deepMerge(target, ...sources);
    },

    /**
     * Check if value is an object
     * @param {*} value - Value to check
     * @returns {boolean} Is object
     */
    isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    },

    /**
     * Parse color to RGB values
     * @param {string} color - Color string (hex, rgb, rgba, hsl)
     * @returns {Object} RGB values {r, g, b, a}
     */
    parseColor(color) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        const parsed = ctx.fillStyle;
        
        const match = parsed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parseFloat(match[4]) : 1
            };
        }
        return { r: 0, g: 0, b: 0, a: 1 };
    },

    /**
     * Convert hex to RGB
     * @param {string} hex - Hex color
     * @returns {Object} RGB values
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Interpolate between two numbers
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    },

    /**
     * Clamp a number between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Map a value from one range to another
     * @param {number} value - Value to map
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number} Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    /**
     * Ease in-out quadratic
     * @param {number} t - Time (0-1)
     * @returns {number} Eased value
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    /**
     * Ease out elastic
     * @param {number} t - Time (0-1)
     * @returns {number} Eased value
     */
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    /**
     * Log debug messages
     * @param {string} message - Message to log
     * @param {*} data - Optional data to log
     */
    log(message, data = null) {
        if (CONFIG.general.debug) {
            console.log(`[Overlay] ${message}`, data !== null ? data : '');
        }
    },

    /**
     * Log error messages
     * @param {string} message - Error message
     * @param {*} error - Error object
     */
    error(message, error = null) {
        console.error(`[Overlay Error] ${message}`, error !== null ? error : '');
    },

    /**
     * Log warning messages
     * @param {string} message - Warning message
     */
    warn(message) {
        console.warn(`[Overlay Warning] ${message}`);
    },

    /**
     * Create event emitter
     * @returns {Object} Event emitter object
     */
    createEventEmitter() {
        const events = {};
        
        return {
            on(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
                return this;
            },
            
            off(event, callback) {
                if (!events[event]) return this;
                events[event] = events[event].filter(cb => cb !== callback);
                return this;
            },
            
            emit(event, ...args) {
                if (!events[event]) return this;
                events[event].forEach(callback => callback(...args));
                return this;
            },
            
            once(event, callback) {
                const wrapper = (...args) => {
                    this.off(event, wrapper);
                    callback(...args);
                };
                return this.on(event, wrapper);
            }
        };
    },

    /**
     * Detect platform from URL parameters or environment
     * @returns {string|null} Platform name or null
     */
    detectPlatform() {
        const params = new URLSearchParams(window.location.search);
        
        // Check URL parameter first
        const platformParam = params.get('platform');
        if (platformParam) {
            return platformParam.toLowerCase();
        }
        
        // Check referrer
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('twitch')) return 'twitch';
        if (referrer.includes('tiktok')) return 'tiktok';
        
        // Check user agent hints
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('obs')) return 'obs';
        if (ua.includes('streamlabs')) return 'streamlabs';
        
        return null;
    },

    /**
     * Check if element is visible in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is visible
     */
    isVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get CSS variable value
     * @param {string} name - Variable name
     * @returns {string} Variable value
     */
    getCSSVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    /**
     * Set CSS variable value
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     */
    setCSSVariable(name, value) {
        document.documentElement.style.setProperty(name, value);
    },

    /**
     * Load script dynamically
     * @param {string} src - Script source URL
     * @returns {Promise} Promise that resolves when script loads
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    /**
     * Load image and return promise
     * @param {string} src - Image source URL
     * @returns {Promise<HTMLImageElement>} Promise with loaded image
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Sleep for specified duration
     * @param {number} ms - Duration in milliseconds
     * @returns {Promise} Promise that resolves after delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Retry async operation with exponential backoff
     * @param {Function} fn - Async function to retry
     * @param {number} maxRetries - Maximum retries
     * @param {number} delay - Initial delay in ms
     * @returns {Promise} Promise with result
     */
    async retry(fn, maxRetries = 3, delay = 1000) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i < maxRetries - 1) {
                    await this.sleep(delay * Math.pow(2, i));
                }
            }
        }
        throw lastError;
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
