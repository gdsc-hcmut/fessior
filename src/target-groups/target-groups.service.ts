import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTargetGroupDto } from './dto/create-target-group.dto';
import { UpdateTargetGroupDto } from './dto/update-target-group.dto';
import { TargetGroup } from './schemas/target-group.schema';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';

@Injectable()
export class TargetGroupsService {
  constructor(
    @InjectModel('TargetGroup') private readonly targetGroupModel: Model<TargetGroup>,
    private readonly featureFlagsService: FeatureFlagsService,
  ) {}

  public async create(createTargetGroupDto: CreateTargetGroupDto): Promise<TargetGroup> {
    const { name, users, organizations } = createTargetGroupDto;
    const targetGroup = await this.targetGroupModel.findOne({ name }).exec();
    if (targetGroup?.name === name) {
      throw new ForbiddenException('Target group with this name already exists');
    }

    users.forEach(user => {
      if (!Types.ObjectId.isValid(user)) {
        throw new BadRequestException('Invalid user id');
      }
    });

    organizations.forEach(organization => {
      if (!Types.ObjectId.isValid(organization)) {
        throw new BadRequestException('Invalid organization id');
      }
    });

    return this.targetGroupModel.create(createTargetGroupDto);
  }

  public async findAll(): Promise<TargetGroup[]> {
    return this.targetGroupModel.find().exec();
  }

  public async findOne(id: string): Promise<TargetGroup | null> {
    return this.targetGroupModel.findOne({ _id: id }).exec();
  }

  public async updateOne(id: string, updateTargetGroupDto: UpdateTargetGroupDto): Promise<TargetGroup | null> {
    const { users, organizations } = updateTargetGroupDto;

    users?.forEach(user => {
      if (!Types.ObjectId.isValid(user)) {
        throw new BadRequestException('Invalid user id');
      }
    });

    organizations?.forEach(organization => {
      if (!Types.ObjectId.isValid(organization)) {
        throw new BadRequestException('Invalid organization id');
      }
    });

    return this.targetGroupModel.findByIdAndUpdate(id, { $set: updateTargetGroupDto }, { new: true }).exec();
  }

  public async delete(id: string): Promise<TargetGroup | null> {
    const isUpdated = await this.featureFlagsService.removeTargetGroup(id);
    if (!isUpdated) {
      throw new BadRequestException('Remove target group from feature flags failed');
    }

    return this.targetGroupModel.findByIdAndDelete(id).exec();
  }
}
