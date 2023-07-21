import { Body, Controller, Delete, Get, Param, Post, Version } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<User | null> {
    return this.usersService.create(createUserDto);
  }

  @Version('2')
  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<User | null> {
    return this.usersService.delete(id);
  }
}
