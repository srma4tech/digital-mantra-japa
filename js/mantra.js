const DEFAULT_MANTRAS = [
  'Om Namah Shivaya',
  'Waheguru',
  'Hare Krishna'
];

function normalizeMantra(value) {
  return value.replace(/\s+/g, ' ').trim();
}

export function getMantras() {
  const stored = localStorage.getItem('mantras');
  if (!stored) return [...DEFAULT_MANTRAS];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...DEFAULT_MANTRAS];

    const normalized = parsed
      .filter((item) => typeof item === 'string')
      .map(normalizeMantra)
      .filter(Boolean);

    return normalized.length ? normalized : [...DEFAULT_MANTRAS];
  } catch {
    return [...DEFAULT_MANTRAS];
  }
}

export function saveMantras(mantras) {
  localStorage.setItem('mantras', JSON.stringify(mantras));
}

export function addMantra(newMantra) {
  const normalized = normalizeMantra(newMantra || '');
  if (!normalized) {
    return { mantras: getMantras(), added: false };
  }

  const mantras = getMantras();
  const exists = mantras.some((m) => m.toLowerCase() === normalized.toLowerCase());
  if (exists) {
    return { mantras, added: false };
  }

  mantras.push(normalized);
  saveMantras(mantras);
  return { mantras, added: true };
}
