import { getCollection } from "astro:content";
import { SITE_URL } from "./site";
import { getWritingPath } from "./writing";
import type {
  LinkPreviewKind,
  LinkPreviewRecord,
} from "./link-preview-shared";

type PageKind = "projects" | "writing" | "references" | "work" | "now";

type ContentNode = {
  path: string;
  title: string;
  summary: string;
  kind: PageKind;
  body: string;
  extraExternalLinks?: string[];
};

export type ContentBacklink = {
  href: string;
  label: string;
  section: string;
};

export type ContentReference = LinkPreviewRecord;

export type ContentLinkProfile = {
  backlinks: ContentBacklink[];
  references: ContentReference[];
  previewLinks: LinkPreviewRecord[];
  resourceHints: string[];
};

const emptyProfile: ContentLinkProfile = {
  backlinks: [],
  references: [],
  previewLinks: [],
  resourceHints: [],
};

const siteOrigin = new URL(SITE_URL).origin;

const markdownLinkPattern =
  /\[[^\]]*?\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<((?:https?:\/\/|\/)[^>\s]+)>/g;

const htmlHrefPattern = /href=["']([^"']+)["']/g;

const metaTagPattern = /<meta\b[^>]*>/gi;
const attrPattern = /([a-zA-Z:-]+)\s*=\s*["']([^"']*)["']/g;

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
  summary: string,
  kind: PageKind,
  body = "",
  extraExternalLinks: string[] = [],
): ContentNode => ({
  path: normalizePath(path),
  title,
  summary,
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

const getReferenceTitle = (url: URL) => {
  const pathname = normalizePath(url.pathname);
  const suffix = pathname === "/" ? "" : pathname;
  return `${url.hostname.replace(/^www\./, "")}${suffix}`;
};

const readMetaMap = (html: string) => {
  const meta = new Map<string, string>();

  for (const tagMatch of html.matchAll(metaTagPattern)) {
    const tag = tagMatch[0];
    const attrs: Record<string, string> = {};

    for (const attrMatch of tag.matchAll(attrPattern)) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }

    const key = (attrs.property ?? attrs.name ?? "").toLowerCase();
    const content = attrs.content?.trim();

    if (key && content && !meta.has(key)) {
      meta.set(key, content);
    }
  }

  return meta;
};

const readTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.replace(/\s+/g, " ").trim() ?? "";
};

const resolveMaybeRelativeUrl = (value: string | undefined, baseUrl: URL) => {
  if (!value) return undefined;

  try {
    return new URL(value, baseUrl).href;
  } catch {
    return undefined;
  }
};

const isImageUrl = (url: URL) => /\.(gif|gifv|png|jpe?g|webp|avif)$/i.test(url.pathname);
const isVideoUrl = (url: URL) => /\.(mp4|webm|mov|m4v)$/i.test(url.pathname);

const isYouTubeHost = (host: string) =>
  new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "www.youtu.be",
  ]).has(host);

const getYouTubeId = (url: URL) => {
  if (url.hostname.endsWith("youtu.be")) {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ?? null;
  }

  if (url.pathname.includes("/shorts/")) {
    const id = url.pathname.split("/shorts/")[1]?.split("/")[0];
    return id ?? null;
  }

  if (url.pathname.includes("/embed/")) {
    const id = url.pathname.split("/embed/")[1]?.split("/")[0];
    return id ?? null;
  }

  return url.searchParams.get("v");
};

