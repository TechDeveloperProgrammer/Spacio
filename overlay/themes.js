/**
 * ============================================
 * SMART OVERLAY - THEMES MANAGER
 * Production-Ready Browser Source Overlay
 * ============================================
 */

const Themes = {
    // Predefined themes
    presets: {
        default: {
            name: 'Default',
            colors: {
                primary: '#9146ff',
                secondary: '#ff0050',
                accent: '#00f0ff',
                background: 'rgba(0, 0, 0, 0.8)',
                text: '#ffffff',
                glass: 'rgba(255, 255, 255, 0.1)',
                border: 'rgba(255, 255, 255, 0.2)'
            },
            effects: {
                glassmorphism: true,
                blur: 10,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: false
            }
        },
        twitch: {
            name: 'Twitch Purple',
            colors: {
                primary: '#9146ff',
                secondary: '#00f0ff',
                accent: '#ffffff',
                background: 'rgba(15, 15, 30, 0.9)',
                text: '#ffffff',
                glass: 'rgba(145, 70, 255, 0.15)',
                border: 'rgba(145, 70, 255, 0.3)'
            },
            effects: {
                glassmorphism: true,
                blur: 15,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: true
            }
        },
        tiktok: {
            name: 'TikTok Neon',
            colors: {
                primary: '#ff0050',
                secondary: '#00f0ff',
                accent: '#ffffff',
                background: 'rgba(20, 20, 20, 0.9)',
                text: '#ffffff',
                glass: 'rgba(255, 0, 80, 0.15)',
                border: 'rgba(255, 0, 80, 0.3)'
            },
            effects: {
                glassmorphism: true,
                blur: 12,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: true
            }
        },
        dark: {
            name: 'Dark Mode',
            colors: {
                primary: '#ffffff',
                secondary: '#888888',
                accent: '#00ff88',
                background: 'rgba(0, 0, 0, 0.95)',
                text: '#ffffff',
                glass: 'rgba(255, 255, 255, 0.05)',
                border: 'rgba(255, 255, 255, 0.1)'
            },
            effects: {
                glassmorphism: false,
                blur: 0,
                glow: false,
                shadows: true,
                animatedBorders: false,
                neonGlow: false
            }
        },
        glass: {
            name: 'Glass Morphism',
            colors: {
                primary: '#ffffff',
                secondary: '#e0e0e0',
                accent: '#ff6b6b',
                background: 'rgba(255, 255, 255, 0.1)',
                text: '#ffffff',
                glass: 'rgba(255, 255, 255, 0.2)',
                border: 'rgba(255, 255, 255, 0.3)'
            },
            effects: {
                glassmorphism: true,
                blur: 20,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: false
            }
        },
        cyberpunk: {
            name: 'Cyberpunk',
            colors: {
                primary: '#ff00ff',
                secondary: '#00ffff',
                accent: '#ffff00',
                background: 'rgba(10, 10, 30, 0.95)',
                text: '#00ffff',
                glass: 'rgba(255, 0, 255, 0.1)',
                border: 'rgba(0, 255, 255, 0.4)'
            },
            effects: {
                glassmorphism: true,
                blur: 8,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: true
            }
        },
        sunset: {
            name: 'Sunset Gradient',
            colors: {
                primary: '#ff6b6b',
                secondary: '#feca57',
                accent: '#ff9ff3',
                background: 'rgba(30, 20, 40, 0.9)',
                text: '#ffffff',
                glass: 'rgba(255, 107, 107, 0.15)',
                border: 'rgba(254, 202, 87, 0.3)'
            },
            effects: {
                glassmorphism: true,
                blur: 15,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: false
            }
        },
        ocean: {
            name: 'Ocean Blue',
            colors: {
                primary: '#0077b6',
                secondary: '#00b4d8',
                accent: '#90e0ef',
                background: 'rgba(0, 30, 60, 0.9)',
                text: '#ffffff',
                glass: 'rgba(0, 119, 182, 0.15)',
                border: 'rgba(0, 180, 216, 0.3)'
            },
            effects: {
                glassmorphism: true,
                blur: 12,
                glow: true,
                shadows: true,
                animatedBorders: true,
                neonGlow: false
            }
        }
    },

    /**
     * Initialize theme system
     */
    init() {
        Utils.log('Themes manager initialized');
        this.loadTheme(CONFIG.theme.active);
    },

    /**
     * Load a theme by name
     */
    loadTheme(themeName) {
        const theme = this.presets[themeName] || this.presets.default;
        
        if (!theme) {
            Utils.log(`Theme "${themeName}" not found, using default`, 'warn');
            this.applyTheme(this.presets.default);
            return;
        }
        
        Utils.log(`Loading theme: ${theme.name}`);
        this.applyTheme(theme);
        CONFIG.theme.active = themeName;
    },

    /**
     * Apply theme to CSS variables
     */
    applyTheme(theme) {
        // Apply colors
        Utils.setCSSVariable('--primary-color', theme.colors.primary);
        Utils.setCSSVariable('--secondary-color', theme.colors.secondary);
        Utils.setCSSVariable('--accent-color', theme.colors.accent);
        Utils.setCSSVariable('--background-color', theme.colors.background);
        Utils.setCSSVariable('--text-color', theme.colors.text);
        Utils.setCSSVariable('--glass-bg', theme.colors.glass);
        Utils.setCSSVariable('--glass-border', theme.colors.border);
        
        // Convert hex to RGB for glow effects
        const primaryRGB = this.hexToRGB(theme.colors.primary);
        Utils.setCSSVariable('--primary-rgb', primaryRGB);
        
        // Apply effects
        Utils.setCSSVariable('--blur-strength', `${theme.effects.blur}px`);
        Utils.setCSSVariable('--border-radius', `${CONFIG.theme.borderRadius}px`);
        
        // Update glow strength based on theme
        const glowStrength = theme.effects.glow ? `0 0 20px` : `none`;
        Utils.setCSSVariable('--glow-strength', glowStrength);
        
        // Store current theme reference
        this.currentTheme = theme;
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
        
        Utils.log(`Theme "${theme.name}" applied successfully`);
    },

    /**
     * Create custom theme
     */
    createTheme(name, config) {
        this.presets[name.toLowerCase()] = {
            name: name,
            ...config
        };
        
        Utils.log(`Custom theme "${name}" created`);
        return this.presets[name.toLowerCase()];
    },

    /**
     * Get list of available themes
     */
    getThemes() {
        return Object.keys(this.presets).map(key => ({
            id: key,
            name: this.presets[key].name
        }));
    },

    /**
     * Update specific theme property
     */
    updateProperty(category, property, value) {
        if (!this.currentTheme) {
            Utils.log('No active theme to update', 'error');
            return;
        }
        
        if (this.currentTheme[category] && this.currentTheme[category][property] !== undefined) {
            this.currentTheme[category][property] = value;
            this.applyTheme(this.currentTheme);
            Utils.log(`Updated ${category}.${property} to ${value}`);
        } else {
            Utils.log(`Property ${category}.${property} not found`, 'warn');
        }
    },

    /**
     * Toggle effect on/off
     */
    toggleEffect(effectName) {
        if (!this.currentTheme) return;
        
        const currentValue = this.currentTheme.effects[effectName];
        this.currentTheme.effects[effectName] = !currentValue;
        this.applyTheme(this.currentTheme);
        
        Utils.log(`Toggled effect ${effectName}: ${!currentValue}`);
    },

    /**
     * Export theme as JSON
     */
    exportTheme(themeName) {
        const theme = this.presets[themeName] || this.currentTheme;
        return JSON.stringify(theme, null, 2);
    },

    /**
     * Import theme from JSON
     */
    importTheme(jsonString, name) {
        try {
            const theme = JSON.parse(jsonString);
            this.createTheme(name, theme);
            return true;
        } catch (error) {
            Utils.log(`Failed to import theme: ${error.message}`, 'error');
            return false;
        }
    },

    /**
     * Convert hex to RGB string
     */
    hexToRGB(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return '145, 70, 255';
        
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    },

    /**
     * Randomize theme colors
     */
    randomize() {
        const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        
        const randomTheme = {
            name: 'Random',
            colors: {
                primary: randomColor(),
                secondary: randomColor(),
                accent: randomColor(),
                background: 'rgba(0, 0, 0, 0.8)',
                text: '#ffffff',
                glass: 'rgba(255, 255, 255, 0.1)',
                border: 'rgba(255, 255, 255, 0.2)'
            },
            effects: { ...CONFIG.theme.effects }
        };
        
        this.applyTheme(randomTheme);
        Utils.log('Randomized theme colors');
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Themes;
}
