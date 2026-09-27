/* ==========================================================================
   ROMANTIC BIRTHDAY SURPRISE - INTERACTIVE JAVASCRIPT
   Pure Vanilla JS - Zero External Dependencies Needed
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- DOM Elements ---
  const sceneTeaser = document.getElementById('scene-teaser');
  const sceneCelebration = document.getElementById('scene-celebration');
  const btnOpenBox = document.getElementById('btn-open-box');
  const giftBoxTrigger = document.getElementById('gift-box-trigger');
  const giftBox = document.getElementById('gift-box');

  const musicBtn = document.getElementById('music-btn');
  const musicText = document.getElementById('music-text');

  const fireworksCanvas = document.getElementById('fireworks-canvas');
  const confettiCanvas = document.getElementById('confetti-canvas');

  const candles = document.querySelectorAll('.candle');
  const btnBlowAction = document.getElementById('btn-blow-action');
  const wishRevealBox = document.getElementById('wish-reveal-box');

  const envelopeBox = document.getElementById('envelope-box');
  const waxSeal = document.getElementById('wax-seal');
  const openedLetterSheet = document.getElementById('opened-letter-sheet');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  const photoFileInput = document.getElementById('photo-file-input');
  const btnHeartBurst = document.getElementById('btn-heart-burst');
  const btnReCelebrate = document.getElementById('btn-re-celebrate');
  const btnBlowCandlesJump = document.getElementById('btn-blow-candles-jump');
  const btnReadLetterJump = document.getElementById('btn-read-letter-jump');
  const btnBackToTop = document.getElementById('btn-back-to-top');

  // Support custom name via URL e.g. ?name=Shuvro
  const urlParams = new URLSearchParams(window.location.search);
  const customName = urlParams.get('name');
  if (customName) {
    const displayName = document.getElementById('display-name');
    if (displayName) displayName.textContent = `${customName.toUpperCase()} ❤️`;
  }

  let isAudioPlaying = false;
  let isBoxOpened = false;
  let audioCtx = null;
  let musicInterval = null;

  // ==========================================================================
  // 1. WEB AUDIO API - ROMANTIC MUSIC BOX & MELODY SYNTHESIZER
  // ==========================================================================
  // Generates dreamy celestial music box chords and Happy Birthday melody
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft, music-box bell tone
  function playBellNote(frequency, startTime, duration = 1.8, gainLevel = 0.15) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine'; // pure sweet music-box tone
      osc.frequency.setValueAtTime(frequency, startTime);

      // Attack and gentle decay (like a celesta / music box)
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  // Romantic Birthday Melody Notes (Happy Birthday in high, gentle music box notes)
  const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33, B5: 987.77,
    C6: 1046.50
  };

  // Happy Birthday + Romantic Melody sequence
  const birthdayMelody = [
    { n: notes.G4, d: 0.4 }, { n: notes.G4, d: 0.4 }, { n: notes.A4, d: 0.8 }, { n: notes.G4, d: 0.8 }, { n: notes.C5, d: 0.8 }, { n: notes.B4, d: 1.4 },
    { n: notes.G4, d: 0.4 }, { n: notes.G4, d: 0.4 }, { n: notes.A4, d: 0.8 }, { n: notes.G4, d: 0.8 }, { n: notes.D5, d: 0.8 }, { n: notes.C5, d: 1.4 },
    { n: notes.G4, d: 0.4 }, { n: notes.G4, d: 0.4 }, { n: notes.G5, d: 0.8 }, { n: notes.E5, d: 0.8 }, { n: notes.C5, d: 0.8 }, { n: notes.B4, d: 0.8 }, { n: notes.A4, d: 1.2 },
    { n: notes.F5, d: 0.4 }, { n: notes.F5, d: 0.4 }, { n: notes.E5, d: 0.8 }, { n: notes.C5, d: 0.8 }, { n: notes.D5, d: 0.8 }, { n: notes.C5, d: 1.8 },
    // Romantic Arpeggio outro
    { n: notes.E4, d: 0.6 }, { n: notes.G4, d: 0.6 }, { n: notes.C5, d: 0.6 }, { n: notes.E5, d: 1.2 },
    { n: notes.F4, d: 0.6 }, { n: notes.A4, d: 0.6 }, { n: notes.C5, d: 0.6 }, { n: notes.F5, d: 1.2 }
  ];

  function startRomanticBGM() {
    initAudio();
    isAudioPlaying = true;
    musicBtn.classList.remove('paused');
    musicText.textContent = "Music On";

    let step = 0;
    function playNext() {
      if (!isAudioPlaying || !audioCtx) return;
      const current = birthdayMelody[step];
      const now = audioCtx.currentTime;
      playBellNote(current.n, now, current.d * 1.5, 0.18);

      // Also play soft harmony bass chord occasionally
      if (step % 4 === 0) {
        playBellNote(current.n / 2, now, 2.5, 0.08);
      }

      step = (step + 1) % birthdayMelody.length;
      musicInterval = setTimeout(playNext, current.d * 750);
    }
    playNext();
  }

  function pauseBGM() {
    isAudioPlaying = false;
    clearTimeout(musicInterval);
    musicBtn.classList.add('paused');
    musicText.textContent = "Music Muted";
  }

  musicBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      pauseBGM();
    } else {
      startRomanticBGM();
    }
  });

  // Sound effect for popping box
  function playPopChime() {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chimeTones = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimeTones.forEach((freq, idx) => {
      playBellNote(freq, now + idx * 0.08, 1.5, 0.22);
    });
  }

  // ==========================================================================
  // 2. UNBOXING EXPERIENCE & SCENE TRANSITION
  // ==========================================================================
  function triggerUnboxing() {
    if (isBoxOpened) return;
    isBoxOpened = true;

    // Start celebratory music immediately
    startRomanticBGM();
    playPopChime();

    // Box animation
    giftBox.classList.add('opening');

    // Launch intense confetti & fireworks
    launchFullCelebrationBurst();

    // Transition smoothly to celebration scene
    setTimeout(() => {
      sceneTeaser.classList.add('fade-out');
      sceneCelebration.classList.remove('hidden');

      // Scroll to the celebration header smoothly
      setTimeout(() => {
        sceneTeaser.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    }, 850);
  }

  btnOpenBox.addEventListener('click', triggerUnboxing);
  giftBoxTrigger.addEventListener('click', triggerUnboxing);

  // ==========================================================================
  // 3. CONFETTI ENGINE (HTML5 CANVAS)
  // ==========================================================================
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeCanvases() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  const confettiColors = ['#ff4d79', '#ffcf70', '#ffffff', '#9d4edd', '#00f0ff', '#ff8fa3'];

  class Confetto {
    constructor(x, y, isExplosion = false) {
      this.x = x || Math.random() * confettiCanvas.width;
      this.y = y || -20;
      this.size = Math.random() * 8 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedY = isExplosion ? (Math.random() * -18 - 4) : (Math.random() * 3 + 2);
      this.speedX = isExplosion ? (Math.random() * 16 - 8) : (Math.random() * 2 - 1);
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 8 - 4;
      this.opacity = 1;
      this.gravity = 0.25;
      this.drag = 0.98;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.speedX *= this.drag;
      this.rotation += this.rotSpeed;

      if (this.y > confettiCanvas.height) {
        this.y = -20;
        this.x = Math.random() * confettiCanvas.width;
        this.speedY = Math.random() * 3 + 2;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function launchConfettiBurst(count = 120, x, y) {
    const originX = x !== undefined ? x : confettiCanvas.width / 2;
    const originY = y !== undefined ? y : confettiCanvas.height / 2;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetto(originX, originY, true));
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < confettiParticles.length; i++) {
      confettiParticles[i].update();
      confettiParticles[i].draw(confettiCtx);
    }
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // Gentle ambient confetti pieces running continuously
  for (let i = 0; i < 40; i++) {
    confettiParticles.push(new Confetto(Math.random() * window.innerWidth, Math.random() * window.innerHeight, false));
  }

  // ==========================================================================
  // 4. FIREWORKS CANVAS ENGINE
  // ==========================================================================
  const fwCtx = fireworksCanvas.getContext('2d');
  let fireworksParticles = [];

  class FireworkSpark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.gravity = 0.08;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function triggerFirework(x, y) {
    const colors = ['#ff4d79', '#ffcf70', '#00f0ff', '#ffffff', '#c084fc', '#ff8fa3'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 65; i++) {
      fireworksParticles.push(new FireworkSpark(x, y, chosenColor));
    }
  }

  function animateFireworks() {
    fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
      fireworksParticles[i].update();
      fireworksParticles[i].draw(fwCtx);
      if (fireworksParticles[i].alpha <= 0) {
        fireworksParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateFireworks);
  }
  animateFireworks();

  function launchFullCelebrationBurst() {
    launchConfettiBurst(150, window.innerWidth / 2, window.innerHeight * 0.6);
    setTimeout(() => {
      triggerFirework(window.innerWidth * 0.25, window.innerHeight * 0.35);
      triggerFirework(window.innerWidth * 0.75, window.innerHeight * 0.35);
    }, 200);
    setTimeout(() => {
      triggerFirework(window.innerWidth * 0.5, window.innerHeight * 0.25);
      launchConfettiBurst(80, window.innerWidth * 0.2, window.innerHeight * 0.4);
      launchConfettiBurst(80, window.innerWidth * 0.8, window.innerHeight * 0.4);
    }, 550);
  }

  // Periodic celebratory fireworks in background
  setInterval(() => {
    if (isBoxOpened) {
      const rx = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
      const ry = Math.random() * window.innerHeight * 0.4 + 60;
      triggerFirework(rx, ry);
    }
  }, 4500);

  // ==========================================================================
  // 5. FLOATING BACKGROUND HEARTS GENERATOR
  // ==========================================================================
  const heartsContainer = document.getElementById('floating-hearts-container');
  const heartSymbols = ['💖', '❤️', '✨', '💕', '🥰', '💓', '🌟'];

  function spawnFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = `${Math.random() * 95}vw`;
    heart.style.fontSize = `${Math.random() * 1.5 + 0.9}rem`;
    heart.style.animationDuration = `${Math.random() * 4 + 6}s`;
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(spawnFloatingHeart, 800);

  // Tap anywhere to create a floating heart
  window.addEventListener('click', (e) => {
    // Avoid creating on buttons
    if (e.target.closest('button') || e.target.closest('.wax-seal')) return;
    const mini = document.createElement('div');
    mini.innerText = '💖';
    mini.style.position = 'fixed';
    mini.style.left = `${e.clientX - 12}px`;
    mini.style.top = `${e.clientY - 12}px`;
    mini.style.pointerEvents = 'none';
    mini.style.fontSize = '1.4rem';
    mini.style.zIndex = '9999';
    mini.style.transition = 'all 0.9s ease-out';
    document.body.appendChild(mini);

    requestAnimationFrame(() => {
      mini.style.transform = `translateY(-60px) scale(1.4) rotate(${Math.random() * 40 - 20}deg)`;
      mini.style.opacity = '0';
    });

    setTimeout(() => mini.remove(), 950);
  });

  // ==========================================================================
  // 6. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING
  // ==========================================================================
  let blownCandleCount = 0;

  function blowCandle(candleEl) {
    if (!candleEl.classList.contains('blown')) {
      candleEl.classList.add('blown');
      blownCandleCount++;

      // Candle smoke puff sound
      if (audioCtx) {
        playBellNote(800 + Math.random() * 200, audioCtx.currentTime, 0.4, 0.08);
      }

      // Check if all blown
      if (blownCandleCount >= candles.length) {
        setTimeout(() => {
          wishRevealBox.classList.add('active');
          btnBlowAction.textContent = "🎉 All Wishes Granted! 🌟";
          btnBlowAction.style.background = "linear-gradient(135deg, #10b981, #059669)";
          launchFullCelebrationBurst();
        }, 500);
      }
    }
  }

  candles.forEach(candle => {
    candle.addEventListener('click', () => blowCandle(candle));
  });

  btnBlowAction.addEventListener('click', () => {
    candles.forEach((c, idx) => {
      setTimeout(() => blowCandle(c), idx * 200);
    });
  });

  // ==========================================================================
  // 7. VINTAGE WAX-SEALED LOVE LETTER MODAL
  // ==========================================================================
  function openLoveLetter() {
    openedLetterSheet.classList.add('active');
    launchConfettiBurst(60, window.innerWidth / 2, window.innerHeight / 2);
  }

  function closeLoveLetter() {
    openedLetterSheet.classList.remove('active');
  }

  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openLoveLetter();
  });
  envelopeBox.addEventListener('click', openLoveLetter);
  closeLetterBtn.addEventListener('click', closeLoveLetter);

  // Close letter when clicking outside modal backdrop
  document.addEventListener('click', (e) => {
    if (openedLetterSheet.classList.contains('active') &&
      !openedLetterSheet.contains(e.target) &&
      !waxSeal.contains(e.target) &&
      !envelopeBox.contains(e.target) &&
      !e.target.closest('#btn-read-letter-jump')) {
      closeLoveLetter();
    }
  });

  // ==========================================================================
  // 8. CUSTOM PHOTO UPLOADER (CLIENT-SIDE WITH LOCALSTORAGE)
  // ==========================================================================
  const preview1 = document.getElementById('photo-preview-1');
  const preview2 = document.getElementById('photo-preview-2');
  const preview3 = document.getElementById('photo-preview-3');
  const previews = [preview1, preview2, preview3];

  // Load stored photos if previously saved
  try {
    const savedImgs = JSON.parse(localStorage.getItem('bday_boyfriend_photos') || '[]');
    savedImgs.forEach((src, idx) => {
      if (previews[idx] && src) {
        previews[idx].src = src;
        previews[idx].classList.remove('hidden');
        if (previews[idx].previousElementSibling) {
          previews[idx].previousElementSibling.style.display = 'none';
        }
      }
    });
  } catch (err) {
    console.warn("Could not load photos from local storage", err);
  }

  photoFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const storedUrls = [];

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (previews[index]) {
          previews[index].src = dataUrl;
          previews[index].classList.remove('hidden');
          if (previews[index].previousElementSibling) {
            previews[index].previousElementSibling.style.display = 'none';
          }
        }
        storedUrls[index] = dataUrl;
        try {
          localStorage.setItem('bday_boyfriend_photos', JSON.stringify(storedUrls));
        } catch (e) {
          // ignore storage limit
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // ==========================================================================
  // 9. EXTRA CELEBRATION BUTTONS & SMOOTH NAVIGATION
  // ==========================================================================
  btnHeartBurst.addEventListener('click', () => {
    launchFullCelebrationBurst();
    btnHeartBurst.innerHTML = "💖 Sent 1,000,000 Hugs & Kisses! 💋";
    setTimeout(() => {
      btnHeartBurst.innerHTML = "💓 Send Endless Love (Click Me)";
    }, 2200);
  });

  btnReCelebrate.addEventListener('click', () => {
    launchFullCelebrationBurst();
  });

  btnBlowCandlesJump.addEventListener('click', () => {
    document.getElementById('cake-section').scrollIntoView({ behavior: 'smooth' });
  });

  btnReadLetterJump.addEventListener('click', () => {
    openLoveLetter();
  });

  btnBackToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});

