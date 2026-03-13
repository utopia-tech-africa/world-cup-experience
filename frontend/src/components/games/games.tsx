"use client";

import { useCallback } from "react";
import ComponentLayout from "../component-layout";
import { gameOffers, buildGameOffersFromPackages } from "./data/games-data";
import { GameCard } from "./components";
import { usePackages } from "@/hooks/queries/usePackages";
import { Button } from "@/components/ui/button";

export default function Games() {
  const { data: packages = [], isLoading, isError, refetch } = usePackages();

  const offers =
    packages.length > 0 ? buildGameOffersFromPackages(packages) : gameOffers;

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <section className="mb:10 md:mb-22 lg:mb-30">
      <ComponentLayout>
        <div className="mb-6 max-w-2xl">
          <h2 className="text-[40px] font-medium font-clash text-neutral-400 leading-[1.1] mb-3">
            World cup offers
          </h2>
          <p className="text-[20px] font-normal font-sans text-neutral-200 leading-normal opacity-90">
            Get the best flight deals, airline specials and promotions.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex aspect-4/5 md:aspect-auto md:h-[480px] flex-col rounded-lg bg-muted/50 animate-pulse p-3"
                aria-hidden
              >
                <div className="mb-4 h-8 w-24 rounded-full bg-muted" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="flex w-full justify-between gap-2">
                    <div className="h-16 w-20 rounded bg-muted" />
                    <div className="h-4 w-6 rounded bg-muted" />
                    <div className="h-16 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-24 rounded bg-muted" />
                </div>
                <div className="mt-auto flex justify-between">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 py-12 text-center">
            <p className="text-destructive font-medium">
              Could not load packages. Please try again.
            </p>
            <Button type="button" variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <GameCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </ComponentLayout>
    </section>
  );
}
