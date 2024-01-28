import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { UserService } from '~/user/user.service';

import { isVerified as isVerificationRequired } from '../decorators';

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (!isVerificationRequired(context, this.reflector)) {
      return true;
    }
    const userId = context.switchToHttp().getRequest<FastifyRequest>().user?.id;

    const user = await this.userService.findById(userId);
    return user?.isVerified;
  }
}
