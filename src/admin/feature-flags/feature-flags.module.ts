import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminFeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from '../../feature-flags/schemas/feature-flag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }])],
  controllers: [AdminFeatureFlagsController],
  providers: [FeatureFlagsService],
  exports: [FeatureFlagsService],
})
export class AdminFeatureFlagsModule {}
