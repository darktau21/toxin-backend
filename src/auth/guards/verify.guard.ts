import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { isVerificationRequired } from '../decorators';

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    if (!isVerificationRequired(context, this.reflector)) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<FastifyRequest>();

    return user?.isVerified;
  }
}
