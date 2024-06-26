import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

import { Organization } from '../../organization/schemas/organization.schema';
import { User } from '../../users/schemas/user.schema';

export type UrlDocument = HydratedDocument<Url>;

export const UrlDatabaseName = 'urls';

@DatabaseEntity({ collection: UrlDatabaseName })
export class Url extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({ required: true })
  public originalUrl: string;

  @Prop({ required: true })
  public slug: string;

  @Prop({ required: true })
  public domain: string;

  @Prop({ required: true })
  public totalClicks: { clickedAt: Date; origin: string; ip: string }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Organization.name })
  public organizationId: ObjectId;

  @Prop({ required: true, default: true })
  public isActive: boolean;

  @Prop()
  public platform: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.index({ domain: 1, slug: 1 }, { unique: true });
UrlSchema.index({ organizationId: 1, updatedAt: 1 }, { unique: false });
// UrlSchema.index({ slug: 'text', originalUrl: 'text' });