const getYouTubePreview = async (url: URL): Promise<Partial<LinkPreviewRecord>> => {
  const id = getYouTubeId(url);
  if (!id) return {};

  const siteName = "YouTube";
  const image = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  try {
    const response = await fetch(url.href, {
      redirect: "follow",
      headers: {
        "user-agent":
        `Mozilla/5.0 (compatible; WebxsidPreviewBot/1.0; +${SITE_URL})`,
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return { image, siteName };
    }

    const html = await response.text();
    const meta = readMetaMap(html);
    const title = meta.get("og:title") ?? meta.get("twitter:title") ?? readTitle(html);
    const description =
      meta.get("og:description") ?? meta.get("twitter:description") ?? undefined;
    const previewImage = resolveMaybeRelativeUrl(
      meta.get("og:image") ?? meta.get("twitter:image"),
      url,
    );

    return {
      title,
      image: previewImage ?? image,
      siteName: meta.get("og:site_name") ?? siteName,
      description,
    };
  } catch {
    return { image, siteName };
  }
};

const getExternalPreview = (() => {
  const cache = new Map<string, Promise<Partial<LinkPreviewRecord>>>();

  return (url: URL) => {
    const key = url.href;
    const cached = cache.get(key);
    if (cached) return cached;

    const promise = (async () => {
      if (isImageUrl(url)) {
        return {
          title: decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? url.hostname),
          image: url.href,
          siteName: url.hostname.replace(/^www\./, ""),
          description: "",
          kind: "image" as LinkPreviewKind,
        };
      }

      if (isVideoUrl(url)) {
        return {
          title: decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? url.hostname),
          siteName: url.hostname.replace(/^www\./, ""),
          kind: "video" as LinkPreviewKind,
        };
      }

      if (isYouTubeHost(url.hostname)) {
        return getYouTubePreview(url);
      }

      try {
        const controller = new AbortController();
        const timeout = globalThis.setTimeout(() => controller.abort(), 4500);

        const response = await fetch(url.href, {
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "user-agent":
              `Mozilla/5.0 (compatible; WebxsidPreviewBot/1.0; +${SITE_URL})`,
            accept: "text/html,application/xhtml+xml",
          },
        });

        globalThis.clearTimeout(timeout);

        if (!response.ok) {
          return {
            title: url.hostname.replace(/^www\./, ""),
            siteName: url.hostname.replace(/^www\./, ""),
          };
        }

        const html = await response.text();
        const meta = readMetaMap(html);
        const title =
          meta.get("og:title") ??
          meta.get("twitter:title") ??
          readTitle(html) ??
          url.hostname.replace(/^www\./, "");
        const image = resolveMaybeRelativeUrl(
          meta.get("og:image") ?? meta.get("twitter:image"),
          url,
        );
        const siteName = meta.get("og:site_name") ?? url.hostname.replace(/^www\./, "");
        const description =
          meta.get("og:description") ?? meta.get("twitter:description") ?? undefined;
        const kind: LinkPreviewKind =
          image ? "external" : meta.get("og:type")?.includes("video") ? "video" : "external";

        return {
          title,
          image,
          siteName,
          description,
          kind,
        };
      } catch {
        return {
          title: url.hostname.replace(/^www\./, ""),
          siteName: url.hostname.replace(/^www\./, ""),
        };
      }
    })();

    cache.set(key, promise);
    return promise;
  };
})();

let contentLinkProfilesPromise: Promise<Map<string, ContentLinkProfile>> | null = null;

export async function getContentLinkProfiles() {
  if (!contentLinkProfilesPromise) {
    contentLinkProfilesPromise = buildContentLinkProfiles();
  }

  return contentLinkProfilesPromise;
}

