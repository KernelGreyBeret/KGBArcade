# Bayou Breakout — Changelog

## 1.0.0 — Warm-Up Run — 2026-08-30

Canonical KGBA public release.

### Historical foundation
Bayou Breakout began on June 20, 2026 as the **River Gator Boat Chase** concept before being named **Bayou Breakout** under 8BitOps.

The established Warm-Up Run MVP was:
- steer a boat through a visible winding river,
- land on both sides with swamp scenery,
- rocks / logs / downed-tree gaps / sandbars,
- gators visible on shore,
- some shore gators join the chase as the player passes,
- danger / pursuit meter,
- distance,
- boost,
- win by reaching the course end,
- lose when the pursuing gators catch the boat.

A playable smoke test existed on KGB Arcade Engine v0.1, followed by a v0.1.1 UI hotfix and later standardized-engine work.

### Public v1
- One complete **Warm-Up Run**.
- 1,620-meter authored river.
- 19 authored river center/width waypoints.
- 22 authored hazards.
- 7 authored gator join points.
- Left/right steering on desktop and mobile.
- Recharging boost.
- Gator-gap pressure system.
- Collisions and shoreline mistakes cost speed and separation rather than rerolling the run.
- Best clear time and farthest-distance persistence.
- Pause/background pause, sound toggle, immediate retry, PWA packaging.

### Arcade-True release pass
The survival-critical course contains no gameplay randomization:
- river bends are fixed,
- river width is fixed by distance,
- hazards stay at the same distances and lateral positions,
- shore gators join at the same points,
- extraction is fixed.

The player's knowledge should improve after every failed run.

### Deferred by design
No upgrades, bosses, branching routes, store, or complex AI in v1. Those were explicitly outside the original Warm-Up Run MVP.
