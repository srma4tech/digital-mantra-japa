/**
 * ui.js
 * -------------------------------------------------
 * UI rendering only
 * No business logic
 */

import {
  state,
  persistState,
  setGuideDismissed,
  setAnalyticsEnabled
} from './state.js';
import { getMantras, addMantra } from './mantra.js';
import { getAllStats } from './stats.js';
import { toggleTheme } from './utils.js';
import { stopAndRecordSession } from './timer.js';
import { initAnalytics, trackEvent } from './analytics.js';

const VIEWBOX = 240;
const RADIUS = 104;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let lastGuideTrigger = null;

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderUI() {
  renderTapArea();
  renderControls();
  renderGuideModal();
}

function renderTapArea() {
  const progress =
    CIRCUMFERENCE -
    (state.beads / state.malaGoal) * CIRCUMFERENCE;

  const tapStatus = state.locked
    ? 'Counter is locked. Unlock to continue counting.'
    : 'Tap or press Enter or Space to count one bead.';
  const tapButtonLabel = `${state.beads} of ${state.malaGoal}. ${state.mantra}. Mala ${state.malas}.`;

  document.getElementById('tapArea').innerHTML = `
    <div
      id="tapButton"
      role="button"
      tabindex="0"
      aria-disabled="${state.locked ? 'true' : 'false'}"
      aria-label="${escapeHTML(tapButtonLabel)}"
      class="tap-button relative w-[70vw] h-[70vw] max-w-[360px] max-h-[360px] min-w-[260px] min-h-[260px]"
    >
      <svg
        viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"
        class="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="${VIEWBOX / 2}"
          cy="${VIEWBOX / 2}"
          r="${RADIUS}"
          stroke="var(--ring-track)"
          stroke-width="${STROKE}"
          fill="none"
        />

        <circle
          cx="${VIEWBOX / 2}"
          cy="${VIEWBOX / 2}"
          r="${RADIUS}"
          stroke="var(--ring-progress)"
          stroke-width="${STROKE}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${CIRCUMFERENCE}"
          stroke-dashoffset="${progress}"
        />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div class="text-5xl sm:text-6xl font-semibold">${state.beads}</div>

        <div id="tapButtonCount" class="text-xs opacity-60 mt-1">of ${state.malaGoal}</div>

        <div id="tapButtonMantra" class="mt-4 text-base font-medium tracking-wide">${escapeHTML(state.mantra)}</div>

        <div class="mt-2 text-xs opacity-50 tracking-wide">Mala ${state.malas}</div>
      </div>

      <div class="sr-only" aria-live="polite">
        Beads ${state.beads} of ${state.malaGoal}. Mala count ${state.malas}. ${tapStatus}
      </div>
    </div>
  `;
}

