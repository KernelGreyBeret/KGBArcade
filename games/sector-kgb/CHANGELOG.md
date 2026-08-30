# Sector KGB — Changelog

## 1.0.0 — Mission 01: Power Cycle — 2026-08-30

Canonical KGBA public release.

### Historical foundation
Power Cycle originated as the four-scene reference mission for the KGBA Mission Runner / Mission Composer line:
1. **Bunker Entry** — Node Puzzle
2. **Circuit Stabilizer** — Static Stage
3. **Signal Shaft** — Multi-axis Platform
4. **Relay Defense** — Six-Zone Reflex

The Studio template identified its runtime baseline as **KGBA Engines v0.4.2 + Mission Runner v0.1.3**.

### Preserved mission intent
- Bunker Entry restores the dead generator / blast-door chain.
- Circuit Stabilizer retains the original **35-second** bus-stabilization identity and SYNC / LOCK / SURGE scoring.
- Signal Shaft remains a fixed traversal scene leading to relay access.
- Relay Defense retains the original **35-second** defense window and **five-life/integrity** baseline.

### Arcade-True public release pass
- Bunker dependency chain is fixed and repeatable.
- Circuit targets use a fixed authored sequence instead of gameplay-affecting random spawns.
- Signal Shaft is one fixed platform route with fixed checkpoints.
- Relay Defense uses one fixed six-lane attack sequence.
- Scene failure messages teach the relevant retry lesson.
- Retrying a scene rolls mission score back to that scene's starting score to prevent retry farming.
- Added pause/background pause, persistent sound setting, persistent best completed-mission score, desktop/mobile controls, and PWA packaging.

### Product consolidation
`Sector KGB` is now the anthology/game-family name.
`Power Cycle` is **Mission 01**, not a separate standalone product.
Future Sector KGB content should ship as additional missions under the same family.
