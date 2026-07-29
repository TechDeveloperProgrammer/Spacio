/**
 * ============================================
 * SMART OVERLAY - UTILITIES
 * Production-Ready Browser Source Overlay
 * ============================================
 */

const Utils = {
    /**
     * Log messages with timestamp and level
     */
    log(message, level = 'info') {
        if (!CONFIG.app.debug && level === 'debug') return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        
        switch (level) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    },

    /**
     * Debounce function calls
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
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format numbers with K, M, B suffixes
     */
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    /**
     * Format uptime from seconds
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
     * Format date to relative time
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Parse query parameters from URL
     */
    getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const regex = /([^&=]+)=([^&]*)/g;
        let match;
        
        while ((match = regex.exec(queryString)) !== null) {
            params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
        }
        
        return params;
    },

    /**
     * Check if element is visible
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
     * Animate counter value
     */
    animateCounter(element, start, end, duration = 500) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuad)
            const ease = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(start + (end - start) * ease);
            
            element.textContent = Utils.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = Utils.formatNumber(end);
            }
        };
        
        requestAnimationFrame(updateCounter);
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = 0) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    },

    /**
     * Clone object deeply
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge objects deeply
     */
    deepMerge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                    target[key] = target[key] || {};
                    Utils.deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },

    /**
     * Get CSS variable value
     */
    getCSSVariable(name) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
    },

    /**
     * Set CSS variable value
     */
    setCSSVariable(name, value) {
        document.documentElement.style.setProperty(name, value);
    },

    /**
     * Detect platform from URL or environment
     */
    detectPlatform() {
        const url = window.location.href.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Check URL parameters
        const params = Utils.getQueryParams();
        if (params.platform) {
            return params.platform.toLowerCase();
        }
        
        // Check for StreamElements
        if (url.includes('streamelements.com')) {
            return 'streamelements';
        }
        
        // Check for OBS
        if (userAgent.includes('obs')) {
            return 'obs';
        }
        
        // Check for PRISM Live Studio
        if (userAgent.includes('prism')) {
            return 'prism';
        }
        
        return 'unknown';
    },

    /**
     * Detect device type
     */
    detectDevice() {
        const width = window.innerWidth;
        
        if (width <= CONFIG.responsive.mobile) return 'mobile';
        if (width <= CONFIG.responsive.tablet) return 'tablet';
        if (width <= CONFIG.responsive.desktop) return 'desktop';
        return 'ultrawide';
    },

    /**
     * Load external script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    },

    /**
     * Load external stylesheet
     */
    loadStylesheet(src) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load stylesheet: ${src}`));
            document.head.appendChild(link);
        });
    },

    /**
     * Wait for element to exist
     */
    waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    },

    /**
     * Random number between min and max
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Random array element
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Capitalize first letter
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Truncate text
     */
    truncate(text, length = 50) {
        if (text.length <= length) return text;
        return text.slice(0, length) + '...';
    },

    /**
     * Escape HTML
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Sleep for milliseconds
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
