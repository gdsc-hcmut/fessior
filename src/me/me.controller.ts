import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../common/guards/auth.guard';
import { ControllerResponse, Request } from '../constants/types';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@UseGuards(AuthGuard)
@Controller()
export class MeController {
  constructor(public readonly usersService: UsersService) {}

  @Get()
  public async getProfile(@Req() req: Request): Promise<ControllerResponse<User | null>> {
    return { payload: await this.usersService.getUserProfile(req.tokenMeta.userId) };
  }
}
