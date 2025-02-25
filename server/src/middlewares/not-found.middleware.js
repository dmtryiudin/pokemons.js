import { CustomException } from "../utils/custom-exception.util.js";

export const notFoundMiddleware = (req, res, next) => {
  const notFoundException = CustomException.notFoundException(
    "Route was not found"
  );

  res
    .status(notFoundException.code)
    .json(CustomException.getJSONFromException(notFoundException));
};
