import { Page } from "@models/page.model.js";
import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import {
  PaginationInput,
  SortInputType,
  getUrlForImage,
} from "./resolver.utils.js";
import * as pageRepository from "@repository/page.repository.js";
import logger from "@config/logger.js";
import { validateGraphQLInput } from "@validators/validator.utils.js";
import { getPagesSchema } from "@validators/pages.validators.js";

@Resolver(() => Page)
export class PageResolver {
  @Query(() => [Page])
  async getPagesByChapterId(
    @Arg("chapterId", () => String) chapterId: string,
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput: PaginationInput,
    @Arg("sort", () => SortInputType, { nullable: true }) sort: SortInputType,
  ): Promise<Page[]> {
    const parsedData = validateGraphQLInput(getPagesSchema, {
      chapterId,
      paginationInput,
      sort,
    });

    logger.debug("getPagesByChapterId resolver called", {
      chapterId: parsedData.chapterId,
      paginationInput: parsedData.paginationInput,
      sort: parsedData.sort,
    });

    return await pageRepository.getPagesByChapterId(
      parsedData.chapterId,
      parsedData.paginationInput,
      parsedData.sort,
    );
  }

  @FieldResolver(() => String, { nullable: true })
  pageUrl(@Root() page: Page): string | null {
    if (!page.imageKey) return null;
    return getUrlForImage(page.imageKey);
  }
}
