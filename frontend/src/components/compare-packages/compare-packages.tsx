"use client";
import Image from "next/image";
import { ChevronDown, Bed } from "lucide-react";
import ComponentLayout from "@/components/component-layout";
import { cn } from "@/lib/utils";
import { COMPARISON_PACKAGES, FEATURE_CATEGORIES } from "./data";
import { useState, useRef, useEffect } from "react";

export const ComparePackages = () => {
  const [leftSelectedId, setLeftSelectedId] = useState(
    COMPARISON_PACKAGES[0].id,
  );
  const [rightSelectedId, setRightSelectedId] = useState(
    COMPARISON_PACKAGES[1].id,
  );

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leftRef.current && !leftRef.current.contains(event.target as Node)) {
        setIsLeftOpen(false);
      }
      if (
        rightRef.current &&
        !rightRef.current.contains(event.target as Node)
      ) {
        setIsRightOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const leftPkg =
    COMPARISON_PACKAGES.find((p) => p.id === leftSelectedId) ||
    COMPARISON_PACKAGES[0];
  const rightPkg =
    COMPARISON_PACKAGES.find((p) => p.id === rightSelectedId) ||
    COMPARISON_PACKAGES[1];

  return (
    <ComponentLayout className="pb-8">
      <div className="mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-6 text-center">
          <h2 className="text-[30px] md:text-[30px] lg:text-[40px] font-medium text-[#2A2A2A] font-clash">
            Compare Packages
          </h2>
          <p className="text-sm md:text-lg lg:text-[20px] font-normal text-[#2A2A2A] font-helvetica leading-relaxed">
            Whether you're attending one iconic match or doubling the excitement
            with two unforgettable games, our hosting packages combine football,
            travel, and premium fan experiences into one seamless trip.
          </p>
        </div>

        {/* Selection Selectors */}
        <div className="flex flex-row items-center gap-2 md:gap-8 mb-16 w-full">
          <div className="flex-1 w-full relative" ref={leftRef}>
            <button
              onClick={() => setIsLeftOpen(!isLeftOpen)}
              className="w-full flex items-center justify-center px-2 md:px-4 py-3 border border-neutral-200 rounded-md text-[#A42100] font-clash font-semibold text-xs md:text-xl shadow-sm tracking-wider hover:border-[#A42100]/30 transition-colors bg-white z-10"
            >
              {leftPkg.shortName}
              <ChevronDown
                className={cn(
                  "size-4 md:size-6 ml-1 md:ml-2 transition-transform",
                  isLeftOpen && "rotate-180",
                )}
              />
            </button>
            {isLeftOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-neutral-200 rounded-md shadow-xl z-50 overflow-hidden">
                {COMPARISON_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      setLeftSelectedId(pkg.id);
                      setIsLeftOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors",
                      leftSelectedId === pkg.id
                        ? "text-[#A42100] bg-neutral-50/50"
                        : "text-neutral-600",
                    )}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xl md:text-3xl font-clash text-neutral-800">
            VS
          </span>

          <div className="flex-1 w-full relative" ref={rightRef}>
            <button
              onClick={() => setIsRightOpen(!isRightOpen)}
              className="w-full flex items-center justify-center px-2 md:px-4 py-3 border border-neutral-200 rounded-md text-[#A42100] font-clash font-semibold text-xs md:text-xl shadow-sm tracking-wider hover:border-[#A42100]/30 transition-colors bg-white z-10"
            >
              {rightPkg.shortName}
              <ChevronDown
                className={cn(
                  "size-4 md:size-6 ml-1 md:ml-2 transition-transform",
                  isRightOpen && "rotate-180",
                )}
              />
            </button>
            {isRightOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-neutral-200 rounded-md shadow-xl z-50 overflow-hidden">
                {COMPARISON_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      setRightSelectedId(pkg.id);
                      setIsRightOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-neutral-50 font-clash text-xs md:text-base transition-colors",
                      rightSelectedId === pkg.id
                        ? "text-[#A42100] bg-neutral-50/50"
                        : "text-neutral-600",
                    )}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Grid (Images) */}
        <div className="grid grid-cols-2 gap-4 md:gap-20 w-full">
          {/* Left Card Visual */}
          <div className="flex flex-col items-center text-center">
            <div className="relative aspect-5/3 w-full mb-8 overflow-hidden rounded-bl-[20px] md:rounded-bl-[40px] shadow-lg bg-neutral-100">
              <Image
                src={leftPkg.image}
                alt={leftPkg.name}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Right Card Visual */}
          <div className="flex flex-col items-center text-center">
            <div className="relative aspect-5/3 w-full mb-8 overflow-hidden shadow-lg bg-neutral-100">
              <Image
                src={rightPkg.image}
                alt={rightPkg.name}
                fill
                className="object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        </div>

        {/* Comparison Row: Pricing */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden bg-transparent">
          <div className="mx-auto px-4 md:px-8 py-6">
            <div className="grid grid-cols-2 gap-4 md:gap-32 w-full">
              {/* Left Pricing */}
              <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl md:text-5xl font-black text-primary-300">
                    {leftPkg.price}
                  </span>
                  <sup className="text-sm md:text-3xl font-black text-primary-300 mt-2">
                    {leftPkg.cents}
                  </sup>
                </div>
                <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                  Package Cost
                </h4>
                <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                  {leftPkg.occupancy}
                </p>
              </div>

              {/* Right Pricing */}
              <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl md:text-5xl font-black text-primary-300">
                    {rightPkg.price}
                  </span>
                  <sup className="text-sm md:text-3xl font-black text-primary-300 mt-2">
                    {rightPkg.cents}
                  </sup>
                </div>
                <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                  Package Cost
                </h4>
                <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                  {rightPkg.occupancy}
                </p>
              </div>
            </div>
          </div>
          <hr className="border-neutral-200 mt-4 pb-4 max-w-5xl mx-auto" />
        </div>

        {/* Features Comparison Rows */}
        <div className="w-full space-y-0">
          {FEATURE_CATEGORIES.map((category, idx) => {
            const leftFeat = (leftPkg.features as any)[category.id];
            const rightFeat = (rightPkg.features as any)[category.id];

            return (
              <div
                key={category.id}
                className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden"
              >
                <div
                  className={cn(
                    "mx-auto px-4 md:px-8 py-6",
                    category.hasBg ? "bg-neutral-50/50" : "bg-transparent",
                  )}
                >
                  <div className="grid grid-cols-2 gap-4 md:gap-32 w-full">
                    {/* Left Feature */}
                    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                      {leftFeat.icon && (
                        <leftFeat.icon
                          className={cn(
                            "size-6 md:size-8 mb-2",
                            leftFeat.iconColor,
                          )}
                          strokeWidth={2.5}
                        />
                      )}
                      <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                        {leftFeat.title}
                      </h4>
                      <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                        {leftFeat.description}
                      </p>
                    </div>

                    {/* Right Feature */}
                    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                      {rightFeat.icon && (
                        <rightFeat.icon
                          className={cn(
                            "size-6 md:size-8 mb-2",
                            rightFeat.iconColor,
                          )}
                          strokeWidth={2.5}
                        />
                      )}
                      <h4 className="text-sm md:text-2xl font-bold text-neutral-800 mb-2">
                        {rightFeat.title}
                      </h4>
                      <p className="text-neutral-400 text-xs md:text-base leading-relaxed">
                        {rightFeat.description}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="border-neutral-200 mt-4 pb-4 max-w-5xl mx-auto" />
              </div>
            );
          })}
        </div>

        {/* Booking Buttons Footer */}
        <div className="w-full max-w-6xl grid grid-cols-2 gap-4 md:gap-24 px-4 mt-8">
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-1 md:gap-3 px-2 md:px-8 py-3 border border-neutral-200 rounded-md text-primary-300 font-bold text-sm md:text-lg hover:bg-neutral-50 transition-colors w-full">
              Book Stay <Bed className="size-4 md:size-7" />
            </button>
          </div>
          <div className="flex justify-center">
            <button className="flex items-center justify-center gap-1 md:gap-3 px-2 md:px-8 py-3 border border-neutral-200 rounded-md text-primary-300 font-bold text-sm md:text-lg hover:bg-neutral-50 transition-colors w-full">
              Book Stay <Bed className="size-4 md:size-7" />
            </button>
          </div>
        </div>
      </div>
    </ComponentLayout>
  );
};
