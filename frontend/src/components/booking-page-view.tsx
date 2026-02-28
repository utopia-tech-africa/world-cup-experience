"use client";

import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { BookingPageContent } from "@/components/booking-page-content";
import { BookingForm } from "@/components/booking-form";
import { useBookingStore } from "@/stores/booking-store";

/**
 * Client wrapper for the booking page. Uses the booking store for the summary
 * bar (route, package, duration, cost) so the bar reflects current or stored choices.
 */
export function BookingPageView() {
  const route = useBookingStore((s) => s.route);
  const packageName = useBookingStore((s) => s.packageName);
  const duration = useBookingStore((s) => s.duration);
  const getTotalCost = useBookingStore((s) => s.getTotalCost);

  return (
    <>
      <BookingSummaryBar
        route={route}
        packageName={packageName}
        duration={duration}
        cost={getTotalCost()}
        backHref="/"
      />
      <BookingPageContent>
        <h1 className="text-foreground mb-6 text-2xl font-bold sm:text-[40px]">
          Complete your booking
        </h1>
        <BookingForm />
      </BookingPageContent>
    </>
  );
}
