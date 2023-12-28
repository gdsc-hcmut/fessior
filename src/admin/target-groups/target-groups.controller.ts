import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common/pipes';
import { ControllerResponse, Request } from 'src/constants/types';

import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateTargetGroupDto } from '../../target-groups/dto/create-target-group.dto';
import { UpdateTargetGroupDto } from '../../target-groups/dto/update-target-group.dto';
import { TargetGroup } from '../../target-groups/schemas/target-group.schema';
import { TargetGroupsService } from '../../target-groups/target-groups.service';

@ApiTags('target-groups')
@UseGuards(AuthGuard)
@Controller()
export class AdminTargetGroupsController {
  constructor(private readonly targetGroupService: TargetGroupsService) {}

  @Post()
  public async create(
    @Req() req: Request,
    @Body() createTargetGroupDto: CreateTargetGroupDto,
  ): Promise<ControllerResponse<TargetGroup | null>> {
    createTargetGroupDto.createdBy = req.tokenMeta.userId;
    createTargetGroupDto.updatedBy = req.tokenMeta.userId;
    const newTargetGroup: TargetGroup = await this.targetGroupService.create(createTargetGroupDto);

    return { payload: newTargetGroup };
  }

  @Get()
  public async findAll(): Promise<ControllerResponse<TargetGroup[]>> {
    const targetGroups: TargetGroup[] = await this.targetGroupService.findAll();
    return { payload: targetGroups };
  }

  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<TargetGroup | null>> {
    const targetGroup = await this.targetGroupService.findOne(id);
    if (!targetGroup) {
      throw new NotFoundException(`Target group with id ${id} not found`);
    }

    return { payload: targetGroup };
  }

  @Patch(':id')
  public async updateOne(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updatedTargetGroupDto: UpdateTargetGroupDto,
  ): Promise<ControllerResponse<TargetGroup | null>> {
    updatedTargetGroupDto.updatedBy = req.tokenMeta.userId;
    const updatedTargetGroup = await this.targetGroupService.updateOne(id, updatedTargetGroupDto);
    if (updatedTargetGroup === null) {
      throw new NotFoundException(`Target group with id ${id} not found`);
    }

    return { payload: updatedTargetGroup };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<TargetGroup | null>> {
    return { payload: await this.targetGroupService.delete(id) };
  }
}
