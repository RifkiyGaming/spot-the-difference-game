// main.js — the entry point the page loads.
// One job only: wire the canvas, the game, the input and the renderer
// together and run the frame loop. All rules live in game.js, all art in
// scenes.js, all painting in render.js.
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { SpotGame } from './game.js';
import { render } from './render.js';
import { attachInput } from './input.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');

const game = new SpotGame();
attachInput(canvas, game);

// Exposed for play-testing: a test harness can read the state and drive
// the same clicks a player makes, without touching the game's rules.
window.__game = game;
window.__startLevel = (index) => game.startLevel(index);

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  game.update(dt);
  render(ctx, game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// The menu is the first thing the player sees; the loop above paints it
// until Enter, a click on PLAY, or keys 1-3 start a level.
document.addEventListener('visibilitychange', () => {
  // Keep the frame clock honest when the tab was hidden.
  last = performance.now();
});
