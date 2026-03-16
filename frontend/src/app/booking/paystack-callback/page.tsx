"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SuccessModal } from "@/components/success-modal";
import { verifyPaystackPayment } from "@/services/paymentService";
import { Button } from "@/components/ui/button";

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!reference) {
        setError("Missing payment reference.");
        setLoading(false);
        return;
      }
      try {
        const result = await verifyPaystackPayment(reference);
        if (!result.success || !result.bookingReference) {
          setError("We could not confirm your payment. Please contact support.");
        } else {
          setBookingReference(result.bookingReference);
          setModalOpen(true);
        }
      } catch {
        setError("Something went wrong while verifying your payment.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [reference]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1512px] flex-col items-center justify-center px-4 sm:px-8 lg:px-[200px]">
      <SuccessModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) router.push("/");
        }}
        bookingReference={bookingReference}
      />

      {loading && (
        <p className="text-muted-foreground text-sm">
          Verifying your payment, please wait…
        </p>
      )}
      {!loading && error && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive text-sm">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/booking/summary")}
          >
            Back to summary
          </Button>
        </div>
      )}
    </div>
  );
}

