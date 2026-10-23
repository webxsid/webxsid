# Portfolio claim ledger

Updated: October 11, 2026.

Scope: factual source for the professional portfolio. This update records the user's finalized answers supplied on October 11, 2026; these are self-reported facts, not independently audited measurements. The later clarifications in that message supersede earlier answers where they conflict. Updating this ledger does not change published portfolio copy.

## Positioning and employment

- TITLE DECISION (user, October 11, 2026): use "Platform Engineer" → "Senior Platform Engineer", matching the user's own résumé. Earlier ledger entries below said "Developer"; they are updated to "Engineer". Formal HR designation was not independently verified.
- Appyhigh locations (user): remote during the internship (May 2022 – May 2023); moved to Hyderabad after conversion to full time (May 2023 – February 2024). Galent / Taptic.ai: remote.
- Verified by the user as accurate (from their résumé): the metadata-driven platform spans 29 backend-defined entities with dynamic UI generation; the generator produces CRUD modules and RBAC from a single configuration in under 2 minutes. This supersedes "no quantified time saving" for the generation step; there is still no measured percentage saved versus manual work.
- Other details from the user's résumé: OpenTelemetry and CloudWatch observability; event-driven workflows on AWS Lambda and Step Functions; Crona release automation with GoReleaser; Scanner Go has 20+ PDF tools; skills Python, Express.js, Mongoose, Firebase, Vercel, Docker, MySQL, PostgreSQL, Git; B.Tech in Computer Science and Engineering, 2019–2023.
- Keep the phone number off the public résumé; GitHub is github.com/webxsid (sm2101 is the old username).

- Galent / Taptic.ai · Platform Engineer · February 2024–April 2025 · source: user's finalized title clarification, October 11, 2026.
- Galent / Taptic.ai · Senior Platform Engineer · May 2025–Present · source: same clarification. Promotion confirmed in May 2025.
- Appyhigh · Software Development Engineer I · May 2022–February 2024 · source: user's finalized answers and original portfolio specification.
- CORRECTION: “Senior Software Engineer” is not the formal Taptic designation and must not be shown as the title held continuously since February 2024. Stack the two formal titles under the employer, with their respective dates.
- “Senior Software Engineer — Backend & Infrastructure” can describe broader professional positioning or target roles; distinguish it from employment history. Formal-title positioning: “Senior Platform Engineer”; domains: Backend Engineering · Infrastructure · Developer Tooling.
- Personal-site titles “Sr. Platform Engineer” and “Full-stack Developer” are existing functional descriptions. Their exact relationship to formal HR designations is not established; leave personal-site content unchanged unless separately requested.
- Over four years of professional experience as of October 2026 · source: employment dates above. Prefer dates over an age-sensitive duration in evergreen copy.
- Email, GitHub and personal website · source: existing profile content. LinkedIn https://linkedin.com/in/webxsid explicitly confirmed by user.
- Résumé link pending · source: user's instruction to keep a stub until a later task.

## Taptic — backend framework and authorization

Source for all claims in this section: user's finalized answers, October 11, 2026.

- Primary designer and implementer of a metadata-driven backend code-generation framework using Angular Schematics, EJS and TypeScript AST manipulation.
- Generates RBAC-aware CRUD endpoints, custom API routes with developer-owned controllers/services, and metadata-driven operation endpoints with generated controllers and service mappings.
- Designed three reconciliation strategies: file-level preservation, method-level preservation and AST-based structural merging.
- Supports regeneration without overwriting protected custom code or duplicating structured declarations.
- Subsequently designed and implemented authorization libraries supporting attribute-level and document-aware access control.
- Qualitative outcome: reduced repetitive backend implementation work and accelerated development of new entities. No measured percentage or quantified time saving is available.
- Approximately February–October 2024: framework, reusable CRUD/operations/authorization infrastructure and regeneration-safe extensibility work. This is an approximate project period, not a separately verified milestone schedule.
- Later used the framework to develop application functionality and expanded authorization capabilities.

