/**
 * app.js
 * -----------------------------------------
 * Application bootstrap & orchestration
 */

import { renderUI } from './ui.js';
import { incrementJapa } from './counter.js';
import { state, resetSessionState } from './state.js';
import { startSessionTimer, resetSessionTimer } from './timer.js';
import { loadTheme } from './utils.js';

// Load persisted theme BEFORE render
loadTheme();

// DOM references
const tapArea = document.getElementById('tapArea');
const bellSound = document.getElementById('bellSound');
const timerEl = document.getElementById('sessionTimer');

// Initial render (timer intentionally NOT started)
renderUI();

function handleJapaTap() {
  if (state.guideOpen) return;

  if (!state.sessionActive) {
    startSessionTimer(timerEl);
  }

  incrementJapa(bellSound);
}

/* ---------------------------
   Tap Area
---------------------------- */
tapArea.addEventListener('click', handleJapaTap);
tapArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleJapaTap();
  }
});

/* ---------------------------
   Global Controls
---------------------------- */
document.addEventListener('click', (event) => {

  if (event.target.id === 'lockBtn') {
    state.locked = !state.locked;
    renderUI();
    return;
  }

  if (event.target.id === 'resetBtn') {
    if (state.locked) return;

    const confirmed = confirm(
      'Reset current Naam Jap session?\n\n' +
      'Lifetime count will remain safe.'
    );

    if (!confirmed) return;

    resetSessionState();
    resetSessionTimer(timerEl);
    renderUI();
  }
});
