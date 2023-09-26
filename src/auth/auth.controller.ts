import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OAuth2Client } from 'google-auth-library';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TokenMetaDto } from './dto/tokenMeta.dto';
import { TokenMeta } from '../constants/types';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
@Controller()
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(public readonly authService: AuthService) {}
  @Post('/login')
  public async login(@Body('token') token: string): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // log the ticket payload in the console to see what we have
    console.log(token);

    const tokenInfo = ticket.getPayload();
    if (!tokenInfo || tokenInfo.exp < Date.now() / 1000) {
      throw Error('Token is not valid');
    }
    const accessToken = await this.authService.login(tokenInfo);

    return { payload: accessToken };
  }

  @Post('/logout')
  public async logout(@Body('token') token: string): Promise<any> {
    await this.authService.logout(token);
    return { payload: { test: 'something' } };
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  public getProfile(@TokenMeta() tokenMeta: TokenMetaDto): any {
    console.log(tokenMeta);
    return { payload: 'test' };
  }
}
