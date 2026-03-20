import { Genre } from "@models/genre.model.js";
import { AWS_REGION, Pagination, S3_BUCKET_NAME } from "../config/constants.js";
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

function getUrlForImage(previewKey: string): string {
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
export class MangaUploadInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  author!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  previewKey!: string;

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
  ): Promise<Manga[]> {
    return await mangaRepository.findAllMangas(paginationInput);
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
    return await mangaRepository.findMangaById(mangaId);
  }

  @Mutation(() => Manga)
  async uploadManga(
    @Arg("mangaUploadInput", () => MangaUploadInput)
    mangaUploadInput: MangaUploadInput,
  ): Promise<Manga> {
    return mangaRepository.uploadManga(mangaUploadInput);
  }
}
