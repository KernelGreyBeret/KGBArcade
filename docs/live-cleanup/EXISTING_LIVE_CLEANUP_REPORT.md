# KGBA Existing-Live Cleanup Report — 2026-08-31

This pass is intentionally **non-destructive**. The owner plans to replace/tweak several game runtimes with better versions.

| Game | Current package condition | Action in this overlay |
|---|---|---|
| Kid Jam | Existing PWA + release-era manifest | Canonicalized as Kid Jam v1.0.0; full release wrapper, screenshots, provenance, smoke test; runtime unchanged |
| Arc Defender | Existing PWA + archive/icons/manifest; benchmark package | Added root release metadata/provenance/smoke test only |
| StarWarp | Existing PWA + archived/source HTML | Added root release metadata/provenance/smoke test only |
| HyperHop | Root PWA/service worker + manifest folder | Added release metadata/provenance/smoke test only |
| TankTots Learn | Root PWA + production manifest/decks | Added release metadata/provenance/smoke test only |
| Cozy Cat Playground | Live index + banners only | Added business/provenance metadata; PWA deferred to preferred replacement build |
| Lawn Mower Mania | Live index + banners only | Added business/provenance metadata; PWA deferred to preferred replacement build |
| Firetruck Rescue | Live index + banners only | Added business/provenance metadata; PWA deferred to preferred replacement build |
| Tommy the Tank | PWA exists, but repo folder has a literal leading space | Audit-only; clean-path migration deferred to preferred replacement build |

## Why the three TankTots arcade games are not forcibly converted now

A PWA conversion would require touching their current `index.html` runtimes to add manifest/service-worker hooks. Because replacement builds are imminent, this pass avoids modifying a runtime that is about to be superseded.

When the preferred Cozy/Lawn/Firetruck files arrive, package each one directly into the full current KGBA release contract rather than performing two migrations.

## Homepage

No homepage or root `games.json` edits are included. Those remain stacked until final Arsenal reconciliation.
