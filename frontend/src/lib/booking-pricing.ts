/**
 * Package pricing per PROJECT_SCOPE: Single Game (4 nights), Double Game (7 nights).
 */
const PACKAGE_PRICES_BY_TYPE = {
  single_game: { hostel: 1000, hotel: 1800 },
  double_game: { hostel: 1500, hotel: 3000 },
} as const;

export type PackageType = keyof typeof PACKAGE_PRICES_BY_TYPE;

/** Get base package price for display and payload. Derives type from packageName. */
export function getBasePackagePrice(
  packageName: string,
  accommodation: "hostel" | "hotel"
): number {
  const type =
    packageName.toLowerCase().includes("double") ? "double_game" : "single_game";
  return PACKAGE_PRICES_BY_TYPE[type][accommodation];
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
