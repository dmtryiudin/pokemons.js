import "dotenv/config";
import express from "express";
import { exceptionsMiddleware } from "./middlewares/exceptions.middleware.js";
import { EnvService } from "./services/env.service.js";
import mongoose from "mongoose";
import { authRouter } from "./routers/auth.router.js";
import bodyParser from "body-parser";
import cors from "cors";
import { PokemonsService } from "./services/pokemons.service.js";
import { pokemonsRouter } from "./routers/pokemons.router.js";
import { battleRouter } from "./routers/battle.router.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

const main = async () => {
  EnvService.checkValues();
  console.log(`.env values: ${JSON.stringify(EnvService.getValues())}`);

  const fetchedPokemonsCount = await PokemonsService.prefetchPokemons();
  console.log(`Fetched ${fetchedPokemonsCount} pokemons`);

  const fetchedPokemonsEffectivenessCount =
    await PokemonsService.prefetchPokemonsIneffectiveness();
  console.log(
    `Fetched ${fetchedPokemonsEffectivenessCount} pokemon effectiveness data items`
  );

  await mongoose.connect(EnvService.getValues().DB_CONNECTION_URL);
  console.log(`Connected to MongoDB`);

  const app = express();

  const PORT = EnvService.getValues().PORT;

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/auth", authRouter);
  app.use("/pokemons", pokemonsRouter);
  app.use("/battle", battleRouter);
  app.use(exceptionsMiddleware);
  app.use(notFoundMiddleware);

  app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

main();
