import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  public async findAll(): Promise<User[]> {
    this.logger.log('Find all users');
    return this.userModel.find().exec();
  }

  public async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  public async getByEmail(email: string, name: string): Promise<UserDocument> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = await this.userModel.create({ email, name });
    }
    return user;
  }

  public async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndRemove({ _id: id }).exec();
  }
}
