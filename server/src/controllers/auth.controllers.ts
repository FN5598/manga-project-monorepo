import {
  clearAuthCookies,
  JWT,
  setAccessTokenCookie,
  setAuthCookies,
} from "@config/util.js";
import {
  loginSchema,
  logoutSchema,
  refreshAccessTokenSchema,
  signUpSchema,
} from "@validators/auth.validators.js";
import { validateInput } from "@validators/validator.utils.js";
import { Request, Response, NextFunction } from "express";
import * as userRepository from "@repository/user.repository.js";
import argon2 from "argon2";
import mongoose from "mongoose";
import {
  BadRequestError,
  InternalControllerError,
  UnauthorizedError,
} from "@errors/Error.js";
import { UserRole } from "@models/user.model.js";

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
        const createdUser = await userRepository.createUser(
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

        await userRepository.addRefreshToken(
          refreshToken,
          createdUser._id,
          session,
        );

        return {
          accessToken,
          refreshToken,
          userId: createdUser._id.toString(),
          createdUser,
        };
      },
    );

    if (!responsePayload) {
      throw new InternalControllerError(
        "Signup transaction completed without response payload",
      );
    }

    setAuthCookies(
      res,
      responsePayload.accessToken,
      responsePayload.refreshToken,
    );

    return res.status(201).json({
      message: "Successfully signed up",
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
  try {
    const { password, email } = validateInput(loginSchema, req.body);

    const user = await userRepository.findUserByEmail(email);

    const isPasswordMatch = await argon2.verify(user.hashedPassword, password);

    if (!isPasswordMatch) throw new BadRequestError("Incorrect credentials");

    const tokenPayload = {
      userId: user._id,
      role: user.role,
    };

    const accessToken = await JWT.signJWTAccessToken(tokenPayload);
    const refreshToken = await JWT.signJWTRefreshToken(tokenPayload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Successfully logged in",
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
  try {
    const { userId } = validateInput(refreshAccessTokenSchema, req.body);

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      return res.status(200).json({
        message: "Access cookie still exists",
      });
    }

    // ? Avoid making DB call
    let user;
    if (!refreshToken) {
      user = await userRepository.findUserById(userId);
      if (!user.refreshToken) {
        clearAuthCookies(res);

        throw new UnauthorizedError();
      }
    }

    const token = refreshToken || user?.refreshToken;
    const payload = await JWT.verifyJWTRefreshToken(token, userId);
    if (!payload) throw new InternalControllerError("Failed to decrypt jwt");

    if (payload?.ok !== true) {
      clearAuthCookies(res);
      switch (payload.type) {
        case "expired":
          throw new UnauthorizedError("Refresh token expired. Log in again");
        case "invalid":
          throw new UnauthorizedError();
      }
    }

    const signAccessTokenPayload = {
      userId: userId,
      role: user?.role || UserRole.USER,
    };
    const newAccessToken = await JWT.signJWTAccessToken(signAccessTokenPayload);

    setAccessTokenCookie(res, newAccessToken);

    return res.status(200).json({
      message: "Successfully refreshed access token",
      code: "SUCCESS",
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
    const { userId } = validateInput(logoutSchema, req.body);

    const user = await userRepository.findUserById(userId);

    user.refreshToken = undefined;

    await user.save();

    clearAuthCookies(res);

    return res.status(200).json({
      message: "Successfully logged out",
    });
  } catch (error) {
    next(error);
  }
}
