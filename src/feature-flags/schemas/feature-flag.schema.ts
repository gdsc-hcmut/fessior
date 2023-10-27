import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Platform } from 'src/constants/types';

import { TargetGroup } from '../../target-groups/schemas/target-group.schema';
import { User } from '../../users/schemas/user.schema';

export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;

@Schema({ timestamps: true })
export class FeatureFlag {
  @Prop({ required: true, unique: true })
  public key: string;

  @Prop({ required: true })
  public description: string;

  @Prop({ required: true, ref: TargetGroup.name })
  public targetGroups: ObjectId[];

  @Prop({ required: true })
  public platforms: { name: Platform; minSupportedVersion: string }[];

  @Prop({ required: true, default: false })
  public isEnabled: boolean;

  @Prop({ required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);

FeatureFlagSchema.index({ key: 1 }, { unique: true });
