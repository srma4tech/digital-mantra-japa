export function vibrate(ms) {
  navigator.vibrate?.(ms);
}

export function loadTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function playFallbackTone() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.value = 0.03;

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

export function playBell(audioEl) {
  if (audioEl?.play) {
    const result = audioEl.play();
    if (result?.catch) {
      result.catch(() => playFallbackTone());
    }
    return;
  }

  playFallbackTone();
}
