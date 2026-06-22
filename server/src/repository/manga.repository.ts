import MangaModel, { Manga } from "@models/manga.model.js";
import logger from "@config/logger.js";
import {
  MangaFilterFields,
  MangaFilterTypes,
  MangaUploadInput,
  PaginationInput,
} from "@resolvers/resolver.utils.js";
import mongoose, { ClientSession, PipelineStage } from "mongoose";
import { escapeRegex } from "@config/regex.js";
import { BadRequestError, NotFoundError } from "@errors/Error.js";
import { SortInputType } from "@resolvers/resolver.utils.js";
import { IMangaInterface } from "./manga.repository.interface.js";
import { getDefaultPagination } from "@config/util.js";

export class IMangaRepository implements IMangaInterface {
  private buildMangaMatch(
    filters?: MangaFilterTypes[],
  ): Record<string, unknown> {
    const match: Record<string, unknown> = {};

    if (!filters?.length) return match;

    for (const filter of filters) {
      if (!filter.value?.length) continue;

      if (filter.field === MangaFilterFields.TITLE) {
        match.title = {
          $regex: escapeRegex(filter.value[0]),
          $options: "i",
        };
      } else if (filter.field === MangaFilterFields.GENRES) {
        const genreIds = filter.value
          .filter((value) => mongoose.Types.ObjectId.isValid(value))
          .map((value) => new mongoose.Types.ObjectId(value));

        match.genres = {
          $in: genreIds,
        };
      } else if (filter.field === MangaFilterFields.ID) {
        const mangaIds = filter.value
          .filter((value) => mongoose.Types.ObjectId.isValid(value))
          .map((value) => new mongoose.Types.ObjectId(value));

        match._id = {
          $in: mangaIds,
        };
      } else {
        match[filter.field] = {
          $in: filter.value,
        };
      }
    }

    return match;
  }

  async updateManga(
    mangaId: string,
    updateData: Partial<Manga>,
    session: ClientSession,
  ): Promise<Manga> {
    if (!mangaId) throw new BadRequestError("MangaId is required input");
    if (!Object.keys(updateData).length || !updateData)
      throw new BadRequestError("Update fields are required");

    try {
      const updatedManga = await MangaModel.findByIdAndUpdate(
        mangaId,
        updateData,
        { returnDocument: "after" },
      )
        .session(session)
        .exec();

      if (!updatedManga) {
        throw new NotFoundError("Manga not found");
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

  async createManga(mangaData: MangaUploadInput): Promise<Manga> {
    if (!Object.keys(mangaData).length || !mangaData)
      throw new BadRequestError("No manga data to upload");

    try {
      const newManga = await MangaModel.create(mangaData);

      if (!newManga) throw new NotFoundError("Failed to find manga");

      return newManga;
    } catch (error) {
      logger.error("Failed to uploadManga", {
        error,
        operation: "uploadManga",
        mangaData,
      });
      throw error;
    }
  }

  async findAllMangas(
    paginationInput?: PaginationInput | undefined,
    sort?: SortInputType,
    filters?: MangaFilterTypes[],
  ): Promise<Manga[] | []> {
    try {
      const { page, limit } = getDefaultPagination(paginationInput);

      const sortOrder = sort?.sortBy === "asc" ? 1 : -1;
      const sortField = sort?.field ?? "createdAt";

      const pipeline: PipelineStage[] = [];
      const match = this.buildMangaMatch(filters);

      if (Object.keys(match).length) {
        pipeline.push({ $match: match });
      }

      // 1. Add pagination
      pipeline.push(
        {
          $sort: {
            [sortField]: sortOrder,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      );

      // 2. Fill in genres field so you can get in graphQL resolver
      pipeline.push({
        $lookup: {
          from: "genres",
          localField: "genres",
          foreignField: "_id",
          as: "genres",
        },
      });

      // 3. Fill in the chapter count for easy FE fetch
      pipeline.push(
        {
          $lookup: {
            from: "chapters",
            let: { mangaId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$mangaId", "$$mangaId"],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "chaptersMeta",
          },
        },
        {
          $addFields: {
            chaptersCount: {
              $ifNull: [{ $arrayElemAt: ["$chaptersMeta.count", 0] }, 0],
            },
          },
        },
        {
          $project: {
            chaptersMeta: 0,
          },
        },
      );

      const mangas = await MangaModel.aggregate(pipeline);

      if (!mangas) throw new NotFoundError("Mangas not Found");

      return mangas;
    } catch (error) {
      logger.error("Failed to find mangas", {
        error,
        operation: "findAllMangas",
      });
      throw error;
    }
  }

  async findMangaById(mangaId: string): Promise<Manga> {
    if (!mangaId) {
      throw new BadRequestError("Manga ID is required");
    }
    try {
      const manga = await MangaModel.findById(mangaId).populate("genres");
      if (!manga) throw new NotFoundError("Manga not found");

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

  async deleteMangaById(
    mangaId: string,
    session?: ClientSession,
  ): Promise<Manga> {
    if (!mangaId) throw new BadRequestError("Manga ID is required");

    try {
      const query = MangaModel.findByIdAndDelete(mangaId);

      if (session) query.session(session);

      const deletedManga = await query;

      if (!deletedManga) throw new NotFoundError("Manga not found");

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

  async findMangaByTitle(mangaTitle: string): Promise<Manga[]> {
    if (!mangaTitle)
      throw new BadRequestError("MangaTitle is required to search manga");

    try {
      const safeTitle = escapeRegex(mangaTitle);
      let pipeline: PipelineStage[] = [];

      pipeline.push({
        $match: {
          title: { $regex: safeTitle, $options: "i" },
        },
      });

      // 3. Fill in the chapter count for easy FE fetch
      pipeline.push(
        {
          $lookup: {
            from: "chapters",
            let: { mangaId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$mangaId", "$$mangaId"],
                  },
                },
              },
              { $count: "count" },
            ],
            as: "chaptersMeta",
          },
        },
        {
          $addFields: {
            chaptersCount: {
              $ifNull: [{ $arrayElemAt: ["$chaptersMeta.count", 0] }, 0],
            },
          },
        },
        {
          $project: {
            chaptersMeta: 0,
          },
        },
      );
      const manga = await MangaModel.aggregate(pipeline);

      if (!manga) throw new NotFoundError("Manga not found");

      return manga;
    } catch (error) {
      logger.error("Failed to find manga by title", {
        error,
        operation: "findMangaByTitle",
        mangaTitle,
      });
      throw error;
    }
  }

  async countMangas(filters?: MangaFilterTypes[]): Promise<number> {
    try {
      const match = this.buildMangaMatch(filters);

      return (await MangaModel.countDocuments(match)) ?? 0;
    } catch (error) {
      logger.error("Failed to count mangas", {
        error,
        operation: "countMangas",
      });
      throw error;
    }
  }
}
