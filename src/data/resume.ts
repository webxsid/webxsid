import { portfolio } from "./portfolio";

/**
 * Résumé content for /resume.pdf. Identity, links, employers and dated roles
 * come from portfolio.ts so the two can never disagree; only the résumé-specific
 * parts live here. Every claim traces to resume/facts.md.
 *
 * Writing rules (resume-forge): each bullet leads with its result, or with
 * scope when there is no measured result; no unmeasured numbers; the scheduling
 * work is labelled a proof of concept; PDF-to-PowerPoint stays a prototype.
 */

export type ResumeRole = { title: string; period: string; location?: string };
export type ResumeEntry = {
  company: string;
  context: string;
  roles: ResumeRole[];
  bullets: string[];
};
export type ResumeProject = {
  name: string;
  context: string;
  link?: string;
  bullets: string[];
};

const employer = (id: string) => {
  const work = portfolio.work.find((entry) => entry.id === id);
  if (!work?.employer || !work.roles) {
    throw new Error(`Résumé needs an employer and roles for "${id}"`);
  }
  const [company, context = ""] = work.employer.split(" · ");
  return {
    company,
    context,
    roles: work.roles.map((role) => ({ ...role, location: locations[role.title] })),
  };
};

// Where each role was worked, by title. Shown beside the title in the PDF.
const locations: Record<string, string> = {
  "Senior Platform Engineer": "Remote",
  "Platform Engineer": "Remote",
  "Software Development Engineer I": "Hyderabad",
  "Backend Developer Intern": "Remote",
};

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const resume = {
  fileName: "Siddharth Mittal Resume",
  name: portfolio.name,
  headline: `${portfolio.role} · ${portfolio.specialism}`,
  // URLs are written out, not hidden behind labels, so parsers that drop link
  // annotations still keep them.
  contact: [
    { text: "India" },
    { text: portfolio.email, href: `mailto:${portfolio.email}` },
    { text: strip(portfolio.github), href: portfolio.github },
    { text: strip(portfolio.linkedin), href: portfolio.linkedin },
    { text: strip(portfolio.personalWebsite), href: portfolio.personalWebsite },
  ] as { text: string; href?: string }[],
  experience: [
    {
      ...employer("taptic"),
      bullets: [
        "Cut new-entity setup to one configuration and under 2 minutes with a metadata-driven code generator (Angular Schematics, EJS, TypeScript AST) producing CRUD modules and RBAC for 29 backend-defined entities",
        "Kept custom code intact through regeneration with three reconciliation strategies: file-level preservation, method-level preservation and AST-based structural merging",
        "Built reusable libraries enforcing role, entity-level, attribute-level and document-aware access control",
        "Primary backend owner of the production interview platform (Serverless Node.js) and its NestJS replacement, now preparing for production rollout; integration with frontend developers and testing with QA",
        "Cut per-candidate processing time from approximately 90 to 20 seconds in logged testing (Feb–May 2025) with a scheduling proof of concept on Google Apps Script and backend APIs, discontinued before production",
        "Built event-driven workflows on AWS Lambda and Step Functions and introduced observability with OpenTelemetry and CloudWatch, automating manual operational processes",
      ],
    },
    {
      ...employer("appyhigh"),
      bullets: [
        "Reduced Scanner Go's reliance on a third-party API with an in-house PDF-to-Word pipeline (PDF-to-XML-to-HTML converter, batch processing on Node.js worker threads); PDF-to-PowerPoint stayed a prototype",
        "Became primary developer on Scanner Go, a consumer PDF-scanning app with 20+ PDF tools, after a colleague left, covering WebSocket communication, web and native-mobile authentication, and AWS S3 storage",
        "Became primary developer on the PulpyVPN backend, automating AWS EC2 and DigitalOcean servers from template images, with Pi-hole ad blocking",
        "Built the VPN's Electron desktop client (certificates, OpenVPN protocol), then took over its replacement, a browser extension that launched",
        "Started as a backend intern building an internal k6 load-testing tool (HTTP and WebSocket backend, web UI, CLI)",
      ],
    },
  ] satisfies ResumeEntry[],
  projects: [
    {
      name: "Crona",
      context: "Open-source, local-first work tracker (Go, Bubble Tea, SQLite)",
      link: strip("https://github.com/webxsid/crona"),
      bullets: [
        "Built a shared-daemon architecture behind CLI, TUI and native macOS clients so a session survives switching interfaces; shipped stable v1.9.0 (CLI/TUI) and v1.0.0 (macOS) in September 2026 via Homebrew and GoReleaser",
      ],
    },
  ] satisfies ResumeProject[],
  skills: [
    { label: "Languages", items: ["TypeScript", "JavaScript", "Go", "Python"] },
    {
      label: "Backend and data",
      items: ["NestJS", "Express.js", "Node.js", "REST APIs", "WebSockets", "MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    },
    {
      label: "Cloud",
      items: ["AWS (Elastic Beanstalk, Lambda, Step Functions, CloudWatch)", "DigitalOcean", "Firebase", "Vercel", "Docker"],
    },
    { label: "Tooling", items: ["Angular Schematics", "TypeScript AST", "OpenTelemetry", "Electron", "GoReleaser", "Git"] },
  ],
  // The section is omitted when this is empty, so the PDF never carries a
  // placeholder. Add a period here if you want dates shown.
  education: [
    {
      school: "Bennett University, Greater Noida",
      degree: "B.Tech, Computer Science and Engineering",
      period: "2019 – 2023",
      detail: "CGPA 8.2/10",
    },
  ] as { school: string; degree: string; detail?: string; period?: string }[],
};
