# P0.9 — Relay Runner Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while Priority Zero homepage work is being stacked.

## Root `index.html`

Move Relay Runner from On Deck to Live 8BitOps.

Suggested card:

```html
<div class="game-card">
  <a href="/games/relay-runner/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Relay Runner</h3>
    <p>Run two fixed tactical platforming missions: reconnect the ridge, destroy the jammer, and evacuate the broken valley.</p>
    <img src="/games/relay-runner/relay-runner_banner_small.png" alt="Relay Runner Banner">
  </a>
</div>
```

Remove the old On Deck Relay Runner card so it appears only once.

## Root `games.json`

Add/update:

```json
{
  "id": "relay-runner",
  "title": "Relay Runner",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — Dead Drop Ridge + Broken Net Valley",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; Static War expansion deferred until backlog clear."
}
```

## Suggested release commit

`P0.9: release Relay Runner v1.0.0`
