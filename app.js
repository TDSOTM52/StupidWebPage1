(function () {
  const TIMEZONE = 'America/Bogota';
  const INDEPENDENCE_MONTH = '07';
  const INDEPENDENCE_DAY = '20';

  const headlineEl = document.getElementById('headline');
  const subtextEl = document.getElementById('subtext');
  const playButton = document.getElementById('playButton');
  const debugDate = document.getElementById('debugDate');
  const debugTimezone = document.getElementById('debugTimezone');
  const confettiContainer = document.getElementById('confetti');

  let audio;
  let audioReady = false;
  let isYes = false;
  let confettiTimer;

  function getColombiaDateISO() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  }

  function isIndependenceDay(dateISO) {
    const [year, month, day] = dateISO.split('-');
    return month === INDEPENDENCE_MONTH && day === INDEPENDENCE_DAY;
  }

  function getForcedMode() {
    const params = new URLSearchParams(window.location.search);
    const testValue = (params.get('test') || '').toLowerCase();
    if (testValue === 'si') return true;
    if (testValue === 'no') return false;
    return null;
  }

  function setUIState() {
    const todayColombia = getColombiaDateISO();
    const forcedMode = getForcedMode();
    isYes = forcedMode !== null ? forcedMode : isIndependenceDay(todayColombia);

    document.body.classList.toggle('yes', isYes);
    document.body.classList.toggle('no', !isYes);

    headlineEl.textContent = isYes ? 'SÍ' : 'NO';
    subtextEl.textContent = isYes
      ? getPatrioticMessage()
      : 'Hoy no es. Vuelva el 20 de julio, patriota de teclado.';

    debugDate.textContent = `Fecha en Colombia: ${todayColombia}`;
    debugTimezone.textContent = `Zona horaria: ${TIMEZONE}`;

    if (isYes) {
      startConfetti();
      setupAudio();
    } else {
      stopConfetti();
      hidePlayButton();
    }
  }

  function getPatrioticMessage() {
    const messages = [
      'LA PATRIA LLAMA. HOY SÍ, MIJO.',
      'Hoy sí toca respetar la arepa.',
      'A izar la bandera y a cantar duro (sin hacerle el feo al vecino).',
      'Cafecito en mano, himno en el corazón.',
      'Modo ultracolombiano activado. Hágale pues.'
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  function setupAudio() {
    if (audioReady) return;

    audio = new Audio('assets/himno-colombia.mp3');
    audio.loop = false;
    audio.preload = 'auto';

    const attemptAutoPlay = () => {
      audio
        .play()
        .then(() => {
          audioReady = true;
          hidePlayButton();
        })
        .catch(() => {
          showPlayButton('Tu navegador es un aguafiestas. Haz click.');
        });
    };

    audio.addEventListener('canplaythrough', attemptAutoPlay, { once: true });
    audio.addEventListener('error', () => {
      // Fallback: simple celebratory fanfare via Web Audio API
      showPlayButton('No se encontró el audio. Reproducir fanfarria.');
      playButton.onclick = () => playFanfare();
    });

    attemptAutoPlay();
    playButton.onclick = () => {
      audio
        .play()
        .then(() => hidePlayButton())
        .catch(() => showPlayButton('Intente de nuevo, patriota.'));
    };
  }

  function playFanfare() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.2;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + duration + idx * 0.05);
    });
    hidePlayButton();
  }

  function showPlayButton(text) {
    playButton.classList.remove('hidden');
    playButton.textContent = text || 'Reproducir himno';
    playButton.setAttribute('aria-live', 'assertive');
    playButton.focus({ preventScroll: true });
  }

  function hidePlayButton() {
    playButton.classList.add('hidden');
  }

  function startConfetti() {
    stopConfetti();
    confettiTimer = setInterval(() => spawnConfettiPiece(), 180);
    for (let i = 0; i < 20; i++) {
      spawnConfettiPiece();
    }
  }

  function spawnConfettiPiece() {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const colors = ['var(--accent-yellow)', 'var(--accent-blue)', 'var(--accent-red)', '#ffffff'];
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDuration = `${2.5 + Math.random()}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }

  function stopConfetti() {
    if (confettiTimer) clearInterval(confettiTimer);
    confettiTimer = null;
    confettiContainer.innerHTML = '';
  }

  document.addEventListener('DOMContentLoaded', setUIState);
})();
