import type { CollectionEntry } from "astro:content";

type ReferenceEntry = CollectionEntry<"references">;

export function getReferencePath(entry: ReferenceEntry) {
  return `/references/${entry.id}`;
}

export function sortReferenceEntries(entries: ReferenceEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return Number(b.data.featured) - Number(a.data.featured);
    }

    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}

export function formatReferenceType(type: ReferenceEntry["data"]["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatReferenceMeta(entry: ReferenceEntry) {
  const parts = [formatReferenceType(entry.data.type)];

  if (entry.data.creator) {
    parts.push(entry.data.creator);
  }

  if (entry.data.year) {
    parts.push(String(entry.data.year));
  }

  return parts.join(" · ");
}
