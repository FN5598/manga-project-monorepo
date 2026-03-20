import { DEFAULT_PAGINATION, Pagination } from "@config/constants.js";
import MangaModel, { Manga } from "@models/manga.model.js";
import logger from "@config/logger.js";

export async function updateManga(
  mangaId: string,
  updateData: Partial<Manga>,
): Promise<Manga> {
  try {
    const updatedManga = await MangaModel.findByIdAndUpdate(
      mangaId,
      updateData,
      { new: true },
    );
    if (!updatedManga) {
      throw new Error("Manga not found");
    }
    return updatedManga;
  } catch (error) {
    logger.error("Failed to update manga", {
      error,
      operation: "updateManga",
      mangaId,
    });
    throw error;
  }
}

export async function uploadManga(mangaData: Partial<Manga>): Promise<Manga> {
  if (!mangaData.title || !mangaData.author) {
    throw new Error("Title and Author are required fields");
  }

  try {
    const newManga = new MangaModel(mangaData);
    return await newManga.save();
  } catch (error) {
    logger.error("Failed to uploadManga", {
      error,
      operation: "uploadManga",
      mangaData,
    });
    throw error;
  }
}

export async function findAllMangas(
  paginationInput: Pagination = DEFAULT_PAGINATION,
): Promise<Manga[] | []> {
  try {
    const { limit, page } = paginationInput;
    let pipeline = [
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const mangas = await MangaModel.aggregate(pipeline);

    if (!mangas) throw new Error("Failed to find mangas");
    return mangas;
  } catch (error) {
    logger.error("Failed to find mangas", {
      error,
      operation: "findAllMangas",
    });
    throw error;
  }
}

export async function findMangaById(mangaId: string): Promise<Manga> {
  if (!mangaId) {
    throw new Error("Manga ID is required");
  }
  try {
    const manga = await MangaModel.findById(mangaId);
    if (!manga) {
      throw new Error("Manga not found");
    }

    return manga;
  } catch (error) {
    logger.error("Failed to find manga", {
      error,
      operation: "findMangaById",
      mangaId,
    });
    throw error;
  }
}

export async function deleteMangaById(mangaId: string): Promise<Manga> {
  if (!mangaId) {
    throw new Error("Manga ID is required");
  }
  try {
    const deletedManga = await MangaModel.findByIdAndDelete(mangaId);
    if (!deletedManga) {
      throw new Error("Manga not found");
    }

    return deletedManga;
  } catch (error) {
    logger.error("Failed to delete manga", {
      error,
      operation: "deleteMangaById",
      mangaId,
    });
    throw error;
  }
}
