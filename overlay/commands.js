/**
 * ============================================
 * SMART OVERLAY - COMMANDS MANAGER
 * Production-Ready Browser Source Overlay
 * Custom command system for chat integration
 * ============================================
 */

const Commands = {
    // Registered commands
    registry: {},
    
    // Command cooldowns
    cooldowns: new Map(),
    
    // Last command time per user
    lastCommand: new Map(),
    
    // Command history
    history: [],

    /**
     * Initialize commands manager
     */
    init() {
        if (!CONFIG.commands.enabled) {
            Utils.log('Commands disabled in config');
            return;
        }
        
        Utils.log('Commands manager initialized');
        this.registerDefaultCommands();
        this.setupCommandListener();
    },

    /**
     * Register default commands
     */
    registerDefaultCommands() {
        // Show overlay
        this.register('show', (args, user) => {
            document.getElementById('overlay-container').classList.remove('hidden');
            Animations.fadeIn(document.getElementById('content-wrapper'));
            return 'Overlay shown';
        });

        // Hide overlay
        this.register('hide', (args, user) => {
            Animations.fadeOut(document.getElementById('content-wrapper'), 300, () => {
                document.getElementById('overlay-container').classList.add('hidden');
            });
            return 'Overlay hidden';
        });

        // Change theme
        this.register('theme', (args, user) => {
            const themeName = args[0];
            if (!themeName) {
                const themes = Themes.getThemes();
                return `Available themes: ${themes.map(t => t.name).join(', ')}`;
            }
            Themes.loadTheme(themeName.toLowerCase());
            return `Theme changed to: ${themeName}`;
        });

        // Set panel visibility
        this.register('panel', (args, user) => {
            const action = args[0];
            const panel = args[1];
            
            if (action === 'show' && panel) {
                const el = document.getElementById(`${panel}-panel`);
                if (el) {
                    el.classList.remove('hidden');
                    Animations.slideInRight(el);
                    return `${panel} panel shown`;
                }
            } else if (action === 'hide' && panel) {
                const el = document.getElementById(`${panel}-panel`);
                if (el) {
                    Animations.fadeOut(el, 300, () => el.classList.add('hidden'));
                    return `${panel} panel hidden`;
                }
            }
            
            return 'Usage: !panel [show|hide] [twitch|tiktok|dual]';
        });

        // Show stats
        this.register('stats', (args, user) => {
            const twitchState = Providers.getState('twitch');
            const tiktokState = Providers.getState('tiktok');
            const particleStats = Particles.getStats();
            const widgetStats = Widgets.getStats();
            
            let message = '📊 Stats: ';
            
            if (twitchState?.isLive) {
                message += `Twitch: ${twitchState.viewers} viewers | `;
            }
            if (tiktokState?.isLive) {
                message += `TikTok: ${tiktokState.viewers} viewers | `;
            }
            
            message += `Particles: ${particleStats.count} | FPS: ${CONFIG.app.fps}`;
            
            return message;
        });

        // Reset overlay
        this.register('reset', (args, user) => {
            location.reload();
            return 'Reloading overlay...';
        });

        // Change primary color
        this.register('color', (args, user) => {
            const color = args[0];
            if (!color) return 'Usage: !color #hexcolor';
            
            Utils.setCSSVariable('--primary-color', color);
            CONFIG.theme.colors.primary = color;
            return `Primary color set to: ${color}`;
        });

        // Set background
        this.register('background', (args, user) => {
            const url = args[0];
            const type = args[1] || 'image';
            
            if (!url) return 'Usage: !background <url> [image|video|gif]';
            
            Media.setBackground(url, type);
            return `Background set to: ${url}`;
        });

        // Set image/avatar
        this.register('image', (args, user) => {
            const platform = args[0];
            const url = args[1];
            
            if (!platform || !url) {
                return 'Usage: !image [twitch|tiktok] <url>';
            }
            
            Media.setAvatar(platform, url);
            return `${platform} avatar updated`;
        });

        // Play GIF effect
        this.register('gif', (args, user) => {
            const url = args[0];
            if (!url) return 'Usage: !gif <url>';
            
            Media.setBackground(url, 'gif');
            return 'GIF background set';
        });

        // Play video
        this.register('video', (args, user) => {
            const url = args[0];
            if (!url) return 'Usage: !video <url>';
            
            Media.setBackground(url, 'video');
            return 'Video background set';
        });

        // Play sound
        this.register('sound', (args, user) => {
            const soundType = args[0];
            if (!soundType) return 'Usage: !sound [follow|subscribe|gift|bits|raid]';
            
            Media.playSound(soundType);
            return `Playing sound: ${soundType}`;
        });

        // Toggle icons
        this.register('icon', (args, user) => {
            // Placeholder for icon customization
            return 'Icon customization coming soon';
        });

        // Change font
        this.register('font', (args, user) => {
            const fontFamily = args.join(' ');
            if (!fontFamily) return 'Usage: !font <font-family>';
            
            Media.applyFont(fontFamily);
            return `Font changed to: ${fontFamily}`;
        });

        // Toggle animations
        this.register('animation', (args, user) => {
            const action = args[0];
            
            if (action === 'toggle') {
                CONFIG.animations.enabled = !CONFIG.animations.enabled;
                return `Animations ${CONFIG.animations.enabled ? 'enabled' : 'disabled'}`;
            }
            
            return 'Usage: !animation toggle';
        });

        // Control particles
        this.register('particles', (args, user) => {
            const action = args[0];
            
            if (action === 'toggle') {
                Particles.toggle();
                return 'Particles toggled';
            } else if (action === 'count' && args[1]) {
                Particles.setCount(parseInt(args[1]));
                return `Particle count set to: ${args[1]}`;
            } else if (action === 'clear') {
                Particles.clear();
                return 'Particles cleared';
            }
            
            return 'Usage: !particles [toggle|count <n>|clear]';
        });

        // Change layout
        this.register('layout', (args, user) => {
            const position = args[0];
            if (!position) return 'Usage: !layout [top-left|top-right|bottom-left|bottom-right|center]';
            
            Widgets.setPosition(position);
            return `Layout set to: ${position}`;
        });

        // Set scale
        this.register('scale', (args, user) => {
            const scale = parseFloat(args[0]);
            if (isNaN(scale)) return 'Usage: !scale <0.5-2.0>';
            
            Widgets.setScale(scale);
            return `Scale set to: ${scale}`;
        });

        // Set opacity
        this.register('opacity', (args, user) => {
            const opacity = parseFloat(args[0]);
            if (isNaN(opacity)) return 'Usage: !opacity <0-1>';
            
            Widgets.setOpacity(opacity);
            return `Opacity set to: ${opacity}`;
        });

        // Reload configuration
        this.register('reload', (async (args, user) => {
            // In a real implementation, this would fetch new config
            Widgets.refresh();
            return 'Configuration reloaded';
        }));

        // Help command
        this.register('help', (args, user) => {
            const commands = Object.keys(this.registry);
            return `Available commands: ${commands.join(', ')}`;
        });

        // Randomize theme
        this.register('randomize', (args, user) => {
            Themes.randomize();
            return 'Theme randomized!';
        });

        // Test alert
        this.register('testalert', (args, user) => {
            Widgets.showAlert('Test Alert', 'This is a test notification!', '🎉');
            return 'Test alert shown';
        });

        // Simulate event
        this.register('simulate', (args, user) => {
            const platform = args[0] || 'twitch';
            const eventType = args[1] || 'follow';
            
            const event = {
                type: eventType,
                message: `Simulated ${eventType} from ${user || 'Viewer'}`,
                soundType: eventType
            };
            
            Providers.addEvent(platform, event);
            return `Simulated ${eventType} on ${platform}`;
        });
    },

    /**
     * Register a new command
     */
    register(name, handler, options = {}) {
        const commandName = name.toLowerCase().replace('!', '');
        
        this.registry[commandName] = {
            name: commandName,
            handler: handler,
            cooldown: options.cooldown || CONFIG.commands.cooldown,
            permissions: options.permissions || ['all'],
            description: options.description || ''
        };
        
        Utils.log(`Command registered: !${commandName}`);
    },

    /**
     * Setup command listener
     */
    setupCommandListener() {
        // Listen for custom events (from chat integration)
        window.addEventListener('chatMessage', (event) => {
            const { username, message, badges } = event.detail;
            this.processCommand(username, message, badges);
        });

        // Listen for keyboard shortcuts (for testing)
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                const command = prompt('Enter command (without !):');
                if (command) {
                    this.execute(command, 'admin');
                }
            }
        });
    },

    /**
     * Process incoming chat message for commands
     */
    processCommand(username, message, badges = {}) {
        if (!message.startsWith(CONFIG.commands.prefix)) {
            return;
        }

        const parts = message.slice(1).split(' ');
        const command = parts.shift().toLowerCase();
        const args = parts;

        // Check if command exists
        if (!this.registry[command]) {
            return;
        }

        // Check permissions
        if (!this.checkPermissions(username, this.registry[command], badges)) {
            return;
        }

        // Check cooldown
        if (!this.checkCooldown(username, command)) {
            return;
        }

        // Execute command
        this.execute(command, username, args);
    },

    /**
     * Check user permissions
     */
    checkPermissions(username, command, badges) {
        const allowed = command.permissions;
        
        if (allowed.includes('all')) return true;
        if (allowed.includes(username.toLowerCase())) return true;
        
        if (allowed.includes('moderators') && badges.moderator) return true;
        if (allowed.includes('subscribers') && badges.subscriber) return true;
        if (allowed.includes('vip') && badges.vip) return true;
        
        return false;
    },

    /**
     * Check command cooldown
     */
    checkCooldown(username, command) {
        const key = `${username}:${command}`;
        const now = Date.now();
        const cmd = this.registry[command];
        
        const lastTime = this.lastCommand.get(key) || 0;
        
        if (now - lastTime < cmd.cooldown) {
            const remaining = Math.ceil((cmd.cooldown - (now - lastTime)) / 1000);
            Utils.log(`Command !${command} on cooldown for ${remaining}s`, 'debug');
            return false;
        }
        
        this.lastCommand.set(key, now);
        return true;
    },

    /**
     * Execute a command
     */
    async execute(command, username, args = []) {
        const cmd = this.registry[command];
        if (!cmd) {
            Utils.log(`Command !${command} not found`, 'warn');
            return null;
        }

        try {
            Utils.log(`Executing !${command} by ${username}`, 'info');
            
            const result = await cmd.handler(args, username);
            
            // Add to history
            this.history.push({
                command,
                username,
                args,
                timestamp: Date.now(),
                result
            });
            
            // Limit history
            if (this.history.length > 100) {
                this.history.shift();
            }
            
            return result;
        } catch (error) {
            Utils.log(`Error executing !${command}: ${error.message}`, 'error');
            return `Error: ${error.message}`;
        }
    },

    /**
     * Remove a command
     */
    unregister(name) {
        const commandName = name.toLowerCase().replace('!', '');
        delete this.registry[commandName];
        Utils.log(`Command !${commandName} unregistered`);
    },

    /**
     * Get command info
     */
    getInfo(name) {
        const commandName = name.toLowerCase().replace('!', '');
        return this.registry[commandName] || null;
    },

    /**
     * List all commands
     */
    list() {
        return Object.keys(this.registry);
    },

    /**
     * Get command history
     */
    getHistory(limit = 10) {
        return this.history.slice(-limit);
    },

    /**
     * Clear cooldowns
     */
    clearCooldowns() {
        this.lastCommand.clear();
        Utils.log('All command cooldowns cleared');
    },

    /**
     * Set command cooldown
     */
    setCooldown(name, ms) {
        const commandName = name.toLowerCase().replace('!', '');
        if (this.registry[commandName]) {
            this.registry[commandName].cooldown = ms;
            Utils.log(`Cooldown for !${commandName} set to ${ms}ms`);
        }
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Commands;
}
