# Kernel Courier — Changelog

## 1.0.0 — Fresh Corn Run — 2026-08-30

Canonical KGBA public release.

### Identity
This is the **farm-delivery Kernel Courier**, not the earlier tactical-neon platformer that was later renamed **Relay Runner**.

The farm concept was defined on June 20–22, 2026 as a small farm cart / ATV / utility vehicle / tiny-truck delivery racer carrying corn and produce along scrolling country routes.

### Historical Fresh Corn Run mechanics preserved
- Left / Right.
- Boost.
- Horn.
- Time HUD.
- Fuel HUD.
- Cargo / vehicle damage.
- Corn delivered.
- Earnings.
- Hazards:
  - mud,
  - rocks,
  - chickens,
  - hay bale,
  - fence.
- Pickups:
  - fuel,
  - coin,
  - boost,
  - extra corn.
- Delivery requirement: **12 corn**.
- Lose on:
  - timeout,
  - empty fuel,
  - 100% vehicle damage,
  - reaching delivery without the required cargo.
- Historical route target: roughly 60–120 seconds.

### Public v1
- One 2,400-meter **Fresh Corn Run**.
- 95-second delivery window.
- Three road lanes.
- Truck auto-drives; player manages lane selection, boost, and horn.
- Starts with exactly 12 corn.
- Rocks / hay / fences / chicken collisions can knock cargo loose.
- Extra-corn pickups recover cargo up to 12.
- Horn clears chickens if used before the truck reaches their fixed crossing.
- Boost increases speed but also increases fuel burn.
- Fuel cans, boost refills, coins, and extra corn have fixed placements.
- Delivery pays a base amount plus remaining-fuel / low-damage bonuses.
- Best clear time and best earnings persist locally.

### Arcade-True release pass
No gameplay-affecting random generation.
The full obstacle and pickup sequence is fixed.
The player learns when to change lanes, when to honk, when to save boost, and where recovery pickups occur.

### Classification
Public v1 is classified as **8BitOps** under the current KGBA vault split because it is a conventional replayable arcade racer. The earliest concept notes called it a MiniMission, but the MiniMission line later evolved toward objective/control-surface micro-ops. This classification change avoids mixing two distinct product styles.

### Shared farm world
Visual conventions intentionally align with Cluck & Cover so both games can later share a formal farm asset/environment kit without blocking either v1 release.
