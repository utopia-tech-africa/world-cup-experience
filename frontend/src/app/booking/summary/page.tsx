import type { Metadata } from "next";
import Link from "next/link";
import { BookingSummaryBar } from "@/components/booking-summary-bar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Booking Summary | World Cup Experience",
  description: "Review your World Cup travel booking summary",
};

export default function BookingSummaryPage() {
  return (
    <main className="min-h-screen bg-background">
        <BookingSummaryBar
          route="Accra (ACC) ✈ USA (US)"
        packageName="One Game"
        duration="4 nights"
        cost={1800}
        backHref="/booking"
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-foreground mb-8 text-2xl font-bold">Booking summary</h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <Button asChild>
            <Link href="/booking">Back to booking</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
