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
      },
      proximity: {
        title: "15 Min to Venue",
        description:
          "Unbeatable proximity to match venues, saving you valuable time on game day.",
      },
      support: {
        title: "24hr Room Service",
        description:
          "Dedicated lifestyle manager for restaurant bookings, city tours, and personal errands.",
      },
      location: {
        title: "Prime City Access",
        description:
          "Direct access to major shopping, high-end dining, and Qatar's historic sites.",
      },
      gifts: {
        title: "Official Merchandise Kit",
        description:
          "Premium collection including official jersey, leather scarf, and match-ball replica.",
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
      },
      proximity: {
        title: "35 Min to Venue",
        description:
          "Reliable transport with a standard commute time to the tournament stadium.",
      },
      support: {
        title: "24hr Room Service",
        description:
          "Centralized digital support desk for logistics and tournament-related queries.",
      },
      location: {
        title: "Strategic Location",
        description:
          "Conveniently located with easy public transit links to the city center.",
      },
      gifts: {
        title: "Commemorative Pin",
        description:
          "Limited edition tournament lapel pin and official welcome lanyard.",
      },
    },
  },
];

export const FEATURE_CATEGORIES = [
  { id: "cost", name: "Package Cost", hasBg: false, isPricing: true },
  {
    id: "accommodation",
    name: "Accommodation",
    hasBg: true,
    styles: {
      "4-star": { icon: BedDouble, color: "text-[#006CE4]" },
      "3-star": { icon: Bed, color: "text-neutral-300" },
    },
  },
  {
    id: "proximity",
    name: "Venue Proximity",
    hasBg: false,
    styles: {
      "4-star": { icon: Clock, color: "text-[#006CE4]" },
      "3-star": { icon: Clock, color: "text-neutral-400" },
    },
  },
  {
    id: "support",
    name: "Service & Support",
    hasBg: true,
    styles: {
      "4-star": { icon: UserRound, color: "text-[#006CE4]" },
      "3-star": { icon: HelpCircle, color: "text-neutral-400" },
    },
  },
  {
    id: "location",
    name: "Location Benefits",
    hasBg: false,
    styles: {
      "4-star": { icon: Compass, color: "text-[#006CE4]" },
      "3-star": { icon: MapPin, color: "text-neutral-400" },
    },
  },
  {
    id: "gifts",
    name: "Exclusive Gifts",
    hasBg: true,
    styles: {
      "4-star": { icon: Gift, color: "text-[#006CE4]" },
      "3-star": { icon: Ticket, color: "text-neutral-400" },
    },
  },
];
