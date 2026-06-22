import logger from "@config/logger.js";
import PageModel, { Page } from "@models/page.model.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";
import { ClientSession, PipelineStage, Types } from "mongoose";
import { BadRequestError, InternalError } from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";
import { getDefaultPagination } from "@config/util.js";
import { IPageInterface } from "./page.repository.interface.js";

export type CreatePagesPayload = {
  chapterId: string;
  pages: {
    imageKey: string;
    fileSize: number;
  }[];
};

export class IPageRepository implements IPageInterface {
  async createPages(
    payload: CreatePagesPayload,
    session: ClientSession,
  ): Promise<Page[]> {
    const { chapterId, pages } = payload;

    if (!chapterId) throw new BadRequestError("Chapter id is required");
    if (!Array.isArray(pages) || pages.length <= 0)
      throw new BadRequestError("Invalid pages payload");

    const pagesToUpload = pages.map((page, index) => ({
      chapter: new Types.ObjectId(chapterId),
      imageKey: page.imageKey,
      fileSize: page.fileSize,
      pageNumber: index + 1,
    }));
    try {
      const newPages = await PageModel.insertMany(pagesToUpload, { session });

      return newPages;
    } catch (error) {
      logger.error("Failed to create pages", {
        error,
        opertaion: "createPages",
        payload,
      });
      throw error;
    }
  }

  async getPagesByChapterId(
    chapterId: string,
    pagination?: PaginationInput,
    sort?: SortInputType,
  ): Promise<Page[]> {
    if (!chapterId)
      throw new BadRequestError("ChapterId is required to fetch pages!");

    const { limit, page } = getDefaultPagination(pagination);
    try {
      let pipeline: PipelineStage[] = [];

      const sortBy = sort?.sortBy === "asc" ? -1 : 1;
      const sortField = sort?.field ?? "createdAt";

      // 1. add pagination and sorting
      pipeline.push(
        {
          $match: {
            chapter: new Types.ObjectId(chapterId),
          },
        },
        {
          $sort: {
            [sortField]: sortBy,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      );

      const chapters = await PageModel.aggregate(pipeline);

      return chapters;
    } catch (error) {
      logger.error("Failed to get pages for chapter", {
        error,
        operation: "getPagesByChapterId",
        chapterId,
      });
      throw error;
    }
  }

  async deletePagesByChapterIds(
    chapterIds: string[],
    session: ClientSession,
  ): Promise<{ deletedCount: number; deletedPageIds: string[] }> {
    if (!Array.isArray(chapterIds) || chapterIds.length <= 0)
      throw new BadRequestError("ChapterIds must be a valid input");

    try {
      const deletedPages = await PageModel.find({
        chapter: { $in: chapterIds },
      })
        .select("_id")
        .lean()
        .session(session);

      const deleteResponse = await PageModel.deleteMany({
        chapter: { $in: chapterIds },
      }).session(session);

      return {
        deletedCount: deleteResponse.deletedCount ?? 0,
        deletedPageIds: deletedPages.map((page) => String(page._id)),
      };
    } catch (error) {
      logger.error("Failed to delete pages by chapterIds", {
        error,
        operation: "deletePagesByChapterIds",
        chapterIds,
      });
      throw error;
    }
  }
}
