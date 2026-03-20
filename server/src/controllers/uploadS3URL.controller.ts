import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_BUCKET_NAME, MAX_PREVIEW_SIZE } from "@config/constants.js";
import { randomUUID } from "crypto";
import { s3 } from "@config/aws.config.js";
import logger from "@config/logger.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type AllowedImageUploadTypes = "image/jpeg" | "image/png" | "image/webp";

export enum FileType {
  preview = "PREVIEW",
  page = "PAGE",
}

type ChapterUpload = {
  fileName: string;
  contentType: AllowedImageUploadTypes;
  size: number;
  type: FileType;
};

type UploadImageData = {
  fileName: string;
  contentType?: AllowedImageUploadTypes;
  mangaId: string;
  mangaChapter: number;
  size: number;
  type: FileType;
  chapters: ChapterUpload[];
};

export function sanitizeS3PathPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function getExtension(fileName?: string): string | null {
  if (!fileName) return null;

  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === fileName.length - 1) return null;

  return fileName.slice(lastDot + 1).toLowerCase();
}

function getPrefix(type: FileType) {
  switch (type) {
    case FileType.preview:
      return "previews";
    case FileType.page:
      return "mangas";
    default:
      return "uploads";
  }
}

export async function createS3UploadURL(req: Request, res: Response) {
  const {
    fileName,
    contentType,
    mangaId,
    mangaChapter,
    size,
    type,
    chapters,
  }: UploadImageData = req.body;

  if (!fileName || !contentType || !mangaId) {
    logger.debug("Missing required fields", {
      fileName: !!fileName,
      contentType: !!contentType,
      mangaTitle: !!mangaId,
    });
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!Array.isArray(chapters)) {
    return res.status(400).json({ message: "chapters must be an array" });
  }

  if (!ALLOWED_TYPES.has(contentType)) {
    logger.debug("Unsupported preview file type", { fileType: contentType });
    return res.status(400).json({ message: "Unsupported preview file type" });
  }

  if (type === FileType.preview && size > MAX_PREVIEW_SIZE) {
    return res.status(413).json({ message: "Preview file too large" });
  }

  for (const chapter of chapters) {
    if (!chapter.fileName || !chapter.contentType || !chapter.type) {
      return res.status(400).json({ message: "Invalid chapter data" });
    }

    if (!ALLOWED_TYPES.has(chapter.contentType)) {
      logger.debug("Unsupported chapter file type", {
        fileType: chapter.contentType,
        fileName: chapter.fileName,
      });
      return res.status(400).json({
        message: `Unsupported file type for chapter ${chapter.fileName}`,
      });
    }
  }

  const previewExt = getExtension(fileName) || "bin";
  const previewKey = `${getPrefix(FileType.preview)}/${mangaId}/${randomUUID()}.${previewExt}`;

  try {
    const previewCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: previewKey,
      ContentType: contentType,
    });

    const previewUploadUrl = await getSignedUrl(s3, previewCommand, {
      expiresIn: 60,
    });

    const chapterUploads = await Promise.all(
      chapters.map(async (chapter) => {
        const chapterExt = getExtension(chapter.fileName);
        const chapterKey = `${getPrefix(chapter.type)}/${mangaId}/${mangaChapter}/${randomUUID()}.${chapterExt}`;

        const chapterCommand = new PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: chapterKey,
          ContentType: chapter.contentType,
        });

        const chapterUploadUrl = await getSignedUrl(s3, chapterCommand, {
          expiresIn: 60,
        });

        return {
          fileName: chapter.fileName,
          key: chapterKey,
          uploadUrl: chapterUploadUrl,
          contentType: chapter.contentType,
        };
      }),
    );

    logger.debug("Created S3 upload URLs", {
      previewKey,
      chapterCount: chapterUploads.length,
    });

    return res.status(200).json({
      message: "Successfully generated upload URLs",
      preview: {
        fileName,
        key: previewKey,
        uploadUrl: previewUploadUrl,
        contentType,
      },
      chapters: chapterUploads,
    });
  } catch (error) {
    logger.error("Failed to create S3 upload URLs", {
      error,
      operation: "createS3UploadURL",
    });

    return res.status(500).json({ message: "Failed to create S3 upload URLs" });
  }
}
