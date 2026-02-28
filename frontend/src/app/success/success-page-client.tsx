"use client";

import { SuccessModal } from "@/components/success-modal";

type SuccessPageClientProps = {
  bookingReference: string | null;
};

/**
 * Client wrapper that shows the success modal when the user lands on /success?ref=...
 */
export function SuccessPageClient({ bookingReference }: SuccessPageClientProps) {
  return (
    <SuccessModal
      open={true}
      bookingReference={bookingReference}
    />
  );
}
