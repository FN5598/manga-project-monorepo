import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Manga } from './entities/mangas.entity';
import { MangasService } from './mangas.service';
import {
  MangaFilterInput,
  PaginationInput,
  SortInput,
} from '@shared/utils/resource.utils';
import { MangaUploadInput } from './dto/manga-inputs.dto';
import { UserRole } from '../users/entities/user-entity.types';
import { S3Service } from 'src/integrations/s3/s3.service';
import { AuthGuard } from '@shared/guard/auth-guard';

@Resolver(() => Manga)
export class MangasResolver {
  constructor(
    private readonly mangasService: MangasService,
    private readonly s3Service: S3Service,
  ) {}

  @Query(() => [Manga])
  findAllMangas(
    @Args('paginationInput', { nullable: true })
    paginationInput?: PaginationInput,
    @Args('sort', { nullable: true }) sort?: SortInput,
    @Args('filters', { nullable: true, type: () => [MangaFilterInput] })
    filters?: MangaFilterInput[],
  ) {
    return this.mangasService.findAll(paginationInput, sort, filters);
  }

  @Query(() => Manga)
  findMangaById(@Args('mangaId') mangaId: string) {
    return this.mangasService.findOne(mangaId);
  }

  @Query(() => [Manga])
  findMangaByName(@Args('mangaTitle') mangaTitle: string) {
    return this.mangasService.findByTitle(mangaTitle);
  }

  @Query(() => Number)
  countMangas(
    @Args('filters', { nullable: true, type: () => [MangaFilterInput] })
    filters?: MangaFilterInput[],
  ) {
    return this.mangasService.count(filters);
  }

  @Mutation(() => Manga)
  @UseGuards(AuthGuard(UserRole.ADMIN))
  uploadManga(@Args('mangaUploadInput') mangaUploadInput: MangaUploadInput) {
    return this.mangasService.create(mangaUploadInput);
  }

  @Mutation(() => Manga)
  @UseGuards(AuthGuard(UserRole.ADMIN))
  deleteManga(@Args('mangaId') mangaId: string) {
    return this.mangasService.remove(mangaId);
  }

  @ResolveField(() => String, { nullable: true })
  previewUrl(@Parent() manga: Manga) {
    if (!manga.previewKey) return null;
    return this.s3Service.getUrlForKey(manga.previewKey);
  }
}
