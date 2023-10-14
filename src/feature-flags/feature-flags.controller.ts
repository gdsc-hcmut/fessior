import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureFlag } from './schemas/feature-flag.schema';

@Controller('FeatureFlags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  public async create(@Body() createFeatureFlagDto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    return this.featureFlagsService.create(createFeatureFlagDto);
  }

  @Get()
  public async findAll(): Promise<FeatureFlag[]> {
    return this.featureFlagsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<FeatureFlag | null> {
    return this.featureFlagsService.findOne(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<FeatureFlag | null> {
    return this.featureFlagsService.delete(id);
  }
}
