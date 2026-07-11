import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ClientSession, Model, PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { Manga, MangaDoc } from '@mangas/entities/mangas.entity';
import { MangaUploadInput } from '@mangas/dto/manga-inputs.dto';
import type { IMangasRepository } from '@mangas/repository/mangas-repository.interface';
import {
  MangaFilterFields,
  MangaFilterInput,
  PaginationInput,
  SortInput,
  escapeRegex,
  getDefaultPagination,
} from '@shared/utils/resource.utils';

@Injectable()
export class MangasRepository implements IMangasRepository {
  private readonly logger = new Logger(MangasRepository.name);

  constructor(
    @InjectModel(Manga.name)
    private readonly mangaModel: Model<MangaDoc>,
  ) {}

  private buildMangaMatch(
    filters?: MangaFilterInput[],
  ): Record<string, unknown> {
    const match: Record<string, unknown> = {};

    if (!filters?.length) return match;

    for (const filter of filters) {
      if (!filter.value?.length) continue;

      if (filter.field === MangaFilterFields.TITLE) {
        match.title = {
          $regex: escapeRegex(filter.value[0]),
          $options: 'i',
        };
      } else if (filter.field === MangaFilterFields.GENRES) {
        const genreIds = filter.value
          .filter((value) => Types.ObjectId.isValid(value))
          .map((value) => new Types.ObjectId(value));

        match.genres = { $in: genreIds };
      } else if (filter.field === MangaFilterFields.ID) {
        const mangaIds = filter.value
          .filter((value) => Types.ObjectId.isValid(value))
          .map((value) => new Types.ObjectId(value));

        match._id = { $in: mangaIds };
      } else {
        match[filter.field] = { $in: filter.value };
      }
    }

    return match;
  }

  async createManga(mangaData: MangaUploadInput): Promise<MangaDoc> {
    if (!mangaData || !Object.keys(mangaData).length) {
      throw new BadRequestException('No manga data to upload');
    }

    try {
      const newManga = await this.mangaModel.create(mangaData);
      if (!newManga) throw new NotFoundException('Failed to find manga');

      return newManga;
    } catch (error: unknown) {
      this.logger.error('Failed to upload manga', {
        error,
        operation: 'createManga',
      });
      throw error;
    }
  }

  async updateManga(
    mangaId: string,
    updateData: Partial<Manga>,
    session: ClientSession,
  ): Promise<MangaDoc> {
    if (!mangaId) throw new BadRequestException('MangaId is required');
    if (!updateData || !Object.keys(updateData).length) {
      throw new BadRequestException('Update fields are required');
    }

    try {
      const updatedManga = await this.mangaModel
        .findByIdAndUpdate(mangaId, updateData, { returnDocument: 'after' })
        .session(session)
        .exec();

      if (!updatedManga) throw new NotFoundException('Manga not found');
      return updatedManga;
    } catch (error: unknown) {
      this.logger.error('Failed to update manga', {
        error,
        operation: 'updateManga',
        mangaId,
      });
      throw error;
    }
  }

  async findAllMangas(
    paginationInput?: PaginationInput,
    sort?: SortInput,
    filters?: MangaFilterInput[],
  ): Promise<Manga[]> {
    const { page, limit } = getDefaultPagination(paginationInput);
    const sortOrder = sort?.sortBy === 'asc' ? 1 : -1;
    const sortField = sort?.field ?? 'createdAt';
    const match = this.buildMangaMatch(filters);

    try {
      const pipeline: PipelineStage[] = [];

      if (Object.keys(match).length) {
        pipeline.push({ $match: match });
      }

      pipeline.push(
        { $sort: { [sortField]: sortOrder } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'chapters',
            let: { mangaId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$mangaId', '$$mangaId'],
                  },
                },
              },
              { $count: 'count' },
            ],
            as: 'chaptersMeta',
          },
        },
        {
          $addFields: {
            chaptersCount: {
              $ifNull: [{ $arrayElemAt: ['$chaptersMeta.count', 0] }, 0],
            },
          },
        },
        { $project: { chaptersMeta: 0 } },
      );

      return await this.mangaModel.aggregate(pipeline);
    } catch (error: unknown) {
      this.logger.error('Failed to find mangas', {
        error,
        operation: 'findAllMangas',
      });
      throw error;
    }
  }

  async findMangaById(mangaId: string): Promise<MangaDoc> {
    if (!mangaId) throw new BadRequestException('Manga ID is required');

    try {
      const manga = await this.mangaModel.findById(mangaId);
      if (!manga) throw new NotFoundException('Manga not found');

      return manga;
    } catch (error: unknown) {
      this.logger.error('Failed to find manga', {
        error,
        operation: 'findMangaById',
        mangaId,
      });
      throw error;
    }
  }

  async findMangaByTitle(mangaTitle: string): Promise<MangaDoc[]> {
    if (!mangaTitle) {
      throw new BadRequestException('MangaTitle is required to search manga');
    }

    try {
      const safeTitle = escapeRegex(mangaTitle);
      const pipeline: PipelineStage[] = [
        {
          $match: {
            title: { $regex: safeTitle, $options: 'i' },
          },
        },
        {
          $lookup: {
            from: 'chapters',
            let: { mangaId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$mangaId', '$$mangaId'],
                  },
                },
              },
              { $count: 'count' },
            ],
            as: 'chaptersMeta',
          },
        },
        {
          $addFields: {
            chaptersCount: {
              $ifNull: [{ $arrayElemAt: ['$chaptersMeta.count', 0] }, 0],
            },
          },
        },
        { $project: { chaptersMeta: 0 } },
      ];

      return await this.mangaModel.aggregate(pipeline);
    } catch (error: unknown) {
      this.logger.error('Failed to find manga by title', {
        error,
        operation: 'findMangaByTitle',
        mangaTitle,
      });
      throw error;
    }
  }

  async deleteMangaById(
    mangaId: string,
    session?: ClientSession,
  ): Promise<MangaDoc> {
    if (!mangaId) throw new BadRequestException('Manga ID is required');

    try {
      const query = this.mangaModel.findByIdAndDelete(mangaId);
      if (session) query.session(session);

      const deletedManga = await query;
      if (!deletedManga) throw new NotFoundException('Manga not found');

      return deletedManga;
    } catch (error: unknown) {
      this.logger.error('Failed to delete manga', {
        error,
        operation: 'deleteMangaById',
        mangaId,
      });
      throw error;
    }
  }

  async countMangas(filters?: MangaFilterInput[]): Promise<number> {
    try {
      const match = this.buildMangaMatch(filters);
      return (await this.mangaModel.countDocuments(match)) ?? 0;
    } catch (error: unknown) {
      this.logger.error('Failed to count mangas', {
        error,
        operation: 'countMangas',
      });
      throw error;
    }
  }
}
