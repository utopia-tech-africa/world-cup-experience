"use client";

import ComponentLayout from "../component-layout";
import { Loader2, Plus } from "lucide-react";
import { useMemo } from "react";
import { usePackages } from "@/hooks/queries/usePackages";
import {
  formatUsdPrice,
  getPackageBadgeTypeLabel,
  mapPublicGamesToMatches,
} from "@/components/games/data/games-data";
import { useBookingStore } from "@/stores/booking-store";
import { useRouter } from "next/navigation";
import { PackageCard } from "./components/package-card";
import { PackageBgPattern1, PackageBgPattern2 } from "@/assets/svg";
import {
  totalPackageGameCardBg,
  TotalPackageRoomBg,
  doubleGameCardBg,
  singleGameCardBg,
  HotelRoomBg,
  HostelRoomBg,
  PackageBgImg,
} from "@/assets/img";
import { formatDate } from "@/lib/format";
import type { BookingPackage } from "@/types/booking";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_INCLUDES = [
  "Airport pick up and drop off",
  "Accommodation near match venues",
  "Double Occupancy Hotel rooms (Single on request at extra cost)",
  "Daily Breakfast",
  "Free WiFi",
  "Match Day Transportation",
  "Fan Village experience",
  "City tour - museums, galleries and other tourist attractions",
  "Shopping mall trips",
];

function getTripSummaryForBooking(pkg: BookingPackage) {
  const duration =
    pkg.nights != null ? `${pkg.nights} nights` : pkg.duration?.trim() || "—";
  const typeCode =
    typeof pkg.type === "string" ? pkg.type : (pkg.type?.code ?? "");
  const haystack = `${pkg.typeName ?? ""} ${typeCode}`.toLowerCase();
  const matchCount = pkg.games?.length ?? 0;
  const packageName =
    pkg.name.trim() ||
    (haystack.includes("quad") || haystack.includes("four")
      ? "Quad Game"
      : haystack.includes("triple") || haystack.includes("three")
        ? "Triple Game"
        : haystack.includes("double") || haystack.includes("two")
          ? "Double Game"
          : matchCount >= 4
            ? "Quad Game"
            : matchCount >= 3
              ? "Triple Game"
              : matchCount === 2
                ? "Double Game"
                : "One Game");
  return { packageName, duration };
}

function formatPackageDateRange(pkg: BookingPackage): string {
  if (pkg.startDate && pkg.endDate) {
    return `${formatDate(pkg.startDate)} – ${formatDate(pkg.endDate)}`;
  }
  return "Dates confirmed at booking";
}

function cardVisualsForMatchCount(matchCount: number) {
  if (matchCount >= 3) {
    return {
      gameCardBg: totalPackageGameCardBg,
      roomBg: TotalPackageRoomBg,
    };
  }
  if (matchCount === 2) {
    return { gameCardBg: doubleGameCardBg, roomBg: HotelRoomBg };
  }
  return { gameCardBg: singleGameCardBg, roomBg: HostelRoomBg };
}

function matchesCountLabel(count: number): string {
  if (count === 1) return "One match";
  if (count === 2) return "Two matches";
  return `${count} matches`;
}

function citiesLabel(pkg: BookingPackage): string {
  const n = pkg.cityCount ?? 0;
  return `${n} ${n === 1 ? "city" : "cities"}`;
}

function nightsLabel(pkg: BookingPackage): string {
  if (pkg.nights != null) {
    return `${pkg.nights} Night${pkg.nights === 1 ? "" : "s"}`;
  }
  const d = pkg.duration?.trim();
  return d || "—";
}

