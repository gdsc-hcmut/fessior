import { Injectable } from '@nestjs/common';
import { JwtService as EJWtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: EJWtService) {}
  public async signSync(payload: { tokenId: Types.ObjectId }): Promise<string> {
    return this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET });
  }

  public async verifyAsync(token: string): Promise<{ tokenId: string }> {
    return this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
  }
}