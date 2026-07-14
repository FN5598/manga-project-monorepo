import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './entities/genre.entity';
import { GenresRepository } from '@genres/repository/genres.repository';
import { GenresResolver } from './genres.resolver';
import { GenresService } from './genres.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  controllers: [],
  providers: [GenresService, GenresRepository, GenresResolver],
  exports: [GenresRepository, GenresService],
})
export class GenresModule {}
