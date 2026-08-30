# P0.3 — Riftwake Repo Forge Overlay

Import this ZIP at the **root** of the existing `KernelGreyBeret/KGBArcade` repository.

It adds/replaces:

- `games/riftwake/index.html`
- `games/riftwake/game.json`
- `games/riftwake/CHANGELOG.md`
- `games/riftwake/play/index.html`
- `games/riftwake/play/manifest.webmanifest`
- `games/riftwake/play/sw.js`
- `games/riftwake/play/icon-192.png`
- `games/riftwake/play/icon-512.png`
- `games.json`
- `docs/release-patches/P0_3_RIFTWAKE_INDEX_PATCH.md`

Then apply the small root `index.html` edits in the patch document.

Suggested commit:

`P0.3: release Riftwake Signal Skimmer v1.0.0`

Smoke test:
1. `/games/riftwake/`
2. `/games/riftwake/play/`
3. Nosefire on desktop.
4. Pointer Aim on desktop.
5. Mobile left-thumb movement + right-thumb fire/aim.
6. Pause/resume.
7. Lose all hulls → Run It Again.
8. Reload and confirm best score / aim mode / difficulty / sound persist.
