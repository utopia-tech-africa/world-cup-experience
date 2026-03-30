"use client";

import { useRef, useState, useEffect } from "react";
import { HeroLoader } from "./components/hero-loader";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WTWCLogoWhite, ballGif } from "@/assets";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loaderDone, setLoaderDone] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const isDone = sessionStorage.getItem("hero-loader-done");
    if (isDone !== "true") {
      setLoaderDone(false);
    }
    setHasMounted(true);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem("hero-loader-done", "true");
    setLoaderDone(true);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (!loaderDone) {
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [loaderDone]);

  // Play video with sound if unmuted, or just play if loader done
  useEffect(() => {
    if (loaderDone && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Autoplay was prevented:", error);
      });
    }
  }, [loaderDone]);

  // Handle unmute on click
  const handleToggleAudio = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setMuted(nextMuted);
    }
  };

  if (!hasMounted) {
    return <section className="relative w-full h-dvh bg-black" />;
  }

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-black select-none">
      {!loaderDone && (
        <AnimatePresence mode="wait">
          <HeroLoader key="loader" onComplete={handleComplete} />
        </AnimatePresence>
      )}

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dan9camhs/video/upload/v1774370993/altair-landing-page-video_qyeesp.mp4"
            media="(min-width: 640px)"
          />
          <source src="https://res.cloudinary.com/dan9camhs/video/upload/v1774448270/altair-hero-bg-mobile_adsyii.mp4" />
        </video>
      </div>

      {/* Decorative Frosted Glass Panels */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Top panel */}
        <div className="absolute top-0 left-0 w-full h-[9%] bg-black/10 backdrop-blur-md flex items-center px-8 md:px-14 lg:px-20">
          <div className="pointer-events-auto relative size-40">
            <Image
              src={WTWCLogoWhite}
              alt="Watch The World Cup Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Bottom panel */}
        <div className="absolute bottom-0 left-0 w-full h-[9%] bg-black/10 backdrop-blur-md flex justify-between items-center px-8 md:px-14 lg:px-28">
          {/* Scroll Indicator Inside Bottom Panel */}
          <div className="flex items-center gap-4">
            <span className="text-white font-clash text-xl md:text-2xl font-medium tracking-tight">
              Scroll
            </span>
            <div className="relative w-6 h-6 md:w-7 md:h-7">
              <Image
                src={ballGif}
                alt="Scroll"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Audio Indicator */}
          <motion.div
            className="pointer-events-auto flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl group transition-all hover:bg-white/10"
            onClick={handleToggleAudio}
            initial={{ y: 20, opacity: 0 }}
            animate={loaderDone ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <div className="flex gap-[2px] items-end h-3">
              {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] bg-white/80"
                  animate={
                    !muted
                      ? {
                          height: [
                            `${h * 100}%`,
                            `${(1 - h) * 100}%`,
                            `${h * 100}%`,
                          ],
                        }
                      : { height: "2px" }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <span className="text-white/80 text-[10px] md:text-xs font-clash uppercase tracking-[0.2em]">
              {muted ? "Muted" : "Playing"}
            </span>
          </motion.div>
        </div>

        {/* Right panel (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-[9%] bottom-[9%] right-0 w-[5%] bg-black/10 backdrop-blur-md" />

        {/* Continuous Grid Lines */}
        <div className="absolute top-[9%] left-0 w-full h-px bg-white/50" />
        <div className="absolute bottom-[9%] left-0 w-full h-px bg-white/50" />
        <div className="hidden md:block absolute top-0 right-[5%] w-px h-full bg-white/50" />

        {/* Intersection nodes (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-[9%] right-[5%] w-[5px] h-[5px] bg-white translate-x-1/2 -translate-y-1/2" />
        <div className="hidden md:block absolute bottom-[9%] right-[5%] w-[5px] h-[5px] bg-white translate-x-1/2 translate-y-1/2" />

        {/* Top/Bottom masks for cinematic feel */}
        <div className="absolute top-0 left-0 w-full h-[20%] bg-linear-to-b from-black/80 to-transparent opacity-50" />
      </div>

      {/* Hero Interactivity Overlay */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={handleToggleAudio}
      />
    </section>
  );
}
