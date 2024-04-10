import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { Platform } from 'src/constants/types';

import { TargetGroup } from '../../target-groups/schemas/target-group.schema';
import { User } from '../../users/schemas/user.schema';

export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;

@Schema({ timestamps: true })
export class FeatureFlag extends DatabaseMongoObjectIdEntityAbstract {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);

FeatureFlagSchema.index({ key: 1 }, { unique: true });
