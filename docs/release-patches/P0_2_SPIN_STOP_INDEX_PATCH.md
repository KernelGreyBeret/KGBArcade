# P0.2 — Spin Stop Arsenal Patch

The game files and registry in this overlay are ready to import at the repository root.
The current KGBA home page hard-codes Arsenal cards, so make these small edits in Repo Forge after import.

## 1. Add Spin Stop to the live 8BitOps cards

In root `index.html`, find the Arc Defender live card ending with:

```html
      <div class="game-card">
        <a href="/games/arc-defender/index.html" class="game-summary">
          <span class="vault-chip">8BitOps · Live</span>
          <h3>Arc Defender — Rhythm Rings</h3>
          <p>Pulsing precision defense through rotating rings.</p>
          <img src="/games/arc-defender/Arc-defender_banner_small.png" alt="Arc Defender Banner">
        </a>
      </div>
```

Immediately after it, paste:

```html
      <div class="game-card">
        <a href="/games/spin-stop/" class="game-summary">
          <span class="vault-chip">8BitOps · Live</span>
          <h3>Spin Stop</h3>
          <p>Stop the needle, learn the authored timing patterns, and chain PERFECT hits as the ring accelerates.</p>
          <div class="placeholder-banner">SPIN STOP · PRECISION TIMING</div>
        </a>
      </div>
```

No image file is required; this deliberately uses KGBA's existing `placeholder-banner` component.

## 2. Make Spin Stop the launch alert

Replace the current Tommy launch-alert content inside `.launch-inner` with:

```html
      <strong>🚨 NEW GAME LIVE:</strong>
      <span>Spin Stop v1.0.0 has deployed to the Arsenal.</span>
      <a href="/games/spin-stop/">Play Now →</a>
```

## 3. Finish the P0.1 public-status cleanup

The three games were live-tested after the prior deployment. Change only their vault chips:

- Cozy Cat Playground: `TankTots · Updating` → `TankTots · Live`
- Lawn Mower Mania: `TankTots · Updating` → `TankTots · Live`
- Firetruck Rescue: `TankTots · Updating` → `TankTots · Live`

Also change the live card heading `Kids Mash` → `Kid Jam`, and remove the stray `<` at the end of the Cozy Cat description.

## Suggested commit

`P0.2: release Spin Stop v1.0.0`
