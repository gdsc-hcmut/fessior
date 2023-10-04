import { Controller, Get, Req, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ControllerResponse, Request } from '../constants/types';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  public async findOne(@Req() req: Request): Promise<ControllerResponse<User | null>> {
    return { payload: await this.usersService.getUserProfile(req.tokenMeta.userId) };
  }
}
