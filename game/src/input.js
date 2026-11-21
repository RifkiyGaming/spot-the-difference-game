// input.js — mouse and keyboard, translated into game actions.
// One job only: listen on the canvas and the keyboard, work out which panel
// (if any) a click landed in, and hand the game a clean action. It never
// changes score, timer or found sets itself.
import { PANEL_WIDTH, PANEL_HEIGHT, PANEL_Y, LEFT_PANEL_X, RIGHT_PANEL_X } from './config.js';

function panelAt(canvasX, canvasY) {
  if (canvasY < PANEL_Y || canvasY > PANEL_Y + PANEL_HEIGHT) return null;
  if (canvasX >= LEFT_PANEL_X && canvasX <= LEFT_PANEL_X + PANEL_WIDTH) {
    return { side: 'left', x: canvasX - LEFT_PANEL_X, y: canvasY - PANEL_Y };
  }
  if (canvasX >= RIGHT_PANEL_X && canvasX <= RIGHT_PANEL_X + PANEL_WIDTH) {
    return { side: 'right', x: canvasX - RIGHT_PANEL_X, y: canvasY - PANEL_Y };
  }
  return null;
}
function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}
export function attachInput(canvas, game) {
  canvas.addEventListener('click', (event) => {
    const point = canvasPoint(canvas, event);
    const panel = panelAt(point.x, point.y);
    if (panel) game.handlePanelClick(panel.side, panel.x, panel.y);
    else game.handleFrameClick(point.x, point.y);
  });
  canvas.addEventListener('mousemove', (event) => {
    const point = canvasPoint(canvas, event);
    game.handleHover(point.x, point.y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') game.useHint();
    else if (key === 'm') game.showMenu();
    else if (key === 'r') game.restartLevel();
    else if (key === 'enter' || key === ' ') game.confirm();
    else if (key === '1' || key === '2' || key === '3') game.chooseLevel(Number(key) - 1);
    else if (key === 'escape') game.showMenu();
  });
}
