import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeController } from './me.controller';
import { MeService } from './me.service';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
