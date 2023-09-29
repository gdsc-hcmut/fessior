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

  public async login(tokenInfo: TokenPayload): Promise<{ accessToken: string }> {
    const { email, name } = tokenInfo;

    const user = await this.usersService.getByEmail(email, name);

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
