import { Response, Request, NextFunction } from "express";
import { AppError } from "@errors/Error.js";
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
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      ...(error.errorInfo ? { errorInfo: error.errorInfo } : {}),
    });
  }

  logger.error("Unhandled error", { error });

  return res.status(500).json({
    message: "Something went wrong",
    code: "INTERNAL_SERVER_ERROR",
  });
}
