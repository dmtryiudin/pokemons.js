import { PokemonsApi } from "../types/endpoints";
import { api } from "../utils/api";

export class PokemonsService {
  static async getPokemonsList(params) {
    const { data } = await api.get(
      PokemonsApi.POKEMONS_LIST + `?page=${params.page}&limit=${params.limit}`
    );

    return data;
  }
}
