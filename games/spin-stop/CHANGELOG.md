# Spin Stop — Changelog

## v1.0.0 — 2026-08-30

First canonical KGBA public release.

- promoted the historical Perfect Combo Edition to the public release line;
- moved Spin Stop to **8BitOps**, where its pure timing/reflex loop fits the KGBA vault model;
- replaced per-round random target placement with authored deterministic target sequences per difficulty;
- on a miss, preserves the same target so failure directly teaches the timing problem;
- fixed the historical successful-hit speed ramp being applied twice;
- retained direction reversal and progressive speed escalation;
- retained PERFECT combo multiplier and local best score;
- added synthesized hit/PERFECT/miss audio with persistent mute;
- added pause/resume and automatic pause when the page is backgrounded;
- added keyboard support (Space/Enter to stop; P/Escape to pause);
- added canonical KGBA game page and `/play/` route.
