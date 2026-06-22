import { InternalError, UnauthorizedError } from "@errors/Error.js";
import { Response, Request, NextFunction } from "express";
import { UserRepository } from "@repository/index.js";
import { accessCookieName, JWT, refreshCookieName } from "@config/util.js";

export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.body;
  const accessToken = req.cookies[accessCookieName];
  const refreshToken = req.cookies[refreshCookieName];
  try {
    if (!userId && !accessToken && !refreshToken)
      throw new UnauthorizedError("No way to identificate user. Please log in");
    let id: string = userId;

    if (!userId) {
      if (accessToken) {
        const accessTokenPayload = await JWT.verifyJWTAccessToken(accessToken);
        if (accessTokenPayload.ok === true) {
          id = accessTokenPayload.userId;
        }
      } else if (refreshToken && !accessToken) {
        const refreshTokenPayload =
          await JWT.verifyJWTRefreshToken(refreshToken);
        if (refreshTokenPayload.ok === true) {
          id = refreshTokenPayload.userId;
        }
      }
    }
    if (!id) throw new InternalError("Failed to validate current user");

    const user = await UserRepository.findUserById(id);

    return res.status(200).json({
      user,
    });
  } catch (e) {
    next(e);
  }
}
