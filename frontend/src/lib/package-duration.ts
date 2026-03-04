import type { BookingPackage } from "@/types/booking";

/**
 * Compute number of nights between two dates (YYYY-MM-DD). Returns null if invalid.
 */
export function nightsBetween(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate + "T12:00:00");
  const end = new Date(endDate + "T12:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}

/**
 * Get the duration label for display on game cards: "X night(s)" when package has
 * nights or startDate/endDate, otherwise returns package.duration (no date range).
 */
export function getPackageDurationLabel(pkg: Pick<BookingPackage, "duration" | "startDate" | "endDate" | "nights">): string {
  let nights: number | undefined = pkg.nights;
  if (nights == null && pkg.startDate && pkg.endDate) {
    nights = nightsBetween(pkg.startDate, pkg.endDate) ?? undefined;
  }
  if (nights != null && nights >= 0) {
    return `${nights} night${nights !== 1 ? "s" : ""}`;
  }
  return pkg.duration ?? "";
}
