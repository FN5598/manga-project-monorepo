import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';
import { Manga, MangaSchema } from './entities/mangas.entity';
import { MangasRepository } from '@mangas/repository/mangas.repository';
import { ChaptersModule } from '../chapters/chapters.module';
import { PagesModule } from '../pages/pages.module';
import { S3Module } from 'src/integrations/s3/s3.module';
import { MangasResolver } from './mangas.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
    ChaptersModule,
    PagesModule,
    S3Module,
  ],
  controllers: [MangasController],
  providers: [MangasService, MangasRepository, MangasResolver],
  exports: [MangasRepository, MangasService],
})
export class MangasModule {}
