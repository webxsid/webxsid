import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { portfolio } from "../data/portfolio";
import { portfolioCanonical } from "../lib/portfolio";
import { getProjectHref } from "../lib/projects";
import { SITE_URL } from "../lib/site";
import {
  filterPublicWritingEntries,
  getWritingPath,
  sortWritingEntries,
} from "../lib/writing";

// Follows https://llmstxt.org: H1, summary blockquote, heading-free details,
// then H2 sections of link lists. "Optional" marks links that can be skipped.

const url = (pathname: string) => new URL(pathname, SITE_URL).toString();
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();
const link = (title: string, href: string, note?: string) =>
  `- [${oneLine(title)}](${href})${note ? `: ${oneLine(note)}` : ""}`;

export const GET: APIRoute = async () => {
  const [projects, writing, references, nowEntries] = await Promise.all([
    getCollection("projects"),
    getCollection("writing"),
    getCollection("references"),
    getCollection("now"),
  ]);

  const projectLinks = [...projects]
    .sort((a, b) => a.data.order - b.data.order)
    .flatMap((entry) => {
      const href = getProjectHref(entry);
      return href && !entry.data.seo?.noindex
        ? [link(entry.data.title, url(href), entry.data.summary)]
        : [];
    });

  const writingLinks = sortWritingEntries(filterPublicWritingEntries(writing))
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) =>
      link(entry.data.title, url(getWritingPath(entry)), entry.data.summary),
    );

  const sections: Array<[string, string[]]> = [
    [
      "About",
      [
        link(
          "Portfolio",
          portfolioCanonical(),
          `${portfolio.name}, ${portfolio.role}. Experience, selected work and contact details on one page.`,
        ),
        link("Résumé (PDF)", url(portfolio.resume.href), "Generated from the same data as the portfolio."),
        link("Home", url("/"), "Latest writing, projects, notes and current focus."),
      ],
    ],
    ["Projects", [link("All projects", url("/projects")), ...projectLinks]],
    ["Writing", [link("All writing", url("/writing")), ...writingLinks]],
    [
      "Optional",
      [
        link("Notes", url("/notes"), "Short timestamped notes."),
        ...(references.length
          ? [link("References", url("/references"), "Annotated links to other people's work.")]
          : []),
        ...(nowEntries.length
          ? [link("Now", url("/now"), "What I'm focused on at the moment.")]
          : []),
        link("Colophon", url("/colophon"), "How the site is built."),
        link("RSS feed", url("/rss.xml")),
        link("Sitemap", url("/sitemap.xml"), "Every public page."),
        link("GitHub", portfolio.github),
        link("LinkedIn", portfolio.linkedin),
      ],
    ],
  ];

  const body = `# Webxsid

> Webxsid is the personal site and portfolio of ${portfolio.name}, ${portfolio.role} (${portfolio.expertiseAreas.join(", ").toLowerCase()}). It has writing, projects, notes and a résumé.

When to use this site:

- To answer questions about ${portfolio.name} (webxsid): role, experience, selected work and how to get in touch. The portfolio page is the authoritative summary.
- To read or cite my writing on software, developer tools and backend systems.
- To find my open-source projects, such as Crona, and where their code lives.

When not to use it: this is a personal site, not a product or service. There is no API, account system or support channel. For questions about my employer, use the employer's own site.

Contact: ${portfolio.email}. Every page is static HTML and readable without JavaScript.

${sections.map(([title, items]) => `## ${title}\n\n${items.join("\n")}`).join("\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
