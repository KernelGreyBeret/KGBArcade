# P0.13 — Kernel Courier Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while Priority Zero homepage work remains stacked.

## Root `index.html`

Add Kernel Courier to Live 8BitOps:

```html
<div class="game-card">
  <a href="/games/kernel-courier/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Kernel Courier — Fresh Corn Run</h3>
    <p>Haul 12 corn down a fixed farm route, manage fuel and cargo damage, and honk the chickens out of your way.</p>
    <div class="placeholder-banner"><span>KERNEL COURIER</span></div>
  </a>
</div>
```

If an older tactical `Kernel Courier` card exists, remove it. That tactical lineage is now `Relay Runner`.

## Root `games.json`

Add/update:

```json
{
  "id": "kernel-courier",
  "title": "Kernel Courier",
  "subtitle": "Fresh Corn Run",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — Fresh Corn Run",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; additional farm delivery routes are post-v1."
}
```

## Suggested release commit

`P0.13: release Kernel Courier Fresh Corn Run v1.0.0`
