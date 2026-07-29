/**
 * ============================================
 * PARTICLES.JS - Particle Engine
 * Canvas-based particle system for visual effects
 * ============================================
 */

const Particles = {
    /**
     * Canvas element
     */
    canvas: null,

    /**
     * Canvas context
     */
    ctx: null,

    /**
     * Array of particles
     */
    particles: [],

    /**
     * Animation frame ID
     */
    animationFrame: null,

    /**
     * Canvas dimensions
     */
    width: 0,
    height: 0,

    /**
     * Initialize particle system
     */
    init() {
        if (!CONFIG.particles.enabled) {
            Utils.log('Particles disabled');
            return;
        }

        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            Utils.error('Particle canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.createParticles();
        this.start();
        
        // Handle resize
        window.addEventListener('resize', Utils.debounce(() => this.resize(), CONFIG.performance.debounceResize));
        
        Utils.setCSSVariable('--particle-opacity', CONFIG.particles.opacity.toString());
        Utils.log('Particle system initialized');
    },

    /**
     * Resize canvas to match container
     */
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Set actual canvas size (accounting for DPI)
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        
        // Scale context
        this.ctx.scale(dpr, dpr);
        
        // Reset CSS size
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
    },

    /**
     * Create initial particles
     */
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push(this.createParticle());
        }
    },

    /**
     * Create a single particle
     * @returns {Object} Particle object
     */
    createParticle() {
        const config = CONFIG.particles;
        
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Utils.map(Math.random(), 0, 1, config.size.min, config.size.max),
            speedX: Utils.map(Math.random(), 0, 1, -config.speed.max, config.speed.max),
            speedY: Utils.map(Math.random(), 0, 1, -config.speed.max, config.speed.max),
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            type: config.types[Math.floor(Math.random() * config.types.length)],
            opacity: Utils.map(Math.random(), 0.3, 1, 0.3, 1),
            life: 1,
            decay: Utils.map(Math.random(), 0.0005, 0.002, 0.0005, 0.002),
        };
    },

    /**
     * Start animation loop
     */
    start() {
        if (this.animationFrame) return;
        this.animate();
    },

    /**
     * Stop animation loop
     */
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    },

    /**
     * Main animation loop
     */
    animate() {
        this.clear();
        this.update();
        this.draw();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    },

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    },

    /**
     * Update particle positions and states
     */
    update() {
        const behavior = CONFIG.particles.behavior;
        
        this.particles.forEach((particle, index) => {
            // Update position based on behavior
            switch (behavior) {
                case 'float':
                    particle.x += particle.speedX;
                    particle.y += particle.speedY * 0.5;
                    break;
                case 'rise':
                    particle.x += particle.speedX * 0.5;
                    particle.y -= Math.abs(particle.speedY);
                    break;
                case 'fall':
                    particle.x += particle.speedX * 0.5;
                    particle.y += Math.abs(particle.speedY);
                    break;
                case 'spiral':
                    const angle = Date.now() * 0.001 * particle.speedX;
                    particle.x += Math.cos(angle) * particle.speedY;
                    particle.y += Math.sin(angle) * particle.speedY;
                    break;
                default:
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
            }

            // Wrap around edges
            if (particle.x < -particle.size) particle.x = this.width + particle.size;
            if (particle.x > this.width + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = this.height + particle.size;
            if (particle.y > this.height + particle.size) particle.y = -particle.size;

            // Update life
            particle.life -= particle.decay;
            
            // Respawn dead particles
            if (particle.life <= 0) {
                this.particles[index] = this.createParticle();
            }
        });
    },

    /**
     * Draw all particles
     */
    draw() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity * particle.life;
            this.ctx.fillStyle = particle.color;
            
            switch (particle.type) {
                case 'circle':
                    this.drawCircle(particle);
                    break;
                case 'square':
                    this.drawSquare(particle);
                    break;
                case 'triangle':
                    this.drawTriangle(particle);
                    break;
                case 'star':
                    this.drawStar(particle);
                    break;
                default:
                    this.drawCircle(particle);
            }
            
            this.ctx.restore();
        });
    },

    /**
     * Draw circle particle
     * @param {Object} particle - Particle data
     */
    drawCircle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    },

    /**
     * Draw square particle
     * @param {Object} particle - Particle data
     */
    drawSquare(particle) {
        this.ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
        );
    },

    /**
     * Draw triangle particle
     * @param {Object} particle - Particle data
     */
    drawTriangle(particle) {
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y - particle.size);
        this.ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
        this.ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
        this.ctx.closePath();
        this.ctx.fill();
    },

    /**
     * Draw star particle
     * @param {Object} particle - Particle data
     */
    drawStar(particle) {
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size / 2;
        
        let rot = Math.PI / 2 * 3;
        let x = particle.x;
        let y = particle.y;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = particle.x + Math.cos(rot) * outerRadius;
            y = particle.y + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = particle.x + Math.cos(rot) * innerRadius;
            y = particle.y + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(particle.x, particle.y - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    },

    /**
     * Add explosion effect at position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of particles
     */
    explode(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = {
                x,
                y,
                size: Utils.map(Math.random(), 0, 1, 2, 6),
                speedX: Utils.map(Math.random(), -1, 1, -5, 5),
                speedY: Utils.map(Math.random(), -1, 1, -5, 5),
                color: CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
                type: 'circle',
                opacity: 1,
                life: 1,
                decay: Utils.map(Math.random(), 0.01, 0.03, 0.01, 0.03),
            };
            this.particles.push(particle);
        }
        
        // Limit total particles
        if (this.particles.length > CONFIG.particles.count * 2) {
            this.particles = this.particles.slice(-CONFIG.particles.count);
        }
    },

    /**
     * Add burst of particles
     * @param {Object} options - Burst options
     */
    burst(options = {}) {
        const x = options.x || this.width / 2;
        const y = options.y || this.height / 2;
        const count = options.count || 30;
        const radius = options.radius || 100;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Utils.map(Math.random(), 0, 1, 1, 4);
            
            const particle = {
                x,
                y,
                size: Utils.map(Math.random(), 0, 1, 2, 5),
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: options.color || CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)],
                type: options.type || 'circle',
                opacity: 1,
                life: 1,
                decay: Utils.map(Math.random(), 0.005, 0.02, 0.005, 0.02),
            };
            this.particles.push(particle);
        }
    },

    /**
     * Set particle behavior
     * @param {string} behavior - Behavior name
     */
    setBehavior(behavior) {
        CONFIG.particles.behavior = behavior;
        Utils.log(`Particle behavior set: ${behavior}`);
    },

    /**
     * Set particle count
     * @param {number} count - Number of particles
     */
    setCount(count) {
        CONFIG.particles.count = Math.max(1, Math.min(500, count));
        
        if (this.particles.length < count) {
            while (this.particles.length < count) {
                this.particles.push(this.createParticle());
            }
        } else if (this.particles.length > count) {
            this.particles = this.particles.slice(0, count);
        }
        
        Utils.log(`Particle count set: ${count}`);
    },

    /**
     * Set particle opacity
     * @param {number} opacity - Opacity value (0-1)
     */
    setOpacity(opacity) {
        CONFIG.particles.opacity = Math.max(0, Math.min(1, opacity));
        Utils.setCSSVariable('--particle-opacity', CONFIG.particles.opacity.toString());
    },

    /**
     * Enable/disable particles
     * @param {boolean} enabled - Enable state
     */
    setEnabled(enabled) {
        CONFIG.particles.enabled = enabled;
        
        if (enabled) {
            this.start();
            this.canvas.style.display = 'block';
        } else {
            this.stop();
            this.canvas.style.display = 'none';
        }
    },

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
        this.createParticles();
    },

    /**
     * Get particle statistics
     * @returns {Object} Stats object
     */
    getStats() {
        return {
            count: this.particles.length,
            maxCount: CONFIG.particles.count,
            behavior: CONFIG.particles.behavior,
            opacity: CONFIG.particles.opacity,
        };
    },
};

// Export for module systems (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Particles;
}
