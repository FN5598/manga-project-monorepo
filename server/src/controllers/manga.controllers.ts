import { Request, Response } from "express";
import { S3_BUCKET_NAME } from "@config/constants.js";
import { uploadManga } from "@repository/manga.repository.js";
import logger from "@config/logger.js";
import { Manga } from "@models/manga.model.js";

export async function uploadMangaController(req: Request, res: Response) {
  const { mangaData } = req.body; // Get upload request metadata
  const data = {
    ...mangaData,
    chapterImagesBucket: `${S3_BUCKET_NAME}/mangas/${mangaData.title}`,
  };
  try {
    const uploadedManga = await uploadManga(data);
    logger.debug("uploadMangaController called", {
      data: uploadedManga,
    });
    return res.status(201).json({
      message: "Uploaded manga successfully",
      mangaData: uploadedManga,
    });
  } catch (error) {
    logger.error("Failed to upload manga to DB", {
      error,
      operation: "uploadMangaController",
    });
    throw error;
  }
}
