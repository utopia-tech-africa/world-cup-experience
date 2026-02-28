import { create } from "zustand";
import {
  ADD_ON_PRICES,
  PACKAGE_PRICES,
} from "@/lib/booking-pricing";

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

function computeTotalCost(accommodation: AccommodationType, addOns: string[]): number {
  const packagePrice = PACKAGE_PRICES[accommodation];
  const addOnsTotal = addOns.reduce(
    (sum, id) => sum + (ADD_ON_PRICES[id] ?? 0),
    0,
  );
  return packagePrice + addOnsTotal;
}

type BookingStore = BookingFormState &
  TripSummaryState & {
    setBookingForm: (values: Partial<BookingFormState>) => void;
    setTripSummary: (values: Partial<TripSummaryState>) => void;
    getTotalCost: () => number;
    reset: () => void;
  };

export const useBookingStore = create<BookingStore>((set, get) => ({
  ...defaultFormState,
  ...defaultTripSummary,

  setBookingForm: (values) => set((state) => ({ ...state, ...values })),

  setTripSummary: (values) => set((state) => ({ ...state, ...values })),

  getTotalCost: () => {
    const { accommodation, addOns } = get();
    return computeTotalCost(accommodation, addOns);
  },

  reset: () =>
    set({
      ...defaultFormState,
      ...defaultTripSummary,
    }),
}));
