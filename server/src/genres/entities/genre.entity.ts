import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GenreDoc = HydratedDocument<Genre>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@ObjectType()
@Schema({
  collection: 'genres',
})
export class Genre {
  @Field(() => ID)
  readonly _id!: Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    type: String,
  })
  name!: string;

  @Field(() => String)
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 60,
    type: String,
  })
  slug!: string;

  @Field(() => String, { nullable: true })
  @Prop({
    trim: true,
    maxlength: 500,
    default: '',
    type: String,
  })
  description?: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

GenreSchema.index({ name: 1 }, { unique: true });
GenreSchema.index({ slug: 1 }, { unique: true });

GenreSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
});
