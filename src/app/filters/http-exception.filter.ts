import type { FastifyReply } from 'fastify';

import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ResponseStatus, ResponseWrapper } from '../responses';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const result: ResponseWrapper<unknown> = {
      data: { message: 'Unrecognized exception' },
      status: ResponseStatus.FAIL,
    };

    if (statusCode >= 500) {
      return response.code(statusCode).send({
        message: 'Something went wrong',
        status: ResponseStatus.ERROR,
      } satisfies ResponseWrapper<unknown>);
    }

    if (statusCode === HttpStatus.BAD_REQUEST) {
      result.data = exceptionResponse;
      return response.code(statusCode).send(result);
    }

    if (typeof exceptionResponse === 'string') {
      result.data = {
        message: exceptionResponse,
      };
    } else {
      result.data = {
        message:
          'message' in exceptionResponse
            ? exceptionResponse.message
            : 'Unrecognized exception',
      };
    }

    return response.code(statusCode).send(result);
  }
}
