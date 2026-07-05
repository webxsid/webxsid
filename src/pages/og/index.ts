import { buildOgImageHeaders, renderOgImage } from "../../lib/og-image";

export const prerender = true;

export async function GET() {
  const image = await renderOgImage({
    title: "Siddharth Mittal",
    summary: "Building software that values clarity, ownership, and longevity.",
    sectionLabel: "",
    variant: "landing",
  });

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
