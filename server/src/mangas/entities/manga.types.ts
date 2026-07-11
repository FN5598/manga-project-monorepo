import { registerEnumType } from '@nestjs/graphql';

export enum MangaStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
  CANCELLED = 'cancelled',
}

registerEnumType(MangaStatus, { name: 'MangaStatus' });
