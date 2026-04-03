import { Request, Response } from "express";
import { uploadManga } from "@repository/manga.repository.js";
import logger from "@config/logger.js";
import * as mangaRepository from "@repository/manga.repository.js";
import * as chapterRepository from "@repository/chapter.repository.js";
import * as pagesRepository from "@repository/page.repository.js";
import { validateInput } from "src/validators/validator.utils.js";
import {
  updateMangaSchema,
  uploadMangaSchema,
} from "src/validators/manga.validators.js";
import { errorHandler } from "@errors/error.utils.js";
import mongoose from "mongoose";
import { InternalControllerError } from "@errors/Error.js";

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
  try {
    const { mangaData } = validateInput(uploadMangaSchema, req.body);

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
    const { chapter, pages, manga } = validateInput(
      updateMangaSchema,
      req.body,
    );

    const transactionData = await mongoose.connection.transaction(
      async (session) => {
        // 1. Update manga model
        const updatedManga = await mangaRepository.updateManga(
          manga._id,
          {
            previewKey: manga.previewKey,
          },
          session,
        );

        logger.debug("Manga updated", {
          operation: "updateMangaController",
          updatedManga,
        });

        const pageCount = pages.length;
        const chapterPrefix =
          pages[0].imageKey.split("/").slice(0, -1).join("/") + "/";

        // 2. Update Chapter info
        const createdChapter = await chapterRepository.createChapter(
          {
            mangaId: updatedManga._id,
            pageCount,
            chapterPrefix,
            ...chapter,
          },
          session,
        );

        logger.debug("Chapter created", {
          operation: "updateMangaController",
          createdChapter,
        });

        // 3. Fill in the Pages model
        const pagesRes = await pagesRepository.createPages(
          {
            chapterId: createdChapter._id,
            pages,
          },
          session,
        );
        logger.debug("Pages created", {
          operation: "updateMangaController",
          pagesCount: Array.isArray(pagesRes) ? pagesRes.length : undefined,
        });

        return { chapterId: createdChapter._id };
      },
    );

    if (!transactionData)
      throw new InternalControllerError(
        "Update manga transaction completed without response payload",
      );

    return res.status(200).json({
      message: "Successfully updated manga",
      mangaId: manga._id,
      chapterId: transactionData.chapterId,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
}
