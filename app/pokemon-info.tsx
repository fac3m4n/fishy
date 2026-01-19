"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { pokemonOptions } from "@/app/pokemon";

export function PokemonInfo() {
  const { data } = useSuspenseQuery(pokemonOptions);

  return (
    <div>
      <figure>
        <Image
          alt={data.name}
          height={200}
          src={data.sprites.front_shiny}
          width={200}
        />
        <h2>I'm {data.name}</h2>
      </figure>
    </div>
  );
}
