import type { CollectionEntry } from "astro:content";
import readingTime from "reading-time";

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
  return [...entries].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function filterWritingEntries(entries: WritingEntry[], kind: WritingKind) {
  return entries.filter((entry) => entry.data.kind === kind);
}

export function getWritingReadTime(entry: WritingEntry) {
  const minutes = Math.max(1, Math.round(readingTime(entry.body ?? "").minutes));
  return `${minutes} min read`;
}

export function groupWritingByYear(entries: WritingEntry[]) {
  const years: { year: number; entries: WritingEntry[] }[] = [];

  for (const entry of entries) {
    const year = entry.data.publishedAt.getUTCFullYear();
    const current = years.at(-1);

    if (current?.year === year) {
      current.entries.push(entry);
      continue;
    }

    years.push({ year, entries: [entry] });
  }

  return years;
}
