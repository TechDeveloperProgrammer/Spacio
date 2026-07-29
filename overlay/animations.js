/**
 * ============================================
 * SMART OVERLAY - ANIMATIONS MANAGER
 * Production-Ready Browser Source Overlay
 * ============================================
 */

const Animations = {
    // Active animations tracking
    activeAnimations: new Map(),
    
    // Animation frames
    frameId: null,
    
    // Performance tracking
    lastFrameTime: 0,
    frameCount: 0,

    /**
     * Initialize animations system
     */
    init() {
        if (!CONFIG.animations.enabled) {
            Utils.log('Animations disabled in config');
            return;
        }
        
        Utils.log('Animations manager initialized');
        this.startPerformanceMonitor();
    },

    /**
     * Start performance monitoring
     */
    startPerformanceMonitor() {
        const monitor = () => {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            
            if (delta >= 1000) {
                Utils.log(`FPS: ${this.frameCount}`, 'debug');
                this.frameCount = 0;
                this.lastFrameTime = now;
            }
            
            this.frameCount++;
            this.frameId = requestAnimationFrame(monitor);
        };
        
        this.frameId = requestAnimationFrame(monitor);
    },

    /**
     * Animate element with keyframes
     */
    animate(element, animationName, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.animation = `${animationName} ${duration}ms ${CONFIG.animations.easing}`;
        
        const handleEnd = () => {
            element.style.animation = '';
            element.removeEventListener('animationend', handleEnd);
            if (callback) callback();
        };
        
        element.addEventListener('animationend', handleEnd);
    },

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.opacity = '0';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Slide in from right
     */
    slideInRight(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'translateX(50px)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Slide in from left
     */
    slideInLeft(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'translateX(-50px)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Slide in from top
     */
    slideInTop(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'translateY(-50px)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Slide in from bottom
     */
    slideInBottom(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'translateY(50px)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Zoom in effect
     */
    zoomIn(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Zoom out effect
     */
    zoomOut(element, duration = 300, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}, opacity ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = 'scale(1.1)';
        element.style.opacity = '0';
        
        // Force reflow
        element.offsetHeight;
        
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Pulse effect
     */
    pulse(element, times = 1, duration = 300, callback = null) {
        if (!element) return;
        
        let count = 0;
        
        const doPulse = () => {
            element.style.transition = `transform ${duration / 2}ms ${CONFIG.animations.easing}`;
            element.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                count++;
                
                if (count < times) {
                    setTimeout(doPulse, duration);
                } else if (callback) {
                    callback();
                }
            }, duration / 2);
        };
        
        doPulse();
    },

    /**
     * Shake effect
     */
    shake(element, duration = 50, callback = null) {
        if (!element) return;
        
        const positions = [-10, 10, -10, 10, -5, 5, -2, 2, 0];
        let index = 0;
        
        const doShake = () => {
            if (index >= positions.length) {
                if (callback) callback();
                return;
            }
            
            element.style.transform = `translateX(${positions[index]}px)`;
            index++;
            setTimeout(doShake, duration);
        };
        
        doShake();
    },

    /**
     * Bounce effect
     */
    bounce(element, times = 1, duration = 300, callback = null) {
        if (!element) return;
        
        let count = 0;
        
        const doBounce = () => {
            element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
            element.style.transform = 'translateY(-30px)';
            
            setTimeout(() => {
                element.style.transform = 'translateY(0)';
                count++;
                
                if (count < times) {
                    setTimeout(doBounce, duration * 2);
                } else if (callback) {
                    callback();
                }
            }, duration);
        };
        
        doBounce();
    },

    /**
     * Rotate effect
     */
    rotate(element, degrees = 360, duration = 500, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = `rotate(${degrees}deg)`;
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Flip effect
     */
    flip(element, axis = 'y', duration = 500, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms ${CONFIG.animations.easing}`;
        element.style.transform = `rotate${axis.toUpperCase()}(180deg)`;
        
        if (callback) {
            setTimeout(callback, duration);
        }
    },

    /**
     * Elastic effect
     */
    elastic(element, duration = 1000, callback = null) {
        if (!element) return;
        
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        element.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            if (callback) callback();
        }, duration);
    },

    /**
     * Light sweep effect
     */
    lightSweep(element, duration = 1000, callback = null) {
        if (!element) return;
        
        const sweep = document.createElement('div');
        sweep.className = 'light-sweep-element';
        sweep.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            pointer-events: none;
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.appendChild(sweep);
        
        sweep.animate([
            { left: '-100%' },
            { left: '200%' }
        ], {
            duration: duration,
            easing: CONFIG.animations.easing
        }).onfinish = () => {
            sweep.remove();
            if (callback) callback();
        };
    },

    /**
     * Glow pulse effect
     */
    glowPulse(element, color = null, duration = 1000, callback = null) {
        if (!element) return;
        
        const targetColor = color || Utils.getCSSVariable('--primary-color');
        
        element.animate([
            { boxShadow: '0 0 5px ' + targetColor },
            { boxShadow: '0 0 20px ' + targetColor + ', 0 0 30px ' + targetColor },
            { boxShadow: '0 0 5px ' + targetColor }
        ], {
            duration: duration,
            iterations: 1,
            easing: CONFIG.animations.easing
        }).onfinish = () => {
            if (callback) callback();
        };
    },

    /**
     * Counter animation
     */
    counter(element, start, end, duration = 500, formatter = null) {
        if (!element) return;
        
        const startTime = performance.now();
        const range = end - start;
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuart)
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + range * ease);
            
            element.textContent = formatter ? formatter(current) : Utils.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },

    /**
     * Progress bar animation
     */
    progressBar(element, fromPercent, toPercent, duration = 500) {
        if (!element) return;
        
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = fromPercent + (toPercent - fromPercent) * ease;
            
            element.style.width = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    },

    /**
     * Stagger animation for multiple elements
     */
    stagger(elements, animationFn, delay = 50, duration = 300) {
        if (!elements || elements.length === 0) return;
        
        elements.forEach((el, index) => {
            setTimeout(() => {
                animationFn(el, duration);
            }, index * delay);
        });
    },

    /**
     * Stop all animations on element
     */
    stop(element) {
        if (!element) return;
        
        element.getAnimations().forEach(anim => anim.cancel());
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
    },

    /**
     * Clear all active animations
     */
    clearAll() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        
        this.activeAnimations.forEach((anim, key) => {
            anim.cancel();
        });
        this.activeAnimations.clear();
    },

    /**
     * Create custom keyframe animation
     */
    createKeyframes(name, keyframes) {
        const styleSheet = document.styleSheets[0];
        let keyframesStr = `@keyframes ${name} {`;
        
        keyframes.forEach(frame => {
            keyframesStr += `${frame.offset * 100}% {`;
            Object.entries(frame.styles).forEach(([prop, value]) => {
                keyframesStr += `${prop}: ${value};`;
            });
            keyframesStr += '}';
        });
        
        keyframesStr += '}';
        
        styleSheet.insertRule(keyframesStr, styleSheet.cssRules.length);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Animations;
}
