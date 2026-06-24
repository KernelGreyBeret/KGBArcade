# TankTots Learn v0.2 Production Refresh

Static, browser-native learning deck engine for KGB Arcade / TankTots.

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Refresh notes

- Fixed desktop/mobile viewport layout using `100dvh`.
- Bottom controls stay inside the visible screen with safe-area support.
- Removed the old reward/star row under every card.
- Card view now shows only the large card image and card name.
- Spoken phrase appears temporarily as a caption when Play/card tap is used.
- Added swipe left/right on the card.
- Added Random card button.
- Added multi-deck mixing with shuffled combined cards.
- Speech now prefers lower/male-sounding English voices when available.
- PWA service worker keeps HTML and deck JSON network-first so installed users check online for updates and new decks.

## Deploy

Upload the folder contents to GitHub Pages. Keep `decks/index.json` updated as new decks are added.
