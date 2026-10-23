// Run after `pnpm build`. Verifies the static, machine-readable outputs agents rely on.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const SITE = "https://webxsid.com";

const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(
    (match) => [JSON.parse(match[1])].flat(),
  );

// llms.txt: https://llmstxt.org
const llms = await readFile("dist/llms.txt", "utf8");
const lines = llms.split("\n");
assert.equal(lines[0], "# Webxsid", "llms.txt must start with a single H1");
assert.equal((llms.match(/^# /gm) || []).length, 1, "llms.txt must have one H1");
assert.match(lines[2], /^> \S/, "llms.txt needs a summary blockquote after the H1");
const firstSection = llms.indexOf("\n## ");
assert(firstSection > 0, "llms.txt needs H2 link sections");
const details = llms.slice(0, firstSection);
assert.equal((details.match(/^#{2,6} /gm) || []).length, 0, "details before the first H2 must not contain headings");
assert.match(details, /When to use this site:/);
assert.match(details, /When not to use it:/);
for (const section of llms.slice(firstSection).split(/\n(?=## )/).filter(Boolean)) {
  const [heading, ...body] = section.trim().split("\n");
  assert.match(heading, /^## \S/);
  const items = body.filter((line) => line.trim());
  assert(items.length > 0, `${heading} must list links`);
  for (const item of items)
    assert.match(item, /^- \[[^\]]+\]\(https?:\/\/[^)\s]+\)(: .+)?$/, `bad llms.txt link: ${item}`);
}
assert.match(llms, /^## Optional$/m);
for (const required of [`${SITE}/portfolio`, `${SITE}/resume.pdf`, `${SITE}/sitemap.xml`])
  assert(llms.includes(`(${required})`), `llms.txt must link ${required}`);
assert(!llms.includes("/writing/draft/"), "llms.txt must not list drafts");

// Homepage JSON-LD
const home = await readFile("dist/index.html", "utf8");
const homeData = jsonLd(home);
const person = homeData.find((item) => item["@type"] === "Person");
const website = homeData.find((item) => item["@type"] === "WebSite");
assert(person, "homepage needs Person JSON-LD");
assert(website, "homepage needs WebSite JSON-LD");
for (const item of homeData) assert.equal(item["@context"], "https://schema.org");
assert.equal(person.name, "Siddharth Mittal");
assert.equal(person.url, `${SITE}/`);
assert.equal(website.url, `${SITE}/`);
assert.equal(website.author["@id"], person["@id"]);
assert.match(home, /<title>Webxsid · Siddharth Mittal<\/title>/);
assert.match(home, /<link rel="sitemap" type="application\/xml" href="\/sitemap.xml">/);

// Portfolio JSON-LD stays a single Person with the same identity
const portfolioData = jsonLd(await readFile("dist/portfolio/index.html", "utf8"));
assert.equal(portfolioData.length, 1);
assert.equal(portfolioData[0]["@type"], "Person");
assert.equal(portfolioData[0]["@id"], person["@id"]);
assert.equal(portfolioData[0].url, `${SITE}/portfolio`);

// 404 points agents somewhere useful
const notFound = await readFile("dist/404.html", "utf8");
for (const href of ["/", "/sitemap.xml", "/llms.txt"])
  assert(notFound.includes(`href="${href}"`), `404 must link ${href}`);

console.log("Agent-facing outputs verified: llms.txt, JSON-LD, 404 links.");
