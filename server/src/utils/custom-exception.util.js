export class CustomException extends Error {
  constructor(message, code, ctx) {
    super(message);
    this.code = code;
    this.ctx = ctx;
  }

  static unauthorizedException(message) {
    return new CustomException(message, 401);
  }

  static forbiddenException(message) {
    return new CustomException(message, 403);
  }

  static notFoundException(message) {
    return new CustomException(message, 404);
  }

  static badRequestException(message, ctx) {
    return new CustomException(message, 400, ctx);
  }

  static internalServerErrorException() {
    return new CustomException("Unknown error", 500);
  }

  static getJSONFromException(exception) {
    return {
      code: exception.code,
      message: exception.message,
      ctx: exception.ctx,
    };
  }
}
