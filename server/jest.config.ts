import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,

  // Optimizations
  cache: true,
  cacheDirectory: "node_modules/jest/.cache",
  maxWorkers: "50%",

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },

  setupFiles: ["<rootDir>/src/tests/jest.env.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@config/(.*)\\.js$": "<rootDir>/src/config/$1.ts",
    "^@controllers/(.*)\\.js$": "<rootDir>/src/controllers/$1.ts",
    "^@models/(.*)\\.js$": "<rootDir>/src/models/$1.ts",
    "^@repository/(.*)\\.js$": "<rootDir>/src/repository/$1.ts",
    "^@resolvers/(.*)\\.js$": "<rootDir>/src/resolvers/$1.ts",
    "^@rest/(.*)\\.js$": "<rootDir>/src/routes/rest/$1.ts",
    "^@validators/(.*)\\.js$": "<rootDir>/src/validators/$1.ts",
    "^@errors/(.*)\\.js$": "<rootDir>/src/errors/$1.ts",
    "^@middlewares/(.*)\\.js$": "<rootDir>/src/middlewares/$1.ts",
  },
};

export default config;
