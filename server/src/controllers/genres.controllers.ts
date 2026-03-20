import { Request, Response } from "express";
import * as genreRepository from "@repository/genre.repository.js";
import logger from "@config/logger.js";

/**
 * Public endpoint
 */
export async function getAllGenresController(req: Request, res: Response) {
  try {
    const genres = await genreRepository.getAllGenres();
    if (genres) {
      logger.debug("getAllGenresController called", {
        count: genres.length,
      });
      return res.status(200).json({
        message: "Successfully fetched all genres",
        genres,
      });
    }
  } catch (error) {
    logger.error("Failed to get all genres", {
      error,
      operation: "getAllGenresControllers",
    });
    throw error;
  }
}
