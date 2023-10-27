import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}
  public async signAsync(payload: { tokenId: Types.ObjectId }): Promise<string> {
    return this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET });
  }

  public async verifyAsync(token: string): Promise<{ tokenId: string }> {
    return this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
  }
}
