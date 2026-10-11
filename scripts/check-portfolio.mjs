import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";

async function htmlFiles(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? htmlFiles(join(dir, entry.name))
          : entry.name.endsWith(".html")
            ? [join(dir, entry.name)]
            : [],
      ),
    )
  ).flat();
}
const files = await htmlFiles("dist/portfolio");
const pages = new Map(
  await Promise.all(
    files.map(async (file) => [
      "/" + file.replace(/^dist\//, "").replace(/\/index\.html$/, ""),
      await readFile(file, "utf8"),
    ]),
  ),
);
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const seenTitles = new Set();
const seenDescriptions = new Set();
const base = (
  process.env.PUBLIC_PORTFOLIO_BASE_URL || "https://webxsid.com/portfolio/"
).replace(/\/?$/, "/");
const required = [
  "/portfolio",
  "/portfolio/work",
  "/portfolio/projects",
  "/portfolio/experience",
  "/portfolio/contact",
  "/portfolio/projects/crona",
  "/portfolio/projects/pebbles",
  "/portfolio/work/local-first-work-tracking",
  "/portfolio/work/reliable-interview-workflows",
  "/portfolio/work/in-house-document-conversion",
];
for (const route of required)
  assert(pages.has(route), `Missing route ${route}`);
for (const [route, html] of pages) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one h1`);
  assert(html.includes('id="main"'), `${route}: main landmark`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]+)"/s,
  )?.[1];
  assert(title && !seenTitles.has(title), `${route}: unique title`);
  seenTitles.add(title);
  assert(
    description && !seenDescriptions.has(description),
    `${route}: unique description`,
  );
  seenDescriptions.add(description);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = new URL(route.replace(/^\/portfolio\/?/, ""), base);
  assert.equal(
    canonical,
    expected.pathname === "/"
      ? expected.href
      : expected.href.replace(/\/$/, ""),
  );
  for (const property of ["og:title", "og:description", "og:url", "og:type"])
    assert(html.includes(`property="${property}"`), `${route}: ${property}`);
  const unlisted = /noindex, nofollow/.test(html);
  assert.equal(
    sitemap.includes(`<loc>${canonical}</loc>`),
    !unlisted,
    `${route}: sitemap visibility`,
  );
  assert(
    !html.includes("<astro-island"),
    `${route}: no client framework hydration`,
  );
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const [path, fragment] = href.split("#");
    const target = path || route;
    assert(
      target.startsWith("/portfolio"),
      `${route}: navigation escapes portfolio: ${href}`,
    );
    assert(pages.has(target), `${route}: broken link ${href}`);
    if (fragment)
      assert(
        pages.get(target).includes(`id="${fragment}"`),
        `${route}: missing fragment ${href}`,
      );
  }
  for (const match of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
  ))
    assert(JSON.parse(match[1])["@type"], `${route}: valid structured data`);
  for (const match of html.matchAll(/<img[^>]*src="(\/[^\"]+)"/g))
    await access(join("dist", match[1]));
}
assert(
  pages
    .get("/portfolio/projects/crona")
    .includes('href="/portfolio/work/local-first-work-tracking"'),
);
assert(
  pages
    .get("/portfolio/work/local-first-work-tracking")
    .includes('href="/portfolio/projects/crona"'),
);
for (const route of [
  "/portfolio",
  "/portfolio/work",
  "/portfolio/projects/crona",
]) {
  assert(
    !pages
      .get(route)
      .includes('href="/portfolio/work/reliable-interview-workflows"'),
    `${route}: draft leaked`,
  );
  assert(
    !pages
      .get(route)
      .includes('href="/portfolio/work/in-house-document-conversion"'),
    `${route}: unlisted entry leaked`,
  );
}
assert(
  pages.get("/portfolio/work/reliable-interview-workflows").includes("TODO:"),
);
console.log(
  `Verified ${pages.size} static portfolio pages, links, SEO, relationships, and visibility.`,
);
