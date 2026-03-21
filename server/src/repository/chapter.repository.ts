import logger from "@config/logger.js";
import ChapterModel, { Chapter } from "@models/chapter.model.js";

enum UploadStatus {
  DRAFT = "draft",
  UPLOADING = "uploading",
  READY = "ready",
  FAILED = "failed",
}

type createChapterPayload = {
  chapterNumber: number;
  title: string;
  chapterPrefix: string;
  pageCount: number;
};

export async function createChapter(
  payload: createChapterPayload,
): Promise<Chapter> {
  try {
    const { chapterNumber, title, chapterPrefix, pageCount } = payload;
    if (chapterNumber == null || chapterNumber < 1) {
      throw new Error("Invalid chapterNumber");
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
    });
    await chapter.save();

    return chapter;
  } catch (error) {
    logger.error("Failed to create a chapter", {
      error,
      operation: "createChapter",
      payload,
    });
    throw error;
  }
}

export async function findChaptersByMangaId(
  mangaId: String,
): Promise<Chapter[]> {
  try {
    if (!mangaId) throw new Error("mangaId is required input!");

    const pipeline = [
      {
        $match: { mangaId },
      },
    ];

    const chapters = await ChapterModel.aggregate(pipeline);

    if (chapters.length <= 0)
      throw new Error("Failed to find chapters for this manga");

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
