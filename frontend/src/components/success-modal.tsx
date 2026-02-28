"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Video path: file must live in `public/success-video.mp4` to be served at /success-video.mp4 */
const SUCCESS_VIDEO_SRC = "/success-video.mp4";

const NEXT_STEPS = [
  "Our team is currently reviewing your payment",
  "You will receive a confirmation email within 24-48 hours",
  "Once verified, we will book your flight tickets and send you complete booking details",
] as const;

type SuccessModalProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  bookingReference?: string | null;
};

/**
 * Success modal per Figma 117-2458: dark theme, video at top, confirmation copy, next steps, Go Home.
 */
export function SuccessModal({
  open,
  onOpenChange,
  bookingReference,
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[480px] overflow-hidden border-0 bg-[#101010] p-0 text-white",
          "sm:rounded-xl"
        )}
        aria-describedby="success-modal-description"
      >
        {/* Video at top — Figma 117-2458 */}
        <div className="relative aspect-video w-full bg-black">
          <video
            src={SUCCESS_VIDEO_SRC}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
          <DialogTitle className="text-center text-xl font-bold text-white sm:text-2xl">
            Booking Submitted Successfully!
          </DialogTitle>
          <DialogDescription
            id="success-modal-description"
            className="text-center text-sm text-white/90"
          >
            Thank you for booking your World Cup 2026 experience with Altair
            Logistics! We have received your booking and payment information.
            {bookingReference && (
              <span className="mt-2 block font-medium text-white">
                Your reference: {bookingReference}
              </span>
            )}
          </DialogDescription>

          <div className="bg-white/20 h-px w-full" aria-hidden />

          <div className="flex flex-col gap-2">
            <h3 className="text-left text-sm font-bold text-white">
              Next Steps:
            </h3>
            <ul className="flex list-disc flex-col gap-1 pl-4 text-left text-sm text-white/90">
              {NEXT_STEPS.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          <DialogClose asChild>
            <Button
              asChild
              className="mt-2 w-full rounded-full bg-[#354998] font-bold text-white hover:bg-[#354998]/90"
            >
              <Link href="/">Go Home</Link>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
