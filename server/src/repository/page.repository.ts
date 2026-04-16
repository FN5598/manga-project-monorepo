import logger from "@config/logger.js";
import PageModel, { Page } from "@models/page.model.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";
import { ClientSession, PipelineStage, Types } from "mongoose";
import { BadRequestError, InternalError } from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";
import { getDefaultPagination } from "@config/util.js";

export type CreatePagesPayload = {
  chapterId: string;
  pages: {
    imageKey: string;
    fileSize: number;
  }[];
};

export async function createPages(
  payload: CreatePagesPayload,
  session: ClientSession,
): Promise<Page[]> {
  try {
    const { chapterId, pages } = payload;

    if (!chapterId) throw new BadRequestError("Chapter id is required");
    if (pages.length <= 0) throw new BadRequestError("Invalid pages payload");

    const pagesToUpload = pages.map((page, index) => ({
      chapter: new Types.ObjectId(chapterId),
      imageKey: page.imageKey,
      fileSize: page.fileSize,
      pageNumber: index + 1,
    }));

    const newPages = await PageModel.insertMany(pagesToUpload, { session });

    return newPages;
  } catch (error: unknown) {
    logger.error("Failed to create pages", {
      error,
      opertaion: "createPages",
      payload,
    });
    throw new InternalError("Failed to create Page", {
      message: getErrorMessage(error),
    });
  }
}

export async function getPagesByChapterId(
  chapterId: string,
  pagination?: PaginationInput,
  sort?: SortInputType,
): Promise<Page[]> {
  if (!chapterId)
    throw new BadRequestError("ChapterId is required to fetch pages!");
  try {
    const { limit, page } = getDefaultPagination(pagination);

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
  } catch (error: unknown) {
    logger.error("Failed to get pages for chapter", {
      error,
      operation: "getPagesByChapterId",
      chapterId,
    });
    throw new InternalError("Failed to get pages by chapter Id", {
      message: getErrorMessage(error),
    });
  }
}

export async function deletePagesByChapterIds(
  chapterIds: string[],
  session: ClientSession,
): Promise<{ deletedCount: number; deletedPageIds: string[] }> {
  try {
    if (!Array.isArray(chapterIds) || chapterIds.length <= 0)
      throw new BadRequestError("ChapterIds must be a valid input");

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
    throw new InternalError("Faied to delete page by chapter id", {
      message: getErrorMessage(error),
    });
  }
}
