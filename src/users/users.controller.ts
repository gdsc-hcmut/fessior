import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ControllerResponse, SortOptions } from '../constants/types';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'sort', enum: SortOptions })
  public async getAllUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('sort') sortOption: SortOptions = SortOptions.DESC,
  ): Promise<ControllerResponse<{ users: User[]; total: number }>> {
    return { payload: await this.usersService.findAll(limit, offset, sortOption) };
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string): Promise<ControllerResponse<{ user: User | null }>> {
    return { payload: { user: await this.usersService.getUserProfile(new Types.ObjectId(id)) } };
  }
}
