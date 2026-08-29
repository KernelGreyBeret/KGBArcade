# Asymmantics Beta 0.3

A signal-language puzzle game in which the player constructs shared meaning
with an unknown intelligence through observation, inference, response, and
validated reuse.

## This build

Beta 0.3 is the first full chapter build:

- complete Prologue: Presence;
- Epoch I: Quantity;
- 39 authored protocol stages;
- number construction from zero through eight;
- exact identity versus equal quantity;
- more, less, and equal quantity;
- successor and predecessor;
- conserved quantity across changed signal forms;
- delayed recall and compound semantic checkpoints;
- persistent save/resume through browser storage;
- chapter transitions and completion state;
- adaptive remediation and concept-specific active context.

The game remains instructionless. All vocabulary is established through signal
behavior, repetition, contrast, validation, and reuse.

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
