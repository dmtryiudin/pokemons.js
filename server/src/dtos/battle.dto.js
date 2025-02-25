import { PokemonsService } from "../services/pokemons.service.js";
import { AttackDto } from "./attack.dto.js";

export class BattleDto {
  constructor({ _id, user, userPokemon, botPokemon, starts, attacks }) {
    this.id = _id;
    this.user = user;
    this.userPokemon = PokemonsService.getPokemonById(userPokemon);
    this.botPokemon = PokemonsService.getPokemonById(botPokemon);
    this.starts = starts;
    this.attacks = attacks.map((el) => ({ ...new AttackDto(el) }));
  }
}
