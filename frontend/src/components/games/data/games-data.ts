import type { StaticImageData } from "next/image";
import { ghanaFlag, croatiaFlag, englandFlag } from "@/assets/img";
import { getBasePackagePrice } from "@/lib/booking-pricing";

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
  type: "Single game" | "Double game";
  matches: Match[];
  price: string;
  accommodation: string;
}

/** Build price string from shared pricing (Single: 1000/1800, Double: 1500/3000). */
function formatPrice(packageName: string, accommodation: "hostel" | "hotel"): string {
  const n = getBasePackagePrice(packageName, accommodation);
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const gameOffers: GameOffer[] = [
  {
    id: 1,
    type: "Single game",
    matches: [
      {
        stadium: "Philadelphia Stadium, USA",
        team1: { name: "Ghana", flag: ghanaFlag },
        team2: { name: "Croatia", flag: croatiaFlag },
        date: "June 27th 2026",
      },
    ],
    get price() {
      return formatPrice("One Game", "hostel");
    },
    accommodation: "Hostel (4 nights)",
  },
  {
    id: 2,
    type: "Single game",
    matches: [
      {
        stadium: "Philadelphia Stadium, USA",
        team1: { name: "Ghana", flag: ghanaFlag },
        team2: { name: "Croatia", flag: croatiaFlag },
        date: "June 27th 2026",
      },
    ],
    get price() {
      return formatPrice("One Game", "hotel");
    },
    accommodation: "Hotel (4 nights)",
  },
  {
    id: 3,
    type: "Double game",
    matches: [
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
    ],
    get price() {
      return formatPrice("Double Game", "hostel");
    },
    accommodation: "Hostel (7 nights)",
  },
  {
    id: 4,
    type: "Double game",
    matches: [
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
    ],
    get price() {
      return formatPrice("Double Game", "hotel");
    },
    accommodation: "Hotel (7 nights)",
  },
];
