import type { ClientSession } from 'mongoose';
import type { PageDoc } from '@pages/entities/page.entity';
import type { PaginationInput, SortInput } from '@shared/utils/resource.utils';
import type { CreatePagesDto } from '@pages/dto/create-pages.dto';

export interface DeletePagesResult {
  deletedCount: number;
  deletedPageIds: string[];
}

export interface IPagesRepository {
  createPages(
    payload: CreatePagesDto,
    session: ClientSession,
  ): Promise<PageDoc[]>;
  getPagesByChapterId(
    chapterId: string,
    pagination?: PaginationInput,
    sort?: SortInput,
  ): Promise<PageDoc[]>;
  deletePagesByChapterIds(
    chapterIds: string[],
    session: ClientSession,
  ): Promise<DeletePagesResult>;
}
