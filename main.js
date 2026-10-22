/**
 * Main Controller for Tejuu's Birthday Surprise Website
 * Controls:
 * - Opening screen timed reveal
 * - Unlock transition & confetti
 * - Video modal & playback controls
 * - Dynamic luxury poster generator
 * - Interactive birthday cake candle
 * - Replay surprise flow
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const surpriseOverlay = document.getElementById('surprise-overlay');
  const openSurpriseBtn = document.getElementById('open-surprise-btn');
  const line1 = document.getElementById('intro-line-1');
  const line2 = document.getElementById('intro-line-2');
  const line3 = document.getElementById('intro-line-3');
  const btnContainer = document.getElementById('surprise-btn-container');
  const siteWrapper = document.getElementById('site-wrapper');

  // Video modal elements
  const cinemaModal = document.getElementById('cinema-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const cinemaVideo = document.getElementById('cinema-video');
  const modalTitle = document.getElementById('modal-video-title');
  const fallbackNotice = document.getElementById('video-fallback-notice');
  const fallbackFilename = document.getElementById('fallback-filename');

  // Action buttons
  const celebrateBtn = document.getElementById('floating-celebrate');
  const replayBtns = document.querySelectorAll('#replay-surprise-btn, #replay-surprise-btn-2');
  const interactiveCake = document.getElementById('interactive-cake');
  const cakeFlame = document.getElementById('cake-flame');
  const cakeWishAlert = document.getElementById('cake-wish-alert');

  // =========================================================================
  // 1. OPENING CINEMATIC SEQUENCE
  // =========================================================================
  function startIntroSequence() {
    // Reset states
    [line1, line2, line3, btnContainer].forEach(el => {
      if (el) el.classList.remove('visible');
    });

    setTimeout(() => {
      if (line1) line1.classList.add('visible');
    }, 600);

    setTimeout(() => {
      if (line2) line2.classList.add('visible');
    }, 2200);

    setTimeout(() => {
      if (line3) line3.classList.add('visible');
    }, 3800);

    setTimeout(() => {
      if (btnContainer) btnContainer.classList.add('visible');
    }, 5100);
  }

  // Trigger intro on initial load
  startIntroSequence();

  // =========================================================================
  // STORY SLIDE CONTROLLER (Slide 1: Greeting, Slide 2: 4 Videos, Slide 3: Final)
  // =========================================================================
  const slides = document.querySelectorAll('.story-slide');
  const slideTabs = document.querySelectorAll('.slide-tab-btn');
  const nextSlideBtns = document.querySelectorAll('.next-slide-btn');
  const prevSlideBtns = document.querySelectorAll('.prev-slide-btn');
  let currentSlideIndex = 0;

  function dismissOverlay() {
    if (surpriseOverlay) {
      surpriseOverlay.classList.add('unlocked');
      setTimeout(() => {
        if (surpriseOverlay.classList.contains('unlocked')) {
          surpriseOverlay.style.display = 'none';
        }
      }, 1100);
    }
    if (siteWrapper) {
      siteWrapper.classList.add('visible');
    }
  }

  function goToSlide(index, withConfetti = false) {
    if (index < 0 || index >= slides.length) return;

    currentSlideIndex = index;

    // Ensure siteWrapper is visible and overlay is dismissed
    if (siteWrapper) {
      siteWrapper.classList.add('visible');
    }
    if (surpriseOverlay && !surpriseOverlay.classList.contains('unlocked')) {
      dismissOverlay();
    }

    // Update slides visibility directly with styles to prevent any CSS glitches
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        if (slide.id === 'greeting-section') {
          slide.style.setProperty('display', 'flex', 'important');
        } else {
          slide.style.setProperty('display', 'block', 'important');
        }
        slide.style.setProperty('opacity', '1', 'important');
        slide.style.setProperty('visibility', 'visible', 'important');
        slide.style.setProperty('transform', 'none', 'important');
      } else {
        slide.classList.remove('active');
        slide.style.setProperty('display', 'none', 'important');
        slide.style.setProperty('opacity', '0', 'important');
        slide.style.setProperty('visibility', 'hidden', 'important');
      }
    });

    // Update top tabs
    slideTabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Scroll to top immediately so content is never out of view
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (index === 3 && window.Nature3D) {
      window.Nature3D.initSize();
    }
    if (index === 4 && window.Fireworks) {
      window.Fireworks.initSize();
      window.Fireworks.launchMegaSalvo();
    }

    // Celebration burst when advancing to 4 Videos, More Videos, or Final Slide
    if (withConfetti && window.BirthdayVisuals) {
      if (index === 1) {
        // Entering 4 Videos slide
        window.BirthdayVisuals.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 90);
      } else if (index === 2) {
        // Entering More Videos slide
        window.BirthdayVisuals.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 100);
      } else if (index === 3) {
        // Entering Final Slide
        window.BirthdayVisuals.launchSideCannons();
      } else if (index === 4) {
        // Entering Fireworks Finale Slide
        window.BirthdayVisuals.launchSideCannons();
        window.BirthdayVisuals.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.38, 140);
      }
    }
  }

  // Bind top slide tabs
  slideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = parseInt(tab.getAttribute('data-target'), 10);
      goToSlide(target, false);
    });
  });

  // Bind Next Slide buttons
  nextSlideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToSlide(target, true);
    });
  });

  // Bind Prev Slide buttons
  prevSlideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target'), 10);
      goToSlide(target, false);
    });
  });

  // Keyboard navigation (ArrowLeft = prev, ArrowRight = next)
  document.addEventListener('keydown', (e) => {
    // Only if cinema modal is not open and overlay is unlocked
    if (cinemaModal && cinemaModal.classList.contains('active')) return;
    if (surpriseOverlay && !surpriseOverlay.classList.contains('unlocked')) return;

    if (e.key === 'ArrowRight') {
      if (currentSlideIndex < slides.length - 1) {
        goToSlide(currentSlideIndex + 1, true);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1, false);
      }
    }
  });

  // Touch swipe gesture navigation
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (cinemaModal && cinemaModal.classList.contains('active')) return;
    if (surpriseOverlay && !surpriseOverlay.classList.contains('unlocked')) return;
    if (!e.changedTouches || !e.changedTouches[0]) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Must be predominantly horizontal and over 50px
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0 && currentSlideIndex < slides.length - 1) {
        // Swiped left -> next slide
        goToSlide(currentSlideIndex + 1, true);
      } else if (diffX > 0 && currentSlideIndex > 0) {
        // Swiped right -> prev slide
        goToSlide(currentSlideIndex - 1, false);
      }
    }
  }, { passive: true });

  // Handle "OPEN YOUR SURPRISE ❤️" Click
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', () => {
      // 1. Celebrate with confetti explosion
      if (window.BirthdayVisuals) {
        window.BirthdayVisuals.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 160);
        setTimeout(() => {
          window.BirthdayVisuals.launchSideCannons();
        }, 400);
      }

      // 2. Play background music
      if (window.BirthdayMusic) {
        window.BirthdayMusic.startPlayback();
      }

      // 3. Unlock overlay with cinematic transition
      dismissOverlay();

      // 4. Default to Slide 0 (Greeting)
      goToSlide(0, false);
    });
  }

  // =========================================================================
  // 2. REPLAY SURPRISE BUTTON
  // =========================================================================
  if (replayBtns.length > 0) {
    replayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          if (surpriseOverlay) {
            surpriseOverlay.style.display = 'flex';
            surpriseOverlay.classList.remove('unlocked');
          }
          if (siteWrapper) {
            siteWrapper.classList.remove('visible');
          }
          
          // Reset slide deck back to slide 0
          currentSlideIndex = 0;
          slides.forEach((slide, i) => {
            if (i === 0) {
              slide.classList.add('active');
              slide.style.setProperty('display', 'flex', 'important');
              slide.style.setProperty('opacity', '1', 'important');
              slide.style.setProperty('visibility', 'visible', 'important');
            } else {
              slide.classList.remove('active');
              slide.style.setProperty('display', 'none', 'important');
              slide.style.setProperty('opacity', '0', 'important');
              slide.style.setProperty('visibility', 'hidden', 'important');
            }
          });
          slideTabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === 0);
          });

          startIntroSequence();
        }, 400);
      });
    });
  }

  // =========================================================================
  // 3. CELEBRATION FLOATING BUTTON
  // =========================================================================
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      if (window.BirthdayVisuals) {
        window.BirthdayVisuals.launchSideCannons();
        window.BirthdayVisuals.burstConfetti(
          celebrateBtn.getBoundingClientRect().left,
          celebrateBtn.getBoundingClientRect().top,
          80
        );
      }
    });
  }

  // =========================================================================
  // 4. INTERACTIVE BIRTHDAY CAKE CANDLE
  // =========================================================================
  let candleBlown = false;
  if (interactiveCake && cakeFlame) {
    interactiveCake.addEventListener('click', () => {
      if (!candleBlown) {
        candleBlown = true;
        cakeFlame.classList.add('blown-out');

        if (cakeWishAlert) {
          cakeWishAlert.style.display = 'inline-block';
        }

        if (window.BirthdayVisuals) {
          window.BirthdayVisuals.burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 120);
          window.BirthdayVisuals.launchSideCannons();
        }

        const instruction = document.getElementById('cake-instruction');
        if (instruction) {
          instruction.textContent = '✨ Wish Made! Tap again to relight the candle ✨';
        }
      } else {
        candleBlown = false;
        cakeFlame.classList.remove('blown-out');
        if (cakeWishAlert) {
          cakeWishAlert.style.display = 'none';
        }
        const instruction = document.getElementById('cake-instruction');
        if (instruction) {
          instruction.textContent = 'Click the candle to make a wish & blow it out!';
        }
      }
    });
  }

  // =========================================================================
  // 5. VIDEO MEMORIES GALLERY & CINEMA MODAL
  // =========================================================================
  const videoCards = document.querySelectorAll('.video-card');
  let musicWasPlayingBeforeVideo = false;

  videoCards.forEach(card => {
    const bgVid = card.querySelector('.card-video-bg');

    // Live video preview on hover
    if (bgVid) {
      card.addEventListener('mouseenter', () => {
        const playPromise = bgVid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      });

      card.addEventListener('mouseleave', () => {
        bgVid.pause();
        bgVid.currentTime = 0.5;
      });
    }

    // Open full cinema modal on click
    card.addEventListener('click', () => {
      if (bgVid) {
        bgVid.pause();
      }
      const videoSrc1 = card.getAttribute('data-video-src');
      const videoSrcAlt = card.getAttribute('data-video-alt');
      const title = card.getAttribute('data-video-title') || 'Special Memory';
      const fileId = card.getAttribute('data-file-id') || 'video1.mp4';

      openCinemaModal(videoSrc1, videoSrcAlt, title, fileId);
    });
  });

  function openCinemaModal(srcPrimary, srcAlt, title, fileId) {
    if (!cinemaModal || !cinemaVideo) return;

    modalTitle.textContent = title;
    fallbackFilename.textContent = `videos/${fileId}`;
    fallbackNotice.classList.remove('show');

    // Pause background music if playing
    if (window.BirthdayMusic && window.BirthdayMusic.isPlaying) {
      musicWasPlayingBeforeVideo = true;
      window.BirthdayMusic.pausePlayback();
    } else {
      musicWasPlayingBeforeVideo = false;
    }

    // Attempt primary path, then fallback to root path
    cinemaVideo.src = srcPrimary;
    cinemaVideo.load();

    let errorCount = 0;
    const handleError = () => {
      errorCount++;
      if (errorCount === 1 && srcAlt) {
        // Try alternate source (e.g. root video1.mp4)
        cinemaVideo.src = srcAlt;
        cinemaVideo.load();
      } else {
        // Both failed: show clear luxury instruction card
        fallbackNotice.classList.add('show');
      }
    };

    cinemaVideo.onerror = handleError;

    cinemaModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    cinemaVideo.play().catch(() => {
      // Autoplay might need user interaction or file not yet available
    });
  }

  function closeCinemaModal() {
    if (!cinemaModal || !cinemaVideo) return;

    cinemaVideo.pause();
    cinemaVideo.src = '';
    cinemaModal.classList.remove('active');
    document.body.style.overflow = '';

    // Resume background music if it was playing before
    if (musicWasPlayingBeforeVideo && window.BirthdayMusic) {
      window.BirthdayMusic.startPlayback();
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCinemaModal);
  }

  // Bottom "CLOSE VIDEO" button
  const modalCloseBtnBottom = document.getElementById('modal-close-btn-bottom');
  if (modalCloseBtnBottom) {
    modalCloseBtnBottom.addEventListener('click', closeCinemaModal);
  }

  // Floating fixed close button (top-right)
  const modalCloseBtnFloat = document.getElementById('modal-close-btn-float');
  if (modalCloseBtnFloat) {
    modalCloseBtnFloat.addEventListener('click', closeCinemaModal);
  }

  if (cinemaModal) {
    cinemaModal.addEventListener('click', (e) => {
      if (e.target === cinemaModal) {
        closeCinemaModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal && cinemaModal.classList.contains('active')) {
      closeCinemaModal();
    }
  });

  // =========================================================================
  // 6. DYNAMIC LUXURY POSTER ARTWORK GENERATOR
  // Renders a high-end luxury graphic on each canvas placeholder
  // =========================================================================
  function renderPosterArtworks() {
    const canvases = document.querySelectorAll('.poster-canvas-placeholder');
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const w = (canvas.width = 640);
      const h = (canvas.height = 360);
      const theme = canvas.getAttribute('data-theme') || '1';

      // Gradients according to theme
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
      if (theme === '1') {
        grad.addColorStop(0, '#3a0c16');
        grad.addColorStop(0.5, '#1e0911');
        grad.addColorStop(1, '#0b080f');
      } else if (theme === '2') {
        grad.addColorStop(0, '#2b1b06');
        grad.addColorStop(0.5, '#170e0a');
        grad.addColorStop(1, '#0a080d');
      } else if (theme === '3') {
        grad.addColorStop(0, '#310d24');
        grad.addColorStop(0.5, '#1b0919');
        grad.addColorStop(1, '#0c0710');
      } else {
        grad.addColorStop(0, '#2d0a14');
        grad.addColorStop(0.5, '#1d0c15');
        grad.addColorStop(1, '#09070c');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold & Red light rings
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(230, 36, 70, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 115, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ambient bokeh sparkles
      for (let i = 0; i < 28; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const pr = Math.random() * 3 + 1;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() < 0.6 ? 'rgba(255, 215, 0, 0.4)' : 'rgba(230, 36, 70, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.restore();
      }

      // Memory Icon / Illustration
      ctx.save();
      ctx.fillStyle = '#ffd700';
      ctx.font = '36px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const emojis = ['❤️', '😂', '✨', '🎂'];
      const emoji = emojis[parseInt(theme, 10) - 1] || '❤️';
      ctx.fillText(emoji, w / 2, h / 2 - 2);
      ctx.restore();
    });
  }

  // =========================================================================
  // 6. NATURE REALM SWITCHER (Sky, Ocean, Forest & Grand Symphony)
  // =========================================================================
  const realmBtns = document.querySelectorAll('.realm-pill-btn');
  const realmStage = document.getElementById('nature-realm-stage');

  if (realmBtns.length > 0 && realmStage) {
    realmBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedRealm = btn.getAttribute('data-realm') || 'all';

        realmBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update stage realm class
        realmStage.className = `nature-realm-stage realm-${selectedRealm}`;

        if (window.Nature3D) {
          window.Nature3D.setRealm(selectedRealm);
        }

        // Celebratory sparkle burst from the clicked button
        if (window.BirthdayVisuals) {
          const rect = btn.getBoundingClientRect();
          window.BirthdayVisuals.burstConfetti(rect.left + rect.width / 2, rect.top, 25);
        }
      });
    });
  }

  renderPosterArtworks();
});
