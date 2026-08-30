# P0.6 — Monster Truck Mayhem Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite:
- root `index.html`
- root `games.json`

You said those homepage/registry edits are being stacked until the end of the release sweep.

It adds:

- `games/monster-truck-mayhem/index.html`
- `games/monster-truck-mayhem/game.json`
- `games/monster-truck-mayhem/CHANGELOG.md`
- `games/monster-truck-mayhem/play/index.html`
- `games/monster-truck-mayhem/play/manifest.webmanifest`
- `games/monster-truck-mayhem/play/sw.js`
- `games/monster-truck-mayhem/play/icon-192.png`
- `games/monster-truck-mayhem/play/icon-512.png`
- `docs/release-patches/P0_6_MONSTER_TRUCK_MAYHEM_PATCH.md`

Suggested commit:
`P0.6: release Monster Truck Mayhem v1.0.0`

Direct smoke-test routes after deploy:
- `/games/monster-truck-mayhem/`
- `/games/monster-truck-mayhem/play/`

Smoke test:
1. Drive both directions.
2. Jump the first large ramp.
3. Use nose-up / nose-down in the air.
4. Complete at least one full flip and confirm the session counter increments.
5. Crush at least one parked car and confirm it stays crushed.
6. Use Recover Truck and confirm crushed cars remain crushed.
7. Use Reset Arena and confirm cars restore and counters clear.
8. Hold boost and confirm the boost meter drains/recharges.
9. Test the mega ramp around the center of the arena.
10. Background the browser and confirm the game pauses.
11. Test on phone and desktop.
