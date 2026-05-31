import { getCollection, type CollectionEntry } from "astro:content";
import { buildOgImageHeaders, renderOgImage } from "../../../lib/og-image";

export const prerender = true;

export async function getStaticPaths() {
  const projects = (await getCollection("projects")) as CollectionEntry<"projects">[];

  return projects.map((entry) => ({
    params: { slug: entry.id },
  }));
}

export async function GET({ params }: { params: { slug: string } }) {
  const projects = (await getCollection("projects")) as CollectionEntry<"projects">[];
  const project = projects.find((item) => item.id === params.slug);

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  const image = await renderOgImage({
    title: project.data.title,
    summary: project.data.summary,
    sectionLabel: "Project",
    projectMeta: {
      status:
        project.data.status.charAt(0).toUpperCase() + project.data.status.slice(1),
      stack: project.data.stack.join(" · "),
    },
  });

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
