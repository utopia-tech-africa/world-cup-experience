"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { PlaneTakeoff } from "lucide-react";
import { gameCardBg } from "@/assets/img";
import { useBookingStore } from "@/stores/booking-store";
import { GameOffer } from "../data/games-data";

export function GameCard({ offer }: { offer: GameOffer }) {
  const router = useRouter();
  const setTripSummary = useBookingStore((s) => s.setTripSummary);
  const setBookingForm = useBookingStore((s) => s.setBookingForm);
  const accommodation =
    offer.accommodation.toLowerCase().includes("hostel") ? "hostel" : "hotel";
  const isDouble = offer.matches.length > 1;
  const packageName = offer.packageName ?? (isDouble ? "Double Game" : "One Game");
  const duration =
    offer.duration ?? (isDouble ? "7 nights (June 22-29)" : "4 nights (June 25-29)");

  const handleBookSeat = () => {
    setTripSummary({ packageName, duration });
    setBookingForm({ accommodation });
    router.push("/booking");
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleBookSeat}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleBookSeat();
        }
      }}
      aria-label={`${offer.type}, ${offer.accommodation} – Book seat`}
      className="relative group overflow-hidden rounded-lg aspect-4/5 md:aspect-auto md:h-[480px] flex flex-col p-3 text-white bg-neutral-400 cursor-pointer">
      {/* Background Image */}
      <Image
        src={gameCardBg}
        alt="Game background"
        fill
        className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
      />

      {/* Gradient Overlay for high-end look */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/30 z-10" />

      {/* Card Content Wrapper */}
      <div className="relative z-20 flex flex-col h-full justify-between">
        {/* Top: Type Tag */}
        <div className="flex justify-start">
          <span className="bg-white text-neutral-400 px-2 py-1.5 rounded-full text-sm font-semibold font-sans tracking-wide">
            {offer.type}
          </span>
        </div>

        {/* Middle: Matches Info - Now scrollable if many matches */}
        <div
          className={`flex flex-col ${isDouble ? "gap-0" : "gap-4"} items-center justify-center flex-1 overflow-y-auto py-2`}
        >
          {offer.matches.map((match, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              <span className="text-[12px] font-medium font-sans opacity-95 mb-3 text-center">
                {match.stadium}
              </span>

              <div className="flex items-end justify-between w-full">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`relative ${isDouble ? "w-20 h-10" : "w-24 h-16"} overflow-hidden rounded-sm transition-all`}
                  >
                    {typeof match.team1.flag === "string" ? (
                      <img
                        src={match.team1.flag}
                        alt={match.team1.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={match.team1.flag as StaticImageData}
                        alt={match.team1.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span
                    className={`font-bold font-sans tracking-tight transition-all ${isDouble ? "text-lg" : "text-[24px]"}`}
                  >
                    {match.team1.name}
                  </span>
                </div>

                {/* VS */}
                <div className="px-3 pb-2">
                  <span
                    className={`font-bold font-sans opacity-100 transition-all ${isDouble ? "text-lg" : "text-[24px]"}`}
                  >
                    VS
                  </span>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`relative ${isDouble ? "w-20 h-10" : "w-24 h-16"} overflow-hidden rounded-sm transition-all`}
                  >
                    {typeof match.team2.flag === "string" ? (
                      <img
                        src={match.team2.flag}
                        alt={match.team2.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={match.team2.flag as StaticImageData}
                        alt={match.team2.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span
                    className={`font-bold font-sans tracking-tight transition-all ${isDouble ? "text-lg" : "text-[24px]"}`}
                  >
                    {match.team2.name}
                  </span>
                </div>
              </div>

              <span className="text-[12px] font-medium font-sans opacity-90 mt-3">
                {match.date}
              </span>

              {/* Separator for double games */}
              {isDouble && idx === 0 && (
                <div className="w-full h-px bg-white/10 mt-4 mb-2" />
              )}
            </div>
          ))}
        </div>

        {/* Footer: Price and Book Button */}
        <div className="flex items-end justify-between pt-4">
          <div className="flex flex-col">
            <h4 className="text-[24px] font-bold font-sans leading-none tracking-tight">
              {offer.price.split(".")[0]}
              <span className="text-[14px] font-medium opacity-90 leading-none">
                .{offer.price.split(".")[1]}
              </span>
            </h4>
            <span className="text-[14px] font-normal opacity-70 mt-1 font-sans">
              {offer.accommodation}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleBookSeat();
            }}
            className="flex items-center gap-2 px-2 py-1 rounded-full border border-white/80 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all font-sans font-semibold text-[16px] group/btn shadow-xl">
            Book Seat
            <PlaneTakeoff
              size={18}
              className="translate-y-px group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
