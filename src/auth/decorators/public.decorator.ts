import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Public = Reflector.createDecorator({ transform: () => true });

export const isPublic = (ctx: ExecutionContext, reflector: Reflector) =>
  reflector.getAllAndOverride<boolean>(Public, [
    ctx.getHandler(),
    ctx.getClass(),
  ]);
