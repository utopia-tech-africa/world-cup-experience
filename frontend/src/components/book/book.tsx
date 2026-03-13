import Image from "next/image";
import Link from "next/link";
import ComponentLayout from "../component-layout";
import { BookImg } from "@/assets";

const Book = () => {
  return (
    <ComponentLayout className="py-6">
      <div className="relative w-full min-h-82 rounded-2xl overflow-hidden ">
        <Image
          src={BookImg}
          alt="Fly with Altair"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/55 to-transparent via-50%" />

        <div className="absolute inset-0 flex items-center justify-center md:justify-end p-6 md:p-12 lg:p-16">
          <div className="text-center md:text-right max-w-lg">
            <h2 className="text-[32px] md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-[110%] max-w-110 font-clash">
              Fly with Altair today and create lasting Memories
            </h2>

            <Link href="#hero">
              <button type="button" className="bg-primary-400 hover:bg-primary-300 transition-colors cursor-pointer sm:py-3 px-4 sm:px-6 rounded-[52px] sm:text-base font-semibold text-white py-3 text-base md:text-lg font-sans">
                Book an experience
              </button>
            </Link>
          </div>
        </div>
      </div>
    </ComponentLayout>
  );
};

export default Book;
