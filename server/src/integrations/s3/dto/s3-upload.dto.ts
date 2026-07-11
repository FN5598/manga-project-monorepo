import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum FileType {
  PREVIEW = 'PREVIEW',
  PAGE = 'PAGE',
}

export const allowedImageContentTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedImageContentType = (typeof allowedImageContentTypes)[number];

export class ChapterUploadDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsIn(allowedImageContentTypes)
  contentType!: AllowedImageContentType;

  @IsNumber()
  size!: number;

  @IsIn(Object.values(FileType))
  type!: FileType;
}

export class CreateS3UploadUrlDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fileName?: string;

  @IsOptional()
  @IsIn(allowedImageContentTypes)
  contentType?: AllowedImageContentType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mangaId?: string;

  @IsOptional()
  @IsNumber()
  mangaChapter?: number;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsIn(Object.values(FileType))
  type?: FileType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterUploadDto)
  chapters?: ChapterUploadDto[];
}
