# P0.4 — Jungle Breakout Arsenal Patch

The overlay creates the canonical live game at `/games/jungle-breakout/` and promotes the registry entry to Live.

## Root `index.html`

### 1. Add Jungle Breakout to the LIVE 8BitOps grid

Use the banner already present in the repository:

```html
<div class="game-card">
  <a href="/games/jungle-breakout/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Jungle Breakout</h3>
    <p>Learn Mudline Run, read the collapsing trail, and stay ahead of the jaguar pack.</p>
    <img src="/games/jungle-breakout/jungle-breakout_banner_small.png" alt="Jungle Breakout Banner">
  </a>
</div>
```

### 2. Remove the old Jungle Breakout On Deck card

Delete the Coming Soon / On Deck card for `Jungle Breakout` so it is not listed twice.

### 3. Update the launch alert

```html
<strong>🚨 NEW GAME LIVE:</strong>
<span>Jungle Breakout v1.0.0 has escaped into the Arsenal.</span>
<a href="/games/jungle-breakout/">Play Now →</a>
```

## Suggested commit

`P0.4: release Jungle Breakout v1.0.0`
