import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ghanaFlag, croatiaFlag, englandFlag, PanamaFlag } from "@/assets";
import { MaskRevealButton } from "../../mask-reveal-button";
import Link from "next/link";

export const HotPackagesWidget = () => {
  return (
    <motion.div
      // initial={{ opacity: 0, x: 20 }}
      // animate={{ opacity: 1, x: 0 }}
      // transition={{ duration: 0.8, delay: 1.5 }}
      className="pointer-events-auto w-full max-w-[320px] md:max-w-[380px] bg-black/40 backdrop-blur-xl border-6 border-white/30 rounded-lg p-3 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-primary-100/60 flex items-center justify-center">
          <div className="size-2 rounded-full bg-primary-100/80 animate-pulse" />
        </div>
        <span className="text-white font-clash font-bold text-lg tracking-wider">
          Hot Packages
        </span>
      </div>

      {/* Title & Details */}
      <div className="space-y-1">
        <h4 className="text-primary-100 font-clash font-semibold text-3xl leading-tight">
          Total Package
        </h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <DetailItem text="Three matches" />
          <DetailItem text="13 days" />
          <DetailItem text="3 cities" />
        </div>
      </div>

      {/* Teams Section */}
      <div className="flex items-end justify-between px-2">
        <TeamItem flag={ghanaFlag} name="Ghana" />

        <div className="pb-1">
          <span className="text-white font-clash font-bold text-sm mx-2">
            VS
          </span>
        </div>

        <div className="flex gap-4">
          <TeamItem flag={PanamaFlag} name="Panama" />
          <TeamItem flag={englandFlag} name="England" />
          <TeamItem flag={croatiaFlag} name="Croatia" />
        </div>
      </div>

      {/* Button */}
      <Link
        href="#packages"
        onClick={() => {
          document.getElementById("packages")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        <MaskRevealButton
          className="w-full justify-center py-4 mt-4 rounded-bl-xl"
          hoverBgClass="bg-primary-100"
          textClassName="text-primary-100"
        >
          <span className="font-clash font-semibold tracking-wider ">
            Explore more
          </span>
        </MaskRevealButton>
      </Link>
    </motion.div>
  );
};

const DetailItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <div className="size-1.5 bg-white/60" />
    <span className="text-white/80 font-helvetica text-sm tracking-wide">
      {text}
    </span>
  </div>
);

const TeamItem = ({ flag, name }: { flag: any; name: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-12 h-8 md:w-16 md:h-10 overflow-hidden rounded shadow-sm border border-white/10">
      <Image src={flag} alt={name} fill className="object-cover" />
    </div>
    <span className="text-white font-helvetica font-bold text-sm">{name}</span>
  </div>
);
