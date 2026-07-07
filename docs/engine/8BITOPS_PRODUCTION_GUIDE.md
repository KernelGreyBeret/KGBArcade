# 8BitOps Production Guide

**KGB Arcade Engine v0.2** treats 8BitOps as the home for the regular KGB Arcade bangers.

8BitOps is not a literal 8-bit technical restriction. It is the arcade cabinet world: retro flavor, neon swagger, tight controls, fast starts, high replay value, desktop-first polish, mobile-friendly fallback, and no dependency-heavy build chain.

## World split

```text
KGB Arcade
├── MiniMission
│   └── Tactical/control-surface games with their own MiniMission engine
├── TankTots
│   └── Kid/toddler learning and play with the TankTots Learn engine
└── 8BitOps
    └── Regular arcade games using the standard KGB Arcade Engine
```

All regular arcade games live in **8BitOps** now: Bayou Breakout, Tommy the Tank, Mower Mania, Firetruck Rescue, Cozy Cat, StarWarp, Arc Defender, Cluck & Cover, Kernel Courier, Relay Runner, Sector KGB, and future arcade bangers.

## Production template folder

Use this folder for new 8BitOps games:

```text
games/_8bitops-template/
  index.html
  config.js
  game.js
  manifest.json
  service-worker.js
  reset-cache.html
  assets/
```

To create a new game:

1. Copy `games/_8bitops-template/` to `games/my-new-game/`.
2. Edit `config.js`:
   - `id`
   - `title`
   - `assetBase`
   - `backToArcadeHref`
   - tuning knobs
   - asset manifest
3. Replace placeholder assets in `assets/`.
4. Edit `game.js` to implement the actual game loop and scene logic.
5. Update `manifest.json` and icons.
6. Change `CACHE_NAME` in `service-worker.js`.
7. Test locally with `python3 -m http.server`.
8. Use `reset-cache.html` whenever stale PWA files get annoying during development.

## Standard 8BitOps scenes

The production template demonstrates the standard shell:

- `boot` — load assets and show progress.
- `title` — start screen and best score display.
- `settings` — sound, clear score, and future control preferences.
- `play` — main game scene.
- `pause` — resume overlay.
- `complete` — wave/level complete.
- `gameover` — score commit and retry.

Not every game must use every scene, but this is the default production pattern.

## Standard controls

8BitOps principle:

> Made for desktop, still fun for mobile.

Desktop defaults:

```text
Move: WASD / Arrow Keys
Action / Fire: Space / Enter / J
Boost / Alt Action: Shift / K
Pause: Esc / P
Mute: M
```

Mobile defaults:

```text
Virtual D-pad
Pause button
Boost button
Action / Fire button
```

## Standard HUD

The shell supports:

- score
- best score
- lives
- status text
- meters such as boost, fuel, water, danger, health, ammo
- sound toggle
- settings button
- fullscreen button
- Back to Arcade button

Use `KGB.ArcadeKit` for common HUD updates:

```js
KGB.ArcadeKit.setScore(game, score, 'default');
KGB.ArcadeKit.finishScore(game, score, 'default');
KGB.ArcadeKit.setLives(lives);
KGB.ArcadeKit.setStatus('LIVE');
KGB.ArcadeKit.setMeter('boost', boostValue01);
```

## PWA convention

Each game owns its own PWA files. Do not cache the whole arcade from one game.

Per-game files:

```text
manifest.json
service-worker.js
assets/icons/icon-192.png
assets/icons/icon-512.png
reset-cache.html
```

During active development, bump the service worker `CACHE_NAME` every time you need to force a refresh.

## Keep it arcade-simple

Do not turn the engine into a giant framework. If a helper is useful across three or more games, move it into `engine/`. If it is genre-specific, keep it in the game folder until the pattern proves itself.

Good candidates for future engine helpers:

- lane runner preset
- top-down vehicle preset
- arena shooter preset
- side-view platformer preset
- toddler-safe input preset, only for TankTots if needed
- arcade high-score board when a backend exists later

For now, v0.2 stays intentionally simple.
