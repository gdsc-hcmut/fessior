import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

import { Organization } from '../../organization/schemas/organization.schema';
import { Url } from '../../urls/schemas/url.schema';
import { User } from '../../users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public color: string;

  @Prop({ required: true, ref: Organization.name })
  public organization: ObjectId;

  @Prop({ required: true, ref: Url.name })
  public urls: ObjectId[];

  @Prop({ required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);