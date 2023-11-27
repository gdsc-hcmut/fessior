import { Module } from '@nestjs/common';

import { RootController } from './root.controller';
import { RootService } from './root.service';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [UrlsModule],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
