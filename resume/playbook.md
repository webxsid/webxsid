# Portfolio audit — Siddharth Mittal

This applies resume-forge's evidence, credit, scope and self-review rules to a professional introduction. ATS pagination, salary research, PDF/DOCX variants and LinkedIn rewriting are outside this request. Keep the website's personality and editorial typography.

## Research rules applied
- GitLab's senior backend framework emphasizes production understanding and technical judgment. Show concrete failure modes and decisions rather than a list of services. https://handbook.gitlab.com/handbook/engineering/careers/matrix/development/dev/backend/senior/
- Amazon's candidate guidance distinguishes accomplishments from responsibilities. Use supported before/after statements; do not manufacture metrics to make a bullet look stronger. https://www.aboutamazon.com/news/workplace/amazon-job-application-resume-writing-tips
- These are useful employer examples, not a claim about the entire hiring market. Target-market and salary research is deferred until an actual résumé/role-targeting task.

## Whole-page assessment
| Area | Finding | Action |
|---|---|---|
| Header | Five section links make a short introduction feel like a second site | Removed links; kept identity, personal-site link and theme picker |
| Introduction | Split headline/paragraph makes the reader jump sideways; philosophy takes space before evidence | Stacked copy below oversized name; introduction names actual Taptic systems and independent Go tools |
| Expertise | Heading repeats a vague application/infrastructure slogan | Replaced with direct domain wording; retained three grounded descriptions |
| Selected work | Strong source material; headings and retrospective paragraphs sometimes obscure concrete engineering | Clear section title; keep product, contribution and native technical notes; do not promote wishes into achievements |
| Taptic | Strong failure/recovery and observability evidence, weak measurable scope and ownership | Keep conservative contributor wording; collect scope and ownership questions |
| Crona | Daemon/CLI/TUI separation is a useful independent architecture example | Retain explicit architecture, SQLite and offline behavior; no invented adoption |
| Appyhigh | In-house conversion is a supported before/after; PowerPoint must remain a prototype | Preserve that distinction and avoid unsupported savings or performance claims |
| Experience | Huge empty heading column and duplicated project narrative weaken chronology | Full-width rows: company, title, dates, then concise factual bullets |
| Beyond work | Intentional path to the personal site is useful | Retain link and real writing/project destinations; align in one reading flow |
| Contact | Clear email and real profile links | Retain; résumé remains an honest stub |
| Overall seniority | Production detail exists, but ownership, scale and influence remain underspecified | Open questions in facts.md; no invented leadership or impact |

## Self-review
| Check | Result |
|---|---|
| Claim traceability | Existing claims mapped to repository sources and user-supplied titles |
| Metrics | No new metrics, adoption, savings or uptime guarantees |
| Honest credit | Migration stays “contributed”; PDF-to-PowerPoint stays “prototype” |
| Titles/dates | Explicit user-supplied portfolio values retained; discrepancies documented |
| Plain language | Removed decorative section slogans; kept technical terms where informative |
| Senior-role evidence | Partial; scope, ownership and influence remain open questions |
| Résumé availability | Clearly pending; no fake download |

## Decisions
- Keep all unanswered questions together for the user to answer later.
- Keep the header but remove section navigation links.
- Preserve shared themes, oversized name, native disclosures and isolated styles.
- Do not alter personal-site content or README.

## Follow-through — October 11, 2026

The finalized answers in facts.md supersede the open-question assessment above. Applied to the portfolio:

| Before | Portfolio draft after audit |
|---|---|
| General backend/migration contributor | Backend framework designer and primary backend owner across two platforms |
| Senior Software Engineer shown for the whole Taptic period | Formal Platform Developer and Senior Platform Developer roles with May 2025 promotion |
| Mostly terminal-focused Crona | Shared daemon with CLI, TUI and native macOS interfaces; dated stable releases |
| Conversion pipeline delivery stage unclear | PDF-to-Word shipped; PowerPoint remained a prototype |
| Scheduling work absent | Approximate 90-to-20-second observed POC result, with period, test context and discontinuation in expanded notes |
| Projects split across distant columns | One project reading column, with descriptive native disclosures |
| Expertise spread across wide rows | Three compact typography-led columns on desktop, stacked on mobile |

### Final copy checks
- Every substantive new claim maps to facts.md; no new impact numbers or leadership titles invented.
- Primary ownership is supported; overall migration leadership and staffing departures are omitted.
- The migration remains preparing for rollout as of October 2026; no completed-migration benefit is claimed.
- POC timings remain approximate logged observations under comparable conditions, not an average or production benchmark. The visible supporting paragraph names the POC and February–May 2025 period; expanded notes explain test batches and business discontinuation.
- The 15–20 interviews/day capacity statement stays out of copy because platform/period and capacity-versus-observed-volume are not yet precise.
- k6 experimentation, GitHub star counts, unmeasured cost/quality improvements, relocation restrictions and proprietary implementation details are omitted.
- Employment dates remain exact; project/release periods are dated where appropriate.
- No résumé PDF/DOCX or LinkedIn publishing was requested; résumé stays pending.

### Design checks
- Keep the oversized name, shared palette tokens, compact header without section navigation and restrained motion.
- Main copy has a consistent left edge and bounded line length; no empty heading sidebar in experience.
- Promotion appears as two dated roles under one employer; shared employer accomplishments avoid falsely assigning undated work to a specific title.
- Descriptive summary labels expose what readers can expand; native details preserve keyboard and no-JavaScript behavior.

### Verification completed

| Gate | Evidence |
|---|---|
| Production build | `pnpm build`: 98 files checked, zero errors/warnings/hints; 27 static pages built |
| Portfolio artifact checks | `node scripts/check-portfolio.mjs`: route, six sections, anchor targets, real local links, SEO, sitemap, formal titles/dates, POC and rollout qualifications, native disclosures |
| Responsive review | Firefox at 1440px desktop, 768px tablet, 375px and 320px mobile; project reading column, dates, wrapping and contact links inspected |
| Keyboard | Tab reaches skip link and project summary; Space expands technical notes with visible focus |
| No JavaScript | Session-only JavaScript disable: native Taptic disclosure opened and all three note headings became available; JavaScript restored afterward |
| Reduced motion | Browser emulation activates the reduced-motion rule; section destination and disabled transitions inspected |
| Theme | Light and System selections work at 320px; picker fits; original Graphite/System restored |
| Preservation | Personal/shared source, README, package manifest and lockfile match pre-audit hashes; portfolio CSS loads on portfolio and not personal home |
| Patch hygiene | `git diff --check` passes |
