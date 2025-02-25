import { PokemonsService } from "../services/pokemons.service.js";
import { z } from "zod";
import { CustomException } from "../utils/custom-exception.util.js";

export class PokemonsController {
  static async getPokemonsList(req, res, next) {
    try {
      const queryParams = req.query;

      const transformedQueryParams = {
        page: queryParams.page ? +queryParams.page : undefined,
        limit: queryParams.limit ? +queryParams.limit : undefined,
      };

      const schema = z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
      });

      const validationResult = schema.safeParse(transformedQueryParams);

      if (validationResult.error) {
        throw CustomException.badRequestException(
          "Validation error",
          validationResult.error?.errors
        );
      }

      const pokemonsList = PokemonsService.getPokemonsList(
        transformedQueryParams.page,
        transformedQueryParams.limit
      );

      res.status(200).json(pokemonsList);
    } catch (e) {
      next(e);
    }
  }
}
