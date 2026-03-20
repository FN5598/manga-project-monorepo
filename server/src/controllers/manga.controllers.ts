import { Request, Response } from "express";
import { S3_BUCKET_NAME } from "@config/constants.js";
import { uploadManga } from "@repository/manga.repository.js";
import logger from "@config/logger.js";
import * as mangaRepository from "@repository/manga.repository.js";
import * as chapterRepository from "@repository/chapter.repository.js";
import * as pagesRepository from "@repository/page.repository.js";

export type UpdateMangaPayload = {
  manga: {
    _id: string;
    previewKey: string;
  };
  chapter: {
    chapterNumber: number;
    title: string;
  };
  pages: {
    imageKey: string;
    fileName: string;
    fileSize: number;
  }[];
};

export async function uploadMangaController(req: Request, res: Response) {
  const { mangaData } = req.body; // Get upload request metadata
  try {
    const uploadedManga = await uploadManga(mangaData);
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

export async function updateMangaController(req: Request, res: Response) {
  try {
    const { chapter, pages, manga }: UpdateMangaPayload = req.body;
    if (!chapter || !manga || !Array.isArray(pages)) {
      return res
        .status(400)
        .json({ message: "Some of required fields are missing!" });
    }

    if (!manga._id) {
      return res.status(400).json({
        message: "Missing manga id",
      });
    }

    if (pages.length === 0) {
      return res.status(400).json({
        message: "Pages array cannot be empty",
      });
    }

    if (!pages[0]?.imageKey) {
      return res.status(400).json({
        message: "First page imageKey is required",
      });
    }
    // 1. Update manga model
    const mangaRes = await mangaRepository.updateManga(manga._id, {
      previewKey: manga.previewKey,
    });
    if (!mangaRes) {
      logger.warn("Manga not found during update", {
        operation: "updateMangaController",
        mangaId: manga._id,
      });

      return res.status(404).json({
        message: "Manga not found",
      });
    }

    logger.debug("Manga updated", {
      operation: "updateMangaController",
      mangaId: manga._id,
      mangaRes,
    });

    const pageCount = pages.length;
    const chapterPrefix =
      pages[0].imageKey.split("/").slice(0, -1).join("/") + "/";

    // 2. Update Chapter info
    const chapterRes = await chapterRepository.createChapter({
      pageCount,
      chapterPrefix,
      ...chapter,
    });
    if (!chapterRes?._id) {
      logger.error("Chapter creation returned invalid result", {
        operation: "updateMangaController",
        mangaId: manga._id,
        chapter,
      });

      return res.status(500).json({
        message: "Failed to create chapter",
      });
    }

    logger.debug("Chapter created", {
      operation: "updateMangaController",
      mangaId: manga._id,
      chapterId: chapterRes._id,
      chapterRes,
    });

    // 3. Fill in the Pages model
    const pagesRes = await pagesRepository.createPages({
      chapterId: chapterRes._id,
      pages,
    });
    logger.debug("Pages created", {
      operation: "updateMangaController",
      mangaId: manga._id,
      chapterId: chapterRes._id,
      pagesCount: Array.isArray(pagesRes) ? pagesRes.length : undefined,
    });

    return res.status(200).json({
      message: "Successfully updated manga",
      mangaId: manga._id,
      chapterId: chapterRes._id,
    });
  } catch (error) {
    logger.error("Failed to update manga", {
      error,
      operation: "updateMangaController",
    });
    throw error;
  }
}