## Taptic — platform ownership and migration

- Joined in February 2024 to work on the next-generation platform and migration · source: user's finalized answers.
- Migration direction: Serverless Node.js backend to NestJS on AWS Elastic Beanstalk. Supporting services include Lambda, Step Functions and API Gateway · source: user's finalized answers; src/content/projects/taptic.md also describes the architecture, including SES and SNS.
- Primary backend owner of the next-generation platform and primary maintainer of the existing production backend · source: user's finalized answers.
- Maintained and extended existing production services concurrently with replacement-platform development: APIs, scheduling, recording workflows and failure recovery, legacy features, and white-label functionality · source: user's finalized answers; src/content/work/taptic.md corroborates general backend scope.
- Coordinated integration and issue resolution with frontend developers and testing with QA · source: user's finalized answers.
- Introduced tracing/telemetry, automated manual operational processes and investigated production failures · source: existing src/content/work/taptic.md and prior portfolio content.
- Replacement platform was preparing for production rollout and user migration as of October 11, 2026 · source: user's finalized answers. Do not describe the replacement as already launched or the migration as completed.
- UPDATE (user, October 23, 2026): rollout of the replacement platform and user migration are underway · source: user's answer while writing the October Now entry. Underway, not completed; still no launch date, adoption share or post-migration measurements.
- Overall migration credit: major contributor with substantial backend ownership. Organization-wide migration leadership is not established.
- Internal staffing departures explain the ownership change but should not appear in public copy. Use “assumed primary backend ownership across the existing and next-generation platforms.”
- Migration motivations: difficulty maintaining the Serverless architecture, safety concerns in the JavaScript codebase, and cold-start latency · source: user clarification, October 11, 2026. These explain the decision to migrate; they do not establish measured improvements after migration. Do not reinterpret “unsafe” as a confirmed security vulnerability.
- Operating scope: the platform can support approximately 15–20 interviews/day · source: user clarification, October 11, 2026 (“we can do 15–20 interviews a day”). This supersedes the earlier unconfirmed 15–25 range. Capacity versus actual observed daily volume, the relevant platform, and period remain unspecified; do not claim average production throughput, a benchmarked ceiling, or simultaneous interviews.

## Taptic — applicant synchronization and scheduling POC

Source: user's finalized answers and subsequent measurement clarification, October 11, 2026.

- Designed and developed an experimental integration connecting a third-party applicant provider to the existing interview platform.
- Used Google Apps Script, five interconnected Google Sheets and backend APIs.
- Implemented synchronization, duplicate detection, failure retries/recovery, candidate-to-panel mapping and automated interview scheduling.
- Independently handled technical execution and stakeholder coordination, including deadlines.
- User-reported per-candidate processing time improved from approximately 90 seconds to approximately 20 seconds under comparable conditions. The original latency was a significant technical barrier to adoption.
- Derived improvement: approximately 78% reduction in processing time, or 4.5× processing speed. These are alternative expressions of the same measurement, not separate outcomes. Avoid false precision such as 77.8% when inputs are approximate.
- Testing period: approximately three months, February–May 2025 · source: user clarification, October 11, 2026. Month boundaries are approximate.
- Multiple tests ran daily: developers used a development Google Apps Script sheet, and end users tested on a separate live Google Apps Script sheet · source: same clarification. “Live” identifies the end-user test environment; it does not mean the POC reached production.
- Typical development test: approximately 20 candidate records. Candidate details were slightly modified to bypass duplicate detection when that behavior was not under test. These are test records/runs, not a count of unique applicants.
- Approximately 10 stress tests used approximately 100 candidate records each. Do not infer concurrency, sustained throughput or total unique candidates from these batch sizes.
- Typical end-user test on the live sheet: approximately 100 candidates. Total end-user test count and unique-candidate count were not supplied.
- Processing times were logged and reported across multiple observations in both development and live end-user test environments. The approximate 90-to-20-second figures describe observed per-candidate processing times; a calculated mean, median or percentile has not been established.
- Comparable conditions were confirmed in the earlier user clarification. Exact timing start/end boundaries, aggregation method and total number of timed observations remain unspecified. Do not generalize the POC result to production performance or business adoption.
- The POC did not reach production and was subsequently discontinued for business reasons. Always label it as a POC/experimental integration; expanded copy can explain its disposition.
- Do not name the third-party vendor, customers or private integration details.

