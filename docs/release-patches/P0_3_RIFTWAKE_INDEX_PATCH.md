# P0.3 — Riftwake Arsenal Patch

The overlay adds `/games/riftwake/` and updates `games.json`.
The KGBA root home page still hard-codes Arsenal cards, so make these small changes in Repo Forge after import.

## 1. Add Riftwake to the LIVE 8BitOps grid

In the live 8BitOps `arsenal-grid` (the same grid that contains HyperHop, Tommy, StarWarp, Arc Defender, and now Spin Stop), add:

```html
      <div class="game-card">
        <a href="/games/riftwake/" class="game-summary">
          <span class="vault-chip">8BitOps · Live</span>
          <h3>Riftwake: Signal Skimmer</h3>
          <p>Learn the rift cycle, blast hostile drones, skim signal cores, and survive the accelerating wake.</p>
          <img src="/games/riftwake/riftwake_banner_small.png" alt="Riftwake Banner">
        </a>
      </div>
```

The banner path already exists in the Arsenal today.

## 2. Remove the old Riftwake On Deck card

In `Coming Soon to KGB 8BitOps`, remove the entire old card whose heading is:

```html
<h3>Riftwake</h3>
```

and whose chip is:

```html
<span class="vault-chip">8BitOps · On Deck</span>
```

Do not leave the same game in both Live and Coming Soon.

## 3. Make Riftwake the launch alert

Inside `.launch-inner`, replace the current game announcement with:

```html
      <strong>🚨 NEW GAME LIVE:</strong>
      <span>Riftwake: Signal Skimmer v1.0.0 has deployed to the Arsenal.</span>
      <a href="/games/riftwake/">Play Now →</a>
```

## Suggested commit

`P0.3: release Riftwake Signal Skimmer v1.0.0`
