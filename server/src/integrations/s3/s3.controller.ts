import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@shared/guard/auth-guard';
import { UserRole } from '@users/entities/user-entity.types';
import { CreateS3UploadUrlDto } from './dto/s3-upload.dto';
import { S3Service } from './s3.service';

@Controller(['api/uploads', 'uploads'])
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('sign-url')
  @UseGuards(AuthGuard(UserRole.ADMIN))
  createUploadUrls(
    @Body() body: CreateS3UploadUrlDto,
    @Query('manga') manga?: string,
    @Query('chapter') chapter?: string,
  ) {
    return this.s3Service.createUploadUrls(body, {
      isMangaUpload: this.parseBooleanQuery(manga),
      isChapterUpload: this.parseBooleanQuery(chapter),
    });
  }

  private parseBooleanQuery(value: unknown): boolean {
    return value === 'true' || value === '1';
  }
}
