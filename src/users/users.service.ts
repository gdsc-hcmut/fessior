import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { SortOptions } from '../constants/types';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  public async getUserProfile(userId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  public async findAll(
    limit: number,
    offset: number,
    sortOption: SortOptions,
  ): Promise<{ users: User[]; total: number }> {
    this.logger.log('Find all users');

    let sort: any;

    switch (sortOption) {
      case SortOptions.DATE:
        sort = { updatedAt: 1 };
        break;
      case SortOptions.ASC:
        sort = { firstName: 1 };
        break;
      default:
        sort = { firstName: -1 };
        break;
    }
    const pipeline: PipelineStage[] | undefined = [{ $limit: limit }, { $skip: offset }, { $sort: sort }];

    const users: User[] = await this.userModel.aggregate(pipeline);
    const count = await this.userModel.aggregate(pipeline).count('total');
    const total = count[0].total ?? null;
    return { users, total };
  }

  public async getByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  public async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
