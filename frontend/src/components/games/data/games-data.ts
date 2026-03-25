import type { BookingPackage, PublicGame } from "@/types/booking";

export type Match = {
  stadium: string;
  team1: { name: string; flag: string };
  team2: { name: string; flag: string };
  date: string;
};

/** Format API match dates (ISO or plain text) for display in match cards. */
export function formatMatchDateDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return trimmed;
}

export function formatUsdPrice(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Map public API games to match rows for package cards (flags = image URLs or ""). */
export function mapPublicGamesToMatches(games: PublicGame[] | undefined): Match[] {
  if (!games || games.length === 0) return [];
  return games.map((g) => ({
    stadium: g.stadium,
    team1: { name: g.team1.name, flag: g.team1.flagUrl ?? "" },
    team2: { name: g.team2.name, flag: g.team2.flagUrl ?? "" },
    date: formatMatchDateDisplay(g.matchDate),
  }));
}

export type GameOffer = {
  id: string;
  type: string;
  matches: Match[];
  price: string;
  accommodation: string;
  packageName?: string;
  duration?: string;
  cityCount?: number;
  includedItems?: string[];
};

function mapGamesToMatches(games: PublicGame[] | undefined): Match[] {
  return mapPublicGamesToMatches(games);
}

function baseGameKindFromPackage(pkg: BookingPackage): string {
  const typeName =
    typeof pkg.type === "object" && pkg.type
      ? (pkg.type.name ?? pkg.type.code ?? "")
      : (pkg.typeName ?? "").trim();
  const typeCode =
    typeof pkg.type === "string" ? pkg.type : (pkg.type?.code ?? "");
  const haystack = `${typeName} ${typeCode}`.toLowerCase();
  if (haystack.includes("triple")) return "Triple game";
  if (haystack.includes("double")) return "Double game";
  if (haystack.includes("quad")) return "Quad game";
  return "Single game";
}

/** Badge line on match cards, e.g. "7 nights (Double game)". */
export function getPackageBadgeTypeLabel(pkg: BookingPackage): string {
  const nightsLabel =
    pkg.nights != null ? `${pkg.nights} nights` : pkg.duration;
  return `${nightsLabel} (${baseGameKindFromPackage(pkg)})`;
}

export function buildGameOffersFromPackages(
  packages: BookingPackage[],
): GameOffer[] {
  return packages
    .filter((p) => p.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((pkg) => {
      const badgeType = getPackageBadgeTypeLabel(pkg);
      const matches = mapGamesToMatches(pkg.games);

      return [
        {
          id: `${pkg.id}-hostel`,
          type: badgeType,
          matches,
          price: formatUsdPrice(pkg.hostelPrice),
          accommodation: "3-star Hotel",
          packageName: pkg.name,
          duration: pkg.duration,
          cityCount: pkg.cityCount ?? 0,
          includedItems: pkg.includedItems ?? [],
        },
        {
          id: `${pkg.id}-hotel`,
          type: badgeType,
          matches,
          price: formatUsdPrice(pkg.hotelPrice),
          accommodation: "4-star Hotel",
          packageName: pkg.name,
          duration: pkg.duration,
          cityCount: pkg.cityCount ?? 0,
          includedItems: pkg.includedItems ?? [],
        },
      ] satisfies GameOffer[];
    });
}
