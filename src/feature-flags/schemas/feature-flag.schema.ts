import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;

@Schema()
export class FeatureFlag {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public key: string;

  @Prop({ required: true })
  public description: string;
}

export const FeatureFlagSchema = SchemaFactory.createForClass(FeatureFlag);
