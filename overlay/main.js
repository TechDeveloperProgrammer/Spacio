/**
 * ============================================
 * SMART OVERLAY - MAIN APPLICATION
 * Production-Ready Browser Source Overlay
 * Entry point and application initialization
 * ============================================
 */

// Application State
const App = {
    initialized: false,
    startTime: null,
    isHidden: false
};

/**
 * Initialize the overlay application
 */
async function init() {
    try {
        Utils.log('=================================');
        Utils.log(`${CONFIG.app.name} v${CONFIG.app.version}`);
        Utils.log('=================================');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // Initialize all modules
        await initializeModules();
        
        // Setup event listeners
        setupEventListeners();
        
        // Apply initial display settings
        applyDisplaySettings();
        
        // Mark as initialized
        App.initialized = true;
        App.startTime = Date.now();
        
        Utils.log('Overlay initialized successfully!');
        Utils.log(`Platform detected: ${Utils.detectPlatform()}`);
        Utils.log(`Device type: ${Utils.detectDevice()}`);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('overlayInitialized', { detail: App }));
        
    } catch (error) {
        Utils.log(`Initialization error: ${error.message}`, 'error');
        console.error(error);
    }
}

/**
 * Initialize all system modules
 */
async function initializeModules() {
    const modules = [
        { name: 'Themes', module: Themes },
        { name: 'Media', module: Media },
        { name: 'Animations', module: Animations },
        { name: 'Particles', module: Particles },
        { name: 'Widgets', module: Widgets },
        { name: 'Providers', module: Providers },
        { name: 'Commands', module: Commands }
    ];
    
    for (const { name, module } of modules) {
        try {
            if (module.init) {
                module.init();
                Utils.log(`${name} module initialized`);
            }
        } catch (error) {
            Utils.log(`${name} module failed to initialize: ${error.message}`, 'error');
        }
    }
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Visibility change (for when OBS/browser source loses focus)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            Utils.log('Overlay hidden', 'debug');
        } else {
            Utils.log('Overlay visible', 'debug');
        }
    });
    
    // Handle messages from parent window (OBS, StreamElements, etc.)
    window.addEventListener('message', handleExternalMessage);
    
    // Handle URL parameter changes
    window.addEventListener('popstate', handleURLChange);
    
    // Handle before unload
    window.addEventListener('beforeunload', () => {
        cleanup();
    });
    
    // Keyboard shortcuts for debugging
    setupKeyboardShortcuts();
}

/**
 * Handle external messages (from OBS browser source, StreamElements, etc.)
 */
function handleExternalMessage(event) {
    const data = event.data;
    
    if (!data || !data.type) return;
    
    Utils.log(`Received external message: ${data.type}`, 'debug');
    
    switch (data.type) {
        case 'show':
            showOverlay();
            break;
            
        case 'hide':
            hideOverlay();
            break;
            
        case 'toggle':
            toggleOverlay();
            break;
            
        case 'command':
            if (data.command) {
                Commands.execute(data.command.replace('!', ''), 'external', data.args || []);
            }
            break;
            
        case 'event':
            if (data.platform && data.event) {
                Providers.addEvent(data.platform, data.event);
            }
            break;
            
        case 'update':
            if (data.platform && data.data) {
                if (data.platform === 'twitch') {
                    Providers.updateTwitchData(data.data);
                } else if (data.platform === 'tiktok') {
                    Providers.updateTikTokData(data.data);
                }
            }
            break;
            
        case 'theme':
            if (data.theme) {
                Themes.loadTheme(data.theme);
            }
            break;
            
        case 'config':
            if (data.config) {
                updateConfig(data.config);
            }
            break;
    }
}

/**
 * Handle URL parameter changes
 */
function handleURLChange() {
    const params = Utils.getQueryParams();
    
    if (params.theme) {
        Themes.loadTheme(params.theme);
    }
    if (params.mode) {
        CONFIG.platform.mode = params.mode;
    }
    if (params.scale) {
        Widgets.setScale(parseFloat(params.scale));
    }
}

