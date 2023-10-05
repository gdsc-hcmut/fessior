import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

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

  public async findAll(limit: number, offset: number): Promise<User[]> {
    this.logger.log('Find all users');
    return this.userModel.aggregate([{ $limit: limit }, { $skip: offset }]);
  }

  public async getByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  public async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
