import Image from "next/image";
import { footerBgPattern } from "@/assets/svg";
import ComponentLayout from "../component-layout";
import { FooterLinks } from "./components";

export default function Footer() {
  return (
    <footer className="relative w-full bg-linear-to-t from-primary-300 to-primary-200  pt-4 md:pt-20 pb-10 overflow-hidden text-neutral-100 mt-12 md:mt-16  lg:mt-24">
      <ComponentLayout className="relative pt-10 md:pt-0">
        {/* Background Pattern - Now inside layout and fully visible */}
        <div className="absolute inset-0 z-0">
          <Image
            src={footerBgPattern}
            alt="background pattern"
            fill
            className="object-contain object-top lg:object-center pointer-events-none"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
          {/* Brand Section */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl lg:text-[40px] font-bold font-clash  leading-tight">
              ALTAIR LOGISTICS
            </h2>
            <p className="opacity-80 mt-2 font-sans">
              Your travel partner for life!
            </p>
          </div>

          {/* Links Section */}
          <FooterLinks />
        </div>

        {/* Bottom Bar */}
        <div className=" pt-8 flex justify-center">
          <p className="text-sm lg:text-base font-normal font-sans text-center">
            Altair Logistics © 2026. All Rights Reserved.
          </p>
        </div>
      </ComponentLayout>
    </footer>
  );
}
