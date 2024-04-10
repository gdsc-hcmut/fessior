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
import { UserResponse } from '../users/dto/create-user.dto';

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
  public async getProfile(@Req() req: Request): Promise<ControllerResponse<UserResponse | null>> {
    const { userId } = req.tokenMeta;
    const profile = await this.meService.getProfile(userId);
    if (!profile) return { payload: null };

    const userResponse = <UserResponse>{
      _id: userId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      appleId: profile.appleId,
      dateOfBirth: profile.dateOfBirth,
      googleId: profile.googleId,
      isManager: profile.isManager,
      phone: profile.phone,
      picture: profile.picture,
      isPartner: await this.organizationsService.isPartner(userId.toString()),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      hasPassword: !!profile.password,
    };

    return { payload: userResponse };
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
