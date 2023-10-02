import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FeatureFlagsController } from './feature-flags.controller';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag, FeatureFlagSchema } from './schemas/feature-flag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FeatureFlag.name, schema: FeatureFlagSchema }])],
  controllers: [FeatureFlagsController],
  providers: [FeatureFlagsService],
})
export class FeatureFlagsModule {}
