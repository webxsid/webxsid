import { buildOgImageHeaders, renderOgImage } from "../../lib/og-image";

export const prerender = true;

export async function GET() {
  const image = await renderOgImage({
    title: "Siddharth Mittal",
    summary:
      "Backend engineer building local-first tools, infrastructure, and software that lasts.",
    sectionLabel: "",
    variant: "landing",
  });

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
