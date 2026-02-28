import type { BookingFormData } from "@/types/booking";
import type { AddOn } from "@/types/booking";
import { ADD_ON_PRICES, PACKAGE_PRICES } from "@/lib/booking-pricing";

/** Map frontend addon slug to backend AddOn name (for resolving UUID from API). */
const ADDON_SLUG_TO_BACKEND_NAME: Record<string, string> = {
  merch: "Merch Bundle",
  "phl-shuttle": "PHL Airport Shuttle",
  transfers: "Premium Match-Day Priority Transfers",
  suv: "Private Delegation SUV",
  meals: "Lunch/Dinner Meal Add-on",
};

/**
 * Convert DD/MM/YYYY or similar to YYYY-MM-DD for backend.
 * If already ISO-like, return as-is.
 */
export function toBackendDateString(value: string): string {
  if (!value.trim()) return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const parts = trimmed.split(/[/-]/);
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const year = y!.length === 4 ? y : `20${y}`;
    return `${year}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
  }
  return trimmed;
}

/**
 * Resolve frontend addon IDs to backend addon UUIDs and prices.
 * Uses API addons list; prices come from frontend pricing (price at booking).
 */
export function resolveAddonsForPayload(
  frontendAddonIds: string[],
  apiAddons: AddOn[]
): Array<{ id: string; quantity: number; price: number }> {
  const result: Array<{ id: string; quantity: number; price: number }> = [];
  for (const slug of frontendAddonIds) {
    const backendName = ADDON_SLUG_TO_BACKEND_NAME[slug];
    const price = ADD_ON_PRICES[slug];
    if (backendName == null || price == null) continue;
    const addon = apiAddons.find((a) => a.name === backendName);
    if (addon) {
      result.push({ id: addon.id, quantity: 1, price });
    }
  }
  return result;
}

export type BuildBookingPayloadParams = {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiryDate: string;
  specialRequests: string;
  packageName: string;
  accommodationType: "hotel" | "hostel";
  addOnIds: string[];
  paymentAccountType: "local" | "international";
  paymentProofUrl: string;
  apiAddons: AddOn[];
};

export function buildBookingPayload(
  params: BuildBookingPayloadParams
): BookingFormData {
  const {
    fullName,
    email,
    phone,
    passportNumber,
    passportExpiryDate,
    specialRequests,
    packageName,
    accommodationType,
    addOnIds,
    paymentAccountType,
    paymentProofUrl,
    apiAddons,
  } = params;

  const packageType =
    packageName.toLowerCase().includes("double") ? "double_game" : "single_game";
  const basePackagePrice = PACKAGE_PRICES[accommodationType];
  const addons = resolveAddonsForPayload(addOnIds, apiAddons);
  const addonsTotalPrice = addons.reduce((sum, a) => sum + a.price, 0);
  const totalAmount = basePackagePrice + addonsTotalPrice;

  const passportExpiry = toBackendDateString(passportExpiryDate);
  if (!passportExpiry) {
    throw new Error("Passport expiry date is required");
  }

  return {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    passportNumber: passportNumber.trim(),
    passportExpiry,
    packageType,
    accommodationType,
    numberOfTravelers: 1,
    specialRequests: specialRequests.trim() || undefined,
    paymentAccountType,
    basePackagePrice,
    addonsTotalPrice,
    totalAmount,
    paymentProofUrl,
    addons,
  };
}
