"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExploreImg1,
  ExploreImg2,
  ExploreImg3,
  ExploreImg4,
  ExploreImg5,
} from "@/assets/img";
import ComponentLayout from "../component-layout";

const EXPLORE_DATA = [
  {
    id: 1,
    title: "New York Day Trip",
    description: "Explore iconic landmarks and great food in New York City.",
    image: ExploreImg1,
  },
  {
    id: 2,
    title: "Sight & Sound Theatre (Lancaster)",
    description:
      "Enjoy a live biblical show with stunning sets at Sight & Sound Theatre.",
    image: ExploreImg2,
  },
  {
    id: 3,
    title: "Philadelphia City Tour",
    description:
      "Explore historic sites and culture in Philadelphia on a guided tour.",
    image: ExploreImg3,
  },
  {
    id: 4,
    title: "Hersheypark & Chocolate World",
    description:
      "Experience rides and chocolate at Hersheypark and Chocolate World.",
    image: ExploreImg4,
  },
  {
    id: 5,
    title: "Premium Shopping Outlets",
    description:
      "Discover designer brands and fantastic deals at premium shopping outlets.",
    image: ExploreImg5,
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

export const Explore = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EXPLORE_DATA.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black group/section">
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-[15px] z-50 bg-[linear-gradient(45deg,#d14b21_33%,#a2d149_33%,#a2d149_66%,#79d1d1_66%)]" />

      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={EXPLORE_DATA[currentIndex].image}
              alt={EXPLORE_DATA[currentIndex].title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 z-10" />
      </div>

      <ComponentLayout className="relative z-30 h-full flex flex-col justify-between  py-6">
        {/* Header */}
        <h2 className="text-[27px] md:text-4xl lg:text-5xl font-clash font-medium text-white tracking-tight">
          Explore Beyond the Stadium
        </h2>

        <div className="flex flex-col gap-4 sm:gap-8">
          {/* Content Section */}
          <div className="mb-4 justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="max-w-2xl"
              >
                <h3 className="text-4xl md:text-6xl font-clash font-semibold  text-white mb-4 leading-[1.05] tracking-tight">
                  {EXPLORE_DATA[currentIndex].title}
                </h3>
                <p className="text-xl md:text-2xl text-white/90 font-helvetica max-w-lg">
                  {EXPLORE_DATA[currentIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Custom Progress Bar Segments */}
          <div className="flex gap-2 md:gap-4 w-full h-[2px]">
            {EXPLORE_DATA.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 bg-white/20 relative overflow-hidden cursor-pointer"
                onClick={() => setCurrentIndex(idx)}
              >
                {idx === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: SLIDE_DURATION / 1000,
                      ease: "linear",
                    }}
                    key={currentIndex} // Reset animation on slide change
                  />
                )}
                {idx < currentIndex && (
                  <div className="absolute inset-0 bg-white" />
                )}
              </div>
            ))}
          </div>
        </div>
      </ComponentLayout>
    </section>
  );
};
