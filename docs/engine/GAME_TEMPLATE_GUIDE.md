# KGB Arcade Engine v0.1 — Game Template Guide

Use `games/_template/` as the starting point for a new KGB Arcade game.

## Create a new game

Copy the template folder:

```bash
cp -R games/_template games/my-new-game
```

Then edit:

```text
games/my-new-game/index.html
games/my-new-game/config.js
games/my-new-game/game.js
games/my-new-game/manifest.json
games/my-new-game/service-worker.js
games/my-new-game/assets/
```

## Update `config.js`

Minimum config:

```js
window.KGB_GAME_CONFIG = {
  id: 'my-new-game-v0-1',
  title: 'My New Game',
  world: 'MiniMission',
  canvas: '#game',
  assetBase: 'assets/',
  backToArcadeHref: '../../index.html',
  manifest: {
    images: [
      { key: 'player', src: 'player.svg' }
    ],
    audio: [],
    json: []
  },
  bindings: {
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    action: ['Space', 'Enter'],
    pause: ['Escape', 'KeyP']
  }
};
```

Valid world labels:

- `MiniMission`
- `8BitOps`
- `TankTots`

## Add assets

Put static files in the game `assets/` folder.

Recommended pattern:

```text
assets/
  player.svg
  enemy.svg
  course.json
  icons/
    icon-192.png
    icon-512.png
```

Register them in `config.js`:

```js
manifest: {
  images: [
    { key: 'player', src: 'player.svg' },
    { key: 'enemy', src: 'enemy.svg' }
  ],
  json: [
    { key: 'course', src: 'course.json' }
  ]
}
```

Use loaded assets in a scene:

```js
const playerImg = game.assets.image('player');
r.image(playerImg, x, y, w, h);
```

## Scene pattern

A game usually has these scenes:

```js
class BootScene extends KGB.Scene {}
class TitleScene extends KGB.Scene {}
class PlayScene extends KGB.Scene {}
class PauseScene extends KGB.Scene {}
class WinScene extends KGB.Scene {}
class LoseScene extends KGB.Scene {}
```

Register scenes at the bottom of `game.js`:

```js
game.scenes.add('boot', BootScene);
game.scenes.add('title', TitleScene);
game.scenes.add('play', PlayScene);
game.scenes.add('pause', PauseScene);
game.scenes.add('win', WinScene);
game.scenes.add('lose', LoseScene);
game.start('boot');
```

## Input pattern

Keyboard:

```js
const xAxis = game.input.axis('left', 'right');
if (game.input.wasPressed('action')) fire();
if (game.input.wasPressed('pause')) game.scenes.switch('pause', this);
```

Virtual buttons:

```html
<button data-kgb-btn="left">◀</button>
<button data-kgb-btn="boost">BOOST</button>
```

Pointer/touch:

```js
if (game.input.pointer.tap) doTapAction();
if (game.input.pointer.swipe === 'up') jump();
```

Tap zones:

```js
game.input.addTapZone(() => ({ x: 0, y: 0, w: game.width / 2, h: game.height }), 'left');
game.input.addTapZone(() => ({ x: game.width / 2, y: 0, w: game.width / 2, h: game.height }), 'right');
```

## HUD updates

In `index.html`, HUD values use `data-kgb-hud`:

```html
<span data-kgb-hud="score">0</span>
```

In game code:

```js
KGB.UI.setHud({ score: 100, best: 250 });
```

Meters use `data-kgb-meter`:

```html
<div class="kgb-meter danger" data-kgb-meter="danger"></div>
```

```js
KGB.UI.setMeter('danger', 0.55);
```

## Local saves

Best score:

```js
const best = game.save.getBestScore();
const result = game.save.setBestScore(score);
if (result.improved) KGB.UI.toast('New best!');
```

Settings:

```js
game.save.setSetting('controlMode', 'desktop');
const mode = game.save.getSetting('controlMode', 'desktop');
```

## PWA checklist

Each game folder should have:

```text
manifest.json
service-worker.js
assets/icons/icon-192.png
assets/icons/icon-512.png
```

In `index.html`:

```html
<link rel="manifest" href="manifest.json" />
```

In `game.js`:

```js
KGB.PWA.register('./service-worker.js');
KGB.PWA.setupInstallPrompt();
```

In `service-worker.js`, cache only the game files, engine files, shared shell CSS, and assets used by that game.

## Recommended game folder naming

Use lowercase folders with hyphens:

```text
bayou-breakout
cluck-and-cover
tommy-the-tank
mower-mania
kernel-courier
relay-runner
cozy-cat
sector-kgb
tanktots-learn
starwarp
arc-defender
```

## First migration strategy for existing single-file games

1. Keep the original game working.
2. Copy `_template` into a new folder.
3. Move CSS shell and controls into `index.html`.
4. Move game constants into `config.js`.
5. Move gameplay into `game.js` scenes.
6. Replace direct canvas resize/input/audio/save code with engine helpers.
7. Add manifest and service worker.
8. Test desktop first, then mobile.

Do not rewrite the whole arcade at once. Move one game at a time.
