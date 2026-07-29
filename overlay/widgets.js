/**
 * ============================================
 * SMART OVERLAY - WIDGETS MANAGER
 * Production-Ready Browser Source Overlay
 * UI widget rendering and updates
 * ============================================
 */

const Widgets = {
    // Widget state cache
    cache: {},
    
    // Event queue for batching
    eventQueue: [],
    
    // Update throttling
    lastUpdate: 0,
    updateThrottle: 100,

    /**
     * Initialize widgets manager
     */
    init() {
        Utils.log('Widgets manager initialized');
        this.setupResizeObserver();
    },

    /**
     * Setup resize observer for responsive behavior
     */
    setupResizeObserver() {
        if (!window.ResizeObserver) {
            Utils.log('ResizeObserver not supported', 'warn');
            return;
        }
        
        const observer = new ResizeObserver(Utils.debounce((entries) => {
            this.onResize(entries);
        }, 250));
        
        observer.observe(document.getElementById('overlay-container'));
    },

    /**
     * Handle resize events
     */
    onResize(entries) {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            
            // Update CSS variables for responsive scaling
            let scale = 1;
            if (width < CONFIG.responsive.mobile) {
                scale = 0.6;
            } else if (width < CONFIG.responsive.tablet) {
                scale = 0.8;
            }
            
            Utils.setCSSVariable('--scale-factor', scale * CONFIG.display.scale);
        }
    },

    /**
     * Update Twitch panel with data
     */
    updateTwitch(state) {
        if (!state) return;
        
        // Update avatar
        if (state.avatar && CONFIG.twitch.showAvatar) {
            Media.setAvatar('twitch', state.avatar);
        }
        
        // Update username
        const usernameEl = document.getElementById('twitch-username');
        if (usernameEl && state.channel) {
            usernameEl.textContent = `@${state.channel}`;
        }
        
        // Update title
        const titleEl = document.getElementById('twitch-title');
        if (titleEl && CONFIG.twitch.showTitle) {
            titleEl.textContent = state.title || 'No title';
        }
        
        // Update category
        const categoryEl = document.getElementById('twitch-category');
        if (categoryEl && CONFIG.twitch.showCategory) {
            categoryEl.textContent = state.category || '';
        }
        
        // Update stats with animation
        if (CONFIG.twitch.showViewers) {
            this.updateCounter('twitch-viewers', state.viewers);
        }
        
        if (CONFIG.twitch.showFollowers) {
            this.updateCounter('twitch-followers', state.followers);
        }
        
        if (CONFIG.twitch.showSubscribers) {
            this.updateCounter('twitch-subscribers', state.subscribers);
        }
        
        if (CONFIG.twitch.showBits) {
            this.updateCounter('twitch-bits', state.bits);
        }
        
        // Update uptime
        if (CONFIG.twitch.showUptime && state.startTime) {
            const uptimeEl = document.getElementById('twitch-uptime');
            if (uptimeEl) {
                const seconds = Math.floor((Date.now() - state.startTime) / 1000);
                uptimeEl.textContent = Utils.formatUptime(seconds);
            }
        }
        
        // Update follower goal
        if (CONFIG.twitch.showGoals) {
            this.updateGoal('follower-goal', 'follower-goal-text', 
                state.followers, CONFIG.twitch.followerGoal, 'Followers');
        }
    },

    /**
     * Update TikTok panel with data
     */
    updateTikTok(state) {
        if (!state) return;
        
        // Update avatar
        if (state.avatar && CONFIG.tiktok.showAvatar) {
            Media.setAvatar('tiktok', state.avatar);
        }
        
        // Update username
        const usernameEl = document.getElementById('tiktok-username');
        if (usernameEl && state.username) {
            usernameEl.textContent = `@${state.username}`;
        }
        
        // Update title
        const titleEl = document.getElementById('tiktok-title');
        if (titleEl) {
            titleEl.textContent = state.title || 'Live Stream';
        }
        
        // Update stats with animation
        if (CONFIG.tiktok.showViewers) {
            this.updateCounter('tiktok-viewers', state.viewers);
        }
        
        if (CONFIG.tiktok.showLikes) {
            this.updateCounter('tiktok-likes', state.likes);
        }
        
        if (CONFIG.tiktok.showGifts) {
            this.updateCounter('tiktok-gifts', state.gifts);
        }
        
        if (CONFIG.tiktok.showFollowers) {
            this.updateCounter('tiktok-followers', state.followers);
        }
        
        // Update uptime
        if (CONFIG.tiktok.showUptime && state.startTime) {
            const uptimeEl = document.getElementById('tiktok-uptime');
            if (uptimeEl) {
                const seconds = Math.floor((Date.now() - state.startTime) / 1000);
                uptimeEl.textContent = Utils.formatUptime(seconds);
            }
        }
    },

    /**
     * Update counter value with animation
     */
    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        
        if (currentValue !== value) {
            // Use smooth counter animation
            Animations.counter(element, currentValue, value, 500);
        }
    },

    /**
     * Update goal progress bar
     */
    updateGoal(barId, textId, current, target, label) {
        const barEl = document.getElementById(barId);
        const textEl = document.getElementById(textId);
        
        if (!barEl || !textEl) return;
        
        const percentage = Math.min(100, (current / target) * 100);
        
        Animations.progressBar(barEl, parseFloat(barEl.style.width) || 0, percentage, 500);
        
        textEl.textContent = `${Utils.formatNumber(current)} / ${Utils.formatNumber(target)} ${label}`;
    },

    /**
     * Add event to panel
     */
    addEvent(platform, event) {
        const containerId = `${platform}-events`;
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const eventEl = this.createEventElement(event);
        
        // Insert at top with animation
        container.insertBefore(eventEl, container.firstChild);
        Animations.slideInLeft(eventEl, 300);
        
        // Remove old events if too many
        const maxEvents = CONFIG[platform].maxEvents;
        while (container.children.length > maxEvents) {
            const lastChild = container.lastChild;
            Animations.fadeOut(lastChild, 300, () => lastChild.remove());
        }
        
        // Auto-remove after delay
        setTimeout(() => {
            Animations.fadeOut(eventEl, 300, () => eventEl.remove());
        }, 10000);
    },

    /**
     * Create event DOM element
     */
    createEventElement(event) {
        const div = document.createElement('div');
        div.className = 'event-item';
        div.id = event.id;
        
        const icon = this.getEventIcon(event.type);
        const time = Utils.formatRelativeTime(new Date(event.timestamp));
        
        div.innerHTML = `
            <span class="event-icon">${icon}</span>
            <span class="event-text">${event.message}</span>
            <span class="event-time">${time}</span>
        `;
        
        return div;
    },

    /**
     * Get icon for event type
     */
    getEventIcon(type) {
        const icons = {
            follow: '❤️',
            subscribe: '⭐',
            gift: '🎁',
            bits: '💎',
            raid: '⚔️',
            host: '📺',
            cheer: '👏',
            like: '👍',
            share: '📤',
            comment: '💬'
        };
        
        return icons[type] || '🔔';
    },

    /**
     * Show alert overlay
     */
    showAlert(title, message, icon = '🔔', duration = 3000) {
        const container = document.getElementById('alert-container');
        if (!container) return;
        
        const alertEl = document.createElement('div');
        alertEl.className = 'alert';
        alertEl.innerHTML = `
            <div class="alert-icon">${icon}</div>
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        `;
        
        container.appendChild(alertEl);
        
        // Auto-remove after duration
        setTimeout(() => {
            Animations.fadeOut(alertEl, 300, () => alertEl.remove());
        }, duration);
    },

    /**
     * Add chat message
     */
    addChatMessage(username, message, color = null) {
        const container = document.getElementById('chat-overlay');
        if (!container) return;
        
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-message';
        
        const usernameColor = color || Utils.getCSSVariable('--accent-color');
        
        msgEl.innerHTML = `
            <span class="chat-username" style="color: ${usernameColor}">${username}:</span>
            <span class="chat-text"> ${message}</span>
        `;
        
        container.appendChild(msgEl);
        
        // Auto-scroll to bottom
        container.scrollTop = container.scrollHeight;
        
        // Remove old messages
        while (container.children.length > 50) {
            container.removeChild(container.firstChild);
        }
    },

    /**
     * Toggle chat visibility
     */
    toggleChat(show = null) {
        const chat = document.getElementById('chat-overlay');
        if (!chat) return;
        
        const shouldShow = show !== null ? show : chat.classList.contains('hidden');
        
        if (shouldShow) {
            chat.classList.remove('hidden');
            Animations.slideInRight(chat);
        } else {
            Animations.fadeOut(chat, 300, () => {
                chat.classList.add('hidden');
            });
        }
    },

    /**
     * Set panel position
     */
    setPosition(position) {
        const wrapper = document.getElementById('content-wrapper');
        if (!wrapper) return;
        
        // Reset all positions
        wrapper.style.top = '';
        wrapper.style.right = '';
        wrapper.style.bottom = '';
        wrapper.style.left = '';
        wrapper.style.transformOrigin = '';
        
        const margin = '20px';
        
        switch (position) {
            case 'top-left':
                wrapper.style.top = margin;
                wrapper.style.left = margin;
                wrapper.style.transformOrigin = 'top left';
                break;
            case 'top-right':
                wrapper.style.top = margin;
                wrapper.style.right = margin;
                wrapper.style.transformOrigin = 'top right';
                break;
            case 'bottom-left':
                wrapper.style.bottom = margin;
                wrapper.style.left = margin;
                wrapper.style.transformOrigin = 'bottom left';
                break;
            case 'bottom-right':
                wrapper.style.bottom = margin;
                wrapper.style.right = margin;
                wrapper.style.transformOrigin = 'bottom right';
                break;
            case 'center':
                wrapper.style.top = '50%';
                wrapper.style.left = '50%';
                wrapper.style.transform = 'translate(-50%, -50%)';
                break;
        }
        
        CONFIG.display.position = position;
        Utils.log(`Panel position set to: ${position}`);
    },

    /**
     * Set scale factor
     */
    setScale(scale) {
        const validScale = Math.max(0.5, Math.min(2, scale));
        Utils.setCSSVariable('--scale-factor', validScale);
        CONFIG.display.scale = validScale;
        Utils.log(`Scale set to: ${validScale}`);
    },

    /**
     * Set opacity level
     */
    setOpacity(opacity) {
        const validOpacity = Math.max(0, Math.min(1, opacity));
        Utils.setCSSVariable('--opacity-level', validOpacity);
        CONFIG.display.opacity = validOpacity;
        Utils.log(`Opacity set to: ${validOpacity}`);
    },

    /**
     * Clear all widgets
     */
    clear() {
        // Clear events containers
        ['twitch-events', 'tiktok-events'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        
        // Clear chat
        const chat = document.getElementById('chat-overlay');
        if (chat) chat.innerHTML = '';
        
        // Clear alerts
        const alerts = document.getElementById('alert-container');
        if (alerts) alerts.innerHTML = '';
        
        Utils.log('All widgets cleared');
    },

    /**
     * Refresh all widgets
     */
    refresh() {
        const twitchState = Providers.getState('twitch');
        const tiktokState = Providers.getState('tiktok');
        
        if (twitchState) this.updateTwitch(twitchState);
        if (tiktokState) this.updateTikTok(tiktokState);
    },

    /**
     * Get widget stats
     */
    getStats() {
        return {
            twitchEvents: document.getElementById('twitch-events')?.children.length || 0,
            tiktokEvents: document.getElementById('tiktok-events')?.children.length || 0,
            chatMessages: document.getElementById('chat-overlay')?.children.length || 0
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Widgets;
}
