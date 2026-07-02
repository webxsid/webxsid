import type { CollectionEntry } from "astro:content";

export type WritingKind = "blog" | "note";

export type WritingEntry = CollectionEntry<"writing">;

export function getWritingPath(entry: WritingEntry) {
  if (entry.data.draft) {
    return `/writing/draft/${entry.id}`;
  }

  return `/writing/${entry.id}`;
}

export function filterPublicWritingEntries(entries: WritingEntry[]) {
  return entries.filter((entry) => !entry.data.draft);
}

export function sortWritingEntries(entries: WritingEntry[]) {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function filterWritingEntries(entries: WritingEntry[], kind: WritingKind) {
  return entries.filter((entry) => entry.data.kind === kind);
}
