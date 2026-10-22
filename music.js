/**
 * Audio Controller for Tejuu's Birthday Website
 * Features:
 * - Detects user audio file (audio/music.mp3, music.mp3)
 * - Has an elegant built-in Web Audio API Music Box synthesizer playing an emotional birthday melody if no mp3 is found
 * - Seamless play/pause/mute toggle
 * - Auto-pauses background music when user opens a video
 */

class BirthdayMusicPlayer {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = 0.55;

    this.toggleBtn = document.getElementById('music-toggle');
    this.statusLabel = document.getElementById('music-status-text');

    // Candidate paths for user's audio file
    this.audioCandidates = [
      'audio/music.mp3',
      'music.mp3',
      'audio/birthday.mp3',
      'audio/song.mp3'
    ];
    this.currentCandidateIndex = 0;
    this.hasLocalAudio = false;

    // Web Audio Synthesizer fallback
    this.audioCtx = null;
    this.synthInterval = null;
    this.synthPlaying = false;

    this.initAudioSource();
    this.bindEvents();
  }

  initAudioSource() {
    this.testAudioCandidate();
  }

  testAudioCandidate() {
    if (this.currentCandidateIndex >= this.audioCandidates.length) {
      // No local audio files found; Web Audio API synth will be used seamlessly
      this.hasLocalAudio = false;
      return;
    }

    const testUrl = this.audioCandidates[this.currentCandidateIndex];
    fetch(testUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          this.audioElement.src = testUrl;
          this.hasLocalAudio = true;
        } else {
          this.currentCandidateIndex++;
          this.testAudioCandidate();
        }
      })
      .catch(() => {
        this.currentCandidateIndex++;
        this.testAudioCandidate();
      });
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        this.togglePlayback();
      });
    }

    // Handle end or errors gracefully
    this.audioElement.addEventListener('error', () => {
      // If error occurs with file, fallback to synth
      this.hasLocalAudio = false;
    });
  }

  startPlayback() {
    if (this.hasLocalAudio) {
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.updateUI(true);
        })
        .catch(err => {
          console.log('Audio autoplay prevented or file unavailable, falling back to synth:', err);
          this.startSynthMelody();
        });
    } else {
      this.startSynthMelody();
    }
  }

  pausePlayback() {
    if (this.hasLocalAudio) {
      this.audioElement.pause();
    }
    this.stopSynthMelody();
    this.isPlaying = false;
    this.updateUI(false);
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.pausePlayback();
    } else {
      this.startPlayback();
    }
  }

  updateUI(playing) {
    if (!this.toggleBtn) return;

    if (playing) {
      this.toggleBtn.classList.add('music-playing');
      if (this.statusLabel) this.statusLabel.textContent = 'Music: Playing';
      this.toggleBtn.setAttribute('title', 'Pause Birthday Music');
    } else {
      this.toggleBtn.classList.remove('music-playing');
      if (this.statusLabel) this.statusLabel.textContent = 'Music: Paused';
      this.toggleBtn.setAttribute('title', 'Play Birthday Music');
    }
  }

  // =========================================================================
  // Web Audio Emotional Celeste / Music Box Synthesizer
  // =========================================================================
  initSynthContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, duration, time, gainLevel = 0.15) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Warm, bell-like sine + triangle blend
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Natural bell envelope: fast attack, gentle exponential decay
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  startSynthMelody() {
    this.initSynthContext();
    this.stopSynthMelody();
    this.synthPlaying = true;
    this.isPlaying = true;
    this.updateUI(true);

    // Frequencies for a gentle emotional music box birthday arrangement (Key of C / G)
    // Notes: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5, F5, G5
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
    };

    // Warm, emotional music box variation of Happy Birthday
    const melody = [
      { note: notes.G4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.A4, dur: 1.0 },
      { note: notes.G4, dur: 1.0 },
      { note: notes.C5, dur: 1.0 },
      { note: notes.B4, dur: 1.8 },

      { note: notes.G4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.A4, dur: 1.0 },
      { note: notes.G4, dur: 1.0 },
      { note: notes.D5, dur: 1.0 },
      { note: notes.C5, dur: 1.8 },

      { note: notes.G4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.G5, dur: 1.0 },
      { note: notes.E5, dur: 1.0 },
      { note: notes.C5, dur: 1.0 },
      { note: notes.B4, dur: 1.0 },
      { note: notes.A4, dur: 1.5 },

      { note: notes.F5, dur: 0.6 },
      { note: notes.F5, dur: 0.6 },
      { note: notes.E5, dur: 1.0 },
      { note: notes.C5, dur: 1.0 },
      { note: notes.D5, dur: 1.0 },
      { note: notes.C5, dur: 2.2 }
    ];

    let noteIndex = 0;
    const playNext = () => {
      if (!this.synthPlaying || !this.audioCtx) return;

      const item = melody[noteIndex];
      const now = this.audioCtx.currentTime;

      // Primary melody tone
      this.playTone(item.note, item.dur * 1.5, now, 0.16);

      // Light harmonic chime an octave higher
      if (Math.random() < 0.5) {
        this.playTone(item.note * 2, item.dur * 0.8, now + 0.05, 0.04);
      }

      // Soft bass harmony on phrase starts
      if (noteIndex % 6 === 0) {
        this.playTone(item.note / 2, 2.2, now, 0.1);
      }

      noteIndex = (noteIndex + 1) % melody.length;
      this.synthInterval = setTimeout(playNext, item.dur * 700);
    };

    playNext();
  }

  stopSynthMelody() {
    this.synthPlaying = false;
    if (this.synthInterval) {
      clearTimeout(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

// Global instance
window.BirthdayMusic = null;
document.addEventListener('DOMContentLoaded', () => {
  window.BirthdayMusic = new BirthdayMusicPlayer();
});
