import type { FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { REFRESH_TOKEN_COOKIE } from '../interfaces';

@Injectable()
export class UnauthorizedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return !request.cookies[REFRESH_TOKEN_COOKIE];
  }
}
