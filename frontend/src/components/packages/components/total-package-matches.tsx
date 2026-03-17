"use client";

import Image from "next/image";
import { gameCardBg } from "@/assets/img";
import { cn } from "@/lib/utils";
import type { Match } from "@/components/games/data/games-data";

export const TotalPackageMatches = ({ matches }: { matches: Match[] }) => {
  return (
    <div className="w-full  relative flex flex-col p-5 overflow-hidden items-center justify-center text-white">
      {/* Stadium background */}
      <Image
        src={gameCardBg}
        alt="Stadium"
        fill
        className="object-cover opacity-80 z-0 scale-110"
      />{" "}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/50" />
      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col gap-6 w-full max-w-3xl">
        {/* Badge */}
        <div className="mb-2">
          <span
            className={cn(
              "inline-block px-4 py-1.5 rounded  font-clash tracking-wider shadow-lg bg-primary-100",
            )}
          >
            {" "}
            13 nights (Tripple game)
          </span>
        </div>

        {/* Match Details List */}
        <div className="flex flex-col gap-4 ">
        {matches.map((match, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              {/* Stadium Name on Top */}
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
              <p className=" font-helvetica  tracking-wide text-white/80">
                {match.date}
              </p>

              {idx < matches.length - 1 && (
                <div className="w-full h-px bg-white/10 mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
