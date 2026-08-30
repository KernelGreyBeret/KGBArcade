# Relay Runner — Changelog

## 1.0.0 — 2026-08-30

Canonical KGBA public release.

### Identity consolidation
This game line was actually built under multiple names:
- Pixel Patrol: Neon Ridge
- Pixel Patrol: Signal Breaker
- Kernel Courier: Dead Drop Ridge
- Kernel Courier: Broken Net Valley

On June 20, 2026, the tactical platformer identity became **Relay Runner**, while `Kernel Courier` was reassigned to the separate farm-delivery game.

Public v1 finally finishes that rename.

### Verified historical mechanics preserved
- Left / Right movement.
- Separate Jump control.
- Up/W contextual interaction:
  - sync relay,
  - tag team,
  - open/interact,
  - plant/recover satchel charge,
  - otherwise swing Signal Baton.
- Down/S while airborne = **Signal Slam**.
- Signal Baton standardized across both levels.

### Mission 01 — Dead Drop Ridge
Verified historical mission brief:
- comms dark,
- enemy jammed valley net,
- units cannot coordinate,
- Courier One drops alone,
- sync **3 relays**,
- restore the route,
- locate jammer,
- destroy generator.

Verified final damage model:
- Jammer HP: **100**
- Dead-drop satchel charge: **20 damage**
- Maximum charges: **4**
- Signal Baton: **8 damage**
- Signal Slam: **5 damage**

The jammer remains objective-gated until all three relays are synced.

### Mission 02 — Broken Net Valley
Verified historical elements:
- `EVAC 1/3` progression existed.
- `Team Alpha` was an actual activation objective.
- The final freeze bug came from calling nonexistent `sfx.relay()` during Alpha activation; the fix was `sfx.team()`.
- Signal Baton remained standard equipment.
- Firewall obstacles were part of the combat/interact vocabulary.

The exact lost source text for the remaining two evac labels and some mission-2 layout details is not recoverable. Public v1 therefore preserves the verified **three evacuation-objective structure** while keeping the later two team labels generic (`EVAC TEAM 2`, `EVAC TEAM 3`) rather than fabricating canonical names.

### Arcade-True public pass
- Two fixed side-scrolling mission maps.
- Fixed platforms, relay positions, satchel pickups, enemies, firewall barriers, teams, jammer, and extraction.
- No gameplay-affecting random generation.
- Mission 02 unlocks after Mission 01 completion and persists locally.
- Failure restarts the same authored map.
- Pause/background pause, sound preference, mobile buttons, desktop controls, and PWA packaging.

### Deferred
The proposed **Static War** 12-level campaign remains future Relay Runner expansion.
Public v1 intentionally ships the two real developed missions instead of waiting for ten unbuilt ones.
