import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { UserDocument } from '~/user';

export const User = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const request = ctx
    .switchToHttp()
    .getRequest<FastifyRequest & { user?: UserDocument }>();
  return request.user;
});
