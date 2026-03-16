import type { BookingPackage, PublicGame } from "@/types/booking";

export type Match = {
  stadium: string;
  team1: { name: string; flag: string };
  team2: { name: string; flag: string };
  date: string;
};

export type GameOffer = {
  id: string;
  type: string;
  matches: Match[];
  price: string;
  accommodation: string;
};

function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function mapGamesToMatches(games: PublicGame[] | undefined): Match[] {
  if (!games || games.length === 0) return [];
  return games.map((g) => ({
    stadium: g.stadium,
    team1: { name: g.team1.name, flag: g.team1.flagUrl ?? "" },
    team2: { name: g.team2.name, flag: g.team2.flagUrl ?? "" },
    date: g.matchDate,
  }));
}

export function buildGameOffersFromPackages(packages: BookingPackage[]): GameOffer[] {
  return packages
    .filter((p) => p.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((pkg) => {
      const typeName =
        typeof pkg.type === "string" ? pkg.type : pkg.type?.name ?? pkg.type?.code;

      const nightsLabel = pkg.nights ? `${pkg.nights} nights` : pkg.duration;

      const baseTypeLabel =
        typeName && typeName.toLowerCase().includes("double")
          ? "Double game"
          : typeName && typeName.toLowerCase().includes("triple")
            ? "Triple game"
            : "Single game";

      const matches = mapGamesToMatches(pkg.games);

      return [
        {
          id: `${pkg.id}-hostel`,
          type: `${nightsLabel} (${baseTypeLabel})`,
          matches,
          price: formatPrice(pkg.hostelPrice),
          accommodation: "Hostel",
        },
        {
          id: `${pkg.id}-hotel`,
          type: `${nightsLabel} (${baseTypeLabel})`,
          matches,
          price: formatPrice(pkg.hotelPrice),
          accommodation: "Hotel",
        },
      ] satisfies GameOffer[];
    });
}

