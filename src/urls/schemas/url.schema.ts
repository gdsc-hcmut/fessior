import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

import { User } from '../../users/schemas/user.schema';

export type UrlDocument = HydratedDocument<Url>;

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  public originalUrl: string;

  @Prop({ required: true })
  public slug: string;

  @Prop({ required: true })
  public domain: string;

  @Prop({ required: true })
  public totalClicks: { clickedAt: Date; origin: string; ip: string }[];

  @Prop()
  public platform: string;

  @Prop({ required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.index({ originalUrl: 1, domain: 1 }, { unique: true });
