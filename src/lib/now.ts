import type { CollectionEntry } from "astro:content";
import { formatDate, monthNames } from "./dates";

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
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatNowRailDate(id: string) {
  return formatDate(parseNowDate(id));
}
