import { state } from './state.js';
import { recordSessionTime } from './stats.js';

let timerInterval = null;

/**
 * Starts session timer only once
 */
export function startSessionTimer(element) {
  if (state.sessionActive) return;

  state.sessionStart = Date.now();
  state.sessionActive = true;

  timerInterval = setInterval(() => {
    const diff = Date.now() - state.sessionStart;
    element.textContent = formatSessionTime(diff);
  }, 1000);
}

/**
 * Stops timer and records elapsed time
 */
export function resetSessionTimer(element) {
  stopAndRecordSession();

  clearInterval(timerInterval);
  timerInterval = null;

  element.textContent = 'Session: 00:00:00';
}

/**
 * Call this BEFORE mantra change
 */
export function stopAndRecordSession() {
  if (!state.sessionActive || !state.sessionStart) return;

  const elapsed = Date.now() - state.sessionStart;

  // Record only meaningful time (>1 sec)
  if (elapsed > 1000) {
    recordSessionTime(state.mantra, elapsed);
  }

  state.sessionStart = null;
  state.sessionActive = false;
}

/**
 * Prevent background inflation (mobile/PWA fix)
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAndRecordSession();
  }
});

/**
 * Shared formatter (reuse elsewhere)
 */
export function formatSessionTime(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `Session: ${h}:${m}:${s}`;
}
