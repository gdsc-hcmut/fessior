import { BadRequestException, Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ControllerResponse, Request } from 'src/constants/types';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('auth')
@Controller()
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  public async login(@Body() dto: LoginDto): Promise<ControllerResponse<{ token: string; hasPassword: boolean }>> {
    const { token, username, password } = dto;
    if (token) {
      const { accessToken, hasPassword } = await this.authService.loginWithGoogleToken(token);
      return { payload: { token: accessToken, hasPassword } };
    }

    if (!username || !password) {
      throw new BadRequestException('Username or password is invalid');
    }

    const { accessToken, hasPassword } = await this.authService.loginWithUsernameAndPassword(username, password);
    return { payload: { token: accessToken, hasPassword } };
  }

  @Post('/logout')
  public async logout(@Body('token') token: string): Promise<ControllerResponse<string>> {
    await this.authService.logout(token);
    return { payload: '' };
  }

  @Post('/password')
  @UseGuards(AuthGuard)
  public async createPassword(@Req() req: Request, @Body() dto: PasswordDto): Promise<ControllerResponse<boolean>> {
    const { newPassword } = dto;
    return { payload: await this.authService.createPassword(req.tokenMeta.userId.toString(), newPassword) };
  }

  @Patch('/password')
  @UseGuards(AuthGuard)
  public async updatePassword(@Req() req: Request, @Body() dto: PasswordDto): Promise<ControllerResponse<boolean>> {
    const { oldPassword, newPassword } = dto;
    return {
      payload: await this.authService.updatePassword(req.tokenMeta.userId.toString(), oldPassword, newPassword),
    };
  }
}
