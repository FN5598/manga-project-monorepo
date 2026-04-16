import { Request, Response, NextFunction } from "express";
import * as userRepository from "@repository/user.repository.js";
import { UserRole } from "@models/user.model.js";
import { ForbiddenError, UnauthorizedError } from "@errors/Error.js";
import { JWT } from "@config/util.js";
import logger from "@config/logger.js";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const access_token = req.cookies.access_token;
    const { userId } = req.body;

    logger.info("Admin middleware run", {
      access_token,
      userId,
    });

    if (!access_token) throw new UnauthorizedError("Acccess token expired");
    if (!userId) throw new UnauthorizedError("Users cannot use admin routes");

    const user = await userRepository.findUserById(userId);
    if (user.role !== UserRole.ADMIN)
      throw new ForbiddenError("Only admins can access this route");

    await JWT.verifyJWTAccessToken(access_token, userId);
    next();
  } catch (error) {
    next(error);
  }
}
