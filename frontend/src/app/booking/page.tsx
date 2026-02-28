import type { Metadata } from "next";
import Link from "next/link";
import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Booking | World Cup Experience",
  description: "Complete your World Cup travel booking with Altair Logistics",
};

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-background">
        <BookingSummaryBar
          route="Accra (ACC) ✈ USA (US)"
        packageName="One Game"
        duration="4 nights"
        cost={1800}
        backHref="/"
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-foreground mb-8 text-2xl font-bold">Your booking</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Change package</Link>
          </Button>
          <Button asChild>
            <Link href="/booking/summary">Continue to summary</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
