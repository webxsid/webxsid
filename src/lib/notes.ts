import type { CollectionEntry } from "astro:content";

export type NoteEntry = CollectionEntry<"notes">;

const timestampPattern = /^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})(\d{2})$/;

const normalizeText = (value: string) =>
  value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/u, "")
    .replace(/^\s*>\s?/u, "")
    .replace(/^\s*[-*+]\s+/u, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value: string, limit: number) =>
  value.length > limit
    ? `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
    : value;

export function parseNoteTimestamp(id: string) {
  const match = timestampPattern.exec(id);

  if (!match) {
    throw new Error(
      `Invalid note filename "${id}". Expected YYYY-MM-DD-HHmmss.`,
    );
  }

  const [, year, month, day, hour, minute, second] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date.getHours() !== Number(hour) ||
    date.getMinutes() !== Number(minute) ||
    date.getSeconds() !== Number(second)
  ) {
    throw new Error(`Invalid note timestamp in filename "${id}".`);
  }

  return date;
}

export function sortNotes(entries: NoteEntry[]) {
  return [...entries].sort(
    (a, b) =>
      parseNoteTimestamp(b.id).getTime() - parseNoteTimestamp(a.id).getTime(),
  );
}

export function getNotePath(entry: NoteEntry | string) {
  return `/notes/${typeof entry === "string" ? entry : entry.id}`;
}

export function formatNoteTimestamp(entry: NoteEntry | string) {
  const id = typeof entry === "string" ? entry : entry.id;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseNoteTimestamp(id));
}

export function getNoteLabel(entry: NoteEntry) {
  const line = (entry.body ?? "").split("\n").map(normalizeText).find(Boolean);

  return line ? truncate(line, 80) : formatNoteTimestamp(entry);
}

export function getNoteExcerpt(entry: NoteEntry) {
  const text = normalizeText(entry.body ?? "");
  return text ? truncate(text, 180) : formatNoteTimestamp(entry);
}
