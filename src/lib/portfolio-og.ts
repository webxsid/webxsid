import * as fontkit from "fontkit";
import sharp from "sharp";
import { resolve } from "node:path";
import { portfolio } from "../data/portfolio";
import { SITE_URL } from "./site";

// The portfolio's own share card: the graphite sheet with the serif tagline.
// Text is drawn as glyph outlines, so the build host needs no installed fonts.
const width = 1200;
const height = 630;
const edge = 22;
const left = 96;
const right = width - 96;

const colors = {
  backdrop: "#202231",
  sheet: "#101014",
  line: "#32313a",
  text: "#eae9ee",
  muted: "#97949f",
  accent: "#8395f5",
};

const fontFile = (path: string) => resolve(process.cwd(), "node_modules", path);

type Face = Pick<fontkit.Font, "layout" | "unitsPerEm">;

let facesPromise: Promise<{ serif: Face; sans: Face; sansBold: Face }> | null =
  null;

const loadFaces = () => {
  facesPromise ??= (async () => {
    const [serif, sans, sansBold] = await Promise.all(
      [
        "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
        // Static weights: fontkit cannot instance the variable WOFF2 the site ships.
        "@fontsource/inter/files/inter-latin-400-normal.woff2",
        "@fontsource/inter/files/inter-latin-600-normal.woff2",
      ].map((path) => fontkit.open(fontFile(path)) as Promise<fontkit.Font>),
    );

    return { serif, sans, sansBold };
  })();

  return facesPromise;
};

const measure = (face: Face, text: string, size: number) =>
  (face.layout(text).advanceWidth * size) / face.unitsPerEm;

type TextOptions = {
  size: number;
  fill: string;
  anchor?: "start" | "end";
};

// `y` is the baseline.
const drawText = (
  face: Face,
  text: string,
  x: number,
  y: number,
  { size, fill, anchor = "start" }: TextOptions,
) => {
  const scale = size / face.unitsPerEm;
  const run = face.layout(text);
  let cursor = anchor === "end" ? x - run.advanceWidth * scale : x;

  const paths = run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const d = glyph.path.toSVG();
    const tx = cursor + position.xOffset * scale;
    const ty = y - position.yOffset * scale;
    cursor += position.xAdvance * scale;

    return d
      ? `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale} ${-scale})" d="${d}"/>`
      : "";
  });

  return `<g fill="${fill}">${paths.join("")}</g>`;
};

const wrap = (face: Face, text: string, size: number, maxWidth: number) => {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;

    if (line && measure(face, next, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines;
};

const buildSvg = async () => {
  const { serif, sans, sansBold } = await loadFaces();
  const host = new URL(SITE_URL).host.replace(/^www\./, "");
  const parts: string[] = [];

  // Header row: wordmark and address.
  const mark = "SM";
  parts.push(drawText(sansBold, mark, left, 112, { size: 26, fill: colors.text }));
  parts.push(
    drawText(sansBold, ".", left + measure(sansBold, mark, 26), 112, {
      size: 26,
      fill: colors.accent,
    }),
  );
  parts.push(
    drawText(sans, `${host}/portfolio`, right, 112, {
      size: 22,
      fill: colors.muted,
      anchor: "end",
    }),
  );

  // Who.
  parts.push(
    drawText(sansBold, portfolio.name, left, 232, { size: 30, fill: colors.text }),
  );
  parts.push(
    drawText(sans, portfolio.role, left, 272, { size: 26, fill: colors.muted }),
  );

  // The tagline carries the card.
  const taglineSize = 86;
  const taglineLeading = 94;
  wrap(serif, portfolio.headline, taglineSize, right - left).forEach(
    (line, index) => {
      parts.push(
        drawText(serif, line, left - 3, 384 + index * taglineLeading, {
          size: taglineSize,
          fill: colors.text,
        }),
      );
    },
  );

  // What, along the foot.
  let x = left;
  portfolio.expertiseAreas.forEach((area, index) => {
    if (index > 0) {
      parts.push(`<circle cx="${x + 18}" cy="545" r="3" fill="${colors.accent}"/>`);
      x += 36;
    }
    parts.push(drawText(sans, area, x, 553, { size: 23, fill: colors.muted }));
    x += measure(sans, area, 23);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="backdrop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colors.backdrop}"/>
      <stop offset="0.7" stop-color="#17171f"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#backdrop)"/>
  <rect x="${edge}" y="${edge}" width="${width - 2 * edge}" height="${height - 2 * edge}" rx="18" fill="${colors.sheet}" stroke="${colors.line}" stroke-opacity="0.7"/>
  ${parts.join("\n  ")}
</svg>`;
};

let imagePromise: Promise<Buffer> | null = null;

export function renderPortfolioOgImage() {
  imagePromise ??= buildSvg().then((svg) =>
    sharp(Buffer.from(svg)).png().toBuffer(),
  );

  return imagePromise;
}

export const portfolioOgImagePath = "/portfolio/og.png";
