import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor } from 'class-transformer';

type ResponseFormatMetadata<T> = {
  fieldName: string;
  responseConstructor: ClassConstructor<T>;
};

const FORMAT_RESPONSE_METADATA_KEY = 'meta:responseFormat';

export const FormatResponse = <T>(
  responseConstructor: ClassConstructor<T>,
  fieldName?: string,
) =>
  SetMetadata(FORMAT_RESPONSE_METADATA_KEY, { fieldName, responseConstructor });

export const getResponseFormatMetadata = (
  context: ExecutionContext,
  reflector: Reflector,
) =>
  reflector.getAllAndOverride<ResponseFormatMetadata<unknown>>(
    FORMAT_RESPONSE_METADATA_KEY,
    [context.getHandler(), context.getClass()],
  );
