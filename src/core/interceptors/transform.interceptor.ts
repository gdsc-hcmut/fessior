import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
  payload: unknown;
  message: string;
}

const DEFAULT_MESSAGE = 'Success';

@Injectable()
export class TransformInterceptor implements NestInterceptor<unknown, Response> {
  public intercept(ctx: ExecutionContext, next: CallHandler): Observable<Response> {
    const { statusCode } = ctx.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(map(data => ({ payload: data.payload, message: data.message ?? DEFAULT_MESSAGE, statusCode })));
  }
}
