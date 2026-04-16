import { SortInput } from "../config/constants.js";
import * as mangaRepository from "../repository/manga.repository.js";
import { Manga } from "@models/manga.model.js";
import {
  Arg,
  Query,
  Resolver,
  Mutation,
  FieldResolver,
  Root,
} from "type-graphql";
import * as resolversUtils from "./manga.resolvers.utils.js";
import * as chapterRepository from "@repository/chapter.repository.js";
import * as pagesRepository from "@repository/page.repository.js";
import logger from "@config/logger.js";
import mongoose from "mongoose";
import {
  PaginationInput,
  SortInputType,
  getUrlForImage,
  MangaUploadInput,
} from "./resolver.utils.js";
import {
  nonEmptyString,
  paginationSchema,
  paginationSortSchema,
  PaginationType,
  validateGraphQLInput,
} from "@validators/validator.utils.js";
import { InternalError } from "@errors/Error.js";
import { getErrorInfo } from "@errors/error.utils.js";
import { uploadMangaSchema } from "@validators/manga.validators.js";

@Resolver(() => Manga)
export class MangaResolver {
  @Query(() => [Manga])
  async findAllMangas(
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput?: PaginationInput,
    @Arg("sort", () => SortInputType, { nullable: true })
    sort?: SortInput,
  ): Promise<Manga[]> {
    const parsedData = validateGraphQLInput(paginationSortSchema, {
      paginationInput,
      sort,
    });

    logger.debug("findAllMangas resolver called", {
      paginationInput: parsedData.paginationInput,
      sort: parsedData.sort,
    });

    return await mangaRepository.findAllMangas(
      parsedData.paginationInput,
      parsedData.sort,
    );
  }

  @FieldResolver(() => String, { nullable: true })
  previewUrl(@Root() manga: Manga): string | null {
    if (!manga.previewKey) return null;
    return getUrlForImage(manga.previewKey);
  }

  @Query(() => Manga)
  async findMangaById(
    @Arg("mangaId", () => String)
    mangaId: string,
  ): Promise<Manga> {
    const parsedMangaId = validateGraphQLInput(nonEmptyString, mangaId);

    logger.debug("FindMangaById resolver called", {
      mangaId: parsedMangaId,
    });

    return await mangaRepository.findMangaById(parsedMangaId);
  }

  @Mutation(() => Manga)
  async uploadManga(
    @Arg("mangaUploadInput", () => MangaUploadInput)
    mangaUploadInput: MangaUploadInput,
  ): Promise<Manga> {
    const { mangaData } = validateGraphQLInput(
      uploadMangaSchema,
      mangaUploadInput,
    );

    logger.debug("uploadManga resolver called", {
      mangaUploadInput: mangaData,
    });

    return mangaRepository.uploadManga(mangaData);
  }

  // TODO change flow to Page -> Chapter -> Manga
  @Mutation(() => Manga)
  async deleteManga(
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Manga> {
    const parsedMangaId = validateGraphQLInput(nonEmptyString, mangaId);

    const session = await mongoose.startSession();
    try {
      let deletedManga!: Manga;
      let deletedChapters!: { deletedCount: number; deletedIds: string[] };
      let deletedPages!: { deletedCount: number; deletedPageIds: string[] };
      await session.withTransaction(async () => {
        // 1. Delete manga from DB
        deletedManga = await mangaRepository.deleteMangaById(
          parsedMangaId,
          session,
        );

        logger.debug("deletedManga", {
          deletedManga,
        });

        deletedChapters = await chapterRepository.deleteChaptersByMangaId(
          parsedMangaId,
          session,
        );

        logger.debug("Deleted chapters", {
          deletedChapters,
        });

        deletedPages = await pagesRepository.deletePagesByChapterIds(
          deletedChapters.deletedIds,
          session,
        );

        logger.debug("deletedPages", {
          deletedPages,
        });
      });
      const mangaFolder = `mangas/${deletedManga._id}/`;
      const previewFolder = deletedManga.previewKey
        ? deletedManga.previewKey.split("/").slice(0, -1).join("/") + "/"
        : null;

      // 2. Delete whole manga folder
      await resolversUtils.deleteFolderFromS3(mangaFolder);

      // 3. Delete Preview folder
      if (previewFolder) {
        await resolversUtils.deleteFolderFromS3(previewFolder);
      }
      logger.debug("deleteManga resolver called", {
        mangaId: parsedMangaId,
        deletedManga,
        deletedPages,
        deletedChapters,
      });
      return deletedManga;
    } catch (error) {
      logger.error("Failed to call deleteManga resolver", {
        error,
      });

      throw new InternalError("Failed to delete manga", getErrorInfo(error));
    } finally {
      await session.endSession();
    }
  }

  @Query(() => [Manga])
  async findMangaByName(
    @Arg("mangaTitle", () => String)
    mangaTitle: string,
  ): Promise<Manga[]> {
    const parsedTitle = validateGraphQLInput(nonEmptyString, mangaTitle);

    logger.debug("findMangaByName resolver called", {
      mangaTitle: parsedTitle,
    });

    return await mangaRepository.findMangaByTitle(parsedTitle);
  }
}
