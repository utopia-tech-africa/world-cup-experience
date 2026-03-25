import Image from "next/image";
import Link from "next/link";
import { WTWCLogoWhite, FooterBgImg } from "@/assets";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  LocateIcon,
  Youtube,
} from "lucide-react";
import ComponentLayout from "../component-layout";
import { cn } from "@/lib/utils";
import { PiTiktokLogoLight } from "react-icons/pi";
import { FaLocationDot } from "react-icons/fa6";

const leftLinks = [
  { label: "PACKAGES", href: "#packages" },
  { label: "TOTAL", href: "#total-package" },
  { label: "EXPERIENCE", href: "#explore" },
  { label: "CORPORATE", href: "tel:+233593679741" },
];

const rightLinks = [
  { label: "PHONE", href: "tel:+233593679741" },
  { label: "EMAIL", href: "mailto:info@watchtheworldcup.live" },
  { label: "TERMS OF SERVICE", href: "#" },
  { label: "PRIVACY POLICY", href: "#" },
];

const socialLinks = [
  {
    label: "Facebook",
    icon: Facebook,
    href: "https://web.facebook.com/profile.php?id=61585047495195",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/watch_theworldcup/",
  },
  {
    label: "Tiktok",
    icon: PiTiktokLogoLight,
    href: "https://www.tiktok.com/@watchtheworldcup?_r=1&_t=ZS-94nJbvlzHTM",
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-black mt-10 md:mt-30 py-8 overflow-hidden text-neutral-100 flex items-center justify-center">
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-[15px] z-50 bg-[linear-gradient(45deg,#d14b21_33%,#a2d149_33%,#a2d149_66%,#79d1d1_66%)]" />

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
        {/* Mobile Logo */}
        <CenterLogo className="md:hidden -mt-12 mb-6" />

        <div className="w-full flex flex-col lg:flex-row items-start md:items-center lg:items-stretch justify-between md:gap-16 lg:gap-8 flex-1">
          {/* Left Links */}
          <div className="flex flex-col gap-3 md:gap-6 lg:w-1/4 pt-4 lg:pt-16">
            {leftLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-start gap-3 w-fit lg:mx-0"
              >
                <span className="font-clash font-semibold tracking-widest text-base md:text-lg lg:text-xl uppercase transition-colors group-hover:text-neutral-200">
                  {link.label}
                </span>
                <ArrowUpRight className="md:size-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-neutral-200" />
              </Link>
            ))}
          </div>

          {/* Center Logo & Socials */}
          <div className=" hidden md:flex flex-col items-center justify-start lg:w-2/4 gap-12 ">
            <CenterLogo />
            <Socials />
            <OfficeAdress />
          </div>

          {/* Right Links */}
          <div className="flex flex-col gap-3 md:gap-6 lg:w-1/4 items-start md:items-center lg:items-end pt-4 lg:pt-16">
            {rightLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center justify-start md:justify-center lg:justify-end gap-3 w-fit"
              >
                <span className="font-clash font-semibold tracking-widest text-base md:text-lg lg:text-xl uppercase text-nowrap transition-colors group-hover:text-neutral-200">
                  {link.label}
                </span>
                <ArrowUpRight className="md:size-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-neutral-200" />
              </Link>
            ))}
          </div>

          <Socials className="md:hidden items-start" />
          <OfficeAdress className="md:hidden items-start mt-4" />
        </div>

        {/* Bottom Copyright */}
        <div className="w-full mt-4 pt-8 text-center opacity-70">
          <p className="font-helvetica font-light">
            Altair Logistics © 2026. All Rights Reserved.
          </p>
        </div>
      </ComponentLayout>
    </footer>
  );
}

const CenterLogo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[650px] aspect-[155/45]",
        className,
      )}
    >
      <Image
        src={WTWCLogoWhite}
        alt="Watch The World Cup"
        fill
        className="object-contain"
      />
    </div>
  );
};

const Socials = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        `flex flex-col sm:flex-row items-center mt-12 md:mt-4 gap-3 sm:gap-10 ${className}`,
      )}
    >
      <span className="font-helvetica font-semibold tracking-widest text-sm uppercase text-nowrap">
        FOLLOW US
      </span>
      <div className="flex items-center gap-6 flex-wrap md:flex-nowrap justify-start md:justify-center">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.label}
              href={social.href}
              className="group flex items-center gap-2 transition-colors hover:text-neutral-200"
              target="_blank"
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="font-helvetica text-lg">{social.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const OfficeAdress = ({ className }: { className?: string }) => {
  return (
    <Link
      href="https://maps.app.goo.gl/43ktFiwd7jFqe6fD6"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        `group flex items-center justify-start md:justify-center lg:justify-end gap-3 w-fit ${className}`,
      )}
    >
      <FaLocationDot className="w-[18px] h-[18px]" />
      <address className="not-italic font-clash font-medium text-sm md:text-base  text-neutral-200 group-hover:text-white transition-colors text-left md:text-center lg:text-right leading-snug">
        No. 21 Nii Adjei Onano Street East Legon, Accra - Ghana
      </address>
    </Link>
  );
};
