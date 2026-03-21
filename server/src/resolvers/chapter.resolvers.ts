import { Resolver, Arg, InputType, Query } from "type-graphql";
import * as chapterRepository from "@repository/chapter.repository.js";
import { Chapter } from "@models/chapter.model.js";

@Resolver(() => Chapter)
export class ChapterResolver {
  @Query(() => [Chapter])
  async findChaptersByMangaId(
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Chapter[]> {
    return await chapterRepository.findChaptersByMangaId(mangaId);
  }
}
