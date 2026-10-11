import type { APIRoute } from "astro";
import { renderResumePdf } from "../lib/resume-pdf";

// Built to dist/resume.pdf from src/data/resume.ts on every build, so it can
// never fall behind the site.
export const prerender = true;

export const GET: APIRoute = async () => {
  const pdf = await renderResumePdf();

  return new Response(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf" },
  });
};
