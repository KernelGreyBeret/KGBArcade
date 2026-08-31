# P0.11 — Canyon Run Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite root `index.html` or root `games.json`. Homepage/registry work remains stacked for the final Priority Zero reconciliation.

It adds:
- `games/canyon-run/index.html`
- `games/canyon-run/game.json`
- `games/canyon-run/CHANGELOG.md`
- `games/canyon-run/play/index.html`
- `games/canyon-run/play/manifest.webmanifest`
- `games/canyon-run/play/sw.js`
- `games/canyon-run/play/icon-192.png`
- `games/canyon-run/play/icon-512.png`
- `docs/release-patches/P0_11_CANYON_RUN_PATCH.md`

Suggested commit:
`P0.11: release Canyon Run v1.0.0`

Direct smoke test:
- `/games/canyon-run/`
- `/games/canyon-run/play/`

Control test:
1. Hold LEFT, then release: aircraft should move left while held and bank should return toward 0° after release.
2. Hold RIGHT, then release: same behavior opposite direction.
3. Hold UP, then release: climb while held; pitch should return toward 0° after release and climb rate should decay.
4. Hold DOWN, then release: descend while held; pitch and descent rate should decay.
5. Hold BRAKE: speed should fall substantially but never reach zero.
6. Release BRAKE: cruise speed returns.

Arcade-True test:
1. Intentionally crash in an early canyon squeeze.
2. Restart and confirm the same bend/squeeze is at the same distance.
3. Pass several green gates.
4. Verify rock spires and arches repeat in fixed locations.
5. Finish all 4,800 m.
6. Reload and confirm best clear time/farthest distance and sound preference persist.
7. Background the browser and confirm pause.
8. Test both desktop and phone controls.
