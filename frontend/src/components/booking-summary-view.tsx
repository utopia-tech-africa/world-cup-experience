"use client";

import { useEffect } from "react";
import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { BookingSummaryContent } from "@/components/booking-summary-content";
import { useBookingStore, computeBookingTotal } from "@/stores/booking-store";
import { useAddons } from "@/hooks/queries/useAddons";
import { usePackages } from "@/hooks/queries/usePackages";
import { useBookingStoreRehydrated } from "@/hooks/use-booking-store-rehydrated";

/**
 * Client wrapper for the booking summary page. Reads from the booking store
 * and renders the summary bar and content with persisted form data.
 */
export function BookingSummaryView() {
  useBookingStoreRehydrated();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const hasHydrated = useBookingStore((s) => s.hasHydrated);
  const route = useBookingStore((s) => s.route);
  const packageName = useBookingStore((s) => s.packageName);
  const duration = useBookingStore((s) => s.duration);
  const accommodation = useBookingStore((s) => s.accommodation);
  const addOns = useBookingStore((s) => s.addOns);
  const extraTravelers = useBookingStore((s) => s.extraTravelers);
  const { data: apiAddons = [] } = useAddons();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const totalCost = computeBookingTotal(
    accommodation,
    addOns,
    apiAddons,
    packageName,
    packages,
    extraTravelers
  );

  return (
    <>
      <BookingSummaryBar
        route={route}
        packageName={packageName}
        duration={duration}
        cost={totalCost}
        costLoading={!hasHydrated || packagesLoading}
        backHref="/booking"
      />
      <div className="mx-auto w-full max-w-[1512px] px-4 py-8 sm:px-8 lg:px-[200px]">
        <h1 className="text-foreground font-clash mb-6 text-2xl font-bold sm:text-3xl">
          Payment
        </h1>
        <BookingSummaryContent
          data={{
            accommodation,
            addOns,
            packageName,
            duration,
          }}
        />
      </div>
    </>
  );
}
