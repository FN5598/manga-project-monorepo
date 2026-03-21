import { Page } from "@models/page.model.js";
import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import { PaginationInput, SortInputType } from "./manga.resolvers.js";
import * as pageRepository from "@repository/page.repository.js";
import logger from "@config/logger.js";
import { getUrlForImage } from "./manga.resolvers.js";

@Resolver(() => Page)
export class PageResolver {
  @Query(() => [Page])
  async getPagesByChapterId(
    @Arg("chapterId", () => String) chapterId: string,
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput: PaginationInput,
    @Arg("sort", () => SortInputType, { nullable: true }) sort: SortInputType,
  ): Promise<Page[]> {
    logger.debug("getPagesByChapterId resolver called", {
      chapterId,
      paginationInput,
      sort,
    });
    return await pageRepository.getPagesByChapterId(
      chapterId,
      paginationInput,
      sort,
    );
  }

  @FieldResolver(() => String, { nullable: true })
  pageUrl(@Root() page: Page): string | null {
    if (!page.imageKey) return null;
    return getUrlForImage(page.imageKey);
  }
}
