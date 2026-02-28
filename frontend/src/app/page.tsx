import { Hero } from "@/components/hero";
import { Games } from "@/components/games";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Games />
    </main>
  );
}
