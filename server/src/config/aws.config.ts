import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;

if (!region) {
  throw new Error("Missing AWS_REGION in environment");
}

export const s3 = new S3Client({
  region,
});
