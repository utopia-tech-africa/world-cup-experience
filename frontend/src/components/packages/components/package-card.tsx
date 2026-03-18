"use client";

import Image from "next/image";
import { PlaneTakeoff } from "lucide-react";
import { cn } from "@/lib/utils";
import { singleGameCardBg, doubleGameCardBg } from "@/assets/img";
import { MaskRevealButton } from "../../mask-reveal-button";
import type { GameOffer } from "@/components/games/data/games-data";

interface PackageCardProps {
  offer: GameOffer;
  className?: string;
  onBook?: () => void;
}

export const PackageCard = ({ offer, className, onBook }: PackageCardProps) => {
  const isDouble = offer.matches.length > 1;
  const [whole, decimal] = offer.price.split(".");

  return (
    <div
      className={cn(
        "relative group/card overflow-hidden  flex flex-col p-5 text-white bg-neutral-900 border border-white/5",
        className,
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={isDouble ? doubleGameCardBg : singleGameCardBg}
          alt="Stadium Background"
          fill
          className="object-cover transition-transform duration-700 group-hover/card:scale-105 opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Tag */}
        <div className="mb-6">
          <span
            className={cn(
              "inline-block px-4 py-1.5 rounded  font-clash tracking-wider shadow-lg bg-primary-100",
            )}
          >
            {offer.type}
          </span>
        </div>

        {/* Matches Section */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          {offer.matches.map((match, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              <p className=" font-helvetica mb-3 tracking-wide text-white/80">
                {match.stadium}
              </p>

              <div className="flex items-center justify-between w-full px-4 md:px-6 ">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2 ">
                  <div className="relative w-16 h-10 md:w-20 md:h-12 overflow-hidden rounded-sm shadow-xl border border-white/10">
                    <Image
                      src={match.team1.flag}
                      alt={match.team1.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-lg md:text-xl font-bold font-clash tracking-wide">
                    {match.team1.name}
                  </span>
                </div>

                {/* VS Spacer */}
                <div className="px-3 pb-6 flex items-center justify-center">
                  <span className="md:text-lg font-clash font-bold font-general tracking-wider">
                    VS
                  </span>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2 ">
                  <div className="relative w-16 h-10 md:w-20 md:h-12 overflow-hidden rounded-sm shadow-xl border border-white/10">
                    <Image
                      src={match.team2.flag}
                      alt={match.team2.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-lg md:text-xl font-bold font-clash tracking-wide">
                    {match.team2.name}
                  </span>
                </div>
              </div>

              <p className=" font-helvetica mb-3 tracking-wide text-white/80">
                {match.date}
              </p>

              {isDouble && idx === 0 && (
                <div className="w-4/5 h-px bg-white/10 mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Footer: Price and CTA */}
        <div className="mt-8 flex items-end justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <h4 className="flex items-baseline font-helvetica font-bold text-white">
              <span className="text-2xl md:text-3xl">{whole}</span>
              <span className="text-sm md:text-base opacity-90">
                .{decimal}
              </span>
            </h4>
            <span className="text-md md:text-lg font-helvetica opacity-60 mt-1 text-white/95">
              {offer.accommodation}
            </span>
          </div>

          <MaskRevealButton
            onClick={onBook}
            hoverBgClass="bg-primary-300"
            textClassName="text-primary-300"
            className="flex items-center gap-2 px-4 py-2 rounded bg-white text-primary-300 hover:text-white transition-all font-semibold font-clash group/btn shadow-2xl cursor-pointer"
          >
            Book Seat
            <PlaneTakeoff
              size={18}
              className="relative z-10 translate-y-px group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </MaskRevealButton>
        </div>
      </div>
    </div>
  );
};
