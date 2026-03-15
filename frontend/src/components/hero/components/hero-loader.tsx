"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { AltairLogo, WTWCLogoWhite } from "@/assets";
import { Plane } from "lucide-react";

interface HeroLoaderProps {
  onComplete?: () => void;
}

export const HeroLoader: React.FC<HeroLoaderProps> = ({ onComplete }) => {
  const mv = useMotionValue(0);
  const displayPercentage = useTransform(mv, (v) => Math.round(v));

  const loaderRef = useRef<HTMLDivElement>(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = displayPercentage.on("change", (v) => setPercentage(v));

    const animation = animate(mv, 100, {
      duration: 3.5,
      ease: [0.19, 1, 0.22, 1], // Custom expo-out ease for smoother progress
      onComplete: () => {
        if (loaderRef.current) {
          animate(
            loaderRef.current,
            { y: "-100%" },
            {
              duration: 1.2,
              delay: 0.5,
              ease: [0.76, 0, 0.24, 1],
              onComplete: () => {
                if (onComplete) onComplete();
              },
            },
          );
        }
      },
    });

    return () => {
      unsubscribe();
      animation.stop();
    };
  }, [mv, displayPercentage, onComplete]);

  return (
    <motion.div
      ref={loaderRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-8 md:gap-12">
        <motion.div
          className="relative w-[340px] md:w-[620px] lg:w-[700px] aspect-[155/45]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src={WTWCLogoWhite}
            alt="World Cup Experience Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AltairLogo className="w-[280px] md:w-[480px] lg:w-[520px] h-auto" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 flex items-center gap-6 md:gap-12 lg:gap-16">
        {/* Loading Line & Plane */}
        <div className="flex-1 h-[2px] bg-white/20 relative flex items-center">
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-primary-100 origin-left"
            style={{ scaleX: useTransform(mv, [0, 100], [0, 1]) }}
          />
          <motion.div
            className="absolute flex items-center justify-center -translate-x-1/2"
            style={{ left: useTransform(mv, (v) => `${v}%`) }}
          >
            <Plane
              className="w-5 h-5 md:w-6 md:h-6 text-primary-100 rotate-45 drop-shadow-[0_0_15px_rgba(212,74,35,0.6)]"
              fill="currentColor"
            />
          </motion.div>
        </div>

        {/* Percentage */}
        <motion.span
          className="text-primary-100 text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-general-sans font-bold tabular-nums leading-none select-none text-right min-w-[3.5ch]"
          style={{ opacity: useTransform(mv, [0, 10, 100], [0, 1, 1]) }}
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#D44A23]/5 blur-[120px] rounded-full pointer-events-none" />
    </motion.div>
  );
};
