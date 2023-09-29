import { Global, Module } from '@nestjs/common';
import { JwtModule as EJwtModule } from '@nestjs/jwt';

import { JwtService } from './jwt.services';

@Global()
@Module({
  imports: [
    EJwtModule.register({
      signOptions: { expiresIn: '31536000' },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
