import { Injectable } from '@nestjs/common';
import { PaginationInput } from '@shared/utils/resource.utils';
import { GenresRepository } from '@genres/repository/genres.repository';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepository: GenresRepository) {}

  getAllGenres(paginationInput?: PaginationInput) {
    return this.genresRepository.getAllGenres(paginationInput);
  }
}