export const Packages = () => {
  const router = useRouter();
  const setTripSummary = useBookingStore((s) => s.setTripSummary);
  const setBookingForm = useBookingStore((s) => s.setBookingForm);
  const { data: apiPackages = [], isLoading, isError } = usePackages();

  const packagesForCards = useMemo(
    () =>
      [...apiPackages]
        .filter((p) => p.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [apiPackages],
  );

  return (
    <section className="relative overflow-hidden">
      {/* Decorative Grid Lines and Nodes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Continuous Grid Lines (framing the content) */}
        <div className="absolute top-10 md:top-14 left-0 w-full h-px bg-neutral-300/50" />
        <div className="absolute bottom-10 md:bottom-14 left-0 w-full h-px bg-neutral-300/50" />
        <div className="absolute top-0 left-3 lg:left-15 w-px h-full bg-neutral-300/50" />
        <div className="absolute top-0 right-3 lg:right-15 w-px h-full bg-neutral-300/50" />

        {/* Intersection marker pluses */}
        <div className="absolute top-10 md:top-14 left-3 lg:left-15 -translate-x-1/2 -translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute top-10 md:top-14 right-3 lg:right-15 translate-x-1/2 -translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute bottom-10 md:bottom-14 left-3 lg:left-15 -translate-x-1/2 translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute bottom-10 md:bottom-14 right-3 lg:right-15 translate-x-1/2 translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
      </div>

      <ComponentLayout className="relative z-10" id="packages">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-clash text-neutral-800 leading-[1.05] mb-2 tracking-tight">
            Choose Your Perfect World Cup Experience
          </h2>
          <p className="text-base md:text-xl text-neutral-400/90 max-w-5xl font-helvetica ">
            Whether you&apos;re attending one iconic match or doubling the
            excitement with two unforgettable games, our hosting packages
            combine football, travel, and premium fan experiences into one
            seamless trip.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-neutral-500">
              <Loader2 className="size-6 animate-spin" />
              <span className="font-helvetica text-sm">Loading packages…</span>
            </div>
          )}

          {!isLoading && isError && (
            <p className="py-12 text-center font-helvetica text-sm text-neutral-500">
              We couldn&apos;t load packages right now. Please refresh or try
              again later.
            </p>
          )}

          {!isLoading && !isError && packagesForCards.length === 0 && (
            <p className="py-12 text-center font-helvetica text-sm text-neutral-500">
              No packages are available yet. Check back soon.
            </p>
          )}

          {!isLoading &&
            !isError &&
            packagesForCards.map((pkg, index) => {
              const matches = mapPublicGamesToMatches(pkg.games);
              const hasGhana = matches.some(
                (match) =>
                  match.team1.name === "Ghana" || match.team2.name === "Ghana",
              );
              const hasIvoryCoast = matches.some(
                (match) =>
                  match.team1.name === "Ivory Coast" ||
                  match.team2.name === "Ivory Coast",
              );
              const { gameCardBg, roomBg } = cardVisualsForMatchCount(
                matches.length,
              );
              const usePrimary200 = index % 2 === 0;
              const includes =
                pkg.includedItems && pkg.includedItems.length > 0
                  ? pkg.includedItems
                  : DEFAULT_INCLUDES;

              return (
                <PackageCard
                  key={pkg.id}
                  title={pkg.name}
                  matchesLabel={matchesCountLabel(matches.length)}
                  daysLabel={nightsLabel(pkg)}
                  citiesLabel={citiesLabel(pkg)}
                  includes={includes}
                  badgePackageType={getPackageBadgeTypeLabel(pkg)}
                  bgPattern={
                    hasGhana
                      ? PackageBgPattern1
                      : hasIvoryCoast
                        ? PackageBgImgComponent
                        : usePrimary200
                          ? PackageBgPattern1
                          : PackageBgPattern2
                  }
                  bgColorClass={
                    hasGhana
                      ? "bg-primary-200"
                      : hasIvoryCoast
                        ? "bg-primary-100"
                        : usePrimary200
                          ? "bg-primary-200"
                          : "bg-primary-100"
                  }
                  gameCardBg={gameCardBg}
                  roomBg={roomBg}
                  matches={matches}
                  onBook={() => {
                    const { packageName, duration } =
                      getTripSummaryForBooking(pkg);
                    setTripSummary({ packageName, duration });
                    setBookingForm({ accommodation: "hotel" });
                    router.push("/booking");
                  }}
                  pricing={{
                    dateRange: formatPackageDateRange(pkg),
                    options: [
                      {
                        hotelType: "4 stars",
                        price: formatUsdPrice(pkg.hotelPrice),
                      },
                      {
                        hotelType: "3 stars",
                        price: formatUsdPrice(pkg.hostelPrice),
                      },
                    ],
                  }}
                />
              );
            })}
        </div>
      </ComponentLayout>
    </section>
  );
};

const PackageBgImgComponent = ({ className }: { className?: string }) => (
  <div className={cn("absolute inset-0 overflow-hidden", className)}>
    <Image
      src={PackageBgImg}
      alt="Package Background"
      fill
      className="object-cover opacity-80"
    />
    <div className="absolute inset-0 bg-primary-100 opacity-90 mix-blend-multiply" />
  </div>
);
