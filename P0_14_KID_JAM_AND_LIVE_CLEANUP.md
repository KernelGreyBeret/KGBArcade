# P0.14 — Kid Jam + Existing-Live Cleanup

Repo Forge overlay. Import at the repository root.

## This package does

1. Canonicalizes **Kid Jam** as public v1.0.0 while preserving `/games/kids_mash/`.
2. Adds Good Business release metadata and smoke tests to stable existing-live games.
3. Leaves all existing gameplay runtimes untouched.
4. Flags Cozy Cat, Lawn Mower, and Firetruck PWA conversion for the preferred replacement builds.
5. Records the current Tommy leading-space path defect rather than risking a breaking rename.
6. Leaves homepage/root registry changes deferred.

Suggested commit:

`P0.14: release Kid Jam and normalize existing-live metadata`

## After deploy

Run:
- `/games/kids_mash/smoke-test.html`
- `/games/hyperhop/smoke-test.html`
- `/games/starwarp/smoke-test.html`
- `/games/arc-defender/smoke-test.html`
- `/games/tanktots_learn/smoke-test.html`
- `/games/cozy-cat-playground/smoke-test.html`
- `/games/lawn-mower-mania/smoke-test.html`
- `/games/firetruck-rescue/smoke-test.html`

Then move on to owner-selected replacement/tweak builds one game at a time.
