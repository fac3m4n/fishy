import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { pokemonOptions } from "@/app/pokemon";
import { getQueryClient } from "@/components/query-client";
import { PokemonInfo } from "./pokemon-info";

export default function Home() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(pokemonOptions);

  return (
    <main>
      <h1>Pokemon Info</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PokemonInfo />
      </HydrationBoundary>
    </main>
  );
}
