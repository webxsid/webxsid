# Content Workflow

The content files live in the repo under `src/content`. Obsidian is a managed mirror, not a second source of truth.

## Mirror

- Repo source: `src/content/<collection>/*.md`
- Obsidian mirror: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Webxsid/Portfolio`
- Collections mirrored one-to-one:
  - `projects`
  - `writing`
  - `notes`
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

## Content authoring

Git remains the canonical CMS. The Markdown/MDX files in this repository are the source of truth; Pages CMS is an optional editor that saves the same files back to GitHub.

### Local

Edit files directly in `src/content` (or through the managed Obsidian mirror), then run the relevant checks before committing. Content lives in `projects`, `writing`, `notes`, `now`, `references`, and `work`.

### Pages CMS

Open the configured Pages CMS instance, sign in with GitHub, choose this repository and branch, then edit or create entries in the content collections. Saving creates a normal Git commit, so this workflow and direct local edits are equivalent.

#### Dedicated authoring branch

Use a dedicated branch named `pages-cms` for Pages CMS edits:

1. Create `pages-cms` from the current `main` branch and select it in the Pages CMS repository/branch picker.
2. Keep Pages CMS edits and commits on `pages-cms`.
3. In the Cloudflare Pages project settings, set `main` as the production branch and disable automatic preview deployments for `pages-cms` (or add it to the preview-branch ignore rules).
4. Merge or cherry-pick the reviewed `pages-cms` changes into `main` when they are ready to publish.

This keeps routine authoring commits from triggering portfolio deployments. The branch selection is intentionally operational: Pages CMS reads `.pages.yml` from the branch currently open in the editor, while Cloudflare's production/preview branch filters are configured in the Cloudflare project. There is no supported `.pages.yml` key that forces a write branch, so do not add a synthetic `branch` setting.

Pages reads the root [`.pages.yml`](../.pages.yml) configuration. Uploaded article images are committed under `public/images` and are written into Markdown as `/images/...` paths.

Writing entries default to `draft: true`. Drafts are available at `/writing/draft/[slug]`, are marked `noindex`, and are excluded from the public writing index, RSS feed, and sitemap until `draft` is disabled.

Notes live in `src/content/notes` and contain Markdown body text only: do not add frontmatter. Their `YYYY-MM-DD-HHmmss.md` filenames are their permanent URLs and publication timestamps; committing a note publishes it to `/notes`, the RSS feed, and the sitemap.

Writing, projects, work, and references use Pages' Markdown editor with a Source mode for Markdown that needs exact control. The `now` collection permits both Markdown and MDX, so Pages intentionally exposes its body as source-only Markdown/MDX; do not use a visual editor for MDX components or custom syntax.

Pages CMS edits Notes with its raw file editor so it never writes frontmatter around the Markdown body.

The Notes board uses the `masonry-layout` client library to create a true two-dimensional masonry layout and relayout cards when a note expands. The board keeps the same Markdown and URL model; the package only controls presentation. When CSS Grid Lanes/Masonry is broadly supported in stable browsers, the client initializer can be replaced with the finalized native CSS masonry rule without changing note content or markup contracts.

### Future self-hosting

Pages CMS remains separate from the portfolio deployment. A self-hosted Pages instance needs its own PostgreSQL database, HTTPS URL, and GitHub App/OAuth configuration (including repository Contents read/write access and webhooks). This repository only supplies `.pages.yml`; it does not deploy or run Pages CMS.
