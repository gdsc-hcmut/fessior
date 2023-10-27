/* eslint-disable import/no-import-module-exports */
import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/exception.filter';

// TODO enhance this better with ts
declare const module: any;

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const isProduction = process.env.NODE_ENV === 'production';

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalFilters(new AllExceptionFilter(app.get(Logger)));

  app.useGlobalPipes(new ValidationPipe());

  // Express Middleware
  middleware(app);

  if (isProduction) {
    app.enable('trust proxy');
  }

  // Enable versioning v1,v2,...
  app.enableVersioning({
    defaultVersion: '1', // default version
    type: VersioningType.URI,
  });

  app.use(
    ['/api-docs'],
    expressBasicAuth({ challenge: true, users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD } }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fessior Community')
    .setDescription('The Fessior Community API description')
    .setVersion('1.0')
    .addTag('Fessior Community')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);

  if (module.hot) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.accept();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    module.hot.dispose(async () => app.close());
  }

  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