## Seniority and collaboration

Source: user's finalized answers, October 11, 2026.

- Architectural evidence: metadata-driven generation, regeneration-safe extensibility, AST reconciliation and reusable granular authorization.
- Ownership evidence: sustained backend responsibility across existing production and next-generation systems.
- Cross-functional evidence: helped frontend developers resolve implementation/integration issues, coordinated QA testing and issue resolution, and supported delivery across backend/frontend boundaries.
- User describes acting as an informal second-in-command for approximately two years. This is a functional description, not a formal management title; prefer concrete responsibilities in public copy.
- Do not claim direct reports, department management, leadership of the entire migration, organization-wide standards or a specific number of mentees.

## Appyhigh / Scanner Go

- Developed and shipped an in-house PDF-to-Word conversion pipeline replacing an external conversion dependency; it reached production before departure · source: user's finalized answers; src/content/projects/scanner-go.md describes the pipeline.
- Supported outcome: an internally implemented production conversion capability with reduced architectural dependence on an external API for the supported workflow.
- External API-call reduction, cost savings, conversion quality gains, processing-time improvements and long-term reliability impact were not established. The user left before these could be evaluated. Do not infer numerical or long-term gains.
- PDF-to-PowerPoint remained a prototype · source: user's finalized answers and src/content/projects/scanner-go.md.
- Maintained document-processing services and long-lived WebSocket connections; investigated production issues and fixed regressions · source: user's finalized answers and src/content/projects/scanner-go.md.
- Contributed to APIs, dashboards, customer-facing features and internal tools · source: user's finalized answers and src/content/work/appyhigh.md.
- SUPERSEDED by "Appyhigh — role history" below: the earlier k6 note (small CLI, never adopted, omit) understated the project. It was a three-part internal tool that shipped internally with limited use.

## Appyhigh — role history

Source: user's account in conversation, October 11, 2026 (self-reported, from memory; dates approximate unless stated). Supersedes the single "Appyhigh · SDE I · May 2022–February 2024" line above where they conflict.

- Joined May 2022 as a **backend intern**; hired full time **May 2023**; left **February 2024**. Formal title for each period is not yet confirmed (see open questions). Stack as two titled periods if confirmed; do not show SDE I from May 2022.
- Order of work, as remembered (approximate, some overlap): k6 tool → email client POC → VPN Electron client → in-house PDF conversion (Scanner Go) → VPN browser extension → Scanner Go primary developer → VPN backend primary developer.
1. **Internal load-testing tool (first task):** wrapper over k6, built in three parts: backend (HTTP APIs plus WebSockets for live log streaming), frontend and CLI. Shipped internally; not widely used.
2. **Desktop email client POC (Electron):** worked on N+1 queries, caching, mail rendering and HTML markup. Scrapped; never went live.
3. **VPN desktop client (Electron):** company's VPN service (name as given: "organe/pulpy vpn", then "pulyvpn"; confirm). Backend was handled by someone else. Dealt with networking, certificates and OpenVPN protocol concerns. Scrapped after technical issues.
4. **VPN browser extension:** replaced the Electron client. Took over from a developer; work involved browser processes, networking APIs and workers. Launch status not stated.
5. **In-house PDF conversion and editing (for Scanner Go):** tasked with PDF to/from Word, PDF to/from PowerPoint and a PDF editor. Used Node concurrency (user wrote "node v8"; clarify mechanism) for batch processing. Built a PDF → XML → HTML converter and a JavaScript script that injects editing tools into the HTML for PDF editing. The document converter went to production and reduced reliance on a third-party API (consistent with the earlier ledger: PDF-to-Word shipped, PowerPoint prototype).
6. **Scanner Go primary developer:** took over from a developer who was leaving. Worked on WebSockets for live communication, authentication for web and native mobile clients, and AWS S3 storage. At that time Scanner Go had over a million registered users, many active, about 2% premium. Self-reported; confirm it is OK to publish the user count and especially the premium share.
7. **VPN backend primary developer:** took over from a departing developer. Automated AWS EC2 and DigitalOcean droplet provisioning from template images, plus Pi-hole ad blocking.
8. Further work near the end of the tenure is not remembered. Do not infer.

