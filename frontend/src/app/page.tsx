import { Hero } from "@/components/hero";
import { Games } from "@/components/games";
import Book from "@/components/book/book";
import { AboutAltair } from "@/components/about-altair";
import { FifaFanfest } from "@/components/fifa-fanfest";
import { Packages } from "@/components/packages";
import { Explore } from "@/components/explore";
import { FAQ } from "@/components/faq";

export default function Home() {
  return (
    <main className="space-y-4">
      <Hero />
      <AboutAltair />
      <FifaFanfest />
      <Packages />
      <Explore />
      <FAQ />
    </main>
  );
}
