import { Controller, Get, Param, Query } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('chapter/:chapterId')
  getPagesByChapterId(
    @Param('chapterId') chapterId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.pagesService.getPagesByChapterId(chapterId, {
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
    });
  }
}
