import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class MeService {
  constructor(private readonly usersService: UsersService) {}

  public async getProfile(userId: Types.ObjectId): Promise<User | null> {
    return this.usersService.findById(userId);
  }
}
