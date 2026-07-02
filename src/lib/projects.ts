import type { CollectionEntry } from "astro:content";

export const projectStatuses = [
  "active",
  "building",
  "maintained",
  "archived",
  "prototype",
  "experimental",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "Active",
  building: "Building",
  maintained: "Maintained",
  archived: "Archived",
  prototype: "Prototype",
  experimental: "Experimental",
};

export type ProjectEntry = CollectionEntry<"projects">;

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const stripMarkdown = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\s+/g, " ");

const uniqueValues = (values: string[]) => {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(normalized);
  }

  return unique;
};

export const isProjectDetailPage = (entry: ProjectEntry) =>
  entry.data.detailsPage !== false;

export const getProjectHref = (entry: ProjectEntry) =>
  isProjectDetailPage(entry) ? `/projects/${entry.id}` : null;

export const getProjectCompanyHref = (entry: ProjectEntry) =>
  entry.data.company ? `/work/${entry.data.company.slug}` : null;

export const getProjectYearsLabel = (entry: ProjectEntry) => {
  const { yearStarted, yearEnded } = entry.data;

  if (!yearStarted && !yearEnded) return "";
  if (yearStarted && yearEnded && yearStarted !== yearEnded) {
    return `${yearStarted}–${yearEnded}`;
  }
  if (yearStarted && yearEnded) return `${yearStarted}`;
  if (yearStarted) return `${yearStarted}–`;
  return `–${yearEnded}`;
};

export const getProjectStackLabel = (entry: ProjectEntry) =>
  uniqueValues(entry.data.stack).join(" · ");

export const getProjectCompanyLabel = (entry: ProjectEntry) => {
  if (!entry.data.company) return "";

  const years = getProjectYearsLabel(entry);
  const label = `${entry.data.company.name}`;

  return years ? `${label} · ${years}` : label;
};

export const getProjectTagsLabel = (entry: ProjectEntry) => uniqueValues(entry.data.tags).join(" · ");

export const getProjectExcerpt = (body: string) => {
  const firstParagraph = body
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .find(Boolean);

  if (!firstParagraph) return "";

  return normalizeWhitespace(stripMarkdown(firstParagraph));
};
