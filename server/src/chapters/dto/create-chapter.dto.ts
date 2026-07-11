import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageUploadInput } from '../../mangas/dto/manga-inputs.dto';

@InputType()
export class AddChapterToMangaDto {
  @Field(() => String)
  @IsMongoId()
  mangaId!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  chapterTitle!: string;

  @Field(() => Number)
  @IsInt()
  @Min(1)
  chapterNumber!: number;

  @Field(() => [PageUploadInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageUploadInput)
  pages!: PageUploadInput[];
}
