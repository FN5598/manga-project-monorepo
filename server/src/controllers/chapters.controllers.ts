import logger from "@config/logger.js";
import { Response, Request } from "express";
import * as chapterRepository from "@repository/chapter.repository.js";
import * as pageRepository from "@repository/page.repository.js";
import { errorHandler } from "@errors/error.utils.js";
import { validateInput } from "@validators/validator.utils.js";
import * as chapterValidator from "@validators/chapter.validators.js";
import mongoose from "mongoose";

export type addChapterPayload = {
  mangaId: string;
  chapterTitle: string;
  chapterNumber: number;
  pages: {
    imageKey: string;
    fileName: string;
    fileSize: number;
  }[];
};

export async function addChapterToMangaController(req: Request, res: Response) {
  const session = await mongoose.startSession();
  try {
    const { mangaId, chapterTitle, chapterNumber, pages } = validateInput(
      chapterValidator.addChapterToMangaSchema,
      req.body,
    );

    const chapterPrefix =
      pages[0].imageKey.split("/").slice(0, -1).join("/") + "/";

    const createChapterPayload: chapterRepository.createChapterPayload = {
      mangaId,
      chapterNumber,
      title: chapterTitle,
      chapterPrefix,
      pageCount: pages.length,
    };

    const chapterRes = await chapterRepository.createChapter(
      createChapterPayload,
      session,
    );

    const createPagePayload: pageRepository.CreatePagesPayload = {
      chapterId: chapterRes._id,
      pages: pages.map((page) => ({
        imageKey: page.imageKey,
        fileSize: page.fileSize,
      })),
    };

    await pageRepository.createPages(createPagePayload, session);

    await session.commitTransaction();
    logger.debug("addChapterToMangaController called");

    return res.status(200).json({
      message: "Successfully created new chapter",
    });
  } catch (error) {
    await session.abortTransaction();
    errorHandler(error, req, res);
  } finally {
    await session.endSession();
  }
}
