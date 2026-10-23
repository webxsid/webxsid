# AGENTS.md

Guidance for coding agents working in this repository: Siddharth Mittal's personal site and portfolio, deployed at https://webxsid.com.

## Stack

- Astro 6, static output (`output: "static"`), deployed to Cloudflare (`wrangler.jsonc`, output in `./dist`).
- Tailwind CSS v4 via `@tailwindcss/vite`; design tokens in `src/styles/tokens.css`.
- React 19 only for the shell header (`src/components/react/header/`). Everything else is Astro components with small inline scripts.
- MDX, Shiki (CSS-variable theme, `--code-*`), Zod content schemas.
- Node `>=22.12.0` (see `.node-version`), pnpm.

## Commands

```bash
pnpm install
pnpm dev               # http://localhost:5868
pnpm build             # astro check + astro build
pnpm check             # astro check only
pnpm check:portfolio   # run after pnpm build; verifies /portfolio output and /resume.pdf
pnpm prose:check       # cspell over README, docs, src markdown and astro files
pnpm content:sync|new|delete|list|doctor   # Obsidian mirror management
```

## Layout

- `src/pages/` – routes: `/`, `/projects`, `/writing` (plus `/writing/draft/[slug]`), `/notes`, `/references`, `/now`, `/work/[slug]`, `/colophon`, `/rss`, `/portfolio`, `/resume.pdf`, OG image endpoints.
- `src/layouts/BaseLayout.astro` – personal-site shell (header, sidebar/mobile dock, footer, view transitions).
- `src/layouts/PortfolioLayout.astro` – the portfolio page's own layout, with an isolated stylesheet (`src/styles/portfolio.css`).
- `src/components/` – `shell/`, `rail/`, `content/`, `notes/`, `portfolio/`, `icons/`, `react/`.
- `src/lib/` – helpers: SEO, OG images (Satori + resvg, templates in `src/templates/`), link previews and the backlink graph (`content-links.ts`, `link-preview.ts`), résumé PDF (PDFKit).
- `src/data/portfolio.ts` – single source for the portfolio page. `src/data/resume.ts` builds on it.
- `src/styles/themes/` – six theme families (graphite, e-ink, phosphor, retro, doodle, calm), each with light and dark modes.
- `docs/` – `portfolio.md` and `content-workflow.md`. Read these before changing those areas.
- `resume/facts.md` – the claim ledger. `resume/playbook.md` – portfolio audit notes.

## Content

Collections are defined in `src/content.config.ts`: `projects`, `writing`, `notes`, `now`, `references`, `work`.

- Git is the source of truth. Pages CMS (`.pages.yml`) and the Obsidian mirror (symlinks managed by `scripts/content-manager.mjs`) both edit the same files.
- When you change a collection's schema, update `.pages.yml` and `scripts/content-templates.mjs` to match.
- `notes` entries have no frontmatter and are named with a timestamp (`YYYY-MM-DD-HHMMSS.md`).
- `notes` and `references` use a loader that tolerates an empty folder. Nav items for references, notes and now are hidden when their collection is empty.
- Uploaded media go in `public/images/` and are referenced as `/images/...`.
- New writing defaults to `draft: true`.

## Rules

- **Professional claims must trace to `resume/facts.md`.** Never invent metrics, adoption figures, titles or scope. Keep the qualified wording the ledger uses (e.g. migration work was "contributed"; PDF-to-PowerPoint was a "prototype").
- Formal titles: Platform Engineer (February 2024 – April 2025), then Senior Platform Engineer (May 2025 – Present), at Galent / Taptic.ai. The personal-site `work` entries use informal titles on purpose; leave them alone unless asked.
- The portfolio is one page with no detail routes. Its content belongs in `src/data/portfolio.ts`, not in content collections.
- The site must work without JavaScript (native anchors and `<details>` disclosures) and must respect `prefers-reduced-motion`.
- Theme work must hold up in every family, in both light and dark.
- `README.md` is the GitHub profile README. Don't change it unless asked.
- Match the surrounding code style. Prettier is set up with the astro and tailwind plugins.

## Verification

For portfolio or résumé changes: run `pnpm build`, then `pnpm check:portfolio`, then preview at 1440, 768, 375 and 320px. For all other changes: `pnpm build` must pass (it includes `astro check`).
