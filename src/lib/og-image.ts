import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { SITE_URL } from "./site";

export type OgImageInput = {
  title: string;
  summary: string;
  sectionLabel: string;
  readTimeLabel?: string;
  projectMeta?: {
    status: string;
    stack: string;
  };
  variant?: "content" | "landing";
};

export type OgListImageInput = {
  title: string;
  summary: string;
  sectionLabel: string;
};

const width = 1200;
const height = 630;
const brand = "WebxSid";
const brandHost = new URL(SITE_URL).host.replace(/^www\./, "");
const titleFontSize = 68;
const titleLineHeight = 86;
const summaryFontSize = 32;
const summaryLineHeight = 46;
const contentTop = 0;
const contentBottom = 600;
const blockGap = 28;
const imageCache = new Map<string, Promise<Buffer>>();
let iconDataUriPromise: Promise<string | null> | null = null;
const templatePromises = new Map<"content" | "landing" | "list", Promise<string>>();

const iconPath = resolve(process.cwd(), "assets/SiteIcon.png");
const contentTemplatePath = resolve(process.cwd(), "src/templates/og-image.ejs");
const landingTemplatePath = resolve(process.cwd(), "src/templates/landing-og-image.ejs");
const listTemplatePath = resolve(process.cwd(), "src/templates/list-og-image.ejs");
const listTitleFontSize = 58;
const listTitleLineHeight = 74;
const listSummaryFontSize = 28;
const listSummaryLineHeight = 40;
const projectMetaFontSize = 16;
const projectMetaLineHeight = 22;
const projectMetaGap = 18;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const wrapText = (text: string, maxChars: number, maxLines: number) => {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [] as string[];
  }

  const lines: string[] = [];
  let currentLine = "";

  const pushLine = (line: string) => {
    if (line) lines.push(line);
  };

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    if ((currentLine + " " + word).length <= maxChars) {
      currentLine = `${currentLine} ${word}`;
      continue;
    }

    pushLine(currentLine);
    currentLine = word;

    if (lines.length === maxLines - 1 && currentLine.length > maxChars) {
      break;
    }
  }

  pushLine(currentLine);

  if (lines.length <= maxLines) {
    return lines;
  }

  const trimmed = lines.slice(0, maxLines);
  const tail = trimmed[maxLines - 1];
  trimmed[maxLines - 1] = `${tail.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;

  return trimmed;
};

const linesToTspans = (lines: string[], x: number, lineHeight: number) =>
  lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

const measureBlockHeight = (lineCount: number, fontSize: number, lineHeight: number) => {
  if (lineCount <= 0) return 0;
  return fontSize + Math.max(0, lineCount - 1) * lineHeight;
};

const layoutTextBlocks = (titleLines: string[], summaryLines: string[]) => {
  const titleHeight = measureBlockHeight(titleLines.length, titleFontSize, titleLineHeight);
  const summaryHeight = measureBlockHeight(
    summaryLines.length,
    summaryFontSize,
    summaryLineHeight,
  );
  const totalHeight = titleHeight + (titleHeight && summaryHeight ? blockGap : 0) + summaryHeight;
  const availableHeight = contentBottom - contentTop;
  const startY =
    totalHeight < availableHeight ? contentTop + (availableHeight - totalHeight) / 2 : contentTop;

  return {
    titleY: Math.round(startY),
    summaryY: Math.round(startY + titleHeight + (titleHeight && summaryHeight ? blockGap : 0)),
  };
};

const layoutLandingTextBlocks = (titleLines: string[], summaryLines: string[]) => {
  const titleHeight = measureBlockHeight(titleLines.length, 76, 88);
  const summaryHeight = measureBlockHeight(summaryLines.length, 30, 44);
  const totalHeight = titleHeight + (titleHeight && summaryHeight ? 24 : 0) + summaryHeight;
  const availableHeight = contentBottom - contentTop;
  const startY =
    totalHeight < availableHeight ? contentTop + (availableHeight - totalHeight) / 2 : contentTop;

  return {
    titleY: Math.round(startY),
    summaryY: Math.round(startY + titleHeight + (titleHeight && summaryHeight ? 24 : 0)),
  };
};

const layoutProjectTextBlocks = (
  titleLines: string[],
  summaryLines: string[],
  metaLineCount: number,
) => {
  const titleHeight = measureBlockHeight(titleLines.length, titleFontSize, titleLineHeight);
  const summaryHeight = measureBlockHeight(
    summaryLines.length,
    summaryFontSize,
    summaryLineHeight,
  );
  const metaHeight = measureBlockHeight(metaLineCount, projectMetaFontSize, projectMetaLineHeight);
  const totalHeight =
    titleHeight +
    (titleHeight && summaryHeight ? blockGap : 0) +
    summaryHeight +
    (summaryHeight && metaHeight ? projectMetaGap : 0) +
    metaHeight;
  const availableHeight = contentBottom - contentTop;
  const startY =
    totalHeight < availableHeight ? contentTop + (availableHeight - totalHeight) / 2 : contentTop;

  const summaryY = Math.round(startY + titleHeight + (titleHeight && summaryHeight ? blockGap : 0));
  const metaY = Math.round(summaryY + summaryHeight + (summaryHeight && metaHeight ? projectMetaGap : 0));

  return {
    titleY: Math.round(startY),
    summaryY,
    metaY,
  };
};

const getIconDataUri = () => {
  if (!iconDataUriPromise) {
    iconDataUriPromise = readFile(iconPath)
      .then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`)
      .catch(() => null);
  }

  return iconDataUriPromise;
};

