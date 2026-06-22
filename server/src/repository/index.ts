import { IChapterRepository } from "./chapter.repository.js";
import { IGenreRepository } from "./genre.repository.js";
import { IMangaRepository } from "./manga.repository.js";
import { IPageRepository } from "./page.repository.js";
import { IUserRepository } from "./user.repository.js";

export const ChapterRepository = new IChapterRepository();
export const GenreRepository = new IGenreRepository();
export const MangaRepository = new IMangaRepository();
export const PageRepository = new IPageRepository();
export const UserRepository = new IUserRepository();
