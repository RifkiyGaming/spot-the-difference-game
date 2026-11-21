// scenes.js — all of the game's own art, drawn in code.
// One job only: paint one panel of one level. drawScene(ctx, levelId,
// isRight, ox, oy) draws the left picture when isRight is false and the
// right picture when it is true. The two pictures share every line except
// the seven deliberate differences, which the code branches on.
// Nothing here knows about score, timer or input; it only draws.
import { PANEL_WIDTH, PANEL_HEIGHT } from './config.js';

function circle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
}
function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_HEIGHT);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
}
function starField(ctx, seed) {
  ctx.fillStyle = '#ffffff';
  let s = seed;
  for (let i = 0; i < 40; i++) {
    s = (s * 16807) % 2147483647;
    const x = (s % 540) + 10;
    s = (s * 16807) % 2147483647;
    const y = (s % 180) + 8;
    ctx.globalAlpha = 0.35 + ((s % 60) / 100);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// ---- Level 1: Night Market --------------------------------------------
function drawMarket(ctx, isRight) {
  sky(ctx, '#2a1745', '#ff9a5c');
  starField(ctx, 12345);
  // Moon: a crescent on the left picture, a full moon on the right.
  circle(ctx, 482, 62, 24, '#fff3c4');
  if (!isRight) circle(ctx, 492, 56, 20, '#2a1745');
  // Distant rooftops.
  ctx.fillStyle = '#1c1030';
  ctx.beginPath();
  ctx.moveTo(0, 300); ctx.lineTo(70, 250); ctx.lineTo(140, 300);
  ctx.lineTo(210, 240); ctx.lineTo(290, 300); ctx.lineTo(360, 255);
  ctx.lineTo(430, 300); ctx.lineTo(500, 250); ctx.lineTo(560, 300);
  ctx.lineTo(560, 420); ctx.lineTo(0, 420); ctx.closePath(); ctx.fill();
  // Cobble ground.
  rect(ctx, 0, 300, 560, 120, '#5a4632');
  ctx.fillStyle = '#6b563e';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) {
    ctx.fillRect(8 + c * 62 + (r % 2) * 20, 312 + r * 26, 48, 18);
  }
  // String of lanterns across the top.
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 34); ctx.quadraticCurveTo(280, 58, 560, 34); ctx.stroke();
  const lanternXs = [92, 180, 270, 360, 450, 520];
  lanternXs.forEach((x, i) => {
    const y = 44 + Math.sin((x / 560) * Math.PI) * 14;
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, 36); ctx.lineTo(x, y - 12); ctx.stroke();
    // The first lantern is a difference: red on the left, teal on the right.
    const colour = (i === 0)
      ? (isRight ? '#2ec4b6' : '#ff4d4d')
      : ['#ffb347', '#ff6b9d', '#ffd23f', '#ff8c42', '#c084fc'][i % 5];
    ellipse(ctx, x, y, 15, 17, colour);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(x - 3, y - 12, 6, 5);
  });
  // Right stall awning: one stripe is missing on the right picture.
  for (let i = 0; i < 6; i++) {
    const x = 292 + i * 40;
    if (isRight && i === 0) { rect(ctx, x, 92, 40, 30, '#f7ead1'); continue; }
    rect(ctx, x, 92, 40, 30, i % 2 ? '#f7ead1' : '#d94f3d');
  }
  rect(ctx, 292, 122, 240, 8, '#8a5a2b');
  // Left stall awning.
  for (let i = 0; i < 6; i++) rect(ctx, 28 + i * 40, 92, 40, 30, i % 2 ? '#f7ead1' : '#3a7bd5');
  rect(ctx, 28, 122, 240, 8, '#8a5a2b');
  // Vendor behind the left stall.
  rect(ctx, 188, 210, 48, 90, '#4a7c59');
  circle(ctx, 212, 186, 22, '#f2c89b');
  ctx.fillStyle = '#2b2b2b';
  ctx.beginPath(); ctx.arc(202, 182, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(222, 182, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(212, 190, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  // The vendor's hat is a difference: straw on the left, blue on the right.
  ctx.fillStyle = isRight ? '#3a7bd5' : '#e8c85a';
  ctx.beginPath(); ctx.ellipse(212, 168, 34, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(212, 166, 16, Math.PI, 0); ctx.fill();
  // Stall counters with jars and buns.
  rect(ctx, 28, 300, 240, 14, '#8a5a2b');
  rect(ctx, 292, 300, 240, 14, '#8a5a2b');
  circle(ctx, 70, 286, 12, '#e07a5f'); circle(ctx, 100, 286, 12, '#81b29a');
  circle(ctx, 130, 286, 12, '#f2cc8f');
  // Buns on the right stall: three on the left picture, two on the right.
  circle(ctx, 400, 292, 12, '#e8b06a'); circle(ctx, 428, 292, 12, '#e8b06a');
  if (!isRight) circle(ctx, 456, 292, 12, '#e8b06a');
  circle(ctx, 400, 288, 3, '#7a4a21'); circle(ctx, 428, 288, 3, '#7a4a21');
  // A fish hanging at the right stall appears only on the right picture.
  if (isRight) {
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(498, 130); ctx.lineTo(498, 200); ctx.stroke();
    ellipse(ctx, 498, 222, 12, 22, '#7fb3d5');
    ctx.beginPath(); ctx.moveTo(486, 222); ctx.lineTo(474, 212); ctx.lineTo(474, 232); ctx.closePath();
    ctx.fillStyle = '#7fb3d5'; ctx.fill();
    circle(ctx, 506, 216, 2, '#1b1430');
  }
  // Crate with the sleepy cat: the cat is only on the left picture.
  rect(ctx, 88, 352, 70, 44, '#a67c52');
  ctx.strokeStyle = '#7a4a21'; ctx.lineWidth = 3;
  ctx.strokeRect(88, 352, 70, 44);
  ctx.beginPath(); ctx.moveTo(88, 374); ctx.lineTo(158, 374); ctx.stroke();
  if (!isRight) {
    ellipse(ctx, 122, 340, 26, 16, '#f4a259');
    circle(ctx, 142, 326, 12, '#f4a259');
    ctx.beginPath(); ctx.moveTo(134, 316); ctx.lineTo(136, 306); ctx.lineTo(142, 315); ctx.closePath();
    ctx.fillStyle = '#f4a259'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(146, 315); ctx.lineTo(150, 306); ctx.lineTo(154, 316); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e07a5f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(98, 348); ctx.quadraticCurveTo(84, 340, 92, 328); ctx.stroke();
  }
  // Paper sign on the left stall.
  rect(ctx, 300, 180, 90, 56, '#f7ead1');
  ctx.fillStyle = '#d94f3d'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('PASAR', 345, 206);
  ctx.fillStyle = '#333'; ctx.font = '14px sans-serif';
  ctx.fillText('★ ★ ★', 345, 228);
}

// ---- Level 2: Garden Pond ---------------------------------------------
function drawGarden(ctx, isRight) {
  sky(ctx, '#8ec9ee', '#d8f3c0');
  // Sun with a smile, the same in both pictures.
  circle(ctx, 472, 56, 28, '#ffd23f');
  ctx.strokeStyle = '#e8a800'; ctx.lineWidth = 3;
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(472 + Math.cos(ang) * 34, 56 + Math.sin(ang) * 34);
    ctx.lineTo(472 + Math.cos(ang) * 42, 56 + Math.sin(ang) * 42);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath(); ctx.arc(464, 52, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(480, 52, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(472, 60, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  // Clouds; one extra cloud drifts in only on the right picture.
  ellipse(ctx, 140, 58, 42, 16, '#ffffff');
  ellipse(ctx, 330, 44, 36, 14, '#ffffff');
  if (isRight) { ellipse(ctx, 252, 62, 40, 15, '#ffffff'); ellipse(ctx, 268, 52, 26, 12, '#ffffff'); }
  // Grass.
  rect(ctx, 0, 250, 560, 170, '#69b455');
  rect(ctx, 0, 250, 560, 10, '#57a047');
  // Big tree on the left.
  rect(ctx, 96, 150, 26, 110, '#7a4a21');
  circle(ctx, 90, 140, 42, '#3f8f3a'); circle(ctx, 140, 125, 48, '#4da344');
  circle(ctx, 115, 100, 44, '#57b04e');
  // Apples: three on the left picture, two on the right.
  circle(ctx, 88, 130, 8, '#e63946'); circle(ctx, 150, 140, 8, '#e63946');
  if (!isRight) circle(ctx, 122, 112, 8, '#e63946');
  // Flower bed: one flower changes colour between the pictures.
  const flowerXs = [40, 92, 150, 210, 500, 530];
  flowerXs.forEach((x, i) => {
    ctx.strokeStyle = '#2f7d32'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, 400); ctx.lineTo(x, 372); ctx.stroke();
    const colour = (i === 1) ? (isRight ? '#ffffff' : '#e63946') : ['#ff8fab', '#ffd23f', '#c084fc', '#ff6b9d', '#ffb347'][i % 5];
    for (let p = 0; p < 5; p++) {
      const ang = (p / 5) * Math.PI * 2;
      circle(ctx, x + Math.cos(ang) * 9, 366 + Math.sin(ang) * 9, 6, colour);
    }
    circle(ctx, x, 366, 6, '#ffd23f');
  });
  // Bench: its middle slat is missing on the right picture.
  rect(ctx, 268, 252, 8, 60, '#7a4a21'); rect(ctx, 340, 252, 8, 60, '#7a4a21');
  rect(ctx, 260, 238, 96, 10, '#a67c52');
  if (!isRight) rect(ctx, 260, 262, 96, 10, '#a67c52');
  rect(ctx, 260, 286, 96, 10, '#a67c52');
  // Pond.
  ellipse(ctx, 300, 350, 250, 62, '#4aa8dd');
  ellipse(ctx, 300, 344, 230, 50, '#6fc3ee');
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(220, 340, 40, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(380, 362, 50, 9, 0, 0, Math.PI * 2); ctx.stroke();
  // Lily pads and the frog, who is only on the left picture.
  ellipse(ctx, 182, 312, 34, 12, '#2f9e44');
  ellipse(ctx, 260, 330, 28, 10, '#2f9e44');
  ellipse(ctx, 340, 306, 30, 11, '#37b24d');
  if (!isRight) {
    circle(ctx, 182, 302, 14, '#57b04e');
    circle(ctx, 174, 290, 7, '#57b04e'); circle(ctx, 190, 290, 7, '#57b04e');
    circle(ctx, 174, 288, 2, '#1b1430'); circle(ctx, 190, 288, 2, '#1b1430');
    ctx.strokeStyle = '#1b1430'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(182, 300, 6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }
  // Mother duck and her ducklings: two on the left, one on the right.
  ellipse(ctx, 400, 340, 20, 12, '#ffd23f');
  circle(ctx, 416, 330, 9, '#ffd23f');
  ctx.beginPath(); ctx.moveTo(424, 330); ctx.lineTo(432, 327); ctx.lineTo(432, 334); ctx.closePath();
  ctx.fillStyle = '#ff8c42'; ctx.fill();
  circle(ctx, 418, 328, 1.5, '#1b1430');
  circle(ctx, 448, 344, 7, '#ffe066'); circle(ctx, 452, 338, 5, '#ffe066');
  if (!isRight) { circle(ctx, 422, 332, 7, '#ffe066'); circle(ctx, 426, 326, 5, '#ffe066'); }
  // Butterfly: only on the left picture.
  if (!isRight) {
    ctx.fillStyle = '#c084fc';
    ctx.beginPath(); ctx.ellipse(374, 114, 10, 14, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(390, 114, 10, 14, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(374, 132, 8, 10, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(390, 132, 8, 10, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(382, 108); ctx.lineTo(382, 138); ctx.stroke();
  }
}

// ---- Level 3: Harbour at Dawn -----------------------------------------
function drawHarbour(ctx, isRight) {
  sky(ctx, '#ffd6a5', '#ff8c69');
  circle(ctx, 480, 70, 30, '#fff3c4');
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ellipse(ctx, 220, 60, 46, 14, '#ffffff');
  ellipse(ctx, 330, 40, 34, 11, '#ffffff');
  // Sea.
  rect(ctx, 0, 280, 560, 140, '#2a6f9e');
  rect(ctx, 0, 280, 560, 8, '#3d8fc2');
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(40 + i * 110, 310 + (i % 2) * 40);
    ctx.quadraticCurveTo(70 + i * 110, 304 + (i % 2) * 40, 100 + i * 110, 310 + (i % 2) * 40);
    ctx.stroke();
  }
  // Gulls: three on the left picture, two on the right.
  ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = 2.5;
  const gulls = [[250, 66], [302, 72], [356, 62]];
  gulls.forEach(([x, y], i) => {
    if (isRight && i === 1) return;
    ctx.beginPath(); ctx.arc(x - 8, y, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 8, y, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  });
  // Lighthouse.
  rect(ctx, 62, 110, 70, 230, '#f7ead1');
  rect(ctx, 62, 150, 70, 22, '#d94f3d'); rect(ctx, 62, 210, 70, 22, '#d94f3d');
  rect(ctx, 62, 270, 70, 22, '#d94f3d');
  rect(ctx, 52, 92, 90, 20, '#333333');
  circle(ctx, 97, 82, 16, '#ffd23f');
  // Its window is lit on the left picture and dark on the right.
  rect(ctx, 88, 196, 18, 28, isRight ? '#2b2b2b' : '#ffd23f');
  // Its beam sweeps out only on the left picture.
  if (!isRight) {
    ctx.fillStyle = 'rgba(255,210,63,0.35)';
    ctx.beginPath(); ctx.moveTo(132, 100); ctx.lineTo(300, 60); ctx.lineTo(300, 150); ctx.closePath(); ctx.fill();
  }
  // Sailboat with a flag that changes colour.
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath(); ctx.moveTo(330, 300); ctx.lineTo(440, 300); ctx.lineTo(420, 322); ctx.lineTo(350, 322); ctx.closePath(); ctx.fill();
  rect(ctx, 382, 170, 6, 130, '#5a4632');
  ctx.fillStyle = '#f7ead1';
  ctx.beginPath(); ctx.moveTo(388, 176); ctx.lineTo(388, 292); ctx.lineTo(432, 292); ctx.closePath(); ctx.fill();
  ctx.fillStyle = isRight ? '#2ec4b6' : '#e63946';
  ctx.beginPath(); ctx.moveTo(388, 152); ctx.lineTo(414, 160); ctx.lineTo(388, 170); ctx.closePath(); ctx.fill();
  // Small rowing boat.
  ellipse(ctx, 500, 300, 34, 10, '#3a7bd5');
  circle(ctx, 500, 288, 8, '#f2c89b');
  // Wooden dock along the bottom.
  rect(ctx, 0, 340, 560, 80, '#8a5a2b');
  ctx.fillStyle = '#a67c52';
  for (let i = 0; i < 8; i++) ctx.fillRect(6 + i * 70, 346, 60, 68);
  ctx.strokeStyle = '#5a4632'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(6 + i * 70, 346); ctx.lineTo(6 + i * 70, 414); ctx.stroke(); }
  // A crate on the dock is only on the left picture.
  if (!isRight) {
    rect(ctx, 150, 322, 64, 56, '#c9a86a');
    ctx.strokeStyle = '#7a4a21'; ctx.lineWidth = 3;
    ctx.strokeRect(150, 322, 64, 56);
    ctx.beginPath(); ctx.moveTo(150, 322); ctx.lineTo(214, 378); ctx.moveTo(214, 322); ctx.lineTo(150, 378); ctx.stroke();
  }
  // A fish jumps out of the sea only on the right picture.
  if (isRight) {
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(482, 330, 12, Math.PI, 0); ctx.stroke();
    ellipse(ctx, 482, 314, 10, 18, '#7fb3d5');
    ctx.beginPath(); ctx.moveTo(474, 322); ctx.lineTo(466, 314); ctx.lineTo(466, 330); ctx.closePath();
    ctx.fillStyle = '#7fb3d5'; ctx.fill();
    circle(ctx, 488, 308, 2, '#1b1430');
  }
  // An anchor rests on the dock only on the right picture.
  if (isRight) {
    ctx.strokeStyle = '#333'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(502, 352, 14, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(502, 352); ctx.lineTo(502, 386); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(488, 374); ctx.lineTo(516, 374); ctx.stroke();
    circle(ctx, 502, 340, 5, '#333');
  }
  // Buoy bobbing in the sea.
  ellipse(ctx, 220, 300, 12, 9, '#ff6b35');
  rect(ctx, 216, 286, 8, 12, '#ff6b35');
}

// ---- Public entry point -------------------------------------------------
export function drawScene(ctx, levelId, isRight, ox, oy) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  if (levelId === 'garden') drawGarden(ctx, isRight);
  else if (levelId === 'harbour') drawHarbour(ctx, isRight);
  else drawMarket(ctx, isRight);
  ctx.restore();
}
