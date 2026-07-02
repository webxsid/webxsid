import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE_URL } from "../lib/site";
import { filterPublicWritingEntries, getWritingPath } from "../lib/writing";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

const toAbsoluteUrl = (pathname: string) =>
  new URL(pathname, SITE_URL).toString();

const normalizeCanonical = (pathname: string, canonical?: string) =>
  new URL(canonical ?? pathname, SITE_URL).toString();

export const GET: APIRoute = async () => {
  const [projects, writing, references, nowEntries, work] = await Promise.all([
    getCollection("projects"),
    getCollection("writing"),
    getCollection("references"),
    getCollection("now"),
    getCollection("work"),
  ]);

  const staticPages: SitemapEntry[] = [
    "/",
    "/me",
    "/projects",
    "/writing",
    "/references",
    "/now",
    "/colophon",
  ].map((pathname) => ({
    loc: toAbsoluteUrl(pathname),
  }));

  const projectPages = projects
    .filter((entry) => !entry.data.seo?.noindex && entry.data.detailsPage !== false)
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
      loc: normalizeCanonical(
        getWritingPath(entry),
        entry.data.seo?.canonical,
      ),
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

  const nowPages = nowEntries
    .filter((entry) => !entry.data.seo?.noindex)
    .map((entry) => ({
      loc: normalizeCanonical(`/now/${entry.id}`, entry.data.seo?.canonical),
      lastmod: entry.data.updatedAt.toISOString(),
    }));

  const pages: SitemapEntry[] = [
    ...staticPages,
    ...projectPages,
    ...workPages,
    ...writingPages,
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
    <loc>${page.loc}</loc>${page.lastmod ? `
    <lastmod>${page.lastmod}</lastmod>` : ""}
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
