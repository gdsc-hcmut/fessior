import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminTargetGroupsController } from './target-groups.controller';
import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../../feature-flags/schemas/feature-flag.schema';
import { TargetGroup, TargetGroupSchema } from '../../target-groups/schemas/target-group.schema';
import { TargetGroupsService } from '../../target-groups/target-groups.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }]),
    MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }]),
  ],
  controllers: [AdminTargetGroupsController],
  providers: [TargetGroupsService, FeatureFlagsService],
})
export class AdminTargetGroupsModule {}
