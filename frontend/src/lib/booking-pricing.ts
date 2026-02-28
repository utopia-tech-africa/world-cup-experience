/**
 * Booking pricing constants. Matches booking-form add-on IDs.
 */
export const PACKAGE_PRICES = {
  hostel: 1000,
  hotel: 1800,
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
