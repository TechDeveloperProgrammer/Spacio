/**
 * ============================================
 * SMART OVERLAY - CONFIGURATION
 * Production-Ready Browser Source Overlay
 * ============================================
 */

const CONFIG = {
    // Application Settings
    app: {
        name: 'Smart Overlay',
        version: '1.0.0',
        debug: false,
        fps: 60
    },

    // Platform Detection
    platform: {
        autoDetect: true,
        mode: 'auto', // 'auto', 'twitch', 'tiktok', 'dual'
        checkInterval: 5000,
        twitchChannel: '',
        tiktokUsername: ''
    },

    // Display Settings
    display: {
        position: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
        scale: 1,
        opacity: 1,
        showOffline: false
    },

    // Theme Configuration
    theme: {
        active: 'default',
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
            neonGlow: true
        },
        fonts: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 16,
            weight: 'normal'
        },
        borderRadius: 12,
        spacing: {
            panelGap: 15,
            itemGap: 10,
            padding: 20
        }
    },

    // Animation Settings
    animations: {
        enabled: true,
        duration: 300,
        easing: 'ease',
        types: {
            panel: 'slideIn',
            counter: 'smooth',
            event: 'slideIn',
            alert: 'pop'
        }
    },

    // Particle Effects
    particles: {
        enabled: true,
        count: 50,
        size: { min: 1, max: 3 },
        speed: { min: 0.5, max: 2 },
        colors: ['#9146ff', '#ff0050', '#00f0ff', '#ffffff'],
        opacity: 0.6,
        fade: true
    },

    // Twitch Configuration
    twitch: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        accessToken: '',
        refreshToken: '',
        channel: '',
        showAvatar: true,
        showFollowers: true,
        showSubscribers: true,
        showBits: true,
        showViewers: true,
        showUptime: true,
        showTitle: true,
        showCategory: true,
        showGoals: true,
        followerGoal: 1000,
        chatEnabled: true,
        chatPosition: 'bottom-left',
        eventsEnabled: true,
        maxEvents: 10
    },

    // TikTok Configuration
    tiktok: {
        enabled: true,
        username: '',
        roomId: '',
        apiKey: '',
        showAvatar: true,
        showLikes: true,
        showGifts: true,
        showViewers: true,
        showFollowers: true,
        showUptime: true,
        eventsEnabled: true,
        maxEvents: 10,
        reconnectAttempts: 5,
        reconnectDelay: 3000
    },

    // Media Assets
    media: {
        icons: 'assets/icons/',
        images: 'assets/images/',
        videos: 'assets/videos/',
        sounds: 'assets/sounds/',
        fonts: 'assets/fonts/',
        defaultAvatar: 'assets/images/default-avatar.png',
        defaultBackground: 'assets/images/default-bg.jpg'
    },

    // Sound Effects
    sounds: {
        enabled: true,
        volume: 0.5,
        follow: null,
        subscribe: null,
        gift: null,
        bits: null,
        raid: null,
        host: null
    },

    // Custom Commands
    commands: {
        enabled: true,
        prefix: '!',
        allowedUsers: ['all'], // 'all', 'moderators', 'subscribers', 'vip', specific usernames
        cooldown: 3000
    },

    // Performance
    performance: {
        useGPU: true,
        lazyRender: true,
        renderDistance: 1000,
        maxFPS: 60,
        memoryLimit: 512
    },

    // Responsive Breakpoints
    responsive: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        ultrawide: 2560
    }
};

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
