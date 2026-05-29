import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_URL } from "../lib/site";
import { filterWritingEntries } from "../lib/writing";

export async function GET() {
  const writing = await getCollection("writing");
  const blogs = filterWritingEntries(writing, "blog");

  const items = blogs
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/writing/blogs/${entry.id}`,
      pubDate: entry.data.publishedAt,
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);

  return rss({
    title: "Webxsid RSS",
    description: "Recent blog posts from Webxsid.",
    site: SITE_URL,
    items,
  });
}
