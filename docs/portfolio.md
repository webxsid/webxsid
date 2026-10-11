# Portfolio

`/portfolio` is one statically generated professional introduction. Its six sections are Introduction, Expertise, Selected Work, Experience, Beyond Work, and Contact. The header retains the wordmark, personal-site link, and theme picker without section navigation. The personal site's routes, content, layout, and navigation remain separate.

## Updating content

Edit `src/data/portfolio.ts`. It contains positioning, contact links, three expertise areas, selected work, employment history, and links to the personal website. There are no portfolio content collections, detail pages, or content-management dependencies.

Selected work covers Taptic, Crona, and Appyhigh. Keep product context, personal contributions, and engineering challenges specific. Technologies are plain text; optional technical notes use native browser disclosures. Link to existing personal-site articles and projects instead of duplicating their full content.

The résumé is a PDF built on every `pnpm build` at `/resume.pdf` (`src/pages/resume.pdf.ts`, rendered by `src/lib/resume-pdf.ts` with PDFKit; no browser needed). Its content is `src/data/resume.ts`, which takes identity, links, employers and dated roles from `src/data/portfolio.ts` and adds only résumé-specific bullets and skills, so the two cannot drift. Layout follows resume-forge's ATS rules: one A4 column, real embedded TrueType text (Geist), standard headings, URLs written out, no tables or icons. Add an entry to `resume.education` and an Education section appears; it is omitted while empty. Claims trace to `resume/facts.md`. LinkedIn is `https://linkedin.com/in/webxsid`.

The portfolio uses the finalized formal titles: Platform Engineer (February 2024–April 2025), then Senior Platform Engineer (May 2025–Present), under Galent / Taptic.ai. Existing personal-site employment entries remain unchanged. `resume/facts.md` records sources and qualifications. The scheduling result is explicitly a POC observation from February–May 2025; the replacement platform is preparing for rollout as of October 2026. Unadopted k6 experimentation and stale GitHub star counts are omitted.

## Design and behavior

`PortfolioLayout.astro` loads the isolated portfolio stylesheet and shared theme bootstrap. Astro section components render the page without framework hydration. The existing palette picker retains the personal site's saved preferences and System / Light / Dark icon behavior.

A compact sticky header keeps the wordmark, personal-site link, and theme picker on one row. Hero copy and projects follow a single reading column. Expertise uses three plain columns on desktop and stacked rows on mobile; experience groups dated roles beneath each employer to show the promotion. Project disclosures have descriptive labels and work without JavaScript. Native anchors and technical disclosures work without JavaScript. Reduced-motion preferences disable smooth scrolling and transitions.

The current multi-page implementation was preserved in local Git commit `8904781` before replacement. There are no backup copies or nested portfolio routes.

## SEO and deployment

The shared SEO component supplies title, description, Open Graph, and Twitter metadata, using the existing `/og` image. Person structured data identifies the author and professional profiles. The sitemap contains only the portfolio's single canonical URL alongside the unchanged personal-site entries.

Canonical generation remains centralized in `src/lib/portfolio.ts`. It defaults to `https://webxsid.com/portfolio`; `PUBLIC_PORTFOLIO_BASE_URL=https://portfolio.webxsid.com/` changes metadata and the sitemap at build time. It does not configure subdomain routing, Workers, or redirects.

## Verification

Run `pnpm build`, followed by `node scripts/check-portfolio.mjs`. The checker verifies a single generated route, section order, anchors, existing project/article links, canonical metadata, sitemap entries, structured data, the built one-page résumé PDF, and native disclosures.

Preview at 1440px, 768px, 375px, and 320px. Check keyboard focus, sticky-header anchor offsets, expanded notes, light/dark appearance, theme persistence, reduced motion, and navigation without JavaScript. README is intentionally unchanged.
