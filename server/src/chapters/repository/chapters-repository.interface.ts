import type { ClientSession } from 'mongoose';
import type { ChapterDoc } from '@chapters/entities/chapter.entity';
import type { PaginationInput, SortInput } from '@shared/utils/resource.utils';
import type { CreateChapterDto } from '@chapters/dto/create-chapter-repository.dto';

export interface DeleteChaptersResult {
  deletedCount: number;
  deletedIds: string[];
}

export interface IChaptersRepository {
  createChapter(
    payload: CreateChapterDto,
    session: ClientSession,
  ): Promise<ChapterDoc>;
  findChaptersByMangaId(mangaId: string): Promise<ChapterDoc[]>;
  findAllChapters(
    sort?: SortInput,
    paginationInput?: PaginationInput,
  ): Promise<ChapterDoc[]>;
  findChapterById(chapterId: string): Promise<ChapterDoc>;
  deleteChaptersByMangaId(
    mangaId: string,
    session: ClientSession,
  ): Promise<DeleteChaptersResult>;
}
