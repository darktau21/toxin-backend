import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Public = Reflector.createDecorator({ transform: () => true });

export const isPublic = (context: ExecutionContext, reflector: Reflector) =>
  reflector.getAllAndOverride<boolean>(Public, [
    context.getHandler(),
    context.getClass(),
  ]);
