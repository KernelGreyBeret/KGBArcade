# Asymmantics Beta

A signal-language puzzle game in which the player constructs shared meaning
with an unknown intelligence through observation, inference, response, and
validated reuse.

> Beta software. Puzzle structure, behavior, presentation, and content may
> change substantially.

## Run locally

Because service workers require a secure context, test the PWA through
`localhost` rather than opening `index.html` directly.

From this directory:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Deploy to KGB Arcade

Upload the complete contents of this folder without changing its internal
structure. A suitable deployment path is:

```text
/games/asymmantics/
```

The directory must be served over HTTPS for installation and offline caching
in production.

## Install on Android

Open the deployed game in Chrome. Use the in-game **INSTALL** control when
available, or open the browser menu and select **Install app** or
**Add to Home screen**.

## Updating a deployed build

1. Replace the deployed application files.
2. Change `CACHE_NAME` in `sw.js`.
3. Record the release in `CHANGELOG.md`.
4. Test a clean installation and an upgrade from the prior installed build.

Changing the cache name ensures that the service worker retires the previous
application shell.

## Repository files

- `LICENSE.md` — proprietary use terms.
- `NOTICE.md` — ownership, beta status, and attribution notice.
- `THIRD_PARTY_NOTICES.md` — bundled dependency and asset record.
- `PRIVACY.md` — current data-handling description.
- `SECURITY.md` — responsible vulnerability reporting.
- `CONTRIBUTING.md` — contribution expectations.
- `CHANGELOG.md` — release history.
- `manifest.webmanifest` — install metadata.
- `sw.js` — offline application-shell service worker.

## License

Copyright © 2026 Tommy Burke / KGB Arcade. All rights reserved.

This is proprietary software, not an open-source release. See `LICENSE.md`.
