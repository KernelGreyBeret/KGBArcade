# KGBA Priority Zero — Production Reset

## Objective

Stop branch/name/path drift, restore every already-advertised playable title, establish a single source of truth, and prevent another playable game from disappearing into prototype/version chaos.

## P0.1 — Immediate live repair

These are mechanical fixes, not development projects.

### Arc Defender — Rhythm Rings
- Current folder already contains `arc_defender_v2.html`.
- Current game page incorrectly links to missing `arc_defender.html`.
- Patch Play Now → `arc_defender_v2.html`.
- Smoke-test desktop and mobile.
- Public release target after gate: `v1.0.0`.

### Cozy Cat Playground
- Public page expects `kitty_playground_jump_climb_pounce.html`.
- Priority Zero overlay restores that exact playable file.
- Change Arsenal badge `Updating` → `Live` after smoke test.
- Fix malformed extra `<` in the Arsenal description.

### Lawn Mower Mania
- Public page expects `mower_mania.html`.
- Priority Zero overlay restores the known v5 Hum + FX build under that exact filename.
- Change Arsenal badge `Updating` → `Live` after smoke test.

### Firetruck Rescue
- Public page expects `firetruck_dash.html`.
- Priority Zero overlay restores the known Tap & Spray build under that exact filename.
- Change Arsenal badge `Updating` → `Live` after smoke test.

### Kid Jam
- Repository README identifies the current `kids_mash` package as **Kid Jam Beat Party PWA**.
- Change the public display name from `Kids Mash` → `Kid Jam` now.
- Do not break the existing `/games/kids_mash/` path during the emergency repair.
- Later canonical migration: `/games/kid-jam/` with a compatibility redirect from `/games/kids_mash/`.

### Tommy the Tank
- Root Arsenal currently contains `/games/ tommy-the-tank/` with a leading-space path.
- Canonical target is `/games/tommy-the-tank/`.
- If the directory itself truly contains the leading space in a local checkout, rename it.
- Patch root links/assets to the canonical path.
- Preserve the currently working `pwa/` launch target.

## P0.2 — Source of truth

Replace the current one-game `games.json` registry with the Priority Zero registry.

The registry is not required by the existing hand-authored homepage yet; its first purpose is governance:

- one canonical title;
- one slug;
- one vault/family;
- one current status;
- aliases/predecessors recorded rather than duplicated;
- one target public version;
- one explicit next action.

Future Arsenal generation should consume this registry instead of hard-coding catalog state in `index.html`.

## P0.3 — Validate before deploy

Run:

```bash
python tools/apply_priority_zero.py --dry-run
python tools/apply_priority_zero.py
python tools/validate_kgba.py
```

Then manually smoke-test:

1. root Arsenal on phone;
2. root Arsenal on desktop;
3. Tommy;
4. StarWarp;
5. HyperHop;
6. Arc Defender;
7. Cozy Cat;
8. Lawn Mower Mania;
9. Firetruck Rescue;
10. TankTots Learn;
11. Kid Jam.

## P0.4 — Freeze rule

Until Priority Zero passes:

- do not create another renamed game branch;
- do not create a new public slug;
- do not start another engine migration;
- do not rename a deployed game without registry + redirect handling;
- do not make visual polish block a release repair.

## Exit criteria

Priority Zero is complete when:

- every title marked `Live` actually launches;
- no advertised live Play button points to a missing file;
- canonical names/aliases are recorded;
- Arcade-True doctrine and Release Standard are in repo docs;
- `games.json` represents the real catalog/backlog;
- the validation script reports no missing local targets among live games;
- the next work item can be selected from the registry without archaeology.
