import Image from "next/image";
import Link from "next/link";
import ComponentLayout from "../component-layout";
import { FifaFinfestImg } from "@/assets";
import { Button } from "../ui/button";

export const FifaFanfest = () => {
  return (
    <div className="relative ">
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
          <Button className=" rounded-none rounded-bl-3xl bg-white text-primary-100 px-3 sm:px-6 py-6 text-lg font-helvetica transition-all hover:bg-transparent hover:text-white border hover:border-white ">
            Select a package
          </Button>
        </Link>
      </ComponentLayout>
    </div>
  );
};
