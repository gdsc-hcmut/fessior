import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

import { AccessLevelsModule } from './access-levels/access-levels.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExceptionsFilter, CommonModule } from './common';
import { CoreModule } from './core/core.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { JwtModule } from './jwt/jwt.module';
import { MeModule } from './me/me.module';
import { OrganizationsModule } from './organization/organizations.module';
import { TargetGroupsModule } from './target-groups/target-groups.module';
import { TemplatesModule } from './templates/templates.module';
import { UrlsModule } from './urls/urls.module';
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
    UrlsModule,
    FeatureFlagsModule,
    TargetGroupsModule,
    AccessLevelsModule,
    OrganizationsModule,
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
          { path: 'urls', module: UrlsModule },
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
          {
            path: 'feature-flags',
            module: FeatureFlagsModule,
          },
          {
            path: 'target-groups',
            module: TargetGroupsModule,
          },
          {
            path: 'access-levels',
            module: AccessLevelsModule,
          },
          {
            path: 'organizations',
            module: OrganizationsModule,
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
