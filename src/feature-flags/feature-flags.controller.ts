import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('feature-flags')
@UseGuards(AuthGuard)
@Controller()
export class FeatureFlagsController {}
