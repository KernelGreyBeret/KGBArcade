# P0.6 — Monster Truck Mayhem Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now if you are stacking homepage changes until the end of Priority Zero.

## Root `index.html`

Add a Live 8BitOps card:

```html
<div class="game-card">
  <a href="/games/monster-truck-mayhem/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Monster Truck Mayhem</h3>
    <p>No score. No mission. Just monster trucks, giant ramps, flips, boost, and crushable cars.</p>
    <div class="placeholder-banner"><span>MONSTER TRUCK MAYHEM</span></div>
  </a>
</div>
```

Optional final launch-alert copy when the entire homepage backlog is reconciled:

```html
<strong>🚨 NEW GAME LIVE:</strong>
<span>Monster Truck Mayhem v1.0.0 is loose in the Arsenal.</span>
<a href="/games/monster-truck-mayhem/">Cause Problems →</a>
```

## Root `games.json`

Add or update:

```json
{
  "id": "monster-truck-mayhem",
  "title": "Monster Truck Mayhem",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — fixed-arena free-roam stunt sandbox",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested."
}
```

## Suggested release commit

`P0.6: release Monster Truck Mayhem v1.0.0`
