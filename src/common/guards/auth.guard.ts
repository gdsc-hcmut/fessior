import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'src/constants/types';

import { JwtService } from '../../jwt/jwt.services';
import { TokensService } from '../../token/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public readonly jwtService: JwtService, public readonly tokensService: TokensService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const { tokenId }: { tokenId: string } = payload;

      if (!(await this.tokensService.checkValidToken(tokenId))) {
        throw new HttpException('Token is not valid', HttpStatus.BAD_REQUEST);
      }

      const user = await this.tokensService.getUserByTokenId(tokenId);
      if (!user) {
        throw new HttpException('Token is not valid', HttpStatus.BAD_REQUEST);
      }

      request.tokenMeta = { userId: user._id };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
