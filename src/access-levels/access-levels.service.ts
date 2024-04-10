import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/constants/types';

import { CreateAccessLevelDto } from './dto/create-access-level.dto';
import { UpdateAccessLevelDto } from './dto/update-access-level.dto';
import { AccessLevel } from './schemas/access-level.schema';

@Injectable()
export class AccessLevelsService {
  constructor(@InjectModel(AccessLevel.name) private readonly accessLevelModel: Model<AccessLevel>) {}

  public async create(dto: CreateAccessLevelDto): Promise<AccessLevel> {
    const { name } = dto;
    const accessLevel = await this.accessLevelModel.findOne({ name });
    if (accessLevel) {
      throw new BadRequestException('Access level name already exists');
    }

    return this.accessLevelModel.create(dto);
  }

  public async findAll(): Promise<AccessLevel[]> {
    return this.accessLevelModel.find();
  }

  public async findOne(id: string): Promise<AccessLevel | null> {
    return this.accessLevelModel.findById(id);
  }

  // just simply add more users and permissions
  public async updateOne(id: string, dto: UpdateAccessLevelDto): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(id);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    const { name, updatedBy, permissions, users } = dto;
    return this.accessLevelModel.findByIdAndUpdate(
      id,
      {
        $set: { name, updatedBy },
        $addToSet: { permissions: { $each: permissions }, users: { $each: users } },
      },
      { new: true },
    );
  }

  // grant more users and permissions
  public async grantPermissionsToUsers(
    userIds: string[],
    permissions: Permission[],
    accessLevelId: string,
  ): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(accessLevelId);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    return this.accessLevelModel.findByIdAndUpdate(
      accessLevelId,
      { $addToSet: { users: { $each: userIds }, permissions: { $each: permissions } } },
      { new: true },
    );
  }

  // revoke users and permissions
  public async revokeUsersAndPermission(
    userIds: string[],
    permissions: Permission[],
    accessLevelId: string,
  ): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(accessLevelId);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    return this.accessLevelModel.findByIdAndUpdate(
      accessLevelId,
      { $pull: { users: { $in: userIds }, permissions: { $in: permissions } } },
      { new: true },
    );
  }

  public async delete(id: string): Promise<AccessLevel | null> {
    return this.accessLevelModel.findByIdAndDelete(id);
  }
}
