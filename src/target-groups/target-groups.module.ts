import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TargetGroup, TargetGroupSchema } from './schemas/target-group.schema';
import { TargetGroupsController } from './target-groups.controller';
import { TargetGroupsService } from './target-groups.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: TargetGroup.name, schema: TargetGroupSchema }])],
  controllers: [TargetGroupsController],
  providers: [TargetGroupsService],
})
export class TargetGroupsModule {}
