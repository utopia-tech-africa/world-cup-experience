import Image from "next/image";
import Link from "next/link";
import ComponentLayout from "../component-layout";
import { FifaFinfestImg } from "@/assets";

const FifaFanfest = () => {
  return (
    <ComponentLayout>
      <div className="relative overflow-hidden rounded-lg py-6">
        <Image
          src={FifaFinfestImg}
          alt="Fifa Fan Fest Img"
          className="object-cover w-full h-125 sm:h-125"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent via-40% to-60% pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-4 sm:p-6 md:p-8 text-white z-10">
          <h2 className="text-[32px] md:text-4xl lg:text-5xl font-medium leading-[110%] font-clash">
            Experience the Fifa Fan Fest
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed sm:leading-10 font-normal max-w-2xl font-sans">
            Create lasting memories with our unbeatable prices and extensive
            coverage.
          </p>

          <Link href={"#"}>
            <button className="w-fit flex gap-3 bg-primary-400 hover:bg-primary-300 transition-colors cursor-pointer py-3 sm:py-3 px-4 sm:px-6 rounded-[52px] text-sm sm:text-base font-semibold font-sans">
              Select a package
            </button>
          </Link>
        </div>
      </div>
    </ComponentLayout>
  );
};

export default FifaFanfest;
