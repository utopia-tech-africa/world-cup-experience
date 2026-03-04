/**
 * Compute number of nights between two dates (YYYY-MM-DD).
 * Returns null if either date is invalid or missing.
 */
export function nightsBetween(startDate: string | null | undefined, endDate: string | null | undefined): number | null {
  if (!startDate || !endDate || typeof startDate !== "string" || typeof endDate !== "string") return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}
