import {
  buildOgImageHeaders,
  renderOgListImage,
} from "../../lib/og-image";

type ListKind = "projects" | "writing" | "references" | "notes";

export const prerender = true;

export async function getStaticPaths() {
  const kinds: ListKind[] = ["projects", "writing", "references", "notes"];

  return kinds.map((kind) => ({
    params: { kind },
  }));
}

const LIST_CONTENT: Record<ListKind, { title: string; summary: string; sectionLabel: string }> =
{
  projects: {
    title: "Projects",
    summary: "Tools and apps I've built, with notes on how they work and why I made them.",
    sectionLabel: "Projects",
  },
  writing: {
    title: "Writing",
    summary: "Essays and notes on software, developer tools, and the work of building them.",
    sectionLabel: "Writing",
  },
  references: {
    title: "References",
    summary: "Books, essays, films, talks, and music I want to remember.",
    sectionLabel: "References",
  },
  notes: {
    title: "Notes",
    summary: "Short notes and ideas I want to come back to.",
    sectionLabel: "Notes",
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
