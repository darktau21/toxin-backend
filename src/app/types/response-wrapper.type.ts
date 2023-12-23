import type { HttpStatus } from '@nestjs/common';

export type ResponseWrapper<T> =
  | {
      code?: HttpStatus;
      data?: T;
      message: string;
      status: 'error';
    }
  | {
      data: T;
      status: 'fail';
    }
  | {
      data: T;
      status: 'success';
    };
