import { Genre, GenreModel } from "@models/genre.model.js";
import logger from "@config/logger.js";
import { InternalError, NotFoundError } from "@errors/Error.js";
import { getErrorMessage } from "@errors/error.utils.js";

export async function getAllGenres(): Promise<Genre[]> {
  try {
    const genres = await GenreModel.find();

    if (!genres) throw new NotFoundError("No genres were found");

    return genres;
  } catch (error) {
    logger.error("Failed to fetch genres", {
      operation: "getAllGenres",
      error,
    });
    throw new InternalError("Failed to fetch genres", {
      message: getErrorMessage(error),
    });
  }
}
