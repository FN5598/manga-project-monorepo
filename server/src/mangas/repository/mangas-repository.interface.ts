import type { ClientSession } from 'mongoose';
import type { MangaUploadInput } from '@mangas/dto/manga-inputs.dto';
import type { Manga, MangaDoc } from '@mangas/entities/mangas.entity';
import type {
  MangaFilterInput,
  PaginationInput,
  SortInput,
} from '@shared/utils/resource.utils';

export interface IMangasRepository {
  createManga(mangaData: MangaUploadInput): Promise<MangaDoc>;
  updateManga(
    mangaId: string,
    updateData: Partial<Manga>,
    session: ClientSession,
  ): Promise<MangaDoc>;
  findAllMangas(
    paginationInput?: PaginationInput,
    sort?: SortInput,
    filters?: MangaFilterInput[],
  ): Promise<Manga[]>;
  findMangaById(mangaId: string): Promise<MangaDoc>;
  findMangaByTitle(mangaTitle: string): Promise<MangaDoc[]>;
  deleteMangaById(mangaId: string, session?: ClientSession): Promise<MangaDoc>;
  countMangas(filters?: MangaFilterInput[]): Promise<number>;
}
