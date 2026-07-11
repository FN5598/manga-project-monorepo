import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { ClientSession, Model, PipelineStage } from 'mongoose';
import { Types } from 'mongoose';
import { Page, PageDoc } from '@pages/entities/page.entity';
import type {
  DeletePagesResult,
  IPagesRepository,
} from '@pages/repository/pages-repository.interface';
import type { CreatePagesDto } from '@pages/dto/create-pages.dto';
import {
  PaginationInput,
  SortInput,
  getDefaultPagination,
} from '@shared/utils/resource.utils';

@Injectable()
export class PagesRepository implements IPagesRepository {
  private readonly logger = new Logger(PagesRepository.name);

  constructor(
    @InjectModel(Page.name)
    private readonly pageModel: Model<PageDoc>,
  ) {}

  async createPages(
    payload: CreatePagesDto,
    session: ClientSession,
  ): Promise<PageDoc[]> {
    const { chapterId, pages } = payload;

    if (!chapterId) throw new BadRequestException('Chapter id is required');
    if (!Array.isArray(pages) || pages.length <= 0) {
      throw new BadRequestException('Invalid pages payload');
    }

    const pagesToUpload = pages.map((page, index) => ({
      chapter: new Types.ObjectId(chapterId),
      imageKey: page.imageKey,
      fileSize: page.fileSize,
      pageNumber: index + 1,
    }));

    try {
      return await this.pageModel.insertMany(pagesToUpload, { session });
    } catch (error: unknown) {
      this.logger.error('Failed to create pages', {
        error,
        operation: 'createPages',
      });
      throw error;
    }
  }

  async getPagesByChapterId(
    chapterId: string,
    pagination?: PaginationInput,
    sort?: SortInput,
  ): Promise<PageDoc[]> {
    if (!chapterId) {
      throw new BadRequestException('ChapterId is required to fetch pages');
    }

    const { limit, page } = getDefaultPagination(pagination);
    const sortBy = sort?.sortBy === 'asc' ? 1 : -1;
    const sortField = sort?.field ?? 'createdAt';

    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            chapter: new Types.ObjectId(chapterId),
          },
        },
        {
          $sort: {
            [sortField]: sortBy,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ];

      return await this.pageModel.aggregate(pipeline);
    } catch (error: unknown) {
      this.logger.error('Failed to get pages for chapter', {
        error,
        operation: 'getPagesByChapterId',
        chapterId,
      });
      throw error;
    }
  }

  async deletePagesByChapterIds(
    chapterIds: string[],
    session: ClientSession,
  ): Promise<DeletePagesResult> {
    if (!Array.isArray(chapterIds) || chapterIds.length <= 0) {
      throw new BadRequestException('ChapterIds must be a valid input');
    }

    try {
      const deletedPages = await this.pageModel
        .find({ chapter: { $in: chapterIds } })
        .select('_id')
        .lean()
        .session(session);

      const deleteResponse = await this.pageModel
        .deleteMany({ chapter: { $in: chapterIds } })
        .session(session);

      return {
        deletedCount: deleteResponse.deletedCount ?? 0,
        deletedPageIds: deletedPages.map((page) => String(page._id)),
      };
    } catch (error: unknown) {
      this.logger.error('Failed to delete pages by chapterIds', {
        error,
        operation: 'deletePagesByChapterIds',
        chapterIds,
      });
      throw error;
    }
  }
}
