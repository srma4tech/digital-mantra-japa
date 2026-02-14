import { state, persistState } from './state.js';
import { renderUI } from './ui.js';
import { vibrate, playBell } from './utils.js';
import { recordMalaCompletion } from './stats.js';
import { trackEvent } from './analytics.js';

export function incrementJapa(bellSound) {
  if (state.locked) return;

  vibrate(30);

  state.beads++;
  state.lifetime++;

  if (state.beads >= state.malaGoal) {
    state.beads = 0;
    state.malas++;
    recordMalaCompletion(state.mantra);
    playBell(bellSound);

    trackEvent('mala_completed', {
      mantra: state.mantra,
      mala_goal: state.malaGoal,
      total_malas: state.malas
    });
  }

  persistState();
  renderUI();
}
