import { Hero } from "@/components/hero";
import { Games } from "@/components/games";
import FifaFanfest from "@/components/fifa-fanfest/fifa-fanfest";
import Experiences from "@/components/experiences/experiences";
import Book from "@/components/book/book";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Games />
      <FifaFanfest />
      <Experiences />
      <Book />
    </main>
  );
}
