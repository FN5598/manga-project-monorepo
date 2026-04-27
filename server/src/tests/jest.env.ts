import "reflect-metadata";

const TEST_ENV = {
  MONGO_URI: "mongodb://mongodb:27017/db?replicaSet=rs0",
  JWT_ACCESS_SECRET: "development-jwt-access-secret",
  JWT_REFRESH_TOKEN: "development-jwt-refresh-token",
  NODE_ENV: "development",
  PORT: "4000",
  AWS_REGION: "us-east-1",
  S3_ENDPOINT: "http://minio:9000",
  S3_PUBLIC_ENDPOINT: "http://localhost:9000",
  S3_BUCKET_NAME: "manga-project-bucket",
  AWS_ACCESS_KEY_ID: "minioadmin",
  AWS_SECRET_ACCESS_KEY: "minioadmin",
  LOGS: "false",
};

Object.assign(process.env, TEST_ENV);
