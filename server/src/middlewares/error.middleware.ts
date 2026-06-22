import { Response, Request, NextFunction } from "express";
import { AppError, UnauthorizedError } from "@errors/Error.js";
import logger from "@config/logger.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    const response = {
      message: error.message,
      code: error.code,
      ...(error.errorInfo ? { errorInfo: error.errorInfo } : {}),
    };
    if (error instanceof UnauthorizedError) {
      return res
        .status(error.statusCode)
        .json({ ...response, isLoggedIn: false });
    }
    return res.status(error.statusCode).json(response);
  }

  logger.error("Unhandled error", { error });

  return res.status(500).json({
    message: "Something went wrong",
    code: "INTERNAL_SERVER_ERROR",
  });
}
