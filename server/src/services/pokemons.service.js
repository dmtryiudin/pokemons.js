import axios from "axios";
import { EnvService } from "./env.service.js";
import { z } from "zod";
import { GetPokemonDto } from "../dtos/get-pokemon.dto.js";
import { CustomException } from "../utils/custom-exception.util.js";

export class PokemonsService {
  static async prefetchPokemons() {
    const res = [];

    const { data } = await axios.get(EnvService.getValues().POKEMONS_API);

    const pokemonSchema = z.object({
      id: z.number(),
      name: z.object({
        english: z.string(),
      }),
      type: z.array(z.string()),
      base: z.object({
        HP: z.number(),
        Attack: z.number(),
        Defense: z.number(),
        Speed: z.number(),
      }),
      image: z.object({
        hires: z.string(),
      }),
    });

    for (const fetchedPokemon of data) {
      const isPokemonValid = pokemonSchema.safeParse(fetchedPokemon);

      if (isPokemonValid.error) {
        continue;
      }

      res.push({ ...new GetPokemonDto(fetchedPokemon) });
    }

    this.pokemons = res;

    return res.length;
  }

  static async prefetchPokemonsIneffectiveness() {
    const res = {};
    let recordsCount = 0;
    const { data } = await axios.get(EnvService.getValues().EFFECTIVE_POKEMONS);

    const pokemonEffectivenessSchema = z.object({
      english: z.string(),
      ineffective: z.array(z.string()),
    });

    for (const fetchedPokemonEffectiveness of data) {
      const isPokemonEffectivenessValid = pokemonEffectivenessSchema.safeParse(
        fetchedPokemonEffectiveness
      );

      if (isPokemonEffectivenessValid.error) {
        continue;
      }

      res[fetchedPokemonEffectiveness.english] =
        fetchedPokemonEffectiveness.ineffective;

      recordsCount++;
    }

    this.pokemonsIneffectiveness = res;

    return recordsCount;
  }

  static getPokemonsList(page, limit) {
    if (!this.pokemons) {
      throw CustomException.internalServerErrorException();
    }

    const pageParam = page || 1;
    const limitParam = limit || this.pokemons.length;

    const pokemonsToReturn = this.pokemons.slice(
      (pageParam - 1) * limitParam,
      pageParam * limitParam
    );

    return {
      data: pokemonsToReturn,
      page: pageParam,
      limit: limitParam,
      totalPages: Math.ceil(this.pokemons.length / limitParam),
      totalValuesCount: this.pokemons.length,
    };
  }

  static getPokemonById(id) {
    const usersPokemon = this.pokemons.find(
      (pokemonItem) => pokemonItem.id === id
    );

    if (!usersPokemon) {
      throw CustomException.notFoundException("Pokemon was not found");
    }

    return usersPokemon;
  }
}
