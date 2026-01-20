const STORAGE_KEY = 'mantraStats';

function getStats() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordSessionTime(mantra, ms) {
  const stats = getStats();
  stats[mantra] = stats[mantra] || { malas: 0, timeMs: 0 };
  stats[mantra].timeMs += ms;
  saveStats(stats);
}

export function recordMalaCompletion(mantra) {
  const stats = getStats();
  stats[mantra] = stats[mantra] || { malas: 0, timeMs: 0 };
  stats[mantra].malas += 1;
  saveStats(stats);
}

export function getAllStats() {
  return getStats();
}
