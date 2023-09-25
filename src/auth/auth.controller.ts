import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
@Controller()
export class AuthController {
  constructor(public readonly authService: AuthService) {}
  @Post('/login')
  public async login(@Body('token') token: string): Promise<any> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // log the ticket payload in the console to see what we have

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
  public getProfile(@Request() req: Request): any {
    console.log(req.tokenMeta.userId);
    return { payload: 'test' };
  }
}
