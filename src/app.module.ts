import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';

import { AccessLevelsModule } from './access-levels/access-levels.module';
import { AdminAccessLevelsModule } from './admin/access-levels/access-levels.module';
import { AdminFeatureFlagsModule } from './admin/feature-flags/feature-flags.module';
import { AdminOrganizationsModule } from './admin/organizations/organizations.module';
import { AdminTargetGroupsModule } from './admin/target-groups/target-groups.module';
import { AdminUsersModule } from './admin/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExceptionsFilter, CommonModule } from './common';
import { CoreModule } from './core/core.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { JwtModule } from './jwt/jwt.module';
import { MeModule } from './me/me.module';
import { OrganizationsModule } from './organization/organizations.module';
import { RootModule } from './root/root.module';
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
    AdminAccessLevelsModule,
    AdminFeatureFlagsModule,
    AdminOrganizationsModule,
    AdminTargetGroupsModule,
    AdminUsersModule,
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
    RootModule,
    RouterModule.register([
      {
        path: '/',
        module: RootModule,
      },
      // Router for user path
      {
        path: 'api',
        children: [
          {
            path: 'templates',
            module: TemplatesModule,
          },
          {
            path: 'access-levels',
            module: AccessLevelsModule,
          },
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'feature-flags',
            module: FeatureFlagsModule,
          },
          {
            path: 'me',
            module: MeModule,
          },
          {
            path: 'organizations',
            module: OrganizationsModule,
          },
          {
            path: 'target-groups',
            module: TargetGroupsModule,
          },
          { path: 'urls', module: UrlsModule },
          {
            path: 'users',
            module: UsersModule,
          },
        ],
      },
      // Router for admin path
      {
        path: 'admin/api',
        children: [
          {
            path: 'access-levels',
            module: AdminAccessLevelsModule,
          },
          {
            path: 'feature-flags',
            module: AdminFeatureFlagsModule,
          },
          {
            path: 'organizations',
            module: AdminOrganizationsModule,
          },
          {
            path: 'target-groups',
            module: AdminTargetGroupsModule,
          },
          {
            path: 'users',
            module: AdminUsersModule,
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
