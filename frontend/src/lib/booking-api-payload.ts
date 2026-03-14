import type { BookingFormData, BookingPackage } from "@/types/booking";
import type { AddOn } from "@/types/booking";
import { getBasePackagePrice, packageNameToType } from "@/lib/booking-pricing";

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
 * Resolve selected addon IDs (from API) to payload shape. Uses API addons for id and price.
 */
export function resolveAddonsForPayload(
  addonIds: string[],
  apiAddons: AddOn[],
): Array<{ id: string; quantity: number; price: number }> {
  const result: Array<{ id: string; quantity: number; price: number }> = [];
  for (const id of addonIds) {
    const addon = apiAddons.find((a) => a.id === id);
    if (addon) {
      result.push({ id: addon.id, quantity: 1, price: Number(addon.price) });
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
  packages?: BookingPackage[];
  extraTravelers?: Array<{
    firstName: string;
    lastName: string;
    passportNumber: string;
    passportExpiryDate: string;
  }>;
};

export function buildBookingPayload(
  params: BuildBookingPayloadParams,
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
    packages,
    extraTravelers = [],
  } = params;

  const packageType = packageNameToType(packageName);
  const basePackagePrice = getBasePackagePrice(
    packageName,
    accommodationType,
    packages
  );
  const addons = resolveAddonsForPayload(addOnIds, apiAddons);
  const addonsTotalPrice = addons.reduce((sum, a) => sum + a.price, 0);
  const totalAmount = basePackagePrice + addonsTotalPrice;

  const passportExpiry = toBackendDateString(passportExpiryDate);
  if (!passportExpiry) {
    throw new Error("Passport expiry date is required");
  }

  const extraTravelersPayload: Array<{
    firstName: string;
    lastName: string;
    passportNumber: string;
    passportExpiry: string;
  }> = extraTravelers.map((t) => {
    const expiry = toBackendDateString(t.passportExpiryDate);
    if (!expiry) throw new Error("Passport expiry is required for all travelers");
    return {
      firstName: t.firstName.trim(),
      lastName: t.lastName.trim(),
      passportNumber: t.passportNumber.trim(),
      passportExpiry: expiry,
    };
  });

  return {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    passportNumber: passportNumber.trim(),
    passportExpiry,
    packageType,
    accommodationType,
    numberOfTravelers: 1 + extraTravelersPayload.length,
    extraTravelers: extraTravelersPayload,
    specialRequests: specialRequests.trim() || undefined,
    paymentAccountType,
    basePackagePrice,
    addonsTotalPrice,
    totalAmount,
    paymentProofUrl,
    addons,
  };
}
