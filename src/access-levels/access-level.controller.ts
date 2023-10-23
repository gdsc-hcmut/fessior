import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, Request } from 'src/constants/types';

import { AccessLevelService } from './access-levels.service';
import { CreateAccessLevelDto } from './dto/create-access-level.dto';
import { UserArrayDto } from './dto/grant-user.dto';
import { AccessLevel } from './schemas/access-level.schema';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('access-level')
@UseGuards(AuthGuard)
@Controller()
export class AccessLevelsController {
  constructor(public readonly accessLevelsService: AccessLevelService) {}

  @Post()
  public async create(
    @Body() createAccessLevelDto: CreateAccessLevelDto,
    @Req() req: Request,
  ): Promise<ControllerResponse<{ access_level: AccessLevel }>> {
    const { userId } = req.tokenMeta;
    return { payload: { access_level: await this.accessLevelsService.create(createAccessLevelDto, userId) } };
  }

  @Patch('/:id')
  public async update(
    @Body() accessLevelDto: CreateAccessLevelDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ControllerResponse<{ access_level: AccessLevel }>> {
    const { userId } = req.tokenMeta;
    return { payload: { access_level: await this.accessLevelsService.updateById(id, accessLevelDto, userId) } };
  }

  @Patch('/:id/users/grant')
  public async grantAccessLevel(
    @Body() grantUsers: UserArrayDto,
    @Param('id') accessLevelId: string,
    @Req() req: Request,
  ): Promise<ControllerResponse<{ access_level: AccessLevel }>> {
    const { userId } = req.tokenMeta;
    return {
      payload: {
        access_level: await this.accessLevelsService.grantAccessLevel(accessLevelId, grantUsers.users, userId),
      },
    };
  }

  @Patch('/:id/users/revoke')
  public async revokeAccessLevel(
    @Body() grantUsers: UserArrayDto,
    @Param('id') accessLevelId: string,
    @Req() req: Request,
  ): Promise<ControllerResponse<{ access_level: AccessLevel }>> {
    const { userId } = req.tokenMeta;
    return {
      payload: {
        access_level: await this.accessLevelsService.revokeAccessLevel(accessLevelId, grantUsers.users, userId),
      },
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') accessLevelId: string): Promise<ControllerResponse<unknown>> {
    await this.accessLevelsService.deleteAccessLevel(accessLevelId);
    return { payload: {} };
  }

  @Get()
  public async getAll(): Promise<ControllerResponse<{ accessLevels: AccessLevel[] }>> {
    return { payload: { accessLevels: await this.accessLevelsService.getAll() } };
  }
}
