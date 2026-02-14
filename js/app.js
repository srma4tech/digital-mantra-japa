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
import { initAnalytics, trackEvent } from './analytics.js';

// Load persisted theme BEFORE render
loadTheme();

// DOM references
const tapArea = document.getElementById('tapArea');
const bellSound = document.getElementById('bellSound');
const timerEl = document.getElementById('sessionTimer');

// Initial render (timer intentionally NOT started)
renderUI();

function maybeInitAnalytics() {
  if (!state.analyticsEnabled) return;
  initAnalytics();
}

function handleJapaTap() {
  if (state.guideOpen) return;
  if (state.locked) return;

  if (!state.sessionActive) {
    maybeInitAnalytics();
    startSessionTimer(timerEl);
    trackEvent('session_started', {
      mantra: state.mantra,
      mala_goal: state.malaGoal
    });
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
  maybeInitAnalytics();

  if (event.target.id === 'lockBtn') {
    state.locked = !state.locked;
    trackEvent('lock_toggled', { locked: state.locked });
    renderUI();
    return;
  }

  if (event.target.id === 'resetBtn') {
    const confirmed = confirm(
      'Reset current Naam Jap session?\n\n' +
      'Lifetime count will remain safe.'
    );

    if (!confirmed) return;

    resetSessionState();
    resetSessionTimer(timerEl);
    trackEvent('session_reset');
    renderUI();
  }
});
