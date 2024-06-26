import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { AccessLevelsService } from '../../access-levels/access-levels.service';
import { CreateAccessLevelDto } from '../../access-levels/dto/create-access-level.dto';
import { GrantAccessLevelDto } from '../../access-levels/dto/grant-access-level.dto';
import { UpdateAccessLevelDto } from '../../access-levels/dto/update-access-level.dto';
import { AccessLevel } from '../../access-levels/schemas/access-level.schema';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('access-levels')
@UseGuards(AuthGuard)
@Controller()
export class AdminAccessLevelsController {
  constructor(private readonly accessLevelsService: AccessLevelsService) {}

  @Post()
  public async create(
    @Req() req: Request,
    @Body() dto: CreateAccessLevelDto,
  ): Promise<ControllerResponse<AccessLevel>> {
    injectUserId(dto, req.tokenMeta.userId);

    return { payload: await this.accessLevelsService.create(dto) };
  }

  @Get()
  public async findAll(): Promise<ControllerResponse<AccessLevel[]>> {
    return { payload: await this.accessLevelsService.findAll() };
  }

  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<AccessLevel | null>> {
    const accessLevel = await this.accessLevelsService.findOne(id);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    return { payload: accessLevel };
  }

  @Patch(':id')
  public async updateOne(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateAccessLevelDto,
  ): Promise<ControllerResponse<AccessLevel | null>> {
    dto.updatedBy = req.tokenMeta.userId;
    const updatedAccessLevel = await this.accessLevelsService.updateOne(id, dto);
    if (!updatedAccessLevel) {
      throw new NotFoundException('Access level not found');
    }

    return { payload: updatedAccessLevel };
  }

  @Patch(':id/grant')
  public async grantToUsers(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: GrantAccessLevelDto,
  ): Promise<ControllerResponse<AccessLevel | null>> {
    dto.updatedBy = req.tokenMeta.userId;

    return { payload: await this.accessLevelsService.grantPermissionsToUsers(dto.users, dto.permissions, id) };
  }

  @Patch(':id/revoke')
  public async revokeUsers(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: GrantAccessLevelDto,
  ): Promise<ControllerResponse<AccessLevel | null>> {
    dto.updatedBy = req.tokenMeta.userId;

    return { payload: await this.accessLevelsService.revokeUsersAndPermission(dto.users, dto.permissions, id) };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<AccessLevel | null>> {
    const deletedAccessLevel = await this.accessLevelsService.delete(id);
    if (!deletedAccessLevel) {
      throw new NotFoundException('Access level not found');
    }

    return { payload: deletedAccessLevel };
  }
}
