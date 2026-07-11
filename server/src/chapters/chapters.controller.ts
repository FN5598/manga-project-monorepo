import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { AddChapterToMangaDto } from './dto/create-chapter.dto';

@Controller(['api/chapter', 'chapters'])
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post('create-chapter')
  addChapterToManga(@Body() body: AddChapterToMangaDto) {
    return this.chaptersService.addChapterToManga(body);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.chaptersService.findAllChapters(undefined, {
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
    });
  }

  @Get('manga/:mangaId')
  findChaptersByMangaId(@Param('mangaId') mangaId: string) {
    return this.chaptersService.findChaptersByMangaId(mangaId);
  }

  @Get(':chapterId')
  findChapterById(@Param('chapterId') chapterId: string) {
    return this.chaptersService.findChapterById(chapterId);
  }
}
