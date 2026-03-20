import logger from "@config/logger.js";
import PageModel, { Page } from "@models/page.model.js";

type CreatePagesPayload = {
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
      chapter: chapterId,
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
