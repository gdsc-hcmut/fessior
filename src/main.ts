import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const isProduction = process.env.NODE_ENV === 'production';

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

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

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);

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
