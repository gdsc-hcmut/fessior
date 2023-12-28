import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminOrganizationsController } from './organizations.controller';
import { OrganizationsService } from '../../organization/organizations.service';
import { Organization, OrganizationSchema } from '../../organization/schemas/organization.schema';
import { Url, UrlSchema } from '../../urls/schemas/url.schema';
import { UrlsService } from '../../urls/urls.service';
import { AdminUsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Organization.name, schema: OrganizationSchema }]),
    AdminUsersModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [AdminOrganizationsController],
  providers: [OrganizationsService, UrlsService],
  exports: [OrganizationsService],
})
export class AdminOrganizationsModule {}
