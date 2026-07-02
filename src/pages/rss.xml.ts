import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_URL } from "../lib/site";
import { filterPublicWritingEntries, getWritingPath } from "../lib/writing";

export async function GET() {
  const writing = await getCollection("writing");

  const items = filterPublicWritingEntries(writing)
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: getWritingPath(entry),
      pubDate: entry.data.publishedAt,
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);

  return rss({
    title: "Webxsid RSS",
    description: "Recent writing from Webxsid.",
    site: SITE_URL,
    items,
  });
}