async function buildContentLinkProfiles() {
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
        entry.data.summary,
        "projects",
        entry.body ?? "",
        [entry.data.source, entry.data.live].filter(Boolean) as string[],
      ),
    ),
    ...writing.map((entry) =>
      buildNode(
        getWritingPath(entry),
        entry.data.title,
        entry.data.summary,
        "writing",
        entry.body ?? "",
      ),
    ),
    ...references.map((entry) =>
      buildNode(
        `/references/${entry.id}`,
        entry.data.title,
        entry.data.summary,
        "references",
        entry.body ?? "",
      ),
    ),
    ...work.map((entry) =>
      buildNode(`/work/${entry.id}`, entry.data.title, entry.data.summary, "work", entry.body ?? ""),
    ),
    ...now.map((entry) =>
      buildNode(`/now/${entry.id}`, entry.data.title, entry.data.summary, "now", entry.body ?? ""),
    ),
  ];

  const pathToNode = new Map(nodes.map((node) => [getNodePath(node), node]));
  const backlinksByPath = new Map<string, ContentBacklink[]>();
  const referencesByPath = new Map<string, LinkPreviewRecord[]>();
  const previewLinksByPath = new Map<string, LinkPreviewRecord[]>();
  const resourceHintsByPath = new Map<string, Set<string>>();

  for (const node of nodes) {
    const path = getNodePath(node);
    const externalOrigins = new Set<string>();
    const previewBucket = previewLinksByPath.get(path) ?? [];
    const referenceBucket = referencesByPath.get(path) ?? [];

    for (const href of collectLinks(node.body)) {
      const resolved = resolveLink(href, path);
      if (!resolved) continue;

      const targetPath = normalizePath(resolved.pathname);
      const targetNode = pathToNode.get(targetPath);

      if (targetNode && targetPath !== path) {
        if (!backlinksByPath.get(targetPath)?.some((item) => item.href === path)) {
          const sourceBucket = backlinksByPath.get(targetPath) ?? [];
          sourceBucket.push({
            href: path,
            label: node.title,
            section: getSectionLabel(path),
          });
          backlinksByPath.set(targetPath, sourceBucket);
        }

        if (!previewBucket.some((item) => item.href === targetPath)) {
          previewBucket.push({
            href: targetPath,
            title: targetNode.title,
            origin: "Webxsid",
            displayUrl: targetPath,
            kind: "internal",
            description: targetNode.summary,
            siteName: getSectionLabel(targetPath),
            isInternal: true,
          });
        }

        continue;
      }

      const origin = resolved.origin;
      externalOrigins.add(origin);

      const preview = await getExternalPreview(resolved);
      const record: LinkPreviewRecord = {
        href: resolved.href,
        title: preview.title?.trim() || getReferenceTitle(resolved),
        origin: preview.siteName?.trim() || resolved.hostname.replace(/^www\./, ""),
        displayUrl: `${resolved.hostname.replace(/^www\./, "")}${normalizePath(resolved.pathname) === "/" ? "" : normalizePath(resolved.pathname)}${resolved.search ?? ""}`,
        kind:
          preview.kind ??
          (preview.image ? "external" : "generic"),
        image: preview.image,
        siteName: preview.siteName,
        description: preview.description,
        isInternal: false,
      };

      if (!previewBucket.some((item) => item.href === record.href)) {
        previewBucket.push(record);
      }

      if (!referenceBucket.some((item) => item.href === record.href)) {
        referenceBucket.push(record);
      }
    }

    for (const href of node.extraExternalLinks ?? []) {
      const resolved = resolveLink(href, path);
      if (!resolved) continue;

      const origin = resolved.origin;
      externalOrigins.add(origin);

      const preview = await getExternalPreview(resolved);
      const record: LinkPreviewRecord = {
        href: resolved.href,
        title: preview.title?.trim() || getReferenceTitle(resolved),
        origin: preview.siteName?.trim() || resolved.hostname.replace(/^www\./, ""),
        displayUrl: `${resolved.hostname.replace(/^www\./, "")}${normalizePath(resolved.pathname) === "/" ? "" : normalizePath(resolved.pathname)}${resolved.search ?? ""}`,
        kind: preview.kind ?? (preview.image ? "external" : "generic"),
        image: preview.image,
        siteName: preview.siteName,
        description: preview.description,
        isInternal: false,
      };

      if (!previewBucket.some((item) => item.href === record.href)) {
        previewBucket.push(record);
      }

      if (!referenceBucket.some((item) => item.href === record.href)) {
        referenceBucket.push(record);
      }
    }

    if (externalOrigins.size > 0) {
      resourceHintsByPath.set(path, externalOrigins);
    }

    previewLinksByPath.set(path, previewBucket);
    referencesByPath.set(path, referenceBucket);
  }

  const profiles = new Map<string, ContentLinkProfile>();

  for (const node of nodes) {
    const path = getNodePath(node);
    profiles.set(path, {
      backlinks: backlinksByPath.get(path) ?? [],
      references: referencesByPath.get(path) ?? [],
      previewLinks: previewLinksByPath.get(path) ?? [],
      resourceHints: [...(resourceHintsByPath.get(path) ?? [])].sort(),
    });
  }

  return profiles;
}

export function getEmptyContentLinkProfile(): ContentLinkProfile {
  return emptyProfile;
}
