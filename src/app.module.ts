import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExceptionsFilter, CommonModule } from './common';
import { CoreModule } from './core/core.module';
import { JwtModule } from './jwt/Jwt.module';
import { MeModule } from './me/me.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_HOST),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    CoreModule,
    JwtModule,
    AuthModule,
    UsersModule,
    CommonModule,
    TemplatesModule,
    MeModule,
    RouterModule.register([
      // Router for user path
      {
        path: 'api',
        children: [
          {
            path: 'me',
            module: MeModule,
          },
          {
            path: 'auth',
            module: AuthModule,
          },
        ],
      },
      // Router for admin path
      {
        path: 'admin/api',
        children: [
          {
            path: 'templates',
            module: TemplatesModule,
          },
          {
            path: 'users',
            module: UsersModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    // Global Pipe, Validation check
    // https://docs.nestjs.com/pipes#global-scoped-pipes
    // https://docs.nestjs.com/techniques/validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // transform object to DTO class
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
