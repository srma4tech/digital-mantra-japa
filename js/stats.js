const STORAGE_KEY = 'mantraStats';

function getStats() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
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
