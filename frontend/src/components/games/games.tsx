import ComponentLayout from "../component-layout";
import { gameOffers } from "./data/games-data";
import { GameCard } from "./components";

export default function Games() {
  return (
    <section className="py-10 bg-neutral-100">
      <ComponentLayout>
        {/* Header Section */}
        <div className="mb-6 max-w-2xl">
          <h2 className="text-[40px] font-medium font-clash text-neutral-400 leading-[1.1] mb-3">
            World cup offers
          </h2>
          <p className="text-[20px] font-normal font-sans text-neutral-200 leading-normal opacity-90">
            Get the best flight deals, airline specials and promotions.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gameOffers.map((offer) => (
            <GameCard key={offer.id} offer={offer} />
          ))}
        </div>
      </ComponentLayout>
    </section>
  );
}
