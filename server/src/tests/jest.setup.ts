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
    errors: { JWTExpired, JWTInvalid },
  };
});

jest.mock("argon2", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("chalk", () => ({
  green: jest.fn(),
  blue: jest.fn(),
  red: jest.fn(),
  yellow: jest.fn(),
  gray: jest.fn(),
}));
