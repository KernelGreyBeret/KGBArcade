# KGBA Release Standard v1.0

A public `v1.0.0` means **one complete, stable, semi-professional play experience**. It does not mean every future level, campaign, mode, mechanic, or dream has been implemented.

## A. Technical gate

A release candidate must:

- boot from its public URL with no fatal JavaScript errors;
- have no missing required assets or broken internal links;
- support start → play → result/end → restart;
- work on current mobile touch and desktop keyboard/mouse where applicable;
- remain usable in portrait/landscape according to the game's intended orientation;
- expose sound/mute controls when it produces audio;
- pause/resume if the game design requires interruption support;
- preserve local score/progress/settings when those are part of the game;
- use the canonical KGBA title, vault/family, slug, and public version;
- have a clean game page, concise instructions, and a visible way back to the Arcade;
- survive a representative full play session without freeze, soft-lock, runaway spawning, or unrecoverable state.

## B. Arcade-True gate

Except where deliberately modified for sandbox/toddler/learning play, the candidate must also pass:

- **Cause test:** can the player explain why they failed?
- **Repeatability test:** do equivalent states obey equivalent rules?
- **Learning test:** can memory/pattern recognition improve the next attempt?
- **Fairness test:** are hazards and state changes readable/reactable?
- **RNG test:** can randomness ever create an unavoidable or unknowable loss? If yes, fail.
- **Control test:** is challenge coming from the game rather than awkward controls?
- **No-art test:** would the central interaction remain fun with placeholder graphics?
- **Replay test:** is another run easy to begin and meaningfully appealing?

See `docs/ARCADE_TRUE.md`.

## C. Public version rule

Historical development versions remain in changelogs and archives.

When a game first clears the public release gate, its public line becomes:

`v1.0.0`

Future public releases use normal semantic intent:

- `1.0.x` — fixes with no meaningful gameplay expansion;
- `1.x.0` — new levels, modes, content, mechanics, or substantial improvements compatible with the same game identity;
- `2.0.0` — fundamental redesign, new campaign architecture, or intentionally incompatible gameplay identity.

Do not expose prototype version clutter (`v0.4.5`, `Final v1`, `PWA Final`, etc.) as the public product version.

## D. Canonical game folder contract

Target structure:

```text
/games/<canonical-slug>/
    index.html                 public game/mission page
    play/
        index.html             canonical playable build
        assets/                game-owned runtime assets
        manifest.webmanifest   optional PWA
        service-worker.js      optional PWA
    game.json                  per-game metadata (future)
    CHANGELOG.md               public release history (future)
```

Priority Zero does **not** force every currently working game into `/play/` immediately. First repair the arcade. Then migrate games one at a time without breaking public routes.

## E. Canonical path rules

- lowercase kebab-case slugs;
- no spaces;
- no version numbers in public URLs;
- no implementation names such as `*_v8.html` in links exposed from the Arsenal once migrated;
- no duplicate public identities for renamed predecessors;
- historical/legacy files may remain archived but are not authoritative.
