# Cluck & Cover — Changelog

## 1.0.0 — One Farm Day — 2026-08-30

Canonical KGBA public release.

### Historical concept preserved
The June 20, 2026 concept established:
- **MiniMission** as the vault.
- A rooster protects yard chicks / animals.
- Predators include swooping birds, snakes, and raccoons.
- Rooster combat actions:
  - **Peck** — fast attack,
  - **Spur** — strong/heavy attack,
  - **Flap** — knockback and anti-air.
- Tone: super cartoony and playful, aimed at older kids and adults rather than toddler play.

### Public v1 — One Farm Day
- Five chicks to defend.
- Deterministic chick wandering.
- Fixed authored predator schedule.
- Morning: snakes.
- Noon: raccoons + snakes.
- Afternoon: hawks + mixed predators.
- Sunset: one large hawk boss with a fixed movement pattern.
- Predator entrance side and intended target chick are authored.
- Chicks are lost when a predator reaches them.
- Game is lost only when all chicks are gone.
- Sunset boss defeat completes the MiniMission.
- Best chicks saved and best predator-bonk count persist locally.

### Combat
- Peck: 8 damage, fastest cooldown, short reach.
- Spur: 18 damage, slower/heavier forward ground strike.
- Flap: 10 ground damage, 22 anti-air damage, wide knockback.
- No Crow/stun ability in public v1; the three core actions remain intentionally distinct and readable.

### Arcade-True release pass
No survival-critical random generation.
The farm layout, chick motion loops, predator timings, entry sides, target assignments, and boss pattern are repeatable.
A failed day teaches the next day.

### Deferred
Shared farm-world art and environmental conventions may later be consolidated with the farm version of Kernel Courier / Fresh Corn Run, but Cluck & Cover v1 does not wait on that larger farm-world toolchain.
