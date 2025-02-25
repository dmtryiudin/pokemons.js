import { BattleController } from "../controllers/battle.controller.js";
import { Router } from "express";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";

export const battleRouter = Router();

battleRouter.post(
  "/start/:pokemonId",
  jwtMiddleware,
  BattleController.startBattle
);
battleRouter.post("/attack", jwtMiddleware, BattleController.attack);
battleRouter.get("/restore", jwtMiddleware, BattleController.restoreBattle);
