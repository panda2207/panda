/**
 * Realistic Canvas Fireworks & Crackers Engine for Slide 5
 * Features:
 * - Rockets launching from ground with burning spark trails & smoke
 * - Multi-pattern cracker explosions: Chrysanthemum, Willow, Heart, Palm & Strobe
 * - Dynamic sky flash illuminating clouds and night atmosphere in blast colors
 * - Click/touch to launch custom fireworks to cursor coordinates
 * - Auto-sequencer with grand celebration salvos
 */

class FireworksEngine {
  constructor() {
    this.section = document.getElementById('fireworks-section');
    this.canvas = document.getElementById('fireworks-canvas');
    if (!this.section || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.rockets = [];
    this.particles = [];
    this.skyGlows = [];

    this.isRunning = false;
    this.lastLaunchTime = 0;
    this.launchInterval = 1200; // ms between automatic rockets

    this.colors = [
      { primary: '#ffd700', secondary: '#ffffff', glow: 'rgba(255, 215, 0, 0.4)' }, // Imperial Gold
      { primary: '#ff2d55', secondary: '#ffb703', glow: 'rgba(255, 45, 85, 0.4)' },  // Ruby Red
      { primary: '#00f5d4', secondary: '#ffffff', glow: 'rgba(0, 245, 212, 0.4)' },  // Neon Cyan
      { primary: '#bf5af2', secondary: '#ff2d55', glow: 'rgba(191, 90, 242, 0.4)' }, // Amethyst Purple
      { primary: '#30d158', secondary: '#ffd700', glow: 'rgba(48, 209, 88, 0.4)' },  // Emerald Green
      { primary: '#ff9f0a', secondary: '#ffffff', glow: 'rgba(255, 159, 10, 0.4)' },  // Amber Orange
      { primary: '#ffffff', secondary: '#ffd700', glow: 'rgba(255, 255, 255, 0.5)' }  // Diamond White
    ];

    this.initSize();
    this.bindEvents();
    this.start();
  }

  initSize() {
    this.width = this.section.clientWidth || window.innerWidth;
    this.height = Math.max(this.section.clientHeight, window.innerHeight);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initSize());

    // Interactive launch on click/touch on the fireworks section
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;
      this.launchRocket(targetX, targetY);
    });

    const megaLaunchBtn = document.getElementById('launch-mega-fireworks');
    if (megaLaunchBtn) {
      megaLaunchBtn.addEventListener('click', () => {
        this.launchMegaSalvo();
      });
    }
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  launchRocket(targetX = null, targetY = null) {
    const startX = Math.random() * (this.width * 0.7) + this.width * 0.15;
    const startY = this.height;

    const destX = targetX !== null ? targetX : Math.random() * (this.width * 0.75) + this.width * 0.12;
    const destY = targetY !== null ? targetY : Math.random() * (this.height * 0.45) + 60;

    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const types = ['chrysanthemum', 'willow', 'heart', 'ring', 'palm'];
    const type = types[Math.floor(Math.random() * types.length)];

    const speed = Math.random() * 3 + 13;
    const angle = Math.atan2(destY - startY, destX - startX);

    this.rockets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      destX: destX,
      destY: destY,
      color: color,
      type: type,
      trail: [],
      size: Math.random() * 2 + 2.5
    });
  }

  launchMegaSalvo() {
    // Launch a flurry of 7 coordinated rockets
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const targetX = (this.width / 8) * (i + 1);
        const targetY = Math.random() * (this.height * 0.35) + 80;
        this.launchRocket(targetX, targetY);
      }, i * 220);
    }
  }

  explode(rocket) {
    const pCount = rocket.type === 'willow' ? 140 : (rocket.type === 'heart' ? 90 : 100);

    // Add sky ambient flash
    this.skyGlows.push({
      x: rocket.x,
      y: rocket.y,
      radius: Math.random() * 250 + 200,
      color: rocket.color.glow,
      alpha: 0.65,
      decay: 0.035
    });

    if (rocket.type === 'heart') {
      // Parametric heart formula
      for (let i = 0; i < pCount; i++) {
        const t = (Math.PI * 2 / pCount) * i;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const force = Math.random() * 0.2 + 0.35;

        this.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: hx * force,
          vy: hy * force,
          color: rocket.color.primary,
          secondaryColor: rocket.color.secondary,
          alpha: 1,
          size: Math.random() * 2.5 + 2,
          decay: Math.random() * 0.012 + 0.015,
          gravity: 0.035,
          trail: []
        });
      }
    } else if (rocket.type === 'ring') {
      // Ring burst with center strobe
      const ringSpeed = Math.random() * 2 + 4.5;
      for (let i = 0; i < pCount; i++) {
        const angle = (Math.PI * 2 / pCount) * i;
        this.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * ringSpeed,
          vy: Math.sin(angle) * ringSpeed,
          color: rocket.color.primary,
          secondaryColor: rocket.color.secondary,
          alpha: 1,
          size: 2.5,
          decay: Math.random() * 0.015 + 0.016,
          gravity: 0.04,
          trail: []
        });
      }
      // Center strobe flashes
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 2;
        this.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color: '#ffffff',
          secondaryColor: rocket.color.primary,
          alpha: 1,
          size: 3,
          decay: 0.03,
          gravity: 0.02,
          trail: []
        });
      }
    } else if (rocket.type === 'willow') {
      // Weeping golden willow with long dripping trails
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        this.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          color: '#ffd700',
          secondaryColor: '#ffffff',
          alpha: 1,
          size: Math.random() * 2.5 + 1.5,
          decay: Math.random() * 0.008 + 0.007, // long life
          gravity: 0.075, // heavy drift
          trail: []
        });
      }
    } else {
      // Chrysanthemum / Classic spherical burst
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: rocket.color.primary,
          secondaryColor: rocket.color.secondary,
          alpha: 1,
          size: Math.random() * 3 + 1.8,
          decay: Math.random() * 0.016 + 0.014,
          gravity: 0.05,
          trail: []
        });
      }
    }
  }

  animate() {
    const isSlideActive = this.section.classList.contains('active') ||
      window.getComputedStyle(this.section).display !== 'none';

    if (isSlideActive) {
      const now = performance.now();
      if (now - this.lastLaunchTime > this.launchInterval) {
        this.lastLaunchTime = now;
        this.launchRocket();
        if (Math.random() < 0.45) {
          setTimeout(() => this.launchRocket(), 300);
        }
      }

      this.render();
    }

    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;

    // Subtle fade trail for realistic persistence of vision
    ctx.fillStyle = 'rgba(8, 6, 15, 0.25)';
    ctx.fillRect(0, 0, this.width, this.height);

    // 1. Render Sky Glows (Atmospheric blast reflection)
    for (let i = this.skyGlows.length - 1; i >= 0; i--) {
      const glow = this.skyGlows[i];
      const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
      grad.addColorStop(0, glow.color);
      grad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.globalAlpha = glow.alpha;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      glow.alpha -= glow.decay;
      if (glow.alpha <= 0) {
        this.skyGlows.splice(i, 1);
      }
    }

    // 2. Render Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];

      // Rocket sparks trail
      r.trail.push({ x: r.x, y: r.y, alpha: 0.85 });
      if (r.trail.length > 8) r.trail.shift();

      ctx.save();
      for (let t = 0; t < r.trail.length; t++) {
        const pt = r.trail[t];
        const trailAlpha = (t / r.trail.length) * 0.7;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = r.color.primary;
        ctx.globalAlpha = trailAlpha;
        ctx.fill();
      }

      // Bright rocket head
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = r.color.primary;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();

      // Move rocket
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.05; // slight deceleration

      // Check detonation criteria
      const dist = Math.hypot(r.destX - r.x, r.destY - r.y);
      if (dist < 25 || r.y <= r.destY || r.vy >= 0) {
        this.explode(r);
        this.rockets.splice(i, 1);
      }
    }

    // 3. Render Explosion Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();

      ctx.save();
      // Draw particle trail
      ctx.beginPath();
      for (let t = 0; t < p.trail.length; t++) {
        const pt = p.trail[t];
        if (t === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size * 0.75;
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.stroke();

      // Particle Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.alpha > 0.5 ? p.secondaryColor : p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();

      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}

// Global Fireworks Initializer
window.addEventListener('DOMContentLoaded', () => {
  window.Fireworks = new FireworksEngine();
});
