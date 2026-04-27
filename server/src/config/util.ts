import { SignJWT, errors, jwtVerify } from "jose";
import { ENV } from "@validators/env.validators.js";
import { UserRole } from "@models/user.model.js";
import type { Response } from "express";
import { PaginationInput } from "@resolvers/resolver.utils.js";
import { DEFAULT_PAGINATION } from "./constants.js";

type SignJWTPayload = {
  userId: string;
  role: UserRole;
  data?: Record<string, unknown>;
};

type TokenType = "access" | "refresh";

const ISSUER = "manga-auth";
const ACCESS_AUDIENCE = "manga-access";
const REFRESH_AUDIENCE = "manga-refresh";
const isProd = ENV.NODE_ENV === "production";

const accessSecret = new TextEncoder().encode(ENV.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(ENV.JWT_REFRESH_TOKEN);

const accessCookieName = isProd ? "__Host-access_token" : "access_token";
const refreshCookieName = isProd ? "__Host-refresh_token" : "refresh_token";

export const JWT = {
  signJWT: async (
    payload: SignJWTPayload,
    options: { expiresIn: string; tokenType: TokenType },
  ) => {
    const isAccessToken = options.tokenType === "access";
    const secret = isAccessToken ? accessSecret : refreshSecret;
    const audience = isAccessToken ? ACCESS_AUDIENCE : REFRESH_AUDIENCE;

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(payload.userId)
      .setIssuer(ISSUER)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(secret);

    return token;
  },

  async signJWTAccessToken(payload: SignJWTPayload) {
    return JWT.signJWT(payload, {
      expiresIn: "15m",
      tokenType: "access",
    });
  },

  async signJWTRefreshToken(payload: SignJWTPayload) {
    return JWT.signJWT(payload, {
      expiresIn: "7d",
      tokenType: "refresh",
    });
  },

  async verifyJWTAccessToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, accessSecret, {
        issuer: ISSUER,
        audience: ACCESS_AUDIENCE,
        algorithms: ["HS256"],
        typ: "JWT",
        maxTokenAge: "15m",
      });

      return { ok: true as const, userId: payload.sub as string, payload };
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        return {
          ok: false as const,
          type: "expired" as const,
          message: error.message,
          payload: error.payload,
        };
      }
      if (error instanceof errors.JWTInvalid) {
        return {
          ok: false as const,
          type: "invalid" as const,
          message: error.message,
        };
      }

      return {
        ok: false as const,
        type: "unknown" as const,
        message: "Failed to verify access token",
      };
    }
  },

  async verifyJWTRefreshToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, refreshSecret, {
        issuer: ISSUER,
        audience: REFRESH_AUDIENCE,
        algorithms: ["HS256"],
        typ: "JWT",
        maxTokenAge: "7d",
      });

      return { ok: true as const, userId: payload.aud, payload };
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        return {
          ok: false as const,
          type: "expired" as const,
          message: error.message,
          payload: error.payload,
        };
      }
      if (error instanceof errors.JWTInvalid) {
        return {
          ok: false as const,
          type: "invalid" as const,
          message: error.message,
        };
      }
      return {
        ok: false as const,
        type: "unknown" as const,
        message: "Failed to verify access token",
      };
    }
  },
};

export function setAccessTokenCookie(res: Response, accessToken: string) {
  res.cookie(accessCookieName, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie(accessCookieName, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie(refreshCookieName, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(accessCookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/auth/refresh",
  });
}

export function getDefaultPagination(
  pagination?: PaginationInput,
): Required<PaginationInput> {
  const page = pagination?.page ?? DEFAULT_PAGINATION.page;
  const limit = pagination?.limit
    ? pagination.limit > DEFAULT_PAGINATION.limit
      ? DEFAULT_PAGINATION.limit
      : pagination.limit
    : DEFAULT_PAGINATION.limit;

  return { page, limit };
}
