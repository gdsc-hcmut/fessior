import { Body, Controller, Delete, Get, Param, Post, Version } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// Auth Module
// Login -> Check Valid token now > iat && now < exp -> Check user email existed in User Collection
// If email user existed -> Create new jwt (refresh_token, access_token -> 24h) (userId, expireTime 365 days) -> Return
// If email user not existed -> Create new user -> Store name, picture,
// email -> Create jwt (refresh_token, access_token -> 24h) (userId, expireTime 365 days) -> Return
// refresh_token -> access_token

// Logout -> Deactivate Token

// Jwt Module
// Token Model -> ...

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

  @Post('/login')
  public async login(@Body('token') token: string): Promise<any> {
    console.log(token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // log the ticket payload in the console to see what we have
    console.log(ticket.getPayload());
    return { payload: ticket.getPayload() };
  }

  @Version('2') // This version will override the previous
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
