import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAccessLevelDto } from './dto/create-access-level.dto';
import { UpdateAccessLevelDto } from './dto/update-access-level.dto';
import { AccessLevel } from './schemas/access-level.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AccessLevelsService {
  private readonly logger: Logger = new Logger(AccessLevelsService.name);

  constructor(
    @InjectModel(AccessLevel.name) private readonly accessLevelModel: Model<AccessLevel>,
    private readonly usersService: UsersService,
  ) {}

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

  public async updateOne(id: string, dto: UpdateAccessLevelDto): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(id);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    const { name, updatedBy, permissions, users } = dto;
    return this.accessLevelModel.findByIdAndUpdate(
      id,
      {
        $set: { name, updatedBy, users },
        $addToSet: { permissions: { $each: permissions } },
      },
      { new: true },
    );
  }

  public async grantToUsers(userIds: string[], accessLevelId: string): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(accessLevelId);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    const users = await this.usersService.findMany(userIds);
    if (users.length === 0) {
      throw new BadRequestException('No user exists');
    }

    const ids = users.map(user => user._id);
    return this.accessLevelModel.findByIdAndUpdate(
      accessLevelId,
      { $addToSet: { users: { $each: ids } } },
      { new: true },
    );
  }

  public async revokeUsers(userIds: string[], accessLevelId: string): Promise<AccessLevel | null> {
    const accessLevel = await this.accessLevelModel.findById(accessLevelId);
    if (!accessLevel) {
      throw new NotFoundException('Access level not found');
    }

    const users = await this.usersService.findMany(userIds);
    if (users.length === 0) {
      throw new BadRequestException('No user exists');
    }

    const ids = users.map(user => user._id);
    return this.accessLevelModel.findByIdAndUpdate(accessLevelId, { $pull: { users: { $in: ids } } }, { new: true });
  }

  public async delete(id: string): Promise<AccessLevel | null> {
    return this.accessLevelModel.findByIdAndDelete(id);
  }
}
