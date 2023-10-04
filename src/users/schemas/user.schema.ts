import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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

  @Prop({ default: Date.now })
  public createdAt: Date;

  @Prop({ default: Date.now })
  public updatedAt: Date;

  @Prop({ default: false })
  public isManager: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
