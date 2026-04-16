import { SortInput } from "@config/constants.js";
import { ENV } from "@validators/env.validators.js";
import { InputType, Field, Int } from "type-graphql";

export function getUrlForImage(previewKey: string): string {
  return `https://${ENV?.S3_BUCKET_NAME}.s3.${ENV?.AWS_REGION}.amazonaws.com/${previewKey.split("/").map(encodeURIComponent).join("/")}`;
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
