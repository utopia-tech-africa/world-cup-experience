"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headset, Mail, Phone, X, MessageCircle } from "lucide-react";

export function ContactToggle() {
  const [showWidget, setShowWidget] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDone = sessionStorage.getItem("hero-loader-done");
    if (isDone === "true") {
      setIsVisible(true);
    }

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
    <div className="fixed bottom-27 right-4 md:right-10 lg:right-30 lg:bottom-24 z-9999 pointer-events-none">
      <AnimatePresence mode="wait">
        {!showWidget ? (
          <motion.button
            key="contact-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setShowWidget(true);
            }}
            className="pointer-events-auto size-14 md:size-16 rounded-full bg-black/80 backdrop-blur-xl border border-blue-500/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] group hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
            initial={{ scale: 0, opacity: 0, rotate: 20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <div className="relative drop-shadow-[0_0_10px_rgba(30,144,255,0.8)]">
              <MessageCircle className="size-6 md:size-7 text-[#1E90FF] fill-[#1E90FF] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 size-2 md:size-3 bg-blue-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 size-2 md:size-3 bg-blue-500 rounded-full shadow-[0_0_8px_#1E90FF]" />
            </div>
            <span className="text-[9px] md:text-[10px] font-clash font-black mt-1 tracking-wider bg-linear-to-r from-[#00BFFF] via-[#1E90FF] to-[#4169E1] bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform">
              HELP
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="contact-widget-content"
            className="pointer-events-auto"
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 500 }}
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
            <ContactWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ContactWidget = () => {
  return (
    <div className="w-full max-w-[320px] md:max-w-[380px] bg-black/40 backdrop-blur-xl border-6 border-white/30 rounded-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-blue-500/60 flex items-center justify-center">
          <div className="size-2 rounded-full bg-blue-400 animate-pulse" />
        </div>
        <span className="text-white font-clash font-bold text-lg tracking-wider uppercase">
          Support
        </span>
      </div>

      {/* Title & Info */}
      <div className="space-y-1">
        <h4 className="text-[#1E90FF] font-clash font-semibold text-3xl leading-tight">
          Get in Touch
        </h4>
        <p className="text-white/70 font-helvetica text-sm leading-relaxed">
          Need help with your booking? Our experts are available 24/7.
        </p>
      </div>

      {/* Contact Options */}
      <div className="flex flex-col gap-3">
        <ContactItem
          icon={Phone}
          label="CALL US"
          value="+233 257 554 514"
          href="tel:+233257554514"
        />
        <ContactItem
          icon={Mail}
          label="EMAIL US"
          value="info@watchtheworldcup.live"
          href="mailto:info@watchtheworldcup.live"
        />
      </div>
    </div>
  );
};

const ContactItem = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href: string;
}) => (
  <a
    href={href}
    className="group flex items-center justify-between gap-1 p-3 rounded-lg bg-black/50 border border-white/10 transition-all hover:bg-white hover:border-white"
  >
    <div className="flex flex-col justify-start items-start">
      <span className="text-sm font-helvetica font-bold tracking-wide text-white/50 group-hover:text-black/50 transition-colors">
        {label}
      </span>

      <span className="text-white group-hover:text-black font-helvetica font-bold text-lg truncate transition-colors">
        {value}
      </span>
    </div>
    <Icon className="size-6 text-[#1E90FF] group-hover:text-black transition-colors" />
  </a>
);
