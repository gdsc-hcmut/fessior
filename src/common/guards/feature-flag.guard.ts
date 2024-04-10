import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'src/constants/types';

import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { FLAG_KEY } from '../decorators/flags.decorator';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly featureFlagsService: FeatureFlagsService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const { userId } = req.tokenMeta;

    const requiredFlag = this.reflector.getAllAndOverride<string>(FLAG_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredFlag) {
      return true;
    }

    const featureFlag = await this.featureFlagsService.findByKeyAndPopulate(requiredFlag);

    if (!featureFlag) {
      return true;
    }

    if (!featureFlag.isEnabled) {
      return true;
    }

    let isUserInGroup = false;
    featureFlag.targetGroups.forEach(group => {
      if (group.users.some(user => user.toString() === userId.toString())) {
        isUserInGroup = true;
      }
    });

    return isUserInGroup;
  }
}
