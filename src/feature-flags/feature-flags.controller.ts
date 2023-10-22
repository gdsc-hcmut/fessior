import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/constants/types';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag } from './schemas/feature-flag.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { ObjectIdValidationPipe } from '../common/pipes';

@ApiTags('feature-flags')
@UseGuards(AuthGuard)
@Controller()
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  public async create(@Body() createFeatureFlagDto: CreateFeatureFlagDto): Promise<ControllerResponse<FeatureFlag>> {
    const newFeatureFlag = await this.featureFlagsService.create(createFeatureFlagDto);
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
    return { payload: featureFlag };
  }

  @Delete(':id')
  public async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<FeatureFlag | null>> {
    const deletedFeatureFlag = await this.featureFlagsService.delete(id);
    return { payload: deletedFeatureFlag };
  }
}
