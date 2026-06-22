import { ClientSession } from "mongoose";
import { createChapterPayload } from "./chapter.repository.js";
import { Chapter } from "@models/chapter.model.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";

export interface IChapterInterface {
  createChapter(
    payload: createChapterPayload,
    session: ClientSession,
  ): Promise<Chapter>;

  findChaptersByMangaId(mangaId: string): Promise<Chapter[]>;

  findAllChapters(
    sort?: SortInputType,
    paginationInput?: PaginationInput,
  ): Promise<Chapter[]>;

  findChapterById(chapterId: string): Promise<Chapter>;

  deleteChaptersByMangaId(
    mangaId: string,
    session: ClientSession,
  ): Promise<{ deletedCount: number; deletedIds: string[] }>;
}
