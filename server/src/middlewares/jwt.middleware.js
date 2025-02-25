import { CustomException } from "../utils/custom-exception.util.js";
import { AuthService } from "../services/auth.service.js";

export const jwtMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    const token = authorization?.split(" ")[1];

    if (!token) {
      throw CustomException.unauthorizedException("Token is invalid");
    }

    const user = await AuthService.verifyJwtToken(token);

    req.user = user;

    next();
  } catch (e) {
    res.status(e.code).json(CustomException.getJSONFromException(e));
  }
};
