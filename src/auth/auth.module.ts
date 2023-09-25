import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Public } from 'src/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../token/tokens.module';
import { UsersModule } from '../users/users.module';

@Public()
@Module({
  imports: [
    TokensModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '31536000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
