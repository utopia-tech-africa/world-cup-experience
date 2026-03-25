"use client";

import ComponentLayout from "../component-layout";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { offers as staticOffers, TRIPLE_MATCHES } from "./data/packages-data";
import { usePackages } from "@/hooks/queries/usePackages";
import {
  buildGameOffersFromPackages,
  type GameOffer,
  type Match,
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
  ghanaFlag,
  PanamaFlag,
  englandFlag,
  croatiaFlag,
  IvoryCoastFlag,
  EcuadorFlag,
  GermanyFlag,
  CuracaoFlag,
  PackageBgImg,
} from "@/assets/img";
import { SINGLE_MATCH, DOUBLE_MATCHES } from "./data/packages-data";
import Image from "next/image";

const BLACK_STAR_MATCHES = [
  {
    stadium: "BMO Field, Toronto",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "Panama", flag: PanamaFlag },
    date: "June 17th 2026",
  },
  {
    stadium: "Boston Stadium, USA",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "England", flag: englandFlag },
    date: "June 23rd 2026",
  },
  {
    stadium: "Philadelphia Stadium, USA",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "Croatia", flag: croatiaFlag },
    date: "June 27th 2026",
  },
];

const MIENU_MATCHES = [
  {
    stadium: "Boston Stadium, USA",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "England", flag: englandFlag },
    date: "June 23rd 2026",
  },
  {
    stadium: "Philadelphia Stadium, USA",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "Croatia", flag: croatiaFlag },
    date: "June 27th 2026",
  },
];

const ELEPHANT_MATCHES = [
  {
    stadium: "Lincoln Field Philadelphia, USA",
    team1: { name: "Ivory Coast", flag: IvoryCoastFlag },
    team2: { name: "Ecuador", flag: EcuadorFlag },
    date: "June 14th 2026",
  },
  {
    stadium: "BMO Field, Toronto",
    team1: { name: "Ivory Coast", flag: IvoryCoastFlag },
    team2: { name: "Germany", flag: GermanyFlag },
    date: "June 20th 2026",
  },
  {
    stadium: "Lincoln Field Philadelphia, USA",
    team1: { name: "Ivory Coast", flag: IvoryCoastFlag },
    team2: { name: "Curacao", flag: CuracaoFlag },
    date: "June 25th 2026",
  },
];

