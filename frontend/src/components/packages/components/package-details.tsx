"use client";

import { PackageBgPattern1 } from "@/assets/svg";
import { MaskRevealButton } from "../../mask-reveal-button";
import { IoIosCheckbox } from "react-icons/io";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingOption {
  hotelType: string;
  price: string;
}

interface PackageDetailsProps {
  title: string;
  subtitle: string;
  matchesLabel: string;
  daysLabel: string;
  citiesLabel: string;
  includes: string[];
  bgPattern?: React.ComponentType<{ className?: string }>;
  bgColorClass?: string;
  onBook?: () => void;
  pricing?: {
    dateRange: string;
    options: PricingOption[];
  };
}

export const PackageDetails = ({
  title,
  subtitle,
  matchesLabel,
  daysLabel,
  citiesLabel,
  includes,
  bgPattern: BgPattern = PackageBgPattern1,
  bgColorClass = "bg-primary-200",
  onBook,
  pricing,
}: PackageDetailsProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden lg:w-[70%] p-4 sm:p-8 flex flex-col justify-between text-white rounded-bl-[40px] sm:rounded-bl-[60px]",
        bgColorClass,
      )}
    >
      {/* Background pattern inside the block */}
      <BgPattern className="absolute size-[1000px]  -top-50 -left-50 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <h3 className="text-6xl md:text-6xl font-semibold font-clash  tracking-wider">
          {title}
          <br />
          {subtitle}
        </h3>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2  text-base sm:text-lg font-clash tracking-wider text-nowrap">
            <div className="size-1.5 bg-white" /> {matchesLabel}
          </div>
          <div className="flex items-center gap-2  text-base sm:text-lg font-clash tracking-wider text-nowrap">
            <div className="size-1.5 bg-white" /> {daysLabel}
          </div>
          <div className="flex items-center gap-2 text-base sm:text-lg font-clash tracking-wider text-nowrap">
            <div className="size-1.5 bg-white" /> {citiesLabel}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-base sm:text-lg font-clash tracking-wider">
            Package includes:
          </p>
          <ul className="space-y-1">
            {includes.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-sm md:text-base font-helvetica font-light tracking-wide"
              >
                <IoIosCheckbox className="text-green-500 size-6 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {pricing && (
        <div className="relative z-10 flex flex-col items-center gap-2 mt-8 ">
          <div className="flex justify-center gap-8">
            {pricing.options.map((opt, i) => {
              const [whole, decimal] = opt.price.split(".");
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-lg md:text-2xl tracking-wide opacity-90 font-light">
                    {opt.hotelType}
                  </span>
                  <div className="flex items-start font-bold tracking-wider">
                    <span className="text-2xl md:text-4xl">{whole}</span>
                    {decimal && (
                      <sup className="text-lg md:text-2xl mt-1">.{decimal}</sup>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <span className="text-sm md:text-base font-helvetica tracking-wider">
            {pricing.dateRange}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-5 mt-14 relative z-10 w-full">
        <MaskRevealButton
          onClick={onBook}
          className="flex-1 rounded-bl-3xl font-bold px-3 sm:px-6 py-8 text-xl md:text-2xl"
          hoverBgClass={bgColorClass}
          textClassName={cn("text-white", bgColorClass.replace("bg-", "text-"))}
        >
          Book now
        </MaskRevealButton>

        <Link href="tel:+233593679741" className="flex-1">
          <MaskRevealButton
            className="w-full px-3 sm:px-6 py-8 text-xl md:text-2xl font-normal"
            hoverBgClass={bgColorClass}
            textClassName={cn(
              "text-white",
              bgColorClass.replace("bg-", "text-"),
            )}
          >
            Corporate packages
          </MaskRevealButton>
        </Link>
      </div>
    </div>
  );
};
