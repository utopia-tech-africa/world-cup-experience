import { cn } from "@/lib/utils";

type BookingPageContentProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wrapper for booking/summary page content. Applies 200px horizontal padding
 * at large viewports (matches booking summary bar). Use below BookingSummaryBar.
 */
export function BookingPageContent({
  children,
  className,
}: BookingPageContentProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1512px] px-4 py-8 sm:px-8 lg:px-[200px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
