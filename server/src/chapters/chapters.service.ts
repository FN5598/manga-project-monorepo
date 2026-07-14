import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { ChaptersRepository } from '@chapters/repository/chapters.repository';
import { AddChapterToMangaDto } from './dto/create-chapter.dto';
import { PagesRepository } from '@pages/repository/pages.repository';
import { PaginationInput, SortInput } from '@shared/utils/resource.utils';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly chaptersRepository: ChaptersRepository,
    private readonly pagesRepository: PagesRepository,
  ) {}

  async addChapterToManga(payload: AddChapterToMangaDto) {
    const session = await this.connection.startSession();

    try {
      let chapterId: string | null = null;

      await session.withTransaction(async () => {
        const chapterPrefix =
          payload.pages[0].imageKey.split('/').slice(0, -1).join('/') + '/';

        const chapter = await this.chaptersRepository.createChapter(
          {
            mangaId: payload.mangaId,
            chapterNumber: payload.chapterNumber,
            title: payload.chapterTitle,
            chapterPrefix,
            pageCount: payload.pages.length,
          },
          session,
        );

        await this.pagesRepository.createPages(
          {
            chapterId: String(chapter._id),
            pages: payload.pages.map((page) => ({
              imageKey: page.imageKey,
              fileSize: page.fileSize,
            })),
          },
          session,
        );

        chapterId = String(chapter._id);
      });

      return {
        message: 'Successfully created new chapter',
        chapterId,
      };
    } finally {
      await session.endSession();
    }
  }

  findChaptersByMangaId(mangaId: string) {
    return this.chaptersRepository.findChaptersByMangaId(mangaId);
  }

  findChapterById(chapterId: string) {
    return this.chaptersRepository.findChapterById(chapterId);
  }

  findAllChapters(sort?: SortInput, paginationInput?: PaginationInput) {
    return this.chaptersRepository.findAllChapters(sort, paginationInput);
  }
}
