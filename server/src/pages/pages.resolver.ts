import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';
import { PaginationInput, SortInput } from '@shared/utils/resource.utils';
import { S3Service } from 'src/integrations/s3/s3.service';

@Resolver(() => Page)
export class PagesResolver {
  constructor(
    private readonly pagesService: PagesService,
    private readonly s3Service: S3Service,
  ) {}

  @Query(() => [Page])
  getPagesByChapterId(
    @Args('chapterId') chapterId: string,
    @Args('paginationInput', { nullable: true })
    paginationInput?: PaginationInput,
    @Args('sort', { nullable: true }) sort?: SortInput,
  ) {
    return this.pagesService.getPagesByChapterId(
      chapterId,
      paginationInput,
      sort,
    );
  }

  @ResolveField(() => String, { nullable: true })
  pageUrl(@Parent() page: Page) {
    if (!page.imageKey) return null;
    return this.s3Service.getUrlForKey(page.imageKey);
  }
}
