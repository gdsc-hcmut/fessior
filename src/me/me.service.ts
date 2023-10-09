import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from '../users/schemas/user.schema';

@Injectable()
export class MeService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async getProfile(userId: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(userId);
  }
}
