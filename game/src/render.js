// render.js — everything the player sees, drawn each frame.
// One job only: paint. It reads the game's state and the scenes, and never
// changes a rule. Markers, the timer bar, the HUD and the menu screens live here.
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT, PANEL_Y,
  LEFT_PANEL_X, RIGHT_PANEL_X, COLOURS,
} from './config.js';
import { drawScene } from './scenes.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function drawPanelFrame(ctx, x) {
  ctx.fillStyle = COLOURS.frame;
  roundRect(ctx, x - 6, PANEL_Y - 6, PANEL_WIDTH + 12, PANEL_HEIGHT + 12, 12);
  ctx.fill();
  ctx.strokeStyle = COLOURS.frameDark;
  ctx.lineWidth = 2;
  ctx.stroke();
}
function drawFoundMarker(ctx, originX, d, age) {
  const x = originX + d.x;
  const y = PANEL_Y + d.y;
  const pop = age < 180 ? 0.6 + (age / 180) * 0.5 : 1.1 - Math.min(0.1, (age - 180) / 4000);
  const r = Math.max(10, d.r) * pop;
  ctx.strokeStyle = COLOURS.found;
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = COLOURS.foundDark;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.stroke();
  // The tick inside the ring.
  ctx.strokeStyle = COLOURS.found;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.12, y + r * 0.38);
  ctx.lineTo(x + r * 0.5, y - r * 0.38);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawHud(ctx, game) {
  ctx.fillStyle = COLOURS.hudText;
  ctx.textAlign = 'left';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('🔎 Twin Lanterns', 24, 36);
  ctx.font = '15px sans-serif';
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText('Spot the Difference  •  Level ' + (game.levelIndex + 1) + ' of 3 — ' + game.level.name, 24, 58);
  // Counter of differences remaining — big, on the right of the title.
  ctx.textAlign = 'right';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = COLOURS.hudText;
  ctx.fillText(`Found ${game.found.size} / ${game.totalDiffs}  •  ${game.remaining} left`, 990, 36);
  ctx.font = '15px sans-serif';
  ctx.fillStyle = COLOURS.muted;
  ctx.fillText(`Score ${game.score}   •   Hints ${game.hintsLeft}`, 990, 58);
  // Timer bar across the top of the play area.
  const limit = game.level.timeLimit;
  const frac = Math.max(0, game.timeLeft / limit);
  ctx.fillStyle = '#3a2a55';
  roundRect(ctx, 24, 66, 700, 16, 8); ctx.fill();
  ctx.fillStyle = frac < 0.25 ? COLOURS.timerLow : COLOURS.timerGood;
  if (frac > 0) { roundRect(ctx, 24, 66, 700 * frac, 16, 8); ctx.fill(); }
  ctx.fillStyle = COLOURS.hudText;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('⏱ ' + formatTime(game.timeLeft), 736, 80);
  // Buttons (positions must match game.handleFrameClick).
  ctx.fillStyle = '#ffb347';
  roundRect(ctx, 1010, 66, 100, 32, 8); ctx.fill();
  ctx.fillStyle = '#1b1430';
  ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('💡 Hint (H)', 1060, 87);
  ctx.fillStyle = '#3a2a55';
  roundRect(ctx, 1120, 66, 96, 32, 8); ctx.fill();
  ctx.strokeStyle = COLOURS.frameDark; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = COLOURS.hudText;
  ctx.fillText('Menu (M)', 1168, 87);
}
function drawBottomBar(ctx, game) {
  ctx.fillStyle = COLOURS.muted;
  ctx.font = '15px sans-serif';
  ctx.textAlign = 'left';
  const msg = game.now > game.messageUntil && game.screen === 'play'
    ? `Find ${game.remaining} more difference${game.remaining === 1 ? '' : 's'}.`
    : game.message;
  ctx.fillText(msg, 24, 580);
  ctx.textAlign = 'right';
  ctx.fillText('Click a difference in either picture  •  H hint  •  R restart  •  M menu', 1216, 580);
  // Level dots.
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < game.levelIndex ? COLOURS.found : (i === game.levelIndex ? COLOURS.accent : '#3a2a55');
    ctx.beginPath(); ctx.arc(560 + i * 26, 574, 7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = COLOURS.muted;
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Twin Lanterns — original art drawn in code. No two pictures are quite the same.', 620, 612);
}

function drawPlay(ctx, game) {
  drawHud(ctx, game);
  drawPanelFrame(ctx, LEFT_PANEL_X);
  drawPanelFrame(ctx, RIGHT_PANEL_X);
  drawScene(ctx, game.level.id, false, LEFT_PANEL_X, PANEL_Y);
  drawScene(ctx, game.level.id, true, RIGHT_PANEL_X, PANEL_Y);
  // Labels under each panel.
  ctx.fillStyle = COLOURS.hudText;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PICTURE A', LEFT_PANEL_X + PANEL_WIDTH / 2, PANEL_Y + PANEL_HEIGHT + 22);
  ctx.fillText('PICTURE B', RIGHT_PANEL_X + PANEL_WIDTH / 2, PANEL_Y + PANEL_HEIGHT + 22);
  // Found markers, one ring on each panel.
  game.level.diffs.forEach((d, i) => {
    if (!game.found.has(i)) return;
    const marker = game.markers.find((m) => m.side === 'left');
    drawFoundMarker(ctx, LEFT_PANEL_X, d, 1000);
    drawFoundMarker(ctx, RIGHT_PANEL_X, d, 1000);
    void marker;
  });
  // Expanding rings for the newest find.
  game.markers.forEach((m) => {
    const originX = m.side === 'right' ? RIGHT_PANEL_X : LEFT_PANEL_X;
    const age = game.now - m.born;
    const r = 10 + (age / 900) * 26;
    ctx.strokeStyle = `rgba(61,220,132,${1 - age / 900})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(originX + m.x, PANEL_Y + m.y, r, 0, Math.PI * 2); ctx.stroke();
  });
  // Miss crosses that fade.
  game.misses.forEach((m) => {
    const originX = m.side === 'right' ? RIGHT_PANEL_X : LEFT_PANEL_X;
    const age = game.now - m.born;
    const a = 1 - age / 800;
    ctx.strokeStyle = `rgba(255,93,93,${a})`;
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    const x = originX + m.x, y = PANEL_Y + m.y;
    ctx.beginPath(); ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y + 10); ctx.moveTo(x + 10, y - 10); ctx.lineTo(x - 10, y + 10); ctx.stroke();
    ctx.lineCap = 'butt';
  });
  // Hint pulse.
  if (game.hintSpot) {
    const d = game.level.diffs[game.hintSpot.index];
    const pulse = 1 + 0.18 * Math.sin(game.now / 130);
    [LEFT_PANEL_X, RIGHT_PANEL_X].forEach((originX) => {
      ctx.strokeStyle = COLOURS.hint;
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.arc(originX + d.x, PANEL_Y + d.y, d.r * pulse + 6, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    });
  }
  drawBottomBar(ctx, game);
}
function drawOverlay(ctx, title, lines, button) {
  ctx.fillStyle = 'rgba(20,12,40,0.82)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#2a1e4d';
  roundRect(ctx, 320, 170, 600, 380, 18); ctx.fill();
  ctx.strokeStyle = COLOURS.frameDark; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = COLOURS.hudText;
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(title, 620, 240);
  ctx.font = '17px sans-serif';
  ctx.fillStyle = COLOURS.muted;
  lines.forEach((line, i) => ctx.fillText(line, 620, 288 + i * 30));
  ctx.fillStyle = '#ffb347';
  roundRect(ctx, 470, 460, 300, 48, 10); ctx.fill();
  ctx.fillStyle = '#1b1430';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(button, 620, 490);
}

function drawMenu(ctx, game) {
  ctx.fillStyle = '#1b1430';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // A preview of the first scene, drawn small behind the title card.
  drawScene(ctx, 'market', false, 90, 120);
  drawScene(ctx, 'market', true, 590, 120);
  ctx.fillStyle = 'rgba(20,12,40,0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe9b8';
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('🔎 Twin Lanterns', 620, 130);
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#ffb347';
  ctx.fillText('SPOT THE DIFFERENCE', 620, 168);
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#d9cdf0';
  ctx.fillText('Two pictures. Seven differences. One sharp pair of eyes.', 620, 208);
  ctx.fillText('Click a difference in either picture — a green ring marks every find.', 620, 238);
  const levels = ['1 — Night Market  •  150s', '2 — Garden Pond  •  120s', '3 — Harbour at Dawn  •  100s'];
  levels.forEach((label, i) => {
    ctx.fillStyle = '#2a1e4d';
    roundRect(ctx, 420, 280 + i * 62, 400, 48, 10); ctx.fill();
    ctx.strokeStyle = '#c9a86a'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#ffe9b8';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(label, 620, 310 + i * 62);
  });
  ctx.fillStyle = '#ffb347';
  roundRect(ctx, 470, 490, 300, 52, 10); ctx.fill();
  ctx.fillStyle = '#1b1430';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('▶  PLAY  (Enter)', 620, 523);
  ctx.fillStyle = '#b9a8d9';
  ctx.font = '15px sans-serif';
  ctx.fillText('Press 1, 2 or 3 to jump to a level  •  H hint  •  R restart  •  M menu', 620, 580);
  ctx.fillText('Original art drawn in code — night market, garden pond and harbour at dawn.', 620, 606);
}
export function render(ctx, game) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#1b1430';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (game.screen === 'menu') { drawMenu(ctx, game); return; }
  if (game.screen === 'play' || game.screen === 'levelDone' || game.screen === 'timeUp') drawPlay(ctx, game);
  if (game.screen === 'levelDone') {
    const last = game.levelIndex + 1 >= 3;
    drawOverlay(ctx, 'Level Clear! 🎉', [
      `${game.level.name} — all ${game.totalDiffs} differences found.`,
      `Score: ${game.score}`,
      last ? 'That was the last level — see your final score!' : 'Next up: ' + (game.levelIndex + 2 === 2 ? 'Garden Pond' : 'Harbour at Dawn'),
    ], last ? 'See Final Score (Enter)' : 'Next Level (Enter)');
  }
  if (game.screen === 'gameDone') {
    drawOverlay(ctx, 'You Found Them All! 🏆', [
      'All three scenes cleared. Sharp eyes!',
      `Final score: ${game.score}`,
      'Play again from the menu to beat it.',
    ], 'Back to Menu (Enter)');
  }
  if (game.screen === 'timeUp') {
    drawOverlay(ctx, "Time's Up! ⏱", [
      `${game.level.name} — you found ${game.found.size} of ${game.totalDiffs} differences.`,
      `Score: ${game.score}`,
      'The differences are still out there. Try again!',
    ], 'Back to Menu (Enter)');
  }
}
