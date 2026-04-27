jest.mock("jose", () => {
  class JWTExpired extends Error {
    payload?: unknown;
  }

  class JWTInvalid extends Error {}

  return {
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setSubject: jest.fn().mockReturnThis(),
      setIssuer: jest.fn().mockReturnThis(),
      setAudience: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue("signed-token"),
    })),
    jwtVerify: jest.fn(),
    errors: {
      JWTExpired,
      JWTInvalid,
    },
  };
});

import {
  JWT,
  clearAuthCookies,
  getDefaultPagination,
  setAccessTokenCookie,
  setAuthCookies,
} from "@config/util.js";
import { UserRole } from "@models/user.model.js";
import { jwtVerify, SignJWT } from "jose";

const mockedJwtVerify = jest.mocked(jwtVerify);
const mockedSignJWT = jest.mocked(SignJWT);

describe("util config helpers", () => {
  it("caps pagination limits and supplies defaults", () => {
    expect(getDefaultPagination()).toEqual({ page: 1, limit: 100 });
    expect(getDefaultPagination({ page: 3, limit: 20 })).toEqual({
      page: 3,
      limit: 20,
    });
    expect(getDefaultPagination({ page: 2, limit: 500 })).toEqual({
      page: 2,
      limit: 100,
    });
  });

  it("sets access token cookie options", () => {
    const res = { cookie: jest.fn() };

    setAccessTokenCookie(res as never, "access-token");

    expect(res.cookie).toHaveBeenCalledWith("access_token", "access-token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });
  });

  it("sets and clears auth cookies", () => {
    const res = { cookie: jest.fn(), clearCookie: jest.fn() };

    setAuthCookies(res as never, "access-token", "refresh-token");
    clearAuthCookies(res as never);

    expect(res.cookie).toHaveBeenNthCalledWith(
      1,
      "access_token",
      "access-token",
      expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
    );
    expect(res.cookie).toHaveBeenNthCalledWith(
      2,
      "refresh_token",
      "refresh-token",
      expect.objectContaining({ httpOnly: true, sameSite: "strict" }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      "access_token",
      expect.objectContaining({ path: "/" }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      "refresh_token",
      expect.objectContaining({ path: "/auth/refresh" }),
    );
  });

  it("signs and verifies access tokens", async () => {
    mockedJwtVerify.mockResolvedValue({
      payload: {
        sub: "user-1",
      },
    } as never);

    const token = await JWT.signJWTAccessToken({
      userId: "user-1",
      role: UserRole.USER,
    });

    const result = await JWT.verifyJWTAccessToken(token);

    expect(token).toBe("signed-token");
    expect(mockedSignJWT).toHaveBeenCalledWith({
      userId: "user-1",
      role: UserRole.USER,
    });
    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        userId: "user-1",
      }),
    );
  });

  it("reports invalid access tokens without throwing", async () => {
    mockedJwtVerify.mockRejectedValueOnce(new Error("bad token"));

    await expect(JWT.verifyJWTAccessToken("not-a-jwt")).resolves.toEqual(
      expect.objectContaining({
        ok: false,
        type: "unknown",
      }),
    );
  });
});
