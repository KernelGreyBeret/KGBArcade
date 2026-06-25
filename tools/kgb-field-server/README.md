# KGB Field Server PWA

Tiny phone-side test launcher for KGB Arcade builds.

## What changed in v1.0.1

Fixes Android/Chrome ZIP loading error:

> Failed to execute 'put' on 'IDBObjectStore': The transaction is not active.

The file save routine now queues IndexedDB writes synchronously inside one active transaction instead of yielding during the transaction.

## Install

Upload this folder somewhere under your site, for example:

```text
/tools/field-server/
```

Then open:

```text
https://kgbarcade.com/tools/field-server/
```

In Chrome on Android, use:

```text
⋮ menu → Add to Home screen / Install app
```

## Use

1. Zip a game folder.
2. Open KGB Field Server.
3. Tap **Load Game ZIP**.
4. Pick the launch file, usually `index.html`.
5. Tap **Launch**.

## Notes

This is not a real localhost daemon. It is a PWA virtual server powered by a service worker and IndexedDB. Relative paths are the target. Root paths like `/assets/file.png` may need to become relative paths like `assets/file.png`.