const getTemplate = (variant: "content" | "landing") => {
  const cached = templatePromises.get(variant);

  if (cached) {
    return cached;
  }

  const promise = readFile(
    variant === "landing" ? landingTemplatePath : contentTemplatePath,
    "utf8",
  );

  templatePromises.set(variant, promise);
  return promise;
};

const getListTemplate = () => {
  const cached = templatePromises.get("list");

  if (cached) {
    return cached;
  }

  const promise = readFile(listTemplatePath, "utf8");
  templatePromises.set("list", promise);
  return promise;
};

const renderTemplate = (template: string, data: Record<string, string>) => {
  const evaluate = (expr: string) =>
    new Function("data", `with (data) { return (${expr}); }`)(data);

  const compile = (tag: string, escapeOutput: boolean) => {
    const value = evaluate(tag);
    const stringValue = String(value ?? "");

    return escapeOutput ? escapeXml(stringValue) : stringValue;
  };

  return template.replace(/<%([=-])\s*([\s\S]+?)\s*%>/g, (_match, mode, expr) =>
    compile(expr.trim(), mode === "="),
  );
};

const buildSvg = async ({
  title,
  summary,
  sectionLabel,
  readTimeLabel = "",
  projectMeta,
  variant = "content",
}: OgImageInput) => {
  const iconDataUri = await getIconDataUri();
  const isLanding = variant === "landing";
  const template = await getTemplate(isLanding ? "landing" : "content");
  const renderedSectionLabel = isLanding ? "" : sectionLabel;
  const titleLines = wrapText(title, isLanding ? 28 : 50, isLanding ? 2 : 3);
  const summaryLines = wrapText(summary, isLanding ? 48 : 60, isLanding ? 2 : 3);
  const metaLines = projectMeta
    ? [
        `STATUS  ${projectMeta.status.toUpperCase()}`,
        `STACK   ${wrapText(projectMeta.stack, 56, 2)[0] ?? ""}`,
        ...wrapText(projectMeta.stack, 56, 2)
          .slice(1)
          .map((line) => `        ${line}`),
      ].filter(Boolean)
    : [];
  const layout = isLanding
    ? layoutLandingTextBlocks(titleLines, summaryLines)
    : projectMeta
      ? layoutProjectTextBlocks(titleLines, summaryLines, metaLines.length)
      : layoutTextBlocks(titleLines, summaryLines);
  const { titleY, summaryY } = layout;
  const metaY = "metaY" in layout ? layout.metaY : 0;
  const iconMarkup = isLanding
    ? iconDataUri
      ? `<image href="${iconDataUri}" x="510" y="550" width="44" height="44" preserveAspectRatio="xMidYMid meet" />`
      : `<circle cx="600" cy="40" r="22" fill="#7db4ff" fill-opacity="0.18" />`
    : iconDataUri
      ? `<image href="${iconDataUri}" x="40" y="580" width="30" height="30" preserveAspectRatio="xMidYMid meet" />`
      : `<circle cx="76" cy="76" r="18" fill="#7db4ff" fill-opacity="0.18" />`;

  const sharedData = {
    width: String(width),
    height: String(height),
    fullTitle: isLanding ? `${brand} landing preview` : `${brand} ${sectionLabel} preview`,
    desc: `${title} — ${summary}`,
    brand,
    brandHost,
    titleY: String(titleY),
    summaryY: String(summaryY),
    titleTspans: linesToTspans(titleLines, isLanding ? 600 : 64, 86),
    summaryTspans: linesToTspans(summaryLines, isLanding ? 600 : 64, 46),
    projectMetaMarkup: projectMeta
      ? `<text x="64" y="${metaY}" dominant-baseline="hanging" fill="#90909c" font-size="${projectMetaFontSize}" font-family="IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="0.12em">${linesToTspans(metaLines, 64, projectMetaLineHeight)}</text>`
      : "",
  };

  if (isLanding) {
    return renderTemplate(template, {
      ...sharedData,
      iconMarkup,
      brandX: "620",
      brandY: "580",
    });
  }

  return renderTemplate(template, {
    ...sharedData,
    iconMarkup,
    sectionLabel: renderedSectionLabel,
    readTimeLabel,
  });
};

