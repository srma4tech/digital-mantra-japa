function getNumber(key, fallback) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

const guideDismissed = localStorage.getItem('guideDismissed') === 'true';

export const state = {
  beads: getNumber('beads', 0),
  malas: getNumber('malas', 0),
  lifetime: getNumber('lifetime', 0),

  mantra: localStorage.getItem('activeMantra') || 'Om Namah Shivaya',

  malaGoal: getNumber('malaGoal', 108) || 108,

  locked: false,
  sessionStart: null,
  sessionActive: false,
  statsOpen: false,
  guideOpen: !guideDismissed,
  analyticsEnabled: localStorage.getItem('analyticsEnabled') === 'true'
};

export function clearSessionProgressFromStorage() {
  localStorage.removeItem('beads');
  localStorage.removeItem('malas');
}

export function persistState() {
  localStorage.setItem('beads', state.beads);
  localStorage.setItem('malas', state.malas);
  localStorage.setItem('lifetime', state.lifetime);
  localStorage.setItem('activeMantra', state.mantra);
  localStorage.setItem('malaGoal', state.malaGoal);
}

export function setGuideDismissed(value) {
  localStorage.setItem('guideDismissed', value ? 'true' : 'false');
}

export function setAnalyticsEnabled(value) {
  const enabled = Boolean(value);
  state.analyticsEnabled = enabled;
  localStorage.setItem('analyticsEnabled', enabled ? 'true' : 'false');
}

export function resetSessionState() {
  state.beads = 0;
  state.malas = 0;
  state.sessionStart = null;
  state.sessionActive = false;
  clearSessionProgressFromStorage();
}
