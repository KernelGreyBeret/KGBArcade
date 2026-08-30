# P0.8 — Bayou Breakout Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite:
- root `index.html`
- root `games.json`

Homepage/registry work remains stacked until the end of the Priority Zero sweep.

It adds/replaces:

- `games/bayou-breakout/index.html`
- `games/bayou-breakout/game.json`
- `games/bayou-breakout/CHANGELOG.md`
- `games/bayou-breakout/play/index.html`
- `games/bayou-breakout/play/manifest.webmanifest`
- `games/bayou-breakout/play/sw.js`
- `games/bayou-breakout/play/icon-192.png`
- `games/bayou-breakout/play/icon-512.png`
- `docs/release-patches/P0_8_BAYOU_BREAKOUT_PATCH.md`
- `docs/recovery-holds/P0_7_ASYMMANTICS_RECOVERY_HOLD.md`

The existing repository artwork:
`games/bayou-breakout/bayou-breakout_banner_small.png`
is intentionally preserved and is not replaced by this overlay.

Suggested commit:
`P0.8: release Bayou Breakout Warm-Up Run v1.0.0`

Direct test routes:
- `/games/bayou-breakout/`
- `/games/bayou-breakout/play/`

Smoke test:
1. Steer left/right on desktop.
2. Steer left/right on phone.
3. Hit the first rock/log intentionally and confirm it costs speed/gator gap.
4. Ride a shoreline long enough to feel the extra pursuit pressure.
5. Pass at least two fixed shore-gator join points and confirm pack count increases.
6. Hold boost; confirm boost drains and the gator gap improves.
7. Release boost; confirm it recharges.
8. Lose by letting the pack close and retry.
9. Confirm the same early hazards and river bends appear at the same distances.
10. Finish all 1,620 m and confirm extraction.
11. Reload and confirm best clear time/farthest distance and sound preference persist.
12. Background the browser and confirm pause.
