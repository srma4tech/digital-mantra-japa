import { state, persistState } from './state.js';
import { renderUI } from './ui.js';
import { vibrate } from './utils.js';
import { recordMalaCompletion } from './stats.js';

export function incrementJapa(bellSound) {
  if (state.locked) return;

  vibrate(30);

  state.beads++;
  state.lifetime++;

  if (state.beads === state.malaGoal) {
    state.beads = 0;
    state.malas++;
    recordMalaCompletion(state.mantra);
    bellSound.play();
  }

  persistState();
  renderUI();
}
