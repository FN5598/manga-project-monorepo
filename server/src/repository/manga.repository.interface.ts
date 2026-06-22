import { Manga } from "@models/manga.model.js";
import {
  MangaFilterTypes,
  MangaUploadInput,
  PaginationInput,
  SortInputType,
} from "@resolvers/resolver.utils.js";
import { ClientSession } from "mongoose";

export interface IMangaInterface {
  updateManga(
    mangaId: string,
    updateData: Partial<Manga>,
    session: ClientSession,
  ): Promise<Manga>;

  createManga(mangaData: MangaUploadInput): Promise<Manga>;

  findAllMangas(
    paginationInput?: PaginationInput | undefined,
    sort?: SortInputType,
    filters?: MangaFilterTypes[],
  ): Promise<Manga[] | []>;

  findMangaById(mangaId: string): Promise<Manga>;

  deleteMangaById(mangaId: string, session?: ClientSession): Promise<Manga>;

  findMangaByTitle(mangaTitle: string): Promise<Manga[]>;

  countMangas(filters?: MangaFilterTypes[]): Promise<number>;
}
