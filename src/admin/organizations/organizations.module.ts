import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminOrganizationsController } from './organizations.controller';
import { CategoriesService } from '../../categories/categories.service';
import { Category, CategorySchema } from '../../categories/schemas/category.schema';
import { OrganizationsService } from '../../organization/organizations.service';
import { Organization, OrganizationSchema } from '../../organization/schemas/organization.schema';
import { Url, UrlSchema } from '../../urls/schemas/url.schema';
import { UrlsService } from '../../urls/urls.service';
import { AdminUsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    AdminUsersModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [AdminOrganizationsController],
  providers: [OrganizationsService, UrlsService, CategoriesService],
  exports: [OrganizationsService],
})
export class AdminOrganizationsModule {}
