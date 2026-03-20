import { Genre, GenreModel } from "@models/genre.model.js";
import logger from "@config/logger.js";

export async function getAllGenres(): Promise<Genre[]> {
  try {
    const genres = await GenreModel.find();

    if (genres.length <= 0) {
      return [];
    }
    return genres;
  } catch (error) {
    logger.error("Failed to fetch genres", {
      operation: "getAllGenres",
      error,
    });
    throw error;
  }
}
