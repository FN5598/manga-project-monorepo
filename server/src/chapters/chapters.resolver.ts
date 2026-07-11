import { Args, Query, Resolver } from '@nestjs/graphql';
import { Chapter } from './entities/chapter.entity';
import { ChaptersService } from './chapters.service';
import { PaginationInput, SortInput } from '@shared/utils/resource.utils';

@Resolver(() => Chapter)
export class ChaptersResolver {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Query(() => [Chapter])
  findChaptersByMangaId(@Args('mangaId') mangaId: string) {
    return this.chaptersService.findChaptersByMangaId(mangaId);
  }

  @Query(() => Chapter)
  findChapterById(@Args('chapterId') chapterId: string) {
    return this.chaptersService.findChapterById(chapterId);
  }

  @Query(() => [Chapter])
  findAllChapters(
    @Args('sort', { nullable: true }) sort?: SortInput,
    @Args('paginationInput', { nullable: true })
    paginationInput?: PaginationInput,
  ) {
    return this.chaptersService.findAllChapters(sort, paginationInput);
  }
}
