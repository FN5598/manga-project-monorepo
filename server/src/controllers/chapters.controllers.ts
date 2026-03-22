import logger from "@config/logger.js";
import { Response, Request } from "express";
import * as chapterRepository from "@repository/chapter.repository.js";
import * as pageRepository from "@repository/page.repository.js";

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

export async function addChapterToMangaController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { mangaId, chapterTitle, chapterNumber, pages }: addChapterPayload =
      req.body;

    if (!mangaId) {
      return res.status(400).json({ message: "mangaId is required input!" });
    }

    if (!chapterTitle) {
      return res
        .status(400)
        .json({ message: "chapterTitle is required input!" });
    }

    if (!chapterNumber) {
      return res
        .status(400)
        .json({ message: "ChapterNumber is required input!" });
    }

    if (!Array.isArray(pages) || pages.length <= 0) {
      return res.status(400).json({ message: "Incorrect pages payload" });
    }

    const chapterPrefix =
      pages[0].imageKey.split("/").slice(0, -1).join("/") + "/";

    const createChapterPayload: chapterRepository.createChapterPayload = {
      mangaId,
      chapterNumber,
      title: chapterTitle,
      chapterPrefix,
      pageCount: pages.length,
    };

    const chapterRes =
      await chapterRepository.createChapter(createChapterPayload);

    const createPagePayload: pageRepository.CreatePagesPayload = {
      chapterId: chapterRes._id,
      pages: pages.map((page) => ({
        imageKey: page.imageKey,
        fileSize: page.fileSize,
      })),
    };

    await pageRepository.createPages(createPagePayload);

    logger.debug("addChapterToMangaController called");
    return res.status(200).json({
      message: "Successfully created new chapter",
    });
  } catch (error) {
    logger.error("failed to add chapter to manga", {
      error,
      operation: "addChapterToMangaController",
    });
    throw error;
  }
}
