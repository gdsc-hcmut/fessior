import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TargetGroup, TargetGroupSchema } from './schemas/target-group.schema';
import { TargetGroupsController } from './target-groups.controller';
import { TargetGroupsService } from './target-groups.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../feature-flags/schemas/feature-flag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }]),
    MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }]),
  ],
  controllers: [TargetGroupsController],
  providers: [TargetGroupsService, FeatureFlagsService],
})
export class TargetGroupsModule {}
