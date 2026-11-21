// differences.js — where every hidden difference lives.
// One job only: the data. Each difference is a spot in panel-local pixels
// (0..560 across, 0..420 down) with a radius and a short label shown when
// the player finds it. The art in scenes.js reads the same list, so a
// difference can never drift away from the picture that hides it.
// A difference is found by clicking either panel near its spot.
export const LEVELS = [
  {
    id: 'market',
    name: 'Night Market',
    subtitle: 'Lanterns, stalls and one sleepy cat.',
    timeLimit: 150,
    diffs: [
      { x: 92, y: 58, r: 22, label: 'Lantern changed colour' },
      { x: 482, y: 62, r: 26, label: 'The moon turned full' },
      { x: 122, y: 332, r: 28, label: 'The cat vanished' },
      { x: 302, y: 112, r: 24, label: 'An awning stripe is gone' },
      { x: 456, y: 292, r: 24, label: 'One bun is missing' },
      { x: 212, y: 176, r: 26, label: 'The vendor changed hats' },
      { x: 498, y: 222, r: 22, label: 'A fish appeared' },
    ],
  },
  {
    id: 'garden',
    name: 'Garden Pond',
    subtitle: 'Lily pads, ducks and a very busy tree.',
    timeLimit: 120,
    diffs: [
      { x: 182, y: 312, r: 24, label: 'The frog hopped away' },
      { x: 382, y: 122, r: 22, label: 'The butterfly flew off' },
      { x: 92, y: 366, r: 20, label: 'A flower changed colour' },
      { x: 422, y: 332, r: 22, label: 'A duckling is missing' },
      { x: 122, y: 112, r: 20, label: 'An apple fell off the tree' },
      { x: 302, y: 262, r: 24, label: 'The bench lost a slat' },
      { x: 252, y: 62, r: 24, label: 'A cloud drifted in' },
    ],
  },
  {
    id: 'harbour',
    name: 'Harbour at Dawn',
    subtitle: 'Boats, gulls and a lighthouse that blinks.',
    timeLimit: 100,
    diffs: [
      { x: 210, y: 105, r: 28, label: 'The lighthouse beam went out' },
      { x: 396, y: 161, r: 20, label: 'The boat flag changed colour' },
      { x: 302, y: 72, r: 20, label: 'A gull flew away' },
      { x: 482, y: 322, r: 22, label: 'A fish jumped out' },
      { x: 182, y: 352, r: 24, label: 'A crate went missing' },
      { x: 97, y: 212, r: 16, label: 'The lighthouse window went dark' },
      { x: 502, y: 352, r: 20, label: 'An anchor appeared' },
    ],
  },
];

// Look-ups the game and the scenes share.
export function levelByIndex(index) {
  return LEVELS[index] ?? LEVELS[0];
}
export function diffCount(levelIndex) {
  return levelByIndex(levelIndex).diffs.length;
}
// Find the first unfound difference near a click, or null. The click may
// land on either panel; both panels share the same local coordinates.
export function diffNear(levelIndex, localX, localY, found) {
  const level = levelByIndex(levelIndex);
  for (let i = 0; i < level.diffs.length; i++) {
    if (found.has(i)) continue;
    const d = level.diffs[i];
    const dx = localX - d.x;
    const dy = localY - d.y;
    const reach = d.r + 12;
    if (dx * dx + dy * dy <= reach * reach) return i;
  }
  return null;
}
export function randomUnfoundDiff(levelIndex, found) {
  const level = levelByIndex(levelIndex);
  const open = level.diffs.map((d, i) => i).filter((i) => !found.has(i));
  if (open.length === 0) return null;
  return open[Math.floor(Math.random() * open.length)];
}
