import { ClassSerializerInterceptor, Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { JwtAuthGuard, RoleGuard, VerifyGuard } from '~/auth/guards';

import { HttpExceptionFilter } from './filters';
import {
  FormatResponseInterceptor,
  ResponseWrapperInterceptor,
} from './interceptors';
import { AppValidationPipe, ParseQueryPipe } from './pipes';

export const guards: Provider[] = [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RoleGuard },
  { provide: APP_GUARD, useClass: VerifyGuard },
];

export const interceptors: Provider[] = [
  { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  { provide: APP_INTERCEPTOR, useClass: ResponseWrapperInterceptor },
  { provide: APP_INTERCEPTOR, useClass: FormatResponseInterceptor },
];

export const pipes: Provider[] = [
  { provide: APP_PIPE, useClass: ParseQueryPipe },
  { provide: APP_PIPE, useClass: AppValidationPipe },
];

export const filters: Provider[] = [
  { provide: APP_FILTER, useClass: HttpExceptionFilter },
];
