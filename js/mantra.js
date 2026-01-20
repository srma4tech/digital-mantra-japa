const DEFAULT_MANTRAS = [
  'Om Namah Shivaya',
  'Waheguru',
  'Hare Krishna'
];

export function getMantras() {
  const stored = localStorage.getItem('mantras');
  return stored ? JSON.parse(stored) : DEFAULT_MANTRAS;
}

export function saveMantras(mantras) {
  localStorage.setItem('mantras', JSON.stringify(mantras));
}

export function addMantra(newMantra) {
  const mantras = getMantras();
  mantras.push(newMantra);
  saveMantras(mantras);
  return mantras;
}
