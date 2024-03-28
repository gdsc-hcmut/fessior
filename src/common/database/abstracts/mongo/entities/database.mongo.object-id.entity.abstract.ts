import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DatabaseBaseEntityAbstract } from 'src/common/database/abstracts/base/entity';
import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from 'src/common/database/constants';
import { DatabaseDefaultObjectId } from 'src/common/database/constants/function';

export abstract class DatabaseMongoObjectIdEntityAbstract extends DatabaseBaseEntityAbstract<Types.ObjectId> {
  @Prop({
    type: Types.ObjectId,
    default: DatabaseDefaultObjectId,
  })
  _id: Types.ObjectId;

  @Prop({
    required: false,
    index: true,
    type: Date,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
    default: new Date(),
  })
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
    default: new Date(),
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;
}
