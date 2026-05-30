import { getCollection } from "astro:content";
import { getWritingPath } from "./writing";

type PageKind = "projects" | "writing" | "references" | "work" | "now";

type ContentNode = {
  path: string;
  title: string;
  kind: PageKind;
  body: string;
  extraExternalLinks?: string[];
};

export type ContentBacklink = {
  href: string;
  label: string;
  section: string;
};

export type ContentReference = {
  href: string;
  label: string;
  origin: string;
};

export type ContentLinkProfile = {
  backlinks: ContentBacklink[];
  references: ContentReference[];
  resourceHints: string[];
};

const emptyProfile: ContentLinkProfile = {
  backlinks: [],
  references: [],
  resourceHints: [],
};

const siteOrigin = "https://webxsid.com";

const markdownLinkPattern =
  /\[[^\]]*?\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<((?:https?:\/\/|\/)[^>\s]+)>/g;

const htmlHrefPattern = /href=["']([^"']+)["']/g;

const normalizePath = (value: string) => value.replace(/\/+$/, "") || "/";

const getSectionLabel = (path: string) => {
  const normalized = normalizePath(path);

  if (normalized === "/projects") return "Projects";
  if (normalized.startsWith("/projects/")) return "Projects";
  if (normalized === "/references") return "References";
  if (normalized.startsWith("/references/")) return "References";
  if (normalized === "/work") return "Work";
  if (normalized.startsWith("/work/")) return "Work";
  if (normalized === "/now") return "Now";
  if (normalized.startsWith("/now/")) return "Now";
  if (normalized === "/writing/blogs") return "Blogs";
  if (normalized.startsWith("/writing/blogs/")) return "Blogs";
  if (normalized === "/writing/notes") return "Notes";
  if (normalized.startsWith("/writing/notes/")) return "Notes";
  if (normalized.startsWith("/writing/")) return "Writing";

  return "Page";
};

const getNodePath = (entry: ContentNode) => normalizePath(entry.path);

const buildNode = (
  path: string,
  title: string,
  kind: PageKind,
  body = "",
  extraExternalLinks: string[] = [],
): ContentNode => ({
  path: normalizePath(path),
  title,
  kind,
  body,
  extraExternalLinks,
});

const collectLinks = (body: string) => {
  const urls = new Set<string>();

  for (const match of body.matchAll(markdownLinkPattern)) {
    const href = match[1] ?? match[2];
    if (href) urls.add(href.trim());
  }

  for (const match of body.matchAll(htmlHrefPattern)) {
    const href = match[1];
    if (href) urls.add(href.trim());
  }

  return [...urls];
};

const resolveLink = (href: string, sourcePath: string) => {
  if (!href || href.startsWith("#")) return null;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;

  try {
    const resolved = new URL(href, `${siteOrigin}${normalizePath(sourcePath)}/`);

    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return null;
    }

    return resolved;
  } catch {
    return null;
  }
};

const getReferenceLabel = (url: URL) => {
  const pathname = url.pathname === "/" ? "" : url.pathname;
  return `${url.hostname}${pathname}`;
};

export async function getContentLinkProfiles() {
  const [projects, writing, references, work, now] = await Promise.all([
    getCollection("projects"),
    getCollection("writing"),
    getCollection("references"),
    getCollection("work"),
    getCollection("now"),
  ]);

  const nodes: ContentNode[] = [
    ...projects.map((entry) =>
      buildNode(
        `/projects/${entry.id}`,
        entry.data.title,
        "projects",
        entry.body ?? "",
        [entry.data.source, entry.data.live].filter(Boolean) as string[],
      ),
    ),
    ...writing.map((entry) =>
      buildNode(getWritingPath(entry), entry.data.title, "writing", entry.body ?? ""),
    ),
    ...references.map((entry) =>
      buildNode(`/references/${entry.id}`, entry.data.title, "references", entry.body ?? ""),
    ),
    ...work.map((entry) =>
      buildNode(`/work/${entry.id}`, entry.data.title, "work", entry.body ?? ""),
    ),
    ...now.map((entry) =>
      buildNode(`/now/${entry.id}`, entry.data.title, "now", entry.body ?? ""),
    ),
  ];

  const pathToNode = new Map(nodes.map((node) => [getNodePath(node), node]));
  const backlinksByPath = new Map<string, ContentBacklink[]>();
  const referencesByPath = new Map<string, ContentReference[]>();
  const resourceHintsByPath = new Map<string, Set<string>>();

  for (const node of nodes) {
    const externalOrigins = new Set<string>();
    const path = getNodePath(node);
    const extraExternalLinks = node.extraExternalLinks ?? [];

    for (const href of collectLinks(node.body)) {
      const resolved = resolveLink(href, path);
      if (!resolved) continue;

      const targetPath = normalizePath(resolved.pathname);

      if (pathToNode.has(targetPath)) {
        if (targetPath === path) continue;

        const sourceBucket = backlinksByPath.get(targetPath) ?? [];
        if (!sourceBucket.some((item) => item.href === path)) {
          sourceBucket.push({
            href: path,
            label: node.title,
            section: getSectionLabel(path),
          });
        }
        backlinksByPath.set(targetPath, sourceBucket);
        continue;
      }

      const origin = resolved.origin;
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        externalOrigins.add(origin);

        const referenceBucket = referencesByPath.get(path) ?? [];
        const href = resolved.href;
        if (!referenceBucket.some((item) => item.href === href)) {
          referenceBucket.push({
            href,
            label: getReferenceLabel(resolved),
            origin,
          });
        }
        referencesByPath.set(path, referenceBucket);
      }
    }

    for (const href of extraExternalLinks) {
      const resolved = resolveLink(href, path);
      if (!resolved) continue;

      const origin = resolved.origin;
      externalOrigins.add(origin);

      const referenceBucket = referencesByPath.get(path) ?? [];
      const url = resolved.href;
      if (!referenceBucket.some((item) => item.href === url)) {
        referenceBucket.push({
          href: url,
          label: getReferenceLabel(resolved),
          origin,
        });
      }
      referencesByPath.set(path, referenceBucket);
    }

    if (externalOrigins.size > 0) {
      resourceHintsByPath.set(path, externalOrigins);
    }
  }

  const profiles = new Map<string, ContentLinkProfile>();

  for (const node of nodes) {
    const path = getNodePath(node);
    profiles.set(path, {
      backlinks: backlinksByPath.get(path) ?? [],
      references: referencesByPath.get(path) ?? [],
      resourceHints: [...(resourceHintsByPath.get(path) ?? [])].sort(),
    });
  }

  return profiles;
}

export function getEmptyContentLinkProfile(): ContentLinkProfile {
  return emptyProfile;
}
