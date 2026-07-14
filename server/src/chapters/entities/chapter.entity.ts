import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UploadStatus } from './chapter.types';
import { Manga } from '../../mangas/entities/mangas.entity';

export type ChapterDoc = HydratedDocument<Chapter>;

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'chapters',
})
export class Chapter {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field(() => ID)
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Manga.name,
  })
  mangaId!: Types.ObjectId;

  @Field(() => Number)
  @Prop({
    required: true,
    min: 0,
    type: Number,
  })
  chapterNumber!: number;

  @Field(() => String, { nullable: true })
  @Prop({
    trim: true,
    default: null,
    type: String,
  })
  title?: string;

  @Field(() => String)
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  storagePrefix!: string;

  @Field(() => Number)
  @Prop({
    default: 0,
    min: 0,
    type: Number,
  })
  pageCount!: number;

  @Field(() => UploadStatus)
  @Prop({
    required: true,
    enum: UploadStatus,
    default: UploadStatus.DRAFT,
    type: String,
  })
  uploadStatus!: UploadStatus;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
ChapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true });
