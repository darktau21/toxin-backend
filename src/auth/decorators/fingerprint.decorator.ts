import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { lookup } from 'geoip-lite';

import { IFingerprint } from '~/auth/interfaces';

export const Fingerprint = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): IFingerprint => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];
    const location = lookup(ip);

    return { ip, location, userAgent };
  },
);
