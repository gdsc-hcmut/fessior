import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type ControllerResponse<T> = {
  payload: T;
  message?: string;
};

export const TokenMeta = createParamDecorator((_data: unknown, ctx: ExecutionContext): unknown => {
  const request = ctx.switchToHttp().getRequest();
  return request.tokenMeta;
});
