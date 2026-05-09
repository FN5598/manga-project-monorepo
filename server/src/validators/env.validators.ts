import { getSecret } from "@aws-lambda-powertools/parameters/secrets";
import { InvalidEnvConfiguration } from "@errors/Error.js";
import dotenv from "dotenv";
import { z } from "zod";
import { nonEmptyString } from "./validator.utils.js";

if (!process.env.MONGO_URI) {
  dotenv.config();
}

const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
const AWS_REGION = process.env.AWS_REGION ?? "eu-central-1";
process.env.AWS_REGION = AWS_REGION;

const baseSchema = z.object({
  AWS_REGION: nonEmptyString.default("eu-central-1"),
  S3_BUCKET_NAME: nonEmptyString,
  S3_PUBLIC_ENDPOINT: nonEmptyString,
  JWT_ACCESS_SECRET: nonEmptyString.default("change-jwt-access-secret"),
  JWT_REFRESH_TOKEN: nonEmptyString.default("change-refresh-secret"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: nonEmptyString,
  CORS_ORIGIN: nonEmptyString.default("http://localhost:5173"),
});

const developmentSchema = baseSchema.extend({
  NODE_ENV: z.literal("development").default("development"),
  AWS_ACCESS_KEY_ID: nonEmptyString,
  AWS_SECRET_ACCESS_KEY: nonEmptyString,
  S3_ENDPOINT: nonEmptyString,
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
});

const productionSchema = baseSchema.extend({
  NODE_ENV: z.literal("production").default("production"),

  S3_ENDPOINT: nonEmptyString.optional(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().optional(),
});

const envSchema = z.discriminatedUnion("NODE_ENV", [
  developmentSchema,
  productionSchema,
]);

export type Env = z.infer<typeof envSchema>;

function assertObject(
  value: unknown,
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new InvalidEnvConfiguration(
      "Secrets Manager value must be a JSON object",
    );
  }
}

async function loadProductionSecrets(): Promise<Record<string, unknown>> {
  const secretsArn = process.env.SECRET_MANAGER_ARN;

  if (!secretsArn) {
    throw new InvalidEnvConfiguration(
      "SECRET_MANAGER_ARN is required in production",
    );
  }

  const secrets = await getSecret(secretsArn, {
    transform: "json",
    maxAge: ONE_WEEK_IN_SECONDS,
  });

  assertObject(secrets);

  return secrets;
}

async function loadEnvironmentVariables(): Promise<unknown> {
  const nodeEnv = process.env.NODE_ENV ?? "development";

  if (nodeEnv === "development") {
    return {
      ...process.env,
      NODE_ENV: "development",
    };
  }

  if (nodeEnv === "production") {
    const secrets = await loadProductionSecrets();

    return {
      ...secrets,
      NODE_ENV: "production",
    };
  }

  throw new InvalidEnvConfiguration(`Unsupported NODE_ENV: ${nodeEnv}`);
}

export async function validateEnvironmentVariables(): Promise<Env> {
  const rawEnv = await loadEnvironmentVariables();
  const parsedEnv = envSchema.safeParse(rawEnv);

  if (!parsedEnv.success) {
    throw new InvalidEnvConfiguration(parsedEnv.error.message);
  }

  return parsedEnv.data;
}

export const ENV = await validateEnvironmentVariables();