Resolved by user, October 11, 2026:
- Titles: Backend Developer Intern (May 2022 – full-time conversion, May 2023) → SDE / "Software Development Engineer I" (May 2023 – February 2024). User wrote "SDE"; the earlier ledger said "SDE I", kept until told otherwise. Intern end date is the conversion, shown as April 2023 in copy only if exact end is confirmed; otherwise use "May 2022 – May 2023".
- VPN product: launched as Orange VPN, rebranded to PulpyVPN.
- Browser extension launched; user believes it was later taken down along with the product. Public check (AppGoblin, third-party): the PulpyVPN iOS app "was removed from the US App Store and is no longer live", store last updated 2024-08-09. No public listing for the extension was found; its status is unverified. Describe the extension as launched and the product as since discontinued only with that hedge, or say less.
- PDF-to-PowerPoint remained a prototype and never shipped. Only PDF-to-Word is confirmed shipped; other directions and the PDF editor are not confirmed shipped.
- Concurrency mechanism: Node.js worker threads, for batch processing.
- Takeovers: Scanner Go around January 2023; PulpyVPN backend around August 2023 (approximate).
- Scanner Go scale, cross-referenced against the official site https://www.scannergo.net/ (fetched October 11, 2026): "1 Cr+ Application Downloads" (1 crore = 10 million+), "4.4* Customer Ratings", "20+ PDF Tools"; lists PDF to Word and PDF to PPT conversion. No registered-user, active-user or premium figures appear, and Appyhigh is not named. The site's figures are current, not as of the user's tenure. Public copy should cite "10 million+ downloads" with the official site as source, and not state "over a million registered users" (user recollection, unverified) or the 2% premium share. The site listing PDF to PPT does not change the user's account that it was a prototype, unshipped, during their tenure; do not claim PPT either way.

Intern period ended May 2023 (user is sure): Backend Developer Intern May 2022 – May 2023, then SDE from May 2023. No open questions remain for Appyhigh.

## Crona

- Independently built and maintains an open-source local-first work tracker · source: user's finalized answers; src/content/projects/crona.md.
- Current implementation: Go, Bubble Tea and SQLite. Older Node.js references are historical; use the current repository as authority for released implementation · source: user's finalized answers. No repository verification was performed for this ledger update.
- Persistent daemon owns application state; CLI, TUI and native macOS client access a shared local runtime through local IPC. Active sessions survive closing or switching interfaces · source: user's finalized answers and prior portfolio architecture content in checkpoint 8904781.
- Released capabilities reported by user: issues, issue-linked sessions, time tracking, focus/Pomodoro timers and breaks, habits and Momentum insights, session history/summaries/calendar/productivity insights, client synchronization, lifecycle management and diagnostics.
- CLI/TUI v1.9.0 stable and macOS companion v1.0.0 stable released September 2026 · source: user's finalized answers. Treat versions as dated release facts, not an assertion that they remain the latest versions.
- Stable cross-platform distribution through Homebrew and GitHub Releases · source: user's finalized answers.
- Terminal UI constraints, release engineering, observability and cross-platform packaging · source: src/content/projects/crona.md and user's finalized answers.
- 55 GitHub stars as of September 17, 2026, and positive feedback on r/cli and r/tui · source: user's reported snapshot, not independently verified here. Omit star count from main portfolio to avoid stale social proof.
- No verified active-user, installation, retention or revenue metrics. Stars indicate interest, not active usage.

