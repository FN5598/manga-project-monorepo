import {
  accessCookieName,
  clearAuthCookies,
  JWT,
  refreshCookieName,
  setAccessTokenCookie,
  setAuthCookies,
} from "@config/util.js";
import { loginSchema, signUpSchema } from "@validators/auth.validators.js";
import { validateInput } from "@validators/validator.utils.js";
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "@repository/index.js";
import argon2 from "argon2";
import mongoose from "mongoose";
import {
  BadRequestError,
  InternalError,
  UnauthorizedError,
} from "@errors/Error.js";
import { UserRole } from "@models/user.model.js";
import logger from "@config/logger.js";

type SignUpPayload = {
  email: string;
  username: string;
  password: string;
};

export async function signUpController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, username } = validateInput(
      signUpSchema,
      req.body as SignUpPayload,
    );

    const hashedPassword = await argon2.hash(password);

    const responsePayload = await mongoose.connection.transaction(
      async (session) => {
        const createdUser = await UserRepository.createUser(
          {
            email,
            username,
            hashedPassword,
          },
          session,
        );

        const tokenPayload = {
          userId: createdUser._id.toString(),
          role: createdUser.role,
        };

        const accessToken = await JWT.signJWTAccessToken(tokenPayload);
        const refreshToken = await JWT.signJWTRefreshToken(tokenPayload);

        await UserRepository.updateRefreshToken(
          refreshToken,
          createdUser._id,
          session,
        );

        return {
          accessToken,
          refreshToken,
          createdUser,
        };
      },
    );

    if (!responsePayload) {
      throw new InternalError(
        "Signup transaction completed without response payload",
      );
    }

    setAuthCookies(
      res,
      responsePayload.accessToken,
      responsePayload.refreshToken,
    );

    logger.info("Sign Up controller called", {
      email,
      username,
    });
    return res.status(201).json({
      data: {
        message: "Successfully signed up",
        user: responsePayload.createdUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Logging in user");
  try {
    const { password, email } = validateInput(loginSchema, req.body);

    const user = await UserRepository.findUserByEmail(email, true);

    const isPasswordMatch = await argon2.verify(user.hashedPassword, password);

    if (!isPasswordMatch) throw new BadRequestError("Incorrect credentials");

    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const accessToken = await JWT.signJWTAccessToken(tokenPayload);
    const refreshToken = await JWT.signJWTRefreshToken(tokenPayload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      data: {
        message: "Successfully logged in",
        isLoggedIn: true,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshAccessTokenController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info("Refreshing token");
  try {
    const accessToken = req.cookies[accessCookieName];
    const refreshToken = req.cookies[refreshCookieName];

    if (accessToken) {
      const accessTokenPayload = await JWT.verifyJWTAccessToken(accessToken);

      if (accessTokenPayload.ok !== true) {
        clearAuthCookies(res);
        throw new UnauthorizedError("Invalid access token");
      }

      return res.status(200).json({
        data: {
          message: "Access cookie still exists",
          isLoggedIn: true,
          userId: accessTokenPayload.userId,
          role: accessTokenPayload.role,
        },
      });
    }

    const payload = await JWT.verifyJWTRefreshToken(refreshToken);
    if (!payload) throw new InternalError("Failed to decrypt jwt");

    if (payload?.ok !== true) {
      clearAuthCookies(res);
      switch (payload.type) {
        case "expired":
          throw new UnauthorizedError("Refresh token expired.");
        case "invalid":
          throw new UnauthorizedError("Invalid refresh token");
        default:
          throw new UnauthorizedError("Failed to verify refresh token");
      }
    }

    const role =
      payload.role === UserRole.ADMIN ||
      payload.role === UserRole.EDITOR ||
      payload.role === UserRole.USER
        ? payload.role
        : UserRole.USER;

    const signAccessTokenPayload = {
      userId: payload.userId,
      role,
    };
    const newAccessToken = await JWT.signJWTAccessToken(signAccessTokenPayload);

    setAccessTokenCookie(res, newAccessToken);

    logger.info("refresh access token controller called", {
      userId: payload.userId,
    });
    return res.status(200).json({
      data: {
        message: "Successfully refreshed access token",
        isLoggedIn: true,
        userId: payload.userId,
        role: signAccessTokenPayload.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies[accessCookieName];
    const refreshToken = req.cookies[refreshCookieName];
    if (!accessToken && !refreshToken)
      throw new UnauthorizedError("No credentials");

    let payload;
    if (accessToken) {
      payload = await JWT.verifyJWTAccessToken(accessToken);
    }
    if (!accessToken) {
      payload = await JWT.verifyJWTRefreshToken(refreshToken);
    }
    if (!payload) throw new UnauthorizedError("Failed to decrypt jwt");
    if (payload?.ok !== true) {
      clearAuthCookies(res);
      switch (payload.type) {
        case "expired":
          throw new UnauthorizedError("Refresh token expired.");
        case "invalid":
          throw new UnauthorizedError("Invalid refresh token");
        default:
          throw new UnauthorizedError("Failed to verify refresh token");
      }
    }

    await UserRepository.updateRefreshToken(undefined, payload.userId);

    clearAuthCookies(res);

    logger.info("Logout controller called", {
      userId: payload.userId,
    });
    return res.status(200).json({
      data: {
        message: "Successfully logged out",
      },
    });
  } catch (error) {
    next(error);
  }
}
