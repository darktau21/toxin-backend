import {
  HttpException as _HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class HttpException extends _HttpException {
  constructor(
    errors: Record<string, string[]>,
    httpStatus: HttpStatus,
    options?: HttpExceptionOptions,
  ) {
    super(errors, httpStatus, options);
  }
}
