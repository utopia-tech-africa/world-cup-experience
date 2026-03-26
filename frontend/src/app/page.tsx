import { Hero } from "@/components/hero";
import { AboutAltair } from "@/components/about-altair";
import { FifaFanfest } from "@/components/fifa-fanfest";
import { Packages } from "@/components/packages";
import { Explore } from "@/components/explore";
import { FAQ } from "@/components/faq";
import InclusionsExclusions from "@/components/packages/components/inclusions-exclusions";
// import { ComparePackages } from "@/components/compare-packages";

export default function Home() {
  return (
    <main className="space-y-10 md:space-y-30">
      <Hero />
      <AboutAltair />
      <Packages />
      <InclusionsExclusions />
      {/* <ComparePackages /> */}
      <FifaFanfest />
      <Explore />
      <FAQ />
    </main>
  );
}
