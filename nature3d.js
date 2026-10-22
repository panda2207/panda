/**
 * 3D Nature Realm Visual Engine (Sky, Forest & Ocean)
 * Creates an ultra-premium, cinematic 3D environment for Slide 4:
 * - 3D Cosmic Starfield with depth projection, twinkling & shooting stars
 * - Real-time undulating 3D Bioluminescent Aurora Borealis
 * - Dynamic 3D Mathematical Ocean Waves with bioluminescent crests & rising bubbles
 * - 3D Orbiting Forest Fireflies & tumbling 3D golden leaves
 * - Interactive 3D Card Parallax & holographic tilt physics
 */

class Nature3DVisualEngine {
  constructor() {
    this.section = document.getElementById('final-section');
    this.bgCanvas = document.getElementById('nature-3d-bg-canvas');
    this.fgCanvas = document.getElementById('nature-3d-fg-canvas');
    this.card = document.querySelector('.luxury-wish-card');

    if (!this.section || !this.bgCanvas || !this.fgCanvas) return;

    this.bgCtx = this.bgCanvas.getContext('2d');
    this.fgCtx = this.fgCanvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.time = 0;
    this.activeRealm = 'all'; // 'all', 'sky', 'ocean', 'forest'

    // Mouse & 3D Tilt State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.curRotX = 0;
    this.curRotY = 0;

    // Entities
    this.stars = [];
    this.shootingStars = [];
    this.fireflies = [];
    this.leaves = [];
    this.bubbles = [];

    this.initSize();
    this.initEntities();
    this.bindEvents();
    this.animate();
  }

