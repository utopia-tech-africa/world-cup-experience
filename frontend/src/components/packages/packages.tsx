"use client";

import ComponentLayout from "../component-layout";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PackageCard, TotalPackageBanner } from "./components";
import { offers } from "./data/packages-data";

export const Packages = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Decorative Grid Lines and Nodes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Continuous Grid Lines (framing the content) */}
        <div className="absolute top-10 md:top-14 left-0 w-full h-px bg-neutral-300/50" />
        <div className="absolute bottom-10 md:bottom-14 left-0 w-full h-px bg-neutral-300/50" />
        <div className="absolute top-0 left-3 lg:left-15 w-px h-full bg-neutral-300/50" />
        <div className="absolute top-0 right-3 lg:right-15 w-px h-full bg-neutral-300/50" />

        {/* Intersection marker pluses */}
        <div className="absolute top-10 md:top-14 left-3 lg:left-15 -translate-x-1/2 -translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute top-10 md:top-14 right-3 lg:right-15 translate-x-1/2 -translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute bottom-10 md:bottom-14 left-3 lg:left-15 -translate-x-1/2 translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
        <div className="absolute bottom-10 md:bottom-14 right-3 lg:right-15 translate-x-1/2 translate-y-1/2 opacity-80">
          <Plus className="size-10 text-primary-100" />
        </div>
      </div>

      <ComponentLayout className="relative z-10">
        {/* Header */}
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-clash text-neutral-800 leading-[1.05] mb-2 tracking-tight">
            Choose Your Perfect World Cup Experience
          </h2>
          <p className="text-base md:text-xl text-neutral-400/90 max-w-5xl font-helvetica ">
            Whether you&apos;re attending one iconic match or doubling the
            excitement with two unforgettable games, our hosting packages
            combine football, travel, and premium fan experiences into one
            seamless trip.
          </p>
        </div>

        <div className="flex flex-col gap-10 md:gap-20">
          {/* Total Package Banner Section */}
          <TotalPackageBanner />

          <div className="w-full h-px bg-neutral-300/50" />
          {/* Grid of Standard Packages */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">
            {offers.map((offer, idx) => (
              <PackageCard
                key={offer.id}
                offer={offer}
                className={cn(
                  idx === 0 || idx === 3 ? "md:col-span-3" : "md:col-span-2",
                  idx === 2 && "md:rounded-bl-[80px] pl-10",
                )}
              />
            ))}
          </div>
        </div>
      </ComponentLayout>
    </section>
  );
};
