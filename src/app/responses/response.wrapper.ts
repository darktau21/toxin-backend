import { HttpStatus } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { ResponseStatus } from './response-status.enum';

export class ResponseWrapper<T> {
  @ApiPropertyOptional({
    description: 'HTTP код ответа',
    enum: HttpStatus,
    enumName: 'HttpStatus',
  })
  code?: HttpStatus;

  data?: T;
  message?: string;
  status: ResponseStatus;

  constructor(
    status: ResponseStatus,
    data?: T,
    code?: HttpStatus,
    message?: string,
  ) {
    this.status = status;
    this.data = data;
    this.code = code;
    this.message = message;
  }
}
