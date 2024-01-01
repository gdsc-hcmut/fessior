import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expression, FilterQuery, Model, ObjectId, ProjectionType, QueryOptions, Types, UpdateQuery } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { SortOption } from '../constants/types';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  public async findById(userId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  public async findMany(ids: string[]): Promise<{ _id: ObjectId }[]> {
    return this.userModel.find({ _id: { $in: ids } }, '_id');
  }

  public async findAll(
    limit: number,
    offset: number,
    sortOption: SortOption,
  ): Promise<{ users: User[]; total: number }> {
    this.logger.log('Find all users');

    let sort: Record<string, 1 | -1 | Expression.Meta>;

    switch (sortOption) {
      case SortOption.DATE:
        sort = { updatedAt: 1 };
        break;
      case SortOption.ASC:
        sort = { firstName: 1 };
        break;
      default:
        sort = { firstName: -1 };
        break;
    }

    const users: User[] = await this.userModel.find().sort(sort).skip(offset).limit(limit);
    const total = users.length;
    return { users, total };
  }

  public async getByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }

  public async findOne(
    filter?: FilterQuery<UserDocument>,
    projection?: ProjectionType<UserDocument>,
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne(filter, projection, options);
  }

  public async findByIdAndUpdate(
    id?: string,
    update?: UpdateQuery<UserDocument>,
    options?: QueryOptions<UserDocument>,
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, update, options);
  }

  public async updateUserPassword(userId: string, password: string): Promise<UserDocument | null> {
    return this.findByIdAndUpdate(userId, { $set: { password } }, { new: true });
  }

  public async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
