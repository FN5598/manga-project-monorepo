import { Field, InputType, registerEnumType } from '@nestjs/graphql';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
};

@InputType()
export class PaginationInput {
  @Field(() => Number, { nullable: true })
  page?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;
}

export enum SortFields {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(SortFields, { name: 'SortFields' });

@InputType()
export class SortInput {
  @Field(() => String)
  sortBy!: 'asc' | 'desc';

  @Field(() => SortFields)
  field!: SortFields;
}

export enum MangaFilterFields {
  STATUS = 'status',
  GENRES = 'genres',
  AUTHOR = 'author',
  TITLE = 'title',
  ID = '_id',
}

registerEnumType(MangaFilterFields, { name: 'MangaFilterFields' });

@InputType()
export class MangaFilterInput {
  @Field(() => MangaFilterFields)
  field!: MangaFilterFields;

  @Field(() => [String])
  value!: string[];
}

export function getDefaultPagination(
  pagination?: PaginationInput,
): Required<PaginationInput> {
  const page =
    pagination?.page && pagination.page > 0
      ? pagination.page
      : DEFAULT_PAGINATION.page;
  const limit =
    pagination?.limit && pagination.limit > 0
      ? Math.min(pagination.limit, DEFAULT_PAGINATION.limit)
      : DEFAULT_PAGINATION.limit;

  return { page, limit };
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getUrlForImage(key: string): string {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  const bucketName = process.env.S3_BUCKET_NAME;
  const publicEndpoint = process.env.S3_PUBLIC_ENDPOINT;
  const region = process.env.AWS_REGION;

  if (process.env.NODE_ENV === 'production' && bucketName && region) {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${encodedKey}`;
  }

  if (bucketName && publicEndpoint) {
    return `${publicEndpoint}/${bucketName}/${encodedKey}`;
  }

  return encodedKey;
}
