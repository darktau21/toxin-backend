import type { MultipartFile } from '@fastify/multipart';
import type { FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';

import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
  mixin,
} from '@nestjs/common';

export function FileInterceptor<T extends string>(field: T) {
  class FileInterceptorMixin implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      const req = context
        .switchToHttp()
        .getRequest<FastifyRequest & { body: Record<T, MultipartFile> }>();
      const file = await req.file();
      console.log(file);
      return next.handle();
    }
  }

  return mixin(FileInterceptorMixin);
}
