import type { CollectionEntry } from "astro:content";

export type NowEntry = CollectionEntry<"now">;

export function parseNowDate(entry: NowEntry | string) {
  const value = typeof entry === "string" ? entry : entry.id;
  return new Date(`${value}T00:00:00Z`);
}

export function sortNowEntries(entries: NowEntry[]) {
  return [...entries].sort(
    (a, b) => parseNowDate(b).getTime() - parseNowDate(a).getTime(),
  );
}

export function getLatestNowEntry(entries: NowEntry[]) {
  return sortNowEntries(entries)[0];
}

export function formatNowUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatNowRailDate(id: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parseNowDate(id));
}
