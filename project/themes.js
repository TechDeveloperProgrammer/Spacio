/**
 * ============================================
 * THEMES.JS - Theme Management
 * Handles theme switching and customization
 * ============================================
 */

const Themes = {
    // Predefined themes
    presets: {
        default: {
            name: 'Default',
            colors: {
                primary: '#9146ff',
                secondary: '#00f0ff',
                accent: '#ff0050',
                background: 'rgba(10, 10, 15, 0.85)',
                text: '#ffffff',
            },
            effects: {
                glassBlur: 20,
                glassOpacity: 0.5,
                glowStrength: 15,
                borderRadius: 12,
            },
            fonts: {
                primary: "'Inter', sans-serif",
                mono: "'JetBrains Mono', monospace",
            },
        },
        dark: {
            name: 'Dark Mode',
            colors: {
                primary: '#1a1a2e',
                secondary: '#16213e',
                accent: '#e94560',
                background: 'rgba(5, 5, 10, 0.95)',
                text: '#eaeaea',
            },
            effects: {
                glassBlur: 10,
                glassOpacity: 0.3,
                glowStrength: 5,
                borderRadius: 8,
            },
            fonts: {
                primary: "'Roboto', sans-serif",
                mono: "'Fira Code', monospace",
            },
        },
        neon: {
            name: 'Neon Cyberpunk',
            colors: {
                primary: '#ff00ff',
                secondary: '#00ffff',
                accent: '#ffff00',
                background: 'rgba(10, 0, 20, 0.9)',
                text: '#ffffff',
            },
            effects: {
                glassBlur: 30,
                glassOpacity: 0.4,
                glowStrength: 25,
                borderRadius: 0,
            },
            fonts: {
                primary: "'Orbitron', sans-serif",
                mono: "'Share Tech Mono', monospace",
            },
        },
        glass: {
            name: 'Glassmorphism',
            colors: {
                primary: 'rgba(255, 255, 255, 0.2)',
                secondary: 'rgba(255, 255, 255, 0.1)',
                accent: '#ffffff',
                background: 'rgba(255, 255, 255, 0.05)',
                text: '#ffffff',
            },
            effects: {
                glassBlur: 40,
                glassOpacity: 0.6,
                glowStrength: 0,
                borderRadius: 20,
            },
            fonts: {
                primary: "'Poppins', sans-serif",
                mono: "'Source Code Pro', monospace",
            },
        },
        minimal: {
            name: 'Minimal',
            colors: {
                primary: '#000000',
                secondary: '#666666',
                accent: '#333333',
                background: 'rgba(255, 255, 255, 0.9)',
                text: '#000000',
            },
            effects: {
                glassBlur: 0,
                glassOpacity: 0,
                glowStrength: 0,
                borderRadius: 4,
            },
            fonts: {
                primary: "'Helvetica Neue', sans-serif",
                mono: "'Courier New', monospace",
            },
        },
        twitch: {
            name: 'Twitch Purple',
            colors: {
                primary: '#9146ff',
                secondary: '#bf94ff',
                accent: '#00f0ff',
                background: 'rgba(24, 24, 27, 0.9)',
                text: '#ffffff',
            },
            effects: {
                glassBlur: 15,
                glassOpacity: 0.4,
                glowStrength: 10,
                borderRadius: 10,
            },
            fonts: {
                primary: "'Inter', sans-serif",
                mono: "'JetBrains Mono', monospace",
            },
        },
        tiktok: {
            name: 'TikTok Live',
            colors: {
                primary: '#00f2ea',
                secondary: '#ff0050',
                accent: '#ffffff',
                background: 'rgba(0, 0, 0, 0.85)',
                text: '#ffffff',
            },
            effects: {
                glassBlur: 20,
                glassOpacity: 0.5,
                glowStrength: 20,
                borderRadius: 16,
            },
            fonts: {
                primary: "'Proxima Nova', sans-serif",
                mono: "'SF Mono', monospace",
            },
        },
    },

    /**
     * Current active theme
     */
    currentTheme: 'default',

    /**
     * Custom theme overrides
     */
    customOverrides: {},

    /**
     * Initialize themes
     */
    init() {
        this.loadTheme(CONFIG.appearance.theme);
        Utils.log('Themes initialized');
    },

    /**
     * Load a theme by name
     * @param {string} themeName - Theme name
     */
    loadTheme(themeName) {
        const theme = this.presets[themeName] || this.presets.default;
        this.currentTheme = themeName;
        this.applyTheme(theme);
        Utils.log(`Theme loaded: ${themeName}`);
    },

    /**
     * Apply theme CSS variables
     * @param {Object} theme - Theme object
     */
    applyTheme(theme) {
        // Apply colors
        Utils.setCSSVariable('--primary-color', theme.colors.primary);
        Utils.setCSSVariable('--secondary-color', theme.colors.secondary);
        Utils.setCSSVariable('--accent-color', theme.colors.accent);
        Utils.setCSSVariable('--bg-primary', theme.colors.background);
        Utils.setCSSVariable('--text-primary', theme.colors.text);

        // Apply effects
        Utils.setCSSVariable('--glass-blur', `${theme.effects.glassBlur}px`);
        Utils.setCSSVariable('--glass-opacity', theme.effects.glassOpacity.toString());
        Utils.setCSSVariable('--glow-strength', `${theme.effects.glowStrength}px`);
        Utils.setCSSVariable('--border-radius-lg', `${theme.effects.borderRadius}px`);
        Utils.setCSSVariable('--border-radius-md', `${theme.effects.borderRadius - 4}px`);
        Utils.setCSSVariable('--border-radius-sm', `${theme.effects.borderRadius - 8}px`);

        // Apply fonts
        Utils.setCSSVariable('--font-primary', theme.fonts.primary);
        Utils.setCSSVariable('--font-mono', theme.fonts.mono);

        // Update body class
        document.body.className = `overlay-body theme-${this.currentTheme}`;
    },

    /**
     * Set custom color
     * @param {string} name - Color name
     * @param {string} value - Color value
     */
    setColor(name, value) {
        const varName = `--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}-color`;
        Utils.setCSSVariable(varName, value);
        
        // Update config
        if (this.presets[this.currentTheme]) {
            this.presets[this.currentTheme].colors[name] = value;
        }
    },

    /**
     * Set custom effect
     * @param {string} name - Effect name
     * @param {number|string} value - Effect value
     */
    setEffect(name, value) {
        const varName = `--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        
        if (typeof value === 'number' && ['blur', 'strength', 'radius'].some(k => name.toLowerCase().includes(k))) {
            Utils.setCSSVariable(varName, `${value}px`);
        } else {
            Utils.setCSSVariable(varName, value.toString());
        }
    },

    /**
     * Create custom theme
     * @param {string} name - Theme name
     * @param {Object} config - Theme configuration
     */
    createTheme(name, config) {
        this.presets[name] = {
            name: config.name || name,
            colors: config.colors || {},
            effects: config.effects || {},
            fonts: config.fonts || {},
        };
        Utils.log(`Custom theme created: ${name}`);
    },

    /**
     * Get current theme config
     * @returns {Object} Theme configuration
     */
    getCurrentTheme() {
        return this.presets[this.currentTheme] || this.presets.default;
    },

    /**
     * Get all available themes
     * @returns {Array} Array of theme names
     */
    getAvailableThemes() {
        return Object.keys(this.presets);
    },

    /**
     * Cycle through themes
     */
    cycleTheme() {
        const themes = this.getAvailableThemes();
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.loadTheme(themes[nextIndex]);
        return themes[nextIndex];
    },

    /**
     * Export theme as JSON
     * @param {string} themeName - Theme to export
     * @returns {string} JSON string
     */
    exportTheme(themeName) {
        const theme = this.presets[themeName] || this.presets[this.currentTheme];
        return JSON.stringify(theme, null, 2);
    },

    /**
     * Import theme from JSON
     * @param {string} json - JSON string
     * @param {string} name - Theme name
     */
    importTheme(json, name) {
        try {
            const theme = JSON.parse(json);
            this.createTheme(name, theme);
            return true;
        } catch (error) {
            Utils.error('Failed to import theme', error);
            return false;
        }
    },

    /**
     * Animate theme transition
     * @param {string} themeName - Target theme
     * @param {number} duration - Duration in ms
     */
    async transitionToTheme(themeName, duration = 500) {
        const startTheme = this.getCurrentTheme();
        const endTheme = this.presets[themeName] || this.presets.default;
        const startTime = performance.now();

        return new Promise(resolve => {
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = Utils.easeInOutQuad(progress);

                // Interpolate values (simplified - just opacity for demo)
                const currentOpacity = Utils.lerp(
                    parseFloat(startTheme.effects.glassOpacity),
                    parseFloat(endTheme.effects.glassOpacity),
                    eased
                );
                Utils.setCSSVariable('--glass-opacity', currentOpacity.toString());

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.loadTheme(themeName);
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Themes;
}
