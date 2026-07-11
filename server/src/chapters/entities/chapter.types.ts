import { registerEnumType } from '@nestjs/graphql';

export enum UploadStatus {
  DRAFT = 'draft',
  UPLOADING = 'uploading',
  READY = 'ready',
  FAILED = 'failed',
}

registerEnumType(UploadStatus, { name: 'UploadStatus' });
