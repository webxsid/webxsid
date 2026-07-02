import { getCollection, type CollectionEntry } from "astro:content";
import readingTime from "reading-time";
import { buildOgImageHeaders, renderOgImage } from "../../../lib/og-image";

export const prerender = true;

export async function getStaticPaths() {
  const writing = (await getCollection("writing")) as CollectionEntry<"writing">[];

  return writing.map((entry) => ({
    params: { slug: entry.id },
  }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const writing = (await getCollection("writing")) as CollectionEntry<"writing">[];
  const entry = writing.find((item) => item.id === params.slug);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const image = await renderOgImage({
    title: entry.data.title,
    summary: entry.data.summary,
    sectionLabel: "Writing",
    readTimeLabel: readingTime(entry.body ?? "").text,
  });

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
