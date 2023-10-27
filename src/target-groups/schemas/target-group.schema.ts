import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type TargetGroupDocument = HydratedDocument<TargetGroup>;

@Schema({ timestamps: true })
export class TargetGroup {
  @Prop({ required: true, unique: true })
  public name: string;

  @Prop({ required: true, ref: 'User' })
  public users: ObjectId[];

  @Prop({ require: true, ref: 'Organization' })
  public organizations: ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  public createdBy: ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  public updatedBy: ObjectId;
}

export const TargetGroupSchema = SchemaFactory.createForClass(TargetGroup);

TargetGroupSchema.index({ name: 1 }, { unique: true });
