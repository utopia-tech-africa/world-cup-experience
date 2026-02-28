import { ghanaFlag, croatiaFlag, englandFlag } from "@/assets/img";

export interface TeamInfo {
  name: string;
  flag: any;
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
    price: "$1,000.00",
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
    price: "$1,800.00",
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
    price: "$1,500.00",
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
    price: "$3,000.00",
    accommodation: "Hotel (7 nights)",
  },
];
