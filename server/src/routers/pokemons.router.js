import { Router } from "express";
import { PokemonsController } from "../controllers/pokemons.controller.js";
import { jwtMiddleware } from "../middlewares/jwt.middleware.js";

export const pokemonsRouter = Router();

pokemonsRouter.get("/", jwtMiddleware, PokemonsController.getPokemonsList);
