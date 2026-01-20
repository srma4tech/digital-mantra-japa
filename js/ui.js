/**
 * ui.js
 * -------------------------------------------------
 * Responsible ONLY for rendering UI
 * No business logic, no timers, no counters
 */

import { state, persistState } from './state.js';
import { getMantras, addMantra } from './mantra.js';
import { getAllStats } from './stats.js';
import { toggleTheme } from './utils.js';
import { stopAndRecordSession } from './timer.js';

/* =================================================
   CIRCLE GEOMETRY (SINGLE SOURCE OF TRUTH)
================================================= */

const RADIUS = 104;
const STROKE = 12;
const VIEWBOX = 240;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/* =================================================
   PUBLIC RENDER
================================================= */

export function renderUI() {
  renderTapArea();
  renderControls();
}

/* =================================================
   TAP AREA (CIRCLE)
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
      <!-- Progress Ring -->
      <svg
        viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"
        class="w-full h-full -rotate-90"
        aria-hidden="true"
      >
        <!-- Track -->
        <circle
          cx="${VIEWBOX / 2}"
          cy="${VIEWBOX / 2}"
          r="${RADIUS}"
          stroke="var(--ring-track)"
          stroke-width="${STROKE}"
          fill="none"
        />

        <!-- Progress -->
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

      <!-- Center Content -->
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
          ${state.mantra}
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

  document.getElementById('controls').innerHTML = `
    <div class="space-y-4 text-sm opacity-90">

      <!-- Mantra -->
      <select id="mantraSelect"
        class="w-full p-2 rounded border">
        ${mantras.map(m =>
          `<option ${m === state.mantra ? 'selected' : ''}>${m}</option>`
        ).join('')}
        <option value="__custom">+ Add Custom Mantra</option>
      </select>

      <!-- Mala Goal -->
      <select id="malaGoalSelect"
        class="w-full p-2 rounded border">
        ${[11, 21, 54, 108].map(n =>
          `<option ${n === state.malaGoal ? 'selected' : ''}>
            ${n} beads
          </option>`
        ).join('')}
      </select>

      <!-- Lifetime -->
      <div class="flex justify-between opacity-80">
        <span>Lifetime Japa</span>
        <span>${state.lifetime}</span>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button id="lockBtn"
          class="flex-1 py-2 rounded bg-wood text-white opacity-90">
          ${state.locked ? '🔒 Locked' : '🔓 Unlocked'}
        </button>

        <button id="resetBtn"
          class="flex-1 py-2 rounded border opacity-60 hover:opacity-90">
          Reset
        </button>
      </div>

      <!-- Utilities -->
      <div class="flex justify-between text-xs opacity-70">
        <button id="themeBtn" class="underline">Night Mode</button>
        <button id="statsToggle" class="underline">Stats</button>
      </div>

      <!-- Stats -->
      <div id="statsPanel"
        class="hidden border-t pt-3 space-y-2">
        ${renderStats(stats)}
      </div>

    </div>
  `;

  wireEvents();
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
      <div class="font-medium">${mantra}</div>
      <div class="text-xs opacity-70">
        Malas: ${data.malas} · Time: ${formatTime(data.timeMs)}
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
        if (input) {
          addMantra(input.trim());
          state.mantra = input.trim();
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
    .addEventListener('click', toggleTheme);

  document.getElementById('statsToggle')
    .addEventListener('click', () => {
      document.getElementById('statsPanel')
        .classList.toggle('hidden');
    });
}
