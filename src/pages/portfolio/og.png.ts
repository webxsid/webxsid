import { buildOgImageHeaders } from "../../lib/og-image";
import { renderPortfolioOgImage } from "../../lib/portfolio-og";

export const prerender = true;

export async function GET() {
  const image = await renderPortfolioOgImage();

  return new Response(new Uint8Array(image), {
    headers: buildOgImageHeaders(),
  });
}
