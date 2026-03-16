"use client";

import ComponentLayout from "../component-layout";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PackageCard, TotalPackageBanner } from "./components";
import { offers as staticOffers, TRIPLE_MATCHES } from "./data/packages-data";
import { usePackages } from "@/hooks/queries/usePackages";
import {
  buildGameOffersFromPackages,
  type GameOffer,
  type Match,
} from "@/components/games/data/games-data";
import { useBookingStore } from "@/stores/booking-store";
import { useRouter } from "next/navigation";

export const Packages = () => {
  const router = useRouter();
  const setTripSummary = useBookingStore((s) => s.setTripSummary);
  const setBookingForm = useBookingStore((s) => s.setBookingForm);
  const { data: apiPackages = [], isLoading, isError } = usePackages();
  const offers: GameOffer[] =
    !isLoading && !isError && apiPackages.length > 0
      ? buildGameOffersFromPackages(apiPackages)
      : (staticOffers as unknown as GameOffer[]);

  // Triple game: pick the hotel variant for the Total Package banner
  const tripleOffer =
    offers.find(
      (offer) =>
        offer.matches.length >= 3 &&
        offer.accommodation.toLowerCase().includes("hotel"),
    ) ?? offers.find((offer) => offer.matches.length >= 3);

  const tripleMatches: Match[] = (tripleOffer?.matches ??
    TRIPLE_MATCHES) as unknown as Match[];
  // Grid should only show single/double game packages (no triple-game cards)
  const gridOffers = offers.filter((offer) => offer.matches.length < 3);

  /** Derive packageName and duration from GameOffer.type (e.g. "13 nights (Triple game)"). */
  function getTripSummaryFromOffer(offer: GameOffer) {
    const match = offer.type.match(/^(.+?)\s*\((.+)\)\s*$/);
    const duration = match?.[1]?.trim() ?? (offer.matches.length >= 3 ? "13 nights" : offer.matches.length > 1 ? "7 nights" : "4 nights");
    const typeLabel = match?.[2]?.trim() ?? "";
    const packageName =
      typeLabel.toLowerCase().includes("triple")
        ? "Triple Game"
        : typeLabel.toLowerCase().includes("double")
          ? "Double Game"
          : typeLabel.toLowerCase().includes("quad")
            ? "Quad Game"
            : "One Game";
    return { packageName, duration };
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
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

      <ComponentLayout className="relative z-10">
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

        <div className="flex flex-col gap-10 md:gap-20">
          {/* Total Package Banner Section */}
          <TotalPackageBanner
            matches={tripleMatches}
            onBook={() => {
              if (!tripleOffer) return;
              const { packageName, duration } = getTripSummaryFromOffer(tripleOffer);
              setTripSummary({ packageName, duration });
              setBookingForm({ accommodation: "hotel" });
              router.push("/booking");
            }}
          />

          <div className="w-full h-px bg-neutral-300/50" />
          {/* Grid of Standard Packages */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
            {gridOffers.map((offer, idx) => (
              <PackageCard
                key={offer.id}
                // Cast to GameOffer for compatibility with PackageCard props.
                offer={offer as GameOffer}
                className={cn(
                  idx === 0 || idx === 3 ? "md:col-span-3" : "md:col-span-2",
                  idx === 2 && "md:rounded-bl-[80px] pl-10",
                )}
                onBook={() => {
                  const { packageName, duration } = getTripSummaryFromOffer(offer);
                  const accommodation = offer.accommodation
                    .toLowerCase()
                    .includes("hostel")
                    ? "hostel"
                    : "hotel";
                  setTripSummary({ packageName, duration });
                  setBookingForm({ accommodation });
                  router.push("/booking");
                }}
              />
            ))}
          </div>
        </div>
      </ComponentLayout>
    </section>
  );
};
