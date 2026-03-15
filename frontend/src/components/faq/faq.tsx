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
      "Our packages typically include match tickets, premium accommodation, airport transfers, city tours, and exclusive fan experiences tailored to each host city.",
  },
  {
    question:
      "What is the difference between the Single Game and Double Game packages?",
    answer:
      "Single Game packages focus on one specific match and city, while Double Game packages offer a longer stay spanning two matches and potentially multiple host cities with more extensive travel arrangements.",
  },
  {
    question: "Are match tickets included in the package?",
    answer:
      "Yes, guaranteed official match tickets are a core part of all our World Cup Experience hosting packages.",
  },
  {
    question: "What accommodation options are available?",
    answer:
      "We offer a range of options from premium hostels for the budget-conscious fan to luxury 5-star hotels for those seeking ultimate comfort.",
  },
  {
    question: "Can I choose between a single room or a shared room?",
    answer:
      "Yes, we provide both single and shared room options depending on your preference and the specific package selected.",
  },
  {
    question: "What activities are included in the experience days?",
    answer:
      "Experience days include guided city tours, visits to iconic landmarks, fan fest attendance, and curated local dining experiences.",
  },
  {
    question: "Are airport transfers included?",
    answer:
      "Yes, we provide seamless airport transfers to and from your accommodation in all host cities included in your package.",
  },
  {
    question: "Can I upgrade my package?",
    answer:
      "Absolutely. You can upgrade your accommodation, add more match tickets, or include extra days and activities to your itinerary subject to availability.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white">
      {/* Background Decorative Pattern */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 md:w-48 opacity-30 md:opacity-70 pointer-events-none">
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
