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
            properties:
              httpStatus === HttpStatus.BAD_REQUEST
                ? {
                    property: {
                      description:
                        'Поле, которое вызвало ошибку/поле message и сообщение/сообщения ошибок',
                      items: {
                        type: 'string',
                      },
                      type: 'array',
                    },
                  }
                : {
                    message: {
                      description: 'Сообщение об ошибке',
                      type: 'string',
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
