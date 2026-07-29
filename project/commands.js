/**
 * ============================================
 * COMMANDS.JS - Custom Command System
 * Handles chat commands for overlay control
 * ============================================
 */

const Commands = {
    /**
     * Registered commands
     */
    commands: {},

    /**
     * Command cooldowns
     */
    cooldowns: new Map(),

    /**
     * Initialize commands
     */
    init() {
        if (!CONFIG.commands.enabled) {
            Utils.log('Commands disabled');
            return;
        }

        this.registerDefaultCommands();
        this.setupCommandListener();
        Utils.log('Commands initialized');
    },

    /**
     * Register default commands
     */
    registerDefaultCommands() {
        // Show/Hide overlay
        this.register('show', () => {
            Widgets.setVisibility(true);
            return 'Overlay shown';
        }, { description: 'Show the overlay' });

        this.register('hide', () => {
            Widgets.setVisibility(false);
            return 'Overlay hidden';
        }, { description: 'Hide the overlay' });

        // Theme commands
        this.register('theme', (args) => {
            if (!args.length) {
                return `Current theme: ${Themes.currentTheme}. Available: ${Themes.getAvailableThemes().join(', ')}`;
            }
            const themeName = args[0].toLowerCase();
            if (Themes.presets[themeName]) {
                Themes.loadTheme(themeName);
                return `Theme changed to: ${themeName}`;
            }
            return `Unknown theme: ${themeName}`;
        }, { description: 'Change or list themes', usage: '!theme [name]' });

        // Panel control
        this.register('panel', (args) => {
            if (!args.length) return 'Usage: !panel <twitch|tiktok|both|hide>';
            
            const action = args[0].toLowerCase();
            switch (action) {
                case 'twitch':
                    Providers.activatePlatform('twitch');
                    return 'Showing Twitch panel';
                case 'tiktok':
                    Providers.activatePlatform('tiktok');
                    return 'Showing TikTok panel';
                case 'both':
                    Providers.activatePlatform('twitch');
                    Providers.activatePlatform('tiktok');
                    return 'Showing both panels';
                case 'hide':
                    Providers.activePlatforms.forEach(p => Providers.deactivatePlatform(p));
                    return 'Hiding all panels';
                default:
                    return 'Unknown panel. Use: twitch, tiktok, both, or hide';
            }
        }, { description: 'Control panel visibility', usage: '!panel <twitch|tiktok|both|hide>' });

        // Stats display
        this.register('stats', () => {
            const state = Providers.getCombinedState();
            let stats = '📊 Stream Stats:\n';
            
            if (state.twitch.data) {
                stats += `Twitch: ${state.twitch.data.viewers} viewers, ${state.twitch.data.followers} followers\n`;
            }
            if (state.tiktok.data) {
                stats += `TikTok: ${state.tiktok.data.viewers} viewers, ${state.tiktok.data.likes} likes\n`;
            }
            
            return stats.trim();
        }, { description: 'Show current stream statistics' });

        // Reset command
        this.register('reset', () => {
            Particles.clear();
            Themes.loadTheme(CONFIG.appearance.theme);
            Widgets.refresh();
            return 'Overlay reset to defaults';
        }, { description: 'Reset overlay to default settings' });

        // Color commands
        this.register('color', (args) => {
            if (args.length < 2) return 'Usage: !color <primary|secondary|accent> <hex>';
            
            const [type, color] = args;
            const validTypes = ['primary', 'secondary', 'accent'];
            
            if (!validTypes.includes(type.toLowerCase())) {
                return `Invalid type. Use: ${validTypes.join(', ')}`;
            }
            
            if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                return 'Invalid hex color format';
            }
            
            Themes.setColor(type, color);
            return `Color updated: ${type} = ${color}`;
        }, { description: 'Change overlay colors', usage: '!color <type> <hex>' });

        // Background control
        this.register('background', async (args) => {
            if (!args.length) return 'Usage: !background <image_path|video_path>';
            
            const path = args.join(' ');
            const ext = path.split('.').pop().toLowerCase();
            
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                await Media.setBackgroundImage(path);
                return `Background set to: ${path}`;
            } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
                const video = Media.createVideoBackground(path);
                document.getElementById('background-layer').appendChild(video);
                return `Video background set: ${path}`;
            }
            
            return 'Unsupported file format';
        }, { description: 'Set background image or video', usage: '!background <path>' });

        // Image/GIF display
        this.register('image', async (args) => {
            if (!args.length) return 'Usage: !image <path>';
            
            const path = args.join(' ');
            try {
                await Media.setBackgroundImage(path);
                return `Image displayed: ${path}`;
            } catch (error) {
                return `Failed to load image: ${error.message}`;
            }
        }, { description: 'Display an image', usage: '!image <path>' });

        this.register('gif', (args) => {
            if (!args.length) return 'Usage: !gif <url>';
            
            const url = args.join(' ');
            Media.showGif(url);
            return 'GIF displayed';
        }, { description: 'Display a GIF reaction', usage: '!gif <url>' });

        // Video overlay
        this.register('video', (args) => {
            if (!args.length) return 'Usage: !video <path>';
            
            const path = args.join(' ');
            const video = Media.createOverlayVideo(path);
            document.getElementById('content-wrapper').appendChild(video);
            
            setTimeout(() => video.remove(), 10000); // Auto-remove after 10s
            return 'Video overlay playing';
        }, { description: 'Play video overlay', usage: '!video <path>' });

        // Sound effects
        this.register('sound', (args) => {
            if (!args.length) return 'Usage: !sound <name>|volume <0-1>';
            
            if (args[0] === 'volume' && args[1]) {
                const volume = parseFloat(args[1]);
                if (isNaN(volume) || volume < 0 || volume > 1) {
                    return 'Volume must be between 0 and 1';
                }
                Media.setVolume(volume);
                return `Volume set to ${volume * 100}%`;
            }
            
            const soundName = args.join(' ');
            Media.playSound(soundName);
            return `Playing sound: ${soundName}`;
        }, { description: 'Play sound effect', usage: '!sound <name>|volume <value>' });

        // Icon style
        this.register('icon', (args) => {
            if (!args.length) return 'Usage: !icon <outline|filled|duotone>';
            
            const style = args[0].toLowerCase();
            const validStyles = ['outline', 'filled', 'duotone'];
            
            if (!validStyles.includes(style)) {
                return `Invalid style. Use: ${validStyles.join(', ')}`;
            }
            
            CONFIG.appearance.icons.style = style;
            return `Icon style set to: ${style}`;
        }, { description: 'Change icon style', usage: '!icon <style>' });

        // Font change
        this.register('font', (args) => {
            if (!args.length) return 'Usage: !font <primary|mono> <font_name>';
            
            const [type, ...fontParts] = args;
            const font = fontParts.join(' ');
            const validTypes = ['primary', 'mono'];
            
            if (!validTypes.includes(type.toLowerCase())) {
                return `Invalid type. Use: ${validTypes.join(', ')}`;
            }
            
            Utils.setCSSVariable(`--font-${type}`, font);
            return `Font updated: ${type} = ${font}`;
        }, { description: 'Change fonts', usage: '!font <type> <name>' });

        // Animation control
        this.register('animation', (args) => {
            if (!args.length) return 'Usage: !animation <enable|disable|type>';
            
            const action = args[0].toLowerCase();
            
            switch (action) {
                case 'enable':
                    Animations.setEnabled(true);
                    return 'Animations enabled';
                case 'disable':
                    Animations.setEnabled(false);
                    return 'Animations disabled';
                case 'type':
                    if (!args[1]) return 'Available types: fade-in, slide-in, zoom-in';
                    CONFIG.animations.entrance = args[1];
                    return `Animation type set to: ${args[1]}`;
                default:
                    return 'Unknown action. Use: enable, disable, or type';
            }
        }, { description: 'Control animations', usage: '!animation <action>' });

        // Particle control
        this.register('particles', (args) => {
            if (!args.length) return 'Usage: !particles <enable|disable|count|behavior>';
            
            const action = args[0].toLowerCase();
            
            switch (action) {
                case 'enable':
                    Particles.setEnabled(true);
                    return 'Particles enabled';
                case 'disable':
                    Particles.setEnabled(false);
                    return 'Particles disabled';
                case 'count':
                    if (!args[1]) return `Current count: ${Particles.getStats().count}`;
                    const count = parseInt(args[1]);
                    if (isNaN(count)) return 'Count must be a number';
                    Particles.setCount(count);
                    return `Particle count set to: ${count}`;
                case 'behavior':
                    if (!args[1]) return `Current behavior: ${Particles.getStats().behavior}`;
                    const behavior = args[1].toLowerCase();
                    const validBehaviors = ['float', 'rise', 'fall', 'spiral'];
                    if (!validBehaviors.includes(behavior)) {
                        return `Invalid behavior. Use: ${validBehaviors.join(', ')}`;
                    }
                    Particles.setBehavior(behavior);
                    return `Particle behavior set to: ${behavior}`;
                default:
                    return 'Unknown action. Use: enable, disable, count, or behavior';
            }
        }, { description: 'Control particle effects', usage: '!particles <action>' });

        // Layout control
        this.register('layout', (args) => {
            if (!args.length) return 'Usage: !layout <scale|opacity|position>';
            
            const action = args[0].toLowerCase();
            
            switch (action) {
                case 'scale':
                    if (!args[1]) return `Current scale: ${CONFIG.layout.scale}`;
                    const scale = parseFloat(args[1]);
                    if (isNaN(scale) || scale < 0.5 || scale > 2) {
                        return 'Scale must be between 0.5 and 2';
                    }
                    CONFIG.layout.scale = scale;
                    document.getElementById('content-wrapper').style.transform = `scale(${scale})`;
                    return `Scale set to: ${scale}`;
                case 'opacity':
                    if (!args[1]) return `Current opacity: ${CONFIG.layout.opacity}`;
                    const opacity = parseFloat(args[1]);
                    if (isNaN(opacity) || opacity < 0 || opacity > 1) {
                        return 'Opacity must be between 0 and 1';
                    }
                    CONFIG.layout.opacity = opacity;
                    document.getElementById('content-wrapper').style.opacity = opacity;
                    return `Opacity set to: ${opacity * 100}%`;
                case 'position':
                    if (!args[1]) return `Current position: ${CONFIG.layout.position}`;
                    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
                    if (!positions.includes(args[1])) {
                        return `Invalid position. Use: ${positions.join(', ')}`;
                    }
                    CONFIG.layout.position = args[1];
                    return `Position set to: ${args[1]} (may require CSS adjustment)`;
                default:
                    return 'Unknown action. Use: scale, opacity, or position';
            }
        }, { description: 'Control layout', usage: '!layout <action>' });

        // Reload overlay
        this.register('reload', () => {
            window.location.reload();
            return 'Reloading overlay...';
        }, { description: 'Reload the overlay' });

        // Help command
        this.register('help', () => {
            const commandList = Object.entries(this.commands)
                .map(([name, cmd]) => `!${name} - ${cmd.description}`)
                .join('\n');
            return `Available Commands:\n${commandList}`;
        }, { description: 'Show available commands' });
    },

    /**
     * Register a new command
     * @param {string} name - Command name
     * @param {Function} handler - Command handler function
     * @param {Object} options - Command options
     */
    register(name, handler, options = {}) {
        this.commands[name.toLowerCase()] = {
            name: name.toLowerCase(),
            handler,
            description: options.description || '',
            usage: options.usage || `!${name}`,
            cooldown: options.cooldown || CONFIG.commands.cooldown,
            allowedUsers: options.allowedUsers || CONFIG.commands.allowedUsers,
        };
    },

    /**
     * Setup command listener (for chat integration)
     */
    setupCommandListener() {
        // Listen for custom events from external sources
        window.addEventListener('overlay-command', (event) => {
            const { command, args, user } = event.detail;
            this.execute(command, args, user);
        });

        // Keyboard shortcuts for testing
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const command = prompt('Enter command (without !):');
                if (command) {
                    this.execute(command, []);
                }
            }
        });
    },

    /**
     * Execute a command
     * @param {string} name - Command name
     * @param {Array} args - Command arguments
     * @param {Object} user - User info (optional)
     * @returns {Promise<string>} Command result
     */
    async execute(name, args = [], user = { level: 'viewer' }) {
        const commandName = name.toLowerCase().replace(CONFIG.commands.prefix, '');
        const command = this.commands[commandName];

        if (!command) {
            Utils.warn(`Unknown command: ${commandName}`);
            return `Unknown command: !${commandName}`;
        }

        // Check cooldown
        const now = Date.now();
        const lastUse = this.cooldowns.get(commandName);
        if (lastUse && now - lastUse < command.cooldown) {
            const remaining = Math.ceil((command.cooldown - (now - lastUse)) / 1000);
            return `Command on cooldown. Try again in ${remaining}s`;
        }

        // Check permissions
        if (command.allowedUsers && !command.allowedUsers.includes(user.level)) {
            return 'You do not have permission to use this command';
        }

        // Execute command
        try {
            this.cooldowns.set(commandName, now);
            const result = await command.handler(args, user);
            
            Utils.log(`Command executed: !${commandName}`, { args, user, result });
            
            // Trigger callback if defined
            if (CONFIG.callbacks.onCommand) {
                CONFIG.callbacks.onCommand(commandName, args, user);
            }

            // Show notification
            if (result && typeof result === 'string') {
                Widgets.showNotification({ message: result, type: 'command' });
            }

            return result;
        } catch (error) {
            Utils.error(`Command failed: !${commandName}`, error);
            return `Error executing command: ${error.message}`;
        }
    },

    /**
     * Parse command string into name and arguments
     * @param {string} str - Command string
     * @returns {Object} Parsed command
     */
    parse(str) {
        const parts = str.trim().split(/\s+/);
        const command = parts.shift().toLowerCase();
        const args = parts;
        
        return { command, args };
    },

    /**
     * Process chat message for commands
     * @param {string} message - Chat message
     * @param {Object} user - User info
     */
    processMessage(message, user = {}) {
        if (!message.startsWith(CONFIG.commands.prefix)) return;
        
        const { command, args } = this.parse(message);
        this.execute(command, args, user);
    },

    /**
     * Get command info
     * @param {string} name - Command name
     * @returns {Object|null} Command info
     */
    getInfo(name) {
        return this.commands[name.toLowerCase()] || null;
    },

    /**
     * List all commands
     * @returns {Array} Command names
     */
    list() {
        return Object.keys(this.commands);
    },

    /**
     * Remove a command
     * @param {string} name - Command name
     */
    unregister(name) {
        delete this.commands[name.toLowerCase()];
        this.cooldowns.delete(name.toLowerCase());
    },

    /**
     * Clear all cooldowns
     */
    clearCooldowns() {
        this.cooldowns.clear();
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Commands;
}
