import {
  BedDouble,
  Bed,
  Clock,
  UserRound,
  HelpCircle,
  Compass,
  MapPin,
  Gift,
  Ticket,
} from "lucide-react";
import React from "react";
import { HotelRoomBg, HostelRoomBg } from "@/assets/img";

export const COMPARISON_PACKAGES = [
  {
    id: "4-star",
    name: "Double Game (4 Star)",
    shortName: "Double Game (4 Star)",
    image: HotelRoomBg,
    price: "$3,000",
    cents: ".00",
    occupancy: "*Double Occupancy (Single available on request at extra cost)",
    features: {
      accommodation: {
        title: "Upscale Luxury",
        description:
          "Luxury 4-Star accommodation with enhanced comfort and premium modern amenities.",
        icon: BedDouble,
        iconColor: "text-[#006CE4]",
      },
      proximity: {
        title: "15 Min to Venue",
        description:
          "Unbeatable proximity to match venues, saving you valuable time on game day.",
        icon: Clock,
        iconColor: "text-[#006CE4]",
      },
      support: {
        title: "24hr Room Service",
        description:
          "Dedicated lifestyle manager for restaurant bookings, city tours, and personal errands.",
        icon: UserRound,
        iconColor: "text-[#006CE4]",
      },
      location: {
        title: "Prime City Access",
        description:
          "Direct access to major shopping, high-end dining, and Qatar's historic sites.",
        icon: Compass,
        iconColor: "text-[#006CE4]",
      },
      gifts: {
        title: "Official Merchandise Kit",
        description:
          "Premium collection including official jersey, leather scarf, and match-ball replica.",
        icon: Gift,
        iconColor: "text-[#006CE4]",
      },
    },
  },
  {
    id: "3-star",
    name: "Double Game (3 Star)",
    shortName: "Double Game (3 Star)",
    image: HostelRoomBg,
    price: "$1,500",
    cents: ".00",
    occupancy: "*Double Occupancy (Single available on request at extra cost)",
    features: {
      accommodation: {
        title: "Standard Comfort",
        description:
          "Daily premium buffet breakfast to start your match day with localized delicacies.",
        icon: Bed,
        iconColor: "text-neutral-300",
      },
      proximity: {
        title: "35 Min to Venue",
        description:
          "Reliable transport with a standard commute time to the tournament stadium.",
        icon: Clock,
        iconColor: "text-neutral-400",
      },
      support: {
        title: "24hr Room Service",
        description:
          "Centralized digital support desk for logistics and tournament-related queries.",
        icon: HelpCircle,
        iconColor: "text-neutral-400",
      },
      location: {
        title: "Strategic Location",
        description:
          "Conveniently located with easy public transit links to the city center.",
        icon: MapPin,
        iconColor: "text-neutral-400",
      },
      gifts: {
        title: "Commemorative Pin",
        description:
          "Limited edition tournament lapel pin and official welcome lanyard.",
        icon: Ticket,
        iconColor: "text-neutral-400",
      },
    },
  },
];

export const FEATURE_CATEGORIES = [
  { id: "cost", name: "Package Cost", hasBg: false, isPricing: true },
  { id: "accommodation", name: "Accommodation", hasBg: true },
  { id: "proximity", name: "Venue Proximity", hasBg: false },
  { id: "support", name: "Service & Support", hasBg: true },
  { id: "location", name: "Location Benefits", hasBg: false },
  { id: "gifts", name: "Exclusive Gifts", hasBg: true },
];
