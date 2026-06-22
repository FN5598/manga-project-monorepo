import { SortInput } from "../config/constants.js";
import { Manga } from "@models/manga.model.js";
import {
  Arg,
  Query,
  Resolver,
  Mutation,
  FieldResolver,
  Root,
  Ctx,
} from "type-graphql";
import * as resolversUtils from "@resolvers/manga.resolvers.utils.js";
import {
  ChapterRepository,
  MangaRepository,
  PageRepository,
} from "@repository/index.js";
import logger from "@config/logger.js";
import mongoose from "mongoose";
import {
  PaginationInput,
  SortInputType,
  getUrlForImage,
  MangaUploadInput,
  MangaFilterTypes,
  GraphQLContext,
} from "./resolver.utils.js";
import {
  filterSchema,
  nonEmptyString,
  paginationSortSchema,
  validateGraphQLInput,
} from "@validators/validator.utils.js";
import { uploadMangaSchemaGQL } from "@validators/manga.validators.js";
import { ForbiddenError, UnauthorizedError } from "@errors/Error.js";
import { UserRole } from "@models/user.model.js";

@Resolver(() => Manga)
export class MangaResolver {
  @Query(() => [Manga])
  async findAllMangas(
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput?: PaginationInput,
    @Arg("sort", () => SortInputType, { nullable: true })
    sort?: SortInput,
    @Arg("filters", () => [MangaFilterTypes], { nullable: true })
    filters?: MangaFilterTypes[],
  ): Promise<Manga[]> {
    const parsedData = validateGraphQLInput(paginationSortSchema, {
      paginationInput,
      sort,
      filters,
    });

    logger.debug("findAllMangas resolver called", {
      paginationInput: parsedData.paginationInput,
      sort: parsedData.sort,
      filters: parsedData.filters,
    });

    return await MangaRepository.findAllMangas(
      parsedData.paginationInput,
      parsedData.sort,
      parsedData.filters,
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

    return await MangaRepository.findMangaById(parsedMangaId);
  }

  @Mutation(() => Manga)
  async uploadManga(
    @Ctx() context: GraphQLContext,
    @Arg("mangaUploadInput", () => MangaUploadInput)
    mangaUploadInput: MangaUploadInput,
  ): Promise<Manga> {
    if (!context.user)
      throw new UnauthorizedError("Must be authorized to access this route");

    if (context.user.role !== UserRole.ADMIN)
      throw new ForbiddenError("You do not have permission to access route");

    const mangaData = validateGraphQLInput(
      uploadMangaSchemaGQL,
      mangaUploadInput,
    );

    logger.debug("uploadManga resolver called", {
      mangaUploadInput: mangaData,
    });

    return MangaRepository.createManga(mangaData);
  }

  // TODO change flow to Page -> Chapter -> Manga
  @Mutation(() => Manga)
  async deleteManga(
    @Ctx() context: GraphQLContext,
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Manga> {
    if (!context.user)
      throw new UnauthorizedError("Must be authorized to access this route");

    if (context.user.role !== UserRole.ADMIN)
      throw new ForbiddenError("You do not have permission to access route");

    const parsedMangaId = validateGraphQLInput(nonEmptyString, mangaId);

    const session = await mongoose.startSession();
    try {
      let deletedManga!: Manga;
      let deletedChapters!: { deletedCount: number; deletedIds: string[] };
      let deletedPages!: { deletedCount: number; deletedPageIds: string[] };
      await session.withTransaction(async () => {
        // 1. Delete manga from DB
        deletedManga = await MangaRepository.deleteMangaById(
          parsedMangaId,
          session,
        );

        logger.debug("deletedManga", {
          deletedManga,
        });

        deletedChapters = await ChapterRepository.deleteChaptersByMangaId(
          parsedMangaId,
          session,
        );

        logger.debug("Deleted chapters", {
          deletedChapters,
        });

        deletedPages = await PageRepository.deletePagesByChapterIds(
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

      throw error;
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

    return await MangaRepository.findMangaByTitle(parsedTitle);
  }

  @Query(() => Number)
  async countMangas(
    @Arg("filters", () => [MangaFilterTypes], { nullable: true })
    filters?: MangaFilterTypes[],
  ): Promise<number> {
    const parsedData = validateGraphQLInput(filterSchema, { filters });
    logger.debug("countMangas resolver called", {
      filters: parsedData.filters,
    });

    return await MangaRepository.countMangas(parsedData.filters);
  }
}
