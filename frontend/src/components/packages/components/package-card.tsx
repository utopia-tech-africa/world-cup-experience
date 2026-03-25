import { PackageDetails } from "./package-details";
import { TotalPackageMatches } from "./package-matches";
import type { Match } from "@/components/games/data/games-data";
import type { ComponentType } from "react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

type PackageCardProps = {
  matches: Match[];
  onBook?: () => void;
  title: string;
  subtitle?: string;
  matchesLabel: string;
  daysLabel: string;
  citiesLabel: string;
  includes: string[];
  bgPattern?: ComponentType<{ className?: string }>;
  bgColorClass?: string;
  badgePackageType: string;
  gameCardBg: StaticImport | string;
  roomBg: StaticImport | string;
  pricing?: {
    dateRange: string;
    options: { hotelType: string; price: string }[];
  };
};

export const PackageCard = ({
  matches,
  onBook,
  title,
  subtitle,
  matchesLabel,
  daysLabel,
  citiesLabel,
  includes,
  bgPattern,
  bgColorClass,
  badgePackageType,
  gameCardBg,
  roomBg,
  pricing,
}: PackageCardProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <PackageDetails
        title={title}
        subtitle={subtitle}
        matchesLabel={matchesLabel}
        daysLabel={daysLabel}
        citiesLabel={citiesLabel}
        includes={includes}
        bgPattern={bgPattern}
        bgColorClass={bgColorClass}
        onBook={onBook}
        pricing={pricing}
      />
      {/* Matches Right List */}
      <TotalPackageMatches
        matches={matches}
        packageType={badgePackageType}
        gameCardBg={gameCardBg}
        roomBg={roomBg}
      />
    </div>
  );
};
