import { Global, Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OrganizationsModule } from '../organization/organizations.module';
import { TokensModule } from '../token/tokens.module';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [TokensModule, UsersModule, OrganizationsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
