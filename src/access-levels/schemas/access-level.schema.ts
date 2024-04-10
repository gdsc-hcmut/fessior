import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Permission } from 'src/constants/types';

import { User } from '../../users/schemas/user.schema';

export type AccessLevelDocument = HydratedDocument<AccessLevel>;

@Schema({ timestamps: true })
export class AccessLevel {
  @Prop({ required: true, unique: true })
  public name: string;

  @Prop({ required: true })
  public permissions: Permission[];

  @Prop({ required: true, ref: User.name })
  public users: ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const AccessLevelSchema = SchemaFactory.createForClass(AccessLevel);
