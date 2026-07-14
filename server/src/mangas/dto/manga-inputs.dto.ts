import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MangaStatus } from '../entities/manga.types';

@InputType()
export class MangaUploadInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  author!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  genres?: string[];

  @Field(() => MangaStatus)
  @IsEnum(MangaStatus)
  status!: MangaStatus;
}

@InputType()
export class UploadMangaBodyDto {
  @Field(() => MangaUploadInput)
  @ValidateNested()
  @Type(() => MangaUploadInput)
  mangaData!: MangaUploadInput;
}

@InputType()
export class UpdateMangaInfoInput {
  @Field(() => String)
  @IsMongoId()
  _id!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  previewKey!: string;
}

@InputType()
export class UpdateMangaChapterInput {
  @Field(() => Number)
  @IsInt()
  @Min(1)
  chapterNumber!: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  title!: string;
}

@InputType()
export class PageUploadInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  imageKey!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  fileName?: string;

  @Field(() => Number)
  @IsInt()
  @Min(0)
  fileSize!: number;
}

@InputType()
export class UpdateMangaBodyDto {
  @Field(() => UpdateMangaInfoInput)
  @ValidateNested()
  @Type(() => UpdateMangaInfoInput)
  manga!: UpdateMangaInfoInput;

  @Field(() => UpdateMangaChapterInput)
  @ValidateNested()
  @Type(() => UpdateMangaChapterInput)
  chapter!: UpdateMangaChapterInput;

  @Field(() => [PageUploadInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageUploadInput)
  pages!: PageUploadInput[];
}
