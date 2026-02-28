import type { Metadata } from "next";
import { BookingPageContent } from "@/components/booking-page-content";
import { SuccessPageClient } from "./success-page-client";

export const metadata: Metadata = {
  title: "Booking Submitted | World Cup Experience",
  description: "Your booking has been submitted successfully",
};

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <BookingPageContent>
      <SuccessPageClient bookingReference={ref ?? null} />
    </BookingPageContent>
  );
}
