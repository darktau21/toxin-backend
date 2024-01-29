import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginationInfo } from '../responses';

export const ApiOkPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  fieldName: string,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationInfo, model),
    ApiOkResponse({
      ...options,
      schema: {
        properties: {
          data: {
            allOf: [
              { $ref: getSchemaPath(PaginationInfo) },
              {
                properties: {
                  [fieldName]: {
                    items: { $ref: getSchemaPath(model) },
                    type: 'array',
                  },
                },
              },
            ],
            description: 'Запрошенные данные',
          },
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
