"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X } from "lucide-react";
import { HotPackagesWidget } from "./hero/components/hot-packages-widget";

export function HotPackagesToggle() {
  const [showWidget, setShowWidget] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial check
    const isDone = sessionStorage.getItem("hero-loader-done");
    if (isDone === "true") {
      setIsVisible(true);
    }

    // Polling or listening for storage events (though storage events only fire across tabs)
    // We'll use a simple interval to sync with the Hero loader
    const interval = setInterval(() => {
      if (sessionStorage.getItem("hero-loader-done") === "true") {
        setIsVisible(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-48 right-4 md:right-10 lg:right-30 lg:bottom-48 z-9999 pointer-events-none">
      <AnimatePresence mode="wait">
        {!showWidget ? (
          <motion.button
            key="widget-trigger"
            drag="y"
            dragMomentum={false}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowWidget(true);
            }}
            className="pointer-events-auto size-14 md:size-16 rounded-full bg-black/80 backdrop-blur-xl border border-red-500/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] group touch-none"
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <div className="relative drop-shadow-[0_0_10px_rgba(255,100,0,0.8)]">
              <Flame className="size-6 md:size-7 text-[#FF4500] fill-[#FF4500] transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12 origin-bottom" />
              <div className="absolute -top-1 -right-1 size-2 md:size-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 size-2 md:size-3 bg-red-500 rounded-full shadow-[0_0_8px_#ff0000]" />
            </div>
            <span className="text-[9px] md:text-[10px] font-clash font-black mt-1 tracking-wider bg-linear-to-r from-[#FF0000] via-[#FF8C00] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform">
              HOT
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="widget-content"
            drag="y"
            dragMomentum={false}
            whileDrag={{ cursor: "grabbing" }}
            className="pointer-events-auto touch-none"
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWidget(false);
              }}
              className="absolute -top-3 -left-3 z-10000 size-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-2xl"
            >
              <X className="size-5" />
            </button>
            <HotPackagesWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
