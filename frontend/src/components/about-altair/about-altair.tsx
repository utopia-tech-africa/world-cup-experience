import Image from "next/image";
import { CupBgImg } from "@/assets/img";
import ComponentLayout from "../component-layout";
import { Plus } from "lucide-react";

export const AboutAltair = () => {
  return (
    <section className="py-8 md:py-16 bg-white relative overflow-hidden">
      <ComponentLayout>
        <div className="max-w-8xl mx-auto flex flex-col gap-16">
          {/* Main Heading with Background Trophy */}
          <div className="relative group">
            {/* Trophy background image */}
            <div className="absolute -top-8 md:-top-16 left-[60%] md:left-[37%]  w-[150px] md:w-[220px]  aspect-square pointer-events-none select-none z-0">
              <Image
                src={CupBgImg}
                alt="World Cup Trophy"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h2 className="relative z-10 text-4xl sm:text-6xl md:text-7xl font-clash font-medium text-neutral-800 leading-tracking- 8 tighter max-w-6xl">
              Altair World Cup <br className="hidden sm:block" />
              Experience &apos;26
            </h2>
          </div>

          {/* Description Text Section */}
          <div className="relative flex justify-end w-full ">
            <div className="text-xl md:text-2xl lg:text-3xl text-neutral-700 font-helvetica leading-[1.3] tracking-tight relative flex items-start">
              <div className="flex flex-col">
                <p className="indent-12 md:indent-32">
                  <Plus
                    className="inline-block text-primary-100 size-6 md:size-8 mr-4 md:mr-6 -translate-y-1"
                    strokeWidth={3}
                  />
                  From stadium thrills to curated city tours, enjoy an
                  unforgettable football journey filled with world-class
                  matches, exciting attractions and hospitality.
                </p>
                <p className="indent-20 md:indent-42">
                  Join us via our premium hosting packages designed for
                  passionate fans who want more than just the game.
                  {/* Closing Plus Icon */}
                  <Plus
                    className="inline-block ml-3 text-primary-100 size-6 md:size-8 align-middle"
                    strokeWidth={3}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </ComponentLayout>
    </section>
  );
};
