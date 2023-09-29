import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Token, TokenSchema } from './schemas/token.model';
import { TokensService } from './tokens.service';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]), UsersModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
