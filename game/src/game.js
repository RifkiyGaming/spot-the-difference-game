// game.js — the hunt itself: state, timer, scoring, hints and finds.
// One job only: decide what happens. Drawing lives in render.js and scenes.js,
// sounds in audio.js, raw clicks in input.js. This file owns the rules.
import { LEVELS, diffNear, randomUnfoundDiff } from './differences.js';
import {
  SCORE_PER_FIND, HINTS_PER_LEVEL, HINT_TIME_COST_SECONDS,
  MISS_TIME_COST_SECONDS, PANEL_WIDTH, PANEL_HEIGHT, PANEL_Y,
  LEFT_PANEL_X, RIGHT_PANEL_X,
} from './config.js';
import { playFound, playMiss, playHint, playWin, playTick, playClick } from './audio.js';

export class SpotGame {
  constructor() {
    this.screen = 'menu'; // menu | play | levelDone | gameDone | timeUp
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = LEVELS[0].timeLimit;
    this.lastTickSecond = -1;
    this.message = 'Find 7 differences. Click either picture.';
    this.messageUntil = 0;
    this.markers = []; // {x, y, born, side} expanding rings on a find
    this.misses = []; // {x, y, born, side} red crosses that fade
    this.hintSpot = null; // {index, until} pulsing ring
    this.hover = { x: -1, y: -1 };
    this.levelStartScore = 0;
    this.now = 0;
  }
  get level() { return LEVELS[this.levelIndex]; }
  get totalDiffs() { return this.level.diffs.length; }
  get remaining() { return this.totalDiffs - this.found.size; }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.markers = [];
    this.misses = [];
    this.hintSpot = null;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.timeLeft = this.level.timeLimit;
    this.lastTickSecond = -1;
    this.screen = 'play';
    this.levelStartScore = this.score;
    this.setMessage(`Level ${index + 1}: ${this.level.name} — find ${this.totalDiffs} differences!`, 4000);
  }
  startGame() {
    this.score = 0;
    this.startLevel(0);
  }
  showMenu() {
    this.screen = 'menu';
    playClick();
  }
  restartLevel() {
    this.score = this.levelStartScore;
    this.startLevel(this.levelIndex);
  }
  chooseLevel(index) {
    if (this.screen !== 'menu') return;
    if (index >= 0 && index < LEVELS.length) {
      this.score = 0;
      this.startLevel(index);
    }
  }
  confirm() {
    if (this.screen === 'menu') this.startGame();
    else if (this.screen === 'levelDone') this.nextLevel();
    else if (this.screen === 'gameDone' || this.screen === 'timeUp') this.showMenu();
  }
  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
    else { this.screen = 'gameDone'; playWin(); }
  }
  setMessage(text, ms) {
    this.message = text;
    this.messageUntil = this.now + (ms || 3000);
  }

  handlePanelClick(side, x, y) {
    if (this.screen !== 'play') return;
    const index = diffNear(this.levelIndex, x, y, this.found);
    const originX = side === 'right' ? RIGHT_PANEL_X : LEFT_PANEL_X;
    if (index !== null) {
      this.found.add(index);
      const d = this.level.diffs[index];
      // A marker on BOTH panels, so the pair reads at a glance.
      this.markers.push({ x: d.x, y: d.y, born: this.now, side: 'left' });
      this.markers.push({ x: d.x, y: d.y, born: this.now, side: 'right' });
      this.score += SCORE_PER_FIND;
      playFound();
      this.setMessage(`Found! ${d.label} — ${this.remaining} to go.`, 3200);
      if (this.found.size >= this.totalDiffs) {
        const bonus = Math.round(this.timeLeft) * 2;
        this.score += bonus;
        this.screen = 'levelDone';
        this.setMessage(`Level clear! Time bonus +${bonus}.`, 5000);
        playWin();
      }
    } else {
      this.misses.push({ x, y, born: this.now, side });
      this.timeLeft = Math.max(0, this.timeLeft - MISS_TIME_COST_SECONDS);
      playMiss();
      this.setMessage(`Not quite — that spot matches. −${MISS_TIME_COST_SECONDS}s`, 2200);
    }
  }
  handleFrameClick(x, y) {
    if (this.screen === 'menu') {
      if (x >= 470 && x <= 770 && y >= 490 && y <= 542) this.startGame();
      return;
    }
    if (this.screen === 'levelDone') { this.nextLevel(); return; }
    if (this.screen === 'gameDone' || this.screen === 'timeUp') { this.showMenu(); return; }
    if (this.screen !== 'play') return;
    // The hint and menu buttons live in the HUD; render.js draws them here.
    if (y >= 66 && y <= 98) {
      if (x >= 1010 && x <= 1110) { this.useHint(); return; }
      if (x >= 1120 && x <= 1216) { this.showMenu(); return; }
    }
    // Clicking the gap between the panels does nothing.
    void x; void y;
  }
  handleHover(x, y) {
    this.hover = { x, y };
  }
  useHint() {
    if (this.screen !== 'play') return;
    if (this.hintsLeft <= 0) { this.setMessage('No hints left on this level.', 2200); return; }
    const index = randomUnfoundDiff(this.levelIndex, this.found);
    if (index === null) return;
    this.hintsLeft -= 1;
    this.timeLeft = Math.max(0, this.timeLeft - HINT_TIME_COST_SECONDS);
    this.hintSpot = { index, until: this.now + 3000 };
    playHint();
    this.setMessage(`Hint: look inside the pulsing ring. −${HINT_TIME_COST_SECONDS}s`, 3000);
  }
  update(dtMs) {
    this.now += dtMs;
    if (this.screen === 'play') {
      this.timeLeft -= dtMs / 1000;
      const whole = Math.ceil(this.timeLeft);
      if (whole <= 10 && whole !== this.lastTickSecond && whole > 0) {
        this.lastTickSecond = whole;
        playTick();
      }
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.screen = 'timeUp';
        playMiss();
      }
    }
    this.markers = this.markers.filter((m) => this.now - m.born < 900);
    this.misses = this.misses.filter((m) => this.now - m.born < 800);
    if (this.hintSpot && this.now > this.hintSpot.until) this.hintSpot = null;
    if (this.now > this.messageUntil && this.screen === 'play') {
      this.message = this.remaining === 0
        ? 'Level clear!'
        : `Find ${this.remaining} more difference${this.remaining === 1 ? '' : 's'}.`;
    }
  }
}
