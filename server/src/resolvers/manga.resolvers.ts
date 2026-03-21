import {
  AWS_REGION,
  Pagination,
  S3_BUCKET_NAME,
  SortInput,
} from "../config/constants.js";
import * as mangaRepository from "../repository/manga.repository.js";
import { Manga } from "@models/manga.model.js";
import {
  Arg,
  Field,
  InputType,
  Query,
  Resolver,
  Int,
  Mutation,
  FieldResolver,
  Root,
} from "type-graphql";
import * as resolversUtils from "./manga.resolvers.utils.js";
import { sanitizeS3PathPart } from "@controllers/uploadS3URL.controller.js";
import logger from "@config/logger.js";

export function getUrlForImage(previewKey: string): string {
  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${previewKey.split("/").map(encodeURIComponent).join("/")}`;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class SortInputType {
  @Field(() => String, { nullable: true })
  sortBy?: "asc" | "desc";
}

@InputType()
export class MangaUploadInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  author!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  genres?: string[];

  @Field(() => String)
  status!: string;
}

@Resolver(() => Manga)
export class MangaResolver {
  @Query(() => [Manga])
  async findAllMangas(
    @Arg("paginationInput", () => PaginationInput, { nullable: true })
    paginationInput?: PaginationInput,
    @Arg("sort", () => SortInputType, { nullable: true })
    sort?: SortInput,
  ): Promise<Manga[]> {
    logger.debug("findAllMangas resolver called", {
      paginationInput,
      sort,
    });
    return await mangaRepository.findAllMangas(paginationInput, sort);
  }

  @FieldResolver(() => String, { nullable: true })
  previewUrl(@Root() manga: Manga): string | null {
    if (!manga.previewKey) return null;
    return getUrlForImage(manga.previewKey);
  }

  @Query(() => Manga)
  async findMangaById(
    @Arg("mangaId", () => String)
    mangaId: string,
  ): Promise<Manga> {
    logger.debug("FindMangaById resolver called", {
      mangaId,
    });
    return await mangaRepository.findMangaById(mangaId);
  }

  @Mutation(() => Manga)
  async uploadManga(
    @Arg("mangaUploadInput", () => MangaUploadInput)
    mangaUploadInput: MangaUploadInput,
  ): Promise<Manga> {
    logger.debug("uploadManga resolver called", {
      mangaUploadInput,
    });
    return mangaRepository.uploadManga(mangaUploadInput);
  }

  @Mutation(() => Manga)
  async deleteManga(
    @Arg("mangaId", () => String) mangaId: string,
  ): Promise<Manga> {
    // 1. Delete manga from DB
    const deletedManga = await mangaRepository.deleteMangaById(mangaId);

    const safeMangaTitle = sanitizeS3PathPart(deletedManga.title);

    const mangaFolder = `mangas/${safeMangaTitle}/`;
    const previewFolder = deletedManga.previewKey
      ? deletedManga.previewKey.split("/").slice(0, -1).join("/") + "/"
      : null;

    // 2. Delete whole manga folder
    await resolversUtils.deleteFolderFromS3(mangaFolder);

    // 3. Delete Preview folder
    if (previewFolder) {
      await resolversUtils.deleteFolderFromS3(previewFolder);
    }
    logger.debug("deleteManga resolver called", {
      mangaId,
    });
    return deletedManga;
  }
}
