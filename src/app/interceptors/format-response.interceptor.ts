import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { map } from 'rxjs';

import { type PaginatedResponse } from '~/app/utils';

type IncomingData<T> = PaginatedResponse<T> | T | null;

export class FormatResponse<T> implements NestInterceptor {
  constructor(
    private readonly responseConstructor: ClassConstructor<T>,
    private readonly fieldName?: string,
  ) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map<IncomingData<T>, any>((data) => {
        if (!data) {
          return this.fieldName ? { [this.fieldName]: null } : null;
        }

        if (Array.isArray(data)) {
          return {
            ...data[1],
            [this.fieldName]: data[0].map(
              (item) => new this.responseConstructor(item),
            ),
          };
        }

        return this.fieldName
          ? { [this.fieldName]: new this.responseConstructor(data) }
          : new this.responseConstructor(data);
      }),
    );
  }
}
