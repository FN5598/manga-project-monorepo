import logger from "@config/logger.js";
import ChapterModel, { Chapter } from "@models/chapter.model.js";
import mongoose, { ClientSession, PipelineStage } from "mongoose";
import { DEFAULT_PAGINATION } from "@config/constants.js";
import {
  BadRequestError,
  ConflictError,
  InternalError,
  NotFoundError,
} from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";

enum UploadStatus {
  DRAFT = "draft",
  UPLOADING = "uploading",
  READY = "ready",
  FAILED = "failed",
}

export type createChapterPayload = {
  mangaId: string;
  chapterNumber: number;
  title: string;
  chapterPrefix: string;
  pageCount: number;
};

export async function createChapter(
  payload: createChapterPayload,
  session: ClientSession,
): Promise<Chapter> {
  try {
    const { chapterNumber, title, chapterPrefix, pageCount, mangaId } = payload;
    if (chapterNumber == null || chapterNumber < 1)
      throw new BadRequestError("Invalid chapterNumber");

    if (!mangaId) throw new BadRequestError("mangaId is required input!");

    if (!title.trim()) throw new BadRequestError("Invalid title");

    if (!chapterPrefix.trim())
      throw new BadRequestError("Invalid chapterPrefix");

    if (pageCount == null || pageCount < 1)
      throw new BadRequestError("Invalid pageCount");

    const chapter = await ChapterModel.find({ chapterNumber }).session(session);

    if (chapter)
      throw new ConflictError(`Chapter ${chapterNumber} already exists`);

    const createdChapter = new ChapterModel({
      chapterNumber,
      title,
      storagePrefix: chapterPrefix,
      pageCount,
      uploadStatus: UploadStatus.READY,
      mangaId,
    });
    await createdChapter.save({ session });

    if (!createdChapter) throw new NotFoundError("Chapter not found");
    return createdChapter;
  } catch (error: any) {
    if (error.code === 11000) {
      logger.error("Chapter already exists error", {
        operation: "createChapter",
      });
      throw new ConflictError(
        "Chapter already exists! Chapter number must be unique",
        {
          message: getErrorMessage(error),
        },
      );
    }
    logger.error("Failed to create a chapter", {
      error,
      operation: "createChapter",
      payload,
    });
    throw new InternalError("Failed to create chapter", {
      message: getErrorMessage(error),
    });
  }
}

export async function findChaptersByMangaId(
  mangaId: string,
): Promise<Chapter[]> {
  try {
    if (!mangaId) throw new BadRequestError("MangaId is required input!");
    let pipeline: PipelineStage[] = [
      {
        $match: { mangaId: new mongoose.Types.ObjectId(mangaId) },
      },
    ];

    const chapters = await ChapterModel.aggregate(pipeline);

    if (chapters.length <= 0) throw new NotFoundError("Chapters not found");

    return chapters;
  } catch (error) {
    logger.error("Failed to find chapters for manga", {
      error,
      operation: "findChaptersByMangaId",
      mangaId,
    });
    throw new InternalError("Faield to find chapters", {
      message: getErrorMessage(error),
    });
  }
}

export async function findAllChapters(
  sort?: SortInputType,
  paginationInput?: PaginationInput,
): Promise<Chapter[]> {
  try {
    const page = paginationInput?.page ?? DEFAULT_PAGINATION.page;
    const limit = paginationInput?.limit
      ? paginationInput.limit > DEFAULT_PAGINATION.limit
        ? DEFAULT_PAGINATION.limit
        : paginationInput.limit
      : DEFAULT_PAGINATION.limit;

    const sortOrder = sort?.sortBy === "asc" ? 1 : -1;

    const chapters = await ChapterModel.find()
      .sort({ updatedAt: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit);

    if (!chapters) throw new NotFoundError("Chapters not found");

    return chapters;
  } catch (error) {
    logger.error("Failed to find all chapters", {
      error,
      operation: "findAllChapters",
    });
    throw new InternalError("Failed to find chapters", {
      message: getErrorMessage(error),
    });
  }
}

export async function findChapterById(chapterId: string): Promise<Chapter> {
  try {
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) throw new NotFoundError("Chapter not found");

    return chapter;
  } catch (error) {
    logger.error("Failed to find chaper by mangaId", {
      error,
      operation: "findChapterByMangaId",
      chapterId,
    });
    throw new InternalError("Failed to find chapter", {
      message: getErrorMessage(error),
    });
  }
}

export async function deleteChaptersByMangaId(
  mangaId: string,
  session: ClientSession,
): Promise<{ deletedCount: number; deletedIds: string[] }> {
  try {
    if (!mangaId) throw new BadRequestError("MangaId is required input");

    const deletedChapters = await ChapterModel.find({
      mangaId,
    })
      .select("_id")
      .lean()
      .session(session);

    const deleteResponse = await ChapterModel.deleteMany({
      mangaId,
    }).session(session);

    return {
      deletedCount: deleteResponse.deletedCount ?? 0,
      deletedIds: deletedChapters.map((c) => String(c._id)),
    };
  } catch (error) {
    logger.error("Failed to delete chapters", {
      error,
      operation: "deleteChaptersByMangaId",
      mangaId,
    });
    throw new InternalError("Failed to delete chapters", {
      message: getErrorMessage(error),
    });
  }
}
