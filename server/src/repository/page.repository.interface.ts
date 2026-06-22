import { ClientSession } from "mongoose";
import { CreatePagesPayload } from "./page.repository.js";
import { Page } from "@models/page.model.js";
import { PaginationInput, SortInputType } from "@resolvers/resolver.utils.js";

export interface IPageInterface {
  createPages(
    payload: CreatePagesPayload,
    session: ClientSession,
  ): Promise<Page[]>;

  getPagesByChapterId(
    chapterId: string,
    pagination?: PaginationInput,
    sort?: SortInputType,
  ): Promise<Page[]>;

  deletePagesByChapterIds(
    chapterIds: string[],
    session: ClientSession,
  ): Promise<{ deletedCount: number; deletedPageIds: string[] }>;
}
