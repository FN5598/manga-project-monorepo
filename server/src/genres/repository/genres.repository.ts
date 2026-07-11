import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Genre, GenreDoc } from '@genres/entities/genre.entity';
import type { IGenresRepository } from '@genres/repository/genres-repository.interface';
import {
  PaginationInput,
  getDefaultPagination,
} from '@shared/utils/resource.utils';

@Injectable()
export class GenresRepository implements IGenresRepository {
  private readonly logger = new Logger(GenresRepository.name);

  constructor(
    @InjectModel(Genre.name)
    private readonly genreModel: Model<GenreDoc>,
  ) {}

  async getAllGenres(paginationInput?: PaginationInput): Promise<GenreDoc[]> {
    try {
      const query = this.genreModel.find();

      if (paginationInput) {
        const { page, limit } = getDefaultPagination(paginationInput);
        query.limit(limit).skip((page - 1) * limit);
      }

      const genres = await query.exec();

      if (!genres.length) {
        throw new NotFoundException('No genres were found');
      }

      return genres;
    } catch (error: unknown) {
      this.logger.error('Failed to fetch genres', {
        operation: 'getAllGenres',
        error,
      });
      throw error;
    }
  }
}
