import type { BookingPackage } from "@/types/booking";

/**
 * Fallback pricing when API packages are not available (by type code).
 */
const PACKAGE_PRICES_BY_TYPE: Record<string, { hostel: number; hotel: number }> = {
  single_game: { hostel: 1000, hotel: 1800 },
  double_game: { hostel: 1500, hotel: 3000 },
  triple_game: { hostel: 2000, hotel: 4000 },
  quad_game: { hostel: 2500, hotel: 5000 },
};

/** Derive package type code from package name (e.g. "One Game" → single_game, "Triple Game" → triple_game). */
export function packageNameToType(packageName: string): string {
  const lower = packageName.toLowerCase();
  if (lower.includes("quad") || lower.includes("four")) return "quad_game";
  if (lower.includes("triple") || lower.includes("three")) return "triple_game";
  if (lower.includes("double") || lower.includes("two")) return "double_game";
  return "single_game";
}

/** Get base package price from API packages by package name and accommodation. */
export function getBasePackagePriceFromPackages(
  packages: BookingPackage[],
  packageName: string,
  accommodation: "hostel" | "hotel"
): number {
  const type = packageNameToType(packageName);
  const pkg = packages.find((p) => p.type === type);
  if (pkg) return accommodation === "hostel" ? pkg.hostelPrice : pkg.hotelPrice;
  const fallback = PACKAGE_PRICES_BY_TYPE[type];
  return fallback ? fallback[accommodation] : PACKAGE_PRICES_BY_TYPE.single_game[accommodation];
}

/** Get base package price for display and payload. Uses API packages when provided, else fallback. */
export function getBasePackagePrice(
  packageName: string,
  accommodation: "hostel" | "hotel",
  packages?: BookingPackage[]
): number {
  if (packages && packages.length > 0) {
    return getBasePackagePriceFromPackages(packages, packageName, accommodation);
  }
  const type = packageNameToType(packageName);
  const fallback = PACKAGE_PRICES_BY_TYPE[type];
  return fallback ? fallback[accommodation] : PACKAGE_PRICES_BY_TYPE.single_game[accommodation];
}

/** Legacy flat map for callers that only have accommodation (defaults to single_game). */
export const PACKAGE_PRICES = {
  hostel: PACKAGE_PRICES_BY_TYPE.single_game.hostel,
  hotel: PACKAGE_PRICES_BY_TYPE.single_game.hotel,
} as const;

export const ADD_ON_PRICES: Record<string, number> = {
  merch: 75,
  "phl-shuttle": 120,
  suv: 800,
  meals: 350,
  transfers: 200,
};

export const ADD_ON_LABELS: Record<string, string> = {
  merch: "Merch Bundle (scarf/cap/flag kit)",
  "phl-shuttle": "PHL Airport Shuttle (round trip)",
  suv: "Private Delegation SUV",
  meals: "Lunch / Dinner Meal Add-on",
  transfers: "Premium Match-Day Priority Transfers",
};
