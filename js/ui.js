/**
 * ui.js
 * -------------------------------------------------
 * UI rendering only
 * No business logic
 */

import { state, persistState, setGuideDismissed } from './state.js';
import { getMantras, addMantra } from './mantra.js';
import { getAllStats } from './stats.js';
import { toggleTheme } from './utils.js';
import { stopAndRecordSession } from './timer.js';

/* =================================================
   CIRCLE GEOMETRY (LOCKED)
================================================= */

const VIEWBOX = 240;
const RADIUS = 104;
const STROKE = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/* =================================================
   PUBLIC RENDER
================================================= */

export function renderUI() {
  renderTapArea();
  renderControls();
  renderGuideModal();
}

/* =================================================
   TAP AREA (PROGRESS CIRCLE)
================================================= */

function renderTapArea() {
  const progress =
    CIRCUMFERENCE -
    (state.beads / state.malaGoal) * CIRCUMFERENCE;

  document.getElementById('tapArea').innerHTML = `
    <div
      class="
        relative
        w-[70vw] h-[70vw]
        max-w-[360px] max-h-[360px]
        min-w-[260px] min-h-[260px]
      "
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

      <div
        class="
          absolute inset-0
          flex flex-col
          items-center justify-center
          text-center
          px-4
        "
      >
        <div class="text-5xl sm:text-6xl font-semibold">
          ${state.beads}
        </div>

        <div class="text-xs opacity-60 mt-1">
          of ${state.malaGoal}
        </div>

        <div class="mt-4 text-base font-medium tracking-wide">
          ${escapeHTML(state.mantra)}
        </div>

        <div class="mt-2 text-xs opacity-50 tracking-wide">
          Mala ${state.malas}
        </div>
      </div>
    </div>
  `;
}

/* =================================================
   CONTROLS
================================================= */

function renderControls() {
  const mantras = getMantras();
  const stats = getAllStats();
  const isDark = document.documentElement.classList.contains('dark');

  document.getElementById('controls').innerHTML = `
    <div class="space-y-4 text-sm opacity-90">

      <select id="mantraSelect" class="w-full p-2 rounded border" >
        ${mantras.map(m =>
          `<option ${m === state.mantra ? 'selected' : ''}>${escapeHTML(m)}</option>`
        ).join('')}
        <option value="__custom">+ Add Custom Mantra</option>
      </select>

      <select id="malaGoalSelect" class="w-full p-2 rounded border" >
        ${[11, 21, 54, 108].map(n =>
          `<option ${n === state.malaGoal ? 'selected' : ''}>${n} beads</option>`
        ).join('')}
      </select>

      <div class="flex justify-between opacity-80">
        <span>Lifetime Japa</span>
        <span>${state.lifetime}</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button id="lockBtn"
          class="flex-1 py-2 rounded bg-wood text-white opacity-90">
          ${state.locked ? 'Locked' : 'Unlocked'}
        </button>

        <button id="resetBtn"
          class="flex-1 py-2 rounded border opacity-60 hover:opacity-90"
          >
          Reset
        </button>
      </div>

      <div class="flex justify-between text-xs opacity-70 gap-3">
        <button id="themeBtn" class="underline">${isDark ? 'Day Mode' : 'Night Mode'}</button>
        <button id="statsToggle" class="underline">Stats</button>
        <button id="guideBtn" class="underline">User Guide</button>
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
    <div id="guideOverlay" class="guide-overlay" role="dialog" aria-modal="true" aria-labelledby="guideTitle" tabindex="-1">
      <div class="guide-card">
        <h2 id="guideTitle" class="text-lg font-semibold">How To Use Digital Mantra Japa</h2>
        <p class="text-sm opacity-80 mt-2">Quick guide for first use and daily practice.</p>

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
          <p class="text-sm opacity-80">Mantra: choose or add custom mantra. Mala goal: 11, 21, 54, or 108. Lock: prevents accidental tap counting. Reset: clears current session beads and malas only. Theme: switch day/night mode. Stats: show mantra-wise time and completed malas. User Guide: reopen this guide anytime.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Session Timer</h3>
          <p class="text-sm opacity-80">Timer starts on your first tap and records chanting duration per mantra session.</p>
        </div>

        <div class="guide-section mt-3">
          <h3 class="font-medium">Data And Privacy</h3>
          <p class="text-sm opacity-80">All data stays in your browser local storage. No sign-in, no cloud sync.</p>
        </div>

        <label class="guide-checkbox mt-4">
          <input id="guideDismissCheckbox" type="checkbox" />
          <span>Do not show this guide on startup</span>
        </label>

        <div class="mt-5 flex justify-end">
          <button id="closeGuideBtn" class="px-4 py-2 rounded bg-wood text-white">Start Chanting</button>
        </div>
      </div>
    </div>
  `;

  wireGuideEvents();
}

function closeGuide() {
  const shouldDismiss = document.getElementById('guideDismissCheckbox')?.checked;
  setGuideDismissed(Boolean(shouldDismiss));
  state.guideOpen = false;
  renderUI();
}

function wireGuideEvents() {
  const overlay = document.getElementById('guideOverlay');
  const closeBtn = document.getElementById('closeGuideBtn');

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

  firstFocusable.focus();

  closeBtn.addEventListener('click', closeGuide);

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

/* =================================================
   STATS
================================================= */

function renderStats(stats) {
  if (!Object.keys(stats).length) {
    return `<div class="opacity-60">No stats yet</div>`;
  }

  return Object.entries(stats).map(([mantra, data]) => `
    <div>
      <div class="font-medium">${escapeHTML(mantra)}</div>
      <div class="text-xs opacity-70">
        Malas: ${data.malas} | Time: ${formatTime(data.timeMs)}
      </div>
    </div>
  `).join('');
}

function formatTime(ms) {
  if (ms < 60000) {
    return `${Math.max(1, Math.floor(ms / 1000))} sec`;
  }
  return `${Math.floor(ms / 60000)} min`;
}

/* =================================================
   EVENTS
================================================= */

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
          }
        }
      } else {
        state.mantra = e.target.value;
      }

      persistState();
      renderUI();
    });

  document.getElementById('malaGoalSelect')
    .addEventListener('change', e => {
      stopAndRecordSession();
      state.malaGoal = Number(e.target.value);
      persistState();
      renderUI();
    });

  document.getElementById('themeBtn')
    .addEventListener('click', () => {
      toggleTheme();
      renderUI();
    });

  document.getElementById('statsToggle')
    .addEventListener('click', () => {
      state.statsOpen = !state.statsOpen;
      renderUI();
    });

  document.getElementById('guideBtn')
    .addEventListener('click', () => {
      setGuideDismissed(false);
      state.guideOpen = true;
      renderUI();
    });
}

