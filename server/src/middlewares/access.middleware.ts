import { Request, Response, NextFunction } from "express";
import { UserRepository } from "@repository/index.js";
import { UserRole } from "@models/user.model.js";
import {
  ForbiddenError,
  InternalError,
  UnauthorizedError,
} from "@errors/Error.js";
import { accessCookieName, clearAuthCookies, JWT } from "@config/util.js";
import logger from "@config/logger.js";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const access_token = req.cookies[accessCookieName];

    logger.info("Admin middleware run");

    if (!access_token) throw new UnauthorizedError("Acccess token expired");

    const payload = await JWT.verifyJWTAccessToken(access_token);

    if (!payload) throw new InternalError("Failed to verify payload");

    if (payload.ok !== true) {
      clearAuthCookies(res);
      throw new UnauthorizedError("Invalid access token");
    }

    const user = await UserRepository.findUserById(payload.userId!);

    if (!user || !user.role || user.role !== UserRole.ADMIN)
      throw new ForbiddenError("Only admins can access this route");

    next();
  } catch (error) {
    next(error);
  }
}
