import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ObjectIdValidationPipe } from 'src/common/pipes';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { Flag } from '../common/decorators/flags.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { FeatureFlagGuard } from '../common/guards/feature-flag.guard';
import { ControllerResponse, FlagName, SortOption } from '../constants/types';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'sort', enum: SortOption })
  @Flag(FlagName.GET_ALL_USERS)
  @UseGuards(FeatureFlagGuard)
  public async getAllUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('sort') sortOption: SortOption = SortOption.DESC,
  ): Promise<ControllerResponse<{ users: User[]; total: number }>> {
    return { payload: await this.usersService.findAll(limit, offset, sortOption) };
  }

  @Get(':id')
  @Flag(FlagName.GET_USER_BY_ID)
  @UseGuards(FeatureFlagGuard)
  public async getUserById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<{ user: User | null }>> {
    const user = await this.usersService.getUserProfile(new Types.ObjectId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      payload: {
        user,
      },
    };
  }
}
