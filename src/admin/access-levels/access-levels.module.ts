import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminAccessLevelsController } from './access-levels.controller';
import { AccessLevelsService } from '../../access-levels/access-levels.service';
import { AccessLevel, AccessLevelSchema } from '../../access-levels/schemas/access-level.schema';
import { AdminUsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: AccessLevel.name, schema: AccessLevelSchema }]), AdminUsersModule],
  controllers: [AdminAccessLevelsController],
  providers: [AccessLevelsService],
})
export class AdminAccessLevelsModule {}
