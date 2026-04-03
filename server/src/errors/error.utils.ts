import { Response, Request } from "express";
import { AppError } from "./Error.js";
import logger from "@config/logger.js";

export function errorHandler(error: unknown, req: Request, res: Response) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
  }

  logger.error("Unhandled error", { error });

  return res.status(500).json({
    message: "Something went wrong",
    code: "INTERNAL_SERVER_ERROR",
  });
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}
