import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import rss from "@astrojs/rss";
import SiteIcon from "../../assets/SiteIcon.png";
import { SITE_URL } from "../lib/site";
import { filterPublicWritingEntries, getWritingPath } from "../lib/writing";
import { getNoteExcerpt, getNoteLabel, getNotePath, parseNoteTimestamp } from "../lib/notes";

const canonicalHomeUrl = new URL("/", SITE_URL).toString();
const canonicalFeedUrl = new URL("/rss.xml", SITE_URL).toString();
const feedImageUrl = new URL(SiteIcon.src, SITE_URL).toString();

const toAbsoluteUrl = (value: string, pagePath: string) => {
  try {
    return new URL(value, new URL(pagePath, SITE_URL)).toString();
  } catch {
    return value;
  }
};

const absolutizeSrcset = (value: string, pagePath: string) =>
  value
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;

      const [url, descriptor] = trimmed.split(/\s+/, 2);
      const absoluteUrl = toAbsoluteUrl(url, pagePath);
      return descriptor ? `${absoluteUrl} ${descriptor}` : absoluteUrl;
    })
    .join(", ");

const absolutizeRenderedContent = (content: string, pagePath: string) =>
  content.replace(
    /\s(href|src|poster|data-src|data-href|srcset)=("([^"]*)"|'([^']*)')/gi,
    (_match, attr, quotedValue, doubleQuotedValue, singleQuotedValue) => {
      const value = doubleQuotedValue ?? singleQuotedValue ?? "";
      const nextValue =
        attr.toLowerCase() === "srcset"
          ? absolutizeSrcset(value, pagePath)
          : toAbsoluteUrl(value, pagePath);

      const quote = quotedValue.startsWith("'") ? "'" : '"';
      return ` ${attr}=${quote}${nextValue}${quote}`;
    },
  );

const appendCanonicalFooter = (content: string) =>
  `${content}
<hr />
<p>Originally published on <a href="${canonicalHomeUrl}">${canonicalHomeUrl}</a>.</p>`;

export async function GET() {
  const [writing, notes] = await Promise.all([getCollection("writing"), getCollection("notes")]);
  const container = await AstroContainer.create();

  const writingItems = await Promise.all(
    filterPublicWritingEntries(writing).map(async (entry) => {
      const { Content } = await render(entry);
      const pagePath = getWritingPath(entry);
      const content = appendCanonicalFooter(
        absolutizeRenderedContent(await container.renderToString(Content), pagePath),
      );

      return {
        title: entry.data.title,
        description: entry.data.summary,
        link: pagePath,
        pubDate: entry.data.publishedAt,
        content,
        categories: entry.data.tags.length > 0 ? entry.data.tags : undefined,
      };
    }),
  );

  const noteItems = await Promise.all(
    notes.map(async (entry) => {
      const { Content } = await render(entry);
      const pagePath = getNotePath(entry);
      const content = appendCanonicalFooter(
        absolutizeRenderedContent(await container.renderToString(Content), pagePath),
      );

      return {
        title: getNoteLabel(entry),
        description: getNoteExcerpt(entry),
        link: pagePath,
        pubDate: parseNoteTimestamp(entry.id),
        content,
      };
    }),
  );

  const items = [...writingItems, ...noteItems];

  const sortedItems = items
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);
  const latestBuildDate =
    sortedItems[0]?.pubDate?.toUTCString() ?? new Date().toUTCString();
  const currentYear = new Date().getFullYear();

  return rss({
    title: "Webxsid",
    description:
      "Essays on backend engineering, local-first software, developer tools, systems design, and the occasional opinion.",
    site: SITE_URL,
    items: sortedItems,
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    customData: `
      <language>en-us</language>
      <copyright>Copyright ${currentYear}, Siddharth Mittal</copyright>
      <managingEditor>me@webxsid.com (Siddharth Mittal)</managingEditor>
      <webMaster>me@webxsid.com (Siddharth Mittal)</webMaster>
      <generator>Astro + @astrojs/rss</generator>
      <lastBuildDate>${latestBuildDate}</lastBuildDate>
      <atom:link href="${canonicalFeedUrl}" rel="self" type="application/rss+xml" />
      <image>
        <url>${feedImageUrl}</url>
        <title>Webxsid</title>
        <link>${canonicalHomeUrl}</link>
      </image>
    `,
  });
}
