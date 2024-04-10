import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends DatabaseMongoObjectIdEntityAbstract {
  @Prop()
  public googleId: string;

  @Prop()
  public appleId: string;

  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public picture: string;

  @Prop({ default: null })
  public dateOfBirth: string;

  @Prop({ indexes: true })
  public email: string;

  @Prop({ default: null })
  public phone: string;

  @Prop({ default: false })
  public isManager: boolean;

  @Prop({ minlength: 8, maxlength: 16 })
  public password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
