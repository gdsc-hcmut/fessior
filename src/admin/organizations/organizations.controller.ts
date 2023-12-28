import {
  Controller,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateOrganizationDto } from '../../organization/dto/create-organization.dto';
import { UpdateOrganizationDto } from '../../organization/dto/update-organization.dto';
import { OrganizationsService } from '../../organization/organizations.service';
import { Organization } from '../../organization/schemas/organization.schema';

@ApiTags('organizations')
@UseGuards(AuthGuard)
@Controller()
export class AdminOrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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
