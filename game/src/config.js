// config.js — the fixed numbers for Twin Lanterns: Spot the Difference.
// One job only: constants and level timing. No drawing, no input, no state.
export const CANVAS_WIDTH = 1240;
export const CANVAS_HEIGHT = 760;

// The two picture panels, in canvas pixels. Both panels are the same size so
// a difference sits at the same local (x, y) in each one.
export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 420;
export const PANEL_Y = 112;
export const LEFT_PANEL_X = 24;
export const RIGHT_PANEL_X = 656;

// Colours for the frame, the HUD and the markers.
export const COLOURS = {
  page: '#1b1430',
  frame: '#f7ead1',
  frameDark: '#c9a86a',
  hudText: '#ffe9b8',
  muted: '#b9a8d9',
  accent: '#ffb347',
  found: '#3ddc84',
  foundDark: '#0f7a3d',
  miss: '#ff5d5d',
  hint: '#ffd23f',
  timerGood: '#3ddc84',
  timerLow: '#ff5d5d',
};

// How the hunt is scored and timed.
export const SCORE_PER_FIND = 100;
export const HINTS_PER_LEVEL = 3;
export const HINT_TIME_COST_SECONDS = 5;
export const MISS_TIME_COST_SECONDS = 2;
export const LEVEL_TIME_LIMITS = [150, 120, 100];

// Level names in play order. The art and the differences live elsewhere.
export const LEVEL_NAMES = [
  'Night Market',
  'Garden Pond',
  'Harbour at Dawn',
];
export const LEVEL_SUBTITLES = [
  'Lanterns, stalls and one sleepy cat.',
  'Lily pads, ducks and a very busy tree.',
  'Boats, gulls and a lighthouse that blinks.',
];

// Small helpers derived from the constants above, kept here so the rest of
// the game never hard-codes a panel position twice.
export function panelOrigin(side) {
  return side === 'right'
    ? { x: RIGHT_PANEL_X, y: PANEL_Y }
    : { x: LEFT_PANEL_X, y: PANEL_Y };
}
export function levelTimeLimit(levelIndex) {
  return LEVEL_TIME_LIMITS[levelIndex] ?? 120;
}
export function levelName(levelIndex) {
  return LEVEL_NAMES[levelIndex] ?? 'Mystery Scene';
}
