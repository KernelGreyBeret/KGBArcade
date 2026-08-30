# P0.5 — Sector KGB / Power Cycle Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge, then import this ZIP at the **repository root**.

It adds/replaces:

- `games/sector-kgb/index.html`
- `games/sector-kgb/game.json`
- `games/sector-kgb/CHANGELOG.md`
- `games/sector-kgb/play/index.html`
- `games/sector-kgb/play/manifest.webmanifest`
- `games/sector-kgb/play/sw.js`
- `games/sector-kgb/play/icon-192.png`
- `games/sector-kgb/play/icon-512.png`
- `docs/release-patches/P0_5_SECTOR_KGB_PATCHES.md`

It intentionally does **not** overwrite the root `games.json` because the live registry currently lags prior P0 releases. The patch document gives the three tiny registry corrections for Riftwake, Jungle Breakout, and Sector KGB so you do not accidentally roll anything backward.

Then apply the root `index.html` edits from the patch document.

Suggested commit:
`P0.5: release Sector KGB Power Cycle v1.0.0`

Smoke test the full mission in order:
1. Bunker Entry: intentionally press one wrong node, then complete the dependency chain.
2. Circuit Stabilizer: confirm red SURGE nodes penalize only when tapped and that the target order repeats on retry.
3. Signal Shaft: complete the fixed platform route on desktop and phone controls.
4. Relay Defense: use both touch/click and keys 1–6; survive the full 35 seconds.
5. Fail and retry each scene at least once.
6. Verify scene retry does not let you farm accumulated score.
7. Complete all four scenes and confirm the best completed-mission score persists after reload.
8. Background the browser mid-scene and confirm the mission pauses.
