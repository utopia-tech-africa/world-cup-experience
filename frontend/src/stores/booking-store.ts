import { create } from "zustand";
import { PACKAGE_PRICES } from "@/lib/booking-pricing";
import type { AddOn } from "@/types/booking";

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

/** Compute total from accommodation + selected addon IDs and API addons list. */
export function computeBookingTotal(
  accommodation: AccommodationType,
  addonIds: string[],
  apiAddons: AddOn[]
): number {
  const packagePrice = PACKAGE_PRICES[accommodation];
  const addOnsTotal = addonIds.reduce(
    (sum, id) => sum + (Number(apiAddons.find((a) => a.id === id)?.price) || 0),
    0
  );
  return packagePrice + addOnsTotal;
}

type BookingStore = BookingFormState &
  TripSummaryState & {
    setBookingForm: (values: Partial<BookingFormState>) => void;
    setTripSummary: (values: Partial<TripSummaryState>) => void;
    reset: () => void;
  };

export const useBookingStore = create<BookingStore>((set) => ({
  ...defaultFormState,
  ...defaultTripSummary,

  setBookingForm: (values) => set((state) => ({ ...state, ...values })),

  setTripSummary: (values) => set((state) => ({ ...state, ...values })),

  reset: () =>
    set({
      ...defaultFormState,
      ...defaultTripSummary,
    }),
}));
