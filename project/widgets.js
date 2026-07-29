/**
 * ============================================
 * WIDGETS.JS - Widget Management
 * Handles UI widget updates and rendering
 * ============================================
 */

const Widgets = {
    /**
     * DOM element cache
     */
    elements: {},

    /**
     * Initialize widgets
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        Utils.log('Widgets initialized');
    },

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        // Header elements
        this.elements.header = document.getElementById('stream-header');
        this.elements.avatar = document.getElementById('streamer-avatar');
        this.elements.title = document.getElementById('stream-title');
        this.elements.category = document.getElementById('stream-category');
        this.elements.viewers = document.getElementById('viewer-count');
        this.elements.uptime = document.getElementById('uptime');

        // Twitch panel elements
        this.elements.twitchPanel = document.getElementById('twitch-panel');
        this.elements.twitchFollowers = document.getElementById('twitch-followers');
        this.elements.twitchSubscribers = document.getElementById('twitch-subscribers');
        this.elements.twitchBits = document.getElementById('twitch-bits');
        this.elements.twitchGifts = document.getElementById('twitch-gifts');
        this.elements.twitchEvents = document.getElementById('twitch-events');
        this.elements.twitchGoals = document.getElementById('twitch-goals');

        // TikTok panel elements
        this.elements.tiktokPanel = document.getElementById('tiktok-panel');
        this.elements.tiktokLikes = document.getElementById('tiktok-likes');
        this.elements.tiktokDiamonds = document.getElementById('tiktok-diamonds');
        this.elements.tiktokComments = document.getElementById('tiktok-comments');
        this.elements.tiktokShares = document.getElementById('tiktok-shares');
        this.elements.tiktokEvents = document.getElementById('tiktok-events');
        this.elements.tiktokGoals = document.getElementById('tiktok-goals');

        // Footer elements
        this.elements.footer = document.getElementById('stream-footer');
        this.elements.recentEvents = document.getElementById('recent-events');
        this.elements.socialLinks = document.getElementById('social-links');

        // Utility elements
        this.elements.loadingIndicator = document.getElementById('loading-indicator');
        this.elements.backgroundLayer = document.getElementById('background-layer');
        this.elements.glassOverlay = document.getElementById('glass-overlay');
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for provider updates
        Providers.on('twitchUpdate', (data) => this.updateTwitchWidgets(data));
        Providers.on('tiktokUpdate', (data) => this.updateTikTokWidgets(data));
        Providers.on('platformActivated', (platform) => this.showPanel(platform));
        Providers.on('platformDeactivated', (platform) => this.hidePanel(platform));
    },

    /**
     * Update header with stream data
     * @param {Object} data - Stream data
     */
    updateHeader(data) {
        if (!data) return;

        if (CONFIG.widgets.header.showAvatar && data.avatar) {
            Media.setAvatar(data.avatar, this.elements.avatar);
        }

        if (CONFIG.widgets.header.showTitle && data.title) {
            this.elements.title.textContent = data.title;
        }

        if (CONFIG.widgets.header.showCategory && data.category) {
            this.elements.category.textContent = data.category;
        }

        if (CONFIG.widgets.header.showViewers && data.viewers !== undefined) {
            Animations.animateCounter(this.elements.viewers, data.viewers);
        }

        if (CONFIG.widgets.header.showUptime && data.uptime !== undefined) {
            this.elements.uptime.textContent = Utils.formatUptime(data.uptime);
        }
    },

    /**
     * Update Twitch widgets
     * @param {Object} data - Twitch data
     */
    updateTwitchWidgets(data) {
        if (!CONFIG.widgets.twitch.enabled) return;

        // Update header
        this.updateHeader(data);

        // Update stats
        if (CONFIG.widgets.twitch.showFollowers && data.followers !== undefined) {
            Animations.animateCounter(this.elements.twitchFollowers, data.followers);
        }

        if (CONFIG.widgets.twitch.showSubscribers && data.subscribers !== undefined) {
            Animations.animateCounter(this.elements.twitchSubscribers, data.subscribers);
        }

        if (CONFIG.widgets.twitch.showBits && data.bits !== undefined) {
            Animations.animateCounter(this.elements.twitchBits, data.bits);
        }

        if (CONFIG.widgets.twitch.showGifts && data.gifts !== undefined) {
            Animations.animateCounter(this.elements.twitchGifts, data.gifts);
        }

        // Update events feed
        if (CONFIG.widgets.twitch.showEvents && data.recentEvents) {
            this.updateEventsFeed(this.elements.twitchEvents, data.recentEvents, 'twitch');
        }

        // Update goals
        if (CONFIG.widgets.twitch.showGoals && data.goals) {
            this.updateGoals(this.elements.twitchGoals, data.goals);
        }
    },

    /**
     * Update TikTok widgets
     * @param {Object} data - TikTok data
     */
    updateTikTokWidgets(data) {
        if (!CONFIG.widgets.tiktok.enabled) return;

        // Update header
        this.updateHeader(data);

        // Update stats
        if (CONFIG.widgets.tiktok.showLikes && data.likes !== undefined) {
            Animations.animateCounter(this.elements.tiktokLikes, data.likes);
        }

        if (CONFIG.widgets.tiktok.showDiamonds && data.diamonds !== undefined) {
            Animations.animateCounter(this.elements.tiktokDiamonds, data.diamonds);
        }

        if (CONFIG.widgets.tiktok.showComments && data.comments !== undefined) {
            Animations.animateCounter(this.elements.tiktokComments, data.comments);
        }

        if (CONFIG.widgets.tiktok.showShares && data.shares !== undefined) {
            Animations.animateCounter(this.elements.tiktokShares, data.shares);
        }

        // Update events feed
        if (CONFIG.widgets.tiktok.showEvents && data.recentEvents) {
            this.updateEventsFeed(this.elements.tiktokEvents, data.recentEvents, 'tiktok');
        }

        // Update goals
        if (CONFIG.widgets.tiktok.showGoals && data.goals) {
            this.updateGoals(this.elements.tiktokGoals, data.goals);
        }
    },

    /**
     * Update events feed
     * @param {HTMLElement} container - Events container
     * @param {Array} events - Events array
     * @param {string} platform - Platform name
     */
    updateEventsFeed(container, events, platform) {
        if (!container || !events.length) return;

        const maxEvents = platform === 'twitch' 
            ? CONFIG.widgets.twitch.maxEvents 
            : CONFIG.widgets.tiktok.maxEvents;

        const recentEvents = events.slice(0, maxEvents);
        
        container.innerHTML = recentEvents.map(event => this.renderEvent(event, platform)).join('');
    },

    /**
     * Render single event
     * @param {Object} event - Event data
     * @param {string} platform - Platform name
     * @returns {string} HTML string
     */
    renderEvent(event, platform) {
        const icons = {
            follow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
            subscribe: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12V5.26C20 4.59 19.41 4 18.68 4H16V2h-2v2h-4V2H8v2H5.32C4.59 4 4 4.59 4 5.26V12c0 2.21 1.79 4 4 4h1v6h2v-6h6v6h2v-6h1c2.21 0 4-1.79 4-4z"/></svg>',
            bits: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
            gift: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12V5.26C20 4.59 19.41 4 18.68 4H16V2h-2v2h-4V2H8v2H5.32C4.59 4 4 4.59 4 5.26V12c0 2.21 1.79 4 4 4h1v6h2v-6h6v6h2v-6h1c2.21 0 4-1.79 4-4z"/></svg>',
            like: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
            comment: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>',
            share: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>',
        };

        const colors = {
            twitch: '#9146ff',
            tiktok: '#00f2ea',
        };

        const type = event.type.toLowerCase();
        const icon = icons[type] || icons.follow;
        const color = colors[platform];
        const timeAgo = Utils.formatRelativeTime(event.time);

        let text = '';
        switch (type) {
            case 'follow':
                text = `${event.user} followed!`;
                break;
            case 'subscribe':
                text = `${event.user} subscribed${event.amount > 1 ? ` (${event.amount} months)` : ''}!`;
                break;
            case 'bits':
                text = `${event.user} cheered ${Utils.formatNumber(event.amount)} bits!`;
                break;
            case 'gift':
                text = `${event.user} sent a ${event.giftType || 'gift'}!`;
                break;
            case 'like':
                text = `${Utils.formatNumber(event.count)} likes received!`;
                break;
            case 'comment':
                text = `${event.user}: ${event.message}`;
                break;
            case 'share':
                text = `${event.user} shared the stream!`;
                break;
            default:
                text = JSON.stringify(event);
        }

        return `
            <div class="event-item">
                <div class="event-icon" style="background: ${color}20; color: ${color}">
                    ${icon}
                </div>
                <div class="event-content">
                    <div class="event-text">${text}</div>
                    <div class="event-time">${timeAgo}</div>
                </div>
            </div>
        `;
    },

    /**
     * Update goals display
     * @param {HTMLElement} container - Goals container
     * @param {Object} goals - Goals data
     */
    updateGoals(container, goals) {
        if (!container || !goals) return;

        const goalEntries = Object.entries(goals);
        
        container.innerHTML = goalEntries.map(([key, goal]) => {
            const percentage = (goal.current / goal.target) * 100;
            const formattedCurrent = Utils.formatNumber(goal.current);
            const formattedTarget = Utils.formatNumber(goal.target);
            
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <span class="goal-title">${key.charAt(0).toUpperCase() + key.slice(1)} Goal</span>
                        <span class="goal-progress">${formattedCurrent}/${formattedTarget}</span>
                    </div>
                    <div class="goal-bar">
                        <div class="goal-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Animate goal fills after rendering
        requestAnimationFrame(() => {
            const fills = container.querySelectorAll('.goal-fill');
            goalEntries.forEach(([key, goal], index) => {
                const percentage = (goal.current / goal.target) * 100;
                Animations.animateGoal(fills[index], percentage);
            });
        });
    },

    /**
     * Show panel for platform
     * @param {string} platform - Platform name
     */
    showPanel(platform) {
        const panel = this.elements[`${platform}Panel`];
        if (panel) {
            panel.classList.remove('hidden');
            Animations.entrance(panel);
        }
    },

    /**
     * Hide panel for platform
     * @param {string} platform - Platform name
     */
    hidePanel(platform) {
        const panel = this.elements[`${platform}Panel`];
        if (panel) {
            Animations.fadeOut(panel).then(() => {
                panel.classList.add('hidden');
            });
        }
    },

    /**
     * Show notification toast
     * @param {Object} options - Notification options
     */
    showNotification(options) {
        if (!CONFIG.notifications.enabled) return;

        const container = this.elements.recentEvents;
        if (!container) return;

        const { message, type = 'info', duration = CONFIG.notifications.duration } = options;
        
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Auto-remove
        setTimeout(() => {
            toast.style.animation = 'fade-out 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Setup social links
     * @param {Array} links - Social link configurations
     */
    setupSocialLinks(links) {
        if (!this.elements.socialLinks || !links.length) return;

        const icons = {
            twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>',
            youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
            instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>',
            discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.1.05 10.2 10.2 0 0 0-.45.93 13.85 13.85 0 0 0-2.9 0 10.16 10.16 0 0 0-.45-.93.1.1 0 0 0-.1-.05c-1.5.26-2.93.71-4.27 1.33a.1.1 0 0 0-.05.04C3.67 9.82 3.18 14.12 3.74 18.36a.11.11 0 0 0 .04.07 14.34 14.34 0 0 0 4.53 2.3.1.1 0 0 0 .11-.04 10.3 10.3 0 0 0 .93-1.53.1.1 0 0 0-.05-.13 9.48 9.48 0 0 1-1.36-.65.1.1 0 0 1 0-.17c.09-.07.18-.14.27-.21a.1.1 0 0 1 .1 0c2.96 1.36 6.16 1.36 9.09 0a.1.1 0 0 1 .11 0c.09.07.18.14.27.22a.1.1 0 0 1 0 .17 8.97 8.97 0 0 1-1.36.65.1.1 0 0 0-.05.13 10.23 10.23 0 0 0 .93 1.53.1.1 0 0 0 .11.04 14.3 14.3 0 0 0 4.53-2.3.1.1 0 0 0 .04-.07c.67-4.91-.6-9.18-3.54-13a.1.1 0 0 0-.05-.04zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.91.95 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.91.95 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/></svg>',
            tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53 0c-3.61 0-6.76 2.09-8.32 5.15-.12.24.11.5.38.5h2.55c.2 0 .38-.11.46-.29C8.54 3.54 10.37 2.3 12.53 2.3c.42 0 .83.04 1.22.12V7.1c0 .28.23.5.5.5h3.5c.28 0 .5-.22.5-.5V2.86c.89.59 1.93.94 3.03.94.28 0 .5-.22.5-.5V.5c0-.28-.22-.5-.5-.5-2.36 0-4.4-1.32-5.42-3.26C15.12.25 13.85 0 12.53 0z"/></svg>',
        };

        this.elements.socialLinks.innerHTML = links.map(link => {
            const icon = icons[link.platform.toLowerCase()] || '';
            return `
                <a href="${link.url}" target="_blank" rel="noopener" class="social-link" title="${link.platform}">
                    ${icon}
                </a>
            `;
        }).join('');
    },

    /**
     * Hide loading indicator
     */
    hideLoading() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.add('hidden');
        }
    },

    /**
     * Show loading indicator
     */
    showLoading() {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.classList.remove('hidden');
        }
    },

    /**
     * Set overlay visibility
     * @param {boolean} visible - Visibility state
     */
    setVisibility(visible) {
        const container = document.getElementById('content-wrapper');
        if (container) {
            container.style.opacity = visible ? '1' : '0';
            container.style.pointerEvents = visible ? 'auto' : 'none';
        }
    },

    /**
     * Update all widgets with current state
     */
    refresh() {
        const state = Providers.getCombinedState();
        
        if (state.twitch.data) {
            this.updateTwitchWidgets(state.twitch.data);
        }
        if (state.tiktok.data) {
            this.updateTikTokWidgets(state.tiktok.data);
        }
    },

    /**
     * Cleanup widgets
     */
    destroy() {
        // Remove event listeners
        // Clear intervals
        Utils.log('Widgets destroyed');
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Widgets;
}
