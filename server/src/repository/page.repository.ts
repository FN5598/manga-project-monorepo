import logger from "@config/logger.js";
import PageModel, { Page } from "@models/page.model.js";
import { PaginationInput, SortInputType } from "@resolvers/manga.resolvers.js";
import { ClientSession, PipelineStage, Types } from "mongoose";
import { DEFAULT_PAGINATION, SortInput } from "@config/constants.js";
export type CreatePagesPayload = {
  chapterId: string;
  pages: {
    imageKey: string;
    fileSize: number;
  }[];
};

export async function createPages(
  payload: CreatePagesPayload,
): Promise<Page[]> {
  try {
    const { chapterId, pages } = payload;

    if (!chapterId) throw new Error("Chapter id is required");
    if (pages.length <= 0) throw new Error("Invalid pages payload");

    const pagesToUpload = pages.map((page, index) => ({
      chapter: new Types.ObjectId(chapterId),
      imageKey: page.imageKey,
      fileSize: page.fileSize,
      pageNumber: index + 1,
    }));

    const newPages = await PageModel.insertMany(pagesToUpload);

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

export async function getPagesByChapterId(
  chapterId: string,
  pagination: PaginationInput,
  sort: SortInputType,
): Promise<Page[]> {
  if (!chapterId) throw new Error("chapterId is required to fetch pages!");
  try {
    const page = pagination?.page ?? DEFAULT_PAGINATION.page;
    const limit = pagination?.limit
      ? pagination.limit > DEFAULT_PAGINATION.limit
        ? DEFAULT_PAGINATION.limit
        : pagination.limit
      : DEFAULT_PAGINATION.limit;

    let pipeline: PipelineStage[] = [];

    const sortBy = sort?.sortBy === "asc" ? -1 : 1;

    // 1. add pagination and sorting
    pipeline.push(
      {
        $match: {
          chapter: new Types.ObjectId(chapterId),
        },
      },
      {
        $sort: {
          pageNumber: sortBy,
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

    if (chapters.length <= 0) return [];

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

export async function deletePagesByChapterIds(
  chapterIds: string[],
  session: ClientSession,
): Promise<{ deletedCount: number; deletedPageIds: string[] }> {
  try {
    if (!Array.isArray(chapterIds) || chapterIds.length <= 0)
      throw new Error("chapterIds must be a valid input");

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
