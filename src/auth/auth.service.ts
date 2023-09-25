import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'google-auth-library';

import { TokensService } from '../token/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    public readonly tokensService: TokensService,
    public readonly usersService: UsersService,
    public readonly jwtService: JwtService,
  ) {}

  public async login(tokenInfo: TokenPayload): Promise<any> {
    const { email, name } = tokenInfo;
    if (!email || !name) {
      throw Error('Token is not right');
    }
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({ name, email });
    }

    const token = await this.tokensService.createToken(user._id);

    const payload = { tokenId: token._id };

    return this.jwtService.signAsync(payload);
  }

  public async logout(accessToken: string): Promise<any> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET,
    });

    const { tokenId } = payload;
    if (typeof tokenId !== 'string') throw Error('Wrong type of tokenId');
    const token = await this.tokensService.deactivateToken(tokenId);
    return { payload: { token } };
  }
}
