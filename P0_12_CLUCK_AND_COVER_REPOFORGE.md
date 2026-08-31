# P0.12 — Cluck & Cover Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite root `index.html` or root `games.json`. Homepage/registry changes remain stacked for the final Priority Zero reconciliation.

It adds:
- `games/cluck-and-cover/index.html`
- `games/cluck-and-cover/game.json`
- `games/cluck-and-cover/CHANGELOG.md`
- `games/cluck-and-cover/play/index.html`
- `games/cluck-and-cover/play/manifest.webmanifest`
- `games/cluck-and-cover/play/sw.js`
- `games/cluck-and-cover/play/icon-192.png`
- `games/cluck-and-cover/play/icon-512.png`
- `docs/release-patches/P0_12_CLUCK_AND_COVER_PATCH.md`

Suggested commit:
`P0.12: release Cluck and Cover v1.0.0`

Direct smoke test:
- `/games/cluck-and-cover/`
- `/games/cluck-and-cover/play/`

Test:
1. Move using desktop controls and phone D-pad.
2. Confirm PECK is fast and short-range.
3. Confirm SPUR is slower but clearly stronger on raccoons.
4. Confirm FLAP has wider reach and does noticeably better against hawks.
5. Let the first snake reach its target chick; confirm exactly one chick is lost.
6. Restart and verify the first several predator timings / entry sides repeat.
7. Confirm Morning → Noon → Afternoon → Sunset progression.
8. Fight the Big Hawk boss at sunset.
9. Finish with at least one chick alive.
10. Try for a perfect 5/5 defense.
11. Reload and confirm best chicks saved / best bonks and sound preference persist.
12. Background the browser and confirm pause.
