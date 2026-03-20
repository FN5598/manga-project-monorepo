import { s3 } from "@config/aws.config.js";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3,
} from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME } from "@config/constants.js";
import logger from "@config/logger.js";

export async function deleteFolderFromS3(prefix: string) {
  try {
    let continuationToken: string | undefined;
    do {
      const listed = await s3.send(
        new ListObjectsV2Command({
          Bucket: S3_BUCKET_NAME,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      const contents = listed.Contents ?? [];
      if (contents.length) {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: S3_BUCKET_NAME,
            Delete: {
              Objects: contents
                .filter((obj): obj is { Key: string } => !!obj.Key)
                .map((obj) => ({ Key: obj.Key })),
            },
          }),
        );
      }
      logger.info("Deleting files", {
        contents,
      });
      continuationToken = listed.IsTruncated
        ? listed.NextContinuationToken
        : undefined;
    } while (continuationToken);
  } catch (error) {
    logger.error("Failed to delete folder from S3", {
      error,
      prefix,
      operation: "deleteFolderFromS3",
    });
  }
}

export async function deleteManyFromS3(keys: string[]) {
  if (!keys.length) return;
  try {
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: S3_BUCKET_NAME,
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
        },
      }),
    );
    logger.info("Deleted multple objects from S3", {
      keys,
      bucket: S3_BUCKET_NAME,
    });
  } catch (error) {
    logger.error("Failed to delete many files from S3", {
      error,
      operation: "deleteManyFromS3",
      keys,
    });
  }
}
