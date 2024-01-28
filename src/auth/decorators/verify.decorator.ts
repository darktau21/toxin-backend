import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Verify = Reflector.createDecorator({ transform: () => true });

export const isVerified = (context: ExecutionContext, reflector: Reflector) =>
  reflector.getAllAndOverride(Verify, [
    context.getHandler(),
    context.getClass(),
  ]);
