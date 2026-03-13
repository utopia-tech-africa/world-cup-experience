"use client";

import { useEffect } from "react";
import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { BookingPageContent } from "@/components/booking-page-content";
import { BookingForm } from "@/components/booking-form";
import { useBookingStore, computeBookingTotal } from "@/stores/booking-store";
import { useAddons } from "@/hooks/queries/useAddons";
import { usePackages } from "@/hooks/queries/usePackages";
import { useBookingStoreRehydrated } from "@/hooks/use-booking-store-rehydrated";

/**
 * Client wrapper for the booking page. Uses the booking store for the summary
 * bar (route, package, duration, cost) so the bar reflects current or stored choices.
 */
export function BookingPageView() {
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
  const { data: apiAddons = [] } = useAddons();
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const cost = computeBookingTotal(
    accommodation,
    addOns,
    apiAddons,
    packageName,
    packages
  );

  return (
    <>
      <BookingSummaryBar
        route={route}
        packageName={packageName}
        duration={duration}
        cost={cost}
        costLoading={!hasHydrated || packagesLoading}
        backHref="/"
      />
      <BookingPageContent>
        <h1 className="text-foreground font-clash mb-6 text-2xl font-bold sm:text-[40px]">
          Complete your booking
        </h1>
        <BookingForm />
      </BookingPageContent>
    </>
  );
}
