import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OAuth2Client } from 'google-auth-library';
import { ControllerResponse, TokenPayload } from 'src/constants/types';

import { AuthService } from './auth.service';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
@Controller()
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  public async login(@Body('token') token: string): Promise<ControllerResponse<string>> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const googleId = ticket.getUserId();
      const tokenInfo = ticket.getPayload();

      if (!tokenInfo || tokenInfo.exp < Date.now() / 1000) {
        throw Error('Token is not valid');
      }
      const { accessToken } = await this.authService.login(<TokenPayload>tokenInfo, googleId);

      return { payload: accessToken };
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/logout')
  public async logout(@Body('token') token: string): Promise<ControllerResponse<string>> {
    await this.authService.logout(token);
    return { payload: '' };
  }
}
