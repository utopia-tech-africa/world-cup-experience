import type { StaticImageData } from "next/image";
import { ghanaFlag, croatiaFlag, englandFlag } from "@/assets/img";
import { getBasePackagePrice } from "@/lib/booking-pricing";
import { getPackageDurationLabel } from "@/lib/package-duration";
import type { BookingPackage, PublicGame } from "@/types/booking";

export interface TeamInfo {
  name: string;
  flag: StaticImageData;
}

export interface Match {
  stadium: string;
  team1: TeamInfo;
  team2: TeamInfo;
  date: string;
}

export interface GameOffer {
  id: number;
  type: string;
  matches: Match[];
  price: string;
  accommodation: string;
  /** When built from API packages, used for booking summary and pricing lookup */
  packageName?: string;
  duration?: string;
}

/** Map team name to flag asset (fallback to first flag if unknown). */
const TEAM_FLAGS: Record<string, StaticImageData> = {
  Ghana: ghanaFlag,
  Croatia: croatiaFlag,
  England: englandFlag,
};
const DEFAULT_FLAG = ghanaFlag;

function apiGameToMatch(g: PublicGame): Match {
  return {
    stadium: g.stadium ?? "Venue TBC",
    team1: {
      name: g.team1Name ?? "TBD",
      flag: TEAM_FLAGS[g.team1Name ?? ""] ?? DEFAULT_FLAG,
    },
    team2: {
      name: g.team2Name ?? "TBD",
      flag: TEAM_FLAGS[g.team2Name ?? ""] ?? DEFAULT_FLAG,
    },
    date: g.matchDate ?? "Date TBC",
  };
}

/** Convert API games to Match[] for display. */
export function apiGamesToMatches(apiGames: PublicGame[]): Match[] {
  return apiGames.map(apiGameToMatch);
}

/** Static match data by package type for building offers from API packages. */
const SINGLE_MATCHES: Match[] = [
  {
    stadium: "Philadelphia Stadium, USA",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "Croatia", flag: croatiaFlag },
    date: "June 27th 2026",
  },
];
const DOUBLE_MATCHES: Match[] = [
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

function formatPriceValue(value: number | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Build price string from shared pricing (Single: 1000/1800, Double: 1500/3000). */
function formatPrice(packageName: string, accommodation: "hostel" | "hotel"): string {
  const n = getBasePackagePrice(packageName, accommodation);
  return formatPriceValue(n);
}

/** Build game offers from API packages; uses nested package.games when present, else gamesByTypeCode or static fallback. */
export function buildGameOffersFromPackages(
  packages: BookingPackage[],
  gamesByTypeCode?: Record<string, PublicGame[]>
): GameOffer[] {
  const sorted = [...packages].sort((a, b) => a.displayOrder - b.displayOrder);
  const offers: GameOffer[] = [];
  let id = 1;
  for (const pkg of sorted) {
    const typeCode =
      typeof pkg.type === "string"
        ? pkg.type
        : (pkg.type as { code?: string } | undefined)?.code ?? "";
    const typeLabel =
      pkg.typeName ??
      (pkg.type as { name?: string } | undefined)?.name ??
      (typeCode
        ? typeCode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Package");
    const apiGames =
      pkg.games && pkg.games.length > 0
        ? [...pkg.games].sort(
            (a, b) =>
              (a.displayOrder ?? 0) - (b.displayOrder ?? 0) ||
              (a.matchDate ?? "").localeCompare(b.matchDate ?? "")
          )
        : gamesByTypeCode?.[typeCode];
    const matches =
      apiGames && apiGames.length > 0
        ? apiGamesToMatches(apiGames)
        : typeCode === "single_game"
          ? SINGLE_MATCHES
          : DOUBLE_MATCHES;
    const durationLabel = getPackageDurationLabel(pkg);
    const hostelAcc = `Hostel (${durationLabel})`;
    const hotelAcc = `Hotel (${durationLabel})`;
    offers.push({
      id: id++,
      type: typeLabel,
      matches,
      price: formatPriceValue(pkg.hostelPrice),
      accommodation: hostelAcc,
      packageName: pkg.name,
      duration: durationLabel,
    });
    offers.push({
      id: id++,
      type: typeLabel,
      matches,
      price: formatPriceValue(pkg.hotelPrice),
      accommodation: hotelAcc,
      packageName: pkg.name,
      duration: durationLabel,
    });
  }
  return offers;
}

export const gameOffers: GameOffer[] = [
  {
    id: 1,
    type: "Single game",
    matches: SINGLE_MATCHES,
    get price() {
      return formatPrice("One Game", "hostel");
    },
    accommodation: "Hostel (4 nights)",
  },
  {
    id: 2,
    type: "Single game",
    matches: SINGLE_MATCHES,
    get price() {
      return formatPrice("One Game", "hotel");
    },
    accommodation: "Hotel (4 nights)",
  },
  {
    id: 3,
    type: "Double game",
    matches: DOUBLE_MATCHES,
    get price() {
      return formatPrice("Double Game", "hostel");
    },
    accommodation: "Hostel (7 nights)",
  },
  {
    id: 4,
    type: "Double game",
    matches: DOUBLE_MATCHES,
    get price() {
      return formatPrice("Double Game", "hotel");
    },
    accommodation: "Hotel (7 nights)",
  },
];
