import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateAccessLevelDto } from './dto/create-access-level.dto';
import { AccessLevel, AccessLevelDocument } from './schemas/access-level.schema';

@Injectable()
export class AccessLevelService {
  constructor(@InjectModel(AccessLevel.name) private readonly accessLevelModel: Model<AccessLevelDocument>) {}

  public async create(accessLevelDto: CreateAccessLevelDto, createdBy: Types.ObjectId): Promise<AccessLevel> {
    const userIds: Types.ObjectId[] = [];
    for (const user of accessLevelDto.users) {
      userIds.push(new Types.ObjectId(user));
    }

    return this.accessLevelModel.create({
      ...accessLevelDto,
      users: userIds,
      createdBy,
      updatedBy: createdBy,
    });
  }

  public async getAll(): Promise<AccessLevel[]> {
    return this.accessLevelModel.find();
  }

  public async updateById(
    accessLevelId: string,
    accessLevelDto: CreateAccessLevelDto,
    updatedBy: Types.ObjectId,
  ): Promise<AccessLevel> {
    const accessLevel = await this.accessLevelModel.findById(new Types.ObjectId(accessLevelId));
    if (!accessLevel) {
      throw new HttpException('AccessLevel not found', HttpStatus.NOT_FOUND);
    }

    accessLevel.name = accessLevelDto.name;
    accessLevel.permissions = accessLevelDto.permissions;
    const userIds: Types.ObjectId[] = [];
    for (const user of accessLevelDto.users) {
      userIds.push(new Types.ObjectId(user));
    }

    accessLevel.users = userIds;
    accessLevel.updatedBy = updatedBy;

    return accessLevel.save();
  }

  public async grantAccessLevel(
    accessLevelId: string,
    users: string[],
    updatedBy: Types.ObjectId,
  ): Promise<AccessLevel> {
    const accessLevel = await this.accessLevelModel.findById(new Types.ObjectId(accessLevelId));
    if (!accessLevel) {
      throw new HttpException('AccessLevel not found', HttpStatus.NOT_FOUND);
    }

    for (const user of users) {
      const userId = new Types.ObjectId(user);
      if (!accessLevel.users.includes(userId)) accessLevel.users.push(userId);
    }

    accessLevel.updatedBy = updatedBy;

    return accessLevel.save();
  }

  public async revokeAccessLevel(
    accessLevelId: string,
    users: string[],
    updatedBy: Types.ObjectId,
  ): Promise<AccessLevel> {
    const accessLevel = await this.accessLevelModel.findById(new Types.ObjectId(accessLevelId));
    if (!accessLevel) {
      throw new HttpException('AccessLevel not found', HttpStatus.NOT_FOUND);
    }

    accessLevel.users = accessLevel.users.filter(accessLevelUser => {
      return !users.includes(accessLevelUser.toString());
    });

    accessLevel.updatedBy = updatedBy;

    return accessLevel.save();
  }

  public async deleteAccessLevel(accessLevelId: string): Promise<void> {
    const result = await this.accessLevelModel.deleteOne({ _id: new Types.ObjectId(accessLevelId) });

    if (result.deletedCount === 0) {
      throw new HttpException('AccessLevel not found', HttpStatus.NOT_FOUND);
    }
  }
}
