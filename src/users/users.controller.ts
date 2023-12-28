import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller()
export class UsersController {}
