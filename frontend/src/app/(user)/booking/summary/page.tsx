import type { Metadata } from "next";
import { BookingSummaryView } from "@/components/booking-summary-view";

export const metadata: Metadata = {
  title: "Booking Summary | World Cup Experience",
  description: "Review your World Cup travel booking summary",
};

export default function BookingSummaryPage() {
  return <BookingSummaryView />;
}
