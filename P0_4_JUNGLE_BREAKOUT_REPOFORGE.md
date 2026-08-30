# P0.4 — Jungle Breakout Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge, then import this ZIP at the **repository root**.

It adds/replaces:

- `games/jungle-breakout/index.html`
- `games/jungle-breakout/game.json`
- `games/jungle-breakout/CHANGELOG.md`
- `games/jungle-breakout/play/index.html`
- `games/jungle-breakout/play/manifest.webmanifest`
- `games/jungle-breakout/play/sw.js`
- `games/jungle-breakout/play/icon-192.png`
- `games/jungle-breakout/play/icon-512.png`
- `games.json`
- `docs/release-patches/P0_4_JUNGLE_BREAKOUT_INDEX_PATCH.md`

The existing repository banner at `games/jungle-breakout/jungle-breakout_banner_small.png` is intentionally preserved.

After import, apply the small home-page edits from the release-patch document.

Suggested commit:
`P0.4: release Jungle Breakout v1.0.0`

Smoke-test both phone and desktop:
- Start Mudline Run.
- Left/right lane changes.
- Jump a log and at least one creek/ravine.
- Duck vines.
- Hold brake and confirm the pack closes.
- Hold boost and confirm boost drains / the gap improves.
- Crash into a solid obstacle and retry.
- Deliberately ride onto a missing trail lane and verify the failure.
- Reach 1,180 m and verify COURSE CLEAR.
- Reload and confirm best score, difficulty, and sound persist.
