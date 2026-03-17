import { Hero } from "@/components/hero";
import { AboutAltair } from "@/components/about-altair";
import { FifaFanfest } from "@/components/fifa-fanfest";
import { Packages } from "@/components/packages";
import { Explore } from "@/components/explore";
import { FAQ } from "@/components/faq";

export default function Home() {
  return (
    <main className="space-y-4">
      <Hero />
      <Packages />
      <AboutAltair />
      <FifaFanfest />
      <Explore />
      <FAQ />
    </main>
  );
}
