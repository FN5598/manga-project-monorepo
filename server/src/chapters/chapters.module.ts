import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter, ChapterSchema } from './entities/chapter.entity';
import { ChaptersRepository } from '@chapters/repository/chapters.repository';
import { PagesModule } from '../pages/pages.module';
import { ChaptersResolver } from './chapters.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    PagesModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, ChaptersRepository, ChaptersResolver],
  exports: [ChaptersRepository, ChaptersService],
})
export class ChaptersModule {}
