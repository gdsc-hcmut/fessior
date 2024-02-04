import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { CategoriesService } from '../categories/categories.service';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Url, UrlSchema } from '../urls/schemas/url.schema';
import { UrlsService } from '../urls/urls.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    UsersModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, UrlsService, CategoriesService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
