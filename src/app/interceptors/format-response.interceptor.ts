import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';

import { getResponseFormatMetadata } from '../decorators';
import { PaginatedData } from '../responses';

type IncomingData<T> = PaginatedData<T> | T | null;

@Injectable()
export class FormatResponseInterceptor<T> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const metadata = getResponseFormatMetadata(context, this.reflector);

    return next.handle().pipe(
      map<IncomingData<T>, unknown>((data) => {
        if (!metadata) {
          return data;
        }

        const { fieldName, responseConstructor } = metadata;

        if (!data) {
          return fieldName ? { [fieldName]: null } : null;
        }

        if (Array.isArray(data)) {
          return {
            ...data[1],
            [fieldName]: data[0].map((item) => new responseConstructor(item)),
          };
        }

        return fieldName
          ? { [fieldName]: new responseConstructor(data) }
          : new responseConstructor(data);
      }),
    );
  }
}
