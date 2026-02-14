function getNumber(key, fallback) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export const state = {
  beads: getNumber('beads', 0),
  malas: getNumber('malas', 0),
  lifetime: getNumber('lifetime', 0),

  mantra: localStorage.getItem('activeMantra') || 'Om Namah Shivaya',

  malaGoal: getNumber('malaGoal', 108) || 108,

  locked: false,
  sessionStart: null,
  sessionActive: false,
  statsOpen: false
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
