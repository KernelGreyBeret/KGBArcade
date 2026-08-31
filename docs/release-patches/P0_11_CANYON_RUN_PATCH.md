# P0.11 — Canyon Run Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while Priority Zero homepage work remains stacked.

## Root `index.html`

Add Canyon Run to Live 8BitOps:

```html
<div class="game-card">
  <a href="/games/canyon-run/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Canyon Run</h3>
    <p>Arcade-assisted canyon flight: move where you mean, auto-level on release, learn the fixed route, and don't crash.</p>
    <div class="placeholder-banner"><span>CANYON RUN</span></div>
  </a>
</div>
```

## Root `games.json`

Add/update:

```json
{
  "id": "canyon-run",
  "title": "Canyon Run",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — arcade-assisted fixed canyon run",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; additional routes are post-v1."
}
```

## Suggested release commit

`P0.11: release Canyon Run v1.0.0`