function renderControls() {
  const mantras = getMantras();
  const stats = getAllStats();
  const isDark = document.documentElement.classList.contains('dark');
  const canStopSession = state.malas > 0 && state.beads === 0;

  document.getElementById('controls').innerHTML = `
    <div class="space-y-4 text-sm opacity-90">

      <div>
        <label for="mantraSelect" class="sr-only">Select mantra</label>
        <select id="mantraSelect" class="w-full p-2 rounded border" aria-label="Select mantra">
          ${mantras.map(m =>
            `<option ${m === state.mantra ? 'selected' : ''}>${escapeHTML(m)}</option>`
          ).join('')}
          <option value="__custom">+ Add Custom Mantra</option>
        </select>
      </div>

      <div>
        <label for="malaGoalSelect" class="sr-only">Select mala bead target</label>
        <select id="malaGoalSelect" class="w-full p-2 rounded border" aria-label="Select mala bead target">
          ${[11, 21, 54, 108].map(n =>
            `<option ${n === state.malaGoal ? 'selected' : ''}>${n} beads</option>`
          ).join('')}
        </select>
      </div>

      <div class="flex justify-between opacity-80">
        <span>Lifetime Japa</span>
        <span aria-live="polite">${state.lifetime}</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button id="lockBtn" type="button" aria-pressed="${state.locked ? 'true' : 'false'}"
          class="flex-1 py-2 rounded bg-wood text-white opacity-90">
          ${state.locked ? 'Locked' : 'Unlocked'}
        </button>

        <button id="resetBtn" type="button"
          class="flex-1 py-2 rounded border opacity-80 hover:opacity-100">
          Reset
        </button>
      </div>

      <div>
        <button id="stopBtn" type="button" ${canStopSession ? '' : 'disabled'}
          class="w-full py-2 rounded border opacity-80 hover:opacity-100">
          Stop After Mala
        </button>
      </div>

      <div class="flex justify-between text-xs opacity-80 gap-3">
        <button id="themeBtn" type="button" class="underline" aria-pressed="${isDark ? 'true' : 'false'}">${isDark ? 'Day Mode' : 'Night Mode'}</button>
        <button id="statsToggle" type="button" class="underline" aria-expanded="${state.statsOpen ? 'true' : 'false'}" aria-controls="statsPanel">Stats</button>
        <button id="guideBtn" type="button" class="underline">User Guide</button>
      </div>

      <div id="statsPanel"
        class="${state.statsOpen ? '' : 'hidden'} border-t pt-3 space-y-2">
        ${renderStats(stats)}
      </div>

    </div>
  `;

  wireEvents();
}

function renderGuideModal() {
  const root = document.getElementById('guideModalRoot');
  if (!root) return;

  if (!state.guideOpen) {
    root.innerHTML = '';
    return;
  }

  root.innerHTML = `
    <div id="guideOverlay" class="guide-overlay" role="dialog" aria-modal="true" aria-labelledby="guideTitle" aria-describedby="guideDesc" tabindex="-1">
      <div class="guide-card">
        <div class="flex justify-between items-start gap-3">
          <h2 id="guideTitle" class="text-lg font-semibold">How To Use Digital Mantra Japa</h2>
          <button id="closeGuideIconBtn" type="button" class="guide-close" aria-label="Close guide">Close</button>
        </div>
        <p id="guideDesc" class="text-sm opacity-80 mt-2">Quick guide for first use and daily practice.</p>

        <div class="guide-section mt-4">
          <h3 class="font-medium">Main Area</h3>
          <p class="text-sm opacity-80">Tap the center circle to count one bead. You can also focus the circle and press Enter or Space.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Counter And Mala</h3>
          <p class="text-sm opacity-80">Beads increase until your selected mala goal is reached. At completion, bead count resets to 0 and mala count increases by 1.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Buttons And Controls</h3>
          <p class="text-sm opacity-80">Mantra: choose or add custom mantra. Mala goal: 11, 21, 54, or 108. Lock: prevents accidental tap counting. Reset: clears current session beads and malas only. Stop After Mala: enabled only after completing a mala, then stops timer and closes the active session. Theme: switch day/night mode. Stats: show mantra-wise time and completed malas. User Guide: reopen this guide anytime.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Session Timer</h3>
          <p class="text-sm opacity-80">Timer starts on your first tap and records chanting duration per mantra session.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Data And Privacy</h3>
          <p class="text-sm opacity-80">Analytics is optional. Enable the checkbox below only if you want anonymous usage insights in Google Analytics.</p>
        </div>

        <label class="guide-checkbox mt-4">
          <input id="guideDismissCheckbox" type="checkbox" />
          <span>Do not show this guide on startup</span>
        </label>

        <label class="guide-checkbox mt-2">
          <input id="analyticsOptInCheckbox" type="checkbox" ${state.analyticsEnabled ? 'checked' : ''} />
          <span>Allow anonymous usage analytics (Google Analytics)</span>
        </label>

        <div class="mt-5 flex justify-end">
          <button id="closeGuideBtn" type="button" class="px-4 py-2 rounded bg-wood text-white">Start Chanting</button>
        </div>
      </div>
    </div>
  `;

  wireGuideEvents();
}

