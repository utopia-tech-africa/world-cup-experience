import Image from "next/image";
import Link from "next/link";
import { WTWCLogoWhite, FooterBgImg } from "@/assets";
import { ArrowUpRight, Facebook, Instagram, Youtube } from "lucide-react";
import ComponentLayout from "../component-layout";
import { cn } from "@/lib/utils";

const leftLinks = [
  { label: "PACKAGES", href: "#" },
  { label: "TORONTO", href: "#" },
  { label: "EXPERIENCE", href: "#" },
  { label: "CORPORATE", href: "#" },
];

const rightLinks = [
  { label: "PHONE", href: "#" },
  { label: "EMAIL", href: "#" },
  { label: "TERMS OF SERVICE", href: "#" },
  { label: "PRIVACY POLICY", href: "#" },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Youtube", icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-black py-8 overflow-hidden text-neutral-100 flex items-center justify-center">
      {/* Background Image / Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={FooterBgImg}
          alt="footer background"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute top-0 left-0 w-full h-[20%] bg-linear-to-b from-black/50 to-transparent" />
      </div>

      <ComponentLayout className="relative z-10 flex flex-col items-center justify-between w-full min-h-[400px] mt-12 md:mt-24">
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-16 lg:gap-8 flex-1">
          {/* Left Links */}
          <div className="flex flex-col gap-3 md:gap-6 lg:w-1/4 pt-4 lg:pt-16">
            {leftLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-center lg:justify-start gap-3 w-fit mx-auto lg:mx-0"
              >
                <span className="font-clash font-semibold tracking-widest text-base md:text-lg lg:text-xl uppercase transition-colors group-hover:text-neutral-200">
                  {link.label}
                </span>
                <ArrowUpRight className="md:size-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-neutral-200" />
              </Link>
            ))}
          </div>

          {/* Center Logo & Socials */}
          <CenterLogoAndSocials className="hidden md:flex" />

          {/* Right Links */}
          <div className="flex flex-col gap-3 md:gap-6 lg:w-1/4 items-center lg:items-end pt-4 lg:pt-16">
            {rightLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-center lg:justify-end gap-3 w-fit"
              >
                <span className="font-clash font-semibold tracking-widest text-base md:text-lg lg:text-xl uppercase text-nowrap transition-colors group-hover:text-neutral-200">
                  {link.label}
                </span>
                <ArrowUpRight className="md:size-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-neutral-200" />
              </Link>
            ))}
          </div>

          <CenterLogoAndSocials className="md:hidden" />
        </div>

        {/* Bottom Copyright */}
        <div className="w-full mt-24 pt-8 text-center opacity-70">
          <p className="font-helvetica font-light">
            Altair Logistics © 2026. All Rights Reserved.
          </p>
        </div>
      </ComponentLayout>
    </footer>
  );
}

const CenterLogoAndSocials = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-start lg:w-2/4 gap-12 ${className}`,
      )}
    >
      <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[650px] aspect-[155/45]">
        <Image
          src={WTWCLogoWhite}
          alt="Watch The World Cup"
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <span className="font-helvetica font-semibold tracking-widest text-sm uppercase text-nowrap">
          FOLLOW US
        </span>
        <div className="flex items-center gap-6 flex-wrap md:flex-nowrap justify-center">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.label}
                href={social.href}
                className="group flex items-center gap-2 transition-colors hover:text-neutral-200"
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="font-helvetica text-lg">{social.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
