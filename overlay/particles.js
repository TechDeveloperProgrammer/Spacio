/**
 * ============================================
 * SMART OVERLAY - PARTICLES ENGINE
 * Production-Ready Browser Source Overlay
 * Canvas-based particle system with GPU acceleration
 * ============================================
 */

const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    isRunning: false,
    
    // Performance optimization
    lastUpdate: 0,
    updateInterval: 16, // ~60 FPS

    /**
     * Initialize particle system
     */
    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            Utils.log('Particle canvas not found', 'warn');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Enable GPU acceleration
        this.canvas.style.transform = 'translateZ(0)';
        this.canvas.style.willChange = 'auto';
        
        this.resize();
        this.createParticles();
        
        if (CONFIG.particles.enabled) {
            this.start();
        }
        
        // Handle resize
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
        
        Utils.log('Particle engine initialized');
    },

    /**
     * Resize canvas to match container
     */
    resize() {
        const container = document.getElementById('overlay-container');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        
        // Set actual size in memory (scaled to account for extra pixel density)
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * scale;
        this.canvas.height = rect.height * scale;
        
        // Normalize coordinate system to use css pixels
        this.ctx.scale(scale, scale);
        
        this.width = rect.width;
        this.height = rect.height;
        
        // Recreate particles on resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    },

    /**
     * Create particle array
     */
    createParticles() {
        this.particles = [];
        const count = CONFIG.particles.count;
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    },

    /**
     * Create a single particle
     */
    createParticle() {
        const config = CONFIG.particles;
        
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
            vy: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
            size: Math.random() * (config.size.max - config.size.min) + config.size.min,
            color: Utils.randomElement(config.colors),
            opacity: Math.random() * config.opacity + 0.2,
            life: Math.random() * 1000,
            maxLife: 1000 + Math.random() * 2000,
            fade: config.fade
        };
    },

    /**
     * Start particle animation
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastUpdate = performance.now();
        this.animate();
        
        Utils.log('Particle animation started');
    },

    /**
     * Stop particle animation
     */
    stop() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        Utils.log('Particle animation stopped');
    },

    /**
     * Main animation loop
     */
    animate(currentTime) {
        if (!this.isRunning) return;
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        
        // Throttle updates for performance
        if (currentTime - this.lastUpdate < this.updateInterval) {
            return;
        }
        
        this.lastUpdate = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            this.updateParticle(particle);
            this.drawParticle(particle);
            
            // Respawn dead particles
            if (particle.life >= particle.maxLife) {
                this.particles[index] = this.createParticle();
            }
        });
    },

    /**
     * Update particle state
     */
    updateParticle(particle) {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update life
        particle.life += 16; // ~60 FPS
        
        // Fade effect
        if (particle.fade) {
            const lifePercent = particle.life / particle.maxLife;
            particle.opacity = CONFIG.particles.opacity * (1 - lifePercent);
        }
        
        // Wrap around edges
        if (particle.x < -particle.size) particle.x = this.width + particle.size;
        if (particle.x > this.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = this.height + particle.size;
        if (particle.y > this.height + particle.size) particle.y = -particle.size;
    },

    /**
     * Draw particle
     */
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    },

    /**
     * Add burst of particles at position
     */
    burst(x, y, count = 20, colors = null) {
        const particleColors = colors || CONFIG.particles.colors;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 3 + 2;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                color: Utils.randomElement(particleColors),
                opacity: 1,
                life: 0,
                maxLife: 800 + Math.random() * 400,
                fade: true,
                gravity: 0.1
            };
            
            this.particles.push(particle);
        }
        
        // Remove excess particles
        if (this.particles.length > CONFIG.particles.count * 2) {
            this.particles = this.particles.slice(-CONFIG.particles.count);
        }
    },

    /**
     * Add floating particles from bottom
     */
    float(count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = {
                x: Math.random() * this.width,
                y: this.height + 10,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -(Math.random() * 2 + 1),
                size: Math.random() * 2 + 1,
                color: Utils.randomElement(CONFIG.particles.colors),
                opacity: Math.random() * 0.5 + 0.3,
                life: 0,
                maxLife: 3000 + Math.random() * 2000,
                fade: true
            };
            
            this.particles.push(particle);
        }
    },

    /**
     * Connect nearby particles with lines
     */
    connect(distance = 100, color = null) {
        const lineColor = color || 'rgba(255, 255, 255, 0.1)';
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < distance) {
                    const alpha = (1 - dist / distance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    },

    /**
     * Set particle count
     */
    setCount(count) {
        CONFIG.particles.count = Math.max(0, Math.min(500, count));
        this.createParticles();
        Utils.log(`Particle count set to: ${count}`);
    },

    /**
     * Toggle particle animation
     */
    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    },

    /**
     * Change particle colors
     */
    setColors(colors) {
        CONFIG.particles.colors = colors;
        this.particles.forEach(p => {
            p.color = Utils.randomElement(colors);
        });
    },

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    },

    /**
     * Get particle stats
     */
    getStats() {
        return {
            count: this.particles.length,
            running: this.isRunning,
            canvasSize: `${this.width}x${this.height}`
        };
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Particles;
}
