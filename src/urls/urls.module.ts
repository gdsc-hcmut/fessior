import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Url, UrlSchema } from './schemas/url.schema';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { AdminOrganizationsModule } from '../admin/organizations/organizations.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    AdminOrganizationsModule,
    CategoriesModule,
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
