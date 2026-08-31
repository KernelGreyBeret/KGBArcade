# P0.10 — Ninja Panda Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge, then import this ZIP at the **repository root**.

This package intentionally does **not** overwrite root `index.html` or root `games.json`. Homepage/registry edits remain stacked for the final Priority Zero reconciliation.

It adds:
- `games/ninja-panda/index.html`
- `games/ninja-panda/game.json`
- `games/ninja-panda/CHANGELOG.md`
- `games/ninja-panda/play/index.html`
- `games/ninja-panda/play/manifest.webmanifest`
- `games/ninja-panda/play/sw.js`
- `games/ninja-panda/play/icon-192.png`
- `games/ninja-panda/play/icon-512.png`
- `docs/release-patches/P0_10_NINJA_PANDA_PATCH.md`
- `docs/retired/EYEOPS_GAZE_RUNNER_RETIRED.md`

Suggested commit:
`P0.10: release Ninja Panda Dojo Hunt v1.0.0`

Direct smoke test:
- `/games/ninja-panda/`
- `/games/ninja-panda/play/`

Test:
1. Watch one full movement loop without clicking.
2. Confirm Panda never leaves the screen.
3. Confirm the movement order repeats.
4. Move the cursor/touch close and verify bounded proximity hops.
5. Miss intentionally: shuriken appears and clock loses 2 seconds.
6. Hit Panda once: fightback/screen shake and 1/2 contact.
7. Wait too long: smoke bomb and contact resets.
8. Hit once, then land the second click inside the window: capture.
9. Reload and verify best capture time and sound preference persist.
10. Background browser mid-hunt and confirm pause.
11. Test mouse and phone touch.
