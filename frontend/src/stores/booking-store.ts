import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import type { AddOn, BookingPackage } from "@/types/booking";

export type AccommodationType = "hostel" | "hotel";

export type BookingFormState = {
  accommodation: AccommodationType;
  addOns: string[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passportNumber: string;
  passportExpiryDate: string;
  specialRequests: string;
};

export type TripSummaryState = {
  route: string;
  packageName: string;
  duration: string;
};

const defaultFormState: BookingFormState = {
  accommodation: "hotel",
  addOns: [],
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  passportNumber: "",
  passportExpiryDate: "",
  specialRequests: "",
};

const defaultTripSummary: TripSummaryState = {
  route: "Accra (ACC) ✈ USA (US)",
  packageName: "One Game",
  duration: "4 nights",
};

/** Compute total from package, accommodation, and selected addons. Uses API packages when provided. */
export function computeBookingTotal(
  accommodation: AccommodationType,
  addonIds: string[],
  apiAddons: AddOn[],
  packageName: string,
  packages?: BookingPackage[]
): number {
  const packagePrice = getBasePackagePrice(packageName, accommodation, packages);
  const addOnsTotal = addonIds.reduce(
    (sum, id) => sum + (Number(apiAddons.find((a) => a.id === id)?.price) || 0),
    0
  );
  return packagePrice + addOnsTotal;
}

type BookingStore = BookingFormState &
  TripSummaryState & {
    hasHydrated: boolean;
    setBookingForm: (values: Partial<BookingFormState>) => void;
    setTripSummary: (values: Partial<TripSummaryState>) => void;
    reset: () => void;
  };

const PERSIST_KEYS: (keyof BookingFormState | keyof TripSummaryState)[] = [
  "accommodation",
  "addOns",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "passportNumber",
  "passportExpiryDate",
  "specialRequests",
  "route",
  "packageName",
  "duration",
];

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      ...defaultFormState,
      ...defaultTripSummary,
      hasHydrated: false,

      setBookingForm: (values) => set((state) => ({ ...state, ...values })),

      setTripSummary: (values) => set((state) => ({ ...state, ...values })),

      reset: () =>
        set({
          ...defaultFormState,
          ...defaultTripSummary,
          hasHydrated: true,
        }),
    }),
    {
      name: "world-cup-booking",
      partialize: (state) =>
        PERSIST_KEYS.reduce(
          (acc, key) => {
            acc[key] = state[key];
            return acc;
          },
          {} as Record<string, unknown>,
        ),
      onRehydrateStorage: () => (state, err) => {
        // Run after persist merge completes so our flag isn't overwritten
        setTimeout(() => {
          useBookingStore.setState({ hasHydrated: true });
        }, 0);
      },
    },
  ),
);
