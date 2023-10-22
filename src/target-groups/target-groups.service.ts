import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateTargetGroupDto } from './dto/create-target-group.dto';
import { UpdateTargetGroupDto } from './dto/update-target-group.dto';
import { TargetGroup } from './schemas/target-group.schema';

@Injectable()
export class TargetGroupsService {
  private readonly logger: Logger = new Logger(TargetGroupsService.name);

  constructor(@InjectModel('TargetGroup') private readonly targetGroupModel: Model<TargetGroup>) {}

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
    return this.targetGroupModel.findByIdAndRemove({ _id: id }).exec();
  }
}
