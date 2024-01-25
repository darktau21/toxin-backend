import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { ROLES_METADATA_KEY } from '~/auth/decorators';
import { Roles } from '~/user/interfaces';

import { IAccessTokenData } from '../interfaces';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles || !roles.length) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user: IAccessTokenData }>();

    return roles.includes(user?.role);
  }
}
