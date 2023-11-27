import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Url, UrlSchema } from './schemas/url.schema';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { OrganizationsModule } from '../organization/organizations.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]), OrganizationsModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
