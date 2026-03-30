import { FaqBgPattern } from "@/assets/svg";
import ComponentLayout from "../component-layout";
import Image from "next/image";
import { PlusCircle, MinusCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion";

const faqs = [
  {
    question: "What is included in the World Cup Experience package?",
    answer:
      "The World Cup Experience package includes transportation to all scheduled matches as well as access to all organized tours during your stay; however, tickets for specific attractions on these tours must be purchased separately. Match tickets are not included, but assistance will be provided to help you acquire them. Please also note that all travelers are required to have a valid visa to participate in the package.",
  },
  {
    question:
      "What is the difference between the Double Game and Triple Game packages?",
    answer:
      "The difference between the Double Game and Triple Game packages comes down to both the number of matches and the length of your stay: the Double Game package covers two matches with a 7-night stay, while the Triple Game package includes three matches with an extended 13-night stay, with both options offering the same transportation, tour access, and support services. If you would like a custom package, it’s available just contact us.",
  },
  {
    question: "Are match tickets included in the package?",
    answer:
      "Match tickets are not included in the package; however, assistance will be provided to help you acquire them.",
  },
  {
    question: "What accommodation options are available?",
    answer:
      "Accommodation options include both four-star and three-star hotel stays, with all rooms offered on a double occupancy basis featuring queen-size beds. Single occupancy is available upon request at an additional cost.",
  },
  {
    question: "Can I choose between a single room or a shared room?",
    answer:
      "Room options depend on the type of accommodation selected: hotel stays are based on double occupancy, meaning rooms are shared by two people. Single occupancy is available upon request at an additional cost.",
  },
  {
    question: "What activities are included in the experience days?",
    answer:
      "The experience days feature guided tours of Philadelphia landmarks, excursions to Hershey Park, and shopping trips to the King of Prussia and Premium Outlets. While professional guides and transportation are included in the package, you will have to purchase your own tickets on arrival to any of the tour sites.",
  },
  {
    question: "Are airport transfers included?",
    answer:
      "Yes, airport transfers are included. Each package provides comprehensive ground transportation, which covers your arrival from the airport to your accommodation and your return for departure.",
  },
  {
    question: "Can I upgrade my package?",
    answer:
      "Yes, you can upgrade your package. Upgrades are available upon request, please contact the team directly to check availability and pay any applicable price difference.",
  },
];

export default function FAQ() {
  return (
    <section className="relative overflow-hidden bg-white" id="faq">
      {/* Background Decorative Pattern */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 md:w-48 opacity-0 md:opacity-70 pointer-events-none">
        <Image src={FaqBgPattern} alt="" className="w-full h-auto" />
      </div>

      <ComponentLayout className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Left Side: Header */}
          <div className="flex flex-col">
            <span className="text-primary-100 font-clash  tracking-widest text-lg md:text-xl uppercase sm:mb-6">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-clash text-neutral-800 leading-[1.05] tracking-tight ">
              All your lingering questions answered
            </h2>
          </div>

          {/* Right Side: Accordion */}
          <div className="flex flex-col">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[linear-gradient(to_right,#e5e5e5_80%,transparent_50%)] bg-size-[18px_1px] bg-repeat-x bg-bottom hover:bg-blue-300/30 transition-colors"
                >
                  <AccordionTrigger className="flex items-center justify-between w-full text-left hover:no-underline group  py-2 md:py-4">
                    <span className="text-base md:text-lg lg:text-xl font-helvetica text-neutral-500/80 group-data-[state=open]:text-neutral-800 transition-colors">
                      {faq.question}
                    </span>
                    <div className="relative size-6 shrink-0">
                      <PlusCircle className="absolute inset-0 size-6 text-primary-100 transition-opacity duration-300 opacity-100 group-data-[state=open]:opacity-0" />
                      <MinusCircle className="absolute inset-0 size-6 text-black transition-opacity duration-300 opacity-0 group-data-[state=open]:opacity-100" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-400/70 font-helvetica text-base md:text-lg pb-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </ComponentLayout>
    </section>
  );
}
