import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MeService } from './me.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ControllerResponse, Request } from '../constants/types';
import { User } from '../users/schemas/user.schema';

@ApiTags('me')
@UseGuards(AuthGuard)
@Controller()
export class MeController {
  constructor(public readonly meService: MeService) {}

  @Get()
  public async getProfile(@Req() req: Request): Promise<ControllerResponse<User | null>> {
    return { payload: await this.meService.getProfile(req.tokenMeta.userId) };
  }
}
