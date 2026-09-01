# P0.GB — KGBA Good Business Retrofit

This is a **non-gameplay Repo Forge overlay** for the 11 Priority Zero public releases.

## Adds / standardizes
- per-game license
- attribution
- provenance
- structured production release manifest
- production README
- release notes
- browser smoke-test
- dedicated maskable PWA icon
- wide + narrow PWA screenshots
- enriched PWA manifest
- version-specific service-worker cache identity

**No root homepage or root games.json changes are included.**

Spin Stop is also normalized into the PWA contract because P0.2 predated the PWA wrapper used on the later releases. Its play HTML receives only the manifest/service-worker hooks; gameplay code is not changed.

## Games

| Slug | Game | Public | Provenance | Archived source |
|---|---|---:|---|---|
| `spin-stop` | Spin Stop | 1.0.0 | `recovered-and-modified` | `archive/historical_spin_stop_perfect_combo.html` |
| `riftwake` | Riftwake: Signal Skimmer | 1.0.0 | `canonical-rebuild` | `—` |
| `jungle-breakout` | Jungle Breakout | 1.0.0 | `canonical-rebuild` | `—` |
| `sector-kgb` | Sector KGB | 1.0.0 | `canonical-rebuild` | `—` |
| `monster-truck-mayhem` | Monster Truck Mayhem | 1.0.0 | `canonical-rebuild` | `—` |
| `bayou-breakout` | Bayou Breakout | 1.0.0 | `canonical-rebuild` | `—` |
| `relay-runner` | Relay Runner | 1.0.0 | `canonical-rebuild` | `—` |
| `ninja-panda` | Ninja Panda | 1.0.0 | `canonical-rebuild` | `—` |
| `canyon-run` | Canyon Run | 1.0.0 | `canonical-rebuild` | `—` |
| `cluck-and-cover` | Cluck & Cover | 1.0.0 | `new-production-build` | `—` |
| `kernel-courier` | Kernel Courier | 1.0.0 | `new-production-build` | `—` |

## Deploy
1. Load `KernelGreyBeret/KGBArcade` `main` in Repo Forge.
2. Import this ZIP at repository root.
3. Inspect.
4. Commit/push.
5. Open each `/games/<slug>/smoke-test.html`.
6. Confirm automatic checks PASS.
7. Homepage reconciliation remains deferred.

Suggested commit:

`P0.GB: retrofit KGBA good-business release envelopes`

See `docs/KGBA_GOOD_BUSINESS_RELEASE_STANDARD.md`.
