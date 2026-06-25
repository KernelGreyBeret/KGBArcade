# KGB Field Server

A tiny PWA for testing local KGB Arcade HTML game builds on a phone before publishing them.

## How to use

1. Put this folder somewhere under your site, for example: `/tools/field-server/`.
2. Visit that URL in Chrome on Android.
3. Use Chrome menu → Add to Home screen / Install app.
4. Open the installed app.
5. Load a game ZIP from Files.
6. Pick the launch HTML file, usually `index.html`, and press Launch.

## Best ZIP shape

Good:

```text
my-game.zip
  index.html
  assets/player.png
  assets/sfx.wav
```

Also okay; the app strips the common top folder:

```text
my-game.zip
  my-game/index.html
  my-game/assets/player.png
```

## What it does

The app stores the ZIP contents in IndexedDB. Its service worker serves files back under:

```text
/__game__/index.html
```

That makes relative image, CSS, JS, audio, JSON, and fetch paths behave like a simple web server.

## Known limits

Root-absolute paths like `/assets/foo.png` may fail if the PWA is hosted in a subfolder. Prefer relative paths like `assets/foo.png` for portable test builds.
