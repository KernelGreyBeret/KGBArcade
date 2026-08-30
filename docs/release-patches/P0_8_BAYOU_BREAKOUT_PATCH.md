# P0.8 — Bayou Breakout Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while the Priority Zero homepage work is being stacked.

## Root `index.html`

Move Bayou Breakout from On Deck / Coming Soon to Live 8BitOps.

Suggested card:

```html
<div class="game-card">
  <a href="/games/bayou-breakout/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Bayou Breakout</h3>
    <p>Learn one winding swamp run, dodge fixed river hazards, and keep the growing gator pack off your transom.</p>
    <img src="/games/bayou-breakout/bayou-breakout_banner_small.png" alt="Bayou Breakout Banner">
  </a>
</div>
```

Remove the old Bayou Breakout On Deck card so the title appears only once.

## Root `games.json`

Add/update:

```json
{
  "id": "bayou-breakout",
  "title": "Bayou Breakout",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — Warm-Up Run",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; future routes are post-v1."
}
```

## Final launch-alert candidate

```html
<strong>🚨 NEW GAME LIVE:</strong>
<span>Bayou Breakout — Warm-Up Run v1.0.0 is live.</span>
<a href="/games/bayou-breakout/">Hit the Water →</a>
```

## Suggested release commit

`P0.8: release Bayou Breakout Warm-Up Run v1.0.0`
