import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeController } from './me.controller';
import { MeService } from './me.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../feature-flags/schemas/feature-flag.schema';
import { OrganizationsModule } from '../organization/organizations.module';
import { TargetGroup, TargetGroupSchema } from '../target-groups/schemas/target-group.schema';
import { TargetGroupsService } from '../target-groups/target-groups.service';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }]),
    MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }]),
    OrganizationsModule,
  ],
  controllers: [MeController],
  providers: [MeService, FeatureFlagsService, TargetGroupsService],
})
export class MeModule {}
