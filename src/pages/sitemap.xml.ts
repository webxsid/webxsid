import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { portfolioCanonical } from "../lib/portfolio";
import { SITE_URL } from "../lib/site";
import { filterPublicWritingEntries, getWritingPath } from "../lib/writing";
import { getNotePath, parseNoteTimestamp } from "../lib/notes";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

const toAbsoluteUrl = (pathname: string) =>
  new URL(pathname, SITE_URL).toString();

const normalizeCanonical = (pathname: string, canonical?: string) =>
  new URL(canonical ?? pathname, SITE_URL).toString();

export const GET: APIRoute = async () => {
  const [projects, writing, references, notes, nowEntries, work] =
    await Promise.all([
      getCollection("projects"),
      getCollection("writing"),
      getCollection("references"),
      getCollection("notes"),
      getCollection("now"),
      getCollection("work"),
    ]);

  const staticPages: SitemapEntry[] = [
    "/",
    "/me",
    "/projects",
    "/writing",
    "/notes",
    "/references",
    "/now",
    "/colophon",
  ].map((pathname) => ({
    loc: toAbsoluteUrl(pathname),
  }));

  const projectPages = projects
    .filter(
      (entry) => !entry.data.seo?.noindex && entry.data.detailsPage !== false,
    )
    .map((entry) => ({
      loc: normalizeCanonical(
        `/projects/${entry.id}`,
        entry.data.seo?.canonical,
      ),
      lastmod: entry.data.updatedAt.toISOString(),
    }));

  const workPages = work
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) => ({
      loc: normalizeCanonical(`/work/${entry.id}`, entry.data.seo?.canonical),
    }));

  const writingPages = filterPublicWritingEntries(writing)
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) => ({
      loc: normalizeCanonical(getWritingPath(entry), entry.data.seo?.canonical),
      lastmod: entry.data.publishedAt.toISOString(),
    }));

  const referencePages = references
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) => ({
      loc: normalizeCanonical(
        `/references/${entry.id}`,
        entry.data.seo?.canonical,
      ),
      lastmod: entry.data.publishedAt.toISOString(),
    }));

  const notePages = notes.map((entry) => ({
    loc: toAbsoluteUrl(getNotePath(entry)),
    lastmod: parseNoteTimestamp(entry.id).toISOString(),
  }));

  const nowPages = nowEntries
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) => ({
      loc: normalizeCanonical(`/now/${entry.id}`, entry.data.seo?.canonical),
      lastmod: entry.data.updatedAt.toISOString(),
    }));

  const [portfolioProjects, portfolioCases] = await Promise.all([
    getCollection("portfolioProjects"),
    getCollection(
      "portfolioCaseStudies",
      ({ data }) => data.visibility === "public" && !data.draft,
    ),
  ]);
  const portfolioPages = [
    "/portfolio",
    "/portfolio/work",
    "/portfolio/projects",
    "/portfolio/experience",
    "/portfolio/contact",
    ...portfolioProjects.map((entry) => `/portfolio/projects/${entry.id}`),
    ...portfolioCases.map((entry) => `/portfolio/work/${entry.id}`),
  ].map((pathname) => ({ loc: portfolioCanonical(pathname) }));

  const pages: SitemapEntry[] = [
    ...staticPages,
    ...portfolioPages,
    ...projectPages,
    ...workPages,
    ...writingPages,
    ...notePages,
    ...referencePages,
    ...nowPages,
  ];

  const uniquePages = Array.from(
    new Map(pages.map((page) => [page.loc, page])).values(),
  ).sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>${
      page.lastmod
        ? `
    <lastmod>${page.lastmod}</lastmod>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
