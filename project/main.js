/**
 * ============================================
 * MAIN.JS - Application Entry Point
 * Initializes and orchestrates all modules
 * ============================================
 */

/**
 * Main application class
 */
class StreamOverlay {
    /**
     * Application state
     */
    state = {
        initialized: false,
        loading: true,
        visible: true,
    };

    /**
     * Initialize the overlay application
     */
    async init() {
        try {
            Utils.log('Initializing Stream Overlay...');
            
            // Show loading indicator
            if (CONFIG.general.showLoading) {
                Widgets.showLoading();
            }

            // Initialize modules in order
            await this.initModules();
            
            // Setup resize handler
            this.setupResizeHandler();
            
            // Setup visibility handling
            this.setupVisibilityHandler();
            
            // Hide loading indicator
            setTimeout(() => {
                Widgets.hideLoading();
                this.state.loading = false;
                
                // Entrance animation for content
                const content = document.getElementById('content-wrapper');
                if (content && CONFIG.animations.enabled) {
                    Animations.entrance(content);
                }
            }, 500);

            this.state.initialized = true;
            Utils.log('Stream Overlay initialized successfully!');
            
            // Trigger callback
            if (CONFIG.callbacks.onGoLive) {
                CONFIG.callbacks.onGoLive(Providers.activePlatforms);
            }
            
        } catch (error) {
            Utils.error('Failed to initialize overlay', error);
            this.handleError(error);
        }
    }

    /**
     * Initialize all modules
     */
    async initModules() {
        // Order matters - dependencies first
        Themes.init();
        Media.init();
        Animations.init();
        Particles.init();
        
        // Initialize providers (async)
        Providers.init();
        
        // Initialize widgets after providers
        Widgets.init();
        
        // Initialize commands last
        Commands.init();
        
        // Setup social links if configured
        if (CONFIG.widgets.footer.socialLinks.length > 0) {
            Widgets.setupSocialLinks(CONFIG.widgets.footer.socialLinks);
        }
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        const handleResize = Utils.debounce(() => {
            Utils.log('Window resized');
            
            // Resize particle canvas
            if (Particles.canvas) {
                Particles.resize();
            }
            
            // Adjust layout if needed
            this.adjustLayout();
        }, CONFIG.performance.debounceResize);

        window.addEventListener('resize', handleResize);
    }

    /**
     * Setup page visibility handler
     */
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Utils.log('Page hidden - reducing activity');
                // Could reduce update frequency here
            } else {
                Utils.log('Page visible - resuming normal activity');
                Widgets.refresh();
            }
        });
    }

    /**
     * Adjust layout based on screen size
     */
    adjustLayout() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Adjust scale for smaller screens
        if (width < 768) {
            Utils.setCSSVariable('--container-max-width', '100%');
        } else if (width < 1366) {
            Utils.setCSSVariable('--container-max-width', '1200px');
        } else {
            Utils.setCSSVariable('--container-max-width', `${CONFIG.layout.maxWidth}px`);
        }
        
        // Handle ultrawide
        if (width / height > 2.5) {
            Utils.log('Ultrawide display detected');
            // Could apply special ultrawide styles here
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error object
     */
    handleError(error) {
        Widgets.hideLoading();
        Widgets.showNotification({
            message: `Initialization error: ${error.message}`,
            type: 'error',
            duration: 10000,
        });
    }

    /**
     * Start the overlay
     */
    start() {
        if (!this.state.initialized) {
            Utils.warn('Overlay not initialized. Call init() first.');
            return;
        }
        
        this.state.visible = true;
        Widgets.setVisibility(true);
        Utils.log('Overlay started');
    }

    /**
     * Stop the overlay
     */
    stop() {
        this.state.visible = false;
        Widgets.setVisibility(false);
        Utils.log('Overlay stopped');
    }

    /**
     * Toggle overlay visibility
     */
    toggle() {
        if (this.state.visible) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * Cleanup and destroy the overlay
     */
    destroy() {
        Utils.log('Destroying overlay...');
        
        // Stop animations
        Animations.cancelAll();
        
        // Stop particles
        Particles.stop();
        
        // Disconnect providers
        Providers.activePlatforms.forEach(platform => {
            Providers.deactivatePlatform(platform);
        });
        
        // Clear media cache
        Media.clearCache();
        
        // Destroy widgets
        Widgets.destroy();
        
        this.state.initialized = false;
        Utils.log('Overlay destroyed');
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return {
            ...this.state,
            providers: Providers.getCombinedState(),
            particles: Particles.getStats(),
            theme: Themes.getCurrentTheme(),
        };
    }

    /**
     * Export configuration
     * @returns {Object} Current configuration
     */
    exportConfig() {
        return {
            config: CONFIG,
            theme: Themes.exportTheme(),
            customCommands: Commands.list(),
        };
    }

    /**
     * Import configuration
     * @param {Object} config - Configuration to import
     */
    importConfig(config) {
        if (config.config) {
            Utils.deepMerge(CONFIG, config.config);
        }
        if (config.theme) {
            Themes.importTheme(JSON.stringify(config.theme), 'imported');
            Themes.loadTheme('imported');
        }
        Utils.log('Configuration imported');
    }
}

// ============================================
// GLOBAL INSTANCE
// ============================================

/**
 * Global overlay instance
 */
const Overlay = new StreamOverlay();

// ============================================
// AUTO-INITIALIZATION
// ============================================

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Overlay.init());
} else {
    Overlay.init();
}

