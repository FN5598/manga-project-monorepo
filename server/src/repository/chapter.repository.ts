import logger from "@config/logger.js";
import ChapterModel, { Chapter } from "@models/chapter.model.js";
import mongoose, { ClientSession, PipelineStage } from "mongoose";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@errors/Error.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";
import { IChapterInterface } from "./chapter.repository.interface.js";
import { getDefaultPagination } from "@config/util.js";

export enum UploadStatus {
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

export class IChapterRepository implements IChapterInterface {
  async createChapter(
    payload: createChapterPayload,
    session: ClientSession,
  ): Promise<Chapter> {
    const { chapterNumber, title, chapterPrefix, pageCount, mangaId } = payload;

    if (chapterNumber == null || chapterNumber < 1)
      throw new BadRequestError("Invalid chapterNumber");

    if (!mangaId) throw new BadRequestError("mangaId is required input!");

    if (typeof chapterPrefix !== "string" || !title.trim())
      throw new BadRequestError("Invalid title");

    if (typeof chapterPrefix !== "string" || !chapterPrefix.trim())
      throw new BadRequestError("Invalid chapterPrefix");

    if (pageCount == null || pageCount < 1)
      throw new BadRequestError("Invalid pageCount");
    try {
      const chapter = await ChapterModel.find({ chapterNumber }).session(
        session,
      );

      if (chapter.length >= 1)
        throw new ConflictError(`Chapter ${chapterNumber} already exists`);

      const [createdChapter] = await ChapterModel.create(
        [
          {
            chapterNumber,
            title,
            storagePrefix: chapterPrefix,
            pageCount,
            uploadStatus: UploadStatus.READY,
            mangaId,
          },
        ],
        { session },
      );

      if (!createdChapter) throw new NotFoundError("Chapter not found");
      return createdChapter;
    } catch (error) {
      logger.error("Failed to create a chapter", {
        error,
        operation: "createChapter",
        payload,
      });
      throw error;
    }
  }

  async findChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    if (!mangaId) throw new BadRequestError("MangaId is required input!");

    try {
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
      throw error;
    }
  }

  async findAllChapters(
    sort?: SortInputType,
    paginationInput?: PaginationInput,
  ): Promise<Chapter[]> {
    const { page, limit } = getDefaultPagination(paginationInput);
    const sortOrder = sort?.sortBy === "asc" ? 1 : -1;

    try {
      const chapters = await ChapterModel.find()
        .sort({ updatedAt: sortOrder })
        .limit(limit)
        .skip((page - 1) * limit);

      if (!chapters.length) throw new NotFoundError("Chapters not found");

      return chapters;
    } catch (error) {
      logger.error("Failed to find all chapters", {
        error,
        operation: "findAllChapters",
      });
      throw error;
    }
  }

  async findChapterById(chapterId: string): Promise<Chapter> {
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
      throw error;
    }
  }

  async deleteChaptersByMangaId(
    mangaId: string,
    session: ClientSession,
  ): Promise<{ deletedCount: number; deletedIds: string[] }> {
    if (!mangaId) throw new BadRequestError("MangaId is required input");
    try {
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
}
