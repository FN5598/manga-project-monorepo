import { Resolver, Arg, Query } from "type-graphql";
import { ChapterRepository } from "@repository/index.js";
import { Chapter } from "@models/chapter.model.js";
import logger from "@config/logger.js";
import { PaginationInput, SortInputType } from "./resolver.utils.js";
import {
  nonEmptyString,
  paginationSortSchema,
  validateGraphQLInput,
} from "@validators/validator.utils.js";

@Resolver(() => Chapter)
export class ChapterResolver {
  @Query(() => [Chapter])
  async findChaptersByMangaId(
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Chapter[]> {
    const parsedMangaId = validateGraphQLInput(nonEmptyString, mangaId);

    logger.debug("findChapterByMangaId resolver called", {
      mangaId: parsedMangaId,
    });

    return await ChapterRepository.findChaptersByMangaId(parsedMangaId);
  }

  @Query(() => Chapter)
  async findChapterById(
    @Arg("chapterId", () => String) chapterId: string,
  ): Promise<Chapter> {
    const parsedChapterId = validateGraphQLInput(nonEmptyString, chapterId);

    logger.debug("findChapterById resolver called", {
      chapterId: parsedChapterId,
    });

    return await ChapterRepository.findChapterById(parsedChapterId);
  }

  @Query(() => [Chapter])
  async findAllChapters(
    @Arg("sort", () => SortInputType, { nullable: true }) sort: SortInputType,
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput: PaginationInput,
  ): Promise<Chapter[]> {
    const parsedData = validateGraphQLInput(paginationSortSchema, {
      paginationInput,
      sort,
    });

    logger.debug("findAllChapters resolver called", {
      sort: parsedData.sort,
      paginationInput: parsedData.paginationInput,
    });

    return await ChapterRepository.findAllChapters(
      parsedData.sort,
      parsedData.paginationInput,
    );
  }
}