// ============================================
// GLOBAL API
// ============================================

/**
 * Expose API globally for external access
 */
window.StreamOverlay = {
    // Core methods
    init: () => Overlay.init(),
    start: () => Overlay.start(),
    stop: () => Overlay.stop(),
    toggle: () => Overlay.toggle(),
    destroy: () => Overlay.destroy(),
    
    // State
    getState: () => Overlay.getState(),
    exportConfig: () => Overlay.exportConfig(),
    importConfig: (config) => Overlay.importConfig(config),
    
    // Direct module access
    config: CONFIG,
    utils: Utils,
    themes: Themes,
    media: Media,
    animations: Animations,
    particles: Particles,
    providers: Providers,
    widgets: Widgets,
    commands: Commands,
    
    // Quick actions
    setTheme: (name) => Themes.loadTheme(name),
    setPanel: (platform) => Providers.activatePlatform(platform),
    hidePanel: (platform) => Providers.deactivatePlatform(platform),
    showNotification: (message) => Widgets.showNotification({ message }),
    executeCommand: (cmd) => {
        const { command, args } = Commands.parse(cmd);
        Commands.execute(command, args);
    },
};

// ============================================
// EXTERNAL EVENT LISTENERS
// ============================================

/**
 * Listen for external messages (e.g., from OBS browser source)
 */
window.addEventListener('message', (event) => {
    const { type, action, data } = event.data || {};
    
    switch (action) {
        case 'show':
            Overlay.start();
            break;
        case 'hide':
            Overlay.stop();
            break;
        case 'toggle':
            Overlay.toggle();
            break;
        case 'command':
            Overlay.executeCommand(data);
            break;
        case 'theme':
            Overlay.setTheme(data);
            break;
        case 'panel':
            Overlay.setPanel(data);
            break;
        case 'update':
            if (data.platform === 'twitch') {
                Providers.updateTwitch(data);
            } else if (data.platform === 'tiktok') {
                Providers.updateTikTok(data);
            }
            break;
    }
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Monitor performance and log warnings
 */
if (CONFIG.general.debug) {
    setInterval(() => {
        const memory = performance.memory || {};
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
            Utils.warn(`High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB`);
        }
    }, 30000);
}

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

/**
 * Register service worker for offline support
 * Uncomment if you want to add PWA capabilities
 */
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            Utils.log('SW registered:', registration.scope);
        }).catch(error => {
            Utils.warn('SW registration failed:', error);
        });
    });
}
*/

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StreamOverlay, Overlay };
}
