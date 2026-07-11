import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  imageKey!: string;

  @IsInt()
  @Min(0)
  fileSize!: number;
}

export class CreatePagesDto {
  @IsMongoId()
  chapterId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePageDto)
  pages!: CreatePageDto[];
}
