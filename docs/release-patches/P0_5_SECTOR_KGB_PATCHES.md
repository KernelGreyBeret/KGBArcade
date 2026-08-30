# P0.5 — Sector KGB Release Patches

## IMPORTANT classification cleanup

The old home page currently shows `Sector KGB` in the **8BitOps Coming Soon** block as a prototype.
The canonical registry correctly classifies the actual Power Cycle mission as **MiniMission**.

For this release:
- REMOVE the old 8BitOps prototype card.
- ADD the live Power Cycle card to the MiniMissions grid.

## Root `index.html`

### 1. Remove the old 8BitOps prototype card

Delete the entire card containing:

```html
<span class="vault-chip">8BitOps · Prototype</span>
<h3>Sector KGB</h3>
```

### 2. Add Sector KGB to the LIVE MiniMissions grid

Place this before the existing MiniMissions On Deck cards:

```html
<div class="game-card">
  <a href="/games/sector-kgb/" class="game-summary">
    <span class="vault-chip">MiniMissions · Live</span>
    <h3>Sector KGB — Mission 01: Power Cycle</h3>
    <p>Restore bunker power, stabilize the circuit, traverse the signal shaft, and defend the relay.</p>
    <img src="/games/sector-kgb/sector-kgb_banner_small.png" alt="Sector KGB Banner">
  </a>
</div>
```

The existing banner is franchise artwork and can remain in use for Mission 01.

### 3. Update the launch alert

```html
<strong>🚨 NEW GAME LIVE:</strong>
<span>Sector KGB — Mission 01: Power Cycle has deployed.</span>
<a href="/games/sector-kgb/">Begin Mission →</a>
```

## Root `games.json`

The live repository registry can lag these release commits. Make these status corrections while you are there:

### `riftwake`
Set:
```json
"status": "live",
"currentBuild": "Public v1.0.0 — deterministic Arcade-True release",
"next": "Deployed and production-tested."
```

### `jungle-breakout`
Set:
```json
"status": "live",
"currentBuild": "Public v1.0.0 — Mudline Run canonical release",
"next": "Deployed and production-tested; future courses are post-v1 backlog."
```

### `sector-kgb`
Set:
```json
"vault": "MiniMission",
"status": "live",
"currentBuild": "Public v1.0.0 — Mission 01: Power Cycle",
"next": "Deployed; future Sector KGB content ships as additional anthology missions."
```

## Suggested commit

`P0.5: release Sector KGB Power Cycle v1.0.0`
