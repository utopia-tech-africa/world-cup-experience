import Image, { StaticImageData } from "next/image";

interface ExperiencesCardProps {
  title: string;
  description: string;
  imageSrc: StaticImageData | string;
  imageAlt: string;
}

const ExperiencesCard = ({
  title,
  description,
  imageSrc,
  imageAlt,
}: ExperiencesCardProps) => {
  return (
    <div className="group cursor-pointer w-full">
      <div className="relative h-66 w-full overflow-hidden rounded-sm">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-nowrap text-base font-semibold text-neutral-300 font-sans">
          {title}
        </h3>
        <p className="mt-1 text-neutral-300 text-sm font-sans opacity-80">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ExperiencesCard;
