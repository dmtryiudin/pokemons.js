import { CustomException } from "../utils/custom-exception.util.js";

export const exceptionsMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
  }

  console.log(err);

  if (err instanceof CustomException) {
    res.status(err.code).json(CustomException.getJSONFromException(err));
  }

  const internalServerErrorException =
    CustomException.internalServerErrorException();

  res
    .status(internalServerErrorException.code)
    .json(CustomException.getJSONFromException(internalServerErrorException));
};
