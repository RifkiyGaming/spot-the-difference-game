# Twin Lanterns — Spot the Difference

![Competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/RifkiyGaming/spot-the-difference-game/rank.svg)
![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/RifkiyGaming/spot-the-difference-game/reward.svg)

Entry for [Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) — a complete, original spot-the-difference game that runs entirely offline from static files.

## How to play

Two near-identical pictures sit side by side. Click a difference in either picture and a green ring with a tick marks it on both panels. Find all 7 differences in a level before the timer runs out, then move on to the next scene.

- **3 levels, rising difficulty:** Night Market (150s) → Garden Pond (120s) → Harbour at Dawn (100s), 7 differences each.
- **Hint button (H):** pulses a ring around one unfound difference — 3 hints per level, each costs 5 seconds.
- **Timer pressure:** the bar turns red under 25%; a wrong click costs 2 seconds.
- **Score:** 100 points per find, plus a time bonus for clearing a level.
- **Keys:** H hint, R restart level, M menu, Enter continue, 1–3 choose a level.

## The art

Every scene is original art drawn in code (canvas, `game/src/scenes.js`) — a lantern-lit night market with a sleepy cat, a garden pond with a frog and ducks, and a harbour at dawn with a blinking lighthouse. No copied images, characters or levels.

## Run it

Serve `game/` with any static server, for example `node serve.ts`, then open http://localhost:8080. No network requests: every script is a file under `game/`.

## Files

- `game/index.html` — the page; `game/src/main.js` wires it together.
- `game/src/config.js` — constants, panel positions, timing and scoring.
- `game/src/differences.js` — where every difference lives (data only).
- `game/src/scenes.js` — the program-drawn art for all three scenes.
- `game/src/game.js` — the rules: state, timer, scoring, hints and finds.
- `game/src/render.js` — everything the player sees each frame.
- `game/src/input.js` — mouse and keyboard, translated into game actions.
- `game/src/audio.js` — WebAudio tones for finds, misses, hints and wins.
- `main.ts` — copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.
