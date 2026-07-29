/**
 * ============================================
 * ANIMATIONS.JS - Animation System
 * Handles all UI animations and transitions
 * ============================================
 */

const Animations = {
    /**
     * Active animations registry
     */
    activeAnimations: new Map(),

    /**
     * Animation frame ID
     */
    animationFrame: null,

    /**
     * Initialize animations
     */
    init() {
        if (!CONFIG.animations.enabled) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
        
        if (CONFIG.animations.reducedMotion) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-base', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
        
        Utils.log('Animations initialized');
    },

    /**
     * Animate counter from start to end value
     * @param {HTMLElement} element - Target element
     * @param {number} end - End value
     * @param {Object} options - Animation options
     */
    animateCounter(element, end, options = {}) {
        const start = options.start || 0;
        const duration = options.duration || CONFIG.animations.duration.normal;
        const easing = options.easing || this.getEasing(CONFIG.animations.counterAnimation);
        const startTime = performance.now();

        const formatNumber = options.format || ((n) => Utils.formatNumber(Math.floor(n)));

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            
            const currentValue = start + (end - start) * easedProgress;
            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                element.textContent = formatNumber(end);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    },

    /**
     * Get easing function by name
     * @param {string} name - Easing name
     * @returns {Function} Easing function
     */
    getEasing(name) {
        const easings = {
            'count-up': (t) => t,
            'smooth': (t) => Utils.easeInOutQuad(t),
            'elastic': (t) => Utils.easeOutElastic(t),
            'ease-in-out': (t) => Utils.easeInOutQuad(t),
            'linear': (t) => t,
        };
        return easings[name] || easings['count-up'];
    },

    /**
     * Fade in element
     * @param {HTMLElement} element - Element to fade in
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    fadeIn(element, options = {}) {
        return new Promise(resolve => {
            const duration = options.duration || CONFIG.animations.duration.normal;
            const startTime = performance.now();

            element.style.opacity = '0';
            element.style.display = options.display || 'block';
            element.style.transition = 'none';

            requestAnimationFrame(() => {
                element.style.transition = `opacity ${duration}ms ease-out`;
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    
                    setTimeout(resolve, duration);
                });
            });
        });
    },

    /**
     * Fade out element
     * @param {HTMLElement} element - Element to fade out
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    fadeOut(element, options = {}) {
        return new Promise(resolve => {
            const duration = options.duration || CONFIG.animations.duration.normal;
            
            element.style.transition = `opacity ${duration}ms ease-in`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    },

    /**
     * Slide in element
     * @param {HTMLElement} element - Element to slide in
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    slideIn(element, options = {}) {
        return new Promise(resolve => {
            const duration = options.duration || CONFIG.animations.duration.normal;
            const direction = options.direction || 'left';
            const distance = options.distance || '20px';
            const startTime = performance.now();

            const transforms = {
                left: `translateX(-${distance})`,
                right: `translateX(${distance})`,
                up: `translateY(-${distance})`,
                down: `translateY(${distance})`,
            };

            element.style.opacity = '0';
            element.style.transform = transforms[direction];
            element.style.display = options.display || 'block';
            element.style.transition = 'none';

            requestAnimationFrame(() => {
                element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0) translateY(0)';
                    
                    setTimeout(resolve, duration);
                });
            });
        });
    },

    /**
     * Slide out element
     * @param {HTMLElement} element - Element to slide out
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    slideOut(element, options = {}) {
        return new Promise(resolve => {
            const duration = options.duration || CONFIG.animations.duration.normal;
            const direction = options.direction || 'left';
            const distance = options.distance || '20px';

            const transforms = {
                left: `translateX(-${distance})`,
                right: `translateX(${distance})`,
                up: `translateY(-${distance})`,
                down: `translateY(${distance})`,
            };

            element.style.transition = `opacity ${duration}ms ease-in, transform ${duration}ms ease-in`;
            element.style.opacity = '0';
            element.style.transform = transforms[direction];
            
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    },

    /**
     * Zoom in element
     * @param {HTMLElement} element - Element to zoom in
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    zoomIn(element, options = {}) {
        return new Promise(resolve => {
            const duration = options.duration || CONFIG.animations.duration.normal;
            const fromScale = options.fromScale || 0.9;
            const startTime = performance.now();

            element.style.opacity = '0';
            element.style.transform = `scale(${fromScale})`;
            element.style.display = options.display || 'block';
            element.style.transition = 'none';

            requestAnimationFrame(() => {
                element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    
                    setTimeout(resolve, duration);
                });
            });
        });
    },

    /**
     * Pulse animation
     * @param {HTMLElement} element - Element to pulse
     * @param {Object} options - Animation options
     */
    pulse(element, options = {}) {
        const scale = options.scale || 1.05;
        const duration = options.duration || 300;
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration);
    },

    /**
     * Shake animation
     * @param {HTMLElement} element - Element to shake
     * @param {Object} options - Animation options
     */
    shake(element, options = {}) {
        const duration = options.duration || 400;
        const intensity = options.intensity || 10;
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: 'translateX(0)' },
        ];

        element.animate(keyframes, {
            duration,
            easing: 'ease-in-out',
        });
    },

    /**
     * Bounce animation
     * @param {HTMLElement} element - Element to bounce
     * @param {Object} options - Animation options
     */
    bounce(element, options = {}) {
        const duration = options.duration || 600;
        const height = options.height || 20;
        const keyframes = [
            { transform: 'translateY(0)', easing: 'ease-out' },
            { transform: `translateY(-${height}px)`, offset: 0.5, easing: 'ease-in' },
            { transform: 'translateY(0)', easing: 'ease-out' },
        ];

        element.animate(keyframes, { duration });
    },

    /**
     * Rotate animation
     * @param {HTMLElement} element - Element to rotate
     * @param {Object} options - Animation options
     */
    rotate(element, options = {}) {
        const degrees = options.degrees || 360;
        const duration = options.duration || 500;
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = `rotate(${degrees}deg)`;
    },

    /**
     * Flip animation
     * @param {HTMLElement} element - Element to flip
     * @param {Object} options - Animation options
     */
    flip(element, options = {}) {
        const axis = options.axis || 'y';
        const duration = options.duration || 400;
        const rotateProp = axis === 'y' ? 'rotateY' : 'rotateX';
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = `${rotateProp}(180deg)`;
    },

    /**
     * Stagger animate multiple elements
     * @param {NodeList|Array} elements - Elements to animate
     * @param {Function} animationFn - Animation function to apply
     * @param {Object} options - Stagger options
     */
    stagger(elements, animationFn, options = {}) {
        const delay = options.delay || 50;
        const reverse = options.reverse || false;
        
        const elementsArray = Array.from(elements);
        if (reverse) elementsArray.reverse();
        
        elementsArray.forEach((element, index) => {
            setTimeout(() => {
                animationFn(element);
            }, index * delay);
        });
    },

    /**
     * Create entrance animation based on config
     * @param {HTMLElement} element - Element to animate
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    async entrance(element, options = {}) {
        const type = CONFIG.animations.entrance;
        
        switch (type) {
            case 'fade-in':
                return this.fadeIn(element, options);
            case 'slide-in':
                return this.slideIn(element, options);
            case 'zoom-in':
                return this.zoomIn(element, options);
            default:
                element.style.display = options.display || 'block';
                element.style.opacity = '1';
                return Promise.resolve();
        }
    },

    /**
     * Animate goal progress bar
     * @param {HTMLElement} fillElement - Fill element
     * @param {number} percentage - Target percentage (0-100)
     * @param {Object} options - Animation options
     */
    animateGoal(fillElement, percentage, options = {}) {
        const duration = options.duration || CONFIG.animations.duration.slow;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        
        fillElement.style.transition = `width ${duration}ms ease-out`;
        fillElement.style.width = `${clampedPercentage}%`;
    },

    /**
     * Typewriter effect for text
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to type
     * @param {Object} options - Animation options
     * @returns {Promise} Promise that resolves when complete
     */
    typewriter(element, text, options = {}) {
        return new Promise(resolve => {
            const speed = options.speed || 50;
            let index = 0;
            
            element.textContent = '';
            element.style.visibility = 'visible';
            
            const type = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    },

    /**
     * Cancel all active animations
     */
    cancelAll() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Cancel Web Animations API animations
        document.getAnimations().forEach(animation => animation.cancel());
        
        Utils.log('All animations cancelled');
    },

    /**
     * Enable/disable animations
     * @param {boolean} enabled - Enable state
     */
    setEnabled(enabled) {
        CONFIG.animations.enabled = enabled;
        
        if (!enabled) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        } else {
            document.documentElement.style.setProperty('--transition-fast', '150ms');
            document.documentElement.style.setProperty('--transition-base', '300ms');
            document.documentElement.style.setProperty('--transition-slow', '500ms');
        }
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
}
