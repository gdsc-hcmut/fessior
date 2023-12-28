import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeController } from './me.controller';
import { MeService } from './me.service';
import { AdminOrganizationsModule } from '../admin/organizations/organizations.module';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../feature-flags/schemas/feature-flag.schema';
import { TargetGroup, TargetGroupSchema } from '../target-groups/schemas/target-group.schema';
import { TargetGroupsService } from '../target-groups/target-groups.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }]),
    MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }]),
    AdminOrganizationsModule,
  ],
  controllers: [MeController],
  providers: [MeService, FeatureFlagsService, TargetGroupsService, UsersService],
})
export class MeModule {}
