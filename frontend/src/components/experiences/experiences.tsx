import {
  ExperiencesImg1,
  ExperiencesImg2,
  ExperiencesImg3,
  ExperiencesImg4,
} from "@/assets";
// import ExperiencesCard from "./experiences-card";
import ComponentLayout from "../component-layout";

const experiencesData = [
  {
    id: 1,
    title: "New York Day trip",
    description: "Explore iconic landmarks and great food in New York City.",
    imageSrc: ExperiencesImg1,
    imageAlt: "New York City skyline with iconic landmarks",
  },
  {
    id: 2,
    title: "Sight & Sound Theatre (Lancaster)",
    description:
      "Experience a live biblical show with stunning sets and powerful storytelling at Sight & Sound Theatre.",
    imageSrc: ExperiencesImg2,
    imageAlt: "Sight & Sound Theatre stage performance",
  },
  {
    id: 3,
    title: "Philadelphia City Tour",
    description:
      "Explore historic sites and culture in Philadelphia on a guided tour.",
    imageSrc: ExperiencesImg3,
    imageAlt: "Philadelphia historic landmarks",
  },
  {
    id: 4,
    title: "Hersheypark & Chocolate World",
    description:
      "Experience rides and chocolate at Hersheypark and Chocolate World.",
    imageSrc: ExperiencesImg4,
    imageAlt: "Hersheypark roller coaster and Chocolate World",
  },
];

const Experiences = () => {
  return (
    <ComponentLayout className="mb:10 md:mb-22 lg:mb-30">
      <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-[32px] md:text-4xl lg:text-5xl font-medium leading-[110%] max-w-2xl font-clash">
          Exciting experiences
        </h2>
        <p className="text-neutral-200 leading-5 text-sm md:text-lg font-sans">
          Get the best flight deals, airline specials and promotions.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        <div className="flex gap-3 overflow-x-auto pb-4 lg:overflow-visible lg:pb-0 lg:col-span-4 lg:grid lg:grid-cols-4 lg:gap-6 scrollbar-hide">
          {experiencesData.map((experience) => (
            <div key={experience.id} className="min-w-[320px] lg:min-w-0">
              {/* <ExperiencesCard
                title={experience.title}
                description={experience.description}
                imageSrc={experience.imageSrc}
                imageAlt={experience.imageAlt}
              /> */}
            </div>
          ))}
        </div>
      </div>
    </ComponentLayout>
  );
};

export default Experiences;
