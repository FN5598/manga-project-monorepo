import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "@validators/env.validators.js";

const isProd = ENV.NODE_ENV === "production";

export const s3 = new S3Client({
  region: ENV.AWS_REGION,
  endpoint: isProd ? undefined : ENV.S3_PUBLIC_ENDPOINT,
  forcePathStyle: true,
  credentials: isProd
    ? undefined
    : {
        accessKeyId: ENV.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
      },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});
