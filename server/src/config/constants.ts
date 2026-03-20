import "dotenv/config";
// Pagination constants and types
export type Pagination = {
  page: number;
  limit: number;
};

export const DEFAULT_PAGINATION: Required<Pagination> = {
  page: 1,
  limit: 10,
};

// AWS Specific constants
export const AWS_REGION = process.env.AWS_REGION;
export const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || "manga-project-bucket-197419742";

export const MAX_PREVIEW_SIZE = 500 * 1024; // 500KB
