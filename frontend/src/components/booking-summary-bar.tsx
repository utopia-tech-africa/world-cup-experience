"use client";

import Link from "next/link";
import { ArrowLeft, PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type BookingSummaryBarProps = {
  /** Route (e.g. from landing page): "Accra (ACC) ✈ USA (US)" */
  route: string;
  /** Package name (e.g. "One Game") */
  packageName: string;
  /** Duration (e.g. "4 nights") */
  duration: string;
  /** Cost in dollars (number or formatted string). Omit or use with costLoading when store not yet rehydrated. */
  cost?: number | string;
  /** Show skeleton for cost until store has rehydrated (avoids flash of wrong price). */
  costLoading?: boolean;
  /** Back link – e.g. "/" for landing when on /booking, "/booking" when on /booking/summary */
  backHref?: string;
  /** Optional: callback when back is clicked (if not using backHref) */
  onBack?: () => void;
  className?: string;
};

const BRAND_BLUE = "#354998";

function formatCost(cost: number | string): {
  dollars: string;
  cents: string;
} {
  if (typeof cost === "number") {
    const fixed = cost.toFixed(2);
    const [d, c] = fixed.split(".");
    return { dollars: `$${d}`, cents: c ?? "00" };
  }
  const match = String(cost).match(/^(\$?\d+)(?:\.(\d{2}))?$/);
  if (match) {
    return {
      dollars: match[1].startsWith("$") ? match[1] : `$${match[1]}`,
      cents: match[2] ?? "00",
    };
  }
  return { dollars: `$${cost}`, cents: "" };
}

/**
 * Nav bar for the booking flow (/booking, /booking/summary). Shows the package
 * details the user selected (or will select on the landing page) and a back
 * action to change the selection.
 */
export function BookingSummaryBar({
  route,
  packageName,
  duration,
  cost = 0,
  costLoading = false,
  backHref,
  onBack,
  className,
}: BookingSummaryBarProps) {
  const { dollars, cents } = formatCost(cost);
  const hasBackAction = backHref != null || onBack != null;
  const showCostSkeleton = costLoading;

  const [fromLabel, toLabel] = route.includes("✈")
    ? route.split("✈").map((part) => part.trim())
    : [route, ""];

  const backIcon = (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white",
        hasBackAction && "cursor-pointer hover:opacity-90",
      )}
      style={{ borderColor: BRAND_BLUE, color: BRAND_BLUE }}
      aria-hidden>
      <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
    </span>
  );

  return (
    <aside
      data-slot="booking-summary-bar"
      className={cn(
        "w-full border-b border-gray-200 font-general-sans",
        className,
      )}>
      <div className="mx-auto flex w-full max-w-[1512px] items-start justify-between gap-4 px-4 pt-[8px] pb-[12px] sm:gap-6 sm:px-8 md:gap-8 md:px-16 lg:px-[200px]">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
          {hasBackAction ? (
            backHref != null ? (
              <Link
                href={backHref}
                className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#354998] focus-visible:ring-offset-2"
                aria-label="Back to change selection">
                {backIcon}
              </Link>
            ) : (
              <button
                type="button"
                onClick={onBack}
                className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#354998] focus-visible:ring-offset-2"
                aria-label="Back to change selection">
                {backIcon}
              </button>
            )
          ) : (
            <div className="shrink-0">{backIcon}</div>
          )}

          <div className="min-w-0 flex-1">
            {/* Duration (e.g. 4 nights) */}
            <p className="text-[#D14B21] text-lg font-semibold leading-normal">
              {duration}
            </p>
            {/* Package name (e.g. One Game) */}
            <h2 className="text-foreground font-clash text-2xl font-semibold leading-tight sm:text-[28px]">
              {packageName}
            </h2>
            {/* Route row: Accra (ACC)  [plane icon]  USA (US) */}
            <div className="mt-1 flex items-center gap-3 text-sm font-medium text-foreground">
              <span className="truncate">{fromLabel}</span>
              <PlaneTakeoff className="h-4 w-4 shrink-0 text-[#111827]" />
              {toLabel ? <span className="truncate">{toLabel}</span> : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5 sm:items-start">
          <span className="text-[#303030] text-sm font-normal">Cost</span>
          {showCostSkeleton ? (
            <Skeleton className="h-8 w-24 sm:h-9 sm:w-28" aria-hidden />
          ) : (
            <p
              className="font-clash font-bold leading-none text-[#354998]"
              aria-label={`Cost ${dollars}.${cents}`}>
              <span className="text-2xl sm:text-[32px]">{dollars}.</span>
              {cents ? (
                <span className="text-base align-super font-normal sm:text-lg">
                  {cents}
                </span>
              ) : null}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
