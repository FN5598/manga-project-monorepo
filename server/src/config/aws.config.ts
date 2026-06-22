import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "@validators/env.validators.js";

const sharedConfig = {
  region: ENV.AWS_REGION,
  requestChecksumCalculation: "WHEN_REQUIRED" as const,
  responseChecksumValidation: "WHEN_REQUIRED" as const,
};

export const s3 =
  ENV.NODE_ENV === "production"
    ? new S3Client({
        ...sharedConfig,
        endpoint: ENV.S3_ENDPOINT,
        forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
      })
    : new S3Client({
        ...sharedConfig,
        endpoint: ENV.S3_PUBLIC_ENDPOINT,
        forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
        credentials: {
          accessKeyId: ENV.AWS_ACCESS_KEY_ID,
          secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
        },
      });
