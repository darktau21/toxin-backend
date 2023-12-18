import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { ROLES_METADATA_KEY } from '~/auth/decorators';
import { Roles, UserDocument } from '~/user/schemas';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Roles[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(roles);

    if (!roles || !roles.length) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<FastifyRequest & { user: UserDocument }>();

    return roles.includes(user.role);
  }
}
