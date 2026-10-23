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
  // Filenames record the author's local time in Asia/Kolkata (UTC+05:30).
  const localDate = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  ));

  if (
    localDate.getUTCFullYear() !== Number(year) ||
    localDate.getUTCMonth() !== Number(month) - 1 ||
    localDate.getUTCDate() !== Number(day) ||
    localDate.getUTCHours() !== Number(hour) ||
    localDate.getUTCMinutes() !== Number(minute) ||
    localDate.getUTCSeconds() !== Number(second)
  ) {
    throw new Error(`Invalid note timestamp in filename "${id}".`);
  }

  const date = new Date(localDate.getTime() - 330 * 60 * 1000);

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
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parseNoteTimestamp(id));
}

const noteDayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
});

const notePartsFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  day: "2-digit",
  month: "numeric",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Locale formats disagree on "Sep"/"Sept" and commas; assemble labels by hand.
const getNoteDateParts = (id: string) => {
  const parts = Object.fromEntries(
    notePartsFormat
      .formatToParts(parseNoteTimestamp(id))
      .map(({ type, value }) => [type, value]),
  );

  return {
    weekday: parts.weekday,
    day: parts.day,
    month: monthNames[Number(parts.month) - 1],
    year: parts.year,
  };
};

const noteTimeFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Kolkata",
});

export function formatNoteDay(entry: NoteEntry | string) {
  const id = typeof entry === "string" ? entry : entry.id;
  const { weekday, day, month, year } = getNoteDateParts(id);
  return `${weekday} ${day} ${month} ${year}`;
}

export function formatNoteShortDay(entry: NoteEntry | string) {
  const id = typeof entry === "string" ? entry : entry.id;
  const { day, month } = getNoteDateParts(id);
  return `${day} ${month}`;
}

export function formatNoteTime(entry: NoteEntry | string) {
  const id = typeof entry === "string" ? entry : entry.id;
  return noteTimeFormat.format(parseNoteTimestamp(id));
}

export type NoteDay = {
  key: string;
  label: string;
  notes: NoteEntry[];
};

// Expects notes already sorted with sortNotes.
export function groupNotesByDay(entries: NoteEntry[]): NoteDay[] {
  const days: NoteDay[] = [];

  for (const entry of entries) {
    const key = noteDayKeyFormat.format(parseNoteTimestamp(entry.id));
    const current = days.at(-1);

    if (current?.key === key) {
      current.notes.push(entry);
      continue;
    }

    days.push({ key, label: formatNoteDay(entry), notes: [entry] });
  }

  return days;
}

export function getAdjacentNotes(entries: NoteEntry[], id: string) {
  const sorted = sortNotes(entries);
  const index = sorted.findIndex((entry) => entry.id === id);

  return {
    newer: index > 0 ? sorted[index - 1] : undefined,
    older: index >= 0 ? sorted[index + 1] : undefined,
  };
}

export function getNoteLabel(entry: NoteEntry) {
  const line = (entry.body ?? "").split("\n").map(normalizeText).find(Boolean);

  return line ? truncate(line, 80) : formatNoteTimestamp(entry);
}

export function getNoteExcerpt(entry: NoteEntry) {
  const text = normalizeText(entry.body ?? "");
  return text ? truncate(text, 180) : formatNoteTimestamp(entry);
}
