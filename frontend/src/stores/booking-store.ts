import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import type { AddOn, BookingPackage, ExtraTraveler } from "@/types/booking";

export type AccommodationType = "hostel" | "hotel";

/** Add-on id -> quantity (0 = not selected). */
export type AddOnQuantities = Record<string, number>;

export type BookingFormState = {
  accommodation: AccommodationType;
  addOns: AddOnQuantities;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passportNumber: string;
  passportExpiryDate: string;
  specialRequests: string;
  extraTravelers: ExtraTraveler[];
};

export type TripSummaryState = {
  route: string;
  packageName: string;
  duration: string;
};

const defaultFormState: BookingFormState = {
  accommodation: "hotel",
  addOns: {},
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  passportNumber: "",
  passportExpiryDate: "",
  specialRequests: "",
  extraTravelers: [],
};

const defaultTripSummary: TripSummaryState = {
  route: "Accra (ACC) ✈ USA (US)",
  packageName: "One Game",
  duration: "4 nights",
};

/** Compute total from package × passengers, accommodation, and addon quantities. Uses API packages when provided. */
export function computeBookingTotal(
  accommodation: AccommodationType,
  addOns: AddOnQuantities,
  apiAddons: AddOn[],
  packageName: string,
  packages?: BookingPackage[],
  extraTravelers?: ExtraTraveler[]
): number {
  const packagePricePerPerson = getBasePackagePrice(packageName, accommodation, packages);
  const passengerCount = 1 + (extraTravelers?.length ?? 0);
  const packageTotal = packagePricePerPerson * passengerCount;
  const addOnsTotal = Object.entries(addOns ?? {}).reduce((sum, [id, qty]) => {
    if (qty <= 0) return sum;
    const addon = apiAddons.find((a) => a.id === id);
    if (!addon) return sum;
    const priceNumber = Number(addon.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) return sum;
    return sum + priceNumber * qty;
  }, 0);
  return packageTotal + addOnsTotal;
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
  "extraTravelers",
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
      onRehydrateStorage: () => () => {
        setTimeout(() => {
          const s = useBookingStore.getState();
          if (Array.isArray(s.addOns)) {
            useBookingStore.setState({
              addOns: Object.fromEntries(
                (s.addOns as unknown as string[]).map((id) => [id, 1]),
              ),
            });
          }
          useBookingStore.setState({ hasHydrated: true });
        }, 0);
      },
    },
  ),
);
