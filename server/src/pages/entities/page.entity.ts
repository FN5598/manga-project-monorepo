import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Chapter } from '../../chapters/entities/chapter.entity';

export type PageDoc = HydratedDocument<Page>;

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'pages',
})
export class Page {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field(() => ID)
  @Prop({
    ref: Chapter.name,
    required: true,
    type: Types.ObjectId,
  })
  chapter!: Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    type: String,
  })
  imageKey!: string;

  @Field(() => Number, { nullable: true })
  @Prop({
    min: 0,
    default: null,
    type: Number,
  })
  fileSize?: number;

  @Field(() => Number)
  @Prop({
    required: true,
    min: 0,
    validate: Number.isInteger,
    type: Number,
  })
  pageNumber!: number;

  @Field(() => String, { nullable: true })
  pageUrl?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);
PageSchema.index({ chapter: 1, pageNumber: 1 }, { unique: true });
