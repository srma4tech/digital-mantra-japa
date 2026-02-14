import { state, persistState } from './state.js';
import { renderUI } from './ui.js';
import { vibrate, playBell } from './utils.js';
import { recordMalaCompletion } from './stats.js';

export function incrementJapa(bellSound) {
  vibrate(30);

  state.beads++;
  state.lifetime++;

  if (state.beads >= state.malaGoal) {
    state.beads = 0;
    state.malas++;
    recordMalaCompletion(state.mantra);
    playBell(bellSound);
  }

  persistState();
  renderUI();
}
