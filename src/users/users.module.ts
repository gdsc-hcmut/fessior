import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../feature-flags/schemas/feature-flag.schema';
import { TargetGroup, TargetGroupSchema } from '../target-groups/schemas/target-group.schema';
import { TargetGroupsService } from '../target-groups/target-groups.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }]),
    MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FeatureFlagsService, TargetGroupsService],
  exports: [UsersService],
})
export class UsersModule {}
