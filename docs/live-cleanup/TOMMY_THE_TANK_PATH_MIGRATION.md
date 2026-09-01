# Tommy the Tank — Path Migration Hold

## Finding

The current repository folder is literally:

`games/ tommy-the-tank/`

with a leading space.

The ordinary raw path:

`/games/tommy-the-tank/index.html`

returns 404, while the encoded leading-space path:

`/games/%20tommy-the-tank/index.html`

resolves.

## Decision

Do **not** rename or overwrite Tommy during the Existing-Live cleanup pass.

The owner has indicated a better Tommy build will be supplied. Use that replacement as the deliberate migration point to:

`/games/tommy-the-tank/`

Then:
1. deploy the preferred runtime at the clean path,
2. provide a compatibility redirect if any old `%20tommy-the-tank` links remain,
3. regenerate PWA scope/cache metadata,
4. generate the full Good Business envelope,
5. update homepage/registry references once.

Current live source build observed: `tommy_the_tank_v8.html` with a `pwa/` package.
