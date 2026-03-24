"use client";

import { TotalPackageMatches } from "./total-package-matches";
import { Button } from "@/components/ui/button";
import { TotalPackageBg } from "@/assets/svg";
import type { Match } from "@/components/games/data/games-data";

type TotalPackageBannerProps = {
  matches: Match[];
  cityCount?: number;
  nights?: number;
  includedItems?: string[];
  onBook?: () => void;
};

export const TotalPackageBanner = ({
  matches,
  cityCount = 0,
  nights = 13,
  includedItems = [],
  onBook,
}: TotalPackageBannerProps) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-5">
      {/* Total Package Left info */}
      <div className="relative overflow-hidden lg:w-[50%] p-4 sm:p-8 flex flex-col justify-between text-white bg-primary-200 rounded-bl-[60px]">
        {/* Background pattern inside the red block */}
        <TotalPackageBg className="absolute size-[1000px]  -top-50 -left-50 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <h3 className="text-6xl md:text-6xl font-semibold font-clash  tracking-wider">
            Total
            <br />
            Package
          </h3>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2  text-base sm:text-lg font-clash tracking-wider text-nowrap">
              <div className="size-1.5 bg-white" /> {matches.length} matches
            </div>
            <div className="flex items-center gap-2  text-base sm:text-lg font-clash tracking-wider text-nowrap">
              <div className="size-1.5 bg-white" /> {nights} nights
            </div>
            <div className="flex items-center gap-2 text-base sm:text-lg font-clash tracking-wider text-nowrap">
              <div className="size-1.5 bg-white" /> {cityCount} cities
            </div>
          </div>

          {includedItems.length > 0 ? (
            <div className="space-y-2">
              <p className="font-clash text-xl">Package includes:</p>
              <ul className="space-y-1">
                {includedItems.map((item) => (
                  <li key={item} className="font-helvetica text-base leading-relaxed">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className=" tracking-wider font-light leading-relaxed text-base md:text-lg font-helvetica ">
              Take your World Cup adventure further with unforgettable fan
              experiences across multiple cities.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-5 mt-14  relative z-10 mx-auto md:mx-0">
          <Button
            type="button"
            onClick={onBook}
            className="rounded-none rounded-bl-3xl bg-white text-primary-200 px-3 sm:px-6 py-5  font-bold text-lg font-helvetica transition-all hover:bg-transparent hover:text-white hover:border-white cursor-pointer "
          >
            Book now
          </Button>
          <Button className="rounded-none bg-white text-primary-200 px-3 sm:px-6 py-5 text-lg font-helvetica transition-all hover:bg-transparent hover:text-white hover:border-white cursor-pointer ">
            Corporate packages
          </Button>
        </div>
      </div>

      {/* Matches Right List */}
      <TotalPackageMatches matches={matches} />
    </div>
  );
};
