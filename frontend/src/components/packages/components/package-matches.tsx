"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Match } from "@/components/games/data/games-data";

interface TotalPackageMatchesProps {
  matches: Match[];
  packageType: string;
  gameCardBg: any;
  roomBg: any;
  className?: string;
  badgeClassName?: string;
}

export const TotalPackageMatches = ({
  matches,
  packageType,
  gameCardBg,
  roomBg,
  className,
  badgeClassName,
}: TotalPackageMatchesProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full relative flex flex-col p-5 overflow-hidden items-center justify-center text-white cursor-pointer",
        className,
      )}
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0 scale-110 overflow-hidden">
        <Image
          src={gameCardBg}
          alt="Stadium"
          fill
          className={cn(
            "object-cover opacity-80 transition-opacity duration-700 ease-in-out",
            isHovered ? "opacity-0" : "opacity-80",
          )}
        />
        <Image
          src={roomBg}
          alt="Room"
          fill
          className={cn(
            "object-cover transition-opacity duration-700 ease-in-out",
            isHovered ? "opacity-80" : "opacity-0",
          )}
        />
      </div>{" "}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/70" />
      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col gap-6 w-full max-w-3xl">
        {/* Badge */}
        <div className="mb-2">
          <span
            className={cn(
              "inline-block px-4 py-1.5 rounded font-clash tracking-wider shadow-lg bg-primary-100",
              badgeClassName,
            )}
          >
            {packageType}
          </span>
        </div>

        {/* Match Details List */}
        <div className="flex flex-col gap-4">
          {matches.map((match, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              {/* Stadium Name on Top */}
              <p className="font-helvetica mb-3 tracking-wide text-white/80 text-center">
                {match.stadium}
              </p>

              <div className="flex items-center justify-between w-full px-4 md:px-6">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-14 md:w-40 md:h-24 overflow-hidden rounded-sm shadow-xl border border-white/10">
                    <Image
                      src={match.team1.flag ?? ""}
                      alt={match.team1.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xl md:text-3xl font-bold font-clash tracking-wide">
                    {match.team1.name}
                  </span>
                </div>

                {/* VS Spacer */}
                <div className="px-3 pb-6 flex items-center justify-center">
                  <span className="text-2xl md:text-5xl font-clash font-bold font-general tracking-wider">
                    VS
                  </span>
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-14 md:w-40 md:h-24 overflow-hidden rounded-sm shadow-xl border border-white/10">
                    <Image
                      src={match.team2.flag ?? ""}
                      alt={match.team2.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xl md:text-3xl font-bold font-clash tracking-wide">
                    {match.team2.name}
                  </span>
                </div>
              </div>
              <p className="font-helvetica tracking-wide text-white/80 text-center">
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
