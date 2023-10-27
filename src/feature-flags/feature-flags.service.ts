import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { FeatureFlag } from './schemas/feature-flag.schema';
import { TargetGroup } from '../target-groups/schemas/target-group.schema';

type FeatureFlagPopulated = Omit<FeatureFlag, 'targetGroups'> & { targetGroups: TargetGroup[] };

@Injectable()
export class FeatureFlagsService {
  private readonly logger: Logger = new Logger(FeatureFlagsService.name);

  constructor(@InjectModel(FeatureFlag.name) private readonly featureFlagModel: Model<FeatureFlag>) {}

  public async create(dto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    const { key, targetGroups } = dto;
    const featureFlag = await this.featureFlagModel.findOne({ key });
    if (featureFlag) {
      throw new BadRequestException('Feature flag key already exists');
    }

    targetGroups.forEach(group => {
      if (!Types.ObjectId.isValid(group)) {
        throw new BadRequestException('Invalid target group id');
      }
    });

    return this.featureFlagModel.create(dto);
  }

  public async findAll(): Promise<FeatureFlag[]> {
    this.logger.log('Find all feature flags');
    return this.featureFlagModel.find();
  }

  public async findOne(id: string): Promise<FeatureFlag | null> {
    return this.featureFlagModel.findById(id);
  }

  public async findByKeyAndPopulate(key: string): Promise<FeatureFlagPopulated | null> {
    return this.featureFlagModel.findOne({ key }).populate('targetGroups');
  }

  public async updateOne(id: string, dto: UpdateFeatureFlagDto): Promise<FeatureFlag | null> {
    const { key, targetGroups } = dto;
    if (key) {
      throw new BadRequestException('Not allow modify key');
    }

    targetGroups?.forEach(group => {
      if (!Types.ObjectId.isValid(group)) {
        throw new BadRequestException('Invalid target group id');
      }
    });

    return this.featureFlagModel.findByIdAndUpdate(id, dto, { new: true });
  }

  public async delete(id: string): Promise<FeatureFlag | null> {
    return this.featureFlagModel.findByIdAndRemove(id);
  }
}