  initSize() {
    this.width = this.section.clientWidth || window.innerWidth;
    this.height = Math.max(this.section.clientHeight, window.innerHeight);

    [this.bgCanvas, this.fgCanvas].forEach(canvas => {
      canvas.width = this.width * this.dpr;
      canvas.height = this.height * this.dpr;
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
    });

    this.bgCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.fgCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initEntities() {
    // 1. 3D Stars (Sky)
    this.stars = [];
    const starCount = Math.min(Math.floor((this.width * this.height) / 10000), 160);
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * this.width * 1.5,
        y: Math.random() * this.height * 0.75,
        z: Math.random() * 800 + 100, // 3D depth
        size: Math.random() * 2.2 + 0.8,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        color: Math.random() < 0.65 ? '#ffffff' : (Math.random() < 0.5 ? '#ffd700' : '#00f5d4')
      });
    }

    // 2. 3D Fireflies (Forest)
    this.fireflies = [];
    const fireflyCount = Math.min(Math.floor(this.width / 35), 45);
    for (let i = 0; i < fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 300 - 150, // moves in front and behind card
        radius: Math.random() * 2.5 + 2,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        speedX: (Math.random() * 0.015 + 0.008) * (Math.random() < 0.5 ? 1 : -1),
        speedY: (Math.random() * 0.018 + 0.006) * (Math.random() < 0.5 ? 1 : -1),
        speedZ: Math.random() * 0.02 + 0.01,
        ampX: Math.random() * 70 + 40,
        ampY: Math.random() * 60 + 30,
        color: Math.random() < 0.65 ? '#a3e635' : '#ffd700'
      });
    }

    // 3. 3D Falling Leaves & Stardust (Forest)
    this.leaves = [];
    for (let i = 0; i < 24; i++) {
      this.leaves.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 200,
        size: Math.random() * 14 + 10,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
        rotZ: Math.random() * 360,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        char: ['🍂', '🍁', '🍃', '✨'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.5 + 0.4
      });
    }

    // 4. 3D Ocean Bubbles (Ocean)
    this.bubbles = [];
    for (let i = 0; i < 35; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: this.height - Math.random() * (this.height * 0.4),
        z: Math.random() * 200,
        radius: Math.random() * 9 + 4,
        speedY: Math.random() * 1.2 + 0.6,
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.6 + 0.25
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initSize();
    });

    // 3D Parallax & Card Tilt Tracking
    this.section.addEventListener('mousemove', (e) => {
      const rect = this.section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      this.mouseX = x;
      this.mouseY = y;

      // Realistic 3D tilt angles (max +/- 10 degrees)
      this.targetRotX = -y * 12;
      this.targetRotY = x * 14;

      // Update holographic card sheen
      if (this.card) {
        const cardRect = this.card.getBoundingClientRect();
        const cardX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
        const cardY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
        this.card.style.setProperty('--mouse-x', `${cardX}%`);
        this.card.style.setProperty('--mouse-y', `${cardY}%`);
      }
    });

    this.section.addEventListener('mouseleave', () => {
      this.targetRotX = 0;
      this.targetRotY = 0;
      this.mouseX = 0;
      this.mouseY = 0;
    });

    // Touch Support for Mobile 3D Parallax
    this.section.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      const rect = this.section.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / rect.width - 0.5;
      const y = (touch.clientY - rect.top) / rect.height - 0.5;
      this.targetRotX = -y * 8;
      this.targetRotY = x * 10;
    }, { passive: true });

    this.section.addEventListener('touchend', () => {
      this.targetRotX = 0;
      this.targetRotY = 0;
    });
  }

  setRealm(realm) {
    this.activeRealm = realm;
  }

  spawnShootingStar() {
    if (this.shootingStars.length >= 3) return;
    this.shootingStars.push({
      x: Math.random() * (this.width * 0.7) + this.width * 0.15,
      y: Math.random() * (this.height * 0.25) + 30,
      length: Math.random() * 180 + 120,
      speed: Math.random() * 12 + 16,
      angle: (-32 * Math.PI) / 180,
      opacity: 1,
      thickness: Math.random() * 2 + 1.5,
      color: Math.random() < 0.5 ? '#ffd700' : '#00f5d4'
    });
  }

  renderBackground() {
    const ctx = this.bgCtx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Dynamic 3D Parallax offset based on cursor
    const parallaxX = this.mouseX * 35;
    const parallaxY = this.mouseY * 25;

    // 1. SKY: AURORA BOREALIS RIBBONS
    this.renderAurora(ctx, parallaxX, parallaxY);

    // 2. SKY: 3D STARFIELD
    this.renderStars(ctx, parallaxX, parallaxY);

    // 3. SKY: SHOOTING STARS
    this.renderShootingStars(ctx);

    // 4. OCEAN: 3D MATHEMATICAL FLOWING WAVES
    this.renderOceanWaves(ctx, parallaxX);
  }

  renderAurora(ctx, px, py) {
    const auroraTop = this.height * 0.15 + py * 0.5;
    const colors = [
      { stop0: 'rgba(0, 245, 212, 0.28)', stop1: 'rgba(123, 44, 191, 0.15)', yOff: 0, speed: 0.0008, amp: 45 },
      { stop0: 'rgba(255, 45, 85, 0.22)', stop1: 'rgba(255, 215, 0, 0.12)', yOff: 40, speed: 0.0011, amp: 35 },
      { stop0: 'rgba(163, 230, 53, 0.2)', stop1: 'rgba(0, 180, 216, 0.15)', yOff: 80, speed: 0.0006, amp: 50 }
    ];

    colors.forEach((col, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, auroraTop + col.yOff);

      const step = 40;
      for (let x = 0; x <= this.width + step; x += step) {
        const angle1 = x * 0.003 + this.time * col.speed + idx;
        const angle2 = x * 0.007 - this.time * (col.speed * 1.5);
        const y = auroraTop + col.yOff + Math.sin(angle1) * col.amp + Math.cos(angle2) * (col.amp * 0.5);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(this.width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, auroraTop + col.yOff + 100);
      grad.addColorStop(0, 'rgba(15, 10, 25, 0)');
      grad.addColorStop(0.4, col.stop0);
      grad.addColorStop(0.8, col.stop1);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.filter = 'blur(18px)';
      ctx.fill();
      ctx.restore();
    });
  }

  renderStars(ctx, px, py) {
    ctx.save();
    this.stars.forEach(star => {
      // 3D Perspective calculation
      const fov = 400;
      const scale = fov / (fov + star.z);
      const screenX = this.width / 2 + (star.x + px) * scale;
      const screenY = star.y * scale + py * 0.3;

      if (screenX < -20 || screenX > this.width + 20 || screenY < -20 || screenY > this.height) return;

      const alpha = (Math.sin(this.time * star.twinkleSpeed + star.twinklePhase) * 0.45 + 0.55);
      const radius = star.size * scale * (alpha * 0.4 + 0.8);

      ctx.beginPath();
      ctx.arc(screenX, screenY, Math.max(radius, 0.6), 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 8 * scale;
      ctx.shadowColor = star.color;
      ctx.fill();
    });
    ctx.restore();
  }

  renderShootingStars(ctx) {
    if (Math.random() < 0.012) {
      this.spawnShootingStar();
    }

    ctx.save();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, s.color);
      grad.addColorStop(1, '#ffffff');

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.thickness;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 14;
      ctx.shadowColor = s.color;
      ctx.stroke();

      // Bright head point
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.thickness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Move shooting star
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.015;

      if (s.opacity <= 0 || s.x < -100 || s.y > this.height + 100) {
        this.shootingStars.splice(i, 1);
      }
    }
    ctx.restore();
  }

  renderOceanWaves(ctx, px) {
    const waveBaseY = this.height - 180;
    const waveTiers = [
      {
        yOffset: 0,
        amp1: 30,
        amp2: 18,
        freq1: 0.003,
        freq2: 0.007,
        speed: 0.0012,
        colorStart: 'rgba(0, 119, 182, 0.45)',
        colorEnd: 'rgba(2, 62, 138, 0.75)',
        crestColor: 'rgba(0, 245, 212, 0.65)'
      },
      {
        yOffset: 45,
        amp1: 35,
        amp2: 22,
        freq1: 0.004,
        freq2: 0.009,
        speed: -0.0015,
        colorStart: 'rgba(0, 180, 216, 0.5)',
        colorEnd: 'rgba(3, 4, 94, 0.85)',
        crestColor: 'rgba(255, 215, 0, 0.55)'
      },
      {
        yOffset: 95,
        amp1: 28,
        amp2: 16,
        freq1: 0.005,
        freq2: 0.011,
        speed: 0.0018,
        colorStart: 'rgba(72, 202, 228, 0.6)',
        colorEnd: 'rgba(10, 8, 28, 0.95)',
        crestColor: 'rgba(255, 255, 255, 0.85)'
      }
    ];

    waveTiers.forEach((tier, idx) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, this.height);

      const step = 25;
      const startY = waveBaseY + tier.yOffset;
      ctx.lineTo(0, startY);

      for (let x = 0; x <= this.width + step; x += step) {
        const t = this.time * tier.speed;
        const y = startY +
          Math.sin(x * tier.freq1 + t + px * 0.02) * tier.amp1 +
          Math.cos(x * tier.freq2 - t * 0.7) * tier.amp2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(this.width, this.height);
      ctx.closePath();

      const waveGrad = ctx.createLinearGradient(0, startY - 30, 0, this.height);
      waveGrad.addColorStop(0, tier.colorStart);
      waveGrad.addColorStop(1, tier.colorEnd);
      ctx.fillStyle = waveGrad;
      ctx.fill();

      // Glowing Crest Line
      ctx.strokeStyle = tier.crestColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = tier.crestColor;
      ctx.stroke();

      ctx.restore();
    });
  }

  renderForeground() {
    const ctx = this.fgCtx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. FOREST: 3D ORBITING BIOLUMINESCENT FIREFLIES
    this.renderFireflies(ctx);

    // 2. FOREST: 3D FALLING LEAVES & STARDUST
    this.renderLeaves(ctx);

    // 3. OCEAN: 3D RISING BUBBLES
    this.renderBubbles(ctx);
  }

  renderFireflies(ctx) {
    ctx.save();
    this.fireflies.forEach(ff => {
      // 3D Lissajous orbit calculation
      ff.phaseX += ff.speedX;
      ff.phaseY += ff.speedY;
      ff.phaseZ += ff.speedZ;

      const posX = ff.x + Math.sin(ff.phaseX) * ff.ampX;
      const posY = ff.y + Math.cos(ff.phaseY) * ff.ampY;
      const posZ = ff.z + Math.sin(ff.phaseZ) * 60; // 3D depth

      // Perspective projection
      const fov = 350;
      const scale = Math.max(fov / (fov + posZ), 0.4);
      const screenX = posX;
      const screenY = posY;
      const curRadius = ff.radius * scale;

      // Glow intensity pulses in 3D
      const pulse = Math.sin(this.time * 0.003 + ff.phaseX) * 0.35 + 0.65;
      const glowSize = curRadius * 7 * pulse;

      // Draw outer 3D aura
      const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowSize);
      grad.addColorStop(0, ff.color);
      grad.addColorStop(0.3, ff.color === '#a3e635' ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255, 215, 0, 0.4)');
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bright nucleus
      ctx.beginPath();
      ctx.arc(screenX, screenY, curRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = ff.color;
      ctx.fill();
    });
    ctx.restore();
  }

  renderLeaves(ctx) {
    ctx.save();
    this.leaves.forEach(leaf => {
      leaf.y += leaf.speedY;
      leaf.x += Math.sin(leaf.y * 0.015) * 0.8 + leaf.speedX;
      leaf.rotX += leaf.rotSpeedX;
      leaf.rotY += leaf.rotSpeedY;
      leaf.rotZ += leaf.rotSpeedZ;

      if (leaf.y > this.height + 50) {
        leaf.y = -30;
        leaf.x = Math.random() * this.width;
      }

      ctx.save();
      ctx.translate(leaf.x, leaf.y);

      // 3D Matrix scale to simulate 3D rotation
      const scaleX = Math.cos(leaf.rotX);
      const scaleY = Math.sin(leaf.rotY);
      ctx.scale(scaleX, scaleY);
      ctx.rotate(leaf.rotZ);

      ctx.font = `${leaf.size}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = leaf.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
      ctx.fillText(leaf.char, 0, 0);

      ctx.restore();
    });
    ctx.restore();
  }

  renderBubbles(ctx) {
    ctx.save();
    this.bubbles.forEach(b => {
      b.y -= b.speedY;
      const wobble = Math.sin(this.time * b.wobbleSpeed + b.wobbleOffset) * 8;

      if (b.y < -30) {
        b.y = this.height + 20;
        b.x = Math.random() * this.width;
      }

      const screenX = b.x + wobble;
      const screenY = b.y;

      // 3D Glass Bubble Shading
      const bubbleGrad = ctx.createRadialGradient(
        screenX - b.radius * 0.35,
        screenY - b.radius * 0.35,
        b.radius * 0.1,
        screenX,
        screenY,
        b.radius
      );
      bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      bubbleGrad.addColorStop(0.3, 'rgba(0, 245, 212, 0.4)');
      bubbleGrad.addColorStop(0.8, 'rgba(0, 119, 182, 0.25)');
      bubbleGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

      ctx.beginPath();
      ctx.arc(screenX, screenY, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubbleGrad;
      ctx.globalAlpha = b.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f5d4';
      ctx.fill();

      // Specular highlight spot
      ctx.beginPath();
      ctx.arc(screenX - b.radius * 0.35, screenY - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
    ctx.restore();
  }

  updateCard3DTilt() {
    if (!this.card) return;

    // Smooth physics lerp
    this.curRotX += (this.targetRotX - this.curRotX) * 0.08;
    this.curRotY += (this.targetRotY - this.curRotY) * 0.08;

    this.card.style.transform = `perspective(1200px) rotateX(${this.curRotX.toFixed(2)}deg) rotateY(${this.curRotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
  }

  animate() {
    this.time += 16;

    // Only render if Slide 4 is visible or active to optimize performance
    const isSlideActive = this.section.classList.contains('active') ||
      window.getComputedStyle(this.section).display !== 'none';

    if (isSlideActive) {
      this.renderBackground();
      this.renderForeground();
      this.updateCard3DTilt();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
  window.Nature3D = new Nature3DVisualEngine();
});
