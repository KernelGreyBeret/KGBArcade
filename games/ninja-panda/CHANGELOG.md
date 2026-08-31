# Ninja Panda — Changelog

## 1.0.0 — Dojo Hunt — 2026-08-30

Canonical KGBA public release.

### Historical identity preserved
Ninja Panda began as an autonomous character / Easter-egg style hunt rather than a conventional player-controlled platformer.

Verified approved behavior from the 2025 prototype:
- Panda continuously moves but never leaves the screen.
- Plain/dark dojo-style environment with boxes and platforms.
- Low, middle, and rooftop movement.
- Diagonal ziplines.
- Peeking.
- Running.
- Jumping.
- Flip-jumps.
- Sliding.
- Box/platform interactions.
- Cursor-proximity hops.
- Two-click capture:
  1. first click triggers fightback / screen shake,
  2. second click captures Panda.
- Missed click provokes a shuriken.
- Escape uses a smoke bomb.

The user had already approved the Panda's size, movement speeds, and general move flow in the standalone dojo prototype.

### Public v1 loop
`Dojo Hunt` turns that prototype into one complete arcade encounter:
- 60-second hunt.
- Fixed authored movement loop:
  low run → slide → crate peek → platform jump → mid run → zipline → rooftop run → flip drop → opposite peek → repeat.
- First successful hit opens a 1.8-second capture window.
- Second successful hit during that window wins.
- Missing costs 2 seconds and triggers a shuriken retaliation.
- Missing/expiring the second-hit window triggers a smoke-bomb escape and resets contact.
- Cursor/touch proximity can trigger a bounded evasive hop without changing the underlying route.
- Best capture time persists locally.
- Pause/background pause, sound preference, mouse/touch play, and PWA packaging.

### 2026 character-tool work
Later Ninja Panda work expanded into an Animation Lab and Action Rig Forge test character with a formal action set (idle/breathe/wave/salute/punch/kick/jump/duck/walk/victory). That tooling remains part of the character-production lineage, but public v1 intentionally does not depend on unfinished rig/sprite infrastructure.

### Arcade-True release pass
The dojo layout and survival-critical movement script contain no gameplay randomness.
The player should learn the Panda's route and timing across failed hunts.