function closeGuide() {
  const shouldDismiss = document.getElementById('guideDismissCheckbox')?.checked;
  const analyticsOptIn = document.getElementById('analyticsOptInCheckbox')?.checked;

  setGuideDismissed(Boolean(shouldDismiss));
  setAnalyticsEnabled(Boolean(analyticsOptIn));

  if (analyticsOptIn) {
    initAnalytics();
  }

  state.guideOpen = false;
  trackEvent('guide_closed', {
    dismissed_on_startup: Boolean(shouldDismiss),
    analytics_enabled: Boolean(analyticsOptIn)
  });
  renderUI();

  if (lastGuideTrigger?.focus) {
    lastGuideTrigger.focus();
  }
}

function wireGuideEvents() {
  const overlay = document.getElementById('guideOverlay');
  const closeBtn = document.getElementById('closeGuideBtn');
  const closeIconBtn = document.getElementById('closeGuideIconBtn');

  if (!overlay || !closeBtn) return;

  const focusableSelector = [
    'button',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const focusables = Array.from(overlay.querySelectorAll(focusableSelector));
  const firstFocusable = focusables[0] || closeBtn;
  const lastFocusable = focusables[focusables.length - 1] || closeBtn;

  requestAnimationFrame(() => {
    firstFocusable.focus({ preventScroll: true });
  });

  closeBtn.addEventListener('click', closeGuide);
  closeIconBtn?.addEventListener('click', closeGuide);

  overlay.addEventListener('click', (event) => {
    if (event.target.id !== 'guideOverlay') return;
    closeGuide();
  });

  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeGuide();
      return;
    }

    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  });
}

function renderStats(stats) {
  if (!Object.keys(stats).length) {
    return `<div class="opacity-70">No stats yet</div>`;
  }

  return Object.entries(stats).map(([mantra, data]) => `
    <div>
      <div class="font-medium">${escapeHTML(mantra)}</div>
      <div class="text-xs opacity-80">
        Malas: ${data.malas} | Time: ${formatTime(data.timeMs)}
      </div>
    </div>
  `).join('');
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0 sec';
  }

  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds ? `${minutes} min ${seconds} sec` : `${minutes} min`;
}

function wireEvents() {
  document.getElementById('mantraSelect')
    .addEventListener('change', e => {
      stopAndRecordSession();

      if (e.target.value === '__custom') {
        const input = prompt('Enter your mantra');
        if (input !== null) {
          const { mantras, added } = addMantra(input);
          if (added) {
            state.mantra = mantras[mantras.length - 1];
            trackEvent('mantra_added', { mantra: state.mantra });
          }
        }
      } else {
        state.mantra = e.target.value;
      }

      trackEvent('mantra_changed', { mantra: state.mantra });
      persistState();
      renderUI();
    });

  document.getElementById('malaGoalSelect')
    .addEventListener('change', e => {
      stopAndRecordSession();
      state.malaGoal = Number(e.target.value);
      trackEvent('mala_goal_changed', { mala_goal: state.malaGoal });
      persistState();
      renderUI();
    });

  document.getElementById('themeBtn')
    .addEventListener('click', () => {
      toggleTheme();
      trackEvent('theme_toggled', {
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      });
      renderUI();
    });

  document.getElementById('statsToggle')
    .addEventListener('click', () => {
      state.statsOpen = !state.statsOpen;
      trackEvent('stats_toggled', { open: state.statsOpen });
      renderUI();
    });

  document.getElementById('guideBtn')
    .addEventListener('click', (event) => {
      lastGuideTrigger = event.currentTarget;
      setGuideDismissed(false);
      state.guideOpen = true;
      trackEvent('guide_opened');
      renderUI();
    });
}

