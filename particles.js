/**
 * Particles & Confetti Engine for Tejuu's Birthday Surprise
 * Features:
 * - Ambient floating golden stardust
 * - Floating glowing hearts
 * - Cursor sparkle trail
 * - High-performance celebratory confetti bursts (ribbons, hearts, stars)
 */

class BirthdayVisualEngine {
  constructor() {
    this.particleCanvas = document.getElementById('particle-canvas');
    this.confettiCanvas = document.getElementById('confetti-canvas');

    if (!this.particleCanvas || !this.confettiCanvas) return;

    this.pCtx = this.particleCanvas.getContext('2d');
    this.cCtx = this.confettiCanvas.getContext('2d');

    this.particles = [];
    this.confetti = [];
    this.mouseTrails = [];

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initCanvasSize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  initCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    [this.particleCanvas, this.confettiCanvas].forEach(canvas => {
      canvas.width = this.width * dpr;
      canvas.height = this.height * dpr;
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
    });

    this.pCtx.scale(dpr, dpr);
    this.cCtx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    // Number of ambient particles scaled to screen size
    const count = Math.min(Math.floor((this.width * this.height) / 16000), 75);

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createAmbientParticle());
    }
  }

  createAmbientParticle() {
    const isHeart = Math.random() < 0.28;
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: isHeart ? Math.random() * 8 + 8 : Math.random() * 2.8 + 1,
      speedY: Math.random() * 0.6 + 0.25,
      speedX: (Math.random() - 0.5) * 0.4,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.6 + 0.2,
      fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
      color: isHeart
        ? (Math.random() < 0.6 ? '#ff2d55' : '#ffd700')
        : (Math.random() < 0.75 ? '#ffd700' : '#ffffff'),
      isHeart: isHeart,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.initParticles();
    });

    // Cursor sparkle trail
    let lastMove = 0;
    const addSparkle = (e) => {
      const now = performance.now();
      if (now - lastMove < 30) return; // throttle
      lastMove = now;

      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);

      if (clientX === null || clientY === null) return;

      for (let i = 0; i < 2; i++) {
        this.mouseTrails.push({
          x: clientX + (Math.random() - 0.5) * 12,
          y: clientY + (Math.random() - 0.5) * 12,
          size: Math.random() * 3 + 1.5,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5 - 0.5,
          opacity: 1,
          color: Math.random() < 0.5 ? '#ffd700' : '#ff2d55',
          life: 1
        });
      }
    };

    window.addEventListener('mousemove', addSparkle, { passive: true });
    window.addEventListener('touchmove', addSparkle, { passive: true });
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    ctx.beginPath();
    const d = size / 2;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-d, -d, -size, d / 3, 0, size);
    ctx.bezierCurveTo(size, d / 3, d, -d, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  // Trigger grand celebration confetti
  burstConfetti(originX = this.width / 2, originY = this.height / 2, count = 120) {
    const colors = ['#ffd700', '#ff2d55', '#ffffff', '#f5af19', '#ff6b81', '#ffeaa7'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * 12 + 5;
      const isHeart = Math.random() < 0.25;

      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 4,
        gravity: 0.22,
        friction: 0.96,
        size: isHeart ? Math.random() * 10 + 8 : Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.008 + 0.006,
        isHeart: isHeart,
        shape: Math.random() < 0.5 ? 'rect' : 'circle'
      });
    }
  }

  // Double shower blast from bottom corners
  launchSideCannons() {
    const colors = ['#ffd700', '#ff2d55', '#fff', '#f5af19', '#ff3860'];
    const createCannon = (originX, angleRange) => {
      for (let i = 0; i < 70; i++) {
        const angle = angleRange[0] + Math.random() * (angleRange[1] - angleRange[0]);
        const speed = Math.random() * 18 + 10;
        this.confetti.push({
          x: originX,
          y: this.height + 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.26,
          friction: 0.97,
          size: Math.random() * 9 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          opacity: 1,
          life: 1,
          decay: Math.random() * 0.007 + 0.005,
          isHeart: Math.random() < 0.2,
          shape: Math.random() < 0.6 ? 'rect' : 'circle'
        });
      }
    };

    // Left cannon shooting up-right (-65 to -35 degrees)
    createCannon(50, [-Math.PI * 0.45, -Math.PI * 0.2]);
    // Right cannon shooting up-left (-145 to -115 degrees)
    createCannon(this.width - 50, [-Math.PI * 0.8, -Math.PI * 0.55]);
  }

  updateAmbient() {
    this.pCtx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * 0.5 + p.speedX;
      p.y -= p.speedY;

      p.opacity += p.fadeSpeed;
      if (p.opacity > 0.85 || p.opacity < 0.15) {
        p.fadeSpeed = -p.fadeSpeed;
      }

      p.rotation += p.rotSpeed;

      if (p.y < -20 || p.x < -20 || p.x > this.width + 20) {
        this.particles[i] = this.createAmbientParticle();
        this.particles[i].y = this.height + 10;
      }

      if (p.isHeart) {
        this.drawHeart(this.pCtx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else {
        this.pCtx.save();
        this.pCtx.beginPath();
        this.pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.pCtx.fillStyle = p.color;
        this.pCtx.globalAlpha = p.opacity;
        this.pCtx.shadowBlur = 8;
        this.pCtx.shadowColor = p.color;
        this.pCtx.fill();
        this.pCtx.restore();
      }
    }

    // Update mouse trails
    for (let i = this.mouseTrails.length - 1; i >= 0; i--) {
      const t = this.mouseTrails[i];
      t.x += t.speedX;
      t.y += t.speedY;
      t.life -= 0.035;
      t.opacity = Math.max(0, t.life);

      if (t.life <= 0) {
        this.mouseTrails.splice(i, 1);
        continue;
      }

      this.pCtx.save();
      this.pCtx.beginPath();
      this.pCtx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      this.pCtx.fillStyle = t.color;
      this.pCtx.globalAlpha = t.opacity;
      this.pCtx.shadowBlur = 12;
      this.pCtx.shadowColor = t.color;
      this.pCtx.fill();
      this.pCtx.restore();
    }
  }

  updateConfetti() {
    this.cCtx.clearRect(0, 0, this.width, this.height);

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];

      c.vx *= c.friction;
      c.vy *= c.friction;
      c.vy += c.gravity;
      c.x += c.vx;
      c.y += c.vy;

      c.rotation += c.rotSpeed;
      c.life -= c.decay;
      c.opacity = Math.max(0, c.life);

      if (c.life <= 0 || c.y > this.height + 50) {
        this.confetti.splice(i, 1);
        continue;
      }

      if (c.isHeart) {
        this.drawHeart(this.cCtx, c.x, c.y, c.size, c.color, c.opacity, c.rotation);
      } else {
        this.cCtx.save();
        this.cCtx.translate(c.x, c.y);
        this.cCtx.rotate(c.rotation);
        this.cCtx.fillStyle = c.color;
        this.cCtx.globalAlpha = c.opacity;

        if (c.shape === 'rect') {
          this.cCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        } else {
          this.cCtx.beginPath();
          this.cCtx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
          this.cCtx.fill();
        }
        this.cCtx.restore();
      }
    }
  }

  animate() {
    this.updateAmbient();
    this.updateConfetti();
    requestAnimationFrame(() => this.animate());
  }
}

// Global instance exposed on window
window.BirthdayVisuals = null;
document.addEventListener('DOMContentLoaded', () => {
  window.BirthdayVisuals = new BirthdayVisualEngine();
});
