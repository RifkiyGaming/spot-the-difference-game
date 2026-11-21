// audio.js — every sound the game makes, synthesized with WebAudio.
// One job only: small tones, no files, no network. The game calls these
// after a find, a miss, a hint or a win; a silent browser simply stays silent.
let audioContext = null;
let muted = false;

export function setMuted(value) {
  muted = !!value;
}
export function isMuted() {
  return muted;
}
function context() {
  if (muted) return null;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  } catch (err) {
    return null;
  }
}
function tone(frequency, startIn, duration, type, volume) {
  const ctx = context();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = frequency;
    const t = ctx.currentTime + (startIn || 0);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume || 0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  } catch (err) {
    // Sound is decoration; a failure here must never break the game.
  }
}

// The named sounds, each a short phrase of tones.
export function playFound() {
  tone(660, 0, 0.12, 'sine', 0.14);
  tone(880, 0.09, 0.18, 'sine', 0.14);
  tone(1320, 0.16, 0.12, 'triangle', 0.08);
}
export function playMiss() {
  tone(160, 0, 0.18, 'sawtooth', 0.06);
}
export function playHint() {
  tone(520, 0, 0.1, 'sine', 0.1);
  tone(780, 0.08, 0.14, 'sine', 0.1);
}
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.12));
}
export function playTick() {
  tone(980, 0, 0.06, 'square', 0.04);
}
export function playClick() {
  tone(440, 0, 0.05, 'sine', 0.06);
}