const DEUX_MATCHES = [
  {
    stadium: "BMO Field, Toronto",
    team1: { name: "Ivory Coast", flag: IvoryCoastFlag },
    team2: { name: "Germany", flag: GermanyFlag },
    date: "June 20th 2026",
  },
  {
    stadium: "Lincoln Field Philadelphia, USA",
    team1: { name: "Ivory Coast", flag: IvoryCoastFlag },
    team2: { name: "Curacao", flag: CuracaoFlag },
    date: "June 25th 2026",
  },
];

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
    const fallbackDuration =
      offer.matches.length >= 3
        ? "13 nights"
        : offer.matches.length > 1
          ? "7 nights"
          : "4 nights";
    const duration =
      offer.duration?.trim() ?? match?.[1]?.trim() ?? fallbackDuration;
    const typeLabel = match?.[2]?.trim() ?? "";
    const packageName =
      offer.packageName?.trim() ||
      (typeLabel.toLowerCase().includes("triple")
        ? "Triple Game"
        : typeLabel.toLowerCase().includes("double")
          ? "Double Game"
          : typeLabel.toLowerCase().includes("quad")
            ? "Quad Game"
            : "One Game");
    return { packageName, duration };
  }

  return (
    <>
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

        <div className="flex flex-col gap-10">
          {/* Black Star Package */}
          <PackageCard
            title="Black Star"
            subtitle="Package"
            matchesLabel="Three matches"
            daysLabel="13 Nights"
            citiesLabel="3 Cities"
            includes={[
              "Philadelphia airport pick up and drop off",
              "Accommodation near match venues",
              "Double Occupancy Hotel rooms (Single on request at extra cost)",
              "Daily Breakfast",
              "Free WiFi",
              "Match Day Transportation",
              "Fan Village experience",
              "City tour - museums, galleries and other tourist attractions",
              "Shopping mall trips",
            ]}
            badgePackageType="13 nights (Triple game)"
            bgPattern={PackageBgPattern1}
            bgColorClass="bg-primary-600"
            gameCardBg={totalPackageGameCardBg}
            roomBg={TotalPackageRoomBg}
            matches={BLACK_STAR_MATCHES as unknown as Match[]}
            onBook={() => {
              setTripSummary({
                packageName: "Triple Game",
                duration: "13 nights",
              });
              setBookingForm({ accommodation: "hotel" });
              router.push("/booking");
            }}
            pricing={{
              dateRange: "June 16th - June 29th, 2026",
              options: [
                { hotelType: "4 star Hotel", price: "$4,500.00" },
                { hotelType: "3 star Hotel", price: "$3,000.00" },
              ],
            }}
          />

          {/* Mienu Package */}
          <PackageCard
            title="Mienu"
            subtitle="Package"
            matchesLabel="Two matches"
            daysLabel="7 Nights"
            citiesLabel="2 cities"
            includes={[
              "Philadelphia airport pick up and drop off",
              "Accommodation near match venues",
              "Double Occupancy Hotel rooms (Single on request at extra cost)",
              "Daily Breakfast",
              "Free WiFi",
              "Match Day Transportation",
              "Fan Village experience",
              "City tour - museums, galleries and other tourist attractions",
              "Shopping mall trips",
            ]}
            badgePackageType="7 nights (Double game)"
            bgPattern={PackageBgPattern1}
            bgColorClass="bg-primary-600"
            gameCardBg={doubleGameCardBg}
            roomBg={HotelRoomBg}
            matches={MIENU_MATCHES as unknown as Match[]}
            onBook={() => {
              setTripSummary({
                packageName: "Double Game",
                duration: "7 nights",
              });
              setBookingForm({ accommodation: "hotel" });
              router.push("/booking");
            }}
            pricing={{
              dateRange: "June 22nd - June 29th, 2026",
              options: [
                { hotelType: "4 star Hotel", price: "$3,000.00" },
                { hotelType: "3 star Hotel", price: "$1,500.00" },
              ],
            }}
          />

          {/* Elephant Package */}
          <PackageCard
            title="Elephant"
            subtitle="Package"
            matchesLabel="Three matches"
            daysLabel="13 Nights"
            citiesLabel="3 Cities"
            includes={[
              "Philadelphia airport pick up and drop off",
              "Accommodation near match venues",
              "Double Occupancy Hotel rooms (Single on request at extra cost)",
              "Daily Breakfast",
              "Free WiFi",
              "Match Day Transportation",
              "Fan Village experience",
              "City tour - museums, galleries and other tourist attractions",
              "Shopping mall trips",
            ]}
            badgePackageType="13 nights (Triple game)"
            bgPattern={PackageBgImgComponent}
            bgColorClass="bg-primary-700"
            gameCardBg={totalPackageGameCardBg}
            roomBg={TotalPackageRoomBg}
            matches={ELEPHANT_MATCHES as unknown as Match[]}
            onBook={() => {
              setTripSummary({
                packageName: "Triple Game",
                duration: "13 nights",
              });
              setBookingForm({ accommodation: "hotel" });
              router.push("/booking");
            }}
            pricing={{
              dateRange: "June 16th - June 29th, 2026",
              options: [
                { hotelType: "4 star Hotel", price: "$4,500.00" },
                { hotelType: "3 star Hotel", price: "$3,000.00" },
              ],
            }}
          />

          {/* Deux Package */}
          <PackageCard
            title="Deux"
            subtitle="Package"
            matchesLabel="Two matches"
            daysLabel="7 Nights"
            citiesLabel="2 cities"
            includes={[
              "Philadelphia airport pick up and drop off",
              "Accommodation near match venues",
              "Double Occupancy Hotel rooms (Single on request at extra cost)",
              "Daily Breakfast",
              "Free WiFi",
              "Match Day Transportation",
              "Fan Village experience",
              "City tour - museums, galleries and other tourist attractions",
              "Shopping mall trips",
            ]}
            badgePackageType="7 nights (Double game)"
            bgPattern={PackageBgImgComponent}
            bgColorClass="bg-primary-700"
            gameCardBg={doubleGameCardBg}
            roomBg={HotelRoomBg}
            matches={DEUX_MATCHES as unknown as Match[]}
            onBook={() => {
              setTripSummary({
                packageName: "Double Game",
                duration: "7 nights",
              });
              setBookingForm({ accommodation: "hotel" });
              router.push("/booking");
            }}
            pricing={{
              dateRange: "June 22nd - June 29th, 2026",
              options: [
                { hotelType: "4 star Hotel", price: "$3,000.00" },
                { hotelType: "3 star Hotel", price: "$1,500.00" },
              ],
            }}
          />
        </div>
      </ComponentLayout>
    </section>
  );
};

const PackageBgImgComponent = () => (
  <div className="absolute inset-0 overflow-hidden">
    <Image
      src={PackageBgImg}
      alt="Package Background"
      fill
      className="object-cover opacity-80"
    />
    <div className="absolute inset-0 bg-primary-100 opacity-90 mix-blend-multiply" />
  </div>
);
