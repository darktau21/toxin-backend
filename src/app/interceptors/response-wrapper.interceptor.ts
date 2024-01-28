import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { ResponseStatus, ResponseWrapper } from '../responses';

export class ResponseWrapperInterceptor<T = unknown>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    return next
      .handle()
      .pipe(map((data) => new ResponseWrapper(ResponseStatus.SUCCESS, data)));
  }
}
