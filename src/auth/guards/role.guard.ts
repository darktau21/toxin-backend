import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { getRoles } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = getRoles(context, this.reflector);

    if (!roles || !roles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<FastifyRequest>();

    return roles.includes(user?.role);
  }
}
