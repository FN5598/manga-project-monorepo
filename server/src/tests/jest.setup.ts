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

const mockedEnv = {
  MONGO_URI: "mongodb://mongodb:27017/db?replicaSet=rs0",
  JWT_ACCESS_SECRET: "development-jwt-access-secret",
  JWT_REFRESH_TOKEN: "development-jwt-refresh-token",
  NODE_ENV: "development",
  PORT: 4000,
  AWS_REGION: "us-east-1",
  S3_ENDPOINT: "http://minio:9000",
  S3_PUBLIC_ENDPOINT: "http://localhost:9000",
  S3_BUCKET_NAME: "manga-project-bucket",
  AWS_ACCESS_KEY_ID: "minioadmin",
  AWS_SECRET_ACCESS_KEY: "minioadmin",
  S3_FORCE_PATH_STYLE: true,
};

jest.mock("@validators/env.validators.js", () => ({
  ENV: mockedEnv,
  validateEnvironmentVariables: jest.fn().mockResolvedValue(mockedEnv),
}));
