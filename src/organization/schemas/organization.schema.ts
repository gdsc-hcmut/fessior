import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { OrganizationType } from 'src/constants/types';

import { User } from '../../users/schemas/user.schema';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, unique: true })
  public longName: string;

  @Prop({ required: true, unique: true })
  public shortName: string;

  @Prop({ required: true, ref: User.name })
  public managers: ObjectId[];

  @Prop({ required: true })
  public domains: string[];

  @Prop({
    required: true,
    enum: [OrganizationType.PERSONAL, OrganizationType.TEAM],
    default: OrganizationType.TEAM,
  })
  public type: string;

  @Prop({ required: true, ref: User.name })
  public createdBy: ObjectId;

  @Prop({ required: true, ref: User.name })
  public updatedBy: ObjectId;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