/**
 * Setup keyboard shortcuts for testing/debugging
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+S: Toggle overlay
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            toggleOverlay();
        }
        
        // Ctrl+Shift+R: Reload
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            location.reload();
        }
        
        // Ctrl+Shift+D: Toggle debug mode
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            CONFIG.app.debug = !CONFIG.app.debug;
            Utils.log(`Debug mode: ${CONFIG.app.debug ? 'ON' : 'OFF'}`);
        }
        
        // Ctrl+Shift+P: Toggle particles
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            Particles.toggle();
        }
        
        // F12: Show stats
        if (e.key === 'F12') {
            e.preventDefault();
            showStats();
        }
    });
}

/**
 * Apply display settings from config
 */
function applyDisplaySettings() {
    // Set position
    Widgets.setPosition(CONFIG.display.position);
    
    // Set scale
    Widgets.setScale(CONFIG.display.scale);
    
    // Set opacity
    Widgets.setOpacity(CONFIG.display.opacity);
}

/**
 * Show overlay
 */
function showOverlay() {
    const container = document.getElementById('overlay-container');
    const content = document.getElementById('content-wrapper');
    
    container.classList.remove('hidden');
    App.isHidden = false;
    
    Animations.fadeIn(content, 300);
    Utils.log('Overlay shown');
}

/**
 * Hide overlay
 */
function hideOverlay() {
    const content = document.getElementById('content-wrapper');
    const container = document.getElementById('overlay-container');
    
    App.isHidden = true;
    
    Animations.fadeOut(content, 300, () => {
        container.classList.add('hidden');
    });
    
    Utils.log('Overlay hidden');
}

/**
 * Toggle overlay visibility
 */
function toggleOverlay() {
    if (App.isHidden) {
        showOverlay();
    } else {
        hideOverlay();
    }
}

/**
 * Update configuration at runtime
 */
function updateConfig(newConfig) {
    Utils.deepMerge(CONFIG, newConfig);
    
    // Reapply settings
    applyDisplaySettings();
    Themes.loadTheme(CONFIG.theme.active);
    
    Utils.log('Configuration updated');
}

/**
 * Show application stats
 */
function showStats() {
    const stats = {
        uptime: Math.floor((Date.now() - App.startTime) / 1000),
        platform: Utils.detectPlatform(),
        device: Utils.detectDevice(),
        twitch: Providers.getState('twitch'),
        tiktok: Providers.getState('tiktok'),
        particles: Particles.getStats(),
        widgets: Widgets.getStats(),
        memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.totalJSHeapSize / 1048576)
        } : 'N/A'
    };
    
    console.table(stats);
    Utils.log('Stats:', 'info', stats);
}

/**
 * Cleanup before unload
 */
function cleanup() {
    Utils.log('Cleaning up...');
    
    // Stop animations
    Animations.clearAll();
    
    // Stop particles
    Particles.stop();
    
    // Disconnect providers
    Providers.disconnectAll();
    
    // Stop sounds
    Media.stopAllSounds();
    
    // Clear cache
    Media.clearCache();
}

/**
 * Get application status
 */
function getStatus() {
    return {
        initialized: App.initialized,
        uptime: App.startTime ? Date.now() - App.startTime : 0,
        isHidden: App.isHidden,
        version: CONFIG.app.version,
        platform: Utils.detectPlatform(),
        device: Utils.detectDevice(),
        fps: CONFIG.app.fps,
        debug: CONFIG.app.debug
    };
}

// Export to window for external access
window.SmartOverlay = {
    init,
    show: showOverlay,
    hide: hideOverlay,
    toggle: toggleOverlay,
    getStatus,
    getConfig: () => CONFIG,
    updateConfig,
    getProviders: () => Providers.getAllStates(),
    getCommands: () => Commands.list(),
    executeCommand: (cmd, user = 'api') => Commands.execute(cmd.replace('!', ''), user),
    simulateEvent: (platform, event) => Providers.addEvent(platform, event),
    reload: () => location.reload()
};

// Auto-initialize when script loads
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Service Worker registration for PWA support (optional)
if ('serviceWorker' in navigator && CONFIG.app.pwa) {
    navigator.serviceWorker.register('sw.js').catch(() => {
        Utils.log('Service Worker not available', 'debug');
    });
}

// Performance monitoring
if (CONFIG.app.debug && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            Utils.log(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`, 'debug');
        });
    });
    
    observer.observe({ entryTypes: ['measure', 'paint', 'navigation'] });
}
