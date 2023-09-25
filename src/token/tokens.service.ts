import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Token, TokenDocument } from './schemas/token.model';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    public readonly usersService: UsersService,
  ) {}

  public async createToken(userId: Types.ObjectId): Promise<TokenDocument> {
    return this.tokenModel.create({ userId });
  }

  public async getUserToken(tokenId: string): Promise<UserDocument | null> {
    const token = await this.tokenModel.findOne({ _id: tokenId });

    if (!token) {
      throw Error('Could not find token');
    }

    return this.usersService.findOne(token.userId.toString());
  }

  public async deactivateToken(tokenId: string): Promise<TokenDocument> {
    const token = await this.tokenModel.findOne({ _id: tokenId });

    if (!token) {
      throw Error('Could not find token');
    }

    token.isActivate = false;
    await token.save();
    return token;
  }
}
