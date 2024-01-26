import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Roles } from '~/user/interfaces';

export const Role = Reflector.createDecorator<Roles | Roles[]>();

export const getRoles = (context: ExecutionContext, reflector: Reflector) =>
  reflector.getAllAndMerge(Role, [context.getHandler(), context.getClass()]);
