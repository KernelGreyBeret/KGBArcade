# Priority Zero — Repo Forge Deployment

This ZIP is an OVERLAY for the existing KernelGreyBeret/KGBArcade repository.

IMPORTANT:
- Load/select the EXISTING KGBArcade repository in Repo Forge FIRST.
- Then import this ZIP into that loaded repository state.
- Do NOT treat this ZIP as a brand-new repository.
- The ZIP intentionally has no wrapper directory. Its first-level paths are:
  - docs/
  - games/
  - games.json
- Files already in the repository but absent from this ZIP should remain untouched.

What this overlay adds/replaces:
- docs/ARCADE_TRUE.md
- docs/KGBA_RELEASE_STANDARD.md
- docs/PRIORITY_ZERO_CHECKLIST.md
- games.json
- games/cozy-cat-playground/kitty_playground_jump_climb_pounce.html
- games/lawn-mower-mania/mower_mania.html
- games/firetruck-rescue/firetruck_dash.html

This RepoForge edition intentionally omits the Python patch/validation scripts from the
earlier package because they are meant for a local command-line Git checkout.

Recommended commit message:
Priority Zero: restore games and establish KGBA release standard

Before commit/push, use Repo Forge's file tree / change preview and confirm that the
three HTML files land INSIDE their existing game folders, not directly under /games/.

After deployment, smoke-test:
1. Cozy Cat Playground
2. Lawn Mower Mania
3. Firetruck Rescue
4. Arc Defender
5. Tommy the Tank
6. StarWarp
7. HyperHop
8. TankTots Learn
9. Kid Jam

If a current page still points at a stale filename after the playable file is present,
patch that page as a separate tiny commit rather than moving the game file again.
