# TankTots Learn Production Notes

This build is static-file only and designed for GitHub Pages/PWA packaging.

## PWA update strategy

The service worker uses network-first behavior for navigations, HTML, `decks/index.json`, and deck JSON files. This means installed users should check online for the latest platform shell and new decks whenever they launch while online.

Images, UI art, logos, and PWA icons use cache-first behavior after the latest deck JSON points to them.

## Deployment

Upload the folder contents to your repo path. Keep `manifest.json` and `service-worker.js` next to `index.html`.

## Adding decks

Add a new folder under `decks/`, add its `deck.json`, add images/audio under that folder, then add an entry to `decks/index.json`. Installed PWAs will check the registry online first.
