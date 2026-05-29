import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

const SITE_URL = "https://webxsid.com";

export async function GET() {
  const [projects, writing, references, nowEntries] = await Promise.all([
    getCollection("projects"),
    getCollection("writing"),
    getCollection("references"),
    getCollection("now"),
  ]);

  const items = [
    ...writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/writing/${entry.data.kind === "note" ? "notes" : "blogs"}/${entry.id}`,
      pubDate: entry.data.publishedAt,
    })),
    ...references.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/references/${entry.id}`,
      pubDate: entry.data.publishedAt,
    })),
    ...nowEntries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/now/${entry.id}`,
      pubDate: entry.data.updatedAt,
    })),
    ...projects.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      link: `/projects/${entry.id}`,
      pubDate: entry.data.updatedAt,
    })),
  ]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);

  return rss({
    title: "Webxsid RSS",
    description:
      "Recent writing, references, now notes, and project updates from Webxsid.",
    site: SITE_URL,
    items,
  });
}
