import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/constants/types';

import { JwtService } from '../jwt/jwt.services';
import { TokensService } from '../token/tokens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(tokenInfo: TokenPayload, googleId: string | null): Promise<{ accessToken: string }> {
    const { email } = tokenInfo;

    let user = await this.usersService.getByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        firstName: tokenInfo.given_name,
        lastName: tokenInfo.family_name,
        picture: tokenInfo.picture,
        email: tokenInfo.email,
        dateOfBirth: null,
        phone: null,
        googleId,
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
