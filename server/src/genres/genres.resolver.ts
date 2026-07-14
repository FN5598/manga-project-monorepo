import { Args, Query, Resolver } from '@nestjs/graphql';
import { Genre } from './entities/genre.entity';
import { GenresService } from './genres.service';
import { PaginationInput } from '@shared/utils/resource.utils';

@Resolver(() => Genre)
export class GenresResolver {
  constructor(private readonly genresService: GenresService) {}

  @Query(() => [Genre])
  getAllGenres(
    @Args('paginationInput', { nullable: true })
    paginationInput?: PaginationInput,
  ) {
    return this.genresService.getAllGenres(paginationInput);
  }
}
