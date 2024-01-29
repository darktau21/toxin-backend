import type { FastifyRequest } from 'fastify';

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { REFRESH_TOKEN_COOKIE } from '../interfaces';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return !request.cookies[REFRESH_TOKEN_COOKIE];
  }
}
