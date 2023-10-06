import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';

import { JwtService } from '../jwt/jwt.service';
import { TokensService } from '../token/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(tokenInfo: TokenPayload, googleId: string): Promise<{ accessToken: string }> {
    const { email } = tokenInfo;

    if (!email) {
      throw new Error('Could not find email of Token');
    }

    let user = await this.usersService.getByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        firstName: tokenInfo.given_name || null,
        lastName: tokenInfo.family_name || null,
        picture: tokenInfo.picture || null,
        email,
        googleId,
        dateOfBirth: null,
        phone: null,
        appleId: null,
        isManager: false,
      });
    }

    const token = await this.tokensService.createToken(user._id);

    const payload = { tokenId: token._id };

    return { accessToken: await this.jwtService.signSync(payload) };
  }

  public async logout(accessToken: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(accessToken);

    const { tokenId }: { tokenId: string } = payload;

    await this.tokensService.deactivateToken(tokenId);
  }
}
