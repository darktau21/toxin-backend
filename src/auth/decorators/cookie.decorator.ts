import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Cookie = createParamDecorator(
  (cookieKey: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return cookieKey ? request.cookies?.[cookieKey] : request.cookies;
  },
);
