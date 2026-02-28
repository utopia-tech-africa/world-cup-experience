"use client";

import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { BookingSummaryContent } from "@/components/booking-summary-content";
import { useBookingStore } from "@/stores/booking-store";

/**
 * Client wrapper for the booking summary page. Reads from the booking store
 * and renders the summary bar and content with persisted form data.
 */
export function BookingSummaryView() {
  const route = useBookingStore((s) => s.route);
  const packageName = useBookingStore((s) => s.packageName);
  const duration = useBookingStore((s) => s.duration);
  const getTotalCost = useBookingStore((s) => s.getTotalCost);

  const accommodation = useBookingStore((s) => s.accommodation);
  const addOns = useBookingStore((s) => s.addOns);

  const totalCost = getTotalCost();

  return (
    <>
      <BookingSummaryBar
        route={route}
        packageName={packageName}
        duration={duration}
        cost={totalCost}
        backHref="/booking"
      />
      <div className="mx-auto w-full max-w-[1512px] px-4 py-8 sm:px-8 lg:px-[200px]">
        <h1 className="text-foreground mb-6 text-2xl font-bold sm:text-3xl">
          Complete your booking
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
