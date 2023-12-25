import type { FastifyReply } from 'fastify';

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import type { ResponseWrapper } from '~/app/types';

@Catch(HttpException)
export class HttpClientExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const next = ctx.getNext();

    if (exception.getStatus() >= 400 && exception.getStatus() < 500) {
      return response.code(exception.getStatus()).send({
        data: exception.getResponse(),
        status: 'fail',
      } satisfies ResponseWrapper<unknown>);
    }

    next();
  }
}
