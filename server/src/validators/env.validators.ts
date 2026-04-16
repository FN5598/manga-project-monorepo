import { InvalidEnvConfiguration } from "@errors/Error.js";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  AWS_REGION: z.string().trim().min(1),
  S3_BUCKET_NAME: z.string().trim().default("manga-project-bucket-197419742"),
  MONGO_URI: z.string().trim().min(1),
  JWT_ACCESS_SECRET: z.string().trim().min(1),
  JWT_REFRESH_TOKEN: z.string().trim().min(1),
  NODE_ENV: z.string().trim().min(1),
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
