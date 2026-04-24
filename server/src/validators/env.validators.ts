import { InvalidEnvConfiguration } from "@errors/Error.js";
import dotenv from "dotenv";
import { z } from "zod";
import { nodeEnvSchema, nonEmptyString } from "./validator.utils.js";

if (!process.env.MONGO_URI) {
  dotenv.config();
}

const envSchema = z.object({
  AWS_REGION: nonEmptyString,
  S3_ENDPOINT: nonEmptyString.optional(), // Only used for dev
  S3_PUBLIC_ENDPOINT: nonEmptyString.optional(), // Only used for dev
  S3_BUCKET_NAME: nonEmptyString,
  AWS_ACCESS_KEY_ID: nonEmptyString,
  AWS_SECRET_ACCESS_KEY: nonEmptyString,
  S3_FORCE_PATH_STYLE: nonEmptyString.optional(),
  MONGO_URI: nonEmptyString,
  JWT_ACCESS_SECRET: nonEmptyString,
  JWT_REFRESH_TOKEN: nonEmptyString,
  NODE_ENV: nodeEnvSchema,
  PORT: z.coerce.number(),
});

// ! Parse envs before using any, don't use logger since it's an env dependency
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new InvalidEnvConfiguration("Set up envs as shown in env.example.md", {
    message: "Some of env variables are missing",
  });
}

// ? Export global parsed env variable used throuhgout the app
export const ENV = parsed.data;
