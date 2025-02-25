import { AuthService } from "../services/auth.service.js";
import { z } from "zod";
import { CustomException } from "../utils/custom-exception.util.js";

export class AuthController {
  static generateOneTimeString(req, res, next) {
    try {
      const data = AuthService.generateOneTimeString();

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  }

  static async auth(req, res, next) {
    try {
      const schema = z.object({
        originalValue: z.string(),
        valueToSign: z.string(),
        signedValue: z.string(),
        signer: z.string(),
      });

      const validationResult = schema.safeParse(req.body);

      if (validationResult.error) {
        throw CustomException.badRequestException(
          "Validation error",
          validationResult.error?.errors
        );
      }

      const { originalValue, valueToSign, signedValue, signer } = req.body;

      const data = await AuthService.auth(
        originalValue,
        valueToSign,
        signedValue,
        signer
      );

      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }
}
