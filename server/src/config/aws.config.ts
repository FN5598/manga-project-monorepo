import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "@validators/env.validators.js";

export const s3 = new S3Client({
  region: ENV.AWS_REGION,
});
