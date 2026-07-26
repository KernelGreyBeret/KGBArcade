# Asymmantics Beta 0.2.2

A signal-language puzzle game in which the player constructs shared meaning
with an unknown intelligence through observation, inference, response, and
validated reuse.

## This build

Beta 0.2.2 establishes the permanent Prologue interface and puzzle-engine
foundation:

- fixed signal scope, active context, and transmitter;
- scrolling conversation history;
- selectable and replayable transmissions;
- distinct received and transmitted signals;
- grouped demonstration bundles;
- stable response grammar;
- progressive remediation after repeated failure;
- persistent active examples for unresolved challenges;
- player-authored signal notebook architecture;
- installable offline PWA behavior.

## Run locally

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Deploy to KGB Arcade

Upload the contents of this folder intact under a path such as:

```text
/games/asymmantics/
```

Serve it over HTTPS. The service worker is scoped to the Asymmantics directory.

## Upgrade note

The service-worker cache is named `asymmantics-beta-v0-2`. Future releases
must change `CACHE_NAME` in `sw.js` so installed builds update cleanly.

## License

Copyright © 2026 Tommy Burke / KGB Arcade. All rights reserved.

This is proprietary software, not an open-source release. See `LICENSE.md`.
