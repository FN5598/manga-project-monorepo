import { NextFunction, Request, Response } from "express";
import { GenreRepository } from "@repository/index.js";
import logger from "@config/logger.js";

export async function getAllGenresController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const genres = await GenreRepository.getAllGenres();
    if (genres) {
      logger.debug("getAllGenresController called", {
        count: genres.length,
      });
      return res.status(200).json({
        data: {
          message: "Successfully fetched all genres",
          genres,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}
