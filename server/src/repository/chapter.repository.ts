import { SortInputType } from "@resolvers/manga.resolvers.js";
import logger from "@config/logger.js";
import ChapterModel, { Chapter } from "@models/chapter.model.js";
import { PaginationInput } from "@resolvers/manga.resolvers.js";
import mongoose, { ClientSession, PipelineStage, Types } from "mongoose";
import { DEFAULT_PAGINATION } from "@config/constants.js";

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
): Promise<Chapter> {
  try {
    const { chapterNumber, title, chapterPrefix, pageCount, mangaId } = payload;
    if (chapterNumber == null || chapterNumber < 1) {
      throw new Error("Invalid chapterNumber");
    }

    if (!mangaId) {
      throw new Error("mangaId is required input!");
    }

    if (!title.trim()) {
      throw new Error("Invalid title");
    }

    if (!chapterPrefix.trim()) {
      throw new Error("Invalid chapterPrefix");
    }

    if (pageCount == null || pageCount < 1) {
      throw new Error("Invalid pageCount");
    }

    const chapter = new ChapterModel({
      chapterNumber,
      title,
      storagePrefix: chapterPrefix,
      pageCount,
      uploadStatus: UploadStatus.READY,
      mangaId,
    });
    await chapter.save();

    return chapter;
  } catch (error: any) {
    if (error.code === 11000) {
      logger.error("Chapter already exists error", {
        operation: "createChapter",
      });
      throw new Error("Chapter already exists! Chapter number must be unique");
    }
    logger.error("Failed to create a chapter", {
      error,
      operation: "createChapter",
      payload,
    });
    throw error;
  }
}

export async function findChaptersByMangaId(
  mangaId: string,
): Promise<Chapter[]> {
  try {
    if (!mangaId) throw new Error("mangaId is required input!");
    let pipeline: PipelineStage[] = [
      {
        $match: { mangaId: new mongoose.Types.ObjectId(mangaId) },
      },
    ];

    const chapters = await ChapterModel.aggregate(pipeline);

    if (chapters.length <= 0) return [];

    return chapters;
  } catch (error) {
    logger.error("Failed to find chapters for manga", {
      error,
      operation: "findChaptersByMangaId",
      mangaId,
    });
    throw error;
  }
}

export async function findAllChapters(
  sort: SortInputType,
  paginationInput: PaginationInput,
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

    return chapters || [];
  } catch (error) {
    logger.error("Failed to find all chapters", {
      error,
      operation: "findAllChapters",
    });
    throw error;
  }
}

export async function findChapterById(
  chapterId: string,
): Promise<Chapter | null> {
  try {
    const chapter = await ChapterModel.findById(chapterId);
    if (!chapter) return null;

    return chapter;
  } catch (error) {
    logger.error("Failed to find chaper by mangaId", {
      error,
      operation: "findChapterByMangaId",
      chapterId,
    });
    throw error;
  }
}

export async function deleteChaptersByMangaId(
  mangaId: string,
  session: ClientSession,
): Promise<{ deletedCount: number; deletedIds: string[] }> {
  try {
    if (!mangaId) throw new Error("MangaId is reuqired input");

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
    throw error;
  }
}
