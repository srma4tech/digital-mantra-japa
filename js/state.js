export const state = {
  beads: Number(localStorage.getItem('beads')) || 0,
  malas: Number(localStorage.getItem('malas')) || 0,
  lifetime: Number(localStorage.getItem('lifetime')) || 0,

  mantra: localStorage.getItem('activeMantra') || 'Om Namah Shivaya',

  malaGoal: Number(localStorage.getItem('malaGoal')) || 108,

  locked: false,
  sessionStart: null,
  sessionActive: false
};

export function persistState() {
  localStorage.setItem('beads', state.beads);
  localStorage.setItem('malas', state.malas);
  localStorage.setItem('lifetime', state.lifetime);
  localStorage.setItem('activeMantra', state.mantra);
  localStorage.setItem('malaGoal', state.malaGoal);
}

export function resetSessionState() {
  state.beads = 0;
  state.malas = 0;
  state.sessionStart = null;
  state.sessionActive = false;
}
