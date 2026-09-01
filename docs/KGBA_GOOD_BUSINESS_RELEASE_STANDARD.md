# KGBA Good Business Release Standard v1.0

A KGB Arcade game is not fully shipped merely because it runs.

A public release is complete when **software, ownership, provenance, install metadata, release metadata, and validation evidence travel together**.

## Mandatory public-release envelope

```text
games/<slug>/
  index.html
  game.json
  CHANGELOG.md
  smoke-test.html

  play/
    index.html
    manifest.webmanifest
    sw.js
    icon-192.png
    icon-512.png
    icon-maskable-512.png
    screenshots/
      screenshot-wide.png
      screenshot-narrow.png

  manifest/
    kgb-production-release.json
    provenance.json
    license.txt
    attribution.txt
    release-notes.txt
    production-readme.txt

  archive/
    <historical source when actually recoverable>
```

`archive/` is optional. **Provenance is not optional.**

## Provenance statuses
- `recovered-original`
- `recovered-and-modified`
- `canonical-rebuild`
- `new-production-build`

Never label a canonical rebuild as recovered original source.

## Ownership/business records
Every public release records creator, rights holder, publisher, website, contact, license, external attribution status, and provenance. An attribution file explicitly says when no third-party runtime assets are declared.

## PWA contract
Every public v1 declares 192 and 512 icons, a dedicated 512 maskable icon, wide and narrow screenshots, and a version-specific service-worker cache identity.

Representative launch/branding screenshots are allowed but must not be presented as gameplay captures.

## Validation
Every game gets `smoke-test.html` for machine-checkable packaging. Manual play still covers start, representative play, fail/loss, retry, finish/result, desktop, phone, persistence, and Arcade-True.

## Homepage independence
The release envelope does not require an immediate homepage update. Arsenal reconciliation may be batched.
