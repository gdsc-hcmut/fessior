import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccessLevelsController } from './access-levels.controller';
import { AccessLevelsService } from './access-levels.service';
import { AccessLevel, AccessLevelSchema } from './schemas/access-level.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: AccessLevel.name, schema: AccessLevelSchema }]), UsersModule],
  controllers: [AccessLevelsController],
  providers: [AccessLevelsService],
})
export class AccessLevelsModule {}
