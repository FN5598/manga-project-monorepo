import type { GenreDoc } from '@genres/entities/genre.entity';
import type { PaginationInput } from '@shared/utils/resource.utils';

export interface IGenresRepository {
  getAllGenres(paginationInput?: PaginationInput): Promise<GenreDoc[]>;
}
