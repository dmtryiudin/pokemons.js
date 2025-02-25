import { BattleDto } from "../dtos/battle.dto.js";
import { BattleModel } from "../schemas/battle.schema.js";
import { CustomException } from "../utils/custom-exception.util.js";
import { EthereumService } from "./ethereum.service.js";
import { PokemonsService } from "./pokemons.service.js";
import { UserModel } from "../schemas/user.schema.js";

export class BattleService {
  static findPokemonForBot(userPokemon) {
    const randomUserPokemonType =
      userPokemon.type[
        Math.round(Math.random() * (userPokemon.type.length - 1))
      ];

    const allowedTypesForPokemon =
      PokemonsService.pokemonsIneffectiveness[randomUserPokemonType];

    const pokemons = PokemonsService.getPokemonsList();

    const allowedPokemons = pokemons.data.filter((pokemonItem) => {
      if (pokemonItem.id === userPokemon.id) {
        return false;
      }

      const intersection = pokemonItem.type.filter((value) =>
        allowedTypesForPokemon.includes(value)
      );

      return !!intersection.length;
    });

    return allowedPokemons[
      Math.round(Math.random() * (allowedPokemons.length - 1))
    ];
  }

  static async checkTurn(foundBattle, attacker) {
    const isStartersTurn = foundBattle.attacks.length % 2 === 0;
    let turn = foundBattle.starts;

    if (!isStartersTurn) {
      switch (turn) {
        case "bot":
          turn = "user";
          break;
        case "user":
          turn = "bot";
          break;
      }
    }

    return turn === attacker;
  }

  static async attack(battleId, attacker, user) {
    const foundBattle = await BattleModel.findById(battleId);

    if (!foundBattle) {
      throw CustomException.notFoundException("Battle was not found");
    }

    const correctTurn = this.checkTurn(foundBattle, attacker);

    if (!correctTurn) {
      throw CustomException.badRequestException("Wrong player's turn");
    }

    const attackersPokemon = PokemonsService.getPokemonById(
      attacker === "bot" ? foundBattle.botPokemon : foundBattle.userPokemon
    );

    const defendersPokemon = PokemonsService.getPokemonById(
      attacker !== "bot" ? foundBattle.botPokemon : foundBattle.userPokemon
    );

    let level = 10;
    let power = 0.5;

    if (attacker === "user") {
      level = user.winsCount;

      const balanceEther = await EthereumService.getAccountBallance(
        user.ethereumIdentifier
      );

      power = balanceEther;
    }

    const damage =
      ((((2 * level) / 5 + 2) *
        power *
        (attackersPokemon.Attack / defendersPokemon.Defense)) /
        50 +
        2) *
      Math.random();

    foundBattle.attacks.push({ damage });

    const hasWon = this.hasWon(defendersPokemon, foundBattle);

    if (hasWon) {
      await BattleModel.findByIdAndDelete(foundBattle._id);

      if (user) {
        await UserModel.findByIdAndUpdate(user._id, { $inc: { winsCount: 1 } });
      }

      return { battle: { ...new BattleDto(foundBattle) }, winner: attacker };
    }

    foundBattle.markModified("attacks");
    await foundBattle.save();

    if (attacker === "user") {
      const botAttackResult = await this.attack(battleId, "bot");

      return botAttackResult;
    }

    return { battle: { ...new BattleDto(foundBattle) }, winner: null };
  }

  static hasWon(defendersPokemon, battle) {
    const damageSum = JSON.parse(JSON.stringify(battle.attacks))
      .reverse()
      .map((attack, index) => {
        if (index % 2 === 0) {
          return attack.damage;
        }

        return 0;
      })
      .reduce((el1, el2) => el1 + el2, 0);

    return damageSum > defendersPokemon.HP;
  }

  static async startBattle(user, pokemonId) {
    await BattleModel.findOneAndDelete({ user: user._id });

    const userPokemon = PokemonsService.getPokemonById(pokemonId);
    const pokemonForBot = this.findPokemonForBot(userPokemon);

    const starts = userPokemon.Speed > pokemonForBot.Speed ? "user" : "bot";

    const newBattle = await BattleModel.create({
      user,
      userPokemon: pokemonId,
      botPokemon: pokemonForBot.id,
      starts,
      attacks: [],
    });

    const attackResult = await this.attack(newBattle._id, starts, user);

    return attackResult;
  }

  static async restoreBattle(user) {
    const restoredBattle = await BattleModel.findOne({ user: user._id });

    if (!restoredBattle) {
      throw CustomException.notFoundException(
        "There is no active battle for user"
      );
    }

    return { battle: { ...new BattleDto(restoredBattle) }, winner: null };
  }
}
