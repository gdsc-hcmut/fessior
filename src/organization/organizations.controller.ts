import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  NotFoundException,
  Param,
  Delete,
  Patch,
  ForbiddenException,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Order, Request, UrlSortOption } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';
import { Organization } from './schemas/organization.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { Url } from '../urls/schemas/url.schema';
import { UrlsService } from '../urls/urls.service';

@ApiTags('organizations')
@UseGuards(AuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService, private readonly urlsService: UrlsService) {}

  @Post()
  public async create(
    @Req() req: Request,
    @Body() dto: CreateOrganizationDto,
  ): Promise<ControllerResponse<Organization>> {
    injectUserId(dto, req.tokenMeta.userId);

    return { payload: await this.organizationsService.create(dto) };
  }

  @Get()
  public async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ControllerResponse<Organization[]>> {
    return { payload: await this.organizationsService.findAllPaginated(page, limit) };
  }

  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<Organization | null>> {
    const organization = await this.organizationsService.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return { payload: organization };
  }

  @Get(':id/urls')
  public async getUrls(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort', new ParseEnumPipe(UrlSortOption)) sort: UrlSortOption,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ControllerResponse<{ urls: Url[]; size: number; totalPages: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const urls = await this.urlsService.getUrlsByOrganizationId(id, sort, order, page, limit);
    const totalPages = await this.urlsService.getTotalPages(id, limit);

    return { payload: { size: urls.length, totalPages, urls } };
  }

  @Patch(':id')
  public async updateOne(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<ControllerResponse<Organization | null>> {
    dto.updatedBy = req.tokenMeta.userId;
    const updatedOrganization = await this.organizationsService.updateOne(id, dto);
    if (!updatedOrganization) {
      throw new NotFoundException('Organization not found');
    }

    return { payload: updatedOrganization };
  }

  @Patch(':id/remove')
  public async removeManagersAndDomains(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<ControllerResponse<Organization | null>> {
    dto.updatedBy = req.tokenMeta.userId;
    const updatedOrganization = await this.organizationsService.removeManagersAndDomains(id, dto);
    if (!updatedOrganization) {
      throw new NotFoundException('Organization not found');
    }

    return { payload: updatedOrganization };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<Organization | null>> {
    return { payload: await this.organizationsService.delete(id) };
  }
}
