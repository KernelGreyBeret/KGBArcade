# P0.10 — Ninja Panda Homepage/Registry Patch — STACK FOR FINAL HOMEPAGE PASS

Do **not** apply this now while Priority Zero homepage work remains stacked.

## Root `index.html`

Add Ninja Panda to Live 8BitOps:

```html
<div class="game-card">
  <a href="/games/ninja-panda/" class="game-summary">
    <span class="vault-chip">8BitOps · Live</span>
    <h3>Ninja Panda</h3>
    <p>Learn his fixed dojo route, survive the first-click fightback, and land the second hit before he smoke-bombs away.</p>
    <div class="placeholder-banner"><span>NINJA PANDA</span></div>
  </a>
</div>
```

## Root `games.json`

Add/update:

```json
{
  "id": "ninja-panda",
  "title": "Ninja Panda",
  "vault": "8BitOps",
  "status": "live",
  "currentBuild": "Public v1.0.0 — Dojo Hunt",
  "targetPublicVersion": "1.0.0",
  "next": "Deployed and production-tested; additional dojo encounters are optional post-v1 content."
}
```

## EyeOps cleanup

Remove `eyeops-gaze-runner` / `gaze-runner` from the active production backlog or mark it:

```json
"status": "retired-experiment"
```

Reason: owner decision on 2026-08-30 not to pursue the game further.

## Suggested release commit

`P0.10: release Ninja Panda Dojo Hunt v1.0.0`
