import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(private readonly logger: PinoLogger) {}

  public use(req: Request, _res: Response, next: () => void): void {
    const user = req.user?.userId;

    // for https://github.com/iamolegga/nestjs-pino/issues/608
    req.customProps = { user };
    // Add extra fields to share in logger context
    this.logger.assign(req.customProps);

    return next();
  }
}
