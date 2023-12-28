import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { AuthGuard } from '../../common/guards/auth.guard';
import { ObjectIdValidationPipe } from '../../common/pipes';
import { CreateFeatureFlagDto } from '../../feature-flags/dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from '../../feature-flags/dto/update-feature-flag.dto';
import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { FeatureFlag } from '../../feature-flags/schemas/feature-flag.schema';

@ApiTags('feature-flags')
@UseGuards(AuthGuard)
@Controller()
export class AdminFeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  public async create(
    @Req() req: Request,
    @Body() dto: CreateFeatureFlagDto,
  ): Promise<ControllerResponse<FeatureFlag>> {
    injectUserId(dto, req.tokenMeta.userId);

    const newFeatureFlag = await this.featureFlagsService.create(dto);
    return { payload: newFeatureFlag };
  }

  @Get()
  public async findAll(): Promise<ControllerResponse<FeatureFlag[]>> {
    const allFeatureFlags = await this.featureFlagsService.findAll();
    return { payload: allFeatureFlags };
  }

  @Get(':id')
  public async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<FeatureFlag | null>> {
    const featureFlag = await this.featureFlagsService.findOne(id);
    if (!featureFlag) {
      throw new NotFoundException('Feature flag not found');
    }

    return { payload: featureFlag };
  }

  @Patch(':id')
  public async update(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateFeatureFlagDto,
  ): Promise<ControllerResponse<FeatureFlag | null>> {
    dto.updatedBy = req.tokenMeta.userId;
    const updatedFeatureFlag = await this.featureFlagsService.updateOne(id, dto);
    if (!updatedFeatureFlag) {
      throw new NotFoundException('Feature flag not found');
    }

    return { payload: updatedFeatureFlag };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<FeatureFlag | null>> {
    const deletedFeatureFlag = await this.featureFlagsService.delete(id);
    if (!deletedFeatureFlag) {
      throw new NotFoundException('Feature flag not found');
    }

    return { payload: deletedFeatureFlag };
  }
}
