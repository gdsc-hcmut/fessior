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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Request } from 'src/constants/types';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';
import { Organization } from './schemas/organization.schema';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('organizations')
@UseGuards(AuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  public async create(
    @Req() req: Request,
    @Body() dto: CreateOrganizationDto,
  ): Promise<ControllerResponse<Organization>> {
    dto.createdBy = req.tokenMeta.userId;
    dto.updatedBy = req.tokenMeta.userId;

    return { payload: await this.organizationsService.create(dto) };
  }

  @Get()
  public async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ControllerResponse<Organization[]>> {
    return { payload: await this.organizationsService.findAll(page, limit) };
  }

  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<Organization | null>> {
    const organization = await this.organizationsService.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return { payload: organization };
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
