import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MeService } from './me.service';
import { Flag } from '../common/decorators/flags.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { FeatureFlagGuard } from '../common/guards/feature-flag.guard';
import { ControllerResponse, FlagName, Request } from '../constants/types';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { OrganizationsService } from '../organization/organizations.service';
import { Organization } from '../organization/schemas/organization.schema';
import { User } from '../users/schemas/user.schema';

@ApiTags('me')
@Flag(FlagName.GET_ME)
@UseGuards(AuthGuard, FeatureFlagGuard)
@Controller()
export class MeController {
  constructor(
    public readonly meService: MeService,
    public readonly organizationsService: OrganizationsService,
    public readonly featureFlagsService: FeatureFlagsService,
  ) {}

  @Get()
  public async getProfile(@Req() req: Request): Promise<ControllerResponse<User | null>> {
    return { payload: await this.meService.getProfile(req.tokenMeta.userId) };
  }

  @Get('organizations')
  public async getOrganizations(@Req() req: Request): Promise<ControllerResponse<Organization[]>> {
    const { userId } = req.tokenMeta;

    return { payload: await this.organizationsService.getOrganizationsByUserId(userId.toString()) };
  }

  @Get('feature-flags')
  public async getFeatureFlags(@Req() req: Request): Promise<ControllerResponse<{ [key in string]: boolean }>> {
    const { userId } = req.tokenMeta;

    return { payload: await this.featureFlagsService.getUserFeatureFlags(userId.toString()) };
  }
}
