import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

import { Organization } from '../../organization/schemas/organization.schema';
import { Url } from '../../urls/schemas/url.schema';
import { User } from '../../users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

export const CategoryDatabaseName = 'categories';

@DatabaseEntity({ collection: CategoryDatabaseName })
export class Category extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public color: string;

  @Prop({ required: true, ref: Organization.name })
  public organization: ObjectId;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: Url.name }] })
  public urls: Types.ObjectId[];

  @Prop({ required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
