import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { MangasRepository } from '@mangas/repository/mangas.repository';
import { MangaUploadInput, UpdateMangaBodyDto } from './dto/manga-inputs.dto';
import { ChaptersRepository } from '@chapters/repository/chapters.repository';
import { PagesRepository } from '@pages/repository/pages.repository';
import {
  MangaFilterInput,
  PaginationInput,
  SortInput,
} from '@shared/utils/resource.utils';
import { S3Service } from 'src/integrations/s3/s3.service';

@Injectable()
export class MangasService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly mangasRepository: MangasRepository,
    private readonly chaptersRepository: ChaptersRepository,
    private readonly pagesRepository: PagesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(mangaData: MangaUploadInput) {
    return this.mangasRepository.createManga(mangaData);
  }

  findAll(
    paginationInput?: PaginationInput,
    sort?: SortInput,
    filters?: MangaFilterInput[],
  ) {
    return this.mangasRepository.findAllMangas(paginationInput, sort, filters);
  }

  findOne(id: string) {
    return this.mangasRepository.findMangaById(id);
  }

  findByTitle(title: string) {
    return this.mangasRepository.findMangaByTitle(title);
  }

  count(filters?: MangaFilterInput[]) {
    return this.mangasRepository.countMangas(filters);
  }

  async update(body: UpdateMangaBodyDto) {
    const session = await this.connection.startSession();

    try {
      let chapterId: string | null = null;

      await session.withTransaction(async () => {
        const updatedManga = await this.mangasRepository.updateManga(
          body.manga._id,
          { previewKey: body.manga.previewKey },
          session,
        );

        const chapterPrefix =
          body.pages[0].imageKey.split('/').slice(0, -1).join('/') + '/';

        const chapter = await this.chaptersRepository.createChapter(
          {
            mangaId: String(updatedManga._id),
            pageCount: body.pages.length,
            chapterPrefix,
            ...body.chapter,
          },
          session,
        );

        await this.pagesRepository.createPages(
          {
            chapterId: String(chapter._id),
            pages: body.pages.map((page) => ({
              imageKey: page.imageKey,
              fileSize: page.fileSize,
            })),
          },
          session,
        );

        chapterId = String(chapter._id);
      });

      return {
        message: 'Successfully updated manga',
        mangaId: body.manga._id,
        chapterId,
      };
    } finally {
      await session.endSession();
    }
  }

  async remove(id: string) {
    const session = await this.connection.startSession();

    try {
      let deletedManga: Awaited<
        ReturnType<MangasRepository['deleteMangaById']>
      >;

      await session.withTransaction(async () => {
        deletedManga = await this.mangasRepository.deleteMangaById(id, session);

        const deletedChapters =
          await this.chaptersRepository.deleteChaptersByMangaId(id, session);

        await this.pagesRepository.deletePagesByChapterIds(
          deletedChapters.deletedIds,
          session,
        );
      });

      const mangaFolder = `mangas/${deletedManga!._id.toString()}/`;
      const previewFolder = deletedManga!.previewKey
        ? deletedManga!.previewKey.split('/').slice(0, -1).join('/') + '/'
        : null;

      await this.s3Service.deleteFolder(mangaFolder);
      if (previewFolder) await this.s3Service.deleteFolder(previewFolder);

      return deletedManga!;
    } finally {
      await session.endSession();
    }
  }
}