const buildListSvg = async ({ title, summary, sectionLabel }: OgListImageInput) => {
  const iconDataUri = await getIconDataUri();
  const template = await getListTemplate();
  const titleLines = wrapText(title, 28, 2);
  const summaryLines = wrapText(summary, 48, 2);
  const titleHeight = measureBlockHeight(
    titleLines.length,
    listTitleFontSize,
    listTitleLineHeight,
  );
  const summaryHeight = measureBlockHeight(
    summaryLines.length,
    listSummaryFontSize,
    listSummaryLineHeight,
  );
  const totalHeight = titleHeight + (titleHeight && summaryHeight ? 24 : 0) + summaryHeight;
  const availableHeight = contentBottom - contentTop;
  const startY =
    totalHeight < availableHeight ? contentTop + (availableHeight - totalHeight) / 2 : contentTop;
  const titleY = Math.round(startY);
  const summaryY = Math.round(startY + titleHeight + (titleHeight && summaryHeight ? 24 : 0));
  const iconMarkup = iconDataUri
    ? `<image href="${iconDataUri}" x="40" y="580" width="30" height="30" preserveAspectRatio="xMidYMid meet" />`
    : `<circle cx="55" cy="595" r="18" fill="#7db4ff" fill-opacity="0.18" />`;

  return renderTemplate(template, {
    width: String(width),
    height: String(height),
    fullTitle: `${brand} ${title} list preview`,
    desc: `${title} — ${summary}`,
    iconMarkup,
    brand,
    titleY: String(titleY),
    summaryY: String(summaryY),
    titleTspans: linesToTspans(titleLines, 64, listTitleLineHeight),
    summaryTspans: linesToTspans(summaryLines, 64, listSummaryLineHeight),
    readTimeLabel: "",
    sectionLabel,
  });
};

export async function renderOgImage(input: OgImageInput) {
  const key = JSON.stringify(input);
  const cached = imageCache.get(key);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const svg = await buildSvg(input);
    return sharp(Buffer.from(svg)).png().toBuffer();
  })();

  imageCache.set(key, promise);
  return promise;
}

export async function renderOgListImage(input: OgListImageInput) {
  const key = JSON.stringify({ ...input, variant: "list" });
  const cached = imageCache.get(key);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const svg = await buildListSvg(input);
    return sharp(Buffer.from(svg)).png().toBuffer();
  })();

  imageCache.set(key, promise);
  return promise;
}

export function getProjectOgImagePath(slug: string) {
  return `/og-images/projects/${slug}.png`;
}

export function getWritingOgImagePath(slug: string) {
  return `/og-images/writing/${slug}.png`;
}

export function getStaticOgImagePath() {
  return "/og";
}

export function getListOgImagePath(kind: "projects" | "writing" | "references") {
  return `/og-list/${kind}.png`;
}

export function buildOgImageHeaders() {
  return {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
}
