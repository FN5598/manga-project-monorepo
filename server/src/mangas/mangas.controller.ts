import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MangasService } from './mangas.service';
import { UpdateMangaBodyDto, UploadMangaBodyDto } from './dto/manga-inputs.dto';

@Controller(['manga', 'mangas'])
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Post('upload-chapter')
  async create(@Body() body: UploadMangaBodyDto) {
    const mangaData = await this.mangasService.create(body.mangaData);

    return {
      message: 'Uploaded manga successfully',
      mangaData,
    };
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.mangasService.findAll({
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangasService.findOne(id);
  }

  @Put('update-manga')
  update(@Body() body: UpdateMangaBodyDto) {
    return this.mangasService.update(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mangasService.remove(id);
  }
}
