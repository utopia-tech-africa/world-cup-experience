/**
 * Format a Date for display and API (e.g. "June 27th 2026").
 */
export function formatMatchDate(date: Date): string {
  const day = date.getDate();
  const suffix =
    day === 11 || day === 12 || day === 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${day}${suffix} ${year}`;
}

/**
 * Parse a match date string (e.g. "June 27th 2026" or "2026-06-27") to a Date.
 * Returns undefined if parsing fails.
 */
export function parseMatchDate(value: string): Date | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
  if (iso) {
    const d = new Date(trimmed + "T12:00:00");
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
