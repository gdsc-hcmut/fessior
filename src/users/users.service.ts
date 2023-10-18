import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expression, Model, Types } from 'mongoose';

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

  public async getUserProfile(userId: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
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
    return this.userModel.findOne({ email });
  }

  public async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
