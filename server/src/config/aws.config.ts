import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "src/validators/env.validators.js";

if (!ENV?.AWS_REGION) {
  throw new Error("Missing AWS_REGION in environment");
}

export const s3 = new S3Client({
  region: ENV.AWS_REGION,
});
