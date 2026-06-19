# KGB Arcade — StarWarp + Arc Defender PWA Drop-in

This package adds PWA install/offline support for StarWarp and Arc Defender.

## Included

### StarWarp Arena — KGB Arcade

- Folder: `games/starwarp/`
- Files:
  - `index.html`
  - `starwarp.html`
  - `manifest.webmanifest`
  - `service-worker.js`
  - `icons/`
- JavaScript blocks syntax-checked: 2

### Arc Defender — Rhythm Rings

- Folder: `games/arc-defender/`
- Files:
  - `index.html`
  - `arc_defender.html`
  - `manifest.webmanifest`
  - `service-worker.js`
  - `icons/`
- JavaScript blocks syntax-checked: 2

## Deploy

Copy the `games/starwarp/` and `games/arc-defender/` folders into the repo, then commit:

```bash
git add games/starwarp games/arc-defender
git commit -m "Add StarWarp and Arc Defender PWA support"
git push
```

## Arcade card URLs

Use these URLs from the Arsenal / Play pages:

```text
/games/starwarp/
/games/arc-defender/
```

## PWA notes

- GitHub Pages HTTPS is enough for production PWA service workers.
- First visit must happen online so the service worker can cache the app.
- After updates, Android/Desktop may keep an old service-worker cache for a bit. Change `CACHE_NAME` in `service-worker.js` when forcing a cache refresh.
- iOS uses Share -> Add to Home Screen rather than the Android-style install prompt.
