import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  PayloadTooLargeException,
} from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import {
  allowedImageContentTypes,
  type AllowedImageContentType,
  CreateS3UploadUrlDto,
  FileType,
} from './dto/s3-upload.dto';

const MAX_PREVIEW_SIZE = 500 * 1024;
const SIGNED_URL_EXPIRES_IN_SECONDS = 300;

type UploadMode = {
  isMangaUpload: boolean;
  isChapterUpload: boolean;
};

type UploadedFileResponse = {
  fileName: string;
  key: string;
  uploadUrl: string;
  contentType: AllowedImageContentType;
  size: number;
  type?: FileType;
};

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client(this.createS3ClientConfig());
  }

  async createUploadUrls(body: CreateS3UploadUrlDto, mode: UploadMode) {
    this.validateUploadMode(mode);

    const {
      fileName,
      contentType,
      mangaId,
      mangaChapter,
      size,
      type,
      chapters = [],
    } = body;

    if (!mangaId || mangaChapter == null) {
      throw new BadRequestException('mangaId and mangaChapter are required');
    }

    this.validateChapterUploads(chapters);

    const chapterUploads = await Promise.all(
      chapters.map((chapter) =>
        this.createFileUploadResponse({
          fileName: chapter.fileName,
          contentType: chapter.contentType,
          size: chapter.size,
          type: chapter.type,
          mangaId,
          mangaChapter,
        }),
      ),
    );

    if (mode.isChapterUpload) {
      this.logger.debug('Created chapter-only S3 upload URLs', {
        mangaId,
        mangaChapter,
        chapterCount: chapterUploads.length,
      });

      return {
        message: 'Successfully generated chapter upload URLs',
        chapters: chapterUploads,
      };
    }

    if (!fileName || !contentType || size == null || !type) {
      throw new BadRequestException(
        'For manga upload, fileName, contentType, size, type, mangaId, mangaChapter and chapters are required',
      );
    }

    this.validateContentType(contentType);

    if (type === FileType.PREVIEW && size > MAX_PREVIEW_SIZE) {
      throw new PayloadTooLargeException('Preview file too large');
    }

    const preview = await this.createFileUploadResponse({
      fileName,
      contentType,
      size,
      type: FileType.PREVIEW,
      mangaId,
      mangaChapter,
    });

    this.logger.debug('Created manga S3 upload URLs', {
      previewKey: preview.key,
      chapterCount: chapterUploads.length,
    });

    return {
      message: 'Successfully generated upload URLs',
      preview,
      chapters: chapterUploads,
    };
  }

  getUrlForKey(key: string): string {
    const encodedKey = key.split('/').map(encodeURIComponent).join('/');
    const bucketName = this.getBucketName();
    const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT;
    const region = this.getRegion();

    if (process.env.NODE_ENV === 'production') {
      return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedKey}`;
    }

    if (publicEndpoint) {
      return `${publicEndpoint}/${bucketName}/${encodedKey}`;
    }

    return encodedKey;
  }

  async deleteFolder(prefix: string): Promise<void> {
    if (!prefix) {
      throw new BadRequestException('S3 prefix is required');
    }

    let continuationToken: string | undefined;

    try {
      do {
        const listed = await this.s3Client.send(
          new ListObjectsV2Command({
            Bucket: this.getBucketName(),
            Prefix: prefix,
            ContinuationToken: continuationToken,
          }),
        );

        const keys =
          listed.Contents?.map((object) => object.Key).filter(
            (key): key is string => Boolean(key),
          ) ?? [];

        await this.deleteMany(keys);

        continuationToken = listed.IsTruncated
          ? listed.NextContinuationToken
          : undefined;
      } while (continuationToken);
    } catch (error: unknown) {
      this.logger.error('Failed to delete folder from S3', {
        error,
        prefix,
        operation: 'deleteFolder',
      });
      throw error;
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (!keys.length) return;

    try {
      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: this.getBucketName(),
          Delete: {
            Objects: keys.map((Key) => ({ Key })),
          },
        }),
      );

      this.logger.debug('Deleted multiple objects from S3', {
        keys,
        bucket: this.getBucketName(),
      });
    } catch (error: unknown) {
      this.logger.error('Failed to delete many files from S3', {
        error,
        operation: 'deleteMany',
        keys,
      });
      throw error;
    }
  }

  private async createFileUploadResponse(input: {
    fileName: string;
    contentType: AllowedImageContentType;
    size: number;
    type: FileType;
    mangaId: string;
    mangaChapter: number;
  }): Promise<UploadedFileResponse> {
    this.validateContentType(input.contentType);

    const extension = this.getExtension(input.fileName) ?? 'bin';
    const key = `${this.getPrefix(input.type)}/${this.sanitizeS3PathPart(
      input.mangaId,
    )}/${input.mangaChapter}/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.getBucketName(),
      Key: key,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: SIGNED_URL_EXPIRES_IN_SECONDS,
    });

    return {
      fileName: input.fileName,
      key,
      uploadUrl,
      contentType: input.contentType,
      size: input.size,
      type: input.type,
    };
  }

  private createS3ClientConfig(): S3ClientConfig {
    const sharedConfig: S3ClientConfig = {
      region: this.getRegion(),
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    };

    const endpoint =
      process.env.NODE_ENV === 'production'
        ? process.env.S3_ENDPOINT
        : (process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT);

    if (endpoint) {
      sharedConfig.endpoint = endpoint;
    }

    sharedConfig.forcePathStyle = this.parseBooleanEnv(
      process.env.S3_FORCE_PATH_STYLE,
    );

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (
      process.env.NODE_ENV !== 'production' &&
      accessKeyId &&
      secretAccessKey
    ) {
      sharedConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    return sharedConfig;
  }

  private validateUploadMode(mode: UploadMode): void {
    if (!mode.isMangaUpload && !mode.isChapterUpload) {
      throw new BadRequestException(
        'Provide one upload mode: ?manga=true or ?chapter=true',
      );
    }

    if (mode.isMangaUpload && mode.isChapterUpload) {
      throw new BadRequestException('Use only one upload mode at a time');
    }
  }

  private validateChapterUploads(
    chapters: CreateS3UploadUrlDto['chapters'],
  ): void {
    if (!Array.isArray(chapters)) {
      throw new BadRequestException('Chapters must be an array');
    }

    for (const chapter of chapters) {
      if (
        !chapter.fileName ||
        !chapter.contentType ||
        chapter.size == null ||
        !chapter.type
      ) {
        throw new BadRequestException('Invalid chapter data');
      }

      this.validateContentType(chapter.contentType);
    }
  }

  private validateContentType(contentType: string): void {
    if (
      !allowedImageContentTypes.includes(contentType as AllowedImageContentType)
    ) {
      throw new BadRequestException('Unsupported image file type');
    }
  }

  private sanitizeS3PathPart(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
  }

  private getExtension(fileName?: string): string | null {
    if (!fileName) return null;

    const lastDot = fileName.lastIndexOf('.');
    if (lastDot <= 0 || lastDot === fileName.length - 1) return null;

    return fileName.slice(lastDot + 1).toLowerCase();
  }

  private getPrefix(type: FileType): string {
    switch (type) {
      case FileType.PREVIEW:
        return 'previews';
      case FileType.PAGE:
        return 'mangas';
      default:
        return 'uploads';
    }
  }

  private getBucketName(): string {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      throw new InternalServerErrorException(
        'S3_BUCKET_NAME is not configured',
      );
    }

    return bucketName;
  }

  private getRegion(): string {
    return process.env.AWS_REGION ?? 'us-east-1';
  }

  private parseBooleanEnv(value: string | undefined): boolean {
    return value === 'true' || value === '1';
  }
}
