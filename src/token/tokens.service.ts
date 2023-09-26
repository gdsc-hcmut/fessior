import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException('Token is not valid', HttpStatus.UNAUTHORIZED);
    }

    return this.usersService.findOne(token.userId.toString());
  }

  public async deactivateToken(tokenId: string): Promise<TokenDocument> {
    const token = await this.tokenModel.findById(new Types.ObjectId(tokenId));

    if (!token) {
      throw new HttpException('Token is not valid', HttpStatus.UNAUTHORIZED);
    }

    token.isActivate = false;
    await token.save();
    return token;
  }

  public async checkValidToken(tokenId: string): Promise<boolean> {
    const token = await this.tokenModel.findById(new Types.ObjectId(tokenId));

    if (!token) {
      throw new HttpException('Token is not valid', HttpStatus.UNAUTHORIZED);
    }

    console.log(Date.now(), token.expiredAt);

    if (Date.now() > token.expiredAt) {
      token.isActivate = false;
      await token.save();
    }

    return token.isActivate;
  }
}
