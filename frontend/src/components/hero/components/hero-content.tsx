import Image from "next/image";
import { heroBgImg } from "@/assets";

export function HeroContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-12 items-center">
      {/* Left Content */}
      <div className="flex flex-col items-center lg:items-start">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-5xl lg:text-[70px] leading-[1.1] font-bold text-neutral-400 mb-6 font-clash">
            World Cup <br className="hidden lg:block" /> Experience ‘26
          </h1>
          <p className="text-lg md:text-xl font-normal text-neutral-200 leading-tight font-sans">
            Join us for an unforgettable experience at the World Cup ‘26. Be
            part of the action with premium tickets, exclusive hospitality.
          </p>
        </div>
      </div>

      {/* Right Content - Hero Image */}
      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square">
        <Image
          src={heroBgImg}
          alt="World Cup Experience"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
