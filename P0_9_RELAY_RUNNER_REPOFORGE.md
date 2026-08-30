# P0.9 — Relay Runner Repo Forge Overlay

Load the existing `KernelGreyBeret/KGBArcade` `main` branch in Repo Forge and import this ZIP at the **repository root**.

This package intentionally does **not** overwrite root `index.html` or root `games.json`. Those changes remain stacked for the final homepage reconciliation.

It adds/replaces:
- `games/relay-runner/index.html`
- `games/relay-runner/game.json`
- `games/relay-runner/CHANGELOG.md`
- `games/relay-runner/play/index.html`
- `games/relay-runner/play/manifest.webmanifest`
- `games/relay-runner/play/sw.js`
- `games/relay-runner/play/icon-192.png`
- `games/relay-runner/play/icon-512.png`
- `docs/release-patches/P0_9_RELAY_RUNNER_PATCH.md`

The existing repository banner `games/relay-runner/relay-runner_banner_small.png` is preserved.

Suggested commit:
`P0.9: release Relay Runner v1.0.0`

Direct smoke test:
- `/games/relay-runner/`
- `/games/relay-runner/play/`

Mission 01:
1. Sync all 3 relays with ACTION / Up / W.
2. Recover at least one dead-drop charge.
3. Hit a firewall with the Signal Baton.
4. Use Signal Slam while airborne.
5. Reach the jammer before syncing all relays and confirm it cannot be completed early.
6. After 3/3 relays, verify jammer HUD starts at 100/100.
7. Verify each planted charge removes 20 HP.
8. Verify baton strikes remove 8 HP.
9. Verify slam removes 5 HP.
10. Destroy jammer and confirm Mission 02 unlocks.

Mission 02:
1. Confirm Team Alpha can be tagged without freezing.
2. Break each fixed firewall.
3. Reach all three evacuation positions and advance EVAC 0/3 → 3/3.
4. Reach extraction only after EVAC 3/3.
5. Fail/retry and confirm map/objective positions remain unchanged.

Both:
- phone controls,
- desktop controls,
- pause/background pause,
- sound preference,
- Mission 02 unlock persistence.
