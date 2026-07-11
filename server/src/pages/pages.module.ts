import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { Page, PageSchema } from './entities/page.entity';
import { PagesRepository } from '@pages/repository/pages.repository';
import { PagesResolver } from './pages.resolver';
import { S3Module } from 'src/integrations/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    S3Module,
  ],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository, PagesResolver],
  exports: [PagesRepository, PagesService],
})
export class PagesModule {}
