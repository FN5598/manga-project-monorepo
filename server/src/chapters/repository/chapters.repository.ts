import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ClientSession, Model, PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { Chapter, ChapterDoc } from '@chapters/entities/chapter.entity';
import { UploadStatus } from '@chapters/entities/chapter.types';
import type {
  DeleteChaptersResult,
  IChaptersRepository,
} from '@chapters/repository/chapters-repository.interface';
import type { CreateChapterDto } from '@chapters/dto/create-chapter-repository.dto';
import {
  PaginationInput,
  SortInput,
  getDefaultPagination,
} from '@shared/utils/resource.utils';

@Injectable()
export class ChaptersRepository implements IChaptersRepository {
  private readonly logger = new Logger(ChaptersRepository.name);

  constructor(
    @InjectModel(Chapter.name)
    private readonly chapterModel: Model<ChapterDoc>,
  ) {}

  async createChapter(
    payload: CreateChapterDto,
    session: ClientSession,
  ): Promise<ChapterDoc> {
    const { chapterNumber, title, chapterPrefix, pageCount, mangaId } = payload;

    if (chapterNumber == null || chapterNumber < 1) {
      throw new BadRequestException('Invalid chapterNumber');
    }
    if (!mangaId) throw new BadRequestException('mangaId is required');
    if (typeof title !== 'string' || !title.trim()) {
      throw new BadRequestException('Invalid title');
    }
    if (typeof chapterPrefix !== 'string' || !chapterPrefix.trim()) {
      throw new BadRequestException('Invalid chapterPrefix');
    }
    if (pageCount == null || pageCount < 1) {
      throw new BadRequestException('Invalid pageCount');
    }

    try {
      const existingChapter = await this.chapterModel
        .findOne({ mangaId, chapterNumber })
        .session(session);

      if (existingChapter) {
        throw new ConflictException(`Chapter ${chapterNumber} already exists`);
      }

      const [createdChapter] = await this.chapterModel.create(
        [
          {
            chapterNumber,
            title,
            storagePrefix: chapterPrefix,
            pageCount,
            uploadStatus: UploadStatus.READY,
            mangaId,
          },
        ],
        { session },
      );

      if (!createdChapter) throw new NotFoundException('Chapter not found');
      return createdChapter;
    } catch (error: unknown) {
      this.logger.error('Failed to create a chapter', {
        error,
        operation: 'createChapter',
      });
      throw error;
    }
  }

  async findChaptersByMangaId(mangaId: string): Promise<ChapterDoc[]> {
    if (!mangaId) throw new BadRequestException('MangaId is required');

    try {
      const pipeline: PipelineStage[] = [
        {
          $match: { mangaId: new Types.ObjectId(mangaId) },
        },
      ];

      const chapters = await this.chapterModel.aggregate<ChapterDoc>(pipeline);

      if (chapters.length <= 0) {
        throw new NotFoundException('Chapters not found');
      }

      return chapters;
    } catch (error: unknown) {
      this.logger.error('Failed to find chapters for manga', {
        error,
        operation: 'findChaptersByMangaId',
        mangaId,
      });
      throw error;
    }
  }

  async findAllChapters(
    sort?: SortInput,
    paginationInput?: PaginationInput,
  ): Promise<ChapterDoc[]> {
    const { page, limit } = getDefaultPagination(paginationInput);
    const sortOrder = sort?.sortBy === 'asc' ? 1 : -1;

    try {
      const chapters = await this.chapterModel
        .find()
        .sort({ updatedAt: sortOrder })
        .limit(limit)
        .skip((page - 1) * limit);

      if (!chapters.length) throw new NotFoundException('Chapters not found');

      return chapters;
    } catch (error: unknown) {
      this.logger.error('Failed to find all chapters', {
        error,
        operation: 'findAllChapters',
      });
      throw error;
    }
  }

  async findChapterById(chapterId: string): Promise<ChapterDoc> {
    if (!chapterId) throw new BadRequestException('Chapter ID is required');

    try {
      const chapter = await this.chapterModel.findById(chapterId);
      if (!chapter) throw new NotFoundException('Chapter not found');

      return chapter;
    } catch (error: unknown) {
      this.logger.error('Failed to find chapter by id', {
        error,
        operation: 'findChapterById',
        chapterId,
      });
      throw error;
    }
  }

  async deleteChaptersByMangaId(
    mangaId: string,
    session: ClientSession,
  ): Promise<DeleteChaptersResult> {
    if (!mangaId) throw new BadRequestException('MangaId is required');

    try {
      const deletedChapters = await this.chapterModel
        .find({ mangaId })
        .select('_id')
        .lean()
        .session(session);

      const deleteResponse = await this.chapterModel
        .deleteMany({ mangaId })
        .session(session);

      return {
        deletedCount: deleteResponse.deletedCount ?? 0,
        deletedIds: deletedChapters.map((chapter) => String(chapter._id)),
      };
    } catch (error: unknown) {
      this.logger.error('Failed to delete chapters', {
        error,
        operation: 'deleteChaptersByMangaId',
        mangaId,
      });
      throw error;
    }
  }
}
