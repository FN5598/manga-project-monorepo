import logger from "@config/logger.js";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  AWS_REGION: z.string().trim().min(1),
  S3_BUCKET_NAME: z.string().trim().default("manga-project-bucket-197419742"),
  MONGO_URI: z.string().trim().min(1),
  JWT_ACCESS_SECRET: z.string().trim().min(1),
  JWT_REFRESH_TOKEN: z.string().trim().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => ({
    code: issue.code,
    path: issue.path,
    input: issue.input,
    message: issue.message,
  }));
  logger.error("Invalid environment variables", {
    issues,
  });
  throw new Error();
}

export const ENV = parsed.data;
