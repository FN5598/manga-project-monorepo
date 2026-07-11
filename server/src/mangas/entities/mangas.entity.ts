import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MangaStatus } from './manga.types';

export type MangaDoc = HydratedDocument<Manga>;

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'mangas',
})
export class Manga {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  title!: string;

  @Field(() => String)
  @Prop({
    required: true,
    type: String,
  })
  author!: string;

  @Field(() => String, { nullable: true })
  @Prop({
    default: 'No description provided as of yet.',
    type: String,
  })
  description?: string;

  @Field(() => String, { nullable: true })
  @Prop({
    type: String,
  })
  previewKey?: string;

  @Field(() => [String], { nullable: true })
  @Prop({
    default: [],
    type: [Types.ObjectId],
    ref: 'Genre',
  })
  genres?: Types.ObjectId[];

  @Field(() => MangaStatus)
  @Prop({
    required: true,
    enum: MangaStatus,
    type: String,
  })
  status!: MangaStatus;

  @Field(() => Number, { nullable: true })
  chaptersCount?: number;

  @Field(() => String, { nullable: true })
  previewUrl?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
MangaSchema.index({ title: 1 }, { unique: true });
