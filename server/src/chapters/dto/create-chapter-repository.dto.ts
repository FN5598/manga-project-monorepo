import { IsInt, IsMongoId, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateChapterDto {
  @IsMongoId()
  mangaId!: string;

  @IsInt()
  @Min(1)
  chapterNumber!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  chapterPrefix!: string;

  @IsInt()
  @Min(1)
  pageCount!: number;
}
