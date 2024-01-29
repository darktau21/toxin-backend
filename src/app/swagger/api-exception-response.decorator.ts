import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export const ApiExceptionResponse = (
  httpStatus: HttpStatus,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiResponse({
      ...options,
      schema: {
        properties: {
          data: {
            description: 'Ошибки',
            properties: {
              property: {
                description:
                  'Поле, которое вызвало ошибку и массив сообщений ошибок',
                items: {
                  type: 'string',
                },
                type: 'array',
              },
            },
          },
          status: {
            description: 'Статус ответа',
            enum: ['success', 'fail', 'error'],
            example: 'fail',
          },
        },
      },
      status: httpStatus,
    }),
  );
};
