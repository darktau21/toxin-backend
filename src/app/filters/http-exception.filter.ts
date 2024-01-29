import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ResponseStatus, ResponseWrapper } from '../responses';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    response
      .code(exception.getStatus())
      .send(new ResponseWrapper(ResponseStatus.FAIL, exception.getResponse()));
  }
}
