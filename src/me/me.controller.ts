import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MeService } from './me.service';
import { Flag } from '../common/decorators/flags.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { FeatureFlagGuard } from '../common/guards/feature-flag.guard';
import { ControllerResponse, FlagName, Request } from '../constants/types';
import { User } from '../users/schemas/user.schema';

@ApiTags('me')
@Flag(FlagName.GET_ME)
@UseGuards(AuthGuard, FeatureFlagGuard)
@Controller()
export class MeController {
  constructor(public readonly meService: MeService) {}

  @Get()
  public async getProfile(@Req() req: Request): Promise<ControllerResponse<User | null>> {
    return { payload: await this.meService.getProfile(req.tokenMeta.userId) };
  }
}
