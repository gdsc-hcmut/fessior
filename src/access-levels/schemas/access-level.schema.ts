import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/constants/types';

export type AccessLevelDocument = HydratedDocument<AccessLevel>;

@Schema()
export class AccessLevel {
  @Prop({ unique: true, isRequired: true })
  public name: string;

  @Prop({ isRequired: true })
  public permissions: Permission[];

  @Prop({ ref: 'User', default: [] })
  public users: Types.ObjectId[];

  @Prop({ default: Date.now() })
  public createAt: Date;

  @Prop({ default: Date.now() })
  public updatedAt: Date;

  @Prop()
  public createdBy: Types.ObjectId;

  @Prop()
  public updatedBy: Types.ObjectId;
}

export const AccessLevelSchema = SchemaFactory.createForClass(AccessLevel);
