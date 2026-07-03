# KGB Forge v0.1

Static production-tool shell plus Repo Forge.

## Run

Open `index.html` in a browser. For GitHub commits from Android, hosting it on GitHub Pages is recommended so the JSZip CDN and GitHub API calls work cleanly.

## Repo Forge workflow

1. Create a GitHub fine-grained Personal Access Token with Contents: Read and Write for the target repo.
2. Open KGB Forge.
3. Enter token, owner, repository, branch, destination path, and commit message.
4. Select a `.zip` containing the folder/files.
5. Preview the file list.
6. Press **Commit to GitHub**.

## Notes

- Files are committed through GitHub's Git API in one commit.
- Junk files are skipped: `.DS_Store`, `__MACOSX`, `Thumbs.db`, `desktop.ini`, `.git`.
- The branch update uses `force:false`, so it should fail instead of clobbering unexpected branch movement.
- Token storage is optional. It is stored only in browser localStorage when selected.

## Structure

```text
index.html
css/forge.css
js/app.js
js/shell.js
js/ui.js
js/settings.js
js/notifications.js
js/modules/repoforge.js
```
