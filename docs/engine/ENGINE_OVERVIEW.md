# KGB Arcade Engine v0.2

**KGB Arcade Engine v0.2** is a lightweight internal runtime for KGB Arcade games.

Doctrine:

> Stay web-native. Stay independent. Build the KGB Arcade Runtime. Use browser APIs like a platform, not like a toy.

This engine is intentionally small and direct. It uses vanilla HTML/CSS/JavaScript, Canvas 2D, WebAudio-friendly patterns, localStorage, static assets, and per-game PWA files. There is no Unity, Unreal, Steam wrapper, Phaser, Pixi, React, npm build chain, backend, or dependency-heavy framework.

## Folder structure

```text
kgb-arcade-engine/
  engine/
    kgb-core.js
    kgb-assets.js
    kgb-input.js
    kgb-audio.js
    kgb-renderer2d.js
    kgb-scenes.js
    kgb-save.js
    kgb-ui.js
    kgb-pwa.js
    kgb-utils.js

  games/
    _template/
      index.html
      game.js
      config.js
      manifest.json
      service-worker.js
      assets/

    bayou-breakout/
      index.html
      game.js
      config.js
      manifest.json
      service-worker.js
      assets/

  shared/
    styles/
      kgb-game-shell.css
    assets/
      logos/
      ui/

  docs/
    ENGINE_OVERVIEW.md
    GAME_TEMPLATE_GUIDE.md
```

## Runtime modules

### `kgb-core.js`

Owns the runtime lifecycle:

- Canvas setup
- Device pixel ratio handling
- Resize/orientation handling
- Safe-area awareness
- Capped delta time
- Optional fixed update step
- Pause/resume
- Scene updates and renders
- Manager creation for input, renderer, audio, assets, saves, and scenes

Main entry point:

```js
const game = new KGB.Game(window.KGB_GAME_CONFIG);
game.scenes.add('boot', BootScene);
game.scenes.add('title', TitleScene);
game.scenes.add('play', PlayScene);
game.start('boot');
```

### `kgb-assets.js`

Loads static asset manifests:

- Images
- Audio files
- JSON files
- Text files

It tracks progress, caches assets by key, provides path helpers, and returns a friendly placeholder image if an image fails to load.

```js
await game.assets.loadManifest({
  images: [{ key: 'boat', src: 'boat.svg' }],
  json: [{ key: 'course', src: 'course.json' }]
});

const boat = game.assets.image('boat');
const course = game.assets.json('course');
```

### `kgb-input.js`

Supports desktop and mobile input:

- Keyboard
- Pointer/mouse/touch
- Virtual buttons using `data-kgb-btn`
- Hold buttons
- Tap detection
- Tap zones
- Swipe detection
- Axis helpers

Principle:

> Made for desktop, still fun for mobile.

Example:

```html
<button data-kgb-btn="left">◀</button>
<button data-kgb-btn="boost">BOOST</button>
```

```js
const steer = game.input.axis('left', 'right');
if (game.input.wasPressed('boost')) boost();
```

### `kgb-renderer2d.js`

Canvas helper layer:

- Sprite/image drawing
- Camera offset and zoom
- Screen shake
- Shapes
- Panels
- Meters
- Stroke text
- Debug boxes
- World/screen coordinate helpers

It is intentionally not a full graphics engine. It is a practical drawing helper.

### `kgb-audio.js`

WebAudio-friendly audio manager:

- Mobile unlock
- Sound on/off
- Master volume
- One-shot audio element playback
- Looped audio element playback
- Synth tone fallback
- Noise fallback

The synth helpers let prototypes make sound without shipping audio files.

### `kgb-scenes.js`

Scene manager for:

- Boot/loading
- Title/menu
- Gameplay
- Pause
- Level complete
- Game over
- Settings later

Each scene can define:

```js
onEnter(data) {}
onExit(nextScene, data) {}
update(dt) {}
render(renderer, dt) {}
onResize() {}
```

### `kgb-save.js`

Namespaced localStorage saves:

- Best scores
- Settings
- Sound state
- Control preferences
- Future unlocks

Example:

```js
const best = game.save.getBestScore();
const result = game.save.setBestScore(score);
game.save.setSetting('controlMode', 'nosefire');
```

### `kgb-ui.js`

Shared KGB Arcade UI helpers:

- HUD updates
- Meter updates
- World badges
- Back to Arcade link wiring
- Sound toggle binding
- Toasts
- Virtual button creation

### `kgb-pwa.js`

Small PWA helper:

- Service worker registration
- Install prompt button wiring

Each game owns its own `manifest.json` and `service-worker.js`. A game should cache its own runtime files and assets, not the whole arcade.

## Why classic scripts instead of ES modules?

The v0.1 starter uses classic browser scripts and a single `window.KGB` namespace. This keeps the engine easy to open, inspect, copy, and patch. It also avoids a build step and avoids npm entirely.

ES modules can be introduced later if needed, but the v0.1 goal is repo-friendly simplicity.

## Local testing

Most gameplay can run from static hosting. For local testing, use a tiny local server from the engine folder:

```bash
cd kgb-arcade-engine
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/games/_template/
http://localhost:8000/games/bayou-breakout/
```

A local server is recommended because JSON loading and PWA service workers are browser-restricted under `file://`.

## Deployment pattern

For GitHub Pages, drop the folders into the repo root:

```text
/engine
/games
/shared
/docs
```

Then link to games like:

```text
/games/bayou-breakout/
/games/_template/
```

Each game folder is install-friendly and PWA-ready.

## Good future v0.2 targets

- Entity helper layer
- Tile/collision helpers
- Animation helper
- Sprite atlas helper
- Input remapping UI
- Accessibility pass
- Shared high score adapter interface
- Optional cloud score bridge later
- Debug console overlay


## v0.2 8BitOps note

The standard KGB Arcade Engine is now the 8BitOps runtime track. MiniMission and TankTots have their own specialized engines. Regular arcade bangers should start from `games/_8bitops-template/` and use the shared engine modules plus `engine/kgb-arcade-kit.js` for shell wiring.
