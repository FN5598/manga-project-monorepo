import { Request, Response, NextFunction } from "express";
import * as userRepository from "@repository/user.repository.js";
import { UserRole } from "@models/user.model.js";
import {
  ForbiddenError,
  InternalError,
  UnauthorizedError,
} from "@errors/Error.js";
import { clearAuthCookies, JWT } from "@config/util.js";
import logger from "@config/logger.js";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const access_token = req.cookies.access_token;

    logger.info("Admin middleware run", {
      access_token,
    });

    if (!access_token) throw new UnauthorizedError("Acccess token expired");

    const payload = await JWT.verifyJWTAccessToken(access_token);

    if (!payload) throw new InternalError("Failed to verify payload");

    if (payload.ok !== true) {
      clearAuthCookies(res);
      throw new UnauthorizedError("Invalid access token");
    }

    const user = await userRepository.findUserById(payload.userId!);

    if (!user || !user.role || user.role !== UserRole.ADMIN)
      throw new ForbiddenError("Only admins can access this route");

    next();
  } catch (error) {
    next(error);
  }
}
