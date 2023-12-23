import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

import type { ResponseWrapper } from '~/app/types/response-wrapper.type';

export class ResponseWrapperInterceptor<T>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        status: 'success',
      })),
    );
  }
}
