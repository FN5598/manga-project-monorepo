import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { connectToMongo } from '@shared/config/database';
import { connectToGraphQL } from '@shared/graphql/graphql.config';
import { MangasModule } from './mangas/mangas.module';
import { ChaptersModule } from './chapters/chapters.module';
import { S3Module } from 'src/integrations/s3/s3.module';
import { PagesModule } from './pages/pages.module';
import { GenresModule } from './genres/genres.module';
import { GuardModule } from '@shared/guard/guard.module';

@Module({
  imports: [
    connectToMongo(),
    connectToGraphQL(),
    AuthModule,
    UsersModule,
    MangasModule,
    ChaptersModule,
    S3Module,
    PagesModule,
    GenresModule,
    GuardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
