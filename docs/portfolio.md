# Portfolio

The statically generated `/portfolio/*` experience is independent of the personal site's layout and navigation. It reuses the portfolio typography, spacing, and the site's existing theme palettes. Every page shares `PortfolioLayout.astro`, navigation, footer, and the theme picker. Preferences carry across the personal site and portfolio.

## Routes and templates

- `/portfolio`: overview and selected projects/case studies.
- `/portfolio/work`: public engineering case studies.
- `/portfolio/work/[slug]`: technical narratives organized around an engineering problem.
- `/portfolio/projects`: independently built software.
- `/portfolio/projects/[slug]`: project descriptions, metadata, optional screenshots, and related case studies.
- `/portfolio/experience`: professional timeline.
- `/portfolio/contact`: email, GitHub, and an optional resume link.

The reusable templates live in `src/components/portfolio`: `CaseStudy`, `ProjectDetail`, `ExperienceTimeline`, and `PortfolioListing`. Detail pages include breadcrumbs. The mobile navigation uses native disclosure markup and works without JavaScript. Theme selection is the only portfolio-specific client script; no client framework or SSR is used.

## Content

Schemas are in `src/schemas/portfolio.ts`, registered in `src/content.config.ts`. All portfolio collections accept Markdown or MDX and live separately under `src/content/portfolio`:

- `portfolioProfile`: positioning, contact information, focus, and an approach body. An optional resume accepts `label` and `href`. No placeholder resume is shown.
- `portfolioProjects`: description, status (`active`, `maintained`, `archived`), optional stage, role, technologies, optional start date, website/repository links, featured flag, ordering, screenshots, and case-study references.
- `portfolioCaseStudies`: title, summary, organization or project reference, role, optional period, technologies, category, featured flag, visibility, and Markdown narrative. Optional problem/contribution/outcome fields support short summaries. Sections in the body are optional, not schema-mandated. Related case-study references are supported.
- `portfolioExperience`: company, role, period, website, responsibilities/achievements, ordering, and introductory body.

Projects and case studies use validated Astro collection references. A case study can reference a project; a project can explicitly select related case studies. Project pages also discover public case studies that reference them. Related content never lists draft or unlisted entries.

Crona and Pebbles project overviews are adapted from existing content. Start dates and screenshots are unknown, so they remain optional with explicit TODOs in their source files. Pebbles is marked “In development”; active describes ongoing project work, not a production launch. No dates, screenshots, metrics, or implementation decisions have been invented.

The Taptic scaffold is available directly at `/portfolio/work/reliable-interview-workflows`. It is `draft: true` and `visibility: unlisted`, carries noindex metadata, and is excluded from navigation, listings, related work, and the sitemap. It is a publicly accessible review scaffold, not an access-controlled page. Its TODOs cover context, constraints, architecture, implementation, trade-offs, outcomes, and lessons. Fill these in together and confirm public sharing before setting `draft: false` and `visibility: public`.

The existing Crona engineering notes are retained as `/portfolio/work/local-first-work-tracking`. The existing Scanner Go notes remain unlisted at `/portfolio/work/in-house-document-conversion`; they are not a newly authored deep dive. No duplicate project/case-study URLs are created for the same content.

The employment timeline retains the existing Taptic and Appyhigh information. Confirm any company-name or role changes before editing it. The example “Galent” in the plan does not supply enough evidence to replace a current employer.

The editorial content CLI and Pages CMS configuration still manage the personal site's collections, not these portfolio files. README remains unchanged.

## SEO and future hostname

Every portfolio page has its own title, description, canonical URL, and Open Graph metadata. Project pages use SoftwareSourceCode structured data; case studies use Article; the overview uses Person. Public routes are included in the sitemap; drafts and unlisted case studies are excluded.

`src/lib/portfolio.ts` centralizes canonical generation. Defaults are `https://webxsid.com/portfolio/*`. At build time, `PUBLIC_PORTFOLIO_BASE_URL=https://portfolio.webxsid.com/` changes portfolio canonicals and sitemap locations to the new origin without editing individual pages. Routes and internal navigation remain under `/portfolio/*` for now; hostname routing and redirects are a separate deployment task. A CNAME alone cannot map a hostname to a path.

## Verification

Run `pnpm build`, then `node scripts/check-portfolio.mjs`. The artifact check verifies all portfolio routes, local links/fragments, unique SEO metadata, structured data, sitemap visibility, and absence of client framework hydration. Preview desktop and mobile layouts, breadcrumbs, navigation, project/case-study relationships, and theme preferences.
