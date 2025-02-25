import { BattleService } from "../services/battle.service.js";
import { z } from "zod";
import { CustomException } from "../utils/custom-exception.util.js";

export class BattleController {
  static async startBattle(req, res, next) {
    try {
      const pokemonId = +req.params.pokemonId;

      const schema = z.number();

      const validationResult = schema.safeParse(pokemonId);

      if (validationResult.error) {
        throw CustomException.badRequestException(
          "Validation error",
          validationResult.error?.errors
        );
      }

      const data = await BattleService.startBattle(req.user, pokemonId);

      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async attack(req, res, next) {
    try {
      const restoredBattle = await BattleService.restoreBattle(req.user);

      const attackRes = await BattleService.attack(
        restoredBattle.battle.id,
        "user",
        req.user
      );
      res.status(201).json(attackRes);
    } catch (e) {
      next(e);
    }
  }

  static async restoreBattle(req, res, next) {
    try {
      const attackRes = await BattleService.restoreBattle(req.user);
      res.status(200).json(attackRes);
    } catch (e) {
      next(e);
    }
  }
}
