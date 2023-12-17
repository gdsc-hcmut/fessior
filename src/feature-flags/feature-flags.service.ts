import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PopulateOptions, FilterQuery, UpdateQuery, QueryOptions, UpdateWriteOpResult } from 'mongoose';

import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { FeatureFlag, FeatureFlagDocument } from './schemas/feature-flag.schema';
import { TargetGroup } from '../target-groups/schemas/target-group.schema';

type FeatureFlagPopulated = Omit<FeatureFlag, 'targetGroups'> & { targetGroups: TargetGroup[] };

type TargetGroupsPopulated = {
  targetGroups: { _id: string; users: string[]; organizations: { managers: string[] }[] }[];
};

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

  public async getUserFeatureFlags(userId: string): Promise<{ [key in string]: boolean }> {
    const res: { [key in string]: boolean } = {};
    const populateOptions: PopulateOptions = {
      path: 'targetGroups',
      select: '_id users organizations',
      populate: {
        path: 'organizations',
        select: 'managers',
      },
    };
    const featureFlags = await this.featureFlagModel.find().populate<TargetGroupsPopulated>(populateOptions);

    featureFlags.forEach(ff => {
      res[ff.key] = false;
    });

    // TODO: Cache userId -> { [ff in string]: boolean }
    for (let i = 0; i < featureFlags.length; i += 1) {
      const ff = featureFlags[i];
      if (!ff.isEnabled) {
        res[ff.key] = true;
        continue;
      }

      for (let j = 0; j < ff.targetGroups.length; j += 1) {
        const group = ff.targetGroups[j];
        if (group.users.includes(userId)) {
          res[ff.key] = true;
          break;
        }
        for (let k = 0; k < group.organizations.length; k += 1) {
          const org = group.organizations[k];
          if (org.managers.includes(userId)) {
            res[ff.key] = true;
            break;
          }
        }
        if (res[ff.key]) {
          break;
        }
      }
    }
    return res;
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

  public async updateMany(
    filter: FilterQuery<FeatureFlagDocument>,
    update: UpdateQuery<FeatureFlagDocument>,
    options: QueryOptions<FeatureFlagDocument>,
  ): Promise<UpdateWriteOpResult> {
    return this.featureFlagModel.updateMany(filter, update, options);
  }

  public async removeTargetGroup(targetGroupId: string, featureFlagIds?: string[]): Promise<boolean> {
    if (!featureFlagIds) {
      const query = await this.updateMany({}, { $pullAll: { targetGroups: [targetGroupId] } }, { new: true });
      return query.acknowledged;
    }

    const query = await this.updateMany(
      { _id: { $in: featureFlagIds } },
      { $pullAll: { targetGroups: [targetGroupId] } },
      { new: true },
    );
    return query.acknowledged;
  }

  public async delete(id: string): Promise<FeatureFlag | null> {
    return this.featureFlagModel.findByIdAndDelete(id);
  }
}
