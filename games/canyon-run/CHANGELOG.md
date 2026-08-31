# Canyon Run — Changelog

## 1.0.0 — 2026-08-30

Canonical KGBA public release.

### Historical foundation
On August 1, 2026, the fighter-jet prototype began as a simple canyon flyer with the aircraft always moving and controls for pitch up/down, roll left/right, and brake.

The early prototype failed the fun/readability test because the controls behaved too much like actual aircraft attitude controls:
- Up/down could leave the player continuously gaining/losing altitude.
- Left/right acted more like persistent bank/roll than intuitive screen-space movement.
- The route was difficult to read.
- The player could understand the buttons and still not understand how to stay on course.

The final settled direction from that tuning session was:
- pressing left should make the jet move left,
- pressing right should make it move right,
- pressing up should climb,
- pressing down should descend,
- releasing directional controls should automatically level/center the aircraft's attitude,
- the game should remain arcade-assisted rather than simulate piloting.

### Public v1
- Canonical name: **Canyon Run**
- 4,800-meter fixed canyon.
- 17 authored canyon geometry keyframes.
- 21 authored gates / spires / arches.
- Continuous forward motion.
- Left/right lateral translation with temporary visual bank.
- Up/down altitude translation with temporary visual pitch.
- Directional velocity damps to zero when the control is released.
- Bank and pitch automatically return to neutral.
- Brake reduces forward speed from cruise without ever stopping the jet.
- Fixed corridor boundary collision.
- Fixed obstacle collision.
- Gates are optional mastery markers rather than required objectives.
- Best clear time and farthest distance persist locally.
- Immediate retry, pause/background pause, sound preference, mobile controls, desktop controls, and PWA packaging.

### Arcade-True release pass
The canyon course contains no survival-critical random generation.
Every bend, squeeze, climb, descent, gate, arch, and rock spire stays at the same distance and position every run.

Failure is route reconnaissance, not a dice roll.
