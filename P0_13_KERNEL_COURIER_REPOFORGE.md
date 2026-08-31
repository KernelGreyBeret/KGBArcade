# P0.13 — Kernel Courier Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite root `index.html` or root `games.json`. Homepage/registry changes remain stacked for the final Priority Zero reconciliation.

It adds:
- `games/kernel-courier/index.html`
- `games/kernel-courier/game.json`
- `games/kernel-courier/CHANGELOG.md`
- `games/kernel-courier/play/index.html`
- `games/kernel-courier/play/manifest.webmanifest`
- `games/kernel-courier/play/sw.js`
- `games/kernel-courier/play/icon-192.png`
- `games/kernel-courier/play/icon-512.png`
- `docs/release-patches/P0_13_KERNEL_COURIER_PATCH.md`

Suggested commit:
`P0.13: release Kernel Courier Fresh Corn Run v1.0.0`

Direct test:
- `/games/kernel-courier/`
- `/games/kernel-courier/play/`

Smoke test:
1. Steer left/right on desktop and phone.
2. Hold boost and verify higher speed plus faster fuel consumption.
3. Release boost and confirm charge recovers.
4. Intentionally hit the first rock/hay/fence and confirm damage/cargo consequences.
5. Approach the first chicken without horn and confirm collision penalty.
6. Restart, honk before that same crossing, and confirm the chicken event clears.
7. Lose one corn, then collect a fixed extra-corn pickup and confirm cargo restores by one.
8. Collect fixed fuel and boost pickups.
9. Let time expire.
10. Let fuel reach zero.
11. Reach 100% damage if practical.
12. Reach the barn with less than 12 corn and confirm delivery fails.
13. Finish with all 12 corn and confirm successful delivery / earnings.
14. Reload and confirm best time, best earnings, and sound preference persist.
15. Background browser and confirm pause.
