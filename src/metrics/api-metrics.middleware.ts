import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { addHttpRequestMetric } from './metrics';

@Injectable()
export class ApiMetricsMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    const requestStartTime = Date.now();

    res.once('finish', () => {
      const responseTimeMilliseconds = Date.now() - requestStartTime;
      addHttpRequestMetric({
        method: req.method,
        route: req.route.path,
        status: res.statusCode,
        responseTimeMilliseconds,
      });
    });
    next();
  }
}
