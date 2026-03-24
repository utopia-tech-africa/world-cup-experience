import {
  ghanaFlag,
  croatiaFlag,
  englandFlag,
  PanamaFlag,
  IvoryCoastFlag,
  EcuadorFlag,
  GermanyFlag,
  CuracaoFlag,
} from "@/assets/img";

export interface Match {
  stadium: string;
  team1: { name: string; flag: any };
  team2: { name: string; flag: any };
  date: string;
}

export interface PackageOffer {
  id: string;
  type: string;
  matches: Match[];
  price: string;
  accommodation: string;
}

export const SINGLE_MATCH: Match = {
  stadium: "Philadelphia Stadium, USA",
  team1: { name: "Ghana", flag: ghanaFlag },
  team2: { name: "Croatia", flag: croatiaFlag },
  date: "June 27th 2026",
};

export const DOUBLE_MATCHES: Match[] = [
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

export const TRIPLE_MATCHES: Match[] = [
  {
    stadium: "BMO Field, Toronto",
    team1: { name: "Ghana", flag: ghanaFlag },
    team2: { name: "Panama", flag: PanamaFlag },
    date: "June 17th 2026",
  },
  ...DOUBLE_MATCHES,
];

export const offers: PackageOffer[] = [
  {
    id: "1",
    type: "4 nights (Single game)",
    matches: [SINGLE_MATCH],
    price: "$1,000.00",
    accommodation: "Hostel (4 nights)",
  },
  {
    id: "2",
    type: "4 nights (Single game)",
    matches: [SINGLE_MATCH],
    price: "$1,800.00",
    accommodation: "Hotel (4 nights)",
  },
  {
    id: "3",
    type: "7 nights (Double game)",
    matches: DOUBLE_MATCHES,
    price: "$1,500.00",
    accommodation: "Hostel",
  },
  {
    id: "4",
    type: "7 nights (Double game)",
    matches: DOUBLE_MATCHES,
    price: "$3,000.00",
    accommodation: "Hotel",
  },
];
