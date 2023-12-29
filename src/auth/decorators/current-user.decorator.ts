import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { IAccessTokenData } from '~/auth/interfaces';

export const CurrentUser = createParamDecorator(
  (_: never, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<FastifyRequest & { user?: IAccessTokenData }>();

    return request.user;
  },
);
