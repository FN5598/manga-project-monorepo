import { Resolver, Arg, InputType, Query } from "type-graphql";
import * as chapterRepository from "@repository/chapter.repository.js";
import { Chapter } from "@models/chapter.model.js";
import logger from "@config/logger.js";

@Resolver(() => Chapter)
export class ChapterResolver {
  @Query(() => [Chapter])
  async findChaptersByMangaId(
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Chapter[]> {
    logger.debug("findChapterByMangaId resolver called", {
      mangaId,
    });
    return await chapterRepository.findChaptersByMangaId(mangaId);
  }

  @Query(() => Chapter)
  async findChapterById(
    @Arg("chapterId", () => String) chapterId: string,
  ): Promise<Chapter | null> {
    return await chapterRepository.findChapterById(chapterId);
  }
}
