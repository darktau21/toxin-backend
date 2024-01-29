import {
  HttpException as _HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class HttpException extends _HttpException {
  constructor(
    errors: Record<string, string[]> | string,
    httpStatus: HttpStatus,
    options?: HttpExceptionOptions,
  ) {
    if (typeof errors === 'string') {
      super({ message: errors }, httpStatus, options);
    } else {
      super(errors, httpStatus, options);
    }
  }
}
