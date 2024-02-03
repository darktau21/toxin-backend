import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse as _ApiOkResponse,
  ApiExtraModels,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiOkResponse = <TModel extends Type<any>>(
  model: TModel,
  fieldName?: string,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    _ApiOkResponse({
      ...options,
      schema: {
        properties: {
          data: fieldName
            ? {
                description: 'Запрошенные данные',
                properties: {
                  [fieldName]: { $ref: getSchemaPath(model) },
                },
              }
            : { $ref: getSchemaPath(model) },
          status: {
            description: 'Статус ответа',
            enum: ['success', 'fail', 'error'],
            example: 'success',
          },
        },
      },
    }),
  );
};
