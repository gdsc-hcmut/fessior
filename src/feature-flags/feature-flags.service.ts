import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { FeatureFlag } from './schemas/feature-flag.schema';

@Injectable()
export class FeatureFlagsService {
  private readonly logger: Logger = new Logger(FeatureFlagsService.name);

  constructor(@InjectModel(FeatureFlag.name) private readonly featureFlagModel: Model<FeatureFlag>) {}

  public async create(createFeatureFlagDto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    return this.featureFlagModel.create(createFeatureFlagDto);
  }

  public async findAll(): Promise<FeatureFlag[]> {
    this.logger.log('Find all feature flags');
    return this.featureFlagModel.find();
  }

  public async findOne(id: string): Promise<FeatureFlag | null> {
    return this.featureFlagModel.findById(id);
  }

  public async delete(id: string): Promise<FeatureFlag | null> {
    return this.featureFlagModel.findByIdAndRemove(id);
  }
}
