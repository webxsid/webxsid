export type PortfolioLink = { label: string; href: string };
export type WorkEntry = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  employer?: string;
  roles?: { title: string; period: string }[];
  description: string;
  contribution: string;
  supporting?: string;
  technologies: string[];
  detailsLabel: string;
  details: { title: string; text: string }[];
  links: PortfolioLink[];
};

// Professional claims and their qualifications: resume/facts.md.
export const portfolio = {
  name: "Siddharth Mittal",
  role: "Senior Platform Engineer",
  expertiseAreas: [
    "Backend Engineering",
    "Infrastructure",
    "Developer Tooling",
  ],
  specialism: "Backend Engineering · Infrastructure · Developer Tooling",
  headline: "I build software that works, and keeps working.",
  introduction:
    "I’m a backend engineer at Taptic, where I build the frameworks the rest of the team works on and look after the platform they run on. On the side, I make Crona, an open-source work tracker for the terminal and macOS.",
  availability: "Open to backend & infrastructure roles",
  email: "me@webxsid.com",
  github: "https://github.com/webxsid",
  linkedin: "https://linkedin.com/in/webxsid",
  personalWebsite: "https://webxsid.com/",
  // Built from src/data/resume.ts at build time; see src/pages/resume.pdf.ts.
  resume: {
    href: "/resume.pdf",
    label: "Résumé",
    fileName: "Siddharth-Mittal-Resume.pdf",
  },
  seo: {
    title: "Siddharth Mittal — Portfolio, Senior Platform Engineer",
    description:
      "Backend engineering, infrastructure, and developer tooling. Backend frameworks and platform ownership at Taptic, production document processing at Appyhigh, and Crona.",
  },
  expertise: [
    {
      title: "Backend Engineering",
      focus: "APIs, authorization & architecture",
      description:
        "Most of my work is the layer under the product: reusable frameworks, role-based and fine-grained authorization, and the services around them. I’ve done it for interview workflows at Taptic and for document processing at Appyhigh.",
    },
    {
      title: "Cloud & Infrastructure",
      focus: "AWS, workflows & production reliability",
      description:
        "I keep production running while its replacement gets built. That means asynchronous workflows, recording recovery, tracing and deployment across AWS.",
    },
    {
      title: "Developer Tools",
      focus: "Code generation, CLIs & local-first software",
      description:
        "I like removing repetitive work. At Taptic that’s a code generator that’s safe to re-run. With Crona, it’s one local runtime behind a command line, a terminal UI and a macOS app.",
    },
  ],
  work: [
    {
      id: "taptic",
      name: "Taptic",
      subtitle: "Backend frameworks & interview infrastructure",
      category: "Professional work",
      employer: "Galent / Taptic.ai · Interview platform",
      roles: [
        { title: "Senior Platform Engineer", period: "May 2025 – Present" },
        { title: "Platform Engineer", period: "February 2024 – April 2025" },
      ],
      description:
        "Backend work that stays out of the way: generated code that keeps evolving next to hand-written logic.",
      contribution:
        "I designed and built a metadata-driven framework that generates role-aware APIs and operation endpoints. Its reconciliation system keeps developer-written code intact when files are regenerated. After that I wrote the authorization libraries, covering attribute-level and document-aware access, and took over primary backend ownership across the production interview platform and its NestJS replacement.",
      supporting:
        "Separately, I built a proof of concept for applicant scheduling. In logged testing between February and May 2025, processing time per candidate fell from approximately 90 to 20 seconds.",
      technologies: [
        "TypeScript",
        "NestJS",
        "Angular Schematics",
        "EJS",
        "AWS",
      ],
      detailsLabel: "Framework decisions & scheduling POC",
      details: [
        {
          title: "Regenerating without losing custom code",
          text: "The framework combines metadata, templates and TypeScript syntax-tree manipulation. It preserves custom code at three levels: whole files, individual methods and structural merges. Custom routes and operations survive regeneration, and generated declarations never get duplicated.",
        },
        {
          title: "Two platforms, one backend owner",
          text: "We’re moving from Serverless Node.js to NestJS on AWS Elastic Beanstalk. The old setup was hard to maintain, raised code-safety concerns and suffered from cold-start latency. I maintain the existing backend and build the replacement, working with frontend developers on integration and with QA on testing. As of October 2026, the replacement is preparing for production rollout and user migration.",
        },
        {
          title: "Applicant scheduling, a proof of concept",
          text: "I connected five Google Sheets through Google Apps Script and backend APIs, adding duplicate detection, retries, candidate-to-panel mapping and automated scheduling. Developers and end users tested it daily for about three months. Typical batches held around 20 records in development and 100 in end-user tests, alongside about 10 stress tests of 100 records each. The 90-to-20-second figures are logged observations under comparable conditions, not a calculated average. The project was discontinued for business reasons before production deployment.",
        },
      ],
      links: [
        { label: "Personal notes on Taptic", href: "/work/taptic" },
        { label: "Taptic.ai", href: "https://taptic.ai" },
      ],
    },
    {
      id: "crona",
      name: "Crona",
      subtitle: "A local-first work tracker",
      category: "Independent · open source",
      description:
        "One work session you can pick up from the command line, the terminal UI or a native macOS app.",
      contribution:
        "I built and maintain Crona around a local daemon and a SQLite database. The daemon owns the state and the session logic, so timers keep running when an interface closes and you can switch clients without losing your place. Stable releases ship through Homebrew and GitHub.",
      technologies: ["Go", "Bubble Tea", "SQLite", "Local IPC"],
      detailsLabel: "Architecture & released workflows",
      details: [
        {
          title: "State belongs to the daemon",
          text: "The CLI, TUI and macOS client all talk to the same local runtime. Keeping the session lifecycle and storage in the daemon means the interfaces stay in sync by design, instead of competing to be the source of truth. The core workflow needs no account and no network.",
        },
        {
          title: "More than a timer",
          text: "Released workflows include issue-linked sessions, focus timers and breaks, habit tracking, session history, calendar views and productivity insights. In September 2026 I shipped the stable CLI/TUI v1.9.0 and the macOS companion v1.0.0, alongside diagnostics, release engineering and cross-platform packaging.",
        },
      ],
      links: [
        { label: "Explore Crona", href: "https://crona.work" },
        { label: "Source code", href: "https://github.com/webxsid/crona" },
        { label: "Why I built it", href: "/writing/why-i-built-crona" },
      ],
    },
    {
      id: "appyhigh",
      name: "Appyhigh",
      subtitle: "Document tools, desktop clients & a VPN backend",
      category: "Professional work",
      employer: "Appyhigh · Consumer apps & document tools",
      roles: [
        {
          title: "Software Development Engineer I",
          period: "May 2023 – February 2024",
        },
        {
          title: "Backend Developer Intern",
          period: "May 2022 – May 2023",
        },
      ],
      description:
        "Almost two years of moving between problems. I started as a backend intern, and twice I inherited a system when its developer left.",
      contribution:
        "The work that stayed with me was Scanner Go. I built its in-house PDF conversion, which reduced the app’s reliance on a third-party API, and later became its primary developer. Alongside that, I built desktop and browser clients for the company’s VPN and ended up owning its backend.",
      technologies: ["JavaScript", "Node.js", "Electron", "WebSockets", "AWS"],
      detailsLabel: "Projects at Appyhigh",
      details: [
        {
          title: "Scanner Go: converting documents in-house",
          text: "I was asked to build PDF conversion ourselves: Word and PowerPoint in both directions, plus a PDF editor. That meant a PDF-to-XML-to-HTML converter, a script that injects editing tools into the generated HTML to support PDF editing, and batch processing across Node.js worker threads. PDF-to-Word reached production and reduced the app’s reliance on a third-party API. PDF-to-PowerPoint stayed a prototype.",
        },
        {
          title: "Scanner Go: becoming the primary developer",
          text: "Around January 2023, when the developer on Scanner Go was leaving the company, I took over the project. I worked on WebSockets for live communication, authentication for web and native mobile clients, and AWS S3 storage. Scanner Go now lists over 10 million downloads on its website.",
        },
        {
          title: "The VPN: client, extension and backend",
          text: "I started on the desktop client for the company’s VPN, first called Orange VPN and later rebranded as PulpyVPN. The backend belonged to someone else, so my side was networking: certificates and the OpenVPN protocol. After technical problems, the Electron client was scrapped and a browser extension replaced it. I took the extension over from another developer, which took me into browser processes, networking APIs and workers, and it launched. Around August 2023, I also became primary developer on the VPN backend, automating AWS EC2 and DigitalOcean servers from template images and adding Pi-hole ad blocking.",
        },
        {
          title: "Where it started",
          text: "My first task was an internal wrapper around k6, built in three parts: a backend with HTTP APIs and WebSockets for live log streaming, a web frontend and a CLI. It shipped internally but never saw wide use. Next came a proof of concept for an Electron email client, where I worked through N+1 queries, caching, mail rendering and HTML markup. It was scrapped before launch.",
        },
      ],
      links: [
        { label: "Scanner Go", href: "https://www.scannergo.net/" },
        { label: "Scanner Go project notes", href: "/projects/scanner-go" },
        { label: "Personal notes on Appyhigh", href: "/work/appyhigh" },
      ],
    },
  ] satisfies WorkEntry[],
  beyondWork: {
    introduction:
      "I build open-source tools and write about the decisions behind them.",
    description:
      "My personal site is where those projects live, alongside engineering notes, experiments and whatever I’m reading. It’s the looser, more personal picture of how I think.",
    links: [
      {
        label: "Pebbles — recommendations from people you trust",
        href: "/projects/pebbles",
      },
      { label: "Technical writing & engineering notes", href: "/writing" },
    ],
  },
};

export const contactLinks: PortfolioLink[] = [
  { label: "GitHub", href: portfolio.github },
  { label: "LinkedIn", href: portfolio.linkedin },
  { label: "Email", href: `mailto:${portfolio.email}` },
];
