import {
  buildOgImageHeaders,
  renderOgListImage,
} from "../../lib/og-image";

type ListKind = "projects" | "writing" | "references";

export const prerender = true;

export async function getStaticPaths() {
  const kinds: ListKind[] = ["projects", "writing", "references"];

  return kinds.map((kind) => ({
    params: { kind },
  }));
}

const LIST_CONTENT: Record<ListKind, { title: string; summary: string; sectionLabel: string }> =
{
  projects: {
    title: "Projects",
    summary: "Systems, tools, and ongoing experiments shaped through use rather than planning.",
    sectionLabel: "Projects",
  },
  writing: {
    title: "Writing",
    summary: "Essays, observations, and longer thoughts on software, systems, and the work around them.",
    sectionLabel: "Writing",
  },
  references: {
    title: "References",
    summary: "Books, articles, songs, and ideas that changed how I think or stayed with me afterwards.",
    sectionLabel: "References",
  },
};

export async function GET({ params }: { params: { kind: ListKind } }) {
  const content = LIST_CONTENT[params.kind];

  if (!content) {
    return new Response("Not found", { status: 404 });
  }

  const image = await renderOgListImage(content);

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
