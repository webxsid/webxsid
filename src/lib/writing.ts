import type { CollectionEntry } from "astro:content";

export type WritingKind = "blog" | "note";

type WritingEntry = CollectionEntry<"writing">;

export function getWritingPath(entry: WritingEntry) {
  return `/writing/${entry.data.kind === "note" ? "notes" : "blogs"}/${entry.id}`;
}

export function sortWritingEntries(entries: WritingEntry[]) {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function filterWritingEntries(entries: WritingEntry[], kind: WritingKind) {
  return entries.filter((entry) => entry.data.kind === kind);
}
