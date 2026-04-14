import type { Metadata } from "next";
import { BookingPageView } from "@/components/booking-page-view";

export const metadata: Metadata = {
  title: "Booking | World Cup Experience",
  description: "Complete your World Cup travel booking with Altair Logistics",
};

export default function BookingPage() {
  return <BookingPageView />;
}
