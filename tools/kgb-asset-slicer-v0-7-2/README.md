# KGB Asset Slicer v0.7.2

Generic source-sheet cropper for KGB Arcade, TankTots Learn, and other static web game assets.

## v0.7.2 changes

- Target file tiles now support filename-driven crop creation.
- Click an available target filename to create a new crop assigned to that filename when no crop is selected.
- Click a target filename while a crop is selected to assign that selected crop to the filename.
- Double-click a target filename, or use the `New Crop` button, to create a new crop assigned to that filename.
- If a target filename is already assigned, clicking it selects the crop that owns it instead of silently duplicating filenames.
- Export Active Sheet ZIP still exports only the crops for the active source sheet.

## Workflow

1. Load one source sheet.
2. Attach the target images folder you want to overwrite.
3. Click target file tiles to create/assign crop boxes.
4. Move and resize each crop on the sheet.
5. Export Active Sheet ZIP or Write Active to Folder.


## v0.7.2 hotfix

- Reworked target filename tile clicks with delegated event handling.
- Clicking a filename tile now reliably assigns the selected crop, selects an existing assigned crop, or creates a new crop when none is selected.
- Double-clicking a filename tile creates a new crop assigned to that filename.
- Tile buttons now use explicit button handlers through the same event path.
