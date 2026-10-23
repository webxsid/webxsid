export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Content dates are date-only frontmatter values, parsed as UTC midnight.
// Formatting by hand keeps output identical across build locales
// (no "Sept" vs "Sep", no stray commas).
export function formatDate(date: Date) {
  return `${formatDayMonth(date)} ${date.getUTCFullYear()}`;
}

export function formatDayMonth(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${monthNames[date.getUTCMonth()]}`;
}
