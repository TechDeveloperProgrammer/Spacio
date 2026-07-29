/**
 * ============================================
 * CONFIG.JS - Central Configuration
 * All customizable settings for the overlay
 * ============================================
 */

const CONFIG = {
    // ========================================
    // GENERAL SETTINGS
    // ========================================
    general: {
        debug: false,                    // Enable debug mode
        fps: 60,                         // Target FPS
        autoHide: false,                 // Auto-hide when offline
        showLoading: true,               // Show loading indicator
        transitionDuration: 300,         // ms
    },

    // ========================================
    // PLATFORM DETECTION
    // ========================================
    platform: {
        enabled: true,                   // Enable platform detection
        mode: 'auto',                    // 'auto', 'twitch', 'tiktok', 'dual'
        twitch: {
            channel: '',                 // Twitch channel name
            clientId: '',                // Twitch API Client ID
            accessToken: '',             // Twitch OAuth token
            wsEnabled: true,             // Enable WebSocket (PubSub)
            wsToken: '',                 // PubSub token
        },
        tiktok: {
            roomId: '',                  // TikTok Live room ID
            wsEnabled: true,             // Enable WebSocket
            wsUrl: '',                   // Custom WebSocket URL
            reconnectInterval: 5000,     // ms
            maxReconnects: 10,
        },
        dualMode: {
            priority: 'twitch',          // 'twitch' or 'tiktok'
            showBoth: true,              // Show both panels when both live
        },
    },

    // ========================================
    // APPEARANCE & THEMES
    // ========================================
    appearance: {
        theme: 'default',                // 'default', 'dark', 'neon', 'glass', 'minimal'
        primaryColor: '#9146ff',         // Primary accent color
        secondaryColor: '#00f0ff',       // Secondary accent color
        accentColor: '#ff0050',          // Accent highlights
        backgroundOpacity: 0.3,          // 0-1
        glassOpacity: 0.5,               // 0-1
        glassBlur: 20,                   // px
        glowStrength: 15,                // px
        borderRadius: 12,                // px
        
        fonts: {
            primary: "'Inter', sans-serif",
            mono: "'JetBrains Mono', monospace",
        },
        
        icons: {
            style: 'outline',            // 'outline', 'filled', 'duotone'
            size: 24,                    // px
        },
    },

    // ========================================
    // LAYOUT & POSITIONING
    // ========================================
    layout: {
        position: 'center',              // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
        scale: 1,                        // 0.5-2
        opacity: 1,                      // 0-1
        padding: 24,                     // px
        gap: 24,                         // px between elements
        maxWidth: 1920,                  // px
        panelWidth: 400,                 // px
    },

    // ========================================
    // ANIMATIONS
    // ========================================
    animations: {
        enabled: true,
        reducedMotion: false,
        duration: {
            fast: 150,
            normal: 300,
            slow: 500,
        },
        easing: {
            default: 'cubic-bezier(0.4, 0, 0.2, 1)',
            elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
        entrance: 'fade-in',             // 'fade-in', 'slide-in', 'zoom-in', 'none'
        counterAnimation: 'count-up',    // 'count-up', 'smooth', 'instant'
    },

    // ========================================
    // PARTICLE EFFECTS
    // ========================================
    particles: {
        enabled: true,
        opacity: 0.6,
        count: 50,                       // Number of particles
        size: { min: 2, max: 5 },        // px
        speed: { min: 0.5, max: 2 },     // px/frame
        colors: ['#9146ff', '#00f0ff', '#ff0050', '#ffffff'],
        types: ['circle', 'square', 'triangle'],
        behavior: 'float',               // 'float', 'rise', 'fall', 'spiral'
    },

    // ========================================
    // WIDGETS
    // ========================================
    widgets: {
        header: {
            enabled: true,
            showAvatar: true,
            showTitle: true,
            showCategory: true,
            showViewers: true,
            showUptime: true,
            avatarSize: 80,              // px
        },
        twitch: {
            enabled: true,
            showFollowers: true,
            showSubscribers: true,
            showBits: true,
            showGifts: true,
            showGoals: true,
            showEvents: true,
            maxEvents: 10,
        },
        tiktok: {
            enabled: true,
            showLikes: true,
            showDiamonds: true,
            showComments: true,
            showShares: true,
            showGoals: true,
            showEvents: true,
            maxEvents: 10,
        },
        footer: {
            enabled: true,
            showNotifications: true,
            showSocialLinks: true,
            socialLinks: [],             // Array of {platform, url}
        },
    },

    // ========================================
    // GOALS
    // ========================================
    goals: {
        twitch: {
            follower: { enabled: true, target: 1000 },
            subscriber: { enabled: true, target: 100 },
            bits: { enabled: true, target: 10000 },
        },
        tiktok: {
            likes: { enabled: true, target: 10000 },
            diamonds: { enabled: true, target: 1000 },
        },
    },

    // ========================================
    // NOTIFICATIONS
    // ========================================
    notifications: {
        enabled: true,
        position: 'bottom-center',       // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-center'
        duration: 5000,                  // ms
        maxVisible: 3,
        animations: {
            enter: 'toast-in',
            exit: 'fade-out',
        },
        sounds: {
            follow: '',                  // Path to sound file
            subscribe: '',
            donation: '',
            raid: '',
        },
    },

    // ========================================
    // CUSTOM COMMANDS
    // ========================================
    commands: {
        enabled: true,
        prefix: '!',
        cooldown: 3000,                  // ms
        allowedUsers: ['moderator', 'broadcaster', 'vip'], // User levels
        custom: {},                      // Custom command definitions
    },

    // ========================================
    // MEDIA ASSETS
    // ========================================
    media: {
        images: {
            defaultAvatar: 'assets/images/default-avatar.png',
            backgrounds: [],             // Array of background image paths
        },
        videos: {
            backgrounds: [],             // Array of background video paths
            overlays: [],                // Array of overlay video paths
        },
        sounds: {
            enabled: true,
            volume: 0.5,                 // 0-1
            files: {},                   // Sound file mappings
        },
        gifs: {
            enabled: true,
            reactions: [],               // GIF URLs for reactions
        },
    },

    // ========================================
    // PERFORMANCE
    // ========================================
    performance: {
        useGPU: true,
        lazyRender: true,
        throttleUpdates: 100,            // ms between UI updates
        debounceResize: 250,             // ms
        cleanupInterval: 60000,          // ms
    },

    // ========================================
    // CALLBACKS (for external integration)
    // ========================================
    callbacks: {
        onPlatformChange: null,          // function(platform)
        onGoLive: null,                  // function(platform)
        onGoOffline: null,               // function(platform)
        onEvent: null,                   // function(event)
        onCommand: null,                 // function(command, args)
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
