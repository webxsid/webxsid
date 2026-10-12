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
assert.deepEqual(
  files,
  ["dist/portfolio/index.html"],
  "Only one portfolio page must be generated",
);
const html = await readFile(files[0], "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "IDs must be unique");
assert.equal((html.match(/<h1\b/g) || []).length, 1);
const sections = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(
  (match) => match[1],
);
assert.deepEqual(sections, [
  "about",
  "expertise",
  "work",
  "beyond-work",
  "contact",
]);
for (const id of sections)
  assert(
    html.includes(
      `aria-labelledby="${id === "about" ? "portfolio-name" : id === "beyond-work" ? "beyond-heading" : id + "-heading"}"`,
    ),
  );
assert(html.includes('class="portfolio-header"'), "Retain the header");
assert(!html.includes("<nav"), "No header section navigation");
for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
  const href = match[1];
  assert(href !== "#", "No placeholder links");
  if (href.startsWith("#"))
    assert(ids.includes(href.slice(1)), `Missing anchor: ${href}`);
  else if (href.startsWith("/")) {
    assert(!href.startsWith("/portfolio/"), `Nested portfolio link: ${href}`);
    const [path, fragment] = href.split("#");
    if (/\.\w+$/.test(path)) {
      await access(join("dist", path));
      continue;
    }
    const target = await readFile(join("dist", path, "index.html"), "utf8");
    if (fragment) assert(target.includes(`id="${fragment}"`));
  }
}
const canonical = new URL(
  process.env.PUBLIC_PORTFOLIO_BASE_URL || "/portfolio",
  "https://webxsid.com",
).href;
assert(html.includes(`<link rel="canonical" href="${canonical}"`));
assert(html.includes(`<meta property="og:url" content="${canonical}"`));
for (const tag of [
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"',
  'name="twitter:image"',
])
  assert(html.includes(tag));
assert(
  html.includes('property="og:image" content="https://webxsid.com/portfolio/og.png"'),
  "Portfolio uses its own share image",
);
assert(
  (await readFile("dist/portfolio/og.png")).subarray(1, 4).toString() === "PNG",
  "Share image is built",
);
const person = JSON.parse(
  html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s,
  )?.[1] || "{}",
);
assert.equal(person["@type"], "Person");
assert.equal(person.url, canonical);
assert(person.sameAs.includes("https://linkedin.com/in/webxsid"));
assert(html.includes('href="https://webxsid.com/"'));
assert(html.includes('href="/resume.pdf"'), "Link the built résumé");
assert(
  html.includes('download="Siddharth-Mittal-Resume.pdf"'),
  "Name the downloaded résumé",
);
const pdf = await readFile("dist/resume.pdf");
assert.equal(pdf.subarray(0, 5).toString(), "%PDF-", "Résumé is a PDF");
const pdfText = pdf.toString("latin1");
assert.equal(
  (pdfText.match(/\/Type \/Page\b/g) || []).length,
  1,
  "Résumé fits one page",
);
assert(pdfText.includes("/FontFile2"), "Résumé embeds TrueType fonts");
assert(!pdfText.includes("/Type3"), "No Type 3 fonts: ATS parsers cannot read them");
assert(!html.includes("<astro-island"), "No framework hydration");
assert(!html.includes("<form"), "No contact form");
assert.equal(
  (html.match(/class="work-details"/g) || []).length,
  3,
  "Native technical disclosures",
);
for (const name of [
  "Taptic",
  "Crona",
  "Appyhigh",
  "Galent / Taptic.ai",
  "Senior Platform Engineer",
  "Platform Engineer",
  "Software Development Engineer I",
  "May 2025 – Present",
  "February 2024 – April 2025",
  "Backend Developer Intern",
  "May 2022 – May 2023",
  "May 2023 – February 2024",
])
  assert(html.includes(name));
assert.equal(person.jobTitle, "Senior Platform Engineer");
assert(
  !html.includes("Senior Software Engineer"),
  "Use formal employment titles",
);
assert(html.includes("approximately 90 to 20 seconds"));
assert(html.includes("February and May 2025"));
assert(
  html.includes("before production deployment"),
  "Keep the POC maturity explicit",
);
assert(
  html.includes("preparing for production rollout"),
  "Do not imply migration completion",
);
assert(html.includes("native macOS"));
assert(html.includes("AST") || html.includes("syntax-tree"));
assert(!html.includes("55 GitHub stars"), "No stale adoption metric");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const portfolioUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter(
    (url) =>
      new URL(url).pathname.startsWith("/portfolio") ||
      new URL(url).hostname === "portfolio.webxsid.com",
  );
assert.deepEqual(portfolioUrls, [canonical]);
const config = await readFile("src/content.config.ts", "utf8");
assert(
  !/portfolio(Profile|Experience|CaseStudies|Projects)|schemas\/portfolio/.test(
    config,
  ),
);
const css = await readFile("src/styles/portfolio.css", "utf8");
assert(css.includes("prefers-reduced-motion"));
assert(css.includes("scroll-padding-top"));
assert(!css.includes("animation-timeline"));
for (const match of html.matchAll(/(?:src|href)="(\/_astro\/[^\"]+)"/g))
  await access(join("dist", match[1]));
console.log(
  "Verified single-page portfolio: five sections, anchors, existing content links, SEO, sitemap, built résumé PDF, and native disclosures.",
);
