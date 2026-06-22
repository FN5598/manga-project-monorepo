import { SortInput } from "@config/constants.js";
import { ENV } from "@validators/env.validators.js";
import { InputType, Field, Int, registerEnumType } from "type-graphql";

export function getUrlForImage(key: string): string {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  if (ENV.NODE_ENV === "production") {
    return `https://${ENV.S3_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${encodedKey}`;
  }

  return `${ENV.S3_PUBLIC_ENDPOINT}/${ENV.S3_BUCKET_NAME}/${encodedKey}`;
}
@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class SortInputType {
  @Field(() => String)
  sortBy!: SortInput;

  @Field(() => String)
  field!: "createdAt";
}

export enum MangaFilterFields {
  STATUS = "status",
  GENRES = "genres",
  AUTHOR = "author",
  TITLE = "title",
  ID = "_id",
}

registerEnumType(MangaFilterFields, {
  name: "MangaFilterFields",
});

@InputType()
export class MangaFilterTypes {
  @Field(() => MangaFilterFields)
  field!: MangaFilterFields;

  @Field(() => [String])
  value!: string[];
}

@InputType()
export class MangaUploadInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  author!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  genres?: string[];

  @Field(() => String)
  status!: string;
}
