# P0.12 — Cluck & Cover Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while Priority Zero homepage work remains stacked.

## Root `index.html`

Add Cluck & Cover to Live MiniMissions:

```html
<div class="game-card">
  <a href="/games/cluck-and-cover/" class="game-summary">
    <span class="vault-chip">MiniMissions · Live</span>
    <h3>Cluck & Cover</h3>
    <p>Protect five chicks through one ridiculous farm day of snakes, raccoons, hawks, and a sunset boss.</p>
    <div class="placeholder-banner"><span>CLUCK & COVER</span></div>
  </a>
</div>
```

If an old On Deck / concept card exists, remove it so the game appears only once.

## Root `games.json`

Add/update:

```json
{
  "id": "cluck-and-cover",
  "title": "Cluck & Cover",
  "vault": "MiniMission",
  "status": "live",
  "currentBuild": "Public v1.0.0 — One Farm Day",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; additional farm days/predators are post-v1."
}
```

## Suggested release commit

`P0.12: release Cluck and Cover v1.0.0`
