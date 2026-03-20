import { AWS_REGION, Pagination, S3_BUCKET_NAME } from "../config/constants.js";
import * as mangaRepository from "../repository/manga.repository.js";

type MangaUploadInput = {
  title: string;
  description: string;
  author: string;
  coverImageUrl: string;
  genres: string[];
  chaptersCount: number;
};

function getUrlForImage(imageKey: string): string {
  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${imageKey.split("/").map(encodeURIComponent).join("/")}`;
}

export const uploadMangaResolver = async (
  _: any,
  { mangaUploadInput }: { mangaUploadInput: Partial<MangaUploadInput> },
) => {
  return mangaRepository.uploadManga(mangaUploadInput);
};

export const findMangaByIdResolver = async (
  _: any,
  { mangaId }: { mangaId: string },
) => {
  return await mangaRepository.findMangaById(mangaId);
};

export const findAllMangasResolver = async (
  _: any,
  { paginationInput }: { paginationInput: Pagination },
) => {
  const mangas = await mangaRepository.findAllMangas(paginationInput);

  const result = mangas.map((manga) => ({
    ...manga,
    previewUrl: getUrlForImage(manga.imageKey),
  }));

  return result;
};