## Education and résumé choices

Source: user's answers, October 11, 2026.

- B.Tech, Bennett University, Greater Noida; CGPA 8.2 per the user (corrected from 8.4 on October 11, 2026), the figure on their LinkedIn. Their uploaded résumé (June 2026) says 8.13; the user does not remember the exact value and chose 8.2. Worth checking against a transcript if a recruiter asks. Scale assumed /10, written "CGPA 8.2/10". That résumé also gives Computer Science and Engineering, 2019–2023, not yet shown on the site résumé.
- Location on the résumé: "India".
- Do not put the Scanner Go download count on the résumé; describe it as a consumer PDF-scanning app. (The 10M+ figure from scannergo.net stays available for the portfolio.)

## Career preferences

Source: user's finalized answers and later clarification, October 11, 2026.

- Primary targets: senior backend engineering and senior software engineering roles focused on backend systems.
- Secondary targets: platform engineering, developer productivity/internal tooling, and related software engineering positions. Software Engineer II / Backend Engineer II depends on company leveling; Go/Node.js backend roles selectively fit.
- Based in India; current role remote. Prefers remote opportunities and is also open to relocation.
- Preferred cities and domestic versus international relocation specifics are not established. Do not imply restrictions or guarantees.
- Keep relocation preferences out of prominent portfolio copy; communicate during applications.
- Existing approved availability wording is “Open to backend & infrastructure roles.” No replacement wording is required by these answers.

## Public disclosure and claim boundaries

- User assessed the technical details shared as suitable for architectural-level portfolio descriptions · source: final clarification, October 11, 2026. This is user confirmation, not independent employer clearance.
- Discuss high-level framework architecture, responsibilities and engineering decisions. Exclude proprietary source, internal metadata schemas, private endpoints/identifiers, credentials, customer data and security-sensitive operational detail.
- Do not name customers or third-party applicant vendors. Omit internal staffing circumstances.
- Do not claim that omitting customer names alone establishes confidentiality clearance. Any deeper implementation disclosure needs separate confirmation.

## Beyond work

- Open-source development, personal experiments and technical writing · source: personal project and writing collections, plus user's finalized answers.
- Pebbles is a recommendations project · source: src/content/projects/pebbles.md.

## Narrative supported by the ledger

- Lead with reusable backend infrastructure: metadata-driven generation, safe reconciliation and authorization.
- Follow with primary ownership across production and replacement backends, with accurate rollout status.
- Use Crona as the independent architecture and release-engineering example.
- Scheduling POC and Scanner Go demonstrate execution and optimization/production delivery respectively; keep their different maturity levels explicit.
- Employment history must show Platform Engineer → Senior Platform Engineer, promoted May 2025.

## Remaining qualifications — no longer blocking

1. Migration motivations are now confirmed; resulting maintenance, code-safety and latency improvements are not measured.
2. POC testing period, typical batch sizes, stress-test count, environments and logging are now documented. Exact timing boundaries, aggregation method and total timed-observation count remain unspecified; describe approximate logged observations, not a calculated average or production benchmark.
3. Interview scope is approximately 15–20/day; clarify capacity versus observed volume and platform/period before presenting it as measured production throughput.
4. Relocation geography is unspecified; avoid public restrictions.
5. Deeper proprietary implementation disclosures require confirmation beyond architectural descriptions.

The previous eight-question interview is resolved sufficiently for content drafting. No further answer is needed to use the supported claims above; the remaining qualifications govern what to omit or qualify.
