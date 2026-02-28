import Image from "next/image";
import { heroBgPattern } from "@/assets";
import ComponentLayout from "../component-layout";
import { BookingForm, HeroContent } from "./components";

export function Hero() {
  return (
    <section className="relative flex min-h-dvh w-full flex-col bg-neutral-100 overflow-hidden mb-19 md:mb-22 lg:mb-30">
      {/* Background Pattern and Radial Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBgPattern}
          alt="background pattern"
          fill
          className="object-cover pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, white 100%)",
          }}
        />
      </div>

      <ComponentLayout className="relative z-10 flex min-h-0 flex-1 flex-col">
        <HeroContent />
        <BookingForm />
      </ComponentLayout>
    </section>
  );
}
