/**
 * ============================================
 * SMART OVERLAY - PROVIDERS MANAGER
 * Production-Ready Browser Source Overlay
 * Modular provider architecture for platform integration
 * ============================================
 */

const Providers = {
    // Active providers
    active: {},
    
    // Provider states
    states: {
        twitch: {
            isLive: false,
            channel: null,
            viewers: 0,
            followers: 0,
            subscribers: 0,
            bits: 0,
            title: '',
            category: '',
            avatar: '',
            startTime: null,
            events: []
        },
        tiktok: {
            isLive: false,
            username: null,
            viewers: 0,
            likes: 0,
            gifts: 0,
            followers: 0,
            title: '',
            avatar: '',
            startTime: null,
            events: []
        }
    },

    /**
     * Initialize all providers
     */
    init() {
        Utils.log('Providers manager initialized');
        
        // Initialize Twitch if enabled
        if (CONFIG.twitch.enabled) {
            this.initTwitch();
        }
        
        // Initialize TikTok if enabled
        if (CONFIG.tiktok.enabled) {
            this.initTikTok();
        }
        
        // Start platform detection
        if (CONFIG.platform.autoDetect) {
            this.startPlatformDetection();
        }
    },

    /**
     * Initialize Twitch provider
     */
    initTwitch() {
        this.active.twitch = {
            connected: false,
            ws: null,
            reconnectAttempts: 0,
            maxReconnects: 5,
            
            // Connect to Twitch WebSocket
            connect: () => {
                if (!CONFIG.twitch.channel) {
                    Utils.log('Twitch channel not configured', 'warn');
                    return;
                }
                
                Utils.log('Connecting to Twitch...');
                
                // Simulated connection (replace with actual Twitch API/WebSocket)
                this.states.twitch.isLive = true;
                this.states.twitch.channel = CONFIG.twitch.channel;
                this.states.twitch.startTime = Date.now();
                
                // Mock data for demonstration
                this.updateTwitchData({
                    viewers: Utils.random(100, 5000),
                    followers: Utils.random(10000, 100000),
                    subscribers: Utils.random(500, 5000),
                    bits: Utils.random(1000, 50000),
                    title: 'Amazing Stream! Come hang out!',
                    category: 'Just Chatting',
                    avatar: CONFIG.media.defaultAvatar
                });
                
                this.active.twitch.connected = true;
                this.onProviderUpdate('twitch');
                
                // Simulate live updates
                this.active.twitch.updateInterval = setInterval(() => {
                    this.simulateTwitchUpdates();
                }, 5000);
                
                Utils.log('Twitch provider connected');
            },
            
            // Disconnect from Twitch
            disconnect: () => {
                if (this.active.twitch.updateInterval) {
                    clearInterval(this.active.twitch.updateInterval);
                }
                
                this.states.twitch.isLive = false;
                this.active.twitch.connected = false;
                
                Utils.log('Twitch provider disconnected');
            }
        };
        
        this.active.twitch.connect();
    },

    /**
     * Update Twitch data
     */
    updateTwitchData(data) {
        const state = this.states.twitch;
        
        if (data.viewers !== undefined) state.viewers = data.viewers;
        if (data.followers !== undefined) state.followers = data.followers;
        if (data.subscribers !== undefined) state.subscribers = data.subscribers;
        if (data.bits !== undefined) state.bits = data.bits;
        if (data.title !== undefined) state.title = data.title;
        if (data.category !== undefined) state.category = data.category;
        if (data.avatar !== undefined) state.avatar = data.avatar;
        
        Widgets.updateTwitch(state);
    },

    /**
     * Simulate Twitch updates
     */
    simulateTwitchUpdates() {
        const state = this.states.twitch;
        
        // Fluctuate viewer count
        const variation = Utils.random(-50, 50);
        state.viewers = Math.max(0, state.viewers + variation);
        
        // Increment followers/subs occasionally
        if (Math.random() < 0.1) {
            state.followers += Utils.random(1, 5);
        }
        if (Math.random() < 0.05) {
            state.subscribers += Utils.random(1, 3);
        }
        if (Math.random() < 0.1) {
            state.bits += Utils.random(10, 100);
        }
        
        // Update uptime
        state.uptime = Date.now() - state.startTime;
        
        this.onProviderUpdate('twitch');
    },

    /**
     * Initialize TikTok provider
     */
    initTikTok() {
        this.active.tiktok = {
            connected: false,
            reconnectAttempts: 0,
            maxReconnects: CONFIG.tiktok.reconnectAttempts,
            
            // Connect to TikTok Live
            connect: () => {
                if (!CONFIG.tiktok.username && !CONFIG.tiktok.roomId) {
                    Utils.log('TikTok username/roomId not configured', 'warn');
                    return;
                }
                
                Utils.log('Connecting to TikTok Live...');
                
                // Simulated connection
                this.states.tiktok.isLive = true;
                this.states.tiktok.username = CONFIG.tiktok.username || 'tiktok_user';
                this.states.tiktok.startTime = Date.now();
                
                // Mock data for demonstration
                this.updateTikTokData({
                    viewers: Utils.random(50, 3000),
                    likes: Utils.random(5000, 50000),
                    gifts: Utils.random(100, 5000),
                    followers: Utils.random(5000, 50000),
                    title: 'Live from TikTok!',
                    avatar: CONFIG.media.defaultAvatar
                });
                
                this.active.tiktok.connected = true;
                this.onProviderUpdate('tiktok');
                
                // Simulate live updates
                this.active.tiktok.updateInterval = setInterval(() => {
                    this.simulateTikTokUpdates();
                }, 5000);
                
                Utils.log('TikTok provider connected');
            },
            
            // Disconnect from TikTok
            disconnect: () => {
                if (this.active.tiktok.updateInterval) {
                    clearInterval(this.active.tiktok.updateInterval);
                }
                
                this.states.tiktok.isLive = false;
                this.active.tiktok.connected = false;
                
                Utils.log('TikTok provider disconnected');
            }
        };
        
        this.active.tiktok.connect();
    },

    /**
     * Update TikTok data
     */
    updateTikTokData(data) {
        const state = this.states.tiktok;
        
        if (data.viewers !== undefined) state.viewers = data.viewers;
        if (data.likes !== undefined) state.likes = data.likes;
        if (data.gifts !== undefined) state.gifts = data.gifts;
        if (data.followers !== undefined) state.followers = data.followers;
        if (data.title !== undefined) state.title = data.title;
        if (data.avatar !== undefined) state.avatar = data.avatar;
        
        Widgets.updateTikTok(state);
    },

    /**
     * Simulate TikTok updates
     */
    simulateTikTokUpdates() {
        const state = this.states.tiktok;
        
        // Fluctuate viewer count
        const variation = Utils.random(-30, 30);
        state.viewers = Math.max(0, state.viewers + variation);
        
        // Increment likes/gifts
        if (Math.random() < 0.2) {
            state.likes += Utils.random(10, 100);
        }
        if (Math.random() < 0.1) {
            state.gifts += Utils.random(1, 10);
        }
        if (Math.random() < 0.05) {
            state.followers += Utils.random(1, 5);
        }
        
        // Update uptime
        state.uptime = Date.now() - state.startTime;
        
        this.onProviderUpdate('tiktok');
    },

    /**
     * Start platform detection
     */
    startPlatformDetection() {
        const detect = () => {
            const twitchLive = this.states.twitch.isLive;
            const tiktokLive = this.states.tiktok.isLive;
            
            this.determineDisplayMode(twitchLive, tiktokLive);
        };
        
        detect(); // Initial detection
        setInterval(detect, CONFIG.platform.checkInterval);
    },

    /**
     * Determine display mode based on platform states
     */
    determineDisplayMode(twitchLive, tiktokLive) {
        const mode = CONFIG.platform.mode;
        let displayMode = 'hidden';
        
        if (mode === 'auto') {
            if (twitchLive && tiktokLive) {
                displayMode = 'dual';
            } else if (twitchLive) {
                displayMode = 'twitch';
            } else if (tiktokLive) {
                displayMode = 'tiktok';
            }
        } else if (mode === 'twitch' && twitchLive) {
            displayMode = 'twitch';
        } else if (mode === 'tiktok' && tiktokLive) {
            displayMode = 'tiktok';
        } else if (mode === 'dual' && (twitchLive || tiktokLive)) {
            displayMode = 'dual';
        }
        
        this.setDisplayMode(displayMode);
    },

    /**
     * Set display mode
     */
    setDisplayMode(mode) {
        const twitchPanel = document.getElementById('twitch-panel');
        const tiktokPanel = document.getElementById('tiktok-panel');
        const dualPanel = document.getElementById('dual-panel');
        
        // Hide all panels first
        [twitchPanel, tiktokPanel, dualPanel].forEach(panel => {
            if (panel) panel.classList.add('hidden');
        });
        
        // Show appropriate panel
        switch (mode) {
            case 'twitch':
                if (twitchPanel) twitchPanel.classList.remove('hidden');
                break;
            case 'tiktok':
                if (tiktokPanel) tiktokPanel.classList.remove('hidden');
                break;
            case 'dual':
                if (dualPanel) dualPanel.classList.remove('hidden');
                break;
            default:
                // Keep all hidden
                break;
        }
        
        Utils.log(`Display mode set to: ${mode}`);
        window.dispatchEvent(new CustomEvent('displayModeChanged', { detail: mode }));
    },

    /**
     * Handle provider update
     */
    onProviderUpdate(platform) {
        const state = this.states[platform];
        
        // Update dual panel stats
        if (platform === 'twitch') {
            const dualViewers = document.getElementById('dual-twitch-viewers');
            if (dualViewers) {
                dualViewers.textContent = Utils.formatNumber(state.viewers);
            }
        } else if (platform === 'tiktok') {
            const dualViewers = document.getElementById('dual-tiktok-viewers');
            if (dualViewers) {
                dualViewers.textContent = Utils.formatNumber(state.viewers);
            }
        }
    },

    /**
     * Add event to platform
     */
    addEvent(platform, event) {
        const state = this.states[platform];
        if (!state) return;
        
        event.timestamp = Date.now();
        event.id = Utils.generateId();
        
        state.events.unshift(event);
        
        // Limit events
        if (state.events.length > CONFIG[platform].maxEvents) {
            state.events.pop();
        }
        
        Widgets.addEvent(platform, event);
        
        // Play sound if configured
        if (event.soundType && CONFIG.sounds.enabled) {
            Media.playSound(event.soundType);
        }
    },

    /**
     * Get provider state
     */
    getState(platform) {
        return this.states[platform] || null;
    },

    /**
     * Get all states
     */
    getAllStates() {
        return { ...this.states };
    },

    /**
     * Check if any platform is live
     */
    isAnyLive() {
        return this.states.twitch.isLive || this.states.tiktok.isLive;
    },

    /**
     * Force refresh provider data
     */
    refresh(platform) {
        if (platform === 'twitch' && this.active.twitch) {
            this.simulateTwitchUpdates();
        } else if (platform === 'tiktok' && this.active.tiktok) {
            this.simulateTikTokUpdates();
        }
    },

    /**
     * Disconnect all providers
     */
    disconnectAll() {
        if (this.active.twitch) {
            this.active.twitch.disconnect();
        }
        if (this.active.tiktok) {
            this.active.tiktok.disconnect();
        }
        
        Utils.log('All providers disconnected');
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Providers;
}
