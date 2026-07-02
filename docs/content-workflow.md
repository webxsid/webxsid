# Content Workflow

The content files live in the repo under `src/content`. Obsidian is a managed mirror, not a second source of truth.

## Mirror

- Repo source: `src/content/<collection>/*.md`
- Obsidian mirror: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Webxsid/Portfolio`
- Collections mirrored one-to-one:
  - `projects`
  - `writing`
  - `references`
  - `work`
  - `now`

Every file in the vault mirror should be a symlink back to the repo file.

## Commands

```bash
pnpm content:sync
pnpm content:new <collection> <slug>
pnpm content:delete <collection> <slug>
pnpm content:list
pnpm content:doctor
```

### `pnpm content:sync`

- creates missing collection folders in the vault
- creates missing symlinks
- repairs wrong symlinks
- removes stale symlinks inside the managed mirror
- leaves real files untouched and warns on collisions

### `pnpm content:new <collection> <slug>`

- creates the Markdown file in `src/content`
- applies the collection template with full frontmatter
- creates the matching vault symlink
- when run without arguments, prompts for the collection and slug interactively
- when run with only the collection, prompts for the slug
- the slug prompt now suggests collection-aware defaults such as `new-project`, `new-writing`, `new-reference`, `new-work-entry`, or today’s date for `now`

Notes:

- `now` can omit the slug and defaults to the local date: `YYYY-MM-DD`
- new writing defaults to `draft: true`

### `pnpm content:delete <collection> <slug>`

- deletes the repo file
- removes the matching vault symlink
- refuses to touch vault files that are not symlinks
- refuses to remove symlinks that point somewhere else
- when run without arguments, prompts for the collection and then shows available slugs
- when run with only the collection, prompts from the available slugs in that collection

### `pnpm content:list`

Prints the managed content inventory grouped by collection, including:

- slug
- repo path
- vault path
- current link state

Possible states include:

- `linked`
- `missing vault symlink`
- `vault conflict`
- `broken symlink`
- `wrong target`

### `pnpm content:doctor`

Runs non-mutating diagnostics on the managed mirror and reports:

- missing vault symlinks
- broken symlinks
- wrong-target symlinks
- vault file conflicts
- stale symlinks

This command exits non-zero when problems are found.

## Authoring Rule

Edit the repo-backed files through the Obsidian mirror if you want, but do not create standalone Markdown files directly in `Portfolio`. If a real file exists there instead of a symlink, the tooling will treat it as a conflict and leave it alone.
