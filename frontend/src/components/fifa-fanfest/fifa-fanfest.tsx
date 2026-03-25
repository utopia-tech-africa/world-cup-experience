import Image from "next/image";
import Link from "next/link";
import ComponentLayout from "../component-layout";
import { FifaFinfestImg } from "@/assets";
import { MaskRevealButton } from "../mask-reveal-button";

export const FifaFanfest = () => {
  return (
    <div className="relative">
      <Image
        src={FifaFinfestImg}
        alt="Fifa Fan Fest Img"
        className="object-cover w-full h-125 sm:h-160"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent via-40% to-60% pointer-events-none" />

      <ComponentLayout className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 sm:p-6 md:p-8 text-white z-10">
        <h2 className="text-[32px] md:text-4xl lg:text-5xl font-medium leading-[110%] font-clash">
          Experience the Fifa Fan Fest
        </h2>

        <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed sm:leading-10 tracking-wide font-normal font-sans">
          Create lasting memories with our unbeatable prices and extensive
          coverage.
        </p>

        <Link href="#">
          <MaskRevealButton
            className="rounded-bl-3xl py-6"
            hoverBgClass="bg-primary-100"
            textClassName="text-primary-100"
          >
            Select a package
          </MaskRevealButton>
        </Link>
      </ComponentLayout>
    </div>
  );
};
